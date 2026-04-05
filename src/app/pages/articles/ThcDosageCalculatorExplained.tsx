import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ArrowRight, Calculator, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export function ThcDosageCalculatorExplained() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>THC Dosage Calculator Explained (Beginner Guide)</title>
        <meta
          name="description"
          content="Understand how a THC dosage calculator works: total THC, infusion efficiency, servings, and how to avoid accidentally over-dosing homemade edibles."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/thc-dosage-calculator-explained" />
      </Helmet>

      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">THC Dosage Calculator Explained</span>
      </div>

      <Card className="bg-white border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className="bg-blue-600 text-white mb-3">Calculator • 5 min read</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-2">THC Dosage Calculator Explained</CardTitle>
              <p className="text-gray-600">What the numbers mean and how to use them safely.</p>
            </div>
            <Calculator className="w-10 h-10 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700">
          <p>
            A dosage calculator answers one question: <strong>how many mg THC are in each serving?</strong> Getting that
            number right is what separates predictable home cooking from “I have no idea why last night was different from
            tonight.” The calculator does not guess your tolerance for you — it turns your inputs into honest math so you can
            decide what a sensible portion looks like.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm">
            total_mg = grams × THC% × 1000 × efficiency<br />
            mg_per_serving = total_mg ÷ servings
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>grams</strong>: cannabis used (e.g. 7g)</li>
            <li><strong>THC%</strong>: flower potency (e.g. 20%)</li>
            <li><strong>efficiency</strong>: extraction + transfer loss (typically 0.6 to 0.8)</li>
            <li><strong>servings</strong>: actual pieces or portions</li>
          </ul>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Why “efficiency” is not cheating — it is reality</h2>
            <p>
              No infusion captures 100% of the THC that appears on a label. Some stays in the plant matter you strain out.
              Some sticks to jars, utensils, and your hands. Heat and time also matter. That is why calculators use an
              efficiency slider or default: it is a humility factor for the real world. If you are new, stay on the
              conservative side (lower efficiency). You can always adjust upward once your batches feel consistent.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-2">
            <p className="font-bold text-blue-900">Worked example (rough)</p>
            <p className="text-sm text-blue-900/90">
              Suppose you use <strong>7g</strong> of flower labeled <strong>20% THC</strong>, you assume <strong>70%</strong>{" "}
              efficiency, and you cut the tray into <strong>16</strong> equal pieces. Total THC is approximately{" "}
              <strong>7 × 0.20 × 1000 × 0.70 = 980 mg</strong>, and each piece is about <strong>980 ÷ 16 ≈ 61 mg</strong> — far
              above a beginner dose. That is why the same brownie recipe feels “fine” to one person and overwhelming to
              another: the math was never checked against real portion sizes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-900">Where people mess up the inputs</h2>
            <div className="space-y-2">
              {[
                "Using an optimistic THC% because the bag “looked fire.” If you do not have a lab number, assume lower, not higher.",
                "Counting only the cannabutter in the pan but forgetting you only used half the batch in this recipe.",
                "Dividing by “about 12” brownies when the pan was actually cut into 9 large bars.",
                "Treating tincture drops like water — alcohol tinctures are easy to over-add by one extra squeeze.",
              ].map((line) => (
                <div key={line} className="flex gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5 space-y-2">
            <p className="font-bold text-green-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Use the answer to plan — not to race
            </p>
            <p className="text-sm text-green-900/90">
              Once you know mg per serving, compare it to how you actually want to feel. Many people aim for{" "}
              <strong>2.5–5 mg</strong> for a first session with a new batch, even if they smoke regularly. Edibles convert to
              11-hydroxy-THC in the liver; the curve feels different from inhalation. The calculator gives you the number; your
              patience and wait time handle the rest.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 font-semibold mb-1">The most common surprise</p>
            <p className="text-red-800 text-sm">
              Most homemade batches are accidentally too strong because servings are overestimated — or because “one brownie”
              was actually a corner piece loaded with extra chocolate chips and butter. Weighing the finished batch and
              dividing by count removes a huge slice of that chaos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/edibles-calculator" className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl">
              Open Calculator <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/ingredients" state={{ resetStartHere: true }} className="inline-flex items-center gap-2 bg-white border border-green-300 text-green-700 hover:bg-green-50 font-bold px-5 py-2.5 rounded-xl">
              Start Infusion Plan <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Related guides</h2>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/learn/articles/edibles-calculator-walkthrough" className="text-green-700 font-semibold hover:underline">
                  Field-by-field calculator walkthrough
                </Link>
              </li>
              <li>
                <Link to="/learn/articles/dosing-guide" className="text-green-700 font-semibold hover:underline">
                  How to dose THC edibles safely
                </Link>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
