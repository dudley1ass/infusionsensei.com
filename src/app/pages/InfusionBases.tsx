import { useState, useEffect, useMemo } from "react";
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
  FlaskConical,
  Plus,
  Clock,
  Thermometer,
  Beaker,
  ChefHat,
  Cookie,
  Wine,
  UtensilsCrossed,
  Trash2,
  Save,
  Layers,
  Calculator,
} from "lucide-react";
import { toast } from "sonner";
import {
  InfusionBase,
  inferInfusionBaseRole,
  type InfusionBaseRole,
  type InfusionBaseType,
  type InfusionDoseContext,
} from "../types/infusion";
import { defaultStrains, Strain } from "../data/cannabisData";
import { CustomStrainDialog } from "../components/CustomStrainDialog";
import { safeJsonParse } from "../utils/storage";
import { cleanRecipeDisplayTitle } from "../utils/recipeDisplayTitle";

type InfusionRecipeBaseType = "butter" | "oil" | "syrup" | "liquid" | "chocolate" | "spread";

interface InfusionRecipe {
  id: string;
  name: string;
  baseType: InfusionRecipeBaseType;
  baseRole: InfusionBaseRole;
  /** mix-in = stir in finished THC (oil, cannabutter, squeeze); heat-infusion = decarb + infuse into this carrier */
  preparationMode?: "heat-infusion" | "mix-in";
  temperature: string;
  time: string;
  thcRetention: number;
  terpeneRetention: number;
  ingredients: string[];
  steps: string[];
  bestUses: string[];
  compatibleCategories: string[];
}

// Pre-made commercial THC products
interface PreMadeProduct {
  id: string;
  brand: string;
  name: string;
  type: "squeeze" | "powder" | "syrup" | "tincture" | "distillate";
  emoji: string;
  thcPerDose: number;       // mg per dose/squeeze/packet
  doseUnit: string;         // "squeeze" | "packet" | "dropper" | "ml" | "syringe"
  totalThc: number;         // mg total in package
  totalVolume?: string;     // e.g. "20ml"
  technology: string;       // e.g. "Nano-emulsification"
  onsetTime: string;
  flavors?: string[];
  bestFor: string[];
  description: string;
  dosageNote: string;
}

const preMadeProducts: PreMadeProduct[] = [
  {
    id: "select-squeeze",
    brand: "Curaleaf / Select",
    name: "Select Squeeze",
    type: "squeeze",
    emoji: "🍋",
    thcPerDose: 5,
    doseUnit: "squeeze",
    totalThc: 100,
    totalVolume: "20ml",
    technology: "Nano-emulsification",
    onsetTime: "15–30 min",
    flavors: ["Lemon-Lime", "Watermelon", "Strawberry Lemonade", "Hint of Sweet"],
    bestFor: ["Seltzer", "Tea", "Coffee", "Juice", "Any hot or cold drink"],
    description: "America's #1 cannabis oil brand squeeze enhancer. Turns any drink into a THC experience. Proprietary fill-and-pour reservoir delivers exactly 5mg per squeeze.",
    dosageNote: "1 squeeze = 5mg THC into 6–8oz of beverage. No stirring needed.",
  },
  {
    id: "zero-proof-squeeze",
    brand: "Curaleaf / Zero Proof",
    name: "Zero Proof Squeeze",
    type: "squeeze",
    emoji: "🍒",
    thcPerDose: 2.5,
    doseUnit: "squeeze",
    totalThc: 50,
    totalVolume: "20ml",
    technology: "Nano-emulsification",
    onsetTime: "15–30 min",
    flavors: ["Dash of Cherry", "Dash of Orange", "Dash of Lime", "Dash of Sweet"],
    bestFor: ["Mocktails", "Soda", "Seltzer", "Beginner-friendly drinks"],
    description: "Lighter version of Select Squeeze. Reformulated with natural sweetener for better mixability. Great for beginners or microdosing.",
    dosageNote: "1 squeeze = 2.5mg THC. Lower dose makes it easy to dial in the perfect amount.",
  },
  {
    id: "zero-proof-stir",
    brand: "Curaleaf / Zero Proof",
    name: "Zero Proof Stir",
    type: "powder",
    emoji: "🧃",
    thcPerDose: 5,
    doseUnit: "packet",
    totalThc: 50,
    technology: "Nanotechnology",
    onsetTime: "15–30 min",
    flavors: ["Peach Orange", "Berry Cherry", "Mango Lime"],
    bestFor: ["Water", "Juice", "Soda", "Any cold drink", "Social settings"],
    description: "Single-use powder packets. Low-calorie, gluten-free. Designed as a sessionable alternative to hard seltzer. Tear, pour, stir — done.",
    dosageNote: "1 packet = 5mg THC. Stir into 8–12oz of your favorite drink.",
  },
  {
    id: "thc-simple-syrup-premade",
    brand: "Generic / DIY Style",
    name: "THC Simple Syrup",
    type: "syrup",
    emoji: "🍯",
    thcPerDose: 10,
    doseUnit: "ml",
    totalThc: 200,
    totalVolume: "60ml",
    technology: "Oil-based infusion",
    onsetTime: "30–60 min",
    bestFor: ["Cocktails", "Coffee", "Tea", "Dessert drizzle", "Lemonade"],
    description: "Thick, sweet THC-infused syrup. Agave or simple syrup style. Measured with a cap or spoon. Mix into drinks, drizzle on desserts, or take straight.",
    dosageNote: "~10mg per 1ml serving. Use a measured dropper or syringe for accuracy.",
  },
  {
    id: "thc-tincture-dropper",
    brand: "Generic / Dispensary",
    name: "THC Tincture (Dropper)",
    type: "tincture",
    emoji: "💧",
    thcPerDose: 5,
    doseUnit: "dropper",
    totalThc: 300,
    totalVolume: "30ml",
    technology: "Alcohol or glycerin-based",
    onsetTime: "15–45 min (sublingual faster)",
    bestFor: ["Sublingual drops", "Coffee", "Tea", "Precise micro-dosing", "Beverages"],
    description: "Liquid THC with a dropper for precise dosing. Can be added to drinks or taken directly under the tongue for faster absorption.",
    dosageNote: "1 dropper = ~5mg. Sublingual (under tongue) = faster onset. In a drink = slower onset.",
  },
  {
    id: "thc-distillate-syringe",
    brand: "Generic / Dispensary",
    name: "THC Distillate Syringe",
    type: "distillate",
    emoji: "💉",
    thcPerDose: 25,
    doseUnit: "0.1ml",
    totalThc: 1000,
    totalVolume: "1ml syringe",
    technology: "Concentrated distillate",
    onsetTime: "30–90 min",
    bestFor: ["DIY edibles", "Drinks", "Food", "Sublingual", "Maximum potency"],
    description: "Highly concentrated THC oil in a syringe. 500–1000mg+ total THC. The most versatile and potent option. Use for DIY edibles, add to food or drinks, or take sublingually.",
    dosageNote: "⚠️ Very potent — easy to overdo. Start with 0.1ml (~25mg). Measure carefully.",
  },
];

const infusionRecipes: InfusionRecipe[] = [
  // BUTTER RECIPES
  {
    id: "classic-cannabutter",
    name: "Classic Cannabutter",
    baseType: "butter",
    baseRole: "cooking",
    temperature: "160-180°F (71-82°C)",
    time: "2-3 hours",
    thcRetention: 85,
    terpeneRetention: 60,
    ingredients: [
      "1 cup (227g) unsalted butter",
      "7-10g decarboxylated cannabis",
      "1 cup water"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Melt butter in saucepan with water on low heat",
      "Add decarbed cannabis and maintain 160-180°F",
      "Simmer for 2-3 hours, stirring occasionally",
      "Strain through cheesecloth into container",
      "Refrigerate until butter solidifies, discard water"
    ],
    bestUses: ["Baked goods", "Sautéing", "Spreading", "Finishing dishes"],
    compatibleCategories: ["cookies", "savory"]
  },
  {
    id: "low-temp-butter",
    name: "Low-Temp Terpene Butter",
    baseType: "butter",
    baseRole: "cooking",
    temperature: "130-140°F (54-60°C)",
    time: "4-6 hours",
    thcRetention: 75,
    terpeneRetention: 90,
    ingredients: [
      "1 cup (227g) unsalted butter",
      "7-10g decarboxylated cannabis",
      "1 cup water",
      "Sous vide setup (optional)"
    ],
    steps: [
      "Decarboxylate cannabis at 230°F for 45 minutes (preserves terpenes)",
      "Combine butter, cannabis, and water in mason jar or sous vide bag",
      "Maintain 130-140°F for 4-6 hours",
      "Strain through cheesecloth",
      "Refrigerate and separate from water"
    ],
    bestUses: ["Flavorful baked goods", "Finishing butter", "Flavor-forward cooking"],
    compatibleCategories: ["cookies", "savory"]
  },
  {
    id: "cannabis-ghee",
    name: "Cannabis Ghee (Clarified Butter)",
    baseType: "butter",
    baseRole: "cooking",
    temperature: "190-220°F (88-104°C)",
    time: "2-4 hours",
    thcRetention: 88,
    terpeneRetention: 55,
    ingredients: [
      "2 cups (454g) unsalted butter (yields ~1.5 cups ghee)",
      "7-14g decarboxylated cannabis",
      "Heavy-bottom saucepan or slow cooker",
      "Cheesecloth"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Melt butter slowly over low heat until milk solids separate and sink",
      "Skim foam; carefully pour off clear golden fat (ghee), leaving water and solids",
      "Return ghee to pan on low heat, add decarbed cannabis",
      "Maintain 190-220°F and infuse 2-4 hours without burning plant matter",
      "Strain through cheesecloth while hot; store in glass jar",
      "Ghee is shelf-stable longer than butter — still label potency and date"
    ],
    bestUses: ["High-heat sauté", "Curries", "Popcorn", "South Asian recipes", "Butter replacement when you need higher smoke point"],
    compatibleCategories: ["savory", "cookies"]
  },

  // OIL RECIPES
  {
    id: "coconut-oil",
    name: "Coconut oil",
    baseType: "oil",
    baseRole: "cooking",
    temperature: "170-180°F (77-82°C)",
    time: "2-4 hours",
    thcRetention: 90,
    terpeneRetention: 65,
    ingredients: [
      "1 cup (200g) coconut oil",
      "7-10g decarboxylated cannabis"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Melt coconut oil in double boiler or crockpot",
      "Add decarbed cannabis, maintain 170-180°F",
      "Infuse for 2-4 hours, stirring occasionally",
      "Strain through cheesecloth into jar",
      "Store at room temperature or refrigerate"
    ],
    bestUses: ["Baking", "Smoothies", "Coffee", "Cooking oil"],
    compatibleCategories: ["cookies", "drinks", "savory"]
  },
  {
    id: "olive-oil",
    name: "Cannabis Olive Oil",
    baseType: "oil",
    baseRole: "cooking",
    temperature: "180-200°F (82-93°C)",
    time: "1.5-3 hours",
    thcRetention: 85,
    terpeneRetention: 55,
    ingredients: [
      "1 cup (220ml) extra virgin olive oil",
      "7-14g decarboxylated cannabis"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Combine olive oil and cannabis in saucepan",
      "Heat to 180-200°F (don't exceed 200°F)",
      "Simmer for 1.5-3 hours, stir every 20 minutes",
      "Strain through fine mesh or cheesecloth",
      "Store in dark glass bottle"
    ],
    bestUses: ["Salad dressings", "Drizzling", "Pasta", "Savory cooking"],
    compatibleCategories: ["savory"]
  },

  // SYRUP RECIPES
  {
    id: "thc-simple-syrup",
    name: "THC Simple Syrup",
    baseType: "syrup",
    baseRole: "cooking",
    temperature: "140-160°F (60-71°C)",
    time: "30-60 minutes",
    thcRetention: 70,
    terpeneRetention: 45,
    ingredients: [
      "1 cup sugar",
      "1 cup water",
      "2-5g decarboxylated cannabis or 1/4 cup tincture",
      "1 tsp vegetable glycerin (optional)"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Combine sugar and water in saucepan",
      "Heat to 140-160°F until sugar dissolves",
      "Add cannabis and simmer for 30-60 minutes",
      "Strain through fine mesh strainer",
      "Add glycerin for thickness (optional), bottle and store"
    ],
    bestUses: ["Cocktails", "Coffee", "Tea", "Sodas", "Desserts"],
    compatibleCategories: ["drinks"]
  },
  {
    id: "agave-syrup",
    name: "Cannabis Agave Syrup",
    baseType: "syrup",
    baseRole: "cooking",
    temperature: "130-150°F (54-66C)",
    time: "2-3 hours",
    thcRetention: 80,
    terpeneRetention: 70,
    ingredients: [
      "1 cup agave nectar",
      "3-7g decarboxylated cannabis"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Gently warm agave to 130-150°F in double boiler",
      "Add finely ground decarbed cannabis",
      "Maintain low heat for 2-3 hours, stir frequently",
      "Strain through cheesecloth or coffee filter",
      "Store in squeeze bottle"
    ],
    bestUses: ["Sweetening drinks", "Drizzling", "Cocktails", "Baking"],
    compatibleCategories: ["drinks", "cookies"]
  },

  // LIQUID RECIPES
  {
    id: "alcohol-tincture",
    name: "Alcohol Tincture",
    baseType: "liquid",
    baseRole: "cooking",
    temperature: "Room temperature",
    time: "2-6 weeks (or 3 hours quick method)",
    thcRetention: 95,
    terpeneRetention: 85,
    ingredients: [
      "7-14g decarboxylated cannabis",
      "2 cups high-proof alcohol (Everclear/vodka 151+)",
      "Mason jar"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Grind cannabis finely and place in mason jar",
      "Cover with alcohol, seal jar tightly",
      "Shake well and store in cool, dark place",
      "Shake daily for 2-6 weeks (or heat gently at 170°F for 3 hours)",
      "Strain through coffee filter, store in dropper bottles"
    ],
    bestUses: ["Sublingual drops", "Drink mixer", "Fast-acting", "Precise dosing"],
    compatibleCategories: ["drinks"]
  },
  {
    id: "mct-oil-tincture",
    name: "MCT Oil Tincture",
    baseType: "liquid",
    baseRole: "cooking",
    temperature: "160-180°F (71-82°C)",
    time: "2-3 hours",
    thcRetention: 90,
    terpeneRetention: 70,
    ingredients: [
      "1 cup MCT oil",
      "7-10g decarboxylated cannabis"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Combine MCT oil and cannabis in double boiler",
      "Maintain 160-180°F for 2-3 hours",
      "Stir every 30 minutes",
      "Strain through cheesecloth into dropper bottles",
      "Store in cool, dark place"
    ],
    bestUses: ["Sublingual", "Coffee", "Smoothies", "Quick absorption"],
    compatibleCategories: ["drinks"]
  },

  // CREAM RECIPES
  {
    id: "heavy-cream-infusion",
    name: "Cannabis Heavy Cream",
    baseType: "liquid",
    baseRole: "cooking",
    temperature: "160-175°F (71-79°C)",
    time: "2-3 hours",
    thcRetention: 85,
    terpeneRetention: 65,
    ingredients: [
      "1 cup (240ml) heavy cream (36% fat)",
      "7-10g decarboxylated cannabis",
      "Double boiler or slow cooker"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Pour heavy cream into double boiler over simmering water",
      "Add decarboxylated cannabis to the cream",
      "Maintain temperature at 160-175°F — do NOT boil (cream will scald)",
      "Infuse for 2-3 hours, stirring every 20 minutes",
      "Strain through fine cheesecloth into airtight container",
      "Refrigerate immediately — use within 5-7 days",
      "Can be whipped, used in ice cream bases, sauces, or ganache"
    ],
    bestUses: ["Ice cream base", "Whipped cream", "Ganache", "Pasta sauces", "Soups", "Coffee creamer"],
    compatibleCategories: ["drinks", "cookies", "savory"]
  },
  {
    id: "light-cream-infusion",
    name: "Cannabis Light Cream",
    baseType: "liquid",
    baseRole: "cooking",
    temperature: "155-170°F (68-77°C)",
    time: "2-3 hours",
    thcRetention: 78,
    terpeneRetention: 60,
    ingredients: [
      "1 cup (240ml) light cream or half-and-half (18-30% fat)",
      "5-7g decarboxylated cannabis",
      "Double boiler"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Heat light cream in double boiler to 155-170°F",
      "Add decarboxylated cannabis",
      "Maintain low heat — light cream scorches more easily than heavy cream",
      "Infuse for 2-3 hours, stirring frequently",
      "Strain through fine cheesecloth",
      "Store refrigerated and use within 5 days"
    ],
    bestUses: ["Coffee creamer", "Lighter sauces", "Soups", "Ice cream (lighter)", "Baking"],
    compatibleCategories: ["drinks", "cookies", "savory"]
  },
  {
    id: "dark-chocolate-infusion",
    name: "Infused Dark Chocolate",
    baseType: "chocolate",
    baseRole: "both",
    temperature: "115-120°F (46-49°C)",
    time: "45-60 min",
    thcRetention: 88,
    terpeneRetention: 70,
    ingredients: [
      "200g (7oz) dark chocolate (60-70% cacao), chopped",
      "2 tbsp coconut oil",
      "Pinch of flaky sea salt",
      "Silicone molds or parchment-lined tray"
    ],
    steps: [
      "Make infused coconut oil first using your preferred infusion method",
      "Melt chocolate in double boiler — keep below 120°F to preserve THC",
      "Remove from heat, stir in coconut oil completely",
      "Add sea salt and stir until smooth",
      "Pour into molds or spread on parchment",
      "Refrigerate 30-45 min until fully set",
      "Store in airtight container in refrigerator up to 3 weeks"
    ],
    bestUses: ["Chocolate bars", "Popcorn drizzle", "Baking", "Fondue", "Dessert coating"],
    compatibleCategories: ["desserts", "popcorn", "candy"]
  },
  {
    id: "milk-chocolate-infusion",
    name: "Infused Milk Chocolate",
    baseType: "chocolate",
    baseRole: "both",
    temperature: "110-115°F (43-46°C)",
    time: "45-60 min",
    thcRetention: 85,
    terpeneRetention: 65,
    ingredients: [
      "200g (7oz) milk chocolate chips or chopped bar",
      "2 tbsp coconut oil",
      "Optional: 1 tsp vanilla extract"
    ],
    steps: [
      "Make infused coconut oil first",
      "Melt milk chocolate gently — it burns more easily than dark",
      "Keep temperature below 115°F throughout",
      "Stir in coconut oil and vanilla if using",
      "Pour into molds, top with toppings if desired",
      "Refrigerate 30 min until set"
    ],
    bestUses: ["Candy bars", "Dipping fruit", "Popcorn drizzle", "Hot chocolate"],
    compatibleCategories: ["desserts", "popcorn", "candy"]
  },
  {
    id: "white-chocolate-infusion",
    name: "Infused White Chocolate",
    baseType: "chocolate",
    baseRole: "both",
    temperature: "105-110°F (40-43°C)",
    time: "30-45 min",
    thcRetention: 82,
    terpeneRetention: 60,
    ingredients: [
      "200g (7oz) white chocolate chips (use real cocoa butter, not coating)",
      "2 tbsp coconut oil",
      "Pinch of salt"
    ],
    steps: [
      "Make infused coconut oil first",
      "White chocolate scorches easily — melt very gently below 110°F",
      "Stir constantly while melting",
      "Add coconut oil and stir until smooth",
      "Pour into molds immediately",
      "Refrigerate 30 min until set"
    ],
    bestUses: ["Popcorn drizzle", "Cookies & Cream coating", "Fruit dipping", "Bark"],
    compatibleCategories: ["desserts", "popcorn", "candy"]
  },

  // READY-TO-EAT / SPREAD CARRIERS (delivery layer — eat, spread, or bake with)
  {
    id: "infused-peanut-butter",
    name: "Infused Peanut Butter",
    baseType: "spread",
    baseRole: "both",
    preparationMode: "heat-infusion",
    temperature: "110-130°F (43-54°C)",
    time: "1-2 hours",
    thcRetention: 82,
    terpeneRetention: 55,
    ingredients: [
      "2 cups (480g) creamy natural peanut butter (oil on top is OK)",
      "3-10g decarboxylated cannabis (finely ground)",
      "Double boiler or very low slow cooker"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "Warm peanut butter gently until stirrable and smooth — do not fry or smoke the oil",
      "Stir in decarbed cannabis; hold 110-130°F for 1-2 hours, stirring often",
      "Optional: blend briefly for even texture (don't aerate hot oil)",
      "Cool slightly and jar; stir before each use — oils can separate",
      "Label mg per tablespoon and date"
    ],
    bestUses: ["Toast & sandwiches", "Smoothies", "Cookies & energy balls", "Straight off a spoon (vet potency first)"],
    compatibleCategories: ["cookies", "snacks", "breakfast"]
  },
  {
    id: "infused-honey",
    name: "Infused Honey",
    baseType: "spread",
    baseRole: "both",
    preparationMode: "mix-in",
    temperature: "95-115°F (35-46°C)",
    time: "4-8 hours (or overnight)",
    thcRetention: 72,
    terpeneRetention: 50,
    ingredients: [
      "2 cups (680g) runny honey",
      "2-8g decarboxylated cannabis OR coconut oil stirred in",
      "Jar with tight lid, warm water bath"
    ],
    steps: [
      "Decarboxylate cannabis at 240°F for 40 minutes",
      "If using flower: add to honey in jar, seal, and warm-water bath at body temp — never boil honey",
      "Infuse low and slow 4-8 hours, shaking occasionally; strain if using flower",
      "Alternative: stir warm liquid coconut oil infusion into honey off heat until uniform",
      "Store at room temp; crystallized honey can be rewarmed gently in a water bath"
    ],
    bestUses: ["Tea & yogurt", "Drizzle on fruit", "Peanut butter & honey", "Dressings & glazes"],
    compatibleCategories: ["drinks", "desserts", "breakfast"]
  },
  {
    id: "infused-cream-cheese",
    name: "Infused Cream Cheese",
    baseType: "spread",
    baseRole: "both",
    preparationMode: "mix-in",
    temperature: "100-120°F (38-49°C)",
    time: "30-90 minutes",
    thcRetention: 78,
    terpeneRetention: 50,
    ingredients: [
      "16 oz (452g) full-fat cream cheese, cubed",
      "1-3 tbsp finished cannabutter or MCT infusion (avoid grainy texture)",
      "Stand mixer or food processor (optional)"
    ],
    steps: [
      "Soften cream cheese until pliable — do not melt it into oil",
      "Add measured infused fat and beat until completely smooth",
      "If using emulsified butter, fold in slowly to avoid breaking texture",
      "Taste is dairy-forward — potency comes from the infused fat you add",
      "Refrigerate in airtight container; label mg per typical bagel schmear (~1 tbsp)"
    ],
    bestUses: ["Bagels", "Cheesecake filling", "Dips & frostings base", "Stuffed peppers"],
    compatibleCategories: ["breakfast", "desserts", "savory"]
  },
  {
    id: "infused-chocolate-spread",
    name: "Infused Chocolate Hazelnut Spread (style)",
    baseType: "spread",
    baseRole: "both",
    preparationMode: "mix-in",
    temperature: "105-115°F (40-46°C)",
    time: "20-40 minutes",
    thcRetention: 85,
    terpeneRetention: 58,
    ingredients: [
      "1 cup chocolate-hazelnut spread or dark chocolate + hazelnut butter blend",
      "2-4 tbsp coconut oil (measured, very warm but not smoking)",
      "Pinch of salt, pinch of espresso powder (optional)"
    ],
    steps: [
      "Have coconut oil infusion ready and liquid but cool enough to handle",
      "Warm spread slowly until just stirrable; remove from heat",
      "Whisk in oil in small additions until glossy — stop if it separates",
      "Jar when slightly warm; refrigerate if your blend is perishable"
    ],
    bestUses: ["Toast", "Fruit dip", "Crepes", "Spoon dose (verify per tbsp)"],
    compatibleCategories: ["breakfast", "desserts", "snacks"]
  },
  {
    id: "infused-buttercream-frosting",
    name: "Cannabutter buttercream / frosting base",
    baseType: "spread",
    baseRole: "both",
    preparationMode: "mix-in",
    temperature: "Room temperature mix",
    time: "15-20 minutes",
    thcRetention: 85,
    terpeneRetention: 45,
    ingredients: [
      "1 cup (2 sticks) unsalted butter, softened",
      "3-4 cups powdered sugar, sifted",
      "1-2 tbsp milk or cream",
      "Replace part of butter with cannabutter based on your target dose"
    ],
    steps: [
      "Calculate how much cannabutter you need for the batch potency; balance the rest with plain butter",
      "Beat butters until airy, add sugar gradually, thin with milk to spread",
      "If frosting gets warm, chill before piping — heat wastes terpenes",
      "Always label finished cake slices with mg per serving"
    ],
    bestUses: ["Cupcakes", "Cake filling", "Cookie sandwiches"],
    compatibleCategories: ["cookies", "desserts"]
  },
  {
    id: "infused-soft-caramel",
    name: "Infused Soft Caramel (spreadable)",
    baseType: "spread",
    baseRole: "both",
    preparationMode: "mix-in",
    temperature: "240-248°F (116-120°C) sugar stage, then finish low",
    time: "45-60 minutes",
    thcRetention: 70,
    terpeneRetention: 35,
    ingredients: [
      "1 cup heavy cream",
      "1 cup sugar + 6 tbsp butter",
      "Finished cannabis cream or small amount of cannabutter whisked in off heat",
      "Candy thermometer"
    ],
    steps: [
      "Make caramel to a soft-ball stage using a trusted recipe — sugar work is hot",
      "Off heat, whisk in infused cream or butter in small additions (avoid splatter)",
      "Pour into silicone mold or jar; refrigerate to set to spreadable texture",
      "High sugar + heat = less predictable terpenes — dose by weight of finished batch"
    ],
    bestUses: ["Apple dip", "Ice cream swirl", "Brownie layer", "Straight (cut small)"],
    compatibleCategories: ["desserts", "snacks"]
  }
];

type InfusionLayer = "none" | "cooking" | "ready-to-eat" | "premade";

type BaseCategory = "none" | "butter" | "oil" | "syrup" | "liquid" | "cream" | "chocolate" | "spreads";

function matchesInfusionLayer(recipe: InfusionRecipe, layer: "cooking" | "ready-to-eat"): boolean {
  if (layer === "cooking") {
    if (recipe.baseType === "spread") return false;
    return recipe.baseRole === "cooking" || recipe.baseRole === "both";
  }
  return recipe.baseType === "spread";
}

function recipeMatchesCategory(recipe: InfusionRecipe, category: BaseCategory): boolean {
  if (category === "none") return false;
  if (category === "cream") return recipe.baseType === "liquid" && recipe.id.includes("cream");
  if (category === "chocolate") return recipe.baseType === "chocolate";
  if (category === "spreads") return recipe.baseType === "spread";
  return recipe.baseType === category;
}

function mapRecipeToInfusionType(recipe: InfusionRecipe): InfusionBaseType {
  switch (recipe.id) {
    case "cannabis-ghee":
      return "ghee";
    case "olive-oil":
      return "olive-oil";
    case "coconut-oil":
      return "coconut-oil";
    case "thc-simple-syrup":
      return "simple-syrup";
    case "agave-syrup":
      return "agave-syrup";
    case "alcohol-tincture":
      return "tincture";
    case "mct-oil-tincture":
      return "mct-oil";
    case "heavy-cream-infusion":
    case "light-cream-infusion":
      return "cream";
    case "dark-chocolate-infusion":
    case "milk-chocolate-infusion":
    case "white-chocolate-infusion":
      return "chocolate";
    case "infused-peanut-butter":
      return "peanut-butter";
    case "infused-honey":
      return "honey";
    case "infused-cream-cheese":
      return "cream-cheese";
    case "infused-chocolate-spread":
      return "chocolate-spread";
    case "infused-buttercream-frosting":
      return "frosting";
    case "infused-soft-caramel":
      return "caramel";
    default:
      if (recipe.baseType === "butter") return "butter";
      if (recipe.baseType === "oil") return "coconut-oil";
      if (recipe.baseType === "syrup") return "simple-syrup";
      if (recipe.baseType === "liquid") return "tincture";
      if (recipe.baseType === "spread") return "peanut-butter";
      return "butter";
  }
}

function doseContextForRecipe(recipe: InfusionRecipe): InfusionDoseContext {
  if (recipe.baseType === "spread") return "per-tablespoon";
  return "per-gram";
}

function isHeatInfusionRecipe(recipe: InfusionRecipe | null): boolean {
  if (!recipe) return true;
  return (recipe.preparationMode ?? "heat-infusion") === "heat-infusion";
}

function infusedAmountToApproxGrams(amount: number, baseUnit: string): number {
  const u = baseUnit.toLowerCase().trim();
  if (u === "g" || u === "grams") return amount;
  if (u === "ml") return amount * 0.95;
  if (u === "oz") return amount * 28.3495;
  if (u === "tbsp") return amount * 14.2;
  if (u === "cup" || u === "cups") return amount * 227;
  return 0;
}

type MixInSourceSelection = "" | `saved:${string}` | `premade:${string}` | "custom";

type MixInComputeResult = {
  totalTHC: number;
  totalBatchGrams: number;
  thcPerGram: number;
  thcPerServing: number;
  infusionUnitLabel: string;
  strainName: string;
  sourceDescription: string;
  thcPercentForSave: number;
  cannabisAmountSave: number;
  cannabisUnitSave: "grams" | "ounces";
  error?: string;
};

function computeMixInResult(
  source: MixInSourceSelection,
  infusedAmount: number,
  plainBaseGrams: number,
  servings: number,
  customMgPerUnit: number,
  bases: InfusionBase[],
  products: PreMadeProduct[]
): MixInComputeResult {
  const bad = (msg: string): MixInComputeResult => ({
    totalTHC: 0,
    totalBatchGrams: 0,
    thcPerGram: 0,
    thcPerServing: 0,
    infusionUnitLabel: "",
    strainName: "",
    sourceDescription: "",
    thcPercentForSave: 0,
    cannabisAmountSave: 0,
    cannabisUnitSave: "grams",
    error: msg,
  });

  if (!source) return bad("Choose a THC source from your saved infusions or the store-bought list.");
  if (infusedAmount <= 0) return bad("Enter how much infused product you are mixing in.");
  if (plainBaseGrams <= 0) return bad("Enter plain base weight in grams (unmedicated cream cheese, honey, etc.).");
  if (servings <= 0) return bad("Enter number of servings in the finished batch.");

  if (source === "custom") {
    if (customMgPerUnit <= 0) return bad("Enter mg of THC per 1 unit for your custom source (e.g. mg per ml or per gram).");
    const totalTHC = infusedAmount * customMgPerUnit;
    const totalBatchGrams = plainBaseGrams;
    if (totalBatchGrams <= 0) return bad("Batch weight must be greater than zero.");
    const thcPerGram = totalTHC / totalBatchGrams;
    const thcPerServing = totalTHC / servings;
    return {
      totalTHC,
      totalBatchGrams,
      thcPerGram,
      thcPerServing,
      infusionUnitLabel: "unit",
      strainName: "Custom potency",
      sourceDescription: `Custom: ${customMgPerUnit} mg per unit × ${infusedAmount} units`,
      thcPercentForSave: 0,
      cannabisAmountSave: 0,
      cannabisUnitSave: "grams",
    };
  }

  if (source.startsWith("premade:")) {
    const id = source.slice(8);
    const p = products.find((x) => x.id === id);
    if (!p) return bad("Store product not found.");
    const totalTHC = infusedAmount * p.thcPerDose;
    const totalBatchGrams = plainBaseGrams;
    const thcPerGram = totalTHC / totalBatchGrams;
    const thcPerServing = totalTHC / servings;
    return {
      totalTHC,
      totalBatchGrams,
      thcPerGram,
      thcPerServing,
      infusionUnitLabel: p.doseUnit,
      strainName: p.name,
      sourceDescription: `${p.brand} – ${p.name} (${p.thcPerDose} mg / ${p.doseUnit})`,
      thcPercentForSave: 0,
      cannabisAmountSave: 0,
      cannabisUnitSave: "grams",
    };
  }

  if (source.startsWith("saved:")) {
    const id = source.slice(6);
    const b = bases.find((x) => x.id === id);
    if (!b) return bad("That saved infusion is missing — pick another or build it in Infusions first.");
    const totalTHC = infusedAmount * b.thcPerUnit;
    const infusedG = infusedAmountToApproxGrams(infusedAmount, b.baseUnit);
    const totalBatchGrams = plainBaseGrams + infusedG;
    const thcPerGram = totalTHC / totalBatchGrams;
    const thcPerServing = totalTHC / servings;
    return {
      totalTHC,
      totalBatchGrams,
      thcPerGram,
      thcPerServing,
      infusionUnitLabel: b.baseUnit,
      strainName: b.strainName,
      sourceDescription: `${b.name} (${b.thcPerUnit} mg / ${b.baseUnit})`,
      thcPercentForSave: b.thcPercentage,
      cannabisAmountSave: b.cannabisAmount,
      cannabisUnitSave: b.cannabisUnit,
    };
  }

  return bad("Invalid THC source.");
}

export function InfusionBases() {
  const [infusionBases, setInfusionBases] = useState<InfusionBase[]>([]);
  
  // Custom strains from localStorage
  const [customStrains, setCustomStrains] = useState<Strain[]>([]);
  const [allStrains, setAllStrains] = useState<Strain[]>(defaultStrains);

  // Form state
  const [selectedStrain, setSelectedStrain] = useState<string>("none");
  const [isCustomStrain, setIsCustomStrain] = useState(false);
  
  // Custom strain fields
  const [customStrainName, setCustomStrainName] = useState("");
  const [customThc, setCustomThc] = useState(20);
  const [customCbd, setCustomCbd] = useState(0);
  
  const [infusionLayer, setInfusionLayer] = useState<InfusionLayer>("none");
  const [selectedBaseType, setSelectedBaseType] = useState<BaseCategory>("none");
  const [selectedProduct, setSelectedProduct] = useState<PreMadeProduct | null>(null);
  const [productDoses, setProductDoses] = useState<number>(1);
  const [selectedRecipe, setSelectedRecipe] = useState<InfusionRecipe | null>(null);
  const [cannabisAmount, setCannabisAmount] = useState(7);
  const [baseAmount, setBaseAmount] = useState(227);
  
  // Temperature and time controls
  const [customTemp, setCustomTemp] = useState(160);
  const [customTime, setCustomTime] = useState(2);

  // Mix-in (ready-to-eat, no decarb in carrier)
  const [mixInSource, setMixInSource] = useState<MixInSourceSelection>("");
  const [mixInInfusedAmount, setMixInInfusedAmount] = useState(28);
  const [mixInPlainBaseGrams, setMixInPlainBaseGrams] = useState(452);
  const [mixInServings, setMixInServings] = useState(16);
  const [mixInCustomMgPerUnit, setMixInCustomMgPerUnit] = useState(10);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("infusionBases");
    setInfusionBases(safeJsonParse<InfusionBase[]>(saved, []));

    const savedCustomStrains = localStorage.getItem("customStrains");
    const parsed = safeJsonParse<Strain[]>(savedCustomStrains, []);
    setCustomStrains(parsed);
    setAllStrains([...defaultStrains, ...parsed]);
  }, []);

  useEffect(() => {
    if (infusionLayer === "ready-to-eat") {
      setSelectedBaseType("spreads");
    } else if (infusionLayer === "cooking") {
      setSelectedBaseType((prev) => (prev === "spreads" ? "none" : prev));
    } else if (infusionLayer === "none" || infusionLayer === "premade") {
      setSelectedBaseType("none");
    }
  }, [infusionLayer]);

  useEffect(() => {
    setSelectedRecipe(null);
  }, [infusionLayer, selectedBaseType]);

  useEffect(() => {
    if (selectedRecipe?.preparationMode === "mix-in") {
      setMixInSource("");
      setMixInInfusedAmount(28);
      setMixInPlainBaseGrams(452);
      setMixInServings(16);
      setMixInCustomMgPerUnit(10);
    }
  }, [selectedRecipe?.id]);

  // Save to localStorage
  const saveToStorage = (bases: InfusionBase[]) => {
    localStorage.setItem("infusionBases", JSON.stringify(bases));
    setInfusionBases(bases);
  };

  const handleStrainChange = (value: string) => {
    setSelectedStrain(value);
    if (value === "custom") {
      setIsCustomStrain(true);
    } else {
      setIsCustomStrain(false);
      const strain = allStrains.find((s) => s.name === value);
      if (strain && strain.cannabinoids) {
        setCustomThc(strain.cannabinoids.thc);
        setCustomCbd(strain.cannabinoids.cbd || 0);
      }
    }
  };

  const handleSaveInfusion = () => {
    if (!selectedRecipe) {
      toast.error("Please select an infusion recipe");
      return;
    }

    const isMixIn = selectedRecipe.preparationMode === "mix-in";

    if (!isMixIn) {
      if (selectedStrain === "none") {
        toast.error("Please select a strain");
        return;
      }
      if (isCustomStrain && !customStrainName.trim()) {
        toast.error("Please enter a custom strain name");
        return;
      }
    }

    const doseCtx = doseContextForRecipe(selectedRecipe);
    const roleTags =
      selectedRecipe.baseRole === "both"
        ? "🔧 Cooking-ready carrier · 🍯 Ready-to-eat / spreadable"
        : selectedRecipe.baseRole === "ready-to-eat"
          ? "🍯 Ready-to-eat"
          : "🔧 Cooking base";

    let infusionBase: InfusionBase;

    if (isMixIn) {
      const mix = computeMixInResult(
        mixInSource,
        mixInInfusedAmount,
        mixInPlainBaseGrams,
        mixInServings,
        mixInCustomMgPerUnit,
        infusionBases,
        preMadeProducts
      );
      if (mix.error) {
        toast.error(mix.error);
        return;
      }
      infusionBase = {
        id: Date.now().toString(),
        name: `${mix.strainName} · ${selectedRecipe.name}`,
        type: mapRecipeToInfusionType(selectedRecipe),
        baseRole: selectedRecipe.baseRole,
        doseContext: doseCtx,
        createdDate: new Date().toISOString(),
        cannabisAmount: mix.cannabisAmountSave,
        cannabisUnit: mix.cannabisUnitSave,
        strainName: mix.strainName,
        thcPercentage: mix.thcPercentForSave,
        baseAmount: parseFloat(mix.totalBatchGrams.toFixed(1)),
        baseUnit: "g",
        totalTHC: parseFloat(mix.totalTHC.toFixed(2)),
        thcPerUnit: parseFloat(mix.thcPerGram.toFixed(3)),
        notes: `${roleTags}\n🍯 Mix-in — no decarb in this carrier step\n${mix.sourceDescription}\nMixed in: ${mixInInfusedAmount} ${mix.infusionUnitLabel}\nPlain base: ${mixInPlainBaseGrams} g\nEstimated batch: ${mix.totalBatchGrams.toFixed(0)} g · ${mixInServings} servings → ${mix.thcPerServing.toFixed(2)} mg THC each\n\n${selectedRecipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
      };
    } else {
      const thcPercentage = customThc;
      const weightInGrams = cannabisAmount;
      const totalTHC = (weightInGrams * 1000 * (thcPercentage / 100)) * (retention.thcRetention / 100);
      const thcPerGram = totalTHC / baseAmount;

      infusionBase = {
        id: Date.now().toString(),
        name: isCustomStrain ? `${customStrainName} ${selectedRecipe.name}` : `${selectedStrain} ${selectedRecipe.name}`,
        type: mapRecipeToInfusionType(selectedRecipe),
        baseRole: selectedRecipe.baseRole,
        doseContext: doseCtx,
        createdDate: new Date().toISOString(),
        cannabisAmount,
        cannabisUnit: "grams",
        strainName: isCustomStrain ? customStrainName : selectedStrain,
        thcPercentage,
        baseAmount,
        baseUnit: "g",
        totalTHC: parseFloat(totalTHC.toFixed(2)),
        thcPerUnit: parseFloat(thcPerGram.toFixed(2)),
        notes: `${roleTags}\n🌡️ ${selectedRecipe.temperature} for ${selectedRecipe.time}\n📊 THC Retention: ${selectedRecipe.thcRetention}% | Terpene Retention: ${selectedRecipe.terpeneRetention}%\n\n${selectedRecipe.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
      };
    }

    const updatedBases = [...infusionBases, infusionBase];
    saveToStorage(updatedBases);
    toast.success("Infusion saved!");

    // Reset form
    setSelectedStrain("none");
    setInfusionLayer("none");
    setSelectedBaseType("none");
    setSelectedRecipe(null);
    setIsCustomStrain(false);
    setCustomStrainName("");
    setCustomThc(20);
    setCustomCbd(0);
    setCannabisAmount(7);
    setBaseAmount(227);
    setMixInSource("");
    setMixInInfusedAmount(28);
    setMixInPlainBaseGrams(452);
    setMixInServings(16);
    setMixInCustomMgPerUnit(10);
  };

  const handleSaveProduct = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    const totalTHC = selectedProduct.thcPerDose * productDoses;
    const infusionBase: InfusionBase = {
      id: Date.now().toString(),
      name: `${selectedProduct.brand} – ${selectedProduct.name}`,
      type: "tincture",
      baseRole: "ready-to-eat",
      doseContext: "per-serving",
      createdDate: new Date().toISOString(),
      cannabisAmount: 0,
      cannabisUnit: "grams",
      strainName: selectedProduct.type.charAt(0).toUpperCase() + selectedProduct.type.slice(1),
      thcPercentage: 0,
      baseAmount: productDoses,
      baseUnit: selectedProduct.doseUnit,
      totalTHC: parseFloat(totalTHC.toFixed(2)),
      thcPerUnit: selectedProduct.thcPerDose,
      notes: `🛒 Store-bought · 🍯 Ready-to-eat\n📦 ${selectedProduct.brand} | ${selectedProduct.name}\n💧 ${selectedProduct.technology}\n⏱️ Onset: ${selectedProduct.onsetTime}\n💚 ${selectedProduct.thcPerDose}mg THC per ${selectedProduct.doseUnit}\n\n${selectedProduct.dosageNote}`,
    };
    const updatedBases = [...infusionBases, infusionBase];
    saveToStorage(updatedBases);
    toast.success(`${selectedProduct.name} saved to your infusions!`);
    setSelectedProduct(null);
    setProductDoses(1);
    setInfusionLayer("none");
    setSelectedBaseType("none");
  };

  const handleDelete = (id: string) => {
    const updated = infusionBases.filter((b) => b.id !== id);
    saveToStorage(updated);
    toast.success("Infusion deleted");
  };

  const handleCustomStrainCreated = (newStrain: Strain) => {
    const updatedCustomStrains = [...customStrains, newStrain];
    const updatedAllStrains = [...defaultStrains, ...updatedCustomStrains];
    
    setCustomStrains(updatedCustomStrains);
    setAllStrains(updatedAllStrains);
    
    localStorage.setItem("customStrains", JSON.stringify(updatedCustomStrains));
    
    setSelectedStrain(newStrain.name);
    if (newStrain.cannabinoids) {
      setCustomThc(newStrain.cannabinoids.thc);
      setCustomCbd(newStrain.cannabinoids.cbd || 0);
    }
  };

  const filteredRecipes =
    (infusionLayer === "cooking" || infusionLayer === "ready-to-eat") &&
    selectedBaseType !== "none"
      ? infusionRecipes.filter(
          (r) =>
            matchesInfusionLayer(r, infusionLayer as "cooking" | "ready-to-eat") &&
            recipeMatchesCategory(r, selectedBaseType)
        )
      : [];

  // Calculate dynamic THC and Terpene retention based on temperature and time
  const calculateRetention = (temp: number, time: number) => {
    let thcRetention = 0;
    let terpeneRetention = 0;
    let warning = "";
    let warningColor = "";
    let timeWarning = "";

    // Temperature-based calculations
    if (temp < 100) {
      warning = "🥶 That's too cold! You're just making warm bud, not an infusion. No activation happening.";
      warningColor = "blue";
      thcRetention = 0;
      terpeneRetention = 100;
    } else if (temp >= 100 && temp < 130) {
      warning = "❄️ Still too low. Minimal extraction. Bump it up to activate those cannabinoids!";
      warningColor = "cyan";
      thcRetention = 15;
      terpeneRetention = 95;
    } else if (temp >= 130 && temp < 160) {
      warning = "✅ Low-temp heaven! Maximum terpene preservation, slower THC extraction. Perfect for flavor!";
      warningColor = "green";
      thcRetention = 60 + (time * 5); // Time-dependent
      terpeneRetention = 95 - (time * 2);
    } else if (temp >= 160 && temp < 185) {
      warning = "🔥 Sweet spot! Great balance of THC extraction and terpene retention.";
      warningColor = "green";
      thcRetention = 75 + (time * 3);
      terpeneRetention = 70 - (time * 3);
    } else if (temp >= 185 && temp < 210) {
      warning = "⚠️ Getting hot! Strong THC extraction but you're cooking off terpenes. Potent but less flavorful.";
      warningColor = "yellow";
      thcRetention = 85 + (time * 2);
      terpeneRetention = 45 - (time * 4);
    } else if (temp >= 210 && temp < 250) {
      warning = "🔥🔥 Too hot! You're degrading THC and destroying terpenes. Lower the heat!";
      warningColor = "orange";
      thcRetention = 60 - (time * 5);
      terpeneRetention = 20 - (time * 5);
    } else {
      warning = "💀 STOP! You're making cannabis ash, not hash! You just destroyed everything. Way too hot!";
      warningColor = "red";
      thcRetention = 0;
      terpeneRetention = 0;
    }

    // Time-based warnings and adjustments
    if (temp >= 130 && temp < 250) { // Only give time warnings if temp is in reasonable range
      if (time < 1) {
        timeWarning = "⏱️ Too quick! You're barely getting started. Give it more time to extract properly.";
        if (warningColor === "green") warningColor = "yellow";
      } else if (time >= 1 && time < 1.5) {
        timeWarning = "⏱️ A bit rushed. Consider going longer for better extraction.";
      } else if (time >= 1.5 && time <= 4) {
        timeWarning = "✅ Perfect timing! This is the sweet spot for infusion.";
      } else if (time > 4 && time <= 6) {
        timeWarning = "⏰ Getting long... You're extracting well but watch for diminishing returns and flavor degradation.";
      } else if (time > 6) {
        timeWarning = "⏰⏰ Way too long! You're wasting time and energy. You've extracted everything already, now you're just cooking plant matter.";
        if (warningColor === "green") warningColor = "yellow";
        // Reduce terpene retention for excessive time
        terpeneRetention = Math.max(0, terpeneRetention - ((time - 6) * 8));
      }
    }

    // Cap retention values
    thcRetention = Math.max(0, Math.min(95, thcRetention));
    terpeneRetention = Math.max(0, Math.min(100, terpeneRetention));

    // Combine warnings if we have both
    const combinedWarning = timeWarning ? `${warning}\n${timeWarning}` : warning;

    return { thcRetention, terpeneRetention, warning: combinedWarning, warningColor };
  };

  const retention = calculateRetention(customTemp, customTime);

  const calculateTHC = () => {
    if (!selectedRecipe || selectedRecipe.preparationMode === "mix-in") return { totalTHC: 0, thcPerGram: 0 };
    const weightInGrams = cannabisAmount;
    const totalTHC = (weightInGrams * 1000 * (customThc / 100)) * (retention.thcRetention / 100);
    const thcPerGram = totalTHC / baseAmount;
    return { totalTHC, thcPerGram };
  };

  const { totalTHC, thcPerGram } = calculateTHC();

  const mixInPreview = useMemo(() => {
    if (!selectedRecipe || selectedRecipe.preparationMode !== "mix-in") return null;
    return computeMixInResult(
      mixInSource,
      mixInInfusedAmount,
      mixInPlainBaseGrams,
      mixInServings,
      mixInCustomMgPerUnit,
      infusionBases,
      preMadeProducts
    );
  }, [
    selectedRecipe?.id,
    selectedRecipe?.preparationMode,
    mixInSource,
    mixInInfusedAmount,
    mixInPlainBaseGrams,
    mixInServings,
    mixInCustomMgPerUnit,
    infusionBases,
  ]);

  const mixInAmountLabel = useMemo(() => {
    if (!mixInSource || mixInSource === "custom") {
      return {
        title: "How much infused product?",
        hint: "Match the unit you chose for “mg per unit” below (ml, g, tbsp, etc.).",
      };
    }
    if (mixInSource.startsWith("premade:")) {
      const p = preMadeProducts.find((x) => x.id === mixInSource.slice(8));
      return {
        title: `How many ${p?.doseUnit ?? "doses"}?`,
        hint: `Listed strength: ${p?.thcPerDose ?? "—"} mg THC per ${p?.doseUnit ?? "dose"}.`,
      };
    }
    if (mixInSource.startsWith("saved:")) {
      const b = infusionBases.find((x) => x.id === mixInSource.slice(6));
      return {
        title: `Infused amount (${b?.baseUnit ?? "units"})`,
        hint: `This save is ${b?.thcPerUnit ?? "—"} mg THC per ${b?.baseUnit ?? "unit"}.`,
      };
    }
    return { title: "Amount", hint: "" };
  }, [mixInSource, infusionBases]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-2xl px-8 py-8 text-white shadow-xl">
        <h1 className="text-4xl font-black text-white mb-2">🧪 Create Your Infusion Base</h1>
        <p className="text-green-200 text-lg">
          Takes 30 seconds — start with your strain and base type. We'll calculate everything automatically.
        </p>
        <div className="flex items-center gap-4 mt-4 text-sm text-green-300">
          <span>✓ Auto dose calculation</span>
          <span>✓ 20+ strain profiles</span>
          <span>✓ Cooking & ready-to-eat carriers</span>
        </div>
      </div>

      <Card className="bg-amber-50/90 border-amber-200 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-900 flex items-center gap-2 text-lg">
            <Layers className="w-6 h-6 text-amber-700" />
            Two base types — one strain flow
          </CardTitle>
          <CardDescription className="text-gray-700">
            <strong className="text-gray-900">Cooking base</strong> = goes into food.{" "}
            <strong className="text-gray-900">Ready-to-eat base</strong> = goes onto food (or straight from the jar).
          </CardDescription>
        </CardHeader>
        <CardContent className="text-gray-800 space-y-2 text-sm pt-0">
          <p>
            Pick your strain (library or custom) when you&apos;re doing a <strong>heat infusion</strong> (butter, oil, or spreads like
            peanut butter where flower cooks in). For <strong>mix-in</strong> spreads (cream cheese, honey with oil, frosting, etc.) you&apos;ll
            choose a <strong>finished THC source</strong> and use the blend calculator instead — no temp/time sliders.
          </p>
        </CardContent>
      </Card>

      {/* Strain Manager Section */}
      <Card className="bg-white border-purple-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <FlaskConical className="w-6 h-6 text-purple-400" />
                🌿 My Cannabis Strains
              </CardTitle>
              <CardDescription className="text-gray-600">
                {customStrains.length} custom strains saved
              </CardDescription>
            </div>
            <CustomStrainDialog onStrainCreated={handleCustomStrainCreated} />
          </div>
        </CardHeader>
        {customStrains.length > 0 && (
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
              {customStrains.map((strain) => (
                <div
                  key={strain.name}
                  className="bg-white border border-purple-200 rounded-lg p-3"
                >
                  <h3 className="font-semibold text-gray-900 text-sm">{strain.name}</h3>
                  <Badge className={
                    strain.type === "sativa" ? "bg-green-600 text-xs mt-1" :
                    strain.type === "indica" ? "bg-purple-600 text-xs mt-1" :
                    "bg-yellow-600 text-xs mt-1"
                  }>
                    {strain.type}
                  </Badge>
                  {strain.cannabinoids && (
                    <div className="mt-2 text-xs space-y-0.5">
                      <div className="flex justify-between text-gray-600">
                        <span>THC:</span>
                        <span className="text-green-700 font-semibold">{strain.cannabinoids.thc}%</span>
                      </div>
                      {strain.cannabinoids.cbd > 0 && (
                        <div className="flex justify-between text-gray-600">
                          <span>CBD:</span>
                          <span className="text-blue-400 font-semibold">{strain.cannabinoids.cbd}%</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Main Infusion Builder */}
      <Card className="bg-white border-green-200">
        <CardHeader>
          <CardTitle className="text-gray-900 text-2xl">Create New Infusion</CardTitle>
          <CardDescription className="text-gray-600">
            Follow the steps below to create your perfect infusion base
          </CardDescription>
          <p className="text-sm text-green-700 font-medium">
            If you do not want to create your own, use one of our standard infusion bases already built for you.
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* STEP 1: Layer */}
          <div>
            <Label className="text-gray-900 text-lg font-semibold mb-3 block">
              <span className="text-green-700">STEP 1:</span> What kind of base is this?
            </Label>
            <p className="text-sm text-gray-600 mb-4">
              <strong className="text-gray-800">Simple rule:</strong> Cooking = goes <em>into</em> food. Ready-to-eat = goes{" "}
              <em>onto</em> food (or eat it straight).
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => {
                  setInfusionLayer("cooking");
                  setSelectedProduct(null);
                }}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  infusionLayer === "cooking"
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white hover:border-green-400"
                }`}
              >
                <div className="text-3xl mb-2">🔧</div>
                <div className="text-gray-900 font-bold">Cooking bases</div>
                <p className="text-sm text-gray-600 mt-1">Butter, ghee, oil, syrups, cream, chocolate for baking.</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInfusionLayer("ready-to-eat");
                  setSelectedProduct(null);
                }}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  infusionLayer === "ready-to-eat"
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 bg-white hover:border-green-400"
                }`}
              >
                <div className="text-3xl mb-2">🍯</div>
                <div className="text-gray-900 font-bold">Ready-to-eat bases</div>
                <p className="text-sm text-gray-600 mt-1">Peanut butter, honey, cream cheese, frosting, caramel, spreads.</p>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInfusionLayer("premade");
                  setSelectedRecipe(null);
                  setSelectedStrain("none");
                  setIsCustomStrain(false);
                  setSelectedProduct(null);
                }}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  infusionLayer === "premade"
                    ? "border-pink-400 bg-pink-50"
                    : "border-gray-200 bg-white hover:border-green-400"
                }`}
              >
                <div className="text-3xl mb-2">🛒</div>
                <div className="text-gray-900 font-bold">Pre-made product</div>
                <p className="text-sm text-gray-600 mt-1">Log store-bought squeezes, tinctures, powders.</p>
              </button>
            </div>
            {infusionLayer !== "none" && infusionLayer !== "premade" && (
              <Button
                type="button"
                variant="ghost"
                className="mt-3 text-gray-600"
                onClick={() => {
                  setInfusionLayer("none");
                  setSelectedRecipe(null);
                  setSelectedBaseType("none");
                }}
              >
                ← Change layer
              </Button>
            )}
          </div>

          {(infusionLayer === "cooking" ||
            (infusionLayer === "ready-to-eat" &&
              (!selectedRecipe || isHeatInfusionRecipe(selectedRecipe)))) && (
          <div>
            <Label className="text-gray-900 text-lg font-semibold mb-3 block">
              <span className="text-green-700">STEP 2:</span> Choose Your Strain
            </Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-800 text-sm mb-2 block">Select Strain</Label>
                <Select value={selectedStrain} onValueChange={handleStrainChange}>
                  <SelectTrigger className="bg-white border-green-300 text-gray-900">
                    <SelectValue placeholder="Choose a strain..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-green-300 text-gray-900">
                    <SelectItem value="none">-- Select Strain --</SelectItem>
                    <SelectItem value="custom">🌟 Custom Strain (Fill Info Below)</SelectItem>
                    {allStrains.filter(s => s.type !== "custom").map((strain) => (
                      <SelectItem key={strain.name} value={strain.name}>
                        {strain.name} ({strain.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {isCustomStrain && (
                <>
                  <div>
                    <Label className="text-gray-800 text-sm mb-2 block">Custom Strain Name</Label>
                    <Input
                      value={customStrainName}
                      onChange={(e) => setCustomStrainName(e.target.value)}
                      placeholder="e.g., Blue Dream"
                      className="bg-white border-green-300 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-800 text-sm mb-2 block">THC %</Label>
                    <Input
                      type="number"
                      value={customThc}
                      onChange={(e) => setCustomThc(parseFloat(e.target.value) || 0)}
                      className="bg-white border-green-300 text-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-800 text-sm mb-2 block">CBD % (optional)</Label>
                    <Input
                      type="number"
                      value={customCbd}
                      onChange={(e) => setCustomCbd(parseFloat(e.target.value) || 0)}
                      className="bg-white border-green-300 text-gray-900"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
          )}

          {infusionLayer === "cooking" && (
          <div>
            <Label className="text-gray-900 text-lg font-semibold mb-3 block">
              <span className="text-green-700">STEP 3:</span> Pick your cooking carrier
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {[
                { value: "butter" as const, label: "Butter / ghee", emoji: "🧈" },
                { value: "oil" as const, label: "Oil", emoji: "🫒" },
                { value: "syrup" as const, label: "Syrup", emoji: "🍯" },
                { value: "liquid" as const, label: "Tincture / MCT", emoji: "💧" },
                { value: "cream" as const, label: "Cream", emoji: "🍦" },
                { value: "chocolate" as const, label: "Chocolate", emoji: "🍫" },
              ].map((base) => (
                <button
                  key={base.value}
                  type="button"
                  onClick={() => setSelectedBaseType(base.value)}
                  className={`p-5 rounded-xl border-2 transition-all text-left ${
                    selectedBaseType === base.value
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white hover:border-green-400"
                  }`}
                >
                  <div className="text-3xl mb-1">{base.emoji}</div>
                  <div className="text-gray-900 font-semibold text-sm leading-tight">{base.label}</div>
                </button>
              ))}
            </div>
          </div>
          )}

          {infusionLayer === "ready-to-eat" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 px-4 py-3">
              <p className="text-gray-800 text-sm">
                <strong className="text-gray-900">Spreads & spoon-ready bases</strong> — some recipes infuse with heat (e.g.
                peanut butter); others only mix in <strong>finished</strong> oil, butter, or a store product — use the blend
                calculator for those (no temperature sliders).
              </p>
            </div>
          )}

          {/* STEP 4: Cooking / ready recipes */}
          {(infusionLayer === "cooking" || infusionLayer === "ready-to-eat") &&
            selectedBaseType !== "none" &&
            filteredRecipes.length > 0 && (
            <div>
              <Label className="text-gray-900 text-lg font-semibold mb-3 block">
                <span className="text-green-700">STEP {infusionLayer === "cooking" ? "4" : "3"}:</span> Choose recipe &amp; configure
              </Label>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    type="button"
                    onClick={() => setSelectedRecipe(recipe)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedRecipe?.id === recipe.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 bg-white hover:border-green-400"
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-gray-900 font-semibold">{cleanRecipeDisplayTitle(recipe.name)}</h3>
                      {recipe.baseRole === "both" ? (
                        <>
                          <Badge className="bg-slate-700 text-white text-xs">🍯 Ready-to-eat</Badge>
                          <Badge className="bg-amber-700 text-white text-xs">🔧 Also for recipes</Badge>
                        </>
                      ) : recipe.baseRole === "cooking" ? (
                        <Badge className="bg-slate-600 text-white text-xs">🔧 Cooking base</Badge>
                      ) : (
                        <Badge className="bg-amber-700 text-white text-xs">🍯 Ready-to-eat</Badge>
                      )}
                    </div>
                    {isHeatInfusionRecipe(recipe) ? (
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-orange-400" />
                          {recipe.temperature}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-400" />
                          {recipe.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <Beaker className="w-4 h-4 text-green-700" />
                          THC: {recipe.thcRetention}% | Terpenes: {recipe.terpeneRetention}%
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-amber-800 flex items-center gap-2">
                        <Calculator className="w-4 h-4 shrink-0" />
                        Mix-in: blend calculator — finished THC + plain base, mg per serving
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRE-MADE PRODUCT SECTION */}
          {infusionLayer === "premade" && (
            <div>
              <Label className="text-gray-900 text-lg font-semibold mb-3 block">
                <span className="text-green-700">STEP 3:</span> Choose Your Product
              </Label>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {preMadeProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => { setSelectedProduct(product); setProductDoses(1); }}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedProduct?.id === product.id
                        ? "border-pink-500 bg-pink-500/10"
                        : "border-gray-700 bg-white hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{product.emoji}</span>
                      <div className="flex-1">
                        <div className="text-xs text-gray-600 mb-0.5">{product.brand}</div>
                        <h3 className="text-gray-900 font-semibold">{product.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge className="bg-pink-700 text-xs">{product.type}</Badge>
                          <Badge className="bg-green-700 text-xs">{product.thcPerDose}mg/{product.doseUnit}</Badge>
                          <Badge className="bg-blue-700 text-xs">⏱ {product.onsetTime}</Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {selectedProduct && (
                <div className="bg-white border border-pink-200 rounded-xl p-6 space-y-6">
                  <h3 className="text-gray-900 text-xl font-semibold">
                    {selectedProduct.emoji} {selectedProduct.name}
                    <span className="text-gray-600 text-sm font-normal ml-2">by {selectedProduct.brand}</span>
                  </h3>

                  <p className="text-gray-800 text-sm">{selectedProduct.description}</p>

                  {selectedProduct.flavors && (
                    <div>
                      <h4 className="text-gray-900 font-semibold text-sm mb-2">🎨 Available Flavors</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.flavors.map((f) => (
                          <Badge key={f} className="bg-purple-700 text-white text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-gray-900 font-semibold text-sm mb-2">✨ Best For</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.bestFor.map((use) => (
                        <Badge key={use} className="bg-green-800 text-white text-xs">{use}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold text-sm mb-1">📏 Dosage Guide</h4>
                    <p className="text-gray-800 text-sm">{selectedProduct.dosageNote}</p>
                  </div>

                  {/* Dose Calculator */}
                  <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4">
                    <h4 className="text-green-700 font-semibold mb-3">💚 Dose Calculator</h4>
                    <div className="grid md:grid-cols-2 gap-4 items-center">
                      <div>
                        <Label className="text-gray-800 text-sm mb-2 block">
                          How many {selectedProduct.doseUnit}s are you using?
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          value={productDoses}
                          onChange={(e) => setProductDoses(Math.max(1, parseInt(e.target.value) || 1))}
                          className="bg-white border-green-300 text-gray-900"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">THC per {selectedProduct.doseUnit}:</span>
                          <span className="text-green-700 font-bold">{selectedProduct.thcPerDose}mg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total THC:</span>
                          <span className="text-green-700 font-bold text-lg">{(selectedProduct.thcPerDose * productDoses).toFixed(1)}mg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Technology:</span>
                          <span className="text-gray-900">{selectedProduct.technology}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSaveProduct}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                    size="lg"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save {selectedProduct.name} to My Infusions
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Recipe Details */}
          {selectedRecipe && (
            <div className="bg-white border border-green-200 rounded-xl p-6 space-y-6">
              <div>
                <h3 className="text-gray-900 text-xl font-semibold mb-4">📖 Recipe Details: {cleanRecipeDisplayTitle(selectedRecipe.name)}</h3>

                {selectedRecipe.preparationMode === "mix-in" ? (
                  <p className="text-sm text-gray-700 mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2">
                    <strong className="text-gray-900">Mix-in (no flower cook step):</strong> you blend{" "}
                    <strong>already-active</strong> THC — cannabutter, infused oil, tincture you logged, or a store squeeze — into
                    plain base. Use the calculator below; temperature and time sliders don&apos;t apply.
                  </p>
                ) : selectedRecipe.baseType === "spread" ? (
                  <p className="text-sm text-gray-700 mb-4 rounded-lg border border-amber-200 bg-amber-50/60 px-3 py-2">
                    <strong className="text-gray-900">Ready-to-eat base:</strong> eat it, spread it, or bake with it. Label your jar in{" "}
                    <strong>mg per tablespoon</strong> or <strong>per serving</strong> so accidental over-scooping is less likely.
                  </p>
                ) : selectedRecipe.baseType === "chocolate" ? (
                  <p className="text-sm text-gray-700 mb-4 rounded-lg border border-purple-200 bg-purple-50/50 px-3 py-2">
                    <strong className="text-gray-900">🔁 Both:</strong> finished chocolate you can eat as-is <em>or</em> melt into other recipes — keep pieces cool and dose by weight when you snap the bar.
                  </p>
                ) : (
                  <p className="text-sm text-gray-700 mb-4 rounded-lg border border-green-200 bg-green-50/50 px-3 py-2">
                    <strong className="text-gray-900">Cooking base:</strong> built to go <em>into</em> food — batters, sauces, sauté fat, cream bases. Plan recipes around{" "}
                    <strong>mg per tablespoon</strong> of finished infusion.
                  </p>
                )}

                {selectedRecipe.preparationMode === "mix-in" ? (
                  <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50/50 p-5 space-y-5">
                    <h4 className="text-amber-900 font-semibold flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Blend calculator
                    </h4>
                    <p className="text-sm text-gray-700">
                      Choose a <strong>saved infusion</strong> from this device, a <strong>reference store product</strong> (same
                      list as Pre-made), or <strong>custom</strong> potency. Plain base = unmedicated weight only (cream cheese,
                      honey, frosting sugar phase, etc.). Batch weight adds infused g/ml when your save uses those units.
                    </p>

                    <div>
                      <Label className="text-gray-800 text-sm mb-2 block">THC you&apos;re mixing in</Label>
                      <Select
                        value={mixInSource === "" ? "__pick__" : mixInSource}
                        onValueChange={(v) => setMixInSource(v === "__pick__" ? "" : (v as MixInSourceSelection))}
                      >
                        <SelectTrigger className="bg-white border-amber-300 text-gray-900">
                          <SelectValue placeholder="Choose source…" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-[320px]">
                          <SelectItem value="__pick__" className="text-gray-600">
                            — Choose source —
                          </SelectItem>
                          {infusionBases.length > 0 && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                                My saved infusions
                              </div>
                              {infusionBases.map((b) => (
                                <SelectItem key={b.id} value={`saved:${b.id}`} className="text-gray-900">
                                  {b.name} ({b.thcPerUnit} mg / {b.baseUnit})
                                </SelectItem>
                              ))}
                            </>
                          )}
                          <div className="px-2 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-wide">
                            Store reference products
                          </div>
                          {preMadeProducts.map((p) => (
                            <SelectItem key={p.id} value={`premade:${p.id}`} className="text-gray-900">
                              {p.emoji} {p.brand} – {p.name} ({p.thcPerDose} mg/{p.doseUnit})
                            </SelectItem>
                          ))}
                          <SelectItem value="custom" className="text-gray-900">
                            Custom — I&apos;ll enter mg per unit
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {mixInSource === "custom" && (
                      <div>
                        <Label className="text-gray-800 text-sm mb-2 block">mg THC per 1 unit (e.g. per ml, per g, per tbsp)</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          value={mixInCustomMgPerUnit}
                          onChange={(e) => setMixInCustomMgPerUnit(parseFloat(e.target.value) || 0)}
                          className="bg-white border-amber-300 text-gray-900"
                        />
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-800 text-sm mb-2 block">{mixInAmountLabel.title}</Label>
                        <Input
                          type="number"
                          min={0}
                          step={0.1}
                          value={mixInInfusedAmount}
                          onChange={(e) => setMixInInfusedAmount(parseFloat(e.target.value) || 0)}
                          className="bg-white border-amber-300 text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">{mixInAmountLabel.hint}</p>
                      </div>
                      <div>
                        <Label className="text-gray-800 text-sm mb-2 block">Plain base (grams)</Label>
                        <Input
                          type="number"
                          min={0}
                          step={1}
                          value={mixInPlainBaseGrams}
                          onChange={(e) => setMixInPlainBaseGrams(parseFloat(e.target.value) || 0)}
                          className="bg-white border-amber-300 text-gray-900"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Unmedicated carrier only. Example: 452 g cream cheese, 680 g honey, etc.
                        </p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-800 text-sm mb-2 block">Servings in finished batch</Label>
                      <Input
                        type="number"
                        min={1}
                        step={1}
                        value={mixInServings}
                        onChange={(e) => setMixInServings(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        className="bg-white border-amber-300 text-gray-900 max-w-xs"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        How you’ll portion it (slices, sandwiches, tbsp — your definition of one serving).
                      </p>
                    </div>

                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <h5 className="text-green-900 font-semibold mb-2">Result</h5>
                      {mixInPreview?.error ? (
                        <p className="text-sm text-red-700">{mixInPreview.error}</p>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-800">
                          <div>
                            <span className="text-gray-600">Total THC in blend</span>
                            <p className="text-xl font-bold text-green-800">{mixInPreview ? mixInPreview.totalTHC.toFixed(2) : "—"} mg</p>
                          </div>
                          <div>
                            <span className="text-gray-600">THC per serving</span>
                            <p className="text-xl font-bold text-green-800">
                              {mixInPreview ? `${mixInPreview.thcPerServing.toFixed(2)} mg` : "—"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Est. batch weight</span>
                            <p className="font-semibold text-gray-900">
                              {mixInPreview ? `${mixInPreview.totalBatchGrams.toFixed(0)} g` : "—"}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">mg per gram (whole jar)</span>
                            <p className="font-semibold text-gray-900">
                              {mixInPreview ? `${mixInPreview.thcPerGram.toFixed(3)} mg/g` : "—"}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Amounts */}
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <Label className="text-gray-800 text-sm mb-2 block">Cannabis Amount (grams)</Label>
                        <Input
                          type="number"
                          value={cannabisAmount}
                          onChange={(e) => setCannabisAmount(parseFloat(e.target.value) || 0)}
                          className="bg-white border-green-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-800 text-sm mb-2 block">Base Amount (grams)</Label>
                        <Input
                          type="number"
                          value={baseAmount}
                          onChange={(e) => setBaseAmount(parseFloat(e.target.value) || 0)}
                          className="bg-white border-green-300 text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Temperature and Time Controls */}
                    <div className="mb-6 bg-orange-50 border-2 border-orange-300 rounded-xl p-5">
                      <h4 className="text-orange-400 font-semibold mb-4 flex items-center gap-2">
                        <Thermometer className="w-5 h-5" />
                        🌡️ Temperature & Time Control
                      </h4>
                      
                      <div className="grid md:grid-cols-2 gap-6 mb-4">
                        {/* Temperature Slider */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-gray-800 text-sm">Infusion Temperature (°F)</Label>
                            <span className="text-gray-900 font-bold text-lg">{customTemp}°F</span>
                          </div>
                          <input
                            type="range"
                            min="80"
                            max="280"
                            step="5"
                            value={customTemp}
                            onChange={(e) => setCustomTemp(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>80°F</span>
                            <span>180°F</span>
                            <span>280°F</span>
                          </div>
                        </div>

                        {/* Time Slider */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <Label className="text-gray-800 text-sm">Infusion Time (hours)</Label>
                            <span className="text-gray-900 font-bold text-lg">{customTime}h</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="8"
                            step="0.5"
                            value={customTime}
                            onChange={(e) => setCustomTime(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>30min</span>
                            <span>4h</span>
                            <span>8h</span>
                          </div>
                        </div>
                      </div>

                      {/* Warning Message */}
                      <div className={`p-4 rounded-lg border-2 ${
                        retention.warningColor === "red" ? "bg-red-900/30 border-red-500" :
                        retention.warningColor === "orange" ? "bg-orange-900/30 border-orange-500" :
                        retention.warningColor === "yellow" ? "bg-yellow-900/30 border-yellow-500" :
                        retention.warningColor === "green" ? "bg-green-900/30 border-green-500" :
                        retention.warningColor === "cyan" ? "bg-cyan-900/30 border-cyan-500" :
                        "bg-blue-900/30 border-blue-500"
                      } mb-4`}>
                        <p className="text-gray-900 font-medium whitespace-pre-line">{retention.warning}</p>
                      </div>

                      {/* Retention Display */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-900/30 border border-green-600/50 rounded-lg p-4">
                          <div className="text-sm text-green-300 mb-1">THC Retention</div>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-green-700">{retention.thcRetention.toFixed(0)}%</span>
                            <span className="text-green-300 text-sm mb-1">of cannabinoids</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all"
                              style={{ width: `${retention.thcRetention}%` }}
                            />
                          </div>
                        </div>

                        <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4">
                          <div className="text-sm text-purple-300 mb-1">Terpene Retention</div>
                          <div className="flex items-end gap-2">
                            <span className="text-3xl font-bold text-purple-400">{retention.terpeneRetention.toFixed(0)}%</span>
                            <span className="text-purple-300 text-sm mb-1">flavor/aroma</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full transition-all"
                              style={{ width: `${retention.terpeneRetention}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* THC Calculation */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                      <h4 className="text-green-800 font-semibold mb-2">💚 Calculated THC</h4>
                      <p className="text-xs text-gray-600 mb-3">
                        <strong className="text-gray-800">Dial strength:</strong> more cannabis or less carrier = stronger batch; less cannabis or more carrier = milder. Sliders model heat/time extraction; the gram fields set concentration.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4 text-gray-900">
                        <div>
                          <div className="text-sm text-gray-600">Total THC (estimated)</div>
                          <div className="text-2xl font-bold text-green-800">{totalTHC.toFixed(2)} mg</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">THC per gram of batch</div>
                          <div className="text-2xl font-bold text-green-800">{thcPerGram.toFixed(2)} mg/g</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mt-3">
                        ≈ <strong className="text-green-800">{(thcPerGram * 14.2).toFixed(1)} mg</strong> THC per US tablespoon (~14 g — density varies; weigh for precision).
                        {selectedRecipe.baseType === "spread"
                          ? " Use that when you think in spoonfuls or typical spread servings."
                          : " Use that when substituting infused fat by the tablespoon in a recipe."}
                      </p>
                    </div>
                  </>
                )}

                {/* Ingredients */}
                <div className="mb-6">
                  <h4 className="text-gray-900 font-semibold mb-2">🥄 Ingredients</h4>
                  <ul className="space-y-1 text-gray-800">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i}>• {ing}</li>
                    ))}
                  </ul>
                </div>

                {/* Steps */}
                <div className="mb-6">
                  <h4 className="text-gray-900 font-semibold mb-2">👨‍🍳 Steps</h4>
                  <ol className="space-y-2 text-gray-800">
                    {selectedRecipe.steps.map((step, i) => (
                      <li key={i}>{i + 1}. {step}</li>
                    ))}
                  </ol>
                </div>

                {/* Best Uses */}
                <div className="mb-6">
                  <h4 className="text-gray-900 font-semibold mb-2">✨ Best Uses</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.bestUses.map((use, i) => (
                      <Badge key={i} className="bg-purple-600 text-white">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* What to Make Next */}
                <div>
                  <h4 className="text-gray-900 font-semibold mb-3">👉 What to Make Next</h4>
                  <div className="flex gap-4">
                    {selectedRecipe.compatibleCategories.map((cat) => (
                      <div key={cat} className="flex items-center gap-2 text-gray-800">
                        {cat === "cookies" && <Cookie className="w-5 h-5 text-yellow-400" />}
                        {cat === "drinks" && <Wine className="w-5 h-5 text-blue-400" />}
                        {cat === "savory" && <UtensilsCrossed className="w-5 h-5 text-orange-400" />}
                        {cat !== "cookies" && cat !== "drinks" && cat !== "savory" && (
                          <ChefHat className="w-5 h-5 text-gray-500" />
                        )}
                        <span className="capitalize">{cat.replace(/-/g, " ")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <Button 
                onClick={handleSaveInfusion}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                Save Infusion to My Collection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Infusions */}
      {infusionBases.length > 0 && (
        <Card className="bg-white border-green-200">
          <CardHeader>
            <CardTitle className="text-gray-900">💾 My Saved Infusions</CardTitle>
            <CardDescription className="text-gray-600">
              {infusionBases.length} infusion{infusionBases.length !== 1 ? 's' : ''} saved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {infusionBases.map((base) => (
                <div
                  key={base.id}
                  className="bg-white border border-green-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 leading-tight">{base.name}</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge className="bg-green-600 text-white text-xs">{base.strainName}</Badge>
                        {inferInfusionBaseRole(base) === "cooking" && (
                          <Badge className="bg-slate-600 text-white text-xs">🔧 Cooking</Badge>
                        )}
                        {inferInfusionBaseRole(base) === "ready-to-eat" && (
                          <Badge className="bg-amber-700 text-white text-xs">🍯 Ready-to-eat</Badge>
                        )}
                        {inferInfusionBaseRole(base) === "both" && (
                          <>
                            <Badge className="bg-amber-700 text-white text-xs">🍯 Ready-to-eat</Badge>
                            <Badge className="bg-slate-600 text-white text-xs">🔧 + recipes</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDelete(base.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Total THC:</span>
                      <span className="text-green-700 font-semibold">{base.totalTHC} mg</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>THC per {base.baseUnit}:</span>
                      <span className="text-green-700 font-semibold">{base.thcPerUnit} mg</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Cannabis:</span>
                      <span className="text-gray-900">{base.cannabisAmount}{base.cannabisUnit}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>THC %:</span>
                      <span className="text-gray-900">{base.thcPercentage}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}