import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Plus, Printer, Users } from "lucide-react";
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
import { recipes as siteRecipes, type Recipe } from "../data/recipes";

type PlannerItem = {
  id: string;
  name: string;
  route: string;
  suggestedRange: string;
  qty: number;
  mgEach: number;
  unitLabel: string;
  equivalentHint: string;
  completed?: boolean;
};

type PackTemplate = {
  id: string;
  title: string;
  subtitle: string;
  items: (Omit<PlannerItem, "qty" | "mgEach" | "completed"> & { defaultQty: number; defaultMgEach: number; perPersonQty: number })[];
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
    subtitle: "Wings, fries, popcorn, and dessert with controlled dosing.",
    items: [
      { id: "wings", name: "Infused Wings", route: "/wings", suggestedRange: "2-3mg each", defaultQty: 32, defaultMgEach: 2.5, perPersonQty: 8, unitLabel: "wings", equivalentHint: "~8-10 wings per person is average party sizing" },
      { id: "fries", name: "Garlic Butter Fries", route: "/fries", suggestedRange: "3-5mg per serving", defaultQty: 2, defaultMgEach: 4, perPersonQty: 0.5, unitLabel: "fry orders", equivalentHint: "1 large fast-food fry order serves ~2 people" },
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
      { id: "coffee", name: "Infused Coffee or Tea", route: "/coffee", suggestedRange: "2.5-5mg per cup", defaultQty: 2, defaultMgEach: 3.5, perPersonQty: 0.5, unitLabel: "cups", equivalentHint: "Plan 1 cup per 2 guests for chill packs" },
      { id: "wings", name: "Honey Mustard Wings", route: "/wings", suggestedRange: "2-3mg each", defaultQty: 16, defaultMgEach: 2.5, perPersonQty: 4, unitLabel: "wings", equivalentHint: "Light snack baseline is 4-6 wings per person" },
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
    subtitle: "Spaghetti + pizza sauce + infused drinks for a controlled dinner party.",
    items: [
      {
        id: "spaghetti",
        name: "Garlic Infused Pasta (Spaghetti-style)",
        route: "/ingredients?category=savory-meals&recipe=garlic-pasta",
        suggestedRange: "5-10mg per serving",
        defaultQty: 2,
        defaultMgEach: 6,
        perPersonQty: 1,
        unitLabel: "servings",
        equivalentHint: "1 pasta serving per guest (scales via recipe builder)",
      },
      {
        id: "pizza-sauce",
        name: "Infused Pizza Sauce",
        route: "/recipes/infused-pizza-sauce",
        suggestedRange: "~25mg per pizza",
        defaultQty: 2,
        defaultMgEach: 10,
        perPersonQty: 0.5,
        unitLabel: "pizzas",
        equivalentHint: "1 pizza for ~2 guests (recipe details divide into 4 pizzas)",
      },
      {
        id: "tea",
        name: "Infused Cannabis Tea",
        route: "/ingredients?category=drinks&recipe=cannabis-tea",
        suggestedRange: "10-20mg per cup",
        defaultQty: 1,
        defaultMgEach: 10,
        perPersonQty: 1,
        unitLabel: "cups",
        equivalentHint: "1 infused cup per guest (tea recipe servings = 1 cup)",
      },
    ],
  },
  {
    id: "drinks-pack",
    title: "Drinks Pack Planner",
    subtitle: "Dose-controlled beverages for social settings.",
    items: [
      { id: "lemonade", name: "Infused Lemonade", route: "/ingredients?category=drinks", suggestedRange: "2.5-5mg per glass", defaultQty: 2, defaultMgEach: 3, perPersonQty: 0.5, unitLabel: "glasses", equivalentHint: "Drinks are easy to stack; keep portions clearly labeled" },
      { id: "chai", name: "Infused Chai Latte", route: "/coffee", suggestedRange: "5mg per cup", defaultQty: 2, defaultMgEach: 5, perPersonQty: 0.5, unitLabel: "cups", equivalentHint: "Plan 1 infused cup for every 2 guests by default" },
      { id: "tonic", name: "THC Espresso Tonic", route: "/coffee", suggestedRange: "5mg per glass", defaultQty: 2, defaultMgEach: 5, perPersonQty: 0.5, unitLabel: "glasses", equivalentHint: "Offer non-infused versions beside infused drinks" },
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
  const progressStorageKey = `party-pack-progress:${pack.id}`;
  const wingsStorageKey = `party-pack-wings:${pack.id}`;
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
      completed: false,
    }));

  const [items, setItems] = useState<PlannerItem[]>(buildPackItems(4));
  const [infusions, setInfusions] = useState<InfusionBase[]>([]);
  const [selectedInfusionId, setSelectedInfusionId] = useState<string>("");
  const [peopleCount, setPeopleCount] = useState<number>(4);
  const [savedWingsSplit, setSavedWingsSplit] = useState<WingsSplitState | null>(null);
  const [selectedRecipeToAdd, setSelectedRecipeToAdd] = useState<string>("");

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
    setItems(buildPackItems(peopleCount));
  }, [pack.id]);

  useEffect(() => {
    const savedProgress = safeJsonParse<Record<string, boolean>>(localStorage.getItem(progressStorageKey), {});
    if (Object.keys(savedProgress).length === 0) return;
    setItems((prev) => prev.map((item) => ({ ...item, completed: !!savedProgress[item.id] })));
  }, [progressStorageKey]);

  useEffect(() => {
    const saved = safeJsonParse<WingsSplitState | null>(localStorage.getItem(wingsStorageKey), null);
    setSavedWingsSplit(saved);
  }, [wingsStorageKey]);

  useEffect(() => {
    if (!savedWingsSplit) return;
    setItems((prev) =>
      prev.map((item) => {
        // Only preserve saved split quantities once the wings item is completed.
        // Otherwise, a "new party" with a new guest count should re-scale to match peopleCount.
        if (item.id !== "wings") return item;
        if (!item.completed) return item;
        return { ...item, qty: savedWingsSplit.totalWings, mgEach: savedWingsSplit.mgEach };
      })
    );
  }, [savedWingsSplit]);

  useEffect(() => {
    // Auto-scale base pack quantities when guest count changes.
    setItems((prev) => {
      const templateById = new Map(pack.items.map((i) => [i.id, i]));
      return prev.map((item) => {
        const template = templateById.get(item.id);
        if (!template) return item; // Keep custom items as-is.
        if (item.id === "wings" && savedWingsSplit && item.completed) return item;
        return { ...item, qty: Math.max(1, Math.ceil(peopleCount * template.perPersonQty)) };
      });
    });
  }, [peopleCount, pack.id, savedWingsSplit]);

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
        completed: false,
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
        completed: false,
      },
    ]);
    setSelectedRecipeToAdd("");
  };

  const updateItem = (id: string, field: "name" | "qty" | "mgEach", value: string | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleCompleted = (id: string) => {
    setItems((prev) => {
      const next = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      const progress = Object.fromEntries(next.map((item) => [item.id, !!item.completed]));
      localStorage.setItem(progressStorageKey, JSON.stringify(progress));
      return next;
    });
  };

  const nextPendingItem = items.find((item) => !item.completed);
  const completedCount = items.filter((item) => item.completed).length;
  const nextStepIndex = nextPendingItem ? items.findIndex((i) => i.id === nextPendingItem.id) : -1;

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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Helmet>
        <title>{pack.title} | Infusion Sensei</title>
        <meta
          name="description"
          content="Plan exact THC doses by item for your party pack, then generate infusion amounts automatically."
        />
      </Helmet>

      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-gray-900 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-black mb-2">{pack.title}</h1>
        <p className="text-purple-100">{pack.subtitle}</p>
        <p className="text-purple-200 text-sm mt-2">
          Progress: {completedCount}/{items.length} items built
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
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
                <SelectContent>
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
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-sm text-blue-900">
        <p className="font-black mb-2">Per-person quantity baseline used for auto-scaling</p>
        <div className="grid md:grid-cols-2 gap-2">
          <p>- Wings: 8 per person (light snack 4-6, average 6-10, game-night main 10-15)</p>
          <p>- Fries: 0.5 order per person (1 large order serves about 2)</p>
          <p>- Popcorn: 0.35 bowls per person (1 big bowl serves about 3-4)</p>
          <p>- Brownies: 1 per person (rich brownies can be 0.5-1 each)</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => {
          const itemTotal = item.qty * item.mgEach;
          return (
            <div
              key={item.id}
              className={`bg-white border border-gray-200 rounded-2xl p-4 ${
                item.id === "wings" ? "border-orange-300 shadow-md ring-2 ring-orange-100" : ""
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                <div className="md:col-span-6 flex flex-col">
                  <Label className="text-xs font-bold text-gray-500">Item</Label>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1 break-words">Suggested: {item.suggestedRange}</p>
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
                  />
                </div>
              </div>
              {peopleCount > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  Auto: ~{(item.qty / peopleCount).toFixed(1)} {item.unitLabel} per person
                </p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-semibold">
                  Total THC for this item: {itemTotal.toFixed(1)}mg
                </span>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold">
                  {item.qty} {item.unitLabel}
                </span>
                {(() => {
                  const details = getDoseLevelDetails(item.mgEach);
                  return (
                    <span className={`${details.color} border px-2 py-0.5 rounded-full font-semibold text-xs`}>
                      Dose level: {details.label} ({details.desc})
                    </span>
                  );
                })()}
                <Link
                  to={
                    item.id === "wings"
                      ? `/party-mode/plan/${encodeURIComponent(pack.id)}/wings?wings=${encodeURIComponent(
                          item.qty
                        )}&mgEach=${encodeURIComponent(item.mgEach)}`
                      : buildItemUrl(item)
                  }
                  className="text-green-700 font-semibold hover:underline"
                >
                  Build this item
                </Link>
                {item.id === "wings" && savedWingsSplit && (
                  <Link to={`/party-mode/plan/${encodeURIComponent(pack.id)}/wings?wings=${encodeURIComponent(
                    item.qty
                  )}&mgEach=${encodeURIComponent(item.mgEach)}`}>
                    <Button size="sm" variant="outline" className="border-orange-200 text-orange-800 hover:bg-orange-50">
                      Edit wing split
                    </Button>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => toggleCompleted(item.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-semibold ${
                    item.completed
                      ? "bg-green-50 border-green-200 text-green-700"
                      : "bg-gray-50 border-gray-200 text-gray-700"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {item.completed ? "Built" : "Mark built"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1">
          <Label className="text-sm font-bold text-gray-700">Add an item (from recipes)</Label>
          <Select value={selectedRecipeToAdd} onValueChange={setSelectedRecipeToAdd}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Choose a recipe to add..." />
            </SelectTrigger>
            <SelectContent>
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

      <div className="bg-gray-950 rounded-2xl p-5 text-white">
        <h2 className="text-xl font-black mb-3">Your Dose Plan</h2>
        <div className="grid md:grid-cols-3 gap-3">
          <div className="bg-gray-900 rounded-xl p-3">
            <p className="text-xs text-gray-400">Total pack THC</p>
            <p className="text-2xl font-black">{totalMg.toFixed(1)}mg</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3">
            <p className="text-xs text-gray-400">Per person ({peopleCount})</p>
            <p className="text-2xl font-black">{mgPerPerson.toFixed(1)}mg</p>
            <div className="mt-2">
              {(() => {
                const tone = getPerPersonDoseTone(mgPerPerson);
                return (
                  <span className={`inline-flex items-center gap-2 border rounded-full px-3 py-1 text-xs font-bold ${tone.color}`}>
                    🔥 {tone.label}
                  </span>
                );
              })()}
            </div>
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
      </div>

      {nextPendingItem && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-sm text-green-800 font-semibold mb-2">
            Step {nextStepIndex + 1} of {items.length}
          </p>
          <Link
            to={buildItemUrl(nextPendingItem)}
            className="inline-flex items-center gap-2 text-green-700 font-bold hover:underline"
          >
            {nextPendingItem.id === "wings" ? "Start building your wings (main item)" : `Build ${nextPendingItem.name}`}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => window.print()} variant="outline" className="font-bold">
          <Printer className="w-4 h-4 mr-1.5" />
          Print Party Package
        </Button>
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

      {/* Grocery list for print */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-3">Party Grocery List (Wings)</h2>
        {!savedWingsSplit ? (
          <p className="text-sm text-gray-600">Plan your wings to generate a grocery list.</p>
        ) : (
          <div className="space-y-2 text-sm text-gray-800">
            <p>
              <span className="font-black">Chicken wings:</span> {savedWingsSplit.totalWings} wings
            </p>
            {savedWingsSplit.flavors.length === 0 ? (
              <p className="text-gray-600">No wing flavors saved yet.</p>
            ) : (
              savedWingsSplit.flavors.map((f) => (
                <div key={f.sauceId} className="bg-gray-50 border border-gray-100 rounded-xl p-3">
                  <p className="font-black">
                    {wingSauceLabels[f.sauceId] ?? f.sauceId} — {f.qtyWings} wings
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Build these flavors in the Wing Sauce planner to get exact ingredient amounts.
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
