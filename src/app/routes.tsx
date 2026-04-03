import { createBrowserRouter, Navigate, useLocation } from "react-router";
import { Home } from "./pages/Home";
import { Recipes } from "./pages/Recipes";
import { CreateRecipes } from "./pages/CreateRecipes";
import { Learn } from "./pages/Learn";
import { RecipeDetail } from "./pages/RecipeDetail";
import { InfusionBases } from "./pages/InfusionBases";
import { Layout } from "./components/Layout";
import { Mixer } from "./pages/Mixer";
import { BeginnerCookingGuide } from "./pages/articles/BeginnerCookingGuide";
import { EasyRecipes } from "./pages/articles/EasyRecipes";
import { DosingGuide } from "./pages/articles/DosingGuide";
import { BaseComparison } from "./pages/articles/BaseComparison";
import { ConvertRecipes } from "./pages/articles/ConvertRecipes";
import { EdibleTypes } from "./pages/articles/EdibleTypes";
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
import { DecarboxylationGuide } from "./pages/articles/DecarboxylationGuide";
import { CannabisButterGuide } from "./pages/articles/CannabisButterGuide";
import { EdibleStrengthGuide } from "./pages/articles/EdibleStrengthGuide";
import { InfusionComparison } from "./pages/articles/InfusionComparison";
import { EdiblesTasteBad } from "./pages/articles/EdiblesTasteBad";
import { BeginnerEdibleGuide } from "./pages/articles/BeginnerEdibleGuide";
import { InfuseAnyFood } from "./pages/articles/InfuseAnyFood";
import { InfusedPeanutButterArticle } from "./pages/articles/InfusedPeanutButterArticle";
import InfusedCreamCheeseArticle from "./pages/articles/InfusedCreamCheese";
import { BestEdibleBasesBeginners } from "./pages/articles/BestEdibleBasesBeginners";
import { HowToMakeCannabutter } from "./pages/articles/HowToMakeCannabutter";
import { ThcDosageCalculatorExplained } from "./pages/articles/ThcDosageCalculatorExplained";
import { HowStrongAreHomemadeEdibles } from "./pages/articles/HowStrongAreHomemadeEdibles";
import { WeedButterRatioGuide } from "./pages/articles/WeedButterRatioGuide";
import { DinnerOfTheWeek } from "./pages/DinnerOfTheWeek";
import { PartyMode } from "./pages/PartyMode";
import { WingSauces } from "./pages/WingSauces";
import { Popcorn } from "./pages/Popcorn";
import { Coffee } from "./pages/Coffee";
import { SpreadsDips } from "./pages/SpreadsDips";
import { Jello } from "./pages/Jello";
import { Gummies } from "./pages/Gummies";
import { PartySnacks } from "./pages/PartySnacks";
import { PartyWingsSplit } from "./pages/PartyWingsSplit";
import { UTMBuilder } from "./pages/UTMBuilder";
import { THCCalculatorPage } from "./pages/THCCalculatorPage";
import { EdiblePotencyGuide } from "./pages/EdiblePotencyGuide";
import { CannabisEdibleRecipesPage } from "./pages/CannabisEdibleRecipesPage";
import { InfusedDrinksPage } from "./pages/InfusedDrinksPage";
import { SavoryCannabisPage } from "./pages/SavoryCannabisPage";
import { PartyPackPlanner } from "./pages/PartyPackPlanner";
import { PartyGroceryList } from "./pages/PartyGroceryList";
import { ContactUs } from "./pages/ContactUs";
import { CannabisWingsDosingGuide } from "./pages/articles/CannabisWingsDosingGuide";
import { EdiblesCalculatorWalkthrough } from "./pages/articles/EdiblesCalculatorWalkthrough";
import { MgThcPerServingPartyEdibles } from "./pages/articles/MgThcPerServingPartyEdibles";
import { WingSauceThcDosing } from "./pages/articles/WingSauceThcDosing";
import { PartyPackPlanningGuide } from "./pages/articles/PartyPackPlanningGuide";
import { InfusedFudgeRecipe } from "./pages/articles/InfusedFudgeRecipe";

function RedirectFriesToSpreadsDips() {
  return <Navigate to="/spreads-dips" replace />;
}

/** Legacy SEO URL — consolidate to /edibles-calculator */
function RedirectThcToEdiblesCalculator() {
  const { search } = useLocation();
  return <Navigate to={`/edibles-calculator${search}`} replace />;
}

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
      { path: "spreads-dips", Component: SpreadsDips },
      { path: "fries", Component: RedirectFriesToSpreadsDips },
      { path: "jello", Component: Jello },
      { path: "gummies", Component: Gummies },
      { path: "party-snacks", Component: PartySnacks },
      { path: "utm", Component: UTMBuilder },
      { path: "edibles-calculator", Component: THCCalculatorPage },
      { path: "thc-calculator", Component: RedirectThcToEdiblesCalculator },
      { path: "edible-potency-guide", Component: EdiblePotencyGuide },
      { path: "edible-recipes", Component: CannabisEdibleRecipesPage },
      { path: "infused-drinks", Component: InfusedDrinksPage },
      { path: "savory-cannabis", Component: SavoryCannabisPage },
      { path: "contact-us", Component: ContactUs },
      { path: "learn", Component: Learn },
      { path: "learn/articles/beginner-guide", Component: BeginnerCookingGuide },
      { path: "learn/articles/easy-recipes", Component: EasyRecipes },
      { path: "learn/articles/dosing-guide", Component: DosingGuide },
      { path: "learn/articles/base-comparison", Component: BaseComparison },
      { path: "learn/articles/convert-recipes", Component: ConvertRecipes },
      { path: "learn/articles/edible-types", Component: EdibleTypes },
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
      { path: "learn/articles/decarboxylation-guide", Component: DecarboxylationGuide },
      { path: "learn/articles/cannabutter-guide", Component: CannabisButterGuide },
      { path: "learn/articles/edible-strength-guide", Component: EdibleStrengthGuide },
      { path: "learn/articles/infusion-comparison", Component: InfusionComparison },
      { path: "learn/articles/edibles-taste-bad", Component: EdiblesTasteBad },
      { path: "learn/articles/beginner-edible-guide", Component: BeginnerEdibleGuide },
      { path: "learn/articles/infuse-any-food", Component: InfuseAnyFood },
      { path: "learn/articles/infused-peanut-butter", Component: InfusedPeanutButterArticle },
      { path: "learn/articles/infused-cream-cheese", Component: InfusedCreamCheeseArticle },
      { path: "learn/articles/best-edible-bases-beginners", Component: BestEdibleBasesBeginners },
      { path: "learn/articles/how-to-make-cannabutter", Component: HowToMakeCannabutter },
      { path: "learn/articles/thc-dosage-calculator-explained", Component: ThcDosageCalculatorExplained },
      { path: "learn/articles/how-strong-are-homemade-edibles", Component: HowStrongAreHomemadeEdibles },
      { path: "learn/articles/weed-butter-ratio-guide", Component: WeedButterRatioGuide },
      { path: "learn/articles/cannabis-wings-dosing", Component: CannabisWingsDosingGuide },
      { path: "learn/articles/edibles-calculator-walkthrough", Component: EdiblesCalculatorWalkthrough },
      { path: "learn/articles/mg-thc-per-serving-party-edibles", Component: MgThcPerServingPartyEdibles },
      { path: "learn/articles/wing-sauce-thc-dosing", Component: WingSauceThcDosing },
      { path: "learn/articles/cannabis-party-pack-planning", Component: PartyPackPlanningGuide },
      { path: "learn/articles/infused-fudge-recipe", Component: InfusedFudgeRecipe },
      { path: "learn/articles/how-to-dose-edibles-safely", Component: DosingGuide },
      { path: "learn/articles/why-edibles-hit-harder", Component: WhyEdiblesHitTooHard },
      { path: "learn/articles/how-to-calculate-thc-in-edibles", Component: THCPerServingCalculator },
      { path: "learn/articles/edible-dosage-chart-beginner-to-experienced-users", Component: EdibleStrengthGuide },
      { path: "learn/articles/why-your-edibles-arent-working-or-hit-too-hard", Component: WhyEdiblesDontWork },
      { path: "learn/articles/how-long-do-edibles-take-to-kick-in-and-why", Component: HowLongEdiblesTake },
      { path: "learn/articles/how-to-make-cannabutter-with-exact-thc-calculation", Component: CannabisButterGuide },
      { path: "dinner-of-the-week", Component: DinnerOfTheWeek },
      { path: "party-mode", Component: PartyMode },
      { path: "party-mode/plan/:packId", Component: PartyPackPlanner },
      { path: "party-mode/plan/:packId/wings", Component: PartyWingsSplit },
      { path: "party-mode/plan/:packId/grocery", Component: PartyGroceryList },
    ],
  },
]);
