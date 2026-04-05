import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export function WeedButterRatioGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>Weed Butter Ratio Guide (Mild, Medium, Strong)</title>
        <meta
          name="description"
          content="Use this weed butter ratio guide to choose mild, medium, or strong cannabutter. Includes grams-per-cup ranges and safer beginner recommendations."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/weed-butter-ratio-guide" />
      </Helmet>

      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Weed Butter Ratio Guide</span>
      </div>

      <Card className="bg-white border-purple-200 shadow-lg">
        <CardHeader>
          <Badge className="bg-purple-600 text-white mb-3 w-fit">Reference • 4 min read</Badge>
          <CardTitle className="text-3xl text-gray-900">Weed Butter Ratio Guide</CardTitle>
          <p className="text-gray-600">Pick your target strength before you infuse.</p>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700">
          <p>
            “Grams per cup of butter” is a shorthand for <strong>how concentrated your fat is</strong>. It does not, by
            itself, tell you how strong a cookie will be — you still need flower potency (THC%), how well you decarbed and
            infused, and how much infused fat ends up in each serving. Think of the ratio as choosing a lane: mild, medium, or
            strong before you commit butter to the batch.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="border border-green-200 bg-green-50 rounded-xl p-4">
              <p className="font-bold text-green-900">Mild</p>
              <p className="text-sm">3-5g flower per cup butter</p>
              <p className="text-xs mt-1">Best for beginners</p>
            </div>
            <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">
              <p className="font-bold text-yellow-900">Medium</p>
              <p className="text-sm">7-10g flower per cup butter</p>
              <p className="text-xs mt-1">Most home cooks</p>
            </div>
            <div className="border border-red-200 bg-red-50 rounded-xl p-4">
              <p className="font-bold text-red-900">Strong</p>
              <p className="text-sm">12-14g flower per cup butter</p>
              <p className="text-xs mt-1">Experienced users only</p>
            </div>
          </div>
          <p>
            Start lower than you think. You can always use more butter in a recipe, but you cannot
            remove THC once infused.
          </p>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">How ratio interacts with your recipe</h2>
            <p>
              A cup of cannabutter might replace all the fat in one batch of brownies but only half the fat in another. If your
              recipe calls for a half-cup of butter, you are only using <strong>half</strong> of your infused cup — so total
              THC in the pan is cut in half unless you dilute with plain butter on purpose. Always track{" "}
              <strong>grams of infused fat actually in the batter</strong>, not just “I used the strong batch.”
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Water in the pan: why most guides add it</h2>
            <p>
              Simmering cannabis in butter plus a little water helps prevent scorching and keeps temperature steadier. The
              water does not dilute THC in the final butter — you discard it after the fat solidifies. Skipping water is not
              automatically wrong, but beginners often burn small batches without it.
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-2">
            <p className="font-semibold text-gray-900">Pro tip:</p>
            <p className="text-sm">
              Run the exact mg-per-serving math for your chosen ratio before baking. Plug the same numbers into our calculator
              after you know your THC% and efficiency — then adjust the ratio up or down on the next batch instead of guessing
              by taste.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Titration strategy: two batches beat one heroic batch</h2>
            <p>
              If you are unsure, make a <strong>mild</strong> cup first. Use it in a recipe where you can cut small pieces
              (brownies, fudge bars) and note how you feel at 2.5–5 mg. Only then scale up the ratio. Jumping straight to
              “strong” because you smoke often is how people discover that liver metabolism does not care about your smoking
              tolerance.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">Quick checklist before you freeze or bake</h2>
            {[
              "Flower was decarbed before infusion (THCA is not the same as THC for edibles).",
              "You strained well and know the weight/volume of finished fat.",
              "Servings are counted as real cuts, not “about twelve.”",
              "Infused butter is labeled and stored away from regular butter.",
            ].map((line) => (
              <div key={line} className="flex gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/edibles-calculator" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl">
              Calculate This Ratio <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/infusions" className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-700 hover:bg-green-50 font-bold px-5 py-2.5 rounded-xl">
              Build My Infusion <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
