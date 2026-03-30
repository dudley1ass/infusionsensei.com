import { Link } from "react-router";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Users, ChefHat } from "lucide-react";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

const BUNDLES = [
  {
    id: "game-night",
    title: "Game Night Pack",
    emoji: "🎮",
    desc: "The ultimate infused spread for a night in. Wings, dips, popcorn, and dessert — all portioned for a group.",
    color: "from-orange-600 to-red-700",
    tag: "Most Popular",
    tagColor: "bg-white text-orange-700",
    serves: "4–6 people",
    vibe: "Relaxed / Social",
    hero: true,
    thumbnail: "/IMAGES/chickenwings.jpg",
    thumbnailAlt: "Game night wings and snacks",
    items: [
      { name: "Infused Buffalo Wings", dose: "2–3mg each", tip: "Make 2 sauces — 1 infused, 1 regular. Label clearly.", link: "/wings", emoji: "🍗" },
      { name: "Spinach Artichoke Dip", dose: "3–5mg per serving", tip: "Dose the dip — keep chips or crackers non-infused.", link: "/spreads-dips", emoji: "🥣" },
      { name: "Caramel Popcorn", dose: "2–3mg per bowl", tip: "Easy to over-snack. Pre-portion into individual bowls.", link: "/popcorn", emoji: "🍿" },
      { name: "Cannabis Brownies", dose: "5–10mg each", tip: "Make smaller pieces — 1 inch squares instead of big slabs.", link: "/ingredients?category=baked-goods&recipe=brownies", emoji: "🍫" },
    ],
    totalRange: "If you try everything: ~15–25mg total",
    startLowReminder: "Start with ONE item — wait 45 min.",
    flow: [
      { step: "Start", item: "Popcorn", dose: "2–3mg" },
      { step: "Then", item: "Wings", dose: "2–3mg each" },
      { step: "Finish", item: "Brownie", dose: "5–10mg" },
    ],
    rule: "Always offer non-infused versions of each dish. Not everyone wants to participate.",
  },
  {
    id: "chill-night",
    title: "Chill Night Pack",
    emoji: "🛋️",
    desc: "Lighter, lower dose. Perfect for a movie night or quiet evening with 1–2 people.",
    color: "from-blue-600 to-indigo-700",
    tag: "Low & Slow",
    tagColor: "bg-white text-blue-700",
    serves: "1–2 people",
    vibe: "Mellow / Relaxing",
    hero: false,
    thumbnail: "/IMAGES/popcorn.webp",
    thumbnailAlt: "Chill night popcorn and drink",
    items: [
      { name: "Garlic Butter Popcorn", dose: "2–5mg per bowl", tip: "The easiest infused snack. Hard to mess up.", link: "/popcorn", emoji: "🍿" },
      { name: "Infused Coffee or Tea", dose: "2.5–5mg per cup", tip: "Great for a slow onset. Use tincture for precise dosing.", link: "/coffee", emoji: "☕" },
      { name: "Honey Mustard Wings", dose: "2–3mg each", tip: "Lower heat sauce — good for a relaxed vibe.", link: "/wings", emoji: "🍗" },
      { name: "Chocolate Drizzle Popcorn", dose: "3–5mg per serving", tip: "Make it fancy. Melted dark chocolate + cannabis coconut oil.", link: "/popcorn", emoji: "🍫" },
    ],
    totalRange: "If you try everything: ~10–15mg total",
    startLowReminder: "Start with ONE item — wait 45 min.",
    flow: [
      { step: "Start", item: "Popcorn", dose: "2–5mg" },
      { step: "Then", item: "Coffee or Tea", dose: "2.5–5mg" },
      { step: "Finish", item: "Chocolate Popcorn", dose: "3–5mg" },
    ],
    rule: "Go lower than you think. Chill nights should stay chill.",
  },
  {
    id: "final-four-week",
    title: "Final Four Week Pack",
    emoji: "🏀",
    desc: "Regional-inspired infused snacks for this week's tournament watch parties. Keep doses low so everyone can pace.",
    color: "from-blue-700 to-indigo-800",
    tag: "This Week",
    tagColor: "bg-white text-blue-700",
    serves: "4–8 people",
    vibe: "Game Day / Social",
    hero: false,
    thumbnail: "/IMAGES/popcorn.webp",
    thumbnailAlt: "Final Four watch-party snacks",
    items: [
      { name: "Husky Northeast Maple Popcorn", dose: "2–3mg per handful", tip: "Melt butter + maple syrup, then fold in infused butter and toss with popcorn.", link: "/popcorn", emoji: "🟦" },
      { name: "Illini Deep Dish Pizza Bites", dose: "4–8mg per 1–2 bites", tip: "Add infused olive oil to sauce or dough. Keep cheese/toppings non-infused.", link: "/recipes/infused-pizza-sauce", emoji: "🟧" },
      { name: "Desert Heat Spicy Snack Mix", dose: "3–5mg per bowl", tip: "Blend seasoning into infused oil, then toss into Chex mix + nuts + pretzels.", link: "/party-snacks", emoji: "🟥" },
      { name: "Great Lakes Caramel Apple Dip", dose: "1–3mg per dip serving", tip: "Stir infused caramel or infused butter into dip and serve with apple slices.", link: "/spreads-dips", emoji: "🟨" },
    ],
    totalRange: "If you try everything: ~12–20mg total",
    startLowReminder: "Low-dose game plan: start with one snack and wait 45–60 min.",
    flow: [
      { step: "Start", item: "Maple Popcorn", dose: "2–3mg" },
      { step: "Then", item: "Caramel Apple Dip", dose: "1–3mg" },
      { step: "Finish", item: "Pizza Bites", dose: "4–8mg" },
    ],
    rule: "Pre-portion each snack and label mg per serving before tipoff.",
  },
  {
    id: "dessert-pack",
    title: "Dessert Pack",
    emoji: "🍰",
    desc: "A full infused dessert spread. Chocolate, caramel, and sweet bites — all with controlled dosing.",
    color: "from-pink-600 to-rose-700",
    tag: "Sweet Tooth",
    tagColor: "bg-white text-pink-700",
    serves: "4–8 people",
    vibe: "Indulgent / Social",
    hero: false,
    thumbnail: "/IMAGES/brownies.jpg",
    thumbnailAlt: "Dessert pack brownies",
    items: [
      { name: "Classic Cannabis Brownies", dose: "5–10mg each", tip: "Cut into smaller pieces for a dessert spread.", link: "/ingredients?category=baked-goods&recipe=brownies", emoji: "🍫" },
      { name: "Cannabis Sugar Cookies", dose: "3–7mg each", tip: "Easy to decorate and identify as infused.", link: "/ingredients?category=baked-goods&recipe=sugar-cookies", emoji: "🍪" },
      { name: "Chocolate Drizzle Popcorn", dose: "2–5mg per serving", tip: "A light closer after heavier desserts.", link: "/popcorn", emoji: "🍿" },
      { name: "Cannabis Gummies", dose: "5–10mg each", tip: "Precise dosing. Easy to hand out individually labeled.", link: "/ingredients?category=snacks&recipe=gummies", emoji: "🍬" },
    ],
    totalRange: "If you try everything: ~15–30mg total",
    startLowReminder: "Start with ONE item — wait 45 min.",
    flow: [
      { step: "Start", item: "Cookie", dose: "3–7mg" },
      { step: "Then", item: "Brownie", dose: "5–10mg" },
      { step: "Finish", item: "Gummy", dose: "5–10mg" },
    ],
    warning: "Easy to overdo — people forget what they've eaten.",
    rule: "Label everything. A dessert table is a high-confusion zone.",
  },
  {
    id: "savory-dinner-pack",
    title: "Savory Dinner Pack",
    emoji: "🍝",
    desc: "A controlled infused dinner: spaghetti-style pasta, infused pizza sauce, and easy-dose drinks.",
    color: "from-green-600 to-emerald-700",
    tag: "Dinner Friendly",
    tagColor: "bg-white text-green-700",
    serves: "4–8 people",
    vibe: "Savory / Social",
    hero: false,
    thumbnail: "/IMAGES/pizzasauce.jpg",
    thumbnailAlt: "Spaghetti and infused pizza sauce",
    items: [
      { name: "Garlic Infused Pasta", dose: "5–10mg per serving", tip: "Portion pasta before serving so every plate gets the same dose.", link: "/ingredients?category=savory-meals&recipe=garlic-pasta", emoji: "🍝" },
      { name: "Infused Pizza Sauce", dose: "~25mg per pizza", tip: "Divide sauce evenly across pizzas/slices to keep dosing consistent.", link: "/recipes/infused-pizza-sauce", emoji: "🍕" },
      { name: "Infused Cannabis Tea", dose: "10–20mg per cup", tip: "Tea requires fat blending (coconut oil). Stir/froth well.", link: "/ingredients?category=drinks&recipe=cannabis-tea", emoji: "🍵" },
    ],
    totalRange: "If you try everything: ~25–45mg total",
    startLowReminder: "Start with ONE item — wait 45 min.",
    flow: [
      { step: "Start", item: "Tea", dose: "10–20mg" },
      { step: "Then", item: "Pasta", dose: "5–10mg per serving" },
      { step: "Finish", item: "Pizza Sauce", dose: "~25mg per pizza" },
    ],
    rule: "Label everything. Offer non-infused versions so guests stay in control.",
  },
  {
    id: "drinks-pack",
    title: "Drinks Pack",
    emoji: "🥂",
    desc: "An infused drinks menu for a gathering. Coffee, mocktails, or tincture-based drinks with easy dose control.",
    color: "from-amber-600 to-yellow-700",
    tag: "Social Drinks",
    tagColor: "bg-white text-amber-700",
    serves: "Any size",
    vibe: "Social / Elegant",
    hero: false,
    thumbnail: "/IMAGES/coffee.jpg",
    thumbnailAlt: "Infused drinks",
    items: [
      { name: "Bulletproof THC Coffee", dose: "5–10mg per cup", tip: "Make a big batch, let guests serve themselves. Label the infused version.", link: "/coffee", emoji: "☕" },
      { name: "Infused Chai Latte", dose: "5mg per cup", tip: "Easy to make low-dose. Great for guests new to edibles.", link: "/coffee", emoji: "🍵" },
      { name: "Infused Lemonade", dose: "2.5–5mg per glass", tip: "Use tincture — it mixes into liquids better than oil.", link: "/ingredients?category=drinks", emoji: "🍋" },
      { name: "THC Espresso Tonic", dose: "5mg per glass", tip: "Fancy and low-dose. Great conversation starter.", link: "/coffee", emoji: "🫧" },
    ],
    totalRange: "If you try everything: ~12–20mg total",
    startLowReminder: "Start with ONE drink — wait 45 min.",
    flow: [
      { step: "Start", item: "Lemonade", dose: "2.5–5mg" },
      { step: "Then", item: "Chai Latte", dose: "5mg" },
      { step: "Finish", item: "Espresso Tonic", dose: "5mg" },
    ],
    rule: "Always have non-infused drink options. Nobody should accidentally consume THC.",
  },
];

const PARTY_RULES = [
  { rule: "Label everything", detail: "Infused food must be clearly labeled. This isn't optional." },
  { rule: "Start low across the board", detail: "Keep all individual items under 5mg. Guests will eat multiple things." },
  { rule: "Don't stack doses", detail: "A 5mg wing + 5mg popcorn + 10mg brownie = 20mg. That adds up fast." },
  { rule: "Offer non-infused versions", detail: "Not everyone wants to participate. Always have plain options." },
  { rule: "No driving after", detail: "Make it clear before anyone eats. Effects last 4–6 hours." },
  { rule: "Watch for new users", detail: "Check in with anyone who's new to edibles after 30–60 minutes." },
];

export function PartyMode() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <Helmet>
        <title>Party Mode – Infused Party Packs for Game Night, Chill Night & More | Infusion Sensei</title>
        <meta name="description" content="Infused party packs for every occasion — game night, chill night, dessert spreads, and drinks. Pre-planned menus with exact THC dosing for groups." />
        <link rel="canonical" href="https://infusionsensei.com/party-mode" />
      </Helmet>

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <Badge className="bg-green-600 text-white border-0 mb-4 text-sm px-4 py-1.5">🎉 Party Mode</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-3 leading-tight">Hosting? Don&apos;t guess dosing.</h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-2">Serve great food — and keep everyone in control.</p>
          <p className="text-gray-300 text-lg max-w-2xl mb-6">Pre-planned infused party packs — game night, chill night, dessert spreads, and drinks menus. Every pack comes with dosing strategy and tips for hosting a group safely.</p>
          <p className="text-xs uppercase tracking-wide text-gray-400 mb-2">Pick a party plan to start</p>
          <div className="flex flex-wrap gap-2">
            {BUNDLES.map((bundle) => (
              <Link key={`hero-${bundle.id}`} to={`/party-mode/plan/${bundle.id}`}>
                <Button size="sm" className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold">
                  {bundle.emoji} {bundle.title.replace(" Pack", "")}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bundles */}
      <div className="space-y-8">
        {BUNDLES.map(bundle => (
          <div
            key={bundle.id}
            className={`bg-white rounded-3xl border overflow-hidden ${bundle.hero ? "border-orange-300 shadow-2xl ring-2 ring-orange-200 md:scale-[1.02]" : "border-gray-200 shadow-sm"}`}
          >
            {/* Bundle header */}
            <div className={`bg-gradient-to-r ${bundle.color} ${bundle.hero ? "p-7" : "p-6"} text-white`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-4xl">{bundle.emoji}</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${bundle.tagColor}`}>{bundle.tag}</span>
                    {bundle.hero && (
                      <span className="text-xs font-black px-2 py-0.5 rounded-full bg-black/35 border border-white/30">⭐ Start Here</span>
                    )}
                  </div>
                  <h2 className={`${bundle.hero ? "text-3xl" : "text-2xl"} font-black mb-1`}>{bundle.title}</h2>
                  <p className="text-white/80 text-sm max-w-lg">{bundle.desc}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="flex items-center gap-1 text-white/70 text-sm mb-1"><Users className="w-4 h-4" />{bundle.serves}</div>
                  <div className="text-white/70 text-sm">{bundle.vibe}</div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-6">
              <div className="mb-5 overflow-hidden rounded-2xl border border-gray-200 h-36 md:h-44 relative">
                <img
                  src={bundle.thumbnail}
                  alt={bundle.thumbnailAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />
                <div className="absolute left-4 bottom-3 text-white">
                  <p className="text-xs uppercase tracking-wide text-white/80">Featured vibe</p>
                  <p className="font-black">{bundle.title}</p>
                </div>
              </div>

              <div className="mb-5 bg-gray-50 border border-gray-200 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-500 uppercase mb-2">Suggested flow</p>
                <div className="grid md:grid-cols-3 gap-2">
                  {bundle.flow.map(({ step, item, dose }) => (
                    <div key={`${bundle.id}-${step}-${item}`} className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                      <p className="text-xs font-bold text-gray-500">{step}</p>
                      <p className="font-black text-sm text-gray-900">{item}</p>
                      <p className="text-xs text-green-700 font-semibold">{dose}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mb-5">
                {bundle.items.map(({ name, dose, tip, link, emoji }) => (
                  <Link key={name} to={link} className="flex gap-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-2xl p-4 transition-all group">
                    <span className="text-2xl flex-shrink-0">{emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-black text-gray-900 group-hover:text-green-700 text-sm">{name}</p>
                        <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0">{dose}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{tip}</p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div>
                  <p className="text-xs font-bold text-amber-700 uppercase mb-0.5">⚠️ Total dose reminder</p>
                  <p className="text-sm text-amber-800">{bundle.totalRange}</p>
                  <p className="text-xs text-amber-700 font-semibold mt-1">{bundle.startLowReminder}</p>
                </div>
              </div>

              {bundle.warning && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-700 font-semibold">⚠️ {bundle.warning}</p>
                </div>
              )}

              <div className="mt-4 bg-gray-950 rounded-xl p-3 flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">🎯</span>
                <p className="text-gray-300 text-sm"><strong className="text-white">Host rule:</strong> {bundle.rule}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <Link to={`/party-mode/plan/${bundle.id}`}>
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white font-bold">
                    Plan This Pack <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
                <Link to="/infusions">
                  <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 font-bold">
                    <ChefHat className="w-3.5 h-3.5 mr-1.5" /> Build Infusion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Party Safety Rules */}
      <div className="bg-gray-950 rounded-3xl p-8">
        <h2 className="text-xl font-black text-white mb-5">🛡️ Party Host Rules</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {PARTY_RULES.map(({ rule, detail }) => (
            <div key={rule} className="flex gap-3 bg-gray-900 rounded-2xl p-4">
              <span className="text-green-400 font-black flex-shrink-0">✓</span>
              <div>
                <p className="font-black text-white text-sm">{rule}</p>
                <p className="text-gray-400 text-xs mt-0.5">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-3xl p-8 text-center text-white">
        <h2 className="text-2xl font-black mb-2">Build Your Party Pack</h2>
        <p className="text-green-200 mb-5">Plan exact doses by item, then use your saved infusion to hit those targets.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/party-mode/plan/game-night"><Button className="bg-white text-green-800 hover:bg-green-50 font-black px-8 py-3">Plan My Pack <ArrowRight className="w-4 h-4 ml-2" /></Button></Link>
          <Link to="/infusions"><Button variant="outline" className="border-white/40 text-white hover:bg-white/10 font-bold px-8 py-3">Build My Infusion</Button></Link>
        </div>
      </div>
    </div>
  );
}
