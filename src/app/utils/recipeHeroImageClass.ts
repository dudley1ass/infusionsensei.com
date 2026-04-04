import type { Recipe } from "../data/recipeTypes";
import { POPCORN_TO_BUILDER_RECIPE, WING_SAUCE_TO_BUILDER_RECIPE } from "../data/builderRecipeMaps";

/**
 * Marketing heroes that read better with `object-contain` (dips/sauces, selected baked goods, wings).
 * Also check `canonicalSpreadSnackId` for `spreads-dips-*` aliases.
 */
const HERO_ZOOM_OUT_MARKETING_IDS = new Set([
  "ranch-dip-infused",
  "honey-mustard-dip-infused",
  "garlic-aioli-infused",
  "queso-dip-infused",
  "spinach-artichoke-dip-infused",
  "chex-mix-infused",
  "bbq-sauce-infused-party",
  "sweet-chili-sauce-infused",
  "cheese-sauce-infused",
  "buffalo-dip-infused",
  "infused-peanut-butter-spread",
  "infused-almond-butter-spread",
  "infused-cream-cheese-whipped",
  "sweet-honey-cream-cheese-spread-infused",
  "herb-garlic-cream-cheese-spread-infused",
  "infused-nuts",
  "meatballs-infused-glaze",
  "mini-brownie-bites",
  "maple-bacon",
  "white-chocolate-macadamia-cookies",
  "classic-cannabutter",
  "gingerbread-cookies",
  "coffee-cake",
  "chocolate-cupcakes",
  "lemon-cake",
  "lemon-bars",
  "smores-bars",
  "classic-buffalo",
  "nashville-hot-wings",
  "nashville-hot",
  "truffle-butter",
  "ranch-butter",
  "honey-mustard",
  "honey-bbq",
  "chili-crisp",
  "brown-sugar-bourbon",
  "pineapple-ginger",
  "blondie-squares",
  "banana-bread",
  "pancakes",
]);

const ZOOM =
  "h-full w-full object-contain object-center bg-neutral-100";
const COVER = "h-full w-full object-cover object-center";

function canonicalSpreadSnackId(recipeId: string): string {
  return recipeId.startsWith("spreads-dips-") ? recipeId.slice("spreads-dips-".length) : recipeId;
}

/** Flavor slugs shared by wing + popcorn maps — id alone is ambiguous on merged catalog cards. */
const WING_POPCORN_ID_COLLISION = new Set(
  Object.keys(POPCORN_TO_BUILDER_RECIPE).filter((id) => WING_SAUCE_TO_BUILDER_RECIPE[id] !== undefined)
);

function isPopcornHeroZoomById(recipeId: string): boolean {
  if (recipeId.endsWith("-popcorn") || recipeId === "kettle-corn-infused" || recipeId === "candy-coated-popcorn") {
    return true;
  }
  if (POPCORN_TO_BUILDER_RECIPE[recipeId] === undefined) return false;
  if (WING_POPCORN_ID_COLLISION.has(recipeId)) return false;
  return true;
}

/** Whether this recipe should use a less aggressive crop (zoomed-out look). */
export function recipeHeroUsesZoomOut(recipeId: string, category?: Recipe["category"] | string): boolean {
  if (category === "drinks") return true;
  if (category === "snacks" && POPCORN_TO_BUILDER_RECIPE[recipeId] !== undefined) return true;
  const canonical = canonicalSpreadSnackId(recipeId);
  if (HERO_ZOOM_OUT_MARKETING_IDS.has(recipeId) || HERO_ZOOM_OUT_MARKETING_IDS.has(canonical)) return true;
  if (isPopcornHeroZoomById(recipeId)) return true;
  return false;
}

/** Full `className` for recipe hero/thumbnail images (no hover utilities). */
export function recipeHeroImgClass(recipeId: string, category?: Recipe["category"] | string): string {
  return recipeHeroUsesZoomOut(recipeId, category) ? ZOOM : COVER;
}

/** Start Here picker: pass `drinks` when `selectedCategory === "drinks"` so drink templates zoom out. */
export function recipeHeroImgClassForPicker(recipeId: string, selectedCategory: string | undefined): string {
  if (selectedCategory === "drinks") return ZOOM;
  if (selectedCategory === "snacks" && POPCORN_TO_BUILDER_RECIPE[recipeId] !== undefined) return ZOOM;
  const canonical = canonicalSpreadSnackId(recipeId);
  if (HERO_ZOOM_OUT_MARKETING_IDS.has(recipeId) || HERO_ZOOM_OUT_MARKETING_IDS.has(canonical)) return ZOOM;
  return COVER;
}
