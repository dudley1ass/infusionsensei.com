import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { trackEvent } from "../utils/analytics";
import { POPCORN_TO_BUILDER_RECIPE } from "../data/builderRecipeMaps";
import { isContentDbStrictMode, loadBuilderMapFromDb, loadShowcaseItemsFromDb } from "../services/contentService";

type PopcornFlavor = {
  id: string;
  name: string;
  type: "Butter" | "Oil" | "Caramel" | "Powder" | "Chocolate";
  profile: string;
  build: string;
  tags: string[];
  emoji: string;
  heat: 0 | 1 | 2 | 3;
  sweetness: 0 | 1 | 2 | 3;
};

const FLAVORS: PopcornFlavor[] = [
  // Savory
  { id: "garlic-butter", name: "Garlic Butter", type: "Butter", profile: "Savory / Classic", build: "Cannabutter + garlic + parsley", tags: ["savory", "garlic", "classic"], emoji: "🧄", heat: 0, sweetness: 0 },
  { id: "parmesan-herb", name: "Parmesan Herb", type: "Butter", profile: "Savory / Rich", build: "Cannabutter + parmesan + Italian seasoning", tags: ["savory", "garlic"], emoji: "🧀", heat: 0, sweetness: 0 },
  { id: "ranch", name: "Ranch Popcorn", type: "Butter", profile: "Creamy / Tangy", build: "Cannabutter + ranch seasoning packet", tags: ["savory", "classic", "creamy"], emoji: "🤍", heat: 0, sweetness: 0 },
  { id: "truffle", name: "Truffle Popcorn", type: "Oil", profile: "Rich / Earthy", build: "Cannabis oil + truffle oil + flaky salt", tags: ["savory", "fancy"], emoji: "🍄", heat: 0, sweetness: 0 },
  { id: "cheddar", name: "Cheddar Popcorn", type: "Butter", profile: "Cheesy / Salty", build: "Cannabutter + cheddar powder + paprika", tags: ["savory", "classic"], emoji: "🧀", heat: 0, sweetness: 0 },
  // Spicy
  { id: "buffalo", name: "Buffalo Popcorn", type: "Butter", profile: "Spicy / Tangy", build: "Cannabutter + hot sauce + garlic powder", tags: ["spicy", "classic"], emoji: "🌶️", heat: 2, sweetness: 0 },
  { id: "chili-lime", name: "Chili Lime", type: "Oil", profile: "Bright / Spicy", build: "Cannabis oil + chili powder + lime zest + salt", tags: ["spicy", "citrus"], emoji: "🍋", heat: 2, sweetness: 0 },
  { id: "cajun-spice", name: "Cajun Spice", type: "Butter", profile: "Bold / Smoky", build: "Cannabutter + Cajun seasoning + garlic", tags: ["spicy", "smoky"], emoji: "🫑", heat: 2, sweetness: 0 },
  { id: "sriracha", name: "Sriracha Popcorn", type: "Oil", profile: "Garlicky / Hot", build: "Cannabis oil mist + sriracha powder + salt", tags: ["spicy"], emoji: "🔥", heat: 3, sweetness: 0 },
  { id: "nashville-hot", name: "Nashville Hot", type: "Oil", profile: "Hot / Smoky", build: "Cannabis oil + cayenne + paprika + brown sugar", tags: ["spicy", "smoky"], emoji: "🌶️", heat: 3, sweetness: 1 },
  // Sweet
  { id: "caramel", name: "Caramel Popcorn", type: "Caramel", profile: "Sweet / Crunchy", build: "Sugar + cannabutter → caramelize → coat + bake", tags: ["sweet", "classic"], emoji: "🍬", heat: 0, sweetness: 3 },
  { id: "honey-butter", name: "Honey Butter", type: "Butter", profile: "Sweet / Salty", build: "Cannabutter + honey + flaky salt", tags: ["sweet", "classic"], emoji: "🍯", heat: 0, sweetness: 2 },
  { id: "cinnamon-sugar", name: "Cinnamon Sugar", type: "Butter", profile: "Warm / Sweet", build: "Cannabutter + cinnamon + sugar + vanilla", tags: ["sweet"], emoji: "✨", heat: 0, sweetness: 2 },
  { id: "maple", name: "Maple Popcorn", type: "Caramel", profile: "Maple / Buttery", build: "Maple syrup + cannabutter → reduce → coat", tags: ["sweet"], emoji: "🍁", heat: 0, sweetness: 3 },
  { id: "vanilla-bean", name: "Vanilla Bean", type: "Butter", profile: "Delicate / Sweet", build: "Cannabutter + vanilla sugar + pinch of salt", tags: ["sweet", "fancy"], emoji: "🌸", heat: 0, sweetness: 2 },
  // Dessert / Hybrid
  { id: "chocolate-drizzle", name: "Chocolate Drizzle", type: "Chocolate", profile: "Indulgent / Rich", build: "Melted chocolate + cannabis coconut oil drizzle", tags: ["sweet", "chocolate"], emoji: "🍫", heat: 0, sweetness: 3 },
  { id: "cookies-cream", name: "Cookies & Cream", type: "Chocolate", profile: "Creamy / Sweet", build: "White chocolate + cannabis oil + crushed Oreos", tags: ["sweet", "chocolate", "creamy"], emoji: "🍪", heat: 0, sweetness: 3 },
  { id: "peanut-butter", name: "Peanut Butter", type: "Butter", profile: "Nutty / Sweet", build: "Warm PB + cannabutter + powdered sugar drizzle", tags: ["sweet", "creamy"], emoji: "🥜", heat: 0, sweetness: 2 },
  { id: "smores", name: "S'mores Popcorn", type: "Chocolate", profile: "Campfire / Sweet", build: "Cannabis oil chocolate drizzle + marshmallow + graham cracker", tags: ["sweet", "chocolate"], emoji: "🔥", heat: 0, sweetness: 3 },
  { id: "salted-caramel-choc", name: "Salted Caramel Chocolate", type: "Chocolate", profile: "Complex / Indulgent", build: "Caramel coat + chocolate drizzle + flaky salt", tags: ["sweet", "chocolate", "fancy"], emoji: "🍫", heat: 0, sweetness: 3 },
];

const TAGS = ["all", "savory", "spicy", "sweet", "garlic", "chocolate", "citrus", "smoky", "creamy", "classic", "fancy"];
const TAG_LABELS: Record<string, string> = {
  all: "All Flavors", savory: "🧂 Savory", spicy: "🌶️ Spicy", sweet: "🍯 Sweet",
  garlic: "🧄 Garlic", chocolate: "🍫 Chocolate", citrus: "🍋 Citrus",
  smoky: "💨 Smoky", creamy: "🤍 Creamy", classic: "⭐ Classic", fancy: "✨ Fancy"
};

const TYPE_COLORS: Record<string, string> = {
  Butter: "bg-yellow-100 text-yellow-800",
  Oil: "bg-green-100 text-green-700",
  Caramel: "bg-amber-100 text-amber-800",
  Powder: "bg-orange-100 text-orange-700",
  Chocolate: "bg-purple-100 text-purple-700",
};

const SECTIONS = [
  { label: "🧂 Savory", ids: ["garlic-butter","parmesan-herb","ranch","truffle","cheddar"] },
  { label: "🌶️ Spicy", ids: ["buffalo","chili-lime","cajun-spice","sriracha","nashville-hot"] },
  { label: "🍯 Sweet", ids: ["caramel","honey-butter","cinnamon-sugar","maple","vanilla-bean"] },
  { label: "🍫 Dessert / Hybrid", ids: ["chocolate-drizzle","cookies-cream","peanut-butter","smores","salted-caramel-choc"] },
];

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

const RECIPES: Record<string, { servings: string; ingredients: string[]; steps: string[]; note: string }> = {
  "garlic-butter": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "3 cloves garlic (minced)", "2 tbsp fresh parsley (chopped)", "½ tsp salt"],
    steps: ["Pop popcorn and transfer to large bowl.", "Melt cannabutter in pan over low heat, add garlic — sauté 1 min.", "Pour garlic butter over popcorn, add parsley and salt. Toss well."],
    note: "Don't brown the garlic — it turns bitter. Low and slow."
  },
  "parmesan-herb": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "¼ cup grated parmesan", "1 tsp Italian seasoning", "½ tsp garlic powder", "Salt to taste"],
    steps: ["Melt cannabutter and stir in garlic powder and Italian seasoning.", "Pour over freshly popped corn while hot.", "Immediately toss with parmesan so it melts slightly."],
    note: "Freshly grated parmesan sticks way better than powdered."
  },
  "ranch": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "1 tbsp ranch seasoning packet (or homemade blend)", "½ tsp garlic powder"],
    steps: ["Melt cannabutter and stir in ranch seasoning.", "Drizzle over popcorn in a large bowl.", "Toss thoroughly so every kernel is coated."],
    note: "Homemade ranch blend: dill + garlic + onion powder + buttermilk powder."
  },
  "truffle": {
    servings: "8 cups popcorn",
    ingredients: ["2 tbsp cannabis olive oil", "1 tsp truffle oil", "½ tsp flaky sea salt", "2 tbsp grated parmesan (optional)"],
    steps: ["Pop corn in a neutral oil or air pop.", "Drizzle cannabis oil over hot popcorn and toss.", "Add truffle oil, toss again. Finish with flaky salt."],
    note: "Truffle oil loses flavor quickly — add it last and serve immediately."
  },
  "cheddar": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "3 tbsp cheddar powder (or nutritional yeast for vegan)", "½ tsp paprika", "¼ tsp cayenne (optional)", "Salt to taste"],
    steps: ["Melt cannabutter completely.", "Mix cheddar powder and paprika together.", "Pour butter over popcorn, immediately shake on cheese powder and toss."],
    note: "Cheddar powder sticks best when the butter is still warm."
  },
  "buffalo": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "2 tbsp hot sauce (Frank's RedHot)", "½ tsp garlic powder", "½ tsp celery salt"],
    steps: ["Melt cannabutter and whisk in hot sauce.", "Add garlic powder and celery salt to the mixture.", "Pour over popcorn and toss until fully coated."],
    note: "Serve with blue cheese dipping sauce on the side."
  },
  "chili-lime": {
    servings: "8 cups popcorn",
    ingredients: ["2 tbsp cannabis coconut oil", "1 tsp chili powder", "Zest of 1 lime + 1 tbsp lime juice", "½ tsp salt", "Pinch of cayenne"],
    steps: ["Pop corn in cannabis oil or drizzle oil over air-popped corn.", "Mix chili powder, cayenne, and salt.", "Toss corn with lime zest and juice, then shake on spice blend."],
    note: "Add the lime zest last — it brightens the whole batch."
  },
  "cajun-spice": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "2 tsp Cajun seasoning", "½ tsp garlic powder", "¼ tsp smoked paprika"],
    steps: ["Melt cannabutter and stir in all spices.", "Pour over hot popcorn.", "Toss vigorously — Cajun blend settles to the bottom if you don't."],
    note: "Make your own Cajun mix: paprika + garlic + onion + oregano + thyme + cayenne."
  },
  "sriracha": {
    servings: "8 cups popcorn",
    ingredients: ["2 tbsp cannabis oil", "1 tsp sriracha (or sriracha powder)", "½ tsp garlic powder", "Salt to taste"],
    steps: ["Mix cannabis oil with sriracha until smooth.", "Drizzle over popcorn in a thin stream while tossing.", "Let sit 2 min so the coating sets."],
    note: "Sriracha powder gives crispier results than sauce — look for it at Asian grocers."
  },
  "nashville-hot": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabis oil", "1 tbsp cayenne pepper", "1 tsp smoked paprika", "1 tsp brown sugar", "½ tsp garlic powder", "Salt"],
    steps: ["Heat cannabis oil until warm but not smoking.", "Whisk in cayenne, paprika, brown sugar, and garlic.", "Pour over popcorn and toss fast — the sugar sets quickly."],
    note: "Serve over white bread crumbs for the full Nashville experience."
  },
  "caramel": {
    servings: "10 cups popcorn",
    ingredients: ["½ cup cannabutter", "1 cup brown sugar", "¼ cup corn syrup", "½ tsp salt", "½ tsp baking soda", "1 tsp vanilla"],
    steps: ["Preheat oven to 250°F. Pop corn and spread on baking sheet.", "Combine cannabutter, sugar, corn syrup, and salt. Boil 5 min without stirring.", "Remove from heat, add baking soda and vanilla. Pour over corn, toss, bake 1 hour turning every 15 min."],
    note: "Baking soda makes the caramel light and crunchy — don't skip it."
  },
  "honey-butter": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "2 tbsp honey", "½ tsp flaky salt"],
    steps: ["Melt cannabutter over low heat and stir in honey.", "Pour over freshly popped corn while both are warm.", "Toss and finish with flaky salt."],
    note: "Use good honey — the flavor really shows here."
  },
  "cinnamon-sugar": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "3 tbsp sugar", "1 tsp cinnamon", "¼ tsp vanilla extract", "Pinch of salt"],
    steps: ["Melt cannabutter with vanilla.", "Mix sugar, cinnamon, and salt together.", "Pour butter over corn, toss, then shake on cinnamon sugar and toss again."],
    note: "For crunchier coating: spread on baking sheet and bake at 300°F for 10 min."
  },
  "maple": {
    servings: "10 cups popcorn",
    ingredients: ["¼ cup maple syrup", "2 tbsp cannabutter", "½ tsp salt", "¼ tsp cinnamon"],
    steps: ["Combine maple syrup and cannabutter in a saucepan.", "Bring to a boil, cook 2 min until slightly thickened.", "Pour over popcorn, toss, spread on sheet pan. Bake 20 min at 300°F."],
    note: "Pure maple syrup only — imitation won't caramelize properly."
  },
  "vanilla-bean": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp cannabutter", "2 tbsp vanilla sugar (or regular sugar + 1 tsp vanilla)", "Pinch of flaky salt"],
    steps: ["Melt cannabutter with vanilla extract if using.", "Pour over hot popcorn.", "Sprinkle vanilla sugar and flaky salt. Toss gently."],
    note: "Make vanilla sugar ahead: bury a vanilla bean in a jar of sugar for 2 weeks."
  },
  "chocolate-drizzle": {
    servings: "8 cups popcorn",
    ingredients: ["½ cup dark chocolate chips", "1 tbsp cannabis coconut oil", "Flaky salt", "Optional: sprinkles"],
    steps: ["Melt chocolate and cannabis coconut oil together — microwave 30 sec intervals.", "Spread popcorn on parchment paper.", "Drizzle melted chocolate over popcorn. Add flaky salt. Let set 30 min."],
    note: "Refrigerate for 15 min to speed up setting."
  },
  "cookies-cream": {
    servings: "8 cups popcorn",
    ingredients: ["½ cup white chocolate chips", "1 tbsp cannabis coconut oil", "6 Oreo cookies (crushed)", "Pinch of salt"],
    steps: ["Melt white chocolate and cannabis oil together.", "Drizzle over popcorn and toss.", "Immediately sprinkle crushed Oreos over top. Let set."],
    note: "Crush Oreos coarsely — you want chunks, not powder."
  },
  "peanut-butter": {
    servings: "8 cups popcorn",
    ingredients: ["3 tbsp peanut butter", "2 tbsp cannabutter", "2 tbsp powdered sugar", "½ tsp salt"],
    steps: ["Melt peanut butter and cannabutter together until smooth.", "Drizzle over popcorn in a thin stream while tossing.", "Dust with powdered sugar and salt. Toss once more."],
    note: "Warm the bowl first so the PB stays fluid while you toss."
  },
  "smores": {
    servings: "8 cups popcorn",
    ingredients: ["½ cup chocolate chips + 1 tbsp cannabis oil", "1 cup mini marshmallows", "½ cup crushed graham crackers", "Flaky salt"],
    steps: ["Melt chocolate with cannabis oil.", "Spread popcorn on parchment, drizzle with chocolate.", "While wet, scatter marshmallows and graham crackers. Sprinkle salt. Let set."],
    note: "Toast the marshmallows briefly with a kitchen torch for a true campfire vibe."
  },
  "salted-caramel-choc": {
    servings: "10 cups popcorn",
    ingredients: ["½ cup cannabutter", "1 cup sugar", "¼ cup heavy cream", "½ cup dark chocolate chips", "Flaky salt"],
    steps: ["Make caramel: cook cannabutter + sugar until amber. Add cream carefully — it will bubble.", "Pour caramel over corn, toss, bake 250°F for 45 min.", "Cool completely, then drizzle with melted chocolate and flaky salt."],
    note: "This is a two-stage recipe — make the caramel coat first, chocolate drizzle second."
  },
};

export function Popcorn() {
  const [activeTag, setActiveTag] = useState("all");
  const [selectedFlavor, setSelectedFlavor] = useState<PopcornFlavor | null>(null);
  const [flavors, setFlavors] = useState<PopcornFlavor[]>(FLAVORS);
  const [builderMap, setBuilderMap] = useState<Record<string, string>>(POPCORN_TO_BUILDER_RECIPE);
  const strictDb = isContentDbStrictMode();

  const filtered = activeTag === "all" ? flavors : flavors.filter(f => f.tags.includes(activeTag));

  const filteredSections = SECTIONS.map(sec => ({
    ...sec,
    flavors: sec.ids.map(id => flavors.find(f => f.id === id)!).filter(f =>
      activeTag === "all" || f.tags.includes(activeTag)
    )
  })).filter(sec => sec.flavors.length > 0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromDb = await loadBuilderMapFromDb("popcorn");
      if (!cancelled && fromDb) setBuilderMap(fromDb);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromDb = await loadShowcaseItemsFromDb("popcorn");
      if (!fromDb || cancelled) return;
      const byId = new Map(fromDb.map((item) => [item.id, item]));
      const merged = FLAVORS.map((local) => {
        const db = byId.get(local.id);
        if (!db) return local;
        return {
          ...local,
          name: db.name || local.name,
          type: (db.itemType as PopcornFlavor["type"]) || local.type,
          profile: db.profile || local.profile,
          build: db.build || local.build,
          tags: db.tags.length > 0 ? db.tags : local.tags,
          emoji: db.emoji || local.emoji,
          heat: db.primaryLevel as PopcornFlavor["heat"],
          sweetness: db.secondaryLevel as PopcornFlavor["sweetness"],
        };
      });
      if (!cancelled) setFlavors(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <Helmet>
        <title>THC Infused Popcorn (Easy Edible Recipe + Dosage Calculator)</title>
        <meta name="description" content="Make perfectly dosed cannabis popcorn at home. Sweet, savory, and movie-night ready with accurate THC dosing." />
      </Helmet>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{minHeight: "280px"}}>
        <img src="/IMAGES/popcorn.webp" alt="Infused popcorn" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 px-6 py-14 text-center">
          <div className="text-6xl mb-3">🍿</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Infused Popcorn</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">
            20 cannabis popcorn recipes — savory, spicy, sweet, and chocolatey. Every recipe built with cannabutter or cannabis oil so you know the exact THC per bowl.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">🍿 20 Flavors</Badge>
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">🧈 Butter • Oil • Caramel</Badge>
            <Badge className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">⚖️ Exact THC Per Serving</Badge>
          </div>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Filter by flavor</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTag === tag ? "bg-amber-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700"
              }`}>
              {TAG_LABELS[tag]}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} flavor{filtered.length !== 1 ? "s" : ""} shown</p>
      </div>

      {/* Flavor Grid by Section */}
      {filteredSections.map(section => (
        <div key={section.label}>
          <h2 className="text-xl font-black text-gray-900 mb-4">{section.label}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.flavors.map(flavor => (
              <button key={flavor.id}
                onClick={() => setSelectedFlavor(selectedFlavor?.id === flavor.id ? null : flavor)}
                className={`bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${
                  selectedFlavor?.id === flavor.id ? "border-amber-400 shadow-lg shadow-amber-100" : "border-gray-200 hover:border-amber-300"
                }`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{flavor.emoji}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[flavor.type]}`}>{flavor.type}</span>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1">{flavor.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{flavor.profile}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><span>Heat</span><HeatDots level={flavor.heat} /></div>
                  <div className="flex items-center gap-1.5"><span>Sweet</span><SweetnessBar level={flavor.sweetness} /></div>
                </div>

                {selectedFlavor?.id === flavor.id && (
                  <div className="mt-4 pt-4 border-t border-amber-100 space-y-3" onClick={e => e.stopPropagation()}>
                    <div className="bg-amber-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">How to Build</p>
                      <p className="text-sm text-gray-700">{flavor.build}</p>
                    </div>
                    {RECIPES[flavor.id] && (
                      <div className="space-y-2 text-sm">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Recipe — {RECIPES[flavor.id].servings}</p>
                        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                          {RECIPES[flavor.id].ingredients.map((ing, i) => (
                            <div key={i} className="flex items-start gap-2 text-gray-700">
                              <span className="text-amber-400 flex-shrink-0">•</span><span>{ing}</span>
                            </div>
                          ))}
                        </div>
                        <ol className="space-y-1 pl-1">
                          {RECIPES[flavor.id].steps.map((step, i) => (
                            <li key={i} className="flex gap-2 text-gray-700">
                              <span className="font-bold text-amber-500 flex-shrink-0">{i + 1}.</span><span>{step}</span>
                            </li>
                          ))}
                        </ol>
                        <p className="text-xs text-gray-500 italic bg-yellow-50 rounded-lg px-3 py-2">💡 {RECIPES[flavor.id].note}</p>
                      </div>
                    )}
                    <Link
                      to={`/ingredients?category=snacks&recipe=${encodeURIComponent(flavor.id)}`}
                      className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                      onClick={e => { e.stopPropagation(); trackEvent("move_to_builder",{source_page:"popcorn",recipe_id:flavor.id}); }}
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

      {/* Infusion Types */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-4">🧠 The 4 Infusion Methods</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: "Butter Infusion", desc: "Best for savory flavors. Carries spices and powders evenly across every kernel.", emoji: "🧈", color: "bg-yellow-50 border-yellow-200" },
            { type: "Oil Mist", desc: "Light coating — perfect for powder-based flavors like ranch or chili lime.", emoji: "💧", color: "bg-green-50 border-green-200" },
            { type: "Caramel Coat", desc: "Sugar syrup + cannabutter baked on. Creates a crunchy shell that locks in THC.", emoji: "🍬", color: "bg-amber-50 border-amber-200" },
            { type: "Chocolate Drizzle", desc: "Cannabis coconut oil melted with chocolate. Drizzle over, let set. Social media gold.", emoji: "🍫", color: "bg-purple-50 border-purple-200" },
          ].map(({ type, desc, emoji, color }) => (
            <div key={type} className={`rounded-2xl border-2 p-4 ${color}`}>
              <div className="text-3xl mb-2">{emoji}</div>
              <p className="font-black text-gray-900 text-sm mb-1">{type}</p>
              <p className="text-gray-600 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-2xl font-black mb-2">Calculate Exact THC Per Bowl</h2>
        <p className="text-green-200 mb-6 max-w-lg mx-auto">Enter your cannabutter or cannabis oil potency and the recipe builder tells you exactly how many milligrams per serving.</p>
        <Link to="/infusions">
          <Button className="bg-white text-green-800 hover:bg-green-50 font-black text-base px-8 py-3">
            Open Recipe Builder <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
