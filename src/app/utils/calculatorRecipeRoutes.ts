import { standardRecipes } from "../data/standardRecipes";

/** Matches calculator “Base Type” presets (butter, oil, honey, sugar, alcohol). */
export type InfusionCarrierKind = "fat" | "tincture" | "honey" | "sugar";

const FAT_INFUSED_NAMES = new Set([
  "Cannabutter",
  "Unsalted Butter",
  "Salted Butter",
  "Brown Butter",
  "Vegan Butter",
  "Coconut oil",
  "Cannabis Olive Oil",
  "Vegetable Oil",
  "Avocado Oil",
  "Olive Oil",
  "Shortening",
]);

function hasFatInfusion(ingredients: string[]): boolean {
  return ingredients.some((i) => FAT_INFUSED_NAMES.has(i));
}

/**
 * What kind of infused base the template expects (for mismatch hints vs calculator preset).
 */
export function inferRecipeCarrierKind(ingredients: string[]): InfusionCarrierKind {
  if (ingredients.some((i) => i === "THC Tincture")) {
    return "tincture";
  }
  const hasHoney = ingredients.some((i) => i === "Cannabis Honey");
  if (hasHoney && !hasFatInfusion(ingredients)) {
    return "honey";
  }
  if (ingredients.some((i) => i.trim().toLowerCase() === "cannabis sugar")) {
    return "sugar";
  }
  return "fat";
}

export type CalculatorRecipeOption = {
  category: string;
  id: string;
  name: string;
  servings: number;
  carrierKind: InfusionCarrierKind;
};

const CATEGORY_ORDER = [
  "baked-goods",
  "breads-breakfast",
  "wings",
  "spreads-dips",
  "snacks",
  "drinks",
  "savory-meals",
  "ice-cream",
] as const;

export const CALCULATOR_RECIPE_CATEGORY_LABEL: Record<string, string> = {
  "baked-goods": "Baked goods",
  "breads-breakfast": "Breads & breakfast",
  wings: "Wings",
  "spreads-dips": "Spreads & dips",
  snacks: "Snacks & candy",
  drinks: "Drinks & coffee",
  "savory-meals": "Savory & meals",
  "ice-cream": "Ice cream & frozen",
};

let _allCalculatorRecipes: CalculatorRecipeOption[] | null = null;

export function getAllCalculatorRecipeOptions(): CalculatorRecipeOption[] {
  if (_allCalculatorRecipes) return _allCalculatorRecipes;
  const out: CalculatorRecipeOption[] = [];
  for (const [category, list] of Object.entries(standardRecipes)) {
    for (const r of list as {
      id: string;
      name: string;
      servings: number;
      ingredients: string[];
    }[]) {
      if (!r?.id || !Array.isArray(r.ingredients)) continue;
      out.push({
        category,
        id: r.id,
        name: r.name,
        servings: Math.max(1, Number(r.servings) || 1),
        carrierKind: inferRecipeCarrierKind(r.ingredients),
      });
    }
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  _allCalculatorRecipes = out;
  return out;
}

export function groupCalculatorRecipesForSelect(): { category: string; label: string; recipes: CalculatorRecipeOption[] }[] {
  const all = getAllCalculatorRecipeOptions();
  const byCat = new Map<string, CalculatorRecipeOption[]>();
  for (const r of all) {
    if (!byCat.has(r.category)) byCat.set(r.category, []);
    byCat.get(r.category)!.push(r);
  }
  for (const arr of byCat.values()) {
    arr.sort((a, b) => a.name.localeCompare(b.name));
  }
  const ordered: { category: string; label: string; recipes: CalculatorRecipeOption[] }[] = [];
  const seen = new Set<string>();
  for (const cat of CATEGORY_ORDER) {
    const recipes = byCat.get(cat);
    if (recipes?.length) {
      ordered.push({
        category: cat,
        label: CALCULATOR_RECIPE_CATEGORY_LABEL[cat] ?? cat,
        recipes,
      });
      seen.add(cat);
    }
  }
  for (const cat of byCat.keys()) {
    if (seen.has(cat)) continue;
    const recipes = byCat.get(cat)!;
    ordered.push({
      category: cat,
      label: CALCULATOR_RECIPE_CATEGORY_LABEL[cat] ?? cat,
      recipes,
    });
  }
  return ordered;
}

/** Maps INFUSION_PRESETS `id` from calculator page. */
export function userCarrierFromInfusionPresetId(presetId: string): InfusionCarrierKind {
  if (presetId === "butter" || presetId === "oil") return "fat";
  if (presetId === "alcohol") return "tincture";
  if (presetId === "honey") return "honey";
  if (presetId === "sugar") return "sugar";
  return "fat";
}

const KIND_LABEL: Record<InfusionCarrierKind, string> = {
  fat: "butter or oil infusion (cannabutter, infused coconut oil, etc.)",
  tincture: "alcohol / THC tincture",
  honey: "cannabis honey",
  sugar: "cannabis sugar",
};

/**
 * If null, user’s calculator base matches the template’s expected carrier family.
 */
export function carrierMismatchMessage(
  userKind: InfusionCarrierKind,
  recipeKind: InfusionCarrierKind
): string | null {
  if (userKind === recipeKind) return null;
  return `This recipe is built for a ${KIND_LABEL[recipeKind]}. Your calculator is set up for a ${KIND_LABEL[userKind]} — those don’t swap 1:1 in the builder. You’d need a ${KIND_LABEL[recipeKind]} to match this template, or choose a recipe that matches the base you made.`;
}

export function recipeKey(category: string, id: string): string {
  return `${category}|${id}`;
}

export function parseRecipeKey(key: string): { category: string; id: string } | null {
  const i = key.indexOf("|");
  if (i <= 0) return null;
  return { category: key.slice(0, i), id: key.slice(i + 1) };
}
