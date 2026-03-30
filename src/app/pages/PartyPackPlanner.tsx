import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChevronDown, ChevronUp, Plus, Printer, Trash2, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { InfusionBase } from "../types/infusion";
import { safeJsonParse } from "../utils/storage";
import { recipes as siteRecipes } from "../data/recipes";
import {
  resolvePlannerRecipes,
  buildAggregatedGroceryLines,
  formatScaledTemplateLine,
  scaleSiteRecipeIngredientLine,
} from "../utils/partyPlannerPrint";

type PlannerItem = {
  id: string;
  name: string;
  route: string;
  suggestedRange: string;
  qty: number;
  mgEach: number;
  unitLabel: string;
  equivalentHint: string;
};

type PackTemplate = {
  id: string;
  title: string;
  subtitle: string;
  items: (Omit<PlannerItem, "qty" | "mgEach"> & { defaultQty: number; defaultMgEach: number; perPersonQty: number })[];
};

const CANNED_INFUSIONS: InfusionBase[] = [
  {
    id: "canned-cannabutter-5mg-g",
    name: "Canned Cannabutter (5mg per g)",
    type: "butter",
    createdDate: "system",
    cannabisAmount: 0,
    cannabisUnit: "grams",
    strainName: "Preset",
    thcPercentage: 0,
    baseAmount: 227,
    baseUnit: "g",
    totalTHC: 1135,
    thcPerUnit: 5,
  },
  {
    id: "canned-coconut-8mg-ml",
    name: "Canned Coconut Oil (8mg per ml)",
    type: "coconut-oil",
    createdDate: "system",
    cannabisAmount: 0,
    cannabisUnit: "grams",
    strainName: "Preset",
    thcPercentage: 0,
    baseAmount: 240,
    baseUnit: "ml",
    totalTHC: 1920,
    thcPerUnit: 8,
  },
  {
    id: "canned-tincture-10mg-ml",
    name: "Canned Tincture (10mg per ml)",
    type: "tincture",
    createdDate: "system",
    cannabisAmount: 0,
    cannabisUnit: "grams",
    strainName: "Preset",
    thcPercentage: 0,
    baseAmount: 30,
    baseUnit: "ml",
    totalTHC: 300,
    thcPerUnit: 10,
  },
];

const PACKS: PackTemplate[] = [
  {
    id: "game-night",
    title: "Game Night Pack Planner",
    subtitle: "Wings, spreads & dips, popcorn, and dessert with controlled dosing.",
    items: [
      { id: "wings", name: "Infused Wings", route: "/wings", suggestedRange: "2-3mg each", defaultQty: 32, defaultMgEach: 2.5, perPersonQty: 8, unitLabel: "wings", equivalentHint: "~8-10 wings per person is average party sizing" },
      { id: "spreads-dips", name: "Spinach Artichoke Dip", route: "/spreads-dips", suggestedRange: "3-5mg per serving", defaultQty: 1, defaultMgEach: 4, perPersonQty: 0.25, unitLabel: "dip batches", equivalentHint: "One batch serves a crowd — portion by tablespoon" },
      { id: "popcorn", name: "Caramel Popcorn", route: "/popcorn", suggestedRange: "2-3mg per bowl", defaultQty: 2, defaultMgEach: 2.5, perPersonQty: 0.35, unitLabel: "big bowls", equivalentHint: "1 big bowl serves ~3-4 people (~10-12 cups)" },
      { id: "brownie", name: "Cannabis Brownie", route: "/ingredients?category=baked-goods&recipe=brownies", suggestedRange: "5-10mg each", defaultQty: 4, defaultMgEach: 7.5, perPersonQty: 1, unitLabel: "brownie pieces", equivalentHint: "1 pan usually yields 9-16 brownie pieces" },
    ],
  },
  {
    id: "chill-night",
    title: "Chill Night Pack Planner",
    subtitle: "Lower-dose flow for movie night or mellow hangs.",
    items: [
      { id: "popcorn", name: "Garlic Butter Popcorn", route: "/popcorn", suggestedRange: "2-5mg per bowl", defaultQty: 2, defaultMgEach: 3, perPersonQty: 0.35, unitLabel: "big bowls", equivalentHint: "1 big bowl serves ~3-4 people (~10-12 cups)" },
      { id: "coffee", name: "Infused Coffee or Tea", route: "/ingredients?category=drinks&recipe=bulletproof", suggestedRange: "2.5-5mg per cup", defaultQty: 2, defaultMgEach: 3.5, perPersonQty: 0.5, unitLabel: "cups", equivalentHint: "Plan 1 cup per 2 guests for chill packs" },
      { id: "wings", name: "Honey Mustard Wings", route: "/wings", suggestedRange: "2-3mg each", defaultQty: 16, defaultMgEach: 2.5, perPersonQty: 4, unitLabel: "wings", equivalentHint: "Light snack baseline is 4-6 wings per person" },
    ],
  },
  {
    id: "final-four-week",
    title: "Final Four Week Pack Planner",
    subtitle: "Regional game-day snacks with low-to-moderate dosing for long watch parties.",
    items: [
      { id: "maple-popcorn", name: "Husky Northeast Maple Popcorn", route: "/popcorn", suggestedRange: "2-3mg per handful", defaultQty: 3, defaultMgEach: 2.5, perPersonQty: 0.4, unitLabel: "big bowls", equivalentHint: "Portion into cups so guests can pace by handful." },
      { id: "pizza-bites", name: "Illini Deep Dish Pizza Bites", route: "/recipes/infused-pizza-sauce", suggestedRange: "4-8mg per 1-2 bites", defaultQty: 8, defaultMgEach: 5, perPersonQty: 1, unitLabel: "slices", equivalentHint: "Use infused sauce or dough, but keep cheese/toppings non-infused." },
      { id: "desert-heat-mix", name: "Desert Heat Spicy Snack Mix", route: "/party-snacks", suggestedRange: "3-5mg per bowl", defaultQty: 2, defaultMgEach: 4, perPersonQty: 0.3, unitLabel: "big bowls", equivalentHint: "Mix once, portion into small bowls, and label by serving." },
      { id: "caramel-apple-dip", name: "Great Lakes Caramel Apple Dip", route: "/spreads-dips", suggestedRange: "1-3mg per dip serving", defaultQty: 2, defaultMgEach: 2, perPersonQty: 0.25, unitLabel: "dip batches", equivalentHint: "Microdose-friendly: set dip spoons and apple slice counts per guest." },
    ],
  },
  {
    id: "dessert-pack",
    title: "Dessert Pack Planner",
    subtitle: "Dessert-heavy dosing where overconsumption risk is highest.",
    items: [
      { id: "brownie", name: "Brownie", route: "/ingredients?category=baked-goods&recipe=brownies", suggestedRange: "5-10mg each", defaultQty: 4, defaultMgEach: 6, perPersonQty: 1, unitLabel: "brownie pieces", equivalentHint: "1 pan usually yields 9-16 brownie pieces" },
      { id: "cookie", name: "Sugar Cookie", route: "/ingredients?category=baked-goods&recipe=sugar-cookies", suggestedRange: "3-7mg each", defaultQty: 2, defaultMgEach: 4, perPersonQty: 0.5, unitLabel: "cookies", equivalentHint: "Dessert tables usually plan 1 piece per person" },
      { id: "gummy", name: "Gummy", route: "/ingredients?category=snacks&recipe=gummies", suggestedRange: "5-10mg each", defaultQty: 2, defaultMgEach: 5, perPersonQty: 0.5, unitLabel: "gummies", equivalentHint: "Pre-portion gummies before serving for safer pacing" },
    ],
  },
  {
    id: "savory-dinner-pack",
    title: "Savory Dinner Pack Planner",
    subtitle: "Main + vegetable + starch + beverage flow for a complete savory dinner party.",
    items: [
      {
        id: "savory-main",
        name: "Savory Main (Steak / Chicken / Protein)",
        route: "/ingredients?category=savory-meals&recipe=steak",
        suggestedRange: "5-10mg per serving (or keep non-infused)",
        defaultQty: 2,
        defaultMgEach: 6,
        perPersonQty: 1,
        unitLabel: "servings",
        equivalentHint: "Use this as your main plate item; THC can go here OR in starch.",
      },
      {
        id: "vegetable-side",
        name: "Vegetable Side (Green Beans / Broccoli / Salad)",
        route: "/ingredients?category=savory-meals",
        suggestedRange: "0-3mg per serving",
        defaultQty: 2,
        defaultMgEach: 1.5,
        perPersonQty: 1,
        unitLabel: "servings",
        equivalentHint: "Keep this low-dose or non-infused to balance the dinner.",
      },
      {
        id: "starch-side",
        name: "Starch Side (Pasta / Rice / Potatoes)",
        route: "/ingredients?category=savory-meals&recipe=garlic-pasta",
        suggestedRange: "3-8mg per serving",
        defaultQty: 2,
        defaultMgEach: 5,
        perPersonQty: 1,
        unitLabel: "servings",
        equivalentHint: "If using infused butter/oil, this is the easiest THC control point.",
      },
      {
        id: "meal-pairing-drink",
        name: "Meal Pairing Beverage (non-THC option)",
        route: "/ingredients?category=drinks",
        suggestedRange: "0mg (recommended baseline)",
        defaultQty: 2,
        defaultMgEach: 0,
        perPersonQty: 1,
        unitLabel: "glasses",
        equivalentHint: "Always offer a non-infused drink pairing with dinner.",
      },
      {
        id: "thc-beverage-option",
        name: "THC Beverage Option (Tea / Coffee)",
        route: "/ingredients?category=drinks&recipe=cannabis-tea",
        suggestedRange: "2.5-5mg per cup",
        defaultQty: 2,
        defaultMgEach: 3.5,
        perPersonQty: 0.5,
        unitLabel: "cups",
        equivalentHint: "Optional THC drink for guests who want beverage dosing.",
      },
    ],
  },
  {
    id: "drinks-pack",
    title: "Drinks Pack Planner",
    subtitle: "Dose-controlled beverages for social settings.",
    items: [
      { id: "lemonade", name: "Infused Lemonade", route: "/ingredients?category=drinks&recipe=infused-lemonade", suggestedRange: "2.5-5mg per glass", defaultQty: 2, defaultMgEach: 3, perPersonQty: 0.5, unitLabel: "glasses", equivalentHint: "Drinks are easy to stack; keep portions clearly labeled" },
      { id: "chai", name: "Infused Chai Latte", route: "/ingredients?category=drinks&recipe=infused-chai", suggestedRange: "5mg per cup", defaultQty: 2, defaultMgEach: 5, perPersonQty: 0.5, unitLabel: "cups", equivalentHint: "Plan 1 infused cup for every 2 guests by default" },
      { id: "tonic", name: "THC Espresso Tonic", route: "/ingredients?category=drinks&recipe=espresso-tonic", suggestedRange: "5mg per glass", defaultQty: 2, defaultMgEach: 5, perPersonQty: 0.5, unitLabel: "glasses", equivalentHint: "Offer non-infused versions beside infused drinks" },
    ],
  },
];

const getDoseLevelDetails = (mgEach: number) => {
  if (mgEach <= 2.5) return { label: "Micro", desc: "very light", color: "bg-blue-50 border-blue-200 text-blue-700" };
  if (mgEach <= 5) return { label: "Low", desc: "light", color: "bg-green-50 border-green-200 text-green-700" };
  if (mgEach <= 10) return { label: "Moderate", desc: "standard", color: "bg-yellow-50 border-yellow-200 text-yellow-800" };
  return { label: "High", desc: "strong", color: "bg-orange-50 border-orange-200 text-orange-800" };
};

const getDoseLabelForUnit = (unitLabel: string): string => {
  const normalized = unitLabel.trim().toLowerCase();
  if (normalized === "wings") return "Dose per wing";
  if (normalized === "fry orders") return "Dose per fry order";
  if (normalized === "big bowls") return "Dose per bowl";
  if (normalized === "brownie pieces") return "Dose per brownie";
  if (normalized === "cookies") return "Dose per cookie";
  if (normalized === "gummies") return "Dose per gummy";
  if (normalized === "cups") return "Dose per cup";
  if (normalized === "glasses") return "Dose per glass";
  if (normalized === "servings") return "Dose per serving";
  if (normalized === "pizzas") return "Dose per pizza";
  if (normalized === "slices") return "Dose per slice";
  if (normalized === "cookies" || normalized === "cake slices") return "Dose per piece";
  return "Dose per item";
};

const getPerPersonDoseTone = (mgPerPerson: number) => {
  if (mgPerPerson < 10) return { label: "Low", color: "bg-green-50 border-green-200 text-green-700" };
  if (mgPerPerson < 20) return { label: "Moderate", color: "bg-yellow-50 border-yellow-200 text-yellow-800" };
  return { label: "Strong", color: "bg-red-50 border-red-200 text-red-800" };
};

export function PartyPackPlanner() {
  const { packId = "" } = useParams();
  const pack = PACKS.find((p) => p.id === packId) ?? PACKS[0];
  const [searchParams] = useSearchParams();
  const wingsStorageKey = `party-pack-wings:${pack.id}`;
  const wingsReturnCtxKey = `party-wings-return-ctx:${pack.id}`;

  const peopleFromQueryRaw = searchParams.get("people");
  const peopleFromQuery = peopleFromQueryRaw ? Number(peopleFromQueryRaw) : null;
  const wingSauceLabels: Record<string, string> = {
    "garlic-parmesan": "Garlic Parmesan",
    "classic-buffalo": "Classic Buffalo",
    "nashville-hot": "Nashville Hot",
    "honey-bbq": "Honey BBQ",
    "lemon-pepper": "Lemon Pepper",
    "honey-mustard": "Honey Mustard",
  };

  const buildPackItems = (people: number): PlannerItem[] =>
    pack.items.map((i) => ({
      id: i.id,
      name: i.name,
      route: i.route,
      suggestedRange: i.suggestedRange,
      qty: Math.max(1, Math.ceil(people * i.perPersonQty)),
      mgEach: i.defaultMgEach,
      unitLabel: i.unitLabel,
      equivalentHint: i.equivalentHint,
    }));

  const [items, setItems] = useState<PlannerItem[]>(buildPackItems(4));
  const [infusions, setInfusions] = useState<InfusionBase[]>([]);
  const [selectedInfusionId, setSelectedInfusionId] = useState<string>("");
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [savedWingsSplit, setSavedWingsSplit] = useState<WingsSplitState | null>(null);
  const [selectedRecipeToAdd, setSelectedRecipeToAdd] = useState<string>("");
  const [savoryInfusedItemId, setSavoryInfusedItemId] = useState<string>("starch-side");
  const [expandedItemIds, setExpandedItemIds] = useState<string[]>([]);

  type WingsSplitState = {
    totalWings: number;
    mgEach: number;
    flavors: { sauceId: string; qtyWings: number }[];
  };

  useEffect(() => {
    const saved = localStorage.getItem("infusionBases");
    const parsedCustom = safeJsonParse<InfusionBase[]>(saved, []);
    const merged = [...CANNED_INFUSIONS, ...parsedCustom];
    setInfusions(merged);
    if (merged.length > 0) {
      setSelectedInfusionId((current) => current || merged[0].id);
    }
  }, []);

  useEffect(() => {
    // Start fresh when planner is opened/switched to avoid stale values.
    const savedCtx = safeJsonParse<{ peopleCount: number } | null>(localStorage.getItem(wingsReturnCtxKey), null);
    const initPeople =
      peopleFromQuery && Number.isFinite(peopleFromQuery) && peopleFromQuery > 0
        ? peopleFromQuery
        : savedCtx && Number.isFinite(savedCtx.peopleCount) && savedCtx.peopleCount > 0
          ? savedCtx.peopleCount
          : 4;

    // One-time context so values don't get stuck forever.
    localStorage.removeItem(wingsReturnCtxKey);

    setPeopleCount(initPeople);
    setItems(buildPackItems(initPeople));
    setExpandedItemIds([]);
  }, [pack.id, peopleFromQuery]);

  const isSavoryPack = pack.id === "savory-dinner-pack";
  const savoryItemIds = new Set(["savory-main", "vegetable-side", "starch-side", "thc-beverage-option"]);

  useEffect(() => {
    if (!isSavoryPack) return;
    setItems((prev) =>
      prev.map((item) => {
        if (!savoryItemIds.has(item.id)) return item;
        const template = pack.items.find((p) => p.id === item.id);
        if (item.id === savoryInfusedItemId) {
          return {
            ...item,
            mgEach: item.mgEach > 0 ? item.mgEach : template?.defaultMgEach ?? 5,
          };
        }
        return { ...item, mgEach: 0 };
      })
    );
  }, [isSavoryPack, savoryInfusedItemId, pack.id]);

  useEffect(() => {
    const saved = safeJsonParse<WingsSplitState | null>(localStorage.getItem(wingsStorageKey), null);
    setSavedWingsSplit(saved);
  }, [wingsStorageKey]);

  useEffect(() => {
    if (!savedWingsSplit) return;
    // When returning from the wing splitter, apply the saved wing total + dose back here.
    setItems((prev) =>
      prev.map((item) =>
        item.id === "wings" ? { ...item, qty: savedWingsSplit.totalWings, mgEach: savedWingsSplit.mgEach } : item
      )
    );
  }, [savedWingsSplit]);

  useEffect(() => {
    // Auto-scale base pack quantities when guest count changes.
    setItems((prev) => {
      const templateById = new Map(pack.items.map((i) => [i.id, i]));
      return prev.map((item) => {
        const template = templateById.get(item.id);
        if (!template) return item; // Keep custom items as-is.
        return { ...item, qty: Math.max(1, Math.ceil(peopleCount * template.perPersonQty)) };
      });
    });
  }, [peopleCount, pack.id]);

  const selectedInfusion = useMemo(
    () => infusions.find((i) => i.id === selectedInfusionId) ?? null,
    [infusions, selectedInfusionId]
  );

  const totalMg = items.reduce((sum, item) => sum + item.qty * item.mgEach, 0);
  const mgPerPerson = peopleCount > 0 ? totalMg / peopleCount : 0;

  const addCustomItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        name: "Custom item",
        route: "/ingredients",
        suggestedRange: "Set your target",
        qty: 1,
        mgEach: 5,
        unitLabel: "servings",
        equivalentHint: "Use your own serving estimate",
      },
    ]);
  };

  const parseMgFromThcPerServing = (txt: string): number | null => {
    const cleaned = txt.replace(/,/g, " ");
    // Range: "~10-20mg" or "~10–20mg"
    const range = cleaned.match(/~?\s*([\d.]+)\s*(?:-|–|to)\s*([\d.]+)\s*mg/i);
    if (range) {
      const a = Number(range[1]);
      const b = Number(range[2]);
      if (Number.isFinite(a) && Number.isFinite(b)) return (a + b) / 2;
    }
    // Single: "~25mg"
    const single = cleaned.match(/~?\s*([\d.]+)\s*mg/i);
    if (single) {
      const n = Number(single[1]);
      if (Number.isFinite(n)) return n;
    }
    return null;
  };

  const addRecipeItem = () => {
    if (!selectedRecipeToAdd) return;
    if (selectedRecipeToAdd === "custom") {
      addCustomItem();
      setSelectedRecipeToAdd("");
      return;
    }

    const recipe = siteRecipes.find((r) => r.id === selectedRecipeToAdd);
    if (!recipe) return;

    const mgGuess = parseMgFromThcPerServing(recipe.thcPerServing) ?? 5;
    const unitLabel = recipe.category === "drinks" ? "cups" : "servings";

    setItems((prev) => [
      ...prev,
      {
        id: `recipe-${recipe.id}-${Date.now()}`,
        name: recipe.name,
        route: `/recipes/${recipe.id}`,
        suggestedRange: recipe.thcPerServing,
        qty: Math.max(1, Math.ceil(peopleCount)),
        mgEach: mgGuess,
        unitLabel,
        equivalentHint: `Recipe makes ${recipe.servings} ${unitLabel}.`,
      },
    ]);
    setSelectedRecipeToAdd("");
  };

  const updateItem = (id: string, field: "name" | "qty" | "mgEach", value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleExpandItem = (id: string) => {
    setExpandedItemIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const applyWingsSplitToPlanner = () => {
    if (!savedWingsSplit) return;
    setItems((prev) =>
      prev.map((item) => (item.id === "wings" ? { ...item, qty: savedWingsSplit.totalWings, mgEach: savedWingsSplit.mgEach } : item))
    );
  };

  const getItemTheme = (item: PlannerItem) => {
    const id = item.id.toLowerCase();
    const name = item.name.toLowerCase();
    if (id.includes("wing") || name.includes("wing")) return "bg-orange-50 border-orange-200";
    if (id.includes("popcorn") || name.includes("popcorn")) return "bg-yellow-50 border-yellow-200";
    if (id.includes("spreads-dips") || name.includes("dip")) return "bg-amber-50 border-amber-200";
    if (id.includes("brownie") || id.includes("cookie") || id.includes("gummy") || name.includes("dessert")) return "bg-rose-50 border-rose-200";
    if (id.includes("coffee") || id.includes("chai") || id.includes("tonic") || name.includes("coffee")) return "bg-stone-50 border-stone-300";
    return "bg-white border-gray-200";
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const nextBuildItem = items[0];
  const builtCount = items.filter((item) => item.mgEach > 0 && item.qty > 0).length;
  const progressPct = items.length > 0 ? Math.round((builtCount / items.length) * 100) : 0;

  const buildItemUrl = (item: PlannerItem) => {
    // For the main recipe builder (`/ingredients`), pass `servings` so quantities scale correctly.
    if (item.route.startsWith("/ingredients")) {
      const joiner = item.route.includes("?") ? "&" : "?";
      return `${item.route}${joiner}servings=${encodeURIComponent(item.qty)}&returnToPartyPack=${encodeURIComponent(
        `/party-mode/plan/${pack.id}`
      )}&partyPackId=${encodeURIComponent(pack.id)}&partyItemId=${encodeURIComponent(item.id)}`;
    }
    return `${item.route}${item.route.includes("?") ? "&" : "?"}returnToPartyPack=${encodeURIComponent(
      `/party-mode/plan/${pack.id}`
    )}&partyPackId=${encodeURIComponent(pack.id)}&partyItemId=${encodeURIComponent(item.id)}`;
  };

  const saveGroceryDraft = () => {
    localStorage.setItem(
      `party-pack-grocery-draft:${pack.id}`,
      JSON.stringify({
        peopleCount,
        items,
        selectedInfusionId,
        savedWingsSplit,
      })
    );
  };

  const setWingsReturnContext = () => {
    localStorage.setItem(wingsReturnCtxKey, JSON.stringify({ peopleCount }));
  };

  const savoryGuidance = useMemo(() => {
    if (!isSavoryPack) return "";
    if (savoryInfusedItemId === "savory-main") return "Infusing the protein/main: prepare starch and vegetable sides however you like.";
    if (savoryInfusedItemId === "starch-side") return "Infusing the starch: cook your protein and vegetable sides however you like.";
    if (savoryInfusedItemId === "vegetable-side") return "Infusing the vegetable side: cook your protein and starch however you like.";
    return "Infusing the THC beverage option: keep meal items non-infused and prep them however you like.";
  }, [isSavoryPack, savoryInfusedItemId]);

  const setPerPersonTarget = (targetMg: number) => {
    if (mgPerPerson <= 0) return;
    const ratio = targetMg / mgPerPerson;
    setItems((prev) =>
      prev.map((item) => {
        if (isSavoryPack && savoryItemIds.has(item.id) && item.id !== savoryInfusedItemId) return item;
        return { ...item, mgEach: Math.max(0, Number((item.mgEach * ratio).toFixed(1))) };
      })
    );
  };

  const wingFlavorIngredients: Record<string, string[]> = {
    "garlic-parmesan": ["Chicken wings", "Garlic", "Parmesan cheese", "Butter", "Salt", "Black pepper"],
    "classic-buffalo": ["Chicken wings", "Hot sauce", "Butter", "Garlic powder", "Salt"],
    "nashville-hot": ["Chicken wings", "Cayenne pepper", "Paprika", "Brown sugar", "Oil", "Garlic powder"],
    "honey-bbq": ["Chicken wings", "BBQ sauce", "Honey", "Garlic powder", "Apple cider vinegar"],
    "lemon-pepper": ["Chicken wings", "Lemons", "Black pepper", "Butter", "Garlic powder"],
    "honey-mustard": ["Chicken wings", "Honey", "Mustard", "Butter", "Garlic powder"],
  };

  const resolvedPlannerRecipes = useMemo(() => resolvePlannerRecipes(items), [items]);

  const wingGroceryExtras = useMemo(() => {
    if (!savedWingsSplit) return null;
    return {
      wingsLabel: `Chicken wings — ${savedWingsSplit.totalWings} wings total`,
      wingIngredientLines: savedWingsSplit.flavors.flatMap((f) => {
        const ings = wingFlavorIngredients[f.sauceId] ?? [];
        return ings.map((ing) =>
          ing.toLowerCase().includes("wing")
            ? ing
            : `${ing} (${wingSauceLabels[f.sauceId] ?? f.sauceId})`
        );
      }),
    };
  }, [savedWingsSplit]);

  const groceryBySectionQuick = useMemo(
    () => buildAggregatedGroceryLines(resolvedPlannerRecipes, wingGroceryExtras, { quickShop: true }),
    [resolvedPlannerRecipes, wingGroceryExtras]
  );

  return (
    <>
      <style>{`
        .party-print-only { display: none !important; }
        @media print {
          .party-print-only { display: block !important; }
          @page { margin: 0.55in; size: letter; }
          .party-print-page { page-break-after: always; break-after: page; }
          .party-print-page:last-of-type { page-break-after: auto; }
          .party-print-grocery { page-break-before: always; break-before: page; }
          .party-print-recipe { page-break-inside: avoid; }
          .party-print-quickshop li { font-size: 12pt !important; line-height: 1.45 !important; margin: 0.3em 0 !important; }
        }
      `}</style>
      <div className="app-print-hide max-w-5xl mx-auto space-y-8">
      <Helmet>
        <title>{pack.title} | Infusion Sensei</title>
        <meta
          name="description"
          content="Plan exact THC doses by item for your party pack, then generate infusion amounts automatically."
        />
      </Helmet>

      <div className="bg-white border border-gray-200 rounded-2xl p-4 app-print-hide">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Party Planner Packs</p>
        <div className="flex flex-wrap gap-2">
          {PACKS.map((p) => (
            <Link key={p.id} to={`/party-mode/plan/${encodeURIComponent(p.id)}`}>
              <Button
                variant={p.id === pack.id ? "default" : "outline"}
                className={p.id === pack.id ? "bg-purple-700 hover:bg-purple-800 text-white font-bold" : "font-bold"}
              >
                {p.title.replace(" Planner", "")}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 rounded-3xl p-8 text-white shadow-2xl app-print-hide">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{pack.title}</h1>
        <p className="text-purple-100">{pack.subtitle}</p>
        <p className="text-purple-200 text-sm mt-2">
          Plan your party dose and print a kitchen-ready package.
        </p>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-5 app-print-hide">
        <h2 className="text-2xl font-black text-gray-900 mb-4 text-center">Setup</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-bold text-gray-700">How many people?</Label>
            <Input
              type="number"
              min={1}
              value={peopleCount}
              onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-sm font-bold text-gray-700">Use your built infusion</Label>
            {infusions.length > 0 ? (
              <Select value={selectedInfusionId} onValueChange={setSelectedInfusionId}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select infusion" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg z-50">
                  {infusions.map((infusion) => (
                    <SelectItem key={infusion.id} value={infusion.id}>
                      {infusion.name} ({infusion.thcPerUnit.toFixed(2)} mg per unit)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="mt-1 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                No saved infusions yet. Build one first and it will always be available here.
              </div>
            )}
          </div>
        </div>
      </section>

      {isSavoryPack && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 app-print-hide">
          <Label className="text-sm font-bold text-orange-900">Which dinner item should be infused with THC?</Label>
          <Select value={savoryInfusedItemId} onValueChange={setSavoryInfusedItemId}>
            <SelectTrigger className="mt-2 bg-white">
              <SelectValue placeholder="Choose infused item" />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg z-50">
              <SelectItem value="savory-main">Main protein</SelectItem>
              <SelectItem value="starch-side">Starch side (pasta/rice/potatoes)</SelectItem>
              <SelectItem value="vegetable-side">Vegetable side</SelectItem>
              <SelectItem value="thc-beverage-option">THC beverage option</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-orange-900 mt-2 font-semibold">{savoryGuidance}</p>
        </div>
      )}

      <section className="space-y-3 app-print-hide">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900">Build Your Menu 🍗🍿🍟</h2>
          <p className="text-sm text-gray-600">{builtCount} of {items.length} items dialed in</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-purple-600 h-3 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
        {items.map((item) => {
          const itemTotal = item.qty * item.mgEach;
          const canBuildThisItem = !isSavoryPack || !savoryItemIds.has(item.id) || item.id === savoryInfusedItemId;
          const isSavoryNonInfused = isSavoryPack && savoryItemIds.has(item.id) && item.id !== savoryInfusedItemId;
          const isExpanded = expandedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className={`border rounded-2xl p-4 shadow-sm transition-all ${getItemTheme(item)} ${item.id === "wings" ? "ring-2 ring-orange-200" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-black text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-700">
                    {item.qty} {item.unitLabel} · {item.mgEach}mg each
                  </p>
                  <p className="text-sm font-bold text-gray-900">Total: {itemTotal.toFixed(1)}mg</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended: {item.suggestedRange}</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => toggleExpandItem(item.id)}>
                  {isExpanded ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                  {isExpanded ? "Hide details" : "Customize"}
                </Button>
              </div>
              {isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start mt-4">
                  <div className="md:col-span-6 flex flex-col">
                    <Label className="text-xs font-bold text-gray-500">Item</Label>
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1 break-words">{item.equivalentHint}</p>
                  </div>
                  <div className="md:col-span-3 flex flex-col">
                    <Label className="text-xs font-bold text-gray-500 whitespace-nowrap">Qty ({item.unitLabel})</Label>
                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => updateItem(item.id, "qty", Math.max(1, Number(e.target.value) || 1))}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col">
                    <Label className="text-xs font-bold text-gray-500 whitespace-nowrap">{getDoseLabelForUnit(item.unitLabel)}</Label>
                    <Input
                      type="number"
                      min={0}
                      step="0.5"
                      value={item.mgEach}
                      onChange={(e) => updateItem(item.id, "mgEach", Math.max(0, Number(e.target.value) || 0))}
                      className="mt-1"
                      disabled={isSavoryNonInfused}
                    />
                  </div>
                </div>
              )}
              {isSavoryNonInfused && (
                <p className="text-xs text-gray-600 mt-2">
                  Prepare this course as you like it (non-infused for this meal plan).
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                {canBuildThisItem ? (
                  <Link
                    to={
                      item.id === "wings"
                        ? `/party-mode/plan/${encodeURIComponent(pack.id)}/wings?wings=${encodeURIComponent(
                            item.qty
                          )}&mgEach=${encodeURIComponent(item.mgEach)}&people=${encodeURIComponent(peopleCount)}`
                        : buildItemUrl(item)
                    }
                    className="inline-flex"
                    onClick={item.id === "wings" ? setWingsReturnContext : undefined}
                  >
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold">
                      Start Cooking
                    </Button>
                  </Link>
                ) : (
                  <span className="text-gray-500 font-semibold">Not selected for infusion</span>
                )}
                {item.id === "wings" && savedWingsSplit && (
                  <Link
                    to={`/party-mode/plan/${encodeURIComponent(pack.id)}/wings?wings=${encodeURIComponent(
                      item.qty
                    )}&mgEach=${encodeURIComponent(item.mgEach)}&people=${encodeURIComponent(peopleCount)}`}
                    onClick={setWingsReturnContext}
                  >
                    <Button size="sm" variant="outline" className="border-orange-200 text-orange-800 hover:bg-orange-50">
                      🔥 Split Flavors
                    </Button>
                  </Link>
                )}
                {item.id === "wings" && savedWingsSplit && (
                  <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50" onClick={applyWingsSplitToPlanner}>
                    Use Saved Wing Split
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="border-red-200 text-red-700 hover:bg-red-50"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Remove
                </Button>
              </div>
            </div>
          );
        })}
      </section>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center app-print-hide">
        <div className="flex-1">
          <Label className="text-sm font-bold text-gray-700">Add an item (from recipes)</Label>
          <Select value={selectedRecipeToAdd} onValueChange={setSelectedRecipeToAdd}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a recipe to add..." />
            </SelectTrigger>
            <SelectContent className="bg-white text-gray-900 border border-gray-200 shadow-lg z-50">
              <SelectItem value="custom">Custom item (manual)</SelectItem>
              {siteRecipes
                .filter((r) => r.category === "edibles" || r.category === "drinks")
                .map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} ({r.category})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={addRecipeItem} variant="outline" className="font-bold">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Selected
        </Button>
      </div>

      <section className="bg-gray-950 rounded-2xl p-6 text-white app-print-hide">
        <h2 className="text-2xl font-black mb-4">Your Dose Plan ⚡</h2>
        <div className="bg-gray-900 rounded-2xl p-5 mb-4 text-center border border-gray-700">
          <p className="text-xs uppercase tracking-wide text-gray-400">Per Person</p>
          <p className="text-5xl font-black">{mgPerPerson.toFixed(1)}mg</p>
          {(() => {
            const tone = getPerPersonDoseTone(mgPerPerson);
            return (
              <p className={`inline-flex mt-2 items-center gap-2 border rounded-full px-3 py-1 text-sm font-bold ${tone.color}`}>
                {tone.label} — most people will feel this
              </p>
            );
          })()}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button size="sm" variant="outline" className="text-white border-gray-500 hover:bg-gray-800" onClick={() => setPerPersonTarget(10)}>
              Make it lighter (10mg)
            </Button>
            <Button size="sm" variant="outline" className="text-white border-gray-500 hover:bg-gray-800" onClick={() => setPerPersonTarget(20)}>
              Keep it strong
            </Button>
            <Button size="sm" variant="outline" className="text-white border-gray-500 hover:bg-gray-800" onClick={() => setPeopleCount((p) => p + 1)}>
              Adjust servings
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-gray-900 rounded-xl p-3">
            <p className="text-xs text-gray-400">Total pack THC</p>
            <p className="text-2xl font-black">{totalMg.toFixed(1)}mg</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3">
            <p className="text-xs text-gray-400">Per person ({peopleCount})</p>
            <p className="text-2xl font-black">{mgPerPerson.toFixed(1)}mg</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3">
            <p className="text-xs text-gray-400">Safety prompt</p>
            <p className="text-sm font-semibold">Start with one item, wait 45 min.</p>
          </div>
        </div>

        {selectedInfusion ? (
          <div className="mt-4 bg-green-900/30 border border-green-700 rounded-xl p-4">
            <p className="text-sm text-green-200">
              Using <strong>{selectedInfusion.name}</strong> at{" "}
              <strong>{selectedInfusion.thcPerUnit.toFixed(2)} mg per unit</strong>.
            </p>
            <p className="text-sm text-green-100 mt-1">
              You need about <strong>{(totalMg / Math.max(selectedInfusion.thcPerUnit, 0.0001)).toFixed(1)}</strong> total units of this infusion for the full pack.
            </p>
            {(() => {
              const unitsNeeded = totalMg / Math.max(selectedInfusion.thcPerUnit, 0.0001);
              const baseUnit = selectedInfusion.baseUnit.toLowerCase();
              const type = selectedInfusion.type;
              // Approx kitchen conversions: butter 227g per cup, oil 240ml per cup.
              if (baseUnit === "g" && type !== "tincture") {
                const cups = unitsNeeded / 227;
                const tbsp = unitsNeeded / 14.2;
                return (
                  <p className="text-sm text-green-100 mt-1">
                    ≈ <strong>{cups.toFixed(2)}</strong> cups (or ~<strong>{Math.round(tbsp)}</strong> tbsp) infused base
                  </p>
                );
              }
              if (baseUnit === "ml") {
                const cups = unitsNeeded / 240;
                const tbsp = unitsNeeded / 15;
                return (
                  <p className="text-sm text-green-100 mt-1">
                    ≈ <strong>{cups.toFixed(2)}</strong> cups (or ~<strong>{Math.round(tbsp)}</strong> tbsp) infused base
                  </p>
                );
              }
              return null;
            })()}
            <div className="mt-2 space-y-1 text-sm text-green-100">
              {items.map((item) => {
                const mgNeeded = item.qty * item.mgEach;
                const unitsNeeded = mgNeeded / Math.max(selectedInfusion.thcPerUnit, 0.0001);
                return (
                  <p key={`calc-${item.id}`}>
                    - {item.name}: {mgNeeded.toFixed(1)}mg total (~{unitsNeeded.toFixed(1)} infusion units)
                  </p>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
            Build an infusion first so we can generate exact infusion amounts for each item.
          </div>
        )}
      </section>

      {nextBuildItem && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-sm text-green-800 font-semibold mb-2">Next Step</p>
          <Link
            to={buildItemUrl(nextBuildItem)}
            className="inline-flex items-center gap-2 text-green-700 font-bold hover:underline"
          >
            {nextBuildItem.id === "wings" ? "Start building your wings (main item)" : `Build ${nextBuildItem.name}`}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3 app-print-hide">
        <Button onClick={() => window.print()} variant="outline" className="font-bold">
          <Printer className="w-4 h-4 mr-1.5" />
          Print Party Package
        </Button>
        <Link to={`/party-mode/plan/${encodeURIComponent(pack.id)}/grocery`} onClick={saveGroceryDraft}>
          <Button variant="outline" className="font-bold border-blue-300 text-blue-700 hover:bg-blue-50">
            View Full Grocery List
          </Button>
        </Link>
        <Link to="/infusions">
          <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
            Build / Manage Infusions <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link to="/party-mode">
          <Button variant="outline" className="font-bold">
            <Users className="w-4 h-4 mr-1.5" />
            Back to Party Mode
          </Button>
        </Link>
      </div>

      </div>

      {/* Print-only: one recipe per page + grocery list (not the screen layout) */}
      <div className="party-print-only text-black" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <div className="party-print-page border-b-2 border-black pb-4">
          <h1 className="text-2xl font-black">{pack.title}</h1>
          <p className="text-sm mt-2">Guests: {peopleCount} · Total THC: {totalMg.toFixed(1)}mg · Per person: {mgPerPerson.toFixed(1)}mg</p>
          <p className="text-sm mt-2">Safety: Start low, wait 45–90 minutes. Keep non-infused options clearly labeled.</p>
        </div>

        <div className="party-print-page party-print-quickshop">
          <h2 className="text-xl font-black border-b-2 border-black pb-2 mb-3">Quick shop (store aisle)</h2>
          <p className="text-xs text-gray-800 mb-4">
            Short list — boxes, bags, gallons. Use the following pages for full recipe amounts and instructions.
          </p>
          <div className="space-y-3">
            {groceryBySectionQuick.map((sec) => (
              <div key={`pq-${sec.section}`}>
                <p className="font-black text-sm border-b border-gray-400 pb-1 mb-2">{sec.section}</p>
                <ul className="list-none pl-0">
                  {sec.lines.map((line) => (
                    <li key={`${sec.section}-${line}`} className="flex gap-2">
                      <span className="shrink-0">□</span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {resolvedPlannerRecipes.map(({ item, template, siteRecipe, scale }) => (
          <div key={`pp-print-${item.id}`} className="party-print-page party-print-recipe">
            <h2 className="text-xl font-black border-b border-black pb-2 mb-3">{item.name}</h2>
            <p className="text-sm mb-3">
              Target: {item.qty} {item.unitLabel} · {getDoseLabelForUnit(item.unitLabel)}: {item.mgEach}mg · Item total:{" "}
              {(item.qty * item.mgEach).toFixed(1)}mg THC
            </p>
            {template ? (
              <>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Ingredients (scaled for your party)</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                  {template.ingredients.map((name, i) => {
                    const amt = template.amounts[i] ?? 0;
                    const unit = template.units[i] ?? "g";
                    if (amt === 0) return null;
                    return (
                      <li key={`${item.id}-ing-${i}`}>{formatScaledTemplateLine(name, amt, unit, scale)}</li>
                    );
                  })}
                </ul>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Instructions</h3>
                <ol className="list-decimal pl-5 text-sm space-y-2">
                  {template.instructions.map((step, idx) => (
                    <li key={`${item.id}-st-${idx}`}>{step}</li>
                  ))}
                </ol>
              </>
            ) : siteRecipe ? (
              <>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Ingredients (scaled)</h3>
                <ul className="list-disc pl-5 text-sm space-y-1 mb-4">
                  {siteRecipe.ingredients.map((line, i) => (
                    <li key={`${item.id}-si-${i}`}>{scaleSiteRecipeIngredientLine(line, scale)}</li>
                  ))}
                </ul>
                <h3 className="text-sm font-bold uppercase tracking-wide mb-2">Instructions</h3>
                <ol className="list-decimal pl-5 text-sm space-y-2">
                  {siteRecipe.instructions.map((step, idx) => (
                    <li key={`${item.id}-sinst-${idx}`}>{step}</li>
                  ))}
                </ol>
              </>
            ) : (
              <p className="text-sm text-gray-800">
                Open this item in the recipe builder to load full ingredients and steps.{" "}
                <span className="font-mono text-xs">Route: {item.route}</span>
              </p>
            )}
          </div>
        ))}

        <p className="text-xs text-center mt-8 mb-2 text-gray-600">Infusion Sensei · infusionsensei.com</p>
      </div>
    </>
  );
}
