import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Calculator } from "lucide-react";
import { Button } from "../components/ui/button";

export function THCCalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <Helmet>
        <title>THC Edible Calculator — Calculate Exact MG Per Serving (Free)</title>
        <meta name="description" content="Free THC edible calculator. Enter your cannabis potency and batch size to calculate exact milligrams of THC per serving. Works for cannabutter, oils, and any recipe. Never overdose again." />
        <link rel="canonical" href="https://infusionsensei.com/thc-calculator" />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl">
        <div className="text-5xl mb-4">🧮</div>
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
          THC Edible Calculator
        </h1>
        <p className="text-green-100 text-lg max-w-2xl mx-auto mb-6">
          Calculate the exact milligrams of THC per serving for any cannabis edible — brownies, gummies, butter, oil, or any recipe. Free. No account needed.
        </p>
        <Link to="/infusions">
          <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-black text-lg px-10 py-6 rounded-xl shadow-lg">
            Open THC Calculator <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
        <p className="text-green-400 text-sm mt-4">✓ Instant results &nbsp;·&nbsp; ✓ No signup &nbsp;·&nbsp; ✓ Any recipe</p>
      </div>

      {/* How it works */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-6">How the THC Calculator Works</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Enter your cannabis potency", desc: "Input your strain's THC % or the potency of your cannabutter/oil.", emoji: "🌿" },
            { step: "2", title: "Choose your recipe", desc: "Pick from 20+ templates or build a custom recipe with any ingredients.", emoji: "📋" },
            { step: "3", title: "Get exact MG per serving", desc: "See the THC milligrams per serving update in real-time as you adjust.", emoji: "⚖️" },
          ].map(({ step, title, desc, emoji }) => (
            <div key={step} className="text-center">
              <div className="text-4xl mb-3">{emoji}</div>
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-black text-sm mx-auto mb-3">{step}</div>
              <h3 className="font-black text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dosing guide */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2">THC Dosage Guide for Edibles</h2>
        <p className="text-gray-500 mb-6 text-sm">How many mg of THC should you put in your edibles? Use this as a starting point.</p>
        <div className="space-y-3">
          {[
            { range: "1–2.5 mg", level: "Microdose", who: "First-timers, low tolerance, daytime use", color: "bg-blue-50 border-blue-200 text-blue-800" },
            { range: "2.5–5 mg", level: "Low", who: "Occasional users, mild relaxation, sleep", color: "bg-green-50 border-green-200 text-green-800" },
            { range: "5–15 mg", level: "Moderate", who: "Regular users, recreational, pain relief", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
            { range: "15–30 mg", level: "High", who: "Experienced users, high tolerance only", color: "bg-orange-50 border-orange-200 text-orange-800" },
            { range: "30+ mg", level: "Very High", who: "Medical patients, very high tolerance", color: "bg-red-50 border-red-200 text-red-800" },
          ].map(({ range, level, who, color }) => (
            <div key={level} className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 ${color}`}>
              <div className="font-black text-lg w-20 flex-shrink-0">{range}</div>
              <div className="font-black">{level}</div>
              <div className="text-sm opacity-80 flex-1">{who}</div>
            </div>
          ))}
        </div>
        <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm mt-4">
          ⚠️ <strong>Start low, go slow.</strong> Edibles take 30–120 minutes to kick in. Wait before consuming more.
        </p>
      </div>

      {/* FAQ — keyword rich */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-6">THC Calculator FAQ</h2>
        <div className="space-y-5">
          {[
            { q: "How do I calculate THC mg per serving in edibles?", a: "Multiply the weight of your cannabis (in grams) by its THC percentage, then divide by the number of servings. For example: 7g of 20% THC cannabis = 1,400mg total THC. Divided by 16 brownies = 87.5mg per brownie. Our calculator does this math automatically." },
            { q: "How much THC should be in a homemade edible?", a: "For beginners, aim for 2.5–5mg per serving. Most recreational users prefer 5–15mg. Commercial edibles are typically sold in 5–10mg doses. Our THC calculator lets you dial in any target dose." },
            { q: "How do I convert % THC to mg?", a: "1% THC = 10mg per gram. So 20% THC cannabis = 200mg per gram. Multiply grams used by mg/gram to get total batch THC, then divide by servings." },
            { q: "Does the calculator work for cannabutter and infused oils?", a: "Yes — enter your infused butter or oil potency in mg/g or mg/ml and the calculator handles the rest. Works for any fat-based infusion." },
            { q: "Why do homemade edibles vary in potency?", a: "Uneven mixing is the main cause. Our recipe builder shows you the THC per serving based on your ingredients so you know before you bake." },
          ].map(({ q, a }) => (
            <div key={q} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
              <h3 className="font-black text-gray-900 mb-2">{q}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related tools */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: "Recipe Builder", desc: "Build any recipe with live THC calculations", to: "/ingredients", emoji: "🍪" },
          { title: "My Infusions", desc: "Calculate cannabutter and oil potency", to: "/infusions", emoji: "🧈" },
          { title: "Learn", desc: "Dosing guides and edible science", to: "/learn", emoji: "📚" },
        ].map(({ title, desc, to, emoji }) => (
          <Link key={title} to={to} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 p-5 transition-all hover:shadow-md group">
            <div className="text-3xl mb-2">{emoji}</div>
            <h3 className="font-black text-gray-900 group-hover:text-green-700">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{desc}</p>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-8 text-center text-white shadow-2xl">
        <Calculator className="w-12 h-12 mx-auto mb-4 text-green-300" />
        <h2 className="text-3xl font-black mb-3">Ready to Calculate Your Dose?</h2>
        <p className="text-green-200 mb-6">Free THC calculator — no account, no signup, instant results.</p>
        <Link to="/infusions">
          <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-black text-lg px-10 py-6 rounded-xl">
            Start THC Calculator — Free <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
