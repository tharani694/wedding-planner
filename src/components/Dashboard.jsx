import { useMemo } from "react"
import { useQuery } from "@apollo/client";
import { DASHBOARD_QUERY } from "../graphql/queries";

function Dashboard() {
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
        const attending = guests.filter(g => g.rsvp === "Yes").length;
        const maybe = guests.filter(g => g.rsvp === "Maybe").length;
        const notAttending = guests.filter(g => g.rsvp === "No").length;
        const bookedVendors = vendors.filter(v => v.status === "Booked").length;
    
        return { totalGuests, attending, maybe, notAttending, bookedVendors };
      }, [data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;


    return (
        <div style={{ padding: 16, border: "1px solid #ccc", marginBottom: 20 }} >
            <h2>Dashboard</h2>
            <p>Total Guests: {stats.totalGuests} </p>
            <p>Attending: {stats.attending}</p>
            <p>Not Attending: {stats.notAttending}</p>
            <p>Maybe: {stats.maybe}</p>
            <p>Booked Vendors: <strong>{stats.bookedVendors}</strong></p>
        </div>
    )
}
export default Dashboard