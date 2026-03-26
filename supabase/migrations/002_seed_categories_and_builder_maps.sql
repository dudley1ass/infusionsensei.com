-- Phase 1 seed data:
-- - recipe categories
-- - builder recipe maps from src/app/data/builderRecipeMaps.ts

insert into public.recipe_categories (id, name, description, sort_order)
values
  ('basics', 'Basics', 'Core infusion foundations', 10),
  ('edibles', 'Edibles', 'Baked goods, savory meals, and snacks', 20),
  ('drinks', 'Drinks', 'Coffee, tea, smoothies, and beverage recipes', 30),
  ('infusions', 'Infusions', 'Base infusions and concentrates', 40),
  ('wings', 'Wings', 'Wing flavor and sauce builder templates', 50),
  ('fries', 'Fries', 'Fries style and sauce builder templates', 60),
  ('snacks', 'Snacks', 'Popcorn and candy builder templates', 70)
on conflict (id) do update
set name = excluded.name,
    description = excluded.description,
    sort_order = excluded.sort_order;

-- Clear/reseed builder maps to keep source of truth aligned.
delete from public.builder_recipe_maps;

-- Wings maps
insert into public.builder_recipe_maps (domain, source_id, builder_recipe_id) values
  ('wings', 'classic-buffalo', 'classic-buffalo-wings'),
  ('wings', 'garlic-parmesan', 'garlic-parmesan-wings'),
  ('wings', 'honey-bbq', 'honey-bbq-wings'),
  ('wings', 'lemon-pepper', 'lemon-pepper-wings'),
  ('wings', 'teriyaki', 'teriyaki-wings'),
  ('wings', 'mango-habanero', 'mango-habanero-wings'),
  ('wings', 'nashville-hot', 'nashville-hot-wings'),
  ('wings', 'chili-crisp', 'chili-crisp-wings'),
  ('wings', 'cajun-butter', 'cajun-butter-wings'),
  ('wings', 'sriracha-honey', 'sriracha-honey-wings'),
  ('wings', 'maple-bacon', 'maple-bacon-wings'),
  ('wings', 'brown-sugar-bourbon', 'brown-sugar-bourbon-wings'),
  ('wings', 'pineapple-ginger', 'pineapple-ginger-wings'),
  ('wings', 'honey-mustard', 'honey-mustard-wings'),
  ('wings', 'orange-glaze', 'orange-glaze-wings'),
  ('wings', 'korean-gochujang', 'korean-gochujang-wings'),
  ('wings', 'garlic-soy-umami', 'garlic-soy-umami-wings'),
  ('wings', 'truffle-butter', 'truffle-butter-wings'),
  ('wings', 'chimichurri', 'chimichurri-wings'),
  ('wings', 'ranch-butter', 'ranch-butter-wings');

-- Popcorn maps
insert into public.builder_recipe_maps (domain, source_id, builder_recipe_id) values
  ('popcorn', 'garlic-butter', 'garlic-butter-popcorn'),
  ('popcorn', 'parmesan-herb', 'garlic-butter-popcorn'),
  ('popcorn', 'ranch', 'garlic-butter-popcorn'),
  ('popcorn', 'truffle', 'garlic-butter-popcorn'),
  ('popcorn', 'cheddar', 'garlic-butter-popcorn'),
  ('popcorn', 'buffalo', 'buffalo-popcorn'),
  ('popcorn', 'chili-lime', 'buffalo-popcorn'),
  ('popcorn', 'cajun-spice', 'buffalo-popcorn'),
  ('popcorn', 'sriracha', 'buffalo-popcorn'),
  ('popcorn', 'nashville-hot', 'buffalo-popcorn'),
  ('popcorn', 'caramel', 'caramel-popcorn'),
  ('popcorn', 'honey-butter', 'caramel-popcorn'),
  ('popcorn', 'cinnamon-sugar', 'caramel-popcorn'),
  ('popcorn', 'maple', 'caramel-popcorn'),
  ('popcorn', 'vanilla-bean', 'caramel-popcorn'),
  ('popcorn', 'chocolate-drizzle', 'chocolate-drizzle-popcorn'),
  ('popcorn', 'cookies-cream', 'chocolate-drizzle-popcorn'),
  ('popcorn', 'peanut-butter', 'chocolate-drizzle-popcorn'),
  ('popcorn', 'smores', 'chocolate-drizzle-popcorn'),
  ('popcorn', 'salted-caramel-choc', 'chocolate-drizzle-popcorn');

-- Coffee maps
insert into public.builder_recipe_maps (domain, source_id, builder_recipe_id) values
  ('coffee', 'bulletproof', 'bulletproof-coffee'),
  ('coffee', 'infused-latte', 'bulletproof-coffee'),
  ('coffee', 'cold-brew', 'bulletproof-coffee'),
  ('coffee', 'infused-mocha', 'cannabis-smoothie'),
  ('coffee', 'infused-caramel-latte', 'bulletproof-coffee'),
  ('coffee', 'infused-americano', 'bulletproof-coffee'),
  ('coffee', 'infused-iced-coffee', 'bulletproof-coffee'),
  ('coffee', 'infused-frappuccino', 'cannabis-smoothie'),
  ('coffee', 'golden-latte', 'cannabis-tea'),
  ('coffee', 'infused-matcha', 'cannabis-tea'),
  ('coffee', 'infused-chai', 'cannabis-tea'),
  ('coffee', 'infused-hot-chocolate', 'cannabis-tea'),
  ('coffee', 'infused-irish-coffee', 'bulletproof-coffee'),
  ('coffee', 'espresso-tonic', 'cannabis-tea'),
  ('coffee', 'coconut-coffee', 'cannabis-smoothie'),
  ('coffee', 'pumpkin-spice-latte', 'cannabis-tea'),
  ('coffee', 'mint-mocha', 'cannabis-smoothie'),
  ('coffee', 'cinnamon-dolce', 'cannabis-tea'),
  ('coffee', 'cortado', 'bulletproof-coffee'),
  ('coffee', 'vanilla-latte', 'cannabis-tea');

-- Fries maps
insert into public.builder_recipe_maps (domain, source_id, builder_recipe_id) values
  ('fries', 'garlic-butter-fries', 'garlic-butter-fries'),
  ('fries', 'truffle-fries', 'truffle-fries'),
  ('fries', 'spicy-mayo-fries', 'buffalo-fries'),
  ('fries', 'cajun-fries', 'cajun-fries'),
  ('fries', 'buffalo-fries', 'buffalo-fries'),
  ('fries', 'cheese-fries', 'garlic-butter-fries'),
  ('fries', 'pesto-fries', 'truffle-fries'),
  ('fries', 'honey-sriracha-fries', 'buffalo-fries'),
  ('fries', 'lemon-herb-fries', 'truffle-fries'),
  ('fries', 'korean-fries', 'cajun-fries'),
  ('fries', 'parmesan-rosemary-fries', 'truffle-fries'),
  ('fries', 'Nashville-hot-fries', 'nashville-hot-fries'),
  ('fries', 'ranch-fries', 'garlic-butter-fries'),
  ('fries', 'miso-butter-fries', 'truffle-fries'),
  ('fries', 'poutine', 'garlic-butter-fries'),
  ('fries', 'al-pastor-fries', 'cajun-fries'),
  ('fries', 'loaded-fries', 'garlic-butter-fries'),
  ('fries', 'katsu-fries', 'cajun-fries'),
  ('fries', 'za-atar-fries', 'truffle-fries'),
  ('fries', 'chili-cheese-fries', 'buffalo-fries');

