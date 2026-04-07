import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calculator, FlaskConical } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { trackEvent } from "../utils/analytics";
import { appendInternalUtmToPath } from "../utils/utmLinks";
import {
  carrierMismatchMessage,
  getAllCalculatorRecipeOptions,
  groupCalculatorRecipesForSelect,
  parseRecipeKey,
  recipeKey,
  userCarrierFromInfusionPresetId,
} from "../utils/calculatorRecipeRoutes";

const INFUSION_PRESETS = [
  { id: "butter", label: "Butter (70%)", efficiency: 70 },
  { id: "oil", label: "Oil (75%)", efficiency: 75 },
  { id: "honey", label: "Honey (65%)", efficiency: 65 },
  { id: "sugar", label: "Sugar (60%)", efficiency: 60 },
  { id: "alcohol", label: "Alcohol tincture (85%)", efficiency: 85 },
];

const BASE_UNITS = [
  { id: "tbsp", label: "tbsp", toTbsp: 1 },
  { id: "cups", label: "cups", toTbsp: 16 },
  { id: "ml", label: "ml", toTbsp: 1 / 14.7868 },
];

const CALCULATOR_FAQS = [
  {
    q: "How do I calculate THC per serving in homemade edibles?",
    a: "Estimate total infused THC from flower grams, THC percent, and infusion efficiency. Then divide by total infused-base volume for mg per tablespoon, multiply by the amount used in your recipe, and divide by servings.",
  },
  {
    q: "What infusion efficiency should I use for butter or oil?",
    a: "Most home infusions land around 60-80% depending on decarb quality, temperature control, and straining losses. Start conservative and validate with your own results over a few batches.",
  },
  {
    q: "Can I use a butter calculation in a tincture recipe?",
    a: "Not as a 1:1 swap. Recipes are built around specific infusion carriers. If the selected recipe expects tincture, cannabis honey, or cannabis sugar, use that same base type for reliable texture and dosing.",
  },
  {
    q: "Why does mg per serving change when I edit servings?",
    a: "Total THC in the infused amount stays the same, but you are dividing it into a different number of portions. More servings lowers mg each; fewer servings raises mg each.",
  },
] as const;

export function THCCalculatorPage() {
  const allRecipeOptions = useMemo(() => getAllCalculatorRecipeOptions(), []);
  const recipeGroups = useMemo(() => groupCalculatorRecipesForSelect(), []);

  const [selectedRecipeKey, setSelectedRecipeKey] = useState(() => {
    const all = getAllCalculatorRecipeOptions();
    const d = all.find((r) => r.id === "chocolate-chip-cookies") ?? all[0];
    return recipeKey(d.category, d.id);
  });

  const [thcPct, setThcPct] = useState(20);
  const [grams, setGrams] = useState(7);
  const [efficiency, setEfficiency] = useState(70);
  const [baseUnit, setBaseUnit] = useState("tbsp");
  const [baseAmount, setBaseAmount] = useState(16);
  const [usedInfusionTbsp, setUsedInfusionTbsp] = useState(12);
  const [batchServings, setBatchServings] = useState(16);
  const [recipeServings, setRecipeServings] = useState(24);

  const selectedRecipe = useMemo(() => {
    const parsed = parseRecipeKey(selectedRecipeKey);
    if (!parsed) return allRecipeOptions[0];
    return (
      allRecipeOptions.find((r) => r.category === parsed.category && r.id === parsed.id) ?? allRecipeOptions[0]
    );
  }, [selectedRecipeKey, allRecipeOptions]);

  const selectedPreset = useMemo(() => {
    const exact = INFUSION_PRESETS.find((p) => p.efficiency === efficiency);
    if (exact) return exact;
    return INFUSION_PRESETS.reduce((a, b) =>
      Math.abs(a.efficiency - efficiency) <= Math.abs(b.efficiency - efficiency) ? a : b
    );
  }, [efficiency]);

  const userCarrierKind = userCarrierFromInfusionPresetId(selectedPreset.id);
  const carrierWarning =
    selectedRecipe ? carrierMismatchMessage(userCarrierKind, selectedRecipe.carrierKind) : null;

  const totalInfusionMg = grams * (thcPct / 100) * 1000 * (efficiency / 100);
  const selectedBaseUnit = BASE_UNITS.find((u) => u.id === baseUnit) ?? BASE_UNITS[0];
  const totalInfusionTbsp = baseAmount * selectedBaseUnit.toTbsp;
  const mgPerTbsp = totalInfusionTbsp > 0 ? totalInfusionMg / totalInfusionTbsp : 0;
  const batchMgPerServing = batchServings > 0 ? totalInfusionMg / batchServings : 0;
  const recipeMg = mgPerTbsp * usedInfusionTbsp;
  const mgPerServing = recipeServings > 0 ? recipeMg / recipeServings : 0;
  const infusionTbspPerServing = recipeServings > 0 ? usedInfusionTbsp / recipeServings : 0;

  const doseCopy = useMemo(() => {
    if (mgPerServing <= 5) {
      return { headline: "Light / beginner friendly", sub: "Most people can start here comfortably." };
    }
    if (mgPerServing <= 10) {
      return { headline: "Good for a relaxing evening", sub: "Moderate and manageable for many users." };
    }
    if (mgPerServing <= 25) {
      return { headline: "Strong — most people will feel this", sub: "Start with a partial serving and wait." };
    }
    return { headline: "Heavy — experienced users only", sub: "Very strong; most people should take a fraction only." };
  }, [mgPerServing]);

  const tier =
    mgPerServing <= 5 ? { label: "Micro / Light", color: "text-green-600", bg: "bg-green-50 border-green-200" } :
    mgPerServing <= 10 ? { label: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" } :
    mgPerServing <= 25 ? { label: "Strong", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" } :
    { label: "Very Strong", color: "text-red-600", bg: "bg-red-50 border-red-200" };

  const doseScalePct = Math.min(100, (mgPerServing / 50) * 100);
  const builderLink = appendInternalUtmToPath(
    `/ingredients?category=${encodeURIComponent(selectedRecipe.category)}&recipe=${encodeURIComponent(selectedRecipe.id)}&servings=${encodeURIComponent(recipeServings)}&targetMgPerServing=${encodeURIComponent(mgPerServing.toFixed(4))}&calcInfusedTbsp=${encodeURIComponent(usedInfusionTbsp.toFixed(4))}&calcMgPerTbsp=${encodeURIComponent(mgPerTbsp.toFixed(4))}&calcSource=edibles-calculator`,
    { content: "calc_to_builder" }
  );

  useEffect(() => {
    trackEvent("calculator_started", {
      page: "edibles-calculator",
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Helmet>
        <title>Edibles Calculator: Exact THC Per Serving (No Guessing)</title>
        <meta
          name="description"
          content="Calculate exact THC in butter, oil, honey, sugar, or recipes. Stop guessing edible strength and get mg per serving instantly."
        />
        <meta name="keywords" content="edibles calculator, THC dosage calculator, THC per serving, homemade edibles, cannabutter calculator, edible potency" />
        <link rel="canonical" href="https://infusionsensei.com/edibles-calculator" />
        <meta property="og:title" content="Edibles Calculator — Exact THC mg per Serving | Infusion Sensei" />
        <meta property="og:description" content="Free THC calculator for homemade edibles. Get mg per serving for butter, oil, and full batches in seconds." />
        <meta property="og:url" content="https://infusionsensei.com/edibles-calculator" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: CALCULATOR_FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          })}
        </script>
      </Helmet>

      <section id="calculator" className="bg-white rounded-3xl border-2 border-green-200 p-8 shadow-xl space-y-6">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Edibles Calculator</h1>
        <p className="text-gray-500 text-sm">Enter your flower and base to calculate exact THC per serving, then apply it to a recipe.</p>

        <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">1) Base Type</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                >
                  {INFUSION_PRESETS.map((p) => (
                    <option key={p.id} value={p.efficiency}>{p.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">{selectedPreset ? `Using ${selectedPreset.label}` : ""}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">2) Base Quantity</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input type="number" min={0.1} step={0.1} value={baseAmount} onChange={(e) => setBaseAmount(Math.max(0.1, Number(e.target.value) || 0.1))} />
                  <select className="rounded-lg border border-gray-300 px-2 py-2 text-sm" value={baseUnit} onChange={(e) => setBaseUnit(e.target.value)}>
                    {BASE_UNITS.map((u) => (
                      <option key={u.id} value={u.id}>{u.label}</option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-gray-500 mt-1">Total base after decarb + infusion (entire batch).</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">3) Batch Servings</label>
                <Input type="number" min={1} step={1} value={batchServings} onChange={(e) => setBatchServings(Math.max(1, Number(e.target.value) || 1))} />
                <p className="text-xs text-gray-500 mt-1">Used to show mg per serving for your full infused batch.</p>
              </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">4) THC Strength %</label>
                <p className="text-xs text-gray-400 mb-2">Check your packaging — usually 15–30% for flower</p>
                <div className="flex items-center gap-3">
                  <input type="range" min="1" max="99" value={thcPct} onChange={e => { setThcPct(Number(e.target.value)); trackEvent("calculator_used", { thc_pct: Number(e.target.value) }); }} className="flex-1 accent-green-600" />
                  <span className="font-black text-green-700 text-lg w-16 text-right">{thcPct}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">5) Cannabis Used (grams)</label>
                <p className="text-xs text-gray-400 mb-2">Flower amount you decarb and infuse.</p>
                <div className="flex items-center gap-3">
                  <input type="range" min="0.5" max="28" step="0.5" value={grams} onChange={e => setGrams(Number(e.target.value))} className="flex-1 accent-green-600" />
                  <span className="font-black text-green-700 text-lg w-16 text-right">{grams}g</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">6) Infusion Efficiency (%)</label>
                <p className="text-xs text-gray-400 mb-2">Typical: 60–80% for butter/oil, 90%+ for distillate</p>
                <div className="flex items-center gap-3">
                  <input type="range" min="10" max="100" value={efficiency} onChange={e => setEfficiency(Number(e.target.value))} className="flex-1 accent-green-600" />
                  <span className="font-black text-green-700 text-lg w-16 text-right">{efficiency}%</span>
                </div>
              </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-5">
            <p className="text-xs font-bold text-blue-700 uppercase mb-1">Batch Result</p>
            <p className="text-3xl font-black text-blue-900">{totalInfusionMg.toFixed(0)}mg</p>
            <p className="text-sm text-blue-800">Total THC in entire infused base</p>
          </div>
          <div className={`rounded-2xl border-2 p-5 ${tier.bg}`}>
            <p className="text-xs font-bold text-gray-600 uppercase mb-1">Batch Per Serving</p>
            <p className={`text-3xl font-black ${tier.color}`}>{batchMgPerServing.toFixed(1)}mg</p>
            <p className="text-sm text-gray-700">{doseCopy.headline}</p>
            <p className="text-xs text-gray-500 mt-1">{doseCopy.sub}</p>
            <p className="text-xs text-gray-500 mt-2">Potency: {mgPerTbsp.toFixed(1)}mg per tbsp</p>
            <div className="mt-2">
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: `${doseScalePct}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
          <p className="font-black text-gray-900 mb-3">Would you like to use this in a recipe?</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Recipe</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white max-h-[min(50vh,280px)] overflow-y-auto"
                value={selectedRecipeKey}
                onChange={(e) => {
                  const key = e.target.value;
                  setSelectedRecipeKey(key);
                  const parsed = parseRecipeKey(key);
                  if (parsed) {
                    const opt = allRecipeOptions.find(
                      (r) => r.category === parsed.category && r.id === parsed.id
                    );
                    if (opt) {
                      setRecipeServings(opt.servings);
                      setUsedInfusionTbsp(8);
                    }
                  }
                }}
              >
                {recipeGroups.map((g) => (
                  <optgroup key={g.category} label={g.label}>
                    {g.recipes.map((r) => (
                      <option key={`${r.category}|${r.id}`} value={recipeKey(r.category, r.id)}>
                        {r.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Opens the builder with your mg/tbsp from this calculator.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Infused base used (tbsp)</label>
                <Input
                  type="number"
                  min={0}
                  step={0.1}
                  value={usedInfusionTbsp}
                  onChange={(e) => setUsedInfusionTbsp(Math.max(0, Number(e.target.value) || 0))}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Recipe servings</label>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={recipeServings}
                  onChange={(e) => setRecipeServings(Math.max(1, Number(e.target.value) || 1))}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-3">
            Recipe output: <strong>{recipeMg.toFixed(0)}mg total</strong> from infused base, about{" "}
            <strong>
              {mgPerServing.toFixed(1)}mg per serving
            </strong>{" "}
            ({selectedRecipe.name}).
          </p>
          <p className="text-xs text-gray-500 mt-1">Infused base per serving: {infusionTbspPerServing.toFixed(3)} tbsp</p>
          {carrierWarning && (
            <div className="mt-3 rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p className="font-bold text-amber-900 mb-1">Base type doesn&apos;t match this recipe</p>
              <p>{carrierWarning}</p>
            </div>
          )}
          <div className="mt-4">
            {carrierWarning ? (
              <Button type="button" disabled className="bg-gray-300 text-gray-600 font-bold cursor-not-allowed">
                <FlaskConical className="w-4 h-4 mr-2" /> Open in recipe builder
              </Button>
            ) : (
              <Link
                to={builderLink}
                onClick={() =>
                  {
                    trackEvent("calculator_completed", {
                      product: selectedRecipe.id,
                      recipe_servings: recipeServings,
                      infused_tbsp: Number(usedInfusionTbsp.toFixed(2)),
                      mg_per_serving: Number(mgPerServing.toFixed(2)),
                    });
                    trackEvent("calculator_open_builder", {
                      recipe_id: selectedRecipe.id,
                      recipe_category: selectedRecipe.category,
                      base_type: selectedPreset.id,
                      recipe_servings: recipeServings,
                      infused_tbsp: Number(usedInfusionTbsp.toFixed(2)),
                      mg_per_tbsp: Number(mgPerTbsp.toFixed(2)),
                      mg_per_serving: Number(mgPerServing.toFixed(2)),
                    });
                  }
                }
              >
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                  <FlaskConical className="w-4 h-4 mr-2" /> Open in recipe builder
                </Button>
              </Link>
            )}
            <p className="text-xs text-amber-700 mt-2">
              Note: if infused amount is very high, the recipe builder may show a warning.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-green-200 p-8 shadow-sm space-y-5">
        <h2 className="text-2xl font-black text-gray-900">How to use this THC calculator correctly</h2>
        <p className="text-gray-700">
          Use this page as your dosing source of truth: first estimate potency of your infused base, then map that into
          a real recipe by entering how much infused base you actually used and how many portions you are serving. For
          best consistency, keep your unit choices stable (tbsp or grams) and avoid switching base types mid-flow.
        </p>
        <p className="text-gray-700">
          If you are sharing with a mixed-tolerance group, start with lower target mg per serving and increase in small
          steps. The builder link carries your current mg-per-tablespoon and target mg-per-serving values into the recipe
          workflow so you can scale ingredients without losing potency math.
        </p>
        <div className="space-y-3">
          <h3 className="text-lg font-black text-gray-900">FAQ</h3>
          {CALCULATOR_FAQS.map((f) => (
            <div key={f.q} className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <p className="font-bold text-gray-900">{f.q}</p>
              <p className="text-sm text-gray-700 mt-1">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-center text-white shadow-2xl">
        <Calculator className="w-10 h-10 mx-auto mb-3 text-green-300" />
        <h2 className="text-2xl font-black mb-2">Ready to Calculate Your Exact Dose?</h2>
        <p className="text-green-200 mb-5">Use your infusion details once, then test different products quickly.</p>
        <a href="#calculator"><Button className="bg-white text-green-800 hover:bg-green-50 font-black px-8 py-3">Back to calculator <ArrowRight className="w-4 h-4 ml-2" /></Button></a>
      </section>
    </div>
  );
}
