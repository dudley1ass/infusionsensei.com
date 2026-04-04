import {
  COFFEE_TO_BUILDER_RECIPE,
  LEGACY_FRIES_RECIPE_TO_SPREADS_DIP,
  POPCORN_TO_BUILDER_RECIPE,
  WING_SAUCE_TO_BUILDER_RECIPE,
} from "./builderRecipeMaps";
import { drinkShowcaseHeroImage, recipeLocalImage } from "./recipeLocalImageUrls";
import { DEFAULT_RECIPE_STOCK_IMAGE, POPCORN_STOCK_BY_ID } from "./recipeStockImageUrls";

/**
 * Drink page slugs that were mapped to `cannabis-smoothie` for builder math but should show a
 * coffee-style hero (same assets as bulletproof / latte line).
 */
const DRINK_HERO_STEM_OVERRIDE: Record<string, string> = {
  "infused-mocha": "bulletproof-coffee",
  "mint-mocha": "bulletproof-coffee",
  "infused-frappuccino": "bulletproof-coffee",
  "coconut-coffee": "bulletproof-coffee",
};

/**
 * Hero image URL for a builder template. Popcorn flavors map to canonical bases; wing sauce slugs
 * match `standardRecipes.wings` ids (legacy `*-wings` urls strip the suffix); coffee builds map to shared templates.
 */
export function resolveTemplateHeroImage(builderKey: string, id: string): string {
  // Popcorn shortcuts MUST only apply to snacks — wing aliases reuse ids like `nashville-hot` / `sriracha`.
  if (builderKey === "snacks") {
    // Popcorn.tsx flavor slugs — each has dedicated art in `recipeLocalImageUrls` (see POPCORN_FLAVOR_HERO_AT_ROOT).
    if (POPCORN_TO_BUILDER_RECIPE[id] !== undefined) {
      return recipeLocalImage(id);
    }
    const popcornDirect = POPCORN_STOCK_BY_ID[id];
    if (popcornDirect) return popcornDirect;
  }

  if (
    builderKey === "wings" ||
    WING_SAUCE_TO_BUILDER_RECIPE[id] !== undefined ||
    id.endsWith("-wings")
  ) {
    const wingHeroId = id === "nashville-hot" ? "nashville-hot-wings" : id;
    const mapped = WING_SAUCE_TO_BUILDER_RECIPE[wingHeroId];
    const canonical =
      mapped ??
      (id.endsWith("-wings") ? id.slice(0, -"-wings".length) : wingHeroId);
    return recipeLocalImage(canonical);
  }

  if (builderKey === "drinks") {
    const showcase = drinkShowcaseHeroImage(id);
    if (showcase) return showcase;
    const stem = DRINK_HERO_STEM_OVERRIDE[id] ?? COFFEE_TO_BUILDER_RECIPE[id] ?? id;
    return recipeLocalImage(stem);
  }

  const coffeeShowcase = drinkShowcaseHeroImage(id);
  if (coffeeShowcase) return coffeeShowcase;
  const coffeeBase = COFFEE_TO_BUILDER_RECIPE[id];
  if (coffeeBase) return recipeLocalImage(coffeeBase);

  const friesDip = LEGACY_FRIES_RECIPE_TO_SPREADS_DIP[id];
  if (friesDip) return recipeLocalImage(friesDip);

  if (id) return recipeLocalImage(id);

  return DEFAULT_RECIPE_STOCK_IMAGE;
}
