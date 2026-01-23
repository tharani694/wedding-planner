import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { GET_GUESTS } from "../../graphql/queries"
import { DELETE_GUEST, UPDATE_GUEST } from "../../graphql/mutations";

function GuestList({ search }) {
    const { data, loading, error } = useQuery(GET_GUESTS);

    const [deleteGuest] = useMutation(DELETE_GUEST , {
        refetchQueries: [{ query: GET_GUESTS, fetchPolicy: 'network-only' }]
    })

    const [updateGuest] = useMutation(UPDATE_GUEST, {
        refetchQueries: [{ query: GET_GUESTS, fetchPolicy: 'network-only' }]
    })

    const guests = data?.guests || []

    const [editingId, setEditingId] = useState(null)
    const [editedName, setEditedName] = useState("")
    const [editedPhone, setEditedPhone] = useState("")
    const [editedRsvp, setEditedRsvp] = useState("Yes")

    if(loading) return <p>Loading Guests ...</p>
    if(error) return <p>Error Loading guests</p>
    if (guests.length === 0) return <p>No Guests yet!</p>;


    function startEdit(guest) {
        setEditingId(guest.id)
        setEditedName(guest.name)
        setEditedPhone(guest.phone)
        setEditedRsvp(guest.rsvp)
    }

    function saveEdit(id) {
        updateGuest({
            variables: {
                input: {
                    id,
                    name: editedName,
                    phone: editedPhone,
                    rsvp: editedRsvp
                }
            }
        })
        setEditingId(null)
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

    const filteredGuests = guests.filter((guest) =>
        guest.name.toLowerCase().includes(search.toLowerCase())
      );

    return (
        <>
        <ul>
            {filteredGuests.map((guest) => (
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
                        onClick={() => deleteGuest({variables : {id: guest.id }})} 
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