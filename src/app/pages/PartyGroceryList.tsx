import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { safeJsonParse } from "../utils/storage";
import { recipes as siteRecipes } from "../data/recipes";

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

type GroceryDraft = {
  peopleCount: number;
  items: PlannerItem[];
  selectedInfusionId?: string;
  savedWingsSplit?: { totalWings: number; mgEach: number; flavors: { sauceId: string; qtyWings: number }[] } | null;
};

const PACK_LABELS: Record<string, string> = {
  "game-night": "Game Night",
  "chill-night": "Chill Night",
  "dessert-pack": "Dessert Pack",
  "savory-dinner-pack": "Savory Dinner",
  "drinks-pack": "Drinks Pack",
};

const FALLBACK_ITEMS: Record<string, PlannerItem[]> = {
  "game-night": [
    { id: "wings", name: "Infused Wings", route: "/wings", suggestedRange: "2-3mg each", qty: 32, mgEach: 2.5, unitLabel: "wings", equivalentHint: "" },
    { id: "spreads-dips", name: "Spinach Artichoke Dip", route: "/spreads-dips", suggestedRange: "3-5mg", qty: 1, mgEach: 4, unitLabel: "dip batch", equivalentHint: "" },
    { id: "popcorn", name: "Caramel Popcorn", route: "/popcorn", suggestedRange: "2-3mg", qty: 2, mgEach: 2.5, unitLabel: "big bowls", equivalentHint: "" },
    { id: "brownie", name: "Cannabis Brownie", route: "/ingredients?category=baked-goods&recipe=brownies", suggestedRange: "5-10mg", qty: 4, mgEach: 7.5, unitLabel: "brownie pieces", equivalentHint: "" },
  ],
};

const WING_FLAVOR_LABELS: Record<string, string> = {
  "garlic-parmesan": "Garlic Parmesan",
  "classic-buffalo": "Classic Buffalo",
  "honey-bbq": "Honey BBQ",
  "lemon-pepper": "Lemon Pepper",
  teriyaki: "Teriyaki",
  "mango-habanero": "Mango Habanero",
  "nashville-hot": "Nashville Hot",
  "chili-crisp": "Chili Crisp",
  "cajun-butter": "Cajun Butter",
  "sriracha-honey": "Sriracha Honey",
  "maple-bacon": "Maple Bacon",
};

export function PartyGroceryList() {
  const { packId = "game-night" } = useParams();
  const [view, setView] = useState<"quick" | "detailed">("quick");
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [extraItems, setExtraItems] = useState<string[]>([]);
  const [extraInput, setExtraInput] = useState("");

  const draft = safeJsonParse<GroceryDraft | null>(
    localStorage.getItem(`party-pack-grocery-draft:${packId}`),
    null
  );
  const peopleCount = draft?.peopleCount ?? 4;
  const items = draft?.items?.length ? draft.items : (FALLBACK_ITEMS[packId] ?? FALLBACK_ITEMS["game-night"]);
  const totalMg = items.reduce((sum, i) => sum + i.qty * i.mgEach, 0);

  const parseRecipeIdFromRoute = (route: string): string | null => {
    if (route.startsWith("/recipes/")) return route.replace("/recipes/", "").split("?")[0] || null;
    if (!route.startsWith("/ingredients")) return null;
    const [, query = ""] = route.split("?");
    return new URLSearchParams(query).get("recipe");
  };

  const categoryForIngredient = (ingredient: string): string => {
    const i = ingredient.toLowerCase();
    if (/(wing|chicken|beef|pork|meat|bacon)/.test(i)) return "Meat";
    if (/(milk|butter|cheese|cream|egg|parmesan)/.test(i)) return "Dairy";
    if (/(salt|pepper|paprika|garlic powder|spice|seasoning|cinnamon|nutmeg)/.test(i)) return "Spices";
    if (/(garlic|potato|onion|lemon|lime|herb|parsley|green onion)/.test(i)) return "Produce";
    if (/(oil|flour|sugar|kernels|sauce|honey|soy|cocoa|chips|vinegar)/.test(i)) return "Pantry";
    if (/(coffee|tea|juice|soda|water|tonic)/.test(i)) return "Beverages";
    return "Misc";
  };

  const byRecipe = useMemo(() => {
    return items.map((item) => {
      const recipeId = parseRecipeIdFromRoute(item.route);
      const recipe = recipeId ? siteRecipes.find((r) => r.id === recipeId) : null;
      return { item, recipe };
    });
  }, [items]);

  const grouped = useMemo(() => {
    const m = new Map<string, Set<string>>();
    byRecipe.forEach(({ item, recipe }) => {
      if (item.id === "wings" && draft?.savedWingsSplit) {
        const wingsLabel = `Chicken wings - ${draft.savedWingsSplit.totalWings} wings`;
        const c = categoryForIngredient(wingsLabel);
        if (!m.has(c)) m.set(c, new Set());
        m.get(c)!.add(wingsLabel);
      }
      (recipe?.ingredients ?? []).forEach((ing) => {
        const c = categoryForIngredient(ing);
        if (!m.has(c)) m.set(c, new Set());
        m.get(c)!.add(ing);
      });
    });
    extraItems.forEach((ing) => {
      const c = categoryForIngredient(ing);
      if (!m.has(c)) m.set(c, new Set());
      m.get(c)!.add(ing);
    });
    return Array.from(m.entries()).map(([section, ingredients]) => ({ section, ingredients: Array.from(ingredients) }));
  }, [byRecipe, extraItems, draft?.savedWingsSplit]);

  const addExtraItem = () => {
    const trimmed = extraInput.trim();
    if (!trimmed) return;
    setExtraItems((prev) => [...prev, trimmed]);
    setExtraInput("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Helmet>
        <title>{PACK_LABELS[packId] ?? "Party"} Grocery List | Infusion Sensei</title>
      </Helmet>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h1 className="text-3xl font-black text-gray-900">{PACK_LABELS[packId] ?? "Party"} Grocery List</h1>
        <p className="text-gray-700 mt-1">
          For {peopleCount} guests · {items.length} infused items · Estimated total THC: {totalMg.toFixed(1)}mg
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-1.5" />Print List</Button>
          <Link to={`/party-mode/plan/${packId}`}><Button variant="outline">Back to Planner</Button></Link>
          <Button variant={view === "quick" ? "default" : "outline"} onClick={() => setView("quick")}>Quick Shop</Button>
          <Button variant={view === "detailed" ? "default" : "outline"} onClick={() => setView("detailed")}>Detailed Prep View</Button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-xl font-black mb-3">Master Shopping List</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {grouped.map((section) => (
            <div key={section.section} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <p className="font-black mb-2">{section.section}</p>
              {section.ingredients.map((ing) => {
                const key = `${section.section}:${ing}`;
                return (
                  <label key={key} className="flex items-center gap-2 text-sm py-1">
                    <input type="checkbox" checked={!!checks[key]} onChange={(e) => setChecks((p) => ({ ...p, [key]: e.target.checked }))} />
                    <span className={checks[key] ? "line-through text-gray-400" : ""}>{ing}</span>
                  </label>
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input value={extraInput} onChange={(e) => setExtraInput(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1" placeholder="Add custom grocery item..." />
          <Button onClick={addExtraItem}>Add</Button>
        </div>
      </div>

      {view === "detailed" && (
        <>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-xl font-black mb-3">By Recipe Breakdown</h2>
            <div className="space-y-3">
              {byRecipe.map(({ item, recipe }) => (
                <div key={item.id} className="border border-gray-200 rounded-xl p-3">
                  <p className="font-black text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Makes: {item.qty} {item.unitLabel} · Target dose: {item.mgEach}mg each</p>
                  <ul className="list-disc pl-5 text-sm mt-2">
                    {(recipe?.ingredients ?? ["Build this recipe from planner to generate full ingredient detail."]).map((ing) => (
                      <li key={`${item.id}:${ing}`}>{ing}</li>
                    ))}
                  </ul>
                  {item.id === "wings" && draft?.savedWingsSplit?.flavors?.length ? (
                    <div className="mt-2 text-sm">
                      <p className="font-semibold">Flavor splits</p>
                      <ul className="list-disc pl-5">
                        {draft.savedWingsSplit.flavors.map((f) => (
                          <li key={f.sauceId}>{WING_FLAVOR_LABELS[f.sauceId] ?? f.sauceId} — {f.qtyWings} wings</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h2 className="text-xl font-black mb-2">Infusion Summary</h2>
            <p className="text-sm text-gray-700">Total THC needed: {totalMg.toFixed(1)}mg</p>
            <p className="text-sm text-gray-700">Using selected base, divide infusion allocation by recipe totals below:</p>
            <div className="mt-2 space-y-1 text-sm">
              {items.map((item) => (
                <p key={`sum-${item.id}`}>- {item.name}: {(item.qty * item.mgEach).toFixed(1)}mg</p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

