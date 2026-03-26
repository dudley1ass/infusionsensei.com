import { Recipe } from "../data/recipes";

type DbRecipeRow = {
  id: string;
  title: string;
  category_id: string;
  difficulty: string;
  prep_minutes: number;
  cook_minutes: number;
  servings_default: number;
  thc_per_serving_label: string | null;
  image_url: string | null;
  summary: string | null;
  is_new: boolean | null;
};

function getSupabaseConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  return { url, key };
}

function isDifficulty(value: string): Recipe["difficulty"] {
  return value === "beginner" || value === "intermediate" || value === "advanced";
}

function normalizeRecipe(row: DbRecipeRow): Recipe {
  return {
    id: row.id,
    name: row.title,
    category: (row.category_id as Recipe["category"]) ?? "edibles",
    difficulty: isDifficulty(row.difficulty) ? row.difficulty : "beginner",
    prepTime: Number(row.prep_minutes) || 0,
    cookTime: Number(row.cook_minutes) || 0,
    servings: Number(row.servings_default) || 1,
    thcPerServing: row.thc_per_serving_label || "~5-10mg",
    image: row.image_url || "/IMAGES/cannabutter.jpg",
    description: row.summary || "Cannabis recipe",
    ingredients: [],
    instructions: [],
    isNew: !!row.is_new,
  };
}

export async function loadPublishedRecipesFromDb(): Promise<Recipe[] | null> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;

  const endpoint = `${url}/rest/v1/recipes?select=id,title,category_id,difficulty,prep_minutes,cook_minutes,servings_default,thc_per_serving_label,image_url,summary,is_new&is_published=eq.true&order=published_at.desc.nullslast`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as DbRecipeRow[];
    if (!Array.isArray(rows) || rows.length === 0) return null;
    return rows.map(normalizeRecipe);
  } catch {
    return null;
  }
}

