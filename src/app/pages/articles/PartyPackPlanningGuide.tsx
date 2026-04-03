import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { PartyPopper, ArrowRight } from "lucide-react";

export function PartyPackPlanningGuide() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Cannabis Party Pack Planning: Food, Dose & Groceries | Infusion Sensei</title>
        <meta
          name="description"
          content="Plan a cannabis party pack: pick a hero recipe path (wings, snacks, calculator-first), set mg targets per guest, and use Party Mode for grocery lists and splits."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/cannabis-party-pack-planning" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">
          Learn
        </Link>{" "}
        / <span className="text-gray-900">Party Pack Planning</span>
      </div>
      <Card className="bg-white border-violet-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-violet-600 text-white mb-3">Party Mode</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">Cannabis Party Pack Planning in Three Decisions</CardTitle>
              <p className="text-lg text-gray-600">
                Chaos comes from trying to infuse everything. Choose one spotlight dish, one dose lane for beginners, and one grocery run — then let tooling handle the list.
              </p>
            </div>
            <PartyPopper className="w-14 h-14 text-violet-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            {[
              {
                t: "Decision 1 — Hero path",
                d: "Wings, party snacks, or drinks? Pick the category where fat-based sauces make dosing obvious. Secondary items stay non-infused or very low.",
              },
              {
                t: "Decision 2 — Guest math",
                d: "Count adults, not “maybe.” Multiply by your target mg per person for the hero item only. Write it on a sticky note next to the stove.",
              },
              {
                t: "Decision 3 — Marketing hygiene",
                d: "If you post clips or flyers, add UTM parameters to links so you learn which platform actually drives signups.",
              },
            ].map(({ t, d }) => (
              <div key={t} className="bg-violet-50 border border-violet-100 rounded-2xl p-4">
                <p className="font-black text-gray-900">{t}</p>
                <p className="text-gray-700 text-sm mt-1">{d}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/party-mode" className="inline-flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-black px-6 py-3 rounded-xl">
              Open Party Mode <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/learn/articles/mg-thc-per-serving-party-edibles"
              className="inline-flex items-center justify-center gap-2 border-2 border-violet-600 text-violet-800 font-black px-6 py-3 rounded-xl hover:bg-violet-50"
            >
              Party mg targets →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
