import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Calculator, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

export function THCPerServingCalculator() {
  const [grams, setGrams] = useState(7);
  const [thcPct, setThcPct] = useState(20);
  const [servings, setServings] = useState(16);
  const [decarb, setDecarb] = useState(85);
  const [extraction, setExtraction] = useState(75);

  const totalRaw   = grams * 1000 * (thcPct / 100);
  const afterDecarb = totalRaw * (decarb / 100);
  const usable     = afterDecarb * (extraction / 100);
  const perServing = servings > 0 ? usable / servings : 0;

  const relatedArticles = [
    { title: "Why Your THC Butter Is Weak", path: "/learn/articles/why-thc-butter-is-weak" },
    { title: "How to Dose THC Edibles Correctly", path: "/learn/articles/dosing-guide" },
    { title: "How to Fix Edibles That Are Too Strong", path: "/learn/articles/fix-too-strong-edibles" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>How to Calculate THC in Edibles (Exact mg Per Serving)</title>
        <meta name="description" content="Learn how to calculate THC in edibles using a simple formula and live tool. Build your infused base, apply it to recipes, and verify exact mg per serving." />
        <meta property="og:title" content="How to Calculate THC in Edibles (Exact mg Per Serving)" />
        <meta property="og:description" content="Learn the exact edible THC formula, then use our live calculator to get reliable mg per serving for any recipe." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/how-to-calculate-thc-in-edibles" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">THC Per Serving Calculator</span>
      </div>
      <Card className="bg-white border-green-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-green-600 text-white mb-3">Calculator • 5 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">How to Calculate THC in Edibles (The Simple Method)</CardTitle>
              <p className="text-lg text-gray-600">Stop guessing. Here's the exact formula to calculate milligrams of THC per serving in any homemade edible — with a live calculator you can use right now.</p>
            </div>
            <Calculator className="w-12 h-12 text-green-600 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          {/* Live Calculator */}
          <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-green-900">🧮 Live THC Calculator</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Cannabis amount (grams)", value: grams, setter: setGrams, min: 0.1, max: 100, step: 0.5 },
                { label: "THC percentage (%)", value: thcPct, setter: setThcPct, min: 1, max: 35, step: 0.5 },
                { label: "Number of servings", value: servings, setter: setServings, min: 1, max: 200, step: 1 },
                { label: "Decarb efficiency (%)", value: decarb, setter: setDecarb, min: 50, max: 100, step: 1 },
                { label: "Extraction efficiency (%)", value: extraction, setter: setExtraction, min: 50, max: 100, step: 1 },
              ].map(({ label, value, setter, min, max, step }) => (
                <div key={label}>
                  <label className="block text-sm font-semibold text-green-800 mb-1">{label}</label>
                  <input
                    type="number"
                    value={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={e => setter(parseFloat(e.target.value) || 0)}
                    className="w-full border-2 border-green-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:border-green-500 bg-white"
                  />
                </div>
              ))}
            </div>
            <div className="bg-white border-2 border-green-500 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div><div className="text-xs text-gray-500 mb-1">Total THC (raw)</div><div className="text-xl font-black text-gray-900">{totalRaw.toFixed(0)}mg</div></div>
              <div><div className="text-xs text-gray-500 mb-1">After Decarb</div><div className="text-xl font-black text-gray-900">{afterDecarb.toFixed(0)}mg</div></div>
              <div><div className="text-xs text-gray-500 mb-1">Usable THC</div><div className="text-xl font-black text-gray-900">{usable.toFixed(0)}mg</div></div>
              <div className="bg-green-100 rounded-lg p-2">
                <div className="text-xs text-green-700 font-bold mb-1">Per Serving</div>
                <div className="text-2xl font-black text-green-800">{perServing.toFixed(1)}mg</div>
              </div>
            </div>
            <p className="text-xs text-green-700 italic">Typical decarb efficiency: 85%. Typical extraction into butter: 70–80%. Into coconut oil: 75–85%.</p>
          </div>

          <Separator />

          {/* Mid-article CTA */}
          <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-5 no-print">
            <p className="font-black text-green-900 text-lg">Build base -&gt; use recipe -&gt; verify dose</p>
            <p className="text-green-700 text-sm mt-0.5 mb-3">Use this exact flow to avoid potency surprises and get repeatable servings.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/ingredients" state={{ resetStartHere: true }} className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                Build Your Infused Base <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/recipes" className="inline-flex items-center justify-center gap-2 border border-green-300 text-green-800 hover:bg-green-100 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                Use It in Recipes
              </Link>
              <Link to="/edibles-calculator" className="inline-flex items-center justify-center gap-2 border border-green-300 text-green-800 hover:bg-green-100 font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
                Verify mg/serving
              </Link>
            </div>
          </div>


          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">The Formula Explained</h2>
            <div className="space-y-4">
              {[
                { step: "Step 1", title: "Calculate raw THC in your cannabis", formula: "Grams × (THC% ÷ 100) × 1000 = mg THC", example: "7g × 0.20 × 1000 = 1,400mg raw THC", note: "This is theoretical maximum — no process is 100% efficient." },
                { step: "Step 2", title: "Apply decarboxylation efficiency", formula: "Raw THC × Decarb% = Activated THC", example: "1,400mg × 0.85 = 1,190mg activated THC", note: "Decarb at 230–240°F for 35–45 min typically achieves 80–90% conversion." },
                { step: "Step 3", title: "Apply extraction efficiency", formula: "Activated THC × Extraction% = Usable THC", example: "1,190mg × 0.75 = 893mg usable THC", note: "Butter extracts ~70–75%. Coconut oil ~75–80%. Alcohol tinctures ~85–95%." },
                { step: "Step 4", title: "Divide by servings", formula: "Usable THC ÷ Servings = mg per serving", example: "893mg ÷ 16 brownies = 55.8mg per brownie", note: "To hit 10mg per serving: 893 ÷ 10 = 89 servings. Cut accordingly." },
              ].map(({ step, title, formula, example, note }) => (
                <div key={step} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">{step}</span>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 font-mono text-sm text-gray-800 mb-2">{formula}</div>
                  <div className="bg-green-50 rounded-lg p-3 font-mono text-sm text-green-800 mb-2">Example: {example}</div>
                  <p className="text-xs text-gray-500 italic">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-2">🚀 Use the Full Calculator</p>
            <p className="text-green-100 mb-4 text-sm">Run your exact flower %, grams, and batch size to confirm your final serving dose before you cook.</p>
            <Link to="/edibles-calculator" className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm">
              Open Edibles Calculator <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Internal CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white text-center">
            <p className="text-lg font-bold mb-1">Ready to calculate your exact dose?</p>
            <p className="text-green-100 text-sm mb-4">Start with your infused base, then apply it to recipes and confirm final mg per serving.</p>
            <Link to="/ingredients" state={{ resetStartHere: true }} className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-5 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm">
              Start Here: Build Your Base <ArrowRight className="w-4 h-4" />
            </Link>
          </div>


          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {relatedArticles.map(a => (
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-green-200 rounded-lg hover:border-green-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-green-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
