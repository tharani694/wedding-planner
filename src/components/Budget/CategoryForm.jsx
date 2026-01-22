import { useState } from "react";

function CategoryForm({ onAdd }) {
  const [name, setName] = useState("");
  const [allocated, setAllocated] = useState("");

  return (
    <div>
      <input
        placeholder="Category"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="Allocated"
        value={allocated}
        onChange={e => setAllocated(e.target.value)}
      />

      <button onClick={() => {
        onAdd({ name, allocated: Number(allocated) });
        setName("");
        setAllocated("");
      }}>
        Add
      </button>
    </div>
  );
}

export default CategoryForm;