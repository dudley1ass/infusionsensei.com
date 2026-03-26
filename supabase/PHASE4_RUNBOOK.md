# Phase 4 Runbook (Finalization + Hardening)

This phase finishes the migration from hardcoded content to database-managed content.
It keeps UI/layout unchanged and focuses on data completeness, safety, and operations.

## What gets added

- `migrations/004_seed_showcase_items.sql`
  - Seeds `showcase_items` for:
    - wings (20)
    - popcorn (20)
    - coffee (20)
    - fries (20)
- `migrations/005_rls_and_read_policies.sql`
  - Enables RLS
  - Adds anon read policies for published/active records

## How to run in Supabase

1. Open Supabase SQL editor.
2. Run `004_seed_showcase_items.sql`.
3. Run `005_rls_and_read_policies.sql`.

## Verification queries

```sql
-- Showcase coverage
select domain, count(*) as item_count
from public.showcase_items
where is_active = true
group by domain
order by domain;

-- Builder maps still complete
select domain, count(*) as map_count
from public.builder_recipe_maps
group by domain
order by domain;

-- RLS enabled check
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'recipe_categories',
    'recipes',
    'recipe_ingredients',
    'recipe_steps',
    'articles',
    'builder_recipe_maps',
    'showcase_items'
  )
order by tablename;
```

Expected showcase counts:

- `coffee`: 20
- `fries`: 20
- `popcorn`: 20
- `wings`: 20

## Weekly content workflow

1. Add or update `recipes` rows (`is_published=false` while drafting).
2. Add `recipe_ingredients` and `recipe_steps`.
3. Add/update `builder_recipe_maps` where needed.
4. Add/update `showcase_items` for card metadata updates.
5. Publish by setting:
   - `recipes.is_published=true`
   - `articles.is_published=true` (for article content)

## Rollback guidance

- If a seed script has bad content, rerun with corrected upserts.
- For policy issues, rerun `005_rls_and_read_policies.sql` after edits.
- Avoid dropping content tables in production unless absolutely required.

