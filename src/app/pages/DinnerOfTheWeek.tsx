import { useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat, Clock, Users } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PAGE_STOCK } from "../data/recipeStockImageUrls";

const THIS_WEEK = {
  id: "steak-alfredo",
  title: "Steak Alfredo with Spinach",
  subtitle: "A complete infused dinner you can make tonight",
  emoji: "🥩",
  time: "35 min",
  servings: 2,
  difficulty: "Medium",
  why: "Heavy cream carries THC beautifully — smooth flavor, no weedy taste, and easy dose control per bowl.",
  img: PAGE_STOCK.dinner,
  doses: [
    { label: "Light", mg: "5mg", who: "New to edibles or low tolerance" },
    { label: "Standard", mg: "10mg", who: "Regular users, recreational" },
    { label: "Strong", mg: "20mg", who: "High tolerance, medical" },
  ],
  ingredients: [
    { group: "🥩 Steak", items: ["1 lb ribeye or sirloin steak", "Salt & black pepper", "1 tbsp unsalted butter"] },
    { group: "🍝 Pasta", items: ["8 oz fettuccine", "1 cup heavy cream", "½ cup parmesan (grated)", "2 cloves garlic (minced)", "1 cup fresh spinach"] },
    { group: "🌿 Infusion", items: ["1–2 tbsp cannabutter (your infused batch)", "Extra parmesan to finish"] },
  ],
  steps: [
    { n: "1", title: "Cook the steak", detail: "Season steak generously with salt and pepper. Sear in a hot cast iron pan with regular butter, 3–4 min per side for medium-rare. Rest 5 minutes, then slice against the grain." },
    { n: "2", title: "Cook the pasta", detail: "Boil fettuccine in salted water according to package directions until al dente. Reserve ½ cup pasta water before draining." },
    { n: "3", title: "Make the Alfredo sauce", detail: "In a pan over medium-low heat, sauté garlic in regular butter 1 minute. Add heavy cream and bring to a gentle simmer. Stir in parmesan until smooth. Add spinach and wilt." },
    { n: "4", title: "Add your infusion (important)", detail: "Remove pan from heat. Stir in your cannabutter now — off heat preserves potency. If sauce is too thick, add a splash of pasta water.", highlight: true },
    { n: "5", title: "Combine and plate", detail: "Toss drained pasta in the infused Alfredo sauce. Plate with sliced steak on top. Finish with extra parmesan." },
  ],
  tips: [
    "Always add cannabutter off heat — high heat degrades THC.",
    "Cream-based sauces mask cannabis flavor almost completely.",
    "Use the THC calculator below to dial in your exact dose before cooking.",
    "Label leftovers clearly — this keeps well in the fridge for 2 days.",
  ],
};

const PAST_DINNERS = [
  { title: "Garlic Butter Salmon", emoji: "🐟", desc: "Cannabis olive oil glaze, roasted asparagus", coming: true },
  { title: "Nashville Hot Chicken Bowl", emoji: "🌶️", desc: "Cannabutter Nashville sauce over rice and slaw", coming: true },
  { title: "Loaded Baked Potato", emoji: "🥔", desc: "Cannabutter, sour cream, cheddar, chives", coming: true },
];

export function DinnerOfTheWeek() {
  const [selectedDose, setSelectedDose] = useState(1);

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Helmet>
        <title>Dinner of the Week – Infused Steak Alfredo | Infusion Sensei</title>
        <meta name="description" content="This week's infused dinner: Steak Alfredo with Spinach. A complete cannabis-infused meal with exact THC dosing. Easy, satisfying, and perfectly dosed." />
        <link rel="canonical" href="https://infusionsensei.com/dinner-of-the-week" />
      </Helmet>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{minHeight: "320px"}}>
        <img src={THIS_WEEK.img} alt={THIS_WEEK.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex items-center px-8 md:px-12">
          <div className="max-w-lg">
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-green-500 text-white border-0 text-xs font-black px-3 py-1">🍽️ THIS WEEK</Badge>
              <Badge className="bg-white/20 text-white border-white/30 text-xs backdrop-blur-sm">{THIS_WEEK.difficulty}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 leading-tight">{THIS_WEEK.title}</h1>
            <p className="text-white/80 mb-4">{THIS_WEEK.subtitle}</p>
            <div className="flex gap-4 text-white/70 text-sm mb-5">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{THIS_WEEK.time}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{THIS_WEEK.servings} servings</span>
              <span className="flex items-center gap-1"><ChefHat className="w-4 h-4" />{THIS_WEEK.difficulty}</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 border border-white/20 max-w-sm">
              <p className="text-white/70 text-xs mb-1">💡 Why this works</p>
              <p className="text-white text-sm">{THIS_WEEK.why}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left — Recipe */}
        <div className="lg:col-span-2 space-y-8">

          {/* Ingredients */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-4">Ingredients</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {THIS_WEEK.ingredients.map(({ group, items }) => (
                <div key={group}>
                  <p className="font-black text-gray-700 text-sm mb-2">{group}</p>
                  <ul className="space-y-1">{items.map(item => <li key={item} className="text-sm text-gray-600 flex gap-2"><span className="text-green-500">•</span>{item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-900 mb-4">Step-by-Step</h2>
            <div className="space-y-3">
              {THIS_WEEK.steps.map(({ n, title, detail, highlight }) => (
                <div key={n} className={`flex gap-4 rounded-2xl p-4 border ${highlight ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-100"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${highlight ? "bg-green-600 text-white" : "bg-gray-800 text-white"}`}>{n}</div>
                  <div>
                    <p className="font-black text-gray-900">{title}{highlight && <span className="ml-2 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">KEY STEP</span>}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pro tips */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-black text-amber-800 mb-3">💡 Pro Tips</p>
            <ul className="space-y-2">{THIS_WEEK.tips.map(tip => <li key={tip} className="text-sm text-amber-700 flex gap-2"><span className="flex-shrink-0">→</span>{tip}</li>)}</ul>
          </div>

        </div>

        {/* Right — Dose panel */}
        <div className="space-y-5">
          <div className="bg-gray-950 rounded-3xl p-5 border border-gray-800 sticky top-4">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">🎯 Choose Your Dose</p>
            <div className="space-y-2 mb-5">
              {THIS_WEEK.doses.map(({ label, mg, who }, i) => (
                <button key={label} onClick={() => setSelectedDose(i)}
                  className={`w-full rounded-xl p-3 text-left transition-all border-2 ${selectedDose === i ? "bg-green-600 border-green-500 text-white" : "bg-gray-900 border-gray-700 text-gray-300 hover:border-gray-500"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-black">{label}</span>
                    <span className={`font-black text-lg ${selectedDose === i ? "text-white" : "text-green-400"}`}>{mg}</span>
                  </div>
                  <p className={`text-xs mt-0.5 ${selectedDose === i ? "text-green-100" : "text-gray-500"}`}>{who}</p>
                </button>
              ))}
            </div>
            <div className="bg-gray-900 rounded-xl p-3 mb-4 text-center">
              <p className="text-gray-400 text-xs mb-1">Target per serving</p>
              <p className="text-green-400 font-black text-3xl">{THIS_WEEK.doses[selectedDose].mg}</p>
              <p className="text-gray-500 text-xs mt-1">Use cannabutter to hit this target</p>
            </div>
            <Link to="/edibles-calculator" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-black mb-2">
                Calculate Exact THC <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link to="/ingredients?category=savory-meals&recipe=alfredo" className="block">
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 font-bold text-sm">
                <ChefHat className="w-4 h-4 mr-2" /> Open in Recipe Builder
              </Button>
            </Link>
          </div>

          {/* Coming next */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Coming Soon</p>
            <div className="space-y-2">
              {PAST_DINNERS.map(({ title, emoji, desc }) => (
                <div key={title} className="flex gap-3 items-start opacity-50">
                  <span className="text-xl flex-shrink-0">{emoji}</span>
                  <div><p className="font-bold text-gray-700 text-sm">{title}</p><p className="text-gray-400 text-xs">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <h2 className="text-2xl font-black mb-2">Make It Your Own</h2>
        <p className="text-green-200 mb-5">Adjust the cannabutter amount in the recipe builder to hit your exact target dose.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/infusions"><Button className="bg-white text-green-800 hover:bg-green-50 font-black px-8 py-3">Build My Cannabutter <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          <Link to="/edibles-calculator"><Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-8 py-3">THC Calculator</Button></Link>
        </div>
      </div>
    </div>
  );
}
