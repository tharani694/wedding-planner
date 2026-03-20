import { useState, useMemo } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import { GET_VENDOR_PROFILES, GET_VENDORS, GET_EVENTS } from "../../graphql/queries";
import { ADD_VENDOR_FROM_PROFILE } from "../../graphql/mutations";
import {
  Box, Paper, Typography, TextField, Grid, Chip, Button, Rating,
  InputAdornment, CircularProgress, Snackbar, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions,
  MenuItem, Select, FormControl, InputLabel, Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckIcon from "@mui/icons-material/Check";
import EventIcon from "@mui/icons-material/Event";

const CAT_COLORS = {
  Photography: "#9c27b0", Catering: "#ff9800", Decor: "#4caf50",
  Entertainment: "#2196f3", Beauty: "#e91e63", Videography: "#3f51b5",
};

// subEvent name lookup: { [subEventId]: "Ceremony · Wedding" }
function buildSubEventMap(events) {
  const map = {};
  for (const ev of events || []) {
    for (const sub of ev.subEvents || []) {
      map[sub.id] = { name: sub.name, eventName: ev.name };
    }
  }
  return map;
}

// All sub-events flat list for the picker
function buildSubEventList(events) {
  const list = [];
  for (const ev of events || []) {
    for (const sub of ev.subEvents || []) {
      list.push({ id: sub.id, label: `${sub.name}`, eventName: ev.name });
    }
  }
  return list;
}

export default function VendorProfilesPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  // Sub-event picker dialog state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pendingProfile, setPendingProfile] = useState(null); // { id, name }
  const [selectedSubEvent, setSelectedSubEvent] = useState("");

  const apolloClient = useApolloClient();
  const { data: profileData, loading } = useQuery(GET_VENDOR_PROFILES);
  const { data: eventsData } = useQuery(GET_EVENTS);
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: {} });

  const [addVendorFromProfile] = useMutation(ADD_VENDOR_FROM_PROFILE);

  const profiles = profileData?.vendorProfiles || [];
  const subEventList = buildSubEventList(eventsData?.events);
  const subEventMap = buildSubEventMap(eventsData?.events);

  // Track which profileId has already been added to which subEventId
  const addedKey = (profileId, subEventId) => `${profileId}::${subEventId}`;
  const addedSet = useMemo(() => {
    const vendors = vendorData?.vendors || [];
    const set = new Set();
    for (const v of vendors) {
      // Match by name back to profile
      const profile = profiles.find(p => p.name === v.name);
      if (profile && v.subEventId) set.add(addedKey(profile.id, v.subEventId));
    }
    return set;
  }, [vendorData, profiles]);

  const categories = ["All", ...new Set(profiles.map(p => p.categoryName))];

  const visible = useMemo(() => profiles.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || p.categoryName === catFilter;
    return matchSearch && matchCat;
  }), [profiles, search, catFilter]);

  const openPicker = (profile) => {
    if (subEventList.length === 0) {
      setSnack({ open: true, msg: "Create an event with sub-events first before adding vendors.", severity: "warning" });
      return;
    }
    setPendingProfile(profile);
    setSelectedSubEvent(subEventList[0]?.id || "");
    setPickerOpen(true);
  };

  const handleConfirmAdd = async () => {
    if (!pendingProfile || !selectedSubEvent) return;
    try {
      await addVendorFromProfile({
        variables: { profileId: pendingProfile.id, subEventId: selectedSubEvent },
      });
      // Refetch every active query in the app — catches SubEventPage's scoped
      // GET_VENDORS({ subEventId }) regardless of cache state
      await apolloClient.refetchQueries({ include: "active" });
      const sub = subEventMap[selectedSubEvent];
      setSnack({ open: true, msg: `${pendingProfile.name} added to "${sub?.name}"!`, severity: "success" });
      setPickerOpen(false);
      setPendingProfile(null);
    } catch (err) {
      setSnack({ open: true, msg: err.message || "Failed to add vendor", severity: "error" });
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>Vendor Marketplace</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
          Browse vendors and add them directly to a sub-event
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField size="small" placeholder="Search vendors..." value={search} onChange={e => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#ccc", fontSize: 20 }} /></InputAdornment> }}
          sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {categories.map(c => (
            <Chip key={c} label={c} onClick={() => setCatFilter(c)} sx={{ cursor: "pointer", fontWeight: 600,
              bgcolor: catFilter === c ? "#e91e63" : "white", color: catFilter === c ? "white" : "text.secondary",
              border: "1px solid", borderColor: catFilter === c ? "#e91e63" : "#eee" }} />
          ))}
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {visible.map(p => {
          // Count how many sub-events this profile has been added to
          const addedToSubs = subEventList.filter(s => addedSet.has(addedKey(p.id, s.id)));
          return (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", height: "100%",
                display: "flex", flexDirection: "column",
                "&:hover": { borderColor: "#e91e63", boxShadow: "0 4px 20px rgba(233,30,99,0.1)" }, transition: "all 0.2s" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Chip label={p.categoryName} size="small"
                    sx={{ bgcolor: `${CAT_COLORS[p.categoryName] || "#9e9e9e"}20`, color: CAT_COLORS[p.categoryName] || "#9e9e9e", fontWeight: 600, fontSize: 11 }} />
                  <Rating value={p.rating} precision={0.1} readOnly size="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: 15 }}>{p.name}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", flex: 1, mb: 2, lineHeight: 1.6, fontSize: 13 }}>{p.description}</Typography>
                <Box sx={{ display: "flex", gap: 0.5, mb: 2, flexWrap: "wrap" }}>
                  {p.tags.map(t => <Chip key={t} label={t} size="small" sx={{ fontSize: 10, height: 20, bgcolor: "#f5f5f5" }} />)}
                </Box>

                {/* Sub-event tags for already-added instances */}
                {addedToSubs.length > 0 && (
                  <Box sx={{ mb: 1.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {addedToSubs.map(s => (
                      <Chip key={s.id} size="small" icon={<EventIcon sx={{ fontSize: "12px !important" }} />}
                        label={s.label} sx={{ fontSize: 10, height: 20, bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }} />
                    ))}
                  </Box>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#e91e63", fontSize: 16 }}>
                    ₹{Number(p.price).toLocaleString()}
                  </Typography>
                  <Button size="small" variant="contained" startIcon={<AddShoppingCartIcon />}
                    onClick={() => openPicker(p)}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, fontSize: 12,
                      bgcolor: "#e91e63", "&:hover": { bgcolor: "#d81b60" } }}>
                    Add to Event
                  </Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Sub-event picker dialog */}
      <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Add to Sub-Event</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
            Choose which sub-event to add <strong>{pendingProfile?.name}</strong> to:
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Sub-Event</InputLabel>
            <Select value={selectedSubEvent} label="Sub-Event" onChange={e => setSelectedSubEvent(e.target.value)}>
              {subEventList.length === 0 ? (
                <MenuItem disabled value="">No sub-events found — create one first</MenuItem>
              ) : subEventList.map(s => (
                <MenuItem key={s.id} value={s.id}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{s.label}</Typography>
                    <Typography variant="caption" sx={{ color: "text.secondary" }}>{s.eventName}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setPickerOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmAdd} disabled={!selectedSubEvent}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Add Vendor
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}