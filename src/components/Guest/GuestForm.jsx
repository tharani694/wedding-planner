import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_GUEST } from "../../graphql/mutations";
import { GET_GUESTS } from "../../graphql/queries";

function GuestForm() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [rsvp, setRsvp] = useState("Yes");
    const [addGuest] = useMutation(ADD_GUEST, {
        refetchQueries: [{ query: GET_GUESTS, fetchPolicy: 'network-only' }],
    });
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        if(!name.trim()) return;

    try {
        await addGuest({
            variables: {
                input: {
                    name,
                    phone, 
                    rsvp
                }
            }
        })
        setName("");
        setPhone("");
        setRsvp("Yes");
    } catch (err) {
            console.error(err)
        }
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