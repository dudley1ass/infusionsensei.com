import type { InfusionBaseType } from "../types/infusion";

export interface InfusionTemplate {
  id: string;
  name: string;
  type: InfusionBaseType;
  description: string;
  
  // Default amounts
  defaultCannabisAmount: number;
  defaultCannabisUnit: "grams" | "ounces";
  defaultBaseAmount: number;
  defaultBaseUnit: string;
  
  // Process specs
  temperature: string;
  time: string;
  efficiency: number; // Expected infusion efficiency (0.70-0.85)
  
  // Instructions
  instructions: string[];
  
  // Tips & notes
  tips: string[];
  bestFor?: string[];
}

export const infusionTemplates: InfusionTemplate[] = [
  {
    id: "cannabutter-standard",
    name: "Cannabutter (Baseline Standard)",
    type: "butter",
    description: "Classic cannabis-infused butter - the foundation of most edibles",
    defaultCannabisAmount: 7,
    defaultCannabisUnit: "grams",
    defaultBaseAmount: 227,
    defaultBaseUnit: "g",
    temperature: "160-180°F",
    time: "2-3 hours",
    efficiency: 0.70,
    instructions: [
      "Decarboxylate cannabis at 230°F for 35-45 minutes (coarse grind, single layer)",
      "In a saucepan, melt 1 cup (2 sticks) butter with 1 cup water over low heat",
      "Add decarboxylated cannabis to the melted butter",
      "Maintain temperature at 160-180°F (never let it boil)",
      "Simmer for 2-3 hours, stirring occasionally",
      "Strain through cheesecloth into a container, squeezing to extract all liquid",
      "Refrigerate until butter solidifies on top of water",
      "Separate hardened butter from water and discard water",
      "Store in airtight container in refrigerator for up to 2 months"
    ],
    tips: [
      "Water acts as a temperature buffer to prevent burning",
      "Color should change from light green to light brown during decarb",
      "Decarb smell will be toasted/herbal - this is normal",
      "Use ~0.70 efficiency for calculations (e.g., 7g @ 20% THC = 980mg total)",
      "Label with date and estimated THC per tablespoon"
    ],
    bestFor: ["Brownies", "Cookies", "Cakes", "Rice crispy treats"]
  },
  {
    id: "coconut-oil-high-efficiency",
    name: "Coconut Oil (High Efficiency)",
    type: "coconut-oil",
    description: "Higher THC binding than butter due to saturated fat content",
    defaultCannabisAmount: 7,
    defaultCannabisUnit: "grams",
    defaultBaseAmount: 240,
    defaultBaseUnit: "ml",
    temperature: "160-180°F",
    time: "2-4 hours",
    efficiency: 0.80,
    instructions: [
      "Decarboxylate cannabis at 230°F for 35-45 minutes",
      "Melt 1 cup coconut oil in a double boiler or slow cooker",
      "Add decarboxylated cannabis to melted oil",
      "Maintain steady temperature at 160-180°F",
      "Infuse for 2-4 hours, stirring every 30 minutes",
      "Strain through cheesecloth into glass jar",
      "Let cool and solidify at room temperature",
      "Store in airtight container (refrigeration optional)"
    ],
    tips: [
      "Higher saturated fat = better THC binding (75-85% efficiency)",
      "Use 7-14g cannabis per cup depending on desired strength",
      "Slightly higher yield than butter",
      "Can be used 1:1 as butter replacement in most recipes",
      "Shelf-stable at room temperature"
    ],
    bestFor: ["Gummies", "Chocolates", "Capsules", "Tropical recipes"]
  },
  {
    id: "olive-oil-cooking-grade",
    name: "Olive Oil (Cooking-Grade)",
    type: "olive-oil",
    description: "Perfect for savory dishes, dressings, and pasta",
    defaultCannabisAmount: 7,
    defaultCannabisUnit: "grams",
    defaultBaseAmount: 240,
    defaultBaseUnit: "ml",
    temperature: "160-170°F",
    time: "2-3 hours",
    efficiency: 0.70,
    instructions: [
      "Decarboxylate cannabis at 230°F for 35-45 minutes",
      "Heat 1 cup olive oil in double boiler to 160-170°F",
      "Add decarboxylated cannabis",
      "Maintain lower temperature range (160-170°F) - olive oil has lower heat tolerance",
      "Infuse for 2-3 hours with occasional stirring",
      "Strain through fine mesh strainer or cheesecloth",
      "Store in dark glass bottle in cool, dark place"
    ],
    tips: [
      "Use lower temperature than butter to preserve olive oil quality",
      "Don't overheat in final cooking applications",
      "Great for finishing oils - drizzle on completed dishes",
      "Infused flavor works well with Mediterranean cuisine",
      "Store away from light to prevent degradation"
    ],
    bestFor: ["Pasta dishes", "Salad dressings", "Bread dipping", "Finishing oil"]
  },
  {
    id: "alcohol-tincture-fast",
    name: "Alcohol Tincture (Fast Absorption)",
    type: "tincture",
    description: "Fast-acting sublingual drops with high bioavailability",
    defaultCannabisAmount: 7,
    defaultCannabisUnit: "grams",
    defaultBaseAmount: 120,
    defaultBaseUnit: "ml",
    temperature: "Room temp or frozen",
    time: "2-5 minutes (quick) or 1-2 weeks (long)",
    efficiency: 0.85,
    instructions: [
      "Decarboxylate cannabis at 230°F for 35-45 minutes",
      "QUICK WASH METHOD: Place decarbed cannabis and high-proof alcohol (Everclear) in freezer overnight",
      "Combine frozen cannabis and alcohol in jar, shake vigorously for 2-5 minutes",
      "Strain immediately through coffee filter into dark glass dropper bottle",
      "ALTERNATIVE - LONG SOAK: Combine at room temp, store 1-2 weeks shaking daily, then strain",
      "Optional: Evaporate some alcohol over low heat to concentrate (increases potency)"
    ],
    tips: [
      "Use highest proof alcohol available (190-proof Everclear ideal)",
      "Quick wash = cleaner taste, long soak = stronger",
      "Sublingual absorption (under tongue) = faster onset than edibles",
      "Start with 1-2 drops and wait 15-30 minutes to assess",
      "Can be added to beverages or food",
      "Shelf-stable for years when stored properly"
    ],
    bestFor: ["Sublingual drops", "Beverages", "Quick dosing", "Precise micro-dosing"]
  },
  {
    id: "vegetable-oil-neutral",
    name: "Vegetable Oil (Neutral Profile)",
    type: "vegetable-oil",
    description: "Flavorless option for any recipe",
    defaultCannabisAmount: 7,
    defaultCannabisUnit: "grams",
    defaultBaseAmount: 240,
    defaultBaseUnit: "ml",
    temperature: "160-180°F",
    time: "2-3 hours",
    efficiency: 0.70,
    instructions: [
      "Decarboxylate cannabis at 230°F for 35-45 minutes",
      "Heat 1 cup vegetable oil in double boiler to 160-180°F",
      "Add decarboxylated cannabis",
      "Maintain temperature for 2-3 hours, stirring occasionally",
      "Strain through cheesecloth into container",
      "Store in sealed container in cool, dark place"
    ],
    tips: [
      "Neutral flavor won't affect recipe taste",
      "Works for both sweet and savory applications",
      "Good for baking when you don't want coconut or butter flavor",
      "Similar efficiency to butter (~70%)",
      "Budget-friendly option"
    ],
    bestFor: ["General baking", "Stir-fries", "Any recipe requiring neutral oil"]
  }
];

// Helper function to calculate THC based on template efficiency
export function calculateTemplateThc(
  cannabisGrams: number,
  thcPercentage: number,
  efficiency: number,
  decarboxEfficiency: number = 0.85
): { totalTHC: number; perGram: number; baseAmount: number } {
  // Combined efficiency: decarb × infusion
  const combinedEfficiency = decarboxEfficiency * efficiency;
  
  // Total THC in mg
  const totalTHC = cannabisGrams * 1000 * (thcPercentage / 100) * combinedEfficiency;
  
  return {
    totalTHC,
    perGram: 0, // Will be calculated based on base amount
    baseAmount: 227 // Default, will be overridden
  };
}
