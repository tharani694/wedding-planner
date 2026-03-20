import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_GUESTS } from "../../graphql/queries";
import { ADD_GUEST, UPDATE_GUEST, DELETE_GUEST } from "../../graphql/mutations";
import {
  Box, Paper, Typography, TextField, Button, MenuItem, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, CircularProgress,
  Pagination, InputAdornment, Avatar, Stack, Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";

const RSVP_COLORS = { Attending: { bg: "#e8f5e9", color: "#2e7d32" }, Maybe: { bg: "#fff3e0", color: "#e65100" }, "Not Attending": { bg: "#ffebee", color: "#c62828" } };

function GuestDialog({ open, onClose, onSave, initial }) {
  const [form, setForm] = useState({ name: "", phone: "", rsvp: "Attending", dietary: "", tableNumber: "" });
  useEffect(() => { if (initial) setForm(initial); else setForm({ name: "", phone: "", rsvp: "Attending", dietary: "", tableNumber: "" }); }, [initial, open]);
  const h = (f) => (e) => setForm((prev) => ({ ...prev, [f]: e.target.value }));
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>{initial ? "Edit Guest" : "Add Guest"}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Full Name" value={form.name} onChange={h("name")} required size="small" fullWidth />
          <TextField label="Phone" value={form.phone} onChange={h("phone")} size="small" fullWidth />
          <TextField select label="RSVP Status" value={form.rsvp} onChange={h("rsvp")} size="small" fullWidth>
            {["Attending", "Maybe", "Not Attending"].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
          <TextField label="Dietary Requirements" value={form.dietary} onChange={h("dietary")} size="small" fullWidth placeholder="e.g. Vegetarian, Vegan" />
          <TextField label="Table Number" value={form.tableNumber} onChange={h("tableNumber")} size="small" fullWidth />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onSave(form)} disabled={!form.name.trim()}
          sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
          {initial ? "Save Changes" : "Add Guest"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function GuestPage() {
  const [search, setSearch] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [addDialog, setAddDialog] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const PER_PAGE = 10;

  const { data, loading } = useQuery(GET_GUESTS, { variables: {} });
  const [addGuest] = useMutation(ADD_GUEST, { refetchQueries: [{ query: GET_GUESTS, variables: {} }] });
  const [updateGuest] = useMutation(UPDATE_GUEST, { refetchQueries: [{ query: GET_GUESTS, variables: {} }] });
  const [deleteGuest] = useMutation(DELETE_GUEST, { refetchQueries: [{ query: GET_GUESTS, variables: {} }] });

  const guests = data?.guests || [];
  const filtered = guests.filter((g) => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || (g.phone || "").includes(search);
    const matchRsvp = rsvpFilter === "All" || g.rsvp === rsvpFilter;
    return matchSearch && matchRsvp;
  });

  useEffect(() => { setPage(1); }, [search, rsvpFilter]);

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const counts = { Attending: guests.filter(g => g.rsvp === "Attending").length, Maybe: guests.filter(g => g.rsvp === "Maybe").length, "Not Attending": guests.filter(g => g.rsvp === "Not Attending").length };

  const handleAdd = async (form) => {
    await addGuest({ variables: { input: form } });
    setAddDialog(false);
  };
  const handleEdit = async (form) => {
    await updateGuest({ variables: { input: { id: editGuest.id, ...form } } });
    setEditGuest(null);
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>Guests</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>{guests.length} total guests</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddDialog(true)}
          sx={{ background: "linear-gradient(135deg, #e91e63, #9c27b0)", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
          Add Guest
        </Button>
      </Box>

      {/* RSVP Summary chips */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
        {[["All", guests.length, "#9e9e9e"], ["Attending", counts.Attending, "#4caf50"], ["Maybe", counts.Maybe, "#ff9800"], ["Not Attending", counts["Not Attending"], "#f44336"]].map(([label, count, color]) => (
          <Chip key={label} label={`${label} (${count})`} onClick={() => setRsvpFilter(label)}
            sx={{ cursor: "pointer", fontWeight: 600, bgcolor: rsvpFilter === label ? `${color}20` : "white",
              border: "1px solid", borderColor: rsvpFilter === label ? color : "#eee", color: rsvpFilter === label ? color : "text.secondary" }} />
        ))}
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee", overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #f5f5f5" }}>
          <TextField size="small" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#ccc", fontSize: 20 }} /></InputAdornment> }}
            sx={{ width: 320, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
        </Box>

        {filtered.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <PeopleIcon sx={{ fontSize: 48, color: "#f5f5f5", mb: 1.5 }} />
            <Typography sx={{ color: "text.secondary" }}>{search || rsvpFilter !== "All" ? "No guests found" : "No guests yet. Add your first guest!"}</Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead><TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: 12 }}>GUEST</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: 12 }}>PHONE</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: 12 }}>RSVP</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: 12 }}>DIETARY</TableCell>
                <TableCell sx={{ fontWeight: 600, color: "text.secondary", fontSize: 12 }}>TABLE</TableCell>
                <TableCell align="right" sx={{ fontWeight: 600, color: "text.secondary", fontSize: 12 }}>ACTIONS</TableCell>
              </TableRow></TableHead>
              <TableBody>
                {paginated.map((g) => (
                  <TableRow key={g.id} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#fce4ec", color: "#e91e63", fontSize: 13, fontWeight: 700 }}>
                          {g.name[0].toUpperCase()}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{g.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{g.phone || "—"}</Typography></TableCell>
                    <TableCell>
                      <Chip label={g.rsvp || "Attending"} size="small"
                        sx={{ bgcolor: RSVP_COLORS[g.rsvp]?.bg || "#f5f5f5", color: RSVP_COLORS[g.rsvp]?.color || "#666", fontWeight: 600, fontSize: 11 }} />
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{g.dietary || "—"}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{g.tableNumber || "—"}</Typography></TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setEditGuest(g)} sx={{ color: "#ccc", "&:hover": { color: "#e91e63" } }}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => deleteGuest({ variables: { id: g.id } })} sx={{ color: "#ccc", "&:hover": { color: "#f44336" } }}><DeleteIcon fontSize="small" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {filtered.length > PER_PAGE && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 2, borderTop: "1px solid #f5f5f5" }}>
            <Pagination count={Math.ceil(filtered.length / PER_PAGE)} page={page} onChange={(_, v) => setPage(v)} sx={{ "& .MuiPaginationItem-root.Mui-selected": { bgcolor: "#e91e63", color: "white" } }} />
          </Box>
        )}
      </Paper>

      <GuestDialog open={addDialog} onClose={() => setAddDialog(false)} onSave={handleAdd} />
      <GuestDialog open={!!editGuest} onClose={() => setEditGuest(null)} onSave={handleEdit} initial={editGuest} />
    </Box>
  );
}