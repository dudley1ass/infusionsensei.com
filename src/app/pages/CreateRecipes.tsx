import { useState, useEffect } from "react";
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
  Calculator,
  ArrowLeftRight
} from "lucide-react";
import { InfusionBase } from "../types/infusion";
import { NutritionFactsLabel } from "../components/NutritionFactsLabel";
import { unitToGrams } from "../utils/nutritionCalculator";

// Common ingredient library
const INGREDIENT_LIBRARY = [
  // ── INFUSED (Cannabis) ──────────────────────────────────────────
  { name: "Cannabutter",                          category: "infused",    defaultAmount: 113, defaultUnit: "g",       thcPerUnit: 10,  calories: 717, carbs: 0,   protein: 1,   fat: 81,  type: "fat" },
  { name: "Cannabis Coconut Oil",                 category: "infused",    defaultAmount: 60,  defaultUnit: "ml",      thcPerUnit: 15,  calories: 862, carbs: 0,   protein: 0,   fat: 100, type: "liquid" },
  { name: "Cannabis Olive Oil",                   category: "infused",    defaultAmount: 60,  defaultUnit: "ml",      thcPerUnit: 12,  calories: 884, carbs: 0,   protein: 0,   fat: 100, type: "liquid" },
  { name: "THC Tincture",                         category: "infused",    defaultAmount: 1,   defaultUnit: "ml",      thcPerUnit: 25,  calories: 7,   carbs: 0,   protein: 0,   fat: 0,   type: "liquid" },
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
  { name: "Egg Yolk",               category: "egg",        defaultAmount: 40,  defaultUnit: "g",     calories: 322, carbs: 3.6,  protein: 15.9, fat: 26.5, type: "count" },
  { name: "Egg White",              category: "egg",        defaultAmount: 60,  defaultUnit: "g",     calories: 52,  carbs: 0.7,  protein: 10.9, fat: 0.2,  type: "count" },
  { name: "Flax Egg",               category: "egg",        defaultAmount: 45,  defaultUnit: "g",     calories: 37,  carbs: 2.8,  protein: 2.0,  fat: 2.5,  type: "semi-solid" },

  // ── LEAVENING ───────────────────────────────────────────────────
  { name: "Baking Powder",          category: "leavening",  defaultAmount: 8,   defaultUnit: "g",     calories: 53,  carbs: 27.7, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Baking Soda",            category: "leavening",  defaultAmount: 4,   defaultUnit: "g",     calories: 0,   carbs: 0.0,  protein: 0.0,  fat: 0.0,  type: "powder" },
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
  { name: "Rosemary",               category: "spice",      defaultAmount: 2,   defaultUnit: "g",     calories: 331, carbs: 64.1, protein: 4.9,  fat: 15.2, type: "powder" },
  { name: "Xanthan Gum",            category: "spice",      defaultAmount: 3,   defaultUnit: "g",     calories: 333, carbs: 83.3, protein: 0.0,  fat: 0.0,  type: "powder" },
  { name: "Poppy Seeds",            category: "spice",      defaultAmount: 20,  defaultUnit: "g",     calories: 525, carbs: 28.1, protein: 17.9, fat: 41.6, type: "solid" },
  { name: "Sprinkles",              category: "spice",      defaultAmount: 20,  defaultUnit: "g",     calories: 396, carbs: 96.4, protein: 0.0,  fat: 3.6,  type: "solid" },

  // ── FILLINGS & SPREADS ──────────────────────────────────────────
  { name: "Peanut Butter",          category: "filling",    defaultAmount: 80,  defaultUnit: "g",     calories: 588, carbs: 19.6, protein: 25.1, fat: 50.4, type: "semi-solid" },
  { name: "Almond Butter",          category: "filling",    defaultAmount: 80,  defaultUnit: "g",     calories: 614, carbs: 18.8, protein: 21.2, fat: 55.5, type: "semi-solid" },
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
  { name: "Pasta (dry)",            category: "savory",     defaultAmount: 454, defaultUnit: "g",     calories: 371, carbs: 74.0, protein: 13.0, fat: 2.0,  type: "solid" },
  { name: "Steak",                  category: "savory",     defaultAmount: 2,   defaultUnit: "pieces",calories: 271, carbs: 0.0,  protein: 25.0, fat: 19.0, type: "count" },
  { name: "Protein Powder",         category: "savory",     defaultAmount: 30,  defaultUnit: "g",     calories: 120, carbs: 3.0,  protein: 24.0, fat: 1.5,  type: "powder" },
  { name: "Rolled Oats",            category: "savory",     defaultAmount: 200, defaultUnit: "g",     calories: 389, carbs: 66.0, protein: 17.0, fat: 7.0,  type: "powder" },
  { name: "Flavored Jello Mix",     category: "savory",     defaultAmount: 85,  defaultUnit: "g",     calories: 310, carbs: 77.0, protein: 7.0,  fat: 0.0,  type: "powder" },
];

// Recipe Categories
const recipeCategories = [
  { id: "baked-goods", name: "🍪 Baked Goods", emoji: "🍪", description: "Cookies, brownies, cakes" },
  { id: "candy-gummies", name: "🍬 Candy & Gummies", emoji: "🍬", description: "Gummies, hard candy, chocolates" },
  { id: "drinks", name: "🥤 Drinks", emoji: "🥤", description: "Beverages, smoothies, cocktails" },
  { id: "ice-cream", name: "🍨 Ice Cream & Frozen", emoji: "🍨", description: "Ice cream, popsicles" },
  { id: "protein-snacks", name: "💪 Protein & Snacks", emoji: "💪", description: "Protein bars, energy bites" },
  { id: "savory-meals", name: "🍝 Savory & Meals", emoji: "🍝", description: "Pasta, pizza, proteins" },
  { id: "breads-breakfast", name: "🍞 Breads & Breakfast", emoji: "🍞", description: "Muffins, pancakes, breakfast" },
];

// Standard Recipe Templates
const standardRecipes: Record<string, any[]> = {
  "baked-goods": [
    {
      id: "brownies",
      name: "Classic Cannabis Brownies",
      servings: 16,
      ingredients: ["Cannabutter", "Granulated Sugar", "Cocoa Powder (Natural)", "All-Purpose Flour", "Whole Egg (large)", "Vanilla Extract"],
      amounts: [113, 200, 65, 130, 3, 5],
      instructions: [
        "Preheat oven to 350°F (175°C). Grease a 9x9 inch baking pan.",
        "Melt cannabutter in microwave or double boiler.",
        "Mix sugar and melted cannabutter in a large bowl.",
        "Beat in eggs one at a time, then add vanilla.",
        "Combine cocoa powder and flour, then fold into wet ingredients.",
        "Pour into prepared pan and bake for 20-25 minutes.",
        "Cool completely before cutting into 16 squares.",
      ],
    },
    {
      id: "cookies",
      name: "Chocolate Chip Cannabis Cookies",
      servings: 24,
      ingredients: ["Cannabutter", "Brown Sugar (Light)", "Granulated Sugar", "All-Purpose Flour", "Whole Egg (large)", "Dark Chocolate Chips", "Vanilla Extract"],
      amounts: [113, 220, 100, 280, 2, 340, 5],
      instructions: [
        "Preheat oven to 375°F (190°C).",
        "Cream together cannabutter and both sugars until fluffy.",
        "Beat in eggs and vanilla extract.",
        "Gradually mix in flour until just combined.",
        "Fold in chocolate chips.",
        "Drop rounded tablespoons onto baking sheet.",
        "Bake 9-11 minutes until edges are golden.",
      ],
    },
  ],
  "drinks": [
    {
      id: "smoothie",
      name: "Berry Cannabis Smoothie",
      servings: 1,
      ingredients: ["Cannabis Coconut Oil", "Fresh Raspberries", "Banana (mashed)", "Greek Yogurt", "Almond Milk", "Honey"],
      amounts: [10, 150, 120, 170, 240, 15],
      instructions: [
        "Add all ingredients to blender.",
        "Blend on high for 30-60 seconds until smooth.",
        "Add ice if desired.",
        "Pour into glass and serve immediately.",
      ],
    },
    {
      id: "lemonade",
      name: "THC Lemonade",
      servings: 1,
      ingredients: ["Water", "THC Tincture", "Granulated Sugar", "Lemon Juice"],
      amounts: [240, 2, 30, 30],
      instructions: [
        "Add water to a glass.",
        "Stir in sugar until dissolved.",
        "Add lemon juice and stir.",
        "Add THC tincture and stir thoroughly.",
        "Add ice and serve cold.",
      ],
    },
    {
      id: "coffee",
      name: "Infused Coffee",
      servings: 1,
      ingredients: ["Coffee (brewed)", "Cannabutter", "Heavy Cream"],
      amounts: [240, 5, 15],
      instructions: [
        "Brew 8 oz of hot coffee.",
        "Add cannabutter to hot coffee.",
        "Add cream if desired.",
        "Blend or stir well until butter is fully dissolved.",
        "Serve hot.",
      ],
    },
  ],
  "savory-meals": [
    {
      id: "alfredo",
      name: "Cannabis Alfredo Sauce",
      servings: 4,
      ingredients: ["Cannabutter", "Heavy Cream", "Mascarpone", "Garlic", "Salt", "Black Pepper"],
      amounts: [56, 480, 100, 3, 3, 2],
      instructions: [
        "In a pan, melt cannabutter over medium heat.",
        "Add minced garlic and sauté for 1 minute.",
        "Pour in heavy cream and simmer gently.",
        "Stir in mascarpone until melted and smooth.",
        "Season with salt and pepper.",
        "Toss with cooked pasta.",
      ],
    },
    {
      id: "garlic-pasta",
      name: "Garlic Infused Pasta",
      servings: 2,
      ingredients: ["Pasta (dry)", "Cannabis Olive Oil", "Olive Oil", "Garlic", "Salt", "Black Pepper"],
      amounts: [170, 15, 15, 2, 2, 1],
      instructions: [
        "Cook pasta according to package directions.",
        "In a pan, heat both oils over medium heat.",
        "Add minced garlic and sauté until fragrant (1-2 minutes).",
        "Drain pasta and add to pan with garlic oil.",
        "Toss pasta in the oil mixture.",
        "Season with salt and pepper.",
        "Serve immediately.",
      ],
    },
    {
      id: "steak",
      name: "THC Garlic Butter Steak",
      servings: 2,
      ingredients: ["Steak", "Cannabutter", "Unsalted Butter", "Garlic", "Salt", "Black Pepper"],
      amounts: [2, 15, 15, 2, 3, 2],
      instructions: [
        "Season steaks with salt and pepper.",
        "Cook steaks in a hot pan to desired doneness.",
        "In a small pan, melt both butters over low heat.",
        "Add minced garlic to butter and cook for 1 minute.",
        "Remove from heat and let cannabutter mixture cool slightly.",
        "Pour garlic butter over cooked steaks.",
        "Let rest for 5 minutes before serving.",
      ],
    },
  ],
  "breads-breakfast": [
    {
      id: "banana-bread",
      name: "Cannabis Banana Bread",
      servings: 12,
      ingredients: ["Cannabutter", "Banana (mashed)", "Granulated Sugar", "All-Purpose Flour", "Whole Egg (large)", "Baking Soda"],
      amounts: [113, 360, 200, 280, 2, 5],
      instructions: [
        "Preheat oven to 350°F (175°C).",
        "Mash bananas in a large bowl.",
        "Mix in melted cannabutter, eggs, and sugar.",
        "Fold in flour and baking soda.",
        "Pour into greased 9x5 loaf pan.",
        "Bake 60-65 minutes until toothpick comes out clean.",
      ],
    },
    {
      id: "pancakes",
      name: "Infused Pancakes",
      servings: 4,
      ingredients: ["All-Purpose Flour", "Granulated Sugar", "Baking Powder", "Whole Milk", "Whole Egg (large)", "Cannabutter"],
      amounts: [140, 15, 10, 180, 1, 30],
      instructions: [
        "Mix flour, sugar, and baking powder in a bowl.",
        "In another bowl, whisk milk and egg together.",
        "Melt cannabutter and add to wet ingredients.",
        "Combine wet and dry ingredients, mix until just combined.",
        "Heat a skillet over medium heat.",
        "Pour batter to make 4-inch pancakes.",
        "Cook until bubbles form, then flip and cook until golden.",
        "Serve with butter or syrup.",
      ],
    },
  ],
  "ice-cream": [
    {
      id: "vanilla-ice-cream",
      name: "Infused Vanilla Ice Cream",
      servings: 6,
      ingredients: ["Heavy Cream", "Whole Milk", "Granulated Sugar", "Vanilla Extract", "Cannabis Coconut Oil"],
      amounts: [480, 240, 150, 5, 30],
      instructions: [
        "In a saucepan, heat cream, milk, and sugar over medium heat.",
        "Stir until sugar dissolves (do not boil).",
        "Remove from heat and add vanilla extract and cannabis oil.",
        "Stir well to combine.",
        "Chill mixture in refrigerator for at least 2 hours.",
        "Pour into ice cream maker and churn according to manufacturer instructions.",
        "Freeze for 2-4 hours before serving.",
      ],
    },
  ],
  "protein-snacks": [
    {
      id: "protein-balls",
      name: "THC Protein Balls",
      servings: 12,
      ingredients: ["Rolled Oats", "Peanut Butter", "Honey", "Protein Powder", "Cannabis Coconut Oil"],
      amounts: [200, 120, 60, 30, 15],
      instructions: [
        "Mix all dry ingredients in a bowl.",
        "Add peanut butter, honey, and cannabis oil.",
        "Mix until well combined.",
        "Roll mixture into 12 equal-sized balls.",
        "Place on parchment paper.",
        "Refrigerate for at least 30 minutes before eating.",
      ],
    },
  ],
  "candy-gummies": [
    {
      id: "gummies",
      name: "Cannabis Gummies",
      servings: 50,
      ingredients: ["THC Tincture", "Gelatin (unflavored)", "Flavored Jello Mix", "Water", "Corn Syrup"],
      amounts: [30, 28, 85, 120, 60],
      instructions: [
        "Mix gelatin, jello, and water in saucepan.",
        "Let sit 5 minutes to bloom.",
        "Heat over low, stirring until dissolved.",
        "Remove from heat, add corn syrup and tincture.",
        "Pour into silicone molds.",
        "Refrigerate 2-3 hours until firm.",
      ],
    },
  ],
};

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
  isInfused?: boolean;
  thcPerUnit?: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  type: string;
};

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
  const [measurementSystem, setMeasurementSystem] = useState<"metric" | "imperial">("metric"); // metric = g/ml, imperial = oz/cups/tbsp
  
  type ActiveRecipeTab = "thc" | "nutrition" | "instructions";
  const [activeRecipeTab, setActiveRecipeTab] = useState<ActiveRecipeTab>("thc");
  
  // What Can I Make - Ingredient Selection
  const [selectedPantryItems, setSelectedPantryItems] = useState<string[]>([]);
  const [selectedInfusionType, setSelectedInfusionType] = useState<string>("none");
  const [availableRecipes, setAvailableRecipes] = useState<any[]>([]);

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
    if (saved) {
      setInfusionBases(JSON.parse(saved));
    }
  }, []);

  // Build dynamic ingredient entries from saved infusions
  // These have the user's real calculated THC-per-unit values
  const myInfusionIngredients = infusionBases.map((base) => {
    // Map base type to a fat/liquid type
    const ingType = base.type === "tincture" ? "liquid" : "fat";
    return {
      name: base.name,
      category: "my-infusions" as const,
      defaultAmount: 100,
      defaultUnit: base.baseUnit || "g",
      thcPerUnit: base.thcPerUnit, // real calculated mg per unit
      calories: base.type === "butter" ? 717 : base.type === "coconut-oil" ? 862 : base.type === "olive-oil" ? 884 : 7,
      carbs: 0,
      protein: base.type === "butter" ? 1 : 0,
      fat: ingType === "fat" ? 81 : 0,
      type: ingType,
      // Extra display info
      strainName: base.strainName,
      totalTHC: base.totalTHC,
    };
  });

  // Load standard recipe
  useEffect(() => {
    if (selectedStandardRecipe && selectedCategory) {
      const recipe = standardRecipes[selectedCategory]?.find(r => r.id === selectedStandardRecipe);
      if (recipe) {
        setRecipeName(recipe.name);
        setServings(recipe.servings);
        setInstructions([...recipe.instructions]);
        
        // Build ingredients from template
        const builtIngredients = recipe.ingredients.map((ingName: string, idx: number) => {
          const libraryItem = INGREDIENT_LIBRARY.find(i => i.name === ingName);
          if (libraryItem) {
            return {
              name: ingName,
              amount: recipe.amounts[idx],
              unit: libraryItem.defaultUnit,
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
            amount: recipe.amounts[idx],
            unit: "g",
            calories: 0,
            carbs: 0,
            protein: 0,
            fat: 0,
          };
        });
        setIngredients(builtIngredients);
        // Reset measurement system to metric since all library items use metric units by default
        setMeasurementSystem("metric");
      }
    }
  }, [selectedStandardRecipe, selectedCategory]);

  // ── Unit-aware gram conversion for accurate nutrition/THC calcs ──
  // When ingredients are in cups/oz/tbsp the raw amount is NOT grams.
  // This converts any unit to grams (or ml, treated as grams) before maths.
  const toGrams = (amount: number, unit: string): number => {
    const factor = unitToGrams[unit.toLowerCase()] ?? 1;
    return amount * factor;
  };

  // Calculate total THC
  // thcPerUnit = mg per display unit (whatever unit is currently shown)
  // e.g. "10 mg/oz" with 4 oz = 4 × 10 = 40mg — NO gram conversion needed
  const totalTHC = ingredients.reduce((sum, ing) => {
    if (ing.isInfused && ing.thcPerUnit) {
      return sum + (ing.amount * ing.thcPerUnit);
    }
    return sum;
  }, 0);

  const thcPerServing = servings > 0 ? totalTHC / servings : 0;

  // Calculate nutrition per serving — unit-aware (convert all amounts to grams first)
  const totalCalories = ingredients.reduce((sum, ing) => sum + ((ing.calories / 100) * toGrams(ing.amount, ing.unit)), 0);
  const totalProtein  = ingredients.reduce((sum, ing) => sum + ((ing.protein  / 100) * toGrams(ing.amount, ing.unit)), 0);
  const totalCarbs    = ingredients.reduce((sum, ing) => sum + ((ing.carbs    / 100) * toGrams(ing.amount, ing.unit)), 0);
  const totalFat      = ingredients.reduce((sum, ing) => sum + ((ing.fat      / 100) * toGrams(ing.amount, ing.unit)), 0);
  const totalFiber    = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ing.name);
    return sum + (((lib as any)?.fiber || 0) / 100) * toGrams(ing.amount, ing.unit);
  }, 0);
  const totalSugar    = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ing.name);
    return sum + (((lib as any)?.sugar || 0) / 100) * toGrams(ing.amount, ing.unit);
  }, 0);
  const totalSodium   = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ing.name);
    return sum + (((lib as any)?.sodium || 0) / 100) * toGrams(ing.amount, ing.unit);
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
    // Check user's saved infusions first — they have real THC values
    const myInfusion = myInfusionIngredients.find(i => i.name === newIngredientName);
    if (myInfusion) {
      const updated = [...ingredients];
      updated[index] = {
        name: myInfusion.name,
        amount: myInfusion.defaultAmount,
        unit: myInfusion.defaultUnit,
        isInfused: true,
        thcPerUnit: myInfusion.thcPerUnit,
        calories: myInfusion.calories,
        carbs: myInfusion.carbs,
        protein: myInfusion.protein,
        fat: myInfusion.fat,
        type: myInfusion.type,
      };
      setIngredients(updated);
      return;
    }
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
    // Grams per cup for common ingredients — same table as the toggle function
    const gramsPerCup: Record<string, number> = {
      'All-Purpose Flour': 125, 'Cake Flour': 114, 'Bread Flour': 127,
      'Whole Wheat Flour': 120, 'Almond Flour': 96, 'Oat Flour': 92,
      'Rice Flour': 158, 'Coconut Flour': 112, 'Buckwheat Flour': 120,
      'Cornstarch': 128, 'Tapioca Starch': 152,
      'Cocoa Powder (Natural)': 100, 'Dutch Cocoa Powder': 100, 'Cocoa Powder': 100,
      'Espresso Powder': 85, 'Matcha Powder': 85, 'Graham Cracker Crumbs': 90, 'Cornmeal': 157,
      'Granulated Sugar': 200, 'Sugar': 200,
      'Brown Sugar (Light)': 220, 'Brown Sugar (Dark)': 220, 'Brown Sugar': 220,
      'Powdered Sugar': 120, 'Raw Turbinado Sugar': 200, 'Coconut Sugar': 180,
      'Monk Fruit Sweetener': 200,
      'Unsalted Butter': 227, 'Salted Butter': 227, 'Brown Butter': 227,
      'Vegan Butter': 227, 'Shortening': 190, 'Cannabutter': 227,
      'Baking Powder': 192, 'Baking Soda': 220, 'Cream of Tartar': 150,
      'Instant Yeast': 150, 'Gelatin (unflavored)': 150,
      'Flavored Jello Mix': 85, 'Rolled Oats': 90, 'Protein Powder': 120,
      'Salt': 273, 'Black Pepper': 100, 'Cinnamon': 125, 'Nutmeg': 100,
    };

    const totals: Record<string, number> = {};
    for (const ing of ingredients) {
      const lib = INGREDIENT_LIBRARY.find(i => i.name === ing.name);
      const rawCat = lib?.category || 'other';
      const cat =
        rawCat === 'flour'     ? 'flour'    :
        // 'chocolate' = chips/bars/mix-ins — NOT structural flour. Cocoa powder is
        // already categorised as 'flour' in INGREDIENT_LIBRARY so it counts correctly.
        rawCat === 'sugar'     ? 'sugar'    :
        rawCat === 'fat'       ? 'fat'      :
        rawCat === 'egg'       ? 'egg'      :
        rawCat === 'leavening' ? 'leavener' :
        rawCat === 'dairy'     ? 'dairy'    :
        rawCat === 'liquid'    ? 'liquid'   :
        rawCat === 'infused'   ? 'fat'      :
        'other';

      // Convert to grams using ingredient-specific density for cups/tbsp/tsp
      const ingType = lib?.type || 'solid';
      const isPowderOrFat = ingType === 'powder' || ingType === 'fat';
      const gpc = gramsPerCup[ing.name] || (isPowderOrFat ? 130 : 240);

      let grams = ing.amount;
      if (ing.unit === 'cups')        grams = ing.amount * gpc;
      else if (ing.unit === 'tbsp')   grams = ing.amount * (gpc / 16);
      else if (ing.unit === 'tsp')    grams = ing.amount * (gpc / 48);
      else if (ing.unit === 'oz')     grams = ing.amount * 28.35;
      else if (ing.unit === 'lb')     grams = ing.amount * 453.592;
      else if (ing.unit === 'fl oz')  grams = ing.amount * 29.57;
      else if (ing.unit === 'ml')     grams = ing.amount;
      else if (ing.unit === 'large')  grams = ing.amount * 57;
      else if (ing.unit === 'medium') grams = ing.amount * 50;
      else if (ing.unit === 'small')  grams = ing.amount * 43;
      else if (ing.unit === 'pieces') grams = ing.amount * 100;
      else if (ing.unit === 'cloves') grams = ing.amount * 3;
      // squeeze/packet/dropper/0.1ml stay as negligible amounts

      totals[cat] = (totals[cat] ?? 0) + grams;
    }
    return totals;
  };

  // ── Per-ingredient warnings (cookie-science ratio engine) ──
  const getIngredientWarning = (ing: Ingredient, _servings: number) => {
    const lib = INGREDIENT_LIBRARY.find(i => i.name === ing.name);
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
    const egg      = totals['egg']      ?? 0;
    const liquid   = totals['liquid']   ?? 0;
    const dairy    = totals['dairy']    ?? 0;
    const leavener = totals['leavener'] ?? 0;
    const totalMoisture = egg + liquid + dairy;

    let warning = '';
    let color = '';

    if (flour === 0) return { warning, color };

    // Skip warnings for no-bake / snack / non-flour-based recipes.
    // These use ingredients like oats, gelatin, protein powder that get
    // categorised as 'flour' but don't follow baking ratios.
    // Heuristic: if there are no eggs AND no dairy AND fat < 20% of flour,
    // this is probably a no-bake snack — don't apply baking warnings.
    const isNoBake = egg === 0 && dairy === 0 && fat < flour * 0.2;
    if (isNoBake) return { warning, color };

    const flourToFat  = flour / Math.max(fat, 1);
    const fatToFlour  = fat   / Math.max(flour, 1);
    const sugarToFlour = sugar / Math.max(flour, 1);
    const eggToFlour  = egg   / Math.max(flour, 1);
    // Dairy contributes moisture AND fat — count it as moisture for these checks
    const totalMoistureAdj = egg + liquid + dairy * 0.5; // dairy partially counts

    if (cat === 'flour') {
      // Only warn if BOTH ratio AND moisture are genuinely off.
      // Standard cookies/brownies are ~2–2.5x flour:fat with eggs providing moisture.
      // Real threshold: >4.5 flour:fat AND very low combined moisture
      if (flourToFat > 4.5 && totalMoistureAdj < flour * 0.3) {
        warning = 'Way too much flour for this fat & moisture — result will be very dry. Add more butter or eggs.';
        color = 'red';
      } else if (flourToFat > 3.5 && totalMoistureAdj < flour * 0.35) {
        warning = 'Flour is high relative to fat — consider adding an extra egg or tablespoon of butter.';
        color = 'yellow';
      }
    }

    if (cat === 'fat') {
      // Cookies: butter at 40–55% of flour weight is normal. Brownies can go higher.
      // Only warn at genuinely problematic levels.
      if (fatToFlour > 1.0) {
        warning = 'Fat is very high — baked goods will be greasy and spread flat. Reduce butter or add more flour.';
        color = 'red';
      } else if (fatToFlour > 0.8) {
        warning = 'Fat is quite high — expect significant spread. Chill the dough before baking.';
        color = 'yellow';
      } else if (fatToFlour < 0.15 && flour > 150 && egg > 0) {
        // Only warn about low fat when there ARE eggs (real baked goods)
        warning = 'Low fat for this flour amount — baked goods may be tough and dry.';
        color = 'yellow';
      }
    }

    if (cat === 'sugar') {
      // Cookies: sugar at 80–120% of flour is completely normal (crispy → chewy range).
      // Brownies: sugar at 100–150% of flour is normal (fudgy).
      // Only warn at truly excessive levels.
      if (sugarToFlour > 1.8) {
        warning = 'Sugar is very high — baked goods will burn easily and be very thin. Reduce sugar.';
        color = 'red';
      } else if (sugarToFlour > 1.5) {
        warning = 'Sugar is on the high side — watch bake time carefully and check for burning.';
        color = 'yellow';
      } else if (sugarToFlour < 0.1 && flour > 150 && egg > 0) {
        warning = 'Very low sugar — result may be bland and pale.';
        color = 'yellow';
      }
    }

    if (cat === 'egg') {
      // Eggs in brownies: 3 eggs to 130g flour = 1.15 ratio — perfectly normal.
      // Only warn at truly excessive egg ratios.
      if (eggToFlour > 1.2) {
        warning = 'Too many eggs — result will be very custardy or rubbery. Reduce eggs or add more flour.';
        color = 'red';
      } else if (eggToFlour > 0.9) {
        warning = 'High egg ratio — will be very soft and cake-like. Fine for certain recipes.';
        color = 'yellow';
      }
    }

    if (cat === 'liquid' || cat === 'dairy') {
      // Dairy-heavy batters (pancakes, cakes) are intentionally liquid.
      // Only flag if non-dairy liquid alone is excessive.
      const pureLiquidToFlour = (egg + liquid) / Math.max(flour, 1);
      const totalToFlour = totalMoisture / Math.max(flour, 1);
      if (pureLiquidToFlour > 1.5) {
        warning = 'Way too much liquid — batter will not hold shape and won\'t bake properly.';
        color = 'red';
      } else if (totalToFlour > 2.2) {
        warning = 'Very high moisture content — this will be a very thin batter. Make sure that\'s intended.';
        color = 'yellow';
      }
    }

    if (cat === 'leavener') {
      const leavenerToFlour = leavener / Math.max(flour, 1);
      // Standard: 4g baking powder per 125g flour = 0.032
      // Pancakes legitimately use 0.05–0.07 for extra fluffiness
      if (leavenerToFlour > 0.12) {
        warning = 'Too much leavener — baked goods will taste bitter and soapy.';
        color = 'red';
      } else if (leavenerToFlour > 0.09) {
        warning = 'Leavener is on the high side — may cause excessive puffing.';
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
  }

  const computeRecipeSummary = (): RecipeSummary | null => {
    if (ingredients.length === 0) return null;

    const totals = getCategoryTotals();
    const flour    = totals['flour']    ?? 0;
    const fat      = totals['fat']      ?? 0;
    const sugar    = totals['sugar']    ?? 0;
    const egg      = totals['egg']      ?? 0;
    const liquid   = totals['liquid']   ?? 0;
    const dairy    = totals['dairy']    ?? 0;
    const leavener = totals['leavener'] ?? 0;
    const totalMoisture = egg + liquid + dairy;
    const hasInfused = ingredients.some(i => {
      const lib = INGREDIENT_LIBRARY.find(l => l.name === i.name);
      return lib?.category === 'infused';
    });

    const tags: { label: string; color: string }[] = [];
    if (hasInfused) tags.push({ label: '🧪 Cannabis Infused', color: 'purple' });

    // No flour — beverage / sauce / no-bake
    if (flour === 0) {
      if (liquid > 0 || dairy > 0) {
        return {
          headline: '🥤 Beverage or Sauce Recipe',
          description: 'No flour detected — this looks like a drink, sauce, or no-bake recipe. Ratios look fine for a liquid-based preparation.',
          tags: [...tags, { label: 'Liquid-based', color: 'green' }],
          severity: 'good',
        };
      }
      return {
        headline: '📝 Keep Building Your Recipe',
        description: 'Add ingredients to get a full analysis of your recipe balance.',
        tags: [...tags, { label: 'In progress', color: 'yellow' }],
        severity: 'good',
      };
    }

    const fatRatio      = fat      / flour;
    const sugarRatio    = sugar    / flour;
    const eggRatio      = egg      / flour;
    const moistureRatio = totalMoisture / flour;
    const leavenerRatio = leavener / flour;

    const issues: string[] = [];
    let severity: 'good' | 'warning' | 'problem' = 'good';

    // Way too much liquid — bail early
    if (moistureRatio > 1.1) {
      return {
        headline: '💧 This will not bake properly',
        description: 'The liquid content is far too high relative to flour. This batter will not hold shape — it will spread into a puddle. Dramatically reduce milk/liquid or add much more flour.',
        tags: [...tags, { label: 'Too much liquid', color: 'red' }, { label: "Won't bake", color: 'red' }],
        severity: 'problem',
      };
    }

    // Diagnose each ratio
    if (sugarRatio > 1.2)       { issues.push('sugar is very high — expect thin, sweet, fast-browning results'); tags.push({ label: 'Too much sugar', color: 'red' }); severity = 'problem'; }
    else if (sugarRatio > 1.05) { issues.push('sugar is elevated — baked goods will spread more and brown faster'); tags.push({ label: 'High sugar', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    if (fatRatio > 0.85)        { issues.push('fat is very high — baked goods will be greasy and spread flat'); tags.push({ label: 'Too much fat', color: 'red' }); severity = 'problem'; }
    else if (fatRatio > 0.65)   { issues.push('fat is elevated — expect significant spread, chill dough before baking'); tags.push({ label: 'High fat', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }
    else if (fatRatio < 0.25 && flour > 100) { issues.push('low fat for this flour — dough may be dry and stiff'); tags.push({ label: 'Low fat', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    if (eggRatio > 0.6)         { issues.push('too many eggs for this flour — result will be puffy and cakey'); tags.push({ label: 'Too many eggs', color: 'red' }); severity = 'problem'; }
    else if (eggRatio > 0.55)   { issues.push('high egg ratio — will lean very soft and cakey'); tags.push({ label: 'High eggs', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    if (moistureRatio > 0.9)    { issues.push('liquid is high — dough will be very soft, needs chilling or more flour'); tags.push({ label: 'High moisture', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    if (leavenerRatio > 0.04)   { issues.push('leavener is very high — may taste bitter or soapy'); tags.push({ label: 'Too much leavener', color: 'red' }); severity = 'problem'; }
    else if (leavenerRatio > 0.025) { issues.push('leavener is slightly high — may cause excessive puffing'); tags.push({ label: 'High leavener', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    // Positive descriptions when balanced
    if (severity === 'good') {
      const chewy      = fatRatio >= 0.35 && fatRatio <= 0.55 && sugarRatio >= 0.4 && sugarRatio <= 0.7 && eggRatio >= 0.15 && eggRatio <= 0.35;
      const crispy     = fatRatio >= 0.3  && sugarRatio >= 0.6 && eggRatio < 0.25 && moistureRatio < 0.3;
      const cakey      = eggRatio > 0.3   && moistureRatio > 0.3 && fatRatio < 0.4;
      const buttery    = fatRatio > 0.55  && sugarRatio < 0.5;
      const fudgy      = eggRatio >= 0.4  && sugarRatio >= 0.8 && fatRatio >= 0.4 && fatRatio <= 0.8;
      const moistBake  = moistureRatio >= 0.3 && fatRatio >= 0.3 && fatRatio <= 0.6;

      if (fudgy)     return { headline: '✅ Balanced — Fudgy Brownie Profile', description: 'High eggs, sugar, and fat relative to flour is exactly right for dense, fudgy brownies. This ratio creates that characteristic crinkle top and chewy center.', tags: [...tags, { label: 'Fudgy', color: 'green' }, { label: 'Dense & rich', color: 'green' }], severity: 'good' };
      if (chewy)     return { headline: '✅ Well-balanced — Classic Chewy Texture', description: 'Your ratios are dialed in for a classic chewy bake with a soft center and slightly crisp edges. Fat, sugar, and egg balance looks great.', tags: [...tags, { label: 'Chewy', color: 'green' }, { label: 'Balanced', color: 'green' }], severity: 'good' };
      if (crispy)    return { headline: '✅ Balanced — Crispy Profile', description: 'Higher sugar and moderate fat with low moisture points toward crispy, snappy results. Expect good browning and thin, crunchy texture.', tags: [...tags, { label: 'Crispy', color: 'green' }, { label: 'Good spread', color: 'green' }], severity: 'good' };
      if (cakey)     return { headline: '✅ Balanced — Soft Cake-Style', description: 'High eggs and moisture with moderate fat gives a pillowy, cake-like result. Great for muffins, cakes, or soft bakes.', tags: [...tags, { label: 'Soft & cakey', color: 'green' }, { label: 'Balanced', color: 'green' }], severity: 'good' };
      if (buttery)   return { headline: '✅ Balanced — Rich & Buttery', description: 'High fat and lower sugar/egg points to a rich, crumbly, shortbread-style result. Minimal spread, melt-in-mouth texture.', tags: [...tags, { label: 'Rich & buttery', color: 'green' }, { label: 'Balanced', color: 'green' }], severity: 'good' };
      if (moistBake) return { headline: '✅ Balanced — Moist & Tender', description: 'Good moisture and fat levels for a soft, tender result. Perfect for cakes, brownies, or quick breads.', tags: [...tags, { label: 'Moist & tender', color: 'green' }, { label: 'Balanced', color: 'green' }], severity: 'good' };

      return { headline: '✅ Recipe Looks Balanced', description: 'Your ingredient ratios are within normal baking ranges. Looking good!', tags: [...tags, { label: 'Balanced', color: 'green' }], severity: 'good' };
    }

    const headline = severity === 'problem'
      ? `⚠️ Recipe has ${issues.length > 1 ? 'multiple issues' : 'an issue'} to fix`
      : `💡 ${issues.length} thing${issues.length > 1 ? 's' : ''} to watch`;

    const description = issues.length === 1
      ? `${issues[0].charAt(0).toUpperCase()}${issues[0].slice(1)}.`
      : issues.map((s, i) => `${i + 1}. ${s.charAt(0).toUpperCase()}${s.slice(1)}`).join('. ') + '.';

    return { headline, description, tags, severity };
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
      const libraryItem = INGREDIENT_LIBRARY.find(i => i.name === ing.name);
      const ingredientType = libraryItem?.type || ing.type || "solid";

      // Skip items that don't use g or ml (count, squeeze, packet, dropper, etc.)
      const skipUnits = ["large", "medium", "small", "whole", "pieces", "cloves", "squeeze", "packet", "dropper", "0.1ml"];
      if (skipUnits.includes(ing.unit)) return ing;

      if (newSystem === "imperial") {
        // METRIC TO IMPERIAL
        if (ing.unit === "g") {
          if (ingredientType === "powder") {
            const gPerCup = gramsPerCup[ing.name] || 120;
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
            // Fats convert to oz — cleaner numbers than cups for butter amounts
            // e.g. 113g butter → 4 oz, 56g → 2 oz, 227g → 8 oz
            const oz = ing.amount * 0.035274;
            if (oz >= 1) {
              const rounded = roundToCommonMeasurement(oz, "oz");
              return { ...ing, amount: rounded.amount, unit: rounded.unit };
            } else {
              // Small fat amounts: convert to tbsp
              const tbsp = ing.amount / 14.1748; // 1 tbsp butter ≈ 14.175g
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
            const gPerCup = gramsPerCup[ing.name] || 227;
            const grams = ing.amount * gPerCup;
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g" };
          } else {
            return { ...ing, amount: parseFloat((ing.amount * 240).toFixed(1)), unit: "ml" };
          }
        }
        else if (ing.unit === "tbsp") {
          if (ingredientType === "powder" || ingredientType === "fat") {
            const gPerCup = gramsPerCup[ing.name] || 120;
            const grams = ing.amount * (gPerCup / 16);
            return { ...ing, amount: parseFloat(grams.toFixed(1)), unit: "g" };
          } else {
            return { ...ing, amount: parseFloat((ing.amount * 14.7868).toFixed(1)), unit: "ml" };
          }
        }
        else if (ing.unit === "tsp") {
          if (ingredientType === "powder") {
            const gPerCup = gramsPerCup[ing.name] || 120;
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
    
    // Rescale thcPerUnit to match the new display unit
    // thcPerUnit is always mg per DISPLAY unit, so when unit changes we must rescale
    const rescaled = convertedIngredients.map(ing => {
      if (!ing.isInfused || !ing.thcPerUnit) return ing;
      // Find what the original ingredient was (before conversion) to get old unit
      const original = ingredients.find(o => o.name === ing.name);
      if (!original || original.unit === ing.unit) return ing;
      // Convert: mg/oldUnit → mg/newUnit
      // mg/newUnit = mg/oldUnit × (grams_per_oldUnit / grams_per_newUnit)
      const unitToG: Record<string, number> = {
        g: 1, ml: 1, kg: 1000, L: 1000,
        oz: 28.35, lb: 453.6, "fl oz": 29.57,
        cups: 240, tbsp: 14.79, tsp: 4.93,
        large: 57, medium: 50, small: 43,
      };
      const oldG = unitToG[original.unit] ?? 1;
      const newG = unitToG[ing.unit] ?? 1;
      const rescaledThc = ing.thcPerUnit * (newG / oldG);
      return { ...ing, thcPerUnit: Math.round(rescaledThc * 100) / 100 };
    });

    setIngredients(rescaled);
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

  // STEP 1: Category Selection
  if (!selectedCategory) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center bg-white p-6 rounded-xl shadow-sm border-2 border-green-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">👨‍🍳 Create Your Recipe</h1>
          <p className="text-gray-700 mb-4">
            Choose a recipe category to get started
          </p>
          
          <Button
            onClick={() => setShowWhatCanIMake(!showWhatCanIMake)}
            className="bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            What Can I Make?
          </Button>
        </div>

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
                    {myInfusionIngredients.length > 0 && (
                      <>
                        <div className="font-bold text-xs text-purple-800 bg-purple-50 px-2 py-1.5">
                          🧪 MY SAVED INFUSIONS
                        </div>
                        {myInfusionIngredients.map((item) => (
                          <SelectItem key={item.name} value={item.name} className="text-gray-900 font-medium">
                            {item.name} ({item.thcPerUnit.toFixed(1)}mg/{item.defaultUnit})
                          </SelectItem>
                        ))}
                        <div className="font-bold text-xs text-gray-500 px-2 py-1 border-t border-gray-100">
                          GENERIC
                        </div>
                      </>
                    )}
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
                    <div className="font-bold text-xs text-gray-600 px-2 py-1 mt-2">🧪 LEAVENING & BINDERS</div>
                    {INGREDIENT_LIBRARY.filter(i => i.category === "leavening").map((item) => (
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

        {/* My Saved Infusions Banner */}
        {infusionBases.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-green-50 border-2 border-purple-300 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <FlaskConical className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900">🧪 Your Saved Infusions Are Ready to Use!</h3>
                <p className="text-sm text-gray-700">
                  {infusionBases.length} infusion{infusionBases.length !== 1 ? "s" : ""} from My Infusions — select any recipe below and swap in your real infusion with its exact THC values.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {infusionBases.map((base) => (
                <div key={base.id} className="bg-white border border-purple-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                  <span className="text-purple-600">🧪</span>
                  <div>
                    <div className="text-xs font-semibold text-gray-900">{base.name}</div>
                    <div className="text-xs text-gray-500">{base.thcPerUnit.toFixed(1)} mg/{base.baseUnit} · {base.strainName}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {recipeCategories.map((category) => (
            <Card
              key={category.id}
              className="bg-white border-2 border-gray-200 hover:border-green-500 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardHeader className="text-center pb-3">
                <div className="text-5xl mb-2">{category.emoji}</div>
                <CardTitle className="text-base text-gray-900">{category.name}</CardTitle>
                <CardDescription className="text-xs text-gray-600">{category.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-center">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  {standardRecipes[category.id]?.length || 0} recipes
                </Badge>
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
      <div className="max-w-4xl mx-auto space-y-6">
        <Button onClick={resetToCategories} variant="ghost" className="text-gray-700 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Categories
        </Button>

        <div className="text-center bg-white p-6 rounded-xl shadow-sm border-2 border-green-200">
          <div className="text-6xl mb-3">{category?.emoji}</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{category?.name}</h1>
          <p className="text-gray-700">{category?.description}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-white border-2 border-green-300 shadow-md">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-green-700" />
                Standard Recipes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {categoryRecipes.length > 0 ? (
                <div className="space-y-2">
                  {categoryRecipes.map((recipe) => (
                    <Button
                      key={recipe.id}
                      onClick={() => {
                        setRecipeType("standard");
                        setSelectedStandardRecipe(recipe.id);
                      }}
                      className="w-full bg-white hover:bg-green-50 text-gray-900 border-2 border-green-200 h-auto py-3 justify-start"
                    >
                      <div className="text-left">
                        <div className="font-bold">{recipe.name}</div>
                        <div className="text-xs text-gray-600">{recipe.servings} servings</div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4 text-sm">No recipes yet</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white border-2 border-purple-300 shadow-md">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-700" />
                Create Custom
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <Button
                onClick={startCustomRecipe}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white h-auto py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Start Custom Recipe
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // STEP 3: Recipe Builder — Two-column cookie-style layout
  if (recipeType && ingredients.length > 0) {
    const category = recipeCategories.find(c => c.id === selectedCategory);

    return (
      <div className="min-h-screen -mx-4 -mt-8" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)' }}>

        {/* ── Sticky Header ── */}
        <header className="text-white shadow-lg sticky top-0 z-30" style={{ background: 'linear-gradient(135deg, #14532d, #16a34a, #15803d)' }}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => { setRecipeType(""); setSelectedStandardRecipe(""); setIngredients([]); }}
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 p-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <span className="text-2xl">{category?.emoji || "🌿"}</span>
                <div>
                  <h1 className="text-lg font-bold leading-tight">{recipeName || "Cannabis Recipe"}</h1>
                  <p className="text-green-200 text-xs">{category?.name} · {servings} serving{servings !== 1 ? "s" : ""}</p>
                </div>
              </div>

              {/* Right controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* THC Quick Stats */}
                <div className="flex items-center gap-3 bg-white/10 rounded-xl px-3 py-1.5 text-sm">
                  <div className="text-center">
                    <div className="font-black text-white leading-none">{totalTHC.toFixed(1)}<span className="text-xs font-normal text-green-200">mg</span></div>
                    <div className="text-green-300 text-xs">total THC</div>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                  <div className="text-center">
                    <div className="font-black text-white leading-none">{thcPerServing.toFixed(1)}<span className="text-xs font-normal text-green-200">mg</span></div>
                    <div className="text-green-300 text-xs">per serving</div>
                  </div>
                </div>

                {/* Measurement toggle */}
                <div className="flex bg-white/20 rounded-lg p-0.5">
                  {(["metric", "imperial"] as const).map((m) => (
                    <button key={m} onClick={() => { if (m !== measurementSystem) toggleMeasurementSystem(); }}
                      className={`px-2 py-1 rounded-md text-xs font-medium transition-all ${measurementSystem === m ? "bg-white text-green-700" : "text-white hover:bg-white/20"}`}>
                      {m === "metric" ? "g/ml" : "oz"}
                    </button>
                  ))}
                </div>

                {/* Servings */}
                <div className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-1">
                  <span className="text-xs text-white/80">Servings:</span>
                  <input type="number" value={servings} min={1} step={1}
                    onChange={(e) => { const v = parseInt(e.target.value); if (!isNaN(v) && v >= 1) setServings(v); }}
                    className="w-10 bg-white/20 rounded text-white text-xs text-center outline-none" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* ── Recipe info banner ── */}
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-white/80 border border-green-200 rounded-xl p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-3">

                {/* Recipe switcher dropdown */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    📖 Recipe
                  </label>
                  <select
                    value={recipeType === "custom" ? "__custom__" : selectedStandardRecipe}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "__custom__") {
                        startCustomRecipe();
                      } else {
                        setRecipeType("standard");
                        setSelectedStandardRecipe(val);
                        // ingredients reload via the existing useEffect
                      }
                    }}
                    className="w-full text-sm border-2 border-green-200 rounded-xl px-3 py-2.5 bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 cursor-pointer"
                  >
                    {(standardRecipes[selectedCategory] || []).map((r: any) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.servings} servings)
                      </option>
                    ))}
                    <option value="__custom__">✏️ Custom Recipe (blank)</option>
                  </select>
                </div>

                {/* Editable recipe name */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">
                    ✏️ Custom Name (optional)
                  </label>
                  <input
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    className="w-full text-sm font-semibold text-gray-900 bg-white border-2 border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 placeholder-gray-400"
                    placeholder="Give your recipe a name..."
                  />
                </div>

                {/* Stats chips */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-green-100 px-2 py-1 rounded-full text-green-800 font-medium">{category?.name}</span>
                  <span className="text-xs bg-purple-100 px-2 py-1 rounded-full text-purple-800 font-medium">⚗️ {totalTHC.toFixed(1)}mg total THC</span>
                  <span className="text-xs bg-blue-100 px-2 py-1 rounded-full text-blue-800 font-medium">{ingredients.length} ingredients</span>
                  <span className="text-xs bg-amber-100 px-2 py-1 rounded-full text-amber-800 font-medium">{servings} serving{servings !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Saved infusions panel */}
              {infusionBases.length > 0 && (
                <div className="border-t md:border-t-0 md:border-l border-green-200 pt-3 md:pt-0 md:pl-4 min-w-[200px]">
                  <div className="text-xs text-green-700 font-semibold mb-2">🧪 Your Infusions Available</div>
                  {infusionBases.map(b => (
                    <div key={b.id} className="text-xs text-gray-600 py-0.5">{b.name} · <span className="text-purple-600 font-medium">{b.thcPerUnit.toFixed(1)}mg/{b.baseUnit}</span></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Main two-column grid ── */}
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* ════ LEFT COLUMN ════ */}
            <div className="space-y-6">

              {/* Recipe Summary Analysis */}
              <RecipeSummaryCard />

              {/* ── Ingredients Card ── */}
              <div className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">🌿 Ingredients</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={toggleMeasurementSystem}
                      className="flex items-center gap-1 text-blue-700 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                      {measurementSystem === "metric" ? "Switch to oz" : "Switch to g"}
                    </button>
                    <button
                      onClick={addIngredient}
                      className="flex items-center gap-1 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors"
                      style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }}
                    >
                      <Plus className="w-3 h-3" /> Add
                    </button>
                  </div>
                </div>

                {/* My Saved Infusions quick-add strip */}
                {myInfusionIngredients.length > 0 && (
                  <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-xl">
                    <div className="text-xs font-bold text-purple-700 mb-2">🧪 MY SAVED INFUSIONS — click to add</div>
                    <div className="flex flex-wrap gap-2">
                      {myInfusionIngredients.map((inf) => (
                        <button
                          key={inf.name}
                          onClick={() => {
                            setIngredients(prev => [...prev, {
                              name: inf.name,
                              amount: inf.defaultAmount,
                              unit: inf.defaultUnit,
                              isInfused: true,
                              thcPerUnit: inf.thcPerUnit,
                              calories: inf.calories,
                              carbs: inf.carbs,
                              protein: inf.protein,
                              fat: inf.fat,
                              type: inf.type,
                            }]);
                          }}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-purple-300 bg-white hover:bg-purple-100 text-xs text-purple-800 font-medium transition-colors"
                        >
                          <span>🧪</span>
                          <span>{inf.name}</span>
                          <span className="text-purple-500">({inf.thcPerUnit.toFixed(1)}mg/{inf.defaultUnit})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredient category summary bar */}
                {ingredients.length > 0 && (() => {
                  const catTotals: Record<string, number> = {};
                  ingredients.forEach(ing => {
                    const lib = INGREDIENT_LIBRARY.find(i => i.name === ing.name);
                    const cat = lib?.category || "other";
                    let g = ing.amount;
                    if (ing.unit === "cups") g = ing.amount * 240;
                    else if (ing.unit === "tbsp") g = ing.amount * 15;
                    else if (ing.unit === "tsp") g = ing.amount * 5;
                    else if (ing.unit === "oz") g = ing.amount * 28.35;
                    catTotals[cat] = (catTotals[cat] || 0) + g;
                  });
                  const catEmoji: Record<string, string> = { "my-infusions": "🧪", infused: "🧪", flour: "🌾", fat: "🧈", sugar: "🍬", dairy: "🥛", liquid: "💧", egg: "🥚", spice: "🌶️", chocolate: "🍫", other: "📦" };
                  return (
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100">
                      <div className="text-xs font-bold text-blue-700 mb-2">📊 INGREDIENT BREAKDOWN</div>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(catTotals).map(([cat, g]) => (
                          <div key={cat} className="bg-white px-2 py-1 rounded-lg border border-gray-200 text-center min-w-[60px]">
                            <div className="text-xs text-gray-500 capitalize">{catEmoji[cat] || "📦"} {cat}</div>
                            <div className="text-sm font-bold text-gray-800">{g.toFixed(0)}g</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Ingredient rows */}
                <div className="space-y-3">
                  {ingredients.map((ing, idx) => {
                    const warning = getIngredientWarning(ing, servings);
                    const lib = INGREDIENT_LIBRARY.find(i => i.name === ing.name);
                    const catEmoji: Record<string, string> = { "my-infusions": "🧪", infused: "🧪", flour: "🌾", fat: "🧈", sugar: "🍬", dairy: "🥛", liquid: "💧", egg: "🥚", spice: "🌶️", chocolate: "🍫", other: "📦" };
                    const isMyInfusion = myInfusionIngredients.some(i => i.name === ing.name);
                    return (
                      <div key={idx}>
                        <div className={`flex items-center gap-2 p-2 rounded-xl border ${isMyInfusion ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"}`}>
                          <span className="text-lg flex-shrink-0">{catEmoji[lib?.category || "other"] || "📦"}</span>
                          <div className="flex-1 min-w-[160px]">
                            <Select value={ing.name} onValueChange={(val) => changeIngredientFromLibrary(idx, val)}>
                              <SelectTrigger className="bg-white border-gray-300 text-gray-900 h-9 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-white max-h-[300px]">
                                {myInfusionIngredients.length > 0 && (
                                  <>
                                    <div className="font-bold text-xs text-purple-800 bg-purple-50 px-2 py-1.5 border-b border-purple-100">🧪 MY SAVED INFUSIONS</div>
                                    {myInfusionIngredients.map((item) => (
                                      <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">
                                        <span className="font-medium">{item.name}</span>
                                        <span className="text-purple-600 ml-1 text-xs">({item.thcPerUnit.toFixed(1)}mg/{item.defaultUnit})</span>
                                      </SelectItem>
                                    ))}
                                    <div className="font-bold text-xs text-gray-500 px-2 py-1 border-t border-gray-100">GENERIC INFUSED</div>
                                  </>
                                )}
                                {(() => {
                                  const catConfig: Record<string, { label: string; color: string }> = {
                                    infused:   { label: "🧪 INFUSED",            color: "text-purple-700" },
                                    flour:     { label: "🌾 FLOURS & STARCHES",  color: "text-amber-700" },
                                    sugar:     { label: "🍬 SUGARS",             color: "text-pink-700" },
                                    fat:       { label: "🧈 FATS & OILS",        color: "text-yellow-700" },
                                    egg:       { label: "🥚 EGGS",               color: "text-orange-700" },
                                    leavening: { label: "🧪 LEAVENING",          color: "text-gray-600" },
                                    dairy:     { label: "🥛 DAIRY",              color: "text-blue-700" },
                                    liquid:    { label: "💧 LIQUIDS",            color: "text-cyan-700" },
                                    chocolate: { label: "🍫 CHOCOLATE & CHIPS",  color: "text-stone-700" },
                                    fruit:     { label: "🍓 FRUITS",             color: "text-red-700" },
                                    nuts:      { label: "🥜 NUTS & SEEDS",       color: "text-green-700" },
                                    flavoring: { label: "🌸 FLAVORINGS",         color: "text-indigo-700" },
                                    spice:     { label: "🌶️ SPICES",             color: "text-orange-800" },
                                    filling:   { label: "🍯 FILLINGS & SPREADS", color: "text-rose-700" },
                                    savory:    { label: "🍝 SAVORY & OTHER",     color: "text-gray-700" },
                                  };
                                  const order = Object.keys(catConfig);
                                  return order.map(cat => {
                                    const items = INGREDIENT_LIBRARY.filter(i => i.category === cat);
                                    if (items.length === 0) return null;
                                    const cfg = catConfig[cat];
                                    return (
                                      <div key={cat}>
                                        <div className={`font-bold text-xs ${cfg.color} px-2 py-1 mt-1`}>{cfg.label}</div>
                                        {items.map(item => (
                                          <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                                        ))}
                                      </div>
                                    );
                                  });
                                })()}
                              </SelectContent>
                            </Select>
                          </div>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={ing.amount === 0 ? "" : String(ing.amount)}
                            onChange={(e) => {
                              const raw = e.target.value;
                              // Allow digits, one decimal point, empty string
                              if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
                                const val = parseFloat(raw);
                                updateIngredient(idx, "amount", isNaN(val) ? 0 : val);
                              }
                            }}
                            className="w-20 h-9 text-sm text-gray-900 border border-gray-300 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                          />
                          <Select value={ing.unit} onValueChange={(v) => updateIngredient(idx, "unit", v)}>
                            <SelectTrigger className="w-20 h-9 text-gray-900 border-gray-300 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                              {["g","ml","kg","L","tsp","tbsp","cups","fl oz","oz","lb","large","medium","small","cloves","pieces","pinch"].map(u => (
                                <SelectItem key={u} value={u} className="text-gray-900 text-sm">{u}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {ing.isInfused && (
                            <>
                              <Badge className="bg-purple-100 text-purple-700 border-0 text-xs flex-shrink-0">🧪</Badge>
                              <input
                                type="text"
                                inputMode="decimal"
                                value={ing.thcPerUnit === 0 ? "" : String(ing.thcPerUnit || "")}
                                onChange={(e) => {
                                  const raw = e.target.value;
                                  if (raw === "" || /^\d*\.?\d*$/.test(raw)) {
                                    const val = parseFloat(raw);
                                    updateIngredient(idx, "thcPerUnit", isNaN(val) ? 0 : val);
                                  }
                                }}
                                placeholder="mg/unit"
                                className="w-20 h-9 text-sm bg-purple-50 border border-purple-300 text-gray-900 rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                              />
                              <span className="text-xs text-purple-600 flex-shrink-0">mg/{ing.unit}</span>
                            </>
                          )}
                          <Button onClick={() => removeIngredient(idx)} variant="ghost" size="sm"
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 h-9 w-9 p-0 flex-shrink-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        {warning.warning && (
                          <div className={`mt-1.5 px-3 py-2 rounded-lg text-xs flex items-start gap-2 ${
                            warning.color === "red" ? "bg-red-50 text-red-700 border border-red-200" : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                          }`}>
                            <span className="flex-shrink-0">{warning.color === "red" ? "🚨" : "⚠️"}</span>
                            <span>{warning.warning}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Science Links placeholder ── */}
              <div className="bg-white rounded-2xl shadow-md p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-3">📚 Cannabis Cooking Guides</h2>
                <div className="space-y-2">
                  {[
                    { label: "Decarboxylation Guide", url: "/learn/articles/beginner-guide" },
                    { label: "Dosing Fundamentals", url: "/learn/articles/dosing-guide" },
                    { label: "Infusion Base Comparison", url: "/learn/articles/base-comparison" },
                    { label: "Converting Regular Recipes", url: "/learn/articles/convert-recipes" },
                  ].map((link) => (
                    <a key={link.url} href={link.url}
                      className="flex items-center justify-between p-3 rounded-xl border border-green-200 hover:bg-green-50 hover:border-green-400 transition-all group">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-green-800">{link.label}</span>
                      <span className="text-green-500 group-hover:translate-x-0.5 transition-transform">→</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>

            {/* ════ RIGHT COLUMN — Tabbed Panel ════ */}
            <div>
              {/* Tab bar */}
              <div className="flex bg-white rounded-2xl shadow-sm p-1 mb-4">
                {([
                  { id: "thc", label: "⚗️ THC Calc" },
                  { id: "nutrition", label: "📋 Nutrition" },
                  { id: "instructions", label: "👨‍🍳 Method" },
                ] as { id: ActiveRecipeTab; label: string }[]).map(tab => (
                  <button key={tab.id} onClick={() => setActiveRecipeTab(tab.id)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${activeRecipeTab === tab.id ? "text-white shadow" : "text-gray-500 hover:text-gray-800"}`}
                    style={activeRecipeTab === tab.id ? { background: "linear-gradient(135deg, #14532d, #16a34a)" } : {}}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── ⚗️ THC Calculator Tab ── */}
              {activeRecipeTab === "thc" && (
                <div className="bg-white rounded-2xl shadow-md p-5 space-y-5">
                  {/* Big THC readout */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
                      <div className="text-2xl font-black text-purple-700">{totalTHC.toFixed(1)}<span className="text-sm font-normal">mg</span></div>
                      <div className="text-xs text-gray-500 mt-1">Total THC</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                      <div className="text-2xl font-black text-green-700">{thcPerServing.toFixed(1)}<span className="text-sm font-normal">mg</span></div>
                      <div className="text-xs text-gray-500 mt-1">Per Serving</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                      <div className="text-2xl font-black text-blue-700">{servings}</div>
                      <div className="text-xs text-gray-500 mt-1">Servings</div>
                    </div>
                  </div>

                  {/* Dosing guide */}
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-amber-900 mb-2">💡 Dosing Reference</h4>
                    <div className="space-y-1.5 text-xs">
                      {[
                        { range: "1–2.5mg", label: "Microdose", desc: "Subtle effect, ideal for beginners" },
                        { range: "2.5–5mg", label: "Low", desc: "Mild relaxation, light relief" },
                        { range: "5–15mg", label: "Moderate", desc: "Standard recreational/therapeutic" },
                        { range: "15–30mg", label: "High", desc: "Experienced users only" },
                        { range: "30mg+", label: "Very High", desc: "Tolerance required" },
                      ].map(d => {
                        const isMatch = thcPerServing >= parseFloat(d.range.split("–")[0]) &&
                          (d.range.includes("+") || thcPerServing < parseFloat(d.range.split("–")[1] || "999"));
                        return (
                          <div key={d.label} className={`flex items-center gap-2 p-2 rounded-lg ${isMatch ? "bg-green-100 border border-green-300" : ""}`}>
                            <span className="font-mono text-amber-700 w-16 flex-shrink-0">{d.range}</span>
                            <span className={`font-semibold ${isMatch ? "text-green-800" : "text-amber-800"}`}>{d.label}</span>
                            {isMatch && <span className="text-green-600 text-xs">← your recipe</span>}
                            <span className="text-gray-500 ml-auto text-right">{d.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Infused ingredients summary */}
                  {ingredients.filter(i => i.isInfused).length > 0 && (
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <h4 className="text-sm font-bold text-purple-900 mb-2">🧪 Infused Ingredients</h4>
                      {ingredients.filter(i => i.isInfused).map((ing, idx) => (
                        <div key={idx} className="flex justify-between text-sm py-1 border-b border-purple-100 last:border-0">
                          <span className="text-gray-700">{ing.name}</span>
                          <span className="text-purple-700 font-semibold">
                            {(ing.amount * (ing.thcPerUnit || 0)).toFixed(1)}mg THC
                            <span className="text-gray-400 font-normal text-xs ml-1">({ing.amount}{ing.unit} × {ing.thcPerUnit?.toFixed(1)}mg)</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Safety reminder */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                    <p className="text-xs text-yellow-800">
                      <strong>⚠️ Start Low, Go Slow</strong> — Edibles take 30–120 min to take effect. Wait before taking more. Store safely away from children and pets.
                    </p>
                  </div>
                </div>
              )}

              {/* ── 📋 Nutrition Tab ── */}
              {activeRecipeTab === "nutrition" && (
                <div className="bg-white rounded-2xl shadow-md p-5">
                  <h3 className="font-bold text-gray-900 mb-4">📊 Nutrition Per Serving</h3>
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
                  {/* Macros bar */}
                  <div className="mt-4 space-y-2">
                    {[
                      { label: "Carbs", val: carbsPerServing, max: 300, color: "bg-amber-400" },
                      { label: "Fat", val: fatPerServing, max: 78, color: "bg-yellow-400" },
                      { label: "Protein", val: proteinPerServing, max: 50, color: "bg-blue-400" },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                          <span>{m.label}</span>
                          <span>{m.val.toFixed(1)}g</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div className={`h-full rounded-full ${m.color}`} style={{ width: `${Math.min((m.val / m.max) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── 👨‍🍳 Method Tab ── */}
              {activeRecipeTab === "instructions" && (
                <div className="bg-white rounded-2xl shadow-md p-5">
                  <h3 className="font-bold text-gray-900 mb-4">👨‍🍳 Preparation Method</h3>
                  <div className="space-y-3">
                    {instructions.map((step, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-bold text-sm text-white"
                          style={{ background: "linear-gradient(135deg, #14532d, #16a34a)" }}>
                          {idx + 1}
                        </div>
                        <div className="flex-1 text-gray-800 text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                          {step}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cannabis safety note */}
                  <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-green-900 mb-2">🌿 Cannabis Cooking Tips</h4>
                    <ul className="space-y-1 text-xs text-green-800">
                      <li>• Decarboxylate your cannabis before infusing (240°F / 40 min)</li>
                      <li>• Never exceed 245°F when infusing — you'll degrade THC</li>
                      <li>• Label all infused items clearly and store separately</li>
                      <li>• Allow edibles to fully cool before dosing — heat can affect potency</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    );
  }

  return null;
}
