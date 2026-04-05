import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat, ListChecks, Printer } from "lucide-react";
import { standardRecipes } from "./CreateRecipes";
import {
  buildPartySnackGrocery,
  formatQuickShopLine,
  getStandardRecipeById,
  groceryLineDisplay,
  grocerySectionForIngredient,
  type GroceryMeasureMode,
} from "../utils/partySnackGrocery";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const EMPTY = "__none__";

type SnackItem = {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  /** Default `snacks`; wings use the wings builder category; dips live under spreads in the builder too, but templates resolve from shared IDs. */
  builderCategory?: "snacks" | "wings";
};

const SNACK_GROUPS: { title: string; items: SnackItem[] }[] = [
  {
    title: "Core treats & handhelds",
    items: [
      { id: "rice-krispie-treat-squares", name: "Rice Krispie Treats", emoji: "🟨", desc: "Grid-cut squares — easy per-piece math." },
      { id: "popcorn-balls", name: "Popcorn Balls", emoji: "🍿", desc: "Sticky balls you can label by piece." },
      { id: "mini-brownie-bites", name: "Brownie Bites", emoji: "🍫", desc: "Mini muffin format for parties." },
      { id: "blondie-squares", name: "Blondie Squares", emoji: "🟫", desc: "Buttery blonde bars, dose by square." },
      { id: "chocolate-dipped-pretzels", name: "Chocolate-Dipped Pretzels", emoji: "🥨", desc: "Run infused and plain trays side-by-side." },
      { id: "marshmallow-pops", name: "Marshmallow Pops", emoji: "🍡", desc: "Stick + dip — great for displays." },
      { id: "mini-cupcakes-infused-frosting", name: "Mini Cupcakes (infused frosting)", emoji: "🧁", desc: "Infuse frosting only; keep cake straightforward." },
      { id: "cookie-sandwiches-infused-filling", name: "Cookie Sandwiches (infused filling)", emoji: "🍪", desc: "Tiny sandwich cookies with buttercream made with cannabutter." },
      { id: "churro-bites", name: "Churro Bites (infused cinnamon sugar)", emoji: "🟤", desc: "Fry bites; toss in infused sugar." },
      { id: "funnel-cake-bites", name: "Funnel Cake Bites", emoji: "🎪", desc: "Fair-style bites + infused drizzle." },
    ],
  },
  {
    title: "Snackable / crunchy",
    items: [
      { id: "chex-mix-infused", name: "Chex Mix", emoji: "🥣", desc: "Baked cereal mix with cannabutter." },
      { id: "infused-nuts", name: "Infused Nuts", emoji: "🥜", desc: "Roasted glazed nut mix." },
      { id: "caramel", name: "Caramel Corn", emoji: "🍯", desc: "Baked caramel corn (builder template)." },
      { id: "kettle-corn-infused", name: "Kettle Corn", emoji: "🍿", desc: "Sweet-salt popcorn finish." },
      { id: "snack-mix-party", name: "Snack Mix", emoji: "🧂", desc: "Pretzels + cereal + popcorn + nuts." },
      { id: "cheese-crackers-infused-dust", name: "Cheese Crackers (infused dust)", emoji: "🧀", desc: "Parmesan-garlic butter bake." },
      { id: "garlic-parmesan-pretzels", name: "Garlic Parmesan Pretzels", emoji: "🥨", desc: "Warm pretzels, cannabutter toss." },
    ],
  },
  {
    title: "Savory party bites (infuse dips / sauces)",
    items: [
      { id: "mini-slider-sauce", name: "Mini Sliders (infused sauce)", emoji: "🍔", desc: "Sauce-only infusion for mixed parties." },
      { id: "chicken-tenders-infused-dip", name: "Chicken Tenders (infused dip)", emoji: "🍗", desc: "Breaded tenders + labeled dip bowl." },
      { id: "classic-buffalo", name: "Wings (Buffalo starter)", emoji: "🍗", desc: "Opens wing builder — add flavors from Wings too.", builderCategory: "wings" },
      { id: "meatballs-infused-glaze", name: "Meatballs (infused glaze)", emoji: "🍖", desc: "Bake balls; toss in infused glaze." },
      { id: "sausage-bites-honey-mustard", name: "Sausage Bites (infused honey mustard)", emoji: "🌭", desc: "Cocktail links + labeled sauce." },
      { id: "mini-hot-dogs-infused-condiments", name: "Mini Hot Dogs (infused ketchup/mustard)", emoji: "🌭", desc: "Infuse condiments, not the franks." },
      { id: "queso-dip-infused", name: "Queso Dip", emoji: "🫕", desc: "Cheese dip with cannabutter in the base." },
      { id: "spinach-artichoke-dip-infused", name: "Spinach Artichoke Dip", emoji: "🥬", desc: "Classic dip; infusion in the creamy base." },
    ],
  },
  {
    title: "Dips & sauces (goldmine)",
    items: [
      { id: "buffalo-dip-infused", name: "Buffalo Dip", emoji: "🔥", desc: "Creamy hot dip for chips and veg." },
      { id: "ranch-dip-infused", name: "Ranch Dip", emoji: "🌿", desc: "Cool ranch with infused oil whisked in." },
      { id: "honey-mustard-dip-infused", name: "Honey Mustard", emoji: "🍯", desc: "Sweet-tang dip for pretzels and tenders." },
      { id: "garlic-aioli-infused", name: "Garlic Aioli", emoji: "🧄", desc: "Sandwich and slider spread." },
      { id: "bbq-sauce-infused-party", name: "BBQ Sauce", emoji: "🍖", desc: "Brush-on or dip — label jar." },
      { id: "sweet-chili-sauce-infused", name: "Sweet Chili Sauce", emoji: "🌶️", desc: "Sticky dip for fries and apps." },
      { id: "cheese-sauce-infused", name: "Cheese Sauce", emoji: "🧀", desc: "Cheddar sauce for nachos and fries." },
    ],
  },
  {
    title: "Fun party items",
    items: [
      { id: "classic-jello-shots", name: "Jello Cubes", emoji: "🍬", desc: "One cube ≈ one dose — beginner friendly." },
      { id: "gummy-clusters", name: "Gummy Clusters", emoji: "🍇", desc: "Gummy chunks coated in chocolate." },
      { id: "chocolate-bark-infused", name: "Chocolate Bark", emoji: "🍫", desc: "Snap bark pieces; easy to label." },
      { id: "candy-coated-popcorn", name: "Candy-Coated Popcorn", emoji: "🎀", desc: "Crunchy candy shell popcorn." },
      { id: "skewered-snack-bites-party", name: "Skewered Snack Bites", emoji: "🍢", desc: "Mix-and-match picks + infused chocolate." },
    ],
  },
];

const ALL_PARTY_SNACK_ITEMS = SNACK_GROUPS.flatMap((g) => g.items);

const GROCERY_MODE_STORAGE_KEY = "party-snack-grocery-measure";

/**
 * Matches recipe builder buffet tent labels (`CreateRecipes` print → table tents).
 * Used for browser print and the “Print snack labels” popup.
 */
const BUFFET_TENT_LABEL_CSS = `
  .print-buffet-sheet {
    font-family: system-ui, "Segoe UI", Arial, Helvetica, sans-serif !important;
    padding: 0 !important;
  }
  .print-buffet-intro {
    font-size: 9pt !important;
    color: #444 !important;
    margin-bottom: 10pt !important;
    text-align: center !important;
    page-break-after: avoid !important;
  }
  .print-buffet-grid {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 0.18in !important;
  }
  .buffet-tent {
    border: 1.5pt solid #111 !important;
    border-radius: 2pt !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    background: #fff !important;
  }
  .buffet-tent-panel {
    padding: 0.14in 0.16in 0.12in 0.16in !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    justify-content: center !important;
    text-align: center !important;
    min-height: 1.05in !important;
  }
  .buffet-fold {
    border-top: 0.75pt dashed #888 !important;
    font-size: 6.5pt !important;
    letter-spacing: 0.06em !important;
    text-transform: uppercase !important;
    color: #666 !important;
    padding: 2pt 4pt !important;
    text-align: center !important;
    background: #fafafa !important;
  }
  .buffet-title {
    font-size: 12.5pt !important;
    font-weight: 900 !important;
    line-height: 1.15 !important;
    color: #000 !important;
  }
  .buffet-dose {
    font-size: 20pt !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    margin-top: 5pt !important;
    color: #000 !important;
  }
  .buffet-dose-sub {
    font-size: 8pt !important;
    font-weight: 600 !important;
    color: #333 !important;
    margin-top: 2pt !important;
  }
  .buffet-batch {
    font-size: 7.5pt !important;
    color: #555 !important;
    margin-top: 5pt !important;
  }
  .buffet-warn {
    font-size: 8.5pt !important;
    font-weight: 800 !important;
    line-height: 1.3 !important;
    margin-top: 6pt !important;
    color: #111 !important;
    max-width: 2.6in !important;
  }
  .buffet-brand {
    font-size: 6.5pt !important;
    letter-spacing: 0.04em !important;
    color: #777 !important;
    margin-top: 7pt !important;
  }
`;

function escapeHtmlForLabel(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buffetTentMarkup(
  escapedTitle: string,
  mgPerServing: number,
  servings: number,
  totalBatchMg: number
): string {
  const batchLine = `${servings} serving${servings === 1 ? "" : "s"} · ${totalBatchMg.toFixed(0)} mg total batch`;
  const dose = `${mgPerServing.toFixed(1)} mg`;
  const panel = `
    <div class="buffet-tent-panel">
      <div class="buffet-title">${escapedTitle}</div>
      <div class="buffet-dose">${dose}</div>
      <div class="buffet-dose-sub">THC per serving</div>
      <div class="buffet-batch">${batchLine}</div>
      <div class="buffet-warn">Infused food — contains cannabis. Eat wisely.</div>
      <div class="buffet-brand">Infusion Sensei</div>
    </div>`;
  return `
    <div class="buffet-tent">
      ${panel}
      <div class="buffet-fold">Fold here — same text on both sides</div>
      ${panel}
    </div>`;
}

/** Print: store-aisle order for quick shop */
const GROCERY_PRINT_SECTION_ORDER: string[] = [
  "Meat & proteins",
  "Dairy & eggs",
  "Produce & frozen",
  "Bakery & dry goods",
  "Pantry & sweet",
  "Spices & seasonings",
  "Beverages",
  "Infusion (plan separately)",
  "Other",
];

/** Persists guest count, slots, mg goal, and each dropdown so leaving for a recipe doesn’t reset picks. */
const PARTY_SNACKS_PLAN_KEY = "party-snacks-plan-v1";

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function loadPartySnacksPlan(): {
  guestCount: number;
  infusedSlotCount: number;
  mgPerPerson: number;
  infusedSelections: string[];
} | null {
  try {
    const raw = localStorage.getItem(PARTY_SNACKS_PLAN_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Record<string, unknown>;
    if (!p || typeof p !== "object") return null;
    const validIds = new Set(ALL_PARTY_SNACK_ITEMS.map((i) => i.id));
    const slotCount = clamp(Math.round(Number(p.infusedSlotCount)) || 2, 1, ALL_PARTY_SNACK_ITEMS.length);
    const rawSel = Array.isArray(p.infusedSelections) ? (p.infusedSelections as string[]) : [];
    const infusedSelections: string[] = [];
    for (let i = 0; i < slotCount; i++) {
      const id = rawSel[i];
      infusedSelections.push(id === EMPTY || validIds.has(id) ? id : EMPTY);
    }
    return {
      guestCount: clamp(Math.round(Number(p.guestCount)) || 8, 1, 500),
      infusedSlotCount: slotCount,
      mgPerPerson: Math.max(0, Number(p.mgPerPerson) || 10),
      infusedSelections,
    };
  } catch {
    return null;
  }
}

function loadGroceryMeasureMode(): GroceryMeasureMode {
  try {
    const s = localStorage.getItem(GROCERY_MODE_STORAGE_KEY);
    if (s === "metric" || s === "us") return s;
  } catch {
    /* ignore */
  }
  return "us";
}

function buildInitialSlots(count: number): string[] {
  const next = ALL_PARTY_SNACK_ITEMS.slice(0, Math.min(count, ALL_PARTY_SNACK_ITEMS.length)).map((i) => i.id);
  while (next.length < count) next.push(EMPTY);
  return next;
}

export function PartySnacks() {
  const savedPlan = typeof window !== "undefined" ? loadPartySnacksPlan() : null;
  const [guestCount, setGuestCount] = useState(savedPlan?.guestCount ?? 8);
  const [infusedSlotCount, setInfusedSlotCount] = useState(savedPlan?.infusedSlotCount ?? 2);
  const [mgPerPerson, setMgPerPerson] = useState(savedPlan?.mgPerPerson ?? 10);
  const [infusedSelections, setInfusedSelections] = useState<string[]>(
    () => savedPlan?.infusedSelections ?? buildInitialSlots(2)
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        PARTY_SNACKS_PLAN_KEY,
        JSON.stringify({
          guestCount,
          infusedSlotCount,
          mgPerPerson,
          infusedSelections,
        })
      );
    } catch {
      /* ignore */
    }
  }, [guestCount, infusedSlotCount, mgPerPerson, infusedSelections]);

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

  const snackNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const item of ALL_PARTY_SNACK_ITEMS) m.set(item.id, item.name);
    return m;
  }, []);

  const groceryData = useMemo(() => {
    if (uniqueInfusedIds.length === 0 || hasDuplicatePicks) return null;
    return buildPartySnackGrocery(standardRecipes, uniqueInfusedIds, guestCount);
  }, [uniqueInfusedIds, guestCount, hasDuplicatePicks]);

  const combinedByStoreSection = useMemo(() => {
    if (!groceryData?.combined.length) return [];
    const m = new Map<string, typeof groceryData.combined>();
    for (const line of groceryData.combined) {
      const sec = grocerySectionForIngredient(line.name);
      if (!m.has(sec)) m.set(sec, []);
      m.get(sec)!.push(line);
    }
    const bumpInfusionLast = (s: string) => (s.startsWith("Infusion") ? "\uFFFF" + s : s);
    return Array.from(m.entries())
      .sort(([a], [b]) => bumpInfusionLast(a).localeCompare(bumpInfusionLast(b)))
      .map(([section, lines]) => ({ section, lines }));
  }, [groceryData]);

  const combinedByStoreSectionPrintOrder = useMemo(() => {
    const rank = (s: string) => {
      const i = GROCERY_PRINT_SECTION_ORDER.indexOf(s);
      return i === -1 ? 999 : i;
    };
    return [...combinedByStoreSection].sort((a, b) => rank(a.section) - rank(b.section));
  }, [combinedByStoreSection]);

  const [groceryChecked, setGroceryChecked] = useState<Record<string, boolean>>({});
  const [groceryMeasureMode, setGroceryMeasureMode] = useState<GroceryMeasureMode>(() =>
    typeof window !== "undefined" ? loadGroceryMeasureMode() : "us"
  );

  useEffect(() => {
    try {
      localStorage.setItem(GROCERY_MODE_STORAGE_KEY, groceryMeasureMode);
    } catch {
      /* ignore */
    }
  }, [groceryMeasureMode]);

  const toggleGroceryLine = (key: string) => {
    setGroceryChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setSlot = (index: number, value: string) => {
    setInfusedSelections((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addSnackSlot = () => {
    if (infusedSlotCount >= ALL_PARTY_SNACK_ITEMS.length) return;
    syncSlotArray(infusedSlotCount + 1);
  };

  const removeSnackSlot = (index: number) => {
    if (infusedSelections.length <= 1) return;
    const next = infusedSelections.filter((_, i) => i !== index);
    setInfusedSelections(next);
    setInfusedSlotCount(next.length);
  };

  const builderLink = (recipeId: string, category: "snacks" | "wings" = "snacks") => {
    const params = new URLSearchParams({
      category,
      recipe: recipeId,
      servings: String(Math.max(1, guestCount)),
      targetMgPerServing: mgEachTarget > 0 ? mgEachTarget.toFixed(4) : "",
      from: "party-snacks",
    });
    if (!mgEachTarget || mgEachTarget <= 0) params.delete("targetMgPerServing");
    return `/ingredients?${params.toString()}`;
  };

  const showPrintSheet = uniqueInfusedIds.length > 0 && !hasDuplicatePicks;

  const printSnackLabels = () => {
    if (!showPrintSheet) return;
    const labelRows = uniqueInfusedIds
      .map((id) => {
        const title = snackNameById.get(id) ?? id;
        const totalThc = mgEachTarget * guestCount;
        return buffetTentMarkup(escapeHtmlForLabel(title), mgEachTarget, guestCount, totalThc);
      })
      .join("");

    const popup = window.open("", "_blank", "width=980,height=760");
    if (!popup) return;
    popup.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>Buffet tent labels — Party snacks</title>
          <style>
            @page { margin: 0.5in 0.75in; size: letter; }
            body { margin: 0; color: #111; background: #fff; }
            ${BUFFET_TENT_LABEL_CSS}
          </style>
        </head>
        <body>
          <div class="print-buffet-sheet">
            <p class="print-buffet-intro">
              Cut out each card along the border, fold on the dashed line so both sides show the same message, and place at the buffet.
            </p>
            <div class="print-buffet-grid">${labelRows}</div>
          </div>
          <script>
            window.onload = function () {
              window.print();
              window.onafterprint = function () { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    popup.document.close();
  };

  return (
    <>
      <div className="app-print-hide max-w-6xl mx-auto space-y-8">
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
              max={ALL_PARTY_SNACK_ITEMS.length}
              value={infusedSlotCount}
              onChange={(e) => {
                const n = Math.min(ALL_PARTY_SNACK_ITEMS.length, Math.max(1, Number(e.target.value) || 1));
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
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold text-gray-800">Choose each infused snack</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSnackSlot}
              disabled={infusedSlotCount >= ALL_PARTY_SNACK_ITEMS.length}
              className="font-semibold"
            >
              + Add snack
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {infusedSelections.map((val, idx) => (
              <div key={idx} className="flex flex-col gap-1 rounded-xl border border-gray-200 p-3 bg-gray-50">
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs text-gray-500">Infused item {idx + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSnackSlot(idx)}
                    disabled={infusedSelections.length <= 1}
                    className="h-7 px-2 text-xs text-gray-600 hover:text-gray-900"
                  >
                    Remove
                  </Button>
                </div>
                <Select value={val} onValueChange={(v) => setSlot(idx, v)}>
                  <SelectTrigger className="w-full bg-white">
                    <SelectValue placeholder="Select snack…" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-xl">
                    <SelectItem value={EMPTY}>— Select —</SelectItem>
                    {SNACK_GROUPS.map((group) => (
                      <SelectGroup key={group.title}>
                        <SelectLabel className="text-xs font-bold text-gray-600 px-2 py-1.5">{group.title}</SelectLabel>
                        {group.items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.emoji} {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
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
                Recipes open with <span className="font-semibold">{guestCount}</span> servings (one portion per guest for that
                treat). All ingredients scale together from the template batch size. Infused amounts are then adjusted toward
                your mg-per-piece target (based on your saved infusion THC/units).
              </p>
            </>
          )}
        </div>
      </section>

      <section
        id="party-snacks-grocery"
        className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListChecks className="w-7 h-7 text-indigo-600" />
            <div>
              <h2 className="text-2xl font-black text-gray-900">Grocery list</h2>
              <p className="text-sm text-gray-600">
                Totals scale to <span className="font-semibold">{guestCount} guests</span> (one portion per guest per infused
                snack). Matches the recipe builder batch math — adjust in the builder after you set THC.
              </p>
              <p className="text-xs text-gray-500 mt-1 max-w-xl">
                Choose how amounts are shown: <strong>US</strong> uses cups / tablespoons / fl oz where it helps (densities are
                typical — not every brand matches). <strong>Metric</strong> uses grams and milliliters from the same scaled
                batch math.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end items-center app-print-hide">
            {groceryData && (
              <>
                <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 shadow-sm" role="group" aria-label="Grocery amount units">
                  <button
                    type="button"
                    onClick={() => setGroceryMeasureMode("us")}
                    className={`px-3 py-2 text-xs font-bold rounded-md transition-colors ${
                      groceryMeasureMode === "us" ? "bg-white text-indigo-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    US (cups & spoons)
                  </button>
                  <button
                    type="button"
                    onClick={() => setGroceryMeasureMode("metric")}
                    className={`px-3 py-2 text-xs font-bold rounded-md transition-colors ${
                      groceryMeasureMode === "metric" ? "bg-white text-indigo-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Metric (g & ml)
                  </button>
                </div>
                <Button type="button" variant="outline" className="font-bold gap-2" onClick={() => window.print()}>
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </Button>
                <Button type="button" variant="outline" className="font-bold gap-2 border-purple-300 text-purple-700 hover:bg-purple-50" onClick={printSnackLabels}>
                  <Printer className="w-4 h-4" /> Print Labels
                </Button>
                <Link to="/party-mode">
                  <Button type="button" variant="outline" className="font-bold gap-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50">
                    Party Planner <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {!uniqueInfusedIds.length ? (
          <p className="text-sm text-gray-500">Pick at least one infused snack above to generate a shopping list.</p>
        ) : hasDuplicatePicks ? (
          <p className="text-sm text-amber-800 font-semibold">Fix duplicate snack picks to show a combined grocery list.</p>
        ) : !groceryData?.sections.length ? (
          <p className="text-sm text-gray-500">Could not load templates for the selected snacks.</p>
        ) : (
          <>
            <div className="rounded-xl border border-indigo-100 bg-indigo-50/80 p-4 space-y-3">
              <p className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Combined shopping (deduplicated)</p>
              <p className="text-xs text-indigo-800">
                If the same ingredient appears in multiple snacks, amounts are added. Buy cannabutter, coconut oil, or tincture using
                your builder targets — not only these gram totals. <strong>Store:</strong> lines below translate into typical
                boxes (12 oz cereal), 10 oz marshmallow bags, butter sticks, etc. — round up at the store.
              </p>
              <div className="space-y-4">
                {combinedByStoreSection.map(({ section, lines }) => (
                  <div key={section}>
                    <p className="text-xs font-black text-gray-700 mb-2">{section}</p>
                    <ul className="space-y-1.5">
                      {lines.map((line) => {
                        const key = line.name;
                        return (
                          <li key={`${line.name}|${line.unit}`} className="flex items-start gap-2 text-sm text-gray-800">
                            <input
                              type="checkbox"
                              checked={!!groceryChecked[key]}
                              onChange={() => toggleGroceryLine(key)}
                              className="mt-1 rounded border-gray-300 app-print-hide shrink-0"
                              aria-label={`Got ${line.name}`}
                            />
                            <span className="flex flex-col gap-0.5">
                              <span>
                                <span className="font-semibold">{groceryLineDisplay(line, groceryMeasureMode)}</span>{" "}
                                {line.name}
                              </span>
                              {line.storeHint && (
                                <span className="text-xs text-gray-500 pl-0 leading-snug">
                                  {line.storeHint}
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-black text-gray-900">By recipe (for prep)</p>
              <div className="grid gap-3 md:grid-cols-2">
                {groceryData.sections.map((sec) => (
                  <div
                    key={sec.recipeId}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-2"
                  >
                    <p className="font-black text-gray-900 text-sm">
                      {snackNameById.get(sec.recipeId) ?? sec.recipeName}
                    </p>
                    <ul className="text-xs text-gray-700 space-y-1">
                      {sec.lines.map((line) => (
                        <li key={`${sec.recipeId}-${line.name}-${line.unit}`} className="space-y-0.5">
                          <div>
                            <span className="font-semibold text-gray-900">
                              {groceryLineDisplay(line, groceryMeasureMode)}
                            </span>{" "}
                            {line.name}
                          </div>
                          {line.storeHint && (
                            <p className="text-[11px] text-gray-500 leading-snug pl-0">{line.storeHint}</p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-black text-gray-900">Snack reference</h3>
        {SNACK_GROUPS.map((group) => (
          <div key={group.title} className="space-y-3">
            <p className="text-sm font-black text-indigo-900 border-b border-indigo-100 pb-1">{group.title}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {group.items.map((item) => {
                const picked = uniqueInfusedIds.includes(item.id);
                const cat = item.builderCategory ?? "snacks";
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
                    {cat === "wings" && (
                      <p className="text-xs text-amber-800 mt-1 font-semibold">Opens in Wings builder (buffalo base).</p>
                    )}
                    <div className="mt-3">
                      {picked && allSlotsChosen ? (
                        <Link to={builderLink(item.id, cat)}>
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
          </div>
        ))}
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

      {showPrintSheet && (
        <>
          <style>{`
            @media print {
              .snacks-print-root { font-size: 11pt !important; color: #000 !important; }
              .snacks-print-quick li { font-size: 13pt !important; line-height: 1.45 !important; margin: 0.35em 0 !important; }
              .snacks-print-break { break-before: page !important; page-break-before: always !important; }
              ${BUFFET_TENT_LABEL_CSS}
            }
          `}</style>
          <div
            className="snacks-print-only snacks-print-root text-black max-w-4xl mx-auto"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {/* Page 1 — quick shop only */}
            <header className="border-b-2 border-black pb-3 mb-4">
              <h1 className="text-2xl font-black">Party snacks — quick shop</h1>
              <p className="text-sm mt-1">
                {guestCount} guests · ~{mgEachTarget.toFixed(1)} mg THC per portion per snack · Infusion Sensei
              </p>
            </header>

            {groceryData && combinedByStoreSectionPrintOrder.length > 0 && (
              <section className="mb-2">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-700 mb-2">
                  Grab these at the store (short list — check boxes in the app for detail)
                </p>
                {combinedByStoreSectionPrintOrder.map(({ section, lines }) => (
                  <div key={`print-q-${section}`} className="mb-4">
                    <p className="text-sm font-black border-b border-gray-400 mb-2">{section}</p>
                    <ul className="snacks-print-quick list-none pl-0 space-y-0">
                      {lines.map((line) => (
                        <li key={`${line.name}|${line.unit}|${section}|q`} className="flex gap-2">
                          <span className="shrink-0 w-4">□</span>
                          <span>{formatQuickShopLine(line)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {/* Labels — new page (same table-tent layout as recipe builder buffet print) */}
            <section className="snacks-print-break mt-8 pt-4">
              <div className="print-buffet-sheet">
                <p className="print-buffet-intro">
                  Cut out each card along the border, fold on the dashed line so both sides show the same message, and place
                  at the buffet.
                </p>
                <div className="print-buffet-grid">
                  {uniqueInfusedIds.map((id) => {
                    const title = snackNameById.get(id) ?? id;
                    const totalBatchMg = mgEachTarget * guestCount;
                    return (
                      <div key={`snack-label-${id}`} className="buffet-tent">
                        <div className="buffet-tent-panel">
                          <div className="buffet-title">{title}</div>
                          <div className="buffet-dose">{mgEachTarget.toFixed(1)} mg</div>
                          <div className="buffet-dose-sub">THC per serving</div>
                          <div className="buffet-batch">
                            {guestCount} serving{guestCount === 1 ? "" : "s"} · {totalBatchMg.toFixed(0)} mg total batch
                          </div>
                          <div className="buffet-warn">Infused food — contains cannabis. Eat wisely.</div>
                          <div className="buffet-brand">Infusion Sensei</div>
                        </div>
                        <div className="buffet-fold">Fold here — same text on both sides</div>
                        <div className="buffet-tent-panel">
                          <div className="buffet-title">{title}</div>
                          <div className="buffet-dose">{mgEachTarget.toFixed(1)} mg</div>
                          <div className="buffet-dose-sub">THC per serving</div>
                          <div className="buffet-batch">
                            {guestCount} serving{guestCount === 1 ? "" : "s"} · {totalBatchMg.toFixed(0)} mg total batch
                          </div>
                          <div className="buffet-warn">Infused food — contains cannabis. Eat wisely.</div>
                          <div className="buffet-brand">Infusion Sensei</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Prep instructions — new page */}
            <section className="snacks-print-break mt-8 pt-4">
              <h2 className="text-xl font-black border-b-2 border-black pb-2 mb-3">Kitchen prep (from templates)</h2>
              <p className="text-xs text-gray-700 mb-4">
                Builder scales amounts to your guest count; follow infusion steps in the app for exact THC in butter/oil.
              </p>
              <div className="space-y-6">
                {uniqueInfusedIds.map((id) => {
                  const tpl = getStandardRecipeById(standardRecipes, id);
                  if (!tpl?.instructions?.length) {
                    return (
                      <div key={`inst-${id}`}>
                        <p className="font-black text-sm">{snackNameById.get(id) ?? id}</p>
                        <p className="text-sm text-gray-700">Open this snack in the recipe builder for full steps.</p>
                      </div>
                    );
                  }
                  return (
                    <div key={`inst-${id}`} className="break-inside-avoid">
                      <p className="font-black text-base border-b border-gray-400 pb-1 mb-2">{tpl.name}</p>
                      <ol className="list-decimal pl-5 text-sm space-y-1.5">
                        {tpl.instructions.map((step, idx) => (
                          <li key={`${id}-step-${idx}`}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  );
                })}
              </div>
            </section>

            <p className="text-xs text-center mt-8 text-gray-600">Infusion Sensei · infusionsensei.com</p>
          </div>
        </>
      )}
    </>
  );
}
