import {
  COFFEE_TO_BUILDER_RECIPE,
  LEGACY_FRIES_RECIPE_TO_SPREADS_DIP,
  POPCORN_TO_BUILDER_RECIPE,
  WING_SAUCE_TO_BUILDER_RECIPE,
} from "./builderRecipeMaps";

/** Hero image per canonical builder template id (matches `standardRecipes` ids post-aliases). */
export const TEMPLATE_HERO_IMAGE_BY_ID: Record<string, string> = {
  // baked-goods
  brownies: "/IMAGES/brownies.jpg",
  "chocolate-chip-cookies": "/IMAGES/chocolatechip.jpg",
  "sugar-cookies": "/IMAGES/sugarcookies.jpg",
  "peanut-butter-cookies": "/IMAGES/chocolatechip.jpg",
  "oatmeal-raisin-cookies": "/IMAGES/chocolatechip.jpg",
  snickerdoodles: "/IMAGES/chocolatechip.jpg",
  "double-chocolate-cookies": "/IMAGES/chocolatechip.jpg",
  "white-chocolate-macadamia-cookies": "/IMAGES/chocolatechip.jpg",
  "shortbread-cookies": "/IMAGES/chocolatechip.jpg",
  "molasses-cookies": "/IMAGES/chocolatechip.jpg",
  "gingerbread-cookies": "/IMAGES/chocolatechip.jpg",
  "vanilla-layer-cake": "/IMAGES/brownies.jpg",
  "chocolate-layer-cake": "/IMAGES/brownies.jpg",
  "red-velvet-cake": "/IMAGES/brownies.jpg",
  "carrot-cake": "/IMAGES/brownies.jpg",
  "lemon-cake": "/IMAGES/brownies.jpg",
  "pound-cake": "/IMAGES/brownies.jpg",
  "coffee-cake": "/IMAGES/brownies.jpg",
  "marble-cake": "/IMAGES/brownies.jpg",
  "funfetti-cake": "/IMAGES/brownies.jpg",
  "chocolate-cupcakes": "/IMAGES/minicupcakes.jpg",
  "peanut-butter-bars": "/IMAGES/blondiesquares.jpg",
  "lemon-bars": "/IMAGES/blondiesquares.jpg",
  "cheesecake-bars": "/IMAGES/blondiesquares.jpg",
  "magic-cookie-bars": "/IMAGES/blondiesquares.jpg",
  "chocolate-chip-cookie-bars": "/IMAGES/blondiesquares.jpg",
  "brownie-cheesecake-swirl-bars": "/IMAGES/brownies.jpg",
  "smores-bars": "/IMAGES/blondiesquares.jpg",

  // wings
  "classic-buffalo-wings": "/IMAGES/wings.jpg",
  "garlic-parmesan-wings": "/IMAGES/wings.jpg",
  "honey-bbq-wings": "/IMAGES/wings.jpg",
  "teriyaki-wings": "/IMAGES/wings.jpg",
  "nashville-hot-wings": "/IMAGES/wings.jpg",
  "korean-gochujang-wings": "/IMAGES/wings.jpg",
  "lemon-pepper-wings": "/IMAGES/wings.jpg",
  "mango-habanero-wings": "/IMAGES/wings.jpg",
  "cajun-butter-wings": "/IMAGES/wings.jpg",
  "truffle-butter-wings": "/IMAGES/wings.jpg",
  "ranch-butter-wings": "/IMAGES/wings.jpg",
  "honey-mustard-wings": "/IMAGES/wings.jpg",
  "sriracha-honey-wings": "/IMAGES/wings.jpg",
  "chili-crisp-wings": "/IMAGES/wings.jpg",
  "maple-bacon-wings": "/IMAGES/wings.jpg",
  "brown-sugar-bourbon-wings": "/IMAGES/wings.jpg",
  "pineapple-ginger-wings": "/IMAGES/wings.jpg",
  "orange-glaze-wings": "/IMAGES/wings.jpg",
  "garlic-soy-umami-wings": "/IMAGES/wings.jpg",
  "chimichurri-wings": "/IMAGES/wings.jpg",

  // spreads-dips
  "infused-peanut-butter-spread": "/IMAGES/spreadsdips.jpg",
  "infused-almond-butter-spread": "/IMAGES/spreadsdips.jpg",
  "infused-cream-cheese-whipped": "/IMAGES/spreadsdips.jpg",
  "sweet-honey-cream-cheese-spread-infused": "/IMAGES/spreadsdips.jpg",
  "herb-garlic-cream-cheese-spread-infused": "/IMAGES/spreadsdips.jpg",
  "queso-dip-infused": "/IMAGES/quesodip.jpg",
  "spinach-artichoke-dip-infused": "/IMAGES/spinachartichockdip.jpg",
  "buffalo-dip-infused": "/IMAGES/ranchdip.jpg",
  "ranch-dip-infused": "/IMAGES/ranchdip.jpg",
  "honey-mustard-dip-infused": "/IMAGES/spreadsdips.jpg",
  "garlic-aioli-infused": "/IMAGES/spreadsdips.jpg",
  "bbq-sauce-infused-party": "/IMAGES/spreadsdips.jpg",
  "sweet-chili-sauce-infused": "/IMAGES/spreadsdips.jpg",
  "cheese-sauce-infused": "/IMAGES/mac-and-cheese.jpg",

  // snacks — popcorn line
  "garlic-butter-popcorn": "/IMAGES/popcorn.webp",
  "caramel-popcorn": "/IMAGES/popcorn.webp",
  "buffalo-popcorn": "/IMAGES/popcorn.webp",
  "chocolate-drizzle-popcorn": "/IMAGES/popcorn.webp",

  gummies: "/IMAGES/gummies.jpg",
  "classic-jello-shots": "/IMAGES/jellocube.jpg",
  "fruit-juice-jello-cubes": "/IMAGES/jellocube.jpg",
  "layered-jello-shots": "/IMAGES/jello.png",
  "sour-jello-bites": "/IMAGES/jellobites.jpg",
  "rice-krispie-treat-squares": "/IMAGES/ricecrispytreats.jpg",
  "infused-chocolate-fudge": "/IMAGES/chocolatechip.jpg",
  "popcorn-balls": "/IMAGES/popcornballs.jpg",
  "chocolate-dipped-pretzels": "/IMAGES/chocolatedippedpretz.jpg",
  "mini-slider-sauce": "/IMAGES/minisliders.jpg",
  "mini-brownie-bites": "/IMAGES/brownies.jpg",
  "blondie-squares": "/IMAGES/blondiesquares.jpg",
  "marshmallow-pops": "/IMAGES/marshmellowpops.jpg",
  "mini-cupcakes-infused-frosting": "/IMAGES/minicupcakes.jpg",
  "cookie-sandwiches-infused-filling": "/IMAGES/cookiesandwich.jpg",
  "churro-bites": "/IMAGES/churrobites.jpg",
  "funnel-cake-bites": "/IMAGES/funnelcakesbites.jpg",
  "chex-mix-infused": "/IMAGES/chexmix.jpg",
  "infused-nuts": "/IMAGES/mixednuts.jpg",
  "kettle-corn-infused": "/IMAGES/kettlecorn.jpg",
  "snack-mix-party": "/IMAGES/partysnackmix.jpg",
  "cheese-crackers-infused-dust": "/IMAGES/cheezecrackers.jpg",
  "garlic-parmesan-pretzels": "/IMAGES/garlicparmpretzel.jpg",
  "chicken-tenders-infused-dip": "/IMAGES/chickentenders.jpg",
  "meatballs-infused-glaze": "/IMAGES/meatballs.jpg",
  "sausage-bites-honey-mustard": "/IMAGES/sausagebites.jpg",
  "mini-hot-dogs-infused-condiments": "/IMAGES/minihotdogs.jpg",
  "gummy-clusters": "/IMAGES/gummies.jpg",
  "chocolate-bark-infused": "/IMAGES/chocolatechip.jpg",
  "candy-coated-popcorn": "/IMAGES/popcorn.webp",
  "skewered-snack-bites-party": "/IMAGES/chocolatechip.jpg",
  "classic-gummies": "/IMAGES/gummies.jpg",
  "fruit-gummies": "/IMAGES/gummiesfruit.jpg",
  "sour-gummies": "/IMAGES/gummiessour.jpg",
  "protein-bites": "/IMAGES/blondiesquares.jpg",

  // drinks
  "bulletproof-coffee": "/IMAGES/coffee.jpg",
  "cannabis-smoothie": "/IMAGES/protein-smoothie.jpg",
  "cannabis-tea": "/IMAGES/tea.jpg",

  // savory-meals
  alfredo: "/IMAGES/steakalfredo.jpg",
  "garlic-pasta": "/IMAGES/steakalfredo.jpg",
  steak: "/IMAGES/steakalfredo.jpg",

  // ice-cream
  "vanilla-ice-cream": "/IMAGES/icecream.jpg",
  "mint-ice-cream": "/IMAGES/mint-ice-cream.jpg",

  // breads-breakfast
  "banana-bread": "/IMAGES/brownies.jpg",
  pancakes: "/IMAGES/brownies.jpg",
};

const BUILDER_KEY_FALLBACK: Record<string, string> = {
  "baked-goods": "/IMAGES/brownies.jpg",
  wings: "/IMAGES/wings.jpg",
  "spreads-dips": "/IMAGES/spreadsdips.jpg",
  snacks: "/IMAGES/popcorn.webp",
  drinks: "/IMAGES/coffee.jpg",
  "savory-meals": "/IMAGES/dinner.jpg",
  "ice-cream": "/IMAGES/icecream.jpg",
  "breads-breakfast": "/IMAGES/brownies.jpg",
};

function heroFor(id: string): string | undefined {
  return TEMPLATE_HERO_IMAGE_BY_ID[id];
}

/**
 * Resolve catalog hero image for a builder template row, including sauce/popcorn/coffee aliases
 * and legacy fries URLs that map to dip templates.
 */
export function resolveTemplateHeroImage(builderKey: string, id: string): string {
  const direct = heroFor(id);
  if (direct) return direct;

  const wingBase = WING_SAUCE_TO_BUILDER_RECIPE[id];
  if (wingBase) {
    const h = heroFor(wingBase);
    if (h) return h;
  }

  const popcornBase = POPCORN_TO_BUILDER_RECIPE[id];
  if (popcornBase) {
    const h = heroFor(popcornBase);
    if (h) return h;
  }

  const coffeeBase = COFFEE_TO_BUILDER_RECIPE[id];
  if (coffeeBase) {
    const h = heroFor(coffeeBase);
    if (h) return h;
  }

  const friesDip = LEGACY_FRIES_RECIPE_TO_SPREADS_DIP[id];
  if (friesDip) {
    const h = heroFor(friesDip);
    if (h) return h;
  }

  return BUILDER_KEY_FALLBACK[builderKey] ?? "/IMAGES/cannabutter.jpg";
}
