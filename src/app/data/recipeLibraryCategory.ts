import { standardRecipes } from "./standardRecipes";

/**
 * Manual catalog rows that are not in `standardRecipes` — map to the same library keys as
 * `/ingredients` (Start Here) category picker.
 */
const MANUAL_RECIPE_LIBRARY: Record<string, string> = {
  "classic-cannabutter": "basics",
  "cannabis-oil": "basics",
  "canna-honey": "infusions",
  "infused-mint-ice-cream": "ice-cream",
  "infused-pizza-sauce": "savory-meals",
  "infused-protein-smoothie": "drinks",
  "infused-mac-and-cheese": "savory-meals",
};

let _templateIdToLibrary: Record<string, string> | null = null;

function templateIdToLibrary(): Record<string, string> {
  if (_templateIdToLibrary) return _templateIdToLibrary;
  const m: Record<string, string> = {};
  for (const [key, list] of Object.entries(standardRecipes)) {
    for (const raw of list as { id: string }[]) {
      if (raw?.id) m[raw.id] = key;
    }
  }
  _templateIdToLibrary = m;
  return m;
}

/** Builder / Start Here category id for a recipe (matches `recipeCategories` in CreateRecipes + basics/infusions). */
export function getRecipeLibraryCategory(recipeId: string): string {
  if (recipeId.startsWith("spreads-dips-")) return "spreads-dips";
  const fromTemplate = templateIdToLibrary()[recipeId];
  if (fromTemplate) return fromTemplate;
  return MANUAL_RECIPE_LIBRARY[recipeId] ?? "snacks";
}

/** Tabs on Recipe Library — same order and labels as Start Here category picker, plus Basics & Infusions. */
export const RECIPE_LIBRARY_TABS: { id: string; label: string }[] = [
  { id: "all", label: "All Recipes" },
  { id: "baked-goods", label: "🍪 Baked Goods" },
  { id: "wings", label: "🍗 Wings" },
  { id: "spreads-dips", label: "🥣 Spreads & Dips" },
  { id: "snacks", label: "🍿 Snacks & Candy" },
  { id: "drinks", label: "🥤 Drinks & Coffee" },
  { id: "savory-meals", label: "🍝 Savory & Meals" },
  { id: "ice-cream", label: "🍨 Ice Cream & Frozen" },
  { id: "breads-breakfast", label: "🍞 Breads & Breakfast" },
  { id: "basics", label: "🧈 Basics" },
  { id: "infusions", label: "🍯 Infusions" },
];

const LIBRARY_BADGE_LABEL: Record<string, string> = {
  all: "All",
  "baked-goods": "Baked goods",
  wings: "Wings",
  "spreads-dips": "Spreads & dips",
  snacks: "Snacks & candy",
  drinks: "Drinks",
  "savory-meals": "Savory & meals",
  "ice-cream": "Ice cream",
  "breads-breakfast": "Breads & breakfast",
  basics: "Basics",
  infusions: "Infusions",
};

export function recipeLibraryBadgeLabel(libraryKey: string): string {
  return LIBRARY_BADGE_LABEL[libraryKey] ?? libraryKey;
}
