import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Lightbulb, ArrowRight, CheckCircle } from "lucide-react";

export function EdiblesTasteBad() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Why Edibles Taste Bad (And How to Fix It Fast)</title>
        <meta name="description" content="Fix bitter, weedy edibles with practical infusion and flavor tweaks so gummies, brownies, and oils taste cleaner." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/edibles-taste-bad" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Why Edibles Taste Bad</span>
      </div>
      <Card className="bg-white border-red-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-red-600 text-white mb-3">Troubleshooting</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">Why Your Edibles Taste Bad (And How to Fix It)</CardTitle>
              <p className="text-lg text-gray-600">That grassy, bitter, or "weedy" taste in homemade edibles is fixable. Here's why it happens and exactly how to eliminate it — plus the best foods for hiding cannabis flavor entirely.</p>
            </div>
            <Lightbulb className="w-14 h-14 text-red-500 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-10">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Why Edibles Taste "Weedy"</h2>
            <p className="text-gray-700 leading-relaxed">The grassy, bitter taste in homemade edibles usually comes from <strong>chlorophyll and plant matter</strong> being extracted along with the cannabinoids. Unlike THC and CBD, chlorophyll tastes terrible — and the more you extract, the worse it gets.</p>
            <div className="space-y-3">
              {[
                { cause:"Over-infusing (too long)", detail:"The longer you cook, the more chlorophyll, waxes, and plant material leach into your butter or oil. After 4 hours, you're extracting bitterness — not more THC.", severity:"Most common" },
                { cause:"Temperature too high", detail:"High heat extracts more plant material AND can burn your butter, creating a harsh, acrid flavor that masks everything else.", severity:"Very common" },
                { cause:"Over-decarbing", detail:"Burning your decarb creates a strong roasted/charred smell that carries through to the final product.", severity:"Common" },
                { cause:"Too much water squeezed out", detail:"Squeezing the cheesecloth too hard forces out bitter plant juices along with the butter.", severity:"Moderate" },
                { cause:"Using low-quality trim or shake", detail:"Fan leaves and stems contain more chlorophyll and less THC than flower. More plant material = more bitter taste.", severity:"Depends on source" },
              ].map(({ cause, detail, severity }) => (
                <div key={cause} className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-1">
                    <p className="font-black text-gray-900">✗ {cause}</p>
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">{severity}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">How to Fix the Taste</h2>
            <div className="space-y-3">
              {[
                { fix:"Lower your infusion temperature", how:"Stay between 160–180°F. Above 200°F, you start extracting chlorophyll aggressively. A thermometer is worth every penny.", icon:"🌡️" },
                { fix:"Shorten infusion time", how:"2 hours is enough for most cannabutter. You don't need 8 hours — longer doesn't mean stronger, it means bitterer.", icon:"⏱️" },
                { fix:"Don't squeeze the cheesecloth", how:"Let the butter drip through naturally. Squeezing forces out bitter plant juices. Leave it and let gravity do the work.", icon:"🧺" },
                { fix:"Use quality flower not shake/trim", how:"Flower has more THC per gram and less chlorophyll than stems and leaves. You need less of it and get better flavor.", icon:"🌿" },
                { fix:"Add water during infusion", how:"The water method (cooking butter with water) helps pull out water-soluble bitterness. The plant bitterness stays in the water, the THC stays in the fat.", icon:"💧" },
                { fix:"Use a cold water wash on finished butter", how:"Pour cold water over finished butter, mix gently, refrigerate, and remove butter disc. Repeat 1–2 times. Removes chlorophyll without removing THC.", icon:"🔄" },
              ].map(({ fix, how, icon }) => (
                <div key={fix} className="flex gap-4 bg-green-50 rounded-2xl p-4 border border-green-100">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div><p className="font-black text-gray-900">{fix}</p><p className="text-gray-600 text-sm mt-0.5">{how}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Flavor Masking — The Best Foods to Hide Cannabis Taste</h2>
            <p className="text-gray-700">Some foods naturally overpower or complement cannabis flavor. These are your best options:</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { category:"🍫 Chocolate", items:["Dark chocolate brownies","Chocolate truffles","Hot chocolate","Chocolate drizzle popcorn"], rating:"⭐⭐⭐⭐⭐", why:"Strongest masker — bitter chocolate completely covers weedy notes" },
                { category:"🌶️ Spicy & Bold", items:["Buffalo wing sauce","Cajun seasoning","Hot sauce","Nashville hot"], rating:"⭐⭐⭐⭐⭐", why:"Spice overwhelms any plant taste — savory is the best category for masking" },
                { category:"🧄 Savory Fats", items:["Garlic butter pasta","Truffle fries","Parmesan sauce","Garlic butter wings"], rating:"⭐⭐⭐⭐", why:"Strong savory flavors + high fat dilutes cannabis taste naturally" },
                { category:"🍋 Citrus & Acid", items:["Lemon bars","Lemon pepper wings","Citrus glazes","Infused lemonade"], rating:"⭐⭐⭐", why:"Acid brightens the palate and counteracts earthy/bitter notes" },
                { category:"🍬 Caramel & Brown Sugar", items:["Caramel popcorn","Caramel latte","Brown sugar bourbon wings","Maple glazes"], rating:"⭐⭐⭐⭐", why:"Deep sweet flavors balance bitterness effectively" },
                { category:"🥥 Coconut & Tropical", items:["Coconut oil smoothies","Pineapple ginger wings","Thai-style dishes","Coconut coffee"], rating:"⭐⭐⭐", why:"Coconut oil itself has almost no cannabis flavor when done right" },
              ].map(({ category, items, rating, why }) => (
                <div key={category} className="bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-green-300 transition-all">
                  <p className="font-black text-gray-900 mb-1">{category}</p>
                  <p className="text-xs text-gray-500 mb-2">{why}</p>
                  <p className="text-sm font-bold text-green-700 mb-2">{rating}</p>
                  <ul className="space-y-0.5">{items.map(item => <li key={item} className="text-xs text-gray-600">• {item}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">The Savory Secret (Most People Don't Know This)</h2>
            <p className="text-gray-700 leading-relaxed">Most people think edibles = sweet food. But savory dishes are often <strong>far better</strong> at hiding cannabis taste. Bold flavors like buffalo sauce, garlic, Cajun seasoning, and truffle completely overpower any weedy notes — and the high fat content in savory cooking means better THC absorption too.</p>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { title:"Infused Wing Sauces", desc:"20 sauces — buffalo, Nashville hot, Korean gochujang. Cannabis taste is undetectable.", to:"/wings", emoji:"🍗" },
                { title:"Spreads & Dips", desc:"Cheese dips, ranch, buffalo — strong flavors mask everything.", to:"/spreads-dips", emoji:"🥣" },
                { title:"Infused Pasta", desc:"Alfredo and garlic pasta — cheese and garlic dominate.", to:"/ingredients?category=savory-meals&recipe=alfredo", emoji:"🍝" },
              ].map(({ title, desc, to, emoji }) => (
                <Link key={title} to={to} className="bg-green-50 border border-green-200 rounded-2xl p-4 hover:border-green-400 transition-all group">
                  <p className="text-2xl mb-1">{emoji}</p>
                  <p className="font-black text-gray-900 group-hover:text-green-700">{title}</p>
                  <p className="text-xs text-gray-500 mt-1">{desc}</p>
                </Link>
              ))}
            </div>
          </div>

        </CardContent>
      </Card>
      <Card className="bg-white border-gray-200">
        <CardHeader><CardTitle className="text-lg">Related Articles</CardTitle></CardHeader>
        <CardContent><div className="space-y-3">
          {[
            { title:"The Perfect Cannabutter Guide", path:"/learn/articles/cannabutter-guide" },
            { title:"How to Decarb Cannabis", path:"/learn/articles/decarboxylation-guide" },
            { title:"Why Your Edibles Aren't Working", path:"/learn/articles/why-edibles-dont-work" },
          ].map(a => (
            <Link key={a.path} to={a.path} className="flex items-center justify-between p-3 rounded-xl hover:bg-red-50 transition-colors group">
              <span className="text-gray-700 group-hover:text-red-700 font-medium">{a.title}</span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
            </Link>
          ))}
        </div></CardContent>
      </Card>
    </div>
  );
}
