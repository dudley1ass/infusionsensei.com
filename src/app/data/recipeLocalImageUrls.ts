/**
 * Recipe card / detail heroes: default path `public/images/recipes/{id}.jpg`.
 *
 * Many art files live in `public/images/` with marketing-style names (no `recipes/` folder, often no
 * hyphens). Map **catalog or resolved template id** → filename in that root folder.
 */

/** Wing sauce templates share one kitchen hero (`chickenwings.jpg`). */
const WING_TEMPLATE_IDS = [
  "classic-buffalo-wings",
  "garlic-parmesan-wings",
  "honey-bbq-wings",
  "teriyaki-wings",
  "nashville-hot-wings",
  "korean-gochujang-wings",
  "lemon-pepper-wings",
  "mango-habanero-wings",
  "cajun-butter-wings",
  "truffle-butter-wings",
  "ranch-butter-wings",
  "honey-mustard-wings",
  "sriracha-honey-wings",
  "chili-crisp-wings",
  "maple-bacon-wings",
  "brown-sugar-bourbon-wings",
  "pineapple-ginger-wings",
  "orange-glaze-wings",
  "garlic-soy-umami-wings",
  "chimichurri-wings",
] as const;

const HERO_JPEG_AT_IMAGES_ROOT: Record<string, string> = {
  ...Object.fromEntries(WING_TEMPLATE_IDS.map((id) => [id, "chickenwings.jpg"])),

  "brownies": "brownies.jpg",
  "blondie-squares": "blondiesquares.jpg",
  "chocolate-chip-cookies": "chocolatechip.jpg",
  "sugar-cookies": "sugarcookies.jpg",
  "mint-ice-cream": "mint-ice-cream.jpg",
  "cannabis-smoothie": "fruit-smoothie.jpg",
  "cannabis-tea": "tea.jpg",
  "bulletproof-coffee": "coffee.jpg",
  "steak": "steakalfredo.jpg",
  "infused-pizza-sauce": "pizzasauce.jpg",
  "infused-mac-and-cheese": "mac-and-cheese.jpg",

  "classic-cannabutter": "cannabutter.jpg",
  "cannabis-oil": "cannabis-oil.jpg",
  "canna-honey": "cannabis-honey.jpg",

  "gummies": "gummies.jpg",
  "fruit-gummies": "gummiesfruit.jpg",
  "sour-gummies": "gummiessour.jpg",

  "fruit-juice-jello-cubes": "jellocube.jpg",
  "sour-jello-bites": "jellobites.jpg",

  "popcorn-balls": "popcornballs.jpg",
  "kettle-corn-infused": "kettlecorn.jpg",
  "rice-krispie-treat-squares": "ricecrispytreats.jpg",
  "chocolate-dipped-pretzels": "chocolatedippedpretz.jpg",
  "mini-slider-sauce": "minisliders.jpg",
  "mini-cupcakes-infused-frosting": "minicupcakes.jpg",
  "cookie-sandwiches-infused-filling": "cookiesandwich.jpg",
  "churro-bites": "churrobites.jpg",
  "funnel-cake-bites": "funnelcakesbites.jpg",
  "chex-mix-infused": "chexmix.jpg",
  "infused-nuts": "mixednuts.jpg",
  "snack-mix-party": "partysnackmix.jpg",
  "cheese-crackers-infused-dust": "cheezecrackers.jpg",
  "garlic-parmesan-pretzels": "garlicparmpretzel.jpg",
  "chicken-tenders-infused-dip": "chickentenders.jpg",
  "meatballs-infused-glaze": "meatballs.jpg",
  "sausage-bites-honey-mustard": "sausagebites.jpg",
  "mini-hot-dogs-infused-condiments": "minihotdogs.jpg",
  "marshmallow-pops": "marshmellowpops.jpg",

  "infused-peanut-butter-spread": "peanutbutter.jpg",
  "queso-dip-infused": "quesodip.jpg",
  "spinach-artichoke-dip-infused": "spinachartichockdip.jpg",
  "ranch-dip-infused": "ranchdip.jpg",

  "infused-cream-cheese-whipped": "cream cheese.jpg",
  "sweet-honey-cream-cheese-spread-infused": "cream cheese.jpg",
  "herb-garlic-cream-cheese-spread-infused": "cream cheese.jpg",
};

/**
 * Image paths use **`Recipe.id` only** — display titles like "Cannabis …" are never parsed here.
 * When the manual catalog uses a different id than `standardRecipes` for the same dish, map to the
 * template id so the correct hero JPEG is used (download scripts keyed off template ids).
 */
const RECIPE_LOCAL_IMAGE_ALIASES: Record<string, string> = {
  "infused-sugar-cookies": "sugar-cookies",
  "cannabis-cookies": "chocolate-chip-cookies",
  "infused-mint-ice-cream": "mint-ice-cream",
  "infused-protein-smoothie": "cannabis-smoothie",
  "canna-gummies": "classic-gummies",
  /** Template id `gummies` uses `gummies.jpg` (classic-gummies is a different snack variant in photo tooling). */
  "classic-brownies": "brownies",
};

export function recipeLocalImage(recipeId: string): string {
  const fileId = RECIPE_LOCAL_IMAGE_ALIASES[recipeId] ?? recipeId;
  const rootJpeg = HERO_JPEG_AT_IMAGES_ROOT[recipeId] ?? HERO_JPEG_AT_IMAGES_ROOT[fileId];
  if (rootJpeg) return `/images/${encodeURIComponent(rootJpeg)}`;
  return `/images/recipes/${fileId}.jpg`;
}

/** Marketing / category pages under `public/images/pages/{name}.jpg` */
export function pageLocalImage(filename: string): string {
  return `/images/pages/${filename}.jpg`;
}
