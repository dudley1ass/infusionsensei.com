import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router";
import { getRecipeById, ingredientsBuilderPathForRecipeId, Recipe } from "../data/recipes";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { ArrowLeft, ArrowRight, Clock, ChefHat, Leaf, AlertCircle, CheckCircle2, Lightbulb, Printer, Flame, Users } from "lucide-react";
import { loadRecipeByIdFromDb } from "../services/contentService";
import { Helmet } from "react-helmet-async";
import { trackEvent } from "../utils/analytics";
import { cleanRecipeDisplayTitle } from "../utils/recipeDisplayTitle";

export function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const fallbackRecipe = id ? getRecipeById(id) : undefined;
  const [recipe, setRecipe] = useState<Recipe | undefined>(fallbackRecipe);
  const trackedRecipeIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) return;
    (async () => {
      const fromDb = await loadRecipeByIdFromDb(id);
      if (!cancelled && fromDb) setRecipe(fromDb);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!recipe?.id) return;
    if (trackedRecipeIdRef.current === recipe.id) return;
    trackedRecipeIdRef.current = recipe.id;
    trackEvent("recipe_opened", {
      recipe_id: recipe.id,
      category: recipe.category,
      source: "recipe_detail",
    });
  }, [recipe]);

  const handlePrint = () => window.print();

  const getBuilderLinkForRecipe = (r: Recipe) => {
    const explicitMap: Record<string, { category: string; recipe: string }> = {
      "cannabis-tea": { category: "drinks", recipe: "cannabis-tea" },
      "cannabis-smoothie": { category: "drinks", recipe: "cannabis-smoothie" },
      "infused-protein-smoothie": { category: "drinks", recipe: "cannabis-smoothie" },
      "infused-mac-and-cheese": { category: "savory-meals", recipe: "alfredo" },
      "infused-pizza-sauce": { category: "savory-meals", recipe: "garlic-pasta" },
      "infused-mint-ice-cream": { category: "ice-cream", recipe: "mint-ice-cream" },
      "classic-cannabutter": { category: "baked-goods", recipe: "brownies" },
      "cannabis-oil": { category: "drinks", recipe: "bulletproof-coffee" },
      "canna-honey": { category: "drinks", recipe: "cannabis-tea" },
    };

    const mapped = explicitMap[r.id];
    if (mapped) {
      return `/ingredients?category=${encodeURIComponent(mapped.category)}&recipe=${encodeURIComponent(mapped.recipe)}`;
    }

    const fromTemplate = ingredientsBuilderPathForRecipeId(r.id);
    if (fromTemplate) return fromTemplate;

    return `/ingredients?category=baked-goods&recipe=brownies`;
  };

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
  const canonicalUrl = `https://infusionsensei.com/recipes/${recipe.id}`;
  const recipeSeo: Record<string, { title: string; description: string }> = {
    brownies: {
      title: "THC Brownies Recipe (Perfect Dosage Per Serving)",
      description: "Make THC brownies with predictable potency using exact mg-per-serving math and dosing-friendly portion steps.",
    },
    "chocolate-chip-cookies": {
      title: "THC Chocolate Chip Cookies (Soft, Chewy, Precise Dosing)",
      description: "Bake THC chocolate chip cookies with clear potency math so each cookie lands near your target dose.",
    },
    "sugar-cookies": {
      title: "THC Sugar Cookies (Cut-Outs & Precise Dosing)",
      description: "Bake THC sugar cookies with predictable mg per cookie, chill-and-roll tips, and clean decorating steps.",
    },
    gummies: {
      title: "THC Gummies Recipe (Accurate mg Per Piece Guide)",
      description: "Make consistent THC gummies with clear potency steps, safer serving guidance, and exact mg-per-piece control.",
    },
    "popcorn-balls": {
      title: "THC Popcorn Recipe (Easy, Light, Controlled Dosing)",
      description: "Make infused popcorn with easy batch dosing and consistent per-serving THC estimates for snackable control.",
    },
    "caramel-popcorn": {
      title: "THC Caramel Popcorn (Controlled Dosing Per Serving)",
      description: "Bake infused caramel popcorn with predictable dosing and simple mg-per-serving planning for party snacks.",
    },
  };
  const displayName = cleanRecipeDisplayTitle(recipe.name);
  const pageTitle = recipeSeo[recipe.id]?.title ?? `${displayName} | Infusion Sensei`;
  const pageDescription = recipeSeo[recipe.id]?.description ?? recipe.description;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
      </Helmet>
      {/* ── PRINT STYLES ──────────────────────────────────── */}
      <style>{`
        .print-only { display: none !important; }

        @media print {
          header, footer, nav, .no-print { display: none !important; }
          .screen-only { display: none !important; }
          .print-only { display: block !important; }

          body, html {
            background: white !important;
            color: black !important;
            font-family: Georgia, serif !important;
            font-size: 11pt !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .print-page {
            max-width: 100% !important;
            padding: 0.5in 0.75in !important;
          }
          .print-title { font-size: 26pt !important; font-weight: 900 !important; border-bottom: 3px solid black !important; padding-bottom: 6pt !important; margin-bottom: 6pt !important; }
          .print-cannabis-notice { font-size: 9.5pt !important; font-weight: 600 !important; color: #111 !important; margin-bottom: 10pt !important; line-height: 1.35 !important; }
          .print-meta { font-size: 9.5pt !important; color: #555 !important; margin-bottom: 14pt !important; }
          .print-thc-box { border: 2px solid black !important; padding: 10pt 14pt !important; margin-bottom: 14pt !important; background: #f8f8f8 !important; display: flex !important; gap: 24pt !important; flex-wrap: wrap !important; page-break-inside: avoid !important; break-inside: avoid !important; }
          .print-big-num { font-size: 26pt !important; font-weight: 900 !important; line-height: 1 !important; }
          .print-small-label { font-size: 9pt !important; color: #444 !important; margin-top: 2pt !important; }
          .print-divider { border-left: 1.5px solid #ccc !important; padding-left: 20pt !important; }
          .print-section { font-size: 12pt !important; font-weight: 700 !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; border-bottom: 1pt solid #ccc !important; padding-bottom: 3pt !important; margin: 14pt 0 8pt 0 !important; page-break-after: avoid !important; break-after: avoid !important; }
          .print-ingredient { display: flex !important; gap: 8pt !important; padding: 3pt 0 !important; border-bottom: 0.5pt solid #eee !important; font-size: 10.5pt !important; page-break-inside: avoid !important; break-inside: avoid !important; }
          .print-ingredient-amount { min-width: 80pt !important; font-weight: 600 !important; }
          .print-step { display: flex !important; gap: 10pt !important; margin-bottom: 8pt !important; font-size: 10.5pt !important; line-height: 1.5 !important; page-break-inside: avoid !important; break-inside: avoid !important; }
          .print-step-num { width: 18pt !important; height: 18pt !important; border: 1.5px solid black !important; border-radius: 50% !important; display: flex !important; align-items: center !important; justify-content: center !important; font-weight: 700 !important; font-size: 9pt !important; flex-shrink: 0 !important; margin-top: 1pt !important; }
          .print-tip { font-size: 9.5pt !important; padding: 2pt 0 !important; border-bottom: 0.5pt solid #eee !important; page-break-inside: avoid !important; break-inside: avoid !important; }
          .print-safety { font-size: 9pt !important; color: #333 !important; line-height: 1.6 !important; border: 1pt solid #ccc !important; padding: 8pt !important; margin-top: 14pt !important; page-break-inside: avoid !important; break-inside: avoid !important; }
          .print-footer { margin-top: 16pt !important; padding-top: 6pt !important; border-top: 1pt solid #ccc !important; font-size: 8pt !important; color: #888 !important; text-align: center !important; page-break-inside: avoid !important; break-inside: avoid !important; }
          @page { margin: 0.5in 0.75in; size: letter; }
        }
      `}</style>

      {/* ── PRINT-ONLY KITCHEN RECIPE ───────────────────── */}
      <div className="print-only">
        <div className="print-page">
          <div className="print-title">{recipe.name}</div>
          <p className="print-cannabis-notice">
            Cannabis-infused recipe — contains THC. For adults 21+ only; dose responsibly.
          </p>
          <div className="print-meta">
            {recipe.servings} servings &nbsp;·&nbsp; {recipe.prepTime + recipe.cookTime} min total &nbsp;·&nbsp; {recipe.difficulty} &nbsp;·&nbsp; {recipe.category}
          </div>

          {/* THC box */}
          <div className="print-thc-box">
            <div>
              <div className="print-big-num">{recipe.thcPerServing}</div>
              <div className="print-small-label">THC per serving</div>
            </div>
            <div className="print-divider">
              <div style={{fontSize:"13pt", fontWeight:"700"}}>{recipe.servings} servings</div>
              <div className="print-small-label">total in recipe</div>
            </div>
            <div className="print-divider">
              <div style={{fontSize:"10pt", fontWeight:"600"}}>{recipe.difficulty.toUpperCase()}</div>
              <div className="print-small-label">difficulty</div>
            </div>
          </div>

          {/* Description */}
          <p style={{fontSize:"10pt", color:"#444", marginBottom:"12pt", lineHeight:"1.5"}}>{recipe.description}</p>

          {/* Ingredients */}
          <div className="print-section">Ingredients</div>
          {recipe.ingredients.map((ing, i) => (
            <div key={i} className="print-ingredient">
              <span className="print-ingredient-amount">•</span>
              <span>{ing}</span>
            </div>
          ))}

          {/* Instructions */}
          <div className="print-section">Instructions</div>
          {recipe.instructions.map((step, i) => (
            <div key={i} className="print-step">
              <div className="print-step-num">{i + 1}</div>
              <div>{step}</div>
            </div>
          ))}

          {/* Tips */}
          {recipe.tips && recipe.tips.length > 0 && (
            <>
              <div className="print-section">Pro Tips</div>
              {recipe.tips.map((tip, i) => (
                <div key={i} className="print-tip">🔥 {tip}</div>
              ))}
            </>
          )}

          {/* Strain */}
          {recipe.strainRecommendation && (
            <>
              <div className="print-section">Strain Recommendation</div>
              <p style={{fontSize:"10pt", color:"#444"}}>{recipe.strainRecommendation}</p>
            </>
          )}

          {/* Dosing guide */}
          <div className="print-section">Dosing Reference</div>
          <table style={{borderCollapse:"collapse", fontSize:"9pt", width:"100%"}}>
            <tbody>
              {[["1–2.5 mg","Microdose","Subtle, ideal for beginners"],["2.5–5 mg","Low","Mild relaxation"],["5–15 mg","Moderate","Standard recreational"],["15–30 mg","High","Experienced users only"],["30+ mg","Very High","Tolerance required"]].map(([r,l,d]) => (
                <tr key={r}><td style={{padding:"2pt 8pt", minWidth:"60pt"}}>{r}</td><td style={{padding:"2pt 8pt", fontWeight:"600", minWidth:"80pt"}}>{l}</td><td style={{padding:"2pt 8pt", color:"#666"}}>{d}</td></tr>
              ))}
            </tbody>
          </table>

          {/* Safety */}
          <div className="print-safety">
            <strong>⚠️ Safety:</strong> Edibles take 30–120 minutes to take effect. Start with a low dose and wait 2 hours before consuming more. Keep away from children and pets. Never drive after consuming. For adults 21+ only.
          </div>

          <div className="print-footer">Generated by Infusion Sensei · infusionsensei.com · Exact THC dosing for every recipe</div>
        </div>
      </div>

      {/* ── SCREEN VERSION ──────────────────────────────── */}
      <div className="screen-only max-w-4xl mx-auto space-y-8">

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
          <img src={recipe.image} alt={displayName} className="h-full w-full object-cover object-center" />
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
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">{displayName}</h1>
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

        <div className="bg-white border-2 border-green-200 rounded-2xl p-5 no-print">
          <p className="text-xs font-bold uppercase tracking-wide text-green-700 mb-2">Next step</p>
          <h3 className="text-lg font-black text-gray-900 mb-1">Use this recipe in your dosing flow</h3>
          <p className="text-sm text-gray-600 mb-3">Open it in the builder with your infused base, then verify mg per serving in the calculator.</p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Link to={getBuilderLinkForRecipe(recipe)}>
              <Button className="bg-green-600 hover:bg-green-700 font-bold">
                Open in Builder <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/edibles-calculator">
              <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 font-semibold">
                Calculate mg Per Serving
              </Button>
            </Link>
          </div>
        </div>

        {/* ── PRINT BUTTON (bottom) ───────────────────────── */}
        <div className="flex gap-4 justify-center no-print">
          <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-6 text-base gap-2 rounded-xl shadow-md hover:shadow-lg transition-all">
            <Printer className="w-5 h-5" /> Print This Recipe
          </Button>
          <Link to={getBuilderLinkForRecipe(recipe)}>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50 font-bold px-8 py-6 text-base rounded-xl">
              Open in Builder →
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

      </div>{/* end screen-only */}
    </>
  );
}
