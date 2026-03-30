import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { AlertCircle, ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router";

export function WhyEdiblesDontWork() {
  const relatedArticles = [
    { title: "How Long Edibles REALLY Take to Kick In", path: "/learn/articles/how-long-edibles-take" },
    { title: "Why Your THC Butter Isn't Strong", path: "/learn/articles/why-thc-butter-is-weak" },
    { title: "How to Dose THC Edibles Correctly", path: "/learn/articles/dosing-guide" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>Why Your Edibles Aren't Working (Or Hit Too Hard) | Infusion Sensei</title>
        <meta name="description" content="The most common reasons edibles feel too weak or way too strong: decarb mistakes, uneven mixing, bad dose math, and timing errors." />
        <meta property="og:title" content="Why Your Edibles Aren't Working (Or Hit Too Hard) | Infusion Sensei" />
        <meta property="og:description" content="The most common reasons edibles feel too weak or way too strong: decarb mistakes, uneven mixing, bad dose math, and timing errors." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/why-edibles-dont-work" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Why Edibles Aren't Working</span>
      </div>
      <Card className="bg-white border-red-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-red-600 text-white mb-3">Troubleshooting • 8 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">Why Your Edibles Aren't Working (Or Hit Too Hard)</CardTitle>
              <p className="text-lg text-gray-600">This usually comes down to four things: decarb quality, mixing, dose math, and timing. Fix those and your batches become predictable.</p>
            </div>
            <AlertCircle className="w-12 h-12 text-red-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-5">
            <p className="font-bold text-red-800 text-lg mb-2">The #1 Rule You Might Be Breaking</p>
            <p className="text-red-700">Edibles are not joints. They do not work in 5 minutes. The average onset is <strong>45–90 minutes</strong> and can stretch to <strong>2 hours or more</strong> depending on your body. The problem is almost never that the edible is weak — it's that you didn't wait long enough.</p>
          </div>

          <Separator />

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">The 5 Real Reasons Your Edibles Aren't Working</h2>

            {[
              {
                num: "1", color: "red", title: "You Didn't Wait Long Enough",
                body: "This is the cause of 90% of bad edible experiences. Digestion takes time. THC has to travel through your stomach, into your small intestine, get absorbed into the bloodstream, travel to the liver, get converted to 11-hydroxy-THC, and then reach your brain. That whole process takes 45 minutes on a good day and up to 3 hours if your digestion is slow. The fix: set a timer for 2 hours. Do not touch another edible until it goes off.",
              },
              {
                num: "2", color: "orange", title: "You Ate It Right After a Full Meal",
                body: "A full stomach doesn't speed up edibles — it competes with them. When your digestive system is busy processing a big meal, THC absorption gets delayed and diluted. Counterintuitively, edibles often work better on a light stomach or with a small amount of healthy fat (avocado, peanut butter, cheese) which actually helps absorption. A huge meal of carbs and protein can push your onset window out to 2–3 hours.",
              },
              {
                num: "3", color: "yellow", title: "Your Infusion Was Made Wrong",
                body: "If you skipped decarboxylation — the step where you heat cannabis to convert inactive THCA into active THC — your butter or oil contains almost zero psychoactive THC. Raw cannabis does nothing. Decarb at 230–240°F for 35–45 minutes before infusing. Also, if you infused at too high a temperature or for too short a time, THC extraction was incomplete. Under-infused butter is the most common reason homemade edibles are weak.",
              },
              {
                num: "4", color: "blue", title: "Your Metabolism Works Differently",
                body: "Two people can eat identical edibles and have completely different experiences. People with faster metabolisms process THC more quickly — sometimes too quickly, leading to a shorter, weaker effect. Body fat percentage also matters: THC is fat-soluble, so people with higher body fat have more tissue for it to bind to, which can both delay onset and extend duration. There's no universal timeline — your body is unique.",
              },
              {
                num: "5", color: "purple", title: "The Dose Was Actually Too Low",
                body: "If you made homemade edibles and your THC calculations aren't precise, you may genuinely have underdosed. A 5mg edible for a high-tolerance user feels like nothing. Check your math: cannabis grams × THC% × decarb efficiency (85%) × extraction efficiency (70-80%) ÷ number of servings = mg per serving. Use Infusion Sensei's calculator to verify your numbers before assuming something is wrong.",
              },
            ].map(({ num, color, title, body }) => (
              <div key={num} className={`bg-${color}-50 border border-${color}-200 rounded-xl p-5`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full bg-${color}-500 text-white font-black flex items-center justify-center flex-shrink-0 text-sm`}>{num}</div>
                  <div>
                    <h3 className={`font-bold text-${color}-900 text-lg mb-2`}>{title}</h3>
                    <p className={`text-${color}-800 text-sm leading-relaxed`}>{body}</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Why they hit too hard (same root causes)</h2>
            <div className="space-y-2">
              {[
                "Not decarbed correctly: under- or over-heated flower leads to unpredictable activation.",
                "Uneven mixing: hot spots create servings that are much stronger than the batch average.",
                "Wrong dosage math: using total batch mg as serving mg makes portions far too strong.",
                "Timing mistakes: re-dosing before the first edible peaks stacks effects unexpectedly.",
              ].map((issue) => (
                <div key={issue} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <XCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{issue}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The Edible Test Protocol</h2>
            <p>If you've never felt edibles work before, follow this exact protocol before concluding they "don't work for you":</p>
            <div className="space-y-2">
              {[
                "Fast for 3–4 hours beforehand (light snack only)",
                "Eat a small amount of healthy fat with your edible (tablespoon of peanut butter or slice of avocado)",
                "Take 10mg (5mg if you're truly a first-timer)",
                "Set a timer for 2 hours — do not touch anything else until it goes off",
                "After 2 hours with no effect, take another 5mg and wait another 90 minutes",
                "Keep a log: what you ate, when, how much, what you felt",
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-2">🧮 Know Your Exact Dose</p>
            <p className="text-green-100 mb-4 text-sm">Fix it with the edibles calculator: get exact mg THC per serving before you cook.</p>
            <Link to="/infusions" className="inline-flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm">
              Fix it with calculator <ArrowRight className="w-4 h-4" />
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
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-red-200 rounded-lg hover:border-red-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-red-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
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
