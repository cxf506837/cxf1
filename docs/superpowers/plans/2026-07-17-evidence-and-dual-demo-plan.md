# Evidence And Dual Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add recruiter-facing evidence metrics and split the portfolio into a safe public demo plus a real local-backend demo.

**Architecture:** Keep the existing Next.js portfolio app and FastAPI backend. Add a frontend evidence data module that powers the homepage and a dedicated evidence page; keep the live backend flow behind `/api/live` for local recruiter sessions.

**Tech Stack:** Next.js, TypeScript, Tailwind CSS, FastAPI, Python unittest, local file storage.

## Global Constraints

- No real customer PDFs, spreadsheets, rules, API keys, customer names, addresses, or client brand names.
- The public link remains a safe synthetic-data demo.
- The real demo runs on the user's computer and is shared through a temporary tunnel.
- Data support must be synthetic but auditable: sample size, workflow metrics, test evidence, and safety boundaries.
- No new dependencies.

---

### Task 1: Frontend Contract

**Files:**
- Modify: `frontend/scripts/contract-test.mjs`

**Interfaces:**
- Consumes: source text under `frontend/app`, `frontend/components`, and `frontend/lib`.
- Produces: a failing contract until evidence and dual-demo copy exists.

- [ ] Add required strings: `安全公开版`, `真实可操作版`, `数据证据`, `120 条合成订单行`, `600+ 字段裁决`, `端到端代理测试`.
- [ ] Run: `node frontend/scripts/contract-test.mjs`.
- [ ] Expected: FAIL until implementation is added.

### Task 2: Evidence Data Module

**Files:**
- Create: `frontend/lib/evidence.ts`

**Interfaces:**
- Produces: `EVIDENCE_METRICS`, `DEMO_MODES`, `VERIFICATION_EVIDENCE`, `SAFETY_BOUNDARIES`.

- [ ] Export synthetic evidence metrics used by all pages.
- [ ] Keep values synthetic and explanatory, not claiming real customer performance.
- [ ] Run the frontend contract after wiring the module into pages.

### Task 3: Evidence Page And Homepage Entry

**Files:**
- Create: `frontend/app/evidence/page.tsx`
- Modify: `frontend/app/page.tsx`
- Modify: `frontend/components/UploadPanel.tsx`
- Modify: `frontend/components/AppShell.tsx`

**Interfaces:**
- Consumes: exports from `frontend/lib/evidence.ts`.
- Produces: recruiter-facing dual-demo explanation and an evidence page.

- [ ] Add homepage cards for safe public demo and real local-backend demo.
- [ ] Add data support cards and link to `/evidence`.
- [ ] Add `/evidence` to navigation.
- [ ] Keep the UI simple and clear for recruiters.

### Task 4: Docs

**Files:**
- Modify: `README.md`
- Modify: `docs/live-recruiter-demo.md`

**Interfaces:**
- Consumes: same evidence numbers from `frontend/lib/evidence.ts`.
- Produces: consistent recruiter-facing instructions.

- [ ] Document safe public demo vs real local demo.
- [ ] Document evidence metrics and how to explain them in interviews.

### Task 5: Verification

**Files:**
- No source changes unless verification finds defects.

- [ ] Run frontend contract.
- [ ] Run Next.js build.
- [ ] Run backend unittest.
- [ ] Run repository safety scan.
- [ ] Commit and push.
