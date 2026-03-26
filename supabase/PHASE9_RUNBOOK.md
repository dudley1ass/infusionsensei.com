# Phase 9 Runbook (DB-First Learn Article Cards)

This phase makes the `Learn` page article cards DB-first for title/summary copy.
Routes and page layout remain unchanged.

## What was wired

- `loadPublishedArticlesFromDb()` in `contentService`
- `GuidesArticles` now overlays hardcoded card copy with DB values by `slug`

Fallback behavior:

- If Supabase is not configured or returns empty, existing hardcoded article titles/descriptions are used.

## DB requirements

Ensure `articles` rows are populated with:

- `slug` (must match route slug in `/learn/articles/<slug>`)
- `title`
- `summary`
- `is_published = true`

## Validation query

```sql
select slug, title, summary, is_published, published_at
from public.articles
where is_published = true
order by published_at desc nulls last, slug asc;
```

## Notes

- This phase does not replace static article route components yet.
- It enables weekly copy updates for Learn cards without code edits.

