import { useMemo } from "react"

function Dashboard({ guests, vendors }) {
    const stats = useMemo(() => {
        const totalGuests = guests.length
        const attending = guests.filter(g => g.rsvp === 'Yes').length
        const maybe = guests.filter(g => g.rsvp === 'Maybe').length
        const notAttending = guests.filter(g => g.rsvp === 'No').length
        const bookedVendors = vendors.filter(v => v.status === "Booked").length;

        return {totalGuests, attending, maybe, notAttending, bookedVendors}
    }, [guests])


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