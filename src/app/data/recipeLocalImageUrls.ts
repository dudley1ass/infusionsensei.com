/**
 * Recipe card / detail heroes: one JPEG per catalog id under `public/images/recipes/{id}.jpg`.
 *
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
  gummies: "classic-gummies",
  "classic-brownies": "brownies",
};

export function recipeLocalImage(recipeId: string): string {
  const fileId = RECIPE_LOCAL_IMAGE_ALIASES[recipeId] ?? recipeId;
  return `/images/recipes/${fileId}.jpg`;
}

/** Marketing / category pages under `public/images/pages/{name}.jpg` */
export function pageLocalImage(filename: string): string {
  return `/images/pages/${filename}.jpg`;
}
