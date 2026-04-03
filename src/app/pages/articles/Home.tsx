import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { BookOpen, FlaskConical, Package, ChefHat, Clock, ArrowRight, CheckCircle, Calculator, Leaf, Shield, Beaker, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { recipes } from "../data/recipes";
import { cleanRecipeDisplayTitle } from "../../utils/recipeDisplayTitle";
import { recipeHeroImgClass } from "../../utils/recipeHeroImageClass";

export function Home() {
  const featuredRecipes = recipes.filter(r => r.isNew).slice(0, 3);

  return (
    <div className="space-y-0">
      <Helmet>
        <title>Infusion Sensei | THC Dosage Calculator & Cannabis Edible Recipe Builder</title>
        <meta name="description" content="Free THC dosage calculator for cannabis edibles. Calculate exact mg per serving for cannabutter, infused oils, and recipes. Stop guessing — know your dose." />
        <link rel="canonical" href="https://infusionsensei.com/" />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-700 via-green-600 to-green-800 px-8 py-16 md:py-20 mb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 text-white text-9xl">🌿</div>
          <div className="absolute bottom-4 left-8 text-white text-7xl">🌿</div>
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <Badge className="bg-green-900/60 text-green-200 border-green-600 mb-6 text-sm px-4 py-1.5">
            Free Cannabis Cooking Tool
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight">
            Create Infused Recipes with<br />
            <span className="text-green-200">Exact THC Per Serving</span>
          </h1>
          <p className="text-xl text-green-100 mb-8 leading-relaxed">
            Stop guessing potency. Build cannabutter, oils, and recipes with real-time THC calculations — so every edible hits exactly how you want.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/infusions">
              <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-bold text-lg px-8 py-6 shadow-xl">
                Build My Infusion — Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/recipes" className="text-green-200 hover:text-white font-semibold flex items-center gap-2 transition-colors">
              Browse Recipes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── EXAMPLE OUTPUT ───────────────────────────────────── */}
      <section className="mb-12 px-2">
        <div className="max-w-2xl mx-auto">
          <p className="text-center text-gray-500 text-sm font-semibold uppercase tracking-widest mb-4">Example Output</p>
          <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-gray-500 text-xs ml-2 font-mono">infusion-calculator</span>
            </div>
            <div className="font-mono text-sm space-y-1">
              <p className="text-green-400 font-bold text-base">🍫 Chocolate Brownies</p>
              <p className="text-gray-300">→ <span className="text-green-400 font-bold">10mg THC</span> per serving</p>
              <p className="text-gray-300">→ <span className="text-green-400 font-bold">160mg total</span> batch</p>
              <p className="text-gray-300">→ <span className="text-green-400 font-bold">1 cup</span> infused butter</p>
              <div className="border-t border-gray-700 mt-3 pt-3 space-y-1">
                <p className="text-green-500">✔ Precise dosing</p>
                <p className="text-green-500">✔ Consistent results</p>
                <p className="text-green-500">✔ No guesswork</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <section className="mb-12">
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl py-5 px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: "🌿", label: "20+ Strain Profiles" },
              { icon: "🧮", label: "Live THC Calculator" },
              { icon: "📋", label: "Tested Recipes" },
              { icon: "🛡️", label: "Built for Safe Dosing" },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2">
                <span className="text-xl">{icon}</span>
                <span className="text-green-800 font-semibold text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">How It Works</h2>
          <p className="text-gray-600">Three steps from flower to perfectly dosed edible</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              icon: <Beaker className="w-8 h-8 text-green-600" />,
              title: "Enter Your Strain",
              desc: "Input your THC%, cannabis weight, and infusion type. Infusion Sensei handles the decarb math automatically.",
            },
            {
              step: "2",
              icon: <ChefHat className="w-8 h-8 text-green-600" />,
              title: "Choose or Create a Recipe",
              desc: "Pick from our tested recipe library or build your own. Every ingredient updates your calculations live.",
            },
            {
              step: "3",
              icon: <Calculator className="w-8 h-8 text-green-600" />,
              title: "Get Exact THC Per Serving",
              desc: "See the precise milligrams per serving in real time. Scale servings up or down — the math updates instantly.",
            },
          ].map(({ step, icon, title, desc }) => (
            <div key={step} className="relative bg-white border-2 border-green-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="absolute -top-4 -left-4 w-9 h-9 bg-green-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-md">
                {step}
              </div>
              <div className="mb-4 mt-2">{icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EMOTIONAL HOOK ───────────────────────────────────── */}
      <section className="mb-16">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Edibles shouldn't be a gamble.
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
            <div className="bg-red-900/40 border border-red-700 rounded-xl px-6 py-4">
              <p className="text-red-300 font-semibold">Too strong?</p>
              <p className="text-red-200 text-sm">Bad experience.</p>
            </div>
            <div className="flex items-center text-gray-500 font-bold text-2xl">vs</div>
            <div className="bg-yellow-900/40 border border-yellow-700 rounded-xl px-6 py-4">
              <p className="text-yellow-300 font-semibold">Too weak?</p>
              <p className="text-yellow-200 text-sm">Waste of time.</p>
            </div>
          </div>
          <p className="text-green-300 text-xl font-semibold mb-6">
            Infusion Sensei gives you control — so every recipe hits exactly how you want.
          </p>
          <Link to="/infusions">
            <Button size="lg" className="bg-green-500 hover:bg-green-400 text-white font-bold text-lg px-8 py-6">
              Start My First Infusion
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="mb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Everything You Need</h2>
          <p className="text-gray-600">Built specifically for cannabis cooking — not a generic recipe app</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: <Calculator className="w-6 h-6 text-green-600" />, title: "Real-Time THC Calculations", desc: "Every ingredient change updates your mg per serving instantly. No manual math." },
            { icon: <FlaskConical className="w-6 h-6 text-green-600" />, title: "Custom Infusion Builder", desc: "Cannabutter, coconut oil, tinctures, cream, syrups — with strain-specific profiles." },
            { icon: <Package className="w-6 h-6 text-green-600" />, title: "Recipe Scaling with Dosage", desc: "Scale servings up or down and your THC per serving recalculates automatically." },
            { icon: <Shield className="w-6 h-6 text-green-600" />, title: "Decarb Guidance Built In", desc: "Temperature and time controls with live feedback on THC and terpene retention." },
            { icon: <BookOpen className="w-6 h-6 text-green-600" />, title: "Pre-Made & Custom Products", desc: "Use commercial products like Select Squeeze or build from raw flower — both supported." },
            { icon: <Leaf className="w-6 h-6 text-green-600" />, title: "Clean, Simple Interface", desc: "No account required. Open it, build your infusion, get your numbers." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-green-200 rounded-xl p-5 hover:border-green-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-2">
                {icon}
                <h3 className="font-bold text-gray-900">{title}</h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NEW RECIPES ──────────────────────────────────────── */}
      {featuredRecipes.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-gray-900">New Recipes</h2>
              <p className="text-gray-600 text-sm mt-1">Fresh additions — 5 new recipes every week</p>
            </div>
            <Link to="/recipes">
              <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-100">
                View All <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <Card className="bg-white border-green-200 hover:border-green-400 transition-all hover:scale-105 overflow-hidden group shadow-md hover:shadow-xl h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={recipe.image} alt={cleanRecipeDisplayTitle(recipe.name)} className={`${recipeHeroImgClass(recipe.id, recipe.category)} group-hover:scale-110 transition-transform duration-300`} />
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-xs font-black px-2 py-1 rounded-full">✨ NEW</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600 text-white border-0">{recipe.difficulty}</Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-gray-900">{cleanRecipeDisplayTitle(recipe.name)}</CardTitle>
                    <p className="text-gray-500 text-sm line-clamp-2">{recipe.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-green-600" /><span>{recipe.prepTime + recipe.cookTime} min</span></div>
                      <div className="flex items-center gap-1"><ChefHat className="w-4 h-4 text-green-600" /><span>{recipe.servings} servings</span></div>
                    </div>
                    <div className="pt-2 border-t border-green-200 text-sm">
                      <span className="text-gray-600">THC per serving: </span>
                      <span className="text-green-700 font-bold">{recipe.thcPerServing}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-10 text-center shadow-xl">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Start Your First Infusion in 60 Seconds
          </h2>
          <p className="text-green-100 text-lg mb-8">No account. No setup. Just open it and build.</p>
          <Link to="/infusions">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50 font-bold text-xl px-10 py-7 shadow-xl">
              Build My Infusion — Free
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── SAFETY NOTICE ────────────────────────────────────── */}
      <section className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow">
            <span className="text-xl">⚠️</span>
          </div>
          <div>
            <h3 className="font-bold text-amber-900 mb-1">Important Safety Information</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Start low and go slow — edibles take 30–120 minutes to take effect</li>
              <li>• Store all cannabis products safely away from children and pets</li>
              <li>• Never drive or operate machinery under the influence</li>
              <li>• Know your local laws. Must be 21+ or comply with local regulations</li>
            </ul>
          </div>
        </div>
      </section>

    </div>
  );
}
