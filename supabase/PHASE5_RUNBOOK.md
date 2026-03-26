# Phase 5 Runbook (Content Ops Automation)

This phase adds lightweight SQL helpers to support weekly content publishing.
No frontend layout/UI changes are included.

## What gets added

- `migrations/006_content_ops_helpers.sql`
  - `public.publish_recipe(recipe_id)`
  - `public.unpublish_recipe(recipe_id)`
  - `public.clone_recipe_as_draft(source_recipe_id, new_recipe_id, new_title)`

## How to run in Supabase

1. Open Supabase SQL editor.
2. Run `migrations/006_content_ops_helpers.sql`.

## Usage examples

```sql
-- Clone an existing recipe to start a new draft
select public.clone_recipe_as_draft(
  'classic-buffalo-wings',
  'classic-buffalo-wings-v2',
  'Classic Buffalo Wings v2'
);

-- Publish when ready
select public.publish_recipe('classic-buffalo-wings-v2');

-- Unpublish if needed
select public.unpublish_recipe('classic-buffalo-wings-v2');
```

## Verification

```sql
-- Check helper functions exist
select routine_name
from information_schema.routines
where routine_schema = 'public'
  and routine_name in (
    'publish_recipe',
    'unpublish_recipe',
    'clone_recipe_as_draft'
  )
order by routine_name;

-- Check draft/publish status
select id, title, is_published, published_at, updated_at
from public.recipes
where id in ('classic-buffalo-wings-v2')
order by id;
```

## Notes

- These helpers are designed for admin/editor operations in Supabase.
- Public site reads remain controlled by RLS publish/active rules from Phase 4.

