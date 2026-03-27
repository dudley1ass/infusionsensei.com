import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { useEffect, useMemo, useState } from "react";
import {
  ChefHat, Calculator, Lightbulb, Beaker, Sparkles, Leaf, ArrowRight,
  AlertCircle, Zap, Clock, Thermometer, Settings, Wind, Layers, Package, FlaskConical, Sandwich, Milk,
} from "lucide-react";
import { Link } from "react-router";
import { loadPublishedArticlesFromDb, PublishedArticle } from "../services/contentService";

const CATEGORIES = [
  {
    label: "🎓 System & Authority",
    color: "green",
    articles: [
      { title: "How to Cook with THC: The Complete Beginner-to-Pro System", description: "Building a repeatable system to control dose, flavor, and effect every time.", badge: "Beginner Friendly", badgeColor: "bg-green-600", icon: ChefHat, iconColor: "text-green-600", borderColor: "border-green-200", hoverBorder: "hover:border-green-400", path: "/learn/articles/beginner-guide" },
      { title: "How to Dose THC Edibles Correctly (Stop Guessing)", description: "The standard dose guide and how to calculate perfect portions every time.", badge: "Safety First", badgeColor: "bg-purple-600", icon: Calculator, iconColor: "text-purple-600", borderColor: "border-purple-200", hoverBorder: "hover:border-purple-400", path: "/learn/articles/dosing-guide" },
      { title: "The Complete Beginner's First Edible Guide", description: "Never made edibles before? Start here — what to buy, how to make it, how to dose, and what to expect.", badge: "Start Here", badgeColor: "bg-green-700", icon: Sparkles, iconColor: "text-green-700", borderColor: "border-green-300", hoverBorder: "hover:border-green-500", path: "/learn/articles/beginner-edible-guide" },
      { title: "The Perfect Cannabutter Guide (Step-by-Step)", description: "Exact ratios, step-by-step process, common mistakes, storage, and how to calculate potency.", badge: "Essential Guide", badgeColor: "bg-yellow-600", icon: ChefHat, iconColor: "text-yellow-600", borderColor: "border-yellow-200", hoverBorder: "hover:border-yellow-400", path: "/learn/articles/cannabutter-guide" },
      { title: "How Strong Will My Edibles Be? (Simple THC Math)", description: "What mg of THC means, the exact formula, and why homemade edibles vary so much.", badge: "Calculator", badgeColor: "bg-blue-600", icon: Calculator, iconColor: "text-blue-600", borderColor: "border-blue-200", hoverBorder: "hover:border-blue-400", path: "/learn/articles/edible-strength-guide" },
      { title: "Oil vs Butter vs Tincture: Which Should You Use?", description: "Full comparison — potency, flavor, best recipes for each, and a recipe-by-recipe guide.", badge: "Comparison", badgeColor: "bg-orange-600", icon: Beaker, iconColor: "text-orange-600", borderColor: "border-orange-200", hoverBorder: "hover:border-orange-400", path: "/learn/articles/infusion-comparison" },
      { title: "Why Your Edibles Taste Bad (And How to Fix It)", description: "Chlorophyll, over-infusing, bad temperatures — the causes and exact fixes for weedy taste.", badge: "Troubleshooting", badgeColor: "bg-red-600", icon: AlertCircle, iconColor: "text-red-600", borderColor: "border-red-200", hoverBorder: "hover:border-red-400", path: "/learn/articles/edibles-taste-bad" },
      { title: "How to Infuse Any Food (Pizza, Wings, Pasta, Drinks)", description: "The fat-matching method that works for every recipe type — with category-by-category instructions.", badge: "Advanced", badgeColor: "bg-purple-600", icon: Sparkles, iconColor: "text-purple-600", borderColor: "border-purple-200", hoverBorder: "hover:border-purple-400", path: "/learn/articles/infuse-any-food" },
      { title: "How to Decarb Cannabis for Edibles (Temperature, Time & Method)", description: "The exact temp, time, and step-by-step method. Skipping this is the #1 reason edibles are weak.", badge: "Essential", badgeColor: "bg-green-700", icon: Thermometer, iconColor: "text-green-700", borderColor: "border-green-300", hoverBorder: "hover:border-green-500", path: "/learn/articles/decarboxylation-guide" },
      { title: "THC Butter vs Oil vs Syrup: What Should You Use?", description: "Compare all 5 THC base types and learn which one matches your recipe.", badge: "Comparison", badgeColor: "bg-orange-600", icon: Beaker, iconColor: "text-orange-600", borderColor: "border-orange-200", hoverBorder: "hover:border-orange-400", path: "/learn/articles/base-comparison" },
      { title: "The 4 Types of THC Edibles (And Why They Feel Different)", description: "Understand why the same dose can feel different depending on the edible type.", badge: "Science", badgeColor: "bg-teal-600", icon: Leaf, iconColor: "text-teal-600", borderColor: "border-teal-200", hoverBorder: "hover:border-teal-400", path: "/learn/articles/edible-types" },
    ],
  },
  {
    label: "🛠️ How-To & Utility",
    color: "blue",
    articles: [
      { title: "How to Make Infused Peanut Butter (Without Guessing Dose)", description: "Decarb, infuse oil, blend into PB, and calculate mg per tablespoon — the math most recipes skip.", badge: "Ready-to-eat base", badgeColor: "bg-amber-600", icon: Sandwich, iconColor: "text-amber-700", borderColor: "border-amber-200", hoverBorder: "hover:border-amber-400", path: "/learn/articles/infused-peanut-butter" },
      { title: "How to Make Infused Cream Cheese (Spreads & Frosting)", description: "Blend infused fat into cream cheese, nail mg per ounce, and use it in cheesecakes, dips, and frosting without guessing.", badge: "Ready-to-eat base", badgeColor: "bg-sky-600", icon: Milk, iconColor: "text-sky-700", borderColor: "border-sky-200", hoverBorder: "hover:border-sky-400", path: "/learn/articles/infused-cream-cheese" },
      { title: "5 Easy THC Recipes You Can Make Right Now", description: "Simple recipes that don't require special equipment—just the right base ingredient.", badge: "Quick Start", badgeColor: "bg-blue-600", icon: Lightbulb, iconColor: "text-blue-600", borderColor: "border-blue-200", hoverBorder: "hover:border-blue-400", path: "/learn/articles/easy-recipes" },
      { title: "How to Turn ANY Recipe Into a THC Recipe", description: "A 4-step system to convert any regular recipe into a THC-infused version.", badge: "Advanced", badgeColor: "bg-pink-600", icon: Sparkles, iconColor: "text-pink-600", borderColor: "border-pink-200", hoverBorder: "hover:border-pink-400", path: "/learn/articles/convert-recipes" },
      { title: "How to Calculate THC Per Serving (Simple Method)", description: "The exact formula — with a live calculator — to get precise mg per serving every time.", badge: "Calculator", badgeColor: "bg-green-600", icon: Calculator, iconColor: "text-green-600", borderColor: "border-green-200", hoverBorder: "hover:border-green-400", path: "/learn/articles/thc-per-serving-calculator" },
      { title: "How to Store THC Edibles Without Losing Potency", description: "Light, heat, oxygen, and moisture all degrade THC. Here's how to prevent it.", badge: "Practical", badgeColor: "bg-emerald-600", icon: Package, iconColor: "text-emerald-600", borderColor: "border-emerald-200", hoverBorder: "hover:border-emerald-400", path: "/learn/articles/store-thc-edibles" },
    ],
  },
  {
    label: "🔥 Problem Articles",
    color: "red",
    articles: [
      { title: "Why Your Edibles Aren't Working", description: "The 5 real reasons edibles fail — and exactly how to fix each one.", badge: "Troubleshooting", badgeColor: "bg-red-600", icon: AlertCircle, iconColor: "text-red-500", borderColor: "border-red-200", hoverBorder: "hover:border-red-400", path: "/learn/articles/why-edibles-dont-work" },
      { title: "Why Edibles Hit Too Hard", description: "Delayed onset, liver conversion, dose stacking — why it happens and what to do.", badge: "Safety", badgeColor: "bg-orange-600", icon: Zap, iconColor: "text-orange-500", borderColor: "border-orange-200", hoverBorder: "hover:border-orange-400", path: "/learn/articles/why-edibles-hit-too-hard" },
      { title: "How Long Edibles REALLY Take to Kick In", description: "Fasted vs fed, drink vs solid, fast vs slow metabolism — the complete breakdown.", badge: "Science", badgeColor: "bg-blue-600", icon: Clock, iconColor: "text-blue-500", borderColor: "border-blue-200", hoverBorder: "hover:border-blue-400", path: "/learn/articles/how-long-edibles-take" },
      { title: "Why Your THC Butter Isn't Strong", description: "Decarb failure, wrong temp, too little time — fix every weak cannabutter problem.", badge: "Troubleshooting", badgeColor: "bg-yellow-600", icon: Thermometer, iconColor: "text-yellow-500", borderColor: "border-yellow-200", hoverBorder: "hover:border-yellow-400", path: "/learn/articles/why-thc-butter-is-weak" },
      { title: "How to Fix Edibles That Are Too Strong", description: "Dilution math, rebatching, and portioning — salvage any overpotent batch.", badge: "Problem Solving", badgeColor: "bg-pink-600", icon: Settings, iconColor: "text-pink-500", borderColor: "border-pink-200", hoverBorder: "hover:border-pink-400", path: "/learn/articles/fix-too-strong-edibles" },
      { title: "Why Edibles Take Longer Than Smoking", description: "Lungs vs liver, Δ9-THC vs 11-hydroxy-THC — the complete biological explanation.", badge: "Biology", badgeColor: "bg-teal-600", icon: Wind, iconColor: "text-teal-500", borderColor: "border-teal-200", hoverBorder: "hover:border-teal-400", path: "/learn/articles/why-edibles-take-longer" },
      { title: "Why Some Edibles Feel Stronger Than Others", description: "Same dose, different effect. Fat content, emulsification, and terpenes explained.", badge: "Science", badgeColor: "bg-indigo-600", icon: Layers, iconColor: "text-indigo-500", borderColor: "border-indigo-200", hoverBorder: "hover:border-indigo-400", path: "/learn/articles/why-edibles-feel-different" },
      { title: "What Happens If You Skip Decarbing", description: "THCA vs THC — why raw cannabis doesn't work and exactly how to fix it.", badge: "Chemistry", badgeColor: "bg-violet-600", icon: FlaskConical, iconColor: "text-violet-500", borderColor: "border-violet-200", hoverBorder: "hover:border-violet-400", path: "/learn/articles/what-happens-without-decarb" },
    ],
  },
];

export function GuidesArticles() {
  const [dbArticles, setDbArticles] = useState<PublishedArticle[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows = await loadPublishedArticlesFromDb();
      if (!cancelled && rows) setDbArticles(rows);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dbBySlug = useMemo(
    () =>
      new Map(
        dbArticles.map((a) => [a.slug, a] as const)
      ),
    [dbArticles]
  );

  return (
    <div className="space-y-12">
      {CATEGORIES.map(({ label, articles }) => (
        <div key={label}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">{label}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const Icon = article.icon;
              const slug = article.path.split("/").pop() || "";
              const db = dbBySlug.get(slug);
              return (
                <Link key={article.path} to={article.path}>
                  <Card className={`bg-white ${article.borderColor} ${article.hoverBorder} shadow-md transition-all hover:shadow-xl h-full group cursor-pointer`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${article.badgeColor} text-white`}>{article.badge}</Badge>
                        <Icon className={`w-8 h-8 ${article.iconColor} flex-shrink-0`} />
                      </div>
                      <CardTitle className="text-lg text-gray-900 group-hover:text-green-700 transition-colors">
                        {db?.title || article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{db?.summary || article.description}</p>
                      <div className="flex items-center text-green-600 font-semibold text-sm">
                        Read Article <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
