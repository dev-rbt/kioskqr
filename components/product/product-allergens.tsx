interface ProductAllergensProps {
  allergens: string[];
}

export function ProductAllergens({ allergens }: ProductAllergensProps) {
  return (
    <div className="p-4 bg-destructive/10 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Alerjenler</h2>
      <div className="flex flex-wrap gap-2">
        {allergens.map((allergen) => (
          <span key={allergen} className="px-2 py-1 rounded-full bg-destructive/20 text-sm">
            {allergen}
          </span>
        ))}
      </div>
    </div>
  );
}
