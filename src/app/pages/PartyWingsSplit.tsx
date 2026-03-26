import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Save } from "lucide-react";
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

const WING_SAUCE_TO_RECIPE_ID: Record<string, string> = {
  "classic-buffalo": "classic-buffalo-wings",
  "garlic-parmesan": "garlic-parmesan-wings",
  "honey-bbq": "honey-bbq-wings",
  "lemon-pepper": "lemon-pepper-wings",
  // Fallback to nearest available builder recipe IDs (must exist in CreateRecipes wings templates).
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
  const builtPartyPackId = `wings-split:${packId}`;
  const builtStorageKey = `party-pack-progress:${builtPartyPackId}`;

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

  const builtMap = useMemo(() => {
    return safeJsonParse<Record<string, boolean>>(localStorage.getItem(builtStorageKey), {});
  }, [builtStorageKey, location.key]);

  const totalAllocated = useMemo(() => state.flavors.reduce((sum, f) => sum + (f.qtyWings || 0), 0), [state.flavors]);
  const remaining = state.totalWings - totalAllocated;
  const hasSelections = state.flavors.length > 0;
  const isAllocationExact = hasSelections && remaining === 0;

  const getFlavorQty = (sauceId: string) => state.flavors.find((f) => f.sauceId === sauceId)?.qtyWings ?? 0;
  const setFlavorQty = (sauceId: string, qtyWings: number) => {
    setState((prev) => {
      const existing = prev.flavors.find((f) => f.sauceId === sauceId);
      if (!existing && qtyWings > 0) return { ...prev, flavors: [...prev.flavors, { sauceId, qtyWings }] };
      if (existing && qtyWings <= 0) return { ...prev, flavors: prev.flavors.filter((f) => f.sauceId !== sauceId) };
      return {
        ...prev,
        flavors: prev.flavors.map((f) => (f.sauceId === sauceId ? { ...f, qtyWings } : f)),
      };
    });
  };

  const toggleFlavorSelected = (sauceId: string, selected: boolean) => {
    if (!selected) {
      setFlavorQty(sauceId, 0);
      return;
    }
    // When selecting a new flavor, default to 0 and let the user type.
    // If it's the only selection, we auto-fill with remaining.
    setState((prev) => {
      const already = prev.flavors.some((f) => f.sauceId === sauceId);
      if (already) return prev;
      const nextFlavors = [...prev.flavors, { sauceId, qtyWings: 0 }];
      const allocated = nextFlavors.reduce((sum, f) => sum + (f.qtyWings || 0), 0);
      const rem = prev.totalWings - allocated;
      // If user just created the selection and nothing else is allocated yet, give it all.
      const onlyThis = nextFlavors.length === 1;
      if (onlyThis && rem >= 0) return { ...prev, flavors: [{ sauceId, qtyWings: prev.totalWings }] };
      return { ...prev, flavors: nextFlavors };
    });
  };

  const servingsOverrideFor = (qtyWings: number) => Math.max(1, Math.round(qtyWings / WINGS_PER_SERVING));

  const selectedSauceIds = useMemo(() => state.flavors.map((f) => f.sauceId), [state.flavors]);
  const allSelectedBuilt = selectedSauceIds.every((sauceId) => builtMap[`flavor:${sauceId}`]);

  const markPlannerWingsCompleted = () => {
    const plannerKey = `party-pack-progress:${packId}`;
    const existing = safeJsonParse<Record<string, boolean>>(localStorage.getItem(plannerKey), {});
    localStorage.setItem(plannerKey, JSON.stringify({ ...existing, wings: true }));
  };

  const saveAndReturn = () => {
    localStorage.setItem(wingsStorageKey, JSON.stringify(state));
    markPlannerWingsCompleted();
    navigate(`/party-mode/plan/${packId}`);
  };

  const buildFlavorUrl = (sauceId: string, qtyWings: number) => {
    const servingsOverride = servingsOverrideFor(qtyWings);
    const recipeId = WING_SAUCE_TO_RECIPE_ID[sauceId] ?? "classic-buffalo-wings";
    const flavorProgressKey = `flavor:${sauceId}`;
    return `/ingredients?category=wings&recipe=${encodeURIComponent(recipeId)}&servings=${servingsOverride}&wingsQty=${encodeURIComponent(
      qtyWings
    )}&returnToPartyPack=${encodeURIComponent(
      `/party-mode/plan/${packId}/wings?from=${encodeURIComponent(sauceId)}`
    )}&partyPackId=${encodeURIComponent(builtPartyPackId)}&partyItemId=${encodeURIComponent(flavorProgressKey)}`;
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
          {hasSelections && (
            <p className="text-xs text-gray-600 mt-1">
              {allSelectedBuilt ? "All selected flavors marked built." : `Built: ${selectedSauceIds.filter((s) => builtMap[`flavor:${s}`]).length}/${selectedSauceIds.length} flavors`}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-4">Choose your wing flavors</h2>
        <div className="space-y-3">
          {WING_FLAVORS.map((opt) => {
            const selected = state.flavors.some((f) => f.sauceId === opt.sauceId);
            const built = builtMap[`flavor:${opt.sauceId}`];
            const qty = getFlavorQty(opt.sauceId);
            return (
              <div
                key={opt.sauceId}
                className={`flex items-center gap-3 p-3 rounded-xl border ${
                  selected ? "border-orange-200 bg-orange-50" : "border-gray-200 bg-white"
                }`}
              >
                <label className="flex items-center gap-3 cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => toggleFlavorSelected(opt.sauceId, e.target.checked)}
                  />
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-black text-sm">{opt.name}</span>
                </label>

                {selected ? (
                  <div className="flex items-center gap-3 flex-1">
                    <div className="min-w-[140px]">
                      <Label className="text-xs font-bold text-gray-500">Qty (wings)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={qty}
                        onChange={(e) => setFlavorQty(opt.sauceId, Math.max(0, Number(e.target.value) || 0))}
                        className="mt-1"
                      />
                    </div>
                    {built ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Built
                      </span>
                    ) : (
                      <Link to={buildFlavorUrl(opt.sauceId, qty)}>
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
                          disabled={!isAllocationExact || qty <= 0}
                          onClick={() => {
                            localStorage.setItem(wingsStorageKey, JSON.stringify(state));
                          }}
                        >
                          Build wings
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 text-xs text-gray-500">Select to split wings</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-black text-gray-900">Step-by-step: build your wing flavors</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {state.flavors.map((f) => {
            const opt = WING_FLAVORS.find((o) => o.sauceId === f.sauceId);
            const servingsOverride = servingsOverrideFor(f.qtyWings);
            const flavorProgressKey = `flavor:${f.sauceId}`;
            const isBuilt = builtMap[flavorProgressKey];

            return (
              <div key={f.sauceId} className="bg-white border border-gray-200 rounded-2xl p-4">
                <p className="font-black text-gray-900">
                  {opt?.emoji} {opt?.name ?? f.sauceId}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {f.qtyWings} wings (≈ {servingsOverride} servings)
                </p>
                <Link to={buildFlavorUrl(f.sauceId, f.qtyWings)}>
                  <Button
                    className="mt-3 w-full bg-orange-600 hover:bg-orange-700 text-white font-bold"
                    disabled={!isAllocationExact}
                    onClick={() => {
                      localStorage.setItem(wingsStorageKey, JSON.stringify(state));
                    }}
                  >
                    {isBuilt ? "Re-build" : "Build"} {opt?.name ?? "this flavor"}{" "}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            );
          })}
          {state.flavors.length === 0 && (
            <p className="text-sm text-gray-600">Select at least one flavor above.</p>
          )}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap items-center">
        <Button
          onClick={saveAndReturn}
          disabled={!isAllocationExact || !allSelectedBuilt}
          className="bg-green-600 hover:bg-green-700 text-white font-bold disabled:opacity-60"
        >
          <Save className="w-4 h-4 mr-2" />
          Done: Return to Party Pack
        </Button>

        <Button variant="outline" onClick={() => navigate(`/party-mode/plan/${packId}`)} className="font-bold">
          Back
        </Button>

        {!allSelectedBuilt && selectedSauceIds.length > 0 && (
          <p className="text-xs text-gray-600 w-full mt-1">
            Build all selected flavors before returning. ({selectedSauceIds.filter((s) => builtMap[`flavor:${s}`]).length}/{selectedSauceIds.length} done)
          </p>
        )}
      </div>
    </div>
  );
}

