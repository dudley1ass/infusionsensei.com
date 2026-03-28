import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import { safeJsonParse } from "../utils/storage";
import {
  buildAggregatedGroceryLines,
  resolvePlannerRecipes,
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

  const wingSauceLabels: Record<string, string> = {
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
    if (!draft?.savedWingsSplit) return null;
    return {
      wingsLabel: `Chicken wings — ${draft.savedWingsSplit.totalWings} wings total`,
      wingIngredientLines: draft.savedWingsSplit.flavors.flatMap((f) => {
        const ings = wingFlavorIngredients[f.sauceId] ?? [];
        return ings.map((ing) =>
          ing.toLowerCase().includes("wing") ? ing : `${ing} (${wingSauceLabels[f.sauceId] ?? f.sauceId})`
        );
      }),
    };
  }, [draft?.savedWingsSplit]);

  const grouped = useMemo(() => {
    const base = buildAggregatedGroceryLines(resolvedPlannerRecipes, wingGroceryExtras);
    if (extraItems.length === 0) return base;
    const extraSection = "Extras";
    const next = base.map((s) => ({ ...s }));
    const idx = next.findIndex((s) => s.section === extraSection);
    if (idx === -1) next.push({ section: extraSection, lines: [...extraItems] });
    else next[idx] = { section: extraSection, lines: [...next[idx].lines, ...extraItems] };
    return next;
  }, [resolvedPlannerRecipes, wingGroceryExtras, extraItems]);

  const byRecipeDetail = useMemo(() => {
    return resolvedPlannerRecipes.map((r) => {
      const { item, template, siteRecipe, scale } = r;
      let ingredientLines: string[] = [];
      if (template) {
        ingredientLines = template.ingredients
          .map((name, i) => {
            const amt = template.amounts[i] ?? 0;
            const unit = template.units[i] ?? "g";
            if (amt === 0) return null;
            return formatScaledTemplateLine(name, amt, unit, scale);
          })
          .filter((x): x is string => x != null);
      } else if (siteRecipe) {
        ingredientLines = siteRecipe.ingredients.map((line) => scaleSiteRecipeIngredientLine(line, scale));
      } else {
        ingredientLines = ["Open this recipe in the builder for full scaled ingredients."];
      }
      return { item, ingredientLines };
    });
  }, [resolvedPlannerRecipes]);

  const addExtraItem = () => {
    const trimmed = extraInput.trim();
    if (!trimmed) return;
    setExtraItems((prev) => [...prev, trimmed]);
    setExtraInput("");
  };

  return (
    <>
      <style>{`
        .grocery-print-only { display: none !important; }
        @media print {
          .grocery-print-only { display: block !important; }
          @page { margin: 0.55in; size: letter; }
        }
      `}</style>
      <div className="app-print-hide max-w-5xl mx-auto space-y-6">
        <Helmet>
          <title>{PACK_LABELS[packId] ?? "Party"} Grocery List | Infusion Sensei</title>
        </Helmet>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h1 className="text-3xl font-black text-gray-900">{PACK_LABELS[packId] ?? "Party"} Grocery List</h1>
          <p className="text-gray-700 mt-1">
            For {peopleCount} guests · {items.length} infused items · Estimated total THC: {totalMg.toFixed(1)}mg
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Amounts below are scaled from your party plan (servings, doses). Add custom lines at the bottom — they print too.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="w-4 h-4 mr-1.5" />
              Print grocery list
            </Button>
            <Link to={`/party-mode/plan/${packId}`}>
              <Button variant="outline">Back to Planner</Button>
            </Link>
            <Button variant={view === "quick" ? "default" : "outline"} onClick={() => setView("quick")}>
              Quick Shop
            </Button>
            <Button variant={view === "detailed" ? "default" : "outline"} onClick={() => setView("detailed")}>
              Detailed Prep View
            </Button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <h2 className="text-xl font-black mb-3">Master shopping list</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {grouped.map((section) => (
              <div key={section.section} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <p className="font-black mb-2">{section.section}</p>
                {section.lines.map((line) => {
                  const key = `${section.section}:${line}`;
                  return (
                    <label key={key} className="flex items-center gap-2 text-sm py-1">
                      <input
                        type="checkbox"
                        checked={!!checks[key]}
                        onChange={(e) => setChecks((p) => ({ ...p, [key]: e.target.checked }))}
                      />
                      <span className={checks[key] ? "line-through text-gray-400" : ""}>{line}</span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={extraInput}
              onChange={(e) => setExtraInput(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1"
              placeholder="Add custom grocery item..."
            />
            <Button onClick={addExtraItem}>Add</Button>
          </div>
        </div>

        {view === "detailed" && (
          <>
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-xl font-black mb-3">By recipe (scaled)</h2>
              <div className="space-y-3">
                {byRecipeDetail.map(({ item, ingredientLines }) => (
                  <div key={item.id} className="border border-gray-200 rounded-xl p-3">
                    <p className="font-black text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Makes: {item.qty} {item.unitLabel} · Target dose: {item.mgEach}mg each
                    </p>
                    <ul className="list-disc pl-5 text-sm mt-2">
                      {ingredientLines.map((ing) => (
                        <li key={`${item.id}:${ing}`}>{ing}</li>
                      ))}
                    </ul>
                    {item.id === "wings" && draft?.savedWingsSplit?.flavors?.length ? (
                      <div className="mt-2 text-sm">
                        <p className="font-semibold">Flavor splits</p>
                        <ul className="list-disc pl-5">
                          {draft.savedWingsSplit.flavors.map((f) => (
                            <li key={f.sauceId}>
                              {WING_FLAVOR_LABELS[f.sauceId] ?? f.sauceId} — {f.qtyWings} wings
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h2 className="text-xl font-black mb-2">Infusion summary</h2>
              <p className="text-sm text-gray-700">Total THC needed: {totalMg.toFixed(1)}mg</p>
              <p className="text-sm text-gray-700">Using selected base, divide infusion allocation by recipe totals below:</p>
              <div className="mt-2 space-y-1 text-sm">
                {items.map((item) => (
                  <p key={`sum-${item.id}`}>
                    - {item.name}: {(item.qty * item.mgEach).toFixed(1)}mg
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grocery-print-only text-black px-2" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
        <h1 className="text-2xl font-black border-b-2 border-black pb-2 mb-3">{PACK_LABELS[packId] ?? "Party"} — Grocery list</h1>
        <p className="text-sm mb-4">
          {peopleCount} guests · {items.length} infused items · ~{totalMg.toFixed(1)}mg THC total
        </p>
        <div className="space-y-3">
          {grouped.map((sec) => (
            <div key={`p-${sec.section}`}>
              <p className="font-bold text-sm">{sec.section}</p>
              <ul className="list-disc pl-5 text-sm">
                {sec.lines.map((line) => (
                  <li key={`p-${sec.section}-${line}`}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-center mt-8 text-gray-600">Infusion Sensei · infusionsensei.com</p>
      </div>
    </>
  );
}

