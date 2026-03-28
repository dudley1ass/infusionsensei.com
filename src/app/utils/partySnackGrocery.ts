/** Scaled grocery math for Party Snacks — uses same templates & scaling as the recipe builder. */

export type GroceryIngredientLine = {
  name: string;
  amount: number;
  unit: string;
  displayAmount: string;
};

export type RecipeGrocerySection = {
  recipeId: string;
  recipeName: string;
  lines: GroceryIngredientLine[];
};

type TemplateRecipe = {
  id: string;
  name: string;
  servings: number;
  ingredients: string[];
  amounts: number[];
  units?: string[];
};

function findStandardRecipe(
  standardRecipes: Record<string, TemplateRecipe[]>,
  recipeId: string
): TemplateRecipe | null {
  for (const list of Object.values(standardRecipes)) {
    const r = list.find((x) => x.id === recipeId);
    if (r) return r;
  }
  return null;
}

export function formatIngredientAmount(amount: number, unit: string): string {
  if (unit === "pieces" || unit === "large" || unit === "cloves") {
    const n = Math.round(amount);
    return `${n}${unit === "large" ? " large" : unit === "cloves" ? ` ${unit}` : unit === "pieces" ? " pcs" : ""}`.trim();
  }
  if (unit === "tsp") {
    return `${Math.round(amount * 10) / 10} tsp`;
  }
  const rounded = amount >= 100 ? Math.round(amount) : Math.round(amount * 10) / 10;
  return `${rounded} ${unit}`;
}

export function buildPartySnackGrocery(
  standardRecipes: Record<string, TemplateRecipe[]>,
  recipeIds: string[],
  guestCount: number
): { sections: RecipeGrocerySection[]; combined: GroceryIngredientLine[] } {
  const guests = Math.max(1, guestCount);
  const sections: RecipeGrocerySection[] = [];
  const mergeMap = new Map<string, { name: string; amount: number; unit: string }>();

  for (const recipeId of recipeIds) {
    const recipe = findStandardRecipe(standardRecipes, recipeId);
    if (!recipe?.amounts?.length || !recipe.ingredients?.length) continue;

    const scale = guests / Math.max(1, recipe.servings);
    const lines: GroceryIngredientLine[] = recipe.ingredients.map((name, i) => {
      const amount = recipe.amounts[i] * scale;
      const unit = recipe.units?.[i] ?? "g";
      const displayAmount = formatIngredientAmount(amount, unit);
      const key = `${name}\0${unit}`;
      const prev = mergeMap.get(key);
      if (prev) prev.amount += amount;
      else mergeMap.set(key, { name, amount, unit });
      return { name, amount, unit, displayAmount };
    });

    sections.push({ recipeId, recipeName: recipe.name, lines });
  }

  const combined: GroceryIngredientLine[] = Array.from(mergeMap.values())
    .map(({ name, amount, unit }) => ({
      name,
      amount,
      unit,
      displayAmount: formatIngredientAmount(amount, unit),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { sections, combined };
}

export function grocerySectionForIngredient(name: string): string {
  const i = name.toLowerCase();
  if (/(chicken wing|chicken tender|beef|pork|meatball|sausage|hot dog|ground beef)/i.test(name)) return "Meat & proteins";
  if (/(milk|butter|cheese|cream|egg|parmesan|mayonnaise|sour cream)/i.test(i)) return "Dairy & eggs";
  if (/(popcorn kernel|pretzel|cracker|chex|panko|flour|cereal|rice cereal|chip)/i.test(i)) return "Bakery & dry goods";
  if (/(salt|pepper|paprika|garlic powder|spice|seasoning|cinnamon|italian seasoning|ranch|cayenne)/i.test(i)) return "Spices & seasonings";
  if (/(garlic|potato|onion|lemon|lime|spinach|artichoke|herb|parsley)/i.test(i)) return "Produce & frozen";
  if (/(oil|sugar|honey|syrup|ketchup|mustard|vinegar|sauce|chocolate| cocoa|gelatin|jello|marshmallow|chips)/i.test(i)) return "Pantry & sweet";
  if (/(coffee|tea|juice|water|tonic)/i.test(i)) return "Beverages";
  if (/(cannabutter|cannabis|thc|tincture)/i.test(i)) return "Infusion (plan separately)";
  return "Other";
}
