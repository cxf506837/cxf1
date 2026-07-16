# Private GitHub Upload Checklist

Use this only after confirming the repository is private.

## Before Upload

1. Run backend tests.
2. Run frontend build.
3. Run the repository safety scan.
4. Confirm `storage/`, `.env`, `.venv/`, `node_modules/`, `.next/`, PDFs, and Excel files are not staged.

## Commands

```bash
git status
git add .
git commit -m "Initial sanitized OrderOps portfolio demo"
git branch -M main
git remote add origin <private-repo-url>
git push -u origin main
```

## Do Not Upload

- real customer PDFs
- real output spreadsheets
- API keys
- client names
- real SKU or rule sheets
- screenshots containing customer data

