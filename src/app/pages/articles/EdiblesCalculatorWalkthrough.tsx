import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Calculator, ArrowRight } from "lucide-react";

export function EdiblesCalculatorWalkthrough() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>How to Use the THC Edibles Calculator (Step by Step) | Infusion Sensei</title>
        <meta
          name="description"
          content="Walk through Infusion Sensei's THC calculator: flower potency, infusion yield, recipe fat, servings — and how to sanity-check mg per portion before you serve."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/edibles-calculator-walkthrough" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">
          Learn
        </Link>{" "}
        / <span className="text-gray-900">Edibles Calculator Walkthrough</span>
      </div>
      <Card className="bg-white border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-blue-600 text-white mb-3">Calculator</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">How to Use the THC Edibles Calculator</CardTitle>
              <p className="text-lg text-gray-600">
                The calculator is only as honest as your inputs. Here is the order we recommend so you do not double-count THC or forget a dilution step.
              </p>
            </div>
            <Calculator className="w-14 h-14 text-blue-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Lock your starting material",
                body: "Enter THC% from a lab label if you have one. If not, use a conservative estimate — homemade variance is the #1 source of “it hit too hard.”",
              },
              {
                step: "2",
                title: "Account for infusion, not just flower",
                body: "Your infused oil or butter is what actually goes into the recipe. If you only use part of a batch, measure that weight in grams and only count the THC that dissolved into it.",
              },
              {
                step: "3",
                title: "Match fat in the recipe",
                body: "Replace ordinary butter or oil with infused fat 1:1 where the recipe allows. If you split the fat (half plain, half infused), only the infused half carries THC.",
              },
              {
                step: "4",
                title: "Divide by real portions",
                body: "Cut brownies into the number you actually plan to serve — not “about 12.” Party slices that vary in size will vary in mg.",
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="flex gap-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm flex-shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-black text-gray-900">{title}</p>
                  <p className="text-gray-600 text-sm mt-1">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-950 rounded-2xl p-6 text-center">
            <p className="text-green-400 text-xs uppercase tracking-widest mb-2">Sanity check</p>
            <p className="text-white text-lg font-black">If mg per serving looks “too fun,” cut infused fat with plain fat and re-run the numbers.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/edibles-calculator" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black px-6 py-3 rounded-xl">
              Open calculator <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/learn/articles/thc-dosage-calculator-explained"
              className="inline-flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-800 font-black px-6 py-3 rounded-xl hover:bg-blue-50"
            >
              Deep dive: what each field means →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
