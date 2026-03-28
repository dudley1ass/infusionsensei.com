/** Scaled grocery math for Party Snacks — same templates as the builder, with metric vs US-friendly display. */

export type GroceryMeasureMode = "metric" | "us";

export type GroceryIngredientLine = {
  name: string;
  amount: number;
  unit: string;
  /** Primary display for backward compatibility — mirrors metric */
  displayAmount: string;
  displayMetric: string;
  displayUs: string;
};

export type RecipeGrocerySection = {
  recipeId: string;
  recipeName: string;
  lines: GroceryIngredientLine[];
};

type TemplateRecipe = {
  id: string;
  name: string;
  servings: number;
  ingredients: string[];
  amounts: number[];
  units?: string[];
};

/** US cup weight for common dry goods (g per 1 US cup, leveled). */
const GRAMS_PER_CUP: Record<string, number> = {
  "All-Purpose Flour": 125,
  "Cake Flour": 114,
  "Bread Flour": 127,
  "Whole Wheat Flour": 120,
  "Almond Flour": 96,
  "Oat Flour": 92,
  "Rice Flour": 158,
  "Coconut Flour": 112,
  "Cornstarch": 128,
  "Cocoa Powder": 100,
  "Cocoa Powder (Natural)": 100,
  "Dutch Cocoa Powder": 100,
  "Granulated Sugar": 200,
  "Brown Sugar (Light)": 220,
  "Brown Sugar (Dark)": 220,
  "Powdered Sugar": 120,
  "Coconut Sugar": 180,
  "Raw Turbinado Sugar": 200,
  "Rolled Oats": 90,
  "Protein Powder": 120,
  "Rice Cereal": 28,
  "Chex Cereal": 40,
  "Panko Breadcrumbs": 60,
  "Flavored Jello Mix": 85,
  "Gelatin (unflavored)": 28,
  "Marshmallows": 50,
  "Popcorn Kernels": 30,
  "Unsalted Butter": 227,
  "Salted Butter": 227,
  Cannabutter: 227,
  "Cannabis Coconut Oil": 218,
  "Peanut Butter": 258,
  "Almond Butter": 250,
  "Cream Cheese": 227,
  "Cream Cheese Frosting": 150,
  "Shredded Cheddar": 113,
  "Cheddar Cheese": 113,
  "Parmesan Cheese": 100,
  "Dark Chocolate Chips": 170,
  "Dark Chocolate Bar": 170,
  "Pretzels": 30,
  "Cheese Crackers": 40,
};

const US_CUP_ML = 236.5882365;

function gramsPerCupFor(name: string): number | null {
  if (GRAMS_PER_CUP[name] != null) return GRAMS_PER_CUP[name];
  const n = name.toLowerCase();
  if (n.includes("rice cereal") || n.includes("rice krisp")) return 28;
  if (n.includes("chex")) return 40;
  if (n.includes("flour")) return 125;
  if (n.includes("sugar") && !n.includes("brown")) return 200;
  if (n.includes("brown sugar")) return 220;
  if (n.includes("powdered sugar")) return 120;
  if (n.includes("oats")) return 90;
  if (n.includes("cocoa")) return 100;
  if (n.includes("cornstarch")) return 128;
  if (n.includes("panko")) return 60;
  if (n.includes("chocolate chip")) return 170;
  return null;
}

function findStandardRecipe(
  standardRecipes: Record<string, TemplateRecipe[]>,
  recipeId: string
): TemplateRecipe | null {
  for (const list of Object.values(standardRecipes)) {
    const r = list.find((x) => x.id === recipeId);
    if (r) return r;
  }
  return null;
}

/** Convert template amount to grams where possible (matches builder nutrition logic). */
function amountToGrams(amount: number, unit: string, ingName: string): number {
  const gpc = gramsPerCupFor(ingName);
  switch (unit) {
    case "g":
      return amount;
    case "kg":
      return amount * 1000;
    case "ml":
      return amount;
    case "L":
      return amount * 1000;
    case "oz":
      return amount * 28.3495;
    case "lb":
      return amount * 453.592;
    case "cups":
      return amount * (gpc ?? 240);
    case "tbsp":
      return amount * (gpc ? gpc / 16 : 14.787);
    case "tsp":
      return amount * (gpc ? gpc / 48 : 4.929);
    case "large":
      return amount * 57;
    case "medium":
      return amount * 44;
    case "small":
      return amount * 38;
    case "pieces":
      return amount * 100;
    case "cloves":
      return amount * 3;
    default:
      return amount;
  }
}

function roundSmart(n: number, maxDecimals: number): number {
  const f = 10 ** maxDecimals;
  return Math.round(n * f) / f;
}

function formatMetricWeight(grams: number): string {
  if (grams >= 1000) return `${roundSmart(grams / 1000, 2)} kg`;
  if (grams >= 100) return `${Math.round(grams)} g`;
  return `${roundSmart(grams, 1)} g`;
}

function formatMetricVolume(ml: number): string {
  if (ml >= 1000) return `${roundSmart(ml / 1000, 2)} L`;
  if (ml >= 100) return `${Math.round(ml)} ml`;
  return `${roundSmart(ml, 0)} ml`;
}

/** Butter / dense fats: US tbsp (14.2 g). */
function formatUsButterFat(grams: number): string {
  const tbsp = grams / 14.2;
  if (tbsp < 0.25) return `${roundSmart(grams, 1)} g (${roundSmart(tbsp * 3, 1)} tsp if dividing)`;
  const whole = Math.floor(tbsp + 1e-6);
  const rem = tbsp - whole;
  const fracTbsp = rem * 4;
  const q = Math.round(fracTbsp) / 4;
  const totalTbsp = whole + q;
  if (totalTbsp < 4) return `${roundSmart(totalTbsp, 2)} tbsp`;
  const c = totalTbsp / 16;
  return `${roundSmart(c, 2)} cup (${roundSmart(totalTbsp, 1)} tbsp)`;
}

function formatUsWeightOzLb(grams: number): string {
  const oz = grams / 28.3495;
  if (oz >= 16) {
    const lb = oz / 16;
    return `${roundSmart(lb, 2)} lb (${Math.round(grams)} g)`;
  }
  return `${roundSmart(oz, 1)} oz`;
}

/** Dry goods: cups + tbsp when helpful. */
function formatUsDryCups(grams: number, name: string): string {
  const gpc = gramsPerCupFor(name);
  if (!gpc) return formatUsWeightOzLb(grams);
  const cupsFloat = grams / gpc;
  if (cupsFloat < 0.125) return formatUsWeightOzLb(grams);
  const wholeCups = Math.floor(cupsFloat + 1e-9);
  let rem = cupsFloat - wholeCups;
  const tbsp = rem * 16;
  const tbspWhole = Math.floor(tbsp + 1e-9);
  rem = (tbsp - tbspWhole) * 3;
  const tspWhole = Math.round(rem);
  const parts: string[] = [];
  if (wholeCups > 0) parts.push(`${wholeCups} cup${wholeCups !== 1 ? "s" : ""}`);
  if (tbspWhole > 0) parts.push(`${tbspWhole} tbsp`);
  if (tspWhole > 0 && wholeCups === 0 && tbspWhole === 0) parts.push(`${tspWhole} tsp`);
  if (parts.length === 0) return formatUsWeightOzLb(grams);
  return `≈ ${parts.join(" + ")}`;
}

function formatUsLiquid(ml: number): string {
  const cups = ml / US_CUP_ML;
  if (cups >= 0.25) return `≈ ${roundSmart(cups, 2)} cups`;
  const tbsp = ml / (US_CUP_ML / 16);
  if (tbsp >= 0.5) return `≈ ${roundSmart(tbsp, 1)} tbsp`;
  const flOz = ml / 29.5735;
  return `≈ ${roundSmart(flOz, 1)} fl oz`;
}

function isButterLike(name: string): boolean {
  const n = name.toLowerCase();
  return /(cannabutter|butter|shortening)/i.test(n) && !n.includes("peanut butter");
}

function isEggUnit(unit: string): boolean {
  return unit === "large" || unit === "medium" || unit === "small";
}

function buildDisplayStrings(
  name: string,
  amount: number,
  unit: string
): { metric: string; us: string } {
  if (unit === "pieces" || unit === "cloves") {
    const n = Math.round(amount);
    const u = unit === "cloves" ? "cloves" : "pieces";
    const label = `${n} ${u}`;
    return { metric: label, us: label };
  }
  if (isEggUnit(unit)) {
    const n = Math.round(amount);
    const label = `${n} large egg${n !== 1 ? "s" : ""}`;
    return { metric: label, us: label };
  }
  if (unit === "tsp") {
    const t = roundSmart(amount, 2);
    return { metric: `${t} tsp`, us: `${t} tsp` };
  }

  if (unit === "ml" || unit === "L") {
    const ml = unit === "L" ? amount * 1000 : amount;
    const metric = formatMetricVolume(ml);
    const us = formatUsLiquid(ml);
    return { metric, us };
  }

  const grams = amountToGrams(amount, unit, name);

  const metric = formatMetricWeight(grams);

  if (isButterLike(name)) {
    return { metric, us: formatUsButterFat(grams) };
  }

  if (/(wing|tender|beef|ground|sausage|hot dog|meatball|chicken)/i.test(name) && grams > 80) {
    return { metric, us: formatUsWeightOzLb(grams) };
  }

  if (/(cheddar|parmesan|mozzarella|cheese)/i.test(name) && grams > 40 && !/crackers|sauce/i.test(name)) {
    return { metric, us: `${formatUsWeightOzLb(grams)} (shredded/grated if applicable)` };
  }

  if (/(marshmallow)/i.test(name)) {
    const oz = grams / 28.3495;
    return { metric, us: `≈ ${roundSmart(oz, 1)} oz marshmallows (about ${metric})` };
  }

  const gpc = gramsPerCupFor(name);
  if (gpc && grams >= 12) {
    return { metric, us: `${formatUsDryCups(grams, name)} — about ${metric}` };
  }

  return { metric, us: `${formatUsWeightOzLb(grams)} — about ${metric}` };
}

export function formatIngredientAmount(amount: number, unit: string, ingredientName = ""): string {
  return buildDisplayStrings(ingredientName, amount, unit).metric;
}

export function groceryLineDisplay(line: GroceryIngredientLine, mode: GroceryMeasureMode): string {
  return mode === "metric" ? line.displayMetric : line.displayUs;
}

export function buildPartySnackGrocery(
  standardRecipes: Record<string, TemplateRecipe[]>,
  recipeIds: string[],
  guestCount: number
): { sections: RecipeGrocerySection[]; combined: GroceryIngredientLine[] } {
  const guests = Math.max(1, guestCount);
  const sections: RecipeGrocerySection[] = [];

  type MergeVal = { grams: number; ml: number; pieces: number; pieceUnit: string | null };
  const mergeMap = new Map<string, MergeVal>();

  const addMerge = (name: string, amount: number, unit: string) => {
    const key = name;
    if (!mergeMap.has(key)) mergeMap.set(key, { grams: 0, ml: 0, pieces: 0, pieceUnit: null });
    const m = mergeMap.get(key)!;
    if (unit === "ml" || unit === "L") {
      m.ml += unit === "L" ? amount * 1000 : amount;
    } else if (unit === "pieces" || unit === "cloves") {
      m.pieces += amount;
      m.pieceUnit = unit;
    } else if (isEggUnit(unit)) {
      m.pieces += amount;
      m.pieceUnit = "large";
    } else {
      m.grams += amountToGrams(amount, unit, name);
    }
  };

  for (const recipeId of recipeIds) {
    const recipe = findStandardRecipe(standardRecipes, recipeId);
    if (!recipe?.amounts?.length || !recipe.ingredients?.length) continue;

    const scale = guests / Math.max(1, recipe.servings);
    const lines: GroceryIngredientLine[] = recipe.ingredients.map((name, i) => {
      const amount = recipe.amounts[i] * scale;
      const unit = recipe.units?.[i] ?? "g";
      const { metric, us } = buildDisplayStrings(name, amount, unit);
      const line: GroceryIngredientLine = {
        name,
        amount,
        unit,
        displayMetric: metric,
        displayUs: us,
        displayAmount: metric,
      };
      addMerge(name, amount, unit);
      return line;
    });

    sections.push({ recipeId, recipeName: recipe.name, lines });
  }

  const combined: GroceryIngredientLine[] = Array.from(mergeMap.entries())
    .map(([name, m]) => {
      let line: GroceryIngredientLine;
      if (m.ml > 0 && m.grams === 0 && m.pieces === 0) {
        const { metric, us } = buildDisplayStrings(name, m.ml, "ml");
        line = {
          name,
          amount: m.ml,
          unit: "ml",
          displayMetric: metric,
          displayUs: us,
          displayAmount: metric,
        };
      } else if (m.pieces > 0 && m.grams === 0 && m.ml === 0) {
        const u = m.pieceUnit ?? "pieces";
        const { metric, us } = buildDisplayStrings(name, m.pieces, u === "large" ? "large" : u);
        line = {
          name,
          amount: m.pieces,
          unit: u,
          displayMetric: metric,
          displayUs: us,
          displayAmount: metric,
        };
      } else {
        const grams = m.grams;
        const { metric, us } = buildDisplayStrings(name, grams, "g");
        line = {
          name,
          amount: grams,
          unit: "g",
          displayMetric: metric,
          displayUs: us,
          displayAmount: metric,
        };
      }
      return line;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return { sections, combined };
}

export function grocerySectionForIngredient(name: string): string {
  const i = name.toLowerCase();
  if (/(chicken wing|chicken tender|beef|pork|meatball|sausage|hot dog|ground beef)/i.test(name)) return "Meat & proteins";
  if (/(milk|butter|cheese|cream|egg|parmesan|mayonnaise|sour cream)/i.test(i)) return "Dairy & eggs";
  if (/(popcorn kernel|pretzel|cracker|chex|panko|flour|cereal|rice cereal|chip)/i.test(i)) return "Bakery & dry goods";
  if (/(salt|pepper|paprika|garlic powder|spice|seasoning|cinnamon|italian seasoning|ranch|cayenne)/i.test(i)) return "Spices & seasonings";
  if (/(garlic|potato|onion|lemon|lime|spinach|artichoke|herb|parsley)/i.test(i)) return "Produce & frozen";
  if (/(oil|sugar|honey|syrup|ketchup|mustard|vinegar|sauce|chocolate| cocoa|gelatin|jello|marshmallow|chips)/i.test(i)) return "Pantry & sweet";
  if (/(coffee|tea|juice|water|tonic)/i.test(i)) return "Beverages";
  if (/(cannabutter|cannabis|thc|tincture)/i.test(i)) return "Infusion (plan separately)";
  return "Other";
}
