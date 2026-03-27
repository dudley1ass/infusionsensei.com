/** What kind of carrier this is for UX and dosing expectations */
export type InfusionBaseRole = "cooking" | "ready-to-eat" | "both";

/** Carrier identity for saved bases (extend over time; older saves may omit baseRole) */
export type InfusionBaseType =
  | "butter"
  | "ghee"
  | "coconut-oil"
  | "olive-oil"
  | "vegetable-oil"
  | "simple-syrup"
  | "agave-syrup"
  | "tincture"
  | "mct-oil"
  | "chocolate"
  | "peanut-butter"
  | "honey"
  | "cream-cheese"
  | "chocolate-spread"
  | "frosting"
  | "caramel"
  | "cream";

export type InfusionDoseContext = "per-gram" | "per-tablespoon" | "per-serving";

export interface InfusionBase {
  id: string;
  name: string;
  type: InfusionBaseType;
  createdDate: string;

  /** cooking = goes into recipes; ready-to-eat = spread/eat; both = explicitly dual-use */
  baseRole?: InfusionBaseRole;
  /** Hint for labels (saved bases from before this field default to per-gram behavior in UI) */
  doseContext?: InfusionDoseContext;

  // Cannabis details
  cannabisAmount: number;
  cannabisUnit: "grams" | "ounces";
  strainName: string;
  thcPercentage: number;

  // Base details
  baseAmount: number;
  baseUnit: string;

  // Calculated values
  totalTHC: number; // in mg
  thcPerUnit: number; // mg per gram or ml

  // Optional notes
  notes?: string;
}

/** Infer role for legacy saves without baseRole */
export function inferInfusionBaseRole(base: InfusionBase): InfusionBaseRole {
  if (base.baseRole) return base.baseRole;
  const ready: InfusionBaseType[] = [
    "peanut-butter",
    "honey",
    "cream-cheese",
    "chocolate-spread",
    "frosting",
    "caramel",
  ];
  if (ready.includes(base.type)) return "both";
  if (base.type === "chocolate") return "both";
  return "cooking";
}

export interface CustomRecipe {
  id: string;
  name: string;
  templateId?: string;
  category: string;
  createdDate: string;
  
  // Infusion used
  infusionBaseId?: string;
  infusionAmount: number;
  infusionUnit: string;
  
  // Ingredients
  ingredients: {
    name: string;
    amount: number;
    unit: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  }[];
  
  // Instructions
  instructions: string[];
  
  // Recipe details
  servings: number;
  prepTime: number;
  cookTime: number;
  difficulty: "Easy" | "Medium" | "Hard";
  
  // Calculated nutrition (per serving)
  nutrition: {
    thcPerServing: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  
  notes?: string;
}
