import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Avatar, IconButton, useMediaQuery, useTheme, Divider, Chip } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StoreIcon from "@mui/icons-material/Store";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: "Dashboard", path: "/", icon: <DashboardIcon /> },
  { label: "Events", path: "/events", icon: <EventIcon /> },
  { label: "Guests", path: "/guests", icon: <PeopleIcon /> },
  { label: "Vendors", path: "/vendors", icon: <BusinessIcon /> },
  { label: "Marketplace", path: "/marketplace", icon: <StoreIcon /> },
  { label: "Budget", path: "/budget", icon: <AttachMoneyIcon /> },
  { label: "Checklist", path: "/checklist", icon: <ChecklistIcon /> },
  { label: "Profile", path: "/profile", icon: <AccountCircleIcon /> },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const daysLeft = user?.weddingDate
    ? Math.max(0, Math.ceil((new Date(user.weddingDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  const handleLogout = () => { logout(); navigate("/login"); };

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#1a1a2e" }}>
      <Box sx={{ p: 3, textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <FavoriteIcon sx={{ color: "#e91e63", fontSize: 32, mb: 1 }} />
        <Typography variant="h6" sx={{ color: "white", fontWeight: 700, fontSize: 14 }}>
          {user?.name || "Wedding Planner"}
        </Typography>
        {user?.partnerName && (
          <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            & {user.partnerName}
          </Typography>
        )}
        {daysLeft !== null && (
          <Chip label={`${daysLeft} days to go!`} size="small"
            sx={{ mt: 1, bgcolor: "#e91e63", color: "white", fontWeight: 700, fontSize: 11 }} />
        )}
      </Box>

      <List sx={{ flex: 1, py: 2 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.path} disablePadding>
            <NavLink to={item.path} end={item.path === "/"} onClick={() => isMobile && setMobileOpen(false)}
              style={{ width: "100%", textDecoration: "none" }}>
              {({ isActive }) => (
                <Box sx={{ display: "flex", alignItems: "center", px: 3, py: 1.2, mx: 1, borderRadius: 2, cursor: "pointer",
                  bgcolor: isActive ? "rgba(233,30,99,0.2)" : "transparent",
                  borderLeft: isActive ? "3px solid #e91e63" : "3px solid transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.05)" }, transition: "all 0.2s" }}>
                  <Box sx={{ color: isActive ? "#e91e63" : "rgba(255,255,255,0.5)", mr: 1.5, display: "flex" }}>{item.icon}</Box>
                  <Typography sx={{ color: isActive ? "white" : "rgba(255,255,255,0.6)", fontWeight: isActive ? 600 : 400, fontSize: 14 }}>
                    {item.label}
                  </Typography>
                </Box>
              )}
            </NavLink>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 1.5, borderRadius: 2, cursor: "pointer",
          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" } }} onClick={handleLogout}>
          <LogoutIcon sx={{ color: "rgba(255,255,255,0.4)", fontSize: 20 }} />
          <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Sign out</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {isMobile ? (
        <>
          <AppBar position="fixed" sx={{ bgcolor: "#1a1a2e", zIndex: theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton color="inherit" onClick={() => setMobileOpen(!mobileOpen)} edge="start">
                <MenuIcon />
              </IconButton>
              <FavoriteIcon sx={{ color: "#e91e63", mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Wedding Planner</Typography>
            </Toolbar>
          </AppBar>
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }} sx={{ "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box" } }}>
            {drawer}
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, mt: 8, p: 2 }}><Outlet /></Box>
        </>
      ) : (
        <>
          <Drawer variant="permanent" sx={{ width: DRAWER_WIDTH, flexShrink: 0, "& .MuiDrawer-paper": { width: DRAWER_WIDTH, boxSizing: "border-box", border: "none" } }}>
            {drawer}
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3, maxWidth: "calc(100vw - 240px)" }}><Outlet /></Box>
        </>
      )}
    </Box>
  );
}
