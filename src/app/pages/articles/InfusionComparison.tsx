import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Beaker, ArrowRight, CheckCircle } from "lucide-react";

export function InfusionComparison() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Best Base for Cannabis Infusion (Butter vs Oil vs Honey)</title>
        <meta name="description" content="Compare butter vs oil vs honey for cannabis infusion: potency, flavor, best uses, and which base works best for each recipe." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/infusion-comparison" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Infusion Comparison</span>
      </div>
      <Card className="bg-white border-orange-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-orange-600 text-white mb-3">Comparison Guide</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">Oil vs Butter vs Tincture: Which Should You Use?</CardTitle>
              <p className="text-lg text-gray-600">The infusion you choose affects flavor, potency, texture, and which recipes work. Here's the complete breakdown — plus a guide to which infusion fits which recipe.</p>
            </div>
            <Beaker className="w-14 h-14 text-orange-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-10">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Quick Comparison Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    {["Infusion","THC Absorption","Best For","Flavor Impact","Shelf Life"].map(h => (
                      <th key={h} className="text-left p-3 font-black text-gray-700 border-b border-gray-200">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["🧈 Cannabutter","High (65–80%)","Baked goods, savory","Rich, buttery","3 wks fridge / 6 mo freezer"],
                    ["💧 Cannabis Oil","Very High (80–90%)","Dairy-free, smoothies, stir-fry","Neutral to mild","6 months+"],
                    ["🧪 THC Tincture","Fast + precise","Drinks, gummies, microdosing","Minimal","1 year+"],
                    ["🤍 Infused Cream","High","Drinks, floats, sauces","Rich dairy","1 week"],
                    ["🍯 Cannabis Honey","Moderate","Tea, glazes, desserts","Sweet","6 months"],
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      {row.map((cell, j) => <td key={j} className="p-3 text-gray-700">{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                title:"🧈 Cannabutter — The Classic Choice",
                badge:"Best for baked goods",
                color:"bg-yellow-50 border-yellow-200",
                when:["You're making cookies, brownies, or cakes","Recipes that already call for butter","Savory dishes like pasta, garlic bread, or steak","You want rich flavor"],
                avoid:["Dairy-free or vegan recipes","High-heat cooking (butter burns easily)","Drinks — it doesn't mix well without blending"],
                tip:"Butter's milk solids and fat both bind THC well, giving high absorption. The water-based infusion method (adding water during cooking) prevents burning.",
                link:"/learn/articles/cannabutter-guide",
                linkText:"Full Cannabutter Guide →"
              },
              {
                title:"💧 Cannabis Coconut Oil — The Versatile Workhorse",
                badge:"Best overall absorption",
                color:"bg-green-50 border-green-200",
                when:["Dairy-free or vegan recipes","Smoothies and blended drinks","Stir-fries and high-heat cooking","Tropical flavors — popcorn, chocolate, curries"],
                avoid:["Recipes where coconut flavor is unwanted","Delicate flavors where any oil taste intrudes"],
                tip:"Coconut oil has the highest saturated fat content of any cooking oil (~90%), which means it absorbs more THC than butter. It also has a higher smoke point.",
                link:"/infusions",
                linkText:"Build Cannabis Oil →"
              },
              {
                title:"🧪 THC Tincture — The Precision Tool",
                badge:"Most precise dosing",
                color:"bg-purple-50 border-purple-200",
                when:["Drinks, lemonade, tea, cocktails","Gummies and hard candy","Microdosing — you need exact small doses","No-bake or no-cook recipes"],
                avoid:["High-heat cooking — alcohol evaporates and some THC may be lost","Recipes where you need fat for texture"],
                tip:"Tinctures are the easiest way to add THC to any liquid. Because they're alcohol-based, they mix into water-based drinks much better than oils.",
                link:"/infusions",
                linkText:"Build a Tincture →"
              },
            ].map(({ title, badge, color, when, avoid, tip, link, linkText }) => (
              <div key={title} className={`rounded-2xl border-2 p-6 ${color}`}>
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xl font-black text-gray-900">{title}</h3>
                  <span className="text-xs bg-white/60 border border-gray-200 text-gray-700 font-bold px-2 py-0.5 rounded-full">{badge}</span>
                </div>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Use when:</p>
                    {when.map(w => <div key={w} className="flex gap-2 text-sm text-gray-700 mb-1"><CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />{w}</div>)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-2">Avoid for:</p>
                    {avoid.map(a => <div key={a} className="flex gap-2 text-sm text-gray-700 mb-1"><span className="text-red-400 flex-shrink-0">✗</span>{a}</div>)}
                  </div>
                </div>
                <p className="text-sm text-gray-600 bg-white/50 rounded-xl p-3 mb-3">💡 {tip}</p>
                <Link to={link} className="text-sm font-bold text-green-700 hover:text-green-800">{linkText}</Link>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Which Infusion for Which Recipe?</h2>
            <div className="space-y-2">
              {[
                { recipe:"Brownies & cookies", best:"Cannabutter", why:"Butter is already in the recipe — seamless swap" },
                { recipe:"Wing sauces", best:"Cannabutter", why:"Fat carries flavor and infusion through sauce" },
                { recipe:"Pasta & garlic bread", best:"Cannabutter or Cannabis Olive Oil", why:"Match what the original recipe uses" },
                { recipe:"Smoothies", best:"Cannabis Coconut Oil", why:"Blends smooth, adds richness" },
                { recipe:"Bulletproof coffee", best:"Cannabutter + coconut oil", why:"Classic combination for maximum fat binding" },
                { recipe:"Gummies & candy", best:"THC Tincture", why:"Precise dosing, no fat texture issues" },
                { recipe:"Lemonade & tea", best:"THC Tincture", why:"Mixes into liquids without oil separation" },
                { recipe:"Popcorn", best:"Cannabis Coconut Oil or Cannabutter", why:"Either works — coconut adds slight tropical note" },
                { recipe:"Fries & sauces", best:"Cannabis Olive Oil or Cannabutter", why:"High fat content holds the infusion well" },
                { recipe:"Ice cream", best:"Cannabis Coconut Oil", why:"Stays smooth when frozen, doesn't crystallize" },
              ].map(({ recipe, best, why }) => (
                <div key={recipe} className="flex gap-3 items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <span className="text-gray-900 font-bold w-40 flex-shrink-0 text-sm">{recipe}</span>
                  <span className="text-green-700 font-black text-sm flex-1">{best}</span>
                  <span className="text-gray-500 text-xs hidden md:block">{why}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-black text-gray-900 mb-2">Build Your Infusion</h3>
            <p className="text-gray-600 mb-4 text-sm">Choose your base, set your potency, and calculate exact THC per serving for any recipe.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/infusions"><button className="bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3 rounded-xl transition-colors flex items-center gap-2">Start My Infusion <ArrowRight className="w-4 h-4" /></button></Link>
              <Link to="/edibles-calculator"><button className="border-2 border-orange-600 text-orange-700 font-black px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors">THC Calculator</button></Link>
            </div>
          </div>

        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader><CardTitle className="text-lg">Related Articles</CardTitle></CardHeader>
        <CardContent><div className="space-y-3">
          {[
            { title:"The Perfect Cannabutter Guide", path:"/learn/articles/cannabutter-guide" },
            { title:"How to Decarb Cannabis", path:"/learn/articles/decarboxylation-guide" },
            { title:"How Strong Will My Edibles Be?", path:"/learn/articles/edible-strength-guide" },
          ].map(a => (
            <Link key={a.path} to={a.path} className="flex items-center justify-between p-3 rounded-xl hover:bg-orange-50 transition-colors group">
              <span className="text-gray-700 group-hover:text-orange-700 font-medium">{a.title}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600" />
            </Link>
          ))}
        </div></CardContent>
      </Card>
    </div>
  );
}
