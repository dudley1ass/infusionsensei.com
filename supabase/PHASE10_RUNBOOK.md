# Phase 10 Runbook (Final Cutover + Legacy Fallback Deprecation)

This is the final migration phase.
Goal: switch from hybrid fallback mode to DB-first strict mode safely.

## What changed in app config

- New env flag in frontend:
  - `VITE_CONTENT_DB_STRICT=false` (default)

When `VITE_CONTENT_DB_STRICT=true`:

- Content loaders return DB-only results.
- Local hardcoded fallback is effectively disabled for DB-backed surfaces.
- If DB content is missing, those sections show no DB rows instead of silently using legacy data.

## Cutover sequence

1. Ensure DB completeness:
   - recipes published
   - builder maps complete
   - showcase items complete
   - article rows published (for Learn cards)
2. Run quality checks:
   - `select * from public.release_readiness_snapshot();`
   - `select * from public.v_missing_showcase_mappings;`
   - `select * from public.v_recipe_content_gaps where is_published = true;`
3. In frontend env, set:
   - `VITE_CONTENT_DB_STRICT=true`
4. Deploy and smoke test:
   - recipes page
   - wings/popcorn/coffee/fries cards and builder links
   - learn page article card copy
5. Monitor audit + quality views for first weekly update cycle.

## Rollback

If any issue appears after cutover:

1. Set `VITE_CONTENT_DB_STRICT=false`
2. Redeploy frontend
3. Resolve missing data in DB
4. Retry cutover later

## End-state note

Once strict mode remains stable for at least one full weekly content cycle, you can remove legacy hardcoded datasets in a follow-up cleanup PR.

