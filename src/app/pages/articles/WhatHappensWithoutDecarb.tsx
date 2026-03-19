import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { FlaskConical, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function WhatHappensWithoutDecarb() {
  const relatedArticles = [
    { title: "Why Your THC Butter Is Weak", path: "/learn/articles/why-thc-butter-is-weak" },
    { title: "Why Edibles Aren't Working", path: "/learn/articles/why-edibles-dont-work" },
    { title: "Beginner Cooking Guide", path: "/learn/articles/beginner-guide" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">What Happens Without Decarbing</span>
      </div>
      <Card className="bg-white border-violet-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-violet-600 text-white mb-3">Chemistry • 7 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">What Happens If You Skip Decarbing (The Beginner Trap)</CardTitle>
              <p className="text-lg text-gray-600">Raw cannabis does not get you high. This surprises a lot of people. Understanding why — and what decarboxylation actually does at a molecular level — is the foundation of effective cannabis cooking.</p>
            </div>
            <FlaskConical className="w-12 h-12 text-violet-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="bg-violet-50 border-2 border-violet-400 rounded-xl p-5">
            <p className="font-bold text-violet-900 text-lg mb-2">The Key Fact: THCA ≠ THC</p>
            <p className="text-violet-800">Raw, unheated cannabis contains <strong>THCA (tetrahydrocannabinolic acid)</strong> — not THC. THCA is a precursor molecule that does not bind to your CB1 receptors the way THC does. It is essentially non-psychoactive. The step of converting THCA to THC is called <strong>decarboxylation</strong> — and skipping it means your edibles will have little to no effect.</p>
          </div>

          <Separator />

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">The Chemistry: What Actually Happens</h2>
            <p>THCA has a carboxyl group (-COOH) attached to its molecular structure. This extra group is what prevents it from fitting into your CB1 receptors properly. When you apply heat, the carboxyl group breaks off as carbon dioxide (CO₂) and water vapor — leaving behind the smaller, more reactive THC molecule that fits your receptors perfectly.</p>

            <div className="bg-white border-2 border-violet-200 rounded-xl p-5 text-center space-y-2">
              <div className="font-mono text-sm bg-violet-50 rounded-lg p-3">
                <span className="text-violet-700 font-bold">THCA</span> + Heat (230–250°F) → <span className="text-green-700 font-bold">THC</span> + CO₂ + H₂O
              </div>
              <p className="text-xs text-gray-500">The molecule loses the carboxyl group and becomes psychoactive</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h3 className="font-bold text-red-900 mb-2">THCA (Before Decarb)</h3>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Non-psychoactive</li>
                  <li>• Does not bind well to CB1 receptors</li>
                  <li>• Has anti-inflammatory properties</li>
                  <li>• Found in raw, unheated cannabis</li>
                  <li>• Won't make you high when eaten</li>
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <h3 className="font-bold text-green-900 mb-2">THC (After Decarb)</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Psychoactive</li>
                  <li>• Binds directly to CB1 and CB2 receptors</li>
                  <li>• Produces euphoria, relaxation, pain relief</li>
                  <li>• Created by heat from THCA</li>
                  <li>• The compound you're cooking for</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What If You Skip It?</h2>
            <div className="space-y-3">
              {[
                { scenario: "You add raw ground cannabis to brownie batter", outcome: "Brownies will smell like cannabis and taste bitter, but have almost no psychoactive effect. The oven heat during baking (350°F) does partially decarb, but not completely or evenly." },
                { scenario: "You infuse butter without decarbing first", outcome: "The butter will extract chlorophyll and plant compounds, turning green and tasting very weedy. It will have minimal THC. Most of the THCA remains unconverted and unextracted since it doesn't bind well to fats." },
                { scenario: "You put raw cannabis in a slow cooker", outcome: "If the temperature reaches 220°F+ and runs for several hours, partial decarboxylation will occur. This is why some slow cooker methods work without a separate decarb step — but it's inconsistent and inefficient." },
              ].map(({ scenario, outcome }) => (
                <div key={scenario} className="bg-white border border-violet-200 rounded-xl p-4">
                  <p className="font-semibold text-violet-900 mb-2">Scenario: {scenario}</p>
                  <p className="text-sm text-gray-700"><strong>Result:</strong> {outcome}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The Perfect Decarb Method</h2>
            <div className="space-y-3">
              {[
                "Preheat oven to 230–240°F (110–115°C). Use an oven thermometer — oven dials are often inaccurate by 25–50°F.",
                "Grind cannabis coarsely (not too fine — fine grinds can burn faster and lose terpenes).",
                "Spread in a single even layer on a baking sheet.",
                "Cover tightly with foil to trap terpenes and prevent smell from escaping.",
                "Bake for 35–45 minutes. At 230°F, 45 min. At 240°F, 35 min.",
                "Remove and let cool completely (still covered) before using. It will look light brown and smell toasted/nutty.",
                "Your cannabis is now decarboxylated. THCA → THC conversion is ~80–90% complete.",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</div>
                  <p className="text-sm text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-5">
            <h3 className="font-bold text-amber-900 mb-2">⚠️ Temperature Matters</h3>
            <p className="text-amber-800 text-sm">Above 300°F, you start destroying THC (turning it into CBN) and evaporating terpenes. Below 220°F, conversion is incomplete and slow. The 230–240°F range is the sweet spot proven by laboratory analysis to maximize THC yield while preserving terpene content.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {relatedArticles.map(a => (
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-violet-200 rounded-lg hover:border-violet-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-violet-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-violet-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
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
