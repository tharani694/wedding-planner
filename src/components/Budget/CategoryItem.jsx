import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_BUDGET_CATEGORY, DELETE_BUDGET_CATEGORY } from "../../graphql/mutations";
import { GET_BUDGET } from "../../graphql/queries";

function CategoryItem({ category }) {
  const [isEditing, setIsEditing] = useState(false);
  const [allocated, setAllocated] = useState(category.allocated);

  const [updateBudgetCategory] = useMutation(UPDATE_BUDGET_CATEGORY, {
    refetchQueries: [{ query: GET_BUDGET, fetchPolicy: 'network-only' }],
  });
  
  const [deleteBudgetCategory] = useMutation(DELETE_BUDGET_CATEGORY, {
    refetchQueries: [{ query: GET_BUDGET, fetchPolicy: 'network-only' }],
  });

  const save = async () => {
    try {
      await updateBudgetCategory({
        variables: {
          input: {
            id: category.id,
            name: category.name,
            allocated: Number(allocated),
          },
        },
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBudgetCategory({
        variables: { id: category.id },
      });
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <li>
      <strong>{category.name}</strong>{" "}
      {isEditing ? (
        <>
          <input
            value={allocated}
            onChange={(e) => setAllocated(e.target.value)}
          />
          <button onClick={save}>Save</button>
        </>
      ) : (
        <>
          ₹{category.allocated} spent ₹{category.spent}
          <button onClick={() => setIsEditing(true)}>✏️</button>
        </>
      )}
      <button onClick={handleDelete}>❌</button>
    </li>
  );
}

export default CategoryItem