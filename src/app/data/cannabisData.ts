// 🌿 Cannabis Components Data

export interface Cannabinoid {
  name: string;
  abbr: string;
  description: string;
  effects: string[];
}

export interface Terpene {
  name: string;
  aroma: string;
  effects: string[];
  color: string; // for UI badges
}

export interface Strain {
  name: string;
  type: "sativa" | "indica" | "hybrid" | "custom";
  isCustom?: boolean;
  
  // Cannabinoids (percentages)
  cannabinoids: {
    thc: number;      // Main psychoactive
    cbd: number;      // Non-intoxicating, calming
    cbn: number;      // Sleepy/degraded THC
    cbg: number;      // Minor, subtle effects
  };
  
  // Dominant terpenes (up to 3)
  terpenes: string[]; // Array of terpene names
  
  // Display
  thcMin?: number;
  thcMax?: number;
  description?: string;
}

// 🧪 CANNABINOID LIBRARY
export const cannabinoids: Record<string, Cannabinoid> = {
  thc: {
    name: "THC",
    abbr: "Δ⁹-THC",
    description: "Tetrahydrocannabinol - the main psychoactive compound",
    effects: ["Euphoria", "Relaxation", "Pain relief", "Increased appetite"],
  },
  cbd: {
    name: "CBD",
    abbr: "CBD",
    description: "Cannabidiol - non-intoxicating, therapeutic compound",
    effects: ["Calming", "Anti-anxiety", "Anti-inflammatory", "No high"],
  },
  cbn: {
    name: "CBN",
    abbr: "CBN",
    description: "Cannabinol - degraded THC, sedative properties",
    effects: ["Sleepy", "Sedative", "Relaxing", "Aged cannabis"],
  },
  cbg: {
    name: "CBG",
    abbr: "CBG",
    description: "Cannabigerol - the 'mother cannabinoid', subtle effects",
    effects: ["Focus", "Anti-bacterial", "Mild", "Precursor to THC/CBD"],
  },
};

// 🌸 TERPENE LIBRARY
export const terpenes: Record<string, Terpene> = {
  myrcene: {
    name: "Myrcene",
    aroma: "Earthy, musky, herbal",
    effects: ["Relaxing", "Couch-lock", "Sedative", "Pain relief"],
    color: "purple",
  },
  limonene: {
    name: "Limonene",
    aroma: "Citrus, lemon, orange",
    effects: ["Uplifting", "Energizing", "Stress relief", "Mood boost"],
    color: "yellow",
  },
  pinene: {
    name: "Pinene",
    aroma: "Pine, fresh, sharp",
    effects: ["Alert", "Focus", "Memory", "Anti-inflammatory"],
    color: "green",
  },
  linalool: {
    name: "Linalool",
    aroma: "Lavender, floral, sweet",
    effects: ["Calming", "Anti-anxiety", "Sedative", "Stress relief"],
    color: "purple",
  },
  caryophyllene: {
    name: "Caryophyllene",
    aroma: "Pepper, spice, woody",
    effects: ["Pain relief", "Anti-inflammatory", "Stress relief", "Unique"],
    color: "orange",
  },
  humulene: {
    name: "Humulene",
    aroma: "Earthy, woody, hoppy",
    effects: ["Appetite suppressant", "Anti-bacterial", "Anti-inflammatory"],
    color: "amber",
  },
  terpinolene: {
    name: "Terpinolene",
    aroma: "Fresh, herbal, floral",
    effects: ["Uplifting", "Sedative", "Anti-bacterial", "Complex"],
    color: "blue",
  },
};

// 🔥 COOKING IMPACT INFO
export const cookingImpact = {
  lowTemp: {
    range: "160-180°F",
    thcRetention: "95-100%",
    terpeneRetention: "80-90%",
    notes: "Best for preserving terpenes and flavor complexity",
  },
  mediumTemp: {
    range: "180-220°F",
    thcRetention: "90-95%",
    terpeneRetention: "50-70%",
    notes: "Good balance of potency and some terpene preservation",
  },
  highTemp: {
    range: "220-300°F",
    thcRetention: "85-90%",
    terpeneRetention: "20-40%",
    notes: "Stronger THC but less complex - terpenes evaporate",
  },
  decarb: {
    range: "230-250°F",
    thcRetention: "85-90%",
    terpeneRetention: "60-70%",
    notes: "Essential for activation, some terpene loss expected",
  },
};

// 📚 PRE-DEFINED STRAINS (with full cannabinoid/terpene profiles)
export const defaultStrains: Strain[] = [
  {
    name: "Custom",
    type: "custom",
    cannabinoids: { thc: 20, cbd: 0, cbn: 0, cbg: 0 },
    terpenes: [],
  },
  {
    name: "Sour Diesel",
    type: "sativa",
    thcMin: 19,
    thcMax: 25,
    cannabinoids: { thc: 22, cbd: 0.2, cbn: 0, cbg: 0.1 },
    terpenes: ["limonene", "caryophyllene", "myrcene"],
    description: "Energizing, uplifting diesel aroma",
  },
  {
    name: "Blue Dream",
    type: "hybrid",
    thcMin: 17,
    thcMax: 24,
    cannabinoids: { thc: 20, cbd: 0.1, cbn: 0, cbg: 0.1 },
    terpenes: ["myrcene", "pinene", "caryophyllene"],
    description: "Balanced, fruity, relaxing yet focused",
  },
  {
    name: "Girl Scout Cookies",
    type: "hybrid",
    thcMin: 20,
    thcMax: 28,
    cannabinoids: { thc: 24, cbd: 0.1, cbn: 0.1, cbg: 0.2 },
    terpenes: ["caryophyllene", "limonene", "humulene"],
    description: "Strong, sweet, euphoric and relaxing",
  },
  {
    name: "OG Kush",
    type: "hybrid",
    thcMin: 19,
    thcMax: 26,
    cannabinoids: { thc: 22.5, cbd: 0.3, cbn: 0.1, cbg: 0.1 },
    terpenes: ["myrcene", "limonene", "caryophyllene"],
    description: "Classic, earthy, stress relief",
  },
  {
    name: "Granddaddy Purple",
    type: "indica",
    thcMin: 17,
    thcMax: 23,
    cannabinoids: { thc: 20, cbd: 0.1, cbn: 0.3, cbg: 0.1 },
    terpenes: ["myrcene", "pinene", "caryophyllene"],
    description: "Deeply relaxing, grape/berry aroma, sleep aid",
  },
  {
    name: "Jack Herer",
    type: "sativa",
    thcMin: 18,
    thcMax: 24,
    cannabinoids: { thc: 21, cbd: 0.1, cbn: 0, cbg: 0.2 },
    terpenes: ["terpinolene", "pinene", "caryophyllene"],
    description: "Clear-headed, creative, piney aroma",
  },
  {
    name: "Northern Lights",
    type: "indica",
    thcMin: 16,
    thcMax: 21,
    cannabinoids: { thc: 18.5, cbd: 0.1, cbn: 0.2, cbg: 0.1 },
    terpenes: ["myrcene", "caryophyllene", "limonene"],
    description: "Classic indica, deeply relaxing, sweet/earthy",
  },
  {
    name: "White Widow",
    type: "hybrid",
    thcMin: 18,
    thcMax: 25,
    cannabinoids: { thc: 21.5, cbd: 0.2, cbn: 0, cbg: 0.1 },
    terpenes: ["myrcene", "pinene", "caryophyllene"],
    description: "Balanced energy and relaxation",
  },
  {
    name: "Gelato",
    type: "hybrid",
    thcMin: 20,
    thcMax: 26,
    cannabinoids: { thc: 23, cbd: 0.1, cbn: 0.1, cbg: 0.2 },
    terpenes: ["caryophyllene", "limonene", "humulene"],
    description: "Sweet, dessert-like, balanced euphoria",
  },
  {
    name: "ACDC",
    type: "hybrid",
    thcMin: 0.5,
    thcMax: 6,
    cannabinoids: { thc: 3, cbd: 19, cbn: 0, cbg: 0.5 },
    terpenes: ["myrcene", "pinene", "caryophyllene"],
    description: "High CBD, minimal psychoactivity, therapeutic",
  },
  {
    name: "Harlequin",
    type: "sativa",
    thcMin: 7,
    thcMax: 15,
    cannabinoids: { thc: 10, cbd: 10, cbn: 0, cbg: 0.3 },
    terpenes: ["myrcene", "pinene", "caryophyllene"],
    description: "Balanced THC:CBD, clear-headed relief",
  },
];

// 🧠 Educational content
export const educationalInfo = {
  cannabinoids: {
    title: "🧪 Cannabinoids - The Active Compounds",
    description: "These bind to your body's endocannabinoid system and create the effects",
    analogy: "Think of cannabinoids as the ENGINE - they drive the experience",
  },
  terpenes: {
    title: "🌸 Terpenes - Flavor & Effect Modifiers",
    description: "Give smell, flavor, and modify how THC affects you",
    analogy: "Terpenes are the STEERING WHEEL - they guide how cannabinoids feel",
    cookingNote: "⚠️ Terpenes evaporate easily! Low-temp infusions preserve them better.",
  },
  entourageEffect: {
    title: "🌈 The Entourage Effect",
    description: "Why two strains with same THC % can feel totally different",
    explanation: "Cannabinoids + terpenes work together synergistically. It's not just about THC percentage!",
  },
};
