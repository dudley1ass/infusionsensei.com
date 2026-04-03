import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Drumstick, ArrowRight } from "lucide-react";

export function CannabisWingsDosingGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Cannabis Wings Dosing: How to Get Safe mg Per Wing | Infusion Sensei</title>
        <meta
          name="description"
          content="How to dose infused wing sauce so every portion is predictable — cook wings plain, finish with cannabutter-based sauce, and use the THC calculator for crowd safety."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/cannabis-wings-dosing" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">
          Learn
        </Link>{" "}
        / <span className="text-gray-900">Cannabis Wings Dosing</span>
      </div>
      <Card className="bg-white border-orange-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-orange-600 text-white mb-3">Savory</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">Cannabis Wings Dosing (Without Guessing)</CardTitle>
              <p className="text-lg text-gray-600">
                Wings are ideal for THC control when you follow one rule: cook naked, sauce last. The sauce is your metered fat — not the fryer oil.
              </p>
            </div>
            <Drumstick className="w-14 h-14 text-orange-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Why sauce-last works</h2>
            <p className="text-gray-700 leading-relaxed">
              High heat and long cook times stress cannabinoids. Bake or air-fry wings like any normal recipe, then toss in sauce you built with infused butter or oil <strong>off the hottest part of the stove</strong>. Every wing surface that touches sauce picks up the same fat layer, so your portions stay even as long as you toss thoroughly.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Quick workflow</h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700">
              <li>Decide total mg THC for the full platter (guest safety first — err low).</li>
              <li>Melt cannabutter into your wing sauce base, then add acid/heat flavor (hot sauce, garlic, etc.).</li>
              <li>Count portions (wings or “5-piece plates”) before tossing.</li>
              <li>Use the{" "}
                <Link to="/edibles-calculator" className="text-green-700 font-semibold hover:underline">
                  THC calculator
                </Link>{" "}
                to confirm mg per wing from total sauce weight and wing count.
              </li>
            </ol>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5">
            <h3 className="font-black text-gray-900 mb-2">Hosting tip</h3>
            <p className="text-gray-700 text-sm">
              For mixed crowds, keep one tray labeled mild (5–7 mg per wing) and one labeled experienced only.{" "}
              <Link to="/party-mode" className="text-green-700 font-semibold hover:underline">
                Party Mode
              </Link>{" "}
              helps you plan batches and grocery lists without spreadsheet chaos.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/wings" className="inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-black px-6 py-3 rounded-xl">
              Browse wing sauces <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/learn/articles/wing-sauce-thc-dosing"
              className="inline-flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-800 font-black px-6 py-3 rounded-xl hover:bg-orange-50"
            >
              Wing sauce THC math →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
