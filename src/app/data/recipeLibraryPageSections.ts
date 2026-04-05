import { RECIPE_LIBRARY_TABS } from "./recipeLibraryCategory";

/** Main Recipe Library tabs: New first, then category tabs (no “All”). */
export const RECIPE_PAGE_MAIN_TABS: { id: string; label: string }[] = [
  { id: "new", label: "✨ New" },
  ...RECIPE_LIBRARY_TABS.filter((t) => t.id !== "all"),
];

export type RecipeSubsectionDef = {
  id: string;
  label: string;
  description?: string;
  /** Template ids from `standardRecipes` / manual library rows (not `spreads-dips-` prefix). */
  templateIds: string[];
  moreLink?: { to: string; label: string };
};

/** Match a display recipe id to a template id (handles `spreads-dips-*` cards). */
export function recipeIdMatchesTemplate(displayId: string, templateId: string): boolean {
  if (displayId === templateId) return true;
  if (displayId === `spreads-dips-${templateId}`) return true;
  return false;
}

const SNACK_SUBSECTIONS: RecipeSubsectionDef[] = [
  {
    id: "popcorn",
    label: "Popcorn & coatings",
    description: "Garlic butter, caramel, buffalo, kettle corn, candy coat, and popcorn balls.",
    templateIds: [
      "garlic-butter",
      "caramel",
      "buffalo",
      "chocolate-drizzle",
      "kettle-corn-infused",
      "candy-coated-popcorn",
      "popcorn-balls",
    ],
    moreLink: { to: "/popcorn", label: "Popcorn hub" },
  },
  {
    id: "chex-mix",
    label: "Chex mix, nuts & crunch",
    description: "Snack mix, coated nuts, crackers, and pretzels.",
    templateIds: [
      "chex-mix-infused",
      "snack-mix-party",
      "infused-nuts",
      "cheese-crackers-infused-dust",
      "garlic-parmesan-pretzels",
    ],
  },
  {
    id: "gummies-jello",
    label: "Gummies & jello",
    templateIds: [
      "gummies",
      "classic-gummies",
      "fruit-gummies",
      "sour-gummies",
      "gummy-clusters",
      "classic-jello-shots",
      "fruit-juice-jello-cubes",
      "layered-jello-shots",
      "sour-jello-bites",
    ],
  },
  {
    id: "chocolate-fudge",
    label: "Chocolate, fudge & cereal bars",
    templateIds: [
      "infused-chocolate-fudge",
      "chocolate-dipped-pretzels",
      "chocolate-bark-infused",
      "rice-krispie-treat-squares",
    ],
  },
  {
    id: "baked-fried",
    label: "Baked bites & fried treats",
    templateIds: [
      "mini-brownie-bites",
      "blondie-squares",
      "marshmallow-pops",
      "mini-cupcakes-infused-frosting",
      "cookie-sandwiches-infused-filling",
      "churro-bites",
      "funnel-cake-bites",
    ],
  },
  {
    id: "party-protein",
    label: "Party apps & protein",
    description: "Sliders, tenders, meatballs, mini dogs, protein bites, and skewers.",
    templateIds: [
      "mini-slider-sauce",
      "chicken-tenders-infused-dip",
      "meatballs-infused-glaze",
      "sausage-bites-honey-mustard",
      "mini-hot-dogs-infused-condiments",
      "protein-bites",
      "skewered-snack-bites-party",
    ],
  },
];

const DRINK_SUBSECTIONS: RecipeSubsectionDef[] = [
  {
    id: "coffee-smoothies",
    label: "Coffee & protein shakes",
    templateIds: ["bulletproof-coffee", "cannabis-smoothie", "infused-protein-smoothie"],
    moreLink: { to: "/coffee", label: "Coffee drinks" },
  },
  {
    id: "tea-hot",
    label: "Tea & hot drinks",
    templateIds: ["cannabis-tea"],
  },
];

const SPREADS_SUBSECTIONS: RecipeSubsectionDef[] = [
  {
    id: "spreads-dips",
    label: "Spreads & dips",
    templateIds: [
      "infused-peanut-butter-spread",
      "infused-almond-butter-spread",
      "infused-cream-cheese-whipped",
      "sweet-honey-cream-cheese-spread-infused",
      "herb-garlic-cream-cheese-spread-infused",
      "queso-dip-infused",
      "spinach-artichoke-dip-infused",
      "buffalo-dip-infused",
      "ranch-dip-infused",
      "honey-mustard-dip-infused",
    ],
  },
  {
    id: "sauces",
    label: "Sauces & aioli",
    templateIds: [
      "garlic-aioli-infused",
      "bbq-sauce-infused-party",
      "sweet-chili-sauce-infused",
      "cheese-sauce-infused",
    ],
  },
];

export function getLibrarySubsectionDefs(libraryKey: string): RecipeSubsectionDef[] | null {
  switch (libraryKey) {
    case "snacks":
      return SNACK_SUBSECTIONS;
    case "drinks":
      return DRINK_SUBSECTIONS;
    case "spreads-dips":
      return SPREADS_SUBSECTIONS;
    default:
      return null;
  }
}

export type SubsectionGroup<T> = {
  def: RecipeSubsectionDef;
  recipes: T[];
};

/**
 * Split category recipes into subsection groups. Any recipe in the category that is not listed
 * in a subsection appears under a final “More” group.
 */
export function groupRecipesByLibrarySubsections<T extends { id: string }>(
  libraryKey: string,
  categoryRecipes: T[]
): SubsectionGroup<T>[] | null {
  const defs = getLibrarySubsectionDefs(libraryKey);
  if (!defs) return null;

  const assigned = new Set<string>();
  const out: SubsectionGroup<T>[] = [];

  for (const def of defs) {
    const recipes = categoryRecipes.filter((r) =>
      def.templateIds.some((tid) => recipeIdMatchesTemplate(r.id, tid))
    );
    recipes.forEach((r) => assigned.add(r.id));
    if (recipes.length > 0) out.push({ def, recipes });
  }

  const leftover = categoryRecipes.filter((r) => !assigned.has(r.id));
  if (leftover.length > 0) {
    out.push({
      def: {
        id: "more",
        label: "More in this category",
        templateIds: [],
      },
      recipes: leftover,
    });
  }

  return out;
}
