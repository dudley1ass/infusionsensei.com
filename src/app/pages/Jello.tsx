import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { PAGE_STOCK } from "../data/recipeStockImageUrls";
import { trackEvent } from "../utils/analytics";

type JelloRecipe = {
  id: string;
  name: string;
  style: "Classic Shots" | "Fruit Cubes" | "Layered" | "Sour Bites";
  flavor: "Strawberry" | "Lime" | "Orange" | "Mango";
  emoji: string;
  baseDose: number;
  description: string;
  tray: string[];
};

const RECIPES: JelloRecipe[] = [
  {
    id: "classic-jello-shots",
    name: "Classic Jello Shots",
    style: "Classic Shots",
    flavor: "Strawberry",
    emoji: "🍓",
    baseDose: 5,
    description: "Party-ready classic with precise cube dosing.",
    tray: ["■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■"],
  },
  {
    id: "fruit-juice-jello-cubes",
    name: "Fruit Juice Gel Cubes",
    style: "Fruit Cubes",
    flavor: "Orange",
    emoji: "🍊",
    baseDose: 2.5,
    description: "Softer fruit-forward cubes for low-dose starts.",
    tray: ["■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■"],
  },
  {
    id: "layered-jello-shots",
    name: "Layered Jello",
    style: "Layered",
    flavor: "Lime",
    emoji: "🍋",
    baseDose: 5,
    description: "Two-layer visual tray with even THC distribution.",
    tray: ["■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■"],
  },
  {
    id: "sour-jello-bites",
    name: "Sour Jello Bites",
    style: "Sour Bites",
    flavor: "Mango",
    emoji: "🥭",
    baseDose: 10,
    description: "High-impact sour cubes for experienced users.",
    tray: ["■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■", "■"],
  },
];

const DOSE_OPTIONS = [2.5, 5, 10] as const;

export function Jello() {
  const [style, setStyle] = useState<JelloRecipe["style"] | "all">("all");
  const [targetDose, setTargetDose] = useState<number>(5);
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(
    () => (style === "all" ? RECIPES : RECIPES.filter((r) => r.style === style)),
    [style]
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <Helmet>
        <title>Infused Jello Shots (Dose-Controlled Cubes) | Infusion Sensei</title>
        <meta
          name="description"
          content="Build infused jello shots with precise dosing. Choose style, flavor, and target mg per cube, then open in the recipe builder."
        />
      </Helmet>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[280px]">
        <img src={PAGE_STOCK.jello} alt="Infused jello cubes" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <div className="relative z-10 px-6 py-14 text-center text-white">
          <div className="text-6xl mb-3">🍬</div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Infused Jello / Shots</h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto mb-6">
            Precision dosing made visual: one cube = one dose.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Badge className="bg-white/20 text-white border-white/30">🎯 Dose-Controlled</Badge>
            <Badge className="bg-white/20 text-white border-white/30">🧊 Tray-Based Portions</Badge>
            <Badge className="bg-white/20 text-white border-white/30">⚖️ Easy mg Per Cube</Badge>
          </div>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-xl font-black text-gray-900 mb-4">Section 1: Pick Your Style</h2>
        <div className="flex flex-wrap gap-2">
          {(["all", "Classic Shots", "Fruit Cubes", "Layered", "Sour Bites"] as const).map((s) => (
            <Button key={s} variant={style === s ? "default" : "outline"} onClick={() => setStyle(s)}>
              {s}
            </Button>
          ))}
        </div>
      </section>

      <section className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-xl font-black text-gray-900 mb-4">Section 2: Pick Your Dose</h2>
        <div className="flex flex-wrap gap-2">
          {DOSE_OPTIONS.map((mg) => (
            <Button
              key={mg}
              variant={targetDose === mg ? "default" : "outline"}
              onClick={() => setTargetDose(mg)}
            >
              {mg}mg
            </Button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-black text-gray-900 mb-4">Section 3: Pick Flavor + Build</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map((recipe) => (
            <div key={recipe.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="font-black text-gray-900 text-lg">{recipe.emoji} {recipe.name}</p>
                <Badge className="bg-green-100 text-green-700 border-green-200">{recipe.flavor}</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
              <p className="text-sm font-semibold text-gray-800 mt-2">
                Suggested: {recipe.baseDose}mg per cube · Target now: {targetDose}mg
              </p>

              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Visual tray (12 cubes)</p>
                <div className="grid grid-cols-4 gap-1 text-center text-purple-700 font-black">
                  {recipe.tray.map((cell, i) => (
                    <span key={`${recipe.id}-${i}`}>{cell}</span>
                  ))}
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Link
                  to={`/ingredients?category=snacks&recipe=${encodeURIComponent(recipe.id)}`}
                  className="flex-1"
                  onClick={() => trackEvent("move_to_builder", { source_page: "jello", recipe_id: recipe.id })}
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                    <ChefHat className="w-4 h-4 mr-1.5" /> Build Recipe
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setSelected((prev) => (prev === recipe.id ? null : recipe.id))}
                >
                  {selected === recipe.id ? "Hide" : "Details"}
                </Button>
              </div>

              {selected === recipe.id && (
                <div className="mt-3 text-sm text-gray-700 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p><strong>Beginner-safe tip:</strong> Start with half a cube, wait 45-90 minutes.</p>
                  <p className="mt-1">For party service, pre-portion and clearly label infused vs non-infused trays.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <h2 className="text-2xl font-black mb-2">Ready to Dose Your Tray?</h2>
        <p className="text-green-200 mb-5">Open the builder and set your exact THC target per cube.</p>
        <Link to="/ingredients?category=snacks&recipe=classic-jello-shots">
          <Button className="bg-white text-green-800 hover:bg-green-50 font-black">
            Open Jello Builder <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

