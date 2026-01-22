import { useState } from "react";


function VendorForm({ categories, onAdd }) {
    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [price, setPrice] = useState("")

    function handleSubmit(e) {
        if (!name || !price || !categoryId) return;
        e.preventDefault()

        if(!name.trim()) return

        const newVendor = {
            name,
            categoryId: Number(categoryId),
            price: Number(price),
            status: "Contacted"
        }

        onAdd(newVendor)
        setName("")
        setPrice(0)
    }

    // return (
    //     <form onSubmit={handleSubmit}>
    //         <input
    //             placeholder="Vendor name"
    //             value={name}
    //             onChange={(e) => setName(e.target.value)}
    //         />

    //         <select value={category} onChange={(e) => setCategory(e.target.value)}>
    //             <option>Venue</option>
    //             <option>Catering</option>
    //             <option>Photography</option>
    //             <option>Makeup</option>
    //             <option>Decor</option>
    //         </select>

    //         <input
    //             placeholder="Price"
    //             type="number"
    //             value={price}
    //             onChange={(e) => setPrice(e.target.value)}
    //         />

    //     <button>Add Vendor</button>
    //     </form>
    // )

    return (
        <div>
          <input placeholder="Vendor name" value={name} onChange={e => setName(e.target.value)} />
          <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
    
          <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="">Select category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
    
          <button onClick={handleSubmit}>Add Vendor</button>
        </div>
      );

}
export default VendorForm