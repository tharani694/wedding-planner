import { useState } from "react";

function GuestForm({ onAddGuest }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [rsvp, setRsvp] = useState("Yes");

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!name.trim()) return;

        const newGuest = {
            id:  Date.now(),
            name,
            phone, 
            rsvp
        }

        onAddGuest(newGuest)
        setName("");
        setPhone("");
        setRsvp("Yes");
    }

    return (
        <form onSubmit={handleSubmit} style ={{ marginBottom: 20 }}>
            <input
             placeholder="Guest Name"
             value={name}
             onChange={(e) => setName(e.target.value)}
             />

             <input
             placeholder="Phone Number"
             value={phone}
             onChange={(e) => setPhone(e.target.value)}  
             />
             <select value={rsvp} onChange={(e) => setRsvp(e.target.value)}>
                <option value ="Yes">Attending</option>
                <option value ="No">Not Attending</option>
                <option value ="Maybe">Maybe</option>
             </select>

             <button type="submit">Add Guest</button>
        </form>
    )
}

export default GuestForm;