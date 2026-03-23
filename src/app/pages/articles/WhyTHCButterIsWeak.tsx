import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Thermometer, ArrowRight, XCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router";

export function WhyTHCButterIsWeak() {
  const relatedArticles = [
    { title: "Why Edibles Aren't Working", path: "/learn/articles/why-edibles-dont-work" },
    { title: "What Happens If You Skip Decarbing", path: "/learn/articles/what-happens-without-decarb" },
    { title: "How to Calculate THC Per Serving", path: "/learn/articles/thc-per-serving-calculator" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>Why Your THC Butter Isn't Strong (And How to Fix It) | Infusion Sensei</title>
        <meta name="description" content="Decarb failure, wrong temperature, short infusion time — the 5 reasons cannabutter is weak and exactly how to fix each one." />
        <meta property="og:title" content="Why Your THC Butter Isn't Strong (And How to Fix It) | Infusion Sensei" />
        <meta property="og:description" content="Decarb failure, wrong temperature, short infusion time — the 5 reasons cannabutter is weak and exactly how to fix each one." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/why-thc-butter-is-weak" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Why Your THC Butter Is Weak</span>
      </div>
      <Card className="bg-white border-yellow-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-yellow-600 text-white mb-3">Troubleshooting • 8 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">Why Your THC Butter Isn't Strong (And How to Fix It)</CardTitle>
              <p className="text-lg text-gray-600">You used good flower, followed the recipe, and your edibles still barely do anything. Weak cannabutter is one of the most frustrating problems in cannabis cooking — and almost always has a fixable cause.</p>
            </div>
            <Thermometer className="w-12 h-12 text-yellow-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-5">
            <p className="font-bold text-yellow-900 text-lg mb-2">The Most Common Culprit: Decarb Failure</p>
            <p className="text-yellow-800">Raw cannabis contains THCA — not THC. THCA is non-psychoactive. You must convert it to THC through heat (decarboxylation) <em>before</em> or <em>during</em> infusion. If this step went wrong, your butter is essentially just herb-flavored fat with almost no psychoactive effect.</p>
          </div>

          <Separator />

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">The 5 Reasons Your Cannabutter Is Weak</h2>

            {[
              {
                problem: "Decarboxylation Was Skipped or Done Wrong",
                icon: "❌",
                color: "red",
                fix: "Decarb at 230–240°F (110–115°C) for 35–45 minutes. Spread cannabis in a single layer on a baking sheet, cover tightly with foil to trap terpenes, and use an oven thermometer — most ovens run hot or cold. Your cannabis should turn from green to light brown and smell toasted/nutty when done correctly.",
              },
              {
                problem: "Infusion Temperature Was Too Low",
                icon: "🌡️",
                color: "blue",
                fix: "THC binds to fat molecules best at 160–185°F (71–85°C). Below 160°F, extraction is slow and incomplete. Above 200°F, you start degrading THC. Use a thermometer during infusion — not just for decarb. A slow cooker on 'low' with a clip-on thermometer is more reliable than stovetop.",
              },
              {
                problem: "Infusion Time Was Too Short",
                icon: "⏰",
                color: "orange",
                fix: "THC needs time to fully bind to the fat molecules. Minimum infusion time is 2 hours, with 3–4 hours being the sweet spot for most methods. Under 90 minutes, you're leaving a significant amount of THC unextracted. The exception: sous vide at precise temperature, which can be done in 2 hours efficiently.",
              },
              {
                problem: "Cannabis-to-Fat Ratio Is Off",
                icon: "⚖️",
                color: "purple",
                fix: "If you're using too much butter per gram of cannabis, the concentration gets diluted. A standard ratio is 7–14g of cannabis per 1 cup (227g) of butter. Going above 1 cup butter per 7g means each tablespoon of butter has very little THC. Calculate your mg/tbsp using Infusion Sensei before you start.",
              },
              {
                problem: "Poor Straining / Leftover Plant Matter",
                icon: "🌿",
                color: "green",
                fix: "Squeezing or pressing the plant matter through cheesecloth extracts more of the infused oil that's still bound to the plant material. Don't just pour and discard — squeeze firmly. Some people strain twice (once through mesh, once through cheesecloth) for maximum yield.",
              },
            ].map(({ problem, icon, color, fix }) => (
              <div key={problem} className={`border border-${color}-200 rounded-xl overflow-hidden`}>
                <div className={`bg-${color}-50 px-5 py-3 flex items-center gap-3`}>
                  <span className="text-xl">{icon}</span>
                  <h3 className={`font-bold text-${color}-900`}>{problem}</h3>
                </div>
                <div className="bg-white px-5 py-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className={`w-4 h-4 text-${color}-600 flex-shrink-0 mt-0.5`} />
                    <p className="text-sm text-gray-700 leading-relaxed"><strong>Fix:</strong> {fix}</p>
                  </div>
                </div>
              </div>
            ))}
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
            <h2 className="text-2xl font-bold text-gray-900">The Perfect Cannabutter Checklist</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                "Decarb at 230–240°F for 35–45 min (covered with foil)",
                "Use oven thermometer — ovens lie",
                "Cannabis turns light brown, smells toasted",
                "Infuse at 160–180°F (thermometer in the pot)",
                "Infuse for minimum 2 hours, ideally 3–4",
                "Ratio: 7–14g cannabis per 1 cup butter",
                "Strain through cheesecloth AND squeeze firmly",
                "Let butter solidify and separate from water",
                "Label with date, strain, and calculated mg/tbsp",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-2">🧪 Know Exactly What You're Getting</p>
            <p className="text-yellow-100 mb-4 text-sm">Use Infusion Sensei's infusion calculator to input your strain's THC%, grams used, and efficiency — and get exact mg per tablespoon before you ever bake.</p>
            <Link to="/infusions" className="inline-flex items-center gap-2 bg-white text-yellow-700 font-semibold px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors text-sm">
              Calculate My Infusion <ArrowRight className="w-4 h-4" />
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
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-yellow-200 rounded-lg hover:border-yellow-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-yellow-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-yellow-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
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
