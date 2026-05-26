# PLAN.md: AI Resume Optimizer & Application Tracker Execution Blueprint

## System Architecture Target
A robust SaaS application architecture built to demonstrate high technical competency to recruiters.
- **Frontend Layer:** Next.js 15 (App Router), Tailwind CSS, Shadcn UI components.
- **API Engine Layer:** Python FastAPI, PyMuPDF, OpenAI Structured Outputs API.
- **Database & Auth Layer:** Supabase PostgreSQL with strict Row Level Security (RLS).

---

## Operational Rules & Code Quality Standards

To ensure production-grade maintainability, the Code Agent must adhere to these compliance rules:

### 1. Code Consistency & Typing
- **Backend (Python):** 100% strict type hinting on all functions. Use Pydantic objects for structural input/output schema validation.
- **Frontend (TypeScript):** Zero usage of the `any` keyword. Explicitly define custom components interface parameters and payload shapes.

### 2. Failure Domain Management & Security
- All network and parsing boundaries (e.g., File IO, LLM Calls, Database Requests) must be safely encapsulated in explicit `try/except` or `try/catch` wrappers.
- Deliver helpful, structured HTTP error messages back to the frontend instead of raw code stack traces.
- Enforce Supabase Row-Level Security (RLS) on all application tracker tables to ensure users can only interact with rows bound to their unique `auth.uid()`.

### 3. Comprehensive Automation Testing Constraints
- **Unit Tests:** Backend modules require `pytest` suites targeting text isolation tools and file uploads using mocked PDF buffers.
- **E2E Integration Validation:** Frontend features must map directly to automated testing frameworks (e.g., Playwright) that walk through user flows.
- **Test Metric Bar:** No feature branch can be integrated without hitting a minimum bar of **80% code coverage**.

---

## Step-by-Step Implementation Backlog

### Phase 1: Persistence Layer & Supabase Schema Implementation
- [ ] Create `profiles` schema linked cleanly to Supabase Auth tables.
- [ ] Create `applications` tracker schema containing job info status tracking states: `('Wishlist', 'Applied', 'Interviewing', 'Offer', 'Rejected')`.
- [ ] Create `ats_evaluations` table for persisting historical keyword analysis reports.
- [ ] Implement Row-Level Security policies to bind records exclusively to `auth.uid()`.

### Phase 2: Python Analysis Endpoint Setup
- [ ] Implement standard `main.py` utilizing FastAPI router routing boundaries.
- [ ] Wire up PyMuPDF parsing logic to process binary document streams flawlessly.
- [ ] Integrate OpenAI Structured Outputs (`beta.chat.completions.parse`) with strict schema guarantees.

### Phase 3: Frontend SaaS User Interface Development
- [ ] Construct custom drag-and-drop resume upload portal using `react-dropzone`.
- [ ] Implement a rich visual dashboard display rendering the `match_score`, `missing_keywords` badges, and a custom list of tailoring recommendations.
- [ ] Develop a clean Kanban project workspace board matching the 5 tracked system statuses.

### Phase 4: Automation Test Pipeline Verification
- [ ] Construct automated unit testing files verifying that the PyMuPDF parsing engine safely captures text strings from standard document mocks.
- [ ] Execute programmatic mocking sequences testing boundary cases like non-PDF file handling.
- [ ] Generate a complete end-to-end integration checklist matching functional expectations.

**— SUCCESS CRITERIA (ALL MUST BE TRUE) —**

1. [Specific measurable result]
2. [Specific measurable result]
3. [Specific measurable result]
4. Final deliverable runs without errors
5. Provide evidence (screenshot · test output · URL)

**— OPERATING RULES – NO COMPROMISE —**

1. **PLAN AHEAD.** Output a numbered task list before writing code.
2. **RUN AUTONOMOUSLY.** Do not ask back unless truly blocked.
3. **AUTO SELF-TEST.** After each step: run test, check output, confirm functionality.
4. **AUTO SELF-DEBUG.** If error: self-diagnose + fix. Do not push back to the user.
5. **USE ALL TOOLS.** MCP · terminal · web · execute code · fetch real data.
6. **NO PLACEHOLDERS.** No TODOs · no stubs · real components + real states.
7. **LOG PROGRESS.** Track: done parts · running parts · decisions · blockers.
8. **STAY ON TARGET.** If discovering things out of scope: note them down and continue.
9. **IF BLOCKED.** Log the issue · continue with any parts that can be done in parallel.
10. **CHECK CRITERIA BEFORE STOPPING.**
Re-read all criteria and confirm each item has been met.

**— QUALITY STANDARDS —**

* Clean code, typed, strictly follows project conventions
* Design looks like a heavily funded startup
* Output passes a senior code review
* Every pattern / env var / decision is documented

**— FINAL DELIVERABLE —**

- Confirm each criterion is met
- List of newly created / modified files
- How to run / test / deploy
- Evidence (screenshot · test output · URL)
- Important decisions + things to know
- Current limitations + follow-up directions