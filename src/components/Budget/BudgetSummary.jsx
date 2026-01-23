function BudgetSummary({ budget }) {
  if (!budget) {
    return <p>Total: Loading budget...</p>;
  }

  const totalAllocated = budget?.categories.reduce(
    (sum, c) => sum + Number(c.allocated || 0),
    0
  );

  const totalSpent = budget?.categories.reduce(
    (sum, c) => sum + Number(c.spent || 0),
    0
  );

  return (
    <div>
      <p>Total Budget: ₹{budget?.total}</p>
      <p>Allocated: ₹{totalAllocated}</p>
      <p>Remaining: ₹{budget.total - totalSpent}</p>
      {budget.categories.length === 0 ? (
        <p>No categories yet. Add your first one!</p>
        ) : (
          <ul>
            {budget?.categories.map((cat) => (
              <li key={cat.id}>
                {cat.name} - Allocated: {cat.allocated}, Spent: {cat.spent}
              </li>
            ))}
          </ul>
      )}
    </div>
  );
}

export default BudgetSummary;