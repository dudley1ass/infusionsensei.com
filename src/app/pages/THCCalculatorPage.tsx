import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calculator, FlaskConical } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { trackEvent } from "../utils/analytics";

type ProductPreset = {
  id: "cookies" | "brownies" | "popcorn" | "wings" | "coffee";
  label: string;
  emoji: string;
  baseInfusionTbsp: number;
  baseServings: number;
  servingUnit: string;
  category: string;
  recipeHint: string;
};

const PRODUCT_PRESETS: ProductPreset[] = [
  { id: "cookies", label: "Cookies", emoji: "🍪", baseInfusionTbsp: 12, baseServings: 24, servingUnit: "1 cookie", category: "baked-goods", recipeHint: "chocolate-chip-cookies" },
  { id: "brownies", label: "Brownies", emoji: "🍫", baseInfusionTbsp: 8, baseServings: 16, servingUnit: "1 brownie", category: "baked-goods", recipeHint: "brownies" },
  { id: "popcorn", label: "Popcorn", emoji: "🍿", baseInfusionTbsp: 4, baseServings: 12, servingUnit: "1 cup popcorn", category: "snacks", recipeHint: "garlic-butter-popcorn" },
  { id: "wings", label: "Wings", emoji: "🍗", baseInfusionTbsp: 4, baseServings: 32, servingUnit: "1 wing", category: "wings", recipeHint: "classic-buffalo-wings" },
  { id: "coffee", label: "Coffee", emoji: "☕", baseInfusionTbsp: 2, baseServings: 4, servingUnit: "1 cup coffee", category: "drinks", recipeHint: "bulletproof-coffee" },
];

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

export function THCCalculatorPage() {
  const [productId, setProductId] = useState<ProductPreset["id"]>("cookies");
  const [thcPct, setThcPct] = useState(20);
  const [grams, setGrams] = useState(7);
  const [efficiency, setEfficiency] = useState(70);
  const [baseUnit, setBaseUnit] = useState("tbsp");
  const [baseAmount, setBaseAmount] = useState(16);
  const [usedInfusionTbsp, setUsedInfusionTbsp] = useState(12);
  const [batchServings, setBatchServings] = useState(16);
  const [recipeServings, setRecipeServings] = useState(24);

  const selectedProduct = PRODUCT_PRESETS.find((p) => p.id === productId) ?? PRODUCT_PRESETS[0];
  const selectedPreset = INFUSION_PRESETS.find((p) => p.efficiency === efficiency);

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
  const builderLink = `/ingredients?category=${encodeURIComponent(selectedProduct.category)}&recipe=${encodeURIComponent(selectedProduct.recipeHint)}&servings=${encodeURIComponent(recipeServings)}&targetMgPerServing=${encodeURIComponent(mgPerServing.toFixed(4))}&calcInfusedTbsp=${encodeURIComponent(usedInfusionTbsp.toFixed(4))}&calcMgPerTbsp=${encodeURIComponent(mgPerTbsp.toFixed(4))}&calcSource=edibles-calculator`;

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
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Recipe</label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white"
                value={productId}
                onChange={(e) => {
                  const next = PRODUCT_PRESETS.find((p) => p.id === e.target.value);
                  setProductId(e.target.value as ProductPreset["id"]);
                  if (next) {
                    setRecipeServings(next.baseServings);
                    setUsedInfusionTbsp(next.baseInfusionTbsp);
                  }
                }}
              >
                {PRODUCT_PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Infused Base Used (tbsp)</label>
              <Input type="number" min={0} step={0.1} value={usedInfusionTbsp} onChange={(e) => setUsedInfusionTbsp(Math.max(0, Number(e.target.value) || 0))} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Recipe Servings</label>
              <Input type="number" min={1} step={1} value={recipeServings} onChange={(e) => setRecipeServings(Math.max(1, Number(e.target.value) || 1))} />
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-3">
            Recipe output: <strong>{recipeMg.toFixed(0)}mg total</strong> from infused base, about <strong>{mgPerServing.toFixed(1)}mg per {selectedProduct.servingUnit}</strong>.
          </p>
          <p className="text-xs text-gray-500 mt-1">Infused base per serving: {infusionTbspPerServing.toFixed(3)} tbsp</p>
          <div className="mt-4">
            <Link
              to={builderLink}
              onClick={() =>
                trackEvent("calculator_completed", {
                  product: selectedProduct.id,
                  recipe_servings: recipeServings,
                  infused_tbsp: Number(usedInfusionTbsp.toFixed(2)),
                  mg_per_serving: Number(mgPerServing.toFixed(2)),
                })
              }
            >
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                <FlaskConical className="w-4 h-4 mr-2" /> Move to {selectedProduct.label} Recipe
              </Button>
            </Link>
            <p className="text-xs text-amber-700 mt-2">
              Note: if infused amount is very high, the recipe builder may show a warning.
            </p>
          </div>
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
