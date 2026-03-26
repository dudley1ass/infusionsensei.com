-- Phase 1: Content database foundation (no UI wiring yet)
-- Safe to run in Supabase SQL editor.

create extension if not exists pgcrypto;

-- 1) Categories
create table if not exists public.recipe_categories (
  id text primary key,
  name text not null,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) Recipes
create table if not exists public.recipes (
  id text primary key,
  title text not null,
  category_id text not null references public.recipe_categories(id) on update cascade on delete restrict,
  kind text not null default 'builder_template',
  summary text,
  image_url text,
  difficulty text not null default 'beginner',
  servings_default int not null default 1,
  thc_per_serving_label text,
  prep_minutes int not null default 0,
  cook_minutes int not null default 0,
  is_published boolean not null default true,
  is_new boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_recipes_category on public.recipes(category_id);
create index if not exists idx_recipes_published on public.recipes(is_published, published_at desc);

-- 3) Recipe ingredients
create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id text not null references public.recipes(id) on update cascade on delete cascade,
  ingredient_name text not null,
  amount numeric,
  unit text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_recipe_ingredients_recipe_id on public.recipe_ingredients(recipe_id);

-- 4) Recipe steps
create table if not exists public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id text not null references public.recipes(id) on update cascade on delete cascade,
  step_text text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_recipe_steps_recipe_id on public.recipe_steps(recipe_id);

-- 5) Articles
create table if not exists public.articles (
  id text primary key,
  slug text unique not null,
  title text not null,
  summary text,
  content_md text,
  content_json jsonb,
  hero_image_url text,
  is_published boolean not null default false,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_articles_published on public.articles(is_published, published_at desc);

-- 6) Builder recipe mappings (single source of truth for wings/popcorn/coffee/fries)
create table if not exists public.builder_recipe_maps (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in ('wings', 'popcorn', 'coffee', 'fries')),
  source_id text not null,
  builder_recipe_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (domain, source_id)
);

create index if not exists idx_builder_maps_domain on public.builder_recipe_maps(domain);
create index if not exists idx_builder_maps_recipe on public.builder_recipe_maps(builder_recipe_id);

-- Optional trigger function for updated_at maintenance
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_recipe_categories_updated_at on public.recipe_categories;
create trigger trg_recipe_categories_updated_at
before update on public.recipe_categories
for each row execute function public.touch_updated_at();

drop trigger if exists trg_recipes_updated_at on public.recipes;
create trigger trg_recipes_updated_at
before update on public.recipes
for each row execute function public.touch_updated_at();

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at
before update on public.articles
for each row execute function public.touch_updated_at();

drop trigger if exists trg_builder_recipe_maps_updated_at on public.builder_recipe_maps;
create trigger trg_builder_recipe_maps_updated_at
before update on public.builder_recipe_maps
for each row execute function public.touch_updated_at();

