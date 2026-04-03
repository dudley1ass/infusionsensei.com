import {
  COFFEE_TO_BUILDER_RECIPE,
  LEGACY_FRIES_RECIPE_TO_SPREADS_DIP,
  POPCORN_TO_BUILDER_RECIPE,
  WING_SAUCE_TO_BUILDER_RECIPE,
} from "./builderRecipeMaps";
import { recipeLocalImage } from "./recipeLocalImageUrls";
import { DEFAULT_RECIPE_STOCK_IMAGE, POPCORN_STOCK_BY_ID } from "./recipeStockImageUrls";

/**
 * Hero image URL for a builder template. Popcorn flavors map to canonical bases; wing sauce
 * aliases map to `*-wings` ids; coffee builds map to shared drink templates.
 */
export function resolveTemplateHeroImage(_builderKey: string, id: string): string {
  const popcornDirect = POPCORN_STOCK_BY_ID[id];
  if (popcornDirect) return popcornDirect;

  const popcornMappedBase = POPCORN_TO_BUILDER_RECIPE[id];
  if (popcornMappedBase) {
    const p = POPCORN_STOCK_BY_ID[popcornMappedBase];
    if (p) return p;
  }

  if (builderKey === "wings" || WING_SAUCE_TO_BUILDER_RECIPE[id] || id.endsWith("-wings")) {
    const canonical = WING_SAUCE_TO_BUILDER_RECIPE[id] ?? id;
    return recipeLocalImage(canonical);
  }

  const coffeeBase = COFFEE_TO_BUILDER_RECIPE[id];
  if (coffeeBase) return recipeLocalImage(coffeeBase);

  const friesDip = LEGACY_FRIES_RECIPE_TO_SPREADS_DIP[id];
  if (friesDip) return recipeLocalImage(friesDip);

  if (id) return recipeLocalImage(id);

  return DEFAULT_RECIPE_STOCK_IMAGE;
}
