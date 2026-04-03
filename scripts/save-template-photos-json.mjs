import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const ts = execSync("git show HEAD:src/app/data/recipeTemplateHeroImages.ts", {
  cwd: ROOT,
  encoding: "utf8",
});
const start = ts.indexOf("export const TEMPLATE_HERO_IMAGE_BY_ID");
const end = ts.indexOf("};", start);
const block = ts.slice(start, end);
const map = {};
const re = /^\s*(?:"([^"]+)"|([a-zA-Z][a-zA-Z0-9-]*))\s*:\s*stock\("(photo-[^"]+)"\)\s*,?\s*$/gm;
let m;
while ((m = re.exec(block))) {
  map[m[1] ?? m[2]] = m[3];
}
const outDir = path.join(__dirname, "data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "recipe-template-photos.json"), JSON.stringify(map, null, 2));
console.log("Wrote", Object.keys(map).length, "keys");
