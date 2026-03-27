import { useMemo, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

type SnackItem = {
  id: string;
  name: string;
  emoji: string;
  dose: string;
  mgEach: number;
  desc: string;
};

const ITEMS: SnackItem[] = [
  { id: "rice-krispie-treat-squares", name: "Rice Krispie Treat Squares", emoji: "🟨", dose: "~5mg per square", mgEach: 5, desc: "Single-serving bars with very easy batch math." },
  { id: "popcorn-balls", name: "Popcorn Balls", emoji: "🍿", dose: "~4-6mg per ball", mgEach: 5, desc: "Sticky portable snack that holds infusion well." },
  { id: "chocolate-dipped-pretzels", name: "Chocolate-Dipped Pretzels", emoji: "🥨", dose: "~3-5mg per pretzel", mgEach: 4, desc: "Make infused and non-infused trays side-by-side." },
  { id: "mini-slider-sauce", name: "Mini Sliders (Infused Sauce)", emoji: "🍔", dose: "~4-8mg per slider", mgEach: 6, desc: "Infuse sauce only for clean mixed-party control." },
  { id: "mini-brownie-bites", name: "Mini Brownie Bites", emoji: "🍫", dose: "~3-6mg per bite", mgEach: 4.5, desc: "Small pieces for better social-dose pacing." },
  { id: "classic-jello-shots", name: "Jello Cubes", emoji: "🍬", dose: "~5mg per cube", mgEach: 5, desc: "Gold-standard visual dosing for beginners." },
];

export function PartySnacks() {
  const [infusedMap, setInfusedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(ITEMS.map((i) => [i.id, true]))
  );
  const [selectedMap, setSelectedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(ITEMS.map((i) => [i.id, true]))
  );
  const [peopleCount, setPeopleCount] = useState(8);

  const selectedItems = useMemo(() => ITEMS.filter((i) => selectedMap[i.id]), [selectedMap]);
  const infusedCount = selectedItems.filter((i) => infusedMap[i.id]).length;
  const nonInfusedCount = selectedItems.length - infusedCount;
  const totalInfusedMg = selectedItems
    .filter((i) => infusedMap[i.id])
    .reduce((sum, i) => sum + i.mgEach * peopleCount, 0);
  const mgPerPerson = peopleCount > 0 ? totalInfusedMg / peopleCount : 0;
  const mixStatus =
    infusedCount === 2 && nonInfusedCount === 3
      ? "perfect"
      : infusedCount > 2
        ? "too-high"
        : "adjust";

  const applyRecommendedMix = () => {
    const defaultInfused = new Set(["classic-jello-shots", "rice-krispie-treat-squares"]);
    const defaultSelected = new Set([
      "classic-jello-shots",
      "rice-krispie-treat-squares",
      "chocolate-dipped-pretzels",
      "popcorn-balls",
      "mini-slider-sauce",
    ]);
    setSelectedMap(Object.fromEntries(ITEMS.map((i) => [i.id, defaultSelected.has(i.id)])));
    setInfusedMap(Object.fromEntries(ITEMS.map((i) => [i.id, defaultInfused.has(i.id)])));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Helmet>
        <title>Party Snacks | Infusion Sensei</title>
        <meta
          name="description"
          content="Build dose-controlled handheld party snacks with infused and non-infused toggles for mixed guest groups."
        />
      </Helmet>

      <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-black mb-2">Party Snacks 🎉</h1>
        <p className="text-purple-100">Single-serving, dose-controlled handheld items for real-world party hosting.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge className="bg-white/20 text-white border-white/30">1 item = 1 dose</Badge>
          <Badge className="bg-white/20 text-white border-white/30">Infused + non-infused mix</Badge>
          <Badge className="bg-white/20 text-white border-white/30">Planner-ready format</Badge>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-2xl font-black text-gray-900 mb-3">Build Your Party Mix</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <p className="text-xs text-gray-500">Guests</p>
            <input
              type="number"
              min={1}
              value={peopleCount}
              onChange={(e) => setPeopleCount(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1 w-full border border-gray-300 rounded-md px-2 py-1.5 text-sm"
            />
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-3">
            <p className="text-xs text-gray-500">Infused items</p>
            <p className="text-2xl font-black text-green-700">{infusedCount}</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <p className="text-xs text-gray-500">Non-infused items</p>
            <p className="text-2xl font-black text-blue-700">{nonInfusedCount}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
            <p className="text-xs text-gray-500">Estimated mg/person</p>
            <p className="text-2xl font-black text-purple-700">{mgPerPerson.toFixed(1)}mg</p>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 items-center">
          <Button variant="outline" onClick={applyRecommendedMix} className="font-bold">
            Apply recommended 2 infused + 3 non-infused
          </Button>
          {mixStatus === "perfect" ? (
            <Badge className="bg-green-100 text-green-700 border-green-200">Perfect mix: 2 infused + 3 non-infused</Badge>
          ) : mixStatus === "too-high" ? (
            <Badge className="bg-red-100 text-red-700 border-red-200">Too many infused items selected - lower to 2</Badge>
          ) : (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">Target mix is 2 infused + 3 non-infused</Badge>
          )}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        {ITEMS.map((item) => {
          const infused = infusedMap[item.id];
          const selected = selectedMap[item.id];
          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-lg text-gray-900">{item.emoji} {item.name}</p>
                <Badge className={selected ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                  {selected ? "In mix" : "Not in mix"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              <p className="text-sm font-semibold text-gray-800 mt-2">{item.dose}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant={selected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMap((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                >
                  {selected ? "Included" : "Add to mix"}
                </Button>
                <Button
                  variant={infused ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInfusedMap((prev) => ({ ...prev, [item.id]: true }))}
                >
                  Infused version
                </Button>
                <Button
                  variant={!infused ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInfusedMap((prev) => ({ ...prev, [item.id]: false }))}
                >
                  Non-infused version
                </Button>
              </div>

              <div className="mt-3">
                {infused && selected ? (
                  <Link to={`/ingredients?category=snacks&recipe=${encodeURIComponent(item.id)}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                      <ChefHat className="w-4 h-4 mr-1.5" /> Build Infused Recipe
                    </Button>
                  </Link>
                ) : (
                  <p className="text-xs text-gray-600">Non-infused or not in mix. Keep this as a regular snack item.</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-gray-700 font-semibold">Want precision handheld dosing like jello? Add gummies to your mix.</p>
        <Link to="/gummies">
          <Button variant="outline" className="font-bold">Open Gummies <ArrowRight className="w-4 h-4 ml-1.5" /></Button>
        </Link>
      </div>
    </div>
  );
}

