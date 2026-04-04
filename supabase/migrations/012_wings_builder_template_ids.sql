-- Align `builder_recipe_maps` wing builder ids with `WING_SAUCE_TO_BUILDER_RECIPE` (sauce slugs; Nashville keeps `nashville-hot-wings`).
update public.builder_recipe_maps
set builder_recipe_id = case builder_recipe_id
  when 'classic-buffalo-wings' then 'classic-buffalo'
  when 'garlic-parmesan-wings' then 'garlic-parmesan'
  when 'honey-bbq-wings' then 'honey-bbq'
  when 'lemon-pepper-wings' then 'lemon-pepper'
  when 'teriyaki-wings' then 'teriyaki'
  when 'mango-habanero-wings' then 'mango-habanero'
  when 'chili-crisp-wings' then 'chili-crisp'
  when 'cajun-butter-wings' then 'cajun-butter'
  when 'sriracha-honey-wings' then 'sriracha-honey'
  when 'maple-bacon-wings' then 'maple-bacon'
  when 'brown-sugar-bourbon-wings' then 'brown-sugar-bourbon'
  when 'pineapple-ginger-wings' then 'pineapple-ginger'
  when 'honey-mustard-wings' then 'honey-mustard'
  when 'orange-glaze-wings' then 'orange-glaze'
  when 'korean-gochujang-wings' then 'korean-gochujang'
  when 'garlic-soy-umami-wings' then 'garlic-soy-umami'
  when 'truffle-butter-wings' then 'truffle-butter'
  when 'chimichurri-wings' then 'chimichurri'
  when 'ranch-butter-wings' then 'ranch-butter'
  else builder_recipe_id
end
where domain = 'wings';
