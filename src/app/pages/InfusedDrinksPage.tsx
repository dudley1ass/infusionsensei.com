import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export function InfusedDrinksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Helmet>
        <title>Infused Drinks & Smoothies – THC Beverage Guide & Recipes</title>
        <meta name="description" content="How to make cannabis-infused drinks — smoothies, tea, lemonade, coffee, and more. Learn which infusion method works best for beverages and calculate exact THC per drink." />
        <link rel="canonical" href="https://infusionsensei.com/infused-drinks" />
      </Helmet>

      <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-3xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Infused Drinks & Smoothies<br/><span className="text-blue-200">THC & Flavor Guide</span></h1>
        <p className="text-blue-100 text-lg max-w-2xl mb-6">Cannabis-infused beverages are one of the fastest-growing edible categories. Here's how to make them work — and avoid the mistakes that leave most drinks weak or uneven.</p>
        <Link to="/coffee"><Button className="bg-white text-blue-700 hover:bg-blue-50 font-black px-8 py-3">See 20 Infused Coffee Recipes <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </div>

      <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-6">Popular Infused Drink Categories</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { name:"Infused Coffee", desc:"Bulletproof butter coffee, lattes, cold brew — 20 recipes with cannabutter or cannabis oil.", emoji:"☕", to:"/coffee", tag:"20 recipes" },
            { name:"Smoothies & Juice", desc:"Coconut oil blends perfectly into smoothies. The fat carriers make it effective and tasty.", emoji:"🥤", to:"/ingredients?category=drinks&recipe=smoothie", tag:"Beginner friendly" },
            { name:"Cannabis Tea", desc:"THC tincture in hot tea — simple, effective, customizable strength.", emoji:"🍵", to:"/ingredients?category=drinks&recipe=coffee", tag:"Easy" },
            { name:"Infused Lemonade", desc:"THC tincture in lemonade. Great for social occasions with controlled dosing.", emoji:"🍋", to:"/ingredients?category=drinks", tag:"Social" },
          ].map(({ name, desc, emoji, to, tag }) => (
            <Link key={name} to={to} className="bg-blue-50 rounded-2xl border border-blue-200 hover:border-blue-400 p-5 transition-all hover:shadow-md group flex gap-4 items-start">
              <div className="text-4xl flex-shrink-0">{emoji}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-gray-900 group-hover:text-blue-700">{name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">{tag}</span>
                </div>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-3">How to Infuse Drinks Properly</h2>
        <p className="text-gray-600 mb-6">Most infused drinks fail because THC doesn't dissolve in water. Here's what actually works:</p>
        <div className="space-y-4">
          {[
            { method:"Fat-based (butter or oil)", how:"THC binds to fat. Blend cannabutter or coconut oil into any fat-containing drink — coffee, hot chocolate, smoothies with nut butter.", best:"Best for: Coffee, hot chocolate, smoothies", works:"✅ Works well", color:"bg-green-50 border-green-200" },
            { method:"Tincture (alcohol-based)", how:"Add a few drops of THC tincture directly to any drink. Mixes evenly because alcohol disperses in water. Most precise dosing method.", best:"Best for: Lemonade, tea, cold drinks, cocktails", works:"✅ Works well", color:"bg-green-50 border-green-200" },
            { method:"Pre-made cannabis beverages", how:"Select Squeeze, THC syrups, and similar products are specially formulated to disperse in water using emulsifiers.", best:"Best for: Any drink — simplest option", works:"✅ Works well", color:"bg-green-50 border-green-200" },
            { method:"Raw oil in water drinks", how:"Dropping cannabis oil into water or juice doesn't work — oil floats to the top and doses unevenly. Always blend with a fat-containing base.", best:"Avoid for: Plain water, juice, tea (without fat)", works:"❌ Doesn't work", color:"bg-red-50 border-red-200" },
          ].map(({ method, how, best, works, color }) => (
            <div key={method} className={`rounded-2xl border p-5 ${color}`}>
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-black text-gray-900">{method}</h3>
                <span className="text-sm font-bold">{works}</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{how}</p>
              <p className="text-xs font-bold text-gray-500">{best}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-2xl font-black mb-2">Calculate Exact THC Per Drink</h2>
        <p className="text-green-200 mb-5">Use our free calculator to dial in the exact milligrams per serving for any beverage.</p>
        <Link to="/edibles-calculator"><Button className="bg-white text-green-800 hover:bg-green-50 font-black px-8 py-3">Open THC Calculator <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </div>
    </div>
  );
}
