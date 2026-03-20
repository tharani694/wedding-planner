import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_EVENTS } from "../../graphql/queries";
import { CREATE_EVENT, DELETE_EVENT, CREATE_SUB_EVENT } from "../../graphql/mutations";
import {
  Box, Paper, Typography, Button, TextField, MenuItem, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, Chip, Grid, CircularProgress, Collapse, Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const EVENT_TYPES = ["Wedding", "Mehendi", "Haldi", "Sangeet", "Reception", "Engagement", "Pre-Wedding", "Other"];
const TYPE_COLORS = { Wedding: "#e91e63", Mehendi: "#4caf50", Haldi: "#ff9800", Sangeet: "#9c27b0", Reception: "#2196f3", Engagement: "#f44336", "Pre-Wedding": "#00bcd4", Other: "#9e9e9e" };

function EventCard({ event, onDelete, onAddSubEvent }) {
  const [expanded, setExpanded] = useState(true);
  const [subForm, setSubForm] = useState(false);
  const [subName, setSubName] = useState("");
  const [subDate, setSubDate] = useState("");

  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee", overflow: "hidden", mb: 2 }}>
      <Box sx={{ p: 2.5, display: "flex", alignItems: "center", gap: 2, bgcolor: `${TYPE_COLORS[event.type] || "#9e9e9e"}08` }}>
        <Box sx={{ bgcolor: `${TYPE_COLORS[event.type] || "#9e9e9e"}20`, p: 1.2, borderRadius: 2, color: TYPE_COLORS[event.type] || "#9e9e9e" }}>
          <EventIcon />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#1a1a2e", fontSize: 16 }}>{event.name}</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Chip label={event.type} size="small" sx={{ bgcolor: `${TYPE_COLORS[event.type] || "#9e9e9e"}20`, color: TYPE_COLORS[event.type] || "#9e9e9e", fontWeight: 600, fontSize: 11 }} />
            {event.totalBudget > 0 && <Chip label={`₹${event.totalBudget.toLocaleString()}`} size="small" sx={{ bgcolor: "#e3f2fd", color: "#1565c0", fontWeight: 600, fontSize: 11 }} />}
            <Chip label={`${event.subEvents?.length || 0} sub-events`} size="small" sx={{ bgcolor: "#f5f5f5", color: "#666", fontSize: 11 }} />
          </Box>
        </Box>
        <IconButton size="small" onClick={() => setExpanded(!expanded)}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</IconButton>
        <IconButton size="small" onClick={() => onDelete(event.id)} sx={{ color: "#ccc", "&:hover": { color: "#f44336" } }}><DeleteIcon fontSize="small" /></IconButton>
      </Box>

      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ p: 2 }}>
          {event.subEvents?.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
              {event.subEvents.map((sub) => (
                <Box key={sub.id} sx={{ display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: 2, bgcolor: "#fafafa", border: "1px solid #f0f0f0" }}>
                  <CalendarMonthIcon sx={{ color: "#e91e63", fontSize: 18 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{sub.name}</Typography>
                    {sub.date && <Typography variant="caption" sx={{ color: "text.secondary" }}>{new Date(sub.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</Typography>}
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 2, textAlign: "center", py: 1 }}>No sub-events yet</Typography>
          )}

          {subForm ? (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <TextField size="small" label="Sub-event name" value={subName} onChange={(e) => setSubName(e.target.value)} sx={{ flex: 1, minWidth: 160 }} />
              <TextField size="small" label="Date" type="date" value={subDate} onChange={(e) => setSubDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ width: 160 }} />
              <Button variant="contained" size="small" onClick={() => { onAddSubEvent(event.id, subName, subDate); setSubName(""); setSubDate(""); setSubForm(false); }}
                disabled={!subName.trim()} sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none" }}>Add</Button>
              <Button size="small" onClick={() => setSubForm(false)} sx={{ textTransform: "none" }}>Cancel</Button>
            </Box>
          ) : (
            <Button size="small" startIcon={<AddIcon />} onClick={() => setSubForm(true)}
              sx={{ textTransform: "none", color: "#e91e63", fontWeight: 600 }}>Add Sub-Event</Button>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
}

export default function EventsPage() {
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({ name: "", type: "Wedding" });

  const { data, loading } = useQuery(GET_EVENTS);
  const [createEvent] = useMutation(CREATE_EVENT, { refetchQueries: [{ query: GET_EVENTS }] });
  const [deleteEvent] = useMutation(DELETE_EVENT, { refetchQueries: [{ query: GET_EVENTS }] });
  const [createSubEvent] = useMutation(CREATE_SUB_EVENT, { refetchQueries: [{ query: GET_EVENTS }] });

  const events = data?.events || [];

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await createEvent({ variables: form });
    setForm({ name: "", type: "Wedding" });
    setDialog(false);
  };

  const handleAddSub = async (eventId, name, date) => {
    if (!name.trim()) return;
    await createSubEvent({ variables: { eventId, name, date: date || null } });
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>Events</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Manage your wedding ceremonies and sub-events</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog(true)}
          sx={{ background: "linear-gradient(135deg, #e91e63, #9c27b0)", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
          New Event
        </Button>
      </Box>

      {events.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, borderRadius: 3, border: "1px solid #eee", textAlign: "center" }}>
          <EventIcon sx={{ fontSize: 56, color: "#f5f5f5", mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#1a1a2e", mb: 1 }}>No events yet</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>Create your first event to get started</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialog(true)}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Create Event
          </Button>
        </Paper>
      ) : (
        events.map((event) => (
          <EventCard key={event.id} event={event}
            onDelete={(id) => deleteEvent({ variables: { id } })}
            onAddSubEvent={handleAddSub} />
        ))
      )}

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Create New Event</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Event Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g., Our Wedding" sx={{ mt: 1, mb: 2 }} />
          <TextField select fullWidth label="Event Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            {EVENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={!form.name.trim()}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}