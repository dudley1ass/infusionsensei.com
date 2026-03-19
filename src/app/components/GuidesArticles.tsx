import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  ChefHat, Calculator, Lightbulb, Beaker, Sparkles, Leaf, ArrowRight,
  AlertCircle, Zap, Clock, Thermometer, Settings, Wind, Layers, Package, FlaskConical,
} from "lucide-react";
import { Link } from "react-router";

const CATEGORIES = [
  {
    label: "🎓 System & Authority",
    color: "green",
    articles: [
      { title: "How to Cook with THC: The Complete Beginner-to-Pro System", description: "Building a repeatable system to control dose, flavor, and effect every time.", badge: "Beginner Friendly", badgeColor: "bg-green-600", icon: ChefHat, iconColor: "text-green-600", borderColor: "border-green-200", hoverBorder: "hover:border-green-400", path: "/learn/articles/beginner-guide" },
      { title: "How to Dose THC Edibles Correctly (Stop Guessing)", description: "The standard dose guide and how to calculate perfect portions every time.", badge: "Safety First", badgeColor: "bg-purple-600", icon: Calculator, iconColor: "text-purple-600", borderColor: "border-purple-200", hoverBorder: "hover:border-purple-400", path: "/learn/articles/dosing-guide" },
      { title: "THC Butter vs Oil vs Syrup: What Should You Use?", description: "Compare all 5 THC base types and learn which one matches your recipe.", badge: "Comparison", badgeColor: "bg-orange-600", icon: Beaker, iconColor: "text-orange-600", borderColor: "border-orange-200", hoverBorder: "hover:border-orange-400", path: "/learn/articles/base-comparison" },
      { title: "The 4 Types of THC Edibles (And Why They Feel Different)", description: "Understand why the same dose can feel different depending on the edible type.", badge: "Science", badgeColor: "bg-teal-600", icon: Leaf, iconColor: "text-teal-600", borderColor: "border-teal-200", hoverBorder: "hover:border-teal-400", path: "/learn/articles/edible-types" },
    ],
  },
  {
    label: "🛠️ How-To & Utility",
    color: "blue",
    articles: [
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
  return (
    <div className="space-y-12">
      {CATEGORIES.map(({ label, articles }) => (
        <div key={label}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-200">{label}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const Icon = article.icon;
              return (
                <Link key={article.path} to={article.path}>
                  <Card className={`bg-white ${article.borderColor} ${article.hoverBorder} shadow-md transition-all hover:shadow-xl h-full group cursor-pointer`}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={`${article.badgeColor} text-white`}>{article.badge}</Badge>
                        <Icon className={`w-8 h-8 ${article.iconColor} flex-shrink-0`} />
                      </div>
                      <CardTitle className="text-lg text-gray-900 group-hover:text-green-700 transition-colors">
                        {article.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{article.description}</p>
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
