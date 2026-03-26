# Phase 7 Runbook (Bulk Weekly Updates)

This phase adds JSON-based bulk upsert helpers for weekly content operations.
No frontend changes.

## What gets added

- `migrations/008_bulk_upsert_helpers.sql`
  - `public.bulk_upsert_builder_maps(jsonb)`
  - `public.bulk_upsert_showcase_items(jsonb)`

## Why this helps

- Update many rows in one SQL call
- Safer than manual one-by-one edits
- Works well with exported JSON from sheets or scripts

## How to run

1. Open Supabase SQL editor.
2. Run `migrations/008_bulk_upsert_helpers.sql`.

## Example usage

```sql
-- 1) builder maps
select public.bulk_upsert_builder_maps(
  '[
    {"domain":"wings","source_id":"classic-buffalo","builder_recipe_id":"classic-buffalo-wings"},
    {"domain":"wings","source_id":"teriyaki","builder_recipe_id":"teriyaki-wings"}
  ]'::jsonb
);

-- 2) showcase items
select public.bulk_upsert_showcase_items(
  '[
    {
      "domain":"wings",
      "source_id":"classic-buffalo",
      "name":"Classic Buffalo",
      "item_type":"Butter",
      "profile":"Spicy / Tangy",
      "build":"Cannabutter + hot sauce + garlic",
      "tags":["spicy","classic"],
      "emoji":"🌶️",
      "primary_level":2,
      "secondary_level":0,
      "section_key":"classic-core",
      "sort_order":10,
      "is_active":true
    }
  ]'::jsonb
);
```

## Validation

```sql
select domain, count(*) from public.builder_recipe_maps group by domain order by domain;
select domain, count(*) from public.showcase_items where is_active = true group by domain order by domain;
select * from public.release_readiness_snapshot();
```

