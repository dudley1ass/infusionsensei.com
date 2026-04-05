import { useEffect, useState } from "react";
import { Link } from "react-router";
import { recipes, Recipe } from "../data/recipes";
import { recipeLocalImage } from "../data/recipeLocalImageUrls";
import { recipeHeroImgClass } from "../utils/recipeHeroImageClass";
import { RECIPES as spreadsDipsStyles } from "./SpreadsDips";
import { isContentDbStrictMode, loadPublishedRecipesFromDb } from "../services/contentService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Clock, ChefHat, Search, Sparkles, Calculator, ArrowRight } from "lucide-react";
import { Input } from "../components/ui/input";
import { cleanRecipeDisplayTitle } from "../utils/recipeDisplayTitle";
import {
  getRecipeLibraryCategory,
  getStartHereSortIndex,
  recipeLibraryBadgeLabel,
} from "../data/recipeLibraryCategory";
import {
  groupRecipesByLibrarySubsections,
  RECIPE_PAGE_MAIN_TABS,
} from "../data/recipeLibraryPageSections";
import { standardRecipes } from "../data/standardRecipes";
import { appendInternalUtmToPath } from "../utils/utmLinks";

function buildCustomizeLink(recipe: {
  id: string;
  category: string;
  route: string;
}): { to: string; state?: { resetStartHere: boolean } } {
  if (recipe.category === "spreads-dips") {
    return { to: recipe.route };
  }
  const lib = getRecipeLibraryCategory(recipe.id);
  const baseRecipeId = recipe.id.startsWith("spreads-dips-") ? recipe.id.slice("spreads-dips-".length) : recipe.id;
  if (lib === "basics" || lib === "infusions") {
    return { to: "/ingredients", state: { resetStartHere: true } };
  }
  // Do not pass resetStartHere with category+recipe — CreateRecipes strips URL params when reset is true,
  // which dropped users on Start Here instead of this template.
  return {
    to: `/ingredients?category=${encodeURIComponent(lib)}&recipe=${encodeURIComponent(baseRecipeId)}`,
  };
}

export function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("new");
  const [dbRecipes, setDbRecipes] = useState<Recipe[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromDb = await loadPublishedRecipesFromDb();
      if (!cancelled && fromDb) setDbRecipes(fromDb);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  type DisplayRecipe = {
    id: string;
    name: string;
    category: string;
    difficulty: Recipe["difficulty"];
    prepTime: number;
    cookTime: number;
    servings: number;
    thcPerServing: string;
    image: string;
    description: string;
    isNew?: boolean;
    route: string;
  };

  const spreadsDipsDisplayRecipes: DisplayRecipe[] = spreadsDipsStyles.map((dip) => ({
    id: `spreads-dips-${dip.id}`,
    name: dip.name,
    category: "spreads-dips",
    difficulty: "beginner",
    prepTime: 10,
    cookTime: 15,
    servings: Number(dip.servings.split(" ")[0]) || 8,
    thcPerServing: "~2-5mg",
    image: recipeLocalImage(dip.id),
    description: dip.profile,
    route: `/spreads-dips?recipe=${encodeURIComponent(dip.id)}`,
  }));

  const strictDb = isContentDbStrictMode();
  const recipeSource = strictDb ? (dbRecipes ?? []) : dbRecipes && dbRecipes.length > 0 ? dbRecipes : recipes;

  /** Spreads/dips are listed as `spreads-dips-*` cards; omit duplicate template rows. Omit `bulletproof` (alias of bulletproof-coffee). */
  const spreadsDipTemplateIds = new Set(
    (standardRecipes["spreads-dips"] ?? []).map((r: { id: string }) => r.id)
  );
  const recipeSourceDeduped = recipeSource.filter(
    (r) => !spreadsDipTemplateIds.has(r.id) && r.id !== "bulletproof"
  );

  const allDisplayRecipes: DisplayRecipe[] = [
    ...recipeSourceDeduped.map((r) => ({ ...r, route: `/recipes/${r.id}` })),
    ...spreadsDipsDisplayRecipes,
  ];

  const sortedRecipes = [...allDisplayRecipes].sort((a, b) => {
    const ia = getStartHereSortIndex(a.id);
    const ib = getStartHereSortIndex(b.id);
    if (ia !== ib) return ia - ib;
    return cleanRecipeDisplayTitle(a.name).localeCompare(cleanRecipeDisplayTitle(b.name));
  });

  const searchFiltered = sortedRecipes.filter((recipe) => {
    const q = searchQuery.toLowerCase();
    const display = cleanRecipeDisplayTitle(recipe.name).toLowerCase();
    return (
      recipe.name.toLowerCase().includes(q) ||
      display.includes(q) ||
      recipe.description.toLowerCase().includes(q)
    );
  });

  const filteredRecipes = searchFiltered.filter((recipe) => {
    if (selectedCategory === "new") return recipe.isNew === true;
    return getRecipeLibraryCategory(recipe.id) === selectedCategory;
  });

  const newCount = allDisplayRecipes.filter((r) => r.isNew).length;

  const libraryTabCounts = RECIPE_PAGE_MAIN_TABS.map((tab) => ({
    ...tab,
    count:
      tab.id === "new"
        ? newCount
        : allDisplayRecipes.filter((r) => getRecipeLibraryCategory(r.id) === tab.id).length,
  }));

  const subsectionGroups =
    selectedCategory !== "new"
      ? groupRecipesByLibrarySubsections(selectedCategory, filteredRecipes)
      : null;

  const sortInSection = (a: DisplayRecipe, b: DisplayRecipe) => {
    const ia = getStartHereSortIndex(a.id);
    const ib = getStartHereSortIndex(b.id);
    if (ia !== ib) return ia - ib;
    return cleanRecipeDisplayTitle(a.name).localeCompare(cleanRecipeDisplayTitle(b.name));
  };

  const getDifficultyColor = (difficulty: Recipe["difficulty"]) => {
    switch (difficulty) {
      case "beginner": return "bg-green-600";
      case "intermediate": return "bg-yellow-600";
      case "advanced": return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const renderRecipeCard = (recipe: DisplayRecipe) => {
    const customize = buildCustomizeLink(recipe);
    return (
      <Link key={recipe.id} to={recipe.route}>
        <Card
          className={`bg-white hover:border-green-400 transition-all hover:scale-105 overflow-hidden group h-full shadow-md hover:shadow-xl ${recipe.isNew ? "border-2 border-green-400" : "border-green-200"}`}
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={recipe.image}
              alt={cleanRecipeDisplayTitle(recipe.name)}
              className={`${recipeHeroImgClass(recipe.id, recipe.category)} group-hover:scale-110 transition-transform duration-300`}
            />
            {recipe.isNew && (
              <div className="absolute top-3 left-3">
                <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wide">
                  <Sparkles className="w-3 h-3" /> New
                </span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 max-w-[70%]">
              <Badge className="bg-green-600 text-white border-0 shadow-lg text-[10px] sm:text-xs font-bold truncate">
                {recipeLibraryBadgeLabel(getRecipeLibraryCategory(recipe.id))}
              </Badge>
            </div>
            <div className="absolute top-3 right-3">
              <Badge className={`${getDifficultyColor(recipe.difficulty)} text-white border-0 shadow-lg`}>
                {recipe.difficulty}
              </Badge>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="text-gray-900">{cleanRecipeDisplayTitle(recipe.name)}</CardTitle>
            <CardDescription className="text-gray-500 line-clamp-2">{recipe.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-green-600" />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4 text-green-600" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
            <div className="pt-3 border-t border-green-200 mb-3">
              <div className="text-sm">
                <span className="text-gray-600">THC per serving: </span>
                <span className="text-green-700 font-bold">{recipe.thcPerServing}</span>
              </div>
            </div>
            <Link
              to={customize.to}
              state={customize.state}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 w-full bg-green-50 hover:bg-green-100 border border-green-300 hover:border-green-500 text-green-700 font-bold text-sm py-2 rounded-lg transition-all group/cta"
            >
              <Calculator className="w-3.5 h-3.5" />
              {recipe.category === "spreads-dips" ? "Open Spreads & Dips" : "Customize THC"}
              <ArrowRight className="w-3.5 h-3.5 group-hover/cta:translate-x-0.5 transition-transform" />
            </Link>
          </CardContent>
        </Card>
      </Link>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipe Library</h1>
          <p className="text-gray-700">
            Browse recipes — then customize the THC dose to match exactly what you want.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 flex-shrink-0 justify-end">
          {newCount > 0 && (
            <div className="flex items-center gap-2 bg-green-50 border-2 border-green-400 rounded-xl px-4 py-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-bold">{newCount} New Recipes Added!</span>
            </div>
          )}
          <Link
            to={appendInternalUtmToPath("/ingredients", { content: "recipes_library_header" })}
            state={{ resetStartHere: true }}
          >
            <Button className="bg-green-600 hover:bg-green-700 gap-2 font-bold">
              <Calculator className="w-4 h-4" /> Build Custom Recipe
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <Input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border-green-200 text-gray-900 placeholder:text-gray-500 shadow-sm"
        />
      </div>

      {/* Category tabs — recipe box (index-card) style */}
      <div className="rounded-xl border-2 border-amber-900/20 bg-gradient-to-b from-[#ebe4d6] to-[#f4efe4] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] overflow-hidden">
        <div className="border-b border-amber-900/15 bg-[#e0d8c8]/90 px-3 sm:px-4 py-2">
          <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-amber-900/55 mb-2">
            Recipe box — pick a category
          </p>
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="w-full bg-transparent p-0 h-auto flex flex-wrap gap-1 justify-start rounded-none border-0 shadow-none">
              {libraryTabCounts.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="group rounded-t-lg border border-b-0 border-amber-900/25 bg-stone-400/25 px-2.5 py-2 sm:px-3 sm:py-2.5 text-xs sm:text-sm font-semibold text-stone-700 shadow-none data-[state=active]:bg-white data-[state=active]:text-green-900 data-[state=active]:border-amber-900/30 data-[state=active]:shadow-sm data-[state=active]:-mb-px data-[state=active]:relative data-[state=active]:z-10 data-[state=inactive]:hover:bg-stone-300/40"
                >
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span className="ml-1.5 tabular-nums rounded-md bg-white/60 px-1.5 py-0.5 text-[10px] sm:text-xs text-stone-800 group-data-[state=active]:bg-green-100 group-data-[state=active]:text-green-900">
                    {tab.count}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        <div className="h-px bg-white/40" aria-hidden />
      </div>

      {/* Recipe Grid — New tab: flat; categories with subsections: grouped; else flat */}
      {filteredRecipes.length > 0 ? (
        subsectionGroups && subsectionGroups.length > 0 ? (
          <div className="space-y-12">
            {subsectionGroups.map(({ def, recipes }) => {
              const sorted = [...recipes].sort(sortInSection);
              return (
                <section key={def.id} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 border-b border-green-200 pb-3">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{def.label}</h2>
                      {def.description && (
                        <p className="text-gray-600 text-sm mt-1 max-w-3xl">{def.description}</p>
                      )}
                    </div>
                    {def.moreLink && (
                      <Link
                        to={appendInternalUtmToPath(def.moreLink.to, {
                          content: `recipes_subsection_${def.id}`,
                        })}
                        className="text-green-700 font-semibold text-sm hover:underline shrink-0"
                      >
                        {def.moreLink.label} →
                      </Link>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{sorted.map(renderRecipeCard)}</div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...filteredRecipes].sort(sortInSection).map(renderRecipeCard)}
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {selectedCategory === "new" && newCount === 0
              ? "No new recipes right now. Pick a category above to browse the full library."
              : "No recipes found matching your search."}
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("new");
            }}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
