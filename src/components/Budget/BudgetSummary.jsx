import { Grid, Card, CardContent, Typography, Paper } from "@mui/material";

const BudgetSummary = ({ budget }) => {
  if (!budget) return null

  const totalAllocated = budget?.categories?.reduce(
    (sum, c) => sum + Number(c.allocated || 0),
    0
  );

  const totalSpent = budget?.categories?.reduce(
    (sum, c) => sum + Number(c.spent || 0),
    0
  );

  const remaining = budget?.total - totalSpent;
  const overSpend = totalSpent > budget?.total;
  const overAllocated = totalAllocated > budget?.total;

  return (
    <Grid container spacing={2}>
      <Grid xs={6}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary">Total Budget</Typography>
          <Typography variant="h6" fontWeight="bold">₹{budget.total}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            textAlign: "center",
            color: overAllocated ? 'error.main' : 'inherit',
          }}
        >
          <Typography variant="body2" color="textSecondary">Allocated</Typography>
          <Typography variant="h6" fontWeight="bold">₹{totalAllocated}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            textAlign: "center",
            color: overSpend ? 'error.main' : 'inherit',
          }}
        >
          <Typography variant="body2" color="textSecondary">Spent</Typography>
          <Typography variant="h6" fontWeight="bold">₹{totalSpent}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Paper
          sx={{
            p: 2,
            borderRadius: 3,
            textAlign: "center",
            color: overSpend ? 'error.main' : 'inherit',
          }}
        >
          <Typography variant="body2" color="textSecondary">Remaining</Typography>
          <Typography variant="h6" fontWeight="bold">₹{remaining}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default BudgetSummary;
