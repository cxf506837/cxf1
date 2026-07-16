# AI OrderOps Workbench

一个用于 GitHub 私有仓库和个人网站展示的脱敏 AI 订单处理项目。

它不是甲方 PHP 交付版，也不包含真实客户数据。项目展示的是一个现代化订单处理工作台如何完成：

- PDF / ZIP 上传
- 订单字段抽取
- SKU 主数据和规则命中
- 字段证据裁决
- 人工审核闭环
- 候选规则沉淀
- Excel 报告导出
- 质量看板展示

## Tech Stack

- Frontend: Next.js, TypeScript, Tailwind CSS
- Backend: FastAPI, Python
- Storage: local files plus SQLite summary index
- Export: openpyxl when available, JSON fallback for local tests
- PDF parsing: pdfplumber when available, text fallback for synthetic demo data
- Deployment: Docker Compose

## Quick Start

```bash
cp .env.example .env
docker compose up --build
```

Open:

- Frontend: http://localhost:3000
- Backend health: http://localhost:8000/api/health

The first screen can generate a synthetic demo task without uploading real customer data.

## Windows Local Preview

After installing dependencies, use:

```bat
scripts\start-dev-windows.cmd
```

Open:

- Frontend: http://127.0.0.1:3000
- Backend health: http://127.0.0.1:8000/api/health

Stop local services:

```bat
scripts\stop-dev-windows.cmd
```

## Local Backend Test

```bash
cd backend
python -m unittest discover tests
```

## Data Safety

This repository is intentionally safe for a private portfolio repo:

- no real PDF files
- no real output Excel files
- no real SKU sheets
- no API keys
- no customer names, addresses, or messages
- no client brand names

Generated files are stored under `storage/`, which is ignored by Git.

## OpenAI Usage

OpenAI is optional. By default, the demo uses deterministic rules and mock model behavior. If you want to test real model assistance locally, add `OPENAI_API_KEY` to `.env`. Never commit `.env`.

## Portfolio Usage

For a personal website, show only:

- architecture diagram
- screenshots of the synthetic demo
- quality metrics generated from sample data
- explanation of the review and rule-learning loop

Do not show real client data, real business rules, or real output tables.

## GitHub Upload

See `docs/github-upload.md`. The repository should stay private unless all business-specific details are removed and reviewed again.
