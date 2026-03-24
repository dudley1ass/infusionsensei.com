import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ChefHat, Clock, ArrowRight, Calculator, Shield, Beaker, TrendingUp, Zap, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { recipes } from "../data/recipes";

export function Home() {
  const featuredRecipes = recipes.filter(r => r.isNew).slice(0, 3);

  return (
    <div className="space-y-16">
      <Helmet>
        <title>Infusion Sensei | THC Dosage Calculator & Cannabis Edible Recipe Builder</title>
        <meta name="description" content="Free THC dosage calculator for cannabis edibles. Calculate exact mg per serving for cannabutter, infused oils, and recipes. Stop guessing — know your dose." />
        <link rel="canonical" href="https://infusionsensei.com/" />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-800 via-green-700 to-green-900 px-6 py-14 md:py-20 shadow-2xl">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10">

            {/* Left: headline + CTA */}
            <div className="flex-1 text-center lg:text-left">
              <Badge className="bg-green-900/70 text-green-200 border border-green-600/50 mb-5 text-sm px-4 py-1.5 inline-flex">
                <Zap className="w-3.5 h-3.5 mr-1.5" /> Free Cannabis Cooking Tool
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
                Get Exact THC<br />
                Per Serving —<br />
                <span className="text-green-300">Every Time.</span>
              </h1>
              <p className="text-lg md:text-xl text-green-100 mb-8 leading-relaxed max-w-xl">
                Stop guessing potency. Build infused butter, oils, and recipes with real-time THC calculations — so every edible hits exactly how you want.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                <Link to="/infusions">
                  <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-black text-lg px-8 py-6 shadow-xl rounded-xl transition-transform hover:scale-105">
                    Start My Infusion (Free)
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/recipes" className="text-green-200 hover:text-white font-semibold flex items-center gap-1.5 transition-colors text-sm">
                  Browse Recipes <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <p className="text-green-400 text-sm mt-4 font-medium">
                ✓ No account &nbsp;·&nbsp; ✓ No setup &nbsp;·&nbsp; ✓ Instant results
              </p>
            </div>

            {/* Right: terminal preview — the secret weapon */}
            <div className="flex-shrink-0 w-full max-w-sm">
              <p className="text-green-400 text-xs font-semibold uppercase tracking-widest text-center mb-3">See exactly what you'll get:</p>
              <div className="bg-gray-950 rounded-2xl shadow-2xl border border-gray-700/60 overflow-hidden">
                <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-700/60">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-gray-500 text-xs font-mono ml-2">infusion-calculator</span>
                </div>
                <div className="p-5 font-mono text-sm space-y-2">
                  <p className="text-green-400 font-bold text-base">🍫 Chocolate Brownies</p>
                  <div className="space-y-1.5 text-sm">
                    <p className="text-gray-300">→ <span className="text-green-400 font-bold text-base">10mg THC</span> per serving</p>
                    <p className="text-gray-300">→ <span className="text-green-400 font-bold">160mg total</span> batch</p>
                    <p className="text-gray-300">→ <span className="text-green-400 font-bold">1 cup</span> infused butter</p>
                    <p className="text-gray-300">→ <span className="text-green-400 font-bold">16</span> servings</p>
                  </div>
                  <div className="border-t border-gray-700/60 mt-3 pt-3 space-y-1.5">
                    <p className="text-emerald-400 font-semibold">✔ Precise dosing</p>
                    <p className="text-emerald-400 font-semibold">✔ Consistent results</p>
                    <p className="text-emerald-400 font-semibold">✔ No guesswork</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ──────────────────────────────────────── */}
      <section className="-mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: "🌿", label: "20+ Verified Strains", sub: "With real THC profiles" },
            { icon: "🧮", label: "Live THC Calculator", sub: "Updates instantly" },
            { icon: "📋", label: "Tested Recipes", sub: "Exact mg per serving" },
            { icon: "🛡️", label: "Safe Dosing Built-In", sub: "Know before you eat" },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="bg-white border-2 border-green-100 rounded-2xl p-4 text-center shadow-sm hover:border-green-300 hover:shadow-md transition-all">
              <div className="text-2xl mb-1">{icon}</div>
              <div className="font-bold text-gray-900 text-sm">{label}</div>
              <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EMOTIONAL HOOK ───────────────────────────────────── */}
      <section>
        <div className="bg-gray-950 rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Edibles shouldn't be a gamble.
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-4 mb-8 max-w-lg mx-auto">
            <div className="flex-1 bg-red-950/60 border border-red-800/60 rounded-2xl px-6 py-5">
              <p className="text-red-400 font-black text-lg">Too strong?</p>
              <p className="text-red-300/80 text-sm mt-1">Anxiety. Bad trip. Hours of misery.</p>
            </div>
            <div className="flex items-center justify-center text-gray-600 font-black text-xl">vs</div>
            <div className="flex-1 bg-yellow-950/60 border border-yellow-800/60 rounded-2xl px-6 py-5">
              <p className="text-yellow-400 font-black text-lg">Too weak?</p>
              <p className="text-yellow-300/80 text-sm mt-1">Wasted product. Wasted time.</p>
            </div>
          </div>
          <p className="text-green-400 text-xl md:text-2xl font-bold mb-8">
            Infusion Sensei gives you control —<br className="hidden md:block" />
            so every batch hits exactly how you want.
          </p>
          <Link to="/infusions">
            <Button size="lg" className="bg-green-500 hover:bg-green-400 text-white font-black text-lg px-10 py-6 rounded-xl shadow-lg transition-transform hover:scale-105">
              Start My Infusion — Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section>
        <div className="text-center mb-10">
          <p className="text-green-600 font-bold text-sm uppercase tracking-widest mb-2">Takes less than 60 seconds</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", icon: <Beaker className="w-8 h-8 text-green-600" />, title: "Enter Your Strain", desc: "Input your THC%, cannabis weight, and infusion type. Decarb math is handled automatically.", color: "green" },
            { step: "2", icon: <ChefHat className="w-8 h-8 text-blue-600" />, title: "Choose or Build a Recipe", desc: "Use one of our tested recipes or build your own. Every ingredient updates your dose calculation live.", color: "blue" },
            { step: "3", icon: <Calculator className="w-8 h-8 text-purple-600" />, title: "Get Exact THC Per Serving", desc: "Precise milligrams per serving in real time. Scale servings up or down — the math follows instantly.", color: "purple" },
          ].map(({ step, icon, title, desc, color }) => (
            <div key={step} className={`relative bg-white border-2 border-${color}-100 rounded-2xl p-6 shadow-md hover:shadow-xl hover:border-${color}-300 transition-all`}>
              <div className={`absolute -top-4 -left-4 w-10 h-10 bg-${color}-600 text-white rounded-full flex items-center justify-center font-black text-lg shadow-lg`}>{step}</div>
              <div className="mb-4 mt-2">{icon}</div>
              <h3 className="font-black text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Built for Precise, Repeatable Results</h2>
          <p className="text-gray-500">Not a generic recipe app — built specifically for cannabis cooking</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: <Calculator className="w-5 h-5 text-green-600" />, title: "Real-Time THC Calculations", desc: "Every change updates your mg per serving instantly. No manual math ever." },
            { icon: <Beaker className="w-5 h-5 text-blue-600" />, title: "Custom Infusion Builder", desc: "Cannabutter, coconut oil, tinctures, cream, syrups — with strain-specific profiles." },
            { icon: <ChefHat className="w-5 h-5 text-purple-600" />, title: "Recipe Scaling with Dosage", desc: "Scale servings up or down and your THC per serving recalculates automatically." },
            { icon: <Shield className="w-5 h-5 text-orange-600" />, title: "Decarb Guidance Built In", desc: "Temperature and time controls with live feedback on THC retention." },
            { icon: <Star className="w-5 h-5 text-yellow-600" />, title: "Pre-Made Products Supported", desc: "Use Select Squeeze, distillates, or any commercial product alongside homemade infusions." },
            { icon: <Zap className="w-5 h-5 text-pink-600" />, title: "No Account Required", desc: "Open it, build your infusion, get your numbers. Done in under 60 seconds." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-green-300 hover:shadow-md transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-green-50 transition-colors">{icon}</div>
                <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WING SAUCES FEATURE ──────────────────────────────── */}
      <section>
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-orange-700 shadow-xl">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 px-8 py-10">
            <div className="text-7xl flex-shrink-0">🍗</div>
            <div className="flex-1 text-center md:text-left">
              <Badge className="bg-white/20 text-white border-white/30 mb-3 text-xs">NEW SECTION</Badge>
              <h2 className="text-3xl font-black text-white mb-2">20 Infused Wing Sauces</h2>
              <p className="text-orange-100 mb-5 max-w-lg">Buffalo to Korean Gochujang — every sauce built with cannabutter or cannabis oil for exact THC per wing. Pick your flavor and get the recipe.</p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-5">
                {["🌶️ Spicy", "🍯 Sweet", "🧄 Garlic", "🔥 Nashville Hot", "🥢 Asian"].map(tag => (
                  <span key={tag} className="bg-white/20 text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/30">{tag}</span>
                ))}
              </div>
              <Link to="/wings">
                <Button className="bg-white text-orange-700 hover:bg-orange-50 font-black text-base px-8 py-3 shadow-lg">
                  Pick Your Wing Sauce <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW RECIPES ──────────────────────────────────────── */}
      {featuredRecipes.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-3xl font-black text-gray-900">New Recipes</h2>
              <p className="text-green-600 text-sm font-semibold mt-1">✓ Includes exact THC per serving</p>
            </div>
            <Link to="/recipes">
              <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50 font-semibold">
                View All <TrendingUp className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <Card className="bg-white border-2 border-green-100 hover:border-green-400 transition-all hover:-translate-y-1 overflow-hidden group shadow-md hover:shadow-xl h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-green-500 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-lg">✨ NEW</span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-800 border-0 capitalize font-semibold">{recipe.difficulty}</Badge>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-gray-900 text-lg">{recipe.name}</CardTitle>
                    <p className="text-gray-500 text-sm line-clamp-2">{recipe.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-green-500" />{recipe.prepTime + recipe.cookTime} min</div>
                      <div className="flex items-center gap-1.5"><ChefHat className="w-4 h-4 text-green-500" />{recipe.servings} servings</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm text-center">
                      <span className="text-gray-600">THC per serving: </span>
                      <span className="text-green-700 font-black">{recipe.thcPerServing}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── FINAL CTA ────────────────────────────────────────── */}
      <section>
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 text-white text-9xl leading-none">🌿</div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
              Get Exact THC Per Serving<br className="hidden md:block" />
              <span className="text-green-200">in Under 60 Seconds</span>
            </h2>
            <p className="text-green-100 text-lg mb-8">Try it now — it's free. No account. No setup.</p>
            <Link to="/infusions">
              <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-black text-xl px-12 py-7 rounded-xl shadow-2xl transition-transform hover:scale-105">
                Start My Infusion — Free
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SAFETY (compact) ─────────────────────────────────── */}
      <section>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex gap-3 items-start">
          <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-sm text-amber-800">
            <strong>Safety:</strong> Edibles take 30–120 min to kick in — start low and wait before consuming more.
            Store safely away from children and pets. Must be 21+ or comply with local regulations. Never drive under the influence.
          </p>
        </div>
      </section>

    </div>
  );
}
