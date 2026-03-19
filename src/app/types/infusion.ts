export interface InfusionBase {
  id: string;
  name: string;
  type: "butter" | "coconut-oil" | "olive-oil" | "vegetable-oil" | "tincture";
  createdDate: string;
  
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
