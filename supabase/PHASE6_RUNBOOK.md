# Phase 6 Runbook (Quality Gates + Release Checks)

This phase adds SQL quality checks so weekly updates are safer before publishing.
No frontend layout changes.

## What gets added

- `migrations/007_content_quality_views.sql`
  - `v_recipe_publish_status`
  - `v_showcase_map_coverage`
  - `v_missing_showcase_mappings`
  - `v_recipe_content_gaps`
  - `release_readiness_snapshot()` helper function

## How to run in Supabase

1. Open Supabase SQL editor.
2. Run `migrations/007_content_quality_views.sql`.

## Weekly QA checklist

Run these before publishing:

```sql
-- 1) quick pass/fail snapshot
select * from public.release_readiness_snapshot();

-- 2) see missing showcase->builder mappings (should be empty)
select * from public.v_missing_showcase_mappings;

-- 3) see published recipes missing ingredients or steps (should be empty)
select * from public.v_recipe_content_gaps
where is_published = true;

-- 4) high-level counts by category/domain
select * from public.v_recipe_publish_status order by category_id;
select * from public.v_showcase_map_coverage order by domain;
```

## Pass criteria

- `missing_showcase_mappings` => `pass`
- `published_recipes_with_gaps` => `pass`

If either fails, resolve data issues before publish.

