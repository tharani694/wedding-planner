import { useMemo } from "react"
import { useQuery } from "@apollo/client";
import { DASHBOARD_QUERY } from "../graphql/queries";
import { 
  Container, 
  Grid, 
  Paper, 
  Typography,
  CircularProgress,
  Box,
  Alert
} from "@mui/material";

const Dashboard = () => {
    const { data, loading, error } = useQuery(DASHBOARD_QUERY);
    const stats = useMemo(() => {
        if (!data) return {
          totalGuests: 0,
          attending: 0,
          maybe: 0,
          notAttending: 0,
          bookedVendors: 0
        };
    
        const { guests, vendors } = data;
    
        const totalGuests = guests.length;
        const attending = guests.filter(g => g.rsvp === "Attending").length;
        const maybe = guests.filter(g => g.rsvp === "Maybe").length;
        const notAttending = guests.filter(g => g.rsvp === "Not Attending").length;
        const bookedVendors = vendors.filter(v => v.status === "Booked").length;
    
        return { 
          totalGuests, 
          attending, 
          maybe, 
          notAttending, 
          bookedVendors 
        };
      }, [data]);

    // if (loading) return <p>Loading...</p>;
    if(loading) return (
      <Box display="flex" justifyContent="center" mt={6}>
        <CircularProgress />
      </Box>
    )

    if (error) {
      return (
        <Container sx={{ mt: 4 }}>
          <Alert severity="error">
            {error.message}
          </Alert>
        </Container>
      );
    }

    // if (error) return <p>Error: {error.message}</p>;

    const StatCard = ({ label, value}) => (
        <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              textAlign: "center",
              borderRadius: 3,
            }}
        >
          <Typography variant="h6" color="text.secondary"> {label} </Typography>
          <Typography variant="h4" fontWeight={600}> {value} </Typography>
        </Paper>
    )

    return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard Overview
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Total Guests" value={stats.totalGuests} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Attending" value={stats.attending} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Maybe" value={stats.maybe} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Not Attending" value={stats.notAttending} />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard label="Booked Vendors" value={stats.bookedVendors} />
        </Grid>
      </Grid>
    </Container>
    )
}
export default Dashboard
