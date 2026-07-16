# Resume Summary

**AI OrderOps Workbench** is a sanitized AI operations demo for converting order PDFs and ZIP batches into traceable Excel outputs.

## One-Line Pitch

Built a review-first AI order-processing workbench with deterministic rules, evidence tracing, manual review queues, candidate-rule learning, and Docker-based demo deployment.

## Technical Scope

- Next.js dashboard for upload, task status, quality metrics, review, rules, and settings.
- FastAPI backend for parsing, rule execution, quality checks, trace records, and Excel export.
- Synthetic data pipeline to demonstrate behavior without exposing client files.
- Safety scan to prevent API keys, PDFs, spreadsheets, and customer data from entering the repository.

## Interview Talking Points

- Why model-only extraction is risky for business workflows.
- How deterministic rules and model assistance can be combined without hiding uncertainty.
- How the system decides between auto-release and manual review.
- How human corrections become candidate rules instead of silently changing production behavior.
