import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { Recipes } from "./pages/Recipes";
import { CreateRecipes } from "./pages/CreateRecipes";
import { Learn } from "./pages/Learn";
import { RecipeDetail } from "./pages/RecipeDetail";
import { InfusionBases } from "./pages/InfusionBases";
import { Layout } from "./components/Layout";
import { Mixer } from "./pages/Mixer";
// Original articles
import { BeginnerCookingGuide } from "./pages/articles/BeginnerCookingGuide";
import { EasyRecipes } from "./pages/articles/EasyRecipes";
import { DosingGuide } from "./pages/articles/DosingGuide";
import { BaseComparison } from "./pages/articles/BaseComparison";
import { ConvertRecipes } from "./pages/articles/ConvertRecipes";
import { EdibleTypes } from "./pages/articles/EdibleTypes";
// Problem articles
import { WhyEdiblesDontWork } from "./pages/articles/WhyEdiblesDontWork";
import { WhyEdiblesHitTooHard } from "./pages/articles/WhyEdiblesHitTooHard";
import { HowLongEdiblesTake } from "./pages/articles/HowLongEdiblesTake";
import { WhyTHCButterIsWeak } from "./pages/articles/WhyTHCButterIsWeak";
import { FixTooStrongEdibles } from "./pages/articles/FixTooStrongEdibles";
import { WhyEdiblesTakeLonger } from "./pages/articles/WhyEdiblesTakeLonger";
import { THCPerServingCalculator } from "./pages/articles/THCPerServingCalculator";
import { WhyEdiblesFeelDifferent } from "./pages/articles/WhyEdiblesFeelDifferent";
import { StoreTHCEdibles } from "./pages/articles/StoreTHCEdibles";
import { WhatHappensWithoutDecarb } from "./pages/articles/WhatHappensWithoutDecarb";

import { WingSauces } from "./pages/WingSauces";
import { Popcorn } from "./pages/Popcorn";
import { Coffee } from "./pages/Coffee";
import { Fries } from "./pages/Fries";
import { UTMBuilder } from "./pages/UTMBuilder";
import { THCCalculatorPage } from "./pages/THCCalculatorPage";
import { EdiblePotencyGuide } from "./pages/EdiblePotencyGuide";
import { CannabisEdibleRecipesPage } from "./pages/CannabisEdibleRecipesPage";
import { InfusedDrinksPage } from "./pages/InfusedDrinksPage";
import { SavoryCannabisPage } from "./pages/SavoryCannabisPage";
import { Coffee } from "./pages/Coffee";
import { Fries } from "./pages/Fries";
import { UTMBuilder } from "./pages/UTMBuilder";
import { THCCalculatorPage } from "./pages/THCCalculatorPage";
import { EdiblePotencyGuide } from "./pages/EdiblePotencyGuide";
import { CannabisEdibleRecipesPage } from "./pages/CannabisEdibleRecipesPage";
import { InfusedDrinksPage } from "./pages/InfusedDrinksPage";
import { SavoryCannabisPage } from "./pages/SavoryCannabisPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "recipes", Component: Recipes },
      { path: "recipes/:id", Component: RecipeDetail },
      { path: "infusions", Component: InfusionBases },
      { path: "ingredients", Component: CreateRecipes },
      { path: "mixer", Component: Mixer },
      { path: "wings", Component: WingSauces },
      { path: "popcorn", Component: Popcorn },
      { path: "coffee", Component: Coffee },
      { path: "fries", Component: Fries },
      { path: "utm", Component: UTMBuilder },
      { path: "thc-calculator", Component: THCCalculatorPage },
      { path: "edible-potency-guide", Component: EdiblePotencyGuide },
      { path: "edible-recipes", Component: CannabisEdibleRecipesPage },
      { path: "infused-drinks", Component: InfusedDrinksPage },
      { path: "savory-cannabis", Component: SavoryCannabisPage },
      { path: "coffee", Component: Coffee },
      { path: "fries", Component: Fries },
      { path: "utm", Component: UTMBuilder },
      { path: "thc-calculator", Component: THCCalculatorPage },
      { path: "edible-potency-guide", Component: EdiblePotencyGuide },
      { path: "edible-recipes", Component: CannabisEdibleRecipesPage },
      { path: "infused-drinks", Component: InfusedDrinksPage },
      { path: "savory-cannabis", Component: SavoryCannabisPage },
      { path: "learn", Component: Learn },
      // Original articles
      { path: "learn/articles/beginner-guide", Component: BeginnerCookingGuide },
      { path: "learn/articles/easy-recipes", Component: EasyRecipes },
      { path: "learn/articles/dosing-guide", Component: DosingGuide },
      { path: "learn/articles/base-comparison", Component: BaseComparison },
      { path: "learn/articles/convert-recipes", Component: ConvertRecipes },
      { path: "learn/articles/edible-types", Component: EdibleTypes },
      // Problem articles
      { path: "learn/articles/why-edibles-dont-work", Component: WhyEdiblesDontWork },
      { path: "learn/articles/why-edibles-hit-too-hard", Component: WhyEdiblesHitTooHard },
      { path: "learn/articles/how-long-edibles-take", Component: HowLongEdiblesTake },
      { path: "learn/articles/why-thc-butter-is-weak", Component: WhyTHCButterIsWeak },
      { path: "learn/articles/fix-too-strong-edibles", Component: FixTooStrongEdibles },
      { path: "learn/articles/why-edibles-take-longer", Component: WhyEdiblesTakeLonger },
      { path: "learn/articles/thc-per-serving-calculator", Component: THCPerServingCalculator },
      { path: "learn/articles/why-edibles-feel-different", Component: WhyEdiblesFeelDifferent },
      { path: "learn/articles/store-thc-edibles", Component: StoreTHCEdibles },
      { path: "learn/articles/what-happens-without-decarb", Component: WhatHappensWithoutDecarb },
    ],
  },
]);
