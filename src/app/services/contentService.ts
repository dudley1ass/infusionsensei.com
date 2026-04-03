import type { Recipe } from "../data/recipeTypes";
import { DEFAULT_RECIPE_STOCK_IMAGE } from "../data/recipeStockImageUrls";

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

export function isContentDbStrictMode(): boolean {
  return String(import.meta.env.VITE_CONTENT_DB_STRICT || "").toLowerCase() === "true";
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
    image: row.image_url || DEFAULT_RECIPE_STOCK_IMAGE,
    description: row.summary || "Cannabis recipe",
    ingredients: [],
    instructions: [],
    isNew: !!row.is_new,
  };
}

export async function loadPublishedRecipesFromDb(): Promise<Recipe[] | null> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return isContentDbStrictMode() ? [] : null;

  const endpoint = `${url}/rest/v1/recipes?select=id,title,category_id,difficulty,prep_minutes,cook_minutes,servings_default,thc_per_serving_label,image_url,summary,is_new&is_published=eq.true&order=published_at.desc.nullslast`;

  try {
    const res = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    });
    if (!res.ok) return isContentDbStrictMode() ? [] : null;
    const rows = (await res.json()) as DbRecipeRow[];
    if (!Array.isArray(rows) || rows.length === 0) return isContentDbStrictMode() ? [] : null;
    return rows.map(normalizeRecipe);
  } catch {
    return isContentDbStrictMode() ? [] : null;
  }
}

type DbRecipeDetailRow = {
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
  seo_title: string | null;
  seo_description: string | null;
};

type DbIngredientRow = {
  ingredient_name: string;
  amount: number | null;
  unit: string | null;
  sort_order: number;
};

type DbStepRow = {
  step_text: string;
  sort_order: number;
};

export async function loadRecipeByIdFromDb(id: string): Promise<Recipe | null> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key || !id) return null;

  try {
    const baseRes = await fetch(
      `${url}/rest/v1/recipes?select=id,title,category_id,difficulty,prep_minutes,cook_minutes,servings_default,thc_per_serving_label,image_url,summary,is_new,seo_title,seo_description&is_published=eq.true&id=eq.${encodeURIComponent(
        id
      )}&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );
    if (!baseRes.ok) return null;
    const baseRows = (await baseRes.json()) as DbRecipeDetailRow[];
    if (!Array.isArray(baseRows) || baseRows.length === 0) return null;
    const row = baseRows[0];

    const [ingredientsRes, stepsRes] = await Promise.all([
      fetch(
        `${url}/rest/v1/recipe_ingredients?select=ingredient_name,amount,unit,sort_order&recipe_id=eq.${encodeURIComponent(
          id
        )}&order=sort_order.asc`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        }
      ),
      fetch(
        `${url}/rest/v1/recipe_steps?select=step_text,sort_order&recipe_id=eq.${encodeURIComponent(
          id
        )}&order=sort_order.asc`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
        }
      ),
    ]);

    const ingredientsRows = ingredientsRes.ok ? ((await ingredientsRes.json()) as DbIngredientRow[]) : [];
    const stepsRows = stepsRes.ok ? ((await stepsRes.json()) as DbStepRow[]) : [];

    return {
      id: row.id,
      name: row.title,
      category: (row.category_id as Recipe["category"]) ?? "edibles",
      difficulty: isDifficulty(row.difficulty) ? row.difficulty : "beginner",
      prepTime: Number(row.prep_minutes) || 0,
      cookTime: Number(row.cook_minutes) || 0,
      servings: Number(row.servings_default) || 1,
      thcPerServing: row.thc_per_serving_label || "~5-10mg",
      image: row.image_url || DEFAULT_RECIPE_STOCK_IMAGE,
      description: row.summary || "Cannabis recipe",
      ingredients: ingredientsRows.map((ing) =>
        `${ing.amount ?? ""}${ing.unit ? ` ${ing.unit}` : ""} ${ing.ingredient_name}`.trim()
      ),
      instructions: stepsRows.map((s) => s.step_text),
      isNew: !!row.is_new,
    };
  } catch {
    return null;
  }
}

const builderMapCache = new Map<string, Record<string, string>>();

export async function loadBuilderMapFromDb(domain: "wings" | "popcorn" | "coffee" | "fries" | "spreads-dips"): Promise<Record<string, string> | null> {
  if (builderMapCache.has(domain)) return builderMapCache.get(domain)!;

  const { url, key } = getSupabaseConfig();
  if (!url || !key) return isContentDbStrictMode() ? {} : null;

  try {
    const res = await fetch(
      `${url}/rest/v1/builder_recipe_maps?select=source_id,builder_recipe_id&domain=eq.${domain}`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );
    if (!res.ok) return isContentDbStrictMode() ? {} : null;
    const rows = (await res.json()) as { source_id: string; builder_recipe_id: string }[];
    if (!Array.isArray(rows) || rows.length === 0) return isContentDbStrictMode() ? {} : null;
    const mapped = Object.fromEntries(rows.map((r) => [r.source_id, r.builder_recipe_id]));
    builderMapCache.set(domain, mapped);
    return mapped;
  } catch {
    return isContentDbStrictMode() ? {} : null;
  }
}

export type ShowcaseDomain = "wings" | "popcorn" | "coffee" | "fries" | "spreads-dips";

export type ShowcaseItem = {
  id: string;
  name: string;
  itemType: string;
  profile: string;
  build: string;
  tags: string[];
  emoji: string;
  primaryLevel: number;
  secondaryLevel: number;
  sectionKey: string | null;
  sortOrder: number;
};

const showcaseCache = new Map<ShowcaseDomain, ShowcaseItem[]>();

function coerceTagList(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === "string");
  return [];
}

export async function loadShowcaseItemsFromDb(domain: ShowcaseDomain): Promise<ShowcaseItem[] | null> {
  if (showcaseCache.has(domain)) return showcaseCache.get(domain)!;

  const { url, key } = getSupabaseConfig();
  if (!url || !key) return isContentDbStrictMode() ? [] : null;

  try {
    const res = await fetch(
      `${url}/rest/v1/showcase_items?select=source_id,name,item_type,profile,build,tags,emoji,primary_level,secondary_level,section_key,sort_order&domain=eq.${domain}&is_active=eq.true&order=sort_order.asc`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );
    if (!res.ok) return isContentDbStrictMode() ? [] : null;
    const rows = (await res.json()) as Array<{
      source_id: string;
      name: string;
      item_type: string;
      profile: string | null;
      build: string | null;
      tags: unknown;
      emoji: string | null;
      primary_level: number | null;
      secondary_level: number | null;
      section_key: string | null;
      sort_order: number | null;
    }>;
    if (!Array.isArray(rows) || rows.length === 0) return isContentDbStrictMode() ? [] : null;

    const normalized: ShowcaseItem[] = rows.map((row) => ({
      id: row.source_id,
      name: row.name,
      itemType: row.item_type,
      profile: row.profile || "",
      build: row.build || "",
      tags: coerceTagList(row.tags),
      emoji: row.emoji || "🍽️",
      primaryLevel: Math.max(0, Math.min(3, Number(row.primary_level) || 0)),
      secondaryLevel: Math.max(0, Math.min(3, Number(row.secondary_level) || 0)),
      sectionKey: row.section_key,
      sortOrder: Number(row.sort_order) || 0,
    }));

    showcaseCache.set(domain, normalized);
    return normalized;
  } catch {
    return isContentDbStrictMode() ? [] : null;
  }
}

export type PublishedArticle = {
  slug: string;
  title: string;
  summary: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

export async function loadPublishedArticlesFromDb(): Promise<PublishedArticle[] | null> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return isContentDbStrictMode() ? [] : null;

  try {
    const res = await fetch(
      `${url}/rest/v1/articles?select=slug,title,summary,seo_title,seo_description&is_published=eq.true&order=published_at.desc.nullslast`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );
    if (!res.ok) return isContentDbStrictMode() ? [] : null;
    const rows = (await res.json()) as Array<{
      slug: string;
      title: string;
      summary: string | null;
      seo_title: string | null;
      seo_description: string | null;
    }>;
    if (!Array.isArray(rows) || rows.length === 0) return isContentDbStrictMode() ? [] : null;
    return rows
      .filter((r) => typeof r.slug === "string" && typeof r.title === "string")
      .map((r) => ({
        slug: r.slug,
        title: r.title,
        summary: r.summary || "",
        seoTitle: r.seo_title,
        seoDescription: r.seo_description,
      }));
  } catch {
    return isContentDbStrictMode() ? [] : null;
  }
}

