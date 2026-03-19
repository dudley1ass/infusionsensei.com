import { useParams, Link } from "react-router";
import { getRecipeById } from "../data/recipes";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Leaf,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Printer,
} from "lucide-react";

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipe = id ? getRecipeById(id) : undefined;

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recipe not found</h2>
        <Link to="/recipes">
          <Button className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Recipes
          </Button>
        </Link>
      </div>
    );
  }

  const getDifficultyColor = () => {
    switch (recipe.difficulty) {
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
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/recipes">
        <Button variant="ghost" className="text-green-700 hover:text-green-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Recipes
        </Button>
      </Link>

      {/* Hero Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="relative h-96 rounded-2xl overflow-hidden">
          <img
            src={recipe.image}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge className={`${getDifficultyColor()} text-white border-0`}>
              {recipe.difficulty}
            </Badge>
            <Badge className="bg-gray-900/80 text-white border-0 capitalize">
              {recipe.category}
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{recipe.name}</h1>
            <p className="text-lg text-gray-700">{recipe.description}</p>
          </div>

          {/* Recipe Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white border-green-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Time</p>
                    <p className="text-xl font-bold text-gray-900">
                      {recipe.prepTime + recipe.cookTime} min
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <ChefHat className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Servings</p>
                    <p className="text-xl font-bold text-gray-900">{recipe.servings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Leaf className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">THC/Serving</p>
                    <p className="text-xl font-bold text-green-400">
                      {recipe.thcPerServing}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">
                      {recipe.difficulty}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Button className="w-full bg-green-600 hover:bg-green-700">
            <Printer className="w-4 h-4 mr-2" />
            Print Recipe
          </Button>
        </div>
      </div>

      {/* Strain Recommendation */}
      {recipe.strainRecommendation && (
        <Card className="bg-gradient-to-r from-purple-50 to-green-50 border-purple-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-purple-600" />
              Strain Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-800">{recipe.strainRecommendation}</p>
          </CardContent>
        </Card>
      )}

      {/* Ingredients & Instructions */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Ingredients */}
        <Card className="bg-white border-green-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Ingredients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-800">{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-white border-green-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-gray-800 pt-1">{instruction}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-green-50 border-yellow-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recipe.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-yellow-600">•</span>
                  <span className="text-gray-800">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Safety Warning */}
      <Card className="bg-red-50 border-red-200 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
            <div className="space-y-2">
              <p className="font-semibold text-red-800">Important Safety Information</p>
              <p className="text-sm text-red-700">
                Edibles can take 30-120 minutes to take effect. Start with a low dose and wait
                at least 2 hours before consuming more. Store safely away from children and pets.
                Do not drive or operate machinery after consuming.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
