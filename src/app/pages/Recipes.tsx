import { useState } from "react";
import { Link } from "react-router";
import { recipes, Recipe } from "../data/recipes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Clock, ChefHat, Search } from "lucide-react";
import { Input } from "../components/ui/input";

export function Recipes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "All Recipes", count: recipes.length },
    {
      value: "basics",
      label: "Basics",
      count: recipes.filter((r) => r.category === "basics").length,
    },
    {
      value: "edibles",
      label: "Edibles",
      count: recipes.filter((r) => r.category === "edibles").length,
    },
    {
      value: "drinks",
      label: "Drinks",
      count: recipes.filter((r) => r.category === "drinks").length,
    },
    {
      value: "infusions",
      label: "Infusions",
      count: recipes.filter((r) => r.category === "infusions").length,
    },
  ];

  const getDifficultyColor = (difficulty: Recipe["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-600";
      case "intermediate":
        return "bg-yellow-600";
      case "advanced":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Recipe Library</h1>
        <p className="text-gray-800">
          Explore our collection of cannabis-infused recipes, from basics to advanced creations
        </p>
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
        <TabsList className="bg-white border-2 border-green-200 shadow-sm">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat.value}
              value={cat.value}
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              {cat.label}
              <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800 group-data-[state=active]:bg-white group-data-[state=active]:text-green-700">
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
            <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
              <Card className="bg-white border-green-200 hover:border-green-400 transition-all hover:scale-105 overflow-hidden group h-full shadow-md hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={`${getDifficultyColor(recipe.difficulty)} text-white border-0 shadow-lg`}>
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-green-600 text-white border-0 capitalize shadow-lg">
                      {recipe.category}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-gray-900">{recipe.name}</CardTitle>
                  <CardDescription className="text-gray-700 line-clamp-2">
                    {recipe.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-700 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ChefHat className="w-4 h-4 text-green-600" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <div className="text-sm">
                      <span className="text-gray-700 font-medium">THC per serving: </span>
                      <span className="text-green-700 font-bold">
                        {recipe.thcPerServing}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            No recipes found matching your search.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
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