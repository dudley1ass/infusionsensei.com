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
  ArrowRight,
  Calculator,
  ArrowLeftRight,
  Printer,
  Copy,
  Share2,
  CheckCheck
} from "lucide-react";
import { InfusionBase } from "../types/infusion";
import { NutritionFactsLabel } from "../components/NutritionFactsLabel";

// Common ingredient library
const INGREDIENT_LIBRARY = [
  // ── INFUSED (Cannabis) ──────────────────────────────────────────
  { name: "Cannabutter",                          category: "infused",    defaultAmount: 113, defaultUnit: "g",       thcPerUnit: 1,   calories: 717, carbs: 0,   protein: 1,   fat: 81,  type: "fat" },
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
      units: ["g", "g", "g", "g", "large", "ml"],
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
      units: ["g", "g", "g", "g", "large", "g", "ml"],
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
      units: ["ml", "g", "g", "g", "ml", "g"],
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
      units: ["ml", "ml", "g", "ml"],
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
      amounts: [240, 14, 15],
      units: ["ml", "g", "ml"],
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
      ingredients: ["Cannabutter", "Heavy Cream", "Parmesan Cheese", "Garlic", "Salt", "Black Pepper"],
      amounts: [56, 480, 100, 3, 3, 2],
      units: ["g", "ml", "g", "cloves", "g", "g"],
      instructions: [
        "In a pan, melt cannabutter over medium-low heat.",
        "Add minced garlic and sauté for 1 minute until fragrant.",
        "Pour in heavy cream and bring to a gentle simmer.",
        "Reduce heat and stir in freshly grated parmesan until melted and smooth.",
        "Season with salt and pepper to taste.",
        "Toss immediately with cooked pasta and serve.",
      ],
    },
    {
      id: "garlic-pasta",
      name: "Garlic Infused Pasta",
      servings: 2,
      ingredients: ["Pasta (dry)", "Cannabis Olive Oil", "Olive Oil", "Garlic", "Salt", "Black Pepper"],
      amounts: [170, 15, 15, 3, 3, 1],
      units: ["g", "ml", "ml", "cloves", "g", "g"],
      instructions: [
        "Cook pasta according to package directions until al dente.",
        "In a pan, heat both oils over medium-low heat.",
        "Add minced garlic and sauté until fragrant, about 1-2 minutes.",
        "Drain pasta, reserving ¼ cup pasta water.",
        "Add pasta to pan with garlic oil, toss to coat.",
        "Add a splash of pasta water if needed for consistency.",
        "Season with salt and pepper and serve immediately.",
      ],
    },
    {
      id: "steak",
      name: "THC Garlic Butter Steak",
      servings: 2,
      ingredients: ["Steak", "Cannabutter", "Unsalted Butter", "Garlic", "Salt", "Black Pepper"],
      amounts: [2, 14, 28, 2, 3, 2],
      units: ["whole", "g", "g", "cloves", "g", "g"],
      instructions: [
        "Remove steaks from fridge 30 minutes before cooking.",
        "Season generously with salt and pepper on both sides.",
        "Heat a cast iron pan over high heat until very hot.",
        "Cook steaks 3-4 minutes per side for medium-rare.",
        "Reduce heat to low, add both butters and garlic.",
        "Baste steaks continuously with the butter for 1 minute.",
        "Rest steaks 5 minutes before serving, spoon butter over top.",
      ],
    },
  ],
  "breads-breakfast": [
    {
      id: "banana-bread",
      name: "Cannabis Banana Bread",
      servings: 12,
      ingredients: ["Cannabutter", "Banana (mashed)", "Granulated Sugar", "All-Purpose Flour", "Whole Egg (large)", "Baking Soda"],
      amounts: [113, 360, 200, 280, 2, 1],
      units: ["g", "g", "g", "g", "large", "tsp"],
      instructions: [
        "Preheat oven to 350°F (175°C). Grease a 9x5 inch loaf pan.",
        "Mash 3 ripe bananas in a large bowl.",
        "Mix in melted cannabutter, eggs, and sugar until combined.",
        "Add flour and baking soda, fold until just combined — don't overmix.",
        "Pour into prepared loaf pan.",
        "Bake 60-65 minutes until a toothpick inserted in center comes out clean.",
        "Cool in pan 10 minutes, then turn out onto a wire rack.",
      ],
    },
    {
      id: "pancakes",
      name: "Infused Pancakes",
      servings: 4,
      ingredients: ["All-Purpose Flour", "Granulated Sugar", "Baking Powder", "Whole Milk", "Whole Egg (large)", "Cannabutter"],
      amounts: [140, 15, 2, 180, 1, 30],
      units: ["g", "g", "tsp", "ml", "large", "g"],
      instructions: [
        "Whisk flour, sugar, and baking powder together in a bowl.",
        "In another bowl, whisk milk and egg together.",
        "Melt cannabutter and stir into wet ingredients.",
        "Pour wet into dry and mix until just combined — lumps are fine.",
        "Heat a non-stick skillet over medium heat, lightly grease.",
        "Pour ¼ cup batter per pancake — batter will spread, that's normal.",
        "Cook until bubbles form and edges look set, about 2 minutes.",
        "Flip and cook 1-2 minutes more until golden. Serve with maple syrup.",
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
      units: ["ml", "ml", "g", "ml", "ml"],
      instructions: [
        "In a saucepan, combine cream, milk, and sugar over medium heat.",
        "Stir until sugar fully dissolves — do not let it boil.",
        "Remove from heat and stir in vanilla and cannabis coconut oil.",
        "Whisk thoroughly to fully incorporate the oil.",
        "Chill mixture in refrigerator for at least 2 hours or overnight.",
        "Churn in ice cream maker per manufacturer instructions.",
        "Transfer to freezer container and freeze 2-4 hours before serving.",
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
      units: ["g", "g", "g", "g", "ml"],
      instructions: [
        "Mix rolled oats and protein powder in a large bowl.",
        "Add peanut butter, honey, and cannabis coconut oil.",
        "Stir until everything is well combined — mixture should hold its shape.",
        "If too dry, add a little more honey. If too wet, add more oats.",
        "Roll into 12 equal-sized balls about 1½ inches across.",
        "Place on a parchment-lined tray.",
        "Refrigerate at least 30 minutes to firm up before eating.",
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
      units: ["ml", "g", "g", "ml", "ml"],
      instructions: [
        "Combine gelatin, jello mix, and water in a small saucepan.",
        "Let sit 5 minutes to bloom — do not stir yet.",
        "Heat over low heat, stirring gently until fully dissolved.",
        "Remove from heat and let cool 2 minutes.",
        "Stir in corn syrup and THC tincture thoroughly.",
        "Use a dropper or pour carefully into silicone gummy molds.",
        "Refrigerate 2-3 hours until firm.",
        "Pop out and store in an airtight container. Label with THC per piece.",
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
  const [measurementSystem, setMeasurementSystem] = useState<"metric" | "imperial">("metric");
  const [copied, setCopied] = useState(false);
  
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
          // Use recipe-defined unit if available, otherwise fall back to library default
          const unit = recipe.units?.[idx] || libraryItem?.defaultUnit || "g";
          if (libraryItem) {
            return {
              name: ingName,
              amount: recipe.amounts[idx],
              unit,
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
            unit,
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
    switch (unit) {
      case "g":       return amount;
      case "kg":      return amount * 1000;
      case "ml":      return amount; // ml ≈ g for water-based liquids
      case "L":       return amount * 1000;
      case "oz":      return amount * 28.3495;
      case "lb":      return amount * 453.592;
      case "cups":    return amount * 240;
      case "tbsp":    return amount * 14.787;
      case "tsp":     return amount * 4.929;
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

  // Calculate nutrition per serving (all amounts converted to grams)
  const totalCalories = ingredients.reduce((sum, ing) => sum + ((ing.calories / 100) * toGrams(ing.amount, ing.unit, ing.name)), 0);
  const totalProtein  = ingredients.reduce((sum, ing) => sum + ((ing.protein  / 100) * toGrams(ing.amount, ing.unit, ing.name)), 0);
  const totalCarbs    = ingredients.reduce((sum, ing) => sum + ((ing.carbs    / 100) * toGrams(ing.amount, ing.unit, ing.name)), 0);
  const totalFat      = ingredients.reduce((sum, ing) => sum + ((ing.fat      / 100) * toGrams(ing.amount, ing.unit, ing.name)), 0);
  const totalFiber    = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ing.name);
    return sum + (((lib as any)?.fiber || 0) / 100) * toGrams(ing.amount, ing.unit, ing.name);
  }, 0);
  const totalSugar    = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ing.name);
    return sum + (((lib as any)?.sugar || 0) / 100) * toGrams(ing.amount, ing.unit, ing.name);
  }, 0);
  const totalSodium   = ingredients.reduce((sum, ing) => {
    const lib = INGREDIENT_LIBRARY.find(l => l.name === ing.name);
    return sum + (((lib as any)?.sodium || 0) / 100) * toGrams(ing.amount, ing.unit, ing.name);
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
      const lib = INGREDIENT_LIBRARY.find(i => i.name === ing.name);
      const rawCat = lib?.category || 'other';
      const cat =
        rawCat === 'flour'     ? 'flour'    :
        rawCat === 'chocolate' ? 'flour'    :
        rawCat === 'sugar'     ? 'sugar'    :
        rawCat === 'fat'       ? 'fat'      :
        rawCat === 'egg'       ? 'egg'      :
        rawCat === 'leavening' ? 'leavener' :
        rawCat === 'dairy'     ? 'dairy'    :
        rawCat === 'liquid'    ? 'liquid'   :
        rawCat === 'infused'   ? 'fat'      :
        'other';

      // Convert ALL units to grams for ratio math
      const u = ing.unit;
      let grams =
        u === 'g'      ? ing.amount :
        u === 'kg'     ? ing.amount * 1000 :
        u === 'ml'     ? ing.amount :
        u === 'L'      ? ing.amount * 1000 :
        u === 'cups'   ? ing.amount * 240 :
        u === 'tbsp'   ? ing.amount * 14.787 :
        u === 'tsp'    ? ing.amount * 4.929 :
        u === 'oz'     ? ing.amount * 28.3495 :
        u === 'lb'     ? ing.amount * 453.592 :
        u === 'fl oz'  ? ing.amount * 29.574 :
        u === 'large'  ? ing.amount * 57 :
        u === 'medium' ? ing.amount * 44 :
        u === 'small'  ? ing.amount * 38 :
        u === 'whole'  ? ing.amount * 100 :
        u === 'cloves' ? ing.amount * 3 :
        u === 'pinch'  ? ing.amount * 0.36 :
        ing.amount; // fallback

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

    // Only run baking-science warnings if recipe has real structural flour
    // (not just cocoa powder or chocolate which are mapped to flour category)
    const hasRealFlour = ingredients.some(i => {
      const l = INGREDIENT_LIBRARY.find(lib => lib.name === i.name);
      return l?.category === 'flour' && !i.name.toLowerCase().includes('cocoa') && !i.name.toLowerCase().includes('chocolate');
    });

    if (flour === 0 || !hasRealFlour) return { warning, color };

    // High liquid ratio is expected for batters — only warn if extreme
    const isHighLiquidRecipe = totalMoisture > flour * 1.2; // pancakes, waffles etc

    if (cat === 'flour') {
      const flourToFat = flour / Math.max(fat, 1);
      if (flourToFat > 3.5 && totalMoisture < flour * 0.4) {
        warning = 'Way too much flour for this fat & moisture — baked goods will be dry and crumbly. Add more butter, eggs, or liquid.';
        color = 'red';
      } else if (flourToFat > 2.8 && totalMoisture < flour * 0.5) {
        warning = 'Flour is high relative to fat and moisture — consider adding more butter or eggs for balance.';
        color = 'yellow';
      }
    }

    if (cat === 'fat') {
      const fatToFlour = fat / Math.max(flour, 1);
      if (fatToFlour > 0.85) {
        warning = 'Too much fat — baked goods will be greasy and spread flat. Reduce butter or add more flour.';
        color = 'red';
      } else if (fatToFlour > 0.65) {
        warning = 'Fat is on the high side — expect significant spread. Consider chilling the dough before baking.';
        color = 'yellow';
      } else if (fatToFlour < 0.25 && flour > 100) {
        warning = 'Low fat for this amount of flour — baked goods may be dry and tough.';
        color = 'yellow';
      }
    }

    if (cat === 'sugar') {
      const sugarToFlour = sugar / Math.max(flour, 1);
      if (sugarToFlour > 1.2) {
        warning = 'Too much sugar — baked goods will be overly sweet, thin, and burn easily. Reduce sugar or add more flour.';
        color = 'red';
      } else if (sugarToFlour > 0.95) {
        warning = 'Sugar is high — expect more spread and browning. Watch bake time carefully.';
        color = 'yellow';
      } else if (sugarToFlour < 0.2 && flour > 100) {
        warning = 'Low sugar — result may be pale, bland, and dense.';
        color = 'yellow';
      }
    }

    if (cat === 'egg') {
      // Use real flour only (exclude cocoa) for egg ratio — brownies are intentionally egg-heavy
      const realFlour = ingredients.reduce((sum, i) => {
        const l = INGREDIENT_LIBRARY.find(lib => lib.name === i.name);
        if (l?.category === 'flour' && !i.name.toLowerCase().includes('cocoa') && !i.name.toLowerCase().includes('chocolate')) {
          const u = i.unit;
          const g = u === 'g' ? i.amount : u === 'cups' ? i.amount * 240 : u === 'tbsp' ? i.amount * 14.787 : u === 'tsp' ? i.amount * 4.929 : u === 'oz' ? i.amount * 28.35 : i.amount;
          return sum + g;
        }
        return sum;
      }, 0);
      const eggToFlour = egg / Math.max(realFlour || flour, 1);
      if (eggToFlour > 1.8) {
        warning = 'Too many eggs for this flour — result will be very puffy and cakey. Reduce eggs or add more flour.';
        color = 'red';
      } else if (eggToFlour > 1.4) {
        warning = 'High egg ratio — will lean soft and fudgy. Great for brownies, but may not suit all recipes.';
        color = 'yellow';
      }
    }

    if (cat === 'liquid' || cat === 'dairy') {
      // Skip liquid warnings for batter-style recipes (pancakes, waffles, crepes)
      // where high liquid is intentional — identified by leavening + dairy + no fat-heavy mix
      if (!isHighLiquidRecipe) {
        const liquidToFlour = totalMoisture / Math.max(flour, 1);
        if (liquidToFlour > 1.1) {
          warning = 'Way too much liquid — batter will not hold shape and won\'t bake properly.';
          color = 'red';
        } else if (liquidToFlour > 0.7) {
          warning = 'High moisture content — dough will be very soft. Chill well before baking or add more flour.';
          color = 'yellow';
        }
      }
    }

    if (cat === 'leavener') {
      const leavenerToFlour = leavener / Math.max(flour, 1);
      if (leavenerToFlour > 0.04) {
        warning = 'Too much leavener — baked goods will taste bitter and soapy. Typical is 1 tsp per 2¼ cups flour.';
        color = 'red';
      } else if (leavenerToFlour > 0.025) {
        warning = 'Leavener is on the high side — may cause excessive puffing and a slightly off taste.';
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

    // Check if recipe has real structural flour (not just cocoa/chocolate)
    const hasRealFlour = ingredients.some(i => {
      const l = INGREDIENT_LIBRARY.find(lib => lib.name === i.name);
      return l?.category === 'flour' && !i.name.toLowerCase().includes('cocoa') && !i.name.toLowerCase().includes('chocolate');
    });

    // High liquid intentional recipes (pancakes, waffles, crepes, batters)
    const isHighLiquidRecipe = hasRealFlour && totalMoisture > flour * 1.2;

    const tags: { label: string; color: string }[] = [];
    if (hasInfused) tags.push({ label: '🧪 Cannabis Infused', color: 'purple' });

    // No real flour — beverage / sauce / no-bake
    if (!hasRealFlour) {
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

    // Batter recipe — high liquid is intentional
    if (isHighLiquidRecipe) {
      return {
        headline: '🥞 Batter Recipe',
        description: 'High liquid ratio detected — this is expected for pancakes, waffles, or crepe-style batters. Ratios look correct.',
        tags: [...tags, { label: 'Batter', color: 'blue' }, { label: 'Balanced', color: 'green' }],
        severity: 'good',
      };
    }

    // For egg ratio, only count real structural flour (not cocoa/chocolate)
    // Brownies are intentionally egg-heavy — cocoa inflates "flour" total unfairly
    const realFlourOnly = ingredients.reduce((sum, ing) => {
      const l = INGREDIENT_LIBRARY.find(lib => lib.name === ing.name);
      if (l?.category === 'flour' && !ing.name.toLowerCase().includes('cocoa') && !ing.name.toLowerCase().includes('chocolate')) {
        const u = ing.unit;
        const g = u === 'g' ? ing.amount : u === 'cups' ? ing.amount * 240 : u === 'tbsp' ? ing.amount * 14.787 : u === 'tsp' ? ing.amount * 4.929 : u === 'oz' ? ing.amount * 28.35 : ing.amount;
        return sum + g;
      }
      return sum;
    }, 0);
    const eggRatio = egg / Math.max(realFlourOnly || flour, 1);

    const fatRatio      = fat      / flour;
    const sugarRatio    = sugar    / flour;
    const moistureRatio = totalMoisture / flour;
    const leavenerRatio = leavener / flour;

    const issues: string[] = [];
    let severity: 'good' | 'warning' | 'problem' = 'good';

    // Way too much liquid — bail early (but only if not an intentional batter)
    if (moistureRatio > 1.1 && !isHighLiquidRecipe) {
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

    if (eggRatio > 1.8)         { issues.push('too many eggs for this flour — result will be very puffy and cakey'); tags.push({ label: 'Too many eggs', color: 'red' }); severity = 'problem'; }
    else if (eggRatio > 1.4)   { issues.push('high egg ratio — will lean soft and cakey. Great for fudgy bakes'); tags.push({ label: 'High eggs', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    if (moistureRatio > 0.9 && !isHighLiquidRecipe) { issues.push('liquid is high — dough will be very soft, needs chilling or more flour'); tags.push({ label: 'High moisture', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    if (leavenerRatio > 0.04)   { issues.push('leavener is very high — may taste bitter or soapy'); tags.push({ label: 'Too much leavener', color: 'red' }); severity = 'problem'; }
    else if (leavenerRatio > 0.025) { issues.push('leavener is slightly high — may cause excessive puffing'); tags.push({ label: 'High leavener', color: 'yellow' }); if (severity === 'good') severity = 'warning'; }

    // Positive descriptions when balanced
    if (severity === 'good') {
      const chewy      = fatRatio >= 0.35 && fatRatio <= 0.55 && sugarRatio >= 0.4 && sugarRatio <= 0.7 && eggRatio >= 0.15 && eggRatio <= 1.0;
      const crispy     = fatRatio >= 0.3  && sugarRatio >= 0.6 && eggRatio < 0.5  && moistureRatio < 0.3;
      const cakey      = eggRatio > 0.8   && moistureRatio > 0.3 && fatRatio < 0.4;
      const buttery    = fatRatio > 0.55  && sugarRatio < 0.5;
      const fudgy      = eggRatio >= 0.8  && sugarRatio >= 0.8 && fatRatio >= 0.4 && fatRatio <= 0.8;
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
            const gPerCup = gramsPerCup[ing.name] || 227;
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

  // STEP 1: Category Selection
  if (!selectedCategory) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-2 border-green-200 rounded-2xl px-6 py-4 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-gray-900">What do you want to make?</h1>
            <p className="text-gray-500 text-sm mt-0.5">We'll calculate the exact THC per serving automatically.</p>
          </div>
          <Button
            onClick={() => setShowWhatCanIMake(!showWhatCanIMake)}
            className="bg-purple-600 hover:bg-purple-700 flex-shrink-0"
            size="sm"
          >
            <Lightbulb className="w-4 h-4 mr-2" />
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
      <div className="max-w-4xl mx-auto space-y-5">

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

        {/* Step indicator */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1.5 text-green-700 font-semibold">
            <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">✓</div>
            Category
          </div>
          <div className="flex-1 h-0.5 bg-green-200 rounded" />
          <div className="flex items-center gap-1.5 text-green-700 font-bold">
            <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</div>
            Pick a Recipe
          </div>
          <div className="flex-1 h-0.5 bg-gray-200 rounded" />
          <div className="flex items-center gap-1.5 text-gray-400">
            <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">3</div>
            Customize & Dose
          </div>
        </div>

        {/* Main question */}
        <div>
          <h1 className="text-2xl font-black text-gray-900">Choose a starting recipe</h1>
          <p className="text-gray-500 text-sm mt-1">Pick one to load — you can customize every ingredient and serving size after.</p>
        </div>

        {/* Recipe cards — horizontal list */}
        {categoryRecipes.length > 0 && (
          <div className="space-y-3">
            {categoryRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => { setRecipeType("standard"); setSelectedStandardRecipe(recipe.id); }}
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
          onClick={startCustomRecipe}
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

    // Dosing tier
    const dosingTier = thcPerServing < 2.5 ? { label: "Microdose", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" }
      : thcPerServing < 5   ? { label: "Low",       color: "text-green-700",  bg: "bg-green-50 border-green-200" }
      : thcPerServing < 15  ? { label: "Moderate",  color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200" }
      : thcPerServing < 30  ? { label: "High",       color: "text-orange-700", bg: "bg-orange-50 border-orange-200" }
      : { label: "Very High", color: "text-red-700",    bg: "bg-red-50 border-red-200" };

    // Category summary for ingredient breakdown
    const categorySummary: Record<string, number> = {};
    ingredients.forEach(ing => {
      const lib = INGREDIENT_LIBRARY.find(i => i.name === ing.name);
      const cat = lib?.category || "other";
      let g = ing.amount;
      if (ing.unit === "cups") g *= 240;
      else if (ing.unit === "tbsp") g *= 15;
      else if (ing.unit === "tsp") g *= 5;
      else if (ing.unit === "oz") g *= 28.35;
      else if (ing.unit === "lb") g *= 453.592;
      categorySummary[cat] = (categorySummary[cat] || 0) + g;
    });
    const catEmojis: Record<string, string> = {
      infused: "🧪", flour: "🌾", fat: "🧈", sugar: "🍬",
      dairy: "🥛", liquid: "💧", protein: "🥩", spice: "🌶️",
      chocolate: "🍫", egg: "🥚", leavening: "🧂", other: "📦",
      fruit: "🍓", nuts: "🥜", flavoring: "🌸", filling: "🍯", savory: "🍝",
    };

    const infusedIngredients = ingredients.filter(i => i.isInfused && i.thcPerUnit);

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
          }
        `}</style>

        {/* ── PRINT-ONLY KITCHEN RECIPE ──────────────── */}
        <div className="print-only">
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
        </div>

        {/* ── SCREEN VERSION ─────────────────────────────── */}
        <div className="screen-only max-w-7xl mx-auto">

          {/* ── TOP BAR ──────────────────────────────────────── */}
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200 no-print mb-6">
            <Button
              onClick={() => { setRecipeType(""); setSelectedStandardRecipe(""); setIngredients([]); }}
              variant="ghost" className="text-gray-600 hover:text-gray-900 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-600 text-white px-3 py-1">{category?.emoji} {category?.name}</Badge>
              <Button onClick={() => window.print()} variant="outline" size="sm"
                className="border-green-300 text-green-700 hover:bg-green-50 gap-1.5">
                <Printer className="w-4 h-4" /> Print
              </Button>
            </div>
          </div>

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
                <Button onClick={addIngredient} size="sm" className="bg-white text-green-700 hover:bg-green-50 font-bold text-xs gap-1">
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
                const lib = INGREDIENT_LIBRARY.find(i => i.name === ing.name);
                const cat = lib?.category || "other";
                return (
                  <div key={idx} className="py-2 px-3 hover:bg-gray-50/60 rounded-xl transition-colors">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base">{catEmojis[cat] || "📦"}</span>
                      <div className="flex-1 min-w-32">
                        <Select value={ing.name} onValueChange={(v) => {
                          const item = INGREDIENT_LIBRARY.find(i => i.name === v);
                          if (item) updateIngredient(idx, "name", v);
                        }}>
                          <SelectTrigger className="h-9 text-gray-900 border-gray-200 bg-white text-sm font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white max-h-[300px]">
                            {["infused","flour","sugar","fat","egg","leavening","dairy","liquid","chocolate","fruit","nuts","flavoring","spice","filling","savory"].map(cat => (
                              <>
                                <div key={`hdr-${cat}`} className="font-bold text-xs text-gray-500 px-2 py-1 mt-1 uppercase">{catEmojis[cat] || "📦"} {cat}</div>
                                {INGREDIENT_LIBRARY.filter(i => i.category === cat).map(item => (
                                  <SelectItem key={item.name} value={item.name} className="text-gray-900 text-sm">{item.name}</SelectItem>
                                ))}
                              </>
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
          <div className="grid sm:grid-cols-2 gap-4 no-print">
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
              onClick={() => window.print()}
              className="bg-white border-2 border-green-200 hover:border-green-500 rounded-2xl p-5 text-left transition-all shadow-sm hover:shadow-md group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Printer className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Print Recipe</p>
                  <p className="text-xs text-gray-500">Clean printout with all details</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">Includes ingredients, instructions, and exact THC per serving.</p>
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
                  <div className="bg-black/20 px-4 py-3 border-t border-white/10 grid grid-cols-3 gap-2">
                    {[
                      { icon: <Copy className="w-4 h-4" />, label: copied ? "Copied!" : "Copy", action: () => { const s = `${recipeName || "My Recipe"}\n${thcPerServing.toFixed(1)}mg THC per serving\n${totalTHC.toFixed(0)}mg total\n${servings} servings\n\ninfusionsensei.com`; navigator.clipboard.writeText(s); setCopied(true); setTimeout(() => setCopied(false), 2000); } },
                      { icon: <Printer className="w-4 h-4" />, label: "Print", action: () => window.print() },
                      { icon: <Share2 className="w-4 h-4" />, label: "Share", action: () => { if (navigator.share) navigator.share({ title: "Infusion Sensei", text: `${recipeName}: ${thcPerServing.toFixed(1)}mg THC per serving`, url: "https://infusionsensei.com" }); } },
                    ].map(({ icon, label, action }) => (
                      <button key={label} onClick={action}
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
