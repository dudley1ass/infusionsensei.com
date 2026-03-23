import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function ConvertRecipes() {
  const relatedArticles = [
    { title: "Beginner Cooking Guide", path: "/learn/articles/beginner-guide" },
    { title: "Base Comparison", path: "/learn/articles/base-comparison" },
    { title: "Easy THC Recipes", path: "/learn/articles/easy-recipes" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>How to Turn ANY Recipe Into a THC Recipe | Infusion Sensei</title>
        <meta name="description" content="A 4-step system to convert any regular recipe into a cannabis-infused version with accurate dosing every time." />
        <meta property="og:title" content="How to Turn ANY Recipe Into a THC Recipe | Infusion Sensei" />
        <meta property="og:description" content="A 4-step system to convert any regular recipe into a cannabis-infused version with accurate dosing every time." />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/convert-recipes" />
      </Helmet>
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Convert Recipes</span>
      </div>

      <Card className="bg-white border-pink-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl text-gray-900 mb-3">
                How to Turn ANY Recipe Into a THC Recipe
              </CardTitle>
              <Badge className="bg-pink-600 text-white">Advanced</Badge>
            </div>
            <Sparkles className="w-12 h-12 text-pink-600 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            You don't need special recipes—you just need to understand <strong>molecular substitution</strong> and how cannabinoids bind to different carriers. Every recipe contains at least one THC-compatible ingredient.
          </p>

          {/* Mid-article CTA */}
          <div className="bg-green-50 border-2 border-green-400 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 no-print">
            <div className="flex-1">
              <p className="font-black text-green-900 text-lg">🧮 Calculate Your Exact THC Per Serving</p>
              <p className="text-green-700 text-sm mt-0.5">Enter your strain and recipe — get precise mg per serving in under 60 seconds.</p>
            </div>
            <Link to="/infusions" className="flex-shrink-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm whitespace-nowrap">
              Try It Free →
            </Link>
          </div>


          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🧪 The Core Principle: Cannabinoid Carriers</h3>
            <p className="text-gray-700 mb-3">
              THC molecules require a <strong>lipophilic (fat-loving) or amphipathic (fat + water-loving) carrier</strong> to be absorbed by your digestive system. Without a carrier, THC cannot cross the <strong>intestinal epithelial barrier</strong> and enter your bloodstream.
            </p>
            <p className="text-gray-700">
              Converting any recipe means identifying which ingredient acts as the carrier, then replacing it with (or adding to it) a cannabis-infused version of the same molecular type.
            </p>
          </div>

          {/* STEP 1 */}
          <div className="bg-pink-50 p-5 rounded-lg border-2 border-pink-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-xl">Step 1: Identify the Carrier Molecule Type</h3>
            
            <p className="text-gray-700 mb-4">
              Every recipe contains one or more of these three carrier types. Your job is to find them:
            </p>

            <div className="space-y-3 ml-4">
              <div className="bg-white p-3 rounded border border-pink-200">
                <p className="font-bold text-gray-900 mb-1">🧈 FAT / LIPID CARRIERS</p>
                <p className="text-sm text-gray-600 mb-2">Examples: Butter, oil, cream, cheese, coconut milk, avocado, nuts</p>
                <p className="text-sm text-gray-700"><strong>Why it works:</strong> Triglycerides and phospholipids form <strong>micelles</strong> in your intestines that encapsulate THC molecules, allowing them to pass through the lipid bilayer of intestinal cells via <strong>passive diffusion</strong>.</p>
              </div>

              <div className="bg-white p-3 rounded border border-pink-200">
                <p className="font-bold text-gray-900 mb-1">💧 LIQUID / SOLVENT CARRIERS</p>
                <p className="text-sm text-gray-600 mb-2">Examples: Water, milk, juice, coffee, tea, alcohol, broth</p>
                <p className="text-sm text-gray-700"><strong>Why it works:</strong> While water itself doesn't dissolve THC, alcohol-based tinctures or emulsified oils create <strong>colloidal suspensions</strong> where THC is dispersed throughout the liquid. Nano-emulsified THC uses <strong>surfactants</strong> to create particles &lt;100nm that bypass normal digestion.</p>
              </div>

              <div className="bg-white p-3 rounded border border-pink-200">
                <p className="font-bold text-gray-900 mb-1">🍯 SUGAR / SWEETENER CARRIERS</p>
                <p className="text-sm text-gray-600 mb-2">Examples: Sugar, honey, maple syrup, agave, chocolate</p>
                <p className="text-sm text-gray-700"><strong>Why it works:</strong> Sugar-based carriers use <strong>glycerin or alcohol solvents</strong> to dissolve THC, then suspend it in the sugar matrix. The hydroxyl groups (OH-) in sugars can form weak hydrogen bonds with cannabinoid molecules, maintaining dispersion.</p>
              </div>
            </div>

            <div className="bg-pink-100 p-3 rounded border border-pink-300 mt-4">
              <p className="text-sm text-gray-800"><strong>🔍 Analysis Trick:</strong> Read the recipe and ask: "What ingredient contains fat, dissolves in alcohol, or could be mixed with glycerin?" That's your carrier.</p>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="bg-pink-50 p-5 rounded-lg border-2 border-pink-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-xl">Step 2: Match THC Base to Carrier Type</h3>
            
            <p className="text-gray-700 mb-4">
              Once you've identified the carrier type, select the appropriate THC infusion that has the <strong>same molecular properties</strong>:
            </p>

            <div className="space-y-3 ml-4">
              <div className="bg-white p-4 rounded border-l-4 border-yellow-500">
                <p className="font-bold text-gray-900 mb-2">FAT CARRIER → Infused Butter/Oil</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Replacement Strategy:</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>1:1 Substitution</strong> - Replace butter with cannabutter (same fat content)</li>
                  <li>• <strong>Partial Substitution</strong> - Use 50% regular + 50% infused (better flavor control)</li>
                  <li>• <strong>Oil Types</strong> - Match the fat profile: coconut for tropical, olive for savory, MCT for neutral</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2"><strong>Molecular Match:</strong> THC binds to triglyceride molecules via Van der Waals forces. The more saturated the fat, the more stable the binding.</p>
              </div>

              <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                <p className="font-bold text-gray-900 mb-2">LIQUID CARRIER → THC Tincture or Water-Soluble THC</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Addition Strategy:</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Alcohol-Based Tincture</strong> - Add directly to liquids (alcohol acts as co-solvent)</li>
                  <li>• <strong>Glycerin Tincture</strong> - Better for non-alcoholic drinks (vegetable glycerin is water-miscible)</li>
                  <li>• <strong>Nano-Emulsion</strong> - Pre-processed THC in &lt;100nm droplets with surfactants</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2"><strong>Molecular Match:</strong> Tinctures use ethanol's amphipathic properties to create a homogeneous solution. Nano-emulsions use <strong>lecithin or polysorbate 80</strong> as emulsifying agents.</p>
              </div>

              <div className="bg-white p-4 rounded border-l-4 border-amber-500">
                <p className="font-bold text-gray-900 mb-2">SUGAR CARRIER → Cannabis Syrup or Honey</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Addition Strategy:</strong></p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Direct Replacement</strong> - Swap regular syrup for infused syrup</li>
                  <li>• <strong>Drizzle Method</strong> - Add on top after cooking (preserves terpenes)</li>
                  <li>• <strong>Mixing Ratio</strong> - Blend 50/50 with regular syrup to control dose</li>
                </ul>
                <p className="text-sm text-gray-700 mt-2"><strong>Molecular Match:</strong> Glycerin-based cannabis extract dissolves into sugar syrups through hydrogen bonding, creating a stable suspension.</p>
              </div>
            </div>

            <div className="bg-pink-100 p-3 rounded border border-pink-300 mt-4">
              <p className="text-sm text-gray-800"><strong>⚗️ Chemistry Tip:</strong> Never mix THC into hot water alone—it will separate. Always use a carrier with lipophilic properties or an emulsifier like lecithin.</p>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-pink-50 p-5 rounded-lg border-2 border-pink-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-xl">Step 3: Calculate Molecular Replacement or Addition</h3>
            
            <p className="text-gray-700 mb-4">
              The key is maintaining the <strong>same volume and physical properties</strong> while introducing cannabinoids:
            </p>

            <div className="space-y-3">
              <div className="bg-white p-4 rounded border border-pink-200">
                <p className="font-bold text-gray-900 mb-2">🔄 REPLACEMENT METHOD (Substitution)</p>
                <p className="text-sm text-gray-700 mb-2">
                  Use this when the carrier ingredient is essential to the recipe's structure:
                </p>
                <div className="bg-gray-50 p-3 rounded border border-gray-300 font-mono text-sm mb-2">
                  <p className="text-gray-800">Original: 1 cup (240ml) butter</p>
                  <p className="text-pink-700 font-bold">Replace with: 1 cup (240ml) cannabutter</p>
                  <p className="text-gray-600 mt-1">Result: Same fat content, same baking properties, now infused</p>
                </div>
                <p className="text-sm text-gray-700"><strong>Why this works:</strong> You're maintaining the same triglyceride profile and fat percentage, just with added cannabinoids. The recipe chemistry stays identical.</p>
              </div>

              <div className="bg-white p-4 rounded border border-pink-200">
                <p className="font-bold text-gray-900 mb-2">➕ ADDITION METHOD (Supplementation)</p>
                <p className="text-sm text-gray-700 mb-2">
                  Use this when you can add THC without changing recipe proportions:
                </p>
                <div className="bg-gray-50 p-3 rounded border border-gray-300 font-mono text-sm mb-2">
                  <p className="text-gray-800">Original: 1 cup (240ml) coffee</p>
                  <p className="text-pink-700 font-bold">Add: 1ml THC tincture (50mg THC)</p>
                  <p className="text-gray-600 mt-1">Result: Minimal volume change, full THC dose</p>
                </div>
                <p className="text-sm text-gray-700"><strong>Why this works:</strong> 1ml of tincture is &lt;0.5% of total volume, so it doesn't affect the recipe's hydration ratio or molecular structure.</p>
              </div>

              <div className="bg-white p-4 rounded border border-pink-200">
                <p className="font-bold text-gray-900 mb-2">⚖️ PARTIAL METHOD (Hybrid Approach)</p>
                <p className="text-sm text-gray-700 mb-2">
                  Best for controlling flavor and potency:
                </p>
                <div className="bg-gray-50 p-3 rounded border border-gray-300 font-mono text-sm mb-2">
                  <p className="text-gray-800">Original: 1 cup (240ml) butter</p>
                  <p className="text-pink-700 font-bold">Replace with: ½ cup regular + ½ cup cannabutter</p>
                  <p className="text-gray-600 mt-1">Result: Less weed taste, easier to control dosing</p>
                </div>
                <p className="text-sm text-gray-700"><strong>Why this works:</strong> You dilute the chlorophyll and terpene flavors while maintaining THC content. Reduces the "grassy" taste in edibles.</p>
              </div>
            </div>
          </div>

          {/* STEP 4 */}
          <div className="bg-pink-50 p-5 rounded-lg border-2 border-pink-200">
            <h3 className="font-semibold text-gray-900 mb-3 text-xl">Step 4: Calculate Final Dose (Pharmacokinetics)</h3>
            
            <p className="text-gray-700 mb-4">
              Now you need to ensure each serving delivers the correct THC dose based on <strong>bioavailability</strong> and <strong>individual tolerance</strong>:
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded border border-blue-200 mb-4">
              <p className="font-bold text-gray-900 mb-2">📊 Dose Calculation Formula:</p>
              <div className="bg-white p-3 rounded border border-gray-300 font-mono text-sm">
                <p className="text-gray-800">mg THC per serving = (Total THC in infusion ÷ Total servings) × Bioavailability factor</p>
              </div>
            </div>

            {/* Internal CTA */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-white text-center">
            <p className="text-lg font-bold mb-1">🧮 Calculate Your Exact THC Per Serving</p>
            <p className="text-green-100 text-sm mb-4">Use Infusion Sensei's free THC dosage calculator — enter your strain, base type, and recipe to get precise mg per serving instantly.</p>
            <Link to="/infusions" className="inline-flex items-center gap-2 bg-white text-green-700 font-bold px-5 py-2.5 rounded-lg hover:bg-green-50 transition-colors text-sm">
              Build My Infusion — Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
              <div className="bg-white p-3 rounded border border-pink-200">
                <p className="font-semibold text-gray-900 mb-1">🔬 Bioavailability Factors:</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• <strong>Fat-based edibles:</strong> 4-12% bioavailability (first-pass metabolism reduces absorption)</li>
                  <li>• <strong>Tincture (sublingual):</strong> 12-35% bioavailability (bypasses liver)</li>
                  <li>• <strong>Nano-emulsion:</strong> 20-40% bioavailability (increased surface area)</li>
                  <li>• <strong>Distillate in MCT:</strong> 6-20% bioavailability (direct portal absorption)</li>
                </ul>
              </div>

              <div className="bg-white p-3 rounded border border-pink-200">
                <p className="font-semibold text-gray-900 mb-2">🎯 Example Calculation:</p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                  <p className="text-gray-800">• Recipe makes 12 cookies</p>
                  <p className="text-gray-800">• You used 100g cannabutter with 500mg total THC</p>
                  <p className="text-pink-700 font-bold">• Dose per cookie = 500mg ÷ 12 = 41.7mg THC</p>
                  <p className="text-gray-600">• Effective dose (10% bioavailability) ≈ 4.2mg absorbed THC</p>
                  <p className="text-purple-700 font-bold">• Recommended: Start with ½ cookie (20mg = ~2mg absorbed)</p>
                </div>
              </div>
            </div>

            <div className="bg-pink-100 p-3 rounded border border-pink-300 mt-4">
              <p className="text-sm text-gray-800"><strong>⚠️ Important:</strong> <strong>11-hydroxy-THC</strong> (created from edibles) is 2-3x more psychoactive than delta-9-THC (from smoking). A 10mg edible feels MUCH stronger than a 10mg joint because of this metabolic conversion in the liver.</p>
            </div>
          </div>

          {/* REAL-WORLD EXAMPLES */}
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-5 rounded-lg border-2 border-pink-300">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">🍳 Real-World Conversion Examples</h3>
            
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-gray-900 mb-2">Example 1: Chocolate Chip Cookies</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Original:</strong> 1 cup butter, 2 cups flour, 1 cup sugar, 2 eggs</p>
                <p className="text-sm text-pink-700 mb-2"><strong>Conversion:</strong> Replace 1 cup butter → 1 cup cannabutter (200mg THC total)</p>
                <p className="text-sm text-gray-600">Makes 24 cookies = 8.3mg THC each</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-gray-900 mb-2">Example 2: Smoothie</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Original:</strong> 1 banana, 1 cup milk, 1 tbsp peanut butter</p>
                <p className="text-sm text-pink-700 mb-2"><strong>Conversion:</strong> Add 10ml MCT cannabis oil (50mg THC) OR 1ml tincture (25mg THC)</p>
                <p className="text-sm text-gray-600">1 smoothie = 25-50mg THC depending on carrier</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-gray-900 mb-2">Example 3: Pasta with Alfredo Sauce</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Original:</strong> 4 tbsp butter, 1 cup heavy cream, parmesan cheese</p>
                <p className="text-sm text-pink-700 mb-2"><strong>Conversion:</strong> Replace 4 tbsp butter → 4 tbsp cannabutter (100mg THC)</p>
                <p className="text-sm text-gray-600">Serves 4 people = 25mg THC per serving</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="font-bold text-gray-900 mb-2">Example 4: Coffee</p>
                <p className="text-sm text-gray-700 mb-2"><strong>Original:</strong> 8 oz brewed coffee, 2 tbsp cream</p>
                <p className="text-sm text-pink-700 mb-2"><strong>Conversion:</strong> Add 1ml THC tincture (hold under tongue 60 sec, then swallow)</p>
                <p className="text-sm text-gray-600">1 cup = 10-25mg THC with faster onset (sublingual absorption)</p>
              </div>
            </div>
          </div>

          {/* FINAL TIPS */}
          <div className="bg-pink-100 p-5 rounded-lg border-2 border-pink-300">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🎯 Golden Rules for Recipe Conversion</h3>
            <ul className="space-y-2 text-gray-800">
              <li><strong>1. Never add raw cannabis</strong> → THC must be decarboxylated (heated to activate from THCA)</li>
              <li><strong>2. Always use a carrier</strong> → THC won't absorb without fat, alcohol, or emulsifier</li>
              <li><strong>3. Keep temps under 350°F</strong> → Above this, THC degrades into CBN (sedating but less psychoactive)</li>
              <li><strong>4. Mix thoroughly</strong> → Prevents "hot spots" where one cookie has 50mg and another has 2mg</li>
              <li><strong>5. Account for bioavailability</strong> → 50mg in an edible ≠ 50mg smoked (edibles are STRONGER per mg)</li>
              <li><strong>6. Start low, go slow</strong> → Edibles can take 2 hours to peak. Wait before taking more!</li>
            </ul>
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
              className="p-4 bg-white border border-pink-200 rounded-lg hover:border-pink-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 group-hover:text-pink-700">{article.title}</span>
                <ArrowRight className="w-4 h-4 text-pink-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}