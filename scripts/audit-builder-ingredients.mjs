/**
 * Reports standardRecipes ingredient strings missing from INGREDIENT_LIBRARY.
 * Run: node scripts/audit-builder-ingredients.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const createRecipesPath = path.join(__dirname, "../src/app/pages/CreateRecipes.tsx");
const s = fs.readFileSync(createRecipesPath, "utf8");

const libStart = s.indexOf("const INGREDIENT_LIBRARY = [");
if (libStart === -1) throw new Error("INGREDIENT_LIBRARY not found");
let depth = 0;
let libEnd = -1;
for (let i = libStart + "const INGREDIENT_LIBRARY = ".length; i < s.length; i++) {
  if (s[i] === "[") depth++;
  if (s[i] === "]") {
    depth--;
    if (depth === 0) {
      libEnd = i;
      break;
    }
  }
}
if (libEnd === -1) throw new Error("Could not find end of INGREDIENT_LIBRARY");
const libBlock = s.slice(libStart, libEnd + 1);
const libNames = [...libBlock.matchAll(/\{[^}]*name:\s*"([^"]+)"/gs)].map((m) => m[1]);
const libSet = new Set(libNames);

const stdMarker = "const standardRecipes:";
const stdStart = s.indexOf(stdMarker);
const titleMarker = "\nconst toTitleFromId";
const stdEnd = s.indexOf(titleMarker, stdStart);
if (stdStart === -1 || stdEnd === -1) throw new Error("standardRecipes block not found");
const stdBlock = s.slice(stdStart, stdEnd);

const used = new Set();
for (const m of stdBlock.matchAll(/ingredients:\s*\[([^\]]*)\]/g)) {
  const inner = m[1];
  for (const q of inner.matchAll(/"([^"]+)"/g)) {
    used.add(q[1]);
  }
}

const missing = [...used].filter((name) => !libSet.has(name)).sort();

console.log("INGREDIENT_LIBRARY entries:", libSet.size);
console.log("Unique template ingredient names:", used.size);
console.log("Missing from library:", missing.length);
if (missing.length) {
  for (const n of missing) console.log("  -", n);
  process.exitCode = 1;
}
