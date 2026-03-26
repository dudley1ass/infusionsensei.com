import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ChefHat, Clock, ArrowRight, Calculator, TrendingUp, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { recipes } from "../data/recipes";

export function Home() {
  const featuredRecipes = recipes.filter(r => r.isNew).slice(0, 3);

  return (
    <div className="space-y-14">
      <Helmet>
        <title>The Ultimate Cannabis Infusion Toolkit | THC Calculator + Recipe Builder</title>
        <meta name="description" content="Calculate THC, build recipes, and create perfect edibles every time. Free tools for dosage, infusions, and custom cannabis recipes." />
        <link rel="canonical" href="https://infusionsensei.com/" />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-800 via-green-700 to-green-900 px-6 py-12 md:py-16 shadow-2xl">
        <div className="absolute top-0 right-0 w-72 h-72 bg-green-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-900/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-3">
            <Badge className="bg-green-900/70 text-green-200 border border-green-600/50 mb-4 text-sm px-4 py-1.5 inline-flex">
              <Zap className="w-3.5 h-3.5 mr-1.5" /> Free Cannabis Cooking Tool
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight">
              The Ultimate Cannabis Infusion Toolkit
            </h1>
            <p className="text-green-300 text-base font-semibold mb-6">
              Calculate THC, build recipes, and create perfect edibles every time.
            </p>
          </div>

          {/* Image-based snack cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {[
              { emoji: "🍗", label: "Infused Wings", sub: "20 sauces", to: "/wings", img: "/IMAGES/chickenwings.jpg", highlight: false },
              { emoji: "🍿", label: "Infused Popcorn", sub: "20 flavors", to: "/popcorn", img: "/IMAGES/popcorn.webp", highlight: false },
              { emoji: "☕", label: "Infused Coffee", sub: "20 drinks", to: "/coffee", img: "/IMAGES/coffee.jpg", highlight: false },
              { emoji: "🍟", label: "Infused Fries", sub: "20 styles", to: "/fries", img: "/IMAGES/fries.jpg", highlight: false },
              { emoji: "🍽️", label: "Dinner of the Week", sub: "New this week", to: "/dinner-of-the-week", img: ["/IMAGES/steakalfredo.jpg", "/IMAGES/steakalfredo.jpeg", "/IMAGES/steakalfredo.png", "/IMAGES/steakalfredo.webp"], highlight: true },
              { emoji: "🎉", label: "Party Mode", sub: "Hosting? Start here", to: "/party-mode", img: ["/IMAGES/partynight.jpg", "/IMAGES/partynight.jpeg", "/IMAGES/partynight.png", "/IMAGES/partynight.webp"], highlight: true },
            ].map(({ emoji, label, sub, to, img, highlight }) => (
              <Link key={label} to={to}>
                <div className={`relative overflow-hidden rounded-2xl h-32 md:h-40 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-white/50 group`}>
                  {img ? (
                    <img
                      src={Array.isArray(img) ? img[0] : img}
                      alt={label}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(event) => {
                        if (!Array.isArray(img)) return;
                        const currentSrc = event.currentTarget.getAttribute("src");
                        const currentIndex = img.indexOf(currentSrc || "");
                        const nextSrc = img[currentIndex + 1];
                        if (nextSrc) {
                          event.currentTarget.src = nextSrc;
                        }
                      }}
                    />
                  ) : highlight ? (
                    <div className={`absolute inset-0 ${label === "Dinner of the Week" ? "bg-gradient-to-br from-amber-700 to-orange-900" : "bg-gradient-to-br from-purple-700 to-indigo-900"}`} />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-green-700 to-green-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  {highlight && <div className="absolute top-2 left-2"><span className="bg-green-500 text-white text-xs font-black px-2 py-0.5 rounded-full">NEW</span></div>}
                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <div className="text-2xl mb-1">{emoji}</div>
                    <div className="text-white font-black text-sm leading-tight">{label}</div>
                    <div className="text-green-300 text-xs mt-0.5">{sub}</div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/20 rounded-full p-1"><ArrowRight className="w-3 h-3 text-white" /></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link to="/infusions">
              <Button size="lg" className="bg-white text-green-800 hover:bg-green-50 font-black text-base px-8 py-5 shadow-xl rounded-xl transition-transform hover:scale-105">
                Recipe Builder <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/thc-calculator">
              <Button size="lg" variant="outline" className="border-2 border-white/40 text-white hover:bg-white/10 font-bold text-base px-8 py-5 rounded-xl">
                <Calculator className="w-4 h-4 mr-2" /> Calculate THC
              </Button>
            </Link>
          </div>
          <p className="text-green-400 text-sm mt-4 font-medium text-center">
            ✓ No account &nbsp;·&nbsp; ✓ No setup &nbsp;·&nbsp; ✓ Instant results
          </p>
        </div>
      </section>

      {/* TRENDING FLAVORS */}
      <section>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">🔥 Trending Flavors</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Mango Habanero Wings", to: "/wings", emoji: "🥭" },
              { label: "Garlic Butter Popcorn", to: "/popcorn", emoji: "🧄" },
              { label: "Nashville Hot Wings", to: "/wings", emoji: "🔥" },
              { label: "Caramel Popcorn", to: "/popcorn", emoji: "🍬" },
              { label: "Bulletproof Coffee", to: "/coffee", emoji: "☕" },
              { label: "Truffle Fries", to: "/fries", emoji: "🍄" },
              { label: "Korean Gochujang Wings", to: "/wings", emoji: "🇰🇷" },
              { label: "Chocolate Drizzle Popcorn", to: "/popcorn", emoji: "🍫" },
              { label: "Truffle Butter Wings", to: "/wings", emoji: "🍄" },
              { label: "S'mores Popcorn", to: "/popcorn", emoji: "🔥" },
            ].map(({ label, to, emoji }) => (
              <Link key={label} to={to}>
                <span className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-green-50 hover:text-green-700 border border-gray-200 hover:border-green-300 text-gray-700 text-sm font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer">
                  {emoji} {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section>
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

      {/* EMOTIONAL HOOK */}
      <section>
        <div className="bg-gray-950 rounded-3xl p-8 md:p-12 text-center shadow-2xl border border-gray-800">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Edibles shouldn't be a gamble.</h2>
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
            Infusion Sensei gives you control —<br className="hidden md:block" />so every batch hits exactly how you want.
          </p>
          <Link to="/infusions">
            <Button size="lg" className="bg-green-500 hover:bg-green-400 text-white font-black text-lg px-10 py-6 rounded-xl shadow-lg transition-transform hover:scale-105">
              Start My Infusion — Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* DINNER OF THE WEEK */}
      <section>
        <Link to="/dinner-of-the-week">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-900 via-orange-900 to-amber-800 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
            <img src="/IMAGES/mac-and-cheese.jpg" alt="Dinner of the Week" className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-8 py-8">
              <div className="text-6xl flex-shrink-0">🍽️</div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <span className="bg-green-500 text-white text-xs font-black px-2.5 py-1 rounded-full">NEW THIS WEEK</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Dinner of the Week</h2>
                <p className="text-orange-200 font-bold mb-1">Steak Alfredo with Spinach</p>
                <p className="text-orange-300/80 text-sm">A complete infused dinner you can make tonight — with exact THC per serving.</p>
              </div>
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 bg-white text-gray-900 font-black px-5 py-2.5 rounded-xl text-sm group-hover:bg-amber-50 transition-colors shadow-lg">
                  See This Week's Dinner <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* PARTY MODE */}
      <section>
        <Link to="/party-mode">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-800 shadow-xl hover:shadow-2xl transition-all group cursor-pointer">
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 px-8 py-8">
              <div className="text-6xl flex-shrink-0">🎉</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-black text-white mb-1">Party Mode</h2>
                <p className="text-purple-200 font-bold mb-1">Game Night · Chill Night · Dessert Pack · Drinks Pack</p>
                <p className="text-purple-300/80 text-sm">Pre-planned infused spreads for any occasion — with dosing strategy for groups.</p>
              </div>
              <div className="flex-shrink-0">
                <div className="inline-flex items-center gap-2 bg-white text-gray-900 font-black px-5 py-2.5 rounded-xl text-sm group-hover:bg-purple-50 transition-colors shadow-lg">
                  Hosting? Start Here <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* NEW RECIPES */}
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

      {/* FINAL CTA */}
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
                Start My Infusion — Free <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* SAFETY */}
      <section>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 flex gap-3 items-start">
          <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-sm text-amber-800">
            <strong>Safety:</strong> Edibles take 30–120 min to kick in — start low and wait before consuming more.
            Store safely away from children and pets. Must be 21+ or comply with local regulations.
          </p>
        </div>
      </section>

    </div>
  );
}
