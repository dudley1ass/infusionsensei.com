# Phase 8 Runbook (Audit + Change History)

This phase adds a full audit trail for content changes in Supabase.
No frontend changes.

## What gets added

- `migrations/009_content_audit_log.sql`
  - `content_audit_log` table
  - trigger function `log_content_audit()`
  - audit triggers on:
    - `recipes`
    - `recipe_ingredients`
    - `recipe_steps`
    - `builder_recipe_maps`
    - `showcase_items`
  - RLS policy blocking anon read access to audit rows

## How to run

1. Open Supabase SQL editor.
2. Run `migrations/009_content_audit_log.sql`.

## Verification

```sql
-- Confirm table exists and receives rows
select count(*) as audit_rows from public.content_audit_log;

-- Inspect latest changes
select table_name, operation, record_id, changed_by, changed_at
from public.content_audit_log
order by changed_at desc
limit 50;
```

## Weekly release use

- After content updates, run:

```sql
select table_name, operation, count(*) as changes
from public.content_audit_log
where changed_at > now() - interval '7 days'
group by table_name, operation
order by table_name, operation;
```

This gives a quick “what changed this week” report.

