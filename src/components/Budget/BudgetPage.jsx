import { useQuery } from "@apollo/client";
import BudgetForm from "./BudgetForm";
import BudgetSummary from "./BudgetSummary";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";

import {
  GET_BUDGET
} from "../../graphql/queries";

function BudgetPage() {
  const { data, loading, error } = useQuery(GET_BUDGET);

  if (loading) return <p>Loading budget...</p>;
  if (error) return <p>Error loading budget</p>;

  const budget = data?.budget;
  const categories = budget?.categories || [];

  return (
    <div>
      <h2>Budget</h2>
      <BudgetForm />
      <BudgetSummary budget={budget}/>
      <hr />
      <CategoryForm />
      <CategoryList categories={categories} />
    </div>
  );
}

export default BudgetPage;
