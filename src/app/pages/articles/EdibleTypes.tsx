import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router";

export function EdibleTypes() {
  const relatedArticles = [
    { title: "Dosing Guide", path: "/learn/articles/dosing-guide" },
    { title: "Base Comparison", path: "/learn/articles/base-comparison" },
    { title: "Beginner Cooking Guide", path: "/learn/articles/beginner-guide" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Edible Types</span>
      </div>

      <Card className="bg-white border-teal-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl text-gray-900 mb-3">
                The 4 Types of THC Edibles (And Why They Feel Different)
              </CardTitle>
              <Badge className="bg-teal-600 text-white">Science</Badge>
            </div>
            <Leaf className="w-12 h-12 text-teal-600 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg text-gray-700">
            Not all edibles hit the same—and it's not just about dosing. The <strong>carrier type</strong> fundamentally changes how cannabinoids are absorbed, metabolized, and experienced in your body. Same milligrams, completely different pharmacokinetics.
          </p>

          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-5 rounded-lg border border-teal-200">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🧬 The Science: Why Carrier Type Matters</h3>
            <p className="text-gray-700 mb-3">
              When you consume THC orally, it must pass through several biological barriers before reaching your brain:
            </p>
            <ol className="space-y-2 text-gray-700 ml-4">
              <li><strong>1. Gastric Environment</strong> - Stomach acid (pH 1.5-3.5) can degrade some cannabinoids</li>
              <li><strong>2. Intestinal Absorption</strong> - THC crosses the intestinal epithelium via lipid diffusion or active transport</li>
              <li><strong>3. First-Pass Metabolism</strong> - Liver converts delta-9-THC → 11-hydroxy-THC (more psychoactive)</li>
              <li><strong>4. Blood-Brain Barrier</strong> - Cannabinoids cross via passive diffusion due to high lipophilicity</li>
            </ol>
            <p className="text-gray-700 mt-3">
              The <strong>carrier molecule type</strong> determines which pathway is used, how much THC survives metabolism, and how quickly it reaches your CB1 receptors in the brain.
            </p>
          </div>

          <div className="space-y-5">
            {/* TYPE 1: FAT-BASED */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg border-2 border-yellow-300">
              <h3 className="font-bold text-gray-900 mb-3 text-2xl">1. Fat-Based Edibles 🧈</h3>
              <p className="text-sm text-yellow-700 mb-4 font-semibold">Brownies | Cookies | Butter-based baked goods | Chocolate | Infused cooking oils</p>
              
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">⚗️ Molecular Absorption Mechanism</p>
                  <p className="text-sm text-gray-700 mb-2">
                    THC molecules bind to <strong>long-chain triglycerides (LCTs)</strong> via Van der Waals forces and hydrophobic interactions. In the small intestine, these fat molecules are broken down by <strong>pancreatic lipase</strong> and <strong>bile salts</strong> into smaller micelles.
                  </p>
                  <p className="text-sm text-gray-700">
                    These micelles (4-7nm diameter) containing THC are absorbed through <strong>enterocytes (intestinal cells)</strong> and packaged into <strong>chylomicrons</strong>—lipoprotein particles that enter the lymphatic system before reaching systemic circulation.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">🧪 Hepatic Metabolism (First-Pass Effect)</p>
                  <p className="text-sm text-gray-700 mb-2">
                    After absorption, THC travels via the <strong>portal vein</strong> to the liver, where <strong>cytochrome P450 enzymes (CYP2C9, CYP3A4)</strong> metabolize it:
                  </p>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-200 font-mono text-xs mb-2">
                    <p className="text-gray-800">Delta-9-THC → [CYP2C9 enzyme] → 11-hydroxy-THC</p>
                    <p className="text-gray-800 mt-1">11-hydroxy-THC → [CYP2C9 enzyme] → 11-nor-9-carboxy-THC (inactive)</p>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>11-hydroxy-THC</strong> is 2-3x more potent than delta-9-THC because it crosses the blood-brain barrier more efficiently due to increased polarity. This is why edibles feel STRONGER than smoking the same dose.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">⏱️ Pharmacokinetic Profile</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-yellow-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Onset Time:</p>
                      <p className="text-gray-700">45-120 minutes</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Peak Effects:</p>
                      <p className="text-gray-700">2-4 hours</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Duration:</p>
                      <p className="text-gray-700">6-8 hours (up to 12)</p>
                    </div>
                    <div className="bg-yellow-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Bioavailability:</p>
                      <p className="text-gray-700">4-12%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-200 p-3 rounded border border-yellow-400">
                  <p className="text-sm text-gray-900"><strong>⚠️ Why It Feels Different:</strong> The conversion to 11-hydroxy-THC creates a more <strong>sedating, body-focused high</strong> compared to inhalation. Effects build slowly and last much longer. Perfect for pain relief and sleep, but requires patience!</p>
                </div>
              </div>
            </div>

            {/* TYPE 2: SUGAR-BASED */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-lg border-2 border-pink-300">
              <h3 className="font-bold text-gray-900 mb-3 text-2xl">2. Sugar-Based Edibles 🍬</h3>
              <p className="text-sm text-pink-700 mb-4 font-semibold">Gummies | Hard candies | Lollipops | Syrups | Chocolates with sugar coating</p>
              
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">⚗️ Molecular Absorption Mechanism</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Sugar-based edibles typically use <strong>glycerin or alcohol tinctures</strong> suspended in a sugar matrix (gummies use gelatin + sugar). THC is dissolved in the glycerin/alcohol, then dispersed throughout the candy.
                  </p>
                  <p className="text-sm text-gray-700">
                    When consumed, some absorption occurs through the <strong>oral mucosa (sublingual and buccal tissues)</strong> if the candy is held in the mouth. The glycerin acts as a <strong>penetration enhancer</strong>, allowing THC to diffuse through the mucous membrane into <strong>sublingual capillaries</strong>.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">🧪 Dual Absorption Pathway</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Sugar edibles offer a <strong>biphasic absorption</strong>:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li><strong>• Phase 1 (Sublingual):</strong> 10-20% absorbs through oral mucosa → enters bloodstream directly → bypasses liver → delivers delta-9-THC (15-45 min onset)</li>
                    <li><strong>• Phase 2 (Gastric):</strong> 80-90% is swallowed → stomach/intestinal absorption → liver metabolism → creates 11-hydroxy-THC (60-90 min onset)</li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-2">
                    This creates a <strong>two-wave effect</strong>: initial mild effects from sublingual absorption, followed by stronger effects from gastric absorption.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">⏱️ Pharmacokinetic Profile</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-pink-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Onset Time:</p>
                      <p className="text-gray-700">30-90 minutes (biphasic)</p>
                    </div>
                    <div className="bg-pink-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Peak Effects:</p>
                      <p className="text-gray-700">1.5-3 hours</p>
                    </div>
                    <div className="bg-pink-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Duration:</p>
                      <p className="text-gray-700">4-6 hours</p>
                    </div>
                    <div className="bg-pink-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Bioavailability:</p>
                      <p className="text-gray-700">6-15%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-200 p-3 rounded border border-pink-400">
                  <p className="text-sm text-gray-900"><strong>⚠️ Why It Feels Different:</strong> The dual absorption creates a more <strong>balanced high</strong> with slightly faster onset than pure fat-based edibles. Less sedating than brownies because less 11-hydroxy-THC is produced overall. Great for daytime use!</p>
                </div>
              </div>
            </div>

            {/* TYPE 3: LIQUID/NANO */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-300">
              <h3 className="font-bold text-gray-900 mb-3 text-2xl">3. Liquid / Nano-Emulsion Edibles 🥤</h3>
              <p className="text-sm text-blue-700 mb-4 font-semibold">THC drinks | Nano-emulsified beverages | Water-soluble THC | Carbonated cannabis drinks</p>
              
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">⚗️ Nano-Emulsion Technology</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Traditional THC is NOT water-soluble. Nano-emulsions solve this using <strong>high-pressure homogenization</strong> or <strong>ultrasonic cavitation</strong> to break THC oil into particles <strong>&lt;100 nanometers</strong>.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    These nanoparticles are coated with <strong>surfactants (emulsifiers)</strong> like:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• <strong>Lecithin (phospholipid)</strong> - Creates micelles around THC droplets</li>
                    <li>• <strong>Polysorbate 80 (Tween 80)</strong> - Stabilizes oil-water interface</li>
                    <li>• <strong>Quillaja saponin</strong> - Natural emulsifier from tree bark</li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-2">
                    The result: THC particles so small they remain suspended in water indefinitely (colloidal suspension).
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">🧪 Enhanced Absorption Mechanism</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Nano-sized particles (10-100nm) have <strong>dramatically increased surface area</strong> compared to regular oil droplets (&gt;1000nm):
                  </p>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-2">
                    <p className="text-xs text-gray-800 font-mono">Surface area ∝ 1/radius²</p>
                    <p className="text-xs text-gray-700 mt-1">A 10nm particle has 10,000x more surface area per volume than a 1000nm particle</p>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">
                    This increased surface area allows for:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• <strong>Rapid dissolution</strong> in gastric fluids</li>
                    <li>• <strong>Direct intestinal uptake</strong> via enterocytes without bile salt requirement</li>
                    <li>• <strong>Partial lymphatic absorption</strong> bypassing first-pass metabolism</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">⏱️ Pharmacokinetic Profile</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Onset Time:</p>
                      <p className="text-gray-700">15-45 minutes</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Peak Effects:</p>
                      <p className="text-gray-700">45-90 minutes</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Duration:</p>
                      <p className="text-gray-700">2-4 hours (shorter!)</p>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Bioavailability:</p>
                      <p className="text-gray-700">20-40% (MUCH higher!)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-200 p-3 rounded border border-blue-400">
                  <p className="text-sm text-gray-900"><strong>⚠️ Why It Feels Different:</strong> Nano-emulsions create a <strong>faster, cleaner high</strong> that's more similar to smoking than traditional edibles. Less sedating because some bypasses liver conversion. Effects don't last as long, making it easier to control dosing. Perfect for social situations!</p>
                </div>
              </div>
            </div>

            {/* TYPE 4: DIRECT TINCTURE */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-2 border-purple-300">
              <h3 className="font-bold text-gray-900 mb-3 text-2xl">4. Direct Tincture (Sublingual) 💧</h3>
              <p className="text-sm text-purple-700 mb-4 font-semibold">Alcohol-based tinctures | Glycerin tinctures | MCT oil droppers | Sublingual strips</p>
              
              <div className="space-y-3">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">⚗️ Transmucosal Absorption Mechanism</p>
                  <p className="text-sm text-gray-700 mb-2">
                    The sublingual region (under the tongue) contains highly permeable <strong>stratified squamous epithelium</strong> with extensive <strong>capillary networks</strong>. This tissue has:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• <strong>Thin epithelial barrier</strong> (~100-200 μm vs 2mm in intestines)</li>
                    <li>• <strong>Rich blood supply</strong> from sublingual artery</li>
                    <li>• <strong>Neutral pH</strong> (6.5-7.4) that doesn't degrade cannabinoids</li>
                    <li>• <strong>High lipid content</strong> in cell membranes allowing lipophilic drug passage</li>
                  </ul>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">🧪 Bypassing First-Pass Metabolism</p>
                  <p className="text-sm text-gray-700 mb-2">
                    When held under the tongue for 60-90 seconds, THC dissolved in alcohol or glycerin diffuses through the oral mucosa and enters the <strong>sublingual vein</strong> → <strong>lingual vein</strong> → <strong>internal jugular vein</strong> → <strong>superior vena cava</strong> → <strong>systemic circulation</strong>.
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                    This completely bypasses the liver's first-pass metabolism, meaning you get <strong>delta-9-THC</strong> (not 11-hydroxy-THC) directly into your bloodstream.
                  </p>
                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                    <p className="text-sm text-gray-800"><strong>Effect Profile Difference:</strong></p>
                    <ul className="text-xs text-gray-700 space-y-1 ml-4 mt-2">
                      <li>• Delta-9-THC (sublingual) = More cerebral, euphoric, creative high</li>
                      <li>• 11-hydroxy-THC (ingested) = More sedating, body-focused, couch-lock high</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">⏱️ Pharmacokinetic Profile</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Onset Time:</p>
                      <p className="text-gray-700">15-45 minutes (sublingual)</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Peak Effects:</p>
                      <p className="text-gray-700">30-90 minutes</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Duration:</p>
                      <p className="text-gray-700">3-5 hours</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="font-semibold text-gray-900">Bioavailability:</p>
                      <p className="text-gray-700">12-35% (dose-dependent)</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-bold text-gray-900 mb-2">💡 Pro Technique: Maximize Sublingual Absorption</p>
                  <ul className="text-sm text-gray-700 space-y-1 ml-4">
                    <li>• <strong>Step 1:</strong> Don't eat/drink 15 min before (dry mouth = better absorption)</li>
                    <li>• <strong>Step 2:</strong> Place drops under tongue (not on top)</li>
                    <li>• <strong>Step 3:</strong> Hold for 90 seconds WITHOUT swallowing</li>
                    <li>• <strong>Step 4:</strong> Swish gently around mouth (buccal absorption too)</li>
                    <li>• <strong>Step 5:</strong> Swallow remainder (dual absorption)</li>
                  </ul>
                  <p className="text-sm text-gray-700 mt-2">
                    This technique gives you <strong>30-50% sublingual absorption</strong> (fast) + <strong>50-70% gastric absorption</strong> (delayed), creating a smooth, extended effect curve.
                  </p>
                </div>

                <div className="bg-purple-200 p-3 rounded border border-purple-400">
                  <p className="text-sm text-gray-900"><strong>⚠️ Why It Feels Different:</strong> Sublingual tinctures provide the <strong>most controllable experience</strong>. You can titrate dose drop-by-drop, effects come on faster so you know if you need more, and the high is more <strong>clear-headed and functional</strong> compared to edibles. Best for medicinal use and microdosing!</p>
                </div>
              </div>
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-6 rounded-lg border-2 border-teal-300">
            <h3 className="font-bold text-gray-900 mb-4 text-xl text-center">📊 Quick Reference Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-teal-600 text-white">
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-center">Onset</th>
                    <th className="p-2 text-center">Duration</th>
                    <th className="p-2 text-center">Bioavail.</th>
                    <th className="p-2 text-left">Effect Profile</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b border-gray-200">
                    <td className="p-2 font-semibold">Fat-Based</td>
                    <td className="p-2 text-center">45-120 min</td>
                    <td className="p-2 text-center">6-8 hrs</td>
                    <td className="p-2 text-center">4-12%</td>
                    <td className="p-2 text-xs">Sedating, body-focused, couch-lock</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 font-semibold">Sugar-Based</td>
                    <td className="p-2 text-center">30-90 min</td>
                    <td className="p-2 text-center">4-6 hrs</td>
                    <td className="p-2 text-center">6-15%</td>
                    <td className="p-2 text-xs">Balanced, moderate sedation</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="p-2 font-semibold">Nano-Liquid</td>
                    <td className="p-2 text-center">15-45 min</td>
                    <td className="p-2 text-center">2-4 hrs</td>
                    <td className="p-2 text-center">20-40%</td>
                    <td className="p-2 text-xs">Cerebral, clean, functional</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Sublingual</td>
                    <td className="p-2 text-center">15-45 min</td>
                    <td className="p-2 text-center">3-5 hrs</td>
                    <td className="p-2 text-center">12-35%</td>
                    <td className="p-2 text-xs">Cerebral, euphoric, controllable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FINAL INSIGHTS */}
          <div className="bg-teal-100 p-5 rounded-lg border-2 border-teal-300">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">🎯 Why This Matters: Same Milligrams ≠ Same Experience</h3>
            <div className="space-y-3 text-gray-800">
              <p>
                <strong>Example:</strong> 10mg THC brownie vs 10mg THC drink vs 10mg sublingual tincture:
              </p>
              <ul className="space-y-2 ml-4">
                <li><strong>• Brownie (10mg):</strong> 4-12% bioavailable = 0.4-1.2mg reaches bloodstream, but it's converted to 11-hydroxy-THC (2-3x potency) = feels like 1-3.6mg "effective dose"</li>
                <li><strong>• Nano-drink (10mg):</strong> 20-40% bioavailable = 2-4mg reaches bloodstream as delta-9-THC (original potency) = feels like 2-4mg "effective dose"</li>
                <li><strong>• Sublingual (10mg):</strong> 12-35% bioavailable = 1.2-3.5mg reaches bloodstream as delta-9-THC = feels like 1.2-3.5mg "effective dose"</li>
              </ul>
              <p className="mt-3">
                <strong>The paradox:</strong> The brownie has LOWEST bioavailability but can feel STRONGEST because of the 11-hydroxy-THC conversion! This is why new users get destroyed by edibles—they expect it to feel like smoking 10mg, but it's completely different pharmacology.
              </p>
              <p className="mt-3 text-teal-900 font-bold">
                ⚠️ Golden Rule: Start with 2.5-5mg for edibles, 5-10mg for drinks/sublingual. Wait 2+ hours before redosing. Respect the chemistry!
              </p>
            </div>
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
              className="p-4 bg-white border border-teal-200 rounded-lg hover:border-teal-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 group-hover:text-teal-700">{article.title}</span>
                <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}