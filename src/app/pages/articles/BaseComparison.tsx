import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Beaker, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function BaseComparison() {
  const relatedArticles = [
    { title: "Beginner Cooking Guide", path: "/learn/articles/beginner-guide" },
    { title: "Convert ANY Recipe", path: "/learn/articles/convert-recipes" },
    { title: "Easy THC Recipes", path: "/learn/articles/easy-recipes" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Base Comparison</span>
      </div>

      <Card className="bg-white border-orange-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl text-gray-900 mb-3">
                THC Butter vs Oil vs Syrup: What Should You Use?
              </CardTitle>
              <Badge className="bg-orange-600 text-white">Comparison</Badge>
            </div>
            <Beaker className="w-12 h-12 text-orange-600 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Different THC bases create completely different results because of how cannabinoids interact with different molecular carriers. Understanding the science behind lipophilicity (fat-loving properties) and bioavailability is key to choosing the right infusion method.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🧬 The Science: Why THC Needs a Carrier</h3>
            <p className="text-gray-700 mb-3">
              <strong>Cannabinoids are lipophilic</strong>—they dissolve in fats and oils but NOT in water. This is because THC molecules are non-polar (hydrophobic), meaning they repel water molecules.
            </p>
            <p className="text-gray-700 mb-3">
              When you infuse cannabis into a carrier base, you're creating a <strong>colloidal suspension</strong> where cannabinoid molecules bind to the fat, alcohol, or sugar molecules. This binding process is what makes THC orally bioavailable.
            </p>
            <p className="text-gray-700">
              Different carriers affect <strong>absorption rate</strong>, <strong>first-pass metabolism</strong>, and <strong>duration of effects</strong> in your body.
            </p>
          </div>

          <div className="space-y-5">
            {/* BUTTER */}
            <div className="bg-orange-50 p-5 rounded-lg border-2 border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-xl">🧈 Cannabutter (Fat-Based Infusion)</h3>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">BEST FOR:</p>
                <p className="text-gray-700">Cookies, brownies, cakes, pastries, sauces, any baked goods</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">MOLECULAR STRUCTURE:</p>
                <p className="text-gray-700">Butter contains <strong>saturated and unsaturated fatty acids</strong> (triglycerides) that create strong Van der Waals forces with THC molecules. The fat content (80-82%) provides maximum binding sites for cannabinoids.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ABSORPTION & METABOLISM:</p>
                <p className="text-gray-700">THC bound to saturated fats undergoes <strong>hepatic first-pass metabolism</strong> in the liver, converting delta-9-THC into <strong>11-hydroxy-THC</strong>—a metabolite that's 2-3x more psychoactive and crosses the blood-brain barrier more efficiently.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ONSET & DURATION:</p>
                <p className="text-gray-700">45-120 minutes onset | 6-8 hours duration | Peak at 2-3 hours</p>
              </div>

              <div className="bg-orange-100 p-3 rounded border border-orange-300">
                <p className="text-sm text-gray-800"><strong>⚗️ Science Tip:</strong> Butter's <strong>emulsifiers (lecithin)</strong> help distribute THC evenly throughout baked goods, preventing "hot spots" of concentrated cannabinoids.</p>
              </div>
            </div>

            {/* OIL */}
            <div className="bg-green-50 p-5 rounded-lg border-2 border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-xl">🫒 Cannabis Oil (Lipid-Based Infusion)</h3>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">BEST FOR:</p>
                <p className="text-gray-700">Sautéing, salad dressings, smoothies, savory dishes, capsules</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">MOLECULAR STRUCTURE:</p>
                <p className="text-gray-700">Coconut oil (MCT) contains <strong>medium-chain triglycerides</strong> (C8-C12 fatty acids) that are metabolized differently than butter. Olive oil contains <strong>monounsaturated fats (oleic acid)</strong> with different binding affinities.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ABSORPTION & METABOLISM:</p>
                <p className="text-gray-700"><strong>MCT oil (coconut)</strong> bypasses some first-pass metabolism and goes directly into the <strong>portal vein</strong>, resulting in faster onset. <strong>Long-chain fatty acids (olive oil)</strong> follow the lymphatic system via <strong>chylomicron formation</strong>, providing sustained release.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ONSET & DURATION:</p>
                <p className="text-gray-700">MCT: 30-90 min onset | 4-6 hours | Olive: 60-120 min onset | 6-8 hours</p>
              </div>

              <div className="bg-green-100 p-3 rounded border border-green-300">
                <p className="text-sm text-gray-800"><strong>⚗️ Science Tip:</strong> MCT oil increases <strong>ketone production</strong> in the liver, which may enhance cannabinoid absorption through increased intestinal permeability.</p>
              </div>
            </div>

            {/* SYRUP/SUGAR */}
            <div className="bg-amber-50 p-5 rounded-lg border-2 border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-xl">🍯 Cannabis Syrup (Sugar-Alcohol Infusion)</h3>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">BEST FOR:</p>
                <p className="text-gray-700">Drinks, cocktails, pancakes, coffee, tea, dessert toppings</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">MOLECULAR STRUCTURE:</p>
                <p className="text-gray-700">Cannabis syrup uses <strong>glycerin or alcohol as a solvent</strong> to create a cannabis tincture, then suspends it in a sugar matrix. The <strong>hydroxyl groups (OH-)</strong> in glycerin form hydrogen bonds with cannabinoids.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ABSORPTION & METABOLISM:</p>
                <p className="text-gray-700">When mixed with liquids, some <strong>sublingual absorption</strong> occurs (direct bloodstream entry via mucous membranes), bypassing first-pass metabolism. The remaining enters through the <strong>gastric mucosa</strong> for faster GI absorption than fats.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ONSET & DURATION:</p>
                <p className="text-gray-700">15-60 minutes onset | 3-5 hours duration | Peak at 1-2 hours</p>
              </div>

              <div className="bg-amber-100 p-3 rounded border border-amber-300">
                <p className="text-sm text-gray-800"><strong>⚗️ Science Tip:</strong> Sugar increases <strong>gastric emptying rate</strong>, which can accelerate THC delivery to the small intestine where absorption occurs.</p>
              </div>
            </div>

            {/* TINCTURE */}
            <div className="bg-purple-50 p-5 rounded-lg border-2 border-purple-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-xl">🧪 THC Tincture (Alcohol Extraction)</h3>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">BEST FOR:</p>
                <p className="text-gray-700">Precision dosing, drinks, sublingual use, mixing into recipes</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">MOLECULAR STRUCTURE:</p>
                <p className="text-gray-700">High-proof ethanol (<strong>ethyl alcohol, C₂H₅OH</strong>) acts as a polar aprotic solvent that efficiently extracts both cannabinoids and terpenes. Alcohol's amphipathic nature (both hydrophilic and lipophilic) allows it to dissolve THC completely.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ABSORPTION & METABOLISM:</p>
                <p className="text-gray-700"><strong>Sublingual administration</strong> allows THC to diffuse directly through the oral mucosa into the <strong>sublingual artery</strong>, reaching systemic circulation in 15-30 minutes. This bypasses hepatic metabolism, delivering delta-9-THC (not 11-hydroxy-THC), resulting in a different effect profile.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ONSET & DURATION:</p>
                <p className="text-gray-700">Sublingual: 15-45 min onset | 3-5 hours | Swallowed: 45-90 min | 5-7 hours</p>
              </div>

              <div className="bg-purple-100 p-3 rounded border border-purple-300">
                <p className="text-sm text-gray-800"><strong>⚗️ Science Tip:</strong> Holding tincture under your tongue for 60-90 seconds maximizes <strong>transmucosal absorption</strong> through the highly vascularized sublingual tissue.</p>
              </div>
            </div>

            {/* DISTILLATE */}
            <div className="bg-pink-50 p-5 rounded-lg border-2 border-pink-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-xl">💧 THC Distillate (Pure Concentrate)</h3>
              
              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">BEST FOR:</p>
                <p className="text-gray-700">Exact dosing, chocolate, gummies, professional recipes, capsules</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">MOLECULAR STRUCTURE:</p>
                <p className="text-gray-700">Distillate is <strong>85-95% pure THC</strong> extracted through <strong>short-path distillation</strong> using fractional distillation at specific temperatures (157°C for THC). This removes all plant matter, leaving only cannabinoid molecules.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ABSORPTION & METABOLISM:</p>
                <p className="text-gray-700">Because distillate contains no carrier fats, it MUST be mixed with lipids for oral bioavailability. The <strong>decarboxylated THC</strong> is already activated (no THCA), providing maximum potency. When properly emulsified, absorption follows the same pathway as oil-based edibles.</p>
              </div>

              <div className="mb-3">
                <p className="text-sm text-gray-600 font-semibold mb-1">ONSET & DURATION:</p>
                <p className="text-gray-700">Depends entirely on the carrier: 30-120 minutes onset | 4-8 hours duration</p>
              </div>

              <div className="bg-pink-100 p-3 rounded border border-pink-300">
                <p className="text-sm text-gray-800"><strong>⚗️ Science Tip:</strong> Distillate must be <strong>emulsified with lecithin</strong> to create micelles (tiny fat droplets) that increase surface area for intestinal absorption.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-100 to-red-100 p-5 rounded-lg border-2 border-orange-300">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🎯 Bottom Line: Match the Base to Your Recipe</h3>
            <ul className="space-y-2 text-gray-800">
              <li><strong>• Need slow, powerful effects?</strong> → Use butter (creates 11-hydroxy-THC)</li>
              <li><strong>• Want faster onset?</strong> → Use MCT oil or tincture</li>
              <li><strong>• Making drinks?</strong> → Use syrup or tincture</li>
              <li><strong>• Need exact dosing?</strong> → Use distillate with measured carrier</li>
              <li><strong>• Baking anything?</strong> → Butter wins for even distribution</li>
            </ul>
            <p className="text-gray-900 mt-4">
              <strong>Remember:</strong> You're not just choosing a flavor—you're choosing how the cannabinoids will enter your bloodstream and metabolize in your body. That's why the same 10mg dose can feel completely different depending on the carrier!
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Related Articles</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {relatedArticles.map((article) => (
            <Link
              key={article.path}
              to={article.path}
              className="p-4 bg-white border border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 group-hover:text-orange-700">{article.title}</span>
                <ArrowRight className="w-4 h-4 text-orange-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
