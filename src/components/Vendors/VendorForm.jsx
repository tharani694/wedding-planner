import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_VENDOR } from "../../graphql/mutations";
import { GET_VENDORS } from "../../graphql/queries";

function VendorForm({ categories }) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("")
  const [price, setPrice] = useState("");

  const [addVendor, { loading, error }] = useMutation(ADD_VENDOR, {
    refetchQueries: [{ query: GET_VENDORS , fetchPolicy: 'network-only' }]
  });

  // if(categoryId) {
  //   setCategoryName(categories.find(c => c.id == categoryId)?.name)
  // }
  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !price || !categoryId) return;

    try {
      await addVendor({
        variables: {
          input: {
            name,
            categoryId: Number(categoryId),
            categoryName: categoryName,
            price: Number(price),
          },
        },
      });
      setName("");
      setCategoryName("");
      setCategoryId("");
      setPrice("");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h3>Add Vendor</h3>

      <input
        placeholder="Vendor name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        type="number"
      />

      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Adding..." : "Add Vendor"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}
    </div>
  );
}

export default VendorForm;