-- Phase 7: bulk upsert helpers for weekly content updates.
-- These functions accept JSON arrays so editors can paste one payload
-- instead of running many INSERT/UPDATE statements.

-- Bulk upsert builder recipe mappings
create or replace function public.bulk_upsert_builder_maps(p_rows jsonb)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
begin
  with rows as (
    select
      (x->>'domain')::text as domain,
      (x->>'source_id')::text as source_id,
      (x->>'builder_recipe_id')::text as builder_recipe_id
    from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) x
  ),
  filtered as (
    select *
    from rows
    where domain in ('wings', 'popcorn', 'coffee', 'fries')
      and source_id is not null
      and builder_recipe_id is not null
  ),
  upserted as (
    insert into public.builder_recipe_maps (domain, source_id, builder_recipe_id)
    select domain, source_id, builder_recipe_id
    from filtered
    on conflict (domain, source_id) do update
    set builder_recipe_id = excluded.builder_recipe_id,
        updated_at = now()
    returning 1
  )
  select count(*) into v_count from upserted;

  return coalesce(v_count, 0);
end;
$$;

-- Bulk upsert showcase items
create or replace function public.bulk_upsert_showcase_items(p_rows jsonb)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int := 0;
begin
  with rows as (
    select
      (x->>'domain')::text as domain,
      (x->>'source_id')::text as source_id,
      (x->>'name')::text as name,
      (x->>'item_type')::text as item_type,
      nullif((x->>'profile')::text, '') as profile,
      nullif((x->>'build')::text, '') as build,
      coalesce(x->'tags', '[]'::jsonb) as tags,
      nullif((x->>'emoji')::text, '') as emoji,
      coalesce((x->>'primary_level')::int, 0) as primary_level,
      coalesce((x->>'secondary_level')::int, 0) as secondary_level,
      nullif((x->>'section_key')::text, '') as section_key,
      coalesce((x->>'sort_order')::int, 0) as sort_order,
      coalesce((x->>'is_active')::boolean, true) as is_active
    from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) x
  ),
  filtered as (
    select *
    from rows
    where domain in ('wings', 'popcorn', 'coffee', 'fries')
      and source_id is not null
      and name is not null
      and item_type is not null
  ),
  normalized as (
    select
      domain,
      source_id,
      name,
      item_type,
      profile,
      build,
      case when jsonb_typeof(tags) = 'array' then tags else '[]'::jsonb end as tags,
      emoji,
      greatest(0, least(3, primary_level)) as primary_level,
      greatest(0, least(3, secondary_level)) as secondary_level,
      section_key,
      sort_order,
      is_active
    from filtered
  ),
  upserted as (
    insert into public.showcase_items (
      domain, source_id, name, item_type, profile, build, tags, emoji,
      primary_level, secondary_level, section_key, sort_order, is_active
    )
    select
      domain, source_id, name, item_type, profile, build, tags, emoji,
      primary_level, secondary_level, section_key, sort_order, is_active
    from normalized
    on conflict (domain, source_id) do update
    set
      name = excluded.name,
      item_type = excluded.item_type,
      profile = excluded.profile,
      build = excluded.build,
      tags = excluded.tags,
      emoji = excluded.emoji,
      primary_level = excluded.primary_level,
      secondary_level = excluded.secondary_level,
      section_key = excluded.section_key,
      sort_order = excluded.sort_order,
      is_active = excluded.is_active,
      updated_at = now()
    returning 1
  )
  select count(*) into v_count from upserted;

  return coalesce(v_count, 0);
end;
$$;

