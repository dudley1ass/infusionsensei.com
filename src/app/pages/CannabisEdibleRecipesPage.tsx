import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { recipes } from "../data/recipes";
import { cleanRecipeDisplayTitle } from "../utils/recipeDisplayTitle";
import { recipeHeroImgClass } from "../utils/recipeHeroImageClass";

export function CannabisEdibleRecipesPage() {
  const featured = recipes.slice(0, 6);
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <Helmet>
        <title>Cannabis Edible Recipes for Beginners (Easy & Accurate Dosing)</title>
        <meta name="description" content="Easy cannabis edible recipes for beginners — brownies, cookies, gummies, butter, and drinks. Every recipe designed to work with our THC dosage calculator for accurate mg per serving." />
        <link rel="canonical" href="https://infusionsensei.com/edible-recipes" />
      </Helmet>

      <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-3xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Cannabis Edible Recipes<br/><span className="text-orange-200">for Beginners</span></h1>
        <p className="text-orange-100 text-lg max-w-2xl mb-6">These recipes are designed to work with our THC dosage calculator — so you know the exact milligrams per serving before you eat a single bite.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/edibles-calculator"><Button className="bg-white text-orange-700 hover:bg-orange-50 font-black px-6 py-3">Calculate My Dose <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          <Link to="/recipes"><Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-6 py-3">Browse All Recipes</Button></Link>
        </div>
        <div className="mt-4 rounded-2xl border border-white/25 bg-black/20 p-3">
          <p className="text-orange-100 text-sm font-bold mb-2">Start Your Infusion Plan</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/edibles-calculator"><Button className="bg-white text-orange-700 hover:bg-orange-50 font-bold">Calculator</Button></Link>
            <Link to="/party-mode"><Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold">Party Mode</Button></Link>
          </div>
        </div>
      </div>

      {/* Section 1: Base Infusions */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Start Here: Base Infusions</h2>
        <p className="text-gray-600 mb-6">Every edible starts with an infused fat or oil. Master these first and every recipe becomes easy.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { name:"Cannabutter", desc:"The foundation of cannabis cooking. Use in any recipe that calls for butter — brownies, cookies, sauces.", potency:"Typical: 5–15mg/tbsp", emoji:"🧈", to:"/infusions" },
            { name:"Cannabis Coconut Oil", desc:"Absorbs more THC than butter. Great for dairy-free recipes, smoothies, and tropical flavors.", potency:"Typical: 10–20mg/tbsp", emoji:"🥥", to:"/infusions" },
            { name:"Infused Chocolate", desc:"Melt chocolate with cannabis coconut oil. Use as a coating, drizzle, or ingredient in any dessert.", potency:"Typical: varies by recipe", emoji:"🍫", to:"/infusions" },
          ].map(({ name, desc, potency, emoji, to }) => (
            <Link key={name} to={to} className="bg-green-50 rounded-2xl border border-green-200 p-5 hover:border-green-400 transition-all hover:shadow-md group">
              <div className="text-4xl mb-3">{emoji}</div>
              <h3 className="font-black text-gray-900 group-hover:text-green-700 mb-2">{name}</h3>
              <p className="text-gray-600 text-sm mb-3">{desc}</p>
              <p className="text-xs text-green-700 font-bold bg-green-100 px-3 py-1 rounded-full inline-block">{potency}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Section 2: Easy Recipes */}
      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-2">Easy Cannabis Edible Recipes</h2>
        <p className="text-gray-600 mb-6">Every recipe includes estimated THC per serving based on standard cannabutter potency. Use the calculator to adjust for your specific batch.</p>
        <div className="grid md:grid-cols-3 gap-5">
          {featured.map(recipe => (
            <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-green-400 overflow-hidden group shadow-sm hover:shadow-md transition-all">
              <div className="h-40 overflow-hidden">
                <img src={recipe.image} alt={cleanRecipeDisplayTitle(recipe.name)} className={`${recipeHeroImgClass(recipe.id, recipe.category)} group-hover:scale-105 transition-transform duration-500`} />
              </div>
              <div className="p-4">
                <h3 className="font-black text-gray-900 mb-1">{cleanRecipeDisplayTitle(recipe.name)}</h3>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{recipe.description}</p>
                <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-1.5 text-xs text-center">
                  <span className="text-gray-600">Est. THC: </span>
                  <span className="text-green-700 font-black">{recipe.thcPerServing}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/recipes"><Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 font-bold">View All Recipes <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
        </div>
      </section>

      {/* Section 3: Dosage Tips */}
      <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Dosage Tips for Beginners</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { title:"Start low", desc:"Begin with 2.5–5mg per serving. You can always eat more — you can't un-eat what you've already had.", emoji:"🎯" },
            { title:"Wait 1–2 hours", desc:"Edibles take 30–120 minutes to kick in. The #1 mistake is eating more because you don't feel it yet.", emoji:"⏰" },
            { title:"Don't stack doses", desc:"If you don't feel anything after 2 hours, add a small amount only. Don't take a second full dose.", emoji:"⚠️" },
          ].map(({ title, desc, emoji }) => (
            <div key={title} className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
              <div className="text-3xl mb-2">{emoji}</div>
              <h3 className="font-black text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-2xl font-black mb-2">Calculate Your Exact Dose</h2>
        <p className="text-green-200 mb-5">Use our free THC calculator with any of these recipes to get exact milligrams per serving.</p>
        <Link to="/edibles-calculator"><Button className="bg-white text-green-800 hover:bg-green-50 font-black px-8 py-3">Open THC Calculator <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </div>
    </div>
  );
}
