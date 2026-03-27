import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DoseRow {
  serving: string;
  thc: string;
  bestFor: string;
  level: "beginner" | "light" | "moderate" | "strong";
}

interface StepItem {
  num: number;
  title: string;
  body: string;
  tip?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DOSE_ROWS: DoseRow[] = [
  { serving: "1 tsp spread", thc: "~4–6mg", bestFor: "First-timers, microdose", level: "beginner" },
  { serving: "1 tbsp (thin layer)", thc: "~10–12mg", bestFor: "Light functional dose", level: "light" },
  { serving: "2 tbsp (standard bagel)", thc: "~20–24mg", bestFor: "Experienced users, evening", level: "moderate" },
  { serving: "3 tbsp (generous spread)", thc: "~30–36mg", bestFor: "High tolerance, nighttime", level: "strong" },
];

const STEPS: StepItem[] = [
  {
    num: 1,
    title: "Decarboxylate",
    body: "Spread ground flower on a lined baking sheet. Bake at 240°F (115°C) for 35–40 minutes. Don't skip this — it activates the THC. Raw flower stirred into cream cheese does absolutely nothing.",
    tip: "Your kitchen will smell. Open a window.",
  },
  {
    num: 2,
    title: "Infuse into a neutral oil",
    body: "Combine decarbed cannabis with MCT oil or light neutral oil. Low heat (160–180°F) for 2–3 hours. Strain through cheesecloth. You want a clean, measured volume — not plant matter in your schmear.",
  },
  {
    num: 3,
    title: "Blend into softened cream cheese",
    body: "Let cream cheese reach room temperature first — this is non-negotiable. Cold cream cheese and oil don't bind evenly, meaning hot-spot dosing. Stir your measured oil in slowly until fully incorporated and streak-free.",
    tip: "A hand mixer on low gives the most consistent blend.",
  },
  {
    num: 4,
    title: "Label, refrigerate, respect it",
    body: "Spoon into an airtight container. Write the THC per tablespoon on the lid before it goes in the fridge. Not later — now. Shelf life mirrors regular cream cheese: 1–2 weeks refrigerated.",
  },
];

const BADGE_STYLES: Record<
  DoseRow["level"],
  { bg: string; text: string; label: string }
> = {
  beginner: { bg: "#e8f4ea", text: "#2d6b35", label: "Beginner" },
  light: { bg: "#e8f0f4", text: "#1e5070", label: "Light" },
  moderate: { bg: "#fef6e4", text: "#8a6500", label: "Moderate" },
  strong: { bg: "#fce9e4", text: "#b83020", label: "Strong" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function Badge({ level }: { level: DoseRow["level"] }) {
  const s = BADGE_STYLES[level];
  return (
    <span
      style={{
        display: "inline-block",
        background: s.bg,
        color: s.text,
        fontSize: "0.72rem",
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: "20px",
        letterSpacing: "0.04em",
      }}
    >
      {s.label}
    </span>
  );
}

function Callout({ color, children }: { color: "green" | "orange"; children: React.ReactNode }) {
  const isGreen = color === "green";
  return (
    <div
      style={{
        borderLeft: `4px solid ${isGreen ? "#5a9e60" : "#c9602a"}`,
        background: isGreen ? "#e8f4ea" : "#fef0e8",
        padding: "18px 22px",
        borderRadius: "0 6px 6px 0",
        margin: "28px 0",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "1.85rem",
        fontWeight: 700,
        color: "#1a1a1a",
        margin: "56px 0 18px",
        lineHeight: 1.2,
      }}
    >
      {children}
    </h2>
  );
}

function BodyText({ children, mb = "18px" }: { children: React.ReactNode; mb?: string }) {
  return (
    <p style={{ color: "#4a4a4a", lineHeight: 1.8, marginBottom: mb, fontSize: "0.97rem" }}>
      {children}
    </p>
  );
}

// ─── Interactive Dose Calculator ─────────────────────────────────────────────
function DoseCalculator() {
  const [grams, setGrams] = useState(3.5);
  const [thcPct, setThcPct] = useState(20);
  const [servings, setServings] = useState(20);

  const totalThc = grams * (thcPct / 100) * 1000;
  const usable = totalThc * 0.8;
  const perServing = usable / servings;

  const sliders = [
    { label: "Cannabis (grams)", value: grams, setter: setGrams, min: 0.5, max: 7, step: 0.5, unit: "g" },
    { label: "THC Percentage", value: thcPct, setter: setThcPct, min: 10, max: 35, step: 1, unit: "%" },
    { label: "Servings in batch", value: servings, setter: setServings, min: 5, max: 40, step: 1, unit: " tbsp" },
  ];

  return (
    <div
      style={{
        background: "#0f1a10",
        borderRadius: "12px",
        padding: "42px 42px 38px",
        margin: "52px 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative BG text */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-14px",
          top: "50%",
          transform: "translateY(-50%) rotate(90deg)",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "5.5rem",
          fontWeight: 700,
          color: "#1a2e1c",
          letterSpacing: "-0.04em",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        DOSE
      </span>

      {/* Fire label */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "#c9602a",
          color: "#fff",
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "5px 14px",
          borderRadius: "2px",
          marginBottom: "18px",
        }}
      >
        🔥 The Part That Actually Matters
      </div>

      <h2
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "1.9rem",
          fontWeight: 700,
          color: "#fff",
          margin: "0 0 10px",
          lineHeight: 1.2,
        }}
      >
        How Strong Is Your Cream Cheese?
      </h2>
      <p
        style={{
          color: "#7a9c7e",
          marginBottom: "32px",
          fontSize: "0.95rem",
          maxWidth: "480px",
          lineHeight: 1.65,
        }}
      >
        Adjust the sliders below. Your dose per tablespoon updates live.
        No napkin math required.
      </p>

      {/* Sliders */}
      <div style={{ display: "grid", gap: "22px", marginBottom: "32px", maxWidth: "500px" }}>
        {sliders.map(({ label, value, setter, min, max, step, unit }) => (
          <div key={label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "9px" }}>
              <label style={{ fontSize: "0.82rem", color: "#6a8a6e", letterSpacing: "0.05em" }}>
                {label}
              </label>
              <span style={{ fontSize: "0.92rem", color: "#d4e8d6", fontWeight: 600 }}>
                {value}{unit}
              </span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={(e) => setter(Number(e.target.value))}
              style={{ width: "100%", accentColor: "#5a9e60", cursor: "pointer" }}
            />
          </div>
        ))}
      </div>

      {/* Results panel */}
      <div
        style={{
          background: "#070e08",
          borderRadius: "8px",
          padding: "24px 28px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0",
            marginBottom: "0",
          }}
        >
          {[
            { label: "Total THC", value: `${totalThc.toFixed(0)}mg` },
            { label: "Usable THC (~80%)", value: `${usable.toFixed(0)}mg` },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                padding: "14px 16px",
                borderBottom: "1px solid #1a2e1c",
                borderRight: "1px solid #1a2e1c",
              }}
            >
              <div style={{ fontSize: "0.73rem", color: "#4a6a4e", marginBottom: "5px", letterSpacing: "0.04em" }}>
                {label}
              </div>
              <div style={{ fontSize: "1.05rem", color: "#c8deca", fontWeight: 600 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Big number */}
        <div style={{ padding: "22px 16px 14px", textAlign: "center" }}>
          <div
            style={{
              fontSize: "0.76rem",
              color: "#4a6a4e",
              marginBottom: "8px",
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}
          >
            THC per tablespoon
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "3.4rem",
              fontWeight: 700,
              color: "#7ec882",
              lineHeight: 1,
            }}
          >
            {perServing.toFixed(1)}
            <span style={{ fontSize: "1.5rem", color: "#5a9e60", marginLeft: "6px" }}>mg</span>
          </div>
          <div style={{ fontSize: "0.78rem", color: "#3a5a3e", marginTop: "8px" }}>
            per 1 tablespoon serving
          </div>
        </div>
      </div>

      <p
        style={{
          marginTop: "18px",
          color: "#3a5a3e",
          fontSize: "0.8rem",
          fontStyle: "italic",
        }}
      >
        Formula: (grams × THC% × 1000 × 0.80) ÷ servings
      </p>

      <p style={{ marginTop: "16px", color: "#6a8a6e", fontSize: "0.88rem" }}>
        Want to run this with your exact numbers and strain data?
      </p>
      <a
        href="#"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          marginTop: "12px",
          background: "#5a9e60",
          color: "#fff",
          fontWeight: 600,
          fontSize: "0.9rem",
          padding: "13px 22px",
          borderRadius: "6px",
          textDecoration: "none",
          letterSpacing: "0.01em",
        }}
      >
        Open Full InfusionSensei Calculator →
      </a>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function InfusedCreamCheeseArticle() {
  return (
    <div
      style={{
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        background: "#f8f7f4",
        minHeight: "100vh",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input[type=range] {
          -webkit-appearance: none; appearance: none;
          height: 4px; background: #1a2e1c; border-radius: 2px; outline: none;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; width: 18px; height: 18px;
          border-radius: 50%; background: #5a9e60; cursor: pointer; border: 2px solid #0f1a10;
        }
        input[type=range]::-moz-range-thumb {
          width: 18px; height: 18px; border-radius: 50%;
          background: #5a9e60; cursor: pointer; border: 2px solid #0f1a10;
        }
        @media (max-width: 640px) {
          .is-hero { flex-direction: column !important; }
          .is-hero-visual { display: none !important; }
          .is-hero-text { padding: 48px 24px 40px !important; border-right: none !important; }
        }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e4dc",
          padding: "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.25rem",
            fontWeight: 700,
            color: "#1a1a1a",
            letterSpacing: "0.02em",
          }}
        >
          Infusion<span style={{ color: "#5a9e60" }}>Sensei</span>
        </div>
        <nav style={{ display: "flex", gap: "28px" }}>
          {["Recipes", "Calculator", "Guides"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                color: "#7a7a7a",
                textDecoration: "none",
                fontSize: "0.8rem",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {item}
            </a>
          ))}
        </nav>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "#fff",
          borderBottom: "1px solid #e8e4dc",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          className="is-hero"
          style={{ display: "flex", minHeight: "420px" }}
        >
          {/* Text */}
          <div
            className="is-hero-text"
            style={{
              flex: 1,
              padding: "72px 56px 64px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              borderRight: "1px solid #e8e4dc",
            }}
          >
            <div style={{ display: "flex", gap: "10px", marginBottom: "22px", flexWrap: "wrap" }}>
              {[
                { bg: "#1a2e1c", color: "#a8c9ac", text: "Controlled Infusion Guide" },
                { bg: "#f0ede8", color: "#7a6a52", text: "Eat-Direct Base" },
              ].map(({ bg, color, text }) => (
                <span
                  key={text}
                  style={{
                    background: bg,
                    color,
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "5px 13px",
                    borderRadius: "2px",
                  }}
                >
                  {text}
                </span>
              ))}
            </div>

            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 700,
                color: "#1a1a1a",
                lineHeight: 1.15,
                marginBottom: "18px",
              }}
            >
              How to Make Infused<br />
              Cream Cheese That<br />
              <em style={{ color: "#5a9e60", fontStyle: "normal" }}>
                You Can Actually Dose
              </em>
            </h1>

            <p
              style={{
                color: "#6a6a6a",
                fontSize: "1rem",
                lineHeight: 1.72,
                maxWidth: "400px",
                fontWeight: 300,
              }}
            >
              Cream cheese is one of the most overlooked edible carriers — fat-rich, 
              versatile, and discreet. The catch? Most people infuse it blind. 
              Here's how to do it with real numbers.
            </p>

            <div
              style={{
                marginTop: "28px",
                display: "flex",
                gap: "6px",
                fontSize: "0.78rem",
                color: "#aaa",
                flexWrap: "wrap",
              }}
            >
              {["InfusionSensei", "·", "8 min read", "·", "Beginner-Friendly"].map((m, i) => (
                <span key={i} style={{ color: i % 2 === 1 ? "#ddd" : "#aaa" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Visual panel */}
          <div
            className="is-hero-visual"
            style={{
              width: "380px",
              flexShrink: 0,
              background: "linear-gradient(155deg, #e8f4ea 0%, #f2f8f3 45%, #faf9f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {[280, 200, 120].map((size) => (
              <div
                key={size}
                style={{
                  position: "absolute",
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: "50%",
                  border: "1px solid #c8deca",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
            <div style={{ textAlign: "center", position: "relative" }}>
              <div style={{ fontSize: "4.5rem", marginBottom: "12px" }}>🧀</div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "0.9rem",
                  color: "#4a7a50",
                  fontStyle: "italic",
                  letterSpacing: "0.06em",
                }}
              >
                Eat-Direct Base Series
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE BODY ───────────────────────────────────────────────── */}
      <article
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "60px 24px 100px",
        }}
      >

        {/* Hook */}
        <div
          style={{
            background: "#1a2e1c",
            borderRadius: "8px",
            padding: "38px 42px",
            marginBottom: "48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "-20px",
              left: "18px",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "9rem",
              color: "#0f1a10",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            "
          </span>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.4rem",
              lineHeight: 1.55,
              color: "#d4e8d6",
              margin: 0,
              position: "relative",
            }}
          >
            You made your infused oil. You stirred it into cream cheese. You spread it on a bagel.
            Then you waited two hours and felt{" "}
            <em style={{ color: "#7ec882", fontStyle: "normal" }}>absolutely wrecked</em> — or
            absolutely nothing. Sound familiar?
          </p>
        </div>

        <BodyText>
          Cream cheese is having a moment in the infused edibles world, and for good reason.
          It's one of the richest fat-based carriers you already have in your fridge. It absorbs
          THC exceptionally well, it spreads onto everything — bagels, crackers, celery, wraps,
          toast — and it's discreet enough that a labeled container in your fridge looks like
          ordinary food.
        </BodyText>
        <BodyText>
          The problem is that cream cheese gets <strong style={{ color: "#1a1a1a" }}>spread, not scooped</strong>.
          People free-pour. They smear liberally. They come back for a second cracker "just to taste."
          Without knowing the milligrams per tablespoon going in, you have no idea what you're consuming.
        </BodyText>
        <BodyText mb="40px">
          This guide fixes that. The recipe is four steps. The dose math is where it gets genuinely useful.
        </BodyText>

        {/* Section 2 */}
        <SectionHeading>Why Cream Cheese Is One of the Trickiest Bases to Dose</SectionHeading>
        <BodyText>
          Unlike a brownie (one square = one serving) or a pre-dosed gummy, cream cheese is an open
          container that invites improvisation every time you open it. Here's what makes it particularly
          deceptive:
        </BodyText>

        {[
          {
            title: "High fat = high THC absorption.",
            body: "Full-fat cream cheese is roughly 35% fat by weight. That's excellent for cannabinoid binding — the THC bonds tightly and absorbs efficiently. Which means potency can hit harder than you expect from what feels like a 'light snack.'",
          },
          {
            title: "No natural portion control.",
            body: "A tub has no pre-cut lines. A tablespoon on a bagel is whatever pressure you're applying to the knife at 8am. Until you measure consistently, every serving is a guess.",
          },
          {
            title: "People treat it as a condiment, not an edible.",
            body: "It looks like regular cream cheese. It's sitting in your fridge next to the non-infused stuff. The mental cue to be careful isn't as strong as it is with a brownie labeled EDIBLE. This is how people accidentally double-dose before brunch.",
          },
          {
            title: "Fat distribution can be uneven if blended cold.",
            body: "If you stir your infused oil into cold cream cheese, the oil pockets rather than distributing evenly — meaning one tablespoon might be 5mg and another might be 30mg from the same container. Room temperature blend, every time.",
          },
        ].map(({ title, body }) => (
          <div
            key={title}
            style={{
              padding: "16px 0 16px 26px",
              borderLeft: "2px solid #c8deca",
              marginBottom: "16px",
            }}
          >
            <strong
              style={{
                display: "block",
                color: "#1a1a1a",
                marginBottom: "6px",
                fontSize: "0.96rem",
              }}
            >
              {title}
            </strong>
            <p style={{ margin: 0, color: "#5a5a5a", lineHeight: 1.72, fontSize: "0.94rem" }}>
              {body}
            </p>
          </div>
        ))}

        <Callout color="green">
          <p style={{ margin: 0, fontWeight: 500, color: "#2d6b35", fontSize: "0.97rem" }}>
            💡 <strong style={{ color: "#1a1a1a" }}>The core rule:</strong> Calculate total milligrams
            before you open the container. Define one serving size and stick to it. The math takes
            two minutes. A bad experience takes twelve hours.
          </p>
        </Callout>

        {/* Section 3 */}
        <SectionHeading>The Real Problem? Nobody Does the Math.</SectionHeading>
        <BodyText>
          Search for "infused cream cheese recipe" and you'll find pages that tell you to add infused
          butter or oil, mix it in, and enjoy. The potency section — if it exists — says something like
          <em> "adjust to your tolerance."</em>
        </BodyText>
        <BodyText>
          That's not dosing guidance. That's a liability disclaimer wearing a recipe costume.
        </BodyText>
        <BodyText mb="40px">
          Your potency depends on four things: grams of cannabis, the THC percentage of that flower,
          how much infused oil made it into the container, and how many tablespoon servings are in the tub.
          Every one of those variables is in your control — but only if you write them down. Let's make
          the cream cheese first, then nail the numbers.
        </BodyText>

        {/* Section 4: Method */}
        <SectionHeading>The Method</SectionHeading>
        <BodyText>
          No special equipment required. This works with a bowl, a spoon, and one hour of patience
          during the infusion step.
        </BodyText>

        <div style={{ marginTop: "28px" }}>
          {STEPS.map((step) => (
            <div
              key={step.num}
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "28px",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "40px",
                  height: "40px",
                  background: "#1a2e1c",
                  color: "#a8c9ac",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  marginTop: "3px",
                }}
              >
                {step.num}
              </div>
              <div style={{ flex: 1 }}>
                <strong
                  style={{
                    display: "block",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#1a1a1a",
                    marginBottom: "6px",
                  }}
                >
                  {step.title}
                </strong>
                <p style={{ margin: 0, color: "#4a4a4a", lineHeight: 1.72, fontSize: "0.95rem" }}>
                  {step.body}
                </p>
                {step.tip && (
                  <p style={{ margin: "8px 0 0", fontSize: "0.84rem", color: "#3d6b42", fontStyle: "italic" }}>
                    ↳ {step.tip}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <Callout color="green">
          <p style={{ margin: 0, fontWeight: 500, color: "#2d6b35", fontSize: "0.97rem" }}>
            💡 <strong style={{ color: "#1a1a1a" }}>Flavor note:</strong> MCT oil is nearly flavorless
            and the best choice here — it won't compete with the cream cheese. Coconut oil adds slight
            sweetness that works on sweet applications but can taste strange in savory ones.
          </p>
        </Callout>

        {/* Section 5: Dose Calculator */}
        <DoseCalculator />

        {/* Section 6: Portioning */}
        <SectionHeading>Portioning — This Is Where Trust Gets Built</SectionHeading>
        <BodyText>
          Using a standard batch — 3.5g at 20% THC blended into a 250g tub — here's what your
          real-world servings actually look like. These assume even distribution and 80% decarb
          efficiency, which is a realistic working estimate.
        </BodyText>

        <div style={{ overflowX: "auto", margin: "24px 0 32px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.91rem" }}>
            <thead>
              <tr style={{ background: "#e8f4ea" }}>
                {["Serving", "Approx. THC", "Best For", "Level"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "12px 16px",
                      color: "#2d6b35",
                      fontWeight: 600,
                      fontSize: "0.74rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DOSE_ROWS.map((row, i) => (
                <tr key={row.serving} style={{ background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
                  <td
                    style={{
                      padding: "13px 16px",
                      borderBottom: "1px solid #ede9e0",
                      fontWeight: 600,
                      color: "#1a1a1a",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {row.serving}
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #ede9e0", color: "#3a3a3a", fontWeight: 500 }}>
                    {row.thc}
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #ede9e0", color: "#5a5a5a", fontSize: "0.87rem" }}>
                    {row.bestFor}
                  </td>
                  <td style={{ padding: "13px 16px", borderBottom: "1px solid #ede9e0" }}>
                    <Badge level={row.level} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout color="orange">
          <p style={{ margin: 0, fontWeight: 500, color: "#8a3a10", fontSize: "0.97rem" }}>
            ⚠️ <strong style={{ color: "#1a1a1a" }}>The bagel problem:</strong> A generously loaded
            bagel can easily carry 3–4 tablespoons of cream cheese. At moderate potency that's 60–80mg
            before you've finished breakfast. Use a measuring spoon and mean it for the first few uses
            of any new batch.
          </p>
        </Callout>

        {/* Section 7: Safety */}
        <div
          style={{
            background: "#e8f4ea",
            border: "1.5px solid #b4d4b8",
            borderRadius: "10px",
            padding: "32px 36px",
            margin: "44px 0",
          }}
        >
          <h3
            style={{
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "#2d6b35",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              marginBottom: "20px",
            }}
          >
            🌿 Before Your First Spread
          </h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              { s: "Start at half the dose you think you need.", b: " Even experienced users get surprised by a well-made batch from a new strain or source." },
              { s: "Fat slows onset.", b: " Edibles consumed with a fatty base can take 1.5–2 hours to peak. Don't redose because you haven't felt it in 45 minutes." },
              { s: "Your morning metabolism matters.", b: " An empty stomach speeds onset; a full breakfast slows it. If this is your first thing of the day, expect faster effects." },
              { s: "Label the container loudly.", b: " Write the dose per tablespoon on the lid before it goes in the fridge. Anyone opening your fridge deserves to know what they're looking at." },
              { s: "Keep infused and non-infused separate.", b: " Store in a dedicated labeled container. Never in the same tub as the regular cream cheese." },
            ].map(({ s, b }, i, arr) => (
              <li
                key={s}
                style={{
                  display: "flex",
                  gap: "12px",
                  padding: "10px 0",
                  borderBottom: i < arr.length - 1 ? "1px solid #c8e0cc" : "none",
                  fontSize: "0.93rem",
                  lineHeight: 1.65,
                }}
              >
                <span style={{ color: "#4a9e50", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>✓</span>
                <span style={{ color: "#2d5230" }}>
                  <strong style={{ color: "#1a2e1c" }}>{s}</strong>
                  {b}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 8: Final CTA */}
        <div
          style={{
            background: "#1a2e1c",
            borderRadius: "12px",
            padding: "56px 48px",
            textAlign: "center",
            marginTop: "60px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 50% 0%, #2d4a2e 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.2rem",
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 14px",
              position: "relative",
              lineHeight: 1.2,
            }}
          >
            Stop Guessing Your Dose
          </h2>
          <p
            style={{
              color: "#7a9c7e",
              fontSize: "1rem",
              maxWidth: "420px",
              margin: "0 auto 32px",
              position: "relative",
              lineHeight: 1.72,
            }}
          >
            You made the cream cheese right. Enter your numbers once, get your dose per serving, and
            stop doing math at 7am before your first coffee.
          </p>
          <a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              background: "#5a9e60",
              color: "#fff",
              fontWeight: 700,
              fontSize: "1rem",
              padding: "16px 32px",
              borderRadius: "6px",
              textDecoration: "none",
              position: "relative",
              letterSpacing: "0.01em",
            }}
          >
            Open the InfusionSensei Calculator →
          </a>
        </div>

        {/* Disclaimer */}
        <p
          style={{
            fontSize: "0.76rem",
            color: "#9a9a8a",
            lineHeight: 1.65,
            marginTop: "48px",
            paddingTop: "24px",
            borderTop: "1px solid #e8e4dc",
          }}
        >
          <strong>Disclaimer:</strong> This content is for educational purposes and intended for adults
          in jurisdictions where cannabis is legal. Effects vary by individual. This is not medical advice.
          Keep all infused products clearly labeled and out of reach of children and pets. Consult a
          healthcare professional with questions about cannabis and your health.
        </p>
      </article>
    </div>
  );
}
