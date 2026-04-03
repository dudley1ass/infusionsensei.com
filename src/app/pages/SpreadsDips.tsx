import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PAGE_STOCK } from "../data/recipeStockImageUrls";
import { recipeLocalImage } from "../data/recipeLocalImageUrls";
import { trackEvent } from "../utils/analytics";
import { loadShowcaseItemsFromDb } from "../services/contentService";

export type SpreadDipRecipe = {
  id: string;
  name: string;
  type: "Cheesy" | "Creamy" | "Spicy" | "Sweet" | "Savory" | "Nutty";
  profile: string;
  build: string;
  tags: string[];
  emoji: string;
  heat: 0 | 1 | 2 | 3;
  sweetness: 0 | 1 | 2 | 3;
  servings: string;
  ingredients: string[];
  steps: string[];
  note: string;
};

export const RECIPES: SpreadDipRecipe[] = [
  {
    id: "infused-peanut-butter-spread",
    name: "Infused Peanut Butter",
    type: "Nutty",
    profile: "Spread / toast & apples",
    build: "Cannabis coconut oil folded into peanut butter",
    tags: ["nut-butter", "spread", "classic"],
    emoji: "🥜",
    heat: 0,
    sweetness: 1,
    servings: "16 servings (about 1 tbsp each)",
    ingredients: ["Peanut butter", "Cannabis coconut oil", "Salt", "Honey (optional)"],
    steps: [
      "Soften peanut butter slightly so it mixes easily (room temp or gentle warm).",
      "Fold in cannabis coconut oil until completely smooth — no streaks.",
      "Season with a tiny pinch of salt; add honey if you want it sweeter.",
      "Transfer to a labeled jar; chill if you prefer a firmer spread.",
    ],
    note: "Dose the full jar, then divide by tablespoons. Oil stays blended best if you don’t overheat the peanut butter.",
  },
  {
    id: "infused-almond-butter-spread",
    name: "Infused Almond Butter",
    type: "Nutty",
    profile: "Spread / smoothies & toast",
    build: "Cannabis coconut oil folded into almond butter",
    tags: ["nut-butter", "spread", "creamy"],
    emoji: "🌰",
    heat: 0,
    sweetness: 0,
    servings: "16 servings (about 1 tbsp each)",
    ingredients: ["Almond butter", "Cannabis coconut oil", "Salt", "Cinnamon (optional)"],
    steps: [
      "Stir almond butter well if oil has separated.",
      "Fold in cannabis coconut oil until uniform.",
      "Pinch of salt; cinnamon optional. Mix thoroughly.",
      "Store in a labeled container.",
    ],
    note: "Same dosing idea as peanut butter — calculate mg for the whole batch, then per spoonful.",
  },
  {
    id: "infused-cream-cheese-whipped",
    name: "Whipped Infused Cream Cheese",
    type: "Creamy",
    profile: "Bagel spread / base for mixes",
    build: "Room-temp cream cheese + cannabutter, whipped smooth",
    tags: ["cream-cheese", "spread", "classic"],
    emoji: "🧈",
    heat: 0,
    sweetness: 0,
    servings: "8 servings",
    ingredients: ["Cream cheese", "Cannabutter", "Salt"],
    steps: [
      "Bring cream cheese to room temperature.",
      "Beat cream cheese with cannabutter until fluffy and no lumps.",
      "Season lightly with salt. Chill in a labeled dish.",
    ],
    note: "Use as-is or split the batch and flavor one half sweet, one savory.",
  },
  {
    id: "sweet-honey-cream-cheese-spread-infused",
    name: "Sweet Honey Cream Cheese",
    type: "Sweet",
    profile: "Dessert-style / fruit dip",
    build: "Cream cheese + cannabutter + honey & powdered sugar",
    tags: ["cream-cheese", "sweet", "spread"],
    emoji: "🍯",
    heat: 0,
    sweetness: 3,
    servings: "10 servings",
    ingredients: ["Cream cheese", "Cannabutter", "Honey", "Powdered sugar", "Vanilla extract", "Salt"],
    steps: [
      "Soften cream cheese; beat with cannabutter until smooth.",
      "Add honey, powdered sugar, vanilla, and a pinch of salt; beat until fluffy.",
      "Chill; serve with fruit or graham crackers — label the bowl.",
    ],
    note: "Sweeter spreads hide cannabis flavor well; still dose by total batch weight or portions.",
  },
  {
    id: "herb-garlic-cream-cheese-spread-infused",
    name: "Herb & Garlic Cream Cheese",
    type: "Savory",
    profile: "Bagels / crackers / veggie dip",
    build: "Whipped cream cheese + cannabutter + herbs & garlic",
    tags: ["cream-cheese", "savory", "spread"],
    emoji: "🌿",
    heat: 0,
    sweetness: 0,
    servings: "8 servings",
    ingredients: ["Cream cheese", "Cannabutter", "Garlic powder", "Italian seasoning", "Salt", "Black pepper"],
    steps: [
      "Beat soft cream cheese with cannabutter until smooth.",
      "Mix in garlic powder, Italian seasoning, salt, and pepper.",
      "Rest 30 minutes in the fridge so flavors meld. Label clearly.",
    ],
    note: "Scoop with a consistent spoon size so guests can estimate portions.",
  },
  {
    id: "spinach-artichoke-dip-infused",
    name: "Spinach Artichoke Dip",
    type: "Cheesy",
    profile: "Creamy / Baked",
    build: "Cannabutter + cream cheese + parmesan",
    tags: ["classic", "baked", "creamy"],
    emoji: "🥬",
    heat: 0,
    sweetness: 0,
    servings: "8 servings",
    ingredients: ["Cream cheese", "Sour cream", "Cannabutter", "Spinach", "Artichokes", "Parmesan"],
    steps: ["Warm cheeses and cannabutter until smooth.", "Fold in spinach and artichokes.", "Bake until bubbly — label the serving spoon."],
    note: "Perfect for chips and crackers — dose the whole batch, then divide by portions.",
  },
  {
    id: "queso-dip-infused",
    name: "Infused Queso",
    type: "Cheesy",
    profile: "Melted / Party",
    build: "Cannabutter roux + cheddar",
    tags: ["cheesy", "party"],
    emoji: "🧀",
    heat: 1,
    sweetness: 0,
    servings: "8 servings",
    ingredients: ["Cheddar", "Milk", "Cornstarch", "Cannabutter"],
    steps: ["Toss cheese with cornstarch.", "Heat milk with cannabutter; whisk in cheese.", "Keep warm; label mg per ounce."],
    note: "Stir often — queso tightens as it sits.",
  },
  {
    id: "buffalo-dip-infused",
    name: "Buffalo Chicken Dip",
    type: "Spicy",
    profile: "Spicy / Crowd-pleaser",
    build: "Hot sauce + cream cheese + cannabutter",
    tags: ["spicy", "baked"],
    emoji: "🌶️",
    heat: 2,
    sweetness: 0,
    servings: "10 servings",
    ingredients: ["Cream cheese", "Sour cream", "Hot sauce", "Cannabutter", "Cheddar"],
    steps: ["Combine everything in a baking dish.", "Bake until melted; stir.", "Serve with a separate non-infused chip tray if needed."],
    note: "Let guests know the dip is the infused part — not the chips.",
  },
  {
    id: "ranch-dip-infused",
    name: "Ranch Dip",
    type: "Creamy",
    profile: "Cool / Tangy",
    build: "Cannabis olive oil + ranch seasoning",
    tags: ["classic", "chill"],
    emoji: "🤍",
    heat: 0,
    sweetness: 0,
    servings: "8 servings",
    ingredients: ["Sour cream", "Mayonnaise", "Cannabis olive oil", "Ranch seasoning"],
    steps: ["Whisk until smooth.", "Chill 30 minutes.", "Label the bowl clearly."],
    note: "Chilling helps flavor and keeps texture thick.",
  },
  {
    id: "honey-mustard-dip-infused",
    name: "Honey Mustard",
    type: "Sweet",
    profile: "Sweet-tangy",
    build: "Cannabis olive oil emulsion",
    tags: ["sweet", "dip"],
    emoji: "🍯",
    heat: 0,
    sweetness: 2,
    servings: "8 servings",
    ingredients: ["Honey", "Mustard", "Mayonnaise", "Cannabis olive oil"],
    steps: ["Whisk until emulsified.", "Adjust sweetness.", "Label for dippers."],
    note: "Great with pretzels, tenders, and veggie trays.",
  },
  {
    id: "garlic-aioli-infused",
    name: "Garlic Aioli",
    type: "Savory",
    profile: "Bold garlic",
    build: "Slow-whisked cannabis olive oil",
    tags: ["savory", "spread"],
    emoji: "🧄",
    heat: 0,
    sweetness: 0,
    servings: "6 servings",
    ingredients: ["Mayonnaise", "Garlic", "Lemon", "Cannabis olive oil"],
    steps: ["Whisk garlic and lemon into mayo.", "Slowly drizzle in oil.", "Chill and label."],
    note: "Use as a spread or fry dip — potency is in the aioli only.",
  },
  {
    id: "bbq-sauce-infused-party",
    name: "BBQ Sauce",
    type: "Savory",
    profile: "Smoky / sweet",
    build: "Simmered ketchup base + cannabis oil",
    tags: ["sauce", "grill"],
    emoji: "🔥",
    heat: 1,
    sweetness: 1,
    servings: "12 servings",
    ingredients: ["Ketchup", "Brown sugar", "Vinegar", "Cannabis olive oil"],
    steps: ["Simmer until slightly thick.", "Cool before brushing on cooked food.", "Serve extra as labeled dip."],
    note: "Brush after cooking so heat doesn’t volatilize THC unpredictably.",
  },
  {
    id: "sweet-chili-sauce-infused",
    name: "Sweet Chili Sauce",
    type: "Sweet",
    profile: "Sticky / Asian-inspired",
    build: "Chili-sugar syrup + cannabis oil off heat",
    tags: ["sweet", "dip"],
    emoji: "🌶️",
    heat: 1,
    sweetness: 2,
    servings: "10 servings",
    ingredients: ["Sugar", "Vinegar", "Garlic", "Cayenne", "Cannabis olive oil"],
    steps: ["Simmer syrup and aromatics.", "Off heat, whisk in oil.", "Label for dipping."],
    note: "Works as a dip for spring rolls, wings, and fries.",
  },
  {
    id: "cheese-sauce-infused",
    name: "Pourable Cheese Sauce",
    type: "Cheesy",
    profile: "Nachos / fries",
    build: "Cannabutter cheese sauce",
    tags: ["cheesy", "party"],
    emoji: "🫕",
    heat: 0,
    sweetness: 0,
    servings: "8 servings",
    ingredients: ["Cheddar", "Milk", "Cannabutter", "Cornstarch"],
    steps: ["Make a smooth cheese sauce.", "Serve immediately.", "Label mg per portion."],
    note: "Sauce thickens as it cools — keep warm for parties.",
  },
];

const TAGS = ["all", "classic", "cheesy", "spicy", "sweet", "creamy", "party", "savory", "dip", "baked", "nut-butter", "cream-cheese", "spread"] as const;
const TAG_LABELS: Record<string, string> = {
  all: "All",
  classic: "Classic",
  cheesy: "Cheesy",
  spicy: "Spicy",
  sweet: "Sweet",
  creamy: "Creamy",
  party: "Party",
  savory: "Savory",
  dip: "Dips",
  baked: "Baked",
  "nut-butter": "Nut butters",
  "cream-cheese": "Cream cheese",
  spread: "Spreads",
};

const TYPE_COLORS: Record<string, string> = {
  Cheesy: "bg-amber-100 text-amber-800",
  Creamy: "bg-blue-100 text-blue-800",
  Spicy: "bg-red-100 text-red-800",
  Sweet: "bg-pink-100 text-pink-800",
  Savory: "bg-green-100 text-green-800",
  Nutty: "bg-yellow-100 text-yellow-900",
};

const SPREADS_HERO_IMAGES = [PAGE_STOCK.spreads, PAGE_STOCK.fries] as const;

function Dots({ level, color }: { level: number; color: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3].map((i) => (
        <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? color : "bg-gray-200"}`} />
      ))}
    </div>
  );
}

export function SpreadsDips() {
  const [activeTag, setActiveTag] = useState("all");
  const [selected, setSelected] = useState<SpreadDipRecipe | null>(null);
  const [list, setList] = useState<SpreadDipRecipe[]>(RECIPES);
  const [heroImgIndex, setHeroImgIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const filtered = activeTag === "all" ? list : list.filter((r) => r.tags.includes(activeTag));

  useEffect(() => {
    const recipeIdParam = searchParams.get("recipe");
    if (!recipeIdParam) return;
    const found = list.find((r) => r.id === recipeIdParam);
    if (found) {
      setActiveTag("all");
      setSelected(found);
    }
  }, [searchParams, list]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromDb = await loadShowcaseItemsFromDb("spreads-dips");
      if (!fromDb || cancelled) return;
      const byId = new Map(fromDb.map((item) => [item.id, item]));
      const merged = RECIPES.map((local) => {
        const db = byId.get(local.id);
        if (!db) return local;
        return {
          ...local,
          name: db.name || local.name,
          type: (db.itemType as SpreadDipRecipe["type"]) || local.type,
          profile: db.profile || local.profile,
          build: db.build || local.build,
          tags: db.tags.length > 0 ? db.tags : local.tags,
          emoji: db.emoji || local.emoji,
          heat: db.primaryLevel as SpreadDipRecipe["heat"],
          sweetness: db.secondaryLevel as SpreadDipRecipe["sweetness"],
        };
      });
      if (!cancelled) setList(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <Helmet>
        <title>Infused Spreads & Dips (Easy THC Dosing) | Infusion Sensei</title>
        <meta
          name="description"
          content="Make infused peanut butter, almond butter, cream cheese spreads, plus queso, ranch dip, spinach-artichoke, and aioli — exact mg per serving. Open any recipe in the builder with your saved infusion bases."
        />
        <link rel="canonical" href="https://infusionsensei.com/spreads-dips" />
      </Helmet>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[260px]">
        <img
          src={SPREADS_HERO_IMAGES[heroImgIndex]}
          alt="Infused dips and spreads"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setHeroImgIndex((i) => Math.min(i + 1, SPREADS_HERO_IMAGES.length - 1))}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent" />
        <div className="relative z-10 px-6 py-12 text-center text-white">
          <div className="text-5xl mb-2">🥣</div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Spreads & Dips</h1>
          <p className="text-white/90 text-lg max-w-2xl mx-auto mb-5">
            Beginner-friendly infused dips, spreads, and party sauces — built for sharing and easy dosing. Pick a recipe, then move to the builder with your
            saved cannabutter or oil.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {["🧈 Butter & oil friendly", "⚖️ Exact mg per batch", "🎯 Move to Builder"].map((t) => (
              <Badge key={t} className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Filter</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTag === tag ? "bg-green-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-800"
              }`}
            >
              {TAG_LABELS[tag] ?? tag}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {filtered.length} recipe{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((recipe) => (
          <button
            key={recipe.id}
            type="button"
            onClick={() => setSelected(selected?.id === recipe.id ? null : recipe)}
            className={`bg-white rounded-2xl border-2 overflow-hidden text-left transition-all hover:shadow-md ${
              selected?.id === recipe.id ? "border-green-400 shadow-lg" : "border-gray-200 hover:border-green-300"
            }`}
          >
            <div className="relative h-36 w-full overflow-hidden bg-gray-100">
              <img
                src={recipeLocalImage(recipe.id)}
                alt={recipe.name}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </div>
            <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="text-3xl">{recipe.emoji}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[recipe.type] ?? "bg-gray-100"}`}>{recipe.type}</span>
            </div>
            <h3 className="font-black text-gray-900 text-base mb-1">{recipe.name}</h3>
            <p className="text-gray-500 text-xs mb-3">{recipe.profile}</p>
            <div className="flex gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span>Heat</span>
                <Dots level={recipe.heat} color="bg-red-500" />
              </div>
              <div className="flex items-center gap-1.5">
                <span>Sweet</span>
                <Dots level={recipe.sweetness} color="bg-amber-400" />
              </div>
            </div>
            {selected?.id === recipe.id && (
              <div className="mt-4 pt-4 border-t border-green-100 space-y-3" onClick={(e) => e.stopPropagation()}>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs font-bold text-green-800 uppercase tracking-wide mb-1">Recipe — {recipe.servings}</p>
                  <p className="text-xs text-gray-600 mb-2 italic">{recipe.build}</p>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-1 mb-2">
                    {recipe.ingredients.map((ing, i) => (
                      <div key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="text-green-600">•</span>
                        <span>{ing}</span>
                      </div>
                    ))}
                  </div>
                  <ol className="space-y-1">
                    {recipe.steps.map((step, i) => (
                      <li key={i} className="flex gap-2 text-sm text-gray-700">
                        <span className="font-bold text-green-600 flex-shrink-0">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="text-xs text-gray-500 italic bg-amber-50 rounded-lg px-3 py-2 mt-2">💡 {recipe.note}</p>
                </div>
                <Link
                  to={`/ingredients?category=spreads-dips&recipe=${encodeURIComponent(recipe.id)}`}
                  className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    trackEvent("move_to_builder", { source_page: "spreads-dips", recipe_id: recipe.id });
                  }}
                >
                  <ChefHat className="w-4 h-4" /> Move to Recipe Builder
                </Link>
              </div>
            )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-2xl font-black mb-2">Use the infusion you already made</h2>
        <p className="text-green-200 mb-6 max-w-lg mx-auto">
          Save your cannabutter or oil on My Infusions, then pick it in the recipe builder for accurate batch THC.
        </p>
        <Link to="/infusions">
          <Button className="bg-white text-green-800 hover:bg-green-50 font-black text-base px-8 py-3">
            Open My Infusions <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
