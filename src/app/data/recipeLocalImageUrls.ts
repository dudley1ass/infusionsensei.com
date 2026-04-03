/**
 * Recipe card / detail heroes: one JPEG per catalog id under `public/images/recipes/`.
 * Filenames match `Recipe.id` (template id or manual-only id) exactly: `{id}.jpg`.
 */
export function recipeLocalImage(recipeId: string): string {
  return `/images/recipes/${recipeId}.jpg`;
}

/** Marketing / category pages under `public/images/pages/{name}.jpg` */
export function pageLocalImage(filename: string): string {
  return `/images/pages/${filename}.jpg`;
}
