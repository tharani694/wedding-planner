import { useMemo } from "react";
import { useQuery } from "@apollo/client";
import { DASHBOARD_QUERY } from "../graphql/queries";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Paper, Typography, CircularProgress, LinearProgress, Chip, Button } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import BusinessIcon from "@mui/icons-material/Business";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

const RSVP_COLORS = { Attending: "#4caf50", Maybe: "#ff9800", "Not Attending": "#f44336" };
const BUDGET_COLORS = ["#e91e63", "#9c27b0", "#3f51b5", "#2196f3", "#00bcd4", "#4caf50"];

function StatCard({ label, value, icon, color, sub }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", background: "white", height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 0.5 }}>{label}</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color }}>{value}</Typography>
          {sub && <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>{sub}</Typography>}
        </Box>
        <Box sx={{ bgcolor: `${color}20`, p: 1.5, borderRadius: 2, color }}>{icon}</Box>
      </Box>
    </Paper>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data, loading } = useQuery(DASHBOARD_QUERY);

  const stats = useMemo(() => {
    const guests = data?.guests || [];
    const vendors = data?.vendors || [];
    const budget = data?.budget;
    const checklistItems = data?.checklistItems || [];

    const rsvpCounts = guests.reduce((acc, g) => {
      const key = g.rsvp || "Not Attending";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const rsvpData = Object.entries(rsvpCounts).map(([name, value]) => ({ name, value }));
    const booked = vendors.filter((v) => ["booked", "paid"].includes(v.status)).length;
    const cats = budget?.categories || [];
    const totalAllocated = cats.reduce((s, c) => s + (c.allocated || 0), 0);
    const totalSpent = cats.reduce((s, c) => s + (c.spent || 0), 0);
    const checkDone = checklistItems.filter((i) => i.completed).length;
    return { guests, vendors, rsvpData, booked, cats, totalAllocated, totalSpent, checkDone, checkTotal: checklistItems.length };
  }, [data]);

  const daysLeft = user?.weddingDate
    ? Math.max(0, Math.ceil((new Date(user.weddingDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>
          Welcome back, {user?.name?.split(" ")[0]}! 💍
        </Typography>
        {user?.weddingDate && (
          <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
            {daysLeft === 0 ? "🎉 Today is the big day!" : `${daysLeft} days until ${user.weddingDate}`}
            {user.weddingVenue && ` • ${user.weddingVenue}`}
          </Typography>
        )}
        {!user?.weddingDate && (
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Set your wedding date in <a href="/profile" style={{ color: "#e91e63" }}>Profile</a> to see your countdown.
          </Typography>
        )}
      </Box>

      {/* Setup banner for new users */}
      {!user?.weddingDate && (
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3, border: "1px solid #fce4ec", bgcolor: "#fff9fb", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="body1" sx={{ fontWeight: 600, color: "#c2185b" }}>Complete your wedding profile</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Add your partner's name, wedding date, venue and budget to get the most out of the planner.</Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate("/profile")}
            sx={{ bgcolor: "#e91e63", borderRadius: 2, textTransform: "none", fontWeight: 600, flexShrink: 0, "&:hover": { bgcolor: "#d81b60" } }}>
            Set up profile →
          </Button>
        </Paper>
      )}

      {/* Stat cards - always visible */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Total Guests" value={stats.guests.length} icon={<PeopleIcon />} color="#e91e63"
            sub={`${stats.guests.filter(g => g.rsvp === "Attending").length} attending`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Booked Vendors" value={stats.booked} icon={<BusinessIcon />} color="#9c27b0"
            sub={`of ${stats.vendors.length} total`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Budget Spent" value={`₹${(stats.totalSpent / 1000).toFixed(0)}k`} icon={<AttachMoneyIcon />} color="#2196f3"
            sub={`of ₹${(stats.totalAllocated / 1000).toFixed(0)}k allocated`} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Checklist" value={`${stats.checkDone}/${stats.checkTotal}`} icon={<CheckCircleIcon />} color="#4caf50"
            sub={`${stats.checkTotal > 0 ? Math.round((stats.checkDone / stats.checkTotal) * 100) : 0}% complete`} />
        </Grid>
      </Grid>

      {/* Budget progress bar */}
      {stats.totalAllocated > 0 && (
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Budget Usage</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              ₹{stats.totalSpent.toLocaleString()} / ₹{stats.totalAllocated.toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress variant="determinate"
            value={Math.min(100, (stats.totalSpent / stats.totalAllocated) * 100)}
            sx={{ height: 8, borderRadius: 4, bgcolor: "#f5f5f5", "& .MuiLinearProgress-bar": { bgcolor: stats.totalSpent > stats.totalAllocated ? "#f44336" : "#e91e63", borderRadius: 4 } }} />
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* RSVP Chart */}
        {stats.rsvpData.length > 0 ? (
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", height: 300 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>RSVP Status</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={stats.rsvpData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                    {stats.rsvpData.map((entry) => (
                      <Cell key={entry.name} fill={RSVP_COLORS[entry.name] || "#9e9e9e"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v, n]} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: -1 }}>
                {stats.rsvpData.map((d) => (
                  <Chip key={d.name} label={`${d.name}: ${d.value}`} size="small"
                    sx={{ bgcolor: `${RSVP_COLORS[d.name]}20`, color: RSVP_COLORS[d.name], fontWeight: 600, fontSize: 11 }} />
                ))}
              </Box>
            </Paper>
          </Grid>
        ) : (
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px dashed #eee", height: 300, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }}>
              <PeopleIcon sx={{ fontSize: 40, color: "#f0f0f0" }} />
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                Add guests to see RSVP chart
              </Typography>
            </Paper>
          </Grid>
        )}

        {/* Budget chart */}
        {stats.cats.length > 0 ? (
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", height: 300 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Budget by Category</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stats.cats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString()}`]} />
                  <Bar dataKey="allocated" fill="#e0e0e0" name="Allocated" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="spent" fill="#e91e63" name="Spent" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        ) : (
          <Grid item xs={12} md={7}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px dashed #eee", height: 300, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 1 }}>
              <AttachMoneyIcon sx={{ fontSize: 40, color: "#f0f0f0" }} />
              <Typography variant="body2" sx={{ color: "text.secondary", textAlign: "center" }}>
                Add budget categories to see spending chart
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}