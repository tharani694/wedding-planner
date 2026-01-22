import { useState } from "react";


function CategoryItem({ category, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [allocated, setAllocated] = useState(category.allocated)


    function save() {
        onUpdate(category.id, {allocated: Number(allocated)})
        setIsEditing(false)
    }
    return (
      <li>
        <strong>{category.name}</strong>
        {isEditing ? (
            <>
            <input 
                value={allocated}
                onChange={e => setAllocated(e.target.value)}
            />
            <button onClick={save}>Save</button>
            </>

        ):(
            <>
            ₹{category.allocated} spent ₹{category.spent}
            <button onClick={() => setIsEditing(true)}>✏️</button>
            </>
        )}
        <button onClick={() => onDelete(category.id)}>❌</button>
      </li>
    );
  }
  
  export default CategoryItem;