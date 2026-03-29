import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export function EdiblePotencyGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <Helmet>
        <title>How to Calculate Edible Potency (MG Per Serving Explained)</title>
        <meta name="description" content="Learn exactly how to calculate THC mg per serving in homemade edibles. Simple formula, real examples, and common mistakes to avoid. Stop making edibles too strong or too weak." />
        <link rel="canonical" href="https://infusionsensei.com/edible-potency-guide" />
      </Helmet>

      <div className="bg-gradient-to-br from-purple-700 to-purple-900 rounded-3xl p-8 md:p-12 text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">How to Calculate Edible Potency<br/><span className="text-purple-200">(MG Per Serving Explained)</span></h1>
        <p className="text-purple-100 text-lg max-w-2xl mb-6">If you've ever made edibles too strong — or too weak — this guide fixes that. The math is simpler than you think.</p>
        <Link to="/edibles-calculator"><Button className="bg-white text-purple-800 hover:bg-purple-50 font-black px-8 py-3">Skip to the Calculator <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </div>

      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">The Simple Formula</h2>
            <p className="text-gray-600 mb-4">Every edible potency calculation uses the same basic formula. Here it is in plain English:</p>
            <div className="bg-gray-950 rounded-2xl p-6 text-center font-mono">
              <p className="text-green-400 text-sm uppercase tracking-widest mb-3">THC Per Serving Formula</p>
              <p className="text-white text-xl font-black">(THC% ÷ 100) × grams × 1000</p>
              <p className="text-gray-400 mt-2">× infusion efficiency</p>
              <p className="text-gray-400">÷ number of servings</p>
              <p className="text-green-400 font-black text-2xl mt-3">= mg THC per serving</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Real Example — Step by Step</h2>
            <p className="text-gray-600 mb-4">Let's calculate the potency of a batch of 16 brownies made with 7 grams of 20% THC flower:</p>
            <div className="space-y-3">
              {[
                { n:"1", title:"Find your total THC in milligrams", calc:"7g × 20% × 1000 = 1,400mg total THC in your flower", note:"" },
                { n:"2", title:"Apply infusion efficiency", calc:"1,400mg × 70% efficiency = 980mg absorbed into butter", note:"Butter/oil absorbs roughly 60–80% of available THC during infusion" },
                { n:"3", title:"Divide by servings", calc:"980mg ÷ 16 brownies = 61.25mg per brownie", note:"" },
                { n:"4", title:"Compare to dosing targets", calc:"61mg = Very High dose (most people want 5–15mg)", note:"You'd need to cut each brownie into 4–6 pieces for a normal dose" },
              ].map(({ n, title, calc, note }) => (
                <div key={n} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 mt-0.5">{n}</span>
                    <div>
                      <p className="font-black text-gray-900">{title}</p>
                      <p className="text-green-700 font-mono text-sm mt-1 bg-green-50 px-3 py-1.5 rounded-lg inline-block">{calc}</p>
                      {note && <p className="text-gray-500 text-sm mt-1">{note}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Common Mistakes That Make Edibles Too Strong</h2>
            <div className="space-y-3">
              {[
                { mistake:"Assuming 100% efficiency", fix:"Real infusions absorb 60–80% of THC. Always apply an efficiency factor." },
                { mistake:"Not decarboxylating first", fix:"Raw cannabis has THCA, not THC. Decarbing converts it. Skip this step and your edibles won't work at all." },
                { mistake:"Uneven mixing", fix:"If your butter or oil isn't evenly distributed, some pieces will be much stronger than others. Always mix thoroughly." },
                { mistake:"Overestimating THC %", fix:"Lab-tested flower varies. The number on the package is often optimistic. Use a conservative estimate." },
                { mistake:"Eating more because you don't feel it yet", fix:"Edibles take 30–120 minutes. The most common mistake is doubling up too soon." },
              ].map(({ mistake, fix }) => (
                <div key={mistake} className="flex gap-3 items-start bg-red-50 border border-red-100 rounded-2xl p-4">
                  <span className="text-red-500 flex-shrink-0 mt-0.5 font-black">✗</span>
                  <div>
                    <p className="font-black text-gray-900">{mistake}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">What Affects Infusion Efficiency?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { factor:"Decarboxylation temperature", impact:"Too hot = THC degrades. Too cool = incomplete conversion. 240°F for 40 min is the sweet spot." },
                { factor:"Infusion fat", impact:"Coconut oil absorbs more THC than butter due to higher saturated fat content (~90% vs ~65%)." },
                { factor:"Infusion time", impact:"Longer isn't always better. 2–4 hours at low heat is ideal. Beyond that, THC can degrade." },
                { factor:"Temperature during infusion", impact:"Keep below 200°F (93°C). High heat destroys THC and burns your infusion." },
              ].map(({ factor, impact }) => (
                <div key={factor} className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <p className="font-black text-gray-900 text-sm">{factor}</p>
                  <p className="text-gray-600 text-sm mt-1">{impact}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-black text-gray-900 mb-2">Use the Calculator Instead</h2>
            <p className="text-gray-600 mb-4">Skip the math — our free THC calculator does all of this automatically for any recipe.</p>
            <Link to="/edibles-calculator"><Button className="bg-green-600 hover:bg-green-700 text-white font-black px-8 py-3">Open THC Calculator <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title:"THC Calculator", desc:"Calculate exact mg per serving", to:"/edibles-calculator", emoji:"🧮" },
          { title:"Cannabis Recipes", desc:"Recipes with exact dosing", to:"/recipes", emoji:"🍪" },
          { title:"My Infusions", desc:"Build cannabutter & oils", to:"/infusions", emoji:"🧈" },
        ].map(({ title, desc, to, emoji }) => (
          <Link key={title} to={to} className="bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-400 p-5 transition-all hover:shadow-md group">
            <div className="text-3xl mb-2">{emoji}</div>
            <h3 className="font-black text-gray-900 group-hover:text-purple-700">{title}</h3>
            <p className="text-gray-500 text-sm mt-1">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
