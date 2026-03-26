-- Phase 5: operational helper functions for weekly content workflow.
-- These helpers are intended for authenticated admin/editor usage in Supabase SQL editor.

-- Publish a recipe (sets publish timestamp if missing)
create or replace function public.publish_recipe(p_recipe_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.recipes
  set
    is_published = true,
    published_at = coalesce(published_at, now()),
    updated_at = now()
  where id = p_recipe_id;
end;
$$;

-- Unpublish a recipe (keeps data but removes from public reads)
create or replace function public.unpublish_recipe(p_recipe_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.recipes
  set
    is_published = false,
    updated_at = now()
  where id = p_recipe_id;
end;
$$;

-- Duplicate an existing recipe as a draft (ingredients + steps copied)
create or replace function public.clone_recipe_as_draft(
  p_source_recipe_id text,
  p_new_recipe_id text,
  p_new_title text default null
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_source public.recipes%rowtype;
begin
  if exists(select 1 from public.recipes where id = p_new_recipe_id) then
    raise exception 'Recipe id % already exists', p_new_recipe_id;
  end if;

  select * into v_source
  from public.recipes
  where id = p_source_recipe_id;

  if not found then
    raise exception 'Source recipe % not found', p_source_recipe_id;
  end if;

  insert into public.recipes (
    id, title, category_id, kind, summary, image_url, difficulty,
    servings_default, thc_per_serving_label, prep_minutes, cook_minutes,
    is_published, is_new, published_at, seo_title, seo_description
  )
  values (
    p_new_recipe_id,
    coalesce(p_new_title, v_source.title || ' (Draft)'),
    v_source.category_id,
    v_source.kind,
    v_source.summary,
    v_source.image_url,
    v_source.difficulty,
    v_source.servings_default,
    v_source.thc_per_serving_label,
    v_source.prep_minutes,
    v_source.cook_minutes,
    false,
    true,
    null,
    v_source.seo_title,
    v_source.seo_description
  );

  insert into public.recipe_ingredients (recipe_id, ingredient_name, amount, unit, sort_order)
  select p_new_recipe_id, ingredient_name, amount, unit, sort_order
  from public.recipe_ingredients
  where recipe_id = p_source_recipe_id
  order by sort_order asc;

  insert into public.recipe_steps (recipe_id, step_text, sort_order)
  select p_new_recipe_id, step_text, sort_order
  from public.recipe_steps
  where recipe_id = p_source_recipe_id
  order by sort_order asc;

  return p_new_recipe_id;
end;
$$;

