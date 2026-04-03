/** Shared recipe catalog shape — manual entries, CMS rows, and builder templates all normalize here */
export interface Recipe {
  id: string;
  name: string;
  category: "edibles" | "drinks" | "infusions" | "basics";
  difficulty: "beginner" | "intermediate" | "advanced";
  prepTime: number;
  cookTime: number;
  servings: number;
  thcPerServing: string;
  image: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tips?: string[];
  strainRecommendation?: string;
  isNew?: boolean;
  /** How the recipe is finished (e.g. oven bake) — optional for catalog UX */
  cookMethod?: string;
}
