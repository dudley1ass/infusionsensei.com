import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Link } from "react-router";
import { Users, ArrowRight } from "lucide-react";

export function MgThcPerServingPartyEdibles() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>mg THC Per Serving for Party Edibles (Safe Ranges) | Infusion Sensei</title>
        <meta
          name="description"
          content="Target mg THC per serving for parties: social doses, mixed tolerance guests, labeling, and how to pair wings and dips without accidental stacking."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/mg-thc-per-serving-party-edibles" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">
          Learn
        </Link>{" "}
        / <span className="text-gray-900">mg THC Per Serving — Parties</span>
      </div>
      <Card className="bg-white border-emerald-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-emerald-600 text-white mb-3">Hosting</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">mg THC Per Serving When You’re Feeding a Crowd</CardTitle>
              <p className="text-lg text-gray-600">
                Parties fail dosing when portions are vague and guests stack snacks. Anchor everything to a labeled serving size and a predictable mg number.
              </p>
            </div>
            <Users className="w-14 h-14 text-emerald-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 font-black">Guest type</th>
                  <th className="p-3 font-black">Starting target / serving</th>
                  <th className="p-3 font-black">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3 font-semibold text-gray-900">Low / first edible</td>
                  <td className="p-3 text-gray-700">2.5–5 mg</td>
                  <td className="p-3 text-gray-600">One labeled item only; no “mystery” punch.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-gray-900">Social / casual</td>
                  <td className="p-3 text-gray-700">5–10 mg</td>
                  <td className="p-3 text-gray-600">Works for wings or dips if you do not double-sauce.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-gray-900">Experienced</td>
                  <td className="p-3 text-gray-700">10–15 mg</td>
                  <td className="p-3 text-gray-600">Still label clearly; alcohol multiplies clumsiness, not consent.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">Avoid “stacking” accidents</h2>
            <p className="text-gray-700">
              If wings are infused <em>and</em> the dip is infused, guests can double dose without realizing. Pick <strong>one hero infusion per plate</strong> or keep one lane completely non-infused.
            </p>
            <p className="text-gray-700">
              Stacking also happens when people graze: a few crackers, a second pass at the snack table, and a drink they forgot
              was infused. Time zones blur after the first hour. That is why predictable mg numbers per <strong>labeled</strong>{" "}
              serving matter more at parties than at solo sessions.
            </p>
          </div>

          <div className="space-y-3 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">How to explain doses without being a buzzkill</h2>
            <p>
              Guests do not need a chemistry lecture — they need clear guardrails. A simple script works: “Each wing is about X
              mg; start with one and wait two hours before more.” If someone pushes for a stronger experience, you can still
              hold the line by offering a second serving after a real waiting period rather than doubling up immediately.
            </p>
            <p>
              Keep non-infused snacks abundant and obvious. Hunger and alcohol can nudge people toward “just one more” without
              thinking. Water and plain food belong on the same table as the fun stuff.
            </p>
          </div>

          <div className="space-y-3 text-gray-700">
            <h2 className="text-2xl font-bold text-gray-900">Kids, pets, and overnight guests</h2>
            <p>
              Treat infused platters like any serious allergen: height, signage, and a default assumption that children will
              grab whatever looks like dessert. Pets are not immune — chocolate and THC do not mix for dogs. When the party
              winds down, walk the kitchen once for stray toothpicks, unlabeled containers, and half-finished plates before
              people pack leftovers.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5">
            <h3 className="font-black text-emerald-900 mb-2">Why the table matters as much as the recipe</h3>
            <p className="text-sm text-emerald-900/90">
              The safest batch is still risky if portions are vague. A written mg target per guest for the hero item — multiplied
              by headcount — gives you a budget before you cook. Party Mode helps you stay inside that budget so you are not
              doing mental math with a timer on the oven.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/party-mode" className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-6 py-3 rounded-xl">
              Plan a party pack <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/learn/articles/how-to-dose-edibles-safely"
              className="inline-flex items-center justify-center gap-2 border-2 border-emerald-600 text-emerald-800 font-black px-6 py-3 rounded-xl hover:bg-emerald-50"
            >
              Full dosing safety guide →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
