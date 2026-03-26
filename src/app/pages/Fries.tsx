import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { trackEvent } from "../utils/analytics";

type FriesRecipe = { id:string; name:string; type:"Butter"|"Oil"|"Aioli"|"Glaze"|"Powder"; profile:string; build:string; tags:string[]; emoji:string; heat:0|1|2|3; sweetness:0|1|2|3; servings:string; ingredients:string[]; steps:string[]; note:string; };

export const RECIPES: FriesRecipe[] = [
  { id:"garlic-butter-fries", name:"Garlic Butter Fries", type:"Butter", profile:"Savory / Rich", build:"Cannabutter + garlic + parsley toss", tags:["classic","butter","garlic"], emoji:"🧄", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries (cooked your way)","2 tbsp cannabutter","3 cloves garlic (minced)","2 tbsp fresh parsley","Salt to taste"], steps:["Cook fries using your preferred method — air fryer, oven, or deep fry.","Melt cannabutter in a pan over low heat.","Sauté garlic 1 minute until fragrant.","Toss hot fries in garlic butter, add parsley and salt."], note:"Add parsley last so it stays bright green." },
  { id:"truffle-fries", name:"Truffle Parmesan Fries", type:"Oil", profile:"Earthy / Rich", build:"Cannabis oil + truffle oil + parmesan finish", tags:["fancy","oil","garlic"], emoji:"🍄", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries (cooked)","1 tbsp cannabis olive oil","1 tsp truffle oil","¼ cup grated parmesan","Fresh parsley","Flaky salt"], steps:["Cook fries to crispy.","Drizzle cannabis olive oil over hot fries and toss.","Add truffle oil and toss again.","Top with parmesan, parsley, and flaky salt."], note:"Add truffle oil last and serve immediately — the flavor fades fast." },
  { id:"spicy-mayo-fries", name:"Spicy Cannabis Aioli Fries", type:"Aioli", profile:"Creamy / Spicy", build:"Cannabis oil aioli + sriracha drizzle", tags:["spicy","aioli","creamy"], emoji:"🌶️", heat:2, sweetness:0, servings:"2 servings", ingredients:["500g fries","3 tbsp mayo","1 tbsp cannabis coconut oil","1 tbsp sriracha","1 tsp lemon juice","1 clove garlic (minced)"], steps:["Whisk mayo, cannabis oil, sriracha, lemon, and garlic together.","Cook fries until crispy.","Drizzle aioli over hot fries or serve as dipping sauce."], note:"Make extra aioli — it keeps in the fridge for a week." },
  { id:"cajun-fries", name:"Cajun Cannabis Fries", type:"Oil", profile:"Bold / Spiced", build:"Cannabis oil toss + Cajun seasoning blend", tags:["spicy","oil","smoky"], emoji:"🫑", heat:2, sweetness:0, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabis coconut oil","2 tsp Cajun seasoning","½ tsp garlic powder","Salt to taste"], steps:["Cook fries until very crispy.","Toss hot fries in cannabis oil.","Immediately shake on Cajun seasoning and toss.","Season with extra salt."], note:"Cajun blend settles fast — toss vigorously right after adding." },
  { id:"buffalo-fries", name:"Buffalo Ranch Fries", type:"Butter", profile:"Spicy / Creamy", build:"Cannabutter buffalo sauce + ranch dipping", tags:["spicy","butter","classic"], emoji:"🌶️", heat:2, sweetness:0, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabutter","2 tbsp hot sauce","½ tsp garlic powder","Ranch for dipping"], steps:["Melt cannabutter and whisk in hot sauce and garlic powder.","Cook fries until crispy.","Toss fries in buffalo butter.","Serve with ranch dipping sauce."], note:"The ranch offsets the heat — serve it cold alongside." },
  { id:"cheese-fries", name:"Cannabis Cheese Sauce Fries", type:"Butter", profile:"Cheesy / Indulgent", build:"Cannabis cheddar sauce poured over fries", tags:["classic","butter","creamy"], emoji:"🧀", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","1 tbsp cannabutter","1 tbsp flour","120ml milk","100g cheddar (shredded)","Salt and pepper"], steps:["Make cheese sauce: melt cannabutter, whisk in flour, add milk gradually.","Stir in cheddar until melted and smooth.","Cook fries until crispy.","Pour cheese sauce over fries and serve immediately."], note:"Keep cheese sauce warm in a small pot — it thickens as it cools." },
  { id:"pesto-fries", name:"Cannabis Pesto Fries", type:"Oil", profile:"Herby / Fresh", build:"Cannabis olive oil pesto toss + pine nuts", tags:["fancy","oil","garlic"], emoji:"🌿", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabis olive oil","2 tbsp basil pesto","2 tbsp grated parmesan","1 tbsp toasted pine nuts"], steps:["Mix cannabis olive oil into pesto.","Cook fries until crispy.","Toss hot fries in cannabis pesto.","Top with parmesan and pine nuts."], note:"Pesto oxidizes fast — toss right before serving." },
  { id:"honey-sriracha-fries", name:"Honey Sriracha Fries", type:"Glaze", profile:"Sweet Heat", build:"Cannabis honey + sriracha glaze", tags:["sweet","spicy","glaze"], emoji:"🍯", heat:2, sweetness:2, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabis honey","1 tbsp sriracha","1 tsp soy sauce","1 tsp garlic powder","Sesame seeds"], steps:["Whisk cannabis honey, sriracha, soy sauce, and garlic together.","Cook fries until very crispy.","Toss fries in honey sriracha glaze quickly.","Top with sesame seeds."], note:"Work fast — the honey glaze sets quickly on hot fries." },
  { id:"lemon-herb-fries", name:"Lemon Herb Fries", type:"Oil", profile:"Bright / Fresh", build:"Cannabis oil + lemon zest + fresh herbs", tags:["classic","oil","light"], emoji:"🍋", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabis olive oil","Zest of 1 lemon","1 tbsp fresh parsley","1 tsp fresh thyme","Flaky salt"], steps:["Cook fries until golden and crispy.","Toss in cannabis olive oil while hot.","Add lemon zest and fresh herbs.","Finish with flaky salt."], note:"Add herbs and zest at the very end — they'll wilt if they cook." },
  { id:"korean-fries", name:"Korean Gochujang Fries", type:"Glaze", profile:"Sweet / Funky / Spicy", build:"Cannabis oil gochujang glaze + sesame + scallions", tags:["spicy","asian","glaze"], emoji:"🇰🇷", heat:2, sweetness:1, servings:"2 servings", ingredients:["500g fries","1 tbsp cannabis coconut oil","2 tbsp gochujang paste","1 tbsp honey","1 tbsp soy sauce","Sesame seeds","Scallions"], steps:["Mix cannabis oil, gochujang, honey, and soy sauce.","Cook fries until crispy.","Toss fries in gochujang sauce.","Top with sesame seeds and scallions."], note:"Gochujang is funky and fermented — the sweetness and soy balance it out." },
  { id:"parmesan-rosemary-fries", name:"Parmesan Rosemary Fries", type:"Oil", profile:"Savory / Aromatic", build:"Cannabis oil + rosemary + parmesan", tags:["classic","oil","fancy"], emoji:"🌿", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabis olive oil","1 tbsp fresh rosemary (chopped)","¼ cup grated parmesan","Flaky salt"], steps:["Cook fries until crispy.","Drizzle with cannabis olive oil and toss.","Add rosemary and toss again.","Finish with parmesan and flaky salt."], note:"Fresh rosemary is much better than dried here." },
  { id:"Nashville-hot-fries", name:"Nashville Hot Fries", type:"Oil", profile:"Hot / Smoky", build:"Cannabis oil cayenne sauce toss", tags:["spicy","oil","smoky"], emoji:"🔥", heat:3, sweetness:0, servings:"2 servings", ingredients:["500g fries","3 tbsp cannabis coconut oil","2 tbsp cayenne pepper","1 tbsp smoked paprika","1 tbsp brown sugar","½ tsp garlic powder"], steps:["Heat cannabis oil until warm but not smoking.","Whisk in cayenne, paprika, brown sugar, garlic.","Cook fries until very crispy.","Toss in Nashville hot oil immediately."], note:"Serve over white bread with pickles for the full Nashville experience." },
  { id:"ranch-fries", name:"Cannabis Ranch Fries", type:"Powder", profile:"Creamy / Tangy", build:"Cannabis butter toss + ranch powder", tags:["classic","butter","creamy"], emoji:"🤍", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabutter","1 tbsp ranch seasoning","½ tsp garlic powder"], steps:["Melt cannabutter and stir in garlic powder.","Cook fries until crispy.","Toss fries in garlic butter.","Immediately shake ranch seasoning over fries and toss."], note:"Ranch seasoning sticks better when the butter is still warm." },
  { id:"miso-butter-fries", name:"Miso Butter Fries", type:"Butter", profile:"Umami / Rich", build:"Cannabutter + white miso toss", tags:["asian","butter","fancy"], emoji:"🫙", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabutter","1 tbsp white miso paste","1 tsp sesame oil","Sliced scallions"], steps:["Whisk cannabutter and miso together until smooth.","Cook fries until crispy.","Toss hot fries in miso butter.","Drizzle with sesame oil and top with scallions."], note:"White miso is milder — red miso gives stronger umami if you want more intensity." },
  { id:"poutine", name:"Cannabis Poutine", type:"Butter", profile:"Indulgent / Rich", build:"Cannabis gravy + cheese curds over fries", tags:["classic","butter","creamy"], emoji:"🍟", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","100g cheese curds","2 tbsp cannabutter","1 cup beef or chicken gravy","Salt and pepper"], steps:["Make or heat gravy, stir in cannabutter until melted.","Cook fries until very crispy.","Layer fries in a bowl, scatter cheese curds.","Pour hot cannabis gravy over the top."], note:"Pour gravy hot so it slightly melts the curds — that's the whole point." },
  { id:"al-pastor-fries", name:"Al Pastor Fries", type:"Oil", profile:"Spiced / Tropical", build:"Cannabis oil + al pastor spice + pineapple", tags:["spicy","oil","sweet"], emoji:"🍍", heat:1, sweetness:1, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabis coconut oil","2 tsp achiote paste or chili powder","1 tsp cumin","2 tbsp pineapple (diced)","Cilantro","Lime"], steps:["Mix cannabis oil with achiote and cumin.","Cook fries until crispy.","Toss fries in spiced cannabis oil.","Top with pineapple, cilantro, and squeeze of lime."], note:"Pineapple is non-negotiable — the sweet-acid balance is the whole dish." },
  { id:"loaded-fries", name:"Loaded Cannabis Fries", type:"Butter", profile:"Everything / Indulgent", build:"Cannabutter + sour cream + cheese + bacon bits", tags:["classic","butter","creamy"], emoji:"🏆", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","1 tbsp cannabutter (melted)","60ml sour cream","50g cheddar (shredded)","2 tbsp bacon bits","2 tbsp chives"], steps:["Cook fries until crispy, drizzle with melted cannabutter.","Sprinkle cheddar over hot fries so it melts.","Dollop sour cream over fries.","Top with bacon bits and chives."], note:"Melted cannabutter is the carrier — the toppings are just flavor." },
  { id:"katsu-fries", name:"Katsu Curry Fries", type:"Glaze", profile:"Sweet / Savory / Warm", build:"Cannabis oil Japanese curry sauce drizzle", tags:["asian","glaze","sweet"], emoji:"🍛", heat:1, sweetness:2, servings:"2 servings", ingredients:["500g fries","1 tbsp cannabis coconut oil","3 tbsp Japanese curry sauce (store-bought)","Sesame seeds"], steps:["Stir cannabis oil into warm curry sauce.","Cook fries until crispy.","Drizzle curry sauce over fries.","Top with sesame seeds."], note:"Japanese curry sauce comes in blocks in Asian grocery stores." },
  { id:"za-atar-fries", name:"Za'atar Fries", type:"Oil", profile:"Herby / Tangy", build:"Cannabis olive oil + za'atar spice blend", tags:["fancy","oil","light"], emoji:"🌿", heat:0, sweetness:0, servings:"2 servings", ingredients:["500g fries","2 tbsp cannabis olive oil","2 tsp za'atar","1 tsp sumac","Flaky salt"], steps:["Cook fries until golden.","Toss in cannabis olive oil.","Add za'atar and sumac and toss.","Finish with flaky salt."], note:"Za'atar is thyme + sesame + sumac — nutty, herby, tangy all at once." },
  { id:"chili-cheese-fries", name:"Chili Cannabis Cheese Fries", type:"Butter", profile:"Bold / Hearty", build:"Cannabis cheese sauce + chili over fries", tags:["classic","butter","spicy"], emoji:"🌶️", heat:1, sweetness:0, servings:"2 servings", ingredients:["500g fries","Cannabis cheese sauce (see Cheese Fries recipe)","½ cup chili (canned or homemade)","Jalapeños","Sour cream"], steps:["Make cannabis cheese sauce (see Cheese Fries recipe).","Cook fries until crispy.","Heat chili and spoon over fries.","Pour cheese sauce over chili.","Top with jalapeños and sour cream."], note:"Layer order matters: fries → chili → cheese → toppings." },
];

const TAGS = ["all","classic","spicy","sweet","garlic","butter","oil","aioli","glaze","creamy","fancy","asian","smoky","light"];
const TAG_LABELS: Record<string,string> = { all:"All Styles", classic:"⭐ Classic", spicy:"🌶️ Spicy", sweet:"🍯 Sweet", garlic:"🧄 Garlic", butter:"🧈 Butter", oil:"💧 Oil", aioli:"🤍 Aioli", glaze:"✨ Glaze", creamy:"🧀 Creamy", fancy:"🍄 Fancy", asian:"🥢 Asian", smoky:"💨 Smoky", light:"🌿 Light" };
const TYPE_COLORS: Record<string,string> = { Butter:"bg-yellow-100 text-yellow-800", Oil:"bg-green-100 text-green-700", Aioli:"bg-blue-100 text-blue-700", Glaze:"bg-amber-100 text-amber-800", Powder:"bg-orange-100 text-orange-700" };
const SECTIONS = [
  { label:"⭐ Classic", ids:["garlic-butter-fries","truffle-fries","cheese-fries","ranch-fries","loaded-fries"] },
  { label:"🌶️ Spicy", ids:["cajun-fries","buffalo-fries","spicy-mayo-fries","Nashville-hot-fries","chili-cheese-fries"] },
  { label:"✨ Specialty", ids:["honey-sriracha-fries","korean-fries","miso-butter-fries","poutine","al-pastor-fries"] },
  { label:"🌿 Herby / Fresh", ids:["lemon-herb-fries","parmesan-rosemary-fries","pesto-fries","za-atar-fries","katsu-fries"] },
];

function Dots({ level, color }: { level: number; color: string }) {
  return <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? color : "bg-gray-200"}`} />)}</div>;
}

export function Fries() {
  const [activeTag, setActiveTag] = useState("all");
  const [selected, setSelected] = useState<FriesRecipe | null>(null);
  const [searchParams] = useSearchParams();
  const filtered = activeTag === "all" ? RECIPES : RECIPES.filter(r => r.tags.includes(activeTag));
  const filteredSections = SECTIONS.map(sec => ({ ...sec, recipes: sec.ids.map(id => RECIPES.find(r => r.id === id)!).filter(r => activeTag === "all" || r.tags.includes(activeTag)) })).filter(sec => sec.recipes.length > 0);

  useEffect(() => {
    const recipeIdParam = searchParams.get("recipe");
    if (!recipeIdParam) return;
    const found = RECIPES.find((r) => r.id === recipeIdParam);
    if (found) {
      setActiveTag("all");
      setSelected(found);
    }
  }, [searchParams]);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <Helmet>
        <title>THC Infused Fries (Cannabis Oil Recipe + Dosage Calculator)</title>
        <meta name="description" content="Make crispy infused fries using cannabis oil. Learn exact THC dosing and cooking methods for perfect results." />
      </Helmet>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{minHeight:"280px"}}>
        <img src="/IMAGES/fries.jpg" alt="Infused fries" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative z-10 px-6 py-14 text-center">
          <div className="text-6xl mb-3">🍟</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Infused Fries</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">20 cannabis fries recipes — garlic butter to poutine. Cook the fries your way. We're here for the sauce, the glaze, and the exact THC per serving.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["🍟 20 Styles","🧈 Butter • Oil • Glaze","⚖️ Exact THC Per Serving"].map(t => <Badge key={t} className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">{t}</Badge>)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Filter by style</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTag === tag ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-yellow-100 hover:text-yellow-700"}`}>{TAG_LABELS[tag]}</button>)}
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} style{filtered.length !== 1 ? "s" : ""} shown</p>
      </div>

      {filteredSections.map(section => (
        <div key={section.label}>
          <h2 className="text-xl font-black text-gray-900 mb-4">{section.label}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.recipes.map(recipe => (
              <button key={recipe.id} onClick={() => setSelected(selected?.id === recipe.id ? null : recipe)}
                className={`bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${selected?.id === recipe.id ? "border-yellow-400 shadow-lg" : "border-gray-200 hover:border-yellow-300"}`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{recipe.emoji}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[recipe.type]}`}>{recipe.type}</span>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1">{recipe.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{recipe.profile}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><span>Heat</span><Dots level={recipe.heat} color="bg-red-500" /></div>
                  <div className="flex items-center gap-1.5"><span>Sweet</span><Dots level={recipe.sweetness} color="bg-amber-400" /></div>
                </div>
                {selected?.id === recipe.id && (
                  <div className="mt-4 pt-4 border-t border-yellow-100 space-y-3" onClick={e => e.stopPropagation()}>
                    <div className="bg-yellow-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">Recipe — {recipe.servings}</p>
                      <p className="text-xs text-gray-600 mb-2 italic">Cook fries your way — oven, air fryer, or deep fry. We handle the sauce.</p>
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1 mb-2">
                        {recipe.ingredients.map((ing,i) => <div key={i} className="flex gap-2 text-sm text-gray-700"><span className="text-yellow-500">•</span><span>{ing}</span></div>)}
                      </div>
                      <ol className="space-y-1">
                        {recipe.steps.map((step,i) => <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="font-bold text-yellow-600 flex-shrink-0">{i+1}.</span><span>{step}</span></li>)}
                      </ol>
                      <p className="text-xs text-gray-500 italic bg-orange-50 rounded-lg px-3 py-2 mt-2">💡 {recipe.note}</p>
                    </div>
                    <Link to={`/ingredients?category=fries&recipe=${recipe.id}`} className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors" onClick={e => { e.stopPropagation(); trackEvent("move_to_builder",{source_page:"fries",recipe_id:recipe.id}); }}>
                      <ChefHat className="w-4 h-4" /> Move to Recipe Builder
                    </Link>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-2xl font-black mb-2">Calculate Exact THC Per Serving</h2>
        <p className="text-green-200 mb-6 max-w-lg mx-auto">Enter your cannabutter or cannabis oil potency and get exact milligrams per serving automatically.</p>
        <Link to="/infusions"><Button className="bg-white text-green-800 hover:bg-green-50 font-black text-base px-8 py-3">Open My Infusions <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </div>
    </div>
  );
}
