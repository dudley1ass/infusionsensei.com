import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const cream = "bg-[#faf6ef] text-[#1c1710]";
const inkSoft = "text-[#4a3f30]";
const peanut = "text-[#c8924a]";
const peanutDark = "text-[#9e6b2c]";

export function InfusedPeanutButterArticle() {
  return (
    <div className={`min-h-screen ${cream}`}>
      <Helmet>
        <title>How to Make Infused Peanut Butter (That Doesn&apos;t Hit Too Hard) | Infusion Sensei</title>
        <meta
          name="description"
          content="Make THC peanut butter with real dosing math — decarb, infuse oil, blend, and know mg per tablespoon. No guesswork."
        />
        <link rel="canonical" href="https://infusionsensei.com/learn/articles/infused-peanut-butter" />
      </Helmet>

      <div className={`text-sm ${inkSoft} px-4 pt-6 max-w-[760px] mx-auto`}>
        <Link to="/learn" className="hover:text-[#c8924a]">
          Learn
        </Link>{" "}
        / <span className="text-[#1c1710] font-medium">Infused peanut butter guide</span>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#1c1710] px-4 sm:px-8 pt-16 pb-14 text-center">
        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at 60% 0%, #3a2a1a 0%, transparent 65%), radial-gradient(ellipse at 20% 100%, #2a1a0a 0%, transparent 60%)",
          }}
        />
        <div className="relative mx-auto max-w-[780px]">
          <span className="mb-6 inline-block rounded-sm bg-[#c8924a] px-3.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[#1c1710]">
            Controlled infusion guide
          </span>
          <h1 className="font-serif text-[clamp(1.75rem,5vw,3.25rem)] font-black leading-tight text-white">
            How to Make Infused Peanut Butter
            <br />
            <span className={`not-italic ${peanut}`}>That Doesn&apos;t Hit Too Hard</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-base font-light text-[#a89880]">
            The recipe is simple. The dosing is the part everyone skips — and the reason most edibles either do nothing or
            wreck you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[0.8rem] tracking-wide text-[#6e5e4a]">
            <span>Infusion Sensei</span>
            <span className="hidden sm:inline">•</span>
            <span>10 min read</span>
            <span className="hidden sm:inline">•</span>
            <span>Beginner-friendly</span>
          </div>
        </div>
      </section>

      <article className="mx-auto max-w-[760px] px-4 pb-24 pt-14 sm:px-6 font-sans text-[17px] leading-[1.75]">
        {/* Pain block */}
        <div className="relative mb-9 overflow-hidden rounded-lg bg-[#1c1710] px-6 py-9 sm:px-10">
          <span
            className="pointer-events-none absolute -top-5 left-4 font-serif text-[8rem] leading-none text-[#2e2318]"
            aria-hidden
          >
            &quot;
          </span>
          <p className="relative font-serif text-[1.2rem] leading-snug text-[#f0e2c8] sm:text-[1.35rem]">
            Ever made edibles that did <em className={`not-italic ${peanut}`}>absolutely nothing</em>… or ones that had you on
            the couch convinced you were dying? That&apos;s not bad luck. That&apos;s a math problem.
          </p>
        </div>

        <p className={`mb-[18px] ${inkSoft}`}>
          Peanut butter is one of the most underrated bases for cannabis infusion. It&apos;s creamy, fat-dense, endlessly
          versatile, and — when made properly — one of the easiest ways to get a consistent, predictable dose from an edible
          you can actually eat every day.
        </p>
        <p className={`mb-[18px] ${inkSoft}`}>
          The problem isn&apos;t peanut butter. The problem is every recipe online just says{" "}
          <strong className="text-[#1c1710]">add your infused oil</strong> and moves on, like the potency somehow
          doesn&apos;t matter. This guide does it differently. You&apos;re going to make the peanut butter — and you&apos;re
          going to know exactly how strong it is.
        </p>

        <h2 className="mt-14 mb-[18px] font-serif text-[1.75rem] font-bold leading-tight text-[#1c1710]">
          Why Peanut Butter Is Actually Tricky to Dose
        </h2>
        <p className={`mb-[18px] ${inkSoft}`}>
          Most fat-based carriers — butter, coconut oil — are infused and then measured out for recipes. Peanut butter is
          different because{" "}
          <strong className="text-[#1c1710]">people eat it directly, in wildly inconsistent amounts.</strong> One
          person&apos;s tablespoon is another person&apos;s heaping scoop.
        </p>
        <ul className="mb-7 mt-[18px] list-none space-y-0 border-0 p-0">
          {[
            <>
              <strong className="text-[#1c1710]">High fat content = strong THC binding.</strong> Peanut butter&apos;s natural
              fats grab onto cannabinoids efficiently, which is great for absorption — but means potency can concentrate
              unpredictably if you&apos;re not precise.
            </>,
            <>
              <strong className="text-[#1c1710]">No natural portion control.</strong> Unlike a brownie (one square = one
              serving), peanut butter gets spooned, spread, and scooped. You need to define a serving size before you infuse,
              not after.
            </>,
            <>
              <strong className="text-[#1c1710]">People eyeball it.</strong> This is the big one. If you don&apos;t calculate
              the total THC in your jar, you&apos;re guessing every single time you open it. Guessing is how you end up on that
              couch.
            </>,
          ].map((content, i) => (
            <li
              key={i}
              className={`relative border-b border-[#e8dcc8] py-2.5 pl-8 ${inkSoft} last:border-b-0 before:absolute before:left-0 before:font-bold before:text-[#c8924a] before:content-['→']`}
            >
              {content}
            </li>
          ))}
        </ul>

        <div className="my-7 rounded-r-md border-l-4 border-[#c8924a] bg-[#f2dbb8] px-6 py-5">
          <p className={`m-0 text-[1.02rem] font-medium ${peanutDark}`}>
            💡 <strong className="text-[#1c1710]">The golden rule:</strong> Know total milligrams in the jar before you take a
            single spoonful. Everything else flows from that number.
          </p>
        </div>

        <h2 className="mt-14 mb-[18px] font-serif text-[1.75rem] font-bold leading-tight text-[#1c1710]">
          The Real Problem With Most Infusion Recipes
        </h2>
        <p className={`mb-[18px] ${inkSoft}`}>
          Here&apos;s something you&apos;ll notice if you read fifty cannabis peanut butter recipes: almost none of them tell
          you how strong the finished product is. They list ingredients, they walk you through the steps, and then they say
          something like start low and go slow.
        </p>
        <p className={`mb-[18px] ${inkSoft}`}>That&apos;s not guidance. That&apos;s a disclaimer.</p>
        <p className={`mb-[18px] ${inkSoft}`}>
          The reason most edibles fail — either too weak or way too strong — isn&apos;t the recipe.{" "}
          <strong className="text-[#1c1710]">It&apos;s that nobody did the math.</strong> The potency of your infused peanut
          butter depends on four things, and only you know all four of them:
        </p>
        <ul className="mb-7 mt-[18px] list-none space-y-0 p-0">
          {[
            "How many grams of cannabis you used",
            "The THC percentage of that cannabis",
            "How much infused oil ended up in the jar",
            "How many servings you're dividing it into",
          ].map((item, i) => (
            <li
              key={item}
              className={`relative border-b border-[#e8dcc8] py-2.5 pl-8 ${inkSoft} last:border-b-0 before:absolute before:left-0 before:font-bold before:text-[#c8924a] before:content-['→']`}
            >
              {item}
            </li>
          ))}
        </ul>
        <p className={`mb-[18px] ${inkSoft}`}>
          Miss any one of those, and you&apos;re guessing. This section is where we fix that — but first, let&apos;s actually
          make the peanut butter.
        </p>

        <h2 className="mt-14 mb-[18px] font-serif text-[1.75rem] font-bold leading-tight text-[#1c1710]">
          The Method (Simple, On Purpose)
        </h2>
        <p className={`mb-[18px] ${inkSoft}`}>
          There are a dozen ways to make infused peanut butter. Most of them are overcomplicated. Here&apos;s the version that
          works, requires no special equipment, and gets out of your way:
        </p>

        <div className="my-7 space-y-5">
          {[
            {
              n: "1",
              title: "Decarboxylate your cannabis",
              body: "Spread ground flower on a baking sheet. Bake at 240°F (115°C) for 35–40 minutes. This activates the THC. Skip this step and your peanut butter will be a spread, not an edible.",
            },
            {
              n: "2",
              title: "Infuse into a carrier oil",
              body: "Combine your decarbed cannabis with a neutral fat — coconut oil, MCT oil, or light olive oil. Low heat, 2–3 hours. Strain through cheesecloth. You now have infused oil with a known volume.",
            },
            {
              n: "3",
              title: "Blend into peanut butter",
              body: "Stir your infused oil directly into peanut butter — store-bought works perfectly. Mix thoroughly until the oil is fully incorporated and no streaks remain. Label the jar with the date and your dose calculation. Refrigerate.",
            },
          ].map((step) => (
            <div key={step.n} className="flex gap-5">
              <div className="mt-0.5 flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded bg-[#c8924a] font-serif text-[1.1rem] font-bold text-[#1c1710]">
                {step.n}
              </div>
              <div>
                <strong className="mb-1 block text-base text-[#1c1710]">{step.title}</strong>
                <p className={`m-0 text-[0.95rem] ${inkSoft}`}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="my-7 rounded-r-md border-l-4 border-[#c8924a] bg-[#f2dbb8] px-6 py-5">
          <p className={`m-0 text-[1.02rem] font-medium ${peanutDark}`}>
            💡 <strong className="text-[#1c1710]">Pro tip:</strong> Liquid oils (MCT, coconut oil when warm) blend far more
            evenly than solid fats. If you use coconut oil, warm the peanut butter slightly before mixing so it doesn&apos;t
            seize up.
          </p>
        </div>
        <p className={`mb-[18px] ${inkSoft}`}>
          That&apos;s it. The recipe isn&apos;t complex. Your advantage here is clarity — you know exactly what went in, so you
          can calculate exactly what you&apos;re getting out.
        </p>

        {/* Money section */}
        <div className="relative my-12 overflow-hidden rounded-xl bg-[#1c1710] px-6 py-10 sm:px-10 sm:py-12">
          <span
            className="pointer-events-none absolute right-[-20px] top-1/2 hidden -translate-y-1/2 rotate-90 font-serif text-[5rem] font-black tracking-tight text-[#2a1e12] sm:block"
            aria-hidden
          >
            DOSE
          </span>
          <div className="relative">
            <span className="mb-5 inline-flex items-center gap-2 rounded-sm bg-[#e05c2a] px-3.5 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-white">
              🔥 The part that actually matters
            </span>
            <h2 className="mb-3 mt-0 font-serif text-[1.9rem] font-bold text-white">How Strong Is Your Peanut Butter?</h2>
            <p className="mb-8 max-w-[500px] text-[#a89880]">Here&apos;s the math most recipes skip. Walk through this once and you&apos;ll never guess your dose again.</p>

            <div className="relative mb-7 rounded-lg bg-[#141008] px-4 py-6 sm:px-8 sm:py-7">
              {[
                ["Cannabis used", "3.5g (⅛ oz)"],
                ["THC percentage", "20%"],
                ["Total THC (grams × % × 1000)", "700mg total THC"],
                ["Assumed absorption efficiency", "~80%"],
                ["Estimated usable THC", "~560mg"],
                ["Jar size / tablespoon servings", "24 servings (1 tbsp each)"],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-[#2e2318] py-3 text-[0.95rem]"
                >
                  <span className="text-[#7a6a52]">{label}</span>
                  <span className="font-mono font-semibold text-[#f0e2c8]">{val}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-b-0 py-3">
                <span className="text-[#7a6a52]">THC per serving (1 tbsp)</span>
                <span className="font-serif text-[1.2rem] font-bold text-[#c8924a]">≈ 23mg per tablespoon</span>
              </div>
              <p className="border-t border-[#2e2318] pt-2.5 text-[0.82rem] italic text-[#4a3a25]">
                Formula: (grams × THC% × 1000 × efficiency) ÷ number of servings
              </p>
            </div>

            <p className="mb-6 text-[#c8a87a]">You can run this math manually every time — or let the calculator do it in seconds.</p>
            <Link
              to="/thc-calculator"
              className="inline-flex items-center gap-2.5 rounded-md bg-[#c8924a] px-6 py-3.5 text-[0.92rem] font-semibold tracking-wide text-[#1c1710] transition-colors hover:bg-[#9e6b2c] hover:text-white"
            >
              <span>Use the Infusion Sensei calculator</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <h2 className="mt-14 mb-[18px] font-serif text-[1.75rem] font-bold leading-tight text-[#1c1710]">
          Portioning: This Is Where Trust Gets Built
        </h2>
        <p className={`mb-6 ${inkSoft}`}>
          Using the example above — 3.5g at 20% THC, blended into a 16oz jar — here&apos;s what your serving sizes actually look
          like:
        </p>

        <div className="overflow-x-auto">
          <table className="mb-8 w-full border-collapse text-[0.93rem]">
            <thead>
              <tr>
                {["Serving", "Approx. THC", "Best for", "Level"].map((h) => (
                  <th
                    key={h}
                    className={`bg-[#f2dbb8] px-3 py-3 text-left text-[0.78rem] font-semibold uppercase tracking-wide ${peanutDark} sm:px-4`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["½ tsp", "~6mg", "First-timers, microdose", "Beginner", "bg-[#e8f2e9] text-[#3a6b3e]"],
                ["1 tsp", "~8mg", "Low, functional dose", "Light", "bg-[#e8f2e9] text-[#3a6b3e]"],
                ["½ tbsp", "~12mg", "Experienced users", "Moderate", "bg-[#fef9e7] text-[#a07c00]"],
                ["1 tbsp", "~23mg", "High tolerance, nighttime", "Strong", "bg-[#fce8e3] text-[#c0391b]"],
                ["Spread on toast", "~15–25mg", "Depends how heavy-handed you are — weigh it", "Variable", "bg-[#fef9e7] text-[#a07c00]"],
              ].map(([serving, thc, best, level, badgeClass]) => (
                <tr key={serving} className="border-b border-[#e8dcc8] last:border-b-0">
                  <td className="whitespace-nowrap px-3 py-3 font-semibold text-[#1c1710] sm:px-4">{serving}</td>
                  <td className={`px-3 py-3 ${inkSoft} sm:px-4`}>{thc}</td>
                  <td className={`px-3 py-3 ${inkSoft} sm:px-4`}>{best}</td>
                  <td className="px-3 py-3 sm:px-4">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[0.72rem] font-semibold tracking-wide ${badgeClass}`}>
                      {level}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="my-7 rounded-r-md border-l-4 border-[#c8924a] bg-[#f2dbb8] px-6 py-5">
          <p className={`m-0 text-[1.02rem] font-medium ${peanutDark}`}>
            💡 <strong className="text-[#1c1710]">Real talk:</strong> Spread on toast is not a serving size. Use a measuring
            spoon and mean it, at least until you know exactly how you respond to this particular batch.
          </p>
        </div>
        <p className={`mb-[18px] ${inkSoft}`}>
          The numbers above shift based on your starting material. A 25% flower at 4g produces a very different jar than 2g at
          15%. This is exactly why the calculator exists — so you can change any variable and see your dose per serving update
          instantly, rather than redoing the arithmetic in your head at 10pm.
        </p>

        <div className="my-10 rounded-lg border-[1.5px] border-[#b4d4b8] bg-[#e8f2e9] px-6 py-7 sm:px-8">
          <h3 className="mb-4 mt-0 text-[0.85rem] font-semibold uppercase tracking-[0.1em] text-[#3a6b3e]">
            🌿 Before You Take Your First Spoonful
          </h3>
          <ul className="m-0 list-none p-0">
            {[
              <>
                <strong className="text-[#2d5230]">Start at half the dose you think you need.</strong> Seriously. Even experienced users can be surprised by edibles from a new batch.
              </>,
              <>
                <strong className="text-[#2d5230]">Wait the full window.</strong> Edibles processed through fat can take 1 to 2 hours to peak — sometimes longer if you&apos;ve eaten a full meal. Don&apos;t redose at 45 minutes because you don&apos;t feel anything yet.
              </>,
              <>
                <strong className="text-[#2d5230]">Bioavailability varies person to person.</strong> Your body weight, metabolism, tolerance, and whether you&apos;ve eaten all affect how intensely you feel the same dose.
              </>,
              <>
                <strong className="text-[#2d5230]">Label your jar clearly.</strong> Write the THC per tablespoon right on the lid. Anyone else in your home who opens that jar should know what they&apos;re dealing with before they eat it.
              </>,
              <>
                <strong className="text-[#2d5230]">Store in the fridge.</strong> Keeps the peanut butter fresh, slows oil separation, and naturally discourages casual snacking from the jar. 2–3 weeks shelf life.
              </>,
            ].map((item, i) => (
              <li
                key={i}
                className="relative border-b border-[#c8e0cc] py-2 pl-7 text-[0.95rem] text-[#2d5230] last:border-b-0 before:absolute before:left-0 before:font-bold before:text-[#3a6b3e] before:content-['✓']"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-16 overflow-hidden rounded-xl bg-[#1c1710] px-6 py-12 text-center sm:px-12">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, #3a2a1a 0%, transparent 70%)",
            }}
          />
          <div className="relative">
            <h2 className="mb-3.5 font-serif text-[2rem] font-bold text-white">Stop Guessing Your Dose</h2>
            <p className="mx-auto mb-8 max-w-[440px] text-[1.02rem] text-[#a89880]">
              You made the peanut butter right. Don&apos;t leave the most important part to chance. The Infusion Sensei
              calculator handles all the math — just enter your numbers and walk away knowing exactly what&apos;s in every
              spoonful.
            </p>
            <Link
              to="/thc-calculator"
              className="inline-flex items-center gap-2.5 rounded-md bg-[#c8924a] px-8 py-4 text-base font-bold tracking-wide text-[#1c1710] transition-all hover:bg-[#d99e58] hover:-translate-y-px"
            >
              <span>Open the dosing calculator</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <hr className="mt-14 border-0 border-t-2 border-[#e8dcc8]" />

        <p className="mt-10 border-t border-[#e8dcc8] pt-6 text-[0.78rem] leading-relaxed text-[#9a8b78]">
          <strong className="text-[#4a3f30]">Disclaimer:</strong> This article is intended for educational purposes and for
          adults in jurisdictions where cannabis use is legal. Cannabis affects each individual differently. This is not medical
          advice. Always follow your local laws and consult a healthcare professional if you have questions about cannabis and
          your health. Keep all infused products clearly labeled and out of reach of children and pets.
        </p>
      </article>
    </div>
  );
}
