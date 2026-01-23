import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_BUDGET_CATEGORY } from "../../graphql/mutations";
import { GET_BUDGET } from "../../graphql/queries";

function CategoryForm() {
  const [name, setName] = useState("");
  const [allocated, setAllocated] = useState("");

  const [addBudgetCategory, { loading }] = useMutation(ADD_BUDGET_CATEGORY, {
    refetchQueries: [{ query: GET_BUDGET , fetchPolicy: 'network-only'}],
  });

  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      await addBudgetCategory({
        variables: {
            name,
            allocated: Number(allocated),
        },
      });

      setName("");
      setAllocated("");
    } catch (err) {
      console.error("Error adding category:", err);
    }
  };

  return (
    <div>
      <input
        placeholder="Category"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Allocated"
        value={allocated}
        onChange={(e) => setAllocated(e.target.value)}
      />

      <button onClick={handleAdd} disabled={loading}>
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}

export default CategoryForm;