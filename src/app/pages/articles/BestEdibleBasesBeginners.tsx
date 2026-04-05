import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Beaker, ArrowRight, Leaf, FlaskConical } from "lucide-react";
import { Link } from "react-router";

export function BestEdibleBasesBeginners() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Helmet>
        <title>Best Edible Bases for Beginners (Butter, Oil, Tincture) | Infusion Sensei</title>
        <meta
          name="description"
          content="Which THC base to start with: cannabutter, coconut oil, olive oil, tincture, or honey. Simple rules for baking, drinks, and no-bake recipes — plus how to dose with our builder."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/best-edible-bases-beginners" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">
          Learn
        </Link>{" "}
        / <span className="text-gray-900">Best Edible Bases for Beginners</span>
      </div>

      <Card className="bg-white border-green-200 shadow-lg">
        <CardHeader>
          <Badge className="bg-green-600 text-white mb-3">Start here</Badge>
          <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">Best Edible Bases for Beginners</CardTitle>
          <p className="text-lg text-gray-600">
            If you’re new to edibles, start with one reliable base, learn how strong it is, then plug it into recipes. Here’s how to pick — without buying every gadget on the internet.
          </p>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-2">The rule that fixes 80% of mistakes</h2>
            <p>
              <strong>Match fat to your recipe.</strong> Baked goods and sauces love butter or oil. Drinks and gummies often want alcohol tincture or a water-friendly mix. If you put the wrong carrier in the wrong food, you’ll fight taste, texture, and potency all at once.
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🧈</span> Cannabutter (best first baking base)
            </h2>
            <p>
              Use for brownies, cookies, mashed potatoes, and anything that already wants butter. It’s forgiving, familiar, and easy to portion into tablespoons or grams once you know{" "}
              <strong>mg THC per gram</strong> of your batch.
            </p>
            <p className="text-sm text-gray-600">
              Next step: save your batch on <Link to="/infusions" className="text-green-700 font-semibold underline">My Infusions</Link>, then select it in the{" "}
              <Link to="/ingredients" state={{ resetStartHere: true }} className="text-green-700 font-semibold underline">recipe builder</Link> so servings math stays honest.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Beaker className="w-6 h-6 text-amber-600" />
              Coconut or olive oil (best for savory & high-heat)
            </h2>
            <p>
              Use coconut oil for popcorn, curries, and vegan baking. Use olive oil for dressings, marinades, and finishing sauces. Oils are flexible — label whether your infusion is measured in <strong>ml</strong> or <strong>g</strong> when you dose.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-purple-600" />
              Alcohol tincture (best for drinks & precision drops)
            </h2>
            <p>
              Use when you need THC in liquids without adding fat — or when you want a few milligrams at a time. Start with the lowest dose you can measure; tinctures are easy to “stack” by mistake on a slow onset.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-green-600" />
              Honey & syrups (best for sweet pantry staples)
            </h2>
            <p>
              Great for tea, coffee, and simple recipes where sugar carries flavor. Stir thoroughly — cannabinoids need even distribution every time.
            </p>
          </section>

          <Separator />

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Questions beginners actually ask</h2>
            <div className="space-y-4 text-gray-700">
              <div>
                <p className="font-semibold text-gray-900">Can I mix butter and oil in one recipe?</p>
                <p>
                  Sometimes — but only if the recipe already expects both. What you should not do is randomly swap carriers
                  without checking how much of each is infused. If half the fat is plain and half is infused, only the infused
                  half contributes THC, and your calculator needs to reflect that split.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Which base is “strongest”?</p>
                <p>
                  Strength comes from concentration, not from butter being magically stronger than oil. A small batch of
                  coconut oil made with the same grams of flower as a large batch of butter will feel stronger per teaspoon
                  because there is less total fat diluting the cannabinoids.
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Do I need every infusion type?</p>
                <p>
                  No. Master one base, learn its real potency in your kitchen, then branch out when a recipe truly needs a
                  different carrier. Buying five half-finished jars in the fridge is how people lose track of what is safe to
                  serve friends.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <h3 className="font-bold text-green-900 mb-2">Turn this into a system</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-800">
              <li>Pick one base and make a small batch.</li>
              <li>Save potency on My Infusions (mg per gram or ml).</li>
              <li>Build a recipe in the builder and use your saved base for real batch THC.</li>
              <li>Wait a full two hours before taking more — especially with new batches.</li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              to="/learn/articles/infusion-comparison"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border-2 border-green-200 px-5 py-3 font-bold text-green-800 hover:bg-green-50"
            >
              Oil vs butter vs tincture <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/infusions"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700"
            >
              Open My Infusions
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
