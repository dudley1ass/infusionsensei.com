import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { ChefHat, ArrowRight, AlertCircle, Lightbulb } from "lucide-react";
import { Link } from "react-router";

export function BeginnerCookingGuide() {
  const relatedArticles = [
    { title: "5 Easy THC Recipes", path: "/learn/articles/easy-recipes" },
    { title: "How to Dose THC Edibles", path: "/learn/articles/dosing-guide" },
    { title: "Turn ANY Recipe Into THC", path: "/learn/articles/convert-recipes" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Beginner Cooking Guide</span>
      </div>

      {/* Article */}
      <Card className="bg-white border-green-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">
                How to Cook with THC: The Complete Beginner-to-Pro System
              </CardTitle>
              <Badge className="bg-green-600 text-white">Beginner Friendly • 12 min read</Badge>
            </div>
            <ChefHat className="w-12 h-12 text-green-600 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">
          {/* Introduction */}
          <div className="space-y-4">
            <p className="text-xl text-gray-800 font-semibold leading-relaxed">
              Cooking with THC isn't just about throwing weed into brownies and hoping for the best. It's about building a <strong>repeatable, measurable system</strong> that gives you control over dose, flavor, and effect every single time you cook.
            </p>
            <p className="text-lg">
              The truth is, most people fail at cannabis cooking because they skip the fundamentals. They don't measure properly. They don't understand decarboxylation. They guess at dosing. And then they're surprised when their edibles are inconsistent or too strong.
            </p>
            <p className="text-lg">
              <strong>Here's the good news:</strong> If you can follow a recipe and measure ingredients, you already have the skills to cook with THC successfully. This guide will teach you the complete system, from choosing your base ingredient to calculating exact dosages.
            </p>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <p className="text-xl text-green-800 font-bold text-center">
              💡 Core Principle: If you can measure ingredients, you can control THC.
            </p>
          </div>

          <Separator className="bg-gray-200" />

          {/* Why Most People Fail */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Why Most People Fail at Cannabis Cooking (And How to Avoid It)</h2>
            
            <p className="text-lg">
              Before we dive into the system, let's talk about the three biggest mistakes people make:
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 space-y-3">
              <div>
                <h4 className="font-bold text-red-900">❌ Mistake #1: Not Decarboxylating Properly</h4>
                <p className="text-red-800">
                  Raw cannabis contains THCA, not THC. You MUST heat it first (decarboxylation) to activate the psychoactive effects. Skip this step and your edibles won't work—no matter how perfectly you cook them.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-red-900">❌ Mistake #2: Guessing at Dosage</h4>
                <p className="text-red-800">
                  "I used a gram of weed" tells you nothing about how strong your edibles are. Without knowing THC percentage and doing the math, you're flying blind. This is how people end up with 200mg brownies when they meant to make 10mg servings.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-red-900">❌ Mistake #3: Using the Wrong Base for the Recipe</h4>
                <p className="text-red-800">
                  Trying to make THC lemonade with cannabutter? It won't mix properly. Want to bake cookies with tincture? It'll evaporate. Matching your THC base to your recipe type is critical.
                </p>
              </div>
            </div>

            <p className="text-lg">
              The system below eliminates all three of these problems by giving you a clear framework that works every time.
            </p>
          </div>

          <Separator className="bg-gray-200" />

          {/* Step 1: Understand the 4 THC Bases */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Step 1: Understand the 4 THC Base Types</h2>
            
            <p className="text-lg">
              Every THC recipe starts with a "base"—the ingredient that carries the THC into your food. There are four main types, and each one works best for specific recipes. Choose the wrong base and your recipe will fail. Choose the right one and you're already 80% of the way to success.
            </p>

            {/* Infused Fats */}
            <div className="bg-yellow-50 p-5 rounded-lg border border-yellow-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🧈</span>
                <h3 className="text-xl font-bold text-gray-900">1. Infused Fats (Butter, Coconut Oil, Olive Oil)</h3>
              </div>
              <p className="text-gray-700">
                <strong>What it is:</strong> Cannabis-infused butter or oil made by slow-cooking decarboxylated cannabis in fat for 2-4 hours.
              </p>
              <p className="text-gray-700">
                <strong>Best for:</strong> Baking (cookies, brownies, cakes), sautéing vegetables, making sauces, adding to coffee or smoothies.
              </p>
              <p className="text-gray-700">
                <strong>Why it works:</strong> THC is fat-soluble, meaning it binds to fats better than anything else. This is the most traditional and reliable method.
              </p>
              <p className="text-gray-700">
                <strong>Shelf life:</strong> 2-4 weeks refrigerated, up to 6 months frozen.
              </p>
              <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                <p className="text-sm text-yellow-900">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  <strong>Pro Tip:</strong> Use coconut oil for vegan recipes and higher potency—it has more fat content than butter, so it can hold more THC per gram.
                </p>
              </div>
            </div>

            {/* Tinctures */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">💧</span>
                <h3 className="text-xl font-bold text-gray-900">2. Tinctures (Alcohol or Glycerin-Based)</h3>
              </div>
              <p className="text-gray-700">
                <strong>What it is:</strong> Cannabis extract dissolved in high-proof alcohol (like Everclear) or vegetable glycerin.
              </p>
              <p className="text-gray-700">
                <strong>Best for:</strong> Drinks (cocktails, tea, lemonade), sublingual drops, recipes where you need precise, drop-by-drop control.
              </p>
              <p className="text-gray-700">
                <strong>Why it works:</strong> Tinctures allow for the most precise dosing because you can measure by the drop. They also work sublingually (under the tongue) for faster absorption—15-45 minutes instead of 1-2 hours.
              </p>
              <p className="text-gray-700">
                <strong>Shelf life:</strong> 1-2 years if stored in a dark, cool place.
              </p>
              <div className="bg-blue-100 p-3 rounded border border-blue-300">
                <p className="text-sm text-blue-900">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  <strong>Pro Tip:</strong> If you want the fastest-acting edibles, use tincture. Alcohol-based tinctures absorb faster than fat-based edibles because they bypass some of the digestive process.
                </p>
              </div>
            </div>

            {/* Syrups */}
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🍯</span>
                <h3 className="text-xl font-bold text-gray-900">3. THC Syrups (Sugar-Based or Agave-Based)</h3>
              </div>
              <p className="text-gray-700">
                <strong>What it is:</strong> A thick, sweet syrup infused with THC—similar to maple syrup or simple syrup but with cannabis.
              </p>
              <p className="text-gray-700">
                <strong>Best for:</strong> Coffee, tea, pancakes, waffles, cocktails, mocktails, dessert toppings, lemonade.
              </p>
              <p className="text-gray-700">
                <strong>Why it works:</strong> Syrups dissolve easily in liquids and add sweetness, making them perfect for beverages and breakfast foods. They're also easier to dose than butter because you can measure by the teaspoon or tablespoon.
              </p>
              <p className="text-gray-700">
                <strong>Shelf life:</strong> 2-3 months refrigerated.
              </p>
              <div className="bg-purple-100 p-3 rounded border border-purple-300">
                <p className="text-sm text-purple-900">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  <strong>Pro Tip:</strong> THC syrup is the secret weapon for cannabis bartenders. It mixes seamlessly into drinks without the oily texture of butter or tincture.
                </p>
              </div>
            </div>

            {/* Distillates */}
            <div className="bg-pink-50 p-5 rounded-lg border border-pink-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🧪</span>
                <h3 className="text-xl font-bold text-gray-900">4. Distillates (Pure THC Extract)</h3>
              </div>
              <p className="text-gray-700">
                <strong>What it is:</strong> A highly concentrated cannabis oil (usually 80-95% THC) that's been refined to remove all plant material, flavor, and color.
              </p>
              <p className="text-gray-700">
                <strong>Best for:</strong> Professional-grade recipes, chocolate making, gummies, any recipe where you need exact dosing and no cannabis taste.
              </p>
              <p className="text-gray-700">
                <strong>Why it works:</strong> Distillate is already decarboxylated and flavorless, so you can add it directly to recipes without cooking. It's the most precise option because you know exactly how much THC you're adding per gram.
              </p>
              <p className="text-gray-700">
                <strong>Shelf life:</strong> 1-2 years if stored properly.
              </p>
              <div className="bg-pink-100 p-3 rounded border border-pink-300">
                <p className="text-sm text-pink-900">
                  <Lightbulb className="w-4 h-4 inline mr-1" />
                  <strong>Pro Tip:</strong> Distillate = the most accurate dosing possible. If you're making edibles for medical use or need consistent results every time, distillate is worth the investment.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-5 rounded-lg border border-gray-300">
              <h4 className="font-bold text-gray-900 mb-2">Quick Reference: Which Base Should You Use?</h4>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Baking cookies/brownies?</strong> → Infused butter or oil</li>
                <li>• <strong>Making drinks?</strong> → Tincture or syrup</li>
                <li>• <strong>Need precise dosing?</strong> → Tincture or distillate</li>
                <li>• <strong>Want no weed taste?</strong> → Distillate</li>
                <li>• <strong>Making chocolate or gummies?</strong> → Distillate</li>
                <li>• <strong>Cooking savory food?</strong> → Infused oil (olive or vegetable)</li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Step 2: Master the THC Formula */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Step 2: Master the THC Dosage Formula</h2>
            
            <p className="text-lg">
              This is where most people get lost. But the formula is actually simple once you understand it. Here's the only math you need to know:
            </p>

            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300 space-y-4">
              <p className="text-2xl font-bold text-green-800 text-center font-mono">
                Total THC (mg) ÷ Number of Servings = THC per Serving (mg)
              </p>
              <div className="text-center text-gray-700">
                <p className="text-sm">That's it. That's the whole formula.</p>
              </div>
            </div>

            <p className="text-lg">
              Let's break down each part:
            </p>

            <div className="space-y-4">
              <div className="bg-white p-5 rounded-lg border border-gray-300">
                <h4 className="font-bold text-gray-900 mb-2">📊 Calculating Total THC</h4>
                <p className="text-gray-700 mb-3">
                  If you're using flower (bud), here's how to calculate total THC:
                </p>
                <div className="bg-gray-100 p-4 rounded font-mono text-sm space-y-2">
                  <p><strong>Cannabis weight (grams)</strong> × <strong>1000</strong> = mg of cannabis</p>
                  <p><strong>mg of cannabis</strong> × <strong>THC%</strong> = mg of THCA</p>
                  <p><strong>mg of THCA</strong> × <strong>0.88</strong> = Total THC after decarb</p>
                </div>
                <div className="mt-4 bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Example:</strong> You have 7 grams of flower at 20% THC:
                    <br />7g × 1000 = 7000mg
                    <br />7000mg × 0.20 = 1400mg THCA
                    <br />1400mg × 0.88 = <strong>1,232mg total THC</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-300">
                <h4 className="font-bold text-gray-900 mb-2">🍪 Dividing into Servings</h4>
                <p className="text-gray-700 mb-3">
                  Once you know your total THC, divide by the number of servings you're making:
                </p>
                <div className="bg-gray-100 p-4 rounded space-y-2">
                  <p className="text-gray-800">
                    If you made brownies with <strong>1,232mg total THC</strong> and cut them into <strong>24 pieces</strong>:
                  </p>
                  <p className="font-mono text-lg">1,232mg ÷ 24 = <strong className="text-green-700">51.3mg per brownie</strong></p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-lg border border-gray-300">
                <h4 className="font-bold text-gray-900 mb-2">⚖️ Why 0.88? (The Decarb Efficiency Factor)</h4>
                <p className="text-gray-700">
                  When you heat cannabis to activate THC (decarboxylation), you lose about 12% of the THCA content due to evaporation and breakdown. That's why we multiply by 0.88 instead of using the full amount. This gives you a more accurate estimate of the THC that actually makes it into your food.
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Step 3: Choose the Right Recipe Type */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Step 3: Match Your Base to the Right Recipe Type</h2>
            
            <p className="text-lg">
              Now that you understand the bases and the math, here's how to choose what to cook based on what base you have:
            </p>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-5 rounded-lg border border-orange-200">
                <h4 className="font-bold text-gray-900 mb-2">🍪 Fat-Based Recipes (Use Infused Butter/Oil)</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Cookies, brownies, cakes, muffins</li>
                  <li>• Pasta with THC olive oil</li>
                  <li>• Sautéed vegetables</li>
                  <li>• Salad dressings</li>
                  <li>• Popcorn with cannabutter</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-pink-50 to-red-50 p-5 rounded-lg border border-red-200">
                <h4 className="font-bold text-gray-900 mb-2">🍬 Sugar-Based Recipes (Use THC Syrup or Tincture)</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Gummies, hard candy, lollipops</li>
                  <li>• Sweet sauces and glazes</li>
                  <li>• Fruit compotes</li>
                  <li>• Pancake/waffle toppings</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-lg border border-cyan-200">
                <h4 className="font-bold text-gray-900 mb-2">🥤 Liquid-Based Recipes (Use Tincture or Syrup)</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Coffee, tea, hot chocolate</li>
                  <li>• Lemonade, juice, smoothies</li>
                  <li>• Cocktails and mocktails</li>
                  <li>• Protein shakes</li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg border border-purple-200">
                <h4 className="font-bold text-gray-900 mb-2">🍫 Direct-Add Recipes (Use Distillate)</h4>
                <ul className="text-gray-700 space-y-1">
                  <li>• Chocolate (melted, then add distillate)</li>
                  <li>• Gummies (add at the end)</li>
                  <li>• No-bake energy balls</li>
                  <li>• Capsules for medical use</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Step 4: Follow These Rules Every Time */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Step 4: Follow These Golden Rules for Perfect Edibles</h2>
            
            <p className="text-lg">
              You have your base. You've done the math. Now here are the rules that separate amateur edibles from professional results:
            </p>

            <div className="space-y-4">
              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-2">✅ Rule #1: Always Measure Everything</h4>
                <p className="text-gray-700">
                  Use a digital scale. Measure your cannabis in grams, not "a nug" or "a handful." Measure your finished product so you know exactly how many servings you have. Precision = consistency.
                </p>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-2">✅ Rule #2: Mix Thoroughly</h4>
                <p className="text-gray-700">
                  THC doesn't distribute evenly on its own. If you're making brownies with cannabutter, mix the batter for at least 2 minutes. If you're making gummies, stir constantly. Hot spots = some pieces are 5mg and others are 50mg.
                </p>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-2">✅ Rule #3: Cut/Portion Before You Eat</h4>
                <p className="text-gray-700">
                  Decide how many servings you're making BEFORE you cook. If you're making brownies, cut them into equal pieces and label the dose. Don't eyeball portions after the fact.
                </p>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-2">✅ Rule #4: Start Low, Go Slow</h4>
                <p className="text-gray-700">
                  5-10mg is a beginner dose. 10-20mg is standard. 25mg+ is strong. Don't make 50mg brownies for your first batch. You can always eat more—you can't un-eat a too-strong edible.
                </p>
              </div>

              <div className="bg-green-50 p-5 rounded-lg border-l-4 border-green-500">
                <h4 className="font-bold text-green-900 mb-2">✅ Rule #5: Wait 2 Hours Before Eating More</h4>
                <p className="text-gray-700">
                  Edibles take 45 minutes to 2 hours to kick in. Don't eat a second brownie after 30 minutes because you "don't feel it yet." Wait. The #1 beginner mistake is re-dosing too early.
                </p>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Final Tips */}
          <div className="space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Final Tips for Success</h2>
            
            <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-lg border-2 border-green-300">
              <ul className="space-y-3 text-gray-800">
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">→</span>
                  <span><strong>Label everything.</strong> Write the dose per serving on the container. Future you will thank you.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">→</span>
                  <span><strong>Keep a cooking journal.</strong> Write down what you made, how much THC, and how it felt. This helps you dial in your perfect dose.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">→</span>
                  <span><strong>Store properly.</strong> Keep edibles in airtight containers away from heat and light. THC degrades over time if exposed to air.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-green-600 font-bold">→</span>
                  <span><strong>Eat with food.</strong> THC absorbs better when consumed with a small amount of fat (like a spoonful of peanut butter or a handful of nuts).</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Summary */}
          <div className="bg-gray-900 text-white p-8 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold">🎯 Summary: Your Cannabis Cooking Checklist</h2>
            <ol className="space-y-2">
              <li>✅ <strong>Choose your base:</strong> Butter, oil, tincture, syrup, or distillate</li>
              <li>✅ <strong>Do the math:</strong> Calculate total THC and divide by servings</li>
              <li>✅ <strong>Match base to recipe:</strong> Fat for baking, tincture for drinks, etc.</li>
              <li>✅ <strong>Measure everything:</strong> Use a scale and measure precisely</li>
              <li>✅ <strong>Mix thoroughly:</strong> Ensure even THC distribution</li>
              <li>✅ <strong>Start low (5-10mg):</strong> You can always eat more later</li>
              <li>✅ <strong>Wait 2 hours:</strong> Don't re-dose early</li>
              <li>✅ <strong>Label your dose:</strong> Always know what you're eating</li>
            </ol>
            <p className="text-green-400 text-lg font-semibold pt-4">
              Follow this system and you'll never have inconsistent edibles again. 🌿
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Continue Learning</h3>
        <p className="text-gray-600">Ready to start cooking? Check out these related guides:</p>
        <div className="grid md:grid-cols-3 gap-4">
          {relatedArticles.map((article) => (
            <Link
              key={article.path}
              to={article.path}
              className="p-5 bg-white border-2 border-green-200 rounded-lg hover:border-green-400 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-semibold group-hover:text-green-700">{article.title}</span>
                <ArrowRight className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
