function BudgetSummary({ total, allocated, spent}) {
    return (
      <div>
        <p>Total Budget: ₹{total}</p>
        <p>Allocated: ₹{allocated}</p>
        <p>Remaining: ₹{total - spent}</p>
      </div>
    );
  }
  
  export default BudgetSummary;