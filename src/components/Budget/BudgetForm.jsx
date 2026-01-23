import { useState } from "react";
import { UPDATE_BUDGET_TOTAL } from "../../graphql/mutations";
import { GET_BUDGET } from "../../graphql/queries"
import { useMutation } from "@apollo/client";

function BudgetForm() {
  const [total, setTotal] = useState("");
  const [updateBudgetTotal, { loading, error }] = useMutation(
    UPDATE_BUDGET_TOTAL,
    {
      refetchQueries: [{ query: GET_BUDGET, fetchPolicy: 'network-only' }],
    }
  );

  const handleSubmit = async () => {
    const value = Number(total);
    if (!value || value <= 0) return;

    try {
      await updateBudgetTotal({
        variables: {
           total: value,
        },
      });

      setTotal("");
    } catch (err) {
      console.error(err);
    }
  }



  return (
    <div>
      <input
        placeholder="Total Budget"
        value={total}
        onChange={e => setTotal(e.target.value)}
      />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Set Total"}
      </button>
      {error && <p style={{ color: "red" }}>Failed to update budget</p>}
    </div>
  );
}

export default BudgetForm;