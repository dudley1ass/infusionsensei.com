import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat, Flame, Star } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

type Sauce = {
  id: string;
  name: string;
  type: "Butter" | "Reduction" | "Oil" | "Honey" | "Emulsion";
  profile: string;
  build: string;
  tags: string[];
  emoji: string;
  heat: 0 | 1 | 2 | 3; // 0=none, 1=mild, 2=medium, 3=hot
  sweetness: 0 | 1 | 2 | 3;
};

const SAUCES: Sauce[] = [
  // Classic / Core
  { id: "classic-buffalo", name: "Classic Buffalo", type: "Butter", profile: "Spicy / Tangy", build: "Cannabutter + hot sauce + garlic", tags: ["spicy", "classic"], emoji: "🌶️", heat: 2, sweetness: 0 },
  { id: "garlic-parmesan", name: "Garlic Parmesan", type: "Butter", profile: "Savory / Rich", build: "Cannabutter + garlic → toss → parmesan finish", tags: ["garlic", "creamy", "classic"], emoji: "🧄", heat: 0, sweetness: 0 },
  { id: "honey-bbq", name: "Honey BBQ", type: "Reduction", profile: "Sweet / Smoky", build: "BBQ + honey + smoked paprika", tags: ["sweet", "smoky", "classic"], emoji: "🍯", heat: 0, sweetness: 2 },
  { id: "lemon-pepper", name: "Lemon Pepper Butter", type: "Butter", profile: "Bright / Salty", build: "Cannabutter + lemon zest + cracked pepper", tags: ["citrus", "classic"], emoji: "🍋", heat: 0, sweetness: 0 },
  { id: "teriyaki", name: "Teriyaki Glaze", type: "Reduction", profile: "Sweet / Umami", build: "Soy + sugar + ginger → simmer thick", tags: ["sweet", "asian-style"], emoji: "🫙", heat: 0, sweetness: 2 },
  // Spicy / Bold
  { id: "mango-habanero", name: "Mango Habanero", type: "Reduction", profile: "Sweet Heat", build: "Mango + habanero + vinegar", tags: ["spicy", "sweet"], emoji: "🥭", heat: 3, sweetness: 2 },
  { id: "nashville-hot", name: "Nashville Hot Oil", type: "Oil", profile: "Hot / Smoky", build: "Cannabis oil + cayenne + paprika + brown sugar", tags: ["spicy", "smoky"], emoji: "🔥", heat: 3, sweetness: 1 },
  { id: "chili-crisp", name: "Chili Crisp", type: "Oil", profile: "Crunchy / Spicy", build: "Cannabis oil + chili flakes + garlic + sesame", tags: ["spicy", "asian-style", "garlic"], emoji: "🌶️", heat: 2, sweetness: 0 },
  { id: "cajun-butter", name: "Cajun Butter", type: "Butter", profile: "Spiced / Savory", build: "Cannabutter + Cajun seasoning + garlic", tags: ["spicy", "garlic"], emoji: "🫑", heat: 2, sweetness: 0 },
  { id: "sriracha-honey", name: "Sriracha Honey", type: "Honey", profile: "Sweet Heat", build: "Honey + sriracha + lime", tags: ["spicy", "sweet"], emoji: "🍋", heat: 2, sweetness: 2 },
  // Sweet / Sticky
  { id: "maple-bacon", name: "Maple Bacon Glaze", type: "Reduction", profile: "Sweet / Smoky", build: "Maple syrup + bacon fat + pepper", tags: ["sweet", "smoky"], emoji: "🥓", heat: 0, sweetness: 3 },
  { id: "brown-sugar-bourbon", name: "Brown Sugar Bourbon", type: "Reduction", profile: "Deep / Caramel", build: "Brown sugar + bourbon + cannabutter", tags: ["sweet", "smoky"], emoji: "🥃", heat: 0, sweetness: 3 },
  { id: "pineapple-ginger", name: "Pineapple Ginger", type: "Reduction", profile: "Tropical / Fresh", build: "Pineapple juice + ginger + soy", tags: ["sweet", "asian-style"], emoji: "🍍", heat: 1, sweetness: 2 },
  { id: "honey-mustard", name: "Honey Mustard Infusion", type: "Emulsion", profile: "Tangy / Sweet", build: "Honey + mustard + cannabis oil", tags: ["sweet", "creamy"], emoji: "🍯", heat: 0, sweetness: 2 },
  { id: "orange-glaze", name: "Orange Glaze", type: "Reduction", profile: "Citrus / Sweet", build: "Orange juice + sugar + soy", tags: ["sweet", "citrus"], emoji: "🍊", heat: 0, sweetness: 2 },
  // Savory / Umami
  { id: "korean-gochujang", name: "Korean Gochujang", type: "Reduction", profile: "Sweet / Funky / Spicy", build: "Gochujang + honey + soy + garlic", tags: ["spicy", "asian-style", "garlic"], emoji: "🇰🇷", heat: 2, sweetness: 1 },
  { id: "garlic-soy-umami", name: "Garlic Soy Umami", type: "Oil", profile: "Deep / Salty", build: "Cannabis oil + garlic + soy + sugar", tags: ["garlic", "asian-style"], emoji: "🧄", heat: 0, sweetness: 1 },
  { id: "truffle-butter", name: "Truffle Butter", type: "Butter", profile: "Rich / Earthy", build: "Cannabutter + truffle oil + parmesan", tags: ["creamy", "garlic"], emoji: "🍄", heat: 0, sweetness: 0 },
  { id: "chimichurri", name: "Herb Chimichurri", type: "Oil", profile: "Fresh / Herbal", build: "Cannabis oil + parsley + garlic + vinegar", tags: ["garlic", "citrus"], emoji: "🌿", heat: 0, sweetness: 0 },
  { id: "ranch-butter", name: "Ranch Butter Toss", type: "Butter", profile: "Creamy / Familiar", build: "Cannabutter + ranch seasoning + garlic", tags: ["creamy", "garlic", "classic"], emoji: "🤍", heat: 0, sweetness: 0 },
];

const TAGS = ["all", "spicy", "sweet", "garlic", "citrus", "smoky", "creamy", "asian-style", "classic"];
const TAG_LABELS: Record<string, string> = {
  all: "All Sauces", spicy: "🌶️ Spicy", sweet: "🍯 Sweet", garlic: "🧄 Garlic",
  citrus: "🍋 Citrus", smoky: "🔥 Smoky", creamy: "🤍 Creamy", "asian-style": "🥢 Asian", classic: "⭐ Classic"
};

const TYPE_COLORS: Record<string, string> = {
  Butter: "bg-yellow-100 text-yellow-800",
  Reduction: "bg-orange-100 text-orange-800",
  Oil: "bg-green-100 text-green-700",
  Honey: "bg-amber-100 text-amber-800",
  Emulsion: "bg-blue-100 text-blue-700",
};

const SECTIONS = [
  { label: "⭐ Classic / Core", ids: ["classic-buffalo","garlic-parmesan","honey-bbq","lemon-pepper","teriyaki"] },
  { label: "🌶️ Spicy / Bold", ids: ["mango-habanero","nashville-hot","chili-crisp","cajun-butter","sriracha-honey"] },
  { label: "🍯 Sweet / Sticky", ids: ["maple-bacon","brown-sugar-bourbon","pineapple-ginger","honey-mustard","orange-glaze"] },
  { label: "🧄 Savory / Umami", ids: ["korean-gochujang","garlic-soy-umami","truffle-butter","chimichurri","ranch-butter"] },
];

const SAUCE_TO_BUILDER_RECIPE: Record<string, string> = {
  "classic-buffalo": "classic-buffalo-wings",
  "garlic-parmesan": "garlic-parmesan-wings",
  "honey-bbq": "honey-bbq-wings",
  "lemon-pepper": "lemon-pepper-wings",
  teriyaki: "honey-bbq-wings",
  "mango-habanero": "mango-habanero-wings",
  "nashville-hot": "nashville-hot-wings",
  "chili-crisp": "korean-gochujang-wings",
  "cajun-butter": "cajun-butter-wings",
  "sriracha-honey": "sriracha-honey-wings",
  "maple-bacon": "honey-bbq-wings",
  "brown-sugar-bourbon": "honey-bbq-wings",
  "pineapple-ginger": "honey-bbq-wings",
  "honey-mustard": "honey-mustard-wings",
  "orange-glaze": "lemon-pepper-wings",
  "korean-gochujang": "korean-gochujang-wings",
  "garlic-soy-umami": "garlic-parmesan-wings",
  "truffle-butter": "truffle-butter-wings",
  chimichurri: "lemon-pepper-wings",
  "ranch-butter": "ranch-butter-wings",
};

function HeatDots({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3].map(i => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? "bg-red-500" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

function SweetnessBar({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3].map(i => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? "bg-amber-400" : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

export function WingSauces() {
  const [activeTag, setActiveTag] = useState("all");
  const [selectedSauce, setSelectedSauce] = useState<Sauce | null>(null);
  const [searchParams] = useSearchParams();

  const sauceIdParam = searchParams.get("sauce");
  const servingsParamRaw = searchParams.get("servings");
  const servingsOverride = servingsParamRaw ? Math.max(1, Math.floor(Number(servingsParamRaw) || 1)) : null;
  const returnToPartyPack = searchParams.get("returnToPartyPack");
  const partyPackId = searchParams.get("partyPackId");
  const partyItemId = searchParams.get("partyItemId");

  const filtered = activeTag === "all"
    ? SAUCES
    : SAUCES.filter(s => s.tags.includes(activeTag));

  const filteredSections = SECTIONS.map(sec => ({
    ...sec,
    sauces: sec.ids.map(id => SAUCES.find(s => s.id === id)!).filter(s =>
      activeTag === "all" || s.tags.includes(activeTag)
    )
  })).filter(sec => sec.sauces.length > 0);

  useEffect(() => {
    if (!sauceIdParam) return;
    const found = SAUCES.find((s) => s.id === sauceIdParam);
    if (found) {
      setActiveTag("all");
      setSelectedSauce(found);
    }
  }, [sauceIdParam]);

  const servingsQuery = servingsOverride ? `&servings=${encodeURIComponent(servingsOverride)}` : "";
  const returnQuery =
    returnToPartyPack && partyPackId && partyItemId
      ? `&returnToPartyPack=${encodeURIComponent(returnToPartyPack)}&partyPackId=${encodeURIComponent(
          partyPackId
        )}&partyItemId=${encodeURIComponent(partyItemId)}`
      : "";

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <Helmet>
        <title>20 Infused Wing Sauces | Cannabis Chicken Wings | Infusion Sensei</title>
        <meta name="description" content="20 cannabis-infused wing sauce recipes — buffalo, honey BBQ, Nashville hot, teriyaki, and more. Every sauce built with cannabutter or cannabis oil for exact THC dosing." />
      </Helmet>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{minHeight: "280px"}}>
        <img src="/IMAGES/chickenwings.jpg" alt="Infused chicken wings" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 px-6 py-14 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Infused Wing Sauces</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
            20 cannabis wing sauce recipes — every sauce built with cannabutter or cannabis oil so you know the exact THC per wing.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">🔥 20 Sauces</Badge>
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">🧈 Butter • Oil • Reduction</Badge>
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">⚖️ Exact THC Per Wing</Badge>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Filter by flavor</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTag === tag
                  ? "bg-orange-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-orange-100 hover:text-orange-700"
              }`}
            >
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} sauce{filtered.length !== 1 ? "s" : ""} shown</p>
      </div>

      {/* Sauce Grid by Section */}
      {filteredSections.map(section => (
        <div key={section.label}>
          <h2 className="text-xl font-black text-gray-900 mb-4">{section.label}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.sauces.map(sauce => (
              <button
                key={sauce.id}
                onClick={() => setSelectedSauce(selectedSauce?.id === sauce.id ? null : sauce)}
                className={`bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${
                  selectedSauce?.id === sauce.id
                    ? "border-orange-400 shadow-lg shadow-orange-100"
                    : "border-gray-200 hover:border-orange-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{sauce.emoji}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[sauce.type]}`}>
                    {sauce.type}
                  </span>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1">{sauce.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{sauce.profile}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <span>Heat</span>
                    <HeatDots level={sauce.heat} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>Sweet</span>
                    <SweetnessBar level={sauce.sweetness} />
                  </div>
                </div>

                {/* Expanded recipe */}
                {selectedSauce?.id === sauce.id && (
                  <div className="mt-4 pt-4 border-t border-orange-100 space-y-3" onClick={e => e.stopPropagation()}>
                    <div className="bg-orange-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">How to Build</p>
                      <p className="text-sm text-gray-700">{sauce.build}</p>
                    </div>
                    <SauceRecipe sauce={sauce} />
                    <Link
                      to={`/ingredients?category=wings&recipe=${
                        SAUCE_TO_BUILDER_RECIPE[sauce.id] ?? "classic-buffalo-wings"
                      }${servingsQuery}${returnQuery}`}
                      className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                      onClick={e => { e.stopPropagation(); if(typeof window.gtag==="function") window.gtag("event","move_to_builder",{source:"wingsauces"}); }}
                    >
                      <ChefHat className="w-4 h-4" /> Move to Recipe Builder
                    </Link>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-2xl font-black mb-2">Know Your Exact THC Per Wing</h2>
        <p className="text-green-200 mb-6 max-w-lg mx-auto">Enter your cannabutter or cannabis oil potency and the tool calculates exact milligrams per wing automatically.</p>
        <Link to="/infusions">
          <Button className="bg-white text-green-800 hover:bg-green-50 font-black text-base px-8 py-3">
            Open Recipe Builder <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// Full recipe for each sauce
function SauceRecipe({ sauce }: { sauce: Sauce }) {
  const recipes: Record<string, { servings: string; ingredients: string[]; steps: string[]; note: string }> = {
    "classic-buffalo": {
      servings: "2 lbs wings",
      ingredients: ["4 tbsp cannabutter", "½ cup hot sauce (Frank's RedHot)", "1 tsp garlic powder", "Salt to taste"],
      steps: ["Melt cannabutter in saucepan over low heat.", "Whisk in hot sauce and garlic powder until smooth.", "Toss cooked wings in sauce and serve immediately."],
      note: "Toss ratio: 2 tbsp sauce per 6 wings."
    },
    "garlic-parmesan": {
      servings: "2 lbs wings",
      ingredients: ["4 tbsp cannabutter", "4 cloves garlic (minced)", "½ cup grated parmesan", "1 tsp Italian seasoning", "Salt & pepper"],
      steps: ["Melt cannabutter over medium-low heat.", "Sauté garlic 1-2 min until fragrant — don't brown.", "Toss wings in garlic butter, then top with parmesan."],
      note: "Add parmesan after tossing so it sticks."
    },
    "honey-bbq": {
      servings: "2 lbs wings",
      ingredients: ["½ cup BBQ sauce", "3 tbsp honey", "1 tbsp cannabis coconut oil", "1 tsp smoked paprika"],
      steps: ["Whisk all ingredients together in a bowl.", "Warm slightly to combine the oil.", "Toss hot wings to coat fully."],
      note: "Works great as a dipping sauce too."
    },
    "lemon-pepper": {
      servings: "2 lbs wings",
      ingredients: ["4 tbsp cannabutter", "Zest of 2 lemons", "2 tsp cracked black pepper", "1 tsp garlic powder", "½ tsp salt"],
      steps: ["Melt cannabutter and stir in all seasonings.", "Zest lemons directly into butter.", "Toss wings immediately while hot."],
      note: "Dry the wings well before cooking for crispiness."
    },
    "teriyaki": {
      servings: "2 lbs wings",
      ingredients: ["¼ cup soy sauce", "3 tbsp sugar", "1 tbsp cannabis coconut oil", "1 tsp fresh ginger (grated)", "1 tsp cornstarch + 1 tbsp water"],
      steps: ["Combine soy, sugar, oil, and ginger in a saucepan.", "Simmer 3-4 min until slightly thickened.", "Stir in cornstarch slurry and cook 1 min more. Toss wings."],
      note: "Glaze gets stickier as it cools."
    },
    "mango-habanero": {
      servings: "2 lbs wings",
      ingredients: ["1 cup mango (fresh or frozen)", "1 habanero (seeded for less heat)", "2 tbsp cannabis coconut oil", "2 tbsp apple cider vinegar", "1 tbsp honey", "Salt to taste"],
      steps: ["Blend mango, habanero, vinegar, and honey until smooth.", "Heat cannabis oil in saucepan, pour in blended sauce.", "Simmer 5 min. Blend again for silky texture. Toss wings."],
      note: "Wear gloves when handling habanero."
    },
    "nashville-hot": {
      servings: "2 lbs wings",
      ingredients: ["¼ cup cannabis coconut oil", "2 tbsp cayenne pepper", "1 tbsp smoked paprika", "1 tbsp brown sugar", "1 tsp garlic powder", "Salt to taste"],
      steps: ["Heat cannabis oil to 300°F — do not boil.", "Whisk in all spices and brown sugar.", "Brush or toss hot wings immediately after frying."],
      note: "Serve over white bread with pickles."
    },
    "chili-crisp": {
      servings: "2 lbs wings",
      ingredients: ["3 tbsp cannabis oil", "2 tbsp chili flakes", "4 cloves garlic (thinly sliced)", "1 tbsp sesame seeds", "1 tsp sugar", "Salt to taste"],
      steps: ["Heat cannabis oil in pan over medium.", "Fry garlic slices until golden, 2-3 min.", "Add chili flakes, sesame, sugar. Cool slightly. Toss wings."],
      note: "The crispy garlic bits are the best part."
    },
    "cajun-butter": {
      servings: "2 lbs wings",
      ingredients: ["4 tbsp cannabutter", "2 tsp Cajun seasoning", "1 tsp garlic powder", "½ tsp cayenne (optional)", "1 tsp hot sauce"],
      steps: ["Melt cannabutter over low heat.", "Stir in Cajun seasoning, garlic, cayenne, and hot sauce.", "Toss wings in sauce right out of the oven."],
      note: "Make your own Cajun blend: paprika + oregano + thyme + garlic + pepper."
    },
    "sriracha-honey": {
      servings: "2 lbs wings",
      ingredients: ["3 tbsp cannabis honey or regular honey + cannabis coconut oil", "2 tbsp sriracha", "Juice of 1 lime", "1 tsp soy sauce"],
      steps: ["Whisk honey, sriracha, lime juice, and soy together.", "Warm gently if using solid cannabis coconut oil.", "Toss wings thoroughly — sauce should coat every inch."],
      note: "Add more sriracha to increase heat."
    },
    "maple-bacon": {
      servings: "2 lbs wings",
      ingredients: ["3 tbsp pure maple syrup", "2 tbsp bacon fat (from cooked bacon)", "1 tbsp cannabis coconut oil", "1 tsp black pepper", "Pinch of salt"],
      steps: ["Combine maple syrup, bacon fat, and cannabis oil.", "Warm over low heat until combined.", "Toss wings and top with crumbled bacon."],
      note: "Cook bacon first and use that fat."
    },
    "brown-sugar-bourbon": {
      servings: "2 lbs wings",
      ingredients: ["3 tbsp brown sugar", "2 tbsp bourbon", "2 tbsp cannabutter", "1 tsp Worcestershire sauce", "½ tsp smoked paprika"],
      steps: ["Melt cannabutter in saucepan over medium.", "Add bourbon and cook off alcohol 1 min.", "Add brown sugar, Worcestershire, paprika. Simmer until glossy."],
      note: "Sauce thickens as it cools — toss wings while it's still hot."
    },
    "pineapple-ginger": {
      servings: "2 lbs wings",
      ingredients: ["½ cup pineapple juice", "1 tbsp cannabis coconut oil", "1 tbsp soy sauce", "1 tsp fresh ginger (grated)", "1 tsp cornstarch + 1 tbsp water"],
      steps: ["Combine pineapple juice, oil, soy, and ginger in pan.", "Bring to simmer and cook 3 min.", "Stir in cornstarch slurry, cook 1 min until glossy. Toss wings."],
      note: "Fresh pineapple juice works best."
    },
    "honey-mustard": {
      servings: "2 lbs wings",
      ingredients: ["3 tbsp honey", "2 tbsp Dijon mustard", "1 tbsp cannabis coconut oil", "1 tsp apple cider vinegar", "Salt & pepper"],
      steps: ["Whisk all ingredients together until emulsified.", "Warm slightly to melt the cannabis oil.", "Toss wings and serve extra as a dip."],
      note: "For a creamier version, add 1 tbsp mayo."
    },
    "orange-glaze": {
      servings: "2 lbs wings",
      ingredients: ["½ cup orange juice (fresh)", "2 tbsp sugar", "1 tbsp soy sauce", "1 tbsp cannabis coconut oil", "1 tsp orange zest", "1 tsp cornstarch"],
      steps: ["Combine OJ, sugar, soy, and oil in saucepan.", "Simmer 5 min until reduced by half.", "Add cornstarch slurry, cook 1 min. Stir in zest. Toss wings."],
      note: "Fresh orange juice makes a big difference."
    },
    "korean-gochujang": {
      servings: "2 lbs wings",
      ingredients: ["2 tbsp gochujang paste", "2 tbsp honey", "1 tbsp soy sauce", "1 tbsp cannabis coconut oil", "3 cloves garlic (minced)", "1 tsp sesame oil"],
      steps: ["Whisk gochujang, honey, soy, garlic, and oils together.", "Warm over low heat 2 min until smooth.", "Toss wings and top with sesame seeds and scallions."],
      note: "Gochujang is found in the Asian section of most grocery stores."
    },
    "garlic-soy-umami": {
      servings: "2 lbs wings",
      ingredients: ["3 tbsp cannabis oil", "4 cloves garlic (minced)", "3 tbsp soy sauce", "1 tbsp sugar", "1 tsp sesame oil"],
      steps: ["Heat cannabis oil in pan, sauté garlic until golden.", "Add soy sauce and sugar — simmer 2 min.", "Remove from heat, add sesame oil. Toss wings."],
      note: "Simple but deeply savory — a crowd favorite."
    },
    "truffle-butter": {
      servings: "2 lbs wings",
      ingredients: ["4 tbsp cannabutter", "1 tbsp truffle oil", "¼ cup grated parmesan", "1 tsp garlic powder", "Fresh parsley", "Salt & pepper"],
      steps: ["Melt cannabutter over very low heat.", "Stir in truffle oil and garlic powder.", "Toss wings, top with parmesan and fresh parsley."],
      note: "Don't overheat truffle oil — it loses flavor."
    },
    "chimichurri": {
      servings: "2 lbs wings",
      ingredients: ["3 tbsp cannabis olive oil", "¼ cup fresh parsley (chopped)", "3 cloves garlic (minced)", "2 tbsp red wine vinegar", "½ tsp red pepper flakes", "Salt & pepper"],
      steps: ["Combine all ingredients in a bowl and let sit 10 min.", "Taste and adjust salt, vinegar, and heat.", "Toss wings in chimichurri right before serving."],
      note: "Best made fresh — don't cook the chimichurri."
    },
    "ranch-butter": {
      servings: "2 lbs wings",
      ingredients: ["4 tbsp cannabutter", "1 packet ranch seasoning (or 1 tbsp homemade blend)", "2 cloves garlic (minced)", "1 tbsp hot sauce (optional)"],
      steps: ["Melt cannabutter and sauté garlic 1 min.", "Stir in ranch seasoning and hot sauce.", "Toss wings thoroughly and serve with celery."],
      note: "Add a splash of buttermilk for extra creamy finish."
    },
  };

  const recipe = recipes[sauce.id];
  if (!recipe) return null;

  return (
    <div className="space-y-2 text-sm">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Recipe — {recipe.servings}</p>
      <div className="bg-gray-50 rounded-xl p-3 space-y-1">
        {recipe.ingredients.map((ing, i) => (
          <div key={i} className="flex items-start gap-2 text-gray-700">
            <span className="text-orange-400 flex-shrink-0">•</span>
            <span>{ing}</span>
          </div>
        ))}
      </div>
      <ol className="space-y-1 pl-1">
        {recipe.steps.map((step, i) => (
          <li key={i} className="flex gap-2 text-gray-700">
            <span className="font-bold text-orange-500 flex-shrink-0">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-gray-500 italic bg-yellow-50 rounded-lg px-3 py-2">💡 {recipe.note}</p>
    </div>
  );
}
