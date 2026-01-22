import { useState } from "react";

function BudgetForm({ onUpdate }) {
  const [total, setTotal] = useState("");

  return (
    <div>
      <input
        placeholder="Total Budget"
        value={total}
        onChange={e => setTotal(e.target.value)}
      />
      <button onClick={() => onUpdate(Number(total))}>
        Set Total
      </button>
    </div>
  );
}

export default BudgetForm;