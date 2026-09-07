# HireMind

**HireMind** is a full-stack job-search workspace: track applications from wishlist through offer, score roles against a pinned evaluation rubric, and analyze a resume against a job description with an ATS-style keyword report.

It is the UI and orchestration layer for a broader workflow that includes AI job evaluation, CV tailoring fields, batch processing, and resume analysis. Spreadsheets hide pipeline health; HireMind keeps status, company context, fit scores, reminders, and resume feedback in one place.

---

## Who it helps

Job seekers who juggle many roles at once and need:

- A single pipeline instead of tabs, notes, and a spreadsheet
- A consistent **fit score** so they spend time on roles that match
- Keyword-gap analysis before submitting a resume
- Follow-up reminders tied to real applications
- A dashboard of conversion rates (applied → interview → offer)

---

## Features Overview

These capabilities exist in the current codebase (React app + FastAPI analyzer + Supabase).

| Area | What you can do |
|------|-----------------|
| **Auth** | Email/password, email OTP (magic link), Google OAuth, session refresh, protected routes |
| **Landing** | Public marketing page at `/` (features, how it works, FAQ, pricing *copy*) |
| **Dashboard** | Pipeline counts, recent applications, quick search, upcoming reminders |
| **Applications** | Full CRUD, search, status filter, detail modal (timeline, JD snapshot, fit grade, radar chart, tailored-CV download when a URL exists) |
| **Kanban** | Drag-and-drop columns: Wishlist → Applied → Interview → Offer, plus Rejected; status dates update with the move |
| **Companies** | CRUD for employers; application counts per company |
| **Reminders** | CRUD with due dates, optional link to an application, complete/incomplete |
| **Analytics** | Status mix, interview/offer/success rates, grade distribution, monthly volume, average fit score |
| **ATS Analyzer** | Upload a PDF resume, paste a JD, get match score (0–100), missing/present keywords, recommendations; history stored in `ats_evaluations` |
| **Theming** | Dark default + light theme toggle; glassmorphism UI |

**Not fully productized yet** (schema/UI hooks exist, or landing copy mentions them): paid billing, CSV/JSON export, in-app tailored-CV *generation*, job-board auto-import, team collaboration, and a complete document-vault UI (storage API is present in `src/lib/api/StorageAPI.ts`).

---

## How the product works

1. **Sign in** and add companies, then applications (position, status, salary, location, job URL, status dates).
2. **Score & inspect** — when the AI pipeline writes an evaluation onto an application, the UI shows `fit_score` (1–5), letter grade, `recommend_apply`, a 10-dimension radar chart, strengths/concerns, and a stored JD snapshot.
3. **Track** — move cards on the Kanban board; use reminders for interviews and follow-ups; watch conversion on Analytics.
4. **Optimize the resume** — on **ATS Analyzer**, upload a PDF and paste the JD. FastAPI extracts text with PyMuPDF, calls OpenAI Structured Outputs, and the client persists the report.

```
wishlist → applied → interview → offer
              ↘ rejected
```

Status-specific dates stay in sync: `applied_date`, `interview_date`, `offer_date`, `rejected_date`.

---

# Instructions

HireMind is a React/Vite job-application workspace backed by Supabase, with a separate FastAPI service for PDF resume/JD ATS analysis. Read `CLAUDE.md` before making changes; it is the repository's authoritative agent guidance and contains the full design-system and evaluation rules.

## Build, test, and lint

Run frontend commands from the repository root:

```bash
npm install
npm run dev                         # Vite on http://localhost:3000
npm run build                       # TypeScript check followed by Vite production build
npm run lint                        # ESLint; warnings are treated as failures
npm test                            # Vitest in watch mode
npx vitest run src/lib/evaluation.test.ts
npx vitest run src/test/api/applications.test.ts
npx playwright test                 # End-to-end smoke tests; starts the Vite server
npx playwright test tests/e2e/smoke.spec.ts -g "should load the landing page"
```

Run backend commands from `server/`:

```bash
python -m pytest
python -m pytest tests/test_pdf_parser.py::TestTruncateText::test_over_limit_is_truncated
uvicorn main:app --reload --port 8000
```

The FastAPI tests use an in-process ASGI client and mock OpenAI/PDF work, so they do not need a running server or a real OpenAI request. The frontend ATS client currently uses `http://localhost:7000`; use that port when locally exercising the ATS UI, or update the client/configuration consistently if changing the backend port. Backend settings are loaded from `server/.env`; frontend Supabase settings use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Architecture

- `src/App.tsx` owns routing and auth boundaries. Public routes include the landing/auth/planner pages; application, Kanban, companies, analytics, reminders, and ATS routes render inside the authenticated `MainLayout`.
- `src/hooks/` owns Supabase-backed fetching, mutations, auth state, optimistic updates, and realtime subscriptions. Components should call hooks rather than querying Supabase directly.
- `src/lib/api/` contains the thin Supabase/API adapters; `src/lib/types.ts` is the shared domain model. Keep data access out of page and presentational components.
- `src/components/` contains reusable UI and feature components; `src/app/` contains route-level pages. Routes are lazy-loaded in `App.tsx`.
- Supabase is the system of record for auth, PostgreSQL data, realtime, and storage. SQL changes are tracked in `pipeline/migration/` and must preserve row-level security and user scoping.
- The ATS path is separate from normal Supabase CRUD: `LayoutATS` -> `useAtsEvaluation` -> `src/lib/api/ATS.ts` -> FastAPI `POST /analyze`. The server extracts PDF text with PyMuPDF, validates structured Pydantic output, calls OpenAI, and returns the result; the hook then persists the report in `ats_evaluations`.

## Domain invariants

- Application statuses are exactly `wishlist`, `applied`, `interview`, `offer`, and `rejected`. Moving a Kanban card through `useApplications.updateStatus` must update the matching status timestamp (`applied_date`, `interview_date`, `offer_date`, or `rejected_date`).
- `src/lib/evaluation.ts` is the sole source of truth for AI job-fit scoring. Use `isValidJobEvaluation()` before persisting an evaluation and `deriveEvaluationFields()` to derive `fit_score`, `fit_grade`, `recommend_apply`, and the rubric version. Use `scoreToLetterGrade()` and `computeWeightedScore()` for display/calculation; do not duplicate thresholds.
- The rubric is pinned at `EVALUATION_RUBRIC_VERSION = '2026.1'`, has ten weighted dimensions, and recommends applying at a score of 4.0 or higher. Do not change rubric dimensions or version without an intentional new rubric version.
- Separate user-editable application fields (`ApplicationFormData`) from AI-owned pipeline fields (`ApplicationPipelineFields`). AI-owned fields include JD snapshot/hash/timestamp, evaluation and derived scores, tailored-CV metadata, and `recommend_apply`.

## Code and styling conventions

- TypeScript is strict with `noUnusedLocals` and `noUnusedParameters`; avoid `any`, `@ts-ignore`, and `@ts-expect-error`. Component props use named interfaces. Use the `@/*` aliases configured in `tsconfig.json`/`vite.config.ts`.
- Keep the layering `app` pages -> hooks -> `lib/api`/Supabase. Supabase calls should destructure `{ data, error }`, handle errors before using data, select explicit columns where practical, and keep realtime subscriptions in hooks with cleanup.
- Use React 18 function components, top-level hooks, and existing optimistic/realtime patterns. Preserve the protected/public route behavior and auth state flow in `useAuth`.
- Styling is vanilla CSS in `src/index.css` and feature stylesheets, not Tailwind. Use existing HSL design tokens, `.glass`/`.glass-card`, theme classes, and CSS classes rather than inline layout or new ad hoc colors. The project defaults to the existing glassmorphism/light-dark theme system.
- Components are PascalCase, hooks/utilities are camelCase, hooks start with `use`, and constants use `UPPER_SNAKE_CASE`. Follow the import/type/component organization already used in nearby files.
- Do not modify `src/lib/supabase.ts` casually; it is shared by the data layer. Do not add a Supabase table without a migration and corresponding database documentation/RLS considerations.

## Database and integration boundaries

Use the existing typed Supabase client from `src/lib/supabase.ts`. RLS is part of the security model, so preserve `user_id` ownership and application/company relationships in queries and migrations. The migration sequence in `pipeline/migration/` includes core tables, profile RLS, position support, and AI application columns.

The FastAPI service exposes `/health` and `/analyze`; `/analyze` accepts a PDF and a job description, enforces the 10 MB PDF and minimum JD length limits, truncates inputs, rate-limits requests, and returns the typed ATS response. Keep request/response changes synchronized across `server/models/schemas.py`, `server/routers/analyze.py`, `src/lib/types.ts`, and `src/lib/api/ATS.ts`.
