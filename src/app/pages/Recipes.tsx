import { useEffect, useState } from "react";
import { Link } from "react-router";
import { recipes, Recipe } from "../data/recipes";
import { RECIPES as spreadsDipsStyles } from "./SpreadsDips";
import { isContentDbStrictMode, loadPublishedRecipesFromDb } from "../services/contentService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Clock, ChefHat, Search, Sparkles, Calculator, ArrowRight } from "lucide-react";
import { Input } from "../components/ui/input";

export function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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
    image: "/IMAGES/spreadsdips.jpg",
    description: dip.profile,
    route: `/spreads-dips?recipe=${encodeURIComponent(dip.id)}`,
  }));

  const strictDb = isContentDbStrictMode();
  const recipeSource = strictDb ? (dbRecipes ?? []) : dbRecipes && dbRecipes.length > 0 ? dbRecipes : recipes;

  const allDisplayRecipes: DisplayRecipe[] = [
    ...recipeSource.map((r) => ({ ...r, route: `/recipes/${r.id}` })),
    ...spreadsDipsDisplayRecipes,
  ];

  // Sort: new recipes first, then rest
  const sortedRecipes = [...allDisplayRecipes].sort((a, b) => {
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return 0;
  });

  const filteredRecipes = sortedRecipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const newCount = recipeSource.filter((r) => r.isNew).length;

  const categories = [
    { value: "all", label: "All Recipes", count: allDisplayRecipes.length },
    { value: "basics", label: "Basics", count: recipeSource.filter((r) => r.category === "basics").length },
    { value: "edibles", label: "Edibles", count: recipeSource.filter((r) => r.category === "edibles").length },
    { value: "drinks", label: "Drinks", count: recipeSource.filter((r) => r.category === "drinks").length },
    { value: "infusions", label: "Infusions", count: recipeSource.filter((r) => r.category === "infusions").length },
    { value: "spreads-dips", label: "Spreads & Dips", count: spreadsDipsDisplayRecipes.length },
  ];

  const getDifficultyColor = (difficulty: Recipe["difficulty"]) => {
    switch (difficulty) {
      case "beginner": return "bg-green-600";
      case "intermediate": return "bg-yellow-600";
      case "advanced": return "bg-red-600";
      default: return "bg-gray-600";
    }
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
        <div className="flex items-center gap-3 flex-shrink-0">
          {newCount > 0 && (
            <div className="flex items-center gap-2 bg-green-50 border-2 border-green-400 rounded-xl px-4 py-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="text-green-800 font-bold">{newCount} New Recipes Added!</span>
            </div>
          )}
          <Link to="/ingredients">
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

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-white border-2 border-green-200 shadow-sm flex-wrap h-auto gap-1 p-1">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {cat.label}
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-700">
                {cat.count}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Recipe Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Link key={recipe.id} to={recipe.route}>
              <Card className={`bg-white hover:border-green-400 transition-all hover:scale-105 overflow-hidden group h-full shadow-md hover:shadow-xl ${recipe.isNew ? "border-2 border-green-400" : "border-green-200"}`}>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* NEW badge — top left */}
                  {recipe.isNew && (
                    <div className="absolute top-3 left-3">
                      <span className="flex items-center gap-1 bg-green-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg uppercase tracking-wide">
                        <Sparkles className="w-3 h-3" /> New
                      </span>
                    </div>
                  )}
                  {/* Category badge — bottom left */}
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-green-600 text-white border-0 capitalize shadow-lg">
                      {recipe.category}
                    </Badge>
                  </div>
                  {/* Difficulty badge — top right */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getDifficultyColor(recipe.difficulty)} text-white border-0 shadow-lg`}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-gray-900">{recipe.name}</CardTitle>
                  <CardDescription className="text-gray-500 line-clamp-2">
                    {recipe.description}
                  </CardDescription>
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
                  {/* Funnel CTA */}
                  <Link
                    to={recipe.category === "spreads-dips" ? recipe.route : "/ingredients"}
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
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No recipes found matching your search.</p>
          <Button
            onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
            className="mt-4 bg-green-600 hover:bg-green-700"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
