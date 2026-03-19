import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { FlaskConical, Plus, Trash2, Save, ChefHat, Beaker, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import { recipeTemplates, RecipeTemplate } from "../data/recipeTemplates";
import { InfusionBase } from "../types/infusion";
import { calculateTotalNutrition } from "../utils/nutritionCalculator";
import { NutritionFactsLabel, NutritionFactsCompact } from "../components/NutritionFactsLabel";
import { infusionTemplates } from "../data/infusionTemplates";

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
}

export function Mixer() {
  const [infusionBases, setInfusionBases] = useState<InfusionBase[]>([]);
  const [allInfusionBases, setAllInfusionBases] = useState<InfusionBase[]>([]); // Includes templates + custom
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedInfusion, setSelectedInfusion] = useState<string>("");
  const [showNutritionLabel, setShowNutritionLabel] = useState(false);
  
  // Recipe state
  const [recipeName, setRecipeName] = useState("");
  const [category, setCategory] = useState("");
  const [servings, setServings] = useState(16);
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(30);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  // Load infusion bases
  useEffect(() => {
    const saved = localStorage.getItem("infusionBases");
    if (saved) {
      const customBases = JSON.parse(saved);
      setInfusionBases(customBases);
    }
  }, []);

  // Load template when selected
  const handleTemplateSelect = (templateId: string) => {
    const template = recipeTemplates.find((t) => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    setRecipeName(template.name);
    setCategory(template.category);
    setServings(template.servings);
    setPrepTime(template.prepTime);
    setCookTime(template.cookTime);
    setDifficulty(template.difficulty);
    
    // Convert template ingredients to editable format
    const templateIngredients: Ingredient[] = template.ingredients.map((ing, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
    }));
    setIngredients(templateIngredients);
    setInstructions(template.instructions);
  };

  const addIngredient = () => {
    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name: "",
      amount: 0,
      unit: "cup",
    };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter((ing) => ing.id !== id));
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(
      ingredients.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const addInstructionStep = () => {
    setInstructions([...instructions, ""]);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, idx) => idx !== index));
  };

  const calculateNutritionAndTHC = () => {
    const infusion = infusionBases.find((b) => b.id === selectedInfusion);
    
    // Find infusion ingredient
    const infusionIngredient = ingredients.find((ing) =>
      ing.name.toLowerCase().includes("cannab") || 
      ing.name.toLowerCase().includes("infus") ||
      ing.name.toLowerCase().includes("tincture")
    );

    let thcPerServing = 0;
    if (infusion && infusionIngredient) {
      // Calculate THC based on infusion amount used
      const infusionGrams = infusionIngredient.unit === "cup" 
        ? infusionIngredient.amount * 227 
        : infusionIngredient.amount;
      const totalTHCInRecipe = (infusionGrams / infusion.baseAmount) * infusion.totalTHC;
      thcPerServing = totalTHCInRecipe / servings;
    }

    const nutrition = calculateTotalNutrition(ingredients, servings);

    return {
      thcPerServing: parseFloat(thcPerServing.toFixed(2)),
      ...nutrition,
    };
  };

  const handleSave = () => {
    if (!recipeName.trim()) {
      toast.error("Please enter a recipe name");
      return;
    }

    if (ingredients.length === 0) {
      toast.error("Please add at least one ingredient");
      return;
    }

    const nutritionData = calculateNutritionAndTHC();

    const recipe = {
      id: Date.now().toString(),
      name: recipeName,
      templateId: selectedTemplate || undefined,
      category,
      createdDate: new Date().toISOString(),
      infusionBaseId: selectedInfusion || undefined,
      ingredients,
      instructions,
      servings,
      prepTime,
      cookTime,
      difficulty,
      nutrition: nutritionData,
      notes: notes.trim() || undefined,
    };

    // Save to localStorage
    const saved = localStorage.getItem("customRecipes");
    const recipes = saved ? JSON.parse(saved) : [];
    recipes.push(recipe);
    localStorage.setItem("customRecipes", JSON.stringify(recipes));

    toast.success("Recipe saved successfully!", {
      description: `${recipeName} has been added to your collection.`,
    });

    // Reset form
    resetForm();
  };

  const resetForm = () => {
    setSelectedTemplate("");
    setSelectedInfusion("");
    setRecipeName("");
    setCategory("");
    setServings(16);
    setPrepTime(15);
    setCookTime(30);
    setDifficulty("Easy");
    setIngredients([]);
    setInstructions([]);
    setNotes("");
  };

  const nutritionData = calculateNutritionAndTHC();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Recipe Mixer Lab</h1>
        <p className="text-gray-600">
          Start with a template or create your own cannabis-infused recipe from scratch
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-900/30 to-gray-800/50 border-green-200">
          <CardHeader>
            <Beaker className="w-10 h-10 text-green-500 mb-2" />
            <CardTitle className="text-gray-900">Use Your Infusion Base</CardTitle>
            <CardDescription className="text-gray-600">
              Select from your custom cannabutter, oils, or tinctures
            </CardDescription>
          </CardHeader>
          <CardContent>
            {infusionBases.length === 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-700">
                  You haven't created any infusion bases yet.
                </p>
                <Link to="/infusions">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Create Infusion Base
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <Select value={selectedInfusion} onValueChange={setSelectedInfusion}>
                <SelectTrigger className="bg-white border-green-300 text-gray-900">
                  <SelectValue placeholder="Select an infusion base..." />
                </SelectTrigger>
                <SelectContent className="bg-white border-green-300 text-gray-900">
                  {infusionBases.map((base) => (
                    <SelectItem key={base.id} value={base.id}>
                      {base.name} ({base.totalTHC}mg THC)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900/30 to-gray-800/50 border-purple-700/30">
          <CardHeader>
            <ChefHat className="w-10 h-10 text-purple-500 mb-2" />
            <CardTitle className="text-gray-900">Choose a Recipe Template</CardTitle>
            <CardDescription className="text-gray-600">
              Start with a proven recipe and customize it to your taste
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger className="bg-white border-purple-300 text-gray-900">
                <SelectValue placeholder="Browse templates..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-purple-700/30 text-white max-h-[300px]">
                {recipeTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Recipe Builder */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Recipe Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="recipe-name" className="text-white">
                  Recipe Name *
                </Label>
                <Input
                  id="recipe-name"
                  placeholder="e.g., My Special Brownies"
                  value={recipeName}
                  onChange={(e) => setRecipeName(e.target.value)}
                  className="bg-white border-green-300 text-gray-900"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="servings" className="text-white">
                    Servings
                  </Label>
                  <Input
                    id="servings"
                    type="number"
                    value={servings}
                    onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                    className="bg-white border-green-300 text-gray-900"
                    min="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prep-time" className="text-white">
                    Prep Time (min)
                  </Label>
                  <Input
                    id="prep-time"
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(parseInt(e.target.value) || 0)}
                    className="bg-white border-green-300 text-gray-900"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cook-time" className="text-white">
                    Cook Time (min)
                  </Label>
                  <Input
                    id="cook-time"
                    type="number"
                    value={cookTime}
                    onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
                    className="bg-white border-green-300 text-gray-900"
                    min="0"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="difficulty" className="text-white">
                    Difficulty
                  </Label>
                  <Select value={difficulty} onValueChange={(v: "Easy" | "Medium" | "Hard") => setDifficulty(v)}>
                    <SelectTrigger className="bg-white border-green-300 text-gray-900">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-green-300 text-gray-900">
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">
                    Category
                  </Label>
                  <Input
                    id="category"
                    placeholder="e.g., Baked Goods, Beverages"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-white border-green-300 text-gray-900"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Ingredients</CardTitle>
                  <CardDescription className="text-gray-600">
                    Adjust amounts to customize your recipe
                  </CardDescription>
                </div>
                <Button
                  onClick={addIngredient}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {ingredients.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No ingredients yet. Select a template or add ingredients manually.
                </p>
              ) : (
                ingredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex gap-3">
                    <Input
                      placeholder="Ingredient name"
                      value={ingredient.name}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, "name", e.target.value)
                      }
                      className="bg-white border-green-300 text-gray-900 flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={ingredient.amount}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, "amount", parseFloat(e.target.value) || 0)
                      }
                      className="bg-white border-green-300 text-gray-900 w-24"
                      step="0.01"
                    />
                    <Select
                      value={ingredient.unit}
                      onValueChange={(value) =>
                        updateIngredient(ingredient.id, "unit", value)
                      }
                    >
                      <SelectTrigger className="bg-white border-green-300 text-gray-900 w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-green-300 text-gray-900">
                        <SelectItem value="cup">cup</SelectItem>
                        <SelectItem value="tbsp">tbsp</SelectItem>
                        <SelectItem value="tsp">tsp</SelectItem>
                        <SelectItem value="g">g</SelectItem>
                        <SelectItem value="oz">oz</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="large">large</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-gray-900">Instructions</CardTitle>
                  <CardDescription className="text-gray-600">
                    Step-by-step preparation guide
                  </CardDescription>
                </div>
                <Button
                  onClick={addInstructionStep}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {instructions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No instructions yet. Add steps to guide the preparation.
                </p>
              ) : (
                instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white font-bold text-sm flex-shrink-0 mt-1">
                      {index + 1}
                    </div>
                    <Textarea
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                      className="bg-white border-green-300 text-gray-900 flex-1"
                      rows={2}
                      placeholder={`Step ${index + 1}...`}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInstruction(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add any additional notes, tips, or variations..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white border-green-300 text-gray-900"
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            className="w-full bg-green-600 hover:bg-green-700 text-lg py-6"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Recipe
          </Button>
        </div>

        {/* Sidebar - Nutrition & Info */}
        <div className="space-y-6">
          {/* Nutrition Facts */}
          <Card className="bg-gradient-to-br from-green-900/30 to-gray-800/50 border-green-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Nutrition Facts</CardTitle>
              <CardDescription className="text-gray-600">Per Serving</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* THC Content */}
              <div className="bg-green-900/30 p-4 rounded-lg border border-green-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-green-300 font-semibold">THC Content</span>
                  <Info className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-400">
                  {nutritionData.thcPerServing.toFixed(2)} mg
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {selectedInfusion ? "Based on selected infusion" : "Select an infusion base"}
                </div>
              </div>

              <Separator className="bg-green-700/30" />

              {/* Macros */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">Calories</span>
                  <span className="text-white font-semibold">{nutritionData.calories}</span>
                </div>
                <Separator className="bg-green-700/20" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">Protein</span>
                  <span className="text-white font-semibold">{nutritionData.protein}g</span>
                </div>
                <Separator className="bg-green-700/20" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">Carbohydrates</span>
                  <span className="text-white font-semibold">{nutritionData.carbs}g</span>
                </div>
                <Separator className="bg-green-700/20" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">Fat</span>
                  <span className="text-white font-semibold">{nutritionData.fat}g</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 italic mt-4">
                * Nutritional values are estimates based on typical ingredient data
              </div>

              {/* View Full Label Button */}
              <Button
                onClick={() => setShowNutritionLabel(true)}
                variant="outline"
                className="w-full border-green-200 text-green-400 hover:bg-green-900/20 mt-4"
              >
                View Full Nutrition Label
              </Button>
            </CardContent>
          </Card>

          {/* Recipe Summary */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Recipe Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Servings:</span>
                <span className="text-white font-medium">{servings}</span>
              </div>
              <Separator className="bg-green-700/30" />
              <div className="flex justify-between">
                <span className="text-gray-600">Prep Time:</span>
                <span className="text-white font-medium">{prepTime} min</span>
              </div>
              <Separator className="bg-green-700/30" />
              <div className="flex justify-between">
                <span className="text-gray-600">Cook Time:</span>
                <span className="text-white font-medium">{cookTime} min</span>
              </div>
              <Separator className="bg-green-700/30" />
              <div className="flex justify-between">
                <span className="text-gray-600">Total Time:</span>
                <span className="text-white font-medium">{prepTime + cookTime} min</span>
              </div>
              <Separator className="bg-green-700/30" />
              <div className="flex justify-between">
                <span className="text-gray-600">Difficulty:</span>
                <Badge className={
                  difficulty === "Easy" ? "bg-green-600" :
                  difficulty === "Medium" ? "bg-yellow-600" :
                  "bg-red-600"
                }>
                  {difficulty}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-gray-900 text-sm">💡 Pro Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-gray-700">
              <p>• Always decarboxylate cannabis before infusing (240°F for 30-40 min)</p>
              <p>• Keep infusion temperature between 160-180°F</p>
              <p>• Label all edibles with THC content per serving</p>
              <p>• Store in airtight containers away from children & pets</p>
              <p>• Start with lower doses until you know your tolerance</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Nutrition Label Modal */}
      <Dialog open={showNutritionLabel} onValueChange={setShowNutritionLabel}>
        <DialogContent className="bg-white border-green-200 max-w-lg overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-white">FDA-Style Nutrition Facts</DialogTitle>
            <DialogDescription className="text-gray-600">
              Official nutrition label for {recipeName || "your recipe"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-4">
            <NutritionFactsLabel
              servings={servings}
              servingSize="1 piece"
              thcPerServing={nutritionData.thcPerServing}
              caloriesPerServing={nutritionData.calories}
              proteinPerServing={nutritionData.protein}
              carbsPerServing={nutritionData.carbs}
              fatPerServing={nutritionData.fat}
              fiberPerServing={(nutritionData as any).fiber || 0}
              sugarPerServing={(nutritionData as any).sugar || 0}
              sodiumPerServing={(nutritionData as any).sodium || 0}
              saturatedFatPerServing={(nutritionData as any).saturatedFat || 0}
              cholesterolPerServing={(nutritionData as any).cholesterol || 0}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}