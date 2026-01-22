import { useEffect, useState } from "react";
import VendorForm from "./VendorForm";
import VendorList from "./VendorList";

function VendorPage({categories}) {
    const [vendors, setVendors] = useState([])

    useEffect(() => {
        fetch("http://localhost:4000/vendors")
        .then(res => res.json())
        .then(setVendors)
    }, [])

    const addVendor = async(vendor) => {
        const res = await fetch("http://localhost:4000/vendors", {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vendor)
        })
        
        const saved = await res.json()
        setVendors((prev) => [...prev, saved])
    }

    const deleteVendor = async(id) => {
        await fetch(`http://localhost:4000/vendors/${id}`, {
            method: 'DELETE'
        })

        setVendors(prev => prev.filter(v => v.id !== id))
    }

    const updateVendor = async(id, updates) => {
        await fetch(`http://localhost:4000/vendors/${id}`, {
            method: 'PUT',
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify(updates)
        })

        setVendors(prev =>
            prev.map(v => v.id === id ? { ...v, ...updates } : v)
        );
    }

    return (
        <>
        <h2>Vendors</h2>
        <VendorForm categories={categories} onAdd={addVendor} />
        <VendorList 
            vendors={vendors} 
            categories={categories} 
            onDelete={deleteVendor} 
            onUpdate={updateVendor} 
        />
        </>
    )
}

export default VendorPage