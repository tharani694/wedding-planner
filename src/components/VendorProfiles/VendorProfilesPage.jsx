import { useEffect, useState } from "react";
function VendorProfilesPage({ onAdd, categories }) {
    const [profiles, setProfiles] = useState([]);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [sort, setSort] = useState("");
    const filtered = profiles.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          !categoryFilter || categories.find(c => c.id == categoryFilter)?.name === p.categoryName;
      
        return matchesSearch && matchesCategory;
    })

    let visible = [...filtered];

    if (sort === "rating") {
    visible.sort((a, b) => b.rating - a.rating);
    }

  
    useEffect(() => {
      fetch("http://localhost:4000/vendor-profiles")
        .then(res => res.json())
        .then(setProfiles);
    }, []);

    return (
        <div>
          <h2>Vendor Marketplace</h2>
          <input
            placeholder="Search vendors..."
            value={search}
            onChange={e => setSearch(e.target.value)}
        />
        <select onChange={e => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
            ))}
        </select>
        <select onChange={e => setSort(e.target.value)}>
            <option value="">No sort</option>
            <option value="rating">Sort by rating</option>
        </select>
    
          {visible.map(p => (
            <div key={p.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <p>₹{p.basePrice} • ⭐ {p.rating}</p>
              <p>{p.tags.join(", ")}</p>
    
              <button onClick={() => onAdd(p.id)}>
                ➕ Add to My Vendors
              </button>
            </div>
          ))}
        </div>
      )
}
export default VendorProfilesPage