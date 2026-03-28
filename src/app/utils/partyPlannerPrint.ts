import { standardRecipes } from "../pages/CreateRecipes";
import { COFFEE_TO_BUILDER_RECIPE } from "../data/builderRecipeMaps";
import { recipes as siteRecipes, type Recipe } from "../data/recipes";
import { quickShopFromGrams, templateAmountToGrams } from "./partySnackGrocery";

export type PlannerItemLike = {
  id: string;
  name: string;
  route: string;
  qty: number;
  mgEach: number;
  unitLabel: string;
};

type StandardTemplate = {
  id: string;
  name: string;
  servings: number;
  ingredients: string[];
  amounts: number[];
  units: string[];
  instructions: string[];
};

/** Map short builder URL ids to canonical template ids in standardRecipes */
export function canonicalBuilderRecipeId(raw: string): string {
  return COFFEE_TO_BUILDER_RECIPE[raw] ?? raw;
}

/** Builder recipe ids that match recipes.ts but with different slugs */
const BUILDER_TO_SITE_RECIPE_ID: Record<string, string> = {
  brownies: "classic-brownies",
  "sugar-cookies": "infused-sugar-cookies",
  "chocolate-chip-cookies": "cannabis-cookies",
  gummies: "classic-gummies",
};

function parseRoute(route: string): { category: string | null; recipe: string | null } {
  if (!route.startsWith("/ingredients")) return { category: null, recipe: null };
  const q = route.split("?")[1] ?? "";
  const p = new URLSearchParams(q);
  return { category: p.get("category"), recipe: p.get("recipe") };
}

/** Default builder templates for showcase routes with no ?recipe= param */
const ROUTE_HINT_TO_TEMPLATE: Record<string, { category: string; id: string }> = {
  "/spreads-dips": { category: "spreads-dips", id: "spinach-artichoke-dip-infused" },
  "/popcorn": { category: "snacks", id: "caramel-popcorn" },
};

export function findStandardTemplate(route: string): StandardTemplate | null {
  let { category, recipe } = parseRoute(route);
  if (!recipe) {
    const hint = ROUTE_HINT_TO_TEMPLATE[route.split("?")[0] || route];
    if (hint) {
      category = hint.category;
      recipe = hint.id;
    } else {
      return null;
    }
  }
  const canonical = canonicalBuilderRecipeId(recipe);
  const cats = category && standardRecipes[category] ? [category] : Object.keys(standardRecipes);
  for (const cat of cats) {
    const list = standardRecipes[cat];
    if (!list) continue;
    const found = list.find((r) => r.id === canonical || r.id === recipe);
    if (found) return found as StandardTemplate;
  }
  return null;
}

export function findSiteRecipe(route: string): Recipe | null {
  const { recipe } = parseRoute(route);
  if (!recipe) return null;
  const canonical = canonicalBuilderRecipeId(recipe);
  const siteId = BUILDER_TO_SITE_RECIPE_ID[recipe] ?? BUILDER_TO_SITE_RECIPE_ID[canonical];
  if (siteId) {
    const byMap = siteRecipes.find((r) => r.id === siteId);
    if (byMap) return byMap;
  }
  return siteRecipes.find((r) => r.id === canonical || r.id === recipe) ?? null;
}

function roundAmount(n: number, unit: string): string {
  if (unit === "large" || unit === "medium" || unit === "small") {
    return String(Math.max(1, Math.ceil(n)));
  }
  if (unit === "g" || unit === "ml") {
    if (n >= 500) return n.toFixed(0);
    if (n >= 50) return n.toFixed(0);
    return n % 1 === 0 ? String(n) : n.toFixed(1);
  }
  if (unit === "tsp" || unit === "tbsp") {
    return n < 0.25 ? n.toFixed(2) : n < 2 ? n.toFixed(1) : n.toFixed(1);
  }
  if (unit === "cups" || unit === "cup") {
    return n.toFixed(n < 2 ? 2 : 1);
  }
  return n % 1 === 0 ? String(n) : n.toFixed(1);
}

/** Friendly retail hint for common staples (optional line in parentheses) */
function retailHint(ingredientName: string, scaledAmount: number, unit: string): string | null {
  const lower = ingredientName.toLowerCase();
  if (unit === "g" && (lower.includes("rice") && lower.includes("cereal"))) {
    const ozPerBox = 12;
    const gPerOz = 28.35;
    const gPerBox = ozPerBox * gPerOz;
    const boxes = Math.max(1, Math.ceil(scaledAmount / gPerBox));
    return `${boxes} box${boxes > 1 ? "es" : ""} (~${ozPerBox} oz / ~${Math.round(gPerBox)} g ea.)`;
  }
  if (unit === "g" && /\bbutter\b/i.test(ingredientName) && scaledAmount >= 50) {
    const stickG = 113;
    const sticks = scaledAmount / stickG;
    if (sticks >= 1.2) return `~${sticks.toFixed(1)} sticks (${stickG} g each) if using US butter sticks`;
  }
  return null;
}

export function formatScaledTemplateLine(
  ingredientName: string,
  amount: number,
  unit: string,
  scale: number
): string {
  const scaled = amount * scale;
  const amt = roundAmount(scaled, unit);
  const base = `${amt} ${unit} ${ingredientName}`.replace(/\s+/g, " ").trim();
  const hint = retailHint(ingredientName, scaled, unit);
  return hint ? `${base} (${hint})` : base;
}

/** Scale string ingredients from recipes.ts (best-effort multiply leading number) */
export function scaleSiteRecipeIngredientLine(line: string, scale: number): string {
  if (scale === 1) return line;
  const t = line.trim();
  const range = t.match(/^(\d+)\s*[–-]\s*(\d+)\s+(.+)$/);
  if (range) {
    const a = Math.round(Number(range[1]) * scale);
    const b = Math.round(Number(range[2]) * scale);
    return `${a}–${b} ${range[3]}`;
  }
  const frac = t.match(/^(\d+)\/(\d+)\s+(.*)$/);
  if (frac) {
    const v = (Number(frac[1]) / Number(frac[2])) * scale;
    return `${v < 1 ? v.toFixed(2) : v.toFixed(1)} ${frac[3]}`;
  }
  const lead = t.match(/^(\d+(?:\.\d+)?)\s+(.*)$/);
  if (lead) {
    const v = Number(lead[1]) * scale;
    const rest = lead[2];
    const vStr = v % 1 === 0 ? String(Math.round(v)) : v.toFixed(1);
    return `${vStr} ${rest}`;
  }
  return `×${scale.toFixed(2)} recipe: ${t}`;
}

export type ResolvedPlannerRecipe = {
  item: PlannerItemLike;
  template: StandardTemplate | null;
  siteRecipe: Recipe | null;
  scale: number;
};

export function resolvePlannerRecipes(items: PlannerItemLike[]): ResolvedPlannerRecipe[] {
  return items.map((item) => {
    const template = findStandardTemplate(item.route);
    const siteRecipe = template ? null : findSiteRecipe(item.route);
    const baseRecipe = template ?? siteRecipe;
    const baseServings = baseRecipe ? Math.max((baseRecipe as StandardTemplate).servings ?? (baseRecipe as Recipe).servings ?? 1, 1) : 1;
    const scale = baseRecipe ? Math.max(item.qty / baseServings, 0.25) : 1;
    return { item, template, siteRecipe, scale };
  });
}

function categorizeIngredientLine(ingredient: string): string {
  const i = ingredient.toLowerCase();
  if (/(wing|chicken|beef|pork|meat|bacon|steak)/.test(i)) return "Meat & Seafood";
  if (/(milk|butter|cheese|cream|yogurt|egg)/.test(i)) return "Dairy & Eggs";
  if (/(pepper|paprika|garlic powder|onion powder|cumin|chili|spice|salt|seasoning)/.test(i)) return "Spices & Seasonings";
  if (/(flour|sugar|oil|vinegar|ketchup|bbq|honey|mustard|soy|cornstarch|rice|pasta|bread|cocoa|chips|cereal|marshmallow)/.test(i)) return "Pantry";
  if (/(lemon|lime|onion|garlic|herb|parsley|cilantro|potato|spinach|artichoke)/.test(i)) return "Produce";
  if (/(coffee|tea|soda|juice|water)/.test(i)) return "Beverages";
  return "Other";
}

function quickLineForScaledIngredient(name: string, amount: number, unit: string, scale: number): string {
  const scaled = amount * scale;
  if (unit === "pieces" || unit === "cloves") {
    return `${Math.round(scaled)} ${unit} ${name}`;
  }
  if (unit === "large" || unit === "medium" || unit === "small") {
    return `${Math.round(scaled)} large eggs`;
  }
  if (unit === "ml" || unit === "L") {
    const ml = unit === "L" ? scaled * 1000 : scaled;
    return quickShopFromGrams(name, 0, ml);
  }
  const g = templateAmountToGrams(scaled, unit, name);
  return quickShopFromGrams(name, g, 0);
}

/** Scaled grocery lines grouped for store shopping */
export function buildAggregatedGroceryLines(
  resolved: ResolvedPlannerRecipe[],
  wingExtras?: { wingsLabel: string; wingIngredientLines: string[] } | null,
  options?: { quickShop?: boolean }
): { section: string; lines: string[] }[] {
  const quickShop = options?.quickShop === true;
  const linesBySection = new Map<string, Set<string>>();
  const push = (section: string, line: string) => {
    if (!linesBySection.has(section)) linesBySection.set(section, new Set());
    linesBySection.get(section)!.add(line);
  };

  if (wingExtras) {
    push(categorizeIngredientLine("Chicken wings"), wingExtras.wingsLabel);
    wingExtras.wingIngredientLines.forEach((ln) => push(categorizeIngredientLine(ln), ln));
  }

  resolved.forEach(({ item, template, siteRecipe, scale }) => {
    if (item.id === "wings" && wingExtras) return;
    if (item.id === "wings" && !wingExtras) {
      push(
        "Meat & Seafood",
        `${item.qty} chicken wings (open Wings builder to add flavor sauces to this list)`
      );
      return;
    }
    if (template) {
      template.ingredients.forEach((name, i) => {
        const amt = template.amounts[i] ?? 0;
        const unit = template.units[i] ?? "g";
        if (amt === 0) return;
        const line = quickShop
          ? quickLineForScaledIngredient(name, amt, unit, scale)
          : formatScaledTemplateLine(name, amt, unit, scale);
        push(categorizeIngredientLine(name), line);
      });
      return;
    }
    if (siteRecipe) {
      siteRecipe.ingredients.forEach((line) => {
        push(categorizeIngredientLine(line), scaleSiteRecipeIngredientLine(line, scale));
      });
    }
  });

  return Array.from(linesBySection.entries())
    .map(([section, set]) => ({
      section,
      lines: Array.from(set).sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.section.localeCompare(b.section));
}
