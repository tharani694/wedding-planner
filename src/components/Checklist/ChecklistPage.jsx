import { useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_CHECKLIST, AI_GENERATE_CHECKLIST } from "../../graphql/queries";
import { ADD_CHECKLIST_ITEM, TOGGLE_CHECKLIST_ITEM, DELETE_CHECKLIST_ITEM, BULK_ADD_CHECKLIST } from "../../graphql/mutations";
import {
  Box, Paper, Typography, TextField, Button, IconButton, Chip, CircularProgress,
  LinearProgress, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, ListItemIcon, Checkbox, Divider, Alert, Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CATEGORIES = ["All", "Venue", "Catering", "Photography", "Attire", "Invitations", "Decorations", "Entertainment", "Travel", "Beauty", "Legal", "General"];
const CAT_COLORS = { Venue: "#e91e63", Catering: "#ff9800", Photography: "#9c27b0", Attire: "#3f51b5", Invitations: "#2196f3", Decorations: "#00bcd4", Entertainment: "#4caf50", Travel: "#ff5722", Beauty: "#e91e63", Legal: "#607d8b", General: "#9e9e9e" };

export default function ChecklistPage() {
  const [filter, setFilter] = useState("All");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [aiDialog, setAiDialog] = useState(false);
  const [aiItems, setAiItems] = useState([]);
  const [selectedAiItems, setSelectedAiItems] = useState([]);

  const { data, loading } = useQuery(GET_CHECKLIST);
  const [addItem, { loading: adding }] = useMutation(ADD_CHECKLIST_ITEM, { refetchQueries: [{ query: GET_CHECKLIST }] });
  const [toggleItem] = useMutation(TOGGLE_CHECKLIST_ITEM, { refetchQueries: [{ query: GET_CHECKLIST }] });
  const [deleteItem] = useMutation(DELETE_CHECKLIST_ITEM, { refetchQueries: [{ query: GET_CHECKLIST }] });
  const [bulkAdd, { loading: bulkLoading }] = useMutation(BULK_ADD_CHECKLIST, { refetchQueries: [{ query: GET_CHECKLIST }] });
  const [generateChecklist, { loading: aiLoading }] = useLazyQuery(AI_GENERATE_CHECKLIST, { fetchPolicy: "no-cache" });

  const items = data?.checklistItems || [];
  const filtered = filter === "All" ? items : items.filter((i) => i.category === filter);
  const done = items.filter((i) => i.completed).length;
  const pct = items.length > 0 ? Math.round((done / items.length) * 100) : 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addItem({ variables: { title, category, dueDate: dueDate || null } });
    setTitle(""); setDueDate("");
  };

  const handleGenerate = async () => {
    const { data } = await generateChecklist();
    const suggestions = data?.aiGenerateChecklist || [];
    setAiItems(suggestions);
    setSelectedAiItems(suggestions.map((_, i) => i));
    setAiDialog(true);
  };

  const handleImport = async () => {
    const toAdd = selectedAiItems.map((i) => aiItems[i]);
    await bulkAdd({ variables: { items: toAdd } });
    setAiDialog(false);
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>Wedding Checklist</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>{done} of {items.length} tasks complete</Typography>
        </Box>
        <Button variant="contained" startIcon={aiLoading ? <CircularProgress size={16} sx={{ color: "white" }} /> : <AutoAwesomeIcon />}
          onClick={handleGenerate} disabled={aiLoading}
          sx={{ background: "linear-gradient(135deg, #e91e63, #9c27b0)", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
          {aiLoading ? "Generating..." : "AI Generate"}
        </Button>
      </Box>

      {/* Progress */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", mb: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Overall Progress</Typography>
          <Typography variant="body2" sx={{ color: "#e91e63", fontWeight: 700 }}>{pct}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={pct}
          sx={{ height: 10, borderRadius: 5, bgcolor: "#f5f5f5", "& .MuiLinearProgress-bar": { bgcolor: "#e91e63", borderRadius: 5 } }} />
      </Paper>

      <Box sx={{ display: "flex", gap: 3, flexDirection: { xs: "column", md: "row" } }}>
        {/* Add form */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", width: { md: 300 }, flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Add Task</Typography>
          <form onSubmit={handleAdd}>
            <TextField fullWidth label="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required size="small" sx={{ mb: 2 }} />
            <TextField select fullWidth label="Category" value={category} onChange={(e) => setCategory(e.target.value)} size="small" sx={{ mb: 2 }}>
              {CATEGORIES.filter(c => c !== "All").map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField fullWidth label="Due Date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              InputLabelProps={{ shrink: true }} size="small" sx={{ mb: 2 }} />
            <Button type="submit" fullWidth variant="contained" disabled={adding} startIcon={<AddIcon />}
              sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#d81b60" } }}>
              Add Task
            </Button>
          </form>
        </Paper>

        {/* List */}
        <Box sx={{ flex: 1 }}>
          {/* Category filter */}
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={c} onClick={() => setFilter(c)} size="small"
                sx={{ cursor: "pointer", fontWeight: 600, fontSize: 12,
                  bgcolor: filter === c ? "#e91e63" : "white", color: filter === c ? "white" : "text.secondary",
                  border: "1px solid", borderColor: filter === c ? "#e91e63" : "#eee",
                  "&:hover": { bgcolor: filter === c ? "#d81b60" : "#fce4ec" } }} />
            ))}
          </Box>

          <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee", overflow: "hidden" }}>
            {filtered.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", color: "text.secondary" }}>
                <CheckCircleIcon sx={{ fontSize: 40, color: "#eee", mb: 1 }} />
                <Typography>No tasks yet. Add one or use AI Generate!</Typography>
              </Box>
            ) : (
              <List disablePadding>
                {filtered.map((item, idx) => (
                  <Box key={item.id}>
                    {idx > 0 && <Divider />}
                    <ListItem sx={{ py: 1.5, "&:hover": { bgcolor: "#fafafa" }, transition: "background 0.15s" }}
                      secondaryAction={
                        <IconButton size="small" onClick={() => deleteItem({ variables: { id: item.id } })}
                          sx={{ color: "#ccc", "&:hover": { color: "#f44336" } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      }>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Checkbox checked={item.completed} onChange={() => toggleItem({ variables: { id: item.id } })}
                          sx={{ color: "#e91e63", "&.Mui-checked": { color: "#e91e63" }, p: 0 }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={<Typography variant="body2" sx={{ fontWeight: 500, textDecoration: item.completed ? "line-through" : "none", color: item.completed ? "text.secondary" : "text.primary" }}>{item.title}</Typography>}
                        secondary={
                          <Box sx={{ display: "flex", gap: 1, mt: 0.5, alignItems: "center" }}>
                            <Chip label={item.category || "General"} size="small"
                              sx={{ height: 18, fontSize: 10, bgcolor: `${CAT_COLORS[item.category] || "#9e9e9e"}20`, color: CAT_COLORS[item.category] || "#9e9e9e", fontWeight: 600 }} />
                            {item.dueDate && <Typography variant="caption" sx={{ color: "text.secondary" }}>{item.dueDate}</Typography>}
                            {item.aiGenerated && <Chip label="AI" size="small" sx={{ height: 16, fontSize: 9, bgcolor: "#f3e5f5", color: "#9c27b0" }} />}
                          </Box>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Box>

      {/* AI Dialog */}
      <Dialog open={aiDialog} onClose={() => setAiDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesomeIcon sx={{ color: "#e91e63" }} />
            AI-Generated Checklist ({aiItems.length} tasks)
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ maxHeight: 400, overflowY: "auto" }}>
          <Alert severity="info" sx={{ mb: 2 }}>Select the tasks you want to import</Alert>
          <List disablePadding dense>
            {aiItems.map((item, i) => (
              <ListItem key={i} dense sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Checkbox size="small" checked={selectedAiItems.includes(i)}
                    onChange={() => setSelectedAiItems((prev) => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                    sx={{ color: "#e91e63", "&.Mui-checked": { color: "#e91e63" }, p: 0 }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography variant="body2">{item.title}</Typography>}
                  secondary={<Box sx={{ display: "flex", gap: 1 }}>
                    <Chip label={item.category} size="small" sx={{ height: 16, fontSize: 10 }} />
                    {item.dueDate && <Typography variant="caption">{item.dueDate}</Typography>}
                  </Box>}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAiDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleImport} disabled={bulkLoading || selectedAiItems.length === 0}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
            Import {selectedAiItems.length} Tasks
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}