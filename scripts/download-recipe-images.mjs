/**
 * Fetches recipe hero JPEGs into public/images/recipes/{id}.jpg and
 * public/images/pages/{name}.jpg. Requires network. Re-run after adding recipes.
 */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_RECIPES = path.join(ROOT, "public", "images", "recipes");
const OUT_PAGES = path.join(ROOT, "public", "images", "pages");
const PARAMS = "auto=format&fit=crop&w=1400&q=82";

function gitShow(relPath) {
  try {
    return execSync(`git show HEAD:${relPath.replace(/\\/g, "/")}`, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
}

/** Parse `key: stock("photo-…")` entries only inside `TEMPLATE_HERO_IMAGE_BY_ID` (not category fallbacks). */
function parseTemplateHeroPhotos(ts) {
  const start = ts.indexOf("export const TEMPLATE_HERO_IMAGE_BY_ID");
  const end = ts.indexOf("};", start);
  if (start === -1 || end === -1) return {};
  const block = ts.slice(start, end);
  const map = {};
  const re = /^\s*(?:"([^"]+)"|([a-zA-Z][a-zA-Z0-9-]*))\s*:\s*stock\("(photo-[^"]+)"\)\s*,?\s*$/gm;
  let m;
  while ((m = re.exec(block))) {
    const key = m[1] ?? m[2];
    map[key] = m[3];
  }
  return map;
}

function parseStandardRecipeIds(ts) {
  return [...ts.matchAll(/id:\s*"([^"]+)"/g)].map((x) => x[1]);
}

function hash32(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
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
];

const DEFAULT_PHOTO = "photo-1636743715220-d8f8dd900b87";

const PAGE_PHOTOS = {
  wings: "photo-1624153064067-566cae78993d",
  popcorn: "photo-1578849278619-e73505e9610f",
  coffee: "photo-1509042239860-f550ce710b93",
  jello: "photo-1556679343-c7306c1976bc",
  gummies: "photo-1617627191898-1408bf607b4d",
  partySnacks: "photo-1588196749597-9ff075ee6b5b",
  spreads: "photo-1631447661435-b86ae5ecd564",
  fries: "photo-1501339847302-ac426a4a7cbb",
  pizza: "photo-1544025162-d76694265947",
  macAndCheese: "photo-1524351199678-941a58a3df50",
  dinner: "photo-1547592166-23ac45744acd",
  brownies: "photo-1636743715220-d8f8dd900b87",
};

const POPCANON = {
  "garlic-butter-popcorn": "photo-1578849278619-e73505e9610f",
  "caramel-popcorn": "photo-1588196749597-9ff075ee6b5b",
  "buffalo-popcorn": "photo-1501339847302-ac426a4a7cbb",
  "chocolate-drizzle-popcorn": "photo-1606313564200-e75d5e30476c",
};

/** Editorial overrides for `recipes.ts` manual rows (id → Unsplash slug). Update when adding recipes. */
const MANUAL_PHOTOS = JSON.parse(
  fs.readFileSync(path.join(__dirname, "data", "recipe-manual-photos.json"), "utf8")
);

async function downloadPhoto(photoSlug, destPath) {
  const url = `https://images.unsplash.com/${photoSlug}?${PARAMS}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.promises.writeFile(destPath, buf);
}

async function main() {
  const heroTs = gitShow("src/app/data/recipeTemplateHeroImages.ts");
  const jsonPath = path.join(__dirname, "data", "recipe-template-photos.json");
  const fromJson = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const fromGit = parseTemplateHeroPhotos(heroTs);
  const templatePhotos = { ...fromJson, ...fromGit };

  const standardTs = fs.readFileSync(path.join(ROOT, "src/app/data/standardRecipes.ts"), "utf8");
  const standardIds = [...new Set(parseStandardRecipeIds(standardTs))];

  const photoById = { ...templatePhotos, ...MANUAL_PHOTOS, ...POPCANON };

  for (const id of standardIds) {
    if (!photoById[id]) photoById[id] = DEFAULT_PHOTO;
  }

  const wingIds = standardIds.filter((id) => /-wings$/.test(id));
  for (const id of wingIds) {
    photoById[id] = WING_PHOTOS[hash32(id) % WING_PHOTOS.length];
  }

  photoById.default = DEFAULT_PHOTO;

  await fs.promises.mkdir(OUT_RECIPES, { recursive: true });
  await fs.promises.mkdir(OUT_PAGES, { recursive: true });

  let n = 0;
  for (const [id, slug] of Object.entries(photoById)) {
    if (!slug || !slug.startsWith("photo-")) continue;
    const dest = path.join(OUT_RECIPES, `${id}.jpg`);
    process.stdout.write(`${++n}\t${id}.jpg\r`);
    await downloadPhoto(slug, dest);
  }

  for (const [name, slug] of Object.entries(PAGE_PHOTOS)) {
    const dest = path.join(OUT_PAGES, `${name}.jpg`);
    process.stdout.write(`page\t${name}.jpg\r`);
    await downloadPhoto(slug, dest);
  }

  console.log(`\nDone. ${Object.keys(photoById).length} recipe images + ${Object.keys(PAGE_PHOTOS).length} page images → public/images/`);
}

const invoked = process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
if (invoked) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
