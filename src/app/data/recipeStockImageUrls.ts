/**
 * Recipe / page imagery via Unsplash CDN (hotlink-friendly per Unsplash guidelines).
 * License: https://unsplash.com/license — attribution appreciated.
 */
const PARAMS = "auto=format&fit=crop&w=1400&q=82";

export function stock(photoFile: string): string {
  return `https://images.unsplash.com/${photoFile}?${PARAMS}`;
}

function hash32(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

const WING_PHOTOS = [
  "photo-1624153064067-566cae78993d",
  "photo-1637273484026-11d51fb64024",
  "photo-1553625024-acdb028b1f9b",
  "photo-1627378378938-291417b4210c",
  "photo-1643405511173-97dfe6be2cc2",
  "photo-1627378378952-a736d8e12219",
  "photo-1627799370307-9b2a689bb94f",
  "photo-1600555379765-f82335a7b1b0",
  "photo-1575932444877-5106bee2a599",
  "photo-1645371958635-88dd6c8e1be7",
  "photo-1712746783860-94fabfbac42c",
  "photo-1631897788978-da06ec45adcb",
  "photo-1635051338493-7a6e27c42137",
] as const;

/** Distinct fried-chicken / wing plate per recipe id */
export function wingStockHero(wingRecipeId: string): string {
  return stock(WING_PHOTOS[hash32(wingRecipeId) % WING_PHOTOS.length]!);
}

export const POPCORN_STOCK_BY_ID: Record<string, string> = {
  "garlic-butter-popcorn": stock("photo-1578849278619-e73505e9610f"),
  "caramel-popcorn": stock("photo-1588196749597-9ff075ee6b5b"),
  "buffalo-popcorn": stock("photo-1501339847302-ac426a4a7cbb"),
  "chocolate-drizzle-popcorn": stock("photo-1606313564200-e75d5e30476c"),
};

export const DEFAULT_RECIPE_STOCK_IMAGE = stock("photo-1636743715220-d8f8dd900b87");

/** Static heroes for marketing / category pages (not per-recipe) */
export const PAGE_STOCK = {
  wings: stock("photo-1624153064067-566cae78993d"),
  popcorn: POPCORN_STOCK_BY_ID["garlic-butter-popcorn"]!,
  coffee: stock("photo-1509042239860-f550ce710b93"),
  jello: stock("photo-1556679343-c7306c1976bc"),
  gummies: stock("photo-1617627191898-1408bf607b4d"),
  partySnacks: stock("photo-1588196749597-9ff075ee6b5b"),
  spreads: stock("photo-1631447661435-b86ae5ecd564"),
  fries: stock("photo-1501339847302-ac426a4a7cbb"),
  pizza: stock("photo-1544025162-d76694265947"),
  macAndCheese: stock("photo-1524351199678-941a58a3df50"),
  dinner: stock("photo-1547592166-23ac45744acd"),
  brownies: stock("photo-1636743715220-d8f8dd900b87"),
} as const;
