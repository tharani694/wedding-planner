import { useState } from "react";
import { UPDATE_BUDGET_TOTAL } from "../../graphql/mutations";
import { GET_BUDGET } from "../../graphql/queries"
import { useMutation } from "@apollo/client";
import { TextField, Button, Stack } from "@mui/material";

const BudgetForm = () => {
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
    <Stack spacing={2}>
      <TextField
        label="Total Budget"
        type="number"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
        size="small"
      />
      <Button
        variant="contained"
        onClick={handleSubmit}
        disabled={loading}
        size="small"
      >
        {loading ? "Saving..." : "Set Total"}
      </Button>
    </Stack>
  )
}

export default BudgetForm;
