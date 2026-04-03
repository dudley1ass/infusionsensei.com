import { useState, useEffect, useRef, Fragment } from "react";
import { flushSync } from "react-dom";
import { useSearchParams, useNavigate, useLocation, Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { 
  ChefHat, 
  Plus, 
  Trash2, 
  FlaskConical, 
  Lightbulb,
  ArrowLeft,
  ArrowRight,
  Calculator,
  ArrowLeftRight,
  Printer,
  Copy,
  Share2,
  CheckCheck,
  LayoutGrid,
  Search,
} from "lucide-react";
import { InfusionBase } from "../types/infusion";
import { NutritionFactsLabel } from "../components/NutritionFactsLabel";
import { safeJsonParse } from "../utils/storage";
import { trackEvent } from "../utils/analytics";
import {
  COFFEE_TO_BUILDER_RECIPE,
  LEGACY_FRIES_RECIPE_TO_SPREADS_DIP,
  POPCORN_TO_BUILDER_RECIPE,
  SPREADS_DIPS_TO_BUILDER_RECIPE,
  WING_SAUCE_TO_BUILDER_RECIPE,
} from "../data/builderRecipeMaps";
import { standardRecipes } from "../data/standardRecipes";

export { standardRecipes };


// Common ingredient library
const INGREDIENT_LIBRARY = [
  // ── INFUSED (Cannabis) ──────────────────────────────────────────
  { name: "Cannabutter",                          category: "infused",    defaultAmount: 113, defaultUnit: "g",       thcPerUnit: 1,   calories: 717, carbs: 0,   protein: 1,   fat: 81,  type: "fat" },
  { name: "Cannabis Coconut Oil",                 category: "infused",    defaultAmount: 60,  defaultUnit: "ml",      thcPerUnit: 1,   calories: 862, carbs: 0,   protein: 0,   fat: 100, type: "liquid" },
  { name: "Cannabis Olive Oil",                   category: "infused",    defaultAmount: 60,  defaultUnit: "ml",      thcPerUnit: 1,   calories: 884, carbs: 0,   protein: 0,   fat: 100, type: "liquid" },
  { name: "THC Tincture",                         category: "infused",    defaultAmount: 1,   defaultUnit: "ml",      thcPerUnit: 25,  calories: 7,   carbs: 0,   protein: 0,   fat: 0,   type: "liquid" },
  { name: "Cannabis Honey",                       category: "infused",    defaultAmount: 15,  defaultUnit: "g",       thcPerUnit: 5,   calories: 304, carbs: 82,  protein: 0,   fat: 0,   type: "liquid" },
  { name: "Cannabis Agave Syrup",                 category: "infused",    defaultAmount: 15,  defaultUnit: "ml",      thcPerUnit: 5,   calories: 60,  carbs: 16,  protein: 0,   fat: 0,   type: "liquid" },
  { name: "THC Distillate",                       category: "infused",    defaultAmount: 1,   defaultUnit: "g",       thcPerUnit: 800, calories: 9,   carbs: 0,   protein: 0,   fat: 1,   type: "solid" },
  { name: "Select Squeeze (5mg/squeeze)",         category: "infused",    defaultAmount: 1,   defaultUnit: "squeeze", thcPerUnit: 5,   calories: 2,   carbs: 0,   protein: 0,   fat: 0,   type: "liquid" },
  { name: "Zero Proof Squeeze (2.5mg/squeeze)",   category: "infused",    defaultAmount: 1,   defaultUnit: "squeeze", thcPerUnit: 2.5, calories: 1,   carbs: 0,   protein: 0,   fat: 0,   type: "liquid" },
  { name: "Zero Proof Stir Powder (5mg/packet)",  category: "infused",    defaultAmount: 1,   defaultUnit: "packet",  thcPerUnit: 5,   calories: 5,   carbs: 1,   protein: 0,   fat: 0,   type: "powder" },
  { name: "THC Simple Syrup (10mg/ml)",           category: "infused",    defaultAmount: 5,   defaultUnit: "ml",      thcPerUnit: 10,  calories: 25,  carbs: 6,   protein: 0,   fat: 0,   type: "liquid" },
  { name: "THC Tincture Dropper (5mg/dropper)",   category: "infused",    defaultAmount: 1,   defaultUnit: "dropper", thcPerUnit: 5,   calories: 4,   carbs: 0,   protein: 0,   fat: 0,   type: "liquid" },
  { name: "THC Distillate Syringe (25mg/0.1ml)",  category: "infused",    defaultAmount: 1,   defaultUnit: "0.1ml",   thcPerUnit: 25,  calories: 2,   carbs: 0,   protein: 0,   fat: 0,   type: "liquid" },

  // ── FLOURS & STARCHES ───────────────────────────────────────────
  { name: "All-Purpose Flour",      category: "flour",      defaultAmount: 250, defaultUnit: "g",     calories: 364, carbs: 76.3, protein: 10.3, fat: 1.0,  type: "powder" },
  { name: "Cake Flour",             category: "flour",      defaultAmount: 250, defaultUnit: "g",     calories: 355, carbs: 79.4, protein: 7.8,  fat: 0.8,  type: "powder" },
  { name: "Bread Flour",            category: "flour",      defaultAmount: 250, defaultUnit: "g",     calories: 361, carbs: 72.5, protein: 12.9, fat: 1.7,  type: "powder" },
  { name: "Whole Wheat Flour",      category: "flour",      defaultAmount: 200, defaultUnit: "g",     calories: 340, carbs: 72.0, protein: 13.2, fat: 2.5,  type: "powder" },
  { name: "Almond Flour",           category: "flour",      defaultAmount: 150, defaultUnit: "g",     calories: 571, carbs: 21.4, protein: 21.4, fat: 50.0, type: "powder" },
  { name: "Oat Flour",              category: "flour",      defaultAmount: 150, defaultUnit: "g",     calories: 404, carbs: 65.7, protein: 14.7, fat: 8.9,  type: "powder" },
  { name: "Rice Flour",             category: "flour",      defaultAmount: 200, defaultUnit: "g",     calories: 366, carbs: 80.1, protein: 6.0,  fat: 1.4,  type: "powder" },
  { name: "Coconut Flour",          category: "flour",      defaultAmount: 80,  defaultUnit: "g",     calories: 400, carbs: 57.0, protein: 18.0, fat: 14.0, type: "powder" },
  { name: "Buckwheat Flour",        category: "flour",      defaultAmount: 150, defaultUnit: "g",     calories: 335, carbs: 70.6, protein: 12.6, fat: 3.1,  type: "powder" },
  { name: "Cornstarch",             category: "flour",      defaultAmount: 30,  defaultUnit: "g",     calories: 381, carbs: 91.3, protein: 0.3,  fat: 0.1,  type: "powder" },
  { name: "Tapioca Starch",         category: "flour",      defaultAmount: 20,  defaultUnit: "g",     calories: 358, carbs: 88.7, protein: 0.2,  fat: 0.0,  type: "powder" },
  { name: "Cocoa Powder",           category: "flour",      defaultAmount: 40,  defaultUnit: "g",     calories: 228, carbs: 57.9, protein: 19.6, fat: 13.7, type: "powder" },
  { name: "Cocoa Powder (Natural)", category: "flour",      defaultAmount: 40,  defaultUnit: "g",     calories: 228, carbs: 57.9, protein: 19.6, fat: 13.7, type: "powder" },
  { name: "Dutch Cocoa Powder",     category: "flour",      defaultAmount: 40,  defaultUnit: "g",     calories: 220, carbs: 59.0, protein: 18.5, fat: 12.0, type: "powder" },
  { name: "Espresso Powder",        category: "flour",      defaultAmount: 5,   defaultUnit: "g",     calories: 291, carbs: 61.9, protein: 14.6, fat: 0.5,  type: "powder" },
  { name: "Matcha Powder",          category: "flour",      defaultAmount: 10,  defaultUnit: "g",     calories: 324, carbs: 38.0, protein: 30.0, fat: 5.0,  type: "powder" },
  { name: "Graham Cracker Crumbs",  category: "flour",      defaultAmount: 200, defaultUnit: "g",     calories: 432, carbs: 72.0, protein: 7.0,  fat: 13.5, type: "powder" },
  { name: "Cornmeal",               category: "flour",      defaultAmount: 30,  defaultUnit: "g",     calories: 362, carbs: 76.9, protein: 8.1,  fat: 3.6,  type: "powder" },

  // ── SUGARS & SWEETENERS ─────────────────────────────────────────
  { name: "Granulated Sugar",       category: "sugar",      defaultAmount: 200, defaultUnit: "g",     calories: 387, carbs: 99.8, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Brown Sugar (Light)",    category: "sugar",      defaultAmount: 200, defaultUnit: "g",     calories: 377, carbs: 97.3, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Brown Sugar (Dark)",     category: "sugar",      defaultAmount: 200, defaultUnit: "g",     calories: 380, carbs: 98.1, protein: 0.2,  fat: 0.0,  type: "powder" },
  { name: "Powdered Sugar",         category: "sugar",      defaultAmount: 100, defaultUnit: "g",     calories: 389, carbs: 99.7, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Raw Turbinado Sugar",    category: "sugar",      defaultAmount: 150, defaultUnit: "g",     calories: 385, carbs: 99.5, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Coconut Sugar",          category: "sugar",      defaultAmount: 150, defaultUnit: "g",     calories: 375, carbs: 95.0, protein: 0.4,  fat: 0.0,  type: "powder" },
  { name: "Honey",                  category: "sugar",      defaultAmount: 80,  defaultUnit: "g",     calories: 304, carbs: 82.4, protein: 0.3,  fat: 0.0,  type: "liquid" },
  { name: "Maple Syrup",            category: "sugar",      defaultAmount: 80,  defaultUnit: "ml",    calories: 260, carbs: 67.0, protein: 0.0,  fat: 0.1,  type: "liquid" },
  { name: "Agave Nectar",           category: "sugar",      defaultAmount: 80,  defaultUnit: "ml",    calories: 310, carbs: 76.0, protein: 0.1,  fat: 0.5,  type: "liquid" },
  { name: "Molasses",               category: "sugar",      defaultAmount: 50,  defaultUnit: "g",     calories: 290, carbs: 74.7, protein: 0.0,  fat: 0.1,  type: "liquid" },
  { name: "Monk Fruit Sweetener",   category: "sugar",      defaultAmount: 50,  defaultUnit: "g",     calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Corn Syrup",             category: "sugar",      defaultAmount: 60,  defaultUnit: "ml",    calories: 286, carbs: 77.6, protein: 0.0,  fat: 0.0,  type: "liquid" },

  // ── FATS & OILS ─────────────────────────────────────────────────
  { name: "Unsalted Butter",        category: "fat",        defaultAmount: 115, defaultUnit: "g",     calories: 717, carbs: 0.1,  protein: 0.9,  fat: 81.1, type: "fat" },
  { name: "Salted Butter",          category: "fat",        defaultAmount: 115, defaultUnit: "g",     calories: 714, carbs: 0.1,  protein: 0.9,  fat: 80.5, type: "fat" },
  { name: "Brown Butter",           category: "fat",        defaultAmount: 115, defaultUnit: "g",     calories: 740, carbs: 0.2,  protein: 1.0,  fat: 83.0, type: "fat" },
  { name: "Vegan Butter",           category: "fat",        defaultAmount: 115, defaultUnit: "g",     calories: 700, carbs: 1.0,  protein: 0.0,  fat: 78.0, type: "fat" },
  { name: "Shortening",             category: "fat",        defaultAmount: 100, defaultUnit: "g",     calories: 884, carbs: 0.0,  protein: 0.0,  fat: 100.0,type: "fat" },
  { name: "Vegetable Oil",          category: "fat",        defaultAmount: 120, defaultUnit: "ml",    calories: 884, carbs: 0.0,  protein: 0.0,  fat: 100.0,type: "liquid" },
  { name: "Coconut Oil",            category: "fat",        defaultAmount: 100, defaultUnit: "ml",    calories: 862, carbs: 0.0,  protein: 0.0,  fat: 100.0,type: "liquid" },
  { name: "Olive Oil",              category: "fat",        defaultAmount: 100, defaultUnit: "ml",    calories: 884, carbs: 0.0,  protein: 0.0,  fat: 100.0,type: "liquid" },
  { name: "Avocado Oil",            category: "fat",        defaultAmount: 100, defaultUnit: "ml",    calories: 884, carbs: 0.0,  protein: 0.0,  fat: 100.0,type: "liquid" },
  { name: "Cream Cheese",           category: "fat",        defaultAmount: 200, defaultUnit: "g",     calories: 342, carbs: 2.9,  protein: 6.2,  fat: 34.2, type: "semi-solid" },

  // ── EGGS ────────────────────────────────────────────────────────
  { name: "Whole Egg (large)",      category: "egg",        defaultAmount: 1,   defaultUnit: "large", calories: 143, carbs: 0.7,  protein: 12.6, fat: 9.5,  type: "count" },
  { name: "Egg Yolk",               category: "egg",        defaultAmount: 1,   defaultUnit: "large", calories: 322, carbs: 3.6,  protein: 15.9, fat: 26.5, type: "count" },
  { name: "Egg White",              category: "egg",        defaultAmount: 1,   defaultUnit: "large", calories: 52,  carbs: 0.7,  protein: 10.9, fat: 0.2,  type: "count" },
  { name: "Flax Egg",               category: "egg",        defaultAmount: 45,  defaultUnit: "g",     calories: 37,  carbs: 2.8,  protein: 2.0,  fat: 2.5,  type: "semi-solid" },

  // ── LEAVENING ───────────────────────────────────────────────────
  { name: "Baking Powder",          category: "leavening",  defaultAmount: 1,   defaultUnit: "tsp",   calories: 53,  carbs: 27.7, protein: 0.0,  fat: 0.0,  type: "powder", driftSoftPct: 0.05, driftHardPct: 0.1 },
  { name: "Baking Soda",            category: "leavening",  defaultAmount: 0.5, defaultUnit: "tsp",   calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "powder", driftSoftPct: 0.05, driftHardPct: 0.1 },
  { name: "Cream of Tartar",        category: "leavening",  defaultAmount: 3,   defaultUnit: "g",     calories: 218, carbs: 54.3, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Instant Yeast",          category: "leavening",  defaultAmount: 7,   defaultUnit: "g",     calories: 325, carbs: 40.7, protein: 40.4, fat: 7.6,  type: "powder" },
  { name: "Gelatin (unflavored)",   category: "leavening",  defaultAmount: 7,   defaultUnit: "g",     calories: 335, carbs: 0.0,  protein: 85.0, fat: 0.0,  type: "powder" },
  { name: "Red Food Coloring",      category: "flavoring",  defaultAmount: 10,  defaultUnit: "ml",    calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "liquid" },

  // ── DAIRY ───────────────────────────────────────────────────────
  { name: "Whole Milk",             category: "dairy",      defaultAmount: 120, defaultUnit: "ml",    calories: 61,  carbs: 4.8,  protein: 3.2,  fat: 3.3,  type: "liquid" },
  { name: "2% Milk",                category: "dairy",      defaultAmount: 120, defaultUnit: "ml",    calories: 50,  carbs: 4.9,  protein: 3.4,  fat: 2.0,  type: "liquid" },
  { name: "Skim Milk",              category: "dairy",      defaultAmount: 120, defaultUnit: "ml",    calories: 34,  carbs: 5.0,  protein: 3.4,  fat: 0.1,  type: "liquid" },
  { name: "Buttermilk",             category: "dairy",      defaultAmount: 120, defaultUnit: "ml",    calories: 40,  carbs: 4.8,  protein: 3.3,  fat: 0.9,  type: "liquid" },
  { name: "Half and Half",          category: "dairy",      defaultAmount: 120, defaultUnit: "ml",    calories: 130, carbs: 4.3,  protein: 3.0,  fat: 11.5, type: "liquid" },
  { name: "Heavy Cream",            category: "dairy",      defaultAmount: 120, defaultUnit: "ml",    calories: 345, carbs: 2.8,  protein: 2.8,  fat: 36.1, type: "liquid" },
  { name: "Whipping Cream",         category: "dairy",      defaultAmount: 120, defaultUnit: "ml",    calories: 292, carbs: 2.8,  protein: 2.2,  fat: 30.9, type: "liquid" },
  { name: "Sour Cream",             category: "dairy",      defaultAmount: 120, defaultUnit: "g",     calories: 198, carbs: 4.6,  protein: 2.9,  fat: 19.4, type: "semi-solid" },
  { name: "Greek Yogurt",           category: "dairy",      defaultAmount: 120, defaultUnit: "g",     calories: 59,  carbs: 3.6,  protein: 10.2, fat: 0.4,  type: "semi-solid" },
  { name: "Ricotta Cheese",         category: "dairy",      defaultAmount: 120, defaultUnit: "g",     calories: 174, carbs: 3.0,  protein: 11.3, fat: 13.0, type: "semi-solid" },
  { name: "Mascarpone",             category: "dairy",      defaultAmount: 100, defaultUnit: "g",     calories: 429, carbs: 3.6,  protein: 4.8,  fat: 44.1, type: "semi-solid" },
  { name: "Parmesan Cheese",        category: "dairy",      defaultAmount: 50,  defaultUnit: "g",     calories: 431, carbs: 4.1,  protein: 38.0, fat: 29.0, type: "semi-solid" },
  { name: "Cheddar Cheese",         category: "dairy",      defaultAmount: 50,  defaultUnit: "g",     calories: 403, carbs: 1.3,  protein: 25.0, fat: 33.0, type: "semi-solid" },
  { name: "Mozzarella Cheese",      category: "dairy",      defaultAmount: 50,  defaultUnit: "g",     calories: 280, carbs: 2.2,  protein: 28.0, fat: 17.0, type: "semi-solid" },
  { name: "Sweetened Condensed Milk", category: "dairy",   defaultAmount: 400, defaultUnit: "ml",    calories: 321, carbs: 54.4, protein: 8.0,  fat: 8.7,  type: "liquid" },
  { name: "Evaporated Milk",        category: "dairy",      defaultAmount: 355, defaultUnit: "ml",    calories: 134, carbs: 10.0, protein: 6.8,  fat: 7.6,  type: "liquid" },

  // ── LIQUIDS ─────────────────────────────────────────────────────
  { name: "Water",                  category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Sparkling Water",        category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Club Soda",              category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Oat Milk",               category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 45,  carbs: 7.5,  protein: 1.0,  fat: 1.5,  type: "liquid" },
  { name: "Almond Milk",            category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 17,  carbs: 1.4,  protein: 0.6,  fat: 1.1,  type: "liquid" },
  { name: "Soy Milk",               category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 54,  carbs: 6.3,  protein: 3.3,  fat: 1.8,  type: "liquid" },
  { name: "Coconut Milk (canned)",  category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 197, carbs: 2.8,  protein: 2.0,  fat: 21.3, type: "liquid" },
  { name: "Coconut Milk (carton)",  category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 45,  carbs: 1.0,  protein: 0.5,  fat: 4.5,  type: "liquid" },
  { name: "Cashew Milk",            category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 25,  carbs: 1.0,  protein: 0.5,  fat: 2.0,  type: "liquid" },
  { name: "Rice Milk",              category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 47,  carbs: 9.2,  protein: 0.3,  fat: 1.0,  type: "liquid" },
  { name: "Macadamia Milk",         category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 50,  carbs: 1.0,  protein: 0.5,  fat: 5.0,  type: "liquid" },
  { name: "Cola",                   category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 41,  carbs: 10.6, protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Root Beer",              category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 44,  carbs: 11.3, protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Ginger Ale",             category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 34,  carbs: 8.7,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Lemon-Lime Soda",        category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 38,  carbs: 9.7,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Orange Juice",           category: "liquid",     defaultAmount: 80,  defaultUnit: "ml",    calories: 45,  carbs: 10.4, protein: 0.7,  fat: 0.2,  type: "liquid" },
  { name: "Apple Juice",            category: "liquid",     defaultAmount: 80,  defaultUnit: "ml",    calories: 46,  carbs: 11.4, protein: 0.1,  fat: 0.1,  type: "liquid" },
  { name: "Lemon Juice",            category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 22,  carbs: 6.9,  protein: 0.4,  fat: 0.2,  type: "liquid" },
  { name: "Lime Juice",             category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 25,  carbs: 8.4,  protein: 0.4,  fat: 0.1,  type: "liquid" },
  { name: "Pineapple Juice",        category: "liquid",     defaultAmount: 80,  defaultUnit: "ml",    calories: 53,  carbs: 12.9, protein: 0.4,  fat: 0.1,  type: "liquid" },
  { name: "Mango Juice",            category: "liquid",     defaultAmount: 80,  defaultUnit: "ml",    calories: 60,  carbs: 15.1, protein: 0.4,  fat: 0.1,  type: "liquid" },
  { name: "Cranberry Juice",        category: "liquid",     defaultAmount: 80,  defaultUnit: "ml",    calories: 46,  carbs: 12.2, protein: 0.4,  fat: 0.1,  type: "liquid" },
  { name: "Fruit Juice",            category: "liquid",     defaultAmount: 120, defaultUnit: "ml",    calories: 50,  carbs: 12.0, protein: 0.5,  fat: 0.1,  type: "liquid" },
  { name: "Coffee (brewed)",        category: "liquid",     defaultAmount: 80,  defaultUnit: "ml",    calories: 1,   carbs: 0.0,  protein: 0.3,  fat: 0.0,  type: "liquid" },
  { name: "Espresso (brewed)",      category: "liquid",     defaultAmount: 40,  defaultUnit: "ml",    calories: 9,   carbs: 1.7,  protein: 0.6,  fat: 0.2,  type: "liquid" },
  { name: "Black Tea (brewed)",     category: "liquid",     defaultAmount: 80,  defaultUnit: "ml",    calories: 1,   carbs: 0.3,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Green Tea (brewed)",     category: "liquid",     defaultAmount: 80,  defaultUnit: "ml",    calories: 1,   carbs: 0.2,  protein: 0.2,  fat: 0.0,  type: "liquid" },
  { name: "Rum",                    category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 231, carbs: 0.1,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Dark Rum",               category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 231, carbs: 0.1,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Bourbon Whiskey",        category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 231, carbs: 0.1,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Amaretto",               category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 235, carbs: 27.0, protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Kahlua",                 category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 327, carbs: 48.0, protein: 0.0,  fat: 0.1,  type: "liquid" },
  { name: "Grand Marnier",          category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 265, carbs: 22.0, protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Baileys Irish Cream",    category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 327, carbs: 25.0, protein: 3.8,  fat: 14.0, type: "liquid" },
  { name: "Red Wine",               category: "liquid",     defaultAmount: 60,  defaultUnit: "ml",    calories: 85,  carbs: 2.6,  protein: 0.1,  fat: 0.0,  type: "liquid" },
  { name: "White Vinegar",          category: "liquid",     defaultAmount: 5,   defaultUnit: "ml",    calories: 3,   carbs: 0.1,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Hot Water",              category: "liquid",     defaultAmount: 200, defaultUnit: "ml",    calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Chicken Broth",          category: "liquid",     defaultAmount: 240, defaultUnit: "ml",    calories: 7,   carbs: 0.9,  protein: 0.5,  fat: 0.2,  type: "liquid" },

  // ── CHOCOLATE & CHIPS ───────────────────────────────────────────
  { name: "Dark Chocolate Chips",   category: "chocolate",  defaultAmount: 150, defaultUnit: "g",     calories: 546, carbs: 59.4, protein: 4.9,  fat: 31.3, type: "solid" },
  { name: "Milk Chocolate Chips",   category: "chocolate",  defaultAmount: 150, defaultUnit: "g",     calories: 535, carbs: 59.2, protein: 7.7,  fat: 29.7, type: "solid" },
  { name: "White Chocolate Chips",  category: "chocolate",  defaultAmount: 150, defaultUnit: "g",     calories: 539, carbs: 58.8, protein: 5.9,  fat: 32.1, type: "solid" },
  { name: "Semi-Sweet Chips",       category: "chocolate",  defaultAmount: 150, defaultUnit: "g",     calories: 480, carbs: 63.1, protein: 5.0,  fat: 27.0, type: "solid" },
  { name: "Cacao Nibs",             category: "chocolate",  defaultAmount: 50,  defaultUnit: "g",     calories: 480, carbs: 46.0, protein: 12.0, fat: 38.0, type: "solid" },
  { name: "Dark Chocolate Bar",     category: "chocolate",  defaultAmount: 100, defaultUnit: "g",     calories: 546, carbs: 59.4, protein: 4.9,  fat: 31.3, type: "solid" },
  { name: "Milk Chocolate Bar",     category: "chocolate",  defaultAmount: 100, defaultUnit: "g",     calories: 535, carbs: 59.2, protein: 7.7,  fat: 29.7, type: "solid" },
  { name: "Nutella",                category: "chocolate",  defaultAmount: 60,  defaultUnit: "g",     calories: 539, carbs: 57.9, protein: 6.3,  fat: 30.9, type: "semi-solid" },
  { name: "Caramel Chips",          category: "chocolate",  defaultAmount: 100, defaultUnit: "g",     calories: 500, carbs: 75.0, protein: 3.0,  fat: 20.0, type: "solid" },
  { name: "Butterscotch Chips",     category: "chocolate",  defaultAmount: 100, defaultUnit: "g",     calories: 497, carbs: 74.0, protein: 2.5,  fat: 20.0, type: "solid" },
  { name: "Peanut Butter Chips",    category: "chocolate",  defaultAmount: 100, defaultUnit: "g",     calories: 514, carbs: 63.0, protein: 12.0, fat: 24.0, type: "solid" },
  { name: "Cinnamon Chips",         category: "chocolate",  defaultAmount: 100, defaultUnit: "g",     calories: 490, carbs: 70.0, protein: 3.0,  fat: 22.0, type: "solid" },

  // ── FRUITS ──────────────────────────────────────────────────────
  { name: "Fresh Blueberries",      category: "fruit",      defaultAmount: 150, defaultUnit: "g",     calories: 57,  carbs: 14.5, protein: 0.7,  fat: 0.3,  type: "solid" },
  { name: "Fresh Raspberries",      category: "fruit",      defaultAmount: 120, defaultUnit: "g",     calories: 52,  carbs: 11.9, protein: 1.2,  fat: 0.7,  type: "solid" },
  { name: "Fresh Strawberries",     category: "fruit",      defaultAmount: 150, defaultUnit: "g",     calories: 32,  carbs: 7.7,  protein: 0.7,  fat: 0.3,  type: "solid" },
  { name: "Fresh Cherries",         category: "fruit",      defaultAmount: 150, defaultUnit: "g",     calories: 63,  carbs: 16.0, protein: 1.1,  fat: 0.2,  type: "solid" },
  { name: "Banana (mashed)",        category: "fruit",      defaultAmount: 120, defaultUnit: "g",     calories: 89,  carbs: 22.8, protein: 1.1,  fat: 0.3,  type: "semi-solid" },
  { name: "Apple (grated)",         category: "fruit",      defaultAmount: 100, defaultUnit: "g",     calories: 52,  carbs: 13.8, protein: 0.3,  fat: 0.2,  type: "semi-solid" },
  { name: "Pumpkin Puree",          category: "fruit",      defaultAmount: 120, defaultUnit: "g",     calories: 26,  carbs: 6.5,  protein: 1.0,  fat: 0.1,  type: "semi-solid" },
  { name: "Zucchini (grated)",      category: "fruit",      defaultAmount: 150, defaultUnit: "g",     calories: 17,  carbs: 3.1,  protein: 1.2,  fat: 0.3,  type: "semi-solid" },
  { name: "Carrot (grated)",        category: "fruit",      defaultAmount: 150, defaultUnit: "g",     calories: 41,  carbs: 9.6,  protein: 0.9,  fat: 0.2,  type: "semi-solid" },
  { name: "Lemon Zest",             category: "fruit",      defaultAmount: 10,  defaultUnit: "g",     calories: 47,  carbs: 16.0, protein: 1.5,  fat: 0.3,  type: "solid" },
  { name: "Orange Zest",            category: "fruit",      defaultAmount: 10,  defaultUnit: "g",     calories: 97,  carbs: 25.0, protein: 1.5,  fat: 0.2,  type: "solid" },
  { name: "Lime Zest",              category: "fruit",      defaultAmount: 5,   defaultUnit: "g",     calories: 47,  carbs: 16.0, protein: 1.5,  fat: 0.3,  type: "solid" },
  { name: "Dried Cranberries",      category: "fruit",      defaultAmount: 80,  defaultUnit: "g",     calories: 308, carbs: 82.4, protein: 0.1,  fat: 1.1,  type: "solid" },
  { name: "Raisins",                category: "fruit",      defaultAmount: 100, defaultUnit: "g",     calories: 299, carbs: 79.2, protein: 3.1,  fat: 0.5,  type: "solid" },
  { name: "Dried Apricots",         category: "fruit",      defaultAmount: 80,  defaultUnit: "g",     calories: 241, carbs: 62.6, protein: 3.4,  fat: 0.5,  type: "solid" },
  { name: "Maraschino Cherries",    category: "fruit",      defaultAmount: 80,  defaultUnit: "g",     calories: 165, carbs: 42.9, protein: 0.1,  fat: 0.2,  type: "solid" },
  { name: "Coconut Flakes",         category: "fruit",      defaultAmount: 80,  defaultUnit: "g",     calories: 660, carbs: 23.7, protein: 6.9,  fat: 64.5, type: "solid" },
  { name: "Shredded Coconut",       category: "fruit",      defaultAmount: 80,  defaultUnit: "g",     calories: 466, carbs: 18.6, protein: 4.3,  fat: 46.9, type: "solid" },
  { name: "Mango (diced)",          category: "fruit",      defaultAmount: 120, defaultUnit: "g",     calories: 60,  carbs: 15.0, protein: 0.8,  fat: 0.4,  type: "solid" },
  { name: "Pineapple (crushed)",    category: "fruit",      defaultAmount: 100, defaultUnit: "g",     calories: 50,  carbs: 13.1, protein: 0.5,  fat: 0.1,  type: "solid" },
  { name: "Applesauce",             category: "fruit",      defaultAmount: 120, defaultUnit: "g",     calories: 48,  carbs: 12.8, protein: 0.2,  fat: 0.1,  type: "semi-solid" },
  { name: "Dates (chopped)",        category: "fruit",      defaultAmount: 80,  defaultUnit: "g",     calories: 282, carbs: 75.0, protein: 2.5,  fat: 0.4,  type: "solid" },
  { name: "Sweet Potato",           category: "fruit",      defaultAmount: 200, defaultUnit: "g",     calories: 86,  carbs: 20.1, protein: 1.6,  fat: 0.1,  type: "semi-solid" },

  // ── NUTS & SEEDS ────────────────────────────────────────────────
  { name: "Walnuts (chopped)",      category: "nuts",       defaultAmount: 80,  defaultUnit: "g",     calories: 654, carbs: 13.7, protein: 15.2, fat: 65.2, type: "solid" },
  { name: "Pecans (chopped)",       category: "nuts",       defaultAmount: 80,  defaultUnit: "g",     calories: 691, carbs: 13.9, protein: 9.2,  fat: 72.0, type: "solid" },
  { name: "Almonds (sliced)",       category: "nuts",       defaultAmount: 80,  defaultUnit: "g",     calories: 576, carbs: 21.6, protein: 21.2, fat: 49.9, type: "solid" },
  { name: "Hazelnuts (chopped)",    category: "nuts",       defaultAmount: 80,  defaultUnit: "g",     calories: 628, carbs: 16.7, protein: 15.0, fat: 60.8, type: "solid" },
  { name: "Macadamia Nuts",         category: "nuts",       defaultAmount: 80,  defaultUnit: "g",     calories: 718, carbs: 13.8, protein: 7.9,  fat: 75.8, type: "solid" },
  { name: "Pistachios (chopped)",   category: "nuts",       defaultAmount: 60,  defaultUnit: "g",     calories: 562, carbs: 27.5, protein: 20.2, fat: 45.4, type: "solid" },
  { name: "Cashews (chopped)",      category: "nuts",       defaultAmount: 80,  defaultUnit: "g",     calories: 553, carbs: 30.2, protein: 18.2, fat: 43.9, type: "solid" },
  { name: "Pine Nuts",              category: "nuts",       defaultAmount: 50,  defaultUnit: "g",     calories: 673, carbs: 13.1, protein: 13.7, fat: 68.4, type: "solid" },
  { name: "Peanuts (crushed)",      category: "nuts",       defaultAmount: 80,  defaultUnit: "g",     calories: 567, carbs: 16.1, protein: 25.8, fat: 49.2, type: "solid" },
  { name: "Sunflower Seeds",        category: "nuts",       defaultAmount: 50,  defaultUnit: "g",     calories: 584, carbs: 20.0, protein: 20.8, fat: 51.5, type: "solid" },
  { name: "Pumpkin Seeds",          category: "nuts",       defaultAmount: 50,  defaultUnit: "g",     calories: 559, carbs: 10.7, protein: 30.2, fat: 49.1, type: "solid" },
  { name: "Sesame Seeds",           category: "nuts",       defaultAmount: 30,  defaultUnit: "g",     calories: 573, carbs: 23.5, protein: 17.7, fat: 49.7, type: "solid" },
  { name: "Chia Seeds",             category: "nuts",       defaultAmount: 20,  defaultUnit: "g",     calories: 486, carbs: 42.1, protein: 16.5, fat: 30.7, type: "solid" },

  // ── FLAVORINGS & EXTRACTS ───────────────────────────────────────
  { name: "Vanilla Extract",        category: "flavoring",  defaultAmount: 5,   defaultUnit: "ml",    calories: 288, carbs: 12.7, protein: 0.1,  fat: 0.1,  type: "liquid" },
  { name: "Vanilla Bean Paste",     category: "flavoring",  defaultAmount: 5,   defaultUnit: "ml",    calories: 292, carbs: 13.0, protein: 0.1,  fat: 0.1,  type: "liquid" },
  { name: "Almond Extract",         category: "flavoring",  defaultAmount: 3,   defaultUnit: "ml",    calories: 263, carbs: 1.0,  protein: 0.0,  fat: 0.1,  type: "liquid" },
  { name: "Peppermint Extract",     category: "flavoring",  defaultAmount: 3,   defaultUnit: "ml",    calories: 290, carbs: 0.4,  protein: 0.0,  fat: 0.1,  type: "liquid" },
  { name: "Lemon Extract",          category: "flavoring",  defaultAmount: 3,   defaultUnit: "ml",    calories: 259, carbs: 0.5,  protein: 0.0,  fat: 0.1,  type: "liquid" },
  { name: "Rose Water",             category: "flavoring",  defaultAmount: 10,  defaultUnit: "ml",    calories: 2,   carbs: 0.5,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Orange Blossom Water",   category: "flavoring",  defaultAmount: 10,  defaultUnit: "ml",    calories: 2,   carbs: 0.5,  protein: 0.0,  fat: 0.0,  type: "liquid" },

  // ── SPICES ──────────────────────────────────────────────────────
  { name: "Salt",                   category: "spice",      defaultAmount: 3,   defaultUnit: "g",     calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Black Pepper",           category: "spice",      defaultAmount: 3,   defaultUnit: "g",     calories: 251, carbs: 63.9, protein: 10.4, fat: 3.3,  type: "powder" },
  { name: "Cinnamon",               category: "spice",      defaultAmount: 5,   defaultUnit: "g",     calories: 247, carbs: 80.6, protein: 4.0,  fat: 1.2,  type: "powder" },
  { name: "Nutmeg",                 category: "spice",      defaultAmount: 2,   defaultUnit: "g",     calories: 525, carbs: 49.3, protein: 5.8,  fat: 36.3, type: "powder" },
  { name: "Cardamom",               category: "spice",      defaultAmount: 2,   defaultUnit: "g",     calories: 311, carbs: 68.5, protein: 10.8, fat: 6.7,  type: "powder" },
  { name: "Ginger (ground)",        category: "spice",      defaultAmount: 3,   defaultUnit: "g",     calories: 335, carbs: 71.6, protein: 8.98, fat: 4.2,  type: "powder" },
  { name: "Cloves",                 category: "spice",      defaultAmount: 2,   defaultUnit: "g",     calories: 274, carbs: 65.5, protein: 6.0,  fat: 13.0, type: "powder" },
  { name: "Pumpkin Pie Spice",      category: "spice",      defaultAmount: 5,   defaultUnit: "g",     calories: 282, carbs: 65.0, protein: 5.4,  fat: 4.3,  type: "powder" },
  { name: "Lavender (culinary)",    category: "spice",      defaultAmount: 3,   defaultUnit: "g",     calories: 49,  carbs: 8.9,  protein: 3.0,  fat: 0.7,  type: "powder" },
  { name: "Allspice",               category: "spice",      defaultAmount: 2,   defaultUnit: "g",     calories: 263, carbs: 72.1, protein: 6.1,  fat: 8.7,  type: "powder" },
  { name: "Thyme",                  category: "spice",      defaultAmount: 2,   defaultUnit: "g",     calories: 276, carbs: 63.9, protein: 9.1,  fat: 7.4,  type: "powder" },
  { name: "Oregano (dried)",        category: "spice",      defaultAmount: 3,   defaultUnit: "g",     calories: 265, carbs: 68.9, protein: 9.0,  fat: 4.3,  type: "powder" },
  { name: "Basil (dried)",          category: "spice",      defaultAmount: 3,   defaultUnit: "g",     calories: 251, carbs: 48.1, protein: 38.0, fat: 4.0,  type: "powder" },
  { name: "Mustard Powder",         category: "spice",      defaultAmount: 2,   defaultUnit: "g",     calories: 508, carbs: 28.1, protein: 26.0, fat: 36.0, type: "powder" },
  { name: "Rosemary",               category: "spice",      defaultAmount: 2,   defaultUnit: "g",     calories: 331, carbs: 64.1, protein: 4.9,  fat: 15.2, type: "powder" },
  { name: "Xanthan Gum",            category: "spice",      defaultAmount: 3,   defaultUnit: "g",     calories: 333, carbs: 83.3, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Poppy Seeds",            category: "spice",      defaultAmount: 20,  defaultUnit: "g",     calories: 525, carbs: 28.1, protein: 17.9, fat: 41.6, type: "solid" },
  { name: "Sprinkles",              category: "spice",      defaultAmount: 20,  defaultUnit: "g",     calories: 396, carbs: 96.4, protein: 0.0,  fat: 3.6,  type: "solid" },

  // ── FILLINGS & SPREADS ──────────────────────────────────────────
  { name: "Peanut Butter",          category: "filling",    defaultAmount: 80,  defaultUnit: "g",     calories: 588, carbs: 19.6, protein: 25.1, fat: 50.4, type: "semi-solid" },
  { name: "Almond Butter",          category: "filling",    defaultAmount: 80,  defaultUnit: "g",     calories: 614, carbs: 18.8, protein: 21.2, fat: 55.5, type: "semi-solid" },
  { name: "Nut Butter",             category: "filling",    defaultAmount: 120, defaultUnit: "g",     calories: 600, carbs: 20.0, protein: 22.0, fat: 52.0, type: "semi-solid" },
  { name: "Tahini",                 category: "filling",    defaultAmount: 60,  defaultUnit: "g",     calories: 595, carbs: 21.2, protein: 17.0, fat: 53.8, type: "semi-solid" },
  { name: "Strawberry Jam",         category: "filling",    defaultAmount: 80,  defaultUnit: "g",     calories: 278, carbs: 68.9, protein: 0.4,  fat: 0.1,  type: "semi-solid" },
  { name: "Raspberry Jam",          category: "filling",    defaultAmount: 80,  defaultUnit: "g",     calories: 278, carbs: 68.9, protein: 0.6,  fat: 0.1,  type: "semi-solid" },
  { name: "Lemon Curd",             category: "filling",    defaultAmount: 100, defaultUnit: "g",     calories: 236, carbs: 34.5, protein: 2.6,  fat: 10.6, type: "semi-solid" },
  { name: "Dulce de Leche",         category: "filling",    defaultAmount: 100, defaultUnit: "g",     calories: 307, carbs: 55.4, protein: 6.8,  fat: 7.3,  type: "semi-solid" },
  { name: "Caramel Sauce",          category: "filling",    defaultAmount: 80,  defaultUnit: "g",     calories: 382, carbs: 69.6, protein: 2.0,  fat: 9.5,  type: "liquid" },
  { name: "Cream Cheese Frosting",  category: "filling",    defaultAmount: 150, defaultUnit: "g",     calories: 393, carbs: 39.9, protein: 2.4,  fat: 25.6, type: "semi-solid" },
  { name: "Buttercream Frosting",   category: "filling",    defaultAmount: 150, defaultUnit: "g",     calories: 431, carbs: 62.3, protein: 0.3,  fat: 21.5, type: "semi-solid" },
  { name: "Ganache",                category: "filling",    defaultAmount: 100, defaultUnit: "g",     calories: 426, carbs: 40.0, protein: 4.0,  fat: 29.0, type: "semi-solid" },

  // ── SAVORY ──────────────────────────────────────────────────────
  { name: "Garlic",                 category: "savory",     defaultAmount: 3,   defaultUnit: "cloves",calories: 13,  carbs: 3.0,  protein: 1.0,  fat: 0.0,  type: "count" },
  { name: "Garlic Powder",          category: "savory",     defaultAmount: 3,   defaultUnit: "g",     calories: 331, carbs: 73.0, protein: 15.0, fat: 0.7,  type: "powder" },
  { name: "Onion Powder",           category: "savory",     defaultAmount: 3,   defaultUnit: "g",     calories: 341, carbs: 79.1, protein: 10.4, fat: 0.9,  type: "powder" },
  { name: "Chicken Wings",          category: "savory",     defaultAmount: 900, defaultUnit: "g",     calories: 203, carbs: 0.0,  protein: 30.0, fat: 9.0,  type: "solid" },
  { name: "French Fries",          category: "savory",     defaultAmount: 400, defaultUnit: "g",     calories: 312, carbs: 41.0, protein: 3.4,  fat: 15.0, type: "solid" },
  { name: "Popcorn Kernels",        category: "savory",     defaultAmount: 100, defaultUnit: "g",     calories: 375, carbs: 74.0, protein: 11.0, fat: 4.5,  type: "solid" },
  { name: "Rice Cereal",            category: "savory",     defaultAmount: 150, defaultUnit: "g",     calories: 387, carbs: 87.0, protein: 7.5,  fat: 0.9,  type: "solid" },
  { name: "Marshmallows",           category: "savory",     defaultAmount: 280, defaultUnit: "g",     calories: 318, carbs: 81.3, protein: 1.8,  fat: 0.2,  type: "solid" },
  { name: "Pretzels",               category: "savory",     defaultAmount: 20,  defaultUnit: "pieces",calories: 380, carbs: 79.0, protein: 10.0, fat: 3.0,  type: "solid" },
  { name: "Mayonnaise",             category: "savory",     defaultAmount: 120, defaultUnit: "g",     calories: 680, carbs: 1.0,  protein: 1.0,  fat: 75.0, type: "semi-solid" },
  { name: "Potato Fries",           category: "savory",     defaultAmount: 500, defaultUnit: "g",     calories: 312, carbs: 41.0, protein: 3.4,  fat: 15.0, type: "solid" },
  { name: "Hot Sauce",              category: "savory",     defaultAmount: 60,  defaultUnit: "ml",    calories: 11,  carbs: 1.0,  protein: 0.5,  fat: 0.5,  type: "liquid" },
  { name: "Italian Seasoning",      category: "savory",     defaultAmount: 5,   defaultUnit: "g",     calories: 265, carbs: 46.0, protein: 8.0,  fat: 7.0,  type: "powder" },
  { name: "Cajun Seasoning",        category: "savory",     defaultAmount: 8,   defaultUnit: "g",     calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Cayenne Pepper",         category: "savory",     defaultAmount: 2,   defaultUnit: "g",     calories: 318, carbs: 56.3, protein: 12.0, fat: 17.3, type: "powder" },
  { name: "Pasta (dry)",            category: "savory",     defaultAmount: 454, defaultUnit: "g",     calories: 371, carbs: 74.0, protein: 13.0, fat: 2.0,  type: "solid" },
  { name: "Steak",                  category: "savory",     defaultAmount: 2,   defaultUnit: "pieces",calories: 271, carbs: 0.0,  protein: 25.0, fat: 19.0, type: "count" },
  { name: "Protein Powder",         category: "savory",     defaultAmount: 30,  defaultUnit: "g",     calories: 120, carbs: 3.0,  protein: 24.0, fat: 1.5,  type: "powder" },
  { name: "Rolled Oats",            category: "savory",     defaultAmount: 200, defaultUnit: "g",     calories: 389, carbs: 66.0, protein: 17.0, fat: 7.0,  type: "powder" },
  { name: "Flavored Jello Mix",     category: "savory",     defaultAmount: 85,  defaultUnit: "g",     calories: 310, carbs: 77.0, protein: 7.0,  fat: 0.0,  type: "powder" },
  { name: "Chex Cereal",            category: "savory",     defaultAmount: 200, defaultUnit: "g",     calories: 390, carbs: 84.0, protein: 8.0,  fat: 5.0,  type: "solid" },
  { name: "Mixed Nuts",             category: "savory",     defaultAmount: 150, defaultUnit: "g",     calories: 600, carbs: 20.0, protein: 20.0, fat: 52.0, type: "solid" },
  { name: "Chicken Tenders",        category: "savory",     defaultAmount: 500, defaultUnit: "g",     calories: 165, carbs: 0.0,  protein: 31.0, fat: 4.0,  type: "solid" },
  { name: "Ground Beef",            category: "savory",     defaultAmount: 450, defaultUnit: "g",     calories: 250, carbs: 0.0,  protein: 26.0, fat: 17.0, type: "solid" },
  { name: "Ketchup",                category: "savory",     defaultAmount: 60,  defaultUnit: "ml",    calories: 112, carbs: 26.0, protein: 1.0,  fat: 0.0,  type: "liquid" },
  { name: "Mustard (yellow)",       category: "savory",     defaultAmount: 30,  defaultUnit: "ml",    calories: 66,  carbs: 5.0,  protein: 4.0,  fat: 4.0,  type: "liquid" },
  { name: "Worcestershire Sauce",   category: "savory",     defaultAmount: 15,  defaultUnit: "ml",    calories: 13,  carbs: 3.3,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Spinach (frozen)",       category: "savory",     defaultAmount: 150, defaultUnit: "g",     calories: 23,  carbs: 3.6,  protein: 3.0,  fat: 0.3,  type: "solid" },
  { name: "Artichoke Hearts",       category: "savory",     defaultAmount: 200, defaultUnit: "g",     calories: 45,  carbs: 9.0,  protein: 3.0,  fat: 0.0,  type: "solid" },
  { name: "Hot Dogs",               category: "savory",     defaultAmount: 12,  defaultUnit: "pieces",calories: 290, carbs: 3.0,  protein: 11.0, fat: 26.0, type: "count" },
  { name: "Cocktail Sausages",      category: "savory",     defaultAmount: 24,  defaultUnit: "pieces",calories: 280, carbs: 2.0,  protein: 12.0, fat: 24.0, type: "count" },
  { name: "Panko Breadcrumbs",      category: "savory",     defaultAmount: 100, defaultUnit: "g",     calories: 395, carbs: 72.0, protein: 13.0, fat: 4.2,  type: "powder" },
  { name: "Barbecue Sauce",         category: "savory",     defaultAmount: 60,  defaultUnit: "ml",    calories: 150, carbs: 35.0, protein: 1.0,  fat: 0.5,  type: "liquid" },
  { name: "Ranch Seasoning",        category: "savory",     defaultAmount: 10,  defaultUnit: "g",     calories: 400, carbs: 40.0, protein: 0.0,  fat: 40.0, type: "powder" },
  { name: "Rice Vinegar",           category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 6,   carbs: 0.1,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Apple Cider Vinegar",    category: "liquid",     defaultAmount: 30,  defaultUnit: "ml",    calories: 3,   carbs: 0.1,  protein: 0.0,  fat: 0.0,  type: "liquid" },
  { name: "Cheese Crackers",        category: "savory",     defaultAmount: 40,  defaultUnit: "pieces",calories: 480, carbs: 64.0, protein: 8.0,  fat: 22.0, type: "solid" },
];

// Recipe Categories
const recipeCategories = [
  { id: "baked-goods",     name: "🍪 Baked Goods",       emoji: "🍪", description: "Cookies, brownies, cakes" },
  { id: "wings",           name: "🍗 Wings",              emoji: "🍗", description: "Buffalo, garlic parm, Nashville hot" },
  { id: "spreads-dips",    name: "🥣 Spreads & Dips",     emoji: "🥣", description: "Dips, spreads & party sauces" },
  { id: "snacks",          name: "🍿 Snacks & Candy",     emoji: "🍿", description: "Popcorn, fudge, gummies, protein bars" },
  { id: "drinks",          name: "🥤 Drinks & Coffee",    emoji: "🥤", description: "Coffee, smoothies, cocktails" },
  { id: "savory-meals",    name: "🍝 Savory & Meals",     emoji: "🍝", description: "Pasta, pizza, steak" },
  { id: "ice-cream",       name: "🍨 Ice Cream & Frozen", emoji: "🍨", description: "Ice cream, popsicles" },
  { id: "breads-breakfast",name: "🍞 Breads & Breakfast", emoji: "🍞", description: "Muffins, pancakes, breakfast" },
];

/** Optional category → default recipe id for skipping the picker. Empty: every category opens recipe selection first. */
const DIRECT_CATEGORY_DEFAULTS: Record<string, string> = {};

type InfusionFunnelStep = 1 | 2 | 3;

const INFUSION_FUNNEL_STEPS: { step: InfusionFunnelStep; label: string }[] = [
  { step: 1, label: "Create or choose your base" },
  { step: 2, label: "Choose your recipe" },
  { step: 3, label: "Adjust strength & print" },
];

function InfusionFunnelProgressBar({
  activeStep,
  step1CompleteNote,
  step2CompleteNote,
  compact = false,
}: {
  activeStep: InfusionFunnelStep;
  step1CompleteNote?: string;
  step2CompleteNote?: string;
  compact?: boolean;
}) {
  return (
    <div className={`no-print ${compact ? "space-y-1.5 mb-2" : "space-y-2 mb-4"}`}>
      <div
        className={`flex flex-col rounded-xl border border-green-200 bg-gradient-to-br from-green-50 via-white to-green-50/50 shadow-sm sm:flex-row sm:items-stretch sm:justify-between sm:gap-1 ${
          compact ? "gap-2 px-2 py-2" : "gap-4 px-4 py-3"
        }`}
        role="navigation"
        aria-label="Guided infusion steps"
      >
        {INFUSION_FUNNEL_STEPS.map(({ step, label }, idx) => {
          const complete = activeStep > step;
          const active = activeStep === step;
          const dotSm = compact ? "h-6 w-6 text-[10px]" : "h-8 w-8 text-xs";
          return (
            <Fragment key={step}>
              {idx > 0 && <span className="hidden shrink-0 self-center text-green-300 sm:inline" aria-hidden>→</span>}
              <div
                className={`flex min-w-0 flex-1 items-center gap-2 sm:max-w-[min(100%,240px)] sm:flex-1 ${complete || active ? "" : "opacity-45"} ${compact ? "gap-1.5" : "gap-2.5"}`}
              >
                <div
                  className={
                    complete
                      ? `flex shrink-0 items-center justify-center rounded-full bg-green-600 font-black text-white ${dotSm}`
                      : active
                        ? `flex shrink-0 items-center justify-center rounded-full bg-green-600 font-black text-white ring-2 ring-green-400 ring-offset-1 ${dotSm}`
                        : `flex shrink-0 items-center justify-center rounded-full bg-gray-200 font-bold text-gray-500 ${dotSm}`
                  }
                >
                  {complete ? "✓" : step}
                </div>
                <div className="min-w-0">
                  <p
                    className={`font-bold uppercase tracking-wide text-green-700 ${compact ? "text-[9px] leading-none" : "text-[10px] sm:text-[11px]"}`}
                  >
                    Step {step}
                  </p>
                  <p
                    className={`leading-tight ${compact ? "text-[11px] sm:text-xs" : "text-xs sm:text-sm"} ${active ? "font-black text-green-900" : complete ? "font-semibold text-green-800" : "font-semibold text-gray-500"}`}
                  >
                    {label}
                  </p>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>
      {activeStep >= 2 && step1CompleteNote && (
        <p className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-900">
          <CheckCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden />
          <span>Step 1 complete: {step1CompleteNote}</span>
        </p>
      )}
      {activeStep >= 3 && step2CompleteNote && (
        <p className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-semibold text-green-900">
          <CheckCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden />
          <span>Step 2 complete: {step2CompleteNote}</span>
        </p>
      )}
    </div>
  );
}

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
  isInfused?: boolean;
  thcPerUnit?: number;
  /** When set, ingredient dosing/nutrition math uses this library row for density & category (saved infusions keep a custom `name`). */
  gramsLookupName?: string;
  /** Links to `localStorage` infusion base when the row is a saved infusion */
  infusionBaseId?: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  type: string;
};

const SAVED_INFUSION_VALUE_PREFIX = "__saved:";

function libraryAnchorNameForInfusionBase(base: InfusionBase): string {
  switch (base.type) {
    case "tincture":
    case "mct-oil":
      return "THC Tincture";
    case "coconut-oil":
    case "olive-oil":
    case "vegetable-oil":
      return "Cannabis Coconut Oil";
    case "simple-syrup":
    case "agave-syrup":
      return "Cannabis Agave Syrup";
    case "honey":
      return "Cannabis Honey";
    case "peanut-butter":
      return "Peanut Butter";
    case "cream-cheese":
    case "chocolate-spread":
    case "frosting":
    case "caramel":
      return "Cream Cheese";
    case "chocolate":
      return "Dark Chocolate Chips";
    case "cream":
      return "Heavy Cream";
    default:
      return "Cannabutter";
  }
}

function libraryRowForAnchor(anchor: string) {
  return INGREDIENT_LIBRARY.find((i) => i.name === anchor) ?? INGREDIENT_LIBRARY.find((i) => i.name === "Cannabutter")!;
}

function ingredientLibraryKey(ing: Ingredient): string {
  return ing.gramsLookupName ?? ing.name;
}

/** True for AP/coconut/cocoa structural flour — not cornstarch (sauces) or chocolate chips. */
function isStructuralBakingFlourKey(name: string): boolean {
  const l = INGREDIENT_LIBRARY.find((lib) => lib.name === name);
  if (l?.category !== "flour") return false;
  const kl = name.toLowerCase();
  if (kl.includes("chocolate") && !kl.includes("cocoa")) return false;
  if (name === "Cornstarch" || name === "Tapioca Starch" || name === "Arrowroot Powder") return false;
  return true;
}

function hasStructuralBakingFlour(ingredients: Ingredient[]): boolean {
  return ingredients.some((i) => isStructuralBakingFlourKey(ingredientLibraryKey(i)));
}

/** Soft / hard fractional drift vs servings-scaled template (e.g. 0.10 → OK within ±10%). Optional per-library overrides: driftSoftPct, driftHardPct */
function driftBandsForLibraryKey(key: string): { soft: number; hard: number } {
  const lib = INGREDIENT_LIBRARY.find((i) => i.name === key) as
    | { category?: string; driftSoftPct?: number; driftHardPct?: number }
    | undefined;
  if (
    lib &&
    typeof lib.driftSoftPct === "number" &&
    typeof lib.driftHardPct === "number" &&
    lib.driftHardPct > lib.driftSoftPct
  ) {
    return { soft: lib.driftSoftPct, hard: lib.driftHardPct };
  }
  const cat = lib?.category ?? "other";
  if (isStructuralBakingFlourKey(key)) return { soft: 0.1, hard: 0.16 };
  if (cat === "leavening") return { soft: 0.06, hard: 0.12 };
  if (cat === "liquid" || cat === "dairy") return { soft: 0.16, hard: 0.28 };
  if (cat === "sugar") return { soft: 0.22, hard: 0.36 };
  if (cat === "fat" || cat === "infused") return { soft: 0.15, hard: 0.26 };
  if (cat === "egg") return { soft: 0.14, hard: 0.24 };
  if (cat === "flour") return { soft: 0.12, hard: 0.2 };
  if (cat === "chocolate") return { soft: 0.18, hard: 0.3 };
  if (key === "Salt") return { soft: 0.72, hard: 0.88 };
  if (cat === "spice" || cat === "fruit" || cat === "flavoring") return { soft: 0.5, hard: 0.72 };
  return { soft: 0.2, hard: 0.32 };
}

function coachingDriftCopy(
  displayName: string,
  libraryKey: string,
  high: boolean,
  severityHard: boolean,
  servings: number,
  sauceOrDipMode: boolean
): string {
  const lib = INGREDIENT_LIBRARY.find((i) => i.name === libraryKey);
  const cat = lib?.category ?? "other";
  const s = servings;
  const structFlour = isStructuralBakingFlourKey(libraryKey);

  if (structFlour) {
    return high
      ? severityHard
        ? `${displayName} is well above this recipe for ${s} servings — bakes often turn dense, dry, or bricky. Ease back on flour or add a little liquid/fat if the mix feels stiff.`
        : `${displayName} is a bit high for ${s} servings — texture may trend tighter or drier. Trim flour slightly or add a small splash of liquid if needed.`
      : severityHard
        ? `${displayName} is well below the scaled recipe for ${s} servings — batters can spread too much, collapse, or feel greasy. Add flour or reduce liquid/fat until it matches the template.`
        : `${displayName} is a bit low for ${s} servings — you may see extra spread or softness. Add a small amount of flour if the mix is loose.`;
  }

  if (cat === "leavening") {
    return high
      ? severityHard
        ? `Leavening (${displayName}) is much higher than this recipe at ${s} servings — you risk bitter/soapy flavor and unreliable rise. Scale back toward the template amount.`
        : `Leavening is a little high for ${s} servings — rise may be aggressive or texture airy. Trim slightly for closer-to-template results.`
      : severityHard
        ? `Leavening is much lower than the scaled recipe — the batch may bake dense or squat. Bring it closer to the template for this serving count.`
        : `Leavening is a little low — you may get less lift than intended. Nudge up if the batter looks heavy.`;
  }

  if (cat === "liquid" || cat === "dairy") {
    if (sauceOrDipMode) {
      return high
        ? severityHard
          ? `${displayName} is much higher than the template for ${s} servings — the sauce or dip may be thinner or looser than intended. Reduce slightly or thicken if needed.`
          : `${displayName} is a bit high for ${s} servings — you may want to balance other ingredients for the texture you like.`
        : severityHard
          ? `${displayName} is much lower than the scaled recipe — the sauce may taste less rich or coat less evenly. Add toward the template and whisk again.`
          : `${displayName} is a bit low — add a splash if the mixture seems thicker than you want.`;
    }
    return high
      ? severityHard
        ? `${displayName} is much higher than the template for ${s} servings — expect a looser batter, weaker structure, or longer bake. Cut liquid or add flour (if it fits the recipe) to tighten.`
        : `${displayName} is a bit high for ${s} servings — the mix may be wetter than intended. Reduce slightly or balance with flour if structure feels weak.`
      : severityHard
        ? `${displayName} is much lower than the scaled recipe — results tend toward dry, stiff, or crumbly. Add liquid or fat until it matches the template consistency.`
        : `${displayName} is a bit low — watch for dryness or toughness. Add a small amount if the dough feels stiff.`;
  }

  if (cat === "sugar") {
    if (sauceOrDipMode) {
      return high
        ? severityHard
          ? `${displayName} is much higher than the template for ${s} servings — the sauce may taste very sweet or sticky; cut back if needed.`
          : `${displayName} is a bit high — sweetness may be punchier than the template; adjust to taste.`
        : severityHard
          ? `${displayName} is much lower than the scaled recipe — the sauce may taste flat or not sweet enough. Add toward the template and taste again.`
          : `${displayName} is a bit low — add a little if you want more sweetness or body.`;
    }
    return high
      ? severityHard
        ? `${displayName} is much higher than the template for ${s} servings — cookies and bars often spread and brown fast; flavor can be cloying. Dial sugar down or add structure (flour) if needed.`
        : `${displayName} is a bit high for ${s} servings — expect more browning and spread. Trim slightly if you want closer-to-template behavior.`
      : severityHard
        ? `${displayName} is much lower than the scaled recipe — results may be pale, bland, or dry. Sweeten back toward the template if taste feels flat.`
        : `${displayName} is a bit low — color and spread may be muted. Add a little more if the batch seems undersweet.`;
  }

  if (cat === "fat" || cat === "infused") {
    if (sauceOrDipMode) {
      return high
        ? severityHard
          ? `${displayName} is much higher than the template for ${s} servings — the mixture may taste richer or oilier; if this is your infusion, total THC in the batch goes up unless you dilute.`
          : `${displayName} is a bit high — richness may exceed the template; trim slightly if it feels heavy.`
        : severityHard
          ? `${displayName} is much lower than the scaled recipe — the sauce or dip may be leaner than intended and the infusion can taste milder in the batch. Add fat or oil toward the template if you want a closer match.`
          : `${displayName} is a bit low — texture or mouthfeel may be lighter than the template; add a little if it seems thin.`;
    }
    return high
      ? severityHard
        ? `${displayName} is much higher than the template for ${s} servings — expect greasier texture and extra spread; if this is your infusion, THC per piece concentrates too. Dial fat down or dilute with plain butter/oil.`
        : `${displayName} is a bit high for ${s} servings — texture may spread or soften more than the recipe assumes. Trim a little if the mix feels oily.`
      : severityHard
        ? `${displayName} is much lower than the scaled recipe — bakes may be dry or tough and infusion may taste weak in fat. Add fat or pair with more liquid as the recipe allows.`
        : `${displayName} is a bit low — watch for a tougher or drier crumb. Add a small amount if the dough feels lean.`;
  }

  if (cat === "egg") {
    if (sauceOrDipMode) {
      return high
        ? severityHard
          ? `Eggs (${displayName}) are well above the template for ${s} servings — texture or flavor may shift; reduce if the recipe allows.`
          : `Eggs are a touch high for ${s} servings — you may notice a richer or softer result.`
        : severityHard
          ? `Eggs are well below the template for ${s} servings — you may want a bit more for binding or richness if the mix seems thin.`
          : `Eggs are a touch low — nudge up if the mixture feels like it needs more body.`;
    }
    return high
      ? severityHard
        ? `Eggs (${displayName}) are well above the scaled recipe for ${s} servings — the batch may turn custardy, rubbery, or overly cakey. Reduce eggs or add a bit of flour/structure.`
        : `Eggs are a touch high for ${s} servings — you may get a softer, more tender crumb.`
      : severityHard
        ? `Eggs are well below the template for ${s} servings — structure may be crumbly or fragile. Add an egg or a little extra moisture/binder.`
        : `Eggs are a touch low — structure may be slightly weaker than the template.`;
  }

  if ((cat === "spice" || cat === "savory") && sauceOrDipMode) {
    return high
      ? severityHard
        ? `${displayName} is well above the template for ${s} servings — taste before adding more; the flavor may be strong.`
        : `${displayName} is a little high — taste and adjust seasoning.`
      : severityHard
        ? `${displayName} is well below the template for ${s} servings — flavor may be mild; season to taste with small pinches.`
        : `${displayName} is a little low — you can always add more after tasting.`;
  }

  return high
    ? severityHard
      ? `${displayName} is well above the scaled template for ${s} servings — flavor or texture may drift. Bring it closer to the recipe or rebalance companion ingredients.`
      : `${displayName} is a little high for ${s} servings compared with the loaded recipe — tweak down if you want closer-to-template results.`
    : severityHard
      ? `${displayName} is well below the scaled template for ${s} servings — flavor or texture may be off. Add back toward the template or adjust paired ingredients.`
      : `${displayName} is a little low for ${s} servings — nudge up if the mix seems thin on that component.`;
}

/** All standard cake/cupcake templates — ratio engine uses this + name heuristics for isCakeStyle (sugar, fat, moisture, eggs, leavening). */
const CAKE_BATTER_STANDARD_IDS = new Set<string>([
  "mini-cupcakes-infused-frosting",
  "vanilla-layer-cake",
  "chocolate-layer-cake",
  "red-velvet-cake",
  "carrot-cake",
  "lemon-cake",
  "pound-cake",
  "coffee-cake",
  "marble-cake",
  "funfetti-cake",
  "chocolate-cupcakes",
  "funnel-cake-bites",
]);

const COOKIE_STANDARD_IDS = new Set<string>([
  "chocolate-chip-cookies",
  "sugar-cookies",
  "cookie-sandwiches-infused-filling",
  "peanut-butter-cookies",
  "oatmeal-raisin-cookies",
  "snickerdoodles",
  "double-chocolate-cookies",
  "white-chocolate-macadamia-cookies",
  "shortbread-cookies",
  "molasses-cookies",
  "gingerbread-cookies",
]);

const BAR_TRAY_STANDARD_IDS = new Set<string>([
  "brownies",
  "mini-brownie-bites",
  "blondie-squares",
  "peanut-butter-bars",
  "lemon-bars",
  "cheesecake-bars",
  "magic-cookie-bars",
  "chocolate-chip-cookie-bars",
  "brownie-cheesecake-swirl-bars",
  "smores-bars",
]);

/** Strips "infused" phrasing for product-forward UI labels only (IDs and ingredient matching unchanged). */
function cleanRecipeDisplayTitle(name: string): string {
  return name
    .replace(/\binfused\b/gi, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .trim();
}

const CHOCOLATE_FUDGE_BUILDER_ID = "infused-chocolate-fudge";
/** Fudge template expects modest butter vs chocolate + condensed milk — sum these for a fat budget check */
const FUDGE_TEMPLATE_FAT_NAMES = new Set([
  "Cannabutter",
  "Unsalted Butter",
  "Salted Butter",
  "Brown Butter",
  "Vegan Butter",
]);

/** Moisture : flour can exceed cookie limits for batters, tray bakes, and gooey bars. */
function isCakeBatterStyleRecipe(recipeName: string, recipeId: string): boolean {
  if (CAKE_BATTER_STANDARD_IDS.has(recipeId)) return true;
  const n = recipeName.toLowerCase();
  return (
    /\b(cupcakes?|layer cake|birthday cake|sponge|chiffon|muffins?)\b/i.test(recipeName) ||
    /\b(pound cake|coffee cake|bundt|funfetti|red velvet)\b/i.test(n) ||
    /\b(carrot cake|lemon cake|vanilla cake|chocolate cake|marble cake)\b/i.test(n) ||
    (/\bcake\b/.test(n) && !/\bcrab\b/i.test(n))
  );
}

function isBarTrayBakeRecipe(recipeName: string, recipeId: string): boolean {
  if (BAR_TRAY_STANDARD_IDS.has(recipeId)) return true;
  const n = recipeName.toLowerCase();
  return /\b(brownie|blondie)\b/.test(n) || /\b(bar|bars)\b/.test(n);
}

function isCookieTemplateRecipe(recipeName: string, recipeId: string): boolean {
  if (COOKIE_STANDARD_IDS.has(recipeId)) return true;
  const n = recipeName.toLowerCase();
  return (
    /\b(chocolate chip cookie|sugar cookie)\b/i.test(recipeName) ||
    /\b(cookies?|snickerdoodles?)\b/.test(n) ||
    /\b(shortbread|gingerbread)\b/.test(n)
  );
}

/** When switching templates (e.g. tea → latte), keep saved infusion rows so THC dosing carries over. */
function mergePreservedInfusionRows(prev: Ingredient[], built: Ingredient[]): Ingredient[] {
  if (!prev.length) return built;
  return built.map((ing) => {
    const k = ingredientLibraryKey(ing);
    const match =
      prev.find((p) => p.infusionBaseId && ingredientLibraryKey(p) === k) ||
      prev.find((p) => p.infusionBaseId && (p.gramsLookupName === k || (!p.gramsLookupName && p.name === k)));
    if (!match?.infusionBaseId) return ing;
    return {
      ...ing,
      name: match.name,
      amount: match.amount,
      unit: match.unit,
      thcPerUnit: match.thcPerUnit,
      isInfused: true,
      infusionBaseId: match.infusionBaseId,
      gramsLookupName: match.gramsLookupName ?? ing.gramsLookupName,
      calories: match.calories,
      carbs: match.carbs,
      protein: match.protein,
      fat: match.fat,
      type: match.type,
    };
  });
}

function tbspToUnitAmount(tbsp: number, unit: string): number {
  switch (unit) {
    case "cups": return tbsp / 16;
    case "tsp": return tbsp * 3;
    case "ml": return tbsp * 14.7868;
    case "g": return tbsp * 14.2;
    case "fl oz": return (tbsp * 14.7868) / 29.5735;
    case "oz": return (tbsp * 14.2) / 28.3495;
    default: return tbsp;
  }
}

function mgPerTbspToUnit(mgPerTbsp: number, unit: string): number {
  switch (unit) {
    case "cups": return mgPerTbsp * 16;
    case "tsp": return mgPerTbsp / 3;
    case "ml": return mgPerTbsp / 14.7868;
    case "g": return mgPerTbsp / 14.2;
    case "fl oz": return (mgPerTbsp / 14.7868) * 29.5735;
    case "oz": return (mgPerTbsp / 14.2) * 28.3495;
    default: return mgPerTbsp;
  }
}

function applyCalculatorInfusionOverride(
  builtIngredients: Ingredient[],
  infusedTbsp: number,
  mgPerTbsp: number
): Ingredient[] {
  if (!Number.isFinite(infusedTbsp) || infusedTbsp <= 0 || !Number.isFinite(mgPerTbsp) || mgPerTbsp <= 0) {
    return builtIngredients;
  }
  let applied = false;
  return builtIngredients.map((ing) => {
    if (applied || !ing.isInfused) return ing;
    applied = true;
    const nextAmount = tbspToUnitAmount(infusedTbsp, ing.unit);
    const nextThcPerUnit = mgPerTbspToUnit(mgPerTbsp, ing.unit);
    return {
      ...ing,
      amount: nextAmount,
      thcPerUnit: nextThcPerUnit,
      infusionBaseId: undefined,
    };
  });
}

// Available units for measurement
const UNIT_OPTIONS = [
  // Metric
  { value: "g", label: "g" },
  { value: "ml", label: "ml" },
  { value: "kg", label: "kg" },
  { value: "L", label: "L" },
  // Imperial Volume
  { value: "tsp", label: "tsp" },
  { value: "tbsp", label: "tbsp" },
  { value: "cups", label: "cups" },
  { value: "fl oz", label: "fl oz" },
  { value: "pint", label: "pint" },
  { value: "quart", label: "quart" },
  // Imperial Weight
  { value: "oz", label: "oz" },
  { value: "lb", label: "lb" },
  // Other
  { value: "large", label: "large" },
  { value: "medium", label: "medium" },
  { value: "small", label: "small" },
  { value: "cloves", label: "cloves" },
  { value: "pieces", label: "pieces" },
  { value: "whole", label: "whole" },
  { value: "pinch", label: "pinch" },
];

/**
 * Grams per US cup — must match imperial toggle rounding so mass round-trips across g ↔ tbsp/cups.
 * Used by `toGrams` for ratio warnings, nutrition, and template drift (not only the measurement switcher).
 */
const INGREDIENT_GRAMS_PER_CUP: Record<string, number> = {
  "All-Purpose Flour": 125,
  "Cake Flour": 114,
  "Bread Flour": 127,
  "Whole Wheat Flour": 120,
  "Almond Flour": 96,
  "Oat Flour": 92,
  "Rice Flour": 158,
  "Coconut Flour": 112,
  "Buckwheat Flour": 120,
  Cornstarch: 128,
  "Tapioca Starch": 152,
  "Cocoa Powder": 100,
  "Cocoa Powder (Natural)": 100,
  "Dutch Cocoa Powder": 100,
  "Espresso Powder": 85,
  "Matcha Powder": 85,
  "Graham Cracker Crumbs": 90,
  Cornmeal: 157,
  "Granulated Sugar": 200,
  Sugar: 200,
  "Brown Sugar (Light)": 220,
  "Brown Sugar (Dark)": 220,
  "Brown Sugar": 220,
  "Powdered Sugar": 120,
  "Raw Turbinado Sugar": 200,
  "Coconut Sugar": 180,
  "Monk Fruit Sweetener": 200,
  "Unsalted Butter": 227,
  "Salted Butter": 227,
  "Brown Butter": 227,
  "Vegan Butter": 227,
  "Butter (Regular)": 227,
  Cannabutter: 227,
  Shortening: 190,
  "Baking Powder": 192,
  "Baking Soda": 220,
  "Cream of Tartar": 150,
  "Instant Yeast": 150,
  "Gelatin (unflavored)": 150,
  Gelatin: 150,
  "Flavored Jello Mix": 85,
  "Xanthan Gum": 190,
  "Poppy Seeds": 145,
  Sprinkles: 190,
  "Rolled Oats": 90,
  Quinoa: 170,
  "Protein Powder": 120,
  Salt: 273,
  "Black Pepper": 100,
  Cinnamon: 125,
  Nutmeg: 100,
  "Peanut Butter": 258,
  "Almond Butter": 250,
};

function gramsPerCupForIngredient(ingName: string): number {
  return INGREDIENT_GRAMS_PER_CUP[ingName] ?? 240;
}

/** Only chemical / yeast leaveners belong in baking-powder–to–flour ratio checks */
function countsTowardLeavenerFlourRatio(libraryKey: string): boolean {
  return (
    libraryKey === "Baking Powder" ||
    libraryKey === "Baking Soda" ||
    libraryKey === "Cream of Tartar" ||
    libraryKey === "Instant Yeast"
  );
}

export function CreateRecipes() {
  const hasTrackedBaseCompletion = useRef(false);
  const [infusionBases, setInfusionBases] = useState<InfusionBase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [recipeType, setRecipeType] = useState<"standard" | "custom" | "">("");
  const [selectedStandardRecipe, setSelectedStandardRecipe] = useState<string>("");
  
  const [recipeName, setRecipeName] = useState("");
  const [servings, setServings] = useState(1);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [instructions, setInstructions] = useState<string[]>([]);
  
  const [showNutritionLabel, setShowNutritionLabel] = useState(false);
  const [showWhatCanIMake, setShowWhatCanIMake] = useState(false);
  const [measurementSystem, setMeasurementSystem] = useState<"metric" | "imperial">("metric");
  const [copied, setCopied] = useState(false);
  /** Controls which print layout is shown when the print dialog opens. */
  const [printTarget, setPrintTarget] = useState<"full" | "buffet">("full");
  /** Step 2 recipe list filter (display name, id, ingredients) */
  const [recipePickerSearch, setRecipePickerSearch] = useState("");

  // What Can I Make - Ingredient Selection
  const [selectedPantryItems, setSelectedPantryItems] = useState<string[]>([]);
  const [selectedInfusionType, setSelectedInfusionType] = useState<string>("none");
  const [availableRecipes, setAvailableRecipes] = useState<any[]>([]);

  // Auto-load recipe from URL params: /ingredients?category=savory-meals&recipe=classic-buffalo-wings
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const servingsOverrideParamRaw = searchParams.get("servings");
  const servingsOverrideParam = servingsOverrideParamRaw ? Number(servingsOverrideParamRaw) : null;
  const wingsQtyParamRaw = searchParams.get("wingsQty");
  const wingsQtyParam = wingsQtyParamRaw ? Number(wingsQtyParamRaw) : null;
  const returnToPartyPack = searchParams.get("returnToPartyPack");
  const partyPackId = searchParams.get("partyPackId");
  const partyItemId = searchParams.get("partyItemId");
  const partyProgressKey = partyPackId ? `party-pack-progress:${partyPackId}` : null;
  const targetMgPerServingRaw = searchParams.get("targetMgPerServing");
  const calcInfusedTbspRaw = searchParams.get("calcInfusedTbsp");
  const calcMgPerTbspRaw = searchParams.get("calcMgPerTbsp");
  const calcSource = searchParams.get("calcSource");

  const resolveRecipeIdForCategory = (category: string, recipeId: string) => {
    const directMatch = standardRecipes[category]?.some((r) => r.id === recipeId);
    if (directMatch) return recipeId;

    if (category === "wings") return WING_SAUCE_TO_BUILDER_RECIPE[recipeId] ?? recipeId;
    // Only remap known Popcorn showcase flavor IDs — leave party snacks / gummies / rice treats IDs unchanged.
    if (category === "snacks" && recipeId in POPCORN_TO_BUILDER_RECIPE) return POPCORN_TO_BUILDER_RECIPE[recipeId];
    if (category === "drinks") return COFFEE_TO_BUILDER_RECIPE[recipeId] ?? recipeId;
    if (category === "spreads-dips") return SPREADS_DIPS_TO_BUILDER_RECIPE[recipeId] ?? recipeId;
    if (category === "fries") return LEGACY_FRIES_RECIPE_TO_SPREADS_DIP[recipeId] ?? "spinach-artichoke-dip-infused";
    return recipeId;
  };

  const formatRecipeNameFromId = (recipeId: string) =>
    recipeId
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  useEffect(() => {
    const reset =
      (location.state as { resetStartHere?: boolean } | null | undefined)?.resetStartHere === true;
    if (reset) {
      setSelectedCategory("");
      setRecipeType("");
      setSelectedStandardRecipe("");
      setIngredients([]);
      setInstructions([]);
      setRecipeName("");
      setServings(1);
      setShowWhatCanIMake(false);
      setSelectedPantryItems([]);
      setSelectedInfusionType("none");
      setAvailableRecipes([]);
      const next = new URLSearchParams(searchParams);
      next.delete("category");
      next.delete("recipe");
      const qs = next.toString();
      navigate({ pathname: "/ingredients", search: qs ? `?${qs}` : "" }, { replace: true, state: {} });
      return;
    }

    const cat = searchParams.get("category");
    if (cat === "fries") {
      const rec = searchParams.get("recipe") || "";
      const nextId = LEGACY_FRIES_RECIPE_TO_SPREADS_DIP[rec] ?? "spinach-artichoke-dip-infused";
      const next = new URLSearchParams(searchParams);
      next.set("category", "spreads-dips");
      next.set("recipe", nextId);
      setSearchParams(next, { replace: true });
      return;
    }
    const rec = searchParams.get("recipe");
    if (cat && rec) {
      setSelectedCategory(cat);
      setRecipeType("standard");
      setSelectedStandardRecipe(rec);
    }
  }, [location.state, navigate, searchParams, setSearchParams]);

  useEffect(() => {
    trackEvent("start_base", {
      page: "ingredients",
      source: searchParams.get("calcSource") || "direct",
    });
  // Track this once per page load to measure funnel entry.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onAfterPrint = () => setPrintTarget("full");
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, []);

  useEffect(() => {
    setRecipePickerSearch("");
  }, [selectedCategory]);

  useEffect(() => {
    if (hasTrackedBaseCompletion.current) return;
    if (!recipeType || ingredients.length === 0) return;
    hasTrackedBaseCompletion.current = true;
    trackEvent("base_completed", {
      category: selectedCategory || "unknown",
      recipe_type: recipeType,
      ingredients_count: ingredients.length,
      servings,
    });
  }, [ingredients.length, recipeType, selectedCategory, servings]);

  const runPrint = (target: "full" | "buffet") => {
    // Commit state, then wait for paint — print dialog can open before layout updates otherwise.
    flushSync(() => {
      setPrintTarget(target);
    });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.print();
        trackEvent(target === "full" ? "print_recipe" : "print_buffet_labels");
      });
    });
  };

  const handleReturnToPartyPack = () => {
    if (!returnToPartyPack || !partyProgressKey || !partyItemId) {
      navigate(returnToPartyPack || "/party-mode");
      return;
    }

    const existing = safeJsonParse<Record<string, boolean>>(
      localStorage.getItem(partyProgressKey),
      {}
    );
    const next = { ...existing, [partyItemId]: true };
    localStorage.setItem(partyProgressKey, JSON.stringify(next));
    navigate(returnToPartyPack);
  };

  // Add pantry item
  const addPantryItem = (item: string) => {
    if (!selectedPantryItems.includes(item)) {
      setSelectedPantryItems([...selectedPantryItems, item]);
    }
  };

  // Remove pantry item
  const removePantryItem = (item: string) => {
    setSelectedPantryItems(selectedPantryItems.filter(i => i !== item));
  };

  // Find matching recipes
  const findMatchingRecipes = () => {
    const allIngredients = [...selectedPantryItems];
    if (selectedInfusionType && selectedInfusionType !== "none") {
      allIngredients.push(selectedInfusionType);
    }

    const matches: any[] = [];
    
    // Check all recipe categories
    Object.entries(standardRecipes).forEach(([catId, recipes]) => {
      recipes.forEach((recipe) => {
        // Count how many ingredients match
        const matchCount = recipe.ingredients.filter((ing: string) => 
          allIngredients.includes(ing)
        ).length;
        
        const matchPercentage = (matchCount / recipe.ingredients.length) * 100;
        
        // If 50% or more ingredients match, include it
        if (matchPercentage >= 50) {
          const category = recipeCategories.find(c => c.id === catId);
          matches.push({
            ...recipe,
            categoryId: catId,
            categoryName: category?.name,
            categoryEmoji: category?.emoji,
            matchPercentage: matchPercentage.toFixed(0),
            missingIngredients: recipe.ingredients.filter((ing: string) => !allIngredients.includes(ing)),
          });
        }
      });
    });

    // Sort by match percentage
    matches.sort((a, b) => parseFloat(b.matchPercentage) - parseFloat(a.matchPercentage));
    setAvailableRecipes(matches);
  };

  useEffect(() => {
    const saved = localStorage.getItem("infusionBases");
    const parsed = safeJsonParse<InfusionBase[]>(saved, []);
    setInfusionBases(parsed);
    setIngredients((prev) => {
      if (prev.length === 0) return prev;
      let changed = false;
      const next = prev.map((ing) => {
        if (!ing.infusionBaseId) return ing;
        if (parsed.some((b) => b.id === ing.infusionBaseId)) return ing;
        changed = true;
        const anchor = ing.gramsLookupName ?? "Cannabutter";
        const row = libraryRowForAnchor(anchor);
        return {
          ...ing,
          infusionBaseId: undefined,
          gramsLookupName: undefined,
          name: row.name,
          isInfused: row.category === "infused",
          thcPerUnit: row.thcPerUnit ?? 0,
          calories: row.calories,
          carbs: row.carbs,
          protein: row.protein,
          fat: row.fat,
          type: row.type,
        };
      });
      return changed ? next : prev;
    });
  }, [location.key]);

  // Load standard recipe
  useEffect(() => {
    if (selectedStandardRecipe && selectedCategory) {
      const resolvedRecipeId = resolveRecipeIdForCategory(selectedCategory, selectedStandardRecipe);
      const directRecipe = standardRecipes[selectedCategory]?.find(r => r.id === resolvedRecipeId);
      const fallbackByCategory: Record<string, string> = {
        wings: "classic-buffalo-wings",
        "spreads-dips": "spinach-artichoke-dip-infused",
        snacks: "garlic-butter-popcorn",
        drinks: "bulletproof-coffee",
      };
      const fallbackId = fallbackByCategory[selectedCategory];
      const fallbackTemplate = fallbackId
        ? standardRecipes[selectedCategory]?.find((r) => r.id === fallbackId)
        : undefined;
      const recipe =
        directRecipe ??
        (fallbackTemplate
          ? {
              ...fallbackTemplate,
              id: selectedStandardRecipe,
              name: formatRecipeNameFromId(selectedStandardRecipe),
              instructions: [
                `Built from our ${fallbackTemplate.name} base for ${formatRecipeNameFromId(selectedStandardRecipe)}.`,
                ...fallbackTemplate.instructions,
              ],
            }
          : undefined);
      if (recipe) {
        setRecipeName(cleanRecipeDisplayTitle(recipe.name));
        const overrideServings =
          servingsOverrideParam && servingsOverrideParam > 0
            ? Math.max(1, Math.round(servingsOverrideParam))
            : null;
        const scaleFactor = overrideServings ? overrideServings / Math.max(1, recipe.servings) : 1;
        setServings(overrideServings ?? recipe.servings);
        setInstructions([...recipe.instructions]);
        
        // Build ingredients from template
        let builtIngredients = recipe.ingredients.map((ingName: string, idx: number) => {
          const libraryItem = INGREDIENT_LIBRARY.find(i => i.name === ingName);
          // Use recipe-defined unit if available, otherwise fall back to library default
          const unit = recipe.units?.[idx] || libraryItem?.defaultUnit || "g";
          const isChickenWings = ingName === "Chicken Wings";
          const usePiecesForWings = selectedCategory === "wings" && isChickenWings;
          const scaledAmount = recipe.amounts[idx] * scaleFactor;
          // Keep wing quantity in pieces for user clarity (vs grams/oz).
          const wingPiecesFromGrams = scaledAmount / 28.125; // 900g ~= 32 wings baseline
          const finalAmount = usePiecesForWings
            ? wingsQtyParam && wingsQtyParam > 0
              ? wingsQtyParam
              : Math.max(1, Math.round(wingPiecesFromGrams))
            : scaledAmount;
          const finalUnit = usePiecesForWings ? "pieces" : unit;
          if (libraryItem) {
            return {
              name: ingName,
              amount: finalAmount,
              unit: finalUnit,
              isInfused: libraryItem.category === "infused",
              thcPerUnit: libraryItem.thcPerUnit || 0,
              calories: libraryItem.calories,
              carbs: libraryItem.carbs,
              protein: libraryItem.protein,
              fat: libraryItem.fat,
              type: libraryItem.type,
            };
          }
          return {
            name: ingName,
            amount: finalAmount,
            unit: finalUnit,
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
          };
        });

        const targetMgVal = targetMgPerServingRaw ? Number(targetMgPerServingRaw) : NaN;
        const srvForThc = (overrideServings ?? recipe.servings) || 1;
        if (Number.isFinite(targetMgVal) && targetMgVal > 0 && srvForThc > 0) {
          const totalThcPre = builtIngredients.reduce(
            (sum, ing) =>
              ing.isInfused && ing.thcPerUnit ? sum + ing.amount * ing.thcPerUnit : sum,
            0
          );
          const curPerServing = totalThcPre / srvForThc;
          if (curPerServing > 0) {
            const factor = targetMgVal / curPerServing;
            builtIngredients = builtIngredients.map((ing) =>
              ing.isInfused && ing.thcPerUnit ? { ...ing, amount: ing.amount * factor } : ing
            );
          }
        }

        if (calcSource === "edibles-calculator") {
          const calcInfusedTbsp = calcInfusedTbspRaw ? Number(calcInfusedTbspRaw) : NaN;
          const calcMgPerTbsp = calcMgPerTbspRaw ? Number(calcMgPerTbspRaw) : NaN;
          builtIngredients = applyCalculatorInfusionOverride(
            builtIngredients,
            calcInfusedTbsp,
            calcMgPerTbsp
          );
        }

        setIngredients((prev) => mergePreservedInfusionRows(prev, builtIngredients));
        // Reset measurement system to metric since all library items use metric units by default
        setMeasurementSystem("metric");
      }
    }
  }, [
    selectedStandardRecipe,
    selectedCategory,
    servingsOverrideParamRaw,
    servingsOverrideParam,
    wingsQtyParamRaw,
    targetMgPerServingRaw,
    calcInfusedTbspRaw,
    calcMgPerTbspRaw,
    calcSource,
  ]);

  // Calculate total THC
  const totalTHC = ingredients.reduce((sum, ing) => {
    if (ing.isInfused && ing.thcPerUnit) {
      return sum + (ing.amount * ing.thcPerUnit);
    }
    return sum;
  }, 0);

  const thcPerServing = servings > 0 ? totalTHC / servings : 0;

  // Convert any ingredient amount to grams for nutrition math
  const toGrams = (amount: number, unit: string, ingName: string): number => {
    const gPerCup = gramsPerCupForIngredient(ingName);
    switch (unit) {
      case "g":       return amount;
      case "kg":      return amount * 1000;
      case "ml":      return amount; // ml ≈ g for water-based liquids
      case "L":       return amount * 1000;
      case "oz":      return amount * 28.3495;
      case "lb":      return amount * 453.592;
      case "cups":    return amount * gPerCup;
      case "tbsp":    return amount * (gPerCup / 16);
      case "tsp":     return amount * (gPerCup / 48);
      case "fl oz":   return amount * 29.574;
      case "pint":    return amount * 473.176;
      case "quart":   return amount * 946.353;
      // Count units — use standard weights
      case "large":   return amount * 57;   // large egg ≈ 57g
      case "medium":  return amount * 44;
      case "small":   return amount * 38;
      case "whole":   return amount * 100;
      case "pieces":  return amount * 100;
      case "cloves":  return amount * 3;
      case "pinch":   return amount * 0.36;
      // Special cannabis units — small amounts, negligible nutrition
      case "squeeze": return amount * 5;
      case "packet":  return amount * 4;
      case "dropper": return amount * 1;
      case "0.1ml":   return amount * 0.1;
      default:        return amount;
    }
  };

  const toGramsIng = (ing: Ingredient) => toGrams(ing.amount, ing.unit, ingredientLibraryKey(ing));

  /**
   * Always show mg/g and mg/tbsp equivalents so switching the row unit (g vs tbsp) does not look like THC changed.
   * Uses the same `toGrams(1, …)` model as amount math (for ml-based rows, mg/g matches the app’s ~1:1 ml↔g nutrition convention).
   */
  const infusedThcEquivalenceHint = (ing: Ingredient): string | null => {
    const t = Number(ing.thcPerUnit);
    if (!ing.isInfused || !Number.isFinite(t) || t <= 0) return null;
    const key = ingredientLibraryKey(ing);
    const u = ing.unit;
    const skip = new Set([
      "large", "medium", "small", "whole", "pieces", "cloves", "pinch", "squeeze", "packet", "dropper", "0.1ml",
    ]);
    if (skip.has(u)) return null;
    const gPerCurrent = toGrams(1, u, key);
    if (!(gPerCurrent > 0)) return null;
    const mgPerG = t / gPerCurrent;
    const mgPerTbsp = mgPerG * toGrams(1, "tbsp", key);
    return `≈ ${mgPerG.toFixed(3)} mg/g · ≈ ${mgPerTbsp.toFixed(2)} mg/tbsp (same potency)`;
  };

  /** BP / soda / cream of tartar / yeast only — excludes gelatin, jello, etc. from flour ratio math */
  const leavenerGramsForFlourRatio = () =>
    ingredients.reduce((sum, ing) => {
      const k = ingredientLibraryKey(ing);
      if (!countsTowardLeavenerFlourRatio(k)) return sum;
      return sum + toGramsIng(ing);
    }, 0);

  const normalizeInfusionRecipeUnit = (raw: string): string => {
    const u = (raw || "g").toLowerCase().trim();
    if (u === "gram" || u === "grams") return "g";
    if (u === "milliliter" || u === "milliliters" || u === "millilitre" || u === "millilitres") return "ml";
    if (u === "tablespoon" || u === "tablespoons") return "tbsp";
    if (u === "teaspoon" || u === "teaspoons") return "tsp";
    if (u === "cup") return "cups";
    return u;
  };

  const convertGramsToRecipeUnit = (grams: number, unit: string, anchorName: string): number => {
    const u = normalizeInfusionRecipeUnit(unit);
    if (u === "g") return parseFloat(grams.toFixed(2));
    if (u === "ml") return parseFloat(grams.toFixed(2));
    if (u === "kg") return parseFloat((grams / 1000).toFixed(4));
    if (u === "l") return parseFloat((grams / 1000).toFixed(4));
    if (u === "tbsp") {
      const per = toGrams(1, "tbsp", anchorName);
      return parseFloat((grams / Math.max(per, 0.001)).toFixed(3));
    }
    if (u === "tsp") {
      const per = toGrams(1, "tsp", anchorName);
      return parseFloat((grams / Math.max(per, 0.001)).toFixed(3));
    }
    if (u === "cups") {
      const per = toGrams(1, "cups", anchorName);
      return parseFloat((grams / Math.max(per, 0.001)).toFixed(3));
    }
    if (u === "fl oz") return parseFloat((grams / 29.574).toFixed(3));
    if (u === "pint") return parseFloat((grams / 473.176).toFixed(3));
    if (u === "quart") return parseFloat((grams / 946.353).toFixed(3));
    if (u === "oz") return parseFloat((grams / 28.3495).toFixed(3));
    if (u === "lb") return parseFloat((grams / 453.592).toFixed(4));
    return parseFloat(grams.toFixed(2));
  };

  const replaceIngredientWithSavedBase = (index: number, base: InfusionBase) => {
    const prev = ingredients[index];
    const anchor = libraryAnchorNameForInfusionBase(base);
    const row = libraryRowForAnchor(anchor);
    const prevGrams = toGrams(prev.amount, prev.unit, ingredientLibraryKey(prev));
    const newUnit = normalizeInfusionRecipeUnit(base.baseUnit);
    let newAmount = convertGramsToRecipeUnit(prevGrams, newUnit, anchor);
    if (!Number.isFinite(newAmount) || newAmount <= 0) newAmount = prev.amount;
    const updated = [...ingredients];
    updated[index] = {
      ...prev,
      name: base.name,
      infusionBaseId: base.id,
      gramsLookupName: anchor,
      amount: newAmount,
      unit: newUnit,
      isInfused: true,
      thcPerUnit: base.thcPerUnit,
      calories: row.calories,
      carbs: row.carbs,
      protein: row.protein,
      fat: row.fat,
      type: row.type,
    };
    setIngredients(updated);
  };

  const onIngredientSelectChange = (index: number, value: string) => {
    if (value.startsWith(SAVED_INFUSION_VALUE_PREFIX)) {
      const id = value.slice(SAVED_INFUSION_VALUE_PREFIX.length);
      const base = infusionBases.find((b) => b.id === id);
      if (base) replaceIngredientWithSavedBase(index, base);
      return;
    }
    const libraryItem = INGREDIENT_LIBRARY.find((i) => i.name === value);
    if (libraryItem) {
      const updated = [...ingredients];
      updated[index] = {
        name: value,
        amount: libraryItem.defaultAmount,
        unit: libraryItem.defaultUnit,
        isInfused: libraryItem.category === "infused",
        thcPerUnit: libraryItem.thcPerUnit || 0,
        calories: libraryItem.calories,
        carbs: libraryItem.carbs,
        protein: libraryItem.protein,
        fat: libraryItem.fat,
        type: libraryItem.type,
        infusionBaseId: undefined,
        gramsLookupName: undefined,
      };
      setIngredients(updated);
    }
  };

  // Calculate nutrition per serving (all amounts converted to grams)
  const totalCalories = ingredients.reduce((sum, ing) => sum + ((ing.calories / 100) * toGramsIng(ing)), 0);
  const totalProtein  = ingredients.reduce((sum, ing) => sum + ((ing.protein  / 100) * toGramsIng(ing)), 0);
  const totalCarbs    = ingredients.reduce((sum, ing) => sum + ((ing.carbs    / 100) * toGramsIng(ing)), 0);
  const totalFat      = ingredients.reduce((sum, ing) => sum + ((ing.fat      / 100) * toGramsIng(ing)), 0);
  const totalFiber    = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ingredientLibraryKey(ing));
    return sum + (((lib as any)?.fiber || 0) / 100) * toGramsIng(ing);
  }, 0);
  const totalSugar    = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ingredientLibraryKey(ing));
    return sum + (((lib as any)?.sugar || 0) / 100) * toGramsIng(ing);
  }, 0);
  const totalSodium   = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ingredientLibraryKey(ing));
    return sum + (((lib as any)?.sodium || 0) / 100) * toGramsIng(ing);
  }, 0);

  const caloriesPerServing = servings > 0 ? totalCalories / servings : 0;
  const proteinPerServing  = servings > 0 ? totalProtein  / servings : 0;
  const carbsPerServing    = servings > 0 ? totalCarbs    / servings : 0;
  const fatPerServing      = servings > 0 ? totalFat      / servings : 0;
  const fiberPerServing    = servings > 0 ? totalFiber    / servings : 0;
  const sugarPerServing    = servings > 0 ? totalSugar    / servings : 0;
  const sodiumPerServing   = servings > 0 ? totalSodium   / servings : 0;

  const updateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const updated = [...ingredients];
    (updated[index] as any)[field] = value;
    setIngredients(updated);
  };

  /** Preserve total mg when the user changes unit on an infused row (mg/{label} must match amount × potency). */
  const handleIngredientUnitChange = (index: number, newUnit: string) => {
    setIngredients((prev) => {
      const ing = prev[index];
      if (!ing || ing.unit === newUnit) return prev;
      const skipUnits = new Set([
        "large", "medium", "small", "whole", "pieces", "cloves", "squeeze", "packet", "dropper", "0.1ml", "pinch",
      ]);
      const updated = [...prev];
      const key = ingredientLibraryKey(ing);
      const thc = Number(ing.thcPerUnit);
      if (ing.isInfused && Number.isFinite(thc) && thc > 0 && !skipUnits.has(ing.unit) && !skipUnits.has(newUnit)) {
        const totalMg = ing.amount * thc;
        const bridge = toGrams(ing.amount, ing.unit, key);
        const newAmount = convertGramsToRecipeUnit(bridge, newUnit, key);
        if (Number.isFinite(newAmount) && newAmount > 0) {
          updated[index] = {
            ...ing,
            unit: newUnit,
            amount: newAmount,
            thcPerUnit: parseFloat((totalMg / newAmount).toFixed(6)),
          };
          return updated;
        }
      }
      updated[index] = { ...ing, unit: newUnit };
      return updated;
    });
  };

  // Helper function to format cups — only returns valid dropdown units
  const formatCups = (cups: number): { amount: number; unit: string } => {
    // Round to nearest 0.25 cup (quarter-cup increments)
    const rounded = Math.round(cups * 4) / 4;
    if (rounded >= 0.25) {
      return { amount: rounded, unit: "cups" };
    }
    // Less than 0.25 cups — convert to tbsp
    const tbsp = cups * 16;
    const roundedTbsp = Math.round(tbsp * 2) / 2;
    return { amount: Math.max(roundedTbsp, 0.5), unit: "tbsp" };
  };

  // Helper function to round tbsp/tsp to practical measurements
  const roundToCommonMeasurement = (value: number, unit: string): { amount: number; unit: string } => {
    if (unit === "tbsp") {
      // Round to nearest 0.5 tbsp
      const rounded = Math.round(value * 2) / 2;
      
      // If less than 1 tbsp, convert to teaspoons
      if (rounded < 1) {
        const tsp = rounded * 3;
        // Round to nearest 0.5 tsp
        const roundedTsp = Math.round(tsp * 2) / 2;
        return { amount: roundedTsp, unit: "tsp" };
      }
      
      return { amount: rounded, unit: "tbsp" };
    }
    
    if (unit === "tsp") {
      // Round to nearest 0.5 tsp
      const rounded = Math.round(value * 2) / 2;
      
      // If 3+ tsp, convert to tbsp
      if (rounded >= 3) {
        const tbsp = rounded / 3;
        const roundedTbsp = Math.round(tbsp * 2) / 2;
        return { amount: roundedTbsp, unit: "tbsp" };
      }
      
      return { amount: rounded, unit: "tsp" };
    }
    
    if (unit === "fl oz") {
      // Round to nearest 0.5 fl oz
      return { amount: Math.round(value * 2) / 2, unit: "fl oz" };
    }
    
    if (unit === "oz") {
      // Round to nearest 0.5 oz
      return { amount: Math.round(value * 2) / 2, unit: "oz" };
    }
    
    // For cups, round to nearest 0.25
    if (unit === "cups") {
      return { amount: Math.round(value * 4) / 4, unit: "cups" };
    }
    
    return { amount: value, unit };
  };

  const changeIngredientFromLibrary = (index: number, newIngredientName: string) => {
    const libraryItem = INGREDIENT_LIBRARY.find(i => i.name === newIngredientName);
    if (libraryItem) {
      const updated = [...ingredients];
      updated[index] = {
        name: newIngredientName,
        amount: libraryItem.defaultAmount,
        unit: libraryItem.defaultUnit,
        isInfused: libraryItem.category === "infused",
        thcPerUnit: libraryItem.thcPerUnit || 0,
        calories: libraryItem.calories,
        carbs: libraryItem.carbs,
        protein: libraryItem.protein,
        fat: libraryItem.fat,
        type: libraryItem.type,
        infusionBaseId: undefined,
        gramsLookupName: undefined,
      };
      setIngredients(updated);
    }
  };

  const addIngredient = () => {
    setIngredients([
      ...ingredients,
      {
        name: "Sugar",
        amount: 100,
        unit: "g",
        calories: 387,
        carbs: 100,
        protein: 0,
        fat: 0,
      },
    ]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  // ── Category totals helper ─────────────────────────────────
  const getCategoryTotals = () => {
    const totals: Record<string, number> = {};
    for (const ing of ingredients) {
      const key = ingredientLibraryKey(ing);
      const lib = INGREDIENT_LIBRARY.find(i => i.name === key);
      const rawCat = lib?.category || 'other';
      const cat =
        rawCat === 'flour'     ? 'flour'    :
        // Cocoa POWDER is a dry structural ingredient like flour
        // Chocolate CHIPS/bars are fat+sugar — don't count as flour
        rawCat === 'chocolate' ? (key.toLowerCase().includes('powder') || key.toLowerCase().includes('cocoa') ? 'flour' : 'other') :
        rawCat === 'sugar'     ? 'sugar'    :
        rawCat === 'fat'       ? 'fat'      :
        rawCat === 'egg'       ? 'egg'      :
        rawCat === 'leavening' ? 'leavener' :
        rawCat === 'dairy'     ? 'dairy'    :
        rawCat === 'liquid'    ? 'liquid'   :
        rawCat === 'infused'   ? 'fat'      :
        'other';

      // Convert ALL units to grams using shared toGrams helper
      const grams = toGramsIng(ing);

      totals[cat] = (totals[cat] ?? 0) + grams;
    }
    return totals;
  };

  /**
   * For templates that list cake + frosting in one recipe (e.g. mini cupcakes), powdered sugar is mostly frosting.
   * Excluding it from sugar÷flour keeps ratios meaningful for the actual cake batter.
   */
  const sugarForBakingRatio = (totalSugarGrams: number): number => {
    const keys = ingredients.map((i) => ingredientLibraryKey(i));
    if (!keys.some((k) => k.includes("Cream Cheese")) || !keys.some((k) => k.includes("Powdered Sugar"))) {
      return totalSugarGrams;
    }
    let powdered = 0;
    for (const ing of ingredients) {
      const k = ingredientLibraryKey(ing);
      if (!k.includes("Powdered Sugar")) continue;
      const l = INGREDIENT_LIBRARY.find((lib) => lib.name === k);
      if (l?.category === "sugar") powdered += toGramsIng(ing);
    }
    return Math.max(0, totalSugarGrams - powdered);
  };

  /**
   * If every template slot still matches and all rows scale by the same factor vs the written
   * template amounts, return that factor (actual÷template in grams). Otherwise null.
   * Stops false drift when the servings field is tweaked for THC / slice count but amounts
   * still describe one coherent batch (e.g. full 16-serv recipe with servings set to 8).
   */
  const inferUniformTemplateBatchScale = (template: {
    servings: number;
    ingredients: string[];
    amounts: number[];
    units?: string[];
  }): number | null => {
    if (ingredients.length !== template.ingredients.length) return null;
    const ratios: number[] = [];
    for (let i = 0; i < ingredients.length; i++) {
      const slot = template.ingredients[i];
      const row = ingredients[i];
      if (ingredientLibraryKey(row) !== slot && row.name !== slot) return null;
      const libRow = INGREDIENT_LIBRARY.find((x) => x.name === slot);
      const templateUnit = template.units?.[i] ?? libRow?.defaultUnit ?? "g";
      const baseG = toGrams(template.amounts[i], templateUnit, slot);
      const actualG = toGramsIng(row);
      if (!Number.isFinite(baseG) || baseG <= 0 || !Number.isFinite(actualG)) continue;
      ratios.push(actualG / baseG);
    }
    if (ratios.length === 0) return null;
    const r0 = ratios[0];
    const tol = 0.045;
    if (!ratios.every((r) => Math.abs(r - r0) <= tol * Math.max(r0, 0.08))) return null;
    return r0;
  };

  /** Compares this row to the servings-scaled standard template (no ML) — coaching copy, not binary errors. */
  const computeTemplateDriftCoaching = (
    ing: Ingredient,
    idx: number
  ): { text: string; color: string; level: "hard" | "soft" } | null => {
    if (recipeType !== "standard" || !selectedStandardRecipe || !selectedCategory) return null;
    if (idx < 0 || idx >= ingredients.length) return null;
    const resolvedId = resolveRecipeIdForCategory(selectedCategory, selectedStandardRecipe);
    const template = standardRecipes[selectedCategory]?.find((r) => r.id === resolvedId);
    if (!template || idx >= template.ingredients.length) return null;

    const slotName = template.ingredients[idx];
    const rowKey = ingredientLibraryKey(ing);
    if (rowKey !== slotName && ing.name !== slotName) return null;

    if (
      selectedCategory === "snacks" &&
      selectedStandardRecipe === CHOCOLATE_FUDGE_BUILDER_ID &&
      FUDGE_TEMPLATE_FAT_NAMES.has(rowKey)
    ) {
      return null;
    }

    const uniform = inferUniformTemplateBatchScale(template);
    const scale =
      uniform !== null ? uniform : servings / Math.max(1, template.servings);
    const libraryRow = INGREDIENT_LIBRARY.find((i) => i.name === slotName);
    const templateUnit = template.units?.[idx] ?? libraryRow?.defaultUnit ?? "g";
    const expectedAmount = template.amounts[idx] * scale;
    const displayName = ing.name?.trim() || slotName;

    if (
      templateUnit === "large" &&
      ing.unit === "large" &&
      (slotName.toLowerCase().includes("egg") || libraryRow?.category === "egg")
    ) {
      const delta = ing.amount - expectedAmount;
      if (Math.abs(delta) < 0.35) return null;
      const hard = Math.abs(delta) >= 0.9;
      const high = delta > 0;
      const sauceOrDipMode = !hasStructuralBakingFlour(ingredients);
      return {
        text: coachingDriftCopy(displayName, slotName, high, hard, servings, sauceOrDipMode),
        color: hard ? "red" : "yellow",
        level: hard ? "hard" : "soft",
      };
    }

    const expectedGrams = toGrams(expectedAmount, templateUnit, slotName);
    const actualGrams = toGramsIng(ing);
    if (!Number.isFinite(expectedGrams) || expectedGrams <= 0 || !Number.isFinite(actualGrams)) return null;

    const ratio = actualGrams / expectedGrams;
    const { soft, hard } = driftBandsForLibraryKey(slotName);
    if (ratio >= 1 - soft && ratio <= 1 + soft) return null;

    const high = ratio > 1;
    const severityHard = ratio <= 1 - hard || ratio >= 1 + hard;
    const sauceOrDipMode = !hasStructuralBakingFlour(ingredients);
    return {
      text: coachingDriftCopy(displayName, slotName, high, severityHard, servings, sauceOrDipMode),
      color: severityHard ? "red" : "orange",
      level: severityHard ? "hard" : "soft",
    };
  };

  // ── Per-ingredient warnings (cookie-science ratio engine) ──
  const getIngredientWarning = (ing: Ingredient, _servings: number, idx: number) => {
    const lib = INGREDIENT_LIBRARY.find(i => i.name === ingredientLibraryKey(ing));
    const rawCat = lib?.category || 'other';
    const cat =
      rawCat === 'flour'     ? 'flour'    :
      rawCat === 'sugar'     ? 'sugar'    :
      rawCat === 'fat'       ? 'fat'      :
      rawCat === 'egg'       ? 'egg'      :
      rawCat === 'leavening' ? 'leavener' :
      rawCat === 'dairy'     ? 'dairy'    :
      rawCat === 'liquid'    ? 'liquid'   :
      rawCat === 'infused'   ? 'fat'      :
      'other';

    const totals = getCategoryTotals();
    const flour    = totals['flour']    ?? 0;
    const fat      = totals['fat']      ?? 0;
    const sugar    = totals['sugar']    ?? 0;
    const sugarBalanced = sugarForBakingRatio(sugar);
    const egg      = totals['egg']      ?? 0;
    const liquid   = totals['liquid']   ?? 0;
    const dairy    = totals['dairy']    ?? 0;
    const leavener = leavenerGramsForFlourRatio();
    const totalMoisture = egg + liquid + dairy;
    const lowerNames = ingredients.map(i => i.name.toLowerCase());
    const isBrownieStyle =
      selectedStandardRecipe === "brownies" ||
      selectedStandardRecipe === "mini-brownie-bites" ||
      recipeName.toLowerCase().includes("brownie") ||
      (lowerNames.some(n => n.includes("cocoa")) &&
       lowerNames.some(n => n.includes("all-purpose flour") || n.includes("flour")) &&
       lowerNames.some(n => n.includes("chocolate")));
    const isBlondieStyle =
      /blondie/i.test(recipeName.toLowerCase()) || selectedStandardRecipe === "blondie-squares";
    const isCookieStyle = isCookieTemplateRecipe(recipeName, selectedStandardRecipe);
    const isCakeStyle = isCakeBatterStyleRecipe(recipeName, selectedStandardRecipe);
    const isBarStyle = isBarTrayBakeRecipe(recipeName, selectedStandardRecipe);
    const isPancakeStyle =
      recipeName.toLowerCase().includes("pancake") ||
      recipeName.toLowerCase().includes("waffle") ||
      recipeName.toLowerCase().includes("crepe") ||
      selectedStandardRecipe === "pancakes";
    const isFriedDoughStyle =
      selectedStandardRecipe === "churro-bites" ||
      selectedStandardRecipe === "funnel-cake-bites" ||
      recipeName.toLowerCase().includes("churro") ||
      recipeName.toLowerCase().includes("funnel cake");

    let warning = '';
    let color = '';

    const templateDrift = computeTemplateDriftCoaching(ing, idx);
    if (templateDrift?.level === "hard") {
      return { warning: templateDrift.text, color: templateDrift.color };
    }

    // No-bake fudge has no structural flour — fat-ratio engine below is skipped. Warn when butter/cannabutter far exceeds the template budget.
    if (
      recipeType === "standard" &&
      selectedCategory === "snacks" &&
      selectedStandardRecipe === CHOCOLATE_FUDGE_BUILDER_ID &&
      cat === "fat"
    ) {
      const fudgeTemplate = standardRecipes.snacks?.find((r) => r.id === CHOCOLATE_FUDGE_BUILDER_ID);
      if (fudgeTemplate) {
        const scale = servings / Math.max(1, fudgeTemplate.servings);
        let expectedFatG = 0;
        fudgeTemplate.ingredients.forEach((nm: string, idx: number) => {
          if (FUDGE_TEMPLATE_FAT_NAMES.has(nm)) expectedFatG += fudgeTemplate.amounts[idx] * scale;
        });
        let actualFatG = 0;
        for (const row of ingredients) {
          const k = ingredientLibraryKey(row);
          if (FUDGE_TEMPLATE_FAT_NAMES.has(k)) actualFatG += toGramsIng(row);
        }
        if (expectedFatG > 0 && actualFatG > expectedFatG * 1.6) {
          const ratio = actualFatG / expectedFatG;
          const thisFatG = toGramsIng(ing);
          const isLargestBudgetFat = !ingredients.some((other) => {
            if (other === ing) return false;
            return FUDGE_TEMPLATE_FAT_NAMES.has(ingredientLibraryKey(other)) && toGramsIng(other) > thisFatG;
          });
          if (isLargestBudgetFat) {
            warning =
              ratio >= 2.35
                ? `Very high fat for this fudge formula (~${actualFatG.toFixed(0)}g vs ~${expectedFatG.toFixed(0)}g typical at this serving count). That much butter often prevents fudge from setting, causes oil to pool, or makes the batch greasy — and THC becomes concentrated in the same number of pieces if you keep the same cut grid. Prefer diluting with plain butter or using less cannabutter if you want traditional fudge texture.`
                : `Fat is high for this fudge formula (~${actualFatG.toFixed(0)}g vs ~${expectedFatG.toFixed(0)}g typical at this serving count). Excess butter can keep fudge soft or greasy; reduce it if the mixture looks oily or never firms up.`;
            color = ratio >= 2.35 ? "red" : "orange";
            return { warning, color };
          }
        }
      }
    }

    // Only run baking-science warnings for structural flour (not cornstarch-thickened sauces)
    if (!hasStructuralBakingFlour(ingredients)) {
      if (templateDrift?.level === "soft") {
        return { warning: templateDrift.text, color: templateDrift.color };
      }
      return { warning, color };
    }

    // High liquid ratio is expected for batters and fried dough styles.
    const isHighLiquidRecipe = (isPancakeStyle && totalMoisture > flour * 0.8) || isFriedDoughStyle;

    if (cat === 'flour') {
      // Cookie and dessert-bar crusts are intentionally low in "moisture" vs flour — these ratios misfire.
      if (!isCookieStyle && !isBarStyle) {
        const flourToFat = flour / Math.max(fat, 1);
        if (!isBrownieStyle && flourToFat > 3.5 && totalMoisture < flour * 0.4) {
          warning = 'Way too much flour for this fat & moisture — baked goods will be dry and crumbly. Add more butter, eggs, or liquid.';
          color = 'red';
        } else if (!isBrownieStyle && flourToFat > 2.8 && totalMoisture < flour * 0.5) {
          warning = 'Flour is high relative to fat and moisture — consider adding more butter or eggs for balance.';
          color = 'yellow';
        }
      }
    }

    // Churro / funnel-cake templates list fry oil and finish oil as ingredients — they are not
    // "dough fat" like cookies. Dough sugar is also often low; sweetness is from coating/dust.
    if (cat === 'fat' && !isFriedDoughStyle) {
      const fatToFlour = fat / Math.max(flour, 1);
      const fatProblemThreshold =
        isBrownieStyle || isBarStyle ? 1.8 : isCakeStyle ? 1.15 : isCookieStyle ? 1.0 : 0.85;
      const fatWarningThreshold =
        isBrownieStyle || isBarStyle ? 1.4 : isCakeStyle ? 0.88 : isCookieStyle ? 0.85 : 0.65;
      if (fatToFlour > fatProblemThreshold) {
        warning = 'Too much fat — baked goods will be greasy and spread flat. Reduce butter or add more flour.';
        color = 'red';
      } else if (fatToFlour > fatWarningThreshold) {
        warning = isCakeStyle
          ? 'Fat is on the high side — confirm this matches your cake style (fine for rich butter cakes).'
          : 'Fat is on the high side — expect significant spread. Consider chilling the dough before baking.';
        color = 'yellow';
      } else if (!isPancakeStyle && fatToFlour < 0.25 && flour > 100) {
        warning = 'Low fat for this amount of flour — baked goods may be dry and tough.';
        color = 'yellow';
      }
    }

    if (cat === 'sugar' && !isFriedDoughStyle) {
      // Only warn on the biggest sugar contributor to avoid duplicate warnings
      const thisSugarGrams = toGramsIng(ing);
      const isLargestSugar = !ingredients.some(other => {
        if (other === ing) return false;
        const otherLib = INGREDIENT_LIBRARY.find(l => l.name === ingredientLibraryKey(other));
        if (otherLib?.category !== 'sugar') return false;
        return toGramsIng(other) > thisSugarGrams;
      });
      if (isLargestSugar) {
        const sugarToFlourBal = sugarBalanced / Math.max(flour, 1);
        const sugarProblemThreshold =
          isBrownieStyle ? 5.0
          : isBlondieStyle ? 2.6
          : isBarStyle ? 2.5
          : isCookieStyle ? 1.55
          : isCakeStyle ? 1.55
          : 1.2;
        const sugarWarningThreshold =
          isBrownieStyle ? 3.9
          : isBlondieStyle ? 2.0
          : isBarStyle ? 1.85
          : isCookieStyle ? 1.28
          : isCakeStyle ? 1.32
          : 0.95;
        if (sugarToFlourBal > sugarProblemThreshold) {
          warning = 'Total sugar is very high — baked goods will be overly sweet, thin, and burn easily.';
          color = 'red';
        } else if (sugarToFlourBal > sugarWarningThreshold) {
          warning = 'Total sugar is high — expect more spread and browning. Watch bake time carefully.';
          color = 'yellow';
        } else if (!isPancakeStyle && sugarToFlourBal < 0.2 && flour > 100) {
          warning = 'Low sugar — result may be pale, bland, and dense.';
          color = 'yellow';
        }
      }
    }

    if (cat === 'egg') {
      // Use real flour only (exclude cocoa) for egg ratio — brownies are intentionally egg-heavy
      const realFlour = ingredients.reduce((sum, i) => {
        const k = ingredientLibraryKey(i);
        const l = INGREDIENT_LIBRARY.find(lib => lib.name === k);
        if (l?.category === 'flour' && !k.toLowerCase().includes('cocoa') && !k.toLowerCase().includes('chocolate')) {
          return sum + toGramsIng(i);
        }
        return sum;
      }, 0);
      const eggToFlour = egg / Math.max(realFlour || flour, 1);
      const eggProblemThreshold = isBrownieStyle ? 3.0 : isCakeStyle ? 2.2 : 1.8;
      const eggWarningThreshold = isBrownieStyle ? 2.6 : isCakeStyle ? 1.85 : 1.4;
      if (eggToFlour > eggProblemThreshold) {
        warning = 'Too many eggs for this flour — result will be very puffy and cakey. Reduce eggs or add more flour.';
        color = 'red';
      } else if (eggToFlour > eggWarningThreshold) {
        warning = 'High egg ratio — will lean soft and fudgy. Great for brownies, but may not suit all recipes.';
        color = 'yellow';
      }
    }

    if (cat === 'liquid' || cat === 'dairy') {
      // Skip liquid warnings for batter-style recipes (pancakes, waffles, crepes)
      // where high liquid is intentional — identified by leavening + dairy + no fat-heavy mix
      // Cake/cupcake batters are legitimately wetter than cookie dough (~1.0–1.3 moisture vs flour).
      if (!isHighLiquidRecipe) {
        const liquidToFlour = totalMoisture / Math.max(flour, 1);
        // Layer cakes with milk + eggs are often ~1.45–1.55 moisture:flour — keep above that band.
        const problemL = isBarStyle ? 3.6 : isCakeStyle ? 1.68 : 1.1;
        const warnL = isBarStyle ? 3.0 : isCakeStyle ? 1.58 : 0.7;
        if (liquidToFlour > problemL) {
          warning = 'Way too much liquid — batter will not hold shape and won\'t bake properly.';
          color = 'red';
        } else if (liquidToFlour > warnL) {
          warning = isCakeStyle
            ? 'High moisture for this flour — confirm this matches your cake style (some batters are very wet).'
            : 'High moisture content — dough will be very soft. Chill well before baking or add more flour.';
          color = 'yellow';
        }
      }
    }

    // Only BP / soda / cream of tartar / yeast belong in flour-ratio math; gelatin & food coloring are "leavening" in the library but must not show this warning on those rows.
    if (cat === 'leavener' && countsTowardLeavenerFlourRatio(ingredientLibraryKey(ing))) {
      const leavenerToFlour = leavener / Math.max(flour, 1);
      // ~1 tsp (≈4g) per 125g flour ≈ 0.032. Enriched cakes often use 2–3× that — looser caps than cookies.
      const leavenerWarn = isCakeStyle ? 0.14 : 0.08;
      const leavenerProblem = isCakeStyle ? 0.18 : 0.12;
      if (leavenerToFlour > leavenerProblem) {
        warning = 'Too much leavener — baked goods will taste bitter or soapy. Typical is about 1–2 tsp baking powder per cup of flour (cakes may use a bit more).';
        color = 'red';
      } else if (leavenerToFlour > leavenerWarn) {
        warning = isCakeStyle
          ? 'Leavener is elevated vs flour — still plausible for an enriched or high-rise cake; cut back if the batter rises unevenly or tastes metallic.'
          : 'Leavener is on the high side — may cause excessive puffing. Fine for pancakes; watch it for dense cookies or lean breads.';
        color = 'yellow';
      }
    }

    if (warning) return { warning, color };
    if (templateDrift?.level === "soft") {
      return { warning: templateDrift.text, color: templateDrift.color };
    }
    return { warning: "", color: "" };
  };

  // Recipe Summary Analysis
  interface RecipeSummary {
    headline: string;
    description: string;
    tags: { label: string; color: string }[];
    severity: 'good' | 'warning' | 'problem';
    styleLabel: string;
  }

  const computeRecipeSummary = (): RecipeSummary | null => {
    if (ingredients.length === 0) return null;

    const totals = getCategoryTotals();
    const flour    = totals['flour']    ?? 0;
    const fat      = totals['fat']      ?? 0;
    const sugar    = totals['sugar']    ?? 0;
    const sugarBalanced = sugarForBakingRatio(sugar);
    const egg      = totals['egg']      ?? 0;
    const liquid   = totals['liquid']   ?? 0;
    const dairy    = totals['dairy']    ?? 0;
    const leavener = leavenerGramsForFlourRatio();
    const totalMoisture = egg + liquid + dairy;
    const hasInfused = ingredients.some(i => {
      if (i.isInfused) return true;
      const lib = INGREDIENT_LIBRARY.find(l => l.name === ingredientLibraryKey(i));
      return lib?.category === 'infused';
    });
    const lowerNames = ingredients.map(i => i.name.toLowerCase());
    const isBrownieStyle =
      selectedStandardRecipe === "brownies" ||
      selectedStandardRecipe === "mini-brownie-bites" ||
      recipeName.toLowerCase().includes("brownie") ||
      (lowerNames.some(n => n.includes("cocoa")) &&
       lowerNames.some(n => n.includes("all-purpose flour") || n.includes("flour")) &&
       lowerNames.some(n => n.includes("chocolate")));
    const isBlondieStyle =
      /blondie/i.test(recipeName.toLowerCase()) || selectedStandardRecipe === "blondie-squares";
    const isCookieStyle = isCookieTemplateRecipe(recipeName, selectedStandardRecipe);
    const isCakeStyle = isCakeBatterStyleRecipe(recipeName, selectedStandardRecipe);
    const isBarStyle = isBarTrayBakeRecipe(recipeName, selectedStandardRecipe);
    const isPancakeStyle =
      recipeName.toLowerCase().includes("pancake") ||
      recipeName.toLowerCase().includes("waffle") ||
      recipeName.toLowerCase().includes("crepe") ||
      selectedStandardRecipe === "pancakes";
    const isFriedDoughStyle =
      selectedStandardRecipe === "churro-bites" ||
      selectedStandardRecipe === "funnel-cake-bites" ||
      recipeName.toLowerCase().includes("churro") ||
      recipeName.toLowerCase().includes("funnel cake");
    const isSavoryStyle = selectedCategory === "wings" || selectedCategory === "spreads-dips" || selectedCategory === "savory-meals";
    const isDrinkStyle = selectedCategory === "drinks";

    const structuralFlour = hasStructuralBakingFlour(ingredients);

    // High liquid intentional recipes (pancakes, waffles, crepes, churros, funnel cake)
    const isHighLiquidRecipe = (structuralFlour && isPancakeStyle && totalMoisture > flour * 0.8) || isFriedDoughStyle;

    const tags: { label: string; color: string }[] = [];
    if (hasInfused) tags.push({ label: '🧪 Cannabis Infused', color: 'purple' });

    // No structural baking flour — beverage / sauce / no-bake / starch-thickened cheese sauce
    if (!structuralFlour) {
      if (liquid > 0 || dairy > 0) {
        return {
          headline: '🥤 Beverage or Sauce Recipe',
          description: 'No flour detected — this looks like a drink, sauce, or no-bake recipe. Ratios look fine for a liquid-based preparation.',
          tags: [...tags, { label: 'Liquid-based', color: 'green' }],
          severity: 'good',
          styleLabel: 'Liquid / Sauce',
        };
      }
      return {
        headline: '📝 Keep Building Your Recipe',
        description: 'Add ingredients to get a full analysis of your recipe balance.',
        tags: [...tags, { label: 'In progress', color: 'yellow' }],
        severity: 'good',
        styleLabel: 'In Progress',
      };
    }

    // Batter recipe — high liquid is intentional
    if (isHighLiquidRecipe) {
      return {
        headline: isFriedDoughStyle ? '🍩 Fried Dough Recipe' : '🥞 Batter Recipe',
        description: isFriedDoughStyle
          ? 'Higher moisture is expected for churro and funnel-cake style doughs. Ratios look correct for a piped/fried preparation.'
          : 'High liquid ratio detected — this is expected for pancakes, waffles, or crepe-style batters. Ratios look correct.',
        tags: [...tags, { label: 'Batter', color: 'blue' }, { label: 'Balanced', color: 'green' }],
        severity: 'good',
        styleLabel: isFriedDoughStyle ? 'Fried Dough' : 'Batter',
      };
    }

    // For egg ratio, only count real structural flour (not cocoa/chocolate)
    // Brownies are intentionally egg-heavy — cocoa inflates "flour" total unfairly
    const realFlourOnly = ingredients.reduce((sum, ing) => {
      const k = ingredientLibraryKey(ing);
      const l = INGREDIENT_LIBRARY.find(lib => lib.name === k);
      if (l?.category === 'flour' && !k.toLowerCase().includes('cocoa') && !k.toLowerCase().includes('chocolate')) {
        return sum + toGramsIng(ing);
      }
      return sum;
    }, 0);
    const eggRatio = egg / Math.max(realFlourOnly || flour, 1);

    const fatRatio      = fat      / flour;
    const sugarRatio    = sugarBalanced / flour;
    const moistureRatio = totalMoisture / flour;
    const leavenerRatio = leavener / flour;

    const issues: string[] = [];
    let severity: 'good' | 'warning' | 'problem' = 'good';

    const moistureProblemThreshold = isBarStyle ? 3.6 : isCakeStyle ? 1.68 : 1.1;
    // Way too much liquid — bail early (but only if not an intentional batter or cake batter)
    if (moistureRatio > moistureProblemThreshold && !isHighLiquidRecipe && !isBrownieStyle) {
      return {
        headline: '💧 This will not bake properly',
        description: 'The liquid content is far too high relative to flour. This batter will not hold shape — it will spread into a puddle. Dramatically reduce milk/liquid or add much more flour.',
        tags: [...tags, { label: 'Too much liquid', color: 'red' }, { label: "Won't bake", color: 'red' }],
        severity: 'problem',
        styleLabel: isBrownieStyle ? 'Brownie' : isPancakeStyle ? 'Batter' : isSavoryStyle ? 'Savory' : isDrinkStyle ? 'Drinks' : 'Baked',
      };
    }

    // Diagnose each ratio
    const sugarProblemThreshold =
      isBrownieStyle ? 5.0
      : isBlondieStyle ? 2.6
      : isBarStyle ? 2.5
      : isCookieStyle ? 1.55
      : isCakeStyle ? 1.55
      : 1.2;
    const sugarWarningThreshold =
      isBrownieStyle ? 3.9
      : isBlondieStyle ? 2.0
      : isBarStyle ? 1.85
      : isCookieStyle ? 1.28
      : isCakeStyle ? 1.32
      : 1.05;
    if (sugarRatio > sugarProblemThreshold)       { issues.push('sugar is very high — expect thin, sweet, fast-browning results'); tags.push({ label: 'Too much sugar', color: 'red' }); severity = 'problem'; }
    else if (sugarRatio > sugarWarningThreshold)  { issues.push('sugar is elevated — baked goods will spread more and brown faster'); tags.push({ label: 'High sugar', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    const fatProblemThreshold =
      isBrownieStyle || isBarStyle ? 1.8 : isCakeStyle ? 1.15 : isCookieStyle ? 1.0 : 0.85;
    const fatWarningThreshold =
      isBrownieStyle || isBarStyle ? 1.4 : isCakeStyle ? 0.88 : isCookieStyle ? 0.85 : 0.65;
    if (fatRatio > fatProblemThreshold)        { issues.push('fat is very high — baked goods will be greasy and spread flat'); tags.push({ label: 'Too much fat', color: 'red' }); severity = 'problem'; }
    else if (fatRatio > fatWarningThreshold) {
      issues.push(
        isCakeStyle
          ? 'fat is elevated — typical for dense or pound-style cakes; reduce if you want a leaner crumb'
          : 'fat is elevated — expect significant spread, chill dough before baking'
      );
      tags.push({ label: 'High fat', color: 'yellow' });
      if (severity === 'good') severity = 'warning';
    }
    else if (!isPancakeStyle && fatRatio < 0.25 && flour > 100) { issues.push('low fat for this flour — dough may be dry and stiff'); tags.push({ label: 'Low fat', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    const eggProblemThreshold = isBrownieStyle ? 3.0 : isCakeStyle ? 2.2 : 1.8;
    const eggWarningThreshold = isBrownieStyle ? 2.6 : isCakeStyle ? 1.85 : 1.4;
    if (eggRatio > eggProblemThreshold)          { issues.push('too many eggs for this flour — result will be very puffy and cakey'); tags.push({ label: 'Too many eggs', color: 'red' }); severity = 'problem'; }
    else if (eggRatio > eggWarningThreshold)     { issues.push('high egg ratio — will lean soft and cakey. Great for fudgy bakes'); tags.push({ label: 'High eggs', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    if (moistureRatio > 0.9 && !isHighLiquidRecipe && !isBrownieStyle && !isCakeStyle && !isBarStyle) { issues.push('liquid is high — dough will be very soft, needs chilling or more flour'); tags.push({ label: 'High moisture', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    const leavenerWarnRatio = isCakeStyle ? 0.14 : 0.08;
    const leavenerProblemRatio = isCakeStyle ? 0.18 : 0.12;
    if (leavenerRatio > leavenerProblemRatio) {
      issues.push('leavener is very high — may taste bitter or soapy');
      tags.push({ label: 'Too much leavener', color: 'red' });
      severity = 'problem';
    } else if (leavenerRatio > leavenerWarnRatio) {
      issues.push(
        isCakeStyle
          ? 'leavener is elevated — common for tall butter cakes; reduce only if you see metallic flavor or a very coarse crumb'
          : 'leavener is elevated — fine for pancakes/quick breads, watch for cookies and lean breads'
      );
      tags.push({ label: 'High leavener', color: 'yellow' });
      if (severity === 'good') severity = 'warning';
    }

    // Positive descriptions when balanced
    if (severity === 'good') {
      const chewy      = fatRatio >= 0.35 && fatRatio <= 0.55 && sugarRatio >= 0.4 && sugarRatio <= 0.7 && eggRatio >= 0.15 && eggRatio <= 1.0;
      const crispy     = fatRatio >= 0.3  && sugarRatio >= 0.6 && eggRatio < 0.5  && moistureRatio < 0.3;
      const cakey      = eggRatio > 0.8   && moistureRatio > 0.3 && fatRatio < 0.4;
      const buttery    = fatRatio > 0.55  && sugarRatio < 0.5;
      const fudgy      = eggRatio >= 0.8  && sugarRatio >= 0.8 && fatRatio >= 0.4 && fatRatio <= 1.5;
      const moistBake  = moistureRatio >= 0.3 && fatRatio >= 0.3 && fatRatio <= 0.6;

      if (fudgy)     return { headline: '✅ Balanced — Fudgy Brownie Profile', description: 'High eggs, sugar, and fat relative to flour is exactly right for dense, fudgy brownies. This ratio creates that characteristic crinkle top and chewy center.', tags: [...tags, { label: 'Fudgy', color: 'green' }, { label: 'Dense & rich', color: 'green' }], severity: 'good', styleLabel: 'Brownie' };
      if (chewy)     return { headline: '✅ Well-balanced — Classic Chewy Texture', description: 'Your ratios are dialed in for a classic chewy bake with a soft center and slightly crisp edges. Fat, sugar, and egg balance looks great.', tags: [...tags, { label: 'Chewy', color: 'green' }, { label: 'Balanced', color: 'green' }], severity: 'good', styleLabel: 'Cookie' };
      if (crispy)    return { headline: '✅ Balanced — Crispy Profile', description: 'Higher sugar and moderate fat with low moisture points toward crispy, snappy results. Expect good browning and thin, crunchy texture.', tags: [...tags, { label: 'Crispy', color: 'green' }, { label: 'Good spread', color: 'green' }], severity: 'good', styleLabel: 'Cookie' };
      if (cakey)     return { headline: '✅ Balanced — Soft Cake-Style', description: 'High eggs and moisture with moderate fat gives a pillowy, cake-like result. Great for muffins, cakes, or soft bakes.', tags: [...tags, { label: 'Soft & cakey', color: 'green' }, { label: 'Balanced', color: 'green' }], severity: 'good', styleLabel: 'Cake' };
      if (buttery)   return { headline: '✅ Balanced — Rich & Buttery', description: 'High fat and lower sugar/egg points to a rich, crumbly, shortbread-style result. Minimal spread, melt-in-mouth texture.', tags: [...tags, { label: 'Rich & buttery', color: 'green' }, { label: 'Balanced', color: 'green' }], severity: 'good', styleLabel: 'Cookie' };
      if (moistBake) return { headline: '✅ Balanced — Moist & Tender', description: 'Good moisture and fat levels for a soft, tender result. Perfect for cakes, brownies, or quick breads.', tags: [...tags, { label: 'Moist & tender', color: 'green' }, { label: 'Balanced', color: 'green' }], severity: 'good', styleLabel: isBrownieStyle ? 'Brownie' : 'Baked' };

      return { headline: '✅ Recipe Looks Balanced', description: 'Your ingredient ratios are within normal baking ranges. Looking good!', tags: [...tags, { label: 'Balanced', color: 'green' }], severity: 'good', styleLabel: isBrownieStyle ? 'Brownie' : isPancakeStyle ? 'Batter' : isSavoryStyle ? 'Savory' : isDrinkStyle ? 'Drinks' : 'Baked' };
    }

    const headline = severity === 'problem'
      ? `⚠️ Recipe has ${issues.length > 1 ? 'multiple issues' : 'an issue'} to fix`
      : `💡 ${issues.length} thing${issues.length > 1 ? 's' : ''} to watch`;

    const description = issues.length === 1
      ? `${issues[0].charAt(0).toUpperCase()}${issues[0].slice(1)}.`
      : issues.map((s, i) => `${i + 1}. ${s.charAt(0).toUpperCase()}${s.slice(1)}`).join('. ') + '.';

    return { headline, description, tags, severity, styleLabel: isBrownieStyle ? 'Brownie' : isPancakeStyle ? 'Batter' : isSavoryStyle ? 'Savory' : isDrinkStyle ? 'Drinks' : 'Baked' };
  };

  // Recipe Summary Card Component
  const RecipeSummaryCard = () => {
    const summary = computeRecipeSummary();
    if (!summary) return null;

    const bgClass = summary.severity === 'good'
      ? 'bg-green-50 border-green-200'
      : summary.severity === 'problem'
      ? 'bg-red-50 border-red-200'
      : 'bg-yellow-50 border-yellow-200';

    const headlineClass = summary.severity === 'good'
      ? 'text-green-800'
      : summary.severity === 'problem'
      ? 'text-red-800'
      : 'text-yellow-800';

    const descClass = summary.severity === 'good'
      ? 'text-green-700'
      : summary.severity === 'problem'
      ? 'text-red-700'
      : 'text-yellow-700';

    const tagColors: Record<string, string> = {
      red:    'bg-red-100 text-red-700 border-red-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      green:  'bg-green-100 text-green-700 border-green-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
    };

    return (
      <div className={`rounded-xl border-2 p-4 mb-4 ${bgClass}`}>
        <div className="mb-2">
          <span className="inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border bg-white/70 text-gray-700 border-gray-200">
            Style: {summary.styleLabel}
          </span>
        </div>
        <div className={`font-bold mb-2 ${headlineClass}`}>{summary.headline}</div>
        <p className={`text-sm leading-relaxed mb-3 ${descClass}`}>{summary.description}</p>
        {summary.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {summary.tags.map((tag, i) => (
              <span key={i} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${tagColors[tag.color] || tagColors.yellow}`}>
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  };


  // Convert between measurement systems
  const toggleMeasurementSystem = () => {
    const newSystem = measurementSystem === "metric" ? "imperial" : "metric";

    /** Prefer cups when ¼-cup rounding is within ~6% of true grams; else tbsp or tsp so mass round-trips (avoids phantom template drift). */
    const imperialFromGramsPowder = (grams: number, gPerCup: number): { amount: number; unit: string } => {
      const cupsExact = grams / gPerCup;
      if (cupsExact >= 0.25) {
        const formattedCups = formatCups(cupsExact);
        const estG =
          formattedCups.unit === "cups"
            ? formattedCups.amount * gPerCup
            : formattedCups.amount * (gPerCup / 16);
        if (Math.abs(estG - grams) / Math.max(grams, 0.001) <= 0.06) {
          return { amount: formattedCups.amount, unit: formattedCups.unit };
        }
      }
      const tbspExact = cupsExact * 16;
      if (tbspExact < 1) {
        const tspExact = cupsExact * 48;
        return roundToCommonMeasurement(Math.max(tspExact, 0.125), "tsp");
      }
      return roundToCommonMeasurement(tbspExact, "tbsp");
    };

    const imperialFromGramsFat = (grams: number, gPerCup: number): { amount: number; unit: string } => {
      const cupsExact = grams / gPerCup;
      if (cupsExact >= 0.25) {
        const formattedCups = formatCups(cupsExact);
        const estG =
          formattedCups.unit === "cups"
            ? formattedCups.amount * gPerCup
            : formattedCups.amount * (gPerCup / 16);
        if (Math.abs(estG - grams) / Math.max(grams, 0.001) <= 0.06) {
          return { amount: formattedCups.amount, unit: formattedCups.unit };
        }
      }
      return roundToCommonMeasurement(cupsExact * 16, "tbsp");
    };

    const convertRowForSystem = (ing: Ingredient): Ingredient => {
      const lookupKey = ingredientLibraryKey(ing);
      const libraryItem = INGREDIENT_LIBRARY.find(i => i.name === lookupKey);
      const ingredientType = libraryItem?.type || ing.type || "solid";
      const gPerCup = gramsPerCupForIngredient(lookupKey);

      // Skip only count / special pack units — NOT tsp, tbsp, cups: those are produced when
      // switching g/ml → imperial and must convert back on "Switch to g" or rows stay stuck.
      const skipUnits = ["large", "medium", "small", "whole", "pieces", "cloves", "squeeze", "packet", "dropper", "0.1ml"];
      if (skipUnits.includes(ing.unit)) return ing;

      if (newSystem === "imperial") {
        if (ing.unit === "g") {
          if (ingredientType === "powder") {
            const { amount, unit } = imperialFromGramsPowder(ing.amount, gPerCup);
            return { ...ing, amount, unit };
          }
          if (ingredientType === "fat") {
            const { amount, unit } = imperialFromGramsFat(ing.amount, gPerCup);
            return { ...ing, amount, unit };
          }
          const oz = ing.amount * 0.035274;
          const rounded = roundToCommonMeasurement(Math.max(oz, 0.5), "oz");
          return { ...ing, amount: rounded.amount, unit: rounded.unit };
        }
        if (ing.unit === "ml") {
          const flOz = ing.amount / 29.5735;
          if (flOz >= 8) {
            const cups = flOz / 8;
            const rounded = roundToCommonMeasurement(cups, "cups");
            return { ...ing, amount: rounded.amount, unit: rounded.unit };
          }
          if (flOz >= 2) {
            const rounded = roundToCommonMeasurement(flOz, "fl oz");
            return { ...ing, amount: rounded.amount, unit: rounded.unit };
          }
          if (ing.amount >= 15) {
            const tbsp = ing.amount / 14.7868;
            const rounded = roundToCommonMeasurement(tbsp, "tbsp");
            return { ...ing, amount: rounded.amount, unit: rounded.unit };
          }
          const tsp = ing.amount / 4.9289;
          const rounded = roundToCommonMeasurement(Math.max(tsp, 0.25), "tsp");
          return { ...ing, amount: rounded.amount, unit: rounded.unit };
        }
      } else {
        if (ing.unit === "cups") {
          if (ingredientType === "powder" || ingredientType === "fat") {
            const grams = ing.amount * gPerCup;
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g" };
          }
          return { ...ing, amount: parseFloat((ing.amount * 240).toFixed(1)), unit: "ml" };
        }
        if (ing.unit === "tbsp") {
          if (ingredientType === "powder" || ingredientType === "fat") {
            const grams = ing.amount * (gPerCup / 16);
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g" };
          }
          return { ...ing, amount: parseFloat((ing.amount * 14.7868).toFixed(1)), unit: "ml" };
        }
        if (ing.unit === "tsp") {
          if (ingredientType === "powder") {
            const grams = ing.amount * (gPerCup / 48);
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g" };
          }
          return { ...ing, amount: parseFloat((ing.amount * 4.9289).toFixed(1)), unit: "ml" };
        }
        if (ing.unit === "oz") {
          return { ...ing, amount: parseFloat((ing.amount / 0.035274).toFixed(1)), unit: "g" };
        }
        if (ing.unit === "fl oz") {
          return { ...ing, amount: parseFloat((ing.amount * 29.5735).toFixed(1)), unit: "ml" };
        }
      }
      return ing;
    };

    const convertedIngredients = ingredients.map((ing) => {
      const base = convertRowForSystem(ing);
      if (!ing.isInfused || !ing.thcPerUnit) return base;
      const totalMg = ing.amount * ing.thcPerUnit;
      if (base.unit === ing.unit && base.amount === ing.amount) return base;
      if (!Number.isFinite(base.amount) || base.amount <= 0) {
        return { ...base, thcPerUnit: ing.thcPerUnit };
      }
      return { ...base, thcPerUnit: parseFloat((totalMg / base.amount).toFixed(6)) };
    });

    setIngredients(convertedIngredients);
    setMeasurementSystem(newSystem);
  };

  const resetToCategories = () => {
    setSelectedCategory("");
    setRecipeType("");
    setSelectedStandardRecipe("");
    setIngredients([]);
    setInstructions([]);
  };

  const startCustomRecipe = () => {
    setRecipeType("custom");
    setRecipeName("My Custom Recipe");
    setServings(1);
    setIngredients([
      {
        name: "Cannabutter",
        amount: 50,
        unit: "g",
        isInfused: true,
        thcPerUnit: 10,
        calories: 717,
        carbs: 0,
        protein: 1,
        fat: 81,
        type: "fat",
      },
    ]);
    setInstructions(["Add your recipe instructions here"]);
  };

  const handleCategoryStart = (categoryId: string) => {
    const defaultRecipeId = DIRECT_CATEGORY_DEFAULTS[categoryId];
    if (defaultRecipeId) {
      setSelectedCategory(categoryId);
      setRecipeType("standard");
      setSelectedStandardRecipe(defaultRecipeId);
      trackEvent("category_direct_start", { category: categoryId, recipe: defaultRecipeId });
      return;
    }
    setSelectedCategory(categoryId);
  };

  // Hub: Step 1 + Step 2 categories (single above-the-fold layout)
  if (!selectedCategory) {
    return (
      <div className="max-w-6xl mx-auto space-y-2 sm:space-y-3">
        <InfusionFunnelProgressBar activeStep={2} compact />

        <div className="rounded-xl border border-green-200 bg-white px-3 py-2 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wide text-green-700">Step 1</p>
            <p className="text-xs font-semibold text-gray-900 sm:text-sm">
              Create your base — or in the recipe builder choose a premade option (squeeze, stir-in packet, tincture,
              oil, butter).
            </p>
          </div>
          <div className="mt-2 flex shrink-0 flex-wrap gap-1.5 sm:mt-0">
            <Button asChild size="sm" className="h-8 bg-green-600 px-2.5 text-xs font-bold sm:h-9 sm:px-3 sm:text-sm">
              <Link
                to="/infusions"
                onClick={() => trackEvent("ingredients_hub_click", { target: "infusions", step: "hub_step1" })}
              >
                My Infusions
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 border-green-300 px-2.5 text-xs font-semibold text-green-800 sm:h-9 sm:px-3 sm:text-sm"
              onClick={() => {
                trackEvent("ingredients_hub_click", { target: "calculator", step: "hub_step1" });
                navigate("/edibles-calculator");
              }}
            >
              Calculator
            </Button>
          </div>
        </div>

        <p className="text-sm font-black text-gray-900">
          Step 2 — Choose your recipe <span className="font-semibold text-gray-500">· choose a category below</span>
        </p>

        {showWhatCanIMake && (
          <Card className="bg-white border-2 border-purple-300 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-purple-600" />
                What Can I Make?
              </CardTitle>
              <CardDescription className="text-gray-800 font-medium">
                Select what ingredients you have
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              {/* Infusion Type Selector */}
              <div>
                <Label className="text-gray-900 font-semibold mb-2 block">🧪 Infusion Type</Label>
                <Select value={selectedInfusionType} onValueChange={setSelectedInfusionType}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select your infusion..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="none" className="text-gray-900">None</SelectItem>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "infused").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900">
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Pantry Items Selector */}
              <div>
                <Label className="text-gray-900 font-semibold mb-2 block">📦 Pantry Items</Label>
                <Select value="" onValueChange={addPantryItem}>
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Add pantry items..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white max-h-[300px]">
                    <div className="font-bold text-xs text-amber-700 px-2 py-1">🌾 FLOURS & STARCHES</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "flour").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-pink-700 px-2 py-1 mt-2">🍬 SUGARS & SWEETENERS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "sugar").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-yellow-700 px-2 py-1 mt-2">🧈 FATS & OILS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "fat").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-orange-700 px-2 py-1 mt-2">🥚 EGGS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "egg").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-blue-700 px-2 py-1 mt-2">🥛 DAIRY</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "dairy").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-cyan-700 px-2 py-1 mt-2">💧 LIQUIDS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "liquid").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-stone-700 px-2 py-1 mt-2">🍫 CHOCOLATE & CHIPS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "chocolate").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-red-700 px-2 py-1 mt-2">🍓 FRUITS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "fruit").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-green-700 px-2 py-1 mt-2">🥜 NUTS & SEEDS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "nuts").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-indigo-700 px-2 py-1 mt-2">🌸 FLAVORINGS & EXTRACTS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "flavoring").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-orange-800 px-2 py-1 mt-2">🌶️ SPICES</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "spice").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-rose-700 px-2 py-1 mt-2">🍯 FILLINGS & SPREADS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "filling").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                    <div className="font-bold text-xs text-gray-700 px-2 py-1 mt-2">🍝 SAVORY & OTHER</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "savory").map((item) => (
                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Ingredients List */}
              <div>
                <Label className="text-gray-900 font-semibold mb-2 block">✅ Your Ingredients</Label>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 min-h-[100px]">
                  {selectedInfusionType && selectedInfusionType !== "none" && (
                    <div className="mb-2">
                      <Badge className="bg-purple-600 text-white mr-2 mb-2">
                        🧪 {selectedInfusionType}
                        <button onClick={() => setSelectedInfusionType("none")} className="ml-2">×</button>
                      </Badge>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedPantryItems.length === 0 && selectedInfusionType === "none" ? (
                      <p className="text-gray-500 text-sm">No ingredients selected</p>
                    ) : (
                      selectedPantryItems.map((item) => (
                        <Badge key={item} className="bg-green-600 text-white">
                          {item}
                          <button onClick={() => removePantryItem(item)} className="ml-2">×</button>
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Find Recipes Button */}
              <Button
                onClick={findMatchingRecipes}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
                disabled={selectedInfusionType === "none" && selectedPantryItems.length === 0}
              >
                <ChefHat className="w-5 h-5 mr-2" />
                Find Recipes
              </Button>

              {/* Matching Recipes */}
              {availableRecipes.length > 0 && (
                <div>
                  <Label className="text-gray-900 font-semibold mb-2 block">🎯 Matching Recipes ({availableRecipes.length})</Label>
                  <div className="space-y-3">
                    {availableRecipes.map((recipe) => (
                      <div key={`${recipe.categoryId}-${recipe.id}`} className="bg-gradient-to-r from-green-50 to-white p-4 rounded-lg border border-green-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-2xl">{recipe.categoryEmoji}</span>
                              <h4 className="font-bold text-gray-900">{cleanRecipeDisplayTitle(recipe.name)}</h4>
                            </div>
                            <p className="text-xs text-gray-600">{recipe.categoryName}</p>
                          </div>
                          <Badge className="bg-green-600 text-white">
                            {recipe.matchPercentage}% match
                          </Badge>
                        </div>
                        {recipe.missingIngredients.length > 0 && (
                          <div className="mt-2 bg-yellow-50 p-2 rounded border border-yellow-200">
                            <p className="text-xs text-yellow-800">
                              <strong>Missing:</strong> {recipe.missingIngredients.join(", ")}
                            </p>
                          </div>
                        )}
                        <Button
                          onClick={() => {
                            setSelectedCategory(recipe.categoryId);
                            setRecipeType("standard");
                            setSelectedStandardRecipe(recipe.id);
                            setShowWhatCanIMake(false);
                          }}
                          className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                          size="sm"
                        >
                          Make This Recipe
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {availableRecipes.length === 0 && (selectedInfusionType !== "none" || selectedPantryItems.length > 0) && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-600 text-sm">Click "Find Recipes" to see what you can make!</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-2">
          {recipeCategories.map((category) => (
            <Card
              key={category.id}
              className="flex flex-col bg-white border border-gray-200 shadow-sm"
            >
              <CardHeader className="px-2 py-2 pb-1 text-center sm:px-3 sm:py-2">
                <div className="text-2xl sm:text-3xl mb-0.5">{category.emoji}</div>
                <CardTitle className="text-xs font-black text-gray-900 leading-tight sm:text-sm">{category.name}</CardTitle>
                <CardDescription className="text-[10px] text-gray-600 leading-snug line-clamp-2 mt-0.5">
                  {category.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex flex-col gap-1.5 px-2 pb-2 pt-0 sm:px-3 sm:pb-2">
                <Badge className="mx-auto bg-green-100 text-green-800 text-[10px] px-1.5 py-0">
                  {standardRecipes[category.id]?.length || 0} recipes
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 w-full bg-green-700 px-1 text-[10px] font-black leading-tight text-white hover:bg-green-800 sm:h-9 sm:text-xs"
                  onClick={() => {
                    trackEvent("ingredients_on_to_step_3", { category: category.id });
                    handleCategoryStart(category.id);
                  }}
                >
                  On to Step 3
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // STEP 2: Recipe Selection
  if (selectedCategory && !recipeType) {
    const category = recipeCategories.find(c => c.id === selectedCategory);
    const categoryRecipes = standardRecipes[selectedCategory] || [];
    const sortedCategoryRecipes = [...categoryRecipes].sort((a, b) =>
      cleanRecipeDisplayTitle(a.name).localeCompare(cleanRecipeDisplayTitle(b.name))
    );
    const searchQ = recipePickerSearch.trim().toLowerCase();
    const recipeMatchesPicker = (recipe: {
      id: string;
      name: string;
      ingredients?: string[];
    }) => {
      if (!searchQ) return true;
      const words = searchQ.split(/\s+/).filter(Boolean);
      const hay = [
        recipe.id,
        recipe.name,
        cleanRecipeDisplayTitle(recipe.name),
        ...(recipe.ingredients ?? []),
      ]
        .join(" ")
        .toLowerCase();
      return words.every((w) => hay.includes(w));
    };
    const snackGroupLabel = (recipe: { id: string; name: string }) => {
      const key = `${recipe.id} ${recipe.name}`.toLowerCase();
      if (/(popcorn|kettle-corn)/.test(key)) return "Popcorn";
      if (/pretzel/.test(key)) return "Pretzels";
      if (/(gumm|jello|gel cube|shot)/.test(key)) return "Gummies & Jello";
      if (/(brownie|blondie|fudge|marshmallow|cupcake|cookie|churro|funnel-cake|rice-krispie|cereal treat)/.test(key)) return "Sweet Bites";
      if (/(mix|nuts|cracker|chex)/.test(key)) return "Snack Mixes & Savory";
      return "Other Snacks";
    };
    const snackGroupOrder = ["Popcorn", "Pretzels", "Gummies & Jello", "Sweet Bites", "Snack Mixes & Savory", "Other Snacks"];
    const groupedSnackRecipes =
      selectedCategory === "snacks"
        ? snackGroupOrder
            .map((label) => ({
              label,
              recipes: sortedCategoryRecipes.filter((recipe) => snackGroupLabel(recipe) === label),
            }))
            .filter((group) => group.recipes.length > 0)
        : [];
    const pickerGroups =
      selectedCategory === "snacks"
        ? groupedSnackRecipes
            .map((group) => ({
              ...group,
              recipes: group.recipes.filter(recipeMatchesPicker),
            }))
            .filter((group) => group.recipes.length > 0)
        : [{ label: "", recipes: sortedCategoryRecipes.filter(recipeMatchesPicker) }];
    const pickerRecipeCount = pickerGroups.reduce((n, g) => n + g.recipes.length, 0);

    return (
      <div className="max-w-4xl mx-auto space-y-5">
        <InfusionFunnelProgressBar
          activeStep={2}
          step1CompleteNote="Base step covered — pick a recipe to load your ingredients"
        />

        {/* Compact breadcrumb header */}
        <div className="flex items-center gap-3">
          <Button onClick={resetToCategories} variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-1" /> All Categories
          </Button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-semibold flex items-center gap-1.5">
            <span>{category?.emoji}</span> {category?.name}
          </span>
        </div>

        {/* Main question */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Choose your recipe</h1>
          <p className="text-gray-500 text-sm mt-1">Pick one to load — Step 3 is servings, strength, and print.</p>
        </div>

        {/* Search recipes in this category */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden />
          <Input
            type="search"
            value={recipePickerSearch}
            onChange={(e) => setRecipePickerSearch(e.target.value)}
            placeholder="Search recipes (e.g. blondie, wings, chocolate)…"
            className="pl-10 text-gray-900 border-gray-300 bg-white h-11 rounded-xl shadow-sm"
            aria-label="Search recipes in this category"
          />
        </div>

        {/* Recipe cards — horizontal list */}
        {categoryRecipes.length > 0 && pickerRecipeCount === 0 && searchQ ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-6 text-center text-sm text-amber-900">
            No recipes match <span className="font-bold">&ldquo;{recipePickerSearch.trim()}&rdquo;</span> in {category?.name}.
            Try another word or clear the search.
          </div>
        ) : null}
        {categoryRecipes.length > 0 && (
          <div className="space-y-3">
            {pickerGroups.map((group) => (
              <div key={group.label || "all"} className="space-y-3">
                {group.label ? (
                  <h2 className="text-sm font-black uppercase tracking-wide text-gray-500 pt-2">
                    {group.label}
                  </h2>
                ) : null}
                {group.recipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => { setRecipeType("standard"); setSelectedStandardRecipe(recipe.id); trackEvent('recipe_selected', {recipe_name: recipe.name}); }}
                    className="w-full bg-white border-2 border-gray-200 hover:border-green-500 hover:shadow-md rounded-2xl p-4 text-left transition-all group flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      {category?.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-gray-900 text-base">{cleanRecipeDisplayTitle(recipe.name)}</div>
                      <div className="text-gray-500 text-sm mt-0.5">
                        {recipe.servings} servings · {recipe.ingredients.length} ingredients
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs bg-green-100 text-green-700 font-semibold px-2.5 py-1 rounded-full">
                        Load Recipe
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-gray-400 text-sm font-medium">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Start from scratch */}
        <button
          onClick={() => { startCustomRecipe(); trackEvent('custom_recipe_started'); }}
          className="w-full bg-white border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50/30 rounded-2xl p-4 text-left transition-all group flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
            <Plus className="w-6 h-6 text-gray-400 group-hover:text-purple-600 transition-colors" />
          </div>
          <div className="flex-1">
            <div className="font-black text-gray-700 group-hover:text-purple-700 transition-colors">Start from scratch</div>
            <div className="text-gray-400 text-sm mt-0.5">Build your own recipe with any ingredients</div>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
        </button>

      </div>
    );
  }

  // STEP 3: Recipe Builder
  if (recipeType && ingredients.length > 0) {
    const category = recipeCategories.find(c => c.id === selectedCategory);
    const startingRecipeName =
      recipeType === "standard" && selectedCategory && selectedStandardRecipe
        ? cleanRecipeDisplayTitle(
            (standardRecipes[selectedCategory] || []).find((r) => r.id === selectedStandardRecipe)?.name ?? ""
          )
        : "";

    // Dosing tier
    const dosingTier = thcPerServing < 2.5 ? { label: "Microdose", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" }
      : thcPerServing < 5   ? { label: "Low",       color: "text-green-700",  bg: "bg-green-50 border-green-200" }
      : thcPerServing < 15  ? { label: "Moderate",  color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" }
      : thcPerServing < 30  ? { label: "High",       color: "text-orange-700", bg: "bg-orange-50 border-orange-200" }
      : { label: "Very High", color: "text-red-700",    bg: "bg-red-50 border-red-200" };

    // Category summary for ingredient breakdown
    const categorySummary: Record<string, number> = {};
    ingredients.forEach(ing => {
      const lib = INGREDIENT_LIBRARY.find(i => i.name === ingredientLibraryKey(ing));
      const cat = lib?.category || "other";
      const g = toGramsIng(ing);
      categorySummary[cat] = (categorySummary[cat] || 0) + g;
    });
    const catEmojis: Record<string, string> = {
      infused: "🧪", flour: "🌾", fat: "🧈", sugar: "🍬",
      dairy: "🥛", liquid: "💧", protein: "🥩", spice: "🌶️",
      chocolate: "🍫", egg: "🥚", leavening: "🧂", other: "📦",
      fruit: "🍓", nuts: "🥜", flavoring: "🌸", filling: "🍯", savory: "🍝", wings: "🍗", "spreads-dips": "🥣", snacks: "🍿",
    };

    const infusedIngredients = ingredients.filter(i => i.isInfused && i.thcPerUnit);

    const funnelStep1Done =
      "Base ready — swap in cannabutter, oil, tincture, or a premade squeeze in the ingredient list";
    const funnelStep2Done = startingRecipeName
      ? `${category?.name ?? "Category"} · ${startingRecipeName}`
      : recipeType === "custom"
        ? `${recipeName.trim() || "Custom recipe"} ready to customize`
        : `${recipeName.trim() || "Recipe"} loaded — adjust servings & strength below`;

    return (
      <>
        <style>{`
          /* ── SCREEN: hide print-only elements ───────── */
          .print-only { display: none !important; }

          /* ── PRINT: full kitchen recipe layout ──────── */
          @media print {
            /* Hide all screen UI */
            header, footer, nav,
            .no-print { display: none !important; }

            /* Hide the screen version of the recipe builder */
            .screen-only { display: none !important; }

            /* Show the print layout */
            .print-only { display: block !important; }

            /* Full recipe vs. buffet tent labels (mutually exclusive) */
            .print-mode-full .print-buffet-sheet { display: none !important; }
            .print-mode-buffet .print-page { display: none !important; }
            .print-mode-buffet .print-buffet-sheet { display: block !important; }

            /* Reset page */
            body, html {
              background: white !important;
              color: black !important;
              font-family: Georgia, serif !important;
              font-size: 11pt !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .print-page {
              max-width: 100% !important;
              padding: 0.5in 0.75in !important;
            }

            .print-title {
              font-size: 24pt !important;
              font-weight: 900 !important;
              border-bottom: 3px solid black !important;
              padding-bottom: 6pt !important;
              margin-bottom: 12pt !important;
            }

            .print-section-title {
              font-size: 13pt !important;
              font-weight: 700 !important;
              border-bottom: 1px solid #ccc !important;
              padding-bottom: 3pt !important;
              margin: 14pt 0 8pt 0 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
            }

            .print-thc-box {
              border: 2px solid black !important;
              padding: 10pt 14pt !important;
              margin-bottom: 14pt !important;
              background: #f9f9f9 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            .print-thc-number {
              font-size: 28pt !important;
              font-weight: 900 !important;
              line-height: 1 !important;
            }

            .print-thc-label {
              font-size: 10pt !important;
              color: #333 !important;
            }

            .print-dose-badge {
              display: inline-block !important;
              border: 1.5px solid black !important;
              padding: 2pt 8pt !important;
              font-weight: 700 !important;
              font-size: 10pt !important;
              margin-top: 4pt !important;
            }

            /* Keep section title with its first item */
            .print-section-title {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }

            /* Never break inside an ingredient row */
            .print-ingredient {
              padding: 3pt 0 !important;
              border-bottom: 0.5pt solid #eee !important;
              display: flex !important;
              gap: 8pt !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Never break inside a step — this is the key fix */
            .print-step {
              display: flex !important;
              gap: 10pt !important;
              margin-bottom: 8pt !important;
              align-items: flex-start !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            .print-step-num {
              width: 20pt !important;
              height: 20pt !important;
              border: 1.5px solid black !important;
              border-radius: 50% !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              font-weight: 700 !important;
              font-size: 9pt !important;
              flex-shrink: 0 !important;
            }

            .print-dose-table {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            .print-dose-table td {
              padding: 2pt 8pt !important;
              font-size: 9pt !important;
            }

            /* Keep safety and footer together and off the bottom of a page */
            .print-safety {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            .print-footer {
              margin-top: 20pt !important;
              padding-top: 8pt !important;
              border-top: 1pt solid #ccc !important;
              font-size: 8pt !important;
              color: #666 !important;
              text-align: center !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            @page {
              margin: 0.5in 0.75in;
              size: letter;
            }

            /* ── Buffet / table-tent labels (folded cards) ───────── */
            .print-buffet-sheet {
              font-family: system-ui, "Segoe UI", Arial, Helvetica, sans-serif !important;
              padding: 0 !important;
            }
            .print-buffet-intro {
              font-size: 9pt !important;
              color: #444 !important;
              margin-bottom: 10pt !important;
              text-align: center !important;
              page-break-after: avoid !important;
            }
            .print-buffet-grid {
              display: grid !important;
              grid-template-columns: 1fr 1fr !important;
              gap: 0.18in !important;
            }
            .buffet-tent {
              border: 1.5pt solid #111 !important;
              border-radius: 2pt !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              background: #fff !important;
            }
            .buffet-tent-panel {
              padding: 0.14in 0.16in 0.12in 0.16in !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
              min-height: 1.05in !important;
            }
            .buffet-fold {
              border-top: 0.75pt dashed #888 !important;
              font-size: 6.5pt !important;
              letter-spacing: 0.06em !important;
              text-transform: uppercase !important;
              color: #666 !important;
              padding: 2pt 4pt !important;
              text-align: center !important;
              background: #fafafa !important;
            }
            .buffet-title {
              font-size: 12.5pt !important;
              font-weight: 900 !important;
              line-height: 1.15 !important;
              color: #000 !important;
            }
            .buffet-dose {
              font-size: 20pt !important;
              font-weight: 900 !important;
              line-height: 1 !important;
              margin-top: 5pt !important;
              color: #000 !important;
            }
            .buffet-dose-sub {
              font-size: 8pt !important;
              font-weight: 600 !important;
              color: #333 !important;
              margin-top: 2pt !important;
            }
            .buffet-batch {
              font-size: 7.5pt !important;
              color: #555 !important;
              margin-top: 5pt !important;
            }
            .buffet-warn {
              font-size: 8.5pt !important;
              font-weight: 800 !important;
              line-height: 1.3 !important;
              margin-top: 6pt !important;
              color: #111 !important;
              max-width: 2.6in !important;
            }
            .buffet-brand {
              font-size: 6.5pt !important;
              letter-spacing: 0.04em !important;
              color: #777 !important;
              margin-top: 7pt !important;
            }
          }
        `}</style>

        {/* ── PRINT-ONLY: full recipe OR buffet tent labels ─ */}
        <div className={`print-only print-target-wrap ${printTarget === "buffet" ? "print-mode-buffet" : "print-mode-full"}`}>
          <div className="print-page">

            {/* Title */}
            <div className="print-title">{recipeName || "My Cannabis Recipe"}</div>
            <div style={{fontSize:"10pt", color:"#555", marginBottom:"14pt"}}>
              {servings} servings &nbsp;·&nbsp; {category?.name || "Recipe"} &nbsp;·&nbsp; Generated by Infusion Sensei
            </div>

            {/* THC Summary Box */}
            <div className="print-thc-box">
              <div style={{display:"flex", gap:"24pt", alignItems:"flex-start", flexWrap:"wrap"}}>
                <div>
                  <div className="print-thc-number">{thcPerServing.toFixed(1)} mg</div>
                  <div className="print-thc-label">THC per serving</div>
                  <div className="print-dose-badge">{dosingTier.label.toUpperCase()}</div>
                </div>
                <div style={{borderLeft:"1.5px solid #ccc", paddingLeft:"20pt"}}>
                  <div style={{fontSize:"18pt", fontWeight:"900"}}>{totalTHC.toFixed(0)} mg</div>
                  <div className="print-thc-label">Total batch</div>
                  <div style={{fontSize:"9pt", color:"#555", marginTop:"4pt"}}>{servings} servings total</div>
                </div>
                {infusedIngredients.length > 0 && (
                  <div style={{borderLeft:"1.5px solid #ccc", paddingLeft:"20pt"}}>
                    <div style={{fontSize:"9pt", fontWeight:"700", marginBottom:"4pt"}}>INFUSED INGREDIENTS</div>
                    {infusedIngredients.map((ing, i) => (
                      <div key={i} style={{fontSize:"9pt"}}>
                        {ing.name}: <strong>{(ing.amount * (ing.thcPerUnit || 0)).toFixed(1)} mg THC</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients */}
            <div className="print-section-title">Ingredients</div>
            <div>
              {ingredients.map((ing, i) => (
                <div key={i} className="print-ingredient">
                  <span style={{minWidth:"80pt", fontWeight:"600"}}>
                    {ing.amount} {ing.unit}
                  </span>
                  <span>{ing.name}{ing.isInfused ? " ⬅ infused" : ""}</span>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="print-section-title">Instructions</div>
            <div>
              {instructions.map((step, i) => (
                <div key={i} className="print-step">
                  <div className="print-step-num">{i + 1}</div>
                  <div style={{fontSize:"10.5pt", lineHeight:"1.5"}}>{step}</div>
                </div>
              ))}
            </div>

            {/* Dosing Guide */}
            <div className="print-section-title">Dosing Reference</div>
            <table className="print-dose-table" style={{borderCollapse:"collapse"}}>
              <tbody>
                {[
                  ["1–2.5 mg", "Microdose", "Subtle effect, ideal for beginners"],
                  ["2.5–5 mg", "Low", "Mild relaxation, light relief"],
                  ["5–15 mg", "Moderate", "Standard recreational / therapeutic"],
                  ["15–30 mg", "High", "Experienced users only"],
                  ["30+ mg", "Very High", "Tolerance required"],
                ].map(([range, label, desc]) => (
                  <tr key={range} style={{fontWeight: label === dosingTier.label ? "700" : "400", background: label === dosingTier.label ? "#f0f0f0" : "transparent"}}>
                    <td style={{width:"60pt"}}>{range}</td>
                    <td style={{width:"80pt"}}>{label}</td>
                    <td style={{color:"#555"}}>{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Safety */}
            <div className="print-section-title">Safety</div>
            <p style={{fontSize:"9.5pt", lineHeight:"1.6", color:"#333"}}>
              Start low, go slow — edibles take 30–120 minutes to take effect. Wait at least 2 hours before consuming more.
              Keep all cannabis products safely stored away from children and pets.
              Never drive or operate machinery after consuming. For adults 21+ only.
            </p>

            {/* Footer */}
            <div className="print-footer">
              Generated by Infusion Sensei · infusionsensei.com · Exact THC dosing for every recipe
            </div>

          </div>

          {/* Buffet table tents: cut along outer border, fold on dashed line, stand on table */}
          <div className="print-buffet-sheet">
            <p className="print-buffet-intro">
              Cut out each card along the border, fold on the dashed line so both sides show the same message, and place at the buffet.
            </p>
            <div className="print-buffet-grid">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="buffet-tent">
                  <div className="buffet-tent-panel">
                    <div className="buffet-title">{recipeName || "Infused dish"}</div>
                    <div className="buffet-dose">{thcPerServing.toFixed(1)} mg</div>
                    <div className="buffet-dose-sub">THC per serving</div>
                    <div className="buffet-batch">
                      {servings} serving{servings === 1 ? "" : "s"} · {totalTHC.toFixed(0)} mg total batch
                    </div>
                    <div className="buffet-warn">Infused food — contains cannabis. Eat wisely.</div>
                    <div className="buffet-brand">Infusion Sensei</div>
                  </div>
                  <div className="buffet-fold">Fold here — same text on both sides</div>
                  <div className="buffet-tent-panel">
                    <div className="buffet-title">{recipeName || "Infused dish"}</div>
                    <div className="buffet-dose">{thcPerServing.toFixed(1)} mg</div>
                    <div className="buffet-dose-sub">THC per serving</div>
                    <div className="buffet-batch">
                      {servings} serving{servings === 1 ? "" : "s"} · {totalTHC.toFixed(0)} mg total batch
                    </div>
                    <div className="buffet-warn">Infused food — contains cannabis. Eat wisely.</div>
                    <div className="buffet-brand">Infusion Sensei</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SCREEN VERSION ─────────────────────────────── */}
        <div className="screen-only max-w-7xl mx-auto">
          {/* Mobile / tablet: compact THC always visible under site header while scrolling */}
          <div className="no-print lg:hidden">
            <div
              aria-live="polite"
              aria-label={`THC ${thcPerServing.toFixed(1)} milligrams per serving, ${totalTHC.toFixed(0)} milligrams total batch, ${servings} servings, ${dosingTier.label} strength`}
              className="fixed left-0 right-0 z-40 border-b border-black/20 bg-gradient-to-r from-green-800 via-green-900 to-green-950 px-2 py-1.5 shadow-md"
              style={{ top: "max(4rem, calc(env(safe-area-inset-top, 0px) + 3.25rem))" }}
            >
              <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center leading-tight">
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wide text-green-200/90 sm:text-[10px]">
                  <Calculator className="h-3 w-3 shrink-0 text-green-300" aria-hidden />
                  Live
                </span>
                <span className="text-[10px] font-black tabular-nums text-white sm:text-[11px]">
                  {thcPerServing.toFixed(1)} mg/srv
                </span>
                <span className="text-[9px] text-green-300/70">·</span>
                <span className="text-[9px] tabular-nums text-green-100 sm:text-[10px]">{totalTHC.toFixed(0)} mg tot</span>
                <span className="text-[9px] text-green-300/70">·</span>
                <span className="text-[9px] tabular-nums text-green-100 sm:text-[10px]">{servings} srv</span>
                <span className="text-[9px] text-green-300/70">·</span>
                <span
                  className={`text-[9px] font-bold sm:text-[10px] ${
                    dosingTier.label === "Microdose"
                      ? "text-sky-200"
                      : dosingTier.label === "Low"
                        ? "text-lime-200"
                        : dosingTier.label === "Moderate"
                          ? "text-yellow-200"
                          : dosingTier.label === "High"
                            ? "text-orange-200"
                            : "text-red-200"
                  }`}
                >
                  {dosingTier.label}
                </span>
              </div>
            </div>
            <div className="h-11 w-full shrink-0 sm:h-12" aria-hidden />
          </div>

          <InfusionFunnelProgressBar
            activeStep={3}
            step1CompleteNote={funnelStep1Done}
            step2CompleteNote={funnelStep2Done}
          />

          {/* ── TOP BAR ──────────────────────────────────────── */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200 no-print mb-6">
            <Button
              onClick={() => {
                if (searchParams.get("from") === "party-snacks") {
                  navigate("/party-snacks");
                  return;
                }
                // If came from URL params, go back to the source page
                const cat = searchParams.get("category");
                const rec = searchParams.get("recipe");
                const isJelloRecipe =
                  rec === "classic-jello-shots" ||
                  rec === "fruit-juice-jello-cubes" ||
                  rec === "layered-jello-shots" ||
                  rec === "sour-jello-bites";
                const isGummyRecipe =
                  rec === "classic-gummies" ||
                  rec === "fruit-gummies" ||
                  rec === "sour-gummies";
                if (cat === "wings") {
                  navigate("/wings");
                } else if (cat === "snacks" && isJelloRecipe) {
                  navigate("/jello");
                } else if (cat === "snacks" && isGummyRecipe) {
                  navigate("/gummies");
                } else if (cat === "snacks" && rec === "infused-chocolate-fudge") {
                  navigate("/learn/articles/infused-fudge-recipe");
                } else if (cat === "popcorn" || cat === "snacks") {
                  navigate("/popcorn");
                } else if (cat === "spreads-dips") {
                  navigate("/spreads-dips");
                } else if (cat === "drinks") {
                  navigate("/coffee");
                } else {
                  setRecipeType(""); setSelectedStandardRecipe(""); setIngredients([]);
                }
              }}
              variant="ghost" className="text-gray-600 hover:text-gray-900 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {searchParams.get("from") === "party-snacks" ? "← Back to Party Snacks" :
               searchParams.get("category") === "wings" ? "← Back to Wings" :
               (searchParams.get("category") === "snacks" && (
                 searchParams.get("recipe") === "classic-jello-shots" ||
                 searchParams.get("recipe") === "fruit-juice-jello-cubes" ||
                 searchParams.get("recipe") === "layered-jello-shots" ||
                 searchParams.get("recipe") === "sour-jello-bites"
               )) ? "← Back to Jello" :
               (searchParams.get("category") === "snacks" && (
                 searchParams.get("recipe") === "classic-gummies" ||
                 searchParams.get("recipe") === "fruit-gummies" ||
                 searchParams.get("recipe") === "sour-gummies"
               )) ? "← Back to Gummies" :
               (searchParams.get("category") === "snacks" && searchParams.get("recipe") === "infused-chocolate-fudge") ? "← Fudge guide" :
               searchParams.get("category") === "popcorn" ? "← Back to Popcorn" :
               searchParams.get("category") === "drinks" ? "← Back to Coffee" :
               searchParams.get("category") === "spreads-dips" ? "← Back to Spreads & Dips" :
               "Back"}
            </Button>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white px-3 py-1">{category?.emoji} {category?.name}</Badge>
              {returnToPartyPack && partyPackId && partyItemId && (
                <Button
                  onClick={handleReturnToPartyPack}
                  variant="default"
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white gap-1.5 font-bold shadow-sm ring-2 ring-orange-200"
                >
                  <ArrowLeft className="w-4 h-4" />{" "}
                  {partyPackId.startsWith("wings-split:")
                    ? "Back to Wings Split - Build Next Flavor"
                    : "Back to Party Pack"}
                </Button>
              )}
              <Button onClick={() => runPrint("full")} variant="outline" size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 gap-1.5">
                <Printer className="w-4 h-4" /> Print
              </Button>
              <Button onClick={() => runPrint("buffet")} variant="outline" size="sm"
                className="border-amber-300 text-amber-900 hover:bg-amber-50 gap-1.5">
                <LayoutGrid className="w-4 h-4" /> Buffet labels
              </Button>
            </div>
          </div>

          {recipeType === "standard" && !!startingRecipeName && (
            <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-4 no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-sm text-green-900">
                Starting with: <span className="font-black">{startingRecipeName}</span>
              </p>
              <Button
                size="sm"
                variant="outline"
                className="border-green-300 text-green-800 hover:bg-green-100 font-semibold"
                onClick={() => {
                  setRecipeType("");
                  setSelectedStandardRecipe("");
                  setIngredients([]);
                }}
              >
                Change Recipe
              </Button>
            </div>
          )}

          {/* ── TWO COLUMN LAYOUT ────────────────────────────── */}
          <div className="flex gap-6 items-stretch">
            {/* items-stretch so the right column is as tall as the editor; sticky THC panel can track full page scroll */}

            {/* ── LEFT COLUMN: Recipe editor ───────────────── */}
            <div className="flex-1 min-w-0 space-y-6">

          {/* ── RECIPE NAME + SERVINGS ───────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-700 font-semibold text-sm">Recipe Name</Label>
                <Input value={recipeName} onChange={(e) => setRecipeName(e.target.value)}
                  className="text-gray-900 border-gray-300 mt-1" placeholder="My Cannabis Recipe" />
              </div>
              <div>
                <Label className="text-gray-700 font-semibold text-sm">Servings</Label>
                <Input type="number" value={servings} onChange={(e) => setServings(parseInt(e.target.value) || 1)}
                  min={1} className="text-gray-900 border-gray-300 mt-1" />
              </div>
            </div>
          </div>
          {/* ── RECIPE ANALYSIS ──────────────────────────────── */}
          <RecipeSummaryCard />

          {/* ── INGREDIENTS ──────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-green-600 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-white font-black text-lg">✏️ Customize Your Recipe</h2>
                <p className="text-green-200 text-xs mt-0.5">Adjust ingredients — THC updates instantly</p>
              </div>
              <div className="flex gap-2 no-print">
                <Button onClick={toggleMeasurementSystem} size="sm" variant="ghost"
                  className="text-white hover:bg-green-700 border border-green-500 text-xs gap-1">
                  <ArrowLeftRight className="w-3 h-3" />
                  {measurementSystem === "metric" ? "Switch to oz" : "Switch to g"}
                </Button>
                <Button onClick={() => { addIngredient(); trackEvent('ingredient_added'); }} size="sm" className="bg-white text-green-700 hover:bg-green-50 font-bold text-xs gap-1">
                  <Plus className="w-3 h-3" /> Add
                </Button>
              </div>
            </div>

            {/* Category breakdown */}
            {Object.keys(categorySummary).length > 0 && (
              <div className="px-5 pt-4 pb-2">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 border border-blue-100">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wide mb-2">📊 Ingredient Breakdown</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(categorySummary).map(([cat, grams]) => (
                      <span key={cat} className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs">
                        <span className="mr-1">{catEmojis[cat] || "📦"}</span>
                        <span className="text-gray-500 capitalize">{cat}</span>
                        <span className="ml-1 font-bold text-gray-800">{grams.toFixed(0)}g</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="divide-y divide-gray-100 px-2 py-2">
              {ingredients.map((ing, idx) => {
                const warning = getIngredientWarning(ing, servings, idx);
                const lib = INGREDIENT_LIBRARY.find(i => i.name === ingredientLibraryKey(ing));
                const cat = lib?.category || "other";
                const ingredientSelectValue = ing.infusionBaseId
                  ? `${SAVED_INFUSION_VALUE_PREFIX}${ing.infusionBaseId}`
                  : ing.name;
                return (
                  <div key={idx} className="py-2 px-3 hover:bg-gray-50/60 rounded-xl transition-colors">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base">{catEmojis[cat] || "📦"}</span>
                      <div className="flex-1 min-w-32">
                        <Select value={ingredientSelectValue} onValueChange={(v) => onIngredientSelectChange(idx, v)}>
                          <SelectTrigger className="h-9 text-gray-900 border-gray-200 bg-white text-sm font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white max-h-[300px]">
                            {infusionBases.length > 0 && (
                              <Fragment key="saved-bases">
                                <div className="font-bold text-xs text-purple-700 px-2 py-1 mt-1 uppercase">My saved bases</div>
                                {infusionBases.map((b) => (
                                  <SelectItem key={b.id} value={`${SAVED_INFUSION_VALUE_PREFIX}${b.id}`} className="text-gray-900 text-sm">
                                    {b.name} ({b.thcPerUnit} mg / {b.baseUnit})
                                  </SelectItem>
                                ))}
                              </Fragment>
                            )}
                            {["infused","flour","sugar","fat","egg","leavening","dairy","liquid","chocolate","fruit","nuts","flavoring","spice","filling","savory"].map((grp) => (
                              <Fragment key={grp}>
                                <div className="font-bold text-xs text-gray-500 px-2 py-1 mt-1 uppercase">{catEmojis[grp] || "📦"} {grp}</div>
                                {INGREDIENT_LIBRARY.filter((i) => i.category === grp).map((item) => (
                                  <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                                ))}
                              </Fragment>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Input type="number" value={ing.amount}
                        onChange={(e) => updateIngredient(idx, "amount", parseFloat(e.target.value) || 0)}
                        className="w-20 text-gray-900 border-gray-200 h-9 text-sm" />
                      <Select value={ing.unit} onValueChange={(v) => handleIngredientUnitChange(idx, v)}>
                        <SelectTrigger className="w-24 h-9 text-gray-900 border-gray-200 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-[280px]">
                          <div className="font-bold text-xs text-blue-700 px-2 py-1">📏 Metric</div>
                          {["g","ml","kg","L"].map(u => <SelectItem key={u} value={u} className="text-gray-900 text-sm">{u}</SelectItem>)}
                          <div className="font-bold text-xs text-orange-700 px-2 py-1 mt-1">🥄 Imperial</div>
                          {["tsp","tbsp","cups","fl oz","oz","lb"].map(u => <SelectItem key={u} value={u} className="text-gray-900 text-sm">{u}</SelectItem>)}
                          <div className="font-bold text-xs text-green-700 px-2 py-1 mt-1">🔢 Count</div>
                          {["large","medium","small","whole","pieces","cloves","pinch","squeeze","packet","dropper"].map(u => <SelectItem key={u} value={u} className="text-gray-900 text-sm">{u}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {ing.isInfused && (() => {
                        const thcEquiv = infusedThcEquivalenceHint(ing);
                        return (
                          <div className="flex flex-col gap-0.5 min-w-0 max-w-[14rem] no-print">
                            <div className="flex flex-wrap items-center gap-1">
                              <Badge className="bg-purple-100 text-purple-700 border-0 text-xs px-2 shrink-0">🧪 THC</Badge>
                              <Input type="number" value={ing.thcPerUnit || 0}
                                onChange={(e) => updateIngredient(idx, "thcPerUnit", parseFloat(e.target.value) || 0)}
                                placeholder="mg/unit" className="w-20 bg-purple-50 border-purple-200 text-gray-900 h-9 text-sm shrink-0" />
                              <span className="text-xs text-purple-700 font-medium shrink-0">mg/{ing.unit}</span>
                            </div>
                            {thcEquiv ? (
                              <span
                                className="text-[10px] text-purple-600 leading-snug pl-0.5"
                                title="Editable field is mg per your selected unit. The line below is the same strength as mg/g and mg/tbsp; total mg = amount × mg (your unit)."
                              >
                                {thcEquiv}
                              </span>
                            ) : null}
                          </div>
                        );
                      })()}
                      <Button onClick={() => removeIngredient(idx)} variant="ghost" size="sm"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 h-9 w-9 p-0 no-print">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    {warning.warning && (
                      <div className={`mt-1.5 ml-8 px-3 py-1.5 rounded-lg text-xs flex items-start gap-1.5 ${
                        warning.color === "red" ? "bg-red-50 text-red-700 border border-red-200" :
                        warning.color === "orange" ? "bg-orange-50 text-orange-700 border border-orange-200" :
                        "bg-yellow-50 text-yellow-800 border border-yellow-200"}`}>
                        <span>{warning.color === "red" ? "🚨" : "⚠️"}</span>
                        <span>{warning.warning}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── INSTRUCTIONS ─────────────────────────────────── */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gray-900 px-5 py-4">
              <h2 className="text-white font-black text-lg">👨‍🍳 Instructions</h2>
              <p className="text-gray-400 text-xs mt-0.5">{instructions.length} steps</p>
            </div>
            <ol className="divide-y divide-gray-100">
              {instructions.map((step, i) => (
                <li key={i} className="flex gap-4 px-5 py-4 hover:bg-gray-50/60 transition-colors">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white font-black text-sm">{i + 1}</span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* ── NUTRITION + PRINT ROW ─────────────────────────── */}
          <div className="grid sm:grid-cols-3 gap-4 no-print">
            <button
              onClick={() => setShowNutritionLabel(!showNutritionLabel)}
              className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-5 text-left transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span className="text-xl">🥗</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Nutrition Facts</p>
                  <p className="text-xs text-gray-500">{showNutritionLabel ? "Hide label" : "Show full label"}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[
                  { label: "Calories", val: caloriesPerServing.toFixed(0) },
                  { label: "Carbs", val: `${carbsPerServing.toFixed(1)}g` },
                  { label: "Fat", val: `${fatPerServing.toFixed(1)}g` },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-gray-50 rounded-lg px-2 py-1.5 text-center">
                    <div className="text-xs text-gray-500">{label}</div>
                    <div className="font-bold text-gray-900 text-sm">{val}</div>
                  </div>
                ))}
              </div>
            </button>

            <button
              onClick={() => runPrint("full")}
              className="bg-white border-2 border-green-200 hover:border-green-500 rounded-2xl p-5 text-left transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Printer className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Print Recipe</p>
                  <p className="text-xs text-gray-500">Kitchen sheet · full details</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Ingredients, instructions, and THC per serving.</p>
            </button>

            <button
              onClick={() => runPrint("buffet")}
              className="bg-white border-2 border-amber-200 hover:border-amber-500 rounded-2xl p-5 text-left transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <LayoutGrid className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Buffet tent labels</p>
                  <p className="text-xs text-gray-500">Folded table cards</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Dish name, dose, infused warning, and Infusion Sensei — ready to cut and fold.</p>
            </button>
          </div>

          {/* Nutrition Facts Label (expanded) */}
          {showNutritionLabel && (
            <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
              <NutritionFactsLabel
                servings={servings}
                servingSize="1 serving"
                thcPerServing={thcPerServing}
                caloriesPerServing={caloriesPerServing}
                proteinPerServing={proteinPerServing}
                carbsPerServing={carbsPerServing}
                fatPerServing={fatPerServing}
                fiberPerServing={fiberPerServing}
                sugarPerServing={sugarPerServing}
                sodiumPerServing={sodiumPerServing}
              />
            </div>
          )}

          {/* ── SAFETY ───────────────────────────────────────── */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex gap-3 items-start">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <p className="text-sm text-amber-800">
              <strong>Start Low, Go Slow</strong> — Edibles take 30–120 min to take effect. Wait before taking more. Store safely away from children and pets.
            </p>
          </div>

          <div className="bg-white border-2 border-green-200 rounded-2xl p-5 no-print">
            <p className="text-xs font-bold uppercase tracking-wide text-green-700 mb-2">Next step</p>
            <h3 className="text-lg font-black text-gray-900 mb-1">Ready to verify your final dose?</h3>
            <p className="text-sm text-gray-600 mb-3">Use the calculator for a second pass on total batch and per-serving targets.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => navigate("/edibles-calculator")} className="bg-green-600 hover:bg-green-700 font-bold">
                Calculate mg Per Serving <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button onClick={() => navigate("/recipes")} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 font-semibold">
                Browse more recipes
              </Button>
            </div>
          </div>

            </div>{/* end left column */}

            {/* ── RIGHT COLUMN: Sticky THC Dashboard ───────── */}
            <div className="w-80 flex-shrink-0 hidden lg:flex lg:flex-col no-print">
              <div className="sticky top-20 z-20 w-full space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto overflow-x-hidden overscroll-y-contain pb-2">

                {/* THC Results Panel */}
                <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl overflow-hidden shadow-xl">
                  <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calculator className="w-4 h-4 text-green-300" />
                      <span className="font-bold text-green-200 text-xs uppercase tracking-widest">Live THC Results</span>
                    </div>
                    <button
                      onClick={() => {
                        const summary = `${recipeName || "My Recipe"}\n${thcPerServing.toFixed(1)}mg THC per serving\n${totalTHC.toFixed(0)}mg total batch\n${servings} servings\n\nCalculated with Infusion Sensei — infusionsensei.com`;
                        navigator.clipboard.writeText(summary);
                        trackEvent("recipe_copied", {
                          recipe_name: recipeName || "My Recipe",
                          servings,
                          thc_per_serving: Number(thcPerServing.toFixed(1)),
                        });
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="text-green-300 hover:text-white text-xs flex items-center gap-1 transition-colors"
                    >
                      {copied ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  {/* Big THC number */}
                  <div className="px-5 pb-4">
                    <div className="bg-white/10 rounded-2xl px-4 py-4 border border-white/20 text-center mb-3">
                      <div className="text-5xl font-black text-white leading-none">{thcPerServing.toFixed(1)}</div>
                      <div className="text-green-200 font-semibold text-sm mt-1">mg THC per serving</div>
                      <p className="text-green-200/75 text-[10px] leading-snug mt-2 px-1">
                        Infused rows list mg in your chosen unit plus an equivalent (e.g. mg/g ↔ mg/tbsp). Total batch mg stays the same when you switch units.
                      </p>
                      <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full border font-black text-xs ${dosingTier.bg} ${dosingTier.color}`}>
                        {dosingTier.label === "Microdose" ? "🔬" : dosingTier.label === "Low" ? "✅" : dosingTier.label === "Moderate" ? "⚡" : dosingTier.label === "High" ? "🔥" : "⚠️"}
                        {dosingTier.label.toUpperCase()}
                      </div>
                    </div>

                    {/* Secondary stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-white/10 rounded-xl p-2.5 text-center border border-white/20">
                        <div className="text-xl font-black text-white">{totalTHC.toFixed(0)}<span className="text-xs font-normal text-green-300">mg</span></div>
                        <div className="text-green-300 text-xs font-semibold uppercase mt-0.5">Total Batch</div>
                      </div>
                      <div className="bg-white/10 rounded-xl p-2.5 text-center border border-white/20">
                        <div className="text-xl font-black text-white">{servings}</div>
                        <div className="text-green-300 text-xs font-semibold uppercase mt-0.5">Servings</div>
                      </div>
                    </div>

                    {/* Infused ingredients */}
                    {infusedIngredients.length > 0 && (
                      <div className="bg-white/10 rounded-xl p-3 border border-white/20 mb-3">
                        <p className="text-green-300 text-xs font-bold uppercase tracking-wide mb-1.5">🧪 Infused</p>
                        {infusedIngredients.map((ing, i) => (
                          <div key={i} className="flex justify-between text-xs py-0.5">
                            <span className="text-green-100">{ing.name}</span>
                            <span className="text-white font-bold">{(ing.amount * (ing.thcPerUnit || 0)).toFixed(1)}mg</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Dosing reference */}
                    <div className="space-y-1">
                      {[
                        { label: "Microdose", range: "1–2.5mg", color: "text-blue-300" },
                        { label: "Low", range: "2.5–5mg", color: "text-green-300" },
                        { label: "Moderate", range: "5–15mg", color: "text-yellow-300" },
                        { label: "High", range: "15–30mg", color: "text-orange-300" },
                        { label: "Very High", range: "30mg+", color: "text-red-300" },
                      ].map(({ label, range, color }) => (
                        <div key={label} className={`flex justify-between text-xs px-2 py-1 rounded-lg transition-colors ${dosingTier.label === label ? "bg-white/20 font-bold" : "opacity-60"}`}>
                          <span className={color}>{label}</span>
                          <span className="text-white/70">{range}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action strip */}
                  <div className="bg-black/20 px-4 py-3 border-t border-white/10 grid grid-cols-2 gap-2">
                    {[
                      { key: "copy", icon: <Copy className="w-4 h-4" />, label: copied ? "Copied!" : "Copy", action: () => { const s = `${recipeName || "My Recipe"}\n${thcPerServing.toFixed(1)}mg THC per serving\n${totalTHC.toFixed(0)}mg total\n${servings} servings\n\ninfusionsensei.com`; navigator.clipboard.writeText(s); trackEvent("recipe_copied", { recipe_name: recipeName || "My Recipe", servings, thc_per_serving: Number(thcPerServing.toFixed(1)) }); setCopied(true); setTimeout(() => setCopied(false), 2000); } },
                      { key: "print", icon: <Printer className="w-4 h-4" />, label: "Print", action: () => runPrint("full") },
                      { key: "labels", icon: <LayoutGrid className="w-4 h-4" />, label: "Labels", action: () => runPrint("buffet") },
                      { key: "share", icon: <Share2 className="w-4 h-4" />, label: "Share", action: () => { if (navigator.share) navigator.share({ title: "Infusion Sensei", text: `${recipeName}: ${thcPerServing.toFixed(1)}mg THC per serving`, url: "https://infusionsensei.com" }); } },
                    ].map(({ key, icon, label, action }) => (
                      <button key={key} type="button" onClick={action}
                        className="flex flex-col items-center gap-1 bg-white/10 hover:bg-white/20 rounded-xl py-2 text-white transition-all border border-white/10">
                        {icon}
                        <span className="text-xs font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick nutrition summary */}
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                  <p className="font-bold text-gray-700 text-xs uppercase tracking-wide mb-3">📊 Nutrition Per Serving</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Calories", value: caloriesPerServing.toFixed(0), unit: "kcal" },
                      { label: "Carbs", value: carbsPerServing.toFixed(1), unit: "g" },
                      { label: "Fat", value: fatPerServing.toFixed(1), unit: "g" },
                      { label: "Protein", value: proteinPerServing.toFixed(1), unit: "g" },
                    ].map(({ label, value, unit }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-2.5 text-center">
                        <div className="text-xs text-gray-500">{label}</div>
                        <div className="font-black text-gray-900 text-base">{value}<span className="text-xs text-gray-400 ml-0.5">{unit}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>{/* end right column */}

          </div>{/* end two-column flex */}

        </div>{/* end screen-only */}
      </>
    );
  }

  return null;
}
