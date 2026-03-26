import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { Plus, Save, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { safeJsonParse } from "../utils/storage";

type WingsSplitState = {
  totalWings: number;
  mgEach: number;
  flavors: { sauceId: string; qtyWings: number }[];
};

const WING_FLAVORS: { sauceId: string; name: string; emoji: string }[] = [
  { sauceId: "classic-buffalo", name: "Classic Buffalo", emoji: "🌶️" },
  { sauceId: "garlic-parmesan", name: "Garlic Parmesan", emoji: "🧄" },
  { sauceId: "honey-bbq", name: "Honey BBQ", emoji: "🍯" },
  { sauceId: "lemon-pepper", name: "Lemon Pepper", emoji: "🍋" },
  { sauceId: "teriyaki", name: "Teriyaki Glaze", emoji: "🫙" },

  { sauceId: "mango-habanero", name: "Mango Habanero", emoji: "🥭" },
  { sauceId: "nashville-hot", name: "Nashville Hot Oil", emoji: "🔥" },
  { sauceId: "chili-crisp", name: "Chili Crisp", emoji: "🌶️" },
  { sauceId: "cajun-butter", name: "Cajun Butter", emoji: "🫑" },
  { sauceId: "sriracha-honey", name: "Sriracha Honey", emoji: "🍯" },

  { sauceId: "maple-bacon", name: "Maple Bacon Glaze", emoji: "🥓" },
  { sauceId: "brown-sugar-bourbon", name: "Brown Sugar Bourbon", emoji: "🥃" },
  { sauceId: "pineapple-ginger", name: "Pineapple Ginger", emoji: "🍍" },
  { sauceId: "honey-mustard", name: "Honey Mustard Infusion", emoji: "🍯" },
  { sauceId: "orange-glaze", name: "Orange Glaze", emoji: "🍊" },

  { sauceId: "korean-gochujang", name: "Korean Gochujang", emoji: "🇰🇷" },
  { sauceId: "garlic-soy-umami", name: "Garlic Soy Umami", emoji: "🧄" },
  { sauceId: "truffle-butter", name: "Truffle Butter", emoji: "🍄" },
  { sauceId: "chimichurri", name: "Herb Chimichurri", emoji: "🌿" },
  { sauceId: "ranch-butter", name: "Ranch Butter Toss", emoji: "🤍" },
];

// Baseline derived from the wings recipe template (900g wings == 4 servings).
// That implies ~7.5 wings per "serving" in this app.
const WINGS_PER_SERVING = 7.5;
const WINGS_PER_PERSON = 8;

export function PartyWingsSplit() {
  const { packId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const wingsStorageKey = `party-pack-wings:${packId}`;

  const queryWingsRaw = Number(searchParams.get("wings") ?? "");
  const queryMgRaw = searchParams.get("mgEach");
  const queryMg = queryMgRaw != null && queryMgRaw !== "" ? Number(queryMgRaw) : null;

  const queryTotalWings = Number.isFinite(queryWingsRaw) && queryWingsRaw > 0 ? queryWingsRaw : null;
  const queryMgEach = queryMg != null && Number.isFinite(queryMg) && queryMg >= 0 ? queryMg : null;

  const [state, setState] = useState<WingsSplitState>(() => {
    const total = queryTotalWings ?? 110;
    const mgEach = queryMgEach ?? 2.5;
    return {
      totalWings: total,
      mgEach,
      flavors: [{ sauceId: "garlic-parmesan", qtyWings: total }],
    };
  });

  // If user came from planner with a specific total wings, prefer query over saved.
  useEffect(() => {
    const saved = safeJsonParse<WingsSplitState | null>(localStorage.getItem(wingsStorageKey), null);
    if (!saved || saved.totalWings <= 0) return;

    if (queryTotalWings != null) {
      const nextTotalWings = queryTotalWings;
      const nextMgEach = queryMgEach ?? saved.mgEach;

      // If the saved split matches the same wing total, preserve the flavor breakdown.
      // Otherwise, this is likely a "new party" with a new guest count, so reset the split.
      const shouldPreserveFlavors = saved.totalWings === nextTotalWings && saved.flavors.length > 0;
      setState(
        shouldPreserveFlavors
          ? { ...saved, totalWings: nextTotalWings, mgEach: nextMgEach }
          : {
              totalWings: nextTotalWings,
              mgEach: nextMgEach,
              flavors: [{ sauceId: "garlic-parmesan", qtyWings: nextTotalWings }],
            }
      );
      return;
    }

    setState({
      ...saved,
      mgEach: queryMgEach ?? saved.mgEach,
    });
  }, [wingsStorageKey, queryTotalWings, queryMgEach]);

  const totalAllocated = useMemo(() => state.flavors.reduce((sum, f) => sum + (f.qtyWings || 0), 0), [state.flavors]);
  const remaining = state.totalWings - totalAllocated;
  const hasSelections = state.flavors.length > 0;
  const isAllocationExact = hasSelections && remaining === 0;

  const updateFlavorAtIndex = (index: number, patch: Partial<{ sauceId: string; qtyWings: number }>) => {
    setState((prev) => ({
      ...prev,
      flavors: prev.flavors.map((f, i) => (i === index ? { ...f, ...patch } : f)),
    }));
  };

  const addFlavorRow = () => {
    setState((prev) => {
      const used = new Set(prev.flavors.map((f) => f.sauceId));
      const nextFlavor = WING_FLAVORS.find((f) => !used.has(f.sauceId))?.sauceId ?? WING_FLAVORS[0].sauceId;
      if (used.has(nextFlavor) && prev.flavors.length >= WING_FLAVORS.length) return prev;
      return { ...prev, flavors: [...prev.flavors, { sauceId: nextFlavor, qtyWings: 0 }] };
    });
  };

  const removeFlavorRow = (index: number) => {
    setState((prev) => {
      const next = prev.flavors.filter((_, i) => i !== index);
      return { ...prev, flavors: next.length > 0 ? next : [{ sauceId: "garlic-parmesan", qtyWings: prev.totalWings }] };
    });
  };

  const servingsOverrideFor = (qtyWings: number) => Math.max(1, Math.round(qtyWings / WINGS_PER_SERVING));

  const saveAndReturn = () => {
    localStorage.setItem(wingsStorageKey, JSON.stringify(state));
    navigate(`/party-mode/plan/${packId}`);
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
          Split wings by flavor and save. You can adjust flavor recipes later from the planner.
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
            <p className="text-xs text-gray-500 mt-1">
              Feeds ~{Math.max(1, Math.round(state.totalWings / WINGS_PER_PERSON))} people (using ~{WINGS_PER_PERSON} wings/person)
            </p>
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

        <div
          className={`mt-4 p-3 rounded-xl border ${
            isAllocationExact ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"
          }`}
        >
          <p className="text-sm font-semibold text-gray-900">
            Selected wings: {totalAllocated} / {state.totalWings} (Remaining: {remaining})
          </p>
          {!isAllocationExact && (
            <p className="text-xs text-amber-900 mt-1">Make the split total match exactly before you build recipes.</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2 space-y-4">
          {state.flavors.map((f, index) => {
            const opt = WING_FLAVORS.find((o) => o.sauceId === f.sauceId);
            return (
              <div key={`${f.sauceId}-${index}`} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-4">Wing Flavor {index + 1}</h3>
                <div className="grid md:grid-cols-3 gap-3 items-end">
                  <div>
                    <Label className="text-xs font-bold text-gray-500">Wing flavor</Label>
                    <select
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      value={f.sauceId}
                      onChange={(e) => updateFlavorAtIndex(index, { sauceId: e.target.value })}
                    >
                      {WING_FLAVORS.map((wf) => (
                        <option key={wf.sauceId} value={wf.sauceId}>
                          {wf.emoji} {wf.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label className="text-xs font-bold text-gray-500">Wing quantity</Label>
                    <Input
                      type="number"
                      min={0}
                      value={f.qtyWings}
                      onChange={(e) => updateFlavorAtIndex(index, { qtyWings: Math.max(0, Number(e.target.value) || 0) })}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                      Flavor saved in split. Build or edit recipe later from planner.
                    </div>
                    {state.flavors.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() => removeFlavorRow(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {opt?.emoji} {opt?.name} · {f.qtyWings} wings · ≈ {servingsOverrideFor(f.qtyWings)} servings
                </p>
              </div>
            );
          })}

          <Button
            type="button"
            variant="outline"
            className="font-bold"
            onClick={addFlavorRow}
            disabled={state.flavors.length >= WING_FLAVORS.length}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add another wing flavor
          </Button>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm sticky top-24">
          <h3 className="text-lg font-black text-gray-900 mb-3">Wing Split Summary</h3>
          <div className="space-y-2 text-sm">
            {state.flavors.map((f) => {
              const opt = WING_FLAVORS.find((o) => o.sauceId === f.sauceId);
              return (
                <div key={`sum-${f.sauceId}`} className="flex justify-between gap-2">
                  <span className="text-gray-700 truncate">{opt?.emoji} {opt?.name}</span>
                  <span className="font-bold text-gray-900">{f.qtyWings}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200 space-y-1 text-sm">
            <p className="flex justify-between"><span>Total wings</span><span className="font-bold">{state.totalWings}</span></p>
            <p className="flex justify-between"><span>Assigned</span><span className="font-bold">{totalAllocated}</span></p>
            <p className="flex justify-between"><span>Remaining</span><span className={`font-bold ${remaining === 0 ? "text-green-700" : "text-amber-700"}`}>{remaining}</span></p>
          </div>
          {!isAllocationExact && (
            <p className="text-xs text-amber-700 mt-3">Adjust quantities until Remaining = 0.</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <Button
          onClick={saveAndReturn}
          disabled={!isAllocationExact}
          className="bg-green-600 hover:bg-green-700 text-white font-bold disabled:opacity-60"
        >
          <Save className="w-4 h-4 mr-2" />
          Done: Return to Party Pack
        </Button>

        <Button variant="outline" onClick={() => navigate(`/party-mode/plan/${packId}`)} className="font-bold">
          Back
        </Button>

      </div>
    </div>
  );
}

