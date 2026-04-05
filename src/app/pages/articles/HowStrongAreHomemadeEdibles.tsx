import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export function HowStrongAreHomemadeEdibles() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>How Strong Are Homemade Edibles? (Real Ranges)</title>
        <meta
          name="description"
          content="Learn how strong homemade edibles usually are, why they vary so much, and how to get safer, repeatable mg per serving every batch."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/how-strong-are-homemade-edibles" />
      </Helmet>

      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">How Strong Are Homemade Edibles</span>
      </div>

      <Card className="bg-white border-orange-200 shadow-lg">
        <CardHeader>
          <Badge className="bg-orange-600 text-white mb-3 w-fit">Potency • 5 min read</Badge>
          <CardTitle className="text-3xl text-gray-900">How Strong Are Homemade Edibles?</CardTitle>
          <p className="text-gray-600">Short answer: usually stronger than people expect.</p>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700">
          <p>
            A common first batch lands anywhere from <strong>10mg to 60mg THC per serving</strong>, depending
            on flower strength, efficiency, and how servings are cut.
          </p>
          <p>
            Dispensary edibles are tested in labs and (where regulations require it) labeled within a tolerance window.
            Homemade edibles are only as accurate as your notebook. That does not mean home cooking is “wrong” — it means you
            should expect <strong>wider variance</strong> unless you standardize decarb, infusion, and portioning the same way
            every time.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="border rounded-xl p-3 bg-green-50"><p className="font-bold">Low</p><p>2.5-5mg</p></div>
            <div className="border rounded-xl p-3 bg-yellow-50"><p className="font-bold">Medium</p><p>5-15mg</p></div>
            <div className="border rounded-xl p-3 bg-red-50"><p className="font-bold">High</p><p>15mg+</p></div>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Why batches vary</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>THC% of flower can differ by 2x from strain to strain</li>
            <li>Decarb and infusion efficiency can swing 20-30%</li>
            <li>Uneven mixing and inaccurate serving cuts change dose per piece</li>
          </ul>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">What “per serving” actually means</h2>
            <p>
              A pan of brownies does not dose itself. If you eyeball twelve pieces and one end is twice as thick as the other,
              those two bites are not the same milligrams. The same problem hits sauces: the last wing in the bowl can sit in
              pooled fat. For firmer numbers, weigh the finished batch, divide by the number of portions, or measure sauce per
              wing with a scale. It feels fussy until you host someone with a lower tolerance than yours.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Why smoking tolerance misleads people</h2>
            <p>
              Inhaled THC skips first-pass liver metabolism. Swallowed THC does not. People who smoke daily can still be
              floored by a modest edible because the pharmacokinetics differ. Strength is not a contest — it is a match between
              dose, timing, and your body that day (sleep, food, alcohol, hydration).
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
            <p className="text-blue-900 font-semibold">Best move:</p>
            <p className="text-blue-800 text-sm">
              Calculate first, then portion by weight or equal-size cuts. Reuse the same recipe and infusion notes so you are
              comparing apples to apples on batch two.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/edibles-calculator" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl">
              Calculate Strength Now <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/party-mode" className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-700 hover:bg-green-50 font-bold px-5 py-2.5 rounded-xl">
              Plan a Party Pack <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
