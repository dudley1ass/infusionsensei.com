import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Leaf,
  Flame,
  Droplet,
  Clock,
  AlertTriangle,
  Thermometer,
  Beaker,
  Shield,
  BookOpen,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { GuidesArticles } from "../components/GuidesArticles";

export function Learn() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cannabis Culinary Education</h1>
        <p className="text-gray-600">
          Everything you need to know about cooking with cannabis safely and effectively
        </p>
      </div>

      <Tabs defaultValue="guides" className="space-y-6">
        <TabsList className="bg-white border border-green-200 flex-wrap h-auto shadow-sm">
          <TabsTrigger value="guides" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Sparkles className="w-4 h-4 mr-2" />
            Guides
          </TabsTrigger>
          <TabsTrigger value="basics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Basics
          </TabsTrigger>
          <TabsTrigger value="decarb" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Flame className="w-4 h-4 mr-2" />
            Decarboxylation
          </TabsTrigger>
          <TabsTrigger value="infusion" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Droplet className="w-4 h-4 mr-2" />
            Infusion Methods
          </TabsTrigger>
          <TabsTrigger value="strains" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Leaf className="w-4 h-4 mr-2" />
            Strains
          </TabsTrigger>
          <TabsTrigger value="safety" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
            <Shield className="w-4 h-4 mr-2" />
            Safety
          </TabsTrigger>
        </TabsList>

        {/* Guides Tab - NEW */}
        <TabsContent value="guides" className="space-y-6">
          <GuidesArticles />
        </TabsContent>

        {/* Basics Tab */}
        <TabsContent value="basics" className="space-y-6">
          <Card className="bg-white border-green-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Cannabis Cooking 101</CardTitle>
              <CardDescription className="text-gray-700">
                Understanding the fundamentals of cannabis-infused cooking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Why Cook with Cannabis?</h3>
                <p className="text-gray-800">
                  Consuming cannabis through edibles provides a different experience than smoking
                  or vaping. Edibles are processed through the digestive system, resulting in
                  longer-lasting effects (4-8 hours) that are often more intense. This makes them
                  ideal for medical users seeking sustained relief or recreational users looking
                  for an extended experience.
                </p>
              </div>

              <Separator className="bg-green-200" />

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Principles</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Thermometer className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Temperature Control</h4>
                        <p className="text-sm text-gray-700">
                          THC degrades above 350°F. Keep infusion temps between 160-180°F for
                          optimal extraction without degradation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Droplet className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Fat Solubility</h4>
                        <p className="text-sm text-gray-700">
                          THC is fat-soluble, not water-soluble. It must bind to fats (butter,
                          oil) for proper absorption in the body.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Time & Patience</h4>
                        <p className="text-sm text-gray-700">
                          Proper infusion takes 2-4 hours. Edibles take 30-120 minutes to take
                          effect. Patience is crucial for safety.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Beaker className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Precise Dosing</h4>
                        <p className="text-sm text-gray-700">
                          Use scales and calculations to ensure consistent, safe dosing. Even
                          distribution is key to predictable effects.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Decarboxylation Tab */}
        <TabsContent value="decarb" className="space-y-6">
          <Card className="bg-white border-green-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Flame className="w-6 h-6 text-orange-500" />
                Decarboxylation Explained
              </CardTitle>
              <CardDescription className="text-gray-700">
                The crucial first step in cannabis cooking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What is Decarboxylation?</h3>
                <p className="text-gray-800 mb-4">
                  Raw cannabis contains THCA (tetrahydrocannabinolic acid), which is non-psychoactive.
                  Decarboxylation is the process of heating cannabis to convert THCA into THC, the
                  compound that produces psychoactive effects. This happens naturally when smoking,
                  but must be done manually when cooking.
                </p>
              </div>

              <Separator className="bg-green-200" />

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">How to Decarboxylate</h3>
                <div className="bg-green-50 border border-green-100 p-6 rounded-lg space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Preheat Oven</h4>
                      <p className="text-sm text-gray-700">
                        Set your oven to 240°F (115°C). Use an oven thermometer for accuracy.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Prepare Cannabis</h4>
                      <p className="text-sm text-gray-700">
                        Break up cannabis into small, rice-sized pieces. Don't grind too fine or
                        it may burn. Spread evenly on parchment-lined baking sheet.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Bake</h4>
                      <p className="text-sm text-gray-700">
                        Bake for 30-40 minutes, stirring every 10 minutes for even heating. Watch
                        for color change from green to light brown.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Cool & Store</h4>
                      <p className="text-sm text-gray-700">
                        Let cool completely before use. Store in airtight container away from
                        light and heat.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-300">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 mb-1">Pro Tips</p>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Your kitchen will smell strongly - plan accordingly</li>
                      <li>• Cannabis should be lightly toasted, not dark brown or black</li>
                      <li>• Decarb efficiency is typically around 88% conversion rate</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Infusion Methods Tab */}
        <TabsContent value="infusion" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white border-green-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Butter Infusion</CardTitle>
                <Badge className="w-fit bg-green-600">Most Popular</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-800">
                <p><strong>Best for:</strong> Baking, cooking, spreads</p>
                <p><strong>Ratio:</strong> 7-10g cannabis per cup of butter</p>
                <p><strong>Time:</strong> 2-3 hours on low heat</p>
                <p><strong>Storage:</strong> Refrigerate up to 2 months, freeze 6 months</p>
                <p className="text-gray-700">
                  Butter creates rich, flavorful infusions perfect for brownies, cookies, and
                  savory dishes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Coconut Oil Infusion</CardTitle>
                <Badge className="w-fit bg-green-600">Vegan Friendly</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-800">
                <p><strong>Best for:</strong> Baking, capsules, topicals</p>
                <p><strong>Ratio:</strong> 7-10g cannabis per cup of oil</p>
                <p><strong>Time:</strong> 3-4 hours on low heat</p>
                <p><strong>Storage:</strong> Room temp up to 1 year</p>
                <p className="text-gray-700">
                  High in saturated fats for excellent THC absorption. Great shelf life and
                  versatility.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Olive Oil Infusion</CardTitle>
                <Badge className="w-fit bg-yellow-600">Heart Healthy</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-800">
                <p><strong>Best for:</strong> Salad dressings, pasta, drizzling</p>
                <p><strong>Ratio:</strong> 7-10g cannabis per cup of oil</p>
                <p><strong>Time:</strong> 2-3 hours on low heat</p>
                <p><strong>Storage:</strong> Dark, cool place for 6 months</p>
                <p className="text-gray-700">
                  Healthier option with antioxidants. Strong flavor works well in savory dishes.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-900">Alcohol Tincture</CardTitle>
                <Badge className="w-fit bg-purple-600">Fast Acting</Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-800">
                <p><strong>Best for:</strong> Sublingual drops, drinks, quick dosing</p>
                <p><strong>Ratio:</strong> 3-5g cannabis per cup of high-proof alcohol</p>
                <p><strong>Time:</strong> 2-4 weeks steeping (or 1-2 hours with heat)</p>
                <p><strong>Storage:</strong> Dark bottle, cool place, indefinite</p>
                <p className="text-gray-700">
                  Precise dosing and faster absorption. Can be added to beverages or taken directly.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Strains Tab */}
        <TabsContent value="strains" className="space-y-6">
          <Card className="bg-white border-green-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Understanding Cannabis Strains</CardTitle>
              <CardDescription className="text-gray-700">
                Choose the right strain for your desired effects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">Indica</h3>
                  <Badge className="bg-purple-600 mb-3">Relaxing</Badge>
                  <p className="text-sm text-gray-800 mb-4">
                    Body-focused effects, relaxation, sedation. Great for evening use, pain relief,
                    sleep aid, and stress reduction.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Best for:</strong> Brownies, cookies, nighttime edibles, pain relief
                    products
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-3">Sativa</h3>
                  <Badge className="bg-green-600 mb-3">Energizing</Badge>
                  <p className="text-sm text-gray-800 mb-4">
                    Mind-focused effects, energy, creativity, focus. Ideal for daytime use, social
                    activities, and creative projects.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Best for:</strong> Beverages, gummies, morning/afternoon snacks,
                    creative cooking
                  </p>
                </div>

                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <h3 className="text-xl font-bold text-amber-900 mb-3">Hybrid</h3>
                  <Badge className="bg-yellow-600 mb-3">Balanced</Badge>
                  <p className="text-sm text-gray-800 mb-4">
                    Combination of indica and sativa effects. Balanced mind and body experience.
                    Versatile for various situations.
                  </p>
                  <p className="text-xs text-gray-600">
                    <strong>Best for:</strong> All-purpose edibles, any time of day, versatile
                    recipes
                  </p>
                </div>
              </div>

              <Separator className="bg-green-200" />

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Popular Cooking Strains</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Girl Scout Cookies (Hybrid)</h4>
                    <p className="text-sm text-gray-700">
                      Sweet, earthy flavor. 20-28% THC. Perfect for desserts and sweet edibles.
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Blue Dream (Hybrid)</h4>
                    <p className="text-sm text-gray-700">
                      Berry flavor. 17-24% THC. Balanced effects, great for all-purpose cooking.
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Granddaddy Purple (Indica)</h4>
                    <p className="text-sm text-gray-700">
                      Grape, berry notes. 17-23% THC. Excellent for relaxation edibles.
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Sour Diesel (Sativa)</h4>
                    <p className="text-sm text-gray-700">
                      Diesel, citrus flavor. 19-25% THC. Energizing, creative daytime edibles.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Safety Tab */}
        <TabsContent value="safety" className="space-y-6">
          <Card className="bg-white border-red-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Safety First
              </CardTitle>
              <CardDescription className="text-gray-700">
                Essential safety guidelines for cannabis cooking and consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-100 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    Start Low, Go Slow
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>• Begin with 2.5-5mg THC for first-time users</li>
                    <li>• Wait at least 2 hours before consuming more</li>
                    <li>• Effects can take 30-120 minutes to appear</li>
                    <li>• Effects last 4-8 hours, sometimes longer</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-100 p-5 rounded-lg">
                  <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Storage & Labeling
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>• Label all cannabis products clearly</li>
                    <li>• Store in child-proof containers</li>
                    <li>• Keep separate from regular food</li>
                    <li>• Store in cool, dark, secure location</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-100 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    Do Not
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>• Drive or operate machinery after consuming</li>
                    <li>• Mix with alcohol or other substances</li>
                    <li>• Give to minors or pets</li>
                    <li>• Consume if pregnant or breastfeeding</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-100 p-5 rounded-lg">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Know Your Limits
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-800">
                    <li>• Tolerance varies greatly between individuals</li>
                    <li>• Body weight affects dosing requirements</li>
                    <li>• Empty stomach increases effects</li>
                    <li>• Have CBD on hand to counteract overconsumption</li>
                  </ul>
                </div>
              </div>

              <Separator className="bg-red-200" />

              <div className="bg-red-50 p-5 rounded-lg border border-red-300">
                <h3 className="font-bold text-red-900 mb-3">What to Do If You Overconsume</h3>
                <ul className="space-y-2 text-sm text-red-800">
                  <li>• Stay calm - you cannot overdose fatally on THC</li>
                  <li>• Find a safe, comfortable place to rest</li>
                  <li>• Drink water and eat light snacks</li>
                  <li>• Try CBD if available (counteracts THC effects)</li>
                  <li>• Black pepper or lemon can help reduce anxiety</li>
                  <li>• Sleep it off - effects will pass with time</li>
                  <li>• Seek medical help if experiencing severe anxiety or panic</li>
                </ul>
              </div>

              <div className="bg-green-50 border border-green-100 p-5 rounded-lg">
                <h3 className="font-bold text-white mb-3">Legal Considerations</h3>
                <p className="text-sm text-gray-800 mb-3">
                  Cannabis laws vary by location. Before cooking with cannabis:
                </p>
                <ul className="space-y-2 text-sm text-gray-800">
                  <li>• Verify cannabis is legal in your jurisdiction</li>
                  <li>• Understand possession and cultivation limits</li>
                  <li>• Know regulations about homemade edibles</li>
                  <li>• Never transport across state/international borders</li>
                  <li>• Keep up to date with changing laws</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}