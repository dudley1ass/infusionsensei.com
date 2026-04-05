import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { ChefHat, ArrowRight } from "lucide-react";

export function InfusedFudgeRecipe() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Infused Fudge Recipe (Easy, Portion-Friendly) | Infusion Sensei</title>
        <meta
          name="description"
          content="Make rich infused fudge with predictable mg per piece. Includes ingredient ratios, no-bake method, and simple dosing math."
        />
        <meta property="og:title" content="Infused Fudge Recipe (Easy, Portion-Friendly) | Infusion Sensei" />
        <meta
          property="og:description"
          content="Make rich infused fudge with predictable mg per piece. Includes ingredient ratios, no-bake method, and simple dosing math."
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://infusionsensei.com/learn/articles/infused-fudge-recipe" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Infused Fudge Recipe (Easy, Portion-Friendly) | Infusion Sensei" />
        <meta
          name="twitter:description"
          content="Make rich infused fudge with predictable mg per piece. Includes ingredient ratios, no-bake method, and simple dosing math."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/infused-fudge-recipe" />
      </Helmet>

      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">
          Learn
        </Link>{" "}
        / <span className="text-gray-900">Infused Fudge Recipe</span>
      </div>

      <Card className="bg-white border-amber-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-amber-600 text-white mb-3">Dessert</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">Infused Fudge Recipe That Is Easy to Portion</CardTitle>
              <p className="text-lg text-gray-600">
                Fudge is a strong edible format because it sets into clean squares. That makes dosing easier than jars, sauces,
                and spooned spreads.
              </p>
            </div>
            <ChefHat className="w-14 h-14 text-amber-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
            <p className="font-black text-gray-900 mb-2">Base recipe (about 25 squares)</p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
              <li>14 oz sweetened condensed milk</li>
              <li>3 cups semi-sweet chocolate chips</li>
              <li>3 tbsp infused butter or infused coconut oil</li>
              <li>1 tbsp regular butter (optional, for texture)</li>
              <li>1 tsp vanilla extract</li>
              <li>Pinch of salt</li>
            </ul>
          </div>

          <div className="space-y-4">
            {[
              {
                t: "Step 1 - Melt gently",
                d: "Heat condensed milk and chocolate chips over low heat, stirring constantly until smooth. Avoid boiling.",
              },
              {
                t: "Step 2 - Add infused fat off heat",
                d: "Turn off heat, then mix in infused butter/oil, vanilla, and salt. Keeping THC away from high heat helps preserve potency.",
              },
              {
                t: "Step 3 - Set and portion",
                d: "Spread into a parchment-lined 8x8 pan. Chill 2 to 3 hours. Cut into equal squares and label with mg per piece.",
              },
            ].map(({ t, d }) => (
              <div key={t} className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                <p className="font-black text-gray-900">{t}</p>
                <p className="text-gray-700 text-sm mt-1">{d}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-950 rounded-2xl p-6">
            <p className="text-amber-300 text-xs uppercase tracking-widest mb-2">Quick dose math</p>
            <p className="text-white text-sm leading-relaxed">
              <span className="font-semibold">mg per square = total mg in infused fat / number of squares.</span> Example: if
              your infused fat contributes 250mg THC total and you cut 25 equal squares, each piece is about 10mg.
            </p>
            <p className="text-gray-300 text-xs mt-3">
              Start with half a square if the batch is new, and wait at least 90 minutes before taking more.
            </p>
          </div>

          <div className="space-y-3 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">Why fudge is a dosing-friendly format</h2>
            <p>
              Fudge sets into a slab you can slice with a ruler and a sharp knife. That beats loose sauces or spooned spreads
              where “one spoonful” is subjective. Chocolate also masks grassy flavors better than lightly sweetened baked goods,
              which helps guests focus on portion size instead of taste surprises.
            </p>
            <p>
              Use a straight-sided pan and line it so the slab lifts out cleanly. Uneven pans or rounded silicone corners make
              equal squares harder — and equal squares are what make your milligram math honest.
            </p>
          </div>

          <div className="space-y-3 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">Texture tips and troubleshooting</h2>
            <p>
              If you crank the heat while melting chocolate, you risk scorching and a grainy finish. If you skip chilling
              time, you will get soft slabs that smear when cut — and smeared cuts make portion sizes lie. If fudge is too soft
              after chilling, it often needs more time in the fridge or a slightly firmer ratio next time; do not “fix” it by
              randomly adding more infused fat without re-running the calculator.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
            <h3 className="font-black text-amber-900">Storage and labeling</h3>
            <p className="text-sm text-gray-700">
              Store cut squares in a single layer or with parchment between layers so they do not weld together. Label the
              container with mg per piece and the date. Fudge looks like regular candy on a counter — treat it like anything
              else you would not leave unmarked around kids or pets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/edibles-calculator"
              className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black px-6 py-3 rounded-xl"
            >
              Calculate mg per piece <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/learn/articles/thc-per-serving-calculator"
              className="inline-flex items-center justify-center gap-2 border-2 border-amber-600 text-amber-800 font-black px-6 py-3 rounded-xl hover:bg-amber-50"
            >
              Learn dose formulas
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
