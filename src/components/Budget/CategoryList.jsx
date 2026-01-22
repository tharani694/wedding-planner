import CategoryItem from "./CategoryItem";

function CategoryList({ categories, onDelete, onUpdate }) {
  return (
    <ul>
      {categories.map(c => (
        <CategoryItem
          key={c.id}
          category={c}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

export default CategoryList;