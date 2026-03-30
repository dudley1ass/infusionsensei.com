import { useMemo, useState } from "react";
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

export function THCCalculatorPage() {
  const [productId, setProductId] = useState<ProductPreset["id"]>("cookies");
  const [thcPct, setThcPct] = useState(20);
  const [grams, setGrams] = useState(7);
  const [efficiency, setEfficiency] = useState(70);
  const [totalInfusionAmount, setTotalInfusionAmount] = useState(16);
  const [servingsOverride, setServingsOverride] = useState(24);

  const selectedProduct = PRODUCT_PRESETS.find((p) => p.id === productId) ?? PRODUCT_PRESETS[0];
  const selectedPreset = INFUSION_PRESETS.find((p) => p.efficiency === efficiency);

  const totalInfusionMg = grams * (thcPct / 100) * 1000 * (efficiency / 100);
  const mgPerTbsp = totalInfusionAmount > 0 ? totalInfusionMg / totalInfusionAmount : 0;
  const recipeMg = mgPerTbsp * selectedProduct.baseInfusionTbsp;
  const mgPerServing = servingsOverride > 0 ? recipeMg / servingsOverride : 0;
  const infusionTbspPerServing = servingsOverride > 0 ? selectedProduct.baseInfusionTbsp / servingsOverride : 0;

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
  const builderLink = `/ingredients?category=${encodeURIComponent(selectedProduct.category)}&recipe=${encodeURIComponent(selectedProduct.recipeHint)}&servings=${encodeURIComponent(servingsOverride)}&targetMgPerServing=${encodeURIComponent(mgPerServing.toFixed(4))}&calcInfusedTbsp=${encodeURIComponent(selectedProduct.baseInfusionTbsp)}&calcMgPerTbsp=${encodeURIComponent(mgPerTbsp.toFixed(4))}&calcSource=edibles-calculator`;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Helmet>
        <title>Edibles Calculator: Exact THC Dosage Per Serving | Infusion Sensei</title>
        <meta
          name="description"
          content="Calculate exact mg THC per serving for any recipe in seconds. Stop guessing potency with our free edibles dosage calculator."
        />
        <meta name="keywords" content="edibles calculator, THC dosage calculator, THC per serving, homemade edibles, cannabutter calculator, edible potency" />
        <link rel="canonical" href="https://infusionsensei.com/edibles-calculator" />
        <meta property="og:title" content="Edibles Calculator — Exact THC mg per Serving | Infusion Sensei" />
        <meta property="og:description" content="Free THC calculator for homemade edibles. Get mg per serving for butter, oil, and full batches in seconds." />
        <meta property="og:url" content="https://infusionsensei.com/edibles-calculator" />
        <meta property="og:type" content="website" />
      </Helmet>

      <section id="calculator" className="bg-white rounded-3xl border-2 border-green-200 p-8 shadow-xl">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Edibles Calculator</h1>
        <p className="text-gray-500 text-sm mb-5">Choose your infusion setup first, then pick a product to see THC per serving from the base recipe amount.</p>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">1) Infusion Type</label>
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
                <label className="block text-sm font-bold text-gray-700 mb-1">2) Infusion Quantity (tbsp)</label>
                <Input type="number" min={1} step={0.5} value={totalInfusionAmount} onChange={(e) => setTotalInfusionAmount(Math.max(1, Number(e.target.value) || 1))} />
                <p className="text-xs text-gray-500 mt-1">Total infused butter/oil made in this batch.</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">3) Product</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={productId}
                  onChange={(e) => {
                    const next = PRODUCT_PRESETS.find((p) => p.id === e.target.value);
                    setProductId(e.target.value as ProductPreset["id"]);
                    if (next) setServingsOverride(next.baseServings);
                  }}
                >
                  {PRODUCT_PRESETS.map((p) => (
                    <option key={p.id} value={p.id}>{p.emoji} {p.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Base recipe uses {selectedProduct.baseInfusionTbsp} tbsp.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
                <p className="text-xs text-gray-400 mb-2">How many grams are in your infusion batch?</p>
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
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Servings in This Product Batch</label>
                <Input type="number" min={1} step={1} value={servingsOverride} onChange={(e) => setServingsOverride(Math.max(1, Number(e.target.value) || 1))} />
                <p className="text-xs text-gray-500 mt-1">Default for {selectedProduct.label.toLowerCase()}: {selectedProduct.baseServings} servings.</p>
              </div>
            </div>

            <div>
              <Link to={builderLink}>
                <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                  <FlaskConical className="w-4 h-4 mr-2" /> Open {selectedProduct.label} Recipe
                </Button>
              </Link>
              <p className="text-xs text-amber-700 mt-2">
                Note: if infused amount is very high, the recipe builder may show a warning.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className={`rounded-2xl border-2 p-6 ${tier.bg} text-center lg:sticky lg:top-24`}>
              <p className="text-sm font-bold text-gray-600 mb-1">THC Per Serving ({selectedProduct.servingUnit})</p>
              <p className={`text-6xl font-black ${tier.color}`}>{mgPerServing.toFixed(1)}<span className="text-2xl ml-1">mg</span></p>
              <p className={`font-black text-lg mt-2 ${tier.color}`}>{tier.label}</p>
              <p className="text-gray-700 text-sm mt-1 font-semibold">{doseCopy.headline}</p>
              <p className="text-gray-500 text-sm">{doseCopy.sub}</p>
              <p className="text-gray-600 text-xs mt-3">
                {totalInfusionMg.toFixed(0)}mg total in infusion • {mgPerTbsp.toFixed(1)}mg per tbsp • {recipeMg.toFixed(0)}mg in this {selectedProduct.label.toLowerCase()} batch
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Base recipe infusion per serving: {infusionTbspPerServing.toFixed(3)} tbsp
              </p>

              <div className="mt-4 text-left">
                <p className="text-xs text-gray-500 mb-1">Dose scale</p>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-600" style={{ width: `${doseScalePct}%` }} />
                </div>
                <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                  <span>5mg</span><span>10mg</span><span>25mg</span><span>50mg+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="common-mistakes" className="bg-white rounded-3xl border border-amber-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Common mistakes when dosing edibles</h2>
        <p className="text-gray-600 text-sm mb-5">
          Most bad experiences come from math or patience — not the recipe. Avoid these:
        </p>
        <ul className="space-y-3 text-sm text-gray-800">
          <li className="flex gap-2">
            <span className="font-black text-amber-600">1.</span>
            <span><strong className="text-gray-900">Skipping decarb or ignoring efficiency.</strong> If THC never fully activated or your butter only captures part of it, the math will lie.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-black text-amber-600">2.</span>
            <span><strong className="text-gray-900">Confusing total mg with mg per serving.</strong> Always divide total infused THC by portions.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-black text-amber-600">3.</span>
            <span><strong className="text-gray-900">Uneven mixing.</strong> Hotspots in batter mean one piece can be much stronger than the next.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-black text-amber-600">4.</span>
            <span><strong className="text-gray-900">Re-dosing too soon.</strong> Wait at least 2 hours before eating more.</span>
          </li>
        </ul>
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
