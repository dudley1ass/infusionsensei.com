-- Phase 3.1: DB-backed showcase card content for category pages.
-- Supports Wings, Popcorn, Coffee, and Fries card metadata.

create table if not exists public.showcase_items (
  id uuid primary key default gen_random_uuid(),
  domain text not null check (domain in ('wings', 'popcorn', 'coffee', 'fries')),
  source_id text not null,
  name text not null,
  item_type text not null,
  profile text,
  build text,
  tags jsonb not null default '[]'::jsonb,
  emoji text,
  primary_level int not null default 0 check (primary_level between 0 and 3),
  secondary_level int not null default 0 check (secondary_level between 0 and 3),
  section_key text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (domain, source_id)
);

create index if not exists idx_showcase_items_domain on public.showcase_items(domain, sort_order);
create index if not exists idx_showcase_items_active on public.showcase_items(domain, is_active);

drop trigger if exists trg_showcase_items_updated_at on public.showcase_items;
create trigger trg_showcase_items_updated_at
before update on public.showcase_items
for each row execute function public.touch_updated_at();

