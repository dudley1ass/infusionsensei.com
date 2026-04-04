/**
 * Wing sauce slugs → builder template id in `standardRecipes.wings`.
 * Most ids match template rows; `nashville-hot-wings` is kept (popcorn also uses slug `nashville-hot`).
 */
export const WING_SAUCE_TO_BUILDER_RECIPE: Record<string, string> = {
  "classic-buffalo": "classic-buffalo",
  "garlic-parmesan": "garlic-parmesan",
  "honey-bbq": "honey-bbq",
  "lemon-pepper": "lemon-pepper",
  teriyaki: "teriyaki",
  "mango-habanero": "mango-habanero",
  /** Slug `nashville-hot` is also a popcorn flavor id — register popcorn aliases before wing aliases (see `ensureAliasTemplates` order). */
  "nashville-hot": "nashville-hot-wings",
  "nashville-hot-wings": "nashville-hot-wings",
  "chili-crisp": "chili-crisp",
  "cajun-butter": "cajun-butter",
  "sriracha-honey": "sriracha-honey",
  "maple-bacon": "maple-bacon",
  "brown-sugar-bourbon": "brown-sugar-bourbon",
  "pineapple-ginger": "pineapple-ginger",
  "honey-mustard": "honey-mustard",
  "orange-glaze": "orange-glaze",
  "korean-gochujang": "korean-gochujang",
  "garlic-soy-umami": "garlic-soy-umami",
  "truffle-butter": "truffle-butter",
  chimichurri: "chimichurri",
  "ranch-butter": "ranch-butter",
};

// Builder: four popcorn bases (ids match templates in `standardRecipes.snacks`); map every flavor to the closest base.
export const POPCORN_TO_BUILDER_RECIPE: Record<string, string> = {
  "garlic-butter": "garlic-butter",
  "parmesan-herb": "garlic-butter",
  ranch: "garlic-butter",
  truffle: "garlic-butter",
  cheddar: "garlic-butter",
  buffalo: "buffalo",
  "chili-lime": "buffalo",
  "cajun-spice": "buffalo",
  sriracha: "buffalo",
  "nashville-hot": "buffalo",
  caramel: "caramel",
  "honey-butter": "caramel",
  "cinnamon-sugar": "caramel",
  maple: "caramel",
  "vanilla-bean": "caramel",
  "chocolate-drizzle": "chocolate-drizzle",
  "cookies-cream": "chocolate-drizzle",
  "peanut-butter": "chocolate-drizzle",
  smores: "chocolate-drizzle",
  "salted-caramel-choc": "chocolate-drizzle",
};

// Builder currently has 3 drink templates; map each drink to the closest base.
export const COFFEE_TO_BUILDER_RECIPE: Record<string, string> = {
  bulletproof: "bulletproof-coffee",
  "infused-latte": "bulletproof-coffee",
  "cold-brew": "bulletproof-coffee",
  "infused-mocha": "cannabis-smoothie",
  "infused-caramel-latte": "bulletproof-coffee",
  "infused-americano": "bulletproof-coffee",
  "infused-iced-coffee": "bulletproof-coffee",
  "infused-frappuccino": "cannabis-smoothie",
  "golden-latte": "cannabis-tea",
  "infused-matcha": "cannabis-tea",
  "infused-chai": "cannabis-tea",
  "infused-hot-chocolate": "cannabis-tea",
  "infused-irish-coffee": "bulletproof-coffee",
  "espresso-tonic": "cannabis-tea",
  "coconut-coffee": "cannabis-smoothie",
  "pumpkin-spice-latte": "cannabis-tea",
  "mint-mocha": "cannabis-smoothie",
  "cinnamon-dolce": "cannabis-tea",
  cortado: "bulletproof-coffee",
  "vanilla-latte": "cannabis-tea",
};

/** Builder templates for Spreads & Dips — map showcase / alias IDs to canonical builder recipe id */
export const SPREADS_DIPS_TO_BUILDER_RECIPE: Record<string, string> = {
  "infused-peanut-butter-spread": "infused-peanut-butter-spread",
  "infused-almond-butter-spread": "infused-almond-butter-spread",
  "infused-cream-cheese-whipped": "infused-cream-cheese-whipped",
  "sweet-honey-cream-cheese-spread-infused": "sweet-honey-cream-cheese-spread-infused",
  "herb-garlic-cream-cheese-spread-infused": "herb-garlic-cream-cheese-spread-infused",
  "queso-dip-infused": "queso-dip-infused",
  "spinach-artichoke-dip-infused": "spinach-artichoke-dip-infused",
  "buffalo-dip-infused": "buffalo-dip-infused",
  "ranch-dip-infused": "ranch-dip-infused",
  "honey-mustard-dip-infused": "honey-mustard-dip-infused",
  "garlic-aioli-infused": "garlic-aioli-infused",
  "bbq-sauce-infused-party": "bbq-sauce-infused-party",
  "sweet-chili-sauce-infused": "sweet-chili-sauce-infused",
  "cheese-sauce-infused": "cheese-sauce-infused",
};

/** Old `/fries` recipe URLs → closest dip template (category is migrated to spreads-dips) */
export const LEGACY_FRIES_RECIPE_TO_SPREADS_DIP: Record<string, string> = {
  "garlic-butter-fries": "ranch-dip-infused",
  "truffle-fries": "garlic-aioli-infused",
  "spicy-mayo-fries": "buffalo-dip-infused",
  "cajun-fries": "buffalo-dip-infused",
  "buffalo-fries": "buffalo-dip-infused",
  "cheese-fries": "queso-dip-infused",
  "pesto-fries": "spinach-artichoke-dip-infused",
  "honey-sriracha-fries": "sweet-chili-sauce-infused",
  "lemon-herb-fries": "ranch-dip-infused",
  "korean-fries": "sweet-chili-sauce-infused",
  "parmesan-rosemary-fries": "garlic-aioli-infused",
  "Nashville-hot-fries": "buffalo-dip-infused",
  "ranch-fries": "ranch-dip-infused",
  "miso-butter-fries": "spinach-artichoke-dip-infused",
  poutine: "cheese-sauce-infused",
  "al-pastor-fries": "sweet-chili-sauce-infused",
  "loaded-fries": "queso-dip-infused",
  "katsu-fries": "sweet-chili-sauce-infused",
  "za-atar-fries": "ranch-dip-infused",
  "chili-cheese-fries": "queso-dip-infused",
};

