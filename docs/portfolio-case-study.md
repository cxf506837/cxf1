# Portfolio Case Study

## Problem

Manual order processing is error-prone when PDFs contain mixed personalization, shipping, SKU, color, font, and gift-bag instructions.

## Solution

This demo presents a workbench that extracts structured order rows, applies deterministic rules, flags risky fields, and records trace evidence for every released value.

## Highlights

- FastAPI backend with file-based workflow and SQLite summaries.
- Next.js workbench UI for upload, task review, quality metrics, rules, and settings.
- Synthetic data only, suitable for GitHub and personal website screenshots.
- Docker Compose startup for reviewers.

## What To Emphasize In A Resume

- Designed a review-first AI workflow where uncertain values are routed to humans instead of being guessed.
- Built deterministic parsing guards for SKU, font, bag color, personalization text, ZIP upload safety, and repository safety.
- Added a field-level audit trail so generated Excel rows can be explained after export.
- Created a sanitized demo environment that separates client delivery code from public portfolio material.

## Metrics To Show

| Metric | Demo value |
| --- | --- |
| Backend regression tests | 8 |
| Synthetic demo rows | 4 |
| Manual review examples | 1 |
| Real customer files in repo | 0 |
