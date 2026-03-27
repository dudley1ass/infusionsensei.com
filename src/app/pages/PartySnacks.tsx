import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const EMPTY = "__none__";

type SnackItem = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
};

const ITEMS: SnackItem[] = [
  { id: "rice-krispie-treat-squares", name: "Rice Krispie Treat Squares", emoji: "🟨", desc: "Single-serving bars with easy batch math." },
  { id: "popcorn-balls", name: "Popcorn Balls", emoji: "🍿", desc: "Portable pieces you can label by the ball." },
  { id: "chocolate-dipped-pretzels", name: "Chocolate-Dipped Pretzels", emoji: "🥨", desc: "Infused and plain trays side-by-side." },
  { id: "mini-slider-sauce", name: "Mini Sliders (Infused Sauce)", emoji: "🍔", desc: "Infuse the sauce only for mixed parties." },
  { id: "mini-brownie-bites", name: "Mini Brownie Bites", emoji: "🍫", desc: "Small bites for social pacing." },
  { id: "classic-jello-shots", name: "Jello Cubes", emoji: "🍬", desc: "One cube = one dose — beginner friendly." },
];

function buildInitialSlots(count: number): string[] {
  const next = ITEMS.slice(0, Math.min(count, ITEMS.length)).map((i) => i.id);
  while (next.length < count) next.push(EMPTY);
  return next;
}

export function PartySnacks() {
  const [guestCount, setGuestCount] = useState(8);
  const [infusedSlotCount, setInfusedSlotCount] = useState(2);
  const [mgPerPerson, setMgPerPerson] = useState(10);
  const [infusedSelections, setInfusedSelections] = useState<string[]>(() => buildInitialSlots(2));

  const syncSlotArray = useCallback((newCount: number) => {
    setInfusedSlotCount(newCount);
    setInfusedSelections((prev) => {
      if (newCount === prev.length) return prev;
      if (newCount < prev.length) return prev.slice(0, newCount);
      const extra = newCount - prev.length;
      return [...prev, ...Array.from({ length: extra }, () => EMPTY)];
    });
  }, []);

  const filledSelections = useMemo(
    () => infusedSelections.filter((id) => id && id !== EMPTY),
    [infusedSelections]
  );

  const uniqueInfusedIds = useMemo(() => [...new Set(filledSelections)], [filledSelections]);

  const mgEachTarget =
    uniqueInfusedIds.length > 0 ? mgPerPerson / uniqueInfusedIds.length : 0;

  const hasDuplicatePicks = useMemo(() => {
    const seen = new Set<string>();
    for (const id of filledSelections) {
      if (!id || id === EMPTY) continue;
      if (seen.has(id)) return true;
      seen.add(id);
    }
    return false;
  }, [filledSelections]);

  const allSlotsChosen = filledSelections.length === infusedSlotCount && !hasDuplicatePicks;

  const setSlot = (index: number, value: string) => {
    setInfusedSelections((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const builderLink = (recipeId: string) => {
    const params = new URLSearchParams({
      category: "snacks",
      recipe: recipeId,
      servings: String(Math.max(1, guestCount)),
      targetMgPerServing: mgEachTarget > 0 ? mgEachTarget.toFixed(4) : "",
      from: "party-snacks",
    });
    if (!mgEachTarget || mgEachTarget <= 0) params.delete("targetMgPerServing");
    return `/ingredients?${params.toString()}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Helmet>
        <title>Party Snacks | Infusion Sensei</title>
        <meta
          name="description"
          content="Plan party snacks by guest count, infused picks, and mg per person. Open tailored recipes in the builder."
        />
      </Helmet>

      <div className="bg-gradient-to-br from-purple-800 to-indigo-900 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-black mb-2">Party Snacks 🎉</h1>
        <p className="text-purple-100">
          Set guests, how many infused types you are serving, pick each one from the list, and your mg/person goal. The recipe
          builder opens scaled to your guest count and adjusts infused amounts toward your per-piece target.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge className="bg-white/20 text-white border-white/30">Handheld portions</Badge>
          <Badge className="bg-white/20 text-white border-white/30">mg/person targeting</Badge>
          <Badge className="bg-white/20 text-white border-white/30">Builder-ready</Badge>
        </div>
      </div>

      <section className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-black text-gray-900">Party plan</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label htmlFor="guests" className="text-xs text-gray-500">
              Guests
            </Label>
            <input
              id="guests"
              type="number"
              min={1}
              value={guestCount}
              onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value) || 1))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="infused-count" className="text-xs text-gray-500">
              Number of infused items
            </Label>
            <input
              id="infused-count"
              type="number"
              min={1}
              max={ITEMS.length}
              value={infusedSlotCount}
              onChange={(e) => {
                const n = Math.min(ITEMS.length, Math.max(1, Number(e.target.value) || 1));
                syncSlotArray(n);
              }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-1 sm:col-span-2 lg:col-span-2">
            <Label htmlFor="mg-person" className="text-xs text-gray-500">
              Target THC mg per person (from infused snacks)
            </Label>
            <input
              id="mg-person"
              type="number"
              min={0}
              step={0.5}
              value={mgPerPerson}
              onChange={(e) => setMgPerPerson(Math.max(0, Number(e.target.value) || 0))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <p className="text-xs text-gray-500">
              We split this evenly across each infused type you select (one portion per guest per type). Example: 10 mg/person
              with 2 infused snacks → builder targets ~5 mg per piece for each recipe.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-bold text-gray-800">Choose each infused snack</p>
          <div className="grid gap-3 md:grid-cols-2">
            {infusedSelections.map((val, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <Label className="text-xs text-gray-500">Infused item {idx + 1}</Label>
                <Select value={val} onValueChange={(v) => setSlot(idx, v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select snack…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EMPTY}>— Select —</SelectItem>
                    {ITEMS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.emoji} {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`rounded-xl border p-4 ${hasDuplicatePicks ? "bg-red-50 border-red-200" : "bg-violet-50 border-violet-200"}`}
        >
          {hasDuplicatePicks ? (
            <p className="text-sm font-semibold text-red-800">Each infused slot must be a different snack.</p>
          ) : (
            <>
              <p className="text-sm text-gray-700">
                <span className="font-black text-violet-900">{uniqueInfusedIds.length}</span> infused type
                {uniqueInfusedIds.length !== 1 ? "s" : ""} ·{" "}
                <span className="font-black text-violet-900">{mgEachTarget.toFixed(2)} mg</span> per piece per infused type
                (guest goal {mgPerPerson} mg ÷ {Math.max(1, uniqueInfusedIds.length)}).
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Recipes open with <span className="font-semibold">{guestCount}</span> servings. Infused ingredient amounts are
                scaled in the builder to approach the per-serving target (based on your saved infusion THC/units).
              </p>
            </>
          )}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-black text-gray-900">Snack reference</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {ITEMS.map((item) => {
            const picked = uniqueInfusedIds.includes(item.id);
            return (
              <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-black text-gray-900">
                    {item.emoji} {item.name}
                  </p>
                  {picked ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">In your infused list</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600">
                      Not selected
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.desc}</p>
                <div className="mt-3">
                  {picked && allSlotsChosen ? (
                    <Link to={builderLink(item.id)}>
                      <Button className="bg-green-600 hover:bg-green-700 text-white font-bold w-full sm:w-auto">
                        <ChefHat className="w-4 h-4 mr-1.5" />
                        Build {item.name}
                      </Button>
                    </Link>
                  ) : (
                    <p className="text-xs text-gray-500">
                      Add this snack to your infused dropdowns (no duplicates) to enable the build button.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-gray-700 font-semibold">Want more precision handhelds? Open gummies.</p>
        <Link to="/gummies">
          <Button variant="outline" className="font-bold">
            Gummies <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
