# Phase 1 Runbook (Database Foundation Only)

This phase creates the content schema and seeds categories + builder maps.
It does **not** change page layout or live UI behavior.

## What gets added

- `migrations/001_content_schema.sql`
  - Tables:
    - `recipe_categories`
    - `recipes`
    - `recipe_ingredients`
    - `recipe_steps`
    - `articles`
    - `builder_recipe_maps`
- `migrations/002_seed_categories_and_builder_maps.sql`
  - Seeds category rows
  - Seeds all current wings/popcorn/coffee/fries mapping rows

## How to run in Supabase

1. Open Supabase project SQL editor.
2. Run `001_content_schema.sql`.
3. Run `002_seed_categories_and_builder_maps.sql`.

## Verification queries

```sql
select count(*) as categories from public.recipe_categories;
select domain, count(*) as map_count
from public.builder_recipe_maps
group by domain
order by domain;
```

Expected map counts:

- `coffee`: 20
- `fries`: 20
- `popcorn`: 20
- `wings`: 20

## Rollback (safe)

```sql
drop table if exists public.builder_recipe_maps cascade;
drop table if exists public.recipe_steps cascade;
drop table if exists public.recipe_ingredients cascade;
drop table if exists public.articles cascade;
drop table if exists public.recipes cascade;
drop table if exists public.recipe_categories cascade;
drop function if exists public.touch_updated_at cascade;
```

## Next step (Phase 2)

Build frontend content service (read from DB with local fallback), starting with:

1. `Recipes` page reads categories + recipes from DB
2. map lookups use `builder_recipe_maps`

### Phase 2 env vars (frontend)

Create `frontend/.env` with:

```bash
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

If missing, app safely falls back to local static recipe data.

## Phase 3.1 migration

Run:

1. `migrations/003_showcase_items.sql`

This adds `showcase_items`, which powers DB-backed card metadata for:

- wings sauces
- popcorn flavors
- coffee drinks
- fries styles

The frontend still falls back to existing local arrays if this table is empty or env vars are not set.

