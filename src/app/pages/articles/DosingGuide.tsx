import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Calculator, ArrowRight, AlertTriangle, CheckCircle, Clock, Beaker, Scale, ChefHat } from "lucide-react";
import { Link } from "react-router";

export function DosingGuide() {
  const relatedArticles = [
    { title: "Beginner Cooking Guide", path: "/learn/articles/beginner-guide" },
    { title: "4 Types of THC Edibles", path: "/learn/articles/edible-types" },
    { title: "Easy THC Recipes", path: "/learn/articles/easy-recipes" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-sm text-gray-600">
        <Link to="/learn" className="hover:text-green-600">Learn</Link> / <span className="text-gray-900">Dosing Guide</span>
      </div>

      <Card className="bg-white border-purple-200 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="bg-purple-600 text-white mb-3">Safety First</Badge>
              <CardTitle className="text-3xl text-gray-900 mb-3">
                How to Dose THC Edibles Correctly (Stop Guessing)
              </CardTitle>
              <p className="text-lg text-gray-600">
                Learn the standard dose guide, how to calculate perfect portions every time, and avoid the most common — and most uncomfortable — mistakes in cannabis cooking.
              </p>
            </div>
            <Calculator className="w-14 h-14 text-purple-600 flex-shrink-0 ml-4 mt-1" />
          </div>
        </CardHeader>

        <CardContent className="space-y-10">

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Why Dosing Matters More Than You Think</h2>
            <p className="text-gray-700 leading-relaxed">
              The #1 mistake people make with edibles is guessing. Unlike smoking or vaping — where effects hit in minutes and you can gauge how much you have had — edibles are absorbed through your digestive system and processed by your liver. This converts THC into a more potent form called 11-hydroxy-THC, which hits harder and lasts significantly longer than inhaled cannabis.
            </p>
            <p className="text-gray-700 leading-relaxed">
              The result: an edible can take anywhere from 30 minutes to 2 hours to kick in depending on your metabolism, what you have eaten, and your body composition. Many people eat a serving, feel nothing after an hour, eat more — and then both doses hit at once. This double dose mistake is responsible for the vast majority of uncomfortable edible experiences.
            </p>
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 flex gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">The Golden Rule of Edibles</p>
                <p className="text-amber-700 text-sm leading-relaxed">
                  Start low, go slow. Take your dose, then wait a full 90–120 minutes before considering more. You can always take more — you can never take less.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">The Standard THC Dose Guide</h2>
            <p className="text-gray-700">
              These are widely accepted benchmarks used across the legal cannabis industry. Individual responses vary based on tolerance, body weight, metabolism, and consumption history — but these are reliable starting points.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { mg: "1–2.5 mg", label: "Microdose", color: "bg-teal-50 border-teal-300", textColor: "text-teal-700", badge: "bg-teal-100 text-teal-800", desc: "Subtle effects. Great for first-timers, daytime use, or pairing with coffee or tea. Most people feel relaxed focus without impairment." },
                { mg: "5 mg", label: "Beginner", color: "bg-green-50 border-green-300", textColor: "text-green-700", badge: "bg-green-100 text-green-800", desc: "The recommended starting dose for most new consumers. Mild euphoria and relaxation. Legal dispensaries often use 5mg as a single serving." },
                { mg: "10 mg", label: "Standard", color: "bg-blue-50 border-blue-300", textColor: "text-blue-700", badge: "bg-blue-100 text-blue-800", desc: "The most common dose for recreational consumers with some experience. Clear psychoactive effects. Colorado and other regulated markets list 10mg as a standard serving." },
                { mg: "25 mg", label: "Strong", color: "bg-orange-50 border-orange-300", textColor: "text-orange-700", badge: "bg-orange-100 text-orange-800", desc: "High dose for experienced consumers with established tolerance. Intense psychoactive effects. Not recommended for beginners under any circumstances." },
                { mg: "50 mg", label: "Very Strong", color: "bg-red-50 border-red-300", textColor: "text-red-700", badge: "bg-red-100 text-red-800", desc: "Suitable only for high-tolerance consumers or medical patients. Can cause extreme sedation, anxiety, or disorientation in those not accustomed to it." },
                { mg: "100 mg+", label: "Extreme", color: "bg-gray-50 border-gray-400", textColor: "text-gray-700", badge: "bg-gray-200 text-gray-800", desc: "Reserved for patients with very high tolerance, often with a documented medical need. Not appropriate for recreational use except by the most experienced consumers." },
              ].map((dose) => (
                <div key={dose.label} className={`${dose.color} border rounded-xl p-4 space-y-2`}>
                  <div className={`text-3xl font-extrabold ${dose.textColor}`}>{dose.mg}</div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block ${dose.badge}`}>{dose.label}</span>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">{dose.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Calculator className="w-7 h-7 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">How to Calculate Your Dose Precisely</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              The math is simple once you understand the chain from raw cannabis to finished edible. Every step has a factor that affects final potency.
            </p>
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  icon: <Scale className="w-5 h-5 text-purple-600" />,
                  title: "Calculate Total THC in Your Cannabis",
                  body: (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Multiply the weight of your cannabis in grams by its THC percentage:</p>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 font-mono text-purple-800">
                        Total THC (mg) = Grams × (THC% ÷ 100) × 1000
                      </div>
                      <p className="text-gray-500 italic">Example: 7g at 20% THC = 7 × 0.20 × 1000 = <strong className="text-gray-700">1,400 mg total THC</strong></p>
                    </div>
                  ),
                },
                {
                  step: "2",
                  icon: <Beaker className="w-5 h-5 text-purple-600" />,
                  title: "Apply Decarboxylation and Infusion Efficiency",
                  body: (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Not all THC survives the cooking process. Apply two efficiency factors:</p>
                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="font-semibold text-gray-800">Decarboxylation</p>
                          <p className="text-2xl font-bold text-purple-600 mt-1">~85%</p>
                          <p className="text-xs text-gray-500 mt-1">Typical efficiency converting THCA to THC at 230–250°F for 35–45 min</p>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <p className="font-semibold text-gray-800">Fat Infusion</p>
                          <p className="text-2xl font-bold text-purple-600 mt-1">70–80%</p>
                          <p className="text-xs text-gray-500 mt-1">Typical extraction into butter or oil. Coconut oil ~80%, butter ~70%</p>
                        </div>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 font-mono text-purple-800 mt-2">
                        Usable THC = 1,400 × 0.85 × 0.75 = ~<strong>893 mg</strong>
                      </div>
                    </div>
                  ),
                },
                {
                  step: "3",
                  icon: <ChefHat className="w-5 h-5 text-purple-600" />,
                  title: "Divide by Number of Servings",
                  body: (
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>Divide your usable THC by how many portions you are making:</p>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 font-mono text-purple-800">
                        Per Serving = Usable THC ÷ Number of Servings
                      </div>
                      <p className="text-gray-500 italic">Example: 893 mg ÷ 16 brownies = <strong className="text-gray-700">~56 mg per brownie</strong></p>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                        <p className="text-amber-800 text-xs">56mg is a very strong dose. To bring this to 10mg per serving you would need to cut into roughly 89 pieces, or use less cannabis — about 1–2 grams instead of 7.</p>
                      </div>
                    </div>
                  ),
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-sm">{item.step}</div>
                  <div className="flex-1 bg-white border border-purple-100 rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      {item.icon}
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    {item.body}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">Dosing by Product Type</h2>
            <p className="text-gray-700">Different infusion bases and product types have different potency profiles and onset times:</p>
            <div className="space-y-3">
              {[
                { emoji: "🧈", name: "Cannabutter / Infused Oils", onset: "45–90 min", duration: "4–8 hrs", note: "Classic edible base. Potency varies by infusion quality. Always label your infusion with mg per gram or mg per tablespoon so you can calculate accurately in recipes." },
                { emoji: "💧", name: "Tinctures (Sublingual)", onset: "15–30 min", duration: "2–4 hrs", note: "Fastest onset of any edible method when held under the tongue for 60–90 seconds before swallowing. More predictable than food-based edibles." },
                { emoji: "🍋", name: "THC Squeeze / Nano-Emulsified", onset: "15–30 min", duration: "2–3 hrs", note: "Nano-emulsification dramatically speeds absorption. Products like Select Squeeze (5mg per squeeze) or Zero Proof Stir (5mg per packet) behave more like alcohol in terms of onset. Start with 1 dose and wait 30 minutes." },
                { emoji: "🍯", name: "THC Syrups and Agave", onset: "30–60 min", duration: "3–6 hrs", note: "Sweet, liquid THC. Easy to over-pour — always use a measured dropper or syringe, never free-pour directly from the bottle." },
                { emoji: "💊", name: "Capsules / Gel Caps", onset: "60–90 min", duration: "6–8 hrs", note: "Most consistent dosing of all edible formats. No guesswork — what is on the label is what you get. Ideal for medical use or daily consistency." },
                { emoji: "🍬", name: "Gummies / Candy", onset: "45–90 min", duration: "4–6 hrs", note: "The most popular edible format. Commercially made gummies are very precise. Homemade gummies can vary — pour into molds consistently and use a digital scale to verify mold volume." },
              ].map((product) => (
                <div key={product.name} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 shadow-sm">
                  <span className="text-3xl flex-shrink-0">{product.emoji}</span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Onset: {product.onset}
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Duration: {product.duration}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{product.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">Factors That Affect How You Feel</h2>
            <p className="text-gray-700">Two people can eat the exact same 10mg brownie and have completely different experiences. Here is why:</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Tolerance", icon: "🏋️", desc: "Regular consumers need significantly higher doses to achieve the same effects as occasional users. Tolerance builds quickly with daily use and resets with a 2–4 week break." },
                { title: "Body Composition", icon: "⚖️", desc: "THC is fat-soluble, meaning it binds to fat tissue. People with higher body fat may find effects last longer. Body weight alone is not a reliable predictor of tolerance." },
                { title: "Metabolism", icon: "⚡", desc: "A fast metabolism processes THC more quickly, leading to faster onset and shorter duration. Eating a full meal before dosing typically delays onset but smooths out the experience." },
                { title: "Empty vs. Full Stomach", icon: "🍽️", desc: "Dosing on an empty stomach speeds onset dramatically and can intensify effects. Eating fatty foods alongside edibles can actually increase absorption due to THC's fat-soluble nature." },
                { title: "Individual Biology", icon: "🧬", desc: "Endocannabinoid system density varies between individuals. Some people are genetically more sensitive to THC — no amount of experience can predict this for someone new." },
                { title: "Cannabis Strain", icon: "🌿", desc: "Indica vs. sativa vs. hybrid produces different effect profiles even at the same THC mg. Terpene content significantly shapes the experience beyond just THC percentage." },
              ].map((factor) => (
                <div key={factor.title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{factor.icon}</span>
                    <h3 className="font-semibold text-gray-900">{factor.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{factor.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-5">
            <h2 className="text-2xl font-bold text-gray-900">The 7 Most Common Dosing Mistakes</h2>
            <div className="space-y-3">
              {[
                { mistake: "Not waiting long enough", fix: "Always wait at least 90 minutes — preferably 2 hours — before concluding a dose is not working. Many people re-dose too soon and end up overwhelmed when both hit together." },
                { mistake: "Uneven mixing", fix: "THC-infused butter or oil does not distribute evenly through batter automatically. Mix thoroughly so every portion gets the same amount of infusion. Hotspots in homemade edibles are very real." },
                { mistake: "Eyeballing portions", fix: "Cut brownies or bars with a ruler and knife, not by feel. A 1cm difference in cut size can mean a 20–30% difference in dose per piece. Use a kitchen scale for precise portioning." },
                { mistake: "Forgetting the decarb step", fix: "Raw cannabis does NOT get you high. THCA must be converted to THC through heat (decarboxylation). Skip this step and your edibles will have almost no effect." },
                { mistake: "Using the same dose as a friend", fix: "Tolerance and biology vary enormously between people. Someone's normal dose can be overwhelming for someone else. Always start with your own assessment." },
                { mistake: "Mixing with alcohol", fix: "Alcohol significantly amplifies the effects of THC. Even a small amount of alcohol can turn a manageable dose into an intense experience. Use extra caution if combining." },
                { mistake: "Not labeling your infusions", fix: "Always write the date, strain, THC%, cannabis amount, and base amount on every container. Without this, future dose calculations are pure guesswork." },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 bg-white border border-red-100 rounded-xl p-4 shadow-sm">
                  <div className="flex-shrink-0 w-7 h-7 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold text-xs">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-800 mb-1">❌ {item.mistake}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <span className="font-medium text-green-700">✅ Fix: </span>{item.fix}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">If You Took Too Much — What To Do</h2>
            <p className="text-gray-700 leading-relaxed">
              Overconsumption of THC is uncomfortable but not physically dangerous. No one has ever died from a cannabis overdose. However, the experience can be genuinely distressing — elevated heart rate, paranoia, dizziness, and nausea are common symptoms. Here is what helps:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: "Stay calm", desc: "Remind yourself this is temporary. The effects will pass. THC has never caused a fatal overdose in its entire history of human use." },
                { title: "Change your environment", desc: "Move to a calm, quiet space. Lie down if you feel dizzy. Dim the lights and put on comfortable, familiar music or a show you know well." },
                { title: "Eat and drink water", desc: "Having food and water on hand helps. Black pepper — smell it or chew a few peppercorns — contains beta-caryophyllene, a terpene many people find counteracts THC anxiety." },
                { title: "CBD can help", desc: "CBD modulates THC's anxiety-inducing effects. If you have a CBD tincture available, a dose of 25–50mg may reduce the intensity of the experience." },
              ].map((tip) => (
                <div key={tip.title} className="bg-green-50 border border-green-200 rounded-xl p-4 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">{tip.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 text-white">
            <p className="text-lg font-bold mb-2">💡 Use Infusion Sensei to Do the Math For You</p>
            <p className="text-purple-100 leading-relaxed mb-4">
              Instead of calculating manually, use the My Infusions page to input your cannabis strain, THC%, and base amount. Infusion Sensei automatically calculates total THC, mg per gram, and tracks it through your recipes so every serving shows exact milligrams — no guesswork, no spreadsheets.
            </p>
            <Link
              to="/infusions"
              className="inline-flex items-center gap-2 bg-white text-purple-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-purple-50 transition-colors"
            >
              Go to My Infusions <ArrowRight className="w-4 h-4" />
            </Link>
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
              className="p-4 bg-white border border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-900 group-hover:text-purple-700">{article.title}</span>
                <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
