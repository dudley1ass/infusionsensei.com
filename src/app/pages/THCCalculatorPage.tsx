import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calculator, ChefHat, BookOpen, FlaskConical } from "lucide-react";
import { Button } from "../components/ui/button";
import { trackEvent } from "../utils/analytics";

type Scenario = {
  id: "brownies" | "popcorn" | "wings" | "coffee";
  label: string;
  emoji: string;
  servingUnit: string;
  defaultServings: number;
  defaultGrams: number;
  category: string;
  recipeHint: string;
};

const SCENARIOS: Scenario[] = [
  { id: "brownies", label: "Brownies", emoji: "🍪", servingUnit: "1 brownie", defaultServings: 16, defaultGrams: 7, category: "baked-goods", recipeHint: "brownies" },
  { id: "popcorn", label: "Popcorn", emoji: "🍿", servingUnit: "1 cup popcorn", defaultServings: 12, defaultGrams: 5, category: "snacks", recipeHint: "garlic-butter-popcorn" },
  { id: "wings", label: "Wings", emoji: "🍗", servingUnit: "1 wing", defaultServings: 32, defaultGrams: 7, category: "wings", recipeHint: "classic-buffalo-wings" },
  { id: "coffee", label: "Coffee", emoji: "☕", servingUnit: "1 cup coffee", defaultServings: 4, defaultGrams: 3.5, category: "drinks", recipeHint: "bulletproof-coffee" },
];

const INFUSION_PRESETS = [
  { id: "butter", label: "Butter (70%)", efficiency: 70 },
  { id: "oil", label: "Oil (75%)", efficiency: 75 },
  { id: "distillate", label: "Distillate (95%)", efficiency: 95 },
  { id: "store", label: "Store edible (100%)", efficiency: 100 },
];

export function THCCalculatorPage() {
  const [scenarioId, setScenarioId] = useState<Scenario["id"]>("brownies");
  const [thcPct, setThcPct] = useState(20);
  const [grams, setGrams] = useState(7);
  const [efficiency, setEfficiency] = useState(70);
  const [servings, setServings] = useState(16);
  const [mode, setMode] = useState<"input" | "target">("input");
  const [targetMg, setTargetMg] = useState(10);

  const scenario = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

  const totalMg = grams * (thcPct / 100) * 1000 * (efficiency / 100);
  const mgPerServing = servings > 0 ? totalMg / servings : 0;

  const recommendedServings = Math.max(1, Math.ceil(totalMg / Math.max(targetMg, 1)));
  const recommendedGrams = totalMg > 0 ? (targetMg * servings) / ((thcPct / 100) * 1000 * (efficiency / 100)) : grams;

  const doseCopy = useMemo(() => {
    if (mgPerServing <= 5) {
      return { headline: "Light / beginner friendly", sub: "Most people can start here comfortably.", firstDoseFraction: 1 };
    }
    if (mgPerServing <= 10) {
      return { headline: "Good for a relaxing evening", sub: "Moderate and manageable for many users.", firstDoseFraction: 1 };
    }
    if (mgPerServing <= 25) {
      return { headline: "Strong — most people will feel this", sub: "Start with a partial serving and wait.", firstDoseFraction: 2 };
    }
    return { headline: "Heavy — experienced users only", sub: "Very strong; most people should take a fraction only.", firstDoseFraction: 6 };
  }, [mgPerServing]);

  const tier =
    mgPerServing <= 5 ? { label: "Micro / Light", color: "text-green-600", bg: "bg-green-50 border-green-200" } :
    mgPerServing <= 10 ? { label: "Moderate", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" } :
    mgPerServing <= 25 ? { label: "Strong", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" } :
    { label: "Very Strong", color: "text-red-600", bg: "bg-red-50 border-red-200" };

  const doseScalePct = Math.min(100, (mgPerServing / 50) * 100);

  const applyScenario = (nextId: Scenario["id"]) => {
    const next = SCENARIOS.find((s) => s.id === nextId);
    if (!next) return;
    setScenarioId(next.id);
    setServings(next.defaultServings);
    setGrams(next.defaultGrams);
  };

  const setDoseTarget = (mg: number) => {
    const nextServings = Math.max(1, Math.ceil(totalMg / mg));
    setServings(nextServings);
    setTargetMg(mg);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Helmet>
        <title>THC Dosage Calculator (Edibles, Butter, Oil - Instant Results)</title>
        <meta name="description" content="Calculate exact THC dosage for edibles, cannabutter, and oil. Get precise potency instantly - no math required." />
        <link rel="canonical" href="https://infusionsensei.com/thc-calculator" />
      </Helmet>

      {/* HERO */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
        <div className="text-5xl mb-4">🧮</div>
        <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">Never Guess Your Edible Dosage Again</h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto mb-6">Calculate exact THC per serving in seconds. Works for cannabutter, cannabis oil, flour, and any recipe.</p>
        <a href="#calculator">
          <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-black text-lg px-10 py-6 rounded-xl shadow-lg">
            Start Calculating <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </a>
        <p className="text-green-400 text-sm mt-4">✓ Free &nbsp;·&nbsp; ✓ No account &nbsp;·&nbsp; ✓ Instant results</p>
      </section>

      {/* TOOL SECTION */}
      <section id="calculator" className="bg-white rounded-3xl border-2 border-green-200 p-8 shadow-xl">
        <h2 className="text-2xl font-black text-gray-900 mb-2">THC Edible Calculator</h2>
        <p className="text-gray-500 text-sm mb-5">Enter your details below to calculate exact THC milligrams per serving.</p>

        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Common scenarios</p>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => applyScenario(s.id)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${scenarioId === s.id ? "bg-green-600 text-white border-green-600" : "bg-gray-50 text-gray-700 border-gray-200 hover:border-green-300"}`}
              >
                {s.emoji} {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Infusion Type Preset</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={efficiency}
              onChange={(e) => setEfficiency(Number(e.target.value))}
            >
              {INFUSION_PRESETS.map((p) => (
                <option key={p.id} value={p.efficiency}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Mode</label>
            <div className="flex gap-2">
              <button onClick={() => setMode("input")} className={`px-3 py-2 rounded-lg text-sm font-semibold border ${mode === "input" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 border-gray-300 text-gray-700"}`}>I know my inputs</button>
              <button onClick={() => setMode("target")} className={`px-3 py-2 rounded-lg text-sm font-semibold border ${mode === "target" ? "bg-green-600 text-white border-green-600" : "bg-gray-50 border-gray-300 text-gray-700"}`}>I want X mg</button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Flower / Concentrate THC %</label>
            <p className="text-xs text-gray-400 mb-2">Check your packaging — usually 15–30% for flower</p>
            <div className="flex items-center gap-3">
              <input type="range" min="1" max="99" value={thcPct} onChange={e => { setThcPct(Number(e.target.value)); trackEvent('calculator_used', {thc_pct: Number(e.target.value)}); }} className="flex-1 accent-green-600" />
              <span className="font-black text-green-700 text-lg w-16 text-right">{thcPct}%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Amount of Cannabis Used (grams)</label>
            <p className="text-xs text-gray-400 mb-2">How many grams are you infusing?</p>
            <div className="flex items-center gap-3">
              <input type="range" min="0.5" max="28" step="0.5" value={grams} onChange={e => setGrams(Number(e.target.value))} className="flex-1 accent-green-600" />
              <span className="font-black text-green-700 text-lg w-16 text-right">{grams}g</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Infusion Efficiency (%)</label>
            <p className="text-xs text-gray-400 mb-2">Typical: 60–80% for butter/oil, 90%+ for distillate</p>
            <div className="flex items-center gap-3">
              <input type="range" min="10" max="100" value={efficiency} onChange={e => setEfficiency(Number(e.target.value))} className="flex-1 accent-green-600" />
              <span className="font-black text-green-700 text-lg w-16 text-right">{efficiency}%</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Number of Servings</label>
            <p className="text-xs text-gray-400 mb-2">How many pieces / drinks / portions?</p>
            <div className="flex items-center gap-3">
              <input type="range" min="1" max="100" value={servings} onChange={e => { setServings(Number(e.target.value)); trackEvent('calculator_used', {servings: Number(e.target.value)}); }} className="flex-1 accent-green-600" />
              <span className="font-black text-green-700 text-lg w-16 text-right">{servings}</span>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border-2 p-6 ${tier.bg} text-center`}>
          <p className="text-sm font-bold text-gray-600 mb-1">THC Per Serving ({scenario.servingUnit})</p>
          <p className={`text-6xl font-black ${tier.color}`}>{mgPerServing.toFixed(1)}<span className="text-2xl ml-1">mg</span></p>
          <p className={`font-black text-lg mt-2 ${tier.color}`}>{tier.label}</p>
          <p className="text-gray-700 text-sm mt-1 font-semibold">{doseCopy.headline}</p>
          <p className="text-gray-500 text-sm">{doseCopy.sub}</p>
          <p className="text-gray-500 text-sm mt-2">{totalMg.toFixed(0)}mg total batch · {servings} servings</p>

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

        <div className="mt-6 rounded-2xl border border-gray-200 p-4">
          <p className="font-black text-gray-900 mb-3">What should I do next?</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setDoseTarget(10)} variant="outline">Make it beginner-friendly (10mg)</Button>
            <Button onClick={() => setDoseTarget(25)} variant="outline">Make it stronger (25mg)</Button>
            <Button onClick={() => setDoseTarget(targetMg)} variant="outline">Perfect this dose</Button>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Suggested first dose: <span className="font-bold">eat 1/{doseCopy.firstDoseFraction} serving</span>, then wait 2 hours.
          </p>
          {mode === "target" && (
            <div className="mt-3 grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Target mg/serving</label>
                <Input type="number" min={1} max={100} value={targetMg} onChange={(e) => setTargetMg(Number(e.target.value) || 10)} />
              </div>
              <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2">
                <p className="text-xs text-gray-500">Recommended servings</p>
                <p className="font-black text-green-700">{recommendedServings}</p>
              </div>
              <div className="rounded-lg bg-blue-50 border border-blue-200 px-3 py-2">
                <p className="text-xs text-gray-500">Grams for target (approx)</p>
                <p className="font-black text-blue-700">{recommendedGrams.toFixed(1)}g</p>
              </div>
            </div>
          )}
          <div className="mt-4">
            <Link to={`/ingredients?category=${encodeURIComponent(scenario.category)}&recipe=${encodeURIComponent(scenario.recipeHint)}&servings=${encodeURIComponent(servings)}`}>
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                <FlaskConical className="w-4 h-4 mr-2" /> Turn This Into a Recipe
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Why This Calculator Works</h2>
        <p className="text-gray-500 text-sm mb-6">Built on real cannabis science — not guesswork.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { emoji: "🔬", title: "Standard extraction efficiency", desc: "Accounts for real-world THC loss during decarboxylation and infusion (typically 60–80%)." },
            { emoji: "🧈", title: "All infusion methods", desc: "Works for cannabutter, cannabis oil, tinctures, distillates, and any fat-based infusion." },
            { emoji: "👩‍🍳", title: "Beginner to advanced", desc: "Simple enough for first-timers, accurate enough for experienced cannabis cooks." },
          ].map(({ emoji, title, desc }) => (
            <div key={title} className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="font-black text-gray-900 mb-1">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EDUCATION SECTION */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2">How to Calculate THC in Edibles</h2>
        <p className="text-gray-600 mb-6">The math is simple once you break it down. Here's the formula and a real example.</p>

        <div className="bg-gray-50 rounded-2xl p-6 mb-6 font-mono text-center border border-gray-200">
          <p className="text-gray-500 text-xs mb-2 uppercase font-bold tracking-widest">The Formula</p>
          <p className="text-lg font-black text-gray-900">THC% × grams × 1000 × efficiency%</p>
          <p className="text-gray-500 mt-1">÷ number of servings</p>
          <p className="text-green-700 font-black mt-1">= mg THC per serving</p>
        </div>

        <h3 className="font-black text-gray-900 mb-3">Real Example</h3>
        <div className="space-y-2 text-sm">
          {[
            { step: "1", text: "7g of flower at 20% THC = 7 × 0.20 × 1000 = 1,400mg total THC" },
            { step: "2", text: "At 70% infusion efficiency = 1,400 × 0.70 = 980mg absorbed into butter" },
            { step: "3", text: "Divided by 16 brownies = 61.25mg per brownie" },
            { step: "4", text: "That's a HIGH dose — most people want 5–15mg per serving" },
          ].map(({ step, text }) => (
            <div key={step} className="flex gap-3 items-start bg-gray-50 rounded-xl p-3">
              <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{step}</span>
              <span className="text-gray-700">{text}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <strong>💡 Key insight:</strong> Most people severely underestimate how strong their edibles are. 7g in 16 brownies = 61mg per brownie — 10× stronger than a commercial 5mg edible.
        </div>
      </section>

      {/* SAFETY SECTION */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Safe THC Dosage Guide for Edibles</h2>
        <p className="text-gray-500 text-sm mb-6">Use this as your target when calculating — edibles affect everyone differently. Always start low.</p>
        <div className="space-y-3">
          {[
            { range: "1–2.5 mg", level: "Microdose", who: "First-timers, daytime use, anxiety relief", color: "bg-blue-50 border-blue-200 text-blue-800" },
            { range: "2.5–5 mg", level: "Beginner", who: "New to edibles, mild relaxation, sleep aid", color: "bg-green-50 border-green-200 text-green-800" },
            { range: "5–15 mg", level: "Intermediate", who: "Regular users, recreational, pain relief", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
            { range: "15–30 mg", level: "Advanced", who: "High tolerance only — can be intense for most", color: "bg-orange-50 border-orange-200 text-orange-800" },
            { range: "30+ mg", level: "Very High", who: "Medical patients, very high tolerance required", color: "bg-red-50 border-red-200 text-red-800" },
          ].map(({ range, level, who, color }) => (
            <div key={level} className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 ${color}`}>
              <div className="font-black text-base w-20 flex-shrink-0">{range}</div>
              <div className="font-black w-28">{level}</div>
              <div className="text-sm opacity-80">{who}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          ⚠️ <strong>Start low, go slow.</strong> Edibles take 30–120 minutes to kick in. Wait at least 2 hours before consuming more.
        </div>
      </section>

      {/* INTERNAL LINKS */}
      <section>
        <h2 className="text-xl font-black text-gray-900 mb-4">Related Tools & Guides</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Infused Butter Calculator", desc: "Calculate cannabutter potency from scratch", to: "/infusions", emoji: "🧈" },
            { title: "Cannabis Edible Recipes", desc: "20+ recipes with exact mg per serving", to: "/recipes", emoji: "🍪" },
            { title: "Learn Infusion Basics", desc: "Beginner guides to cannabis cooking", to: "/learn", emoji: "📚" },
          ].map(({ title, desc, to, emoji }) => (
            <Link key={title} to={to} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 p-5 transition-all hover:shadow-md group">
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="font-black text-gray-900 group-hover:text-green-700">{title}</h3>
              <p className="text-gray-500 text-sm mt-1">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-center text-white shadow-2xl">
        <Calculator className="w-10 h-10 mx-auto mb-3 text-green-300" />
        <h2 className="text-2xl font-black mb-2">Ready to Calculate Your Exact Dose?</h2>
        <p className="text-green-200 mb-5">Free. No account. Works for any recipe.</p>
        <a href="#calculator"><Button className="bg-white text-green-800 hover:bg-green-50 font-black px-8 py-3">Calculate Now <ArrowRight className="w-4 h-4 ml-2" /></Button></a>
      </div>

    </div>
  );
}
