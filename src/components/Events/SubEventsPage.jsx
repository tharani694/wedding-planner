import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_GUESTS, GET_VENDORS, GET_BUDGET, AI_BUDGET_ADVICE } from "../../graphql/queries";import {
  ADD_GUEST, UPDATE_GUEST, DELETE_GUEST,
  ADD_VENDOR, UPDATE_VENDOR, DELETE_VENDOR,
  ENSURE_BUDGET, ADD_BUDGET_CATEGORY, UPDATE_BUDGET_CATEGORY,
  DELETE_BUDGET_CATEGORY, UPDATE_BUDGET_TOTAL,
} from "../../graphql/mutations";
import {
  Box, Tabs, Tab, Typography, Paper, Button, TextField, MenuItem,
  IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, CircularProgress, Table, TableHead, TableRow, TableCell,
  TableBody, Avatar, Stack, LinearProgress, Select, FormControl,
  Divider, InputAdornment, Snackbar, Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

// ─── Guests Tab ──────────────────────────────────────────────────────────────
const RSVP_COLORS = {
  Attending: { bg: "#e8f5e9", color: "#2e7d32" },
  Maybe: { bg: "#fff3e0", color: "#e65100" },
  "Not Attending": { bg: "#ffebee", color: "#c62828" },
};

function GuestsTab({ subEventId }) {
  const [search, setSearch] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", rsvp: "Attending", dietary: "", tableNumber: "" });

  const vars = { variables: { subEventId } };
  const { data, loading } = useQuery(GET_GUESTS, { ...vars, fetchPolicy: "cache-and-network" });
  const [addGuest] = useMutation(ADD_GUEST, { refetchQueries: [{ query: GET_GUESTS, ...vars }] });
  const [updateGuest] = useMutation(UPDATE_GUEST, { refetchQueries: [{ query: GET_GUESTS, ...vars }] });
  const [deleteGuest] = useMutation(DELETE_GUEST, { refetchQueries: [{ query: GET_GUESTS, ...vars }] });

  const guests = data?.guests || [];
  const filtered = guests.filter(g =>
    (rsvpFilter === "All" || g.rsvp === rsvpFilter) &&
    g.name.toLowerCase().includes(search.toLowerCase())
  );
  const counts = ["Attending", "Maybe", "Not Attending"].reduce((a, k) => ({ ...a, [k]: guests.filter(g => g.rsvp === k).length }), {});

  const openAdd = () => { setForm({ name: "", phone: "", rsvp: "Attending", dietary: "", tableNumber: "" }); setAddOpen(true); };
  const openEdit = (g) => { setForm({ name: g.name, phone: g.phone || "", rsvp: g.rsvp || "Attending", dietary: g.dietary || "", tableNumber: g.tableNumber || "" }); setEditGuest(g); };
  const h = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    if (editGuest) {
      await updateGuest({ variables: { input: { id: editGuest.id, ...form } } });
      setEditGuest(null);
    } else {
      await addGuest({ variables: { subEventId, input: form } });
      setAddOpen(false);
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {["All", "Attending", "Maybe", "Not Attending"].map(v => (
            <Chip key={v} size="small" label={`${v}${v !== "All" ? ` (${counts[v]})` : ` (${guests.length})`}`}
              onClick={() => setRsvpFilter(v)} sx={{ cursor: "pointer", fontWeight: 600,
                bgcolor: rsvpFilter === v ? "#e91e63" : "white", color: rsvpFilter === v ? "white" : "text.secondary",
                border: "1px solid", borderColor: rsvpFilter === v ? "#e91e63" : "#eee" }} />
          ))}
        </Box>
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>Add Guest</Button>
      </Box>
      <TextField size="small" placeholder="Search guests..." value={search} onChange={e => setSearch(e.target.value)} sx={{ mb: 2, width: 280 }}
        InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#ccc", fontSize: 18 }} /></InputAdornment> }} />
      <Paper elevation={0} sx={{ border: "1px solid #eee", borderRadius: 3, overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>No guests yet. Add your first guest for this event.</Box>
        ) : (
          <Table size="small">
            <TableHead><TableRow sx={{ bgcolor: "#fafafa" }}>
              {["Guest", "Phone", "RSVP", "Dietary", "Table", ""].map(h => <TableCell key={h} sx={{ fontWeight: 600, fontSize: 12, color: "text.secondary" }}>{h}</TableCell>)}
            </TableRow></TableHead>
            <TableBody>
              {filtered.map(g => (
                <TableRow key={g.id} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                  <TableCell><Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar sx={{ width: 28, height: 28, bgcolor: "#fce4ec", color: "#e91e63", fontSize: 12, fontWeight: 700 }}>{g.name[0]}</Avatar>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{g.name}</Typography>
                  </Box></TableCell>
                  <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{g.phone || "—"}</Typography></TableCell>
                  <TableCell><Chip label={g.rsvp || "Attending"} size="small"
                    sx={{ bgcolor: RSVP_COLORS[g.rsvp]?.bg || "#f5f5f5", color: RSVP_COLORS[g.rsvp]?.color || "#666", fontWeight: 600, fontSize: 11 }} /></TableCell>
                  <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{g.dietary || "—"}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{g.tableNumber || "—"}</Typography></TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => openEdit(g)} sx={{ color: "#ccc", "&:hover": { color: "#e91e63" } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
                    <IconButton size="small" onClick={() => deleteGuest({ variables: { id: g.id } })} sx={{ color: "#ccc", "&:hover": { color: "#f44336" } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog open={addOpen || !!editGuest} onClose={() => { setAddOpen(false); setEditGuest(null); }} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>{editGuest ? "Edit Guest" : "Add Guest"}</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Full Name" value={form.name} onChange={h("name")} required size="small" fullWidth />
          <TextField label="Phone" value={form.phone} onChange={h("phone")} size="small" fullWidth />
          <TextField select label="RSVP" value={form.rsvp} onChange={h("rsvp")} size="small" fullWidth>
            {["Attending", "Maybe", "Not Attending"].map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
          <TextField label="Dietary Requirements" value={form.dietary} onChange={h("dietary")} size="small" fullWidth />
          <TextField label="Table Number" value={form.tableNumber} onChange={h("tableNumber")} size="small" fullWidth />
        </Stack></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => { setAddOpen(false); setEditGuest(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name.trim()}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            {editGuest ? "Save" : "Add Guest"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ─── Vendors Tab ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  lead: { label: "Lead", bg: "#e3f2fd", color: "#1565c0" },
  booked: { label: "Booked", bg: "#e8f5e9", color: "#2e7d32" },
  paid: { label: "Paid", bg: "#f3e5f5", color: "#6a1b9a" },
  cancelled: { label: "Cancelled", bg: "#ffebee", color: "#c62828" },
};

function VendorsTab({ subEventId }) {
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", categoryId: "" });
  const [snack, setSnack] = useState({ open: false, msg: "" });

  const vendorVars = { variables: { subEventId } };
  const budgetVars = { variables: { subEventId } };
  const { data, loading, refetch: refetchVendors } = useQuery(GET_VENDORS, { ...vendorVars, fetchPolicy: "cache-and-network" });
  const { data: budgetData } = useQuery(GET_BUDGET, budgetVars);
  const [addVendor] = useMutation(ADD_VENDOR, { refetchQueries: [{ query: GET_VENDORS, ...vendorVars }] });
  const [updateVendor] = useMutation(UPDATE_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS, ...vendorVars }, { query: GET_BUDGET, ...budgetVars }]
  });
  const [deleteVendor] = useMutation(DELETE_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS, ...vendorVars }, { query: GET_BUDGET, ...budgetVars }]
  });

  const vendors = data?.vendors || [];
  const categories = budgetData?.budget?.categories || [];

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await addVendor({ variables: { subEventId, input: { name: form.name, price: form.price ? parseInt(form.price) : null, categoryId: form.categoryId || null } } });
    setForm({ name: "", price: "", categoryId: "" });
    setAddOpen(false);
  };

  const handleStatusChange = async (vendor, status) => {
    await updateVendor({ variables: { input: { id: vendor.id, status } } });
    if (["booked", "paid"].includes(status) && !vendor.categoryId) {
      setSnack({ open: true, msg: "Tip: assign a budget category to this vendor to track spending automatically." });
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}
          sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>Add Vendor</Button>
      </Box>
      {vendors.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px dashed #eee", borderRadius: 3, color: "text.secondary" }}>
          No vendors for this event yet.
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {vendors.map(v => (
            <Grid item xs={12} sm={6} md={4} key={v.id}>
              <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #eee", "&:hover": { borderColor: "#e91e63" }, transition: "border-color .2s" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                  <Avatar sx={{ bgcolor: "#fce4ec", color: "#e91e63", fontWeight: 700, width: 40, height: 40, fontSize: 16 }}>{v.name[0]}</Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{v.name}</Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 0.5, mb: 1.5, flexWrap: "wrap" }}>
                      {v.price > 0 && <Chip label={`₹${Number(v.price).toLocaleString()}`} size="small" sx={{ bgcolor: "#f5f5f5", fontSize: 11 }} />}
                      {v.categoryId && categories.find(c => c.id === v.categoryId) && (
                        <Chip label={categories.find(c => c.id === v.categoryId).name} size="small" sx={{ bgcolor: "#f5f5f5", fontSize: 11 }} />
                      )}
                      {!v.categoryId && <Chip label="No category" size="small" sx={{ bgcolor: "#fff8e1", color: "#f57f17", fontSize: 11 }} />}
                    </Box>
                    <Select size="small" value={v.status || "lead"} onChange={e => handleStatusChange(v, e.target.value)}
                      sx={{ borderRadius: 2, bgcolor: STATUS_CONFIG[v.status]?.bg, color: STATUS_CONFIG[v.status]?.color, fontWeight: 600, fontSize: 12, height: 30,
                        "& .MuiOutlinedInput-notchedOutline": { borderColor: "transparent" } }}>
                      {Object.entries(STATUS_CONFIG).map(([val, cfg]) => <MenuItem key={val} value={val} sx={{ fontSize: 13 }}>{cfg.label}</MenuItem>)}
                    </Select>
                  </Box>
                  <IconButton size="small" onClick={() => deleteVendor({ variables: { id: v.id } })} sx={{ color: "#ccc", "&:hover": { color: "#f44336" }, mt: -0.5 }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Vendor</DialogTitle>
        <DialogContent><Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Vendor Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} size="small" fullWidth required />
          <TextField label="Price (₹)" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} size="small" fullWidth />
          {categories.length > 0 && (
            <TextField select label="Budget Category" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} size="small" fullWidth>
              <MenuItem value="">None</MenuItem>
              {categories.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
            </TextField>
          )}
        </Stack></DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.name.trim()}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>Add</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={5000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}

// ─── Budget Tab ───────────────────────────────────────────────────────────────
function BudgetTab({ subEventId }) {
  const [addForm, setAddForm] = useState({ name: "", allocated: "" });
  const [editCat, setEditCat] = useState(null);
  const [totalInput, setTotalInput] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiOpen, setAiOpen] = useState(false);

  const vars = { variables: { subEventId } };
  const { data, loading } = useQuery(GET_BUDGET, vars);
  const [ensureBudget] = useMutation(ENSURE_BUDGET);
  const [addCat] = useMutation(ADD_BUDGET_CATEGORY, { refetchQueries: [{ query: GET_BUDGET, ...vars }] });
  const [updateCat] = useMutation(UPDATE_BUDGET_CATEGORY, { refetchQueries: [{ query: GET_BUDGET, ...vars }] });
  const [deleteCat] = useMutation(DELETE_BUDGET_CATEGORY, { refetchQueries: [{ query: GET_BUDGET, ...vars }] });
  const [updateTotal] = useMutation(UPDATE_BUDGET_TOTAL, { refetchQueries: [{ query: GET_BUDGET, ...vars }] });
  const [getAiAdvice, { loading: aiLoading }] = useLazyQuery(AI_BUDGET_ADVICE, { fetchPolicy: "no-cache" });

  const budget = data?.budget;
  const cats = budget?.categories || [];
  const totalAllocated = cats.reduce((s, c) => s + (c.allocated || 0), 0);
  const totalSpent = cats.reduce((s, c) => s + (c.spent || 0), 0);

  const getBudgetId = async () => {
    if (budget?.id) return budget.id;
    const { data: d } = await ensureBudget({ variables: { subEventId } });
    return d.ensureBudget.id;
  };

  const handleAdd = async e => {
    e.preventDefault();
    if (!addForm.name.trim()) return;
    const budgetId = await getBudgetId();
    await addCat({ variables: { budgetId, name: addForm.name, allocated: parseInt(addForm.allocated) || 0 } });
    setAddForm({ name: "", allocated: "" });
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      {/* Total bar */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #eee", mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={5}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>Budget for this event</Typography>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>₹{(budget?.total || 0).toLocaleString()}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              ₹{totalSpent.toLocaleString()} spent · ₹{totalAllocated.toLocaleString()} allocated
            </Typography>
          </Grid>
          <Grid item xs={12} sm={7}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField size="small" type="number" placeholder="Set total budget" value={totalInput}
                onChange={e => setTotalInput(e.target.value)} sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              <Button variant="contained" onClick={() => { updateTotal({ variables: { total: parseInt(totalInput) || 0, subEventId } }); setTotalInput(""); }}
                sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", whiteSpace: "nowrap" }}>Set</Button>
            </Box>
          </Grid>
        </Grid>
        {totalAllocated > 0 && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="determinate" value={Math.min(100, (totalSpent / totalAllocated) * 100)}
              sx={{ height: 8, borderRadius: 4, bgcolor: "#f5f5f5", "& .MuiLinearProgress-bar": { bgcolor: totalSpent > totalAllocated ? "#f44336" : "#e91e63", borderRadius: 4 } }} />
          </Box>
        )}
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #eee" }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>Add Category</Typography>
            <form onSubmit={handleAdd}>
              <TextField fullWidth label="Name" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} size="small" sx={{ mb: 2 }} required />
              <TextField fullWidth label="Allocated (₹)" type="number" value={addForm.allocated} onChange={e => setAddForm({ ...addForm, allocated: e.target.value })} size="small" sx={{ mb: 2 }} />
              <Button type="submit" fullWidth variant="contained" startIcon={<AddIcon />}
                sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>Add Category</Button>
            </form>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid #eee" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>Categories ({cats.length})</Typography>
              <Button size="small" startIcon={<AutoAwesomeIcon />} onClick={async () => { const { data } = await getAiAdvice(); setAiAdvice(data?.aiBudgetAdvice || ""); setAiOpen(true); }}
                disabled={aiLoading} sx={{ textTransform: "none", color: "#9c27b0", borderColor: "#9c27b0", fontWeight: 600 }} variant="outlined">
                AI Advice
              </Button>
            </Box>
            {cats.length === 0 ? (
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center", py: 3 }}>No categories yet.</Typography>
            ) : cats.map(cat => {
              const pct = cat.allocated > 0 ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
              const over = cat.spent > cat.allocated;
              return (
                <Box key={cat.id} sx={{ mb: 2, p: 2, borderRadius: 2, border: "1px solid #f0f0f0" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{cat.name}</Typography>
                    <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                      <Typography variant="body2" sx={{ color: over ? "#f44336" : "text.secondary" }}>
                        ₹{cat.spent.toLocaleString()} / ₹{cat.allocated.toLocaleString()}
                      </Typography>
                      <IconButton size="small" onClick={() => setEditCat({ ...cat })} sx={{ color: "#ccc", "&:hover": { color: "#e91e63" } }}><EditIcon sx={{ fontSize: 15 }} /></IconButton>
                      <IconButton size="small" onClick={() => deleteCat({ variables: { id: cat.id } })} sx={{ color: "#ccc", "&:hover": { color: "#f44336" } }}><DeleteIcon sx={{ fontSize: 15 }} /></IconButton>
                    </Box>
                  </Box>
                  <LinearProgress variant="determinate" value={pct}
                    sx={{ height: 6, borderRadius: 3, bgcolor: "#f5f5f5", "& .MuiLinearProgress-bar": { bgcolor: over ? "#f44336" : "#e91e63", borderRadius: 3 } }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>{pct}% used</Typography>
                    <Typography variant="caption" sx={{ color: over ? "#f44336" : "text.secondary" }}>
                      {over ? `₹${(cat.spent - cat.allocated).toLocaleString()} over` : `₹${(cat.allocated - cat.spent).toLocaleString()} left`}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit category dialog */}
      <Dialog open={!!editCat} onClose={() => setEditCat(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Category</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={editCat?.name || ""} onChange={e => setEditCat({ ...editCat, name: e.target.value })} sx={{ mt: 1, mb: 2 }} size="small" />
          <TextField fullWidth label="Allocated (₹)" type="number" value={editCat?.allocated || ""} onChange={e => setEditCat({ ...editCat, allocated: e.target.value })} size="small" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditCat(null)}>Cancel</Button>
          <Button variant="contained" onClick={async () => { await updateCat({ variables: { input: { id: editCat.id, name: editCat.name, allocated: parseInt(editCat.allocated) || 0 } } }); setEditCat(null); }}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none" }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* AI advice dialog */}
      <Dialog open={aiOpen} onClose={() => setAiOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}><AutoAwesomeIcon sx={{ color: "#e91e63" }} /> AI Budget Advice</DialogTitle>
        <DialogContent><Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}>{aiAdvice}</Typography></DialogContent>
        <DialogActions sx={{ p: 2 }}><Button variant="contained" onClick={() => setAiOpen(false)} sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none" }}>Got it</Button></DialogActions>
      </Dialog>
    </Box>
  );
}

export default function SubEventsPage() {
  const { eventId, subEventId, subEventName } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  // Decode the name from URL param
  const name = subEventName ? decodeURIComponent(subEventName) : "Sub-Event";

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate("/events")} sx={{ color: "#e91e63", border: "1px solid #fce4ec", borderRadius: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>{name}</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>Manage guests, vendors and budget for this event</Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee", overflow: "hidden" }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}
          sx={{ borderBottom: "1px solid #f0f0f0", "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: 14 },
            "& .Mui-selected": { color: "#e91e63" }, "& .MuiTabs-indicator": { bgcolor: "#e91e63" } }}>
          <Tab label="Guests" />
          <Tab label="Vendors" />
          <Tab label="Budget" />
        </Tabs>
        <Box sx={{ p: 3 }}>
          {tab === 0 && <GuestsTab subEventId={subEventId} />}
          {tab === 1 && <VendorsTab subEventId={subEventId} />}
          {tab === 2 && <BudgetTab subEventId={subEventId} />}
        </Box>
      </Paper>
    </Box>
  );
}