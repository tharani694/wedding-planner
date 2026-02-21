import { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_BUDGET_CATEGORY } from "../../graphql/mutations";
import { GET_BUDGET } from "../../graphql/queries";
import { TextField, Button, Stack, Grid } from "@mui/material";

const CategoryForm = () => {
  const [name, setName] = useState("");
  const [allocated, setAllocated] = useState("");

  const [addBudgetCategory, { loading }] = useMutation(
    ADD_BUDGET_CATEGORY, 
    { refetchQueries: [{ query: GET_BUDGET , fetchPolicy: 'network-only'}] }
  );

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
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={5}>
        <TextField
          label="Category"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
        />
      </Grid>

      <Grid item xs={5}>
        <TextField
          label="Allocated"
          type="number"
          value={allocated}
          onChange={(e) => setAllocated(e.target.value)}
          size="small"
        />
      </Grid>

      <Grid item xs={2}>
        <Button
          variant="contained"
          size="small"
          onClick={handleAdd}
          disabled={loading}
          fullWidth
          >
            Add
          </Button>
        </Grid>
      </Grid>
  );
}

export default CategoryForm;
