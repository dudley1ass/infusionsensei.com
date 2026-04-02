import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ArrowRight, ChefHat } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export function HowToMakeCannabutter() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>How to Make Cannabutter (Easy Step-by-Step)</title>
        <meta
          name="description"
          content="Learn how to make cannabutter step-by-step with beginner-safe ratios, timing, and dosing tips so your homemade edibles are consistent."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/how-to-make-cannabutter" />
      </Helmet>

      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">How to Make Cannabutter</span>
      </div>

      <Card className="bg-white border-emerald-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className="bg-emerald-600 text-white mb-3">Start Here • 6 min read</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-2">How to Make Cannabutter</CardTitle>
              <p className="text-gray-600">
                Quick beginner method: decarb, simmer low, strain, chill, and dose correctly.
              </p>
            </div>
            <ChefHat className="w-10 h-10 text-emerald-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-700">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="font-semibold text-emerald-900 mb-1">Simple baseline ratio</p>
            <p>1 cup butter + 1 cup water + 7g decarbed flower (for medium strength).</p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Step-by-step</h2>
            {[
              "Decarb at 240F for 35-40 minutes (foil-covered tray).",
              "Melt butter + water on very low heat.",
              "Add decarbed flower, keep between 160F and 180F for 2-3 hours.",
              "Stir occasionally. Never boil.",
              "Strain through cheesecloth.",
              "Chill. Separate butter from water and store labeled.",
            ].map((step, i) => (
              <p key={step}><strong>{i + 1}.</strong> {step}</p>
            ))}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="font-semibold text-amber-900 mb-1">Dosing note</p>
            <p>
              Potency varies by flower THC% and efficiency. Always run your numbers in the calculator
              before serving.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/edibles-calculator" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl">
              Calculate My Dose <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/party-mode" className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-700 hover:bg-green-50 font-bold px-5 py-2.5 rounded-xl">
              Start Party Mode <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
