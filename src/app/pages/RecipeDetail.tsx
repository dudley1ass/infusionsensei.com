import { useParams, Link } from "react-router";
import { getRecipeById } from "../data/recipes";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, Clock, ChefHat, Leaf, AlertCircle, CheckCircle2, Lightbulb, Printer, Flame, Users } from "lucide-react";

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipe = id ? getRecipeById(id) : undefined;

  const handlePrint = () => window.print();

  if (!recipe) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🍃</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recipe not found</h2>
        <p className="text-gray-500 mb-6">This recipe may have moved or doesn't exist.</p>
        <Link to="/recipes">
          <Button className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Recipes
          </Button>
        </Link>
      </div>
    );
  }

  const difficultyConfig = {
    beginner:     { color: "bg-green-100 text-green-800 border-green-200",  dot: "bg-green-500" },
    intermediate: { color: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500" },
    advanced:     { color: "bg-red-100 text-red-800 border-red-200",       dot: "bg-red-500" },
  };
  const diff = difficultyConfig[recipe.difficulty] ?? difficultyConfig.beginner;

  return (
    <>
      {/* ── PRINT STYLES ──────────────────────────────────── */}
      <style>{`
        @media print {
          header, footer, nav, .no-print { display: none !important; }
          .print-page { background: white !important; color: black !important; padding: 0 !important; }
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          a { text-decoration: none; color: black; }
        }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-8 print-page">

        {/* ── TOP BAR ─────────────────────────────────────── */}
        <div className="flex items-center justify-between no-print">
          <Link to="/recipes">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Recipes
            </Button>
          </Link>
          <Button onClick={handlePrint} variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 gap-2">
            <Printer className="w-4 h-4" /> Print Recipe
          </Button>
        </div>

        {/* ── HERO ────────────────────────────────────────── */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl h-72 md:h-96">
          <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${diff.color}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                {recipe.difficulty}
              </span>
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/30 capitalize">
                {recipe.category}
              </span>
              {recipe.isNew && (
                <span className="bg-green-500 text-white text-xs font-black px-3 py-1 rounded-full">✨ NEW</span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{recipe.name}</h1>
          </div>
        </div>

        {/* ── STATS BAR ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: <Clock className="w-5 h-5 text-blue-500" />,  label: "Total Time",   value: `${recipe.prepTime + recipe.cookTime} min`,  bg: "bg-blue-50 border-blue-100" },
            { icon: <Users className="w-5 h-5 text-purple-500" />, label: "Servings",    value: recipe.servings.toString(),                   bg: "bg-purple-50 border-purple-100" },
            { icon: <Leaf className="w-5 h-5 text-green-600" />,   label: "THC/Serving", value: recipe.thcPerServing,                         bg: "bg-green-50 border-green-200" },
            { icon: <Flame className="w-5 h-5 text-orange-500" />, label: "Prep Time",   value: `${recipe.prepTime} min`,                     bg: "bg-orange-50 border-orange-100" },
          ].map(({ icon, label, value, bg }) => (
            <div key={label} className={`${bg} border rounded-2xl p-4 text-center`}>
              <div className="flex justify-center mb-1">{icon}</div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="font-black text-gray-900 text-lg leading-tight">{value}</p>
            </div>
          ))}
        </div>

        {/* ── DESCRIPTION ─────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-gray-700 text-lg leading-relaxed">{recipe.description}</p>
        </div>

        {/* ── STRAIN REC ──────────────────────────────────── */}
        {recipe.strainRecommendation && (
          <div className="bg-gradient-to-r from-purple-50 to-green-50 border border-purple-200 rounded-2xl p-5 flex items-start gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <Leaf className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-purple-900 mb-1">Strain Recommendation</p>
              <p className="text-gray-700 text-sm">{recipe.strainRecommendation}</p>
            </div>
          </div>
        )}

        {/* ── INGREDIENTS + INSTRUCTIONS ──────────────────── */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Ingredients */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-full">
              <div className="bg-green-600 px-6 py-4">
                <h2 className="text-white font-black text-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Ingredients
                </h2>
                <p className="text-green-200 text-sm mt-0.5">For {recipe.servings} servings</p>
              </div>
              <ul className="divide-y divide-gray-100">
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i} className="flex items-start gap-3 px-5 py-3.5 hover:bg-green-50/50 transition-colors">
                    <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                    <span className="text-gray-800 text-sm leading-relaxed">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-full">
              <div className="bg-gray-900 px-6 py-4">
                <h2 className="text-white font-black text-xl flex items-center gap-2">
                  <ChefHat className="w-5 h-5" /> Instructions
                </h2>
                <p className="text-gray-400 text-sm mt-0.5">{recipe.instructions.length} steps</p>
              </div>
              <ol className="divide-y divide-gray-100">
                {recipe.instructions.map((step, i) => (
                  <li key={i} className="flex gap-4 px-5 py-4 hover:bg-gray-50/70 transition-colors">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white font-black text-sm">{i + 1}</span>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed pt-1">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* ── TIPS ────────────────────────────────────────── */}
        {recipe.tips && recipe.tips.length > 0 && (
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-amber-200 flex items-center gap-3">
              <div className="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-black text-amber-900 text-xl">Pro Tips</h2>
                <p className="text-amber-700 text-xs">From our cannabis kitchen experts</p>
              </div>
            </div>
            <ul className="divide-y divide-amber-100">
              {recipe.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 px-6 py-3.5">
                  <span className="text-amber-500 font-black text-lg leading-tight flex-shrink-0">🔥</span>
                  <span className="text-gray-800 text-sm leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── PRINT BUTTON (bottom) ───────────────────────── */}
        <div className="flex gap-4 justify-center no-print">
          <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-6 text-base gap-2 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Printer className="w-5 h-5" /> Print This Recipe
          </Button>
          <Link to="/infusions">
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 font-bold px-8 py-6 text-base rounded-xl">
              Calculate My THC Dose →
            </Button>
          </Link>
        </div>

        {/* ── SAFETY ──────────────────────────────────────── */}
        <div className="bg-red-50 border border-red-200 rounded-2xl px-5 py-4 flex gap-3 items-start no-print">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-800">
            <strong>Safety:</strong> Edibles take 30–120 minutes to take effect. Start with a low dose and wait at least 2 hours before consuming more. Store safely away from children and pets. Do not drive or operate machinery after consuming.
          </p>
        </div>

      </div>
    </>
  );
}
