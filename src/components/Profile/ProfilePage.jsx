import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Box, Paper, Typography, TextField, Button, Grid, Avatar, Alert, Divider, CircularProgress, Chip } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CelebrationIcon from "@mui/icons-material/Celebration";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: "", partnerName: "", weddingDate: "", weddingVenue: "", totalBudget: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        partnerName: user.partnerName || "",
        weddingDate: user.weddingDate || "",
        weddingVenue: user.weddingVenue || "",
        totalBudget: user.totalBudget || "",
      });
    }
  }, [user]);

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await updateProfile({ ...form, totalBudget: form.totalBudget ? parseInt(form.totalBudget) : 0 });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally { setLoading(false); }
  };

  const daysLeft = form.weddingDate
    ? Math.max(0, Math.ceil((new Date(form.weddingDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e", mb: 3 }}>Wedding Profile</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", textAlign: "center" }}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: "#e91e63", mx: "auto", mb: 2, fontSize: 32 }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>{user?.email}</Typography>
            {user?.partnerName && (
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1, mt: 1.5 }}>
                <FavoriteIcon sx={{ color: "#e91e63", fontSize: 16 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>{user.partnerName}</Typography>
              </Box>
            )}
            {daysLeft !== null && (
              <Chip icon={<CelebrationIcon />} label={`${daysLeft} days to go!`}
                sx={{ mt: 2, bgcolor: "#fce4ec", color: "#e91e63", fontWeight: 700, "& .MuiChip-icon": { color: "#e91e63" } }} />
            )}
            {user?.weddingVenue && (
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 1.5 }}>📍 {user.weddingVenue}</Typography>
            )}
            {user?.totalBudget > 0 && (
              <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>💰 ₹{user.totalBudget.toLocaleString()} budget</Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2.5 }}>Edit Details</Typography>
            {saved && <Alert severity="success" sx={{ mb: 2 }}>Profile saved successfully!</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSave}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Your Name" value={form.name} onChange={handle("name")} required size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Partner's Name" value={form.partnerName} onChange={handle("partnerName")} size="small" placeholder="Your partner's name" />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }}><Typography variant="caption" sx={{ color: "text.secondary" }}>Wedding Details</Typography></Divider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Wedding Date" type="date" value={form.weddingDate} onChange={handle("weddingDate")} InputLabelProps={{ shrink: true }} size="small" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label="Total Budget (₹)" type="number" value={form.totalBudget} onChange={handle("totalBudget")} size="small" placeholder="e.g. 1500000" />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Venue" value={form.weddingVenue} onChange={handle("weddingVenue")} size="small" placeholder="e.g. The Grand Palace, Chennai" />
                </Grid>
              </Grid>

              <Button type="submit" variant="contained" startIcon={loading ? <CircularProgress size={16} sx={{ color: "white" }} /> : <SaveIcon />}
                disabled={loading} sx={{ mt: 3, bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#d81b60" } }}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}