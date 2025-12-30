# Copilot / AI Agent Instructions for this-time-lets-go

Purpose: help an AI coding agent get productive quickly. Focus on the Next.js app in `final-bms/` (TypeScript + Supabase) and the DB migrations in `supabase/migrations/`.

## Quick orientation
- Main app: `final-bms/` — a Next.js (app dir) TypeScript project. Run locally with `npm run dev` inside `final-bms/`.
- Database: schema and stored procedures live in `supabase/migrations/` (timestamped SQL files). Types are generated to `final-bms/types/supabase.ts`.
- Auth / DB client helpers: `final-bms/src/lib/supabase/`:
  - `server.ts` — wraps Supabase Server client for server components (uses `cookies()`)
  - `admin.ts` — service-role admin client (requires `SUPABASE_SERVICE_ROLE_KEY`, server-only)
  - `storage.ts` — bucket helpers (exports `PROJECT_ASSETS_BUCKET`)

## Key architecture patterns to follow
- Server-first rendering: many pages are Server Components and call `createClient()` directly inside `async` components to query Supabase (example: `src/app/(dashboard)/projects/page.tsx`). Prefer server-side data fetching for pages that rely on Supabase.
- Server Actions: all mutation/back-end logic is centralized under `src/app/actions/` (e.g., `revisions.ts`, `invoices.ts`, `upload-actions.ts`). These functions are invoked from the app as server actions/form `action` handlers — treat them as the main integration surface for changing data.
- API routes: `src/app/api/*` contains app routes (webhooks, download endpoints). Use them for external integrations and single-purpose endpoints.
- Storage buckets: storage access is done with Supabase storage APIs. The canonical bucket name constant is `PROJECT_ASSETS_BUCKET` (`project-assets`). Other buckets present in code: `blueprints`, `site-photos`, etc.
- DB functions & RPCs: the app calls RPCs (example: `get_profitability_data` in profitability page); check `supabase/migrations/` for related function SQL.

## Environment variables (required)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL (used by client/server helpers)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — public anon key (used by server-side helpers too)
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (used only by `supabaseAdmin`; never expose to the browser)

Note: `admin.ts` will throw if the required env vars are missing.

## Practical guidance / Do's and Don'ts for the agent
- Use `createClient()` (from `src/lib/supabase/server.ts`) inside server components and server actions. This is the canonical way to access user-scoped Supabase operations because it hooks into Next's cookie store.
- For elevated tasks (bypass RLS or admin writes), use `supabaseAdmin` from `src/lib/supabase/admin.ts` only on server-only codepaths (server actions or build scripts).
- When adding DB changes, add a new timestamped SQL migration under `supabase/migrations/` (follow existing file naming) and update types if applicable. Treat migrations as the source of truth for schema changes.
- Preserve existing naming & conventions: migration filenames with leading timestamp, `project-assets` bucket constant usage, and server actions under `app/actions/`.
- When accessing storage URLs, the pattern `process.env.NEXT_PUBLIC_SUPABASE_URL + '/storage/v1/object/public/<bucket>/<path>'` is used in code (see `RevisionList` and `revision-list.tsx`).

## Files to read first (fastest onboarding)
1. `final-bms/src/lib/supabase/server.ts` — how server client is created and cookie behavior.
2. `final-bms/src/lib/supabase/admin.ts` — admin client requirements and usage.
3. `final-bms/src/app/actions/*.ts` — canonical server-side mutation examples.
4. `final-bms/src/app/(dashboard)/*` — observe data-fetch patterns in pages.
5. `supabase/migrations/` — DB schema, functions, and access policies.
6. `final-bms/types/supabase.ts` — generated DB types; reference when adding queries.

## Small examples (copy/paste friendly)
- Read data in a Server Component:

```ts
import { createClient } from '@/lib/supabase/server';
const supabase = createClient();
const { data: projects } = await supabase.from('projects').select();
```

- Admin client usage (server-only):

```ts
import { supabaseAdmin } from '@/lib/supabase/admin';
await supabaseAdmin.from('projects').insert({ ... });
```

- Creating bucket if missing (storage helper exists): see `initializeProjectAssetsBucket` in `src/lib/supabase/storage.ts`.

## Testing / linting / build
- Dev server: `cd final-bms && npm run dev`
- Build: `cd final-bms && npm run build`
- Lint: `cd final-bms && npm run lint`
- There are no project-level test scripts; rely on manual local testing and integration testing against a seeded Supabase instance.

## Notes / Caveats
- Many files use the generated `types/supabase.ts`. If you change the DB you should also regenerate or update the types.
- Some server components try to set cookies via `cookies()` and the `server.ts` helper swallows ``set``/``remove`` errors when called from server components — take care when adding cookie logic.

---
If any of these areas look incomplete or you'd like me to expand (e.g., add a step-by-step migration checklist or recommended supabase CLI commands), tell me which part to expand and I will update this file. 

Feedback requested: Is there a specific workflow you'd like documented (migrations, seeding, deployment) or any particular developer onboarding questions to add?