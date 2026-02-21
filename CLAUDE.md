# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint (flat config, Next.js core-web-vitals + typescript)
npm run test         # Vitest unit tests (single run)
npm run test:watch   # Vitest in watch mode
npx vitest run path/to/file.test.ts  # Run a single test file
npm run test:e2e     # Playwright E2E tests (spins up dev server automatically)
npm run deploy       # Deploy to Vercel production
npx supabase db push # Push migrations to remote Supabase
```

## Architecture

**Next.js 16 App Router** with Supabase auth + Postgres. Deployed on Vercel.

### Data Flow Pattern
- **Server Components** (pages) fetch data via Supabase server client, pass it as props to client components
- **Server Actions** (`actions.ts` files co-located with routes) handle mutations, always verify `supabase.auth.getUser()` before DB operations
- **Middleware** (`middleware.ts`) refreshes Supabase auth sessions and redirects unauthenticated users away from protected routes (allows `/`, `/login`, `/auth`)

### Supabase Setup
- Three client factories in `utils/supabase/`: `server.ts` (RSC/actions), `client.ts` (browser), `middleware.ts` (edge)
- All clients respect `NEXT_PUBLIC_DB_SCHEMA` env var for schema routing (hub & spoke multi-app pattern)
- Two tables: `habits` (title, identity, cue, frequency as JSONB day array) and `habit_logs` (habit_id, completed_at with unique constraint per day). Both have RLS policies scoped to `auth.uid() = user_id`
- Migrations live in `supabase/migrations/`

### Key Domain Concepts
- **Protocol** = a habit. Users "initialize protocols" (create habits) with an identity statement, cue trigger, and day-of-week frequency
- **Protocol Eligibility**: creating a new habit requires the latest habit to have 10+ completions and 90% dedication rate (see `dashboard/actions.ts:checkProtocolEligibility`)
- Habit completion toggling is idempotent — inserting a duplicate log (code 23505) is silently ignored

### Component Structure
- `components/` holds reusable UI; multi-file components use folder with `index.ts` barrel export (e.g., `Dashboard/`, `HabitTaskList/`)
- `Window` component is the universal container (3px solid black border with 4px offset shadow)
- `context/NavigationLoaderContext.tsx` provides app-wide navigation loading state

### Styling — "Atkinson Protocol" (1-bit Design System)
- **Tailwind CSS 4** with modular CSS imports in `app/globals.css` → `app/styles/*.css`
- Only two colors: pure black (`#000`) and pure white (`#fff`), defined as CSS vars in `theme.css`
- Dithering patterns via CSS for simulated depth (no grayscale)
- Font: VT323 (loaded via `next/font/google`, var `--font-vt323`)
- Button classes: `btn-retro`, `btn-retro-secondary` (defined in `app/styles/buttons.css`)

### Audio & Animation
- `utils/sound-engine.ts` — Web Audio API synthesizer (no external audio files)
- `utils/animations.ts` — Framer Motion variant presets
- `components/RetroSoundController.tsx` — global sound toggle

### Integrations
- **Stripe** webhook at `app/api/webhooks/route.ts` — filters events by `app_id` metadata matching `NEXT_PUBLIC_DB_SCHEMA`
- **Resend** email via `utils/send-email.ts` — dev mode redirects all email to admin address

## Conventions

- **Commit messages**: Conventional Commits format — `<type>(<scope>): <subject>` (e.g., `feat(auth): add login form validation`)
- **Tests**: Co-located as `*.test.ts` next to implementation. Vitest with jsdom environment. Arrange → Act → Assert pattern. E2E specs in `e2e/`
- **Path alias**: `@/` maps to project root (configured in vitest and tsconfig)
- **Env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_DB_SCHEMA`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`
