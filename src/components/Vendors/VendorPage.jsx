import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VENDORS, GET_BUDGET, GET_EVENTS } from "../../graphql/queries";
import { ADD_VENDOR, UPDATE_VENDOR, DELETE_VENDOR } from "../../graphql/mutations";
import {
  Box, Paper, Typography, TextField, Button, MenuItem, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Grid, CircularProgress,
  Stack, Select, FormControl, Avatar,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import BusinessIcon from "@mui/icons-material/Business";

const STATUS_CONFIG = {
  lead:      { label: "Lead",      bg: "#e3f2fd", color: "#1565c0" },
  booked:    { label: "Booked",    bg: "#e8f5e9", color: "#2e7d32" },
  paid:      { label: "Paid",      bg: "#f3e5f5", color: "#6a1b9a" },
  cancelled: { label: "Cancelled", bg: "#ffebee", color: "#c62828" },
};

function buildSubEventMap(events) {
  const map = {};
  for (const ev of events || []) {
    for (const sub of ev.subEvents || []) {
      map[sub.id] = { name: sub.name, eventName: ev.name };
    }
  }
  return map;
}

function VendorCard({ vendor, categories, subEventMap, onUpdate, onDelete }) {
  const subInfo = vendor.subEventId ? subEventMap[vendor.subEventId] : null;
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #eee",
      "&:hover": { borderColor: "#e91e63", boxShadow: "0 4px 12px rgba(233,30,99,0.08)" }, transition: "all 0.2s" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
        <Avatar sx={{ bgcolor: "#fce4ec", color: "#e91e63", fontWeight: 700, width: 44, height: 44 }}>
          {vendor.name[0].toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="body1" sx={{ fontWeight: 700, mb: 0.5 }}>{vendor.name}</Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap", alignItems: "center" }}>
            {vendor.price > 0 && (
              <Chip label={`₹${Number(vendor.price).toLocaleString()}`} size="small" sx={{ bgcolor: "#f5f5f5", fontWeight: 600, fontSize: 11 }} />
            )}
            {vendor.categoryId && categories.find(c => c.id === vendor.categoryId) && (
              <Chip label={categories.find(c => c.id === vendor.categoryId).name} size="small" sx={{ bgcolor: "#f5f5f5", fontSize: 11 }} />
            )}
            {/* Sub-event tag */}
            {subInfo ? (
              <Chip icon={<EventIcon sx={{ fontSize: "12px !important" }} />}
                label={`${subInfo.name} · ${subInfo.eventName}`} size="small"
                sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600, fontSize: 11 }} />
            ) : (
              <Chip label="No sub-event" size="small" sx={{ bgcolor: "#fff8e1", color: "#f57f17", fontSize: 11 }} />
            )}
          </Box>
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select value={vendor.status || "lead"} onChange={e => onUpdate(vendor.id, e.target.value)}
              sx={{ borderRadius: 2, bgcolor: STATUS_CONFIG[vendor.status]?.bg, color: STATUS_CONFIG[vendor.status]?.color,
                fontWeight: 600, fontSize: 12,
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" },
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" } }}>
              {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                <MenuItem key={val} value={val} sx={{ fontSize: 13 }}>{cfg.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <IconButton size="small" onClick={() => onDelete(vendor.id)}
          sx={{ color: "#ccc", "&:hover": { color: "#f44336" }, mt: -0.5 }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Paper>
  );
}

export default function VendorPage() {
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", categoryId: "", subEventId: "" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [subEventFilter, setSubEventFilter] = useState("all");

  const { data: budgetData } = useQuery(GET_BUDGET, { variables: {} });
  const { data: eventsData } = useQuery(GET_EVENTS);
  const { data, loading } = useQuery(GET_VENDORS, { variables: {} });
  const [addVendor] = useMutation(ADD_VENDOR, { refetchQueries: [{ query: GET_VENDORS, variables: {} }] });
  const [updateVendor] = useMutation(UPDATE_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS, variables: {} }, { query: GET_BUDGET, variables: {} }]
  });
  const [deleteVendor] = useMutation(DELETE_VENDOR, { refetchQueries: [{ query: GET_VENDORS, variables: {} }] });

  const vendors = data?.vendors || [];
  const categories = budgetData?.budget?.categories || [];
  const subEventMap = buildSubEventMap(eventsData?.events);
  const subEventList = Object.entries(subEventMap).map(([id, v]) => ({ id, ...v }));

  const filtered = vendors.filter(v => {
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    const matchSub = subEventFilter === "all" || v.subEventId === subEventFilter || (!v.subEventId && subEventFilter === "none");
    return matchStatus && matchSub;
  });

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await addVendor({
      variables: {
        subEventId: form.subEventId || null,
        input: {
          name: form.name,
          price: form.price ? parseInt(form.price) : null,
          categoryId: form.categoryId || null,
        },
      },
    });
    setForm({ name: "", price: "", categoryId: "", subEventId: "" });
    setDialog(false);
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>All Vendors</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            {vendors.filter(v => ["booked","paid"].includes(v.status)).length} booked · {vendors.length} total across all events
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog(true)}
          sx={{ background: "linear-gradient(135deg, #e91e63, #9c27b0)", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
          Add Vendor
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {/* Status filter */}
        {[["all", "All"], ...Object.entries(STATUS_CONFIG).map(([v, c]) => [v, c.label])].map(([val, label]) => (
          <Chip key={val} label={`${label}${val !== "all" ? ` (${vendors.filter(v => v.status === val).length})` : ` (${vendors.length})`}`}
            onClick={() => setStatusFilter(val)}
            sx={{ cursor: "pointer", fontWeight: 600, fontSize: 12,
              bgcolor: statusFilter === val ? "#e91e63" : "white",
              color: statusFilter === val ? "white" : "text.secondary",
              border: "1px solid", borderColor: statusFilter === val ? "#e91e63" : "#eee" }} />
        ))}
      </Box>

      {/* Sub-event filter */}
      {subEventList.length > 0 && (
        <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
          <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600, mr: 0.5 }}>Sub-event:</Typography>
          {[{ id: "all", name: "All" }, { id: "none", name: "No sub-event" }, ...subEventList].map(s => (
            <Chip key={s.id} size="small" label={s.name}
              onClick={() => setSubEventFilter(s.id)}
              sx={{ cursor: "pointer", fontWeight: 600, fontSize: 11,
                bgcolor: subEventFilter === s.id ? "#1a1a2e" : "white",
                color: subEventFilter === s.id ? "white" : "text.secondary",
                border: "1px solid", borderColor: subEventFilter === s.id ? "#1a1a2e" : "#eee" }} />
          ))}
        </Box>
      )}

      {filtered.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: "1px solid #eee", textAlign: "center" }}>
          <BusinessIcon sx={{ fontSize: 48, color: "#f5f5f5", mb: 1.5 }} />
          <Typography sx={{ color: "text.secondary" }}>No vendors found. Add vendors from the Marketplace or manually.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filtered.map(v => (
            <Grid item xs={12} sm={6} md={4} key={v.id}>
              <VendorCard vendor={v} categories={categories} subEventMap={subEventMap}
                onUpdate={(id, status) => updateVendor({ variables: { input: { id, status } } })}
                onDelete={id => deleteVendor({ variables: { id } })} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Vendor</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Vendor Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} size="small" fullWidth required />
            <TextField label="Price (₹)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} size="small" fullWidth />
            {subEventList.length > 0 && (
              <TextField select label="Sub-Event" value={form.subEventId} onChange={e => setForm({ ...form, subEventId: e.target.value })} size="small" fullWidth>
                <MenuItem value="">None (global)</MenuItem>
                {subEventList.map(s => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} · <span style={{ color: "#888", fontSize: 12 }}>{s.eventName}</span>
                  </MenuItem>
                ))}
              </TextField>
            )}
            {categories.length > 0 && (
              <TextField select label="Budget Category" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} size="small" fullWidth>
                <MenuItem value="">None</MenuItem>
                {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.name.trim()}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}