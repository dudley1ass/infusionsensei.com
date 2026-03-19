import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Layers, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function WhyEdiblesFeelDifferent() {
  const relatedArticles = [
    { title: "Why Edibles Hit Too Hard", path: "/learn/articles/why-edibles-hit-too-hard" },
    { title: "How Long Edibles REALLY Take to Kick In", path: "/learn/articles/how-long-edibles-take" },
    { title: "The 4 Types of THC Edibles", path: "/learn/articles/edible-types" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Why Edibles Feel Different</span>
      </div>
      <Card className="bg-white border-indigo-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-indigo-600 text-white mb-3">Science • 7 min read</Badge>
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">Why Some Edibles Feel Stronger Than Others (Same Dose, Different Effect)</CardTitle>
              <p className="text-lg text-gray-600">You've had a 10mg gummy that barely touched you, and a 10mg brownie that knocked you sideways. The dose was the same — so why the difference? Fat content, sugar, emulsification, and your own biology are all in play.</p>
            </div>
            <Layers className="w-12 h-12 text-indigo-500 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">Factor 1: Fat Content Changes Everything</h2>
            <p>THC is fat-soluble. It doesn't dissolve in water — it dissolves in fat. The more fat in an edible, the more efficiently THC is absorbed through your gut wall and into your bloodstream.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { item: "Brownie (high fat)", fat: "~12g fat per serving", absorption: "High — butter, chocolate, and eggs all carry THC efficiently", color: "orange" },
                { item: "Gummy (low fat)", fat: "~0g fat per serving", absorption: "Lower — gelatin and sugar carry THC poorly. Nano-emulsification helps.", color: "yellow" },
                { item: "THC drink (nano)", fat: "~0g fat per serving", absorption: "High — nano-emulsification creates water-soluble THC particles that absorb regardless of fat content", color: "green" },
              ].map(({ item, fat, absorption, color }) => (
                <div key={item} className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4`}>
                  <p className={`font-bold text-${color}-900 mb-2`}>{item}</p>
                  <p className={`text-xs text-${color}-700 mb-1`}>{fat}</p>
                  <p className={`text-xs text-${color}-800`}>{absorption}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Factor 2: Nano-Emulsification (The Game Changer)</h2>
            <p>Traditional THC extraction produces oil droplets that don't mix with water-based digestive fluids. Your gut has to work hard to break them down. This leads to inconsistent absorption.</p>
            <p>Nano-emulsification breaks THC into particles 20–100 nanometers in size — so small they disperse through water-based fluids automatically. This means:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { label: "Standard edible absorption", value: "6–20%", desc: "Most of the THC passes through unabsorbed", color: "red" },
                { label: "Nano-emulsified absorption", value: "up to 3–4x higher", desc: "Far more THC reaches your bloodstream", color: "green" },
              ].map(({ label, value, desc, color }) => (
                <div key={label} className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4 text-center`}>
                  <p className="text-sm text-gray-700 mb-1">{label}</p>
                  <p className={`text-2xl font-black text-${color}-700`}>{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600">This is why a 5mg nano-emulsified drink can feel similar to a 10–15mg traditional gummy. The mg count is only part of the story — bioavailability is the other half.</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Factor 3: Sugar and Glycemic Response</h2>
            <p>High-sugar edibles can create a glycemic spike that alters how THC feels. Rapid blood sugar fluctuations affect how the brain responds to cannabinoids — some people experience more anxious or intense effects from high-sugar edibles compared to lower-sugar options with the same THC dose.</p>
            <p>Additionally, sugar drives faster gastric emptying, which can accelerate how quickly THC moves from your stomach to your small intestine — effectively speeding up onset in some people.</p>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Factor 4: Terpenes Modify the Experience</h2>
            <p>Whole-plant infusions (made from flower) contain hundreds of terpenes that modulate how THC feels through what's called the entourage effect. Distillate-based edibles with no terpenes can feel more one-dimensional — pure THC without the steering wheel that terpenes provide.</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { terpene: "Myrcene", effect: "Enhances sedation and body effects. Found in indica-leaning strains. Makes the couch-lock more likely." },
                { terpene: "Limonene", effect: "Uplifting and mood-elevating. Can reduce THC-induced anxiety. Found in citrus-heavy strains." },
                { terpene: "Caryophyllene", effect: "Binds to CB2 receptors, adding anti-anxiety effects to the high. The terpene in black pepper." },
                { terpene: "Linalool", effect: "Calming and sedative. Works synergistically with THC for a more relaxed, less anxious experience." },
              ].map(({ terpene, effect }) => (
                <div key={terpene} className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <p className="font-bold text-purple-900 mb-1">{terpene}</p>
                  <p className="text-sm text-gray-600">{effect}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-2">💡 The Takeaway</p>
            <p className="text-indigo-100 text-sm">Same mg ≠ same experience. Fat content, emulsification, sugar, terpenes, and your individual biology all shape the effect. Track what works for you and log your experiences to find your patterns.</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Related Articles</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {relatedArticles.map(a => (
                <Link key={a.path} to={a.path} className="p-4 bg-white border border-indigo-200 rounded-lg hover:border-indigo-400 hover:shadow-md transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 group-hover:text-indigo-700 text-sm">{a.title}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
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
