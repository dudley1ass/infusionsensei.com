import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export function SavoryCannabisPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Helmet>
        <title>Savory Cannabis Recipes – Pizza, Wings, Spreads & Dips, Sauces & More</title>
        <meta name="description" content="Cannabis-infused savory recipes — pizza sauce, chicken wings, dips and spreads, pasta, and more. Exact THC per serving calculated automatically." />
        <link rel="canonical" href="https://infusionsensei.com/savory-cannabis" />
      </Helmet>

      <div className="bg-gradient-to-br from-red-700 to-orange-700 rounded-3xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">Savory Cannabis Recipes<br/><span className="text-red-200">Wings, Spreads & Dips, Pizza & More</span></h1>
        <p className="text-red-100 text-lg max-w-2xl mb-6">Not everything has to be a brownie. Cannabis infuses beautifully into savory food — and these are some of the best-tasting edibles you'll ever make.</p>
        <div className="flex flex-wrap gap-3">
          <Link to="/wings"><Button className="bg-white text-red-700 hover:bg-red-50 font-black px-6 py-3">🍗 Wing Sauces <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          <Link to="/spreads-dips"><Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-6 py-3">🥣 Spreads & Dips</Button></Link>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-black text-gray-900 mb-6">Savory Cannabis Categories</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { name:"Infused Wing Sauces", desc:"20 cannabis wing sauce recipes — Buffalo, Korean Gochujang, Honey BBQ, Nashville Hot and more. Cook wings your way. We handle the infused sauce.", emoji:"🍗", to:"/wings", count:"20 sauces" },
            { name:"Spreads & Dips", desc:"Nut butters, cream cheese spreads, queso, spinach-artichoke, ranch, buffalo dip, aioli, and more — open any style in the recipe builder with exact mg per serving.", emoji:"🥣", to:"/spreads-dips", count:"14 spreads & dips" },
            { name:"Infused Pizza Sauce", desc:"Cannabis olive oil in homemade pizza sauce. The secret is in the sauce — not the dough. THC disperses evenly through every slice.", emoji:"🍕", to:"/recipes/infused-pizza-sauce", count:"Classic recipe" },
            { name:"Infused Pasta", desc:"Garlic infused pasta and cannabis alfredo — two savory meals with exact THC per serving built into the recipe builder.", emoji:"🍝", to:"/ingredients?category=savory-meals&recipe=alfredo", count:"Builder ready" },
            { name:"Infused Butter for Cooking", desc:"Cannabutter is the most versatile tool in cannabis cooking. Use it anywhere you'd use regular butter — finishing steaks, sautéing vegetables, making sauces.", emoji:"🧈", to:"/infusions", count:"Build yours" },
            { name:"Cannabis Oils for Cooking", desc:"Drizzle cannabis olive oil over finished dishes, use cannabis coconut oil in stir-fries, or add to any recipe that calls for cooking oil.", emoji:"🫒", to:"/infusions", count:"Build yours" },
          ].map(({ name, desc, emoji, to, count }) => (
            <Link key={name} to={to} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-red-400 p-5 transition-all hover:shadow-md group flex gap-4 items-start">
              <div className="text-4xl flex-shrink-0">{emoji}</div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-gray-900 group-hover:text-red-700">{name}</h3>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">{count}</span>
                </div>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm">
        <h2 className="text-2xl font-black text-gray-900 mb-3">Why Savory Cannabis Edibles Work So Well</h2>
        <p className="text-gray-600 mb-6">Savory foods are often better cannabis vehicles than sweet ones — here's why:</p>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { point:"High fat content", detail:"Wings, fries, and pasta sauces are naturally fat-rich. THC binds to fat, so absorption is efficient and consistent." },
            { point:"Masks cannabis flavor", detail:"Bold flavors like buffalo sauce, garlic, and Cajun seasoning cover any earthy cannabis taste completely." },
            { point:"Precise portioning", detail:"Sauces and coatings let you control exactly how much infused fat goes onto each serving." },
            { point:"Social occasions", detail:"Infused wings at a party are subtle. Nobody needs to know unless you tell them — always label your food." },
          ].map(({ point, detail }) => (
            <div key={point} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <p className="font-black text-gray-900 mb-1">✅ {point}</p>
              <p className="text-gray-600 text-sm">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-2xl font-black mb-2">Calculate Exact THC Per Serving</h2>
        <p className="text-green-200 mb-5">Every savory recipe works with our recipe builder — get exact milligrams per wing, per serving, per portion.</p>
        <Link to="/edibles-calculator"><Button className="bg-white text-green-800 hover:bg-green-50 font-black px-8 py-3">Open THC Calculator <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </div>
    </div>
  );
}
