# Real Backend Recruiter Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a recruiter-facing demo that can run real backend processing on the user's computer: protected access, real synthetic job generation, upload/ZIP processing, Excel download, and a documented tunnel workflow.

**Architecture:** Keep the portfolio repository as a full-stack Next.js + FastAPI app. The online static Sites demo remains safe, while the local/live recruiter demo uses `NEXT_PUBLIC_USE_REMOTE_API=true` so the frontend calls the FastAPI backend. A lightweight password header protects mutating/demo endpoints when `ORDEROPS_DEMO_PASSWORD` is configured.

**Tech Stack:** Next.js App Router, React client components, FastAPI, Python unittest, openpyxl, local file storage, optional Cloudflare Tunnel/ngrok outside the app.

## Global Constraints

- No real customer PDFs, Excel files, SKU sheets, API keys, or business rules may enter the repo.
- Public/static demo can remain synthetic-only; local recruiter demo may execute real backend code on synthetic or user-provided PDF/ZIP.
- If a password is configured, frontend must send it per request and backend must reject protected endpoints without it.
- Downloads must be real backend Excel files when remote API mode is enabled; otherwise the static demo keeps sample CSV behavior.
- Do not add a database or paid service for this phase.

---

### Task 1: Backend Access Guard

**Files:**
- Modify: `backend/app/config.py`
- Create: `backend/app/auth.py`
- Modify: `backend/app/main.py`
- Test: `backend/tests/test_auth.py`

**Interfaces:**
- Produces: `settings.demo_access_password: str | None`
- Produces: `require_demo_access(x_demo_password: str | None) -> None`
- Consumes: header `X-Demo-Password`

- [ ] Write failing tests for protected demo/job endpoints with and without `ORDEROPS_DEMO_PASSWORD`.
- [ ] Implement config and auth dependency.
- [ ] Apply dependency to `/api/demo`, `/api/jobs`, `/api/jobs/{id}/download`, `/api/reviews`, and rule decision endpoints.
- [ ] Run `python -m unittest discover -s tests` from `backend` and verify pass.

### Task 2: Backend Real Demo Contract

**Files:**
- Modify: `backend/app/main.py`
- Modify: `backend/app/schemas.py` if needed
- Test: `backend/tests/test_main_contract.py`

**Interfaces:**
- Produces: `POST /api/demo` returning a saved real `JobResult` plus Excel file.
- Produces: `GET /api/jobs/{job_id}/download` returning `.xlsx`.

- [ ] Write failing tests proving `/api/demo` creates a job and report path exists.
- [ ] Write failing tests proving download returns the generated Excel.
- [ ] Fix any garbled Chinese error messages touched in this task.
- [ ] Run backend tests.

### Task 3: Frontend Remote API Client

**Files:**
- Modify: `frontend/lib/api.ts`
- Create: `frontend/lib/live-api.ts`
- Test: `frontend/scripts/contract-test.mjs`

**Interfaces:**
- Produces: `createRemoteDemoJob(password?: string): Promise<JobSummary>`
- Produces: `uploadRemoteOrderFile(file: File, options: { password?: string; jobName?: string }): Promise<JobSummary | { batch_count: number; jobs: JobSummary[] }>`
- Produces: `backendDownloadUrl(jobId: string): string`

- [ ] Add contract tests that source includes live API helpers and no secret persistence.
- [ ] Implement fetch helpers with `X-Demo-Password` header and clear error messages.
- [ ] Keep static fallback behavior intact.
- [ ] Run frontend contract test.

### Task 4: Frontend Real Execution Panel

**Files:**
- Modify: `frontend/components/UploadPanel.tsx`
- Modify: `frontend/app/page.tsx` if needed
- Test: `frontend/scripts/contract-test.mjs`

**Interfaces:**
- Consumes: live API helpers from Task 3.
- Produces UI for password, real demo run, optional PDF/ZIP upload, status messages, and navigation to created job.

- [ ] Add contract tests for labels: `真实后端演示`, `运行真实脱敏任务`, `访问密码`, `PDF 或 ZIP`.
- [ ] Implement client-side form with password in component state/sessionStorage only.
- [ ] On remote mode, call `/api/demo` or `/api/jobs`; on static mode, keep existing synthetic navigation and sample download.
- [ ] Run frontend contract test and production build.

### Task 5: Job Detail Download Uses Backend

**Files:**
- Modify: `frontend/app/jobs/[id]/page.tsx`
- Modify: `frontend/components/SampleDownloadButton.tsx` or create `BackendDownloadButton.tsx`
- Test: `frontend/scripts/contract-test.mjs`

**Interfaces:**
- Consumes: `NEXT_PUBLIC_USE_REMOTE_API` and `NEXT_PUBLIC_API_BASE_URL`.
- Produces visible Excel download button when backend mode is active.

- [ ] Add contract checks for `下载真实 Excel` and backend download URL helper.
- [ ] Implement download link/button with password-aware explanation.
- [ ] Keep static CSV sample download for Sites.
- [ ] Run frontend contract test and build.

### Task 6: Local Recruiter Server Scripts and Docs

**Files:**
- Modify: `.env.example`
- Modify: `scripts/start-dev-windows.cmd`
- Create: `scripts/start-live-demo-windows.cmd`
- Create: `docs/live-recruiter-demo.md`
- Modify: `README.md`

**Interfaces:**
- Produces one command for local full-stack demo.
- Documents Cloudflare Tunnel/ngrok command options without requiring secrets in repo.

- [ ] Add `.env.example` fields for `ORDEROPS_DEMO_PASSWORD`, `NEXT_PUBLIC_USE_REMOTE_API`, and `NEXT_PUBLIC_API_BASE_URL`.
- [ ] Add Windows launcher for backend and frontend in remote mode.
- [ ] Document how to expose via tunnel safely, with access password and computer-awake warning.
- [ ] Run repository safety scan.

### Task 7: Verification and GitHub Update

**Files:**
- No production files unless verification reveals missing docs.

**Commands:**
- `python -m unittest discover -s tests` from `backend`
- `node frontend/scripts/contract-test.mjs`
- `node node_modules/next/dist/bin/next build` from `frontend`
- `python scripts/check_repository_safety.py`
- `git status --short`

- [ ] Run all verification commands.
- [ ] Commit in small logical commits.
- [ ] Push to GitHub if network is available.
