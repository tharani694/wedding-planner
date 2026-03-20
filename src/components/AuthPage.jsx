import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Paper, TextField, Button, Typography, Tab, Tabs, Alert, InputAdornment, IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      if (tab === 0) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 50%, #fce4ec 100%)", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Paper elevation={8} sx={{ width: "100%", maxWidth: 420, borderRadius: 4, overflow: "hidden" }}>
        <Box sx={{ background: "linear-gradient(135deg, #d81b60, #e91e63)", p: 4, textAlign: "center" }}>
          <FavoriteIcon sx={{ fontSize: 40, color: "white", mb: 1 }} />
          <Typography variant="h5" sx={{ color: "white", fontWeight: 700 }}>Wedding Planner</Typography>
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 0.5 }}>Plan your perfect day</Typography>
        </Box>

        <Box sx={{ p: 4 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
            <Tab label="Sign In" />
            <Tab label="Create Account" />
          </Tabs>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <form onSubmit={submit}>
            {tab === 1 && (
              <TextField fullWidth label="Full Name" value={form.name} onChange={handle("name")} required sx={{ mb: 2 }} />
            )}
            <TextField fullWidth label="Email" type="email" value={form.email} onChange={handle("email")} required sx={{ mb: 2 }} />
            <TextField
              fullWidth label="Password" type={showPass ? "text" : "password"} value={form.password} onChange={handle("password")} required sx={{ mb: 3 }}
              InputProps={{ endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPass(!showPass)}>{showPass ? <VisibilityOffIcon /> : <VisibilityIcon />}</IconButton></InputAdornment> }}
            />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ background: "linear-gradient(135deg, #d81b60, #e91e63)", borderRadius: 2, py: 1.5, fontWeight: 700, "&:hover": { background: "linear-gradient(135deg, #c2185b, #d81b60)" } }}>
              {loading ? "Please wait..." : tab === 0 ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
}