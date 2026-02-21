import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Typography, TextField, Box, Grid, Paper, MenuItem, Pagination } from "@mui/material";
import GuestForm from "./GuestForm";
import GuestList from "./GuestList";
import { GET_GUESTS } from "../../graphql/queries";

const GuestPage = () => {
    const { data, loading, error } = useQuery(GET_GUESTS);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rsvpFilter, setRsvpFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [search, rsvpFilter, sortOrder]);

  const guests = data?.guests || []
  const filteredGuests = guests
  .filter((guest) => {
     const matchesSearch = guest?.name?.toLowerCase().includes(search.toLowerCase())
     const matchesRsvp = rsvpFilter === "All" || guest?.rsvp === rsvpFilter
     return matchesSearch && matchesRsvp
  })
  .sort((a, b) => {
      if(sortOrder === "asc") {
          return a.name.localeCompare(b.name)
      } else {
          return b.name.localeCompare(a.name)
      }
  })

  const totalPages = Math.ceil(filteredGuests.length / rowsPerPage)
  const paginatedGuests = filteredGuests.slice(
      (page - 1) * rowsPerPage,
      page * rowsPerPage
  )

  return (
    <Paper
      elevation={4}
      sx={{
        height: "70vh",
        borderRadius: 4,
        p: 3,
      }}
    >
      <Typography variant="h4" mb={3} fontWeight="bold">
        Guests
      </Typography>
      <Grid container spacing={7} sx={{ flex: 1 }}>
        <Grid item md={3} sx={{ width: "30%" }}>
          <GuestForm />
        </Grid>
        <Grid
          item
          md={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "55vh",
            width: "60%",
          }}
        >
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              sx={{ flex: 2 }}
              label="Search guest by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <TextField
                select
                label="RSVP"
                value={rsvpFilter}
                onChange={(e) => setRsvpFilter(e.target.value)}
                sx={{minWidth: 140, flex: 1 }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Attending">Attending</MenuItem>
              <MenuItem value="Not Attending">Not Attending</MenuItem>
              <MenuItem value="Maybe">Maybe</MenuItem>
            </TextField>
            <TextField
                select
                label="Sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                sx={{minWidth: 120, flex: 1 }}
            >
                <MenuItem value="asc">Name A-Z</MenuItem>
                <MenuItem value="desc">Name Z-A</MenuItem>
            </TextField>
          </Box>

          <Box
            sx={{
            display: "flex",
            flexDirection: "column",
            height: "55vh",
            }}
          >
            <Box 
            sx={{
                flex: 3,
                overflowY: "auto",
                pr: 1,
            }}>
            <GuestList 
                guests={paginatedGuests}
            />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
export default GuestPage;
