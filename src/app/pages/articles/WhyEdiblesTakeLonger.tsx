import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Wind, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function WhyEdiblesTakeLonger() {
  const relatedArticles = [
    { title: "How Long Edibles REALLY Take to Kick In", path: "/learn/articles/how-long-edibles-take" },
    { title: "Why Edibles Hit Too Hard", path: "/learn/articles/why-edibles-hit-too-hard" },
    { title: "Why Edibles Aren't Working", path: "/learn/articles/why-edibles-dont-work" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>Why Edibles Take Longer Than Smoking — The Biology | Infusion Sensei</title>
        <meta name="description" content="Lungs vs liver, delta-9 THC vs 11-hydroxy-THC. The complete biological explanation of why eating cannabis works differently than inhaling it." />
        <meta property="og:title" content="Why Edibles Take Longer Than Smoking — The Biology | Infusion Sensei" />
        <meta property="og:description" content="Lungs vs liver, delta-9 THC vs 11-hydroxy-THC. The complete biological explanation of why eating cannabis works differently than inhaling it." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/why-edibles-take-longer" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Why Edibles Take Longer Than Smoking</span>
      </div>
      <Card className="bg-white border-teal-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-teal-600 text-white mb-3">Biology • 6 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">Why Edibles Take Longer Than Smoking (The Biological Reason)</CardTitle>
              <p className="text-lg text-gray-600">Inhaling cannabis hits in 2–5 minutes. Eating it takes an hour or more. The difference isn't mystery — it's basic biology. Understanding the two pathways changes how you use edibles forever.</p>
            </div>
            <Wind className="w-12 h-12 text-teal-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-5">
              <h3 className="font-bold text-blue-900 text-lg mb-3">💨 Inhaled THC</h3>
              <div className="space-y-2 text-sm text-blue-800">
                {[
                  "THC enters lungs as vapor/smoke",
                  "Absorbed directly through alveoli into bloodstream",
                  "Bypasses the liver entirely on first pass",
                  "Reaches brain in 2–5 minutes",
                  "Peak effect: 10–30 minutes",
                  "Duration: 1–3 hours",
                  "Compound: stays as Δ9-THC",
                ].map((s, i) => <p key={i} className="flex items-start gap-2"><span className="text-blue-500 font-bold">→</span>{s}</p>)}
              </div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 rounded-xl p-5">
              <h3 className="font-bold text-green-900 text-lg mb-3">🍫 Edible THC</h3>
              <div className="space-y-2 text-sm text-green-800">
                {[
                  "THC enters stomach with food",
                  "Digested, absorbed through small intestine",
                  "Travels via portal vein to liver",
                  "Liver converts Δ9-THC → 11-hydroxy-THC",
                  "Reaches brain in 45–120 minutes",
                  "Peak effect: 1–3 hours",
                  "Duration: 4–8 hours",
                ].map((s, i) => <p key={i} className="flex items-start gap-2"><span className="text-green-500 font-bold">→</span>{s}</p>)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">The Liver Is the Key Difference</h2>
            <p>When you inhale cannabis, THC takes a shortcut — straight from your lungs into your bloodstream, bypassing the liver entirely on its first pass. It arrives at your brain as the same compound it started as: Δ9-THC.</p>
            <p>When you eat cannabis, there's no shortcut. The THC has to survive stomach acid, get absorbed through your intestinal wall, travel through the portal vein to the liver, and only then enter general circulation. But here's the critical part: the liver doesn't just pass it through — it metabolizes it.</p>
            <div className="bg-teal-50 border-2 border-teal-300 rounded-xl p-5">
              <h3 className="font-bold text-teal-900 mb-2">The 11-Hydroxy-THC Factor</h3>
              <p className="text-teal-800 text-sm leading-relaxed">Your liver converts a significant portion of Δ9-THC into <strong>11-hydroxy-THC</strong>. This metabolite is more potent, more lipid-soluble, and crosses the blood-brain barrier more efficiently than inhaled THC. This is why the same mg of THC eaten feels stronger and lasts longer than the same mg inhaled. You're literally getting a different compound — one your body made inside you.</p>
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


          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The Full Journey: Mouth to Brain</h2>
            <div className="space-y-3">
              {[
                { step: "Mouth & Stomach", time: "0–15 min", desc: "THC is fat-soluble and doesn't dissolve in stomach acid easily. It binds to fats in your food and waits to reach the small intestine." },
                { step: "Small Intestine", time: "15–45 min", desc: "This is where absorption actually happens. THC is absorbed through the intestinal wall alongside dietary fats via chylomicrons — specialized fat-transport particles." },
                { step: "Portal Vein → Liver", time: "45–60 min", desc: "Absorbed THC travels through the portal vein directly to the liver — the body's main metabolic processing center — before entering general circulation." },
                { step: "Liver Conversion", time: "60–90 min", desc: "The liver's cytochrome P450 enzymes (specifically CYP2C9 and CYP3A4) convert Δ9-THC into 11-hydroxy-THC and other metabolites. This first-pass metabolism is what makes edibles feel different from smoked cannabis." },
                { step: "General Circulation → Brain", time: "90–120 min", desc: "11-hydroxy-THC and remaining Δ9-THC finally enter general circulation and cross the blood-brain barrier. You start feeling the effects. Peak effects typically come 30–60 minutes after initial onset." },
              ].map(({ step, time, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="flex-shrink-0 text-right">
                    <div className="font-bold text-teal-700 text-sm">{step}</div>
                    <div className="text-xs text-gray-400 font-mono">{time}</div>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-teal-500 mt-1"></div>
                    <div className="w-0.5 flex-1 bg-teal-200 my-1"></div>
                  </div>
                  <p className="text-sm text-gray-700 pb-3">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-1">🕐 The Practical Takeaway</p>
            <p className="text-teal-100 text-sm">Your tolerance to smoked cannabis tells you almost nothing about your edible tolerance. Treat them as separate experiences with separate dose limits. Always start at 5mg and wait the full 2 hours.</p>
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
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-teal-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-teal-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-teal-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
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
