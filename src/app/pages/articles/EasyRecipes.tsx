import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Lightbulb, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { Link } from "react-router";

export function EasyRecipes() {
  const relatedArticles = [
    { title: "Beginner Cooking Guide", path: "/learn/articles/beginner-guide" },
    { title: "THC Butter vs Oil vs Syrup", path: "/learn/articles/base-comparison" },
    { title: "How to Dose Edibles", path: "/learn/articles/dosing-guide" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Easy THC Recipes</span>
      </div>

      <Card className="bg-white border-blue-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-3xl md:text-4xl text-gray-900 mb-3">
                5 Easy THC Recipes You Can Make with Ingredients You Already Have
              </CardTitle>
              <Badge className="bg-blue-600 text-white">Quick Start • 10 min read</Badge>
            </div>
            <Lightbulb className="w-12 h-12 text-blue-600 flex-shrink-0 ml-3" />
          </div>
        </CardHeader>
        <CardContent className="space-y-8 text-gray-700 leading-relaxed">
          {/* Introduction */}
          <div className="space-y-4">
            <p className="text-xl text-gray-800 font-semibold leading-relaxed">
              You don't need a fancy kitchen, expensive equipment, or culinary school training to make great THC edibles. In fact, some of the best cannabis recipes are the simplest ones—recipes you can make in under 10 minutes with ingredients you probably already have in your pantry.
            </p>
            <p className="text-lg">
              The secret? <strong>You're not creating new recipes—you're just swapping one ingredient.</strong>
            </p>
            <p className="text-lg">
              Instead of regular butter, you use cannabutter. Instead of regular syrup, you use THC syrup. Instead of regular oil, you use infused oil. That's it. The base swap transforms any regular recipe into a THC recipe.
            </p>
            <p className="text-lg">
              This guide will show you 5 dead-simple recipes that require minimal cooking skills, minimal ingredients, and minimal time. Perfect for beginners who want to start cooking with cannabis today.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <p className="text-lg text-blue-800 font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>Before you start: Make sure you have your infused base ready (cannabutter, THC oil, tincture, or syrup). If you don't, check out our <Link to="/learn/articles/beginner-guide" className="underline">Beginner's Guide</Link> first.</span>
            </p>
          </div>

          <Separator className="bg-gray-200" />

          {/* Recipe 1: THC Coffee */}
          <div className="space-y-5 bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border-2 border-orange-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">1. THC Coffee ☕</h2>
              <Badge className="bg-orange-600 text-white">5-20 mg</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">⏱️ Time: 5 minutes</h4>
                <h4 className="font-semibold text-gray-900 mb-2">🔥 Difficulty: Beginner</h4>
                <h4 className="font-semibold text-gray-900 mb-2">⚡ Onset: 30-90 minutes</h4>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📦 What You Need:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Your regular coffee</li>
                  <li>• 1 tsp cannabutter or infused coconut oil</li>
                  <li>• Blender (optional but recommended)</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">📝 Instructions:</h4>
              <ol className="space-y-2 text-gray-700">
                <li><strong>1.</strong> Brew your coffee like you normally would (any strength, any method).</li>
                <li><strong>2.</strong> While it's hot, add 1 teaspoon of cannabutter or infused coconut oil.</li>
                <li><strong>3.</strong> <span className="bg-yellow-200 px-1">THIS IS IMPORTANT:</span> Blend for 30-60 seconds, OR whisk vigorously for 1-2 minutes. This emulsifies the fat so it doesn't just float on top.</li>
                <li><strong>4.</strong> Add your regular milk, cream, or sweetener if desired.</li>
                <li><strong>5.</strong> Drink and wait 45-90 minutes for effects.</li>
              </ol>
            </div>

            <div className="bg-orange-100 p-4 rounded border border-orange-300 space-y-2">
              <p className="text-sm font-semibold text-orange-900">💡 Pro Tips:</p>
              <ul className="text-sm text-orange-900 space-y-1">
                <li>• <strong>Blending is key.</strong> Without blending, the oil floats and doesn't mix properly. A cheap immersion blender works great.</li>
                <li>• <strong>Use coconut oil instead of butter</strong> if you want a cleaner taste—butter can make coffee taste greasy.</li>
                <li>• <strong>Add MCT oil</strong> (1 tsp) along with your cannabutter for faster absorption and a creamier texture.</li>
                <li>• <strong>Try it iced:</strong> Blend hot coffee with cannabutter, then pour over ice for an iced THC latte.</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-gray-300">
              <h4 className="font-semibold text-gray-900 mb-2">🎯 Dosing Example:</h4>
              <p className="text-gray-700 text-sm">
                If your cannabutter has 10mg THC per teaspoon, and you use 1 teaspoon, your coffee has <strong>10mg THC total</strong>. If you drink half the cup, you consumed 5mg. Easy math.
              </p>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Recipe 2: THC Peanut Butter Toast */}
          <div className="space-y-5 bg-gradient-to-br from-yellow-50 to-amber-50 p-6 rounded-lg border-2 border-yellow-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">2. THC Peanut Butter Toast 🥜</h2>
              <Badge className="bg-yellow-600 text-white">5-15 mg</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">⏱️ Time: 3 minutes</h4>
                <h4 className="font-semibold text-gray-900 mb-2">🔥 Difficulty: Beginner</h4>
                <h4 className="font-semibold text-gray-900 mb-2">⚡ Onset: 30-90 minutes</h4>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📦 What You Need:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• 1-2 slices of bread</li>
                  <li>• 2 tbsp peanut butter (or any nut butter)</li>
                  <li>• 1 tsp infused coconut oil</li>
                  <li>• Optional: honey, banana, cinnamon</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">📝 Instructions:</h4>
              <ol className="space-y-2 text-gray-700">
                <li><strong>1.</strong> Toast your bread to your preferred level of toastiness.</li>
                <li><strong>2.</strong> In a small bowl, mix 2 tablespoons of peanut butter with 1 teaspoon of infused coconut oil. Stir until fully combined.</li>
                <li><strong>3.</strong> Spread the THC peanut butter mixture on your toast.</li>
                <li><strong>4.</strong> Optional: Add sliced banana, a drizzle of honey, or a sprinkle of cinnamon on top.</li>
                <li><strong>5.</strong> Eat immediately and enjoy.</li>
              </ol>
            </div>

            <div className="bg-yellow-100 p-4 rounded border border-yellow-300 space-y-2">
              <p className="text-sm font-semibold text-yellow-900">💡 Pro Tips:</p>
              <ul className="text-sm text-yellow-900 space-y-1">
                <li>• <strong>Why this works:</strong> The fat in peanut butter helps the THC absorb better and masks any weed taste.</li>
                <li>• <strong>Make a batch:</strong> Mix a whole jar of peanut butter with the right amount of infused oil, then use it anytime. Just calculate the THC per tablespoon.</li>
                <li>• <strong>Upgrade it:</strong> Make a grilled PB&J with THC peanut butter for a more indulgent snack.</li>
                <li>• <strong>Vegan option:</strong> Use almond butter, cashew butter, or sunflower seed butter instead.</li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Recipe 3: THC Lemonade */}
          <div className="space-y-5 bg-gradient-to-br from-cyan-50 to-blue-50 p-6 rounded-lg border-2 border-cyan-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">3. THC Lemonade 🍋</h2>
              <Badge className="bg-cyan-600 text-white">5-20 mg</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">⏱️ Time: 5 minutes</h4>
                <h4 className="font-semibold text-gray-900 mb-2">🔥 Difficulty: Beginner</h4>
                <h4 className="font-semibold text-gray-900 mb-2">⚡ Onset: 15-60 minutes (faster if using tincture)</h4>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📦 What You Need:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• 1 cup cold water</li>
                  <li>• 2 tbsp fresh lemon juice</li>
                  <li>• 1-2 tsp THC syrup (or 1ml tincture)</li>
                  <li>• Ice</li>
                  <li>• Optional: fresh mint, berries</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">📝 Instructions:</h4>
              <ol className="space-y-2 text-gray-700">
                <li><strong>1.</strong> Fill a glass with ice.</li>
                <li><strong>2.</strong> Add 1 cup of cold water and 2 tablespoons of fresh lemon juice.</li>
                <li><strong>3.</strong> Add 1-2 teaspoons of THC syrup (start with 1 tsp if you're new).</li>
                <li><strong>4.</strong> Stir well for 30 seconds to ensure the syrup is fully dissolved.</li>
                <li><strong>5.</strong> Optional: Add fresh mint leaves or a few berries for flavor.</li>
                <li><strong>6.</strong> Drink slowly and wait for effects.</li>
              </ol>
            </div>

            <div className="bg-cyan-100 p-4 rounded border border-cyan-300 space-y-2">
              <p className="text-sm font-semibold text-cyan-900">💡 Pro Tips:</p>
              <ul className="text-sm text-cyan-900 space-y-1">
                <li>• <strong>Use THC syrup, not oil.</strong> Oil doesn't mix well with water-based drinks—it'll float and separate.</li>
                <li>• <strong>Tincture works great too</strong> and kicks in faster (15-45 minutes) because it absorbs sublingually.</li>
                <li>• <strong>Make a pitcher:</strong> Multiply the recipe by 8, mix in a pitcher, and store in the fridge for THC lemonade all week.</li>
                <li>• <strong>Turn it into a mocktail:</strong> Add sparkling water, fresh herbs, or muddled fruit for a fancy drink.</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-gray-300">
              <h4 className="font-semibold text-gray-900 mb-2">⚠️ Important Note:</h4>
              <p className="text-gray-700 text-sm">
                Never use cannabutter or infused oil in water-based drinks—it won't mix and you'll waste your THC. Always use tincture, syrup, or nano-emulsified products for beverages.
              </p>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Recipe 4: THC Brownies (Box Mix) */}
          <div className="space-y-5 bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-lg border-2 border-pink-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">4. THC Brownies (Box Mix Hack) 🍫</h2>
              <Badge className="bg-pink-600 text-white">Variable per piece</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">⏱️ Time: 30 minutes</h4>
                <h4 className="font-semibold text-gray-900 mb-2">🔥 Difficulty: Beginner</h4>
                <h4 className="font-semibold text-gray-900 mb-2">⚡ Onset: 60-120 minutes</h4>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📦 What You Need:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• 1 box brownie mix (any brand)</li>
                  <li>• Eggs and water (per box instructions)</li>
                  <li>• Infused oil (replace the oil in the recipe)</li>
                  <li>• 9x9 baking pan</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">📝 Instructions:</h4>
              <ol className="space-y-2 text-gray-700">
                <li><strong>1.</strong> Preheat oven to the temperature listed on your brownie box (usually 325-350°F).</li>
                <li><strong>2.</strong> Read the box instructions to see how much oil it calls for (usually 1/4 to 1/2 cup).</li>
                <li><strong>3.</strong> <span className="bg-yellow-200 px-1">Replace the regular oil with your infused oil</span> (same amount).</li>
                <li><strong>4.</strong> Mix the brownie batter according to box instructions. Make sure to mix for at least 2 full minutes to distribute the THC evenly.</li>
                <li><strong>5.</strong> Pour into a greased 9x9 pan and bake according to box instructions.</li>
                <li><strong>6.</strong> Let cool completely, then cut into equal pieces (9, 16, or 24 depending on your desired dosage).</li>
              </ol>
            </div>

            <div className="bg-pink-100 p-4 rounded border border-pink-300 space-y-2">
              <p className="text-sm font-semibold text-pink-900">💡 Pro Tips:</p>
              <ul className="text-sm text-pink-900 space-y-1">
                <li>• <strong>Do the math first:</strong> If your infused oil has 500mg total THC and you cut into 25 pieces, each piece is 20mg.</li>
                <li>• <strong>Mix thoroughly:</strong> THC doesn't distribute evenly on its own. Mix the batter for 2-3 minutes, scraping the sides.</li>
                <li>• <strong>Cut evenly:</strong> Use a ruler or pizza cutter to make sure every piece is the same size.</li>
                <li>• <strong>Label everything:</strong> Write the dosage per piece on the container so you don't forget.</li>
                <li>• <strong>Ghirardelli brownie mix</strong> makes the best-tasting THC brownies, in my opinion.</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded border border-gray-300">
              <h4 className="font-semibold text-gray-900 mb-2">📊 Dosage Example:</h4>
              <p className="text-gray-700 text-sm mb-2">
                Your infused oil has <strong>800mg total THC</strong>. You're making a box of brownies that needs 1/2 cup oil, and your infused oil is 1/2 cup.
              </p>
              <p className="text-gray-700 text-sm">
                If you cut into <strong>16 pieces</strong>: 800mg ÷ 16 = <strong>50mg per brownie</strong><br/>
                If you cut into <strong>32 pieces</strong>: 800mg ÷ 32 = <strong>25mg per brownie</strong>
              </p>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Recipe 5: THC Smoothie */}
          <div className="space-y-5 bg-gradient-to-br from-green-50 to-lime-50 p-6 rounded-lg border-2 border-green-200">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">5. THC Smoothie 🍓</h2>
              <Badge className="bg-green-600 text-white">5-20 mg</Badge>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">⏱️ Time: 5 minutes</h4>
                <h4 className="font-semibold text-gray-900 mb-2">🔥 Difficulty: Beginner</h4>
                <h4 className="font-semibold text-gray-900 mb-2">⚡ Onset: 30-90 minutes</h4>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">📦 What You Need:</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• 1 cup frozen fruit (any kind)</li>
                  <li>• 1/2 cup yogurt or milk</li>
                  <li>• 1 tsp infused coconut oil</li>
                  <li>• Optional: protein powder, spinach, honey</li>
                  <li>• Blender</li>
                </ul>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">📝 Instructions:</h4>
              <ol className="space-y-2 text-gray-700">
                <li><strong>1.</strong> Add 1 cup frozen fruit to your blender (berries, mango, banana—whatever you like).</li>
                <li><strong>2.</strong> Add 1/2 cup yogurt or milk (dairy or non-dairy).</li>
                <li><strong>3.</strong> Add 1 teaspoon infused coconut oil.</li>
                <li><strong>4.</strong> Optional: Add 1 scoop protein powder, a handful of spinach, or 1 tablespoon honey for sweetness.</li>
                <li><strong>5.</strong> Blend on high for 60-90 seconds until smooth and creamy.</li>
                <li><strong>6.</strong> Pour into a glass and drink immediately.</li>
              </ol>
            </div>

            <div className="bg-green-100 p-4 rounded border border-green-300 space-y-2">
              <p className="text-sm font-semibold text-green-900">💡 Pro Tips:</p>
              <ul className="text-sm text-green-900 space-y-1">
                <li>• <strong>Use coconut oil, not butter.</strong> Butter in smoothies tastes weird. Coconut oil blends smoothly and has no taste.</li>
                <li>• <strong>Add healthy fats:</strong> Include 1 tbsp of peanut butter, almond butter, or avocado to help THC absorption.</li>
                <li>• <strong>Protein boost:</strong> This is a great post-workout smoothie if you add protein powder—you get your protein AND your THC.</li>
                <li>• <strong>Green smoothie:</strong> Add spinach or kale—you won't taste it, and it's a sneaky way to get your veggies.</li>
                <li>• <strong>Meal replacement:</strong> Make it a full meal by adding oats, chia seeds, and nut butter.</li>
              </ul>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          {/* Final Section */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">The Secret to All These Recipes</h2>
            
            <p className="text-lg">
              Notice the pattern? <strong>None of these are "cannabis recipes"—they're just normal recipes with one ingredient swapped.</strong>
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-blue-300">
              <h3 className="text-xl font-bold text-gray-900 mb-3">The Base Swap Method:</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Regular coffee → Add cannabutter = THC coffee</li>
                <li>• Regular peanut butter → Mix with infused oil = THC peanut butter</li>
                <li>• Regular lemonade → Add THC syrup = THC lemonade</li>
                <li>• Box brownie mix → Use infused oil = THC brownies</li>
                <li>• Regular smoothie → Add infused coconut oil = THC smoothie</li>
              </ul>
              <p className="mt-4 text-lg font-semibold text-blue-900">
                → Master this concept and you can turn ANY recipe into a THC recipe.
              </p>
            </div>

            <div className="bg-gray-900 text-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">🎯 Quick Recap:</h3>
              <ul className="space-y-2">
                <li>✅ You don't need special recipes—just swap one ingredient</li>
                <li>✅ Use the right base for the right recipe (oil for food, syrup for drinks)</li>
                <li>✅ Always calculate your dose before cooking</li>
                <li>✅ Mix thoroughly to distribute THC evenly</li>
                <li>✅ Start with 5-10mg if you're new</li>
                <li>✅ Wait 2 hours before eating more</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Articles */}
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">Continue Learning</h3>
        <p className="text-gray-600">Want to level up your cannabis cooking? Check out these guides:</p>
        <div className="grid md:grid-cols-3 gap-4">
          {relatedArticles.map((article) => (
            <Link
              key={article.path}
              to={article.path}
              className="p-5 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 font-semibold group-hover:text-blue-700">{article.title}</span>
                <ArrowRight className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
