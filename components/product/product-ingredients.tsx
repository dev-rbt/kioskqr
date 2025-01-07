interface ProductIngredientsProps {
  ingredients: string[];
}

export function ProductIngredients({ ingredients }: ProductIngredientsProps) {
  return (
    <div className="p-4 bg-secondary rounded-lg">
      <h2 className="text-lg font-semibold mb-2">İçindekiler</h2>
      <ul className="grid grid-cols-2 gap-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient} className="text-muted-foreground">
            • {ingredient}
          </li>
        ))}
      </ul>
    </div>
  );
}
