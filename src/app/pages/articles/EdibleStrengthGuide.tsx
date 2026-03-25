import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Calculator, ArrowRight, AlertTriangle } from "lucide-react";

export function EdibleStrengthGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>How Strong Will My Edibles Be? (Simple THC Math Explained) | Infusion Sensei</title>
        <meta name="description" content="Learn exactly how to calculate edible strength in mg THC per serving. Simple formula, real examples, and why homemade edibles vary — plus a free calculator." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/edible-strength-guide" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Edible Strength Guide</span>
      </div>
      <Card className="bg-white border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-blue-600 text-white mb-3">Calculator / Science</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">How Strong Will My Edibles Be?</CardTitle>
              <p className="text-lg text-gray-600">The simple THC math behind every homemade edible — explained without a chemistry degree. Understand what mg of THC actually means, how to calculate it, and why your edibles might be stronger than you think.</p>
            </div>
            <Calculator className="w-14 h-14 text-blue-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-10">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What Does "mg of THC" Actually Mean?</h2>
            <p className="text-gray-700 leading-relaxed">When a commercial edible says "10mg THC," it means each serving contains 10 milligrams of THC — the active compound that produces effects. That's a very small amount physically (about 1/100th of a gram), but it's enough to produce noticeable effects for most people.</p>
            <div className="space-y-2">
              {[
                { range:"1–2.5 mg", level:"Microdose", who:"Barely noticeable. Used for focus, anxiety relief.", color:"bg-blue-50 border-blue-200 text-blue-800" },
                { range:"2.5–5 mg", level:"Beginner", who:"Mild relaxation. Good starting point for new users.", color:"bg-green-50 border-green-200 text-green-800" },
                { range:"5–15 mg", level:"Moderate", who:"Clear recreational effects. Most regular users' sweet spot.", color:"bg-yellow-50 border-yellow-200 text-yellow-800" },
                { range:"15–30 mg", level:"High", who:"Strong effects. Experienced users and medical patients.", color:"bg-orange-50 border-orange-200 text-orange-800" },
                { range:"30+ mg", level:"Very High", who:"Intense. Very high tolerance required.", color:"bg-red-50 border-red-200 text-red-800" },
              ].map(({ range, level, who, color }) => (
                <div key={level} className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-3 ${color}`}>
                  <div className="font-black w-20 flex-shrink-0">{range}</div>
                  <div className="font-black w-24">{level}</div>
                  <div className="text-sm opacity-80">{who}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The Simple Formula</h2>
            <p className="text-gray-700">Three numbers, one calculation:</p>
            <div className="bg-gray-950 rounded-2xl p-6 text-center font-mono space-y-3">
              <p className="text-green-400 text-xs uppercase tracking-widest">THC Per Serving Formula</p>
              <p className="text-white text-lg font-black">grams × (THC% ÷ 100) × 1000</p>
              <p className="text-gray-400">× infusion efficiency (typically 0.70)</p>
              <p className="text-gray-400">÷ number of servings</p>
              <p className="text-green-400 font-black text-2xl">= mg THC per serving</p>
            </div>
            <h3 className="font-black text-gray-900 text-lg">Real Example: 16 Brownies</h3>
            <div className="space-y-2">
              {[
                { step:"1", calc:"7g flower × 20% THC × 1000 = 1,400mg total THC in your flower" },
                { step:"2", calc:"× 70% infusion efficiency = 980mg transferred to butter" },
                { step:"3", calc:"÷ 16 brownies = 61.25mg per brownie" },
                { step:"4", calc:"→ That's 12× stronger than a commercial 5mg edible" },
              ].map(({ step, calc }) => (
                <div key={step} className="flex gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{step}</span>
                  <span className="text-gray-700 text-sm font-mono">{calc}</span>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <p className="text-amber-800 text-sm"><strong>This is why homemade edibles surprise people.</strong> Most beginners use too much flower and make servings too large. 7g in 16 brownies = 61mg each — 12× a standard commercial dose.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Why Homemade Edibles Vary So Much</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { reason:"Flower potency varies", detail:"The 20% on the label is an average. Your batch might be 17% or 24%." },
                { reason:"Decarbing isn't perfect", detail:"Efficiency ranges from 70–90% depending on method and temperature." },
                { reason:"Infusion isn't 100%", detail:"Not all THC transfers from plant to fat. Typically 60–80% in butter/oil." },
                { reason:"Uneven mixing", detail:"The biggest practical issue — one corner of the brownie may have 3× the THC of another." },
              ].map(({ reason, detail }) => (
                <div key={reason} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="font-black text-gray-900 mb-1">{reason}</p>
                  <p className="text-gray-600 text-sm">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">How to Fix Dosing Mistakes</h2>
            <div className="space-y-3">
              {[
                { problem:"Made them too strong", fix:"Cut servings smaller. A 61mg brownie becomes ~10mg if you cut it into 6 pieces instead of 1." },
                { problem:"Made them too weak", fix:"Use more flower next batch, or increase your cannabutter ratio. Use the calculator to hit your target." },
                { problem:"Inconsistent effects", fix:"Mix batter more thoroughly. The infused butter should be fully incorporated before pouring into pan." },
                { problem:"Took too much before feeling it", fix:"Wait the full 2 hours. Edibles absorb through digestion — don't stack doses early." },
              ].map(({ problem, fix }) => (
                <div key={problem} className="flex gap-3 bg-gray-50 rounded-2xl p-4">
                  <span className="text-red-500 font-black flex-shrink-0">→</span>
                  <div><p className="font-black text-gray-900">{problem}</p><p className="text-green-700 text-sm">{fix}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 text-center">
            <Calculator className="w-10 h-10 text-blue-600 mx-auto mb-3" />
            <h3 className="text-xl font-black text-gray-900 mb-2">Use the Calculator Instead of Guessing</h3>
            <p className="text-gray-600 mb-4 text-sm">Enter your flower's THC%, amount used, and servings — get exact mg THC per serving instantly.</p>
            <Link to="/thc-calculator"><button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-3 rounded-xl transition-colors flex items-center gap-2 mx-auto">Open THC Calculator <ArrowRight className="w-4 h-4" /></button></Link>
          </div>

        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader><CardTitle className="text-lg">Related Articles</CardTitle></CardHeader>
        <CardContent><div className="space-y-3">
          {[
            { title:"Edible Potency Guide", path:"/edible-potency-guide" },
            { title:"How to Dose THC Edibles Correctly", path:"/learn/articles/dosing-guide" },
            { title:"The Perfect Cannabutter Guide", path:"/learn/articles/cannabutter-guide" },
          ].map(a => (
            <Link key={a.path} to={a.path} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group">
              <span className="text-gray-700 group-hover:text-blue-700 font-medium">{a.title}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
            </Link>
          ))}
        </div></CardContent>
      </Card>
    </div>
  );
}
