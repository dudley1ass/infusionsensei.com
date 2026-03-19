import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function HowLongEdiblesTake() {
  const relatedArticles = [
    { title: "Why Edibles Aren't Working", path: "/learn/articles/why-edibles-dont-work" },
    { title: "Why Edibles Hit Too Hard", path: "/learn/articles/why-edibles-hit-too-hard" },
    { title: "Why Edibles Take Longer Than Smoking", path: "/learn/articles/why-edibles-take-longer" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">How Long Edibles Take</span>
      </div>
      <Card className="bg-white border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-blue-600 text-white mb-3">Science • 6 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">How Long Edibles REALLY Take to Kick In</CardTitle>
              <p className="text-lg text-gray-600">The real answer isn't "45 minutes." It depends on what you ate, when you ate it, your metabolism, and the type of edible. Here's the complete breakdown.</p>
            </div>
            <Clock className="w-12 h-12 text-blue-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { type: "Fasted stomach", time: "20–45 min", color: "green", note: "Fastest onset" },
              { type: "Light snack", time: "45–75 min", color: "blue", note: "Typical onset" },
              { type: "Full meal", time: "90–120 min", color: "yellow", note: "Delayed onset" },
              { type: "High-fat meal", time: "60–90 min + stronger", color: "orange", note: "Amplified effect" },
            ].map(({ type, time, color, note }) => (
              <div key={type} className={`bg-${color}-50 border border-${color}-300 rounded-xl p-4 text-center`}>
                <div className={`text-2xl font-black text-${color}-700`}>{time}</div>
                <div className="font-semibold text-gray-800 text-sm mt-1">{type}</div>
                <div className={`text-xs text-${color}-600 mt-1`}>{note}</div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">The 4 Factors That Control Onset Time</h2>

            <div className="space-y-5">
              {[
                {
                  title: "1. What You Ate Before (Biggest Factor)",
                  color: "blue",
                  content: `Your stomach contents have the single biggest impact on edible onset. An empty stomach means THC reaches your small intestine quickly, gets absorbed fast, and hits relatively soon.

A full stomach — especially one full of protein and complex carbs — creates a traffic jam. Your gut is busy, absorption is slower, and the THC can take twice as long to enter your bloodstream.

The interesting exception: high-fat foods alongside your edible can actually increase total absorption efficiency because THC is fat-soluble. You may wait a bit longer but feel it more strongly when it arrives.`,
                },
                {
                  title: "2. The Type of Edible",
                  color: "purple",
                  content: `Not all edibles are created equal when it comes to speed:

• Nano-emulsified / water-soluble products (THC drinks, Select Squeeze, Zero Proof Stir): 15–30 minutes. These bypass normal fat digestion.
• Tinctures held under tongue: 15–45 minutes through sublingual absorption.
• Regular food edibles (brownies, gummies, chocolates): 45–120 minutes through full digestion.
• Capsules: 60–90 minutes — consistent but slow.

The delivery mechanism matters as much as the dose.`,
                },
                {
                  title: "3. Your Metabolism and Body Composition",
                  color: "green",
                  content: `Fast metabolism = faster onset and shorter duration. Slow metabolism = delayed onset but potentially longer-lasting effects.

Body fat percentage also plays a role. THC is fat-soluble, meaning it stores in fat tissue. People with higher body fat may find THC absorbs more slowly initially but the effects last longer as it releases from tissue gradually.

There's no way to predict exactly how your body will respond without experimenting carefully.`,
                },
                {
                  title: "4. Tolerance Level",
                  color: "orange",
                  content: `Regular cannabis users develop tolerance not just to the effects, but to the uptake efficiency. At the liver conversion stage, regular users may process 11-hydroxy-THC faster, reducing peak intensity. They may also notice a compressed onset window over time.

A tolerance break of 2–4 weeks resets this substantially. Many regular users are surprised by how differently edibles work after a T-break.`,
                },
              ].map(({ title, color, content }) => (
                <div key={title} className={`bg-${color}-50 border border-${color}-200 rounded-xl p-5`}>
                  <h3 className={`font-bold text-${color}-900 text-lg mb-3`}>{title}</h3>
                  <p className={`text-${color}-800 text-sm leading-relaxed whitespace-pre-line`}>{content}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Timeline: What's Happening Inside Your Body</h2>
            <div className="space-y-3">
              {[
                { time: "0–15 min", event: "Edible sits in your stomach. Digestion begins. Nothing psychoactive yet." },
                { time: "15–45 min", event: "THC begins entering the small intestine and absorbing into the bloodstream via fat-soluble transport." },
                { time: "45–60 min", event: "THC arrives at the liver. Conversion to 11-hydroxy-THC begins. You may start to feel the earliest effects." },
                { time: "60–90 min", event: "11-hydroxy-THC reaches the brain. Peak onset for most people on a light stomach." },
                { time: "90–120 min", event: "Full effect for most people. This is when those who ate a full meal finally start to feel it." },
                { time: "2–6 hours", event: "Effects plateau and gradually fade. Duration depends on dose and metabolism." },
              ].map(({ time, event }) => (
                <div key={time} className="flex gap-4 items-start">
                  <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded text-xs flex-shrink-0">{time}</span>
                  <span className="text-sm text-gray-700 pt-1">{event}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-2">⏱️ The Golden Rule</p>
            <p className="text-blue-100 mb-1 text-sm">Set a 2-hour timer every single time. Do not consume more until the timer goes off. This one habit eliminates the majority of bad edible experiences.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {relatedArticles.map(a => (
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-blue-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
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
