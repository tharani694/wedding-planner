function VendorList({ vendors, categories, onDelete, onUpdate }) {
    const getCategoryName = id =>
        categories.find(c => c.id === id)?.name || "Unknown";

    if (!vendors.length) return <p>No Vendors yet!</p>

    return (
        <ul>
            {vendors.map(v => (
                <li key={v.id}>
                    <strong>{v.name}</strong> - {getCategoryName(v.categoryId)} - ₹{v.price}
                    <select
                        value={v.status || "lead"}
                        onChange={(e) => onUpdate(v.id, { status: e.target.value })}
                        style={{ marginLeft: 10 }}
                    >
                        <option value="lead">Lead</option>
                        <option value="contacted">Contacted</option>
                        <option value="booked">Booked</option>
                        <option value="paid">Paid</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                        onClick={() => onDelete(v.id)}
                        style={{ marginLeft: 10 }}
                    >DELETE
                    </button>
                </li>
            ))}
        </ul>
    )
}
export default VendorList