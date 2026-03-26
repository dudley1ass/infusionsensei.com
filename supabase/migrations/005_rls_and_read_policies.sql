-- Phase 4: security hardening for content reads.
-- Keeps public (anon) read access to published content only.

alter table if exists public.recipe_categories enable row level security;
alter table if exists public.recipes enable row level security;
alter table if exists public.recipe_ingredients enable row level security;
alter table if exists public.recipe_steps enable row level security;
alter table if exists public.articles enable row level security;
alter table if exists public.builder_recipe_maps enable row level security;
alter table if exists public.showcase_items enable row level security;

-- Categories
drop policy if exists "anon can read active categories" on public.recipe_categories;
create policy "anon can read active categories"
on public.recipe_categories
for select
to anon
using (is_active = true);

-- Recipes
drop policy if exists "anon can read published recipes" on public.recipes;
create policy "anon can read published recipes"
on public.recipes
for select
to anon
using (is_published = true);

-- Ingredients follow recipe visibility
drop policy if exists "anon can read ingredients of published recipes" on public.recipe_ingredients;
create policy "anon can read ingredients of published recipes"
on public.recipe_ingredients
for select
to anon
using (
  exists (
    select 1 from public.recipes r
    where r.id = recipe_ingredients.recipe_id
      and r.is_published = true
  )
);

-- Steps follow recipe visibility
drop policy if exists "anon can read steps of published recipes" on public.recipe_steps;
create policy "anon can read steps of published recipes"
on public.recipe_steps
for select
to anon
using (
  exists (
    select 1 from public.recipes r
    where r.id = recipe_steps.recipe_id
      and r.is_published = true
  )
);

-- Articles
drop policy if exists "anon can read published articles" on public.articles;
create policy "anon can read published articles"
on public.articles
for select
to anon
using (is_published = true);

-- Public maps used by frontend routing
drop policy if exists "anon can read builder maps" on public.builder_recipe_maps;
create policy "anon can read builder maps"
on public.builder_recipe_maps
for select
to anon
using (true);

-- Public showcase metadata used by category pages
drop policy if exists "anon can read active showcase items" on public.showcase_items;
create policy "anon can read active showcase items"
on public.showcase_items
for select
to anon
using (is_active = true);

