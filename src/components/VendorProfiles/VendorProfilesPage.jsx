import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_VENDOR_PROFILES, GET_BUDGET } from "../../graphql/queries";
import { ADD_VENDOR_FROM_PROFILE } from "../../graphql/mutations";

function VendorProfilesPage() {
  console.log("Inside profiles")
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sort, setSort] = useState("");
  const { data, loading, error } = useQuery(GET_BUDGET);
  const budget = data?.budget;
  const categories = budget?.categories || [];
  const { data: vendorData, loading: vendorLoading, error: vendorError } = useQuery(GET_VENDOR_PROFILES)
  const [addVendorFromProfile] = useMutation(ADD_VENDOR_FROM_PROFILE, {
      refetchQueries: [{ query: GET_BUDGET, fetchPolicy: 'network-only' }]
  });

  const profiles = vendorData?.vendorProfiles || [];

  const visible = useMemo(() => {
    const filtered = profiles.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        !categoryFilter ||
        categories.find(c => c.id == categoryFilter)?.name === p.categoryName;

      return matchesSearch && matchesCategory;
    });

    let result = [...filtered];

    if (sort === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [profiles, search, categoryFilter, sort, categories]);

  const handleAdd = async (profileId) => {
    try {
      await addVendorFromProfile({
        variables: { profileId }
      });
    } catch (err) {
      throw new Error(err)
    }
  };

  if (vendorLoading) return <p>Loading vendor profiles...</p>;
  if (vendorError) return <p>Error: {vendorError.message}</p>;

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
          <p>₹{p.price} • ⭐ {p.rating}</p>
          <p>{p.tags.join(", ")}</p>

          <button onClick={() => handleAdd(p.id)}>
            ➕ Add to My Vendors
          </button>
        </div>
      ))}
    </div>
  );
}

export default VendorProfilesPage;
