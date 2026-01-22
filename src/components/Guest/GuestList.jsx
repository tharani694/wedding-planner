import { useState } from "react"
function GuestList({guests, onDelete, onUpdate, search}) {
    const [editingId, setEditingId] = useState(null)
    const [editedName, setEditedName] = useState("")
    const [editedPhone, setEditedPhone] = useState("")
    const [editedRsvp, setEditedRsvp] = useState("Yes")


    function startEdit(guest) {
        setEditingId(guest.id)
        setEditedName(guest.name)
        setEditedPhone(guest.phone)
        setEditedRsvp(guest.rsvp)
    }

    function saveEdit(id) {
        onUpdate(id, {
            name: editedName,
            phone: editedPhone,
            rsvp: editedRsvp
        })
        setEditingId(null)
    }
    if(guests.length === 0) {
        return <p> No Guests yet!</p>
    }


    function highLight(text, query) {
        if(!query) return text
        const parts = text.split(new RegExp(`(${query})`, "gi"))
        return parts.map((p, i) => 
            p.toLowerCase() === query.toLowerCase() ? (
                <mark key={i}>{p}</mark>
            ) : ( p )
        )
    }

    return (
        <>
        <ul>
            {guests.map((guest) => (
                <li key={guest.id} style={{ marginBottom: 8 }}>
                    {editingId === guest.id ? 
                    (
                        <>
                        <input value={editedName} onChange={(e) => setEditedName(e.target.value)} />
                        <input value={editedPhone} onChange={(e) => setEditedPhone(e.target.value)} />
                        <select value={editedRsvp} onChange={(e) => setEditedRsvp(e.target.value)}> 
                            <option>Yes</option>
                            <option>No</option>
                            <option>Maybe</option>
                        </select>
                        <button onClick={() => saveEdit(guest.id)}>Save</button>
                        </>
                    ) : 
                    (
                        <>
                        <strong>{highLight(guest.name, search)}</strong> - ({guest.phone}) - RSVP : {guest.rsvp}
                        <button
                        onClick={() => startEdit(guest)}
                        style={{marginLeft: 10}}
                        >
                            Edit
                        </button>
                        <button 
                        onClick={() => onDelete(guest.id)} 
                        style={{marginLeft: 10}}>
                            Delete
                        </button>
                        </>
                    )}
                </li>)
            )}
        </ul>
        </>
    )
}
export default GuestList;