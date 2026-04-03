import { pageLocalImage, recipeLocalImage } from "./recipeLocalImageUrls";

/**
 * @deprecated Use `recipeLocalImage` + assets in `public/images/recipes`. Kept for optional tooling.
 * Unsplash CDN — https://unsplash.com/license
 */
const PARAMS = "auto=format&fit=crop&w=1400&q=82";

export function stock(photoFile: string): string {
  return `https://images.unsplash.com/${photoFile}?${PARAMS}`;
}

export const POPCORN_STOCK_BY_ID: Record<string, string> = {
  "garlic-butter-popcorn": recipeLocalImage("garlic-butter-popcorn"),
  "caramel-popcorn": recipeLocalImage("caramel-popcorn"),
  "buffalo-popcorn": recipeLocalImage("buffalo-popcorn"),
  "chocolate-drizzle-popcorn": recipeLocalImage("chocolate-drizzle-popcorn"),
};

export const DEFAULT_RECIPE_STOCK_IMAGE = recipeLocalImage("default");

/** Static heroes for marketing / category pages */
export const PAGE_STOCK = {
  wings: pageLocalImage("wings"),
  popcorn: POPCORN_STOCK_BY_ID["garlic-butter-popcorn"]!,
  coffee: pageLocalImage("coffee"),
  jello: pageLocalImage("jello"),
  gummies: pageLocalImage("gummies"),
  partySnacks: pageLocalImage("partySnacks"),
  spreads: pageLocalImage("spreads"),
  fries: pageLocalImage("fries"),
  pizza: pageLocalImage("pizza"),
  macAndCheese: pageLocalImage("macAndCheese"),
  dinner: pageLocalImage("dinner"),
  brownies: pageLocalImage("brownies"),
} as const;
