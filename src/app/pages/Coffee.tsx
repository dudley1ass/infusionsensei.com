import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { trackEvent } from "../utils/analytics";
import { PAGE_STOCK } from "../data/recipeStockImageUrls";
import { loadShowcaseItemsFromDb } from "../services/contentService";

type Drink = { id:string; name:string; type:"Butter"|"Oil"|"Tincture"|"Syrup"|"Cream"; profile:string; build:string; tags:string[]; emoji:string; strength:0|1|2|3; sweetness:0|1|2|3; servings:string; ingredients:string[]; steps:string[]; note:string; };

const DRINKS: Drink[] = [
  { id:"bulletproof", name:"Bulletproof THC Coffee", type:"Butter", profile:"Rich / Energizing", build:"Cannabutter + hot coffee + blend", tags:["classic","butter","keto"], emoji:"☕", strength:2, sweetness:0, servings:"1 cup", ingredients:["1 cup hot brewed coffee","1 tbsp cannabutter","1 tbsp coconut oil (optional)","Pinch of salt"], steps:["Brew strong coffee — French press works best.","Add coffee, cannabutter, and coconut oil to a blender.","Blend 20-30 seconds until frothy and creamy.","Pour and serve immediately."], note:"THC binds to fat — don't skip blending. It creates an emulsion that disperses the dose evenly." },
  { id:"infused-latte", name:"Infused Oat Milk Latte", type:"Tincture", profile:"Smooth / Creamy", build:"Espresso + steamed oat milk + tincture", tags:["classic","tincture","dairy-free"], emoji:"🥛", strength:1, sweetness:1, servings:"1 cup", ingredients:["2 shots espresso","200ml steamed oat milk","1ml THC tincture","1 tsp vanilla syrup (optional)"], steps:["Pull 2 shots of espresso.","Add tincture to hot espresso and stir.","Steam oat milk until hot and frothy.","Pour steamed milk over espresso."], note:"Add tincture to espresso before milk so it disperses evenly." },
  { id:"cold-brew", name:"Infused Cold Brew", type:"Tincture", profile:"Smooth / Bold", build:"Cold brew + tincture + milk over ice", tags:["cold","tincture","classic"], emoji:"🧊", strength:2, sweetness:0, servings:"1 cup", ingredients:["180ml cold brew concentrate","60ml oat milk","1ml THC tincture","Ice","Simple syrup to taste"], steps:["Fill a glass with ice.","Add cold brew concentrate.","Stir in THC tincture.","Top with oat milk and syrup."], note:"Cold brew is less acidic — tincture blends in more smoothly." },
  { id:"infused-mocha", name:"Infused Mocha", type:"Oil", profile:"Chocolatey / Sweet", build:"Espresso + cocoa + cannabis oil + steamed milk", tags:["sweet","chocolate","oil"], emoji:"🍫", strength:1, sweetness:2, servings:"1 cup", ingredients:["2 shots espresso","1 tbsp cocoa powder","1 tbsp cannabis coconut oil","200ml steamed milk","1 tbsp sugar"], steps:["Whisk cocoa and sugar into hot espresso.","Add cannabis coconut oil and stir well.","Steam milk until frothy.","Pour milk over mocha base."], note:"Whisk the oil into the base before adding milk — it won't blend itself." },
  { id:"infused-caramel-latte", name:"Infused Caramel Latte", type:"Syrup", profile:"Sweet / Buttery", build:"Espresso + infused caramel syrup + steamed milk", tags:["sweet","syrup","caramel"], emoji:"🍮", strength:1, sweetness:3, servings:"1 cup", ingredients:["2 shots espresso","2 tbsp caramel sauce infused with cannabis oil","200ml steamed milk","Whipped cream"], steps:["Stir cannabis oil into caramel sauce.","Add infused caramel to espresso.","Pour steamed milk over espresso.","Top with whipped cream."], note:"Make a big batch of infused caramel and keep in the fridge." },
  { id:"infused-americano", name:"Infused Americano", type:"Tincture", profile:"Bold / Clean", build:"Espresso + hot water + tincture", tags:["classic","tincture","strong"], emoji:"🖤", strength:2, sweetness:0, servings:"1 cup", ingredients:["2 shots espresso","120ml hot water","1ml THC tincture","Pinch of salt"], steps:["Pull 2 shots of espresso.","Stir tincture into hot espresso.","Add hot water to desired strength.","Season with a pinch of salt."], note:"Great for precise dosing — simple recipe, nothing to hide the tincture flavor." },
  { id:"infused-iced-coffee", name:"Infused Iced Coffee", type:"Tincture", profile:"Refreshing / Bold", build:"Strong coffee + tincture + milk over ice", tags:["cold","tincture","classic"], emoji:"🧊", strength:1, sweetness:1, servings:"1 cup", ingredients:["240ml strong brewed coffee (cooled)","1ml THC tincture","Ice","60ml milk or cream","Simple syrup to taste"], steps:["Brew double-strength coffee and let cool.","Stir tincture into cooled coffee.","Pour over ice, add milk and syrup."], note:"Brew double strength so it doesn't taste watered down over ice." },
  { id:"infused-frappuccino", name:"Infused Frappuccino", type:"Oil", profile:"Sweet / Frozen", build:"Blended coffee + cannabis oil + ice + milk", tags:["cold","sweet","oil"], emoji:"🥤", strength:1, sweetness:3, servings:"1 cup", ingredients:["180ml cold brew","1 tbsp cannabis coconut oil","120ml milk","2 tbsp sugar","1 cup ice","Whipped cream"], steps:["Add all ingredients to a blender.","Blend on high until smooth and icy.","Pour and top with whipped cream."], note:"Oil blends completely smooth — no separation in a Frappuccino." },
  { id:"golden-latte", name:"Golden THC Latte", type:"Oil", profile:"Earthy / Warming", build:"Cannabis oil + turmeric + honey + oat milk", tags:["wellness","oil","dairy-free"], emoji:"✨", strength:1, sweetness:1, servings:"1 cup", ingredients:["240ml oat milk","1 tbsp cannabis coconut oil","1 tsp turmeric","½ tsp cinnamon","¼ tsp ginger","1 tbsp honey"], steps:["Heat oat milk — don't boil.","Whisk in cannabis oil, turmeric, cinnamon, ginger.","Pour into mug, stir in honey."], note:"No caffeine — perfect for an evening microdose." },
  { id:"infused-matcha", name:"Infused Matcha Latte", type:"Oil", profile:"Earthy / Sweet", build:"Matcha + cannabis oil + steamed oat milk", tags:["wellness","oil","dairy-free"], emoji:"🍵", strength:1, sweetness:1, servings:"1 cup", ingredients:["2 tsp matcha powder","60ml hot water (175°F)","1 tbsp cannabis coconut oil","200ml steamed oat milk","1 tbsp honey"], steps:["Whisk matcha into hot water until smooth.","Add cannabis oil and whisk in.","Pour steamed milk over matcha.","Sweeten with honey."], note:"Use 175°F water — boiling makes matcha bitter." },
  { id:"infused-chai", name:"Infused Chai Latte", type:"Oil", profile:"Spiced / Warming", build:"Chai concentrate + cannabis oil + steamed milk", tags:["sweet","wellness","oil"], emoji:"🌶️", strength:1, sweetness:2, servings:"1 cup", ingredients:["120ml chai concentrate","1 tbsp cannabis coconut oil","180ml steamed oat milk","1 tsp honey"], steps:["Heat chai concentrate.","Stir in cannabis coconut oil.","Top with steamed oat milk and honey."], note:"Chai spices may slow THC absorption slightly." },
  { id:"infused-hot-chocolate", name:"Infused Hot Chocolate", type:"Oil", profile:"Rich / Indulgent", build:"Hot milk + cocoa + cannabis coconut oil", tags:["sweet","chocolate","oil"], emoji:"🍫", strength:1, sweetness:3, servings:"1 cup", ingredients:["240ml whole milk","2 tbsp cocoa powder","2 tbsp sugar","1 tbsp cannabis coconut oil","Whipped cream"], steps:["Heat milk in a saucepan.","Whisk in cocoa, sugar, and cannabis oil.","Pour into mug, top with whipped cream."], note:"Higher fat milk = better THC absorption." },
  { id:"infused-irish-coffee", name:"THC Irish Coffee", type:"Cream", profile:"Boozy / Warming", build:"Hot coffee + infused cream float", tags:["classic","cream","sweet"], emoji:"🥃", strength:2, sweetness:2, servings:"1 cup", ingredients:["180ml hot coffee","1 oz Irish whiskey (optional)","1 tsp brown sugar","3 tbsp cannabis-infused heavy cream","Pinch of nutmeg"], steps:["Dissolve sugar in hot coffee, add whiskey.","Slowly float infused cream over the back of a spoon.","Sprinkle nutmeg on top."], note:"The cream float delivers THC with every sip — don't stir." },
  { id:"espresso-tonic", name:"Infused Espresso Tonic", type:"Tincture", profile:"Bitter / Fizzy", build:"Tonic water + espresso + tincture over ice", tags:["cold","tincture","unique"], emoji:"🫧", strength:1, sweetness:1, servings:"1 cup", ingredients:["2 shots espresso (cooled)","180ml tonic water","1ml THC tincture","Ice","Lemon wedge"], steps:["Fill glass with ice, pour tonic.","Stir tincture into cooled espresso.","Pour espresso slowly over tonic for a layered effect.","Add lemon."], note:"The layered look is half the fun — pour slowly." },
  { id:"coconut-coffee", name:"Infused Coconut Coffee", type:"Oil", profile:"Tropical / Rich", build:"Coffee + cannabis coconut oil + coconut milk", tags:["keto","oil","dairy-free"], emoji:"🥥", strength:2, sweetness:1, servings:"1 cup", ingredients:["240ml hot coffee","1 tbsp cannabis coconut oil","60ml coconut milk","1 tsp honey"], steps:["Add cannabis oil and coconut milk to blender.","Add hot coffee and blend 20 seconds.","Pour and sweeten with honey."], note:"Coconut oil + coconut milk = maximum fat for THC absorption." },
  { id:"pumpkin-spice-latte", name:"Infused Pumpkin Spice Latte", type:"Syrup", profile:"Spiced / Sweet", build:"Espresso + pumpkin cannabis syrup + steamed milk", tags:["sweet","syrup","seasonal"], emoji:"🎃", strength:1, sweetness:3, servings:"1 cup", ingredients:["2 shots espresso","2 tbsp cannabis simple syrup","2 tbsp pumpkin puree","½ tsp pumpkin pie spice","200ml steamed milk"], steps:["Whisk pumpkin, syrup, and spice into hot espresso.","Steam milk until frothy.","Pour milk over spiced espresso.","Top with cinnamon."], note:"Cannabis simple syrup: dissolve sugar in water, stir in tincture." },
  { id:"mint-mocha", name:"Infused Mint Mocha", type:"Oil", profile:"Minty / Chocolate", build:"Espresso + peppermint + cocoa + cannabis oil", tags:["sweet","chocolate","oil"], emoji:"🌿", strength:1, sweetness:2, servings:"1 cup", ingredients:["2 shots espresso","1 tbsp cannabis coconut oil","1 tbsp cocoa powder","¼ tsp peppermint extract","200ml steamed milk","1 tbsp sugar"], steps:["Whisk cocoa, sugar, and peppermint into espresso.","Stir in cannabis oil.","Pour steamed milk over base."], note:"Start with ¼ tsp peppermint — a little goes a long way." },
  { id:"cinnamon-dolce", name:"Infused Cinnamon Dolce Latte", type:"Syrup", profile:"Warm / Sweet", build:"Espresso + cinnamon cannabis syrup + oat milk", tags:["sweet","syrup","seasonal"], emoji:"🍁", strength:1, sweetness:2, servings:"1 cup", ingredients:["2 shots espresso","2 tbsp cannabis simple syrup","1 tsp cinnamon","200ml steamed oat milk","Pinch of nutmeg"], steps:["Stir cinnamon into infused syrup.","Add cinnamon syrup to espresso.","Pour steamed oat milk over.","Dust with nutmeg."], note:"Cinnamon may enhance THC absorption — can hit a bit stronger." },
  { id:"cortado", name:"Infused Cortado", type:"Butter", profile:"Intense / Balanced", build:"Espresso + small pour of cannabutter cream", tags:["strong","butter","keto"], emoji:"🔬", strength:2, sweetness:0, servings:"Small cup", ingredients:["2 shots espresso","1 tsp cannabutter","60ml warm milk"], steps:["Melt cannabutter into warm milk and whisk.","Pull 2 shots of espresso.","Pour cannabutter milk into espresso."], note:"Small format = concentrated dose per ounce." },
  { id:"vanilla-latte", name:"Infused Vanilla Latte", type:"Syrup", profile:"Smooth / Sweet", build:"Espresso + vanilla cannabis syrup + oat milk", tags:["sweet","syrup","classic"], emoji:"🌸", strength:1, sweetness:2, servings:"1 cup", ingredients:["2 shots espresso","2 tbsp cannabis simple syrup","1 tsp vanilla extract","200ml steamed oat milk"], steps:["Stir vanilla into infused syrup.","Add to espresso.","Top with steamed oat milk.","Dust with cinnamon."], note:"Make cannabis simple syrup in bulk — 1 cup sugar + 1 cup water + tincture." },
];

const TAGS = ["all","classic","butter","oil","tincture","syrup","cream","sweet","cold","keto","wellness","chocolate","dairy-free"];
const TAG_LABELS: Record<string,string> = { all:"All Drinks", classic:"⭐ Classic", butter:"🧈 Butter", oil:"💧 Oil", tincture:"🧪 Tincture", syrup:"🍯 Syrup", cream:"🤍 Cream", sweet:"🍬 Sweet", cold:"🧊 Iced", keto:"💪 Keto", wellness:"✨ Wellness", chocolate:"🍫 Chocolate", "dairy-free":"🌿 Dairy-Free" };
const TYPE_COLORS: Record<string,string> = { Butter:"bg-yellow-100 text-yellow-800", Oil:"bg-green-100 text-green-700", Tincture:"bg-purple-100 text-purple-700", Syrup:"bg-amber-100 text-amber-800", Cream:"bg-blue-100 text-blue-700" };
const SECTIONS = [
  { label:"⭐ Classic Builds", ids:["bulletproof","infused-latte","cold-brew","infused-americano","cortado"] },
  { label:"🍫 Specialty", ids:["infused-mocha","infused-caramel-latte","vanilla-latte","infused-irish-coffee","espresso-tonic"] },
  { label:"🧊 Iced & Frozen", ids:["infused-iced-coffee","infused-frappuccino"] },
  { label:"✨ Wellness", ids:["golden-latte","infused-matcha","infused-chai","coconut-coffee"] },
  { label:"🍬 Sweet & Dessert", ids:["infused-hot-chocolate","pumpkin-spice-latte","mint-mocha","cinnamon-dolce"] },
];

function Dots({ level, color }: { level: number; color: string }) {
  return <div className="flex gap-0.5">{[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full ${i <= level ? color : "bg-gray-200"}`} />)}</div>;
}

export function Coffee() {
  const [activeTag, setActiveTag] = useState("all");
  const [selected, setSelected] = useState<Drink | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>(DRINKS);
  const filtered = activeTag === "all" ? drinks : drinks.filter(d => d.tags.includes(activeTag));
  const filteredSections = SECTIONS.map(sec => ({ ...sec, drinks: sec.ids.map(id => drinks.find(d => d.id === id)!).filter(d => activeTag === "all" || d.tags.includes(activeTag)) })).filter(sec => sec.drinks.length > 0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const fromDb = await loadShowcaseItemsFromDb("coffee");
      if (!fromDb || cancelled) return;
      const byId = new Map(fromDb.map((item) => [item.id, item]));
      const merged = DRINKS.map((local) => {
        const db = byId.get(local.id);
        if (!db) return local;
        return {
          ...local,
          name: db.name || local.name,
          type: (db.itemType as Drink["type"]) || local.type,
          profile: db.profile || local.profile,
          build: db.build || local.build,
          tags: db.tags.length > 0 ? db.tags : local.tags,
          emoji: db.emoji || local.emoji,
          strength: db.primaryLevel as Drink["strength"],
          sweetness: db.secondaryLevel as Drink["sweetness"],
        };
      });
      if (!cancelled) setDrinks(merged);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <Helmet>
        <title>Cannabis Infused Coffee (THC Dosage + Butter Recipe Guide)</title>
        <meta name="description" content="Learn how to make THC-infused coffee using cannabutter or oil. Includes exact dosage calculator for perfect strength." />
      </Helmet>

      <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{minHeight:"280px"}}>
        <img src={PAGE_STOCK.coffee} alt="Infused coffee" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative z-10 px-6 py-14 text-center">
          <div className="text-6xl mb-3">☕</div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-3">Infused Coffee</h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-6">20 cannabis coffee recipes — bulletproof butter coffee to cold brew. Every drink built with cannabutter, cannabis oil, or tincture for exact THC per cup.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {["☕ 20 Drinks","🧈 Butter • Oil • Tincture","⚖️ Exact THC Per Cup"].map(t => <Badge key={t} className="bg-white/20 text-white border-white/30 text-sm px-3 py-1 backdrop-blur-sm">{t}</Badge>)}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Filter by type</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => <button key={tag} onClick={() => setActiveTag(tag)} className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${activeTag === tag ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700"}`}>{TAG_LABELS[tag]}</button>)}
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} drink{filtered.length !== 1 ? "s" : ""} shown</p>
      </div>

      {filteredSections.map(section => (
        <div key={section.label}>
          <h2 className="text-xl font-black text-gray-900 mb-4">{section.label}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.drinks.map(drink => (
              <button key={drink.id} onClick={() => setSelected(selected?.id === drink.id ? null : drink)}
                className={`bg-white rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${selected?.id === drink.id ? "border-amber-400 shadow-lg" : "border-gray-200 hover:border-amber-300"}`}>
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{drink.emoji}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[drink.type]}`}>{drink.type}</span>
                </div>
                <h3 className="font-black text-gray-900 text-base mb-1">{drink.name}</h3>
                <p className="text-gray-500 text-xs mb-3">{drink.profile}</p>
                <div className="flex gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5"><span>Strength</span><Dots level={drink.strength} color="bg-amber-500" /></div>
                  <div className="flex items-center gap-1.5"><span>Sweet</span><Dots level={drink.sweetness} color="bg-pink-400" /></div>
                </div>
                {selected?.id === drink.id && (
                  <div className="mt-4 pt-4 border-t border-amber-100 space-y-3" onClick={e => e.stopPropagation()}>
                    <div className="bg-amber-50 rounded-xl p-3">
                      <p className="text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">Recipe — {drink.servings}</p>
                      <div className="bg-gray-50 rounded-xl p-3 space-y-1 mb-2">
                        {drink.ingredients.map((ing,i) => <div key={i} className="flex gap-2 text-sm text-gray-700"><span className="text-amber-400">•</span><span>{ing}</span></div>)}
                      </div>
                      <ol className="space-y-1">
                        {drink.steps.map((step,i) => <li key={i} className="flex gap-2 text-sm text-gray-700"><span className="font-bold text-amber-500 flex-shrink-0">{i+1}.</span><span>{step}</span></li>)}
                      </ol>
                      <p className="text-xs text-gray-500 italic bg-yellow-50 rounded-lg px-3 py-2 mt-2">💡 {drink.note}</p>
                    </div>
                    <Link to={`/ingredients?category=drinks&recipe=${encodeURIComponent(drink.id)}`} className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2.5 rounded-xl transition-colors" onClick={e => { e.stopPropagation(); trackEvent("move_to_builder",{source_page:"coffee",recipe_id:drink.id}); }}>
                      <ChefHat className="w-4 h-4" /> Move to Recipe Builder
                    </Link>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-black text-gray-900 mb-4">🧠 Which Infusion for Coffee?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{type:"Cannabutter",desc:"Best fat carrier. Blends perfectly in bulletproof coffee. Richest flavor.",emoji:"🧈",color:"bg-yellow-50 border-yellow-200"},{type:"Cannabis Oil",desc:"Coconut or olive oil. Dairy-free. Blends smooth in a blender.",emoji:"💧",color:"bg-green-50 border-green-200"},{type:"THC Tincture",desc:"Most precise dosing. Add after brewing — heat can degrade it.",emoji:"🧪",color:"bg-purple-50 border-purple-200"},{type:"Infused Cream",desc:"Float on top. Great for Irish Coffee and cold drinks.",emoji:"🤍",color:"bg-blue-50 border-blue-200"}].map(({type,desc,emoji,color}) => (
            <div key={type} className={`rounded-2xl border-2 p-4 ${color}`}>
              <div className="text-3xl mb-2">{emoji}</div>
              <p className="font-black text-gray-900 text-sm mb-1">{type}</p>
              <p className="text-gray-600 text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <div className="text-4xl mb-3">🧮</div>
        <h2 className="text-2xl font-black mb-2">Calculate Exact THC Per Cup</h2>
        <p className="text-green-200 mb-6 max-w-lg mx-auto">Enter your cannabutter or tincture potency and get exact milligrams per drink.</p>
        <Link to="/ingredients?category=drinks&recipe=bulletproof-coffee"><Button className="bg-white text-green-800 hover:bg-green-50 font-black text-base px-8 py-3">Open Recipe Builder <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
      </div>
    </div>
  );
}
