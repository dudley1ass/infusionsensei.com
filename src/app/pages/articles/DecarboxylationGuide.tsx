import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Thermometer, AlertTriangle, CheckCircle, ArrowRight, Clock, FlaskConical } from "lucide-react";

export function DecarboxylationGuide() {
  const relatedArticles = [
    { title: "How to Dose THC Edibles Correctly", path: "/learn/articles/dosing-guide" },
    { title: "Why Your Cannabutter Is Weak", path: "/learn/articles/why-thc-butter-is-weak" },
    { title: "Beginner Cannabis Cooking Guide", path: "/learn/articles/beginner-guide" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>How to Decarb Cannabis for Edibles (Temperature, Time & Method) | Infusion Sensei</title>
        <meta name="description" content="Learn how to decarb cannabis correctly for edibles. The exact temperature, time, and step-by-step method to activate THC before making cannabutter, oils, or any edible recipe." />
        <meta property="og:title" content="How to Decarb Cannabis for Edibles | Infusion Sensei" />
        <meta property="og:description" content="The exact temperature, time, and method to decarb cannabis before making edibles. Skipping this step is the #1 reason homemade edibles are weak." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/decarboxylation-guide" />
      </Helmet>

      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Decarboxylation Guide</span>
      </div>

      {/* Hero Card */}
      <Card className="bg-white border-green-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-green-600 text-white mb-3">Essential Technique</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">
                How to Decarb Cannabis for Edibles
              </CardTitle>
              <p className="text-lg text-gray-600">
                Decarbing is the single most important step in cannabis cooking — and the most skipped. Here's the exact temperature, time, and method to activate your cannabis before making cannabutter, oils, or any edible recipe.
              </p>
            </div>
            <Thermometer className="w-14 h-14 text-green-600 flex-shrink-0 ml-4 mt-1" />
          </div>

          {/* Quick reference strip */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { label: "Temperature", value: "240°F", sub: "(115°C)", color: "bg-green-50 border-green-200" },
              { label: "Time", value: "30–40 min", sub: "Flower", color: "bg-blue-50 border-blue-200" },
              { label: "Result", value: "THCA → THC", sub: "Activated", color: "bg-purple-50 border-purple-200" },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className={`rounded-xl border-2 p-3 text-center ${color}`}>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
                <p className="font-black text-gray-900 text-lg">{value}</p>
                <p className="text-xs text-gray-500">{sub}</p>
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-10">

          {/* What is decarbing */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What Is Decarbing?</h2>
            <p className="text-gray-700 leading-relaxed">
              Decarbing — short for decarboxylation — is the process of heating cannabis to activate it. Raw cannabis flower doesn't naturally contain large amounts of active THC. Instead, it contains <strong>THCA</strong>, the acidic precursor.
            </p>
            <p className="text-gray-700 leading-relaxed">
              When you apply heat, THCA loses a small chemical group and converts into THC — the compound responsible for the effects most people associate with cannabis. The same applies to CBD: CBDA becomes CBD.
            </p>
            <div className="bg-gray-950 rounded-2xl p-5 text-center font-mono">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">The Conversion</p>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-red-400 font-black text-xl">THCA</p>
                  <p className="text-gray-500 text-xs">Raw cannabis</p>
                </div>
                <div className="text-gray-500">
                  <ArrowRight className="w-6 h-6" />
                  <p className="text-xs">+ heat</p>
                </div>
                <div>
                  <p className="text-green-400 font-black text-xl">THC</p>
                  <p className="text-gray-500 text-xs">Active</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed">
                <strong>When you smoke or vape</strong>, the flame activates THCA instantly. With edibles, there's no such direct heat — so you must activate it yourself before cooking.
              </p>
            </div>
          </div>

          {/* Why it matters */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Why Skipping Decarbing Ruins Edibles</h2>
            <p className="text-gray-700 leading-relaxed">
              This is the <strong>#1 reason homemade edibles are weak</strong>. People mix raw ground flower into butter or brownie batter without decarbing first — and wonder why nothing happens.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                <p className="font-black text-red-800 mb-3">❌ Without Decarbing</p>
                <ul className="space-y-2 text-sm text-red-700">
                  {["Weak or no effects","Unpredictable potency","Wasted cannabis","Grassy flavor with little payoff","Confusing dosing"].map(item => (
                    <li key={item} className="flex gap-2"><span className="flex-shrink-0">•</span>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
                <p className="font-black text-green-800 mb-3">✅ With Decarbing</p>
                <ul className="space-y-2 text-sm text-green-700">
                  {["Consistent, reliable effects","Accurate dosing","Full potency from your flower","Better flavor","Predictable results every batch"].map(item => (
                    <li key={item} className="flex gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Step by step */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">How to Decarb Cannabis — Step by Step</h2>
            <p className="text-gray-700">The easiest and most reliable method for home cooks:</p>

            <div className="space-y-3">
              {[
                { n: "1", title: "Preheat oven to 240°F (115°C)", detail: "Home ovens can be off by 10–25°F. An oven thermometer helps if you want accuracy.", icon: "🌡️" },
                { n: "2", title: "Break flower into small pieces", detail: "Use your fingers — aim for popcorn-sized bits. Remove large stems. Do NOT grind into powder.", icon: "✋" },
                { n: "3", title: "Spread in a single, even layer", detail: "Use a parchment-lined baking sheet or oven-safe glass dish. Don't pile it up — uneven layers heat unevenly.", icon: "📋" },
                { n: "4", title: "Bake 30–40 minutes", detail: "Very dry flower leans toward 30 min. Fresher, moister flower may need the full 40 min.", icon: "⏱️" },
                { n: "5", title: "Stir once at the halfway point", detail: "Gently stir or shake at 15–20 minutes for more even heating. Not strictly required, but helpful.", icon: "🥄" },
                { n: "6", title: "Cool completely before using", detail: "Let it cool to room temperature. It will be drier, slightly darker, and crumbly. It's now ready to infuse.", icon: "❄️" },
              ].map(({ n, title, detail, icon }) => (
                <div key={n} className="flex gap-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-black text-sm">{n}</div>
                  <div>
                    <p className="font-black text-gray-900">{icon} {title}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* What it should look like */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">What Cannabis Should Look Like After Decarbing</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Before", desc: "Bright green, slightly sticky, fresh smell", icon: "🌿", color: "bg-green-50 border-green-200" },
                { label: "After (correct)", desc: "Light brown-green, dry, crumbly, toasted aroma", icon: "✅", color: "bg-amber-50 border-amber-200" },
                { label: "Overcooked", desc: "Dark brown or black, burnt smell — potency damaged", icon: "❌", color: "bg-red-50 border-red-200" },
              ].map(({ label, desc, icon, color }) => (
                <div key={label} className={`rounded-2xl border-2 p-4 text-center ${color}`}>
                  <p className="text-3xl mb-2">{icon}</p>
                  <p className="font-black text-gray-900 mb-1">{label}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timing by form */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Decarb Times by Cannabis Form</h2>
            <div className="space-y-3">
              {[
                { form: "Flower (most common)", time: "240°F for 30–40 min", notes: "Best starting point for beginners", color: "border-green-200 bg-green-50" },
                { form: "Kief", time: "240°F for 20–30 min", notes: "Finer material heats faster — watch it closely", color: "border-yellow-200 bg-yellow-50" },
                { form: "Hash / Concentrates", time: "Varies — more advanced", notes: "Not recommended for beginners. Start with flower.", color: "border-gray-200 bg-gray-50" },
              ].map(({ form, time, notes, color }) => (
                <div key={form} className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-4 ${color}`}>
                  <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-black text-gray-900">{form}</p>
                    <p className="text-sm text-gray-500">{notes}</p>
                  </div>
                  <p className="font-black text-green-700 text-sm text-right">{time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Common mistakes */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">7 Most Common Decarbing Mistakes</h2>
            <div className="space-y-3">
              {[
                { mistake: "Temperature too high", fix: "Higher heat isn't better. Over 250°F starts damaging cannabinoids and terpenes." },
                { mistake: "Grinding too fine", fix: "Powdery cannabis heats unevenly, sticks to everything, and is harder to strain after infusion." },
                { mistake: "Piling it too thick", fix: "A single even layer is essential. Piled cannabis heats unevenly — some burns while some stays raw." },
                { mistake: "Not preheating the oven", fix: "Starting in a cold oven means your timing is off from the beginning. Always preheat fully." },
                { mistake: "Trusting the oven dial", fix: "Most home ovens run 10–25°F off. A $10 oven thermometer is one of the best investments you can make." },
                { mistake: "Assuming baking does the job", fix: "Batter insulates cannabis from heat. Brownie centers can stay too cool for proper activation." },
                { mistake: "Not letting it cool", fix: "Hot decarbed cannabis can degrade if immediately mixed with hot butter. Cool it first." },
              ].map(({ mistake, fix }) => (
                <div key={mistake} className="flex gap-3 bg-red-50 border border-red-100 rounded-2xl p-4">
                  <span className="text-red-500 font-black flex-shrink-0">✗</span>
                  <div>
                    <p className="font-black text-gray-900">{mistake}</p>
                    <p className="text-gray-600 text-sm mt-0.5">{fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smell / Storage */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Does Decarbing Smell?</h2>
            <p className="text-gray-700 leading-relaxed">
              Yes — the aroma can spread through your kitchen and house, especially with open-tray methods. If smell is a concern, try decarbing in a <strong>loosely lidded mason jar</strong> in the oven. It won't eliminate the smell but contains it better.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <strong>Storage tip:</strong> Once cooled, store decarbed cannabis in an airtight glass jar in a cool, dark place. It'll keep well for weeks before infusion.
            </div>
          </div>

          {/* FAQ */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Do I always need to decarb before making edibles?", a: "Yes, in almost all cases. Without decarbing, THCA doesn't convert to THC and your edibles will be much weaker or have no noticeable effect at all." },
                { q: "Can I decarb and infuse at the same time?", a: "You can try, but it's less reliable. The butter or oil protects the cannabis from consistent heating, making activation incomplete. Two separate steps — decarb first, infuse second — gives more consistent results." },
                { q: "Will baking brownies or cookies decarb the cannabis for me?", a: "Not reliably. Batter insulates the cannabis, and interior temperatures are inconsistent. Always decarb first, then infuse into butter or oil, then use that in your recipe." },
                { q: "Can I decarb in an air fryer or microwave?", a: "Not recommended. Air fryers can run hot and uneven. Microwaves are too inconsistent and can create hot spots. A conventional oven at 240°F is the most reliable method." },
                { q: "How do I know if my decarb worked?", a: "Look for slightly darker color, dry crumbly texture, and a toasted herbal smell. The real test is whether your final edibles work consistently — if they do, your decarb process is solid." },
                { q: "Should I grind before decarbing?", a: "Break it up by hand into small pieces — don't grind it into powder. Fine powder heats too fast, sticks to surfaces, and is harder to work with. A light grind after decarbing is fine if needed." },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <p className="font-black text-gray-900 mb-2">{q}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cheat sheet */}
          <div className="bg-gray-950 rounded-2xl p-6">
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">⚡ Decarb Cheat Sheet</p>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {[
                { label: "Temperature", value: "240°F (115°C)" },
                { label: "Time (flower)", value: "30–40 minutes" },
                { label: "Time (kief)", value: "20–30 minutes" },
                { label: "Prep", value: "Break into small pieces, don't powder" },
                { label: "Layer", value: "Single, even — no piling" },
                { label: "Texture after", value: "Dry, crumbly, lightly toasted" },
                { label: "Color after", value: "Light brownish-green (not black)" },
                { label: "Next step", value: "Cool completely, then infuse into fat" },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-gray-500 w-32 flex-shrink-0">{label}</span>
                  <span className="text-white font-semibold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
            <FlaskConical className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-black text-gray-900 mb-2">Ready to Make Your Infusion?</h3>
            <p className="text-gray-600 mb-4 text-sm">Once you've decarbed, use our recipe builder to calculate the exact THC per serving for your cannabutter or oil.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/infusions">
                <button className="bg-green-600 hover:bg-green-700 text-white font-black px-6 py-3 rounded-xl transition-colors flex items-center gap-2">
                  Build My Infusion <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <Link to="/edibles-calculator">
                <button className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-black px-6 py-3 rounded-xl transition-colors">
                  THC Calculator
                </button>
              </Link>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Related Articles */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Related Articles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {relatedArticles.map(article => (
              <Link key={article.path} to={article.path}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-green-50 transition-colors group">
                <span className="text-gray-700 group-hover:text-green-700 font-medium">{article.title}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
