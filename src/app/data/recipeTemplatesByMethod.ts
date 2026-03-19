export interface RecipeIngredient {
  name: string;
  amount: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface RecipeTemplateByMethod {
  id: string;
  name: string;
  category: string;
  coreIngredient: "distillate" | "infused-oil" | "tincture" | "syrup"; // Step 1
  recipeType: "fat-based" | "sugar-based" | "liquid-based" | "direct-add"; // Step 2
  servings: number;
  infusionAmount: number;
  infusionUnit: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  tips: string[];
}

// Core Ingredients (Step 1)
export const coreIngredients = {
  "distillate": {
    name: "Distillate",
    emoji: "💧",
    description: "Pure THC/CBD concentrate",
    bestFor: "Precision dosing, any recipe",
    thcDefault: 800 // mg per gram
  },
  "infused-oil": {
    name: "Infused Oil",
    emoji: "🧈",
    description: "Cannabutter, coconut oil, olive oil",
    bestFor: "Bulk cooking, baking",
    thcDefault: 500 // mg per 113g
  },
  "tincture": {
    name: "Tincture",
    emoji: "🧪",
    description: "Alcohol or glycerin-based extract",
    bestFor: "Drinks, sublingual dosing",
    thcDefault: 10 // mg per ml
  },
  "syrup": {
    name: "Syrup",
    emoji: "🍯",
    description: "Agave, simple syrup, honey",
    bestFor: "Easy consumer use, sweetening",
    thcDefault: 100 // mg per 30ml
  }
};

// Recipe Types (Step 2)
export const recipeTypes = {
  "fat-based": {
    name: "Fat-Based",
    emoji: "🍳",
    description: "Cooking with oils and fats",
    examples: "Baked goods, sautés, roasts"
  },
  "sugar-based": {
    name: "Sugar-Based",
    emoji: "🍰",
    description: "Desserts and sweet treats",
    examples: "Ice cream, candy, pastries"
  },
  "liquid-based": {
    name: "Liquid-Based",
    emoji: "🥤",
    description: "Beverages and drinks",
    examples: "Smoothies, cocktails, coffee"
  },
  "direct-add": {
    name: "Direct-Add",
    emoji: "🎯",
    description: "Precision dosing",
    examples: "Individual servings, measured doses"
  }
};

// Helper function to get recipes by core ingredient
export function getRecipesByCoreIngredient(coreIngredient: string): RecipeTemplateByMethod[] {
  return recipeTemplatesByMethod.filter(r => r.coreIngredient === coreIngredient);
}

// Helper function to get recipes by recipe type
export function getRecipesByType(recipeType: string, coreIngredient?: string): RecipeTemplateByMethod[] {
  if (coreIngredient) {
    return recipeTemplatesByMethod.filter(r => r.recipeType === recipeType && r.coreIngredient === coreIngredient);
  }
  return recipeTemplatesByMethod.filter(r => r.recipeType === recipeType);
}

export const recipeTemplatesByMethod: RecipeTemplateByMethod[] = [
  // FAT-BASED RECIPES WITH INFUSED OIL
  {
    id: "flex-cookie-system",
    name: "🔧 Flex Cookie System (Base Recipe)",
    category: "baked-goods",
    coreIngredient: "infused-oil",
    recipeType: "fat-based",
    servings: 12,
    infusionAmount: 113,
    infusionUnit: "g",
    ingredients: [
      { name: "All-purpose flour", amount: 150, unit: "g", calories: 546, protein: 15, carbs: 117, fat: 2 },
      { name: "Baking soda", amount: 2.5, unit: "g", calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: "Salt", amount: 1.5, unit: "g", calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: "White sugar", amount: 100, unit: "g", calories: 387, protein: 0, carbs: 100, fat: 0 },
      { name: "Brown sugar", amount: 55, unit: "g", calories: 213, protein: 0, carbs: 55, fat: 0 },
      { name: "Egg", amount: 1, unit: "large", calories: 70, protein: 6, carbs: 1, fat: 5 },
      { name: "Vanilla extract", amount: 5, unit: "ml", calories: 6, protein: 0, carbs: 1, fat: 0 },
      { name: "Add-ins (chips/nuts)", amount: 100, unit: "g", calories: 500, protein: 8, carbs: 60, fat: 30 },
    ],
    instructions: [
      "Preheat oven to 350°F (175°C)",
      "Mix flour, baking soda, and salt in a bowl",
      "Cream infused fat with both sugars until fluffy",
      "Beat in egg and vanilla",
      "Gradually add dry ingredients",
      "Fold in add-ins (chocolate chips, nuts, etc.)",
      "Drop spoonfuls onto cookie sheet",
      "Bake 10-12 minutes until edges are golden",
      "Cool on sheet 2 minutes, then transfer to rack"
    ],
    prepTime: "15 min",
    cookTime: "12 min",
    tips: [
      "FLEX: Swap butter ↔ oil ↔ coconut oil",
      "Add-ins: Try chocolate chips, nuts, dried fruit",
      "600mg total = 50mg per cookie",
      "Store airtight up to 1 week"
    ]
  },
  {
    id: "brownie-system",
    name: "🍫 Brownie System (High Reliability)",
    category: "baked-goods",
    coreIngredient: "infused-oil",
    recipeType: "fat-based",
    servings: 9,
    infusionAmount: 113,
    infusionUnit: "g",
    ingredients: [
      { name: "White sugar", amount: 200, unit: "g", calories: 774, protein: 0, carbs: 200, fat: 0 },
      { name: "Eggs", amount: 2, unit: "large", calories: 140, protein: 12, carbs: 2, fat: 10 },
      { name: "Cocoa powder", amount: 40, unit: "g", calories: 98, protein: 5, carbs: 25, fat: 5 },
      { name: "All-purpose flour", amount: 60, unit: "g", calories: 218, protein: 6, carbs: 47, fat: 1 },
      { name: "Salt", amount: 1.5, unit: "g", calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: "Vanilla extract", amount: 5, unit: "ml", calories: 6, protein: 0, carbs: 1, fat: 0 },
    ],
    instructions: [
      "Preheat oven to 350°F (175°C), grease 8x8 pan",
      "Melt infused butter/oil and let cool slightly",
      "Beat sugar and eggs together until smooth",
      "Stir in melted infused fat",
      "Add cocoa powder, flour, salt, and vanilla",
      "Mix until just combined (don't overmix)",
      "Pour into prepared pan",
      "Bake 20-25 minutes (toothpick should have moist crumbs)",
      "Cool completely before cutting into 9 squares"
    ],
    prepTime: "10 min",
    cookTime: "25 min",
    tips: [
      "FLEX: Oil ↔ butter ↔ coconut oil",
      "Add chocolate chips or nuts for texture",
      "900mg total = 100mg per brownie",
      "Don't overbake - fudgy is the goal!"
    ]
  },
  {
    id: "oil-cookies",
    name: "Classic Cannabis Chocolate Chip Cookies",
    category: "baked-goods",
    coreIngredient: "infused-oil",
    recipeType: "fat-based",
    servings: 24,
    infusionAmount: 113,
    infusionUnit: "g",
    ingredients: [
      { name: "All-purpose flour", amount: 280, unit: "g", calories: 1020, protein: 28, carbs: 220, fat: 4 },
      { name: "Baking soda", amount: 5, unit: "g", calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: "Salt", amount: 6, unit: "g", calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: "Regular butter", amount: 113, unit: "g", calories: 810, protein: 1, carbs: 0, fat: 92 },
      { name: "Brown sugar", amount: 165, unit: "g", calories: 640, protein: 0, carbs: 164, fat: 0 },
      { name: "White sugar", amount: 100, unit: "g", calories: 387, protein: 0, carbs: 100, fat: 0 },
      { name: "Eggs", amount: 2, unit: "large", calories: 140, protein: 12, carbs: 2, fat: 10 },
      { name: "Vanilla extract", amount: 10, unit: "ml", calories: 12, protein: 0, carbs: 1, fat: 0 },
      { name: "Chocolate chips", amount: 340, unit: "g", calories: 1700, protein: 20, carbs: 200, fat: 100 },
    ],
    instructions: [
      "Preheat oven to 375°F (190°C)",
      "Mix flour, baking soda, and salt in a bowl",
      "In another bowl, cream together cannabutter and regular butter with both sugars",
      "Beat in eggs and vanilla to butter mixture",
      "Gradually blend in flour mixture",
      "Fold in chocolate chips",
      "Drop spoonfuls onto ungreased cookie sheet",
      "Bake 9-11 minutes until golden brown",
      "Cool on baking sheet 2 minutes, then transfer to wire rack"
    ],
    prepTime: "15 min",
    cookTime: "11 min",
    tips: [
      "Let cannabutter soften to room temperature for easier mixing",
      "Don't overbake - cookies will firm up as they cool",
      "Store in airtight container for up to 1 week"
    ]
  },
  {
    id: "protein-ball-system",
    name: "💪 Protein Ball System (No-Bake)",
    category: "snacks",
    coreIngredient: "infused-oil",
    recipeType: "fat-based",
    servings: 12,
    infusionAmount: 30,
    infusionUnit: "ml",
    ingredients: [
      { name: "Rolled oats", amount: 120, unit: "g", calories: 456, protein: 16, carbs: 82, fat: 8 },
      { name: "Peanut butter", amount: 120, unit: "g", calories: 710, protein: 28, carbs: 24, fat: 60 },
      { name: "Honey", amount: 60, unit: "ml", calories: 192, protein: 0, carbs: 52, fat: 0 },
      { name: "Protein powder", amount: 30, unit: "g", calories: 120, protein: 24, carbs: 4, fat: 2 },
    ],
    instructions: [
      "Combine all ingredients in large bowl",
      "Add 1-2 tbsp infused oil to mixture",
      "Mix thoroughly until well combined",
      "Roll into 12 equal balls",
      "Refrigerate 1-2 hours until firm",
      "Store in airtight container in fridge up to 1 week"
    ],
    prepTime: "10 min",
    cookTime: "0 min",
    tips: [
      "No baking required - quick and easy!",
      "240mg total = 20mg per ball",
      "Add chocolate chips, coconut, or dried fruit",
      "Great pre/post-workout snack"
    ]
  },

  // SUGAR-BASED RECIPES WITH SYRUP
  {
    id: "ice-cream-system",
    name: "🍨 Ice Cream System (Custard Base)",
    category: "ice-cream",
    coreIngredient: "syrup",
    recipeType: "sugar-based",
    servings: 8,
    infusionAmount: 60,
    infusionUnit: "ml",
    ingredients: [
      { name: "Heavy cream", amount: 480, unit: "ml", calories: 1600, protein: 8, carbs: 16, fat: 176 },
      { name: "Whole milk", amount: 240, unit: "ml", calories: 150, protein: 8, carbs: 12, fat: 8 },
      { name: "Sugar", amount: 150, unit: "g", calories: 580, protein: 0, carbs: 150, fat: 0 },
      { name: "Vanilla extract", amount: 5, unit: "ml", calories: 6, protein: 0, carbs: 1, fat: 0 },
    ],
    instructions: [
      "Heat cream and milk in saucepan over medium-low heat",
      "Dissolve sugar while stirring",
      "Heat until steaming but not boiling (170°F)",
      "Remove from heat and add cannabis syrup",
      "Add vanilla extract and stir well",
      "Chill mixture completely (4+ hours or overnight)",
      "Churn in ice cream maker per manufacturer instructions",
      "Freeze 4+ hours for firm texture"
    ],
    prepTime: "15 min",
    cookTime: "10 min",
    tips: [
      "800mg total = 100mg per serving",
      "Can use infused cream, oil, or distillate instead of syrup",
      "Add mix-ins after churning (chocolate chips, fruit, etc.)",
      "Store in airtight container up to 2 weeks"
    ]
  },
  {
    id: "syrup-ice-cream-vanilla",
    name: "Cannabis Agave Vanilla Ice Cream",
    category: "ice-cream",
    coreIngredient: "syrup",
    recipeType: "sugar-based",
    servings: 8,
    infusionAmount: 60,
    infusionUnit: "ml",
    ingredients: [
      { name: "Heavy cream", amount: 480, unit: "ml", calories: 1600, protein: 8, carbs: 16, fat: 176 },
      { name: "Whole milk", amount: 240, unit: "ml", calories: 150, protein: 8, carbs: 12, fat: 8 },
      { name: "Egg yolks", amount: 6, unit: "large", calories: 330, protein: 16, carbs: 3, fat: 27 },
      { name: "Vanilla extract", amount: 10, unit: "ml", calories: 12, protein: 0, carbs: 1, fat: 0 },
      { name: "Salt", amount: 2, unit: "g", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
    instructions: [
      "Whisk egg yolks in a bowl and set aside",
      "Heat cream and milk in saucepan until steaming (don't boil)",
      "Slowly pour hot cream into yolks while whisking constantly",
      "Return mixture to saucepan, cook over low heat, stirring constantly until it coats spoon (170°F)",
      "Remove from heat, stir in cannabis agave, vanilla, and salt",
      "Strain through fine mesh into bowl",
      "Cover and refrigerate until completely cold (4+ hours)",
      "Churn in ice cream maker according to manufacturer instructions",
      "Freeze for 4 hours before serving"
    ],
    prepTime: "30 min",
    cookTime: "15 min",
    tips: [
      "Agave sweetens naturally, reducing need for sugar",
      "Keep temperature below 180°F when adding agave",
      "Divide into 8 equal portions for accurate dosing"
    ]
  },
  {
    id: "syrup-ice-cream-chocolate",
    name: "Cannabis Chocolate Agave Ice Cream",
    category: "ice-cream",
    coreIngredient: "syrup",
    recipeType: "sugar-based",
    servings: 8,
    infusionAmount: 60,
    infusionUnit: "ml",
    ingredients: [
      { name: "Heavy cream", amount: 480, unit: "ml", calories: 1600, protein: 8, carbs: 16, fat: 176 },
      { name: "Whole milk", amount: 240, unit: "ml", calories: 150, protein: 8, carbs: 12, fat: 8 },
      { name: "Cocoa powder", amount: 50, unit: "g", calories: 123, protein: 6, carbs: 31, fat: 6 },
      { name: "Egg yolks", amount: 6, unit: "large", calories: 330, protein: 16, carbs: 3, fat: 27 },
      { name: "Dark chocolate", amount: 100, unit: "g", calories: 550, protein: 8, carbs: 60, fat: 32 },
      { name: "Vanilla extract", amount: 5, unit: "ml", calories: 6, protein: 0, carbs: 1, fat: 0 },
    ],
    instructions: [
      "Whisk cocoa powder with 120ml of the milk until smooth",
      "Add remaining milk and cream to saucepan with cocoa mixture",
      "Heat until steaming, then add chopped chocolate",
      "Whisk egg yolks in separate bowl",
      "Slowly temper hot mixture into yolks while whisking",
      "Return to heat, cook to 170°F stirring constantly",
      "Remove from heat, add cannabis agave and vanilla",
      "Strain and refrigerate until cold (4+ hours)",
      "Churn in ice cream maker, then freeze 4+ hours"
    ],
    prepTime: "30 min",
    cookTime: "15 min",
    tips: [
      "Double chocolate flavor from cocoa and chocolate chunks",
      "Agave adds subtle sweetness that complements chocolate",
      "Store in airtight container up to 2 weeks"
    ]
  },
  {
    id: "gummy-system",
    name: "🍬 Gummy System (Gelatin-Based)",
    category: "candy",
    coreIngredient: "distillate",
    recipeType: "sugar-based",
    servings: 20,
    infusionAmount: 0.25,
    infusionUnit: "g",
    ingredients: [
      { name: "Fruit juice", amount: 120, unit: "ml", calories: 56, protein: 0, carbs: 14, fat: 0 },
      { name: "Unflavored gelatin", amount: 30, unit: "g", calories: 104, protein: 24, carbs: 0, fat: 0 },
      { name: "Honey or sugar", amount: 15, unit: "g", calories: 48, protein: 0, carbs: 13, fat: 0 },
    ],
    instructions: [
      "Heat juice in saucepan over low heat (don't boil)",
      "Slowly sprinkle gelatin while whisking constantly",
      "Add honey/sugar and stir until dissolved",
      "Remove from heat, let cool to 160°F",
      "Add distillate or tincture and mix thoroughly",
      "Pour into silicone molds",
      "Refrigerate 1-2 hours until firm",
      "Pop out of molds and store in airtight container"
    ],
    prepTime: "10 min",
    cookTime: "5 min",
    tips: [
      "200mg total = 10mg per gummy",
      "Works with distillate OR tincture",
      "Use any juice flavor - orange, grape, cherry",
      "Store in fridge up to 2 weeks"
    ]
  },

  // LIQUID-BASED RECIPES WITH TINCTURE
  {
    id: "drink-system-lemonade",
    name: "🍋 Drink System: Cannabis Lemonade",
    category: "beverages",
    coreIngredient: "tincture",
    recipeType: "liquid-based",
    servings: 1,
    infusionAmount: 1,
    infusionUnit: "ml",
    ingredients: [
      { name: "Water", amount: 180, unit: "ml", calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: "Fresh lemon juice", amount: 60, unit: "ml", calories: 18, protein: 0, carbs: 6, fat: 0 },
      { name: "Sugar or syrup", amount: 20, unit: "g", calories: 77, protein: 0, carbs: 20, fat: 0 },
      { name: "Ice", amount: 1, unit: "cup", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
    instructions: [
      "Combine water and lemon juice in glass",
      "Add sugar or syrup and stir until dissolved",
      "Add cannabis tincture (1 dropper = 5-20mg typical)",
      "Add ice and stir well",
      "Garnish with lemon slice if desired"
    ],
    prepTime: "5 min",
    cookTime: "0 min",
    tips: [
      "FLEX: Use 8 oz any liquid (juice, soda, milk, coffee)",
      "Add 0-2 oz modifiers (citrus, cream, sweetener)",
      "Tincture dosing: 1 dropper = 5-20mg",
      "Stir well to distribute evenly"
    ]
  },
  {
    id: "drink-system-coffee",
    name: "☕ Drink System: Cannabis Coffee",
    category: "beverages",
    coreIngredient: "infused-oil",
    recipeType: "liquid-based",
    servings: 1,
    infusionAmount: 15,
    infusionUnit: "ml",
    ingredients: [
      { name: "Coffee (brewed)", amount: 240, unit: "ml", calories: 2, protein: 0, carbs: 0, fat: 0 },
      { name: "Heavy cream", amount: 30, unit: "ml", calories: 100, protein: 1, carbs: 1, fat: 11 },
      { name: "Sugar (optional)", amount: 10, unit: "g", calories: 39, protein: 0, carbs: 10, fat: 0 },
    ],
    instructions: [
      "Brew coffee as usual",
      "Add 1 tbsp infused cream or butter",
      "Stir well to blend (may need blender for smooth texture)",
      "Add sugar if desired",
      "Enjoy hot"
    ],
    prepTime: "5 min",
    cookTime: "0 min",
    tips: [
      "Infused butter/cream blends best when coffee is hot",
      "Use blender for smooth, frothy texture",
      "Start with low dose - effects take 30-90 min",
      "Can add flavored syrups or spices"
    ]
  },
  {
    id: "drink-system-smoothie",
    name: "🥤 Drink System: Cannabis Smoothie",
    category: "beverages",
    coreIngredient: "infused-oil",
    recipeType: "liquid-based",
    servings: 1,
    infusionAmount: 15,
    infusionUnit: "ml",
    ingredients: [
      { name: "Frozen fruit", amount: 150, unit: "g", calories: 75, protein: 1, carbs: 18, fat: 0 },
      { name: "Greek yogurt", amount: 120, unit: "g", calories: 80, protein: 15, carbs: 6, fat: 0 },
      { name: "Milk (any type)", amount: 120, unit: "ml", calories: 45, protein: 3, carbs: 6, fat: 1 },
    ],
    instructions: [
      "Add fruit, yogurt, and milk to blender",
      "Add 1 tsp cannabis oil",
      "Blend on high until smooth",
      "Add more liquid if too thick",
      "Pour into glass and enjoy"
    ],
    prepTime: "5 min",
    cookTime: "0 min",
    tips: [
      "Fat in yogurt helps THC absorption",
      "Use any fruit combination",
      "Add protein powder, nut butter, or greens",
      "Blend well to distribute oil evenly"
    ]
  },
  {
    id: "tincture-mocktail",
    name: "Cannabis-Infused Citrus Mocktail",
    category: "beverages",
    coreIngredient: "tincture",
    recipeType: "liquid-based",
    servings: 1,
    infusionAmount: 1,
    infusionUnit: "ml",
    ingredients: [
      { name: "Fresh orange juice", amount: 120, unit: "ml", calories: 55, protein: 1, carbs: 13, fat: 0 },
      { name: "Fresh lime juice", amount: 30, unit: "ml", calories: 10, protein: 0, carbs: 3, fat: 0 },
      { name: "Simple syrup", amount: 15, unit: "ml", calories: 60, protein: 0, carbs: 15, fat: 0 },
      { name: "Club soda", amount: 60, unit: "ml", calories: 0, protein: 0, carbs: 0, fat: 0 },
      { name: "Ice", amount: 1, unit: "cup", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
    instructions: [
      "Fill a shaker with ice",
      "Add orange juice, lime juice, simple syrup, and cannabis tincture",
      "Shake vigorously for 15 seconds",
      "Strain into glass filled with fresh ice",
      "Top with club soda",
      "Garnish with lime wheel and orange slice",
      "Stir gently before drinking"
    ],
    prepTime: "5 min",
    cookTime: "0 min",
    tips: [
      "Start with 0.5ml tincture and adjust to preference",
      "Tincture effects can take 30-90 minutes",
      "Shake well to distribute tincture evenly"
    ]
  },
  {
    id: "tincture-hot-chocolate",
    name: "Cannabis Hot Chocolate",
    category: "beverages",
    coreIngredient: "tincture",
    recipeType: "liquid-based",
    servings: 1,
    infusionAmount: 1,
    infusionUnit: "ml",
    ingredients: [
      { name: "Whole milk", amount: 240, unit: "ml", calories: 150, protein: 8, carbs: 12, fat: 8 },
      { name: "Dark chocolate", amount: 40, unit: "g", calories: 220, protein: 3, carbs: 24, fat: 13 },
      { name: "Sugar", amount: 15, unit: "g", calories: 58, protein: 0, carbs: 15, fat: 0 },
      { name: "Vanilla extract", amount: 2, unit: "ml", calories: 2, protein: 0, carbs: 0, fat: 0 },
      { name: "Whipped cream", amount: 30, unit: "g", calories: 80, protein: 1, carbs: 2, fat: 8 },
    ],
    instructions: [
      "Heat milk in saucepan over medium heat (don't boil)",
      "Add chopped chocolate and sugar, whisk until melted",
      "Remove from heat and let cool to drinking temperature (160°F)",
      "Add cannabis tincture and vanilla extract",
      "Stir well to combine",
      "Pour into mug",
      "Top with whipped cream"
    ],
    prepTime: "5 min",
    cookTime: "5 min",
    tips: [
      "Let cool before adding tincture to preserve cannabinoids",
      "Alcohol tincture mixes well with the chocolate",
      "Effects typically onset in 30-60 minutes"
    ]
  },
  {
    id: "syrup-smoothie",
    name: "Cannabis Agave Berry Smoothie",
    category: "beverages",
    coreIngredient: "syrup",
    recipeType: "liquid-based",
    servings: 1,
    infusionAmount: 15,
    infusionUnit: "ml",
    ingredients: [
      { name: "Mixed berries (frozen)", amount: 150, unit: "g", calories: 75, protein: 1, carbs: 18, fat: 0 },
      { name: "Banana", amount: 1, unit: "medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
      { name: "Greek yogurt", amount: 120, unit: "g", calories: 80, protein: 15, carbs: 6, fat: 0 },
      { name: "Almond milk", amount: 180, unit: "ml", calories: 30, protein: 1, carbs: 1, fat: 2 },
      { name: "Chia seeds", amount: 10, unit: "g", calories: 49, protein: 2, carbs: 4, fat: 3 },
    ],
    instructions: [
      "Add all ingredients to blender",
      "Add cannabis-infused agave",
      "Blend on high until smooth and creamy",
      "Add more almond milk if too thick",
      "Pour into glass",
      "Top with extra berries if desired"
    ],
    prepTime: "5 min",
    cookTime: "0 min",
    tips: [
      "Agave mixes perfectly with smoothies",
      "Start with 10ml agave for lower dose",
      "Consume on empty stomach for faster effects"
    ]
  },

  // DIRECT-ADD WITH DISTILLATE
  {
    id: "distillate-portion-control",
    name: "Precision Dosed Single Serving",
    category: "direct-add",
    coreIngredient: "distillate",
    recipeType: "direct-add",
    servings: 1,
    infusionAmount: 0.1,
    infusionUnit: "g",
    ingredients: [
      { name: "Your chosen food", amount: 1, unit: "serving", calories: 0, protein: 0, carbs: 0, fat: 0 },
    ],
    instructions: [
      "Weigh out precise amount of distillate (0.1g = 80mg THC typically)",
      "Add directly to warm food (not hot - below 350°F)",
      "Mix thoroughly to distribute evenly",
      "Consume entire portion for accurate dosing"
    ],
    prepTime: "2 min",
    cookTime: "0 min",
    tips: [
      "Use a milligram scale for accuracy",
      "Works with any food - yogurt, oatmeal, pasta sauce",
      "Heat helps distribute distillate evenly"
    ]
  },
];