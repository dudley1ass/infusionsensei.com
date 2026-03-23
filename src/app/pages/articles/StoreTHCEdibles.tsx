import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Package, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router";

export function StoreTHCEdibles() {
  const relatedArticles = [
    { title: "Why Your THC Butter Is Weak", path: "/learn/articles/why-thc-butter-is-weak" },
    { title: "How to Calculate THC Per Serving", path: "/learn/articles/thc-per-serving-calculator" },
    { title: "How to Dose THC Edibles Correctly", path: "/learn/articles/dosing-guide" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>How to Store THC Edibles Without Losing Potency | Infusion Sensei</title>
        <meta name="description" content="Light, heat, oxygen, and moisture degrade THC. Complete storage guide for cannabutter, baked edibles, gummies, tinctures, and capsules." />
        <meta property="og:title" content="How to Store THC Edibles Without Losing Potency | Infusion Sensei" />
        <meta property="og:description" content="Light, heat, oxygen, and moisture degrade THC. Complete storage guide for cannabutter, baked edibles, gummies, tinctures, and capsules." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/store-thc-edibles" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">How to Store THC Edibles</span>
      </div>
      <Card className="bg-white border-emerald-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-emerald-600 text-white mb-3">Practical • 6 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">How to Store THC Edibles Without Losing Potency</CardTitle>
              <p className="text-lg text-gray-600">Improper storage is one of the most underrated ways to lose THC potency. Light, heat, oxygen, and moisture all degrade cannabinoids. Here's exactly how to store everything to maximize shelf life and potency.</p>
            </div>
            <Package className="w-12 h-12 text-emerald-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h3 className="font-bold text-red-900 mb-3">❌ The 4 Enemies of THC</h3>
              <div className="space-y-2 text-sm">
                {[
                  { enemy: "UV Light", effect: "Breaks down THC molecules — the single fastest way to lose potency" },
                  { enemy: "Heat (above 77°F/25°C)", effect: "Accelerates oxidation and molecular breakdown" },
                  { enemy: "Oxygen", effect: "Oxidizes THC into CBN over time, reducing psychoactive effect" },
                  { enemy: "Moisture", effect: "Promotes mold growth and speeds chemical degradation" },
                ].map(({ enemy, effect }) => (
                  <div key={enemy} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold flex-shrink-0">✗</span>
                    <div><span className="font-semibold text-red-800">{enemy}:</span> <span className="text-red-700">{effect}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-bold text-green-900 mb-3">✅ The 4 Storage Principles</h3>
              <div className="space-y-2 text-sm">
                {["Cool (below 70°F/21°C)", "Dark (opaque or UV-blocking container)", "Dry (under 62% humidity)", "Airtight (minimal oxygen exposure)"].map(p => (
                  <div key={p} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-green-800">{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Mid-article CTA */}
          <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 no-print">
            <div className="flex-1">
              <p className="font-black text-green-900 text-lg">🧮 Calculate Your Exact THC Per Serving</p>
              <p className="text-green-700 text-sm mt-0.5">Enter your strain and recipe — get precise mg per serving in under 60 seconds.</p>
            </div>
            <Link to="/infusions" className="flex-shrink-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap">
              Try It Free →
            </Link>
          </div>


          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">Storage Guide by Product Type</h2>
            {[
              { type: "Cannabutter & Infused Oils", shelf: "2 weeks (counter)", fridge: "2 months (fridge)", freezer: "6–12 months (freezer)", tips: "Store in an airtight container. Label with date and mg/tbsp. For freezer storage, portion into ice cube trays first so you can thaw only what you need. Freeze in vacuum-sealed bags for longest life." },
              { type: "Baked Edibles (Brownies, Cookies)", shelf: "3–5 days (counter)", fridge: "2 weeks (fridge)", freezer: "3–6 months (freezer)", tips: "Wrap individually before storing — this prevents moisture transfer between pieces and keeps portions accurate. Use airtight containers with an oxygen absorber for long-term storage. Thaw at room temperature without unwrapping to prevent condensation." },
              { type: "Gummies & Candy", shelf: "1–2 weeks (counter)", fridge: "1 month (fridge)", freezer: "3–6 months", tips: "Humidity is the main enemy of gummies. Store with a food-safe silica desiccant packet. Avoid the fridge if your gummies contain gelatin — condensation when removing from fridge can cause sticking." },
              { type: "Tinctures", shelf: "6–12 months (dark cabinet)", fridge: "N/A", freezer: "N/A", tips: "Alcohol-based tinctures are the most shelf-stable edible product. Store in amber glass dropper bottles away from light. Glycerin-based tinctures last about 12 months. Never store in plastic — THC leaches into plastic over time." },
              { type: "THC Capsules", shelf: "6+ months", fridge: "N/A", freezer: "N/A", tips: "Most stable form of edible. Store in a cool, dry place in the original opaque container. Heat can soften gel caps — keep below 77°F." },
            ].map(({ type, shelf, fridge, freezer, tips }) => (
              <div key={type} className="bg-white border border-emerald-200 rounded-xl overflow-hidden">
                <div className="bg-emerald-50 px-5 py-3">
                  <h3 className="font-bold text-emerald-900">{type}</h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  <div className="flex gap-4 text-sm">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1"><span className="font-semibold">Counter:</span> {shelf}</div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-1"><span className="font-semibold">Fridge:</span> {fridge}</div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg px-3 py-1"><span className="font-semibold">Freezer:</span> {freezer}</div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{tips}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5">
            <h3 className="font-bold text-amber-900 mb-2">⚠️ Always Label Your Edibles</h3>
            <p className="text-amber-800 text-sm">Every stored cannabis product must be labeled with: product name, date made, strain used, total THC (mg), THC per serving (mg), and a cannabis warning. Unlabeled edibles are a safety hazard — to you, to guests, and especially to children.</p>
          </div>
          {/* Internal CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white text-center">
            <p className="text-lg font-bold mb-1">🧮 Calculate Your Exact THC Per Serving</p>
            <p className="text-green-100 text-sm mb-4">Use Infusion Sensei's free THC dosage calculator — enter your strain, base type, and recipe to get precise mg per serving instantly.</p>
            <Link to="/infusions" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-5 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm">
              Build My Infusion — Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>


          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {relatedArticles.map(a => (
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-emerald-200 rounded-lg hover:border-emerald-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-emerald-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
