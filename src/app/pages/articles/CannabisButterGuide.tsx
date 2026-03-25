import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { ChefHat, ArrowRight, AlertTriangle, CheckCircle, Clock, FlaskConical } from "lucide-react";

export function CannabisButterGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>The Perfect Cannabutter Guide – Step-by-Step, No Guesswork | Infusion Sensei</title>
        <meta name="description" content="The complete cannabutter guide — exact ratios, step-by-step process, common mistakes, storage, and how to calculate exact THC per serving. Make cannabutter that actually works." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/cannabutter-guide" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Cannabutter Guide</span>
      </div>
      <Card className="bg-white border-yellow-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-yellow-600 text-white mb-3">Essential Guide</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">The Perfect Cannabutter Guide</CardTitle>
              <p className="text-lg text-gray-600">Exact ratios, step-by-step process, and no guesswork. This is the foundation of almost every cannabis edible recipe — get it right once and every recipe gets easier.</p>
            </div>
            <ChefHat className="w-14 h-14 text-yellow-600 flex-shrink-0 ml-4 mt-1" />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Ratio", value: "1:1", sub: "1 cup butter : 1 cup water", color: "bg-yellow-50 border-yellow-200" },
              { label: "Temp", value: "160–180°F", sub: "Never boiling", color: "bg-green-50 border-green-200" },
              { label: "Time", value: "2–4 hours", sub: "Low and slow", color: "bg-blue-50 border-blue-200" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className={`rounded-xl border-2 p-3 text-center ${color}`}>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
                <p className="font-black text-gray-900 text-base leading-tight">{value}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-10">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What Is Cannabutter and Why Does It Work?</h2>
            <p className="text-gray-700 leading-relaxed">Cannabutter is butter infused with cannabis. It's the foundation of most edible recipes — brownies, cookies, sauces, pasta, and more — because <strong>THC is fat-soluble</strong>. It doesn't dissolve in water, but it binds readily to fat molecules like those in butter.</p>
            <p className="text-gray-700 leading-relaxed">When you eat a fat-based edible, your body absorbs the THC through your digestive system. Your liver then converts it into 11-hydroxy-THC — a more potent form that hits harder and lasts longer than inhaled cannabis. This is why edibles feel different from smoking, and why dosing matters so much.</p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm"><strong>Before you start:</strong> You must decarb your cannabis first. Raw flower contains THCA, not active THC. See our <Link to="/learn/articles/decarboxylation-guide" className="underline font-semibold">Decarboxylation Guide</Link> if you haven't done this step yet.</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Exact Ratios (No Guessing)</h2>
            <p className="text-gray-700">The standard starting ratio for most home cooks:</p>
            <div className="bg-gray-950 rounded-2xl p-6 font-mono text-center">
              <p className="text-green-400 text-xs uppercase tracking-widest mb-3">Standard Cannabutter Ratio</p>
              <p className="text-white text-xl font-black">1 cup butter : 7–10g cannabis : 1 cup water</p>
              <p className="text-gray-400 text-sm mt-2">Water prevents burning and is strained out at the end</p>
            </div>
            <div className="space-y-3">
              {[
                { strength: "Mild (beginner)", ratio: "3–5g per cup of butter", dose: "~3–8mg THC per tbsp at 20% flower" },
                { strength: "Medium (standard)", ratio: "7–10g per cup of butter", dose: "~10–20mg THC per tbsp at 20% flower" },
                { strength: "Strong (experienced)", ratio: "14g per cup of butter", dose: "~25–40mg THC per tbsp at 20% flower" },
              ].map(({ strength, ratio, dose }) => (
                <div key={strength} className="flex gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex-1">
                    <p className="font-black text-gray-900">{strength}</p>
                    <p className="text-sm text-gray-600">{ratio}</p>
                  </div>
                  <p className="text-xs text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full self-center">{dose}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm">These are estimates — actual potency depends on your flower's THC%, decarb efficiency, and infusion time. Use our <Link to="/thc-calculator" className="text-green-700 font-semibold underline">THC Calculator</Link> for exact numbers.</p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Step-by-Step Cannabutter Process</h2>
            <div className="space-y-3">
              {[
                { n:"1", title:"Decarb your cannabis first", detail:"240°F for 30–40 minutes. This activates THCA into THC. Don't skip this.", icon:"🌿" },
                { n:"2", title:"Melt butter with water", detail:"Add 1 cup unsalted butter and 1 cup water to a saucepan over low heat. The water prevents burning.", icon:"🧈" },
                { n:"3", title:"Add decarbed cannabis", detail:"Once butter is melted, add your ground cannabis. Stir to combine.", icon:"🌱" },
                { n:"4", title:"Simmer low and slow", detail:"Keep temperature between 160–180°F for 2–4 hours. Never let it boil — boiling destroys THC. Stir occasionally.", icon:"⏱️" },
                { n:"5", title:"Strain through cheesecloth", detail:"Pour through a cheesecloth-lined strainer into a glass container. Squeeze gently — don't force it.", icon:"🫙" },
                { n:"6", title:"Refrigerate and separate", detail:"Cool in the fridge for 1–2 hours. The butter solidifies on top; water sinks below. Remove the butter disc.", icon:"❄️" },
                { n:"7", title:"Label and store", detail:"Always label with approximate THC per tbsp. Store in fridge (3 weeks) or freezer (6 months).", icon:"🏷️" },
              ].map(({ n, title, detail, icon }) => (
                <div key={n} className="flex gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">{n}</div>
                  <div><p className="font-black text-gray-900">{icon} {title}</p><p className="text-gray-600 text-sm mt-0.5">{detail}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Common Mistakes (And How to Fix Them)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { mistake:"Too weak", reason:"Skipped decarbing, temp too low, or not enough cannabis", fix:"Always decarb first. Check temp with thermometer." },
                { mistake:"Too strong", reason:"Too much cannabis, serving size too large", fix:"Start with 5g per cup. Test one small piece first." },
                { mistake:"Burned taste", reason:"Temperature too high — over 200°F damages THC and burns butter", fix:"Use a thermometer. Stay under 185°F." },
                { mistake:"Greasy texture", reason:"Too much butter, not strained properly", fix:"Use the water method and strain thoroughly." },
              ].map(({ mistake, reason, fix }) => (
                <div key={mistake} className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="font-black text-red-800 mb-1">❌ {mistake}</p>
                  <p className="text-xs text-gray-500 mb-1"><strong>Why:</strong> {reason}</p>
                  <p className="text-xs text-green-700"><strong>Fix:</strong> {fix}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">How to Use Cannabutter in Recipes</h2>
            <p className="text-gray-700">Cannabutter is a 1:1 replacement for regular butter in almost any recipe. Just swap it in:</p>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { use:"Baked goods", examples:"Brownies, cookies, cakes, muffins", link:"/recipes" },
                { use:"Savory dishes", examples:"Pasta sauce, garlic bread, steak baste, sauces", link:"/wings" },
                { use:"Breakfast", examples:"Pancakes, French toast, scrambled eggs", link:"/ingredients?category=breads-breakfast" },
              ].map(({ use, examples, link }) => (
                <Link key={use} to={link} className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 hover:border-yellow-400 transition-all group">
                  <p className="font-black text-gray-900 group-hover:text-yellow-700">{use}</p>
                  <p className="text-xs text-gray-500 mt-1">{examples}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <FlaskConical className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-black text-gray-900 mb-2">Calculate Your Exact Potency</h3>
            <p className="text-gray-600 mb-4 text-sm">Enter your flower's THC% and batch size — get exact mg per tablespoon instantly.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/thc-calculator"><button className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-3 rounded-xl transition-colors flex items-center gap-2">Calculate Potency <ArrowRight className="w-4 h-4" /></button></Link>
              <Link to="/infusions"><button className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-black px-6 py-3 rounded-xl transition-colors">Build My Infusion</button></Link>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q:"Can I use salted butter?", a:"Yes, but unsalted is preferred. Salt doesn't affect potency but can impact flavor in sweet recipes." },
                { q:"Why add water during infusion?", a:"Water acts as a heat buffer — it prevents the butter from exceeding 212°F and burning. It separates out completely when you refrigerate the mixture." },
                { q:"How long does cannabutter last?", a:"In the fridge: up to 3 weeks. In the freezer: up to 6 months. Always store airtight and labeled." },
                { q:"Can I make cannabutter without a stovetop?", a:"Yes — a slow cooker on low works well. Some people also use a double boiler. Avoid the microwave — it's too inconsistent." },
                { q:"How do I know my cannabutter is strong enough?", a:"Test it by trying a small amount (1/4 tsp) on a piece of toast. Wait 2 hours for a proper gauge. Use our THC calculator for a mathematical estimate before testing." },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-gray-100 pb-4 last:border-0"><p className="font-black text-gray-900 mb-1">{q}</p><p className="text-gray-600 text-sm leading-relaxed">{a}</p></div>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader><CardTitle className="text-lg">Related Articles</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { title:"How to Decarb Cannabis", path:"/learn/articles/decarboxylation-guide" },
              { title:"How to Dose THC Edibles Correctly", path:"/learn/articles/dosing-guide" },
              { title:"Oil vs Butter vs Tincture: Which Should You Use?", path:"/learn/articles/infusion-comparison" },
            ].map(a => (
              <Link key={a.path} to={a.path} className="flex items-center justify-between p-3 rounded-xl hover:bg-yellow-50 transition-colors group">
                <span className="text-gray-700 group-hover:text-yellow-700 font-medium">{a.title}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-yellow-600" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
