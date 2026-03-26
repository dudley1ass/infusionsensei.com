-- Phase 8: content audit logging
-- Tracks inserts/updates/deletes for critical content tables.

create table if not exists public.content_audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  operation text not null check (operation in ('INSERT', 'UPDATE', 'DELETE')),
  record_id text,
  changed_by text,
  changed_at timestamptz not null default now(),
  old_data jsonb,
  new_data jsonb
);

create index if not exists idx_content_audit_table_time
  on public.content_audit_log (table_name, changed_at desc);

create index if not exists idx_content_audit_record_time
  on public.content_audit_log (record_id, changed_at desc);

create or replace function public.log_content_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_record_id text;
  v_changed_by text;
begin
  v_changed_by := coalesce(auth.uid()::text, current_user);

  if tg_op = 'INSERT' then
    v_record_id := coalesce((to_jsonb(new)->>'id'), (to_jsonb(new)->>'source_id'));
    insert into public.content_audit_log (
      table_name, operation, record_id, changed_by, old_data, new_data
    )
    values (
      tg_table_name, tg_op, v_record_id, v_changed_by, null, to_jsonb(new)
    );
    return new;
  elsif tg_op = 'UPDATE' then
    v_record_id := coalesce((to_jsonb(new)->>'id'), (to_jsonb(new)->>'source_id'));
    insert into public.content_audit_log (
      table_name, operation, record_id, changed_by, old_data, new_data
    )
    values (
      tg_table_name, tg_op, v_record_id, v_changed_by, to_jsonb(old), to_jsonb(new)
    );
    return new;
  elsif tg_op = 'DELETE' then
    v_record_id := coalesce((to_jsonb(old)->>'id'), (to_jsonb(old)->>'source_id'));
    insert into public.content_audit_log (
      table_name, operation, record_id, changed_by, old_data, new_data
    )
    values (
      tg_table_name, tg_op, v_record_id, v_changed_by, to_jsonb(old), null
    );
    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists trg_audit_recipes on public.recipes;
create trigger trg_audit_recipes
after insert or update or delete on public.recipes
for each row execute function public.log_content_audit();

drop trigger if exists trg_audit_recipe_ingredients on public.recipe_ingredients;
create trigger trg_audit_recipe_ingredients
after insert or update or delete on public.recipe_ingredients
for each row execute function public.log_content_audit();

drop trigger if exists trg_audit_recipe_steps on public.recipe_steps;
create trigger trg_audit_recipe_steps
after insert or update or delete on public.recipe_steps
for each row execute function public.log_content_audit();

drop trigger if exists trg_audit_builder_recipe_maps on public.builder_recipe_maps;
create trigger trg_audit_builder_recipe_maps
after insert or update or delete on public.builder_recipe_maps
for each row execute function public.log_content_audit();

drop trigger if exists trg_audit_showcase_items on public.showcase_items;
create trigger trg_audit_showcase_items
after insert or update or delete on public.showcase_items
for each row execute function public.log_content_audit();

-- Read access for service/admin tooling
alter table if exists public.content_audit_log enable row level security;

drop policy if exists "anon cannot read audit log" on public.content_audit_log;
create policy "anon cannot read audit log"
on public.content_audit_log
for select
to anon
using (false);

