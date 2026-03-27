import { useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

type GummyProfile = {
  id: string;
  name: string;
  flavor: string;
  dose: number;
  emoji: string;
  note: string;
};

const GUMMIES: GummyProfile[] = [
  { id: "classic-gummies", name: "Classic Gummies", flavor: "Berry", dose: 5, emoji: "🧸", note: "Reliable baseline gummy for most users." },
  { id: "fruit-gummies", name: "Fruit Juice Gummies", flavor: "Citrus", dose: 2.5, emoji: "🍊", note: "Beginner-friendly low-dose option." },
  { id: "sour-gummies", name: "Sour Gummies", flavor: "Sour Mix", dose: 10, emoji: "🍋", note: "Stronger option for experienced users." },
];

const DOSES = [2.5, 5, 10] as const;

export function Gummies() {
  const [targetDose, setTargetDose] = useState<number>(5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Helmet>
        <title>Infused Gummies | Infusion Sensei</title>
        <meta name="description" content="Build infused gummies with clear mg-per-piece dosing and party-ready portion control." />
      </Helmet>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[280px]">
        <img src="/IMAGES/gummies.jpg" alt="Infused gummies" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="relative z-10 px-6 py-14 text-center text-white">
          <div className="text-6xl mb-3">🧸</div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">Infused Gummies</h1>
          <p className="text-white/85 text-lg max-w-2xl mx-auto">Precision party doses: one gummy = one clear serving.</p>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            <Badge className="bg-white/20 text-white border-white/30">Single-piece dosing</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Easy party labeling</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Beginner to strong tiers</Badge>
          </div>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-5">
        <h2 className="text-xl font-black text-gray-900 mb-3">Pick Target Dose</h2>
        <div className="flex flex-wrap gap-2">
          {DOSES.map((dose) => (
            <Button key={dose} variant={targetDose === dose ? "default" : "outline"} onClick={() => setTargetDose(dose)}>
              {dose}mg
            </Button>
          ))}
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {GUMMIES.map((g) => (
          <div key={g.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
            <p className="font-black text-gray-900 text-lg">{g.emoji} {g.name}</p>
            <p className="text-sm text-gray-600 mt-1">Flavor: {g.flavor}</p>
            <p className="text-sm font-semibold text-gray-800 mt-2">Base dose: {g.dose}mg · Target: {targetDose}mg</p>
            <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-xs text-gray-600">{g.note}</p>
            </div>
            <Link to={`/ingredients?category=snacks&recipe=${encodeURIComponent(g.id)}`} className="mt-3 inline-block">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold">
                <ChefHat className="w-4 h-4 mr-1.5" /> Build Recipe
              </Button>
            </Link>
          </div>
        ))}
      </section>

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <h2 className="text-2xl font-black mb-2">Need tray-style visual dosing?</h2>
        <p className="text-green-200 mb-5">Use Jello for cube grids; use Gummies for compact single-piece portions.</p>
        <Link to="/jello">
          <Button className="bg-white text-green-800 hover:bg-green-50 font-black">
            Open Jello <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

