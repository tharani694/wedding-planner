import { useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_BUDGET_CATEGORY, DELETE_BUDGET_CATEGORY } from "../../graphql/mutations";
import { GET_BUDGET } from "../../graphql/queries";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const CategoryItem = ({ category }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [allocated, setAllocated] = useState(category.allocated);

  const [updateBudgetCategory] = useMutation(
    UPDATE_BUDGET_CATEGORY, 
    { refetchQueries: [{ query: GET_BUDGET, fetchPolicy: 'network-only' }]}
  );
  
  const [deleteBudgetCategory] = useMutation(
    DELETE_BUDGET_CATEGORY, 
    { refetchQueries: [{ query: GET_BUDGET, fetchPolicy: 'network-only' }]}
  );

  const handleSave = async () => {
    try {
      await updateBudgetCategory({
        variables: {
          input: {
            id: category?.id,
            name: category?.name,
            allocated: Number(allocated),
          },
        },
      });
      setOpen(false);
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
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between">
            <div>
              <Typography variant="h6">{category.name}</Typography>
              <Typography variant="body2">
                ₹{category.allocated} | Spent ₹{category.spent}
              </Typography>
            </div>

            <Stack direction="row">
              <IconButton onClick={() => setOpen(true)}>
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={handleDelete}
              >
                <DeleteIcon />
              </IconButton>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Allocated"
            type="number"
            fullWidth
            value={allocated}
            onChange={(e) => setAllocated(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CategoryItem
