import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Sparkles, ArrowRight, AlertTriangle, CheckCircle, Clock } from "lucide-react";

export function BeginnerEdibleGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Beginner Edibles Guide: Dose, Timing, and Safety | Infusion Sensei</title>
        <meta name="description" content="New to edibles? Start with safe dose ranges, onset timing, and common mistakes to avoid for a better first experience." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/beginner-edible-guide" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Beginner's First Edible Guide</span>
      </div>
      <Card className="bg-white border-green-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-green-600 text-white mb-3">Start Here</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">The Complete Beginner's First Edible Guide</CardTitle>
              <p className="text-lg text-gray-600">Never made a cannabis edible before? This is where you start. Everything you need — what to buy, how to make it, how much to take, and what to expect — in one guide.</p>
            </div>
            <Sparkles className="w-14 h-14 text-green-600 flex-shrink-0 ml-4 mt-1" />
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
            <p className="font-black text-green-800 mb-2">📋 What you'll have after this guide:</p>
            <div className="grid md:grid-cols-2 gap-1">
              {["A batch of properly dosed edibles","Confidence in your process","Understanding of onset and duration","A system you can repeat"].map(item => (
                <div key={item} className="flex gap-2 text-sm text-green-700"><CheckCircle className="w-4 h-4 flex-shrink-0" />{item}</div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-10">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What You Need (Simple List)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="font-black text-gray-900 mb-3">🛒 Ingredients</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {["Cannabis flower (3–7g to start)","1 cup unsalted butter","Your recipe ingredients (brownies are easiest)"].map(item => <li key={item} className="flex gap-2"><span className="text-green-500">✓</span>{item}</li>)}
                </ul>
              </div>
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <p className="font-black text-gray-900 mb-3">🔧 Equipment</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  {["Baking sheet + parchment paper","Saucepan","Cheesecloth or fine mesh strainer","Oven thermometer (highly recommended)","Glass jar for storage"].map(item => <li key={item} className="flex gap-2"><span className="text-green-500">✓</span>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The 4-Step Process</h2>
            <div className="space-y-4">
              {[
                { step:"1", title:"Decarb (30–40 min)", color:"bg-yellow-50 border-yellow-200", content: <div className="space-y-2 text-sm text-gray-700"><p>Break cannabis into small pieces. Spread on parchment-lined baking sheet. Bake at <strong>240°F for 30–40 minutes</strong>. Let cool completely.</p><p className="text-gray-500">This activates THCA into THC. Skip this and your edibles won't work well.</p><Link to="/learn/articles/decarboxylation-guide" className="text-green-700 font-bold text-xs">Full Decarb Guide →</Link></div> },
                { step:"2", title:"Infuse (2–4 hours)", color:"bg-green-50 border-green-200", content: <div className="space-y-2 text-sm text-gray-700"><p>Melt 1 cup butter with 1 cup water in a saucepan. Add decarbed cannabis. Simmer at <strong>160–180°F for 2–4 hours</strong>. Strain through cheesecloth. Refrigerate until butter solidifies. Remove butter disc.</p><Link to="/learn/articles/cannabutter-guide" className="text-green-700 font-bold text-xs">Full Cannabutter Guide →</Link></div> },
                { step:"3", title:"Cook (use your recipe)", color:"bg-blue-50 border-blue-200", content: <div className="space-y-2 text-sm text-gray-700"><p>Use your cannabutter as a 1:1 replacement for regular butter in any recipe. Brownies are the easiest first recipe — hard to mess up, strong flavor masks cannabis taste.</p><Link to="/recipes" className="text-green-700 font-bold text-xs">Browse Recipes →</Link></div> },
                { step:"4", title:"Dose carefully", color:"bg-purple-50 border-purple-200", content: <div className="space-y-2 text-sm text-gray-700"><p>Calculate THC per serving first using our calculator. Start with <strong>2.5–5mg</strong>. Wait <strong>2 full hours</strong> before deciding you need more. Take notes on what worked.</p><Link to="/edibles-calculator" className="text-green-700 font-bold text-xs">Calculate My Dose →</Link></div> },
              ].map(({ step, title, color, content }) => (
                <div key={step} className={`rounded-2xl border-2 p-5 ${color}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">Step {step}</div>
                    <h3 className="font-black text-gray-900">{title}</h3>
                  </div>
                  {content}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">First Edible Recommendation</h2>
            <p className="text-gray-700">For your first edible, we recommend <strong>classic brownies</strong>. Here's why:</p>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                { reason:"Easy recipe", detail:"Hard to over- or under-bake. Forgiving for beginners." },
                { reason:"Strong flavor", detail:"Chocolate completely masks any cannabis taste." },
                { reason:"Easy to portion", detail:"16 pieces = easy to cut smaller if needed." },
              ].map(({ reason, detail }) => (
                <div key={reason} className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="font-black text-gray-900 text-sm">{reason}</p>
                  <p className="text-xs text-gray-500 mt-1">{detail}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link to="/ingredients?category=baked-goods&recipe=brownies">
                <button className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-3 rounded-xl transition-colors flex items-center gap-2 mx-auto">Open Brownie Recipe in Builder <ArrowRight className="w-4 h-4" /></button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What to Expect (Onset, Duration, Effects)</h2>
            <div className="space-y-3">
              {[
                { phase:"First 30 minutes", what:"Usually nothing — this is normal. Edibles absorb through digestion, not lungs.", color:"bg-gray-50 border-gray-200" },
                { phase:"30–90 minutes", what:"Onset begins. May feel mild relaxation, warmth, or a slight shift in perception. This is normal — don't eat more yet.", color:"bg-yellow-50 border-yellow-200" },
                { phase:"90–120 minutes", what:"Peak effects usually arrive. This is why you wait 2 hours before deciding to take more.", color:"bg-green-50 border-green-200" },
                { phase:"2–6 hours", what:"Effects last much longer than smoking. Don't make plans that require you to be sharp for several hours.", color:"bg-blue-50 border-blue-200" },
              ].map(({ phase, what, color }) => (
                <div key={phase} className={`flex gap-4 rounded-2xl border-2 px-5 py-4 ${color}`}>
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div><p className="font-black text-gray-900">{phase}</p><p className="text-sm text-gray-600">{what}</p></div>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-amber-800 mb-1">The #1 beginner mistake</p>
                <p className="text-amber-700 text-sm">"I took one and felt nothing after an hour, so I took two more." Then all three hit at once. Wait the full 2 hours. Always.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Safety Basics</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                { rule:"Start with 2.5–5mg", detail:"Always. Even if you've smoked before — edibles hit differently." },
                { rule:"Never drive", detail:"Edibles last 4–6 hours. Plan accordingly." },
                { rule:"Store safely", detail:"Label clearly. Keep away from children, pets, and guests who don't know." },
                { rule:"Don't mix with alcohol", detail:"Alcohol increases THC absorption significantly — can make effects much more intense." },
                { rule:"If you took too much", detail:"Stay calm, drink water, eat food, lie down. It will pass. You cannot overdose fatally on THC." },
                { rule:"Check local laws", detail:"Cannabis edibles are regulated differently in every state and country. Know yours." },
              ].map(({ rule, detail }) => (
                <div key={rule} className="flex gap-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div><p className="font-black text-gray-900 text-sm">{rule}</p><p className="text-xs text-gray-500">{detail}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <h3 className="text-xl font-black text-gray-900 mb-2">Ready to Calculate Your First Dose?</h3>
            <p className="text-gray-600 mb-4 text-sm">Enter your flower's THC% and batch size. Get exact milligrams per serving before you bake.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/edibles-calculator"><button className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-3 rounded-xl transition-colors flex items-center gap-2">Calculate My Dose <ArrowRight className="w-4 h-4" /></button></Link>
              <Link to="/infusions"><button className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-black px-6 py-3 rounded-xl transition-colors">Build My Infusion</button></Link>
            </div>
          </div>

        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader><CardTitle className="text-lg">Next Steps</CardTitle></CardHeader>
        <CardContent><div className="space-y-3">
          {[
            { title:"How to Decarb Cannabis", path:"/learn/articles/decarboxylation-guide" },
            { title:"The Perfect Cannabutter Guide", path:"/learn/articles/cannabutter-guide" },
            { title:"How to Dose THC Edibles Correctly", path:"/learn/articles/dosing-guide" },
          ].map(a => (
            <Link key={a.path} to={a.path} className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 transition-colors group">
              <span className="text-gray-700 group-hover:text-green-700 font-medium">{a.title}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
            </Link>
          ))}
        </div></CardContent>
      </Card>
    </div>
  );
}
