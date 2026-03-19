import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router";

export function WhyEdiblesHitTooHard() {
  const relatedArticles = [
    { title: "How to Fix Edibles That Are Too Strong", path: "/learn/articles/fix-too-strong-edibles" },
    { title: "How to Dose THC Edibles Correctly", path: "/learn/articles/dosing-guide" },
    { title: "Why Edibles Take Longer Than Smoking", path: "/learn/articles/why-edibles-take-longer" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Why Edibles Hit Too Hard</span>
      </div>
      <Card className="bg-white border-orange-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-orange-600 text-white mb-3">Safety • 7 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">Why Edibles Hit Too Hard (The Science Behind Getting Overwhelmed)</CardTitle>
              <p className="text-lg text-gray-600">You took what seemed like a reasonable amount. Two hours later you were convinced the ceiling was moving. Here's the exact science behind why edibles can overwhelm you — and how to never let it happen again.</p>
            </div>
            <Zap className="w-12 h-12 text-orange-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-5">
            <p className="font-bold text-orange-800 text-lg mb-1">The Key Fact Most People Don't Know</p>
            <p className="text-orange-700">When you eat THC, your liver converts it into <strong>11-hydroxy-THC</strong> — a metabolite that is <strong>2–3 times more potent</strong> than inhaled THC and crosses the blood-brain barrier more effectively. You're not just getting "high from food" — you're experiencing a chemically different and stronger compound than what you get from smoking.</p>
          </div>

          <Separator />

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">The 3 Reasons Edibles Hit Harder Than Expected</h2>

            <div className="space-y-5">
              <div className="bg-white border-2 border-orange-200 rounded-xl p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-3">1. The Liver Conversion Effect</h3>
                <p className="mb-3">When you inhale THC, it goes directly into your bloodstream through your lungs and reaches your brain within minutes. The compound stays as Δ9-THC the entire time.</p>
                <p className="mb-3">When you eat THC, it's absorbed through your gut, travels through the portal vein directly to your liver, and gets metabolized into <strong>11-hydroxy-THC</strong> before reaching your brain. This metabolite is more lipid-soluble, passes the blood-brain barrier more efficiently, and produces stronger, longer-lasting psychoactive effects.</p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm">
                  <strong>What this means practically:</strong> A 10mg edible can feel significantly stronger than 10mg of the same THC inhaled. Your tolerance to smoked cannabis does not equal your tolerance to edibles.
                </div>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-3">2. The Delayed Onset Trap (Dose Stacking)</h3>
                <p className="mb-3">Edibles take 45 minutes to 2 hours to kick in. This gap is where most overconsumption happens. The sequence looks like this:</p>
                <div className="space-y-2 my-3">
                  {[
                    { time: "T+0:00", event: "Take 10mg edible", color: "green" },
                    { time: "T+0:45", event: "Feel nothing. Take another 10mg.", color: "yellow" },
                    { time: "T+1:15", event: "Still nothing. Take one more just in case.", color: "orange" },
                    { time: "T+1:45", event: "First dose kicks in.", color: "red" },
                    { time: "T+2:00", event: "Second dose kicks in. Now at 30mg total.", color: "red" },
                    { time: "T+2:30", event: "Third dose kicks in. Welcome to the ceiling.", color: "red" },
                  ].map(({ time, event, color }) => (
                    <div key={time} className={`flex items-center gap-3 bg-${color}-50 border border-${color}-200 rounded-lg p-2 text-sm`}>
                      <span className={`font-mono font-bold text-${color}-700 flex-shrink-0`}>{time}</span>
                      <span className={`text-${color}-800`}>{event}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm font-semibold text-orange-800">The rule: one dose, one timer, no exceptions. Set 2 hours on your phone before you even think about more.</p>
              </div>

              <div className="bg-white border-2 border-orange-200 rounded-xl p-5">
                <h3 className="text-xl font-bold text-gray-900 mb-3">3. Fat and Empty Stomach Amplification</h3>
                <p className="mb-3">THC is fat-soluble. Consuming edibles alongside high-fat foods dramatically increases absorption efficiency. A brownie eaten with ice cream hits harder than the same brownie eaten alone. An edible on an empty stomach can hit faster and more intensely than one taken after a full meal.</p>
                <p>This is why the same edible can feel completely different depending on when and what you ate before. Your body's fat absorption pathways essentially act as a THC amplifier.</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">If You've Already Taken Too Much — Right Now</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Remind yourself it's temporary", desc: "No one has ever died from a cannabis overdose. The feeling will pass. Your heart rate increase is real but not dangerous. Keep telling yourself: this will end." },
                { title: "Change your environment", desc: "Go somewhere quiet, dim the lights, lie down. Familiar surroundings reduce anxiety dramatically. Put on something you know well — a comfort show, familiar music." },
                { title: "Black pepper trick", desc: "Seriously — smell or chew a few black peppercorns. Beta-caryophyllene, a terpene in pepper, is well-documented to reduce THC-induced anxiety. It works." },
                { title: "CBD counteracts THC", desc: "CBD modulates THC's anxiety effects. If you have a CBD tincture, take 25–50mg. It won't fully reverse the high but can significantly reduce the anxious edge." },
              ].map(({ title, desc }) => (
                <div key={title} className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">{title}</p>
                      <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-2">📏 Know Your Dose Before You Eat It</p>
            <p className="text-orange-100 mb-4 text-sm">Use Infusion Sensei to calculate the exact mg THC per serving of every recipe. No more surprises.</p>
            <Link to="/infusions" className="inline-flex items-center gap-2 bg-white text-orange-700 font-semibold px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors text-sm">
              Calculate My Dose <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {relatedArticles.map(a => (
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-orange-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
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
