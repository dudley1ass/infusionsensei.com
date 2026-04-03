// Basic nutritional data for common ingredients (per 100g or 100ml)
export const nutritionData: Record<string, { calories: number; protein: number; carbs: number; fat: number; fiber?: number; sugar?: number; sodium?: number; saturatedFat?: number; cholesterol?: number }> = {
  // Infused bases
  "butter": { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, saturatedFat: 51, cholesterol: 215, sodium: 11 },
  "cannabutter": { calories: 717, protein: 0.9, carbs: 0.1, fat: 81, saturatedFat: 51, cholesterol: 215, sodium: 11 },
  "coconut oil": { calories: 862, protein: 0, carbs: 0, fat: 100, saturatedFat: 87 },
  "olive oil": { calories: 884, protein: 0, carbs: 0, fat: 100, saturatedFat: 14 },
  "vegetable oil": { calories: 884, protein: 0, carbs: 0, fat: 100, saturatedFat: 14 },
  // Flours & Dry
  "all-purpose flour": { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7, sugar: 0.3, sodium: 2 },
  "flour": { calories: 364, protein: 10, carbs: 76, fat: 1, fiber: 2.7, sugar: 0.3, sodium: 2 },
  "cocoa powder": { calories: 228, protein: 20, carbs: 58, fat: 14, fiber: 37, sugar: 1.7, sodium: 21 },
  "sugar": { calories: 387, protein: 0, carbs: 100, fat: 0, sugar: 100 },
  "brown sugar": { calories: 380, protein: 0, carbs: 98, fat: 0, sugar: 97 },
  "honey": { calories: 304, protein: 0.3, carbs: 82, fat: 0, sugar: 82, sodium: 4 },
  "baking powder": { calories: 53, protein: 0, carbs: 28, fat: 0, sodium: 10600 },
  "baking soda": { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 27360 },
  "salt": { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 38758 },
  // Dairy & eggs
  "eggs": { calories: 143, protein: 13, carbs: 0.7, fat: 10, saturatedFat: 3.1, cholesterol: 372, sodium: 142 },
  "whole milk": { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, saturatedFat: 1.9, cholesterol: 10, sugar: 5.1, sodium: 43 },
  "milk": { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, saturatedFat: 1.9, cholesterol: 10, sugar: 5.1, sodium: 43 },
  "heavy cream": { calories: 345, protein: 2.8, carbs: 2.8, fat: 36, saturatedFat: 23, cholesterol: 135, sodium: 38 },
  "vanilla extract": { calories: 288, protein: 0.1, carbs: 12.6, fat: 0.1, sugar: 12.7, sodium: 9 },
  // Mix-ins
  "chocolate chips": { calories: 479, protein: 4.2, carbs: 63, fat: 24, saturatedFat: 16, fiber: 6, sugar: 52, sodium: 11 },
  "dark chocolate": { calories: 546, protein: 4.9, carbs: 61, fat: 31, saturatedFat: 18, fiber: 7, sugar: 48, sodium: 11 },
  // Other
  "pasta": { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8, sodium: 6 },
  "gelatin powder": { calories: 335, protein: 85, carbs: 0, fat: 0.1, sodium: 196 },
};

/** Matches wing templates: 900g batch ≈ 32 pieces (see CreateRecipes `CHICKEN_WING_GRAMS_PER_PIECE`). */
const CHICKEN_WING_GRAMS_PER_PIECE = 900 / 32;

export const unitToGrams: Record<string, number> = {
  "cup": 240, "cups": 240, "tbsp": 15, "tsp": 5,
  "g": 1, "ml": 1, "oz": 28.35, "lb": 453.6,
  "large": 57, "medium": 50, "small": 43,
  "cloves": 3, "pieces": 100, "whole": 100, "pinch": 0.36,
  "fl oz": 29.57, "pint": 473, "quart": 946,
  "kg": 1000, "L": 1000,
  // special units — no conversion needed (user-defined)
  "squeeze": 5, "packet": 4, "dropper": 1, "0.1ml": 0.1,
};

export interface NutritionResult {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  saturatedFat: number;
  cholesterol: number;
}

export function calculateNutrition(
  ingredientName: string,
  amount: number,
  unit: string
): NutritionResult {
  const normalizedName = ingredientName.toLowerCase().trim();
  let nutrition = nutritionData[normalizedName];
  if (!nutrition) {
    const matchKey = Object.keys(nutritionData).find(key =>
      normalizedName.includes(key) || key.includes(normalizedName)
    );
    nutrition = matchKey ? nutritionData[matchKey] : null;
  }
  if (!nutrition) return { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, saturatedFat: 0, cholesterol: 0 };

  const u = unit.toLowerCase();
  let gramsPerUnit = unitToGrams[u] || 1;
  if (u === "pieces" && normalizedName === "chicken wings") gramsPerUnit = CHICKEN_WING_GRAMS_PER_PIECE;
  const totalGrams = amount * gramsPerUnit;
  const m = totalGrams / 100;

  return {
    calories:     Math.round(nutrition.calories * m),
    protein:      Math.round(nutrition.protein * m * 10) / 10,
    carbs:        Math.round(nutrition.carbs * m * 10) / 10,
    fat:          Math.round(nutrition.fat * m * 10) / 10,
    fiber:        Math.round((nutrition.fiber || 0) * m * 10) / 10,
    sugar:        Math.round((nutrition.sugar || 0) * m * 10) / 10,
    sodium:       Math.round((nutrition.sodium || 0) * m),
    saturatedFat: Math.round((nutrition.saturatedFat || 0) * m * 10) / 10,
    cholesterol:  Math.round((nutrition.cholesterol || 0) * m),
  };
}

export function calculateTotalNutrition(
  ingredients: Array<{ name: string; amount: number; unit: string }>,
  servings: number
): NutritionResult {
  const total: NutritionResult = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0, saturatedFat: 0, cholesterol: 0 };

  ingredients.forEach(ingredient => {
    const n = calculateNutrition(ingredient.name, ingredient.amount, ingredient.unit);
    total.calories     += n.calories;
    total.protein      += n.protein;
    total.carbs        += n.carbs;
    total.fat          += n.fat;
    total.fiber        += n.fiber;
    total.sugar        += n.sugar;
    total.sodium       += n.sodium;
    total.saturatedFat += n.saturatedFat;
    total.cholesterol  += n.cholesterol;
  });

  const s = servings > 0 ? servings : 1;
  return {
    calories:     Math.round(total.calories / s),
    protein:      Math.round((total.protein / s) * 10) / 10,
    carbs:        Math.round((total.carbs / s) * 10) / 10,
    fat:          Math.round((total.fat / s) * 10) / 10,
    fiber:        Math.round((total.fiber / s) * 10) / 10,
    sugar:        Math.round((total.sugar / s) * 10) / 10,
    sodium:       Math.round(total.sodium / s),
    saturatedFat: Math.round((total.saturatedFat / s) * 10) / 10,
    cholesterol:  Math.round(total.cholesterol / s),
  };
}
