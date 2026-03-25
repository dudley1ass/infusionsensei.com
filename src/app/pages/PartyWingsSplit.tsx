import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Save, XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { safeJsonParse } from "../utils/storage";
import { useNavigate } from "react-router";

type WingsSplitState = {
  totalWings: number;
  mgEach: number;
  flavors: { sauceId: string; qtyWings: number }[];
};

// Subset of popular sauces for the party flow.
const WING_FLAVORS: { sauceId: string; name: string; emoji: string }[] = [
  { sauceId: "garlic-parmesan", name: "Garlic Parmesan", emoji: "🧄" },
  { sauceId: "classic-buffalo", name: "Classic Buffalo", emoji: "🌶️" },
  { sauceId: "nashville-hot", name: "Nashville Hot", emoji: "🔥" },
  { sauceId: "honey-bbq", name: "Honey BBQ", emoji: "🍯" },
  { sauceId: "lemon-pepper", name: "Lemon Pepper", emoji: "🍋" },
  { sauceId: "honey-mustard", name: "Honey Mustard", emoji: "🍯" },
];

// Baseline derived from the wings recipe template (900g wings == 4 servings).
// That implies ~7.5 wings per "serving" in this app.
const WINGS_PER_SERVING = 7.5;

export function PartyWingsSplit() {
  const { packId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const progressStorageKey = `party-pack-wings:${packId}`;
  const initialTotalFromQuery = Number(searchParams.get("wings") ?? "");

  const baseTotal = Number.isFinite(initialTotalFromQuery) && initialTotalFromQuery > 0 ? initialTotalFromQuery : 110;
  const [state, setState] = useState<WingsSplitState>(() => ({
    totalWings: baseTotal,
    mgEach: 2.5,
    flavors: [
      { sauceId: "garlic-parmesan", qtyWings: Math.round(baseTotal * 0.33) },
      { sauceId: "classic-buffalo", qtyWings: Math.round(baseTotal * 0.33) },
      { sauceId: "nashville-hot", qtyWings: baseTotal - Math.round(baseTotal * 0.66) },
    ],
  }));

  useEffect(() => {
    const saved = safeJsonParse<WingsSplitState | null>(localStorage.getItem(progressStorageKey), null);
    if (saved && saved.totalWings > 0) setState(saved);
  }, [progressStorageKey]);

  const totalAllocated = useMemo(
    () => state.flavors.reduce((sum, f) => sum + (f.qtyWings || 0), 0),
    [state.flavors]
  );

  const setQty = (sauceId: string, qtyWings: number) => {
    setState((prev) => {
      const nextFlavors = prev.flavors.map((f) => (f.sauceId === sauceId ? { ...f, qtyWings } : f));
      return { ...prev, flavors: nextFlavors.filter((f) => f.qtyWings > 0) };
    });
  };

  const ensureFlavorsExist = () => {
    setState((prev) => {
      const map = new Map(prev.flavors.map((f) => [f.sauceId, f]));
      const next = WING_FLAVORS.map((opt) => {
        const existing = map.get(opt.sauceId);
        return existing ? existing : { sauceId: opt.sauceId, qtyWings: 0 };
      }).filter((f) => f.qtyWings > 0);
      // If user deleted everything, restore at least one flavor.
      if (next.length === 0) return { ...prev, flavors: [{ sauceId: "garlic-parmesan", qtyWings: prev.totalWings }] };
      return { ...prev, flavors: next };
    });
  };

  const isValid = totalAllocated === state.totalWings && state.totalWings > 0 && state.flavors.length > 0;

  useEffect(() => {
    ensureFlavorsExist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveAndReturn = () => {
    localStorage.setItem(progressStorageKey, JSON.stringify(state));
    navigate(`/party-mode/plan/${packId}`);
  };

  const servingsOverrideFor = (qtyWings: number) => {
    const servings = Math.max(1, Math.round(qtyWings / WINGS_PER_SERVING));
    return servings;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Helmet>
        <title>Wings Split Planner | Infusion Sensei</title>
        <meta
          name="description"
          content="Split your total wings by flavor, then build each sauce recipe with exact servings scaled to your wing count."
        />
      </Helmet>

      <div className="bg-gradient-to-br from-orange-600 to-red-700 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-3xl font-black mb-2">Split Your Wings by Flavor</h1>
        <p className="text-orange-50">
          Add up to your total wings. When you build a flavor, we pass the correct servings so the recipe scales automatically.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label className="text-sm font-bold text-gray-700">Total wings</Label>
            <Input
              type="number"
              min={1}
              value={state.totalWings}
              onChange={(e) => setState((prev) => ({ ...prev, totalWings: Math.max(1, Number(e.target.value) || 1) }))}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">Example: 110 wings for a big game night.</p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm font-bold text-gray-700">THC target (mg per wing)</Label>
            <Input
              type="number"
              min={0}
              step="0.5"
              value={state.mgEach}
              onChange={(e) => setState((prev) => ({ ...prev, mgEach: Math.max(0, Number(e.target.value) || 0) }))}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              This affects infusion math in your party planner. Servings scaling uses wing quantity only.
            </p>
          </div>
        </div>

        <div className={`mt-4 p-3 rounded-xl border ${isValid ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
          <p className="text-sm font-semibold text-gray-900">
            Allocated: {totalAllocated} / {state.totalWings} wings
          </p>
          {!isValid && (
            <p className="text-xs text-amber-900 mt-1">
              Adjust flavor quantities so the total matches exactly before you build.
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-4">Choose your wing flavors</h2>
        <div className="space-y-3">
          {WING_FLAVORS.map((opt) => {
            const existing = state.flavors.find((f) => f.sauceId === opt.sauceId);
            const qtyWings = existing?.qtyWings ?? 0;
            return (
              <div key={opt.sauceId} className="flex items-end gap-4">
                <div className="w-24">
                  <div className="text-3xl">{opt.emoji}</div>
                  <div className="font-black text-sm">{opt.name}</div>
                </div>
                <div className="flex-1">
                  <Label className="text-xs font-bold text-gray-500">Wings</Label>
                  <Input
                    type="number"
                    min={0}
                    value={qtyWings}
                    onChange={(e) => setQty(opt.sauceId, Math.max(0, Number(e.target.value) || 0))}
                    className="mt-1"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-black text-gray-900">Build each flavor recipe</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {state.flavors.map((f) => {
            const opt = WING_FLAVORS.find((o) => o.sauceId === f.sauceId);
            const servingsOverride = servingsOverrideFor(f.qtyWings);
            return (
              <div key={f.sauceId} className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className="font-black text-gray-900">
                  {opt?.emoji} {opt?.name ?? f.sauceId}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {f.qtyWings} wings (≈ {servingsOverride} servings)
                </p>
                <Link
                  to={`/wings?sauce=${encodeURIComponent(f.sauceId)}&servings=${servingsOverride}&returnToPartyPack=/party-mode/plan/${encodeURIComponent(
                    packId
                  )}&partyPackId=${encodeURIComponent(packId)}&partyItemId=${encodeURIComponent(`wings:${f.sauceId}`)}`}
                >
                  <Button
                    className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold"
                    disabled={!isValid}
                    onClick={() => {
                      localStorage.setItem(progressStorageKey, JSON.stringify(state));
                    }}
                  >
                    Build {opt?.name ?? "this flavor"} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <Button
          onClick={() => {
            localStorage.setItem(progressStorageKey, JSON.stringify(state));
            saveAndReturn();
          }}
          disabled={state.totalWings <= 0}
          className="bg-green-600 hover:bg-green-700 text-white font-bold"
        >
          <Save className="w-4 h-4 mr-2" />
          Save & Return to Party Pack
        </Button>

        <Button variant="outline" onClick={() => navigate(`/party-mode/plan/${packId}`)} className="font-bold">
          Back
        </Button>
      </div>
    </div>
  );
}

