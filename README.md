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

## What is shipped today

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

