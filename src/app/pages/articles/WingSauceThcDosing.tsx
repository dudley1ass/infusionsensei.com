import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Flame, ArrowRight } from "lucide-react";

export function WingSauceThcDosing() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Wing Sauce THC Dosing: Butter, Heat & Portions | Infusion Sensei</title>
        <meta
          name="description"
          content="Infused wing sauce dosing: how much cannabutter per batch, when to add it off heat, and how to translate total sauce grams into mg THC per wing."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/wing-sauce-thc-dosing" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">
          Learn
        </Link>{" "}
        / <span className="text-gray-900">Wing Sauce THC Dosing</span>
      </div>
      <Card className="bg-white border-red-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-red-600 text-white mb-3">Sauces</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">Wing Sauce THC Dosing Without Breaking the Sauce</CardTitle>
              <p className="text-lg text-gray-600">
                Buffalo-style sauces are mostly butter and acid. That makes them a perfect vehicle for cannabutter — as long as you treat THC like a finishing ingredient.
              </p>
            </div>
            <Flame className="w-14 h-14 text-red-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">The butter swap method</h2>
            <p className="text-gray-700 leading-relaxed">
              If a sauce calls for 4 tbsp butter, you can use 2 tbsp plain + 2 tbsp cannabutter for half potency, or all cannabutter for full carrier substitution. The flavor impact is subtle compared to hot sauce and garlic — but the <strong>math must include only the grams of infused fat</strong>, not the vinegar or watery components.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="font-black text-gray-900 mb-2">Heat discipline</p>
              <p className="text-gray-700 text-sm">
                Simmer aromatics if you need to, then pull the pan off the burner before whisking in cannabutter. prolonged rolling boils are unnecessary for wing sauce texture and only add degradation risk.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4">
              <p className="font-black text-gray-900 mb-2">Portion math</p>
              <p className="text-gray-700 text-sm">
                Weigh total finished sauce in grams. If you know mg THC in the infused portion you added, the calculator turns that into mg per tossed wing once you enter wing count.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/edibles-calculator" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black px-6 py-3 rounded-xl">
              Run the numbers <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/learn/articles/cannabis-wings-dosing"
              className="inline-flex items-center justify-center gap-2 border-2 border-red-600 text-red-800 font-black px-6 py-3 rounded-xl hover:bg-red-50"
            >
              Full wing platter workflow →
            </Link>
            <Link to="/wings" className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-800 font-black px-6 py-3 rounded-xl hover:bg-gray-50">
              Recipe index
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
