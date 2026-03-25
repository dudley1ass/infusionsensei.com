import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { FlaskConical, ArrowRight, CheckCircle } from "lucide-react";

export function InfuseAnyFood() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>How to Infuse Any Food with Cannabis (Pizza, Pasta, Wings, Drinks & More) | Infusion Sensei</title>
        <meta name="description" content="How to add cannabis to any food — pizza, pasta, wings, fries, coffee, and more. The fat-matching method that works for every recipe, with exact THC dosing." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/infuse-any-food" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">How to Infuse Any Food</span>
      </div>
      <Card className="bg-white border-purple-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-purple-600 text-white mb-3">Advanced Techniques</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">How to Infuse Any Food with Cannabis</CardTitle>
              <p className="text-lg text-gray-600">Once you understand the fat-matching method, you can turn almost any recipe into an infused version — pizza, pasta, wings, fries, coffee, and more. Here's the system.</p>
            </div>
            <FlaskConical className="w-14 h-14 text-purple-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-10">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The Core Rule: Match the Fat</h2>
            <p className="text-gray-700 leading-relaxed">THC is fat-soluble — it binds to fat molecules, not water. This one rule tells you how to infuse <em>anything</em>:</p>
            <div className="bg-gray-950 rounded-2xl p-6 text-center">
              <p className="text-green-400 text-xs uppercase tracking-widest mb-3">The Fat-Matching Method</p>
              <p className="text-white text-lg font-black">Find the fat in your recipe → Replace part of it with cannabis-infused fat</p>
              <p className="text-gray-400 text-sm mt-2">The infused fat carries THC evenly through the entire dish</p>
            </div>
            <div className="space-y-2">
              {[
                { dish:"Pizza sauce", fat:"Olive oil", swap:"Replace 1–2 tbsp with cannabis olive oil" },
                { dish:"Wing sauce", fat:"Butter", swap:"Replace all or half butter with cannabutter" },
                { dish:"Pasta", fat:"Butter or olive oil", swap:"Use cannabutter or cannabis olive oil as the base" },
                { dish:"Fries", fat:"Butter or oil for finishing", swap:"Toss finished fries in cannabutter or cannabis oil" },
                { dish:"Coffee", fat:"Butter or cream", swap:"Use cannabutter in bulletproof style, or tincture drops" },
                { dish:"Brownies", fat:"Butter", swap:"Full cannabutter replacement" },
                { dish:"Smoothies", fat:"Nut butter or coconut oil", swap:"Add cannabis coconut oil to blender" },
                { dish:"Popcorn", fat:"Butter for coating", swap:"Drizzle with melted cannabutter after popping" },
              ].map(({ dish, fat, swap }) => (
                <div key={dish} className="flex gap-3 items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <span className="font-bold text-gray-900 w-28 flex-shrink-0 text-sm">{dish}</span>
                  <span className="text-gray-500 text-xs w-28 flex-shrink-0">Fat: {fat}</span>
                  <span className="text-green-700 text-sm font-semibold">{swap}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The 4-Step System for Any Recipe</h2>
            <div className="space-y-3">
              {[
                { n:"1", title:"Identify the fat in the recipe", detail:"Every recipe has a fat component — butter, oil, cream, cheese, nut butter. This is your infusion point.", icon:"🔍" },
                { n:"2", title:"Choose your cannabis fat to match", detail:"Butter recipe → cannabutter. Oil recipe → cannabis olive or coconut oil. Drink → tincture or infused cream.", icon:"🧈" },
                { n:"3", title:"Calculate your dose first", detail:"Use our THC calculator before cooking. Enter how much infused fat you're using and how many servings to get exact mg per serving.", icon:"🧮" },
                { n:"4", title:"Add the infused fat at the right time", detail:"For sauces and finishes: add at the end off-heat. For baked goods: add with other fats. For drinks: blend or stir after heat is off.", icon:"⏱️" },
              ].map(({ n, title, detail, icon }) => (
                <div key={n} className="flex gap-4 bg-purple-50 rounded-2xl p-4 border border-purple-100">
                  <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">{n}</div>
                  <div><p className="font-black text-gray-900">{icon} {title}</p><p className="text-gray-600 text-sm mt-0.5">{detail}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Category-by-Category Breakdown</h2>
            {[
              {
                title:"🍕 Pizza & Savory Sauces",
                color:"bg-red-50 border-red-200",
                tip:"Infuse the oil or butter used in the sauce, not the dough. The sauce coats every slice evenly.",
                recipes:[{ name:"Infused Pizza Sauce", path:"/recipes/infused-pizza-sauce" },{ name:"Cannabis Alfredo", path:"/ingredients?category=savory-meals&recipe=alfredo" }],
                best:"Cannabis olive oil",
                add:"Stir into finished sauce off heat — high heat degrades THC",
              },
              {
                title:"🍗 Wings & Proteins",
                color:"bg-orange-50 border-orange-200",
                tip:"The sauce is the infusion vehicle. Cook wings normally — apply infused sauce at the end so THC isn't exposed to high heat.",
                recipes:[{ name:"20 Infused Wing Sauces", path:"/wings" },{ name:"Classic Buffalo Wings", path:"/ingredients?category=wings&recipe=classic-buffalo-wings" }],
                best:"Cannabutter",
                add:"Melt into sauce off heat, toss wings right before serving",
              },
              {
                title:"🍟 Fries & Finger Foods",
                color:"bg-yellow-50 border-yellow-200",
                tip:"Always add infused fat to finished fries — not to the cooking fat. This gives you precise control over dose.",
                recipes:[{ name:"20 Infused Fries Styles", path:"/fries" },{ name:"Garlic Butter Fries", path:"/ingredients?category=fries&recipe=garlic-butter-fries" }],
                best:"Cannabutter or cannabis olive oil",
                add:"Drizzle or toss after cooking, while still hot",
              },
              {
                title:"☕ Drinks & Coffee",
                color:"bg-amber-50 border-amber-200",
                tip:"Oil and water don't mix — always blend fat-based infusions, or use tincture for any drink that's just poured.",
                recipes:[{ name:"20 Infused Coffee Drinks", path:"/coffee" },{ name:"Bulletproof THC Coffee", path:"/ingredients?category=drinks&recipe=bulletproof-coffee" }],
                best:"Cannabutter (blended) or THC tincture",
                add:"Blend for fat-based, stir drops for tincture",
              },
            ].map(({ title, color, tip, recipes, best, add }) => (
              <div key={title} className={`rounded-2xl border-2 p-5 ${color}`}>
                <h3 className="text-lg font-black text-gray-900 mb-3">{title}</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-3">
                  <div><p className="text-xs font-bold text-gray-500 uppercase mb-1">Best infusion</p><p className="font-bold text-gray-900 text-sm">{best}</p></div>
                  <div><p className="text-xs font-bold text-gray-500 uppercase mb-1">When to add</p><p className="font-bold text-gray-900 text-sm">{add}</p></div>
                  <div><p className="text-xs font-bold text-gray-500 uppercase mb-1">Try these</p>{recipes.map(r => <Link key={r.path} to={r.path} className="block text-green-700 font-bold text-xs hover:underline">{r.name} →</Link>)}</div>
                </div>
                <p className="text-sm text-gray-600 bg-white/50 rounded-xl p-3">💡 {tip}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What NOT to Infuse (Common Mistakes)</h2>
            <div className="space-y-3">
              {[
                { mistake:"Cooking at high heat with infused fats", why:"THC starts to degrade above 350°F. Use infused fats for finishing, not high-heat cooking." },
                { mistake:"Adding oil drops directly to plain water or juice", why:"Oil and water don't mix. Your dose will pool and be uneven. Use tincture for water-based drinks, or blend with fat." },
                { mistake:"Infusing the entire batch at maximum strength", why:"Start conservative. You can always use more next time — you can't dilute a finished batch." },
                { mistake:"Skipping the THC calculation", why:"Taste alone doesn't tell you anything about potency. Calculate before you eat." },
              ].map(({ mistake, why }) => (
                <div key={mistake} className="flex gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <span className="text-red-500 font-black flex-shrink-0">✗</span>
                  <div><p className="font-black text-gray-900">{mistake}</p><p className="text-gray-600 text-sm">{why}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-black text-gray-900 mb-2">Use the Recipe Builder</h3>
            <p className="text-gray-600 mb-4 text-sm">Load any recipe into the builder, swap in your infused fat, and get exact THC per serving before you cook.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/ingredients"><button className="bg-purple-600 hover:bg-purple-700 text-white font-black px-6 py-3 rounded-xl transition-colors flex items-center gap-2">Open Recipe Builder <ArrowRight className="w-4 h-4" /></button></Link>
              <Link to="/thc-calculator"><button className="border-2 border-purple-600 text-purple-700 hover:bg-purple-50 font-black px-6 py-3 rounded-xl transition-colors">THC Calculator</button></Link>
            </div>
          </div>

        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader><CardTitle className="text-lg">Explore by Food Type</CardTitle></CardHeader>
        <CardContent><div className="grid md:grid-cols-2 gap-3">
          {[
            { title:"🍗 20 Infused Wing Sauces", path:"/wings" },
            { title:"🍟 20 Infused Fries Styles", path:"/fries" },
            { title:"☕ 20 Infused Coffee Drinks", path:"/coffee" },
            { title:"🍿 Infused Popcorn", path:"/popcorn" },
          ].map(a => (
            <Link key={a.path} to={a.path} className="flex items-center justify-between p-3 rounded-xl hover:bg-purple-50 transition-colors group border border-gray-100">
              <span className="text-gray-700 group-hover:text-purple-700 font-medium">{a.title}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
            </Link>
          ))}
        </div></CardContent>
      </Card>
    </div>
  );
}
