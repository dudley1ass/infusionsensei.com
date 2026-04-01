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
  { name: "Baking Powder",          category: "leavening",  defaultAmount: 1,   defaultUnit: "tsp",   calories: 53,  carbs: 27.7, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Baking Soda",            category: "leavening",  defaultAmount: 0.5, defaultUnit: "tsp",   calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Cream of Tartar",        category: "leavening",  defaultAmount: 3,   defaultUnit: "g",     calories: 218, carbs: 54.3, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Instant Yeast",          category: "leavening",  defaultAmount: 7,   defaultUnit: "g",     calories: 325, carbs: 40.7, protein: 40.4, fat: 7.6,  type: "powder" },
  { name: "Gelatin (unflavored)",   category: "leavening",  defaultAmount: 7,   defaultUnit: "g",     calories: 335, carbs: 0.0,  protein: 85.0, fat: 0.0,  type: "powder" },
  { name: "Red Food Coloring",      category: "leavening",  defaultAmount: 10,  defaultUnit: "ml",    calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "liquid" },

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
  { id: "snacks",          name: "🍿 Snacks & Candy",     emoji: "🍿", description: "Popcorn, gummies, protein bars" },
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

// Standard Recipe Templates (exported for Party Snacks grocery list & tooling)
export const standardRecipes: Record<string, any[]> = {
  "baked-goods": [
    {
      id: "brownies",
      name: "Classic Cannabis Brownies",
      servings: 16,
      ingredients: ["Cannabutter","Dark Chocolate Chips","Granulated Sugar","Brown Sugar (Light)","Whole Egg (large)","All-Purpose Flour","Cocoa Powder","Vanilla Extract","Salt"],
      amounts: [113,170,200,100,2,70,30,5,2],
      units: ["g","g","g","g","large","g","g","ml","g"],
      instructions: ["Preheat oven to 350°F (175°C). Grease a 9x13 inch baking pan.","Melt cannabutter and chocolate chips together — microwave in 30-second bursts, stirring between.","Whisk sugars into the chocolate mixture until combined.","Beat in eggs one at a time, then stir in vanilla.","Fold in flour, cocoa powder, and salt until just combined — don't overmix.","Pour into prepared pan and spread evenly.","Bake 25–30 minutes until a toothpick comes out with moist crumbs.","Cool completely before cutting into 16 pieces."],
    },
    {
      id: "chocolate-chip-cookies",
      name: "Cannabis Chocolate Chip Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Unsalted Butter","Granulated Sugar","Brown Sugar (Light)","Whole Egg (large)","All-Purpose Flour","Baking Soda","Salt","Dark Chocolate Chips","Vanilla Extract"],
      amounts: [57,57,100,220,2,280,1,3,340,5],
      units: ["g","g","g","g","large","g","tsp","g","g","ml"],
      instructions: ["Preheat oven to 375°F (190°C). Line baking sheets with parchment.","Beat both butters and sugars until light and fluffy.","Beat in eggs one at a time, then vanilla.","Whisk flour, baking soda, and salt — stir into butter mixture.","Fold in chocolate chips.","Drop rounded tablespoons 2 inches apart on baking sheet.","Bake 9–11 minutes until edges are golden. Centers will look underdone — that's right.","Cool on pan 5 minutes before transferring."],
    },
    {
      id: "sugar-cookies",
      name: "Cannabis Sugar Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","All-Purpose Flour","Baking Powder","Vanilla Extract","Salt"],
      amounts: [113,200,1,280,1,5,2],
      units: ["g","g","large","g","tsp","ml","g"],
      instructions: ["Beat cannabutter and sugar until fluffy.","Mix in egg and vanilla.","Combine flour, baking powder, and salt — stir into butter mixture.","Chill dough 1 hour in refrigerator.","Preheat oven to 375°F. Roll dough ¼ inch thick and cut into shapes.","Bake 8–10 minutes until edges are just set.","Cool before decorating."],
    },
    {
      id: "peanut-butter-cookies",
      name: "Infused Peanut Butter Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Peanut Butter","Granulated Sugar","Brown Sugar (Light)","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Soda","Salt"],
      amounts: [85,200,100,100,2,10,280,6,3],
      units: ["g","g","g","g","large","ml","g","g","g"],
      instructions: ["Preheat oven to 350°F; line baking sheets.","Beat cannabutter, peanut butter, and sugars until fluffy.","Beat in eggs and vanilla.","Fold in flour, baking soda, and salt.","Scoop rounds; press with fork if desired.","Bake 10–12 minutes until edges are set; cool on sheet."],
    },
    {
      id: "oatmeal-raisin-cookies",
      name: "Infused Oatmeal Raisin Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Brown Sugar (Light)","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Soda","Cinnamon","Salt","Rolled Oats","Raisins"],
      amounts: [113,150,80,2,8,180,4,4,3,200,120],
      units: ["g","g","g","large","ml","g","g","g","g","g","g"],
      instructions: ["Preheat oven to 350°F.","Cream cannabutter with sugars; beat in eggs and vanilla.","Whisk flour, baking soda, cinnamon, and salt; stir in oats.","Fold in raisins.","Drop 1.5–2 tbsp mounds; bake 10–12 minutes until golden."],
    },
    {
      id: "snickerdoodles",
      name: "Infused Snickerdoodles",
      servings: 24,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Cream of Tartar","Baking Soda","Salt","Cinnamon"],
      amounts: [113,350,2,10,340,8,4,3,10],
      units: ["g","g","large","ml","g","g","g","g","g"],
      instructions: ["Preheat oven to 375°F.","Mix 50g of the sugar with cinnamon for rolling.","Cream cannabutter with the rest of the sugar; beat in eggs and vanilla.","Fold in flour, cream of tartar, baking soda, and salt.","Roll balls in cinnamon sugar; bake 8–10 minutes until set with soft centers."],
    },
    {
      id: "double-chocolate-cookies",
      name: "Infused Double Chocolate Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Granulated Sugar","Brown Sugar (Light)","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Cocoa Powder","Baking Soda","Salt","Dark Chocolate Chips"],
      amounts: [113,120,150,2,8,220,40,5,3,300],
      units: ["g","g","g","large","ml","g","g","g","g","g"],
      instructions: ["Preheat oven to 350°F.","Melt half the cannabutter if you prefer fudgy dough — or cream softened cannabutter with sugars until fluffy.","Beat in eggs and vanilla.","Fold in flour, cocoa, baking soda, and salt; then chips.","Bake 9–11 minutes; cool briefly on sheet."],
    },
    {
      id: "white-chocolate-macadamia-cookies",
      name: "Infused White Chocolate Macadamia Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Brown Sugar (Light)","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Soda","Salt","White Chocolate Chips","Macadamia Nuts"],
      amounts: [113,180,100,2,8,280,4,3,200,120],
      units: ["g","g","g","large","ml","g","g","g","g","g"],
      instructions: ["Preheat oven to 350°F.","Beat cannabutter with sugars; add eggs and vanilla.","Fold in flour, baking soda, and salt.","Stir in white chocolate and macadamias.","Scoop and bake 10–12 minutes until edges are golden."],
    },
    {
      id: "shortbread-cookies",
      name: "Infused Shortbread Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Powdered Sugar","All-Purpose Flour","Salt","Vanilla Extract"],
      amounts: [227,80,300,2,8],
      units: ["g","g","g","g","ml"],
      instructions: ["Preheat oven to 325°F.","Beat cannabutter, powdered sugar, vanilla, and salt until smooth.","Fold in flour until just combined — don't overwork.","Press into pan or roll and cut; dock with fork.","Bake 18–22 minutes until pale golden at edges; cool before slicing or breaking."],
    },
    {
      id: "molasses-cookies",
      name: "Infused Molasses Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Granulated Sugar","Molasses","Whole Egg (large)","All-Purpose Flour","Baking Soda","Cinnamon","Ginger (ground)","Salt"],
      amounts: [113,200,80,1,340,8,6,4,3],
      units: ["g","g","g","large","g","g","g","g","g"],
      instructions: ["Preheat oven to 350°F.","Beat cannabutter with sugar and molasses; add egg.","Whisk flour, baking soda, spices, and salt; fold in.","Chill 30 minutes optional.","Roll balls, optionally roll in sugar; bake 8–10 minutes until crackled."],
    },
    {
      id: "gingerbread-cookies",
      name: "Infused Gingerbread Cookies",
      servings: 24,
      ingredients: ["Cannabutter","Brown Sugar (Light)","Molasses","Whole Egg (large)","All-Purpose Flour","Baking Soda","Ginger (ground)","Cinnamon","Cloves","Salt"],
      amounts: [113,120,80,1,400,6,8,6,2,3],
      units: ["g","g","g","large","g","g","g","g","g","g"],
      instructions: ["Beat cannabutter with brown sugar and molasses; add egg.","Mix flour, baking soda, spices, and salt; chill dough 1–2 hours.","Roll ¼ inch thick; cut shapes.","Bake at 350°F 8–12 minutes depending on size; cool before decorating."],
    },
    {
      id: "vanilla-layer-cake",
      name: "Infused Vanilla Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Powder","Salt","Whole Milk"],
      amounts: [227,400,4,15,400,12,4,360],
      units: ["g","g","large","ml","g","g","g","ml"],
      instructions: ["Preheat oven to 350°F; grease two 8–9 inch rounds or one 9x13.","Cream cannabutter and sugar until fluffy; beat in eggs and vanilla.","Alternate folding in flour mixture (flour, baking powder, salt) and milk in thirds.","Bake until a toothpick is clean — about 28–35 min for layers.","Cool completely before frosting. Portion 12 slices for even dosing."],
    },
    {
      id: "chocolate-layer-cake",
      name: "Infused Chocolate Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Cocoa Powder","Baking Powder","Baking Soda","Salt","Whole Milk"],
      amounts: [227,380,4,15,320,60,8,4,4,360],
      units: ["g","g","large","ml","g","g","g","g","g","ml"],
      instructions: ["Preheat oven to 350°F.","Cream cannabutter and sugar; beat in eggs and vanilla.","Whisk flour, cocoa, baking powder, baking soda, and salt.","Alternate dry mix and milk until smooth.","Bake in prepared pans until tests clean. Cool and slice 12 portions."],
    },
    {
      id: "red-velvet-cake",
      name: "Infused Red Velvet Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Cocoa Powder","Red Food Coloring","Vanilla Extract","Buttermilk","All-Purpose Flour","Baking Soda","Salt","White Vinegar"],
      amounts: [227,350,3,15,15,10,360,340,6,3,10],
      units: ["g","g","large","g","ml","ml","ml","g","g","g","ml"],
      instructions: ["Preheat oven to 350°F.","Cream cannabutter and sugar; beat in eggs.","Stir cocoa, food coloring, and vanilla into a paste; mix in.","Whisk flour, baking soda, and salt.","Alternate buttermilk and dry mix; finish by stirring in vinegar.","Bake until set; cool. Cut 12 even slices."],
    },
    {
      id: "carrot-cake",
      name: "Infused Carrot Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Brown Sugar (Light)","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Powder","Baking Soda","Cinnamon","Salt","Carrot (grated)","Walnuts (chopped)"],
      amounts: [200,200,100,3,10,280,8,4,8,3,300,80],
      units: ["g","g","g","large","ml","g","g","g","g","g","g","g"],
      instructions: ["Preheat oven to 350°F; grease a 9x13 or two rounds.","Beat cannabutter with sugars; add eggs and vanilla.","Fold in flour, leaveners, cinnamon, and salt; then carrots and walnuts.","Bake until center springs back; cool. Frost if desired. Cut 12 portions."],
    },
    {
      id: "lemon-cake",
      name: "Infused Lemon Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Powder","Salt","Lemon Juice","Lemon Zest","Whole Milk"],
      amounts: [200,350,4,10,340,12,3,45,10,180],
      units: ["g","g","large","ml","g","g","g","ml","g","ml"],
      instructions: ["Preheat oven to 350°F.","Cream cannabutter and sugar; beat in eggs and vanilla.","Whisk flour, baking powder, and salt.","Mix milk with lemon juice and zest.","Alternate wet and dry into batter; bake until golden and clean test. Slice 12."],
    },
    {
      id: "pound-cake",
      name: "Infused Pound Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Powder","Salt","Sour Cream"],
      amounts: [227,400,5,15,340,6,3,120],
      units: ["g","g","large","ml","g","g","g","g"],
      instructions: ["Preheat oven to 325°F; grease loaf or bundt.","Cream cannabutter and sugar 4–5 minutes until very fluffy.","Beat in eggs one at a time; add vanilla.","Fold in flour, baking powder, and salt; stir in sour cream until smooth.","Bake 60–75 min until deep golden; cool in pan 15 min. Slice 12."],
    },
    {
      id: "coffee-cake",
      name: "Infused Coffee Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Brown Sugar (Light)","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Powder","Baking Soda","Salt","Whole Milk","Espresso Powder","Cinnamon"],
      amounts: [170,200,100,2,10,340,10,2,3,240,8,8],
      units: ["g","g","g","large","ml","g","g","g","g","ml","g","g"],
      instructions: ["Preheat oven to 350°F; butter a 9x13.","Mix 50g flour, brown sugar, and cinnamon with fingertips until crumbly (add a spoon of plain melted butter from your pantry for the streusel if you like — not the infused portion).","Cream cannabutter with granulated sugar; beat eggs and vanilla.","Fold flour, baking powder, baking soda, salt, milk, and espresso until smooth.","Spread batter; top with streusel. Bake 35–45 min; cool; cut 12 squares."],
    },
    {
      id: "marble-cake",
      name: "Infused Marble Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Powder","Salt","Whole Milk","Cocoa Powder"],
      amounts: [227,380,4,15,380,12,4,300,35],
      units: ["g","g","large","ml","g","g","g","ml","g"],
      instructions: ["Preheat oven to 350°F.","Cream cannabutter and sugar; beat in eggs and vanilla.","Combine flour, baking powder, salt; alternate with milk — reserve ~⅓ batter.","Stir cocoa into reserved batter with a splash of milk.","Marble in pan; bake until tests clean. Slice 12."],
    },
    {
      id: "funfetti-cake",
      name: "Infused Funfetti Cake",
      servings: 12,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Powder","Salt","Whole Milk","Sprinkles"],
      amounts: [227,380,4,15,400,12,4,300,80],
      units: ["g","g","large","ml","g","g","g","ml","g"],
      instructions: ["Preheat oven to 350°F.","Cream cannabutter and sugar; beat in eggs and vanilla.","Fold in flour, baking powder, salt, and milk.","Fold sprinkles gently at end.","Bake in prepared pan until golden; cool. Slice 12 even pieces."],
    },
    {
      id: "chocolate-cupcakes",
      name: "Infused Chocolate Cupcakes",
      servings: 24,
      ingredients: ["Cannabutter","Granulated Sugar","Brown Sugar (Light)","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Cocoa Powder","Baking Powder","Baking Soda","Salt","Whole Milk"],
      amounts: [170,200,100,3,10,260,45,8,4,3,240],
      units: ["g","g","g","large","ml","g","g","g","g","g","ml"],
      instructions: ["Preheat oven to 350°F; line 24 cupcake wells.","Cream cannabutter with sugars; beat eggs and vanilla.","Whisk flour, cocoa, baking powder, baking soda, and salt.","Alternate dry and milk.","Fill ⅔ full; bake 18–22 min. Cool before frosting."],
    },
    {
      id: "peanut-butter-bars",
      name: "Infused Peanut Butter Bars",
      servings: 16,
      ingredients: ["Cannabutter","Peanut Butter","Powdered Sugar","Graham Cracker Crumbs","Vanilla Extract","Salt"],
      amounts: [115,200,200,150,5,2],
      units: ["g","g","g","g","ml","g"],
      instructions: ["Line 8x8 pan.","Melt cannabutter with peanut butter until smooth.","Stir in graham crumbs, powdered sugar, vanilla, and salt.","Press flat; chill 1 hour.","Cut 16 even bars; label mg per bar."],
    },
    {
      id: "lemon-bars",
      name: "Infused Lemon Bars",
      servings: 16,
      ingredients: ["Cannabutter","Granulated Sugar","All-Purpose Flour","Salt","Whole Egg (large)","Lemon Juice","Powdered Sugar","Baking Powder"],
      amounts: [170,100,200,2,4,120,40,4],
      units: ["g","g","g","g","large","ml","g","g"],
      instructions: ["Preheat oven to 350°F.","Crust: blend 2 tbsp sugar with flour, salt, and cannabutter until sandy; press in pan; bake 15 min.","Whisk eggs, remaining sugar, lemon juice, baking powder; pour over hot crust.","Bake 18–22 min until set; dust with powdered sugar when cool. Cut 16."],
    },
    {
      id: "cheesecake-bars",
      name: "Infused Cheesecake Bars",
      servings: 16,
      ingredients: ["Cannabutter","Graham Cracker Crumbs","Granulated Sugar","Cream Cheese","Whole Egg (large)","Vanilla Extract","Salt"],
      amounts: [85,180,40,450,2,10,2],
      units: ["g","g","g","g","large","ml","g"],
      instructions: ["Preheat oven to 325°F.","Mix graham crumbs, 1 tbsp sugar, and melted cannabutter; press in 8x8.","Beat cream cheese with sugar, eggs, vanilla, and salt until smooth.","Pour over crust; bake until edges set and center slightly jiggly. Chill; cut 16."],
    },
    {
      id: "magic-cookie-bars",
      name: "Infused Magic Cookie Bars (7-Layer)",
      servings: 16,
      ingredients: ["Cannabutter","Graham Cracker Crumbs","Sweetened Condensed Milk","Dark Chocolate Chips","White Chocolate Chips","Shredded Coconut","Walnuts (chopped)"],
      amounts: [115,180,400,120,80,80,60],
      units: ["g","g","ml","g","g","g","g"],
      instructions: ["Preheat oven to 350°F; line 9x13.","Mix graham crumbs and melted cannabutter; press into pan.","Pour condensed milk evenly.","Layer chocolates, coconut, walnuts; press lightly.","Bake 25–30 min until golden; cool fully. Cut 16 squares."],
    },
    {
      id: "chocolate-chip-cookie-bars",
      name: "Infused Chocolate Chip Cookie Bars",
      servings: 16,
      ingredients: ["Cannabutter","Brown Sugar (Light)","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Soda","Salt","Dark Chocolate Chips"],
      amounts: [170,200,100,2,10,280,6,3,320],
      units: ["g","g","g","large","ml","g","g","g","g"],
      instructions: ["Preheat oven to 350°F; line 9x13.","Cream cannabutter with sugars; beat eggs and vanilla.","Fold in flour, baking soda, and salt; stir chips.","Spread in pan; bake 22–28 min until golden. Cool; cut 16."],
    },
    {
      id: "brownie-cheesecake-swirl-bars",
      name: "Infused Brownie Cheesecake Swirl Bars",
      servings: 16,
      ingredients: ["Cannabutter","Dark Chocolate Chips","Granulated Sugar","Whole Egg (large)","Cocoa Powder","All-Purpose Flour","Salt","Cream Cheese","Powdered Sugar","Vanilla Extract"],
      amounts: [85,170,200,3,30,80,2,200,40,5],
      units: ["g","g","g","large","g","g","g","g","g","ml"],
      instructions: ["Preheat oven to 350°F; line 8x11 or 9x13.","Melt cannabutter with chocolate; whisk in half the sugar, 2 eggs, cocoa, flour, and salt for brownie layer.","Beat cream cheese with remaining sugar, 1 egg, and vanilla.","Pour brownie batter; dollop cheesecake; swirl.","Bake 28–35 min; cool; cut 16."],
    },
    {
      id: "smores-bars",
      name: "Infused S'mores Bars",
      servings: 16,
      ingredients: ["Cannabutter","Graham Cracker Crumbs","Granulated Sugar","Whole Egg (large)","All-Purpose Flour","Baking Powder","Salt","Milk Chocolate Chips","Marshmallows"],
      amounts: [115,200,100,1,120,4,2,200,150],
      units: ["g","g","g","large","g","g","g","g","g"],
      instructions: ["Preheat oven to 350°F; line pan.","Press ⅔ of graham–butter–sugar–egg–flour mix as base; bake 10 min.","Top with chocolate and marshmallows; crumble remaining dough on top.","Bake 15–20 min until marshmallows toast; cool completely. Cut 16."],
    },
  ],
  "wings": [
    {
      id: "classic-buffalo-wings",
      name: "Classic Buffalo Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Hot Sauce","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,56,120,3,3,2],
      units: ["g","g","ml","g","g","g"],
      instructions: ["Cook your wings however you like — oven (425°F/45 min), air fryer (400°F/20 min), or grill. We're here for the sauce.","While wings cook, melt cannabutter in a saucepan over low heat.","Whisk in hot sauce and garlic powder — don't let it boil.","Taste and adjust heat with more hot sauce if desired.","Toss hot wings in the infused buffalo sauce immediately before serving.","Serve with celery sticks and blue cheese or ranch."],
    },
    {
      id: "garlic-parmesan-wings",
      name: "Garlic Parmesan Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Garlic","Parmesan Cheese","Italian Seasoning","Salt"],
      amounts: [900,56,4,50,5,3],
      units: ["g","g","cloves","g","g","g"],
      instructions: ["Cook wings your way — oven (425°F/45 min), air fryer (400°F/20 min), or grill until crispy. We're here for the sauce.","Melt cannabutter in a pan over medium-low heat.","Add minced garlic and sauté 1-2 minutes until fragrant — don't let it brown.","Remove from heat and stir in Italian seasoning.","Toss wings in the garlic butter until fully coated.","Plate and finish with a generous shower of grated parmesan."],
    },
    {
      id: "honey-bbq-wings",
      name: "Honey BBQ Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Hot Sauce","Granulated Sugar","Garlic Powder","Salt"],
      amounts: [900,28,60,20,3,3],
      units: ["g","g","ml","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Melt cannabutter in saucepan over low heat.","Whisk in hot sauce, sugar, and garlic powder until smooth.","Simmer 2 minutes until slightly thickened.","Toss hot wings in honey BBQ sauce.","Serve immediately."],
    },
    {
      id: "teriyaki-wings",
      name: "Teriyaki Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Granulated Sugar","Garlic","Salt","Black Pepper"],
      amounts: [900,30,35,3,3,2],
      units: ["g","ml","g","cloves","g","g"],
      instructions: ["Cook wings your way until crispy. We're here for the sauce.","In a small pan, combine soy sauce, sugar, and minced garlic over low heat.","Stir until the sugar dissolves and the glaze starts to thicken slightly.","Remove from heat and whisk in cannabis coconut oil.","Toss hot wings in teriyaki glaze and serve immediately.","Top with sesame seeds and scallions if desired."],
    },
    {
      id: "nashville-hot-wings",
      name: "Nashville Hot Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Cayenne Pepper","Garlic Powder","Brown Sugar (Light)","Salt"],
      amounts: [900,60,10,3,15,3],
      units: ["g","ml","g","g","g","g"],
      instructions: ["Cook wings your way until very crispy. We're here for the sauce.","Warm cannabis coconut oil in saucepan over low heat.","Whisk in cayenne, garlic powder, and brown sugar.","Toss hot wings in Nashville hot oil immediately.","Serve over white bread with pickles."],
    },
    {
      id: "korean-gochujang-wings",
      name: "Korean Gochujang Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,30,3,3,2],
      units: ["g","ml","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Mix cannabis coconut oil with garlic powder.","Toss hot wings in the cannabis oil base.","Add gochujang paste, honey, and soy sauce to taste.","Top with sesame seeds and scallions."],
    },
    {
      id: "lemon-pepper-wings",
      name: "Lemon Pepper Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,56,3,3,5],
      units: ["g","g","g","g","g"],
      instructions: ["Cook wings your way until very crispy. We're here for the sauce.","Melt cannabutter in saucepan over low heat.","Stir in garlic powder and cracked black pepper.","Toss wings in lemon butter.","Finish with fresh lemon zest."],
    },
    {
      id: "mango-habanero-wings",
      name: "Mango Habanero Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,30,3,3,2],
      units: ["g","ml","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Blend mango, habanero, vinegar, and sugar into a smooth sauce.","Stir cannabis coconut oil into the sauce.","Toss hot wings in mango habanero sauce.","Garnish with cilantro and lime."],
    },
    {
      id: "cajun-butter-wings",
      name: "Cajun Butter Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Cajun Seasoning","Garlic Powder","Salt"],
      amounts: [900,56,8,3,2],
      units: ["g","g","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Melt cannabutter in saucepan over low heat.","Whisk in Cajun seasoning and garlic powder.","Toss hot wings in Cajun butter immediately.","Serve with ranch dipping sauce."],
    },
    {
      id: "truffle-butter-wings",
      name: "Truffle Butter Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Parmesan Cheese","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,56,30,3,2,2],
      units: ["g","g","g","g","g","g"],
      instructions: ["Cook wings your way until crispy. We're here for the sauce.","Melt cannabutter over low heat.","Stir in garlic powder.","Toss wings in garlic cannabutter.","Finish with parmesan and a drizzle of truffle oil if available."],
    },
    {
      id: "ranch-butter-wings",
      name: "Ranch Butter Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,56,3,3,2],
      units: ["g","g","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Melt cannabutter over low heat.","Stir in ranch seasoning packet.","Toss hot wings in ranch butter.","Serve with extra ranch dipping sauce."],
    },
    {
      id: "honey-mustard-wings",
      name: "Honey Mustard Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,30,3,3,2],
      units: ["g","ml","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Whisk cannabis oil, honey, and dijon mustard together.","Toss hot wings in honey mustard sauce.","Serve with extra sauce on the side."],
    },
    {
      id: "sriracha-honey-wings",
      name: "Sriracha Honey Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,30,3,3,2],
      units: ["g","ml","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Mix cannabis oil, sriracha, honey, and lime juice together.","Toss hot wings in sriracha honey sauce.","Garnish with sesame seeds."],
    },
    {
      id: "chili-crisp-wings",
      name: "Chili Crisp Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Garlic","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,30,3,3,3,2],
      units: ["g","ml","cloves","g","g","g"],
      instructions: ["Cook wings your way until crispy. We're here for the sauce.","Warm cannabis coconut oil over low heat.","Stir in minced garlic, chili crisp, and a pinch of garlic powder.","Toss hot wings in the chili crisp oil.","Finish with scallions and sesame if desired."],
    },
    {
      id: "maple-bacon-wings",
      name: "Maple Bacon Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Brown Sugar (Light)","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,42,25,3,3,2],
      units: ["g","g","g","g","g","g"],
      instructions: ["Cook wings your way until crispy. We're here for the sauce.","Melt cannabutter over low heat.","Whisk in maple syrup and brown sugar until glossy.","Add garlic powder and a pinch of pepper.","Toss hot wings in maple-bacon glaze and serve."],
    },
    {
      id: "brown-sugar-bourbon-wings",
      name: "Brown Sugar Bourbon Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabutter","Brown Sugar (Light)","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,42,30,3,3,2],
      units: ["g","g","g","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Melt cannabutter on low heat.","Add brown sugar and simmer until dissolved.","Stir in a splash of bourbon (optional) and garlic powder.","Toss wings in the glaze and serve immediately."],
    },
    {
      id: "pineapple-ginger-wings",
      name: "Pineapple Ginger Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Granulated Sugar","Garlic","Salt","Black Pepper"],
      amounts: [900,30,20,2,3,2],
      units: ["g","ml","g","cloves","g","g"],
      instructions: ["Cook wings your way until crisp. We're here for the sauce.","Mix pineapple juice, grated ginger, and sugar in a pan over low heat.","Reduce until slightly syrupy, then whisk in cannabis coconut oil.","Toss hot wings in pineapple-ginger glaze.","Serve with lime and scallions if desired."],
    },
    {
      id: "orange-glaze-wings",
      name: "Orange Glaze Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Granulated Sugar","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,30,20,3,3,2],
      units: ["g","ml","g","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Simmer orange juice and sugar until slightly thickened.","Whisk in cannabis coconut oil and garlic powder.","Toss hot wings in orange glaze.","Finish with orange zest and cracked pepper."],
    },
    {
      id: "garlic-soy-umami-wings",
      name: "Garlic Soy Umami Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Coconut Oil","Garlic","Garlic Powder","Salt","Black Pepper"],
      amounts: [900,30,4,2,3,2],
      units: ["g","ml","cloves","g","g","g"],
      instructions: ["Cook wings your way until crispy. We're here for the sauce.","Warm cannabis coconut oil and add minced garlic.","Stir in soy sauce, a touch of sugar, and black pepper.","Toss hot wings in garlic-soy glaze.","Top with scallions and sesame seeds if desired."],
    },
    {
      id: "chimichurri-wings",
      name: "Chimichurri Wings",
      servings: 4,
      ingredients: ["Chicken Wings","Cannabis Olive Oil","Garlic","Salt","Black Pepper","Italian Seasoning"],
      amounts: [900,30,3,3,2,5],
      units: ["g","ml","cloves","g","g","g"],
      instructions: ["Cook wings your way. We're here for the sauce.","Blend chopped parsley, garlic, vinegar, and herbs into chimichurri.","Whisk cannabis olive oil into the sauce off heat.","Toss hot wings in chimichurri right before serving.","Finish with extra herbs and flaky salt."],
    },
  ],
  "spreads-dips": [
    {
      id: "infused-peanut-butter-spread",
      name: "Infused Peanut Butter",
      servings: 16,
      ingredients: ["Peanut Butter","Cannabis Coconut Oil","Salt","Honey"],
      amounts: [240,15,2,12],
      units: ["g","ml","g","g"],
      instructions: ["Soften peanut butter until it stirs easily.","Fold in cannabis coconut oil until completely smooth with no streaks.","Stir in salt; add honey for sweetness if desired.","Pack into a labeled jar; refrigerate if you prefer it firmer."],
    },
    {
      id: "infused-almond-butter-spread",
      name: "Infused Almond Butter",
      servings: 16,
      ingredients: ["Almond Butter","Cannabis Coconut Oil","Salt","Cinnamon"],
      amounts: [240,15,2,1],
      units: ["g","ml","g","g"],
      instructions: ["Stir almond butter well if oil has separated.","Fold in cannabis coconut oil until uniform.","Add salt and cinnamon; mix thoroughly.","Store in a labeled container."],
    },
    {
      id: "infused-cream-cheese-whipped",
      name: "Whipped Infused Cream Cheese",
      servings: 8,
      ingredients: ["Cream Cheese","Cannabutter","Salt"],
      amounts: [226,28,2],
      units: ["g","g","g"],
      instructions: ["Soften cream cheese to room temperature.","Beat cream cheese with cannabutter until fluffy and smooth.","Season with salt; chill in a labeled dish."],
    },
    {
      id: "sweet-honey-cream-cheese-spread-infused",
      name: "Sweet Honey Cream Cheese (Infused)",
      servings: 10,
      ingredients: ["Cream Cheese","Cannabutter","Honey","Powdered Sugar","Vanilla Extract","Salt"],
      amounts: [200,30,35,40,5,1],
      units: ["g","g","g","g","ml","g"],
      instructions: ["Beat soft cream cheese with cannabutter until smooth.","Add honey, powdered sugar, vanilla, and salt; beat until fluffy.","Chill; serve with fruit or crackers — label the bowl."],
    },
    {
      id: "herb-garlic-cream-cheese-spread-infused",
      name: "Herb & Garlic Cream Cheese (Infused)",
      servings: 8,
      ingredients: ["Cream Cheese","Cannabutter","Garlic Powder","Italian Seasoning","Salt","Black Pepper"],
      amounts: [226,32,3,4,2,1],
      units: ["g","g","g","g","g","g"],
      instructions: ["Beat soft cream cheese with cannabutter until smooth.","Mix in garlic powder, Italian seasoning, salt, and pepper.","Refrigerate 30 minutes; label clearly before serving."],
    },
    {
      id: "queso-dip-infused",
      name: "Infused Queso Dip",
      servings: 8,
      ingredients: ["Cheddar Cheese","Whole Milk","Cornstarch","Cannabutter","Salt","Garlic Powder"],
      amounts: [220,300,18,40,4,2],
      units: ["g","ml","g","g","g","g"],
      instructions: ["Toss cheese with cornstarch.","Heat milk with cannabutter; add cheese gradually whisking until smooth.","Season; keep warm; label mg per oz."],
    },
    {
      id: "spinach-artichoke-dip-infused",
      name: "Spinach Artichoke Dip (Infused)",
      servings: 8,
      ingredients: ["Cream Cheese","Sour Cream","Cannabutter","Spinach (frozen)","Artichoke Hearts","Garlic Powder","Parmesan Cheese","Salt","Black Pepper"],
      amounts: [220,140,40,150,200,3,50,3,2],
      units: ["g","g","g","g","g","g","g","g","g"],
      instructions: ["Warm cream cheese, sour cream, and cannabutter until smooth.","Stir in spinach, artichokes, garlic, parmesan, salt, and pepper.","Bake at 375°F 20 minutes until bubbly. Label serving spoon."],
    },
    {
      id: "buffalo-dip-infused",
      name: "Buffalo Chicken Dip (Infused)",
      servings: 10,
      ingredients: ["Cream Cheese","Sour Cream","Hot Sauce","Cannabutter","Cheddar Cheese","Garlic Powder","Salt"],
      amounts: [200,120,80,35,120,2,2],
      units: ["g","g","ml","g","g","g","g"],
      instructions: ["Combine all ingredients in oven-safe dish.","Bake at 375°F until melted and bubbly; stir.","Serve with labeled chips/crackers on separate tray."],
    },
    {
      id: "ranch-dip-infused",
      name: "Ranch Dip (Infused)",
      servings: 8,
      ingredients: ["Sour Cream","Mayonnaise","Cannabis Olive Oil","Ranch Seasoning","Salt","Black Pepper"],
      amounts: [200,120,20,12,2,1],
      units: ["g","g","ml","g","g","g"],
      instructions: ["Whisk all ingredients until smooth.","Chill 30 minutes for flavor. Label bowl clearly."],
    },
    {
      id: "honey-mustard-dip-infused",
      name: "Honey Mustard Dip (Infused)",
      servings: 8,
      ingredients: ["Honey","Mustard (yellow)","Mayonnaise","Cannabis Olive Oil","Salt"],
      amounts: [90,45,120,18,1],
      units: ["g","ml","g","ml","g"],
      instructions: ["Whisk until emulsified.","Taste and adjust sweetness. Label infused dip."],
    },
    {
      id: "garlic-aioli-infused",
      name: "Garlic Aioli (Infused)",
      servings: 6,
      ingredients: ["Mayonnaise","Garlic","Lemon Juice","Cannabis Olive Oil","Salt","Black Pepper"],
      amounts: [180,3,15,22,2,1],
      units: ["g","cloves","ml","ml","g","g"],
      instructions: ["Whisk finely minced garlic with mayonnaise and lemon.","Slowly whisk in cannabis olive oil until smooth. Chill and label."],
    },
    {
      id: "bbq-sauce-infused-party",
      name: "BBQ Sauce (Infused)",
      servings: 12,
      ingredients: ["Ketchup","Brown Sugar (Light)","Apple Cider Vinegar","Cannabis Olive Oil","Garlic Powder","Salt","Black Pepper"],
      amounts: [240,80,30,25,4,4,2],
      units: ["ml","g","ml","ml","g","g","g"],
      instructions: ["Simmer all ingredients 10 minutes until slightly thickened. Cool.","Brush on proteins after cooking or serve as labeled dip."],
    },
    {
      id: "sweet-chili-sauce-infused",
      name: "Sweet Chili Sauce (Infused)",
      servings: 10,
      ingredients: ["Water","Granulated Sugar","Rice Vinegar","Garlic Powder","Cayenne Pepper","Cannabis Olive Oil","Salt"],
      amounts: [120,150,45,3,2,20,2],
      units: ["ml","g","ml","g","g","ml","g"],
      instructions: ["Simmer water and sugar until dissolved.","Add vinegar, garlic, cayenne, and salt; simmer 5 minutes.","Off heat, whisk in cannabis olive oil. Label."],
    },
    {
      id: "cheese-sauce-infused",
      name: "Cheese Sauce (Infused)",
      servings: 8,
      ingredients: ["Cheddar Cheese","Whole Milk","Cannabutter","Cornstarch","Salt"],
      amounts: [200,280,35,16,3],
      units: ["g","ml","g","g","g"],
      instructions: ["Toss cheese with cornstarch.","Warm milk and cannabutter; add cheese slowly whisking.","Use immediately on fries or nachos; label."],
    },
  ],
  "snacks": [
    {
      id: "garlic-butter-popcorn",
      name: "Garlic Butter Popcorn",
      servings: 4,
      ingredients: ["Popcorn Kernels","Cannabutter","Garlic Powder","Salt"],
      amounts: [100,42,3,2],
      units: ["g","g","g","g"],
      instructions: ["Pop popcorn using your preferred method — stovetop, air popper, or microwave.","Transfer popped corn to a large bowl.","Melt cannabutter in a small saucepan over low heat.","Stir garlic powder into the melted butter.","Drizzle butter over popcorn while tossing continuously.","Season with salt and toss until every kernel is coated."],
    },
    {
      id: "caramel-popcorn",
      name: "Caramel Popcorn",
      servings: 6,
      ingredients: ["Popcorn Kernels","Cannabutter","Brown Sugar (Light)","Corn Syrup","Baking Soda","Vanilla Extract"],
      amounts: [120,56,220,60,1,5],
      units: ["g","g","g","ml","tsp","ml"],
      instructions: ["Pop popcorn and spread on a parchment-lined baking sheet. Preheat oven to 250°F.","Melt cannabutter, add brown sugar and corn syrup. Boil 5 minutes without stirring.","Remove from heat, stir in baking soda and vanilla — it will foam.","Pour caramel over popcorn and toss quickly.","Bake 1 hour, stirring every 15 minutes.","Cool completely before breaking apart."],
    },
    {
      id: "buffalo-popcorn",
      name: "Buffalo Popcorn",
      servings: 4,
      ingredients: ["Popcorn Kernels","Cannabutter","Hot Sauce","Garlic Powder","Salt"],
      amounts: [100,42,30,2,2],
      units: ["g","g","ml","g","g"],
      instructions: ["Pop popcorn and transfer to a large bowl.","Melt cannabutter and whisk in hot sauce and garlic powder.","Drizzle buffalo butter over popcorn while tossing.","Season with salt and serve immediately."],
    },
    {
      id: "chocolate-drizzle-popcorn",
      name: "Chocolate Drizzle Popcorn",
      servings: 4,
      ingredients: ["Popcorn Kernels","Dark Chocolate Chips","Cannabis Coconut Oil","Salt"],
      amounts: [100,100,15,2],
      units: ["g","g","ml","g"],
      instructions: ["Pop popcorn and spread on a parchment-lined baking sheet.","Melt chocolate chips and cannabis coconut oil together.","Drizzle melted chocolate over popcorn.","Sprinkle with flaky salt. Refrigerate 15-20 minutes until set."],
    },
    {
      id: "gummies",
      name: "Cannabis Gummies",
      servings: 50,
      ingredients: ["THC Tincture","Gelatin (unflavored)","Flavored Jello Mix","Water","Corn Syrup"],
      amounts: [30,28,85,120,60],
      units: ["ml","g","g","ml","ml"],
      instructions: ["Follow the flavored gelatin / jello package (or manufacturer) instructions for water amounts, bloom times, and set times if they differ — we only add infusion and dosing below.","Combine gelatin, jello mix, and water in a small saucepan.","Let sit 5 minutes to bloom — do not stir yet.","Heat over low heat, stirring gently until fully dissolved.","Remove from heat and let cool 2 minutes.","Stir in corn syrup and THC tincture thoroughly.","Pour carefully into silicone gummy molds.","Refrigerate 2-3 hours until firm.","Pop out and store in an airtight container. Label with THC per piece."],
    },
    {
      id: "classic-jello-shots",
      name: "Classic Infused Jello Shots",
      servings: 24,
      ingredients: ["Flavored Jello Mix","Gelatin (unflavored)","Water","THC Tincture","Corn Syrup"],
      amounts: [85,14,360,24,30],
      units: ["g","g","ml","ml","ml"],
      instructions: ["Follow the flavored gelatin / jello package (or manufacturer) instructions for water amounts, bloom times, and set times if they differ — we only add infusion and dosing below.","Whisk flavored jello mix and unflavored gelatin together in a saucepan.","Add water and let bloom for 5 minutes.","Warm on low heat, stirring until fully dissolved — do not boil.","Remove from heat and cool 2 minutes.","Stir in THC tincture and corn syrup until uniform.","Pour into tray molds (24 portions).","Refrigerate 2-3 hours until set.","Label each cube with mg per piece before serving."],
    },
    {
      id: "fruit-juice-jello-cubes",
      name: "Fruit Juice Gel Cubes",
      servings: 24,
      ingredients: ["Flavored Jello Mix","Gelatin (unflavored)","Fruit Juice","THC Tincture","Granulated Sugar"],
      amounts: [85,14,300,20,20],
      units: ["g","g","ml","ml","g"],
      instructions: ["Follow the flavored gelatin / jello package (or manufacturer) instructions for liquid amounts, bloom times, and set times if they differ — we only add infusion and dosing below.","Mix jello powder, unflavored gelatin, and sugar in a saucepan.","Add juice (or water per your package) and bloom for 5 minutes.","Heat gently while whisking until smooth.","Remove from heat and stir in tincture.","Pour into a flat tray and chill until firm.","Cut into 24 equal cubes for consistent dosing."],
    },
    {
      id: "layered-jello-shots",
      name: "Layered Infused Jello",
      servings: 24,
      ingredients: ["Flavored Jello Mix","Gelatin (unflavored)","Water","Whole Milk","THC Tincture"],
      amounts: [85,14,320,80,24],
      units: ["g","g","ml","ml","ml"],
      instructions: ["Follow the flavored gelatin / jello package (or manufacturer) instructions for water amounts, bloom times, and set times if they differ — we only add infusion and dosing below.","Prepare first jello layer: dissolve half the mix and gelatin in hot water.","Pour half into tray and chill until just set.","Prepare second creamy layer using remaining mix, gelatin, and milk.","Stir in tincture after removing from heat.","Pour second layer on top and chill fully.","Cut into 24 equal cubes."],
    },
    {
      id: "sour-jello-bites",
      name: "Sour Infused Jello Bites",
      servings: 24,
      ingredients: ["Flavored Jello Mix","Gelatin (unflavored)","Water","THC Tincture","Corn Syrup"],
      amounts: [85,14,320,24,30],
      units: ["g","g","ml","ml","ml"],
      instructions: ["Follow the flavored gelatin / jello package (or manufacturer) instructions for water amounts, bloom times, and set times if they differ — we only add infusion and dosing below.","Combine jello mix, gelatin, and water in saucepan.","Bloom 5 minutes then heat gently until dissolved.","Remove from heat and stir in tincture and corn syrup.","Pour into silicone molds.","Refrigerate until firm.","Optional: dust lightly with citric acid + sugar blend for sour finish."],
    },
    {
      id: "rice-krispie-treat-squares",
      name: "Infused Rice Krispie Treat Squares",
      servings: 16,
      ingredients: ["Cannabutter","Marshmallows","Rice Cereal","Vanilla Extract","Salt"],
      amounts: [42,283,168,5,1],
      units: ["g","g","g","ml","g"],
      instructions: [
        "Classic ratio: 6 cups cereal · 10 oz marshmallows · 3 tbsp butter — cannabutter replaces the butter for infusion.",
        "Melt cannabutter over low heat.",
        "Stir in marshmallows until smooth.",
        "Add vanilla and salt.",
        "Remove from heat, fold in rice cereal until coated.",
        "Press into a parchment-lined pan and cool fully.",
        "Cut into equal squares for your serving count — one square ≈ one portion when planning by guests.",
      ],
    },
    {
      id: "popcorn-balls",
      name: "Infused Popcorn Balls",
      servings: 12,
      ingredients: ["Popcorn Kernels","Cannabutter","Corn Syrup","Granulated Sugar","Salt"],
      amounts: [120,42,120,100,2],
      units: ["g","g","ml","g","g"],
      instructions: ["Pop popcorn and place in a large bowl.","Heat cannabutter, corn syrup, sugar, and salt until dissolved.","Pour over popcorn and toss quickly.","When cool enough to touch, shape into 12 balls.","Set on parchment until firm."],
    },
    {
      id: "chocolate-dipped-pretzels",
      name: "Infused Chocolate-Dipped Pretzels",
      servings: 20,
      ingredients: ["Dark Chocolate Chips","Cannabis Coconut Oil","Pretzels","Salt"],
      amounts: [170,15,20,1],
      units: ["g","ml","pieces","g"],
      instructions: ["Melt chocolate chips with cannabis coconut oil.","Dip pretzels halfway and place on parchment.","Add salt or sprinkles.","Chill until set."],
    },
    {
      id: "mini-slider-sauce",
      name: "Mini Sliders (Infused Sauce Method)",
      servings: 12,
      ingredients: ["Cannabis Olive Oil","Mayonnaise","Granulated Sugar","Salt","Black Pepper"],
      amounts: [15,120,2,2,1],
      units: ["ml","g","g","g","g"],
      instructions: ["Whisk cannabis olive oil into mayo until smooth.","Season lightly with salt, pepper, and a touch of sugar.","Apply infused sauce only to the infused slider batch.","Label infused and non-infused trays clearly."],
    },
    {
      id: "mini-brownie-bites",
      name: "Mini Brownie Bites",
      servings: 24,
      ingredients: ["Cannabutter","Granulated Sugar","Whole Egg (large)","Cocoa Powder","All-Purpose Flour","Salt"],
      amounts: [56,180,2,40,70,2],
      units: ["g","g","large","g","g","g"],
      instructions: ["Preheat oven to 350°F and prep mini muffin tin.","Whisk melted cannabutter, sugar, and eggs.","Fold in cocoa, flour, and salt.","Portion into mini cavities.","Bake 14-18 minutes and cool fully.","Serve as 24 equal bites."],
    },
    {
      id: "blondie-squares",
      name: "Infused Blondie Squares",
      servings: 16,
      ingredients: ["Cannabutter","Brown Sugar (Light)","Granulated Sugar","Whole Egg (large)","Vanilla Extract","All-Purpose Flour","Baking Powder","Salt"],
      amounts: [113,220,80,2,8,200,6,3],
      units: ["g","g","g","large","ml","g","g","g"],
      instructions: ["Preheat oven to 350°F and line an 8x8 pan.","Melt cannabutter and whisk with sugars until smooth.","Beat in eggs and vanilla.","Fold in flour, baking powder, and salt.","Bake 22–28 minutes until edges are golden and center is just set.","Cool fully and cut into 16 squares. Label mg per square."],
    },
    {
      id: "marshmallow-pops",
      name: "Infused Marshmallow Pops",
      servings: 12,
      ingredients: ["Marshmallows","Cannabutter","Dark Chocolate Chips","Cannabis Coconut Oil","Sprinkles"],
      amounts: [240,28,170,15,20],
      units: ["g","g","g","ml","g"],
      instructions: ["Skewer marshmallows on sticks.","Brush very lightly with melted cannabutter or dip base for hold.","Melt chocolate with cannabis coconut oil.","Dip or drizzle marshmallows and add sprinkles before set.","Chill until firm. Label each pop."],
    },
    {
      id: "mini-cupcakes-infused-frosting",
      name: "Mini Cupcakes (Infused Frosting)",
      servings: 24,
      ingredients: ["All-Purpose Flour","Granulated Sugar","Baking Powder","Salt","Whole Egg (large)","Whole Milk","Unsalted Butter","Cream Cheese","Cannabutter","Powdered Sugar","Vanilla Extract"],
      amounts: [200,160,8,2,2,120,85,200,56,220,8],
      units: ["g","g","g","g","large","ml","g","g","g","g","ml"],
      instructions: ["Cream butter and sugar; beat in eggs and milk; fold flour mix.","Bake in mini cupcake pan at 350°F until springy.","Beat cream cheese, cannabutter, powdered sugar, and vanilla for frosting.","Pipe ONLY on infused batch; label clearly."],
    },
    {
      id: "cookie-sandwiches-infused-filling",
      name: "Cookie Sandwiches (Infused Filling)",
      servings: 12,
      ingredients: ["All-Purpose Flour","Granulated Sugar","Unsalted Butter","Whole Egg (large)","Vanilla Extract","Baking Soda","Salt","Cannabutter","Powdered Sugar"],
      amounts: [250,180,115,1,8,5,3,56,140],
      units: ["g","g","g","large","ml","g","g","g","g"],
      instructions: ["Make cookies: cream butter and sugar, beat egg and vanilla, fold dry ingredients.","Chill dough 20 min; scoop small rounds and bake at 350°F until edges set.","Filling: whip cannabutter with powdered sugar until smooth.","Sandwich cooled cookies with infused filling; label tray."],
    },
    {
      id: "churro-bites",
      name: "Churro Bites (Infused Cinnamon Sugar)",
      servings: 20,
      ingredients: ["Water","Unsalted Butter","Granulated Sugar","Salt","All-Purpose Flour","Whole Egg (large)","Vegetable Oil","Cinnamon","Cannabis Coconut Oil"],
      amounts: [240,56,15,3,150,2,120,10,20],
      units: ["ml","g","g","g","g","large","ml","g","ml"],
      instructions: ["Boil water, butter, sugar, and salt; stir in flour off heat until a ball forms.","Cool slightly; beat in egg.","Pipe small bites into hot oil (about 350°F) and fry until golden.","Toss in cinnamon sugar mixed with cannabis coconut oil while warm. Label portions."],
    },
    {
      id: "funnel-cake-bites",
      name: "Funnel Cake Bites",
      servings: 18,
      ingredients: ["All-Purpose Flour","Baking Powder","Salt","Granulated Sugar","Whole Egg (large)","Whole Milk","Vanilla Extract","Vegetable Oil","Powdered Sugar","Cannabis Coconut Oil"],
      amounts: [200,8,2,30,1,240,5,120,40,20],
      units: ["g","g","g","g","large","ml","ml","ml","g","ml"],
      instructions: ["Whisk dry ingredients; whisk wet separately; combine to smooth batter.","Drop small ribbons into 350°F oil; fry until golden and drain.","Dust with powdered sugar and drizzle thinned cannabis coconut oil. Serve as 18 portions."],
    },
    {
      id: "chex-mix-infused",
      name: "Infused Chex Mix",
      servings: 10,
      ingredients: ["Chex Cereal","Pretzels","Mixed Nuts","Cannabutter","Worcestershire Sauce","Garlic Powder","Salt"],
      amounts: [200,15,80,60,30,4,3],
      units: ["g","pieces","g","g","ml","g","g"],
      instructions: ["Toss cereal, pretzels, and nuts in a large bowl.","Melt cannabutter with Worcestershire and garlic powder; toss to coat evenly.","Bake at 250°F for 1 hour, stirring every 15 minutes.","Cool and label as infused."],
    },
    {
      id: "infused-nuts",
      name: "Infused Mixed Nuts",
      servings: 8,
      ingredients: ["Mixed Nuts","Cannabutter","Granulated Sugar","Salt","Cinnamon"],
      amounts: [200,45,20,2,2],
      units: ["g","g","g","g","g"],
      instructions: ["Warm cannabutter with sugar, salt, and cinnamon.","Toss nuts until coated.","Roast at 300°F for 12–15 minutes, stirring once.","Cool completely; portion into 8 bags or cups."],
    },
    {
      id: "kettle-corn-infused",
      name: "Infused Kettle Corn",
      servings: 8,
      ingredients: ["Popcorn Kernels","Cannabutter","Granulated Sugar","Salt"],
      amounts: [110,45,40,2],
      units: ["g","g","g","g"],
      instructions: ["Heat pot with oil as usual for popping; add kernels and sugar carefully.","Shake until popping slows.","Toss hot popcorn with melted cannabutter and salt. Label bowls."],
    },
    {
      id: "snack-mix-party",
      name: "Party Snack Mix (Pretzels + Cereal + Chips-style)",
      servings: 12,
      ingredients: ["Chex Cereal","Pretzels","Mixed Nuts","Popcorn Kernels","Cannabutter","Garlic Powder","Italian Seasoning","Salt"],
      amounts: [150,12,60,80,55,4,3,2],
      units: ["g","pieces","g","g","g","g","g","g"],
      instructions: ["Pop popcorn; combine with cereal, pretzels, and nuts.","Toss with melted cannabutter, garlic, Italian seasoning, and salt.","Bake at 250°F for 45 minutes, stirring occasionally. Cool; label."],
    },
    {
      id: "cheese-crackers-infused-dust",
      name: "Cheese Crackers (Infused Dust)",
      servings: 10,
      ingredients: ["Cheese Crackers","Cannabutter","Parmesan Cheese","Garlic Powder","Salt"],
      amounts: [40,35,40,3,1],
      units: ["pieces","g","g","g","g"],
      instructions: ["Melt cannabutter and stir in parmesan, garlic powder, and salt.","Toss crackers gently or brush lightly; bake at 300°F 8–10 minutes.","Cool; store airtight; label infused tray."],
    },
    {
      id: "garlic-parmesan-pretzels",
      name: "Garlic Parmesan Pretzels",
      servings: 12,
      ingredients: ["Pretzels","Cannabutter","Garlic Powder","Parmesan Cheese","Salt"],
      amounts: [24,50,5,50,2],
      units: ["pieces","g","g","g","g"],
      instructions: ["Warm cannabutter with garlic powder.","Toss pretzels to coat; sprinkle parmesan and salt.","Bake at 325°F for 8 minutes. Label portions."],
    },
    {
      id: "chicken-tenders-infused-dip",
      name: "Chicken Tenders (Infused Dip)",
      servings: 6,
      ingredients: ["Chicken Tenders","All-Purpose Flour","Whole Egg (large)","Panko Breadcrumbs","Salt","Black Pepper","Mayonnaise","Cannabis Olive Oil","Hot Sauce","Garlic Powder"],
      amounts: [600,80,2,120,4,2,150,20,40,2],
      units: ["g","g","large","g","g","g","g","ml","ml","g"],
      instructions: ["Bread tenders: flour, egg wash, panko; bake or air-fry until 165°F internal.","Whisk mayo, cannabis olive oil, hot sauce, and garlic for dip.","Serve infused dip only on labeled platter."],
    },
    {
      id: "meatballs-infused-glaze",
      name: "Meatballs (Infused Glaze)",
      servings: 24,
      ingredients: ["Ground Beef","Whole Egg (large)","Panko Breadcrumbs","Garlic","Italian Seasoning","Salt","Black Pepper","Ketchup","Brown Sugar (Light)","Cannabis Olive Oil"],
      amounts: [680,1,90,3,8,6,3,120,50,20],
      units: ["g","large","g","cloves","g","g","g","ml","g","ml"],
      instructions: ["Mix meatball base; roll 24 balls; bake at 400°F until cooked through.","Simmer glaze ingredients 5 minutes; toss meatballs in glaze. Label tray."],
    },
    {
      id: "sausage-bites-honey-mustard",
      name: "Sausage Bites (Infused Honey Mustard)",
      servings: 12,
      ingredients: ["Cocktail Sausages","Honey","Mustard (yellow)","Cannabis Olive Oil","Salt"],
      amounts: [24,50,40,15,1],
      units: ["pieces","g","ml","ml","g"],
      instructions: ["Bake or sear sausages until hot.","Whisk honey, mustard, cannabis olive oil, and salt.","Serve sauce on the side; label infused sauce bowl."],
    },
    {
      id: "mini-hot-dogs-infused-condiments",
      name: "Mini Hot Dogs (Infused Ketchup / Mustard)",
      servings: 12,
      ingredients: ["Hot Dogs","Ketchup","Mustard (yellow)","Mayonnaise","Cannabis Olive Oil","Salt"],
      amounts: [12,80,40,60,18,1],
      units: ["pieces","ml","ml","g","ml","g"],
      instructions: ["Warm hot dogs.","Split condiments: mix cannabis olive oil into ONE labeled infused sauce trio (or single infused base).","Build dogs for infused batch only; label."],
    },
    {
      id: "queso-dip-infused",
      name: "Infused Queso Dip",
      servings: 8,
      ingredients: ["Cheddar Cheese","Whole Milk","Cornstarch","Cannabutter","Salt","Garlic Powder"],
      amounts: [220,300,18,40,4,2],
      units: ["g","ml","g","g","g","g"],
      instructions: ["Toss cheese with cornstarch.","Heat milk with cannabutter; add cheese gradually whisking until smooth.","Season; keep warm; label mg per oz."],
    },
    {
      id: "spinach-artichoke-dip-infused",
      name: "Spinach Artichoke Dip (Infused)",
      servings: 8,
      ingredients: ["Cream Cheese","Sour Cream","Cannabutter","Spinach (frozen)","Artichoke Hearts","Garlic Powder","Parmesan Cheese","Salt","Black Pepper"],
      amounts: [220,140,40,150,200,3,50,3,2],
      units: ["g","g","g","g","g","g","g","g","g"],
      instructions: ["Warm cream cheese, sour cream, and cannabutter until smooth.","Stir in spinach, artichokes, garlic, parmesan, salt, and pepper.","Bake at 375°F 20 minutes until bubbly. Label serving spoon."],
    },
    {
      id: "buffalo-dip-infused",
      name: "Buffalo Chicken Dip (Infused)",
      servings: 10,
      ingredients: ["Cream Cheese","Sour Cream","Hot Sauce","Cannabutter","Cheddar Cheese","Garlic Powder","Salt"],
      amounts: [200,120,80,35,120,2,2],
      units: ["g","g","ml","g","g","g","g"],
      instructions: ["Combine all ingredients in oven-safe dish.","Bake at 375°F until melted and bubbly; stir.","Serve with labeled chips/crackers on separate tray."],
    },
    {
      id: "ranch-dip-infused",
      name: "Ranch Dip (Infused)",
      servings: 8,
      ingredients: ["Sour Cream","Mayonnaise","Cannabis Olive Oil","Ranch Seasoning","Salt","Black Pepper"],
      amounts: [200,120,20,12,2,1],
      units: ["g","g","ml","g","g","g"],
      instructions: ["Whisk all ingredients until smooth.","Chill 30 minutes for flavor. Label bowl clearly."],
    },
    {
      id: "honey-mustard-dip-infused",
      name: "Honey Mustard Dip (Infused)",
      servings: 8,
      ingredients: ["Honey","Mustard (yellow)","Mayonnaise","Cannabis Olive Oil","Salt"],
      amounts: [90,45,120,18,1],
      units: ["g","ml","g","ml","g"],
      instructions: ["Whisk until emulsified.","Taste and adjust sweetness. Label infused dip."],
    },
    {
      id: "garlic-aioli-infused",
      name: "Garlic Aioli (Infused)",
      servings: 6,
      ingredients: ["Mayonnaise","Garlic","Lemon Juice","Cannabis Olive Oil","Salt","Black Pepper"],
      amounts: [180,3,15,22,2,1],
      units: ["g","cloves","ml","ml","g","g"],
      instructions: ["Whisk finely minced garlic with mayonnaise and lemon.","Slowly whisk in cannabis olive oil until smooth. Chill and label."],
    },
    {
      id: "bbq-sauce-infused-party",
      name: "BBQ Sauce (Infused)",
      servings: 12,
      ingredients: ["Ketchup","Brown Sugar (Light)","Apple Cider Vinegar","Cannabis Olive Oil","Garlic Powder","Salt","Black Pepper"],
      amounts: [240,80,30,25,4,4,2],
      units: ["ml","g","ml","ml","g","g","g"],
      instructions: ["Simmer all ingredients 10 minutes until slightly thickened. Cool.","Brush on proteins after cooking or serve as labeled dip."],
    },
    {
      id: "sweet-chili-sauce-infused",
      name: "Sweet Chili Sauce (Infused)",
      servings: 10,
      ingredients: ["Water","Granulated Sugar","Rice Vinegar","Garlic Powder","Cayenne Pepper","Cannabis Olive Oil","Salt"],
      amounts: [120,150,45,3,2,20,2],
      units: ["ml","g","ml","g","g","ml","g"],
      instructions: ["Simmer water and sugar until dissolved.","Add vinegar, garlic, cayenne, and salt; simmer 5 minutes.","Off heat, whisk in cannabis olive oil. Label."],
    },
    {
      id: "cheese-sauce-infused",
      name: "Cheese Sauce (Infused)",
      servings: 8,
      ingredients: ["Cheddar Cheese","Whole Milk","Cannabutter","Cornstarch","Salt"],
      amounts: [200,280,35,16,3],
      units: ["g","ml","g","g","g"],
      instructions: ["Toss cheese with cornstarch.","Warm milk and cannabutter; add cheese slowly whisking.","Use immediately on fries or nachos; label."],
    },
    {
      id: "gummy-clusters",
      name: "Infused Gummy Clusters",
      servings: 32,
      ingredients: ["THC Tincture","Gelatin (unflavored)","Flavored Jello Mix","Water","Corn Syrup","Dark Chocolate Chips","Cannabis Coconut Oil"],
      amounts: [18,18,85,120,30,100,15],
      units: ["ml","g","g","ml","ml","g","ml"],
      instructions: ["Make gummy base; bloom, dissolve, stir in tincture, mold into irregular chunks.","Chill until set.","Toss clusters in melted chocolate with cannabis coconut oil; chill. Label mg."],
    },
    {
      id: "chocolate-bark-infused",
      name: "Infused Chocolate Bark",
      servings: 16,
      ingredients: ["Dark Chocolate Chips","Cannabis Coconut Oil","Salt","Sprinkles"],
      amounts: [300,22,2,25],
      units: ["g","ml","g","g"],
      instructions: ["Melt chocolate with cannabis coconut oil slowly.","Spread thin on parchment; top with salt and sprinkles.","Break into 16 pieces once set."],
    },
    {
      id: "candy-coated-popcorn",
      name: "Candy-Coated Popcorn",
      servings: 10,
      ingredients: ["Popcorn Kernels","Granulated Sugar","Water","Corn Syrup","Cannabutter","Vanilla Extract","Salt"],
      amounts: [100,200,60,60,40,5,2],
      units: ["g","g","ml","ml","g","ml","g"],
      instructions: ["Pop popcorn into a huge bowl.","Boil sugar, water, and syrup to soft candy stage; stir in cannabutter, vanilla, salt.","Pour over popcorn and toss fast; cool and break apart. Label."],
    },
    {
      id: "skewered-snack-bites-party",
      name: "Skewered Snack Bites (Mix + Match)",
      servings: 12,
      ingredients: ["Marshmallows","Pretzels","Dark Chocolate Chips","Cannabis Coconut Oil"],
      amounts: [120,24,150,20],
      units: ["g","pieces","g","ml"],
      instructions: ["Melt chocolate with cannabis coconut oil.","Thread marshmallows, pretzels, or other soft snacks on picks.","Drizzle or dip; set on parchment. Label skewers as infused."],
    },
    {
      id: "classic-gummies",
      name: "Classic Infused Gummies",
      servings: 40,
      ingredients: ["THC Tincture","Gelatin (unflavored)","Flavored Jello Mix","Water","Corn Syrup"],
      amounts: [20,20,85,120,30],
      units: ["ml","g","g","ml","ml"],
      instructions: ["Combine gelatin and jello with water and bloom 5 minutes.","Warm on low until dissolved.","Stir in tincture and corn syrup off heat.","Pour into molds and refrigerate until firm."],
    },
    {
      id: "fruit-gummies",
      name: "Fruit Juice Gummies",
      servings: 40,
      ingredients: ["THC Tincture","Gelatin (unflavored)","Flavored Jello Mix","Fruit Juice","Cannabis Honey"],
      amounts: [16,20,85,120,20],
      units: ["ml","g","g","ml","g"],
      instructions: ["Bloom gelatin and jello in water.","Warm until smooth, then remove from heat.","Stir in tincture and honey.","Mold and chill 2 hours."],
    },
    {
      id: "sour-gummies",
      name: "Sour Infused Gummies",
      servings: 40,
      ingredients: ["THC Tincture","Gelatin (unflavored)","Flavored Jello Mix","Water","Corn Syrup"],
      amounts: [20,20,85,120,30],
      units: ["ml","g","g","ml","ml"],
      instructions: ["Prepare gelatin base over low heat.","Mix in tincture and corn syrup off heat.","Fill molds and chill until set.","Coat lightly in sour sugar blend before serving."],
    },
    {
      id: "protein-bites",
      name: "Infused Protein Bites",
      servings: 12,
      ingredients: ["Protein Powder","Rolled Oats","Nut Butter","Cannabis Honey","Dark Chocolate Chips"],
      amounts: [60,100,120,60,60],
      units: ["g","g","g","g","g"],
      instructions: ["Mix all ingredients together in a large bowl until fully combined.","Chill mixture 30 minutes in the refrigerator.","Roll into 1-inch balls (about 12 total).","Store in an airtight container in the fridge for up to 1 week.","Label clearly with THC content per bite."],
    },
  ],
  "drinks": [
    {
      id: "bulletproof-coffee",
      name: "Bulletproof THC Coffee",
      servings: 1,
      ingredients: ["Cannabis Coconut Oil","Cannabutter","Whole Milk","Granulated Sugar"],
      amounts: [15,14,240,0],
      units: ["ml","g","ml","g"],
      instructions: ["Brew 1 cup of strong coffee — French press or espresso works best.","Add hot coffee, cannabutter, and cannabis coconut oil to a blender.","Blend 20-30 seconds until frothy and creamy.","Pour and serve immediately."],
    },
    {
      id: "cannabis-smoothie",
      name: "Cannabis Protein Smoothie",
      servings: 1,
      ingredients: ["Cannabis Coconut Oil","Protein Powder","Whole Milk","Granulated Sugar"],
      amounts: [15,30,240,15],
      units: ["ml","g","ml","g"],
      instructions: ["Add all ingredients to a blender.","Add 1 cup ice and your choice of fruit.","Blend on high until smooth.","Pour and drink immediately."],
    },
    {
      id: "cannabis-tea",
      name: "Infused Cannabis Tea",
      servings: 1,
      ingredients: ["Cannabis Coconut Oil","Whole Milk","Granulated Sugar"],
      amounts: [15,30,10],
      units: ["ml","ml","g"],
      instructions: ["Brew your favorite tea — black, green, or herbal.","Add cannabis coconut oil and a splash of milk.","Stir vigorously or use a frother to emulsify the oil.","Add sugar or honey to taste."],
    },
  ],
  "savory-meals": [
    {
      id: "alfredo",
      name: "Cannabis Alfredo Sauce",
      servings: 4,
      ingredients: ["Cannabutter","Heavy Cream","Parmesan Cheese","Garlic","Salt","Black Pepper"],
      amounts: [56,480,100,3,3,2],
      units: ["g","ml","g","cloves","g","g"],
      instructions: ["In a pan, melt cannabutter over medium-low heat.","Add minced garlic and sauté for 1 minute until fragrant.","Pour in heavy cream and bring to a gentle simmer.","Reduce heat and stir in freshly grated parmesan until melted and smooth.","Season with salt and pepper to taste.","Toss immediately with cooked pasta and serve."],
    },
    {
      id: "garlic-pasta",
      name: "Garlic Infused Pasta",
      servings: 2,
      ingredients: ["Pasta (dry)","Cannabis Olive Oil","Olive Oil","Garlic","Salt","Black Pepper"],
      amounts: [170,15,15,3,3,1],
      units: ["g","ml","ml","cloves","g","g"],
      instructions: ["Cook pasta according to package directions until al dente.","In a pan, heat both oils over medium-low heat.","Add minced garlic and sauté until fragrant, about 1-2 minutes.","Drain pasta, reserving ¼ cup pasta water.","Add pasta to pan with garlic oil, toss to coat.","Season with salt and pepper and serve immediately."],
    },
    {
      id: "steak",
      name: "THC Garlic Butter Steak",
      servings: 2,
      ingredients: ["Steak","Cannabutter","Unsalted Butter","Garlic","Salt","Black Pepper"],
      amounts: [2,14,28,2,3,2],
      units: ["whole","g","g","cloves","g","g"],
      instructions: ["Remove steaks from fridge 30 minutes before cooking.","Season generously with salt and pepper on both sides.","Heat a cast iron pan over high heat until very hot.","Cook steaks 3-4 minutes per side for medium-rare.","Reduce heat to low, add both butters and garlic.","Baste steaks continuously with the butter for 1 minute.","Rest steaks 5 minutes before serving, spoon butter over top."],
    },
  ],
  "ice-cream": [
    {
      id: "vanilla-ice-cream",
      name: "Infused Vanilla Ice Cream",
      servings: 6,
      ingredients: ["Heavy Cream","Whole Milk","Granulated Sugar","Vanilla Extract","Cannabis Coconut Oil"],
      amounts: [480,240,150,5,30],
      units: ["ml","ml","g","ml","ml"],
      instructions: ["In a saucepan, combine cream, milk, and sugar over medium heat.","Stir until sugar fully dissolves — do not let it boil.","Remove from heat and stir in vanilla and cannabis coconut oil.","Whisk thoroughly to fully incorporate the oil.","Chill mixture in refrigerator for at least 2 hours or overnight.","Churn in an ice cream maker according to manufacturer instructions.","Transfer to freezer-safe container and freeze 2 hours before serving."],
    },
    {
      id: "mint-ice-cream",
      name: "Cannabis Mint Chip Ice Cream",
      servings: 6,
      ingredients: ["Heavy Cream","Whole Milk","Granulated Sugar","Cannabis Coconut Oil","Dark Chocolate Chips","Peppermint Extract"],
      amounts: [480,240,150,30,100,5],
      units: ["ml","ml","g","ml","g","ml"],
      instructions: ["Combine cream, milk, and sugar in saucepan over medium heat until sugar dissolves.","Remove from heat, stir in cannabis coconut oil and peppermint extract to taste.","Chill overnight.","Churn in ice cream maker.","Add chocolate chips in last 2 minutes of churning.","Freeze 2 hours before serving."],
    },
  ],
  "breads-breakfast": [
    {
      id: "banana-bread",
      name: "Cannabis Banana Bread",
      servings: 12,
      ingredients: ["Cannabutter","Banana (mashed)","Granulated Sugar","All-Purpose Flour","Whole Egg (large)","Baking Soda"],
      amounts: [113,360,200,280,2,1],
      units: ["g","g","g","g","large","tsp"],
      instructions: ["Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.","Mash 3 ripe bananas in a large bowl.","Mix in melted cannabutter, eggs, and sugar until combined.","Add flour and baking soda, fold until just combined — don't overmix.","Pour into prepared loaf pan.","Bake 60-65 minutes until a toothpick inserted in center comes out clean.","Cool in pan 10 minutes, then turn out onto a wire rack."],
    },
    {
      id: "pancakes",
      name: "Infused Pancakes",
      servings: 4,
      ingredients: ["All-Purpose Flour","Granulated Sugar","Baking Powder","Whole Milk","Whole Egg (large)","Cannabutter"],
      amounts: [140,15,2,180,1,30],
      units: ["g","g","tsp","ml","large","g"],
      instructions: ["Whisk flour, sugar, and baking powder together in a bowl.","In another bowl, whisk milk and egg together.","Melt cannabutter and stir into wet ingredients.","Pour wet into dry and mix until just combined — lumps are fine.","Heat a non-stick skillet over medium heat, lightly grease.","Pour ¼ cup batter per pancake.","Cook until bubbles form and edges look set, about 2 minutes.","Flip and cook 1-2 minutes more until golden."],
    },
  ],
};

const toTitleFromId = (value: string) =>
  value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const formatSnackAliasName = (sourceId: string) => {
  const baseName = toTitleFromId(sourceId);
  return `${baseName} - Popcorn, Chex Mix, or Nuts (you chose what to coat)`;
};

const ensureAliasTemplates = (
  categoryId: string,
  map: Record<string, string>,
  fallbackTemplateId: string,
  nameResolver?: (sourceId: string) => string
) => {
  const categoryRecipes = standardRecipes[categoryId] ?? [];
  const byId = new Map(categoryRecipes.map((r) => [r.id, r]));
  const fallbackTemplate = byId.get(fallbackTemplateId);
  if (!fallbackTemplate) return;

  Object.entries(map).forEach(([sourceId, builderTemplateId]) => {
    if (byId.has(sourceId)) return;
    const base = byId.get(builderTemplateId) ?? fallbackTemplate;
    if (!base) return;
    const aliasRecipe = {
      ...base,
      id: sourceId,
      name: nameResolver ? nameResolver(sourceId) : toTitleFromId(sourceId),
      instructions: [
        `Built from ${base.name} template for ${toTitleFromId(sourceId)}.`,
        ...base.instructions,
      ],
    };
    categoryRecipes.push(aliasRecipe);
    byId.set(sourceId, aliasRecipe);
  });

  standardRecipes[categoryId] = categoryRecipes;
};

// Ensure Create Recipe lists all routable IDs used by pages.
ensureAliasTemplates("wings", WING_SAUCE_TO_BUILDER_RECIPE, "classic-buffalo-wings");
ensureAliasTemplates("snacks", POPCORN_TO_BUILDER_RECIPE, "garlic-butter-popcorn", formatSnackAliasName);
ensureAliasTemplates("drinks", COFFEE_TO_BUILDER_RECIPE, "bulletproof-coffee");
ensureAliasTemplates("spreads-dips", SPREADS_DIPS_TO_BUILDER_RECIPE, "spinach-artichoke-dip-infused");


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
        setRecipeName(recipe.name);
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
    // Ingredient-specific grams per cup (powder/solid densities vary widely)
    const gramsPerCup: Record<string, number> = {
      "All-Purpose Flour": 125, "Cake Flour": 114, "Bread Flour": 127,
      "Whole Wheat Flour": 120, "Almond Flour": 96, "Oat Flour": 92,
      "Rice Flour": 158, "Coconut Flour": 112, "Buckwheat Flour": 120,
      "Cornstarch": 128, "Tapioca Starch": 152,
      "Cocoa Powder": 100,
      "Cocoa Powder (Natural)": 100, "Dutch Cocoa Powder": 100,
      "Granulated Sugar": 200, "Brown Sugar (Light)": 220, "Brown Sugar (Dark)": 220,
      "Powdered Sugar": 120, "Coconut Sugar": 180, "Raw Turbinado Sugar": 200,
      "Rolled Oats": 90, "Protein Powder": 120,
      "Unsalted Butter": 227, "Salted Butter": 227, "Cannabutter": 227,
      "Shortening": 190, "Peanut Butter": 258, "Almond Butter": 250,
    };
    switch (unit) {
      case "g":       return amount;
      case "kg":      return amount * 1000;
      case "ml":      return amount; // ml ≈ g for water-based liquids
      case "L":       return amount * 1000;
      case "oz":      return amount * 28.3495;
      case "lb":      return amount * 453.592;
      case "cups":    return amount * (gramsPerCup[ingName] ?? 240);
      case "tbsp":    return amount * (gramsPerCup[ingName] ? gramsPerCup[ingName] / 16 : 14.787);
      case "tsp":     return amount * (gramsPerCup[ingName] ? gramsPerCup[ingName] / 48 : 4.929);
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

  // ── Per-ingredient warnings (cookie-science ratio engine) ──
  const getIngredientWarning = (ing: Ingredient, _servings: number) => {
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
    const leavener = totals['leavener'] ?? 0;
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

    let warning = '';
    let color = '';

    // Only run baking-science warnings for structural flour (not cornstarch-thickened sauces)
    if (!hasStructuralBakingFlour(ingredients)) return { warning, color };

    // High liquid ratio is expected for batters (pancakes/waffles/crepes), not brownies
    const isHighLiquidRecipe = isPancakeStyle && totalMoisture > flour * 0.8;

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

    if (cat === 'fat') {
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

    if (cat === 'sugar') {
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

    if (cat === 'leavener') {
      const leavenerToFlour = leavener / Math.max(flour, 1);
      // Standard: 1 tsp (5g) per 125g flour = 0.04
      // Pancakes/quick breads use 1.5-2x more leavening — only warn at >3x normal
      const leavenerWarn = isCakeStyle ? 0.1 : 0.08;
      if (leavenerToFlour > 0.12) {
        warning = 'Too much leavener — baked goods will taste bitter and soapy. Typical is 1 tsp per cup of flour.';
        color = 'red';
      } else if (leavenerToFlour > leavenerWarn) {
        warning = 'Leavener is on the high side — may cause excessive puffing. Fine for pancakes, but watch it for cakes.';
        color = 'yellow';
      }
    }

    return { warning, color };
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
    const leavener = totals['leavener'] ?? 0;
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
    const isSavoryStyle = selectedCategory === "wings" || selectedCategory === "spreads-dips" || selectedCategory === "savory-meals";
    const isDrinkStyle = selectedCategory === "drinks";

    const structuralFlour = hasStructuralBakingFlour(ingredients);

    // High liquid intentional recipes (pancakes, waffles, crepes, batters)
    const isHighLiquidRecipe = structuralFlour && isPancakeStyle && totalMoisture > flour * 0.8;

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
        headline: '🥞 Batter Recipe',
        description: 'High liquid ratio detected — this is expected for pancakes, waffles, or crepe-style batters. Ratios look correct.',
        tags: [...tags, { label: 'Batter', color: 'blue' }, { label: 'Balanced', color: 'green' }],
        severity: 'good',
        styleLabel: 'Batter',
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

    const leavenerWarnRatio = isCakeStyle ? 0.1 : 0.08;
    if (leavenerRatio > 0.12)   { issues.push('leavener is very high — may taste bitter or soapy'); tags.push({ label: 'Too much leavener', color: 'red' }); severity = 'problem'; }
    else if (leavenerRatio > leavenerWarnRatio) { issues.push('leavener is elevated — fine for pancakes/quick breads, watch for cakes'); tags.push({ label: 'High leavener', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

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

    // Grams per cup lookup - covers all ingredient names in the library
    const gramsPerCup: Record<string, number> = {
      // Flours
      "All-Purpose Flour": 125, "Cake Flour": 114, "Bread Flour": 127,
      "Whole Wheat Flour": 120, "Almond Flour": 96, "Oat Flour": 92,
      "Rice Flour": 158, "Coconut Flour": 112, "Buckwheat Flour": 120,
      "Cornstarch": 128, "Tapioca Starch": 152,
      "Cocoa Powder (Natural)": 100, "Dutch Cocoa Powder": 100, "Cocoa Powder": 100,
      "Espresso Powder": 85, "Matcha Powder": 85, "Graham Cracker Crumbs": 90, "Cornmeal": 157,
      // Sugars
      "Granulated Sugar": 200, "Sugar": 200,
      "Brown Sugar (Light)": 220, "Brown Sugar (Dark)": 220, "Brown Sugar": 220,
      "Powdered Sugar": 120, "Raw Turbinado Sugar": 200, "Coconut Sugar": 180,
      "Monk Fruit Sweetener": 200,
      // Fats (solid)
      "Unsalted Butter": 227, "Salted Butter": 227, "Brown Butter": 227,
      "Vegan Butter": 227, "Shortening": 190, "Butter (Regular)": 227,
      "Cannabutter": 227,
      // Leavening/other powders
      "Baking Powder": 192, "Baking Soda": 220, "Cream of Tartar": 150,
      "Instant Yeast": 150, "Gelatin (unflavored)": 150, "Gelatin": 150,
      "Flavored Jello Mix": 85, "Xanthan Gum": 190, "Poppy Seeds": 145,
      "Sprinkles": 190,
      // Oats/grains
      "Rolled Oats": 90, "Quinoa": 170, "Protein Powder": 120,
      // Spices (per tsp, handled separately but fallback)
      "Salt": 273, "Black Pepper": 100, "Cinnamon": 125, "Nutmeg": 100,
    };

    // Convert all ingredient amounts and units based on ingredient type
    const convertedIngredients = ingredients.map(ing => {
      const lookupKey = ingredientLibraryKey(ing);
      const libraryItem = INGREDIENT_LIBRARY.find(i => i.name === lookupKey);
      const ingredientType = libraryItem?.type || ing.type || "solid";

      // For infused ingredients: convert units BUT recalculate thcPerUnit to maintain same total THC
      if (ing.isInfused) {
        if (newSystem === "imperial") {
          // g → tbsp (butter/fat infusions)
          if (ing.unit === "g") {
            const tbsp = ing.amount / 14.175;
            const rounded = Math.round(tbsp * 2) / 2; // round to 0.5 tbsp
            const newThcPerUnit = (ing.thcPerUnit || 0) * 14.175; // mg/g → mg/tbsp
            return { ...ing, amount: rounded, unit: "tbsp", thcPerUnit: parseFloat(newThcPerUnit.toFixed(2)) };
          }
          // ml → tbsp (liquid infusions)
          if (ing.unit === "ml") {
            const tbsp = ing.amount / 14.787;
            const rounded = Math.round(tbsp * 2) / 2;
            const newThcPerUnit = (ing.thcPerUnit || 0) * 14.787;
            return { ...ing, amount: rounded, unit: "tbsp", thcPerUnit: parseFloat(newThcPerUnit.toFixed(2)) };
          }
        } else {
          // tbsp → g
          if (ing.unit === "tbsp") {
            const grams = ing.amount * 14.175;
            const newThcPerUnit = (ing.thcPerUnit || 0) / 14.175;
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g", thcPerUnit: parseFloat(newThcPerUnit.toFixed(4)) };
          }
          // tbsp → ml (liquids)
          if (ing.unit === "tbsp") {
            const ml = ing.amount * 14.787;
            const newThcPerUnit = (ing.thcPerUnit || 0) / 14.787;
            return { ...ing, amount: parseFloat(ml.toFixed(1)), unit: "ml", thcPerUnit: parseFloat(newThcPerUnit.toFixed(4)) };
          }
        }
        return ing;
      }

      // Skip items that don't use g or ml (count, squeeze, packet, dropper, etc.)
      const skipUnits = ["large", "medium", "small", "whole", "pieces", "cloves", "squeeze", "packet", "dropper", "0.1ml", "tsp", "tbsp", "cups"];
      if (skipUnits.includes(ing.unit)) return ing;

      if (newSystem === "imperial") {
        // METRIC TO IMPERIAL
        if (ing.unit === "g") {
          if (ingredientType === "powder") {
            const gPerCup = gramsPerCup[lookupKey] || 120;
            const cups = ing.amount / gPerCup;
            if (cups >= 0.25) {
              const formattedCups = formatCups(cups);
              return { ...ing, amount: formattedCups.amount, unit: formattedCups.unit };
            } else {
              const tbsp = cups * 16;
              const rounded = roundToCommonMeasurement(Math.max(tbsp, 0.5), "tbsp");
              return { ...ing, amount: rounded.amount, unit: rounded.unit };
            }
          } else if (ingredientType === "fat") {
            const gPerCup = gramsPerCup[lookupKey] || 227;
            const cups = ing.amount / gPerCup;
            if (cups >= 0.25) {
              const formattedCups = formatCups(cups);
              return { ...ing, amount: formattedCups.amount, unit: formattedCups.unit };
            } else {
              const tbsp = cups * 16;
              const rounded = roundToCommonMeasurement(Math.max(tbsp, 0.5), "tbsp");
              return { ...ing, amount: rounded.amount, unit: rounded.unit };
            }
          } else {
            // solid, semi-solid, count → oz
            const oz = ing.amount * 0.035274;
            const rounded = roundToCommonMeasurement(Math.max(oz, 0.5), "oz");
            return { ...ing, amount: rounded.amount, unit: rounded.unit };
          }
        }
        else if (ing.unit === "ml") {
          const flOz = ing.amount / 29.5735;
          if (flOz >= 8) {
            const cups = flOz / 8;
            const rounded = roundToCommonMeasurement(cups, "cups");
            return { ...ing, amount: rounded.amount, unit: rounded.unit };
          } else if (flOz >= 2) {
            const rounded = roundToCommonMeasurement(flOz, "fl oz");
            return { ...ing, amount: rounded.amount, unit: rounded.unit };
          } else if (ing.amount >= 15) {
            const tbsp = ing.amount / 14.7868;
            const rounded = roundToCommonMeasurement(tbsp, "tbsp");
            return { ...ing, amount: rounded.amount, unit: rounded.unit };
          } else {
            const tsp = ing.amount / 4.9289;
            const rounded = roundToCommonMeasurement(Math.max(tsp, 0.25), "tsp");
            return { ...ing, amount: rounded.amount, unit: rounded.unit };
          }
        }
      } else {
        // IMPERIAL TO METRIC
        if (ing.unit === "cups") {
          if (ingredientType === "powder" || ingredientType === "fat") {
            const gPerCup = gramsPerCup[lookupKey] || 227;
            const grams = ing.amount * gPerCup;
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g" };
          } else {
            return { ...ing, amount: parseFloat((ing.amount * 240).toFixed(1)), unit: "ml" };
          }
        }
        else if (ing.unit === "tbsp") {
          if (ingredientType === "powder" || ingredientType === "fat") {
            const gPerCup = gramsPerCup[lookupKey] || 120;
            const grams = ing.amount * (gPerCup / 16);
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g" };
          } else {
            return { ...ing, amount: parseFloat((ing.amount * 14.7868).toFixed(1)), unit: "ml" };
          }
        }
        else if (ing.unit === "tsp") {
          if (ingredientType === "powder") {
            const gPerCup = gramsPerCup[lookupKey] || 120;
            const grams = ing.amount * (gPerCup / 48);
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g" };
          } else {
            return { ...ing, amount: parseFloat((ing.amount * 4.9289).toFixed(1)), unit: "ml" };
          }
        }
        else if (ing.unit === "oz") {
          return { ...ing, amount: parseFloat((ing.amount / 0.035274).toFixed(1)), unit: "g" };
        }
        else if (ing.unit === "fl oz") {
          return { ...ing, amount: parseFloat((ing.amount * 29.5735).toFixed(1)), unit: "ml" };
        }
      }
      return ing;
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
                              <h4 className="font-bold text-gray-900">{recipe.name}</h4>
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

        {/* Recipe cards — horizontal list */}
        {categoryRecipes.length > 0 && (
          <div className="space-y-3">
            {categoryRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => { setRecipeType("standard"); setSelectedStandardRecipe(recipe.id); trackEvent('recipe_selected', {recipe_name: recipe.name}); }}
                className="w-full bg-white border-2 border-gray-200 hover:border-green-500 hover:shadow-md rounded-2xl p-4 text-left transition-all group flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:bg-green-200 transition-colors">
                  {category?.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-black text-gray-900 text-base">{recipe.name}</div>
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
        ? (standardRecipes[selectedCategory] || []).find((r) => r.id === selectedStandardRecipe)?.name
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
          <div className="flex gap-6 items-start">

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
                const warning = getIngredientWarning(ing, servings);
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
                      <Select value={ing.unit} onValueChange={(v) => updateIngredient(idx, "unit", v)}>
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
                      {ing.isInfused && (
                        <>
                          <Badge className="bg-purple-100 text-purple-700 border-0 text-xs px-2 no-print">🧪 THC</Badge>
                          <Input type="number" value={ing.thcPerUnit || 0}
                            onChange={(e) => updateIngredient(idx, "thcPerUnit", parseFloat(e.target.value) || 0)}
                            placeholder="mg/unit" className="w-20 bg-purple-50 border-purple-200 text-gray-900 h-9 text-sm no-print" />
                          <span className="text-xs text-purple-600 no-print">mg/{ing.unit}</span>
                        </>
                      )}
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
            <div className="w-80 flex-shrink-0 hidden lg:block no-print">
              <div className="sticky top-24 space-y-4">

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
