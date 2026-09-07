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
## Features and Routes
| Route | Access | Purpose |
|-------|--------|---------|
| `/auth/login`, `/auth/register` | Public | Sign in / sign up (Google + email) |
| `/auth/callback` | Public | OAuth return |
| `/dashboard` | Auth | Stats, pipeline, search, reminders |
| `/applications` | Auth | List, filter, add/edit, detail |
| `/kanban` | Auth | Drag-and-drop pipeline |
| `/companies` | Auth | Employer directory |
| `/reminders` | Auth | Follow-ups and deadlines |
| `/analytics` | Auth | Funnel and grade charts |
| `/ats` | Auth | Resume vs JD analyzer + history |
Unauthenticated visits to protected routes redirect to `/auth/login`. Signed-in users hitting public auth/landing are sent to `/dashboard`.

### ATS Analyzer details
- Resume: PDF, max 10 MB
- Job description: at least 50 characters
- Rate limit: 5 requests per minute per client IP
- Response: `match_score`, `missing_keywords`, `present_keywords`, `recommendations`, `summary`, `model_used`, `evaluation_version`
- API docs when the server is running: `/docs` and `/redoc`
- Health: `GET /health`
The Vite client currently calls `http://localhost:7000/analyze`. Start Uvicorn on **port 7000** so the UI and API match (the server comment in `server/main.py` mentions 8000 — use 7000 unless you change `src/lib/api/ats.ts`).
---

## Getting started
### Prerequisites
- Node.js 20+
- Python 3.9+
- A [Supabase](https://supabase.com) project (URL + anon key)
- An OpenAI API key (ATS analyzer only)

### 1. Frontend
```bash
git clone <repo-url>
cd HireMind
npm install
cp .env.example .env
```
Set in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
- Apply the database schema from `docs/DATABASE_SETUP.md` (SQL editor or Supabase CLI). You need at least `companies`, `applications`, `notes`, plus tables used by the app such as `reminders` and `ats_evaluations`, with RLS so each user only sees their rows.
```bash
npm run dev
```
[http://localhost:3000](http://localhost:3000)
### 2. ATS API (optional, required for `/ats`)
```bash
cd server
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```
Set `OPENAI_API_KEY` and include the Vite origin in CORS:
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
OPENAI_MODEL=gpt-4o-mini
```
```bash
uvicorn main:app --reload --port 7000
```
Confirm: [http://localhost:7000/health](http://localhost:7000/health)
### 3. Typical usage after login
1. Create a **company**, then an **application** (or add from Kanban).
2. Move the card as the search progresses.
3. Open the application for timeline, evaluation, and JD snapshot when those fields are populated.
4. Add **reminders** for interviews and follow-ups.
5. Use **Analytics** for conversion and grade mix.
6. Use **ATS Analyzer** to compare a resume PDF to a pasted JD; switch to **History** for past runs.
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

## Build, test

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
cd server
python -m pytest # Execute full pytest suite
python -m pytest tests/test_pdf_parser.py::TestTruncateText::test_over_limit_is_truncated
uvicorn main:app --reload --port 8000
```

The FastAPI tests use an in-process ASGI client and mock OpenAI/PDF work, so they do not need a running server or a real OpenAI request. The frontend ATS client currently uses `http://localhost:7000`; use that port when locally exercising the ATS UI, or update the client/configuration consistently if changing the backend port. Backend settings are loaded from `server/.env`; frontend Supabase settings use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Project layout
```
HireMind/
├── src/
│   ├── app/                 # Pages: dashboard, kanban, applications, companies,
│   │                        # analytics, reminders, ATS, landing, auth
│   ├── components/          # Cards, forms, Kanban, ATS dropzone, modals, navbar
│   ├── hooks/               # useAuth, useApplications, useCompanies, …
│   └── lib/                 # evaluation.ts, types, constants, supabase, api/
├── server/
│   ├── main.py              # FastAPI app, CORS, health
│   ├── routers/analyze.py   # POST /analyze
│   ├── services/            # pdf_parser, openai_analyzer
│   ├── models/schemas.py
│   └── tests/
├── docs/                    # Architecture, database, code standards, CI notes
├── tests/e2e/               # Playwright smoke tests
├── CLAUDE.md                # Agent/developer source of truth
└── package.json
```
Diagrams and schema notes: [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md), [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md), [docs/code-standards.md](docs/code-standards.md).
---
## Code Base & Technical Standards

- Strict TypeScript Standard: noUnusedLocals and noUnusedParameters are strictly enforced. Explicit type signatures are mandatory. Do not use any, @ts-ignore, or @ts-expect-error. Use @/* alias imports for clean paths.

- Data Access Patterns: All data operations must flow through app pages -> hooks -> lib/api/Supabase. Always destructure { data, error }, handle errors explicitly prior to data consumption, and ensure real-time socket subscriptions clear event listeners on unmount.

- Database & RLS Compliance: Never alter core database schemas without creating a corresponding SQL migration file in pipeline/migration/. All new tables must enforce multi-tenant isolation through explicit user_id Row Level Security constraints.

- Styling & Design Tokens: Pure CSS architecture defined in src/index.css using HSL CSS variables, .glass-card primitives, and dynamic dark/light theme state machine toggles. Do not install or introduce Tailwind utility classes or inline color overrides.
## Design notes
- Tokens live in CSS custom properties (`--bg-primary`, `--accent-primary`, glass surfaces).  
- Interactive controls use short hover/opacity transitions.  
- Fit grades in the UI: A success, B blue, C warning, D/E error, F muted.
---
## Roadmap (next)
From the product backlog: richer evaluation surfaces, JD snapshot polish, tailored-CV generation in-app, search/filter by grade and date, document vault UI, CSV/JSON export, and richer notes.
---
## License
Private project (`package.json` `"private": true`). All rights reserved unless a license file is added
