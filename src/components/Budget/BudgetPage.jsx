import { useQuery } from "@apollo/client";
import BudgetForm from "./BudgetForm";
import BudgetSummary from "./BudgetSummary";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import { Paper, Typography, Divider, Stack, Container, Grid, TextField, Button, Box } from "@mui/material";

import {
  GET_BUDGET
} from "../../graphql/queries";

const BudgetPage = () => {
  const { data, loading, error } = useQuery(GET_BUDGET);

  if (loading) return <p>Loading budget...</p>;
  if (error) return <p>Error loading budget</p>;

  const budget = data?.budget;
  const categories = budget?.categories || [];

  return (
  <Paper
    elevation={4}
    sx={{
      height: "70vh",
      borderRadius: 4,
      p: 3,
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography variant="h4" mb={3} fontWeight="bold">
      Budget
    </Typography>
    <Grid container spacing={3} mb={3} justifyContent="center">
      <Grid item xs={12} md={4}>
        <BudgetForm />
      </Grid>
      <Grid item xs={12} md={8}>
        <Grid container spacing={2}>
          <BudgetSummary budget={budget} />
        </Grid>
      </Grid>
    </Grid>
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        overflowY: "auto",
        borderTop: "1px solid #eee",
        pt: 2,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Categories
      </Typography>
      
      <Box sx={{ mb: 2}}>
        <CategoryForm />
      </Box>
      <Box sx={{ flex: 1, pr: 1, overflowY: "auto" }}>
      <CategoryList categories={categories} />
      </Box>
    </Box>
  </Paper>
  )
}

export default BudgetPage;
