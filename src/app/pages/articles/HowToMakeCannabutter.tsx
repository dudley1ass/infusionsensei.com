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
        <CardContent className="space-y-8 text-gray-700">
          <p>
            Cannabutter is the backbone of home edibles because most baking recipes already expect butter. The process is
            simple on paper — decarb, infuse at low heat, strain, cool — but consistency comes from temperature discipline and
            honest labeling. This guide sticks to a stove-top method that works in most kitchens without specialized gear.
          </p>
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

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Why temperature matters more than Instagram timing</h2>
            <p>
              THC degrades with enough heat and time. A rolling boil or a dry pan that spikes above your target range is how
              batches end up sleepy or uneven. Keep the mixture <strong>under a gentle simmer</strong>; small bubbles at the
              edge of the pot are fine, aggressive churning is not. If you smell burning plant, you have already gone too far —
              start over with fresh fat rather than serving questionable butter.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Straining and cleanup</h2>
            <p>
              Squeeze cheesecloth gently — wringing like a dishrag pushes more chlorophyll into the fat, which can taste harsh.
              Let gravity do most of the work. Pour into a glass container, cool until the butter solidifies on top of the
              water, then poke a hole and drain the water. Pat the bottom of the butter puck dry before storage.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-amber-900 mb-1">Dosing note</p>
            <p>
              Potency varies by flower THC% and efficiency. Always run your numbers in the calculator
              before serving.
            </p>
            <p className="text-sm text-amber-900/90">
              Write total mg THC (or mg per gram of butter) on the lid while you still remember which batch it is. Frozen
              cannabutter looks identical to plain butter after a month.
            </p>
          </div>

          <div className="space-y-2 text-sm border border-gray-200 rounded-xl p-4 bg-gray-50">
            <p className="font-semibold text-gray-900">If something goes wrong</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Water boiled off: add more hot water and bring back to a gentle simmer — do not leave the pot dry.</li>
              <li>Butter smells like lawn: you may have overheated or over-squeezed; label it weak and use in savory dishes with strong flavors.</li>
              <li>Effects feel weak: confirm decarb first, then revisit efficiency in the calculator before increasing flower.</li>
            </ul>
          </div>

          <p className="text-sm text-gray-600">
            New to decarbing? Read the{" "}
            <Link to="/learn/articles/decarboxylation-guide" className="text-green-700 font-semibold hover:underline">
              decarboxylation guide
            </Link>{" "}
            before changing your infusion times.
          </p>

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
