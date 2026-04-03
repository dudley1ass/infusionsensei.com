/** Strip site-redundant wording for on-screen titles (print / legal copy can keep full `recipe.name`). */
export function cleanRecipeDisplayTitle(name: string): string {
  let s = name
    .replace(/\bcannabis\b/gi, "")
    .replace(/\binfused\b/gi, "")
    .replace(/\bTHC\b/g, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
  s = s
    .replace(/^\s*[–—\-]\s*/g, "")
    .replace(/\s*[–—\-]\s*$/g, "")
    .trim();
  s = s.replace(/\(\s*\)/g, "").replace(/\s{2,}/g, " ").trim();
  return s;
}
