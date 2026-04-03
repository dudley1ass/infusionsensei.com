import type { Recipe } from "../data/recipeTypes";
import { POPCORN_TO_BUILDER_RECIPE, WING_SAUCE_TO_BUILDER_RECIPE } from "../data/builderRecipeMaps";

/** Tighter marketing crops — show more of the frame with contain + backing */
const SPREAD_SNACK_ZOOM_OUT_IDS = new Set([
  "ranch-dip-infused",
  "honey-mustard-dip-infused",
  "garlic-aioli-infused",
  "queso-dip-infused",
  "spinach-artichoke-dip-infused",
  "chex-mix-infused",
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
  if (SPREAD_SNACK_ZOOM_OUT_IDS.has(canonicalSpreadSnackId(recipeId))) return true;
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
  if (SPREAD_SNACK_ZOOM_OUT_IDS.has(recipeId)) return ZOOM;
  return COVER;
}
