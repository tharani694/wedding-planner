import { useEffect, useState } from "react";
import BudgetForm from "./BudgetForm";
import BudgetSummary from "./BudgetSummary";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

function BudgetPage({budget, setBudget}) {
  useEffect(() => {
    fetch("http://localhost:4000/budget")
      .then(res => res.json())
      .then(data => setBudget({
        total: data.total ?? 0,
        categories: data.categories ?? []
      }));
  }, []);

  const totalAllocated = budget.categories.reduce(
    (sum, c) => sum + Number(c.allocated || 0),
    0
  );

  const totalSpent = budget.categories.reduce(
    (sum, c) => sum + Number(c.spent || 0),
    0
  )

  async function updateTotal(total) {
    const res = await fetch("http://localhost:4000/budget/total", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ total })
    });
    const data = await res.json();
    setBudget(data);
  }

  async function addCategory(category) {
    const res = await fetch("http://localhost:4000/budget/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category)
    });
    const saved = await res.json();
    setBudget(prev => ({
      ...prev,
      categories: [...prev.categories, saved]
    }));
  }

  async function deleteCategory(id) {
    await fetch(`http://localhost:4000/budget/categories/${id}`, {
      method: "DELETE"
    });

    setBudget(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c.id !== id)
    }));
  }

  async function updateCategory(id, updates) {
    await fetch(`http://localhost:4000/budget/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates)
    });
  
    setBudget(prev => ({
      ...prev,
      categories: prev.categories.map(c =>
        c.id === id ? { ...c, ...updates } : c
      )
    }));
  }

  return (
    <div>
      <h2>Budget</h2>

      <BudgetForm onUpdate={updateTotal} />
      <BudgetSummary
        total={budget.total}
        allocated={totalAllocated}
        spent={totalSpent}
      />

      <hr />

      <CategoryForm onAdd={addCategory} />
      <CategoryList
        categories={budget.categories}
        onDelete={deleteCategory}
        onUpdate={updateCategory}
      />
    </div>
  );
}

export default BudgetPage;
