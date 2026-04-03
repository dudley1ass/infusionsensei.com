import type { Recipe } from "../data/recipeTypes";

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

/** Whether this recipe should use a less aggressive crop (zoomed-out look). */
export function recipeHeroUsesZoomOut(recipeId: string, category?: Recipe["category"] | string): boolean {
  if (category === "drinks") return true;
  if (SPREAD_SNACK_ZOOM_OUT_IDS.has(canonicalSpreadSnackId(recipeId))) return true;
  return false;
}

/** Full `className` for recipe hero/thumbnail images (no hover utilities). */
export function recipeHeroImgClass(recipeId: string, category?: Recipe["category"] | string): string {
  return recipeHeroUsesZoomOut(recipeId, category) ? ZOOM : COVER;
}

/** Start Here picker: pass `drinks` when `selectedCategory === "drinks"` so drink templates zoom out. */
export function recipeHeroImgClassForPicker(recipeId: string, selectedCategory: string | undefined): string {
  if (selectedCategory === "drinks") return ZOOM;
  if (SPREAD_SNACK_ZOOM_OUT_IDS.has(recipeId)) return ZOOM;
  return COVER;
}
