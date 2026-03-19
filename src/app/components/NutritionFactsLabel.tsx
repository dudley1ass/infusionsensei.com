import { Separator } from "./ui/separator";

interface NutritionFactsProps {
  servings: number;
  servingSize?: string;
  thcPerServing: number;
  caloriesPerServing: number;
  proteinPerServing: number;
  carbsPerServing: number;
  fatPerServing: number;
  fiberPerServing?: number;
  sugarPerServing?: number;
  sodiumPerServing?: number;
  saturatedFatPerServing?: number;
  transFatPerServing?: number;
  cholesterolPerServing?: number;
  potassiumPerServing?: number;
  calciumPerServing?: number;
  ironPerServing?: number;
  vitaminAPerServing?: number;
  vitaminCPerServing?: number;
  addedSugarPerServing?: number;
}

function NutritionRow({ label, amount, dv }: { label: string; amount: string; dv?: number }) {
  return (
    <div className="flex justify-between border-b border-gray-400 py-1">
      <span className="font-bold">{label} <span className="font-normal">{amount}</span></span>
      {dv !== undefined && <span className="font-bold">{dv.toFixed(0)}%</span>}
    </div>
  );
}

function NutritionSubRow({ label, amount, dv }: { label: string; amount: string; dv?: number }) {
  return (
    <div className="flex justify-between border-b border-gray-300 py-1 pl-5">
      <span>{label} {amount}</span>
      {dv !== undefined && <span className="font-bold">{dv.toFixed(0)}%</span>}
    </div>
  );
}

export function NutritionFactsLabel({
  servings,
  servingSize = "1 piece",
  thcPerServing,
  caloriesPerServing,
  proteinPerServing,
  carbsPerServing,
  fatPerServing,
  fiberPerServing = 0,
  sugarPerServing = 0,
  sodiumPerServing = 0,
  saturatedFatPerServing = 0,
  transFatPerServing = 0,
  cholesterolPerServing = 0,
  potassiumPerServing = 0,
  calciumPerServing = 0,
  ironPerServing = 0,
  vitaminAPerServing = 0,
  vitaminCPerServing = 0,
  addedSugarPerServing = 0,
}: NutritionFactsProps) {

  const fatDV          = (fatPerServing / 78) * 100;
  const saturatedFatDV = (saturatedFatPerServing / 20) * 100;
  const cholesterolDV  = (cholesterolPerServing / 300) * 100;
  const carbsDV        = (carbsPerServing / 275) * 100;
  const fiberDV        = (fiberPerServing / 28) * 100;
  const proteinDV      = (proteinPerServing / 50) * 100;
  const sodiumDV       = (sodiumPerServing / 2300) * 100;
  const potassiumDV    = (potassiumPerServing / 4700) * 100;
  const calciumDV      = (calciumPerServing / 1300) * 100;
  const ironDV         = (ironPerServing / 18) * 100;
  const vitaminADV     = (vitaminAPerServing / 900) * 100;
  const vitaminCDV     = (vitaminCPerServing / 90) * 100;
  const unsaturatedFat = Math.max(0, fatPerServing - saturatedFatPerServing - transFatPerServing);
  const starchCarbs    = Math.max(0, carbsPerServing - fiberPerServing - sugarPerServing);

  return (
    <div className="bg-white text-black border-2 border-black p-4 max-w-sm w-full text-sm">

      <div className="border-b-8 border-black pb-1 mb-1">
        <h2 className="text-3xl font-black">Nutrition Facts</h2>
      </div>

      <div className="border-b-4 border-black py-1 text-sm">
        <div>Servings per container: <span className="font-bold">{servings}</span></div>
        <div className="font-bold text-base flex justify-between">
          <span>Serving size</span>
          <span>{servingSize}</span>
        </div>
      </div>

      {/* THC Section */}
      <div className="border-b-4 border-black py-2">
        <div className="bg-green-50 border-2 border-green-600 rounded-lg p-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-green-800 uppercase tracking-wide">⚠️ THC Content</div>
              <div className="text-2xl font-black text-green-900">{thcPerServing.toFixed(1)} mg</div>
              <div className="text-xs text-green-700">per serving</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-700">Total recipe</div>
              <div className="font-black text-green-900 text-lg">{(thcPerServing * servings).toFixed(1)} mg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calories */}
      <div className="border-b-8 border-black py-2">
        <div className="text-xs font-bold">Amount per serving</div>
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-black">Calories</span>
          <span className="text-4xl font-black">{caloriesPerServing.toFixed(0)}</span>
        </div>
      </div>

      <div className="border-b border-black py-1 text-right text-sm">
        <span className="font-bold">% Daily Value*</span>
      </div>

      <div className="text-sm">
        <NutritionRow    label="Total Fat"          amount={`${fatPerServing.toFixed(1)}g`}          dv={fatDV} />
        <NutritionSubRow label="Saturated Fat"      amount={`${saturatedFatPerServing.toFixed(1)}g`} dv={saturatedFatDV} />
        <NutritionSubRow label="Trans Fat"          amount={`${transFatPerServing.toFixed(1)}g`} />
        <NutritionSubRow label="Unsaturated Fat"    amount={`${unsaturatedFat.toFixed(1)}g`} />
        <NutritionSubRow label="Cholesterol"        amount={`${cholesterolPerServing.toFixed(0)}mg`} dv={cholesterolDV} />
        <NutritionRow    label="Sodium"             amount={`${sodiumPerServing.toFixed(0)}mg`}       dv={sodiumDV} />
        <NutritionRow    label="Total Carbohydrate" amount={`${carbsPerServing.toFixed(1)}g`}         dv={carbsDV} />
        <NutritionSubRow label="Dietary Fiber"      amount={`${fiberPerServing.toFixed(1)}g`}         dv={fiberDV} />
        <NutritionSubRow label="Total Sugars"       amount={`${sugarPerServing.toFixed(1)}g`} />
        {addedSugarPerServing > 0 && (
          <NutritionSubRow label="Added Sugars"     amount={`${addedSugarPerServing.toFixed(1)}g`} />
        )}
        <NutritionSubRow label="Starch & Other"     amount={`${starchCarbs.toFixed(1)}g`} />
        <div className="border-b-8 border-black">
          <NutritionRow  label="Protein"            amount={`${proteinPerServing.toFixed(1)}g`}       dv={proteinDV} />
        </div>
        {potassiumPerServing > 0 && <NutritionRow label="Potassium" amount={`${potassiumPerServing.toFixed(0)}mg`} dv={potassiumDV} />}
        {calciumPerServing   > 0 && <NutritionRow label="Calcium"   amount={`${calciumPerServing.toFixed(0)}mg`}   dv={calciumDV} />}
        {ironPerServing      > 0 && <NutritionRow label="Iron"       amount={`${ironPerServing.toFixed(1)}mg`}      dv={ironDV} />}
        {vitaminAPerServing  > 0 && <NutritionRow label="Vitamin A"  amount={`${vitaminAPerServing.toFixed(0)}IU`}  dv={vitaminADV} />}
        {vitaminCPerServing  > 0 && <NutritionRow label="Vitamin C"  amount={`${vitaminCPerServing.toFixed(0)}mg`}  dv={vitaminCDV} />}
      </div>

      <div className="border-t-8 border-black mt-2 pt-2 text-xs">
        *The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
      </div>

      <div className="mt-3 bg-yellow-50 border-2 border-yellow-500 rounded-lg p-2 text-xs">
        <p className="font-bold text-yellow-900">
          ⚠️ CANNABIS PRODUCT — Adults 21+ only. Keep away from children and pets.
          Start low, go slow — wait 90–120 min before consuming more.
        </p>
      </div>
    </div>
  );
}

// ── Compact version for sidebars / cards ──────────────────────
export function NutritionFactsCompact({
  servings,
  thcPerServing,
  caloriesPerServing,
  proteinPerServing,
  carbsPerServing,
  fatPerServing,
  sodiumPerServing = 0,
  sugarPerServing = 0,
}: NutritionFactsProps) {
  return (
    <div className="bg-gray-900/50 border border-green-700/30 rounded-lg p-4 space-y-3">
      <div className="text-center">
        <h3 className="text-lg font-bold text-white mb-1">Nutrition Facts</h3>
        <p className="text-xs text-gray-400">Per Serving · Makes {servings}</p>
      </div>
      <Separator className="bg-green-700/30" />
      <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-3 text-center">
        <div className="text-xs text-green-400 font-semibold mb-1 uppercase tracking-wide">THC Content</div>
        <div className="text-3xl font-bold text-green-400">{thcPerServing.toFixed(1)} mg</div>
        <div className="text-xs text-gray-400 mt-1">{(thcPerServing * servings).toFixed(1)} mg total recipe</div>
      </div>
      <Separator className="bg-green-700/30" />
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Calories", value: caloriesPerServing.toFixed(0), unit: "kcal" },
          { label: "Protein",  value: proteinPerServing.toFixed(1),  unit: "g" },
          { label: "Carbs",    value: carbsPerServing.toFixed(1),     unit: "g" },
          { label: "Fat",      value: fatPerServing.toFixed(1),       unit: "g" },
          { label: "Sugar",    value: sugarPerServing.toFixed(1),     unit: "g" },
          { label: "Sodium",   value: sodiumPerServing.toFixed(0),    unit: "mg" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="bg-gray-800/50 p-2 rounded-lg text-center">
            <div className="text-xs text-gray-400">{label}</div>
            <div className="text-lg font-bold text-white">
              {value}<span className="text-xs text-gray-400 ml-0.5">{unit}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-lg p-2">
        <p className="text-xs text-yellow-400 text-center">
          ⚠️ Start with {thcPerServing < 5 ? "half a" : "one"} serving if new to edibles. Wait 90–120 min before more.
        </p>
      </div>
    </div>
  );
}
