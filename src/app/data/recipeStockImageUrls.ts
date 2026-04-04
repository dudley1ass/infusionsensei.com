import { pageLocalImage, recipeLocalImage, rootMarketingImage } from "./recipeLocalImageUrls";

/**
 * @deprecated Use `recipeLocalImage` + assets in `public/images/recipes`. Kept for optional tooling.
 * Unsplash CDN — https://unsplash.com/license
 */
const PARAMS = "auto=format&fit=crop&w=1400&q=82";

export function stock(photoFile: string): string {
  return `https://images.unsplash.com/${photoFile}?${PARAMS}`;
}

export const POPCORN_STOCK_BY_ID: Record<string, string> = {
  "garlic-butter": recipeLocalImage("garlic-butter"),
  caramel: recipeLocalImage("caramel"),
  buffalo: recipeLocalImage("buffalo"),
  "chocolate-drizzle": recipeLocalImage("chocolate-drizzle"),
};

export const DEFAULT_RECIPE_STOCK_IMAGE = recipeLocalImage("default");

/** Static heroes for marketing / category pages */
export const PAGE_STOCK = {
  wings: pageLocalImage("wings"),
  popcorn: POPCORN_STOCK_BY_ID["garlic-butter"]!,
  coffee: rootMarketingImage("latte.png"),
  jello: rootMarketingImage("jello-shots.png"),
  gummies: pageLocalImage("gummies"),
  partySnacks: rootMarketingImage("partysnacks.jpg"),
  spreads: rootMarketingImage("guacamole.png"),
  fries: rootMarketingImage("onion_rings.png"),
  pizza: rootMarketingImage("pizza_sauce.png"),
  macAndCheese: pageLocalImage("macAndCheese"),
  dinner: pageLocalImage("dinner"),
  brownies: rootMarketingImage("brownies.png"),
} as const;
