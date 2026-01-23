import { useQuery } from "@apollo/client";
import { GET_BUDGET } from "../../graphql/queries";
import CategoryItem from "./CategoryItem";

function CategoryList({ categories }) {
  if (!categories.length) return <p>No categories yet</p>;

  return (
    <ul>
      {categories?.map((c) => (
        <CategoryItem key={c.id} category={c} />
      ))}
    </ul>
  );
}

export default CategoryList;