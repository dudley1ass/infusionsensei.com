import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
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
        <CardContent className="space-y-6 text-gray-700">
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
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-gray-900">Pro tip:</p>
            <p className="text-sm">Run the exact mg-per-serving math for your chosen ratio before baking.</p>
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
