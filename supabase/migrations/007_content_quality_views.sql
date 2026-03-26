-- Phase 6: content quality and release-readiness checks.
-- Read-only views + helper function to validate publish coverage.

-- 1) Recipe publish status summary by category
create or replace view public.v_recipe_publish_status as
select
  r.category_id,
  count(*)::int as total_recipes,
  count(*) filter (where r.is_published = true)::int as published_recipes,
  count(*) filter (where r.is_published = false)::int as draft_recipes
from public.recipes r
group by r.category_id;

-- 2) Builder map coverage against active showcase cards
create or replace view public.v_showcase_map_coverage as
select
  s.domain,
  count(*)::int as active_showcase_items,
  count(m.source_id)::int as mapped_items,
  (count(*) - count(m.source_id))::int as unmapped_items
from public.showcase_items s
left join public.builder_recipe_maps m
  on m.domain = s.domain
 and m.source_id = s.source_id
where s.is_active = true
group by s.domain;

-- 3) Missing mappings detail list
create or replace view public.v_missing_showcase_mappings as
select
  s.domain,
  s.source_id,
  s.name,
  s.section_key,
  s.sort_order
from public.showcase_items s
left join public.builder_recipe_maps m
  on m.domain = s.domain
 and m.source_id = s.source_id
where s.is_active = true
  and m.source_id is null
order by s.domain, s.sort_order;

-- 4) Recipe content completeness checks
create or replace view public.v_recipe_content_gaps as
select
  r.id as recipe_id,
  r.title,
  r.category_id,
  r.is_published,
  coalesce(i.ingredient_count, 0)::int as ingredient_count,
  coalesce(st.step_count, 0)::int as step_count,
  case when coalesce(i.ingredient_count, 0) = 0 then true else false end as missing_ingredients,
  case when coalesce(st.step_count, 0) = 0 then true else false end as missing_steps
from public.recipes r
left join (
  select recipe_id, count(*) as ingredient_count
  from public.recipe_ingredients
  group by recipe_id
) i on i.recipe_id = r.id
left join (
  select recipe_id, count(*) as step_count
  from public.recipe_steps
  group by recipe_id
) st on st.recipe_id = r.id
where coalesce(i.ingredient_count, 0) = 0
   or coalesce(st.step_count, 0) = 0
order by r.category_id, r.title;

-- 5) Quick release readiness function
create or replace function public.release_readiness_snapshot()
returns table (
  check_name text,
  status text,
  detail text
)
language sql
stable
as $$
  select
    'missing_showcase_mappings'::text as check_name,
    case when count(*) = 0 then 'pass' else 'fail' end as status,
    ('count=' || count(*))::text as detail
  from public.v_missing_showcase_mappings
  union all
  select
    'published_recipes_with_gaps'::text as check_name,
    case when count(*) = 0 then 'pass' else 'fail' end as status,
    ('count=' || count(*))::text as detail
  from public.v_recipe_content_gaps
  where is_published = true;
$$;

