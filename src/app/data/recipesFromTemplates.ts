import type { Recipe } from "./recipeTypes";
import { resolveTemplateHeroImage } from "./recipeTemplateHeroImages";
import { standardRecipes } from "./standardRecipes";

type BuilderTemplate = {
  id: string;
  name: string;
  servings: number;
  ingredients: string[];
  amounts: number[];
  units: string[];
  instructions: string[];
};

const BUILDER_KEY_TO_CATEGORY: Record<string, Recipe["category"]> = {
  "baked-goods": "edibles",
  wings: "edibles",
  "spreads-dips": "edibles",
  snacks: "edibles",
  drinks: "drinks",
  "savory-meals": "edibles",
  "ice-cream": "edibles",
  "breads-breakfast": "edibles",
};

function defaultPrepCook(builderKey: string): { prep: number; cook: number } {
  switch (builderKey) {
    case "drinks":
      return { prep: 5, cook: 5 };
    case "wings":
      return { prep: 15, cook: 40 };
    case "spreads-dips":
      return { prep: 15, cook: 20 };
    case "ice-cream":
      return { prep: 20, cook: 10 };
    case "savory-meals":
      return { prep: 20, cook: 35 };
    default:
      return { prep: 20, cook: 30 };
  }
}

function formatIngredientLine(name: string, amount: number, unit: string): string {
  const u = (unit || "").trim();
  const isEggCount = u === "large" || u === "medium" || u === "small";
  if (isEggCount && /egg/i.test(name)) {
    const n = Number.isInteger(amount) ? amount : parseFloat(String(amount));
    return `${n} × ${name}`;
  }
  const amtStr = Number.isInteger(amount) ? String(amount) : parseFloat(amount.toFixed(2)).toString();
  if (!u) return `${amtStr} ${name}`.trim();
  if (u === "whole" || u === "pieces" || u === "cloves") {
    return `${amtStr} ${u} ${name}`.trim();
  }
  return `${amtStr} ${u} ${name}`.trim();
}

/** One Recipe card per builder template — `standardRecipes` is canonical; manual rows omit duplicate ids */
export function recipesDerivedFromStandardTemplates(): Recipe[] {
  const out: Recipe[] = [];

  for (const [builderKey, list] of Object.entries(standardRecipes)) {
    const category = BUILDER_KEY_TO_CATEGORY[builderKey] ?? "edibles";
    const baseTimes = defaultPrepCook(builderKey);

    for (const raw of list as BuilderTemplate[]) {
      let prep = baseTimes.prep;
      let cook = baseTimes.cook;
      if (raw.id === "caramel-popcorn") {
        cook = 70;
      }
      const ingredients = raw.ingredients.map((name, idx) => {
        const amt = raw.amounts[idx];
        const unit = raw.units?.[idx] ?? "g";
        if (amt === undefined || !Number.isFinite(amt)) {
          return name;
        }
        return formatIngredientLine(name, amt, unit);
      });

      const description =
        raw.instructions[0]?.length > 240
          ? `${raw.instructions[0].slice(0, 237)}…`
          : raw.instructions[0] || `${raw.name} — builder template from Infusion Sensei.`;

      out.push({
        id: raw.id,
        name: raw.name,
        category,
        difficulty: "beginner",
        prepTime: prep,
        cookTime: cook,
        servings: Math.max(1, raw.servings || 1),
        thcPerServing: "Use Start Here for your batch",
        image: resolveTemplateHeroImage(builderKey, raw.id),
        description,
        ingredients,
        instructions: [...raw.instructions],
        tips: [
          "Open this recipe in Start Here (/ingredients) to match template amounts, scale servings, and tie in your saved infusion THC.",
        ],
        ...(raw.id === "caramel-popcorn" ? { cookMethod: "bake" } : {}),
      });
    }
  }

  return out;
}

let _standardTemplateIds: Set<string> | null = null;

/** All `standardRecipes` template ids — manual catalog rows with the same id are omitted so amounts stay single-sourced */
export function getAllStandardTemplateIds(): Set<string> {
  if (_standardTemplateIds) return _standardTemplateIds;
  const ids = new Set<string>();
  for (const list of Object.values(standardRecipes)) {
    for (const raw of list as { id: string }[]) {
      if (raw?.id) ids.add(raw.id);
    }
  }
  _standardTemplateIds = ids;
  return ids;
}
