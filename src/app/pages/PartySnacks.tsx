import { useState } from "react";
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
  desc: string;
};

const ITEMS: SnackItem[] = [
  { id: "rice-krispie-treat-squares", name: "Rice Krispie Treat Squares", emoji: "🟨", dose: "~5mg per square", desc: "Single-serving bars with very easy batch math." },
  { id: "popcorn-balls", name: "Popcorn Balls", emoji: "🍿", dose: "~4-6mg per ball", desc: "Sticky portable snack that holds infusion well." },
  { id: "chocolate-dipped-pretzels", name: "Chocolate-Dipped Pretzels", emoji: "🥨", dose: "~3-5mg per pretzel", desc: "Make infused and non-infused trays side-by-side." },
  { id: "mini-slider-sauce", name: "Mini Sliders (Infused Sauce)", emoji: "🍔", dose: "~4-8mg per slider", desc: "Infuse sauce only for clean mixed-party control." },
  { id: "mini-brownie-bites", name: "Mini Brownie Bites", emoji: "🍫", dose: "~3-6mg per bite", desc: "Small pieces for better social-dose pacing." },
  { id: "classic-jello-shots", name: "Jello Cubes", emoji: "🍬", dose: "~5mg per cube", desc: "Gold-standard visual dosing for beginners." },
];

export function PartySnacks() {
  const [infusedMap, setInfusedMap] = useState<Record<string, boolean>>(
    Object.fromEntries(ITEMS.map((i) => [i.id, true]))
  );

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

      <div className="grid md:grid-cols-2 gap-4">
        {ITEMS.map((item) => {
          const infused = infusedMap[item.id];
          return (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-lg text-gray-900">{item.emoji} {item.name}</p>
                <Badge className={infused ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}>
                  {infused ? "Infused" : "Non-infused"}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
              <p className="text-sm font-semibold text-gray-800 mt-2">{item.dose}</p>

              <div className="mt-3 flex flex-wrap gap-2">
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
                {infused ? (
                  <Link to={`/ingredients?category=snacks&recipe=${encodeURIComponent(item.id)}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                      <ChefHat className="w-4 h-4 mr-1.5" /> Build Infused Recipe
                    </Button>
                  </Link>
                ) : (
                  <p className="text-xs text-gray-600">Keep this item non-infused for mixed groups. Use regular ingredients only.</p>
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

