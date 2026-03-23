import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Settings, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function FixTooStrongEdibles() {
  const relatedArticles = [
    { title: "Why Edibles Hit Too Hard", path: "/learn/articles/why-edibles-hit-too-hard" },
    { title: "How to Calculate THC Per Serving", path: "/learn/articles/thc-per-serving-calculator" },
    { title: "How to Dose THC Edibles Correctly", path: "/learn/articles/dosing-guide" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>How to Fix Edibles That Are Too Strong | Infusion Sensei</title>
        <meta name="description" content="Dilution math, rebatching, and portioning — how to salvage any overpotent cannabis edible batch and prevent it next time." />
        <meta property="og:title" content="How to Fix Edibles That Are Too Strong | Infusion Sensei" />
        <meta property="og:description" content="Dilution math, rebatching, and portioning — how to salvage any overpotent cannabis edible batch and prevent it next time." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/fix-too-strong-edibles" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Fix Too-Strong Edibles</span>
      </div>
      <Card className="bg-white border-pink-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-pink-600 text-white mb-3">Problem Solving • 7 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">How to Fix Edibles That Are Too Strong</CardTitle>
              <p className="text-lg text-gray-600">Made a batch that's way too potent? Don't throw it out. There are several reliable ways to dilute, rebatch, or repurpose overly strong edibles — and prevent it from happening next time.</p>
            </div>
            <Settings className="w-12 h-12 text-pink-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-5">
            <p className="font-bold text-pink-900 mb-2">First: Do the Math</p>
            <p className="text-pink-800 text-sm">Before fixing anything, calculate what you actually have. If you know your total batch THC, divide by your desired dose to find out how many pieces you need to cut it into. A batch with 800mg total THC at 10mg/serving = 80 pieces. If you only cut 16, each one has 50mg.</p>
          </div>

          <Separator />

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Method 1: Portion Control (Simplest Fix)</h2>
            <p>If your brownies came out at 50mg each when you wanted 10mg, the simplest fix requires no rebaking:</p>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 font-mono text-sm space-y-2">
              <p><span className="text-pink-600 font-bold">Total THC in batch:</span> 800mg</p>
              <p><span className="text-pink-600 font-bold">Desired dose:</span> 10mg per serving</p>
              <p><span className="text-pink-600 font-bold">Servings needed:</span> 800 ÷ 10 = <strong>80 pieces</strong></p>
              <p><span className="text-pink-600 font-bold">Cut each brownie into:</span> 5 pieces (if you made 16 brownies)</p>
            </div>
            <p className="text-sm text-gray-600">Use a ruler and a sharp knife. Label each small piece clearly and store in an airtight container with a THC warning label.</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Method 2: Dilution (Rebatch Into More Food)</h2>
            <p>If your infused butter or oil is too potent, dilute it by mixing it with uninfused butter/oil before using it in any recipe:</p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-3">
              <p className="font-bold text-blue-900">Dilution Formula</p>
              <div className="font-mono text-sm space-y-1 text-blue-800">
                <p>Current potency: 20mg THC per tbsp</p>
                <p>Target potency: 5mg THC per tbsp</p>
                <p>Ratio needed: 1 part infused : 3 parts regular butter</p>
                <p className="pt-2 font-bold">Mix 1 cup infused butter + 3 cups regular butter = 4 cups at 5mg/tbsp</p>
              </div>
            </div>
            <p className="text-sm">This works best with liquid infusions (oils, tinctures) that mix easily. For solid butter, melt both together, mix thoroughly, re-solidify, then re-weigh and label.</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Method 3: Rebatch Into More Servings</h2>
            <p>If you've already baked the edibles, you can rebatch by crumbling them and incorporating them into a larger recipe:</p>
            <div className="space-y-3">
              {[
                { title: "Brownie crumble into ice cream", desc: "Crumble overly potent brownies into small pieces and fold into a larger batch of ice cream base. The THC distributes through more volume, reducing mg per serving." },
                { title: "Cookie crumble into a crust", desc: "Too-strong cookies can be crumbled into a cheesecake or pie crust base alongside plain graham crackers. The ratio of infused to uninfused material dilutes the dose." },
                { title: "Infused oil into salad dressing", desc: "Overly potent infused olive oil can be stretched into a large batch of salad dressing with regular olive oil, vinegar, and seasonings." },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 mb-1">🔄 {title}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Prevention: Getting It Right Next Time</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { tip: "Calculate before you bake", desc: "Use Infusion Sensei to calculate exact mg per serving before the recipe is made. Adjust cannabis amount to hit your target dose." },
                { tip: "Start with less cannabis", desc: "For a new strain or batch, use 50–75% of your usual amount. You can always make it stronger — you can't undo too-strong." },
                { tip: "Test one serving first", desc: "Always test a single serving and wait the full 2 hours before eating more or serving to others." },
                { tip: "Label everything", desc: "Every infused product should have a label showing mg per serving, total THC, date made, and strain. No unlabeled edibles ever." },
              ].map(({ tip, desc }) => (
                <div key={tip} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="font-semibold text-gray-900 mb-1">✅ {tip}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-2">🧮 Fix It With Math First</p>
            <p className="text-pink-100 mb-4 text-sm">Enter your batch details into Infusion Sensei to find out exactly how to portion or dilute your current batch to reach the right dose.</p>
            <Link to="/infusions" className="inline-flex items-center gap-2 bg-white text-pink-700 font-semibold px-4 py-2 rounded-lg hover:bg-pink-50 transition-colors text-sm">
              Open Calculator <ArrowRight className="w-4 h-4" />
            </Link>
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
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-pink-200 rounded-lg hover:border-pink-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-pink-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-pink-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
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
