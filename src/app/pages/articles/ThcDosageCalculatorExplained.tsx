import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ArrowRight, Calculator } from "lucide-react";
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
        <CardContent className="space-y-6 text-gray-700">
          <p>
            A dosage calculator answers one question: <strong>how many mg THC are in each serving?</strong>
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm">
            total_mg = grams × THC% × 1000 × efficiency<br />
            mg_per_serving = total_mg ÷ servings
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>grams</strong>: cannabis used (e.g. 7g)</li>
            <li><strong>THC%</strong>: flower potency (e.g. 20%)</li>
            <li><strong>efficiency</strong>: extraction + transfer loss (typically 0.6 to 0.8)</li>
            <li><strong>servings</strong>: actual pieces or portions</li>
          </ul>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">
              Most homemade batches are accidentally too strong because servings are overestimated.
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
        </CardContent>
      </Card>
    </div>
  );
}
