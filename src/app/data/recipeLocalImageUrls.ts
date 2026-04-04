/**
 * Recipe card / detail heroes: default path `public/images/recipes/{id}.jpg`.
 *
 * Many art files live in `public/images/` with marketing-style names (no `recipes/` folder, often no
 * hyphens). Values may be `.jpg` or `.png`. Map **catalog or resolved template id** → filename in that
 * root folder.
 */

/** Single file under `public/images/` (any extension). */
export function rootMarketingImage(filename: string): string {
  return `/images/${encodeURIComponent(filename)}`;
}

/**
 * `Coffee.tsx` slugs and canonical drink template ids → root PNG for builder / showcase heroes.
 * Checked in `resolveTemplateHeroImage` before stem mapping.
 */
export const COFFEE_SHOWCASE_ROOT_PNG: Record<string, string> = {
  bulletproof: "bulletproof.png",
  "bulletproof-coffee": "bulletproof.png",
  "infused-latte": "latte.png",
  "cold-brew": "cold_brew.png",
  "infused-mocha": "mocha.png",
  "infused-caramel-latte": "caramel_latte.png",
  "infused-americano": "americano.png",
  "infused-iced-coffee": "iced_coffee.png",
  "infused-frappuccino": "frappuccino.png",
  "golden-latte": "golden_latte.png",
  "infused-matcha": "matcha.png",
  "infused-chai": "chai.png",
  "infused-hot-chocolate": "hot_chocolate.png",
  "infused-irish-coffee": "irish_coffee.png",
  "espresso-tonic": "espresso_tonic.png",
  "coconut-coffee": "coconutcoffee.png",
  "pumpkin-spice-latte": "cinnamon_dolce.png",
  "mint-mocha": "mint_mocha.png",
  "cinnamon-dolce": "cinnamon_dolce.png",
  cortado: "cortado.png",
  "vanilla-latte": "vanillalatte.png",
  "cannabis-tea": "tea.png",
  "cannabis-smoothie": "protein_smoothie.png",
};

export function drinkShowcaseHeroImage(slugOrTemplateId: string): string | undefined {
  const f = COFFEE_SHOWCASE_ROOT_PNG[slugOrTemplateId];
  return f ? rootMarketingImage(f) : undefined;
}

/** Popcorn snack templates (PNG heroes). Ids match `standardRecipes.snacks` builder bases (no `*-popcorn` suffix). */
const POPCORN_HERO_AT_ROOT: Record<string, string> = {
  "garlic-butter": "garlic_butter_popcorn.png",
  caramel: "caramel_popcorn.png",
  buffalo: "buffalo_popcorn.png",
  "chocolate-drizzle": "chocolate_drizzle_popcorn.png",
  "kettle-corn-infused": "kettle_corn.png",
  "candy-coated-popcorn": "candy_coated_popcorn.png",
};

/**
 * Popcorn flavor slugs from `Popcorn.tsx` / `POPCORN_TO_BUILDER_RECIPE` — dedicated hero per flavor
 * (canonical templates above still used when opening by template id).
 */
const POPCORN_FLAVOR_HERO_AT_ROOT: Record<string, string> = {
  "garlic-butter": "garlic_butter_popcorn.png",
  "parmesan-herb": "parmesan_herb_popcorn.png",
  ranch: "ranch_popcorn.png",
  truffle: "truffle_popcorn.png",
  cheddar: "cheddar_popcorn.png",
  buffalo: "buffalo_popcorn.png",
  "chili-lime": "chili_lime_popcorn.png",
  "cajun-spice": "cajun_spice_popcorn.png",
  sriracha: "sriracha_popcorn.png",
  "nashville-hot": "nashville_hot_popcorn.png",
  caramel: "caramel_popcorn.png",
  "honey-butter": "honey_butter_popcorn.png",
  "cinnamon-sugar": "cinnamon_sugar_popcorn.png",
  maple: "maple_popcorn.png",
  "vanilla-bean": "vanilla_bean_popcorn.png",
  "chocolate-drizzle": "chocolate_drizzle_popcorn.png",
  "cookies-cream": "cookies_and_cream_popcorn.png",
  "peanut-butter": "peanut_butter_popcorn.png",
  smores: "chocolate_drizzle_popcorn.png",
  "salted-caramel-choc": "salted_caramel_popcorn.png",
};

/** Spreads, dips, sauces, party snacks — PNG heroes (overrides JPG entries below). */
const SPREADS_SNACKS_PNG_AT_ROOT: Record<string, string> = {
  "infused-almond-butter-spread": "almond_butter.png",
  "infused-peanut-butter-spread": "peanut_butter.png",
  "infused-cream-cheese-whipped": "whippedcreamcheese.png",
  "sweet-honey-cream-cheese-spread-infused": "sweethoneycreamcheese.png",
  "herb-garlic-cream-cheese-spread-infused": "herb_garlic_cream_cheese.png",
  "queso-dip-infused": "quesodip.png",
  "spinach-artichoke-dip-infused": "Spinach artichoke dip with pita chips.png",
  "ranch-dip-infused": "Ranch dip with fresh parsley garnish.png",
  "honey-mustard-dip-infused": "Honey mustard sauce with fresh garnishes.png",
  "bbq-sauce-infused-party": "bbq_sauce.png",
  "sweet-chili-sauce-infused": "sweet_chili_sauce.png",
  "cheese-sauce-infused": "cheese_sauce.png",
  "buffalo-dip-infused": "cheese_dip.png",
  "garlic-aioli-infused": "garlicaioli.png",
  "chex-mix-infused": "chexmix2.jpg",
  "infused-nuts": "mixed_nuts.png",
  "snack-mix-party": "partysnackmix2.jpg",
  "chocolate-dipped-pretzels": "Chocolate-covered pretzels on cutting board (2).png",
};

/** Per-flavor wing heroes under `public/images/` (ids = sauce slugs in `standardRecipes.wings`). */
const WING_HERO_JPEG: Record<string, string> = {
  "classic-buffalo": "buffalowings.jpg",
  "garlic-parmesan": "garlicparmesanwings.jpg",
  "honey-bbq": "honeybbqwings.jpg",
  teriyaki: "teriyakiwings.jpg",
  "nashville-hot-wings": "nashvillehotwings.jpg",
  "korean-gochujang": "koreanfriedchicken.jpg",
  "lemon-pepper": "lemonpepper.jpg",
  "mango-habanero": "manoghabanerowings.jpg",
  "cajun-butter": "cajunwings.jpg",
  "truffle-butter": "trufflechicken.jpg",
  "ranch-butter": "ranchwings.jpg",
  "honey-mustard": "honeymustardchicken.jpg",
  "sriracha-honey": "srirachahoneywings.jpg",
  "chili-crisp": "chilicrispychicken.jpg",
  "maple-bacon": "Maplebaconchickenwings.png",
  "brown-sugar-bourbon": "burbonglazedchicken.jpg",
  "pineapple-ginger": "pineapplechicken.jpg",
  "orange-glaze": "orangeglazed.jpg",
  "garlic-soy-umami": "soygarlicwings.jpg",
  chimichurri: "chimichurrichicken.jpg",
};

/** New root PNGs — spread late so they override earlier JPG lines in `HERO_JPEG_AT_IMAGES_ROOT`. */
const ROOT_PNG_MARKETING_AT_ROOT: Record<string, string> = {
  "brownies": "brownies.png",
  "blondie-squares": "blondiesquares.png",
  "chocolate-chip-cookies": "chocolate_chip_cookies.png",
  "sugar-cookies": "sugar_cookies.png",
  "double-chocolate-cookies": "chocolate_chip_cookies.png",
  "classic-cannabutter": "cannabutter.png",
  "cannabis-oil": "cannabis_oil.png",
  "canna-honey": "cannabis_honey.png",
  "cannabis-smoothie": "protein_smoothie.png",
  "cannabis-tea": "tea.png",
  "bulletproof-coffee": "bulletproof.png",
  "alfredo": "alfredo_sauce.png",
  "infused-pizza-sauce": "pizzasauce.jpg",
  "fruit-juice-jello-cubes": "fruitjellocube.png",
  "sour-jello-bites": "sourjellobites.png",
  "classic-jello-shots": "classicjelloshots.png",
  "layered-jello-shots": "layeredjelloshots.png",
  "infused-chocolate-fudge": "chocolate_drizzle.png",
  "chocolate-bark-infused": "chocolate_drizzle.png",
  "mini-brownie-bites": "brownies.png",
};

const HERO_JPEG_AT_IMAGES_ROOT: Record<string, string> = {
  ...WING_HERO_JPEG,
  ...POPCORN_HERO_AT_ROOT,
  ...POPCORN_FLAVOR_HERO_AT_ROOT,

  "brownies": "brownies.jpg",
  "blondie-squares": "blondiesquares.jpg",
  "chocolate-chip-cookies": "chocolatechip.jpg",
  "sugar-cookies": "sugarcookies.jpg",

  "carrot-cake": "carrotcake.jpg",
  "chocolate-cupcakes": "chocolatecupcakes.jpg",
  "chocolate-layer-cake": "chocolatecake.jpg",
  "coffee-cake": "coffeecake.jpg",
  "funfetti-cake": "funfetti.jpg",
  "gingerbread-cookies": "gingerbread.jpg",
  "lemon-cake": "lemoncake.jpg",
  "marble-cake": "marblecake.jpg",
  "molasses-cookies": "molasses.jpg",
  "oatmeal-raisin-cookies": "oatmealraisin.jpg",
  "pound-cake": "poundcake.jpg",
  "red-velvet-cake": "redvelvet.jpg",
  "shortbread-cookies": "shortbread.jpg",
  "snickerdoodles": "snickerdoodle.jpg",
  "white-chocolate-macadamia-cookies": "whitechocolatemacadamia.jpg",

  "brownie-cheesecake-swirl-bars": "browniecheesecakeswirl.jpg",
  "cheesecake-bars": "cheesecakebars.jpg",
  "chocolate-chip-cookie-bars": "chocolatechipcookiebars.jpg",
  "lemon-bars": "lemonbars.jpg",
  "magic-cookie-bars": "magiccookiebar.jpg",
  "peanut-butter-bars": "peanutbutterbars.jpg",
  "smores-bars": "s'moresbars.jpg",

  "mint-ice-cream": "mint-ice-cream.jpg",
  "vanilla-ice-cream": "vanillaicecream.jpg",
  "banana-bread": "bananabread.jpg",
  "pancakes": "pancakes.jpg",

  "cannabis-smoothie": "fruit-smoothie.jpg",
  "cannabis-tea": "tea.jpg",
  "bulletproof-coffee": "coffee.jpg",
  "alfredo": "alfredosauce.jpg",
  "garlic-pasta": "garlicpasta.jpg",
  "steak": "garlicsteak.jpg",
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

  "popcorn-balls": "popcorn_balls.png",
  "rice-krispie-treat-squares": "ricecrispytreats.jpg",
  "chocolate-dipped-pretzels": "chocolate_pretzels.png",
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

  "infused-cream-cheese-whipped": "cream cheese.jpg",
  "sweet-honey-cream-cheese-spread-infused": "cream cheese.jpg",
  "herb-garlic-cream-cheese-spread-infused": "cream cheese.jpg",

  ...ROOT_PNG_MARKETING_AT_ROOT,
  ...SPREADS_SNACKS_PNG_AT_ROOT,
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
  "garlic-butter-popcorn": "garlic-butter",
  "caramel-popcorn": "caramel",
  "buffalo-popcorn": "buffalo",
  "chocolate-drizzle-popcorn": "chocolate-drizzle",
  "classic-buffalo-wings": "classic-buffalo",
  "garlic-parmesan-wings": "garlic-parmesan",
  "honey-bbq-wings": "honey-bbq",
  "teriyaki-wings": "teriyaki",
  "korean-gochujang-wings": "korean-gochujang",
  "lemon-pepper-wings": "lemon-pepper",
  "mango-habanero-wings": "mango-habanero",
  "cajun-butter-wings": "cajun-butter",
  "truffle-butter-wings": "truffle-butter",
  "ranch-butter-wings": "ranch-butter",
  "honey-mustard-wings": "honey-mustard",
  "sriracha-honey-wings": "sriracha-honey",
  "chili-crisp-wings": "chili-crisp",
  "maple-bacon-wings": "maple-bacon",
  "brown-sugar-bourbon-wings": "brown-sugar-bourbon",
  "pineapple-ginger-wings": "pineapple-ginger",
  "orange-glaze-wings": "orange-glaze",
  "garlic-soy-umami-wings": "garlic-soy-umami",
  "chimichurri-wings": "chimichurri",
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
