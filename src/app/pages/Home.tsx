import { useRef } from "react";
import { Link } from "react-router";
import { BookOpen, FlaskConical, Package, Clock, ChefHat, TrendingUp } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { recipes } from "../data/recipes";
import { InfusionHeroBanner } from "../components/InfusionHeroBanner";

export function Home() {
  const featuredRecipes = recipes.slice(0, 3);
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Break out of the Layout's container padding so hero is full-bleed
    <div className="-mx-4 -mt-8">

      {/* ── Hero Banner ── */}
      <InfusionHeroBanner onScrollDown={scrollToContent} />

      {/* ── Rest of page (back inside normal padding) ── */}
      <div className="px-4 py-8 space-y-12" ref={contentRef}>

        {/* Features */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">What You Can Do</h2>
            <p className="text-green-700 italic">"Infuse now, thank yourself later."</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/recipes">
              <Card className="bg-white border-green-200 hover:border-green-400 transition-all hover:scale-105 cursor-pointer h-full shadow-md hover:shadow-xl">
                <CardHeader>
                  <BookOpen className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle className="text-gray-900">Recipe Library</CardTitle>
                  <CardDescription className="text-gray-600">
                    Explore tested recipes for edibles, drinks, and infusions
                  </CardDescription>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-green-600 italic">"Low heat. Good vibes."</p>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/infusions">
              <Card className="bg-white border-green-200 hover:border-green-400 transition-all hover:scale-105 cursor-pointer h-full shadow-md hover:shadow-xl">
                <CardHeader>
                  <FlaskConical className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle className="text-gray-900">My Infusions</CardTitle>
                  <CardDescription className="text-gray-600">
                    Create and manage your custom cannabutter and oils
                  </CardDescription>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-green-600 italic">"This isn't guessing. This is dosing."</p>
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link to="/ingredients">
              <Card className="bg-white border-green-200 hover:border-green-400 transition-all hover:scale-105 cursor-pointer h-full shadow-md hover:shadow-xl">
                <CardHeader>
                  <Package className="w-10 h-10 text-green-600 mb-2" />
                  <CardTitle className="text-gray-900">Create Recipe</CardTitle>
                  <CardDescription className="text-gray-600">
                    Build custom recipes with live THC calculations
                  </CardDescription>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-green-600 italic">"Add heat. Add flavor. Add control."</p>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </section>

        {/* Vibe Quotes */}
        <section className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 border-2 border-green-200">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { emoji: '🌿', quote: '"Take it slow. That\'s the secret."', sub: 'Perfect dosing starts with patience' },
              { emoji: '🔥', quote: '"Same recipe. Better outcome."', sub: 'Precision makes all the difference' },
              { emoji: '🍳', quote: '"Drizzle. Mix. Done."', sub: "Infusing doesn't have to be complicated" },
              { emoji: '✨', quote: '"Relax... it\'s part of the recipe."', sub: 'Good food. Good mood.' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md border-2 border-green-200">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <p className="text-lg text-gray-900 font-semibold mb-2">{item.quote}</p>
                <p className="text-sm text-gray-600">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Recipes */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Recipes</h2>
            <Link to="/recipes">
              <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-100">
                View All
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredRecipes.map((recipe) => (
              <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                <Card className="bg-white border-green-200 hover:border-green-400 transition-all hover:scale-105 overflow-hidden group shadow-md hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-green-600 text-white border-0 shadow-lg">
                        {recipe.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-gray-900">{recipe.name}</CardTitle>
                    <CardDescription className="text-gray-600 line-clamp-2">
                      {recipe.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-green-600" />
                        <span>{recipe.prepTime + recipe.cookTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChefHat className="w-4 h-4 text-green-600" />
                        <span>{recipe.servings} servings</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-200">
                      <div className="text-sm">
                        <span className="text-gray-600">THC per serving: </span>
                        <span className="text-green-700 font-bold">{recipe.thcPerServing}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Bottom CTA strip */}
        <section
          className="rounded-2xl py-10 px-6 text-center"
          style={{ background: 'linear-gradient(135deg, #052e16 0%, #14532d 100%)' }}
        >
          <div className="text-3xl mb-2">⚗️</div>
          <h3 className="text-2xl font-black text-white mb-2">Ready to build your first infusion?</h3>
          <p className="text-green-100/70 text-sm mb-5 max-w-md mx-auto">
            Pick your strain, set your potency, and get exact THC-per-serving calculations before you cook.
          </p>
          <Link
            to="/infusions"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #16a34a, #22c55e)',
              boxShadow: '0 6px 24px rgba(34,197,94,0.4)',
            }}
          >
            <FlaskConical className="size-4" />
            Open Infusion Builder
          </Link>
        </section>

        {/* Safety Notice */}
        <section className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 shadow-md">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-900 mb-2">Important Safety Information</h3>
              <ul className="space-y-2 text-gray-800">
                <li>• Start low and go slow — edibles can take 30–120 minutes to take effect</li>
                <li>• Store all cannabis products safely away from children and pets</li>
                <li>• Never drive or operate machinery under the influence</li>
                <li>• Know your local laws and regulations regarding cannabis</li>
                <li>• Consult with a healthcare provider if you have medical concerns</li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
