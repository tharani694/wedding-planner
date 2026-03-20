import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VENDOR_PROFILES } from "../../graphql/queries";
import { ADD_VENDOR_FROM_PROFILE } from "../../graphql/mutations";
import { GET_VENDORS } from "../../graphql/queries";
import {
  Box, Paper, Typography, TextField, Grid, Chip, Button, Rating,
  InputAdornment, CircularProgress, Snackbar, Alert
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import CheckIcon from "@mui/icons-material/Check";

const CAT_COLORS = { Photography: "#9c27b0", Catering: "#ff9800", Decor: "#4caf50", Entertainment: "#2196f3", Beauty: "#e91e63", Videography: "#3f51b5" };

export default function VendorProfilesPage() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [added, setAdded] = useState({});
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "success" });

  const { data, loading } = useQuery(GET_VENDOR_PROFILES);
  const { data: vendorData } = useQuery(GET_VENDORS, { variables: {} });
  const [addVendorFromProfile] = useMutation(ADD_VENDOR_FROM_PROFILE, { refetchQueries: [{ query: GET_VENDORS, variables: {} }] });

  const profiles = data?.vendorProfiles || [];
  const existingVendorNames = new Set((vendorData?.vendors || []).map(v => v.name));
  const categories = ["All", ...new Set(profiles.map((p) => p.categoryName))];

  const visible = useMemo(() => profiles.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || p.categoryName === catFilter;
    return matchSearch && matchCat;
  }), [profiles, search, catFilter]);

  const handleAdd = async (profileId, name) => {
    try {
      await addVendorFromProfile({ variables: { profileId } });
      setAdded((prev) => ({ ...prev, [profileId]: true }));
      setSnack({ open: true, msg: `${name} added to your vendors!`, severity: "success" });
    } catch (err) {
      setSnack({ open: true, msg: err.message || "Already added", severity: "error" });
    }
  };

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress sx={{ color: "#e91e63" }} /></Box>;

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "#1a1a2e" }}>Vendor Marketplace</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>Browse and add vendors to your wedding</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <TextField size="small" placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#ccc", fontSize: 20 }} /></InputAdornment> }}
          sx={{ width: 260, "& .MuiOutlinedInput-root": { borderRadius: 2 } }} />
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {categories.map((c) => (
            <Chip key={c} label={c} onClick={() => setCatFilter(c)} sx={{ cursor: "pointer", fontWeight: 600,
              bgcolor: catFilter === c ? "#e91e63" : "white", color: catFilter === c ? "white" : "text.secondary",
              border: "1px solid", borderColor: catFilter === c ? "#e91e63" : "#eee" }} />
          ))}
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {visible.map((p) => {
          const isAdded = added[p.id] || existingVendorNames.has(p.name);
          return (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid #eee", height: "100%", display: "flex", flexDirection: "column",
                "&:hover": { borderColor: "#e91e63", boxShadow: "0 4px 20px rgba(233,30,99,0.1)" }, transition: "all 0.2s" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Chip label={p.categoryName} size="small"
                    sx={{ bgcolor: `${CAT_COLORS[p.categoryName] || "#9e9e9e"}20`, color: CAT_COLORS[p.categoryName] || "#9e9e9e", fontWeight: 600, fontSize: 11 }} />
                  <Rating value={p.rating} precision={0.1} readOnly size="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: 15 }}>{p.name}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", flex: 1, mb: 2, lineHeight: 1.6, fontSize: 13 }}>{p.description}</Typography>
                <Box sx={{ display: "flex", gap: 0.5, mb: 2, flexWrap: "wrap" }}>
                  {p.tags.map((t) => <Chip key={t} label={t} size="small" sx={{ fontSize: 10, height: 20, bgcolor: "#f5f5f5" }} />)}
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: "#e91e63", fontSize: 16 }}>₹{Number(p.price).toLocaleString()}</Typography>
                  <Button size="small" variant={isAdded ? "outlined" : "contained"}
                    startIcon={isAdded ? <CheckIcon /> : <AddShoppingCartIcon />}
                    onClick={() => !isAdded && handleAdd(p.id, p.name)}
                    disabled={isAdded}
                    sx={{ borderRadius: 2, textTransform: "none", fontWeight: 600, fontSize: 12,
                      ...(isAdded ? { borderColor: "#4caf50", color: "#4caf50" } : { bgcolor: "#e91e63", "&:hover": { bgcolor: "#d81b60" } }) }}>
                    {isAdded ? "Added" : "Add"}
                  </Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ borderRadius: 2 }}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}