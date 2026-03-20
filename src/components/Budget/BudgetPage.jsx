import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BUDGET, AI_BUDGET_ADVICE } from "../../graphql/queries";
import { ADD_BUDGET_CATEGORY, UPDATE_BUDGET_CATEGORY, DELETE_BUDGET_CATEGORY, UPDATE_BUDGET_TOTAL } from "../../graphql/mutations";
import {
  Box, Paper, Typography, TextField, Button, IconButton, CircularProgress,
  LinearProgress, Grid, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Alert, Tooltip, Divider
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useLazyQuery } from "@apollo/client";
import { PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#e91e63", "#9c27b0", "#3f51b5", "#2196f3", "#00bcd4", "#4caf50", "#ff9800", "#ff5722"];

function CategoryRow({ cat, onEdit, onDelete }) {
  const pct = cat.allocated > 0 ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
  const over = cat.spent > cat.allocated;
  return (
    <Box sx={{ mb: 2, p: 2, borderRadius: 2, border: "1px solid #f0f0f0", "&:hover": { borderColor: "#e91e63" }, transition: "border-color 0.2s" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>{cat.name}</Typography>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Typography variant="body2" sx={{ color: over ? "#f44336" : "text.secondary", fontWeight: over ? 700 : 400 }}>
            ₹{cat.spent.toLocaleString()} / ₹{cat.allocated.toLocaleString()}
          </Typography>
          <IconButton size="small" onClick={() => onEdit(cat)} sx={{ color: "#ccc", "&:hover": { color: "#e91e63" } }}><EditIcon sx={{ fontSize: 16 }} /></IconButton>
          <IconButton size="small" onClick={() => onDelete(cat.id)} sx={{ color: "#ccc", "&:hover": { color: "#f44336" } }}><DeleteIcon sx={{ fontSize: 16 }} /></IconButton>
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
}

export default function BudgetPage() {
  const [addForm, setAddForm] = useState({ name: "", allocated: "" });
  const [editCat, setEditCat] = useState(null);
  const [totalInput, setTotalInput] = useState("");
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiDialog, setAiDialog] = useState(false);

  const { data, loading, refetch } = useQuery(GET_BUDGET, { variables: {} });
  const [addCat] = useMutation(ADD_BUDGET_CATEGORY, { refetchQueries: [{ query: GET_BUDGET, variables: {} }] });
  const [updateCat] = useMutation(UPDATE_BUDGET_CATEGORY, { refetchQueries: [{ query: GET_BUDGET, variables: {} }] });
  const [deleteCat] = useMutation(DELETE_BUDGET_CATEGORY, { refetchQueries: [{ query: GET_BUDGET, variables: {} }] });
  const [updateTotal] = useMutation(UPDATE_BUDGET_TOTAL, { refetchQueries: [{ query: GET_BUDGET, variables: {} }] });
  const [getAiAdvice, { loading: aiLoading }] = useLazyQuery(AI_BUDGET_ADVICE, { fetchPolicy: "no-cache" });

  const budget = data?.budget;
  const cats = budget?.categories || [];
  const totalAllocated = cats.reduce((s, c) => s + (c.allocated || 0), 0);
  const totalSpent = cats.reduce((s, c) => s + (c.spent || 0), 0);
  const pieData = cats.filter(c => c.allocated > 0).map((c, i) => ({ name: c.name, value: c.allocated, fill: COLORS[i % COLORS.length] }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim() || !budget?.id) return;
    await addCat({ variables: { budgetId: budget.id, name: addForm.name, allocated: parseInt(addForm.allocated) || 0 } });
    setAddForm({ name: "", allocated: "" });
  };

  const handleGetAdvice = async () => {
    const { data } = await getAiAdvice();
    setAiAdvice(data?.aiBudgetAdvice || "");
    setAiDialog(true);
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>Budget</Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Track spending across all categories</Typography>
        </Box>
        <Button variant="outlined" startIcon={aiLoading ? <CircularProgress size={16} /> : <AutoAwesomeIcon />}
          onClick={handleGetAdvice} disabled={aiLoading}
          sx={{ borderColor: "#e91e63", color: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>
          {aiLoading ? "Analysing..." : "AI Advice"}
        </Button>
      </Box>

      {/* Total budget */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>Total Budget</Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, color: "#1a1a2e" }}>₹{(budget?.total || 0).toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>Allocated: <strong>₹{totalAllocated.toLocaleString()}</strong></Typography>
            <Typography variant="body2" sx={{ color: totalSpent > totalAllocated ? "#f44336" : "text.secondary" }}>
              Spent: <strong>₹{totalSpent.toLocaleString()}</strong>
            </Typography>
            <Typography variant="body2" sx={{ color: "#4caf50" }}>Remaining: <strong>₹{Math.max(0, (budget?.total || 0) - totalSpent).toLocaleString()}</strong></Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField size="small" type="number" placeholder="Set total budget" value={totalInput} onChange={(e) => setTotalInput(e.target.value)}
                sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
              <Button variant="contained" onClick={() => { updateTotal({ variables: { total: parseInt(totalInput) || 0 } }); setTotalInput(""); }}
                sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", whiteSpace: "nowrap" }}>Set</Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Add Category</Typography>
            <form onSubmit={handleAdd}>
              <TextField fullWidth label="Category Name" value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                size="small" sx={{ mb: 2 }} required />
              <TextField fullWidth label="Allocated Amount (₹)" type="number" value={addForm.allocated}
                onChange={(e) => setAddForm({ ...addForm, allocated: e.target.value })} size="small" sx={{ mb: 2 }} />
              <Button type="submit" fullWidth variant="contained" startIcon={<AddIcon />}
                sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600 }}>Add Category</Button>
            </form>
          </Paper>
          {pieData.length > 0 && (
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #eee" }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>Allocation</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={2}>
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <RTooltip formatter={(v) => `₹${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          )}
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Categories ({cats.length})</Typography>
            {cats.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                <Typography>No categories yet. Add your first one!</Typography>
              </Box>
            ) : (
              cats.map((cat) => (
                <CategoryRow key={cat.id} cat={cat}
                  onEdit={(c) => setEditCat({ ...c })}
                  onDelete={(id) => deleteCat({ variables: { id } })} />
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit dialog */}
      <Dialog open={!!editCat} onClose={() => setEditCat(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Edit Category</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={editCat?.name || ""} onChange={(e) => setEditCat({ ...editCat, name: e.target.value })} sx={{ mt: 1, mb: 2 }} size="small" />
          <TextField fullWidth label="Allocated (₹)" type="number" value={editCat?.allocated || ""} onChange={(e) => setEditCat({ ...editCat, allocated: e.target.value })} size="small" />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setEditCat(null)}>Cancel</Button>
          <Button variant="contained" onClick={async () => { await updateCat({ variables: { input: { id: editCat.id, name: editCat.name, allocated: parseInt(editCat.allocated) || 0 } } }); setEditCat(null); }}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none" }}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* AI Advice dialog */}
      <Dialog open={aiDialog} onClose={() => setAiDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <AutoAwesomeIcon sx={{ color: "#e91e63" }} /> AI Budget Advice
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8, color: "#1a1a2e" }}>{aiAdvice}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setAiDialog(false)} variant="contained" sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none" }}>Got it</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
