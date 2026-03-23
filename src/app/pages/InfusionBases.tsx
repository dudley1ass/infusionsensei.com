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
import { FlaskConical, Plus, Clock, Thermometer, Beaker, ChefHat, Cookie, Wine, UtensilsCrossed, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { InfusionBase } from "../types/infusion";
import { defaultStrains, Strain } from "../data/cannabisData";
import { CustomStrainDialog } from "../components/CustomStrainDialog";

interface InfusionRecipe {
  id: string;
  name: string;
  baseType: "butter" | "oil" | "syrup" | "liquid";
  temperature: string;
  time: string;
  thcRetention: number;
  terpeneRetention: number;
  ingredients: string[];
  steps: string[];
  bestUses: string[];
  compatibleCategories: ("cookies" | "drinks" | "savory")[];
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

  // OIL RECIPES
  {
    id: "coconut-oil",
    name: "Cannabis Coconut Oil",
    baseType: "oil",
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
  }
];

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
  
  const [selectedBaseType, setSelectedBaseType] = useState<"butter" | "oil" | "syrup" | "liquid" | "cream" | "premade" | "none">("none");
  const [selectedProduct, setSelectedProduct] = useState<PreMadeProduct | null>(null);
  const [productDoses, setProductDoses] = useState<number>(1);
  const [selectedRecipe, setSelectedRecipe] = useState<InfusionRecipe | null>(null);
  const [cannabisAmount, setCannabisAmount] = useState(7);
  const [baseAmount, setBaseAmount] = useState(227);
  
  // Temperature and time controls
  const [customTemp, setCustomTemp] = useState(160);
  const [customTime, setCustomTime] = useState(2);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("infusionBases");
    if (saved) {
      setInfusionBases(JSON.parse(saved));
    }

    const savedCustomStrains = localStorage.getItem("customStrains");
    if (savedCustomStrains) {
      const parsed = JSON.parse(savedCustomStrains);
      setCustomStrains(parsed);
      setAllStrains([...defaultStrains, ...parsed]);
    }
  }, []);

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
    if (selectedStrain === "none") {
      toast.error("Please select a strain");
      return;
    }
    if (!selectedRecipe) {
      toast.error("Please select an infusion recipe");
      return;
    }
    if (isCustomStrain && !customStrainName.trim()) {
      toast.error("Please enter a custom strain name");
      return;
    }

    // Calculate THC
    const thcPercentage = customThc;
    const weightInGrams = cannabisAmount;
    const totalTHC = (weightInGrams * 1000 * (thcPercentage / 100)) * (retention.thcRetention / 100);
    const thcPerGram = totalTHC / baseAmount;

    const infusionBase: InfusionBase = {
      id: Date.now().toString(),
      name: isCustomStrain ? `${customStrainName} ${selectedRecipe.name}` : `${selectedStrain} ${selectedRecipe.name}`,
      type: selectedRecipe.baseType === "butter" ? "butter" : 
            selectedRecipe.baseType === "oil" ? "coconut-oil" :
            selectedRecipe.baseType === "syrup" ? "agave-syrup" : "tincture",
      createdDate: new Date().toISOString(),
      cannabisAmount,
      cannabisUnit: "grams",
      strainName: isCustomStrain ? customStrainName : selectedStrain,
      thcPercentage,
      baseAmount,
      baseUnit: "g",
      totalTHC: parseFloat(totalTHC.toFixed(2)),
      thcPerUnit: parseFloat(thcPerGram.toFixed(2)),
      notes: `🌡️ ${selectedRecipe.temperature} for ${selectedRecipe.time}\n📊 THC Retention: ${selectedRecipe.thcRetention}% | Terpene Retention: ${selectedRecipe.terpeneRetention}%\n\n${selectedRecipe.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}`,
    };

    const updatedBases = [...infusionBases, infusionBase];
    saveToStorage(updatedBases);
    toast.success("Infusion saved!");

    // Reset form
    setSelectedStrain("none");
    setSelectedBaseType("none");
    setSelectedRecipe(null);
    setIsCustomStrain(false);
    setCustomStrainName("");
    setCustomThc(20);
    setCustomCbd(0);
    setCannabisAmount(7);
    setBaseAmount(227);
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
      type: "tincture", // closest existing type for compatibility
      createdDate: new Date().toISOString(),
      cannabisAmount: 0,
      cannabisUnit: "grams",
      strainName: selectedProduct.type.charAt(0).toUpperCase() + selectedProduct.type.slice(1),
      thcPercentage: 0,
      baseAmount: productDoses,
      baseUnit: selectedProduct.doseUnit,
      totalTHC: parseFloat(totalTHC.toFixed(2)),
      thcPerUnit: selectedProduct.thcPerDose,
      notes: `📦 ${selectedProduct.brand} | ${selectedProduct.name}\n💧 ${selectedProduct.technology}\n⏱️ Onset: ${selectedProduct.onsetTime}\n💚 ${selectedProduct.thcPerDose}mg THC per ${selectedProduct.doseUnit}\n\n${selectedProduct.dosageNote}`,
    };
    const updatedBases = [...infusionBases, infusionBase];
    saveToStorage(updatedBases);
    toast.success(`${selectedProduct.name} saved to your infusions!`);
    setSelectedProduct(null);
    setProductDoses(1);
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

  const filteredRecipes = selectedBaseType !== "none" && selectedBaseType !== "premade"
    ? infusionRecipes.filter(r => selectedBaseType === "cream" ? r.baseType === "liquid" && r.id.includes("cream") : r.baseType === selectedBaseType)
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
    if (!selectedRecipe) return { totalTHC: 0, thcPerGram: 0 };
    const weightInGrams = cannabisAmount;
    const totalTHC = (weightInGrams * 1000 * (customThc / 100)) * (retention.thcRetention / 100);
    const thcPerGram = totalTHC / baseAmount;
    return { totalTHC, thcPerGram };
  };

  const { totalTHC, thcPerGram } = calculateTHC();

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
          <span>✓ Butter, oil, cream & more</span>
        </div>
      </div>

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
                  <h3 className="font-semibold text-white text-sm">{strain.name}</h3>
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
        </CardHeader>
        <CardContent className="space-y-8">
          {/* STEP 1: Choose Strain - hidden for pre-made products */}
          {selectedBaseType !== "premade" && (
          <div>
            <Label className="text-gray-900 text-lg font-semibold mb-3 block">
              <span className="text-green-700">STEP 1:</span> Choose Your Strain
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
          )} {/* end hide strain for premade */}

          {/* STEP 2: Choose Base Type */}
          <div>
            <Label className="text-gray-900 text-lg font-semibold mb-3 block">
              <span className="text-green-700">STEP 2:</span> Choose Your Base
            </Label>
            <div className="grid md:grid-cols-5 gap-4">
              {[
                { value: "butter", label: "Butter", emoji: "🧈", color: "yellow" },
                { value: "oil", label: "Oil", emoji: "🫒", color: "green" },
                { value: "syrup", label: "Syrup", emoji: "🍯", color: "orange" },
                { value: "liquid", label: "Liquid", emoji: "💧", color: "blue" },
                { value: "cream", label: "Cream", emoji: "🍦", color: "pink" },
                { value: "premade", label: "Pre-Made Product", emoji: "🛒", color: "pink" },
              ].map((base) => (
                <button
                  key={base.value}
                  onClick={() => setSelectedBaseType(base.value as any)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedBaseType === base.value
                      ? `border-${base.color}-500 bg-${base.color}-500/20`
                      : "border-gray-700 bg-white hover:border-green-400"
                  }`}
                >
                  <div className="text-4xl mb-2">{base.emoji}</div>
                  <div className="text-gray-900 font-semibold">{base.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 3: Choose Recipe */}
          {selectedBaseType !== "none" && selectedBaseType !== "premade" && (
            <div>
              <Label className="text-gray-900 text-lg font-semibold mb-3 block">
                <span className="text-green-700">STEP 3:</span> Choose Recipe & Configure
              </Label>
              <div className="grid md:grid-cols-2 gap-4">
                {filteredRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${
                      selectedRecipe?.id === recipe.id
                        ? "border-green-500 bg-green-500/10"
                        : "border-gray-700 bg-white hover:border-green-400"
                    }`}
                  >
                    <h3 className="text-gray-900 font-semibold mb-2">{recipe.name}</h3>
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
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PRE-MADE PRODUCT SECTION */}
          {selectedBaseType === "premade" && (
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
                <h3 className="text-gray-900 text-xl font-semibold mb-4">📖 Recipe Details: {selectedRecipe.name}</h3>
                
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
                <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 mb-6">
                  <h4 className="text-green-700 font-semibold mb-2">💚 Calculated THC</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-white">
                    <div>
                      <div className="text-sm text-gray-600">Total THC</div>
                      <div className="text-2xl font-bold">{totalTHC.toFixed(2)} mg</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">THC per gram</div>
                      <div className="text-2xl font-bold">{thcPerGram.toFixed(2)} mg/g</div>
                    </div>
                  </div>
                </div>

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
                        <span className="capitalize">{cat}</span>
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
                      <h3 className="font-semibold text-white">{base.name}</h3>
                      <Badge className="bg-green-600 text-xs mt-1">
                        {base.strainName}
                      </Badge>
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