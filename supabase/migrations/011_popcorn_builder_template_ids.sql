-- Align `builder_recipe_maps` popcorn template ids with `builderRecipeMaps.ts` (no *-popcorn suffix).
update public.builder_recipe_maps
set builder_recipe_id = case builder_recipe_id
  when 'garlic-butter-popcorn' then 'garlic-butter'
  when 'buffalo-popcorn' then 'buffalo'
  when 'caramel-popcorn' then 'caramel'
  when 'chocolate-drizzle-popcorn' then 'chocolate-drizzle'
  else builder_recipe_id
end
where domain = 'popcorn';
