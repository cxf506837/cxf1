from __future__ import annotations

import json
from pathlib import Path
from typing import Annotated

from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from .config import settings
from .demo_data import build_synthetic_pdf_text, synthetic_sku_master
from .excel_writer import write_excel_report
from .parsers import extract_text_from_upload
from .pipeline import process_order_text
from .schemas import ReviewInput, RuleDecision
from .security import collect_safe_pdf_members, sanitize_output_name
from .storage import JobStore


app = FastAPI(title=settings.app_name, version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

store = JobStore(settings.storage_root / "jobs")


@app.get("/api/health")
def health() -> dict:
    return {
        "app": settings.app_name,
        "status": "ok",
        "storage_root": str(settings.storage_root),
        "mock_model_enabled": settings.mock_model_enabled,
        "openai_configured": settings.openai_enabled,
    }


@app.post("/api/demo")
def create_demo_job() -> dict:
    result = process_order_text(
        build_synthetic_pdf_text(),
        sku_master=synthetic_sku_master(),
        job_name="synthetic-demo",
    )
    store.save(result)
    _write_report(result)
    return result.to_dict()


@app.post("/api/jobs")
async def create_job(
    file: Annotated[UploadFile, File()],
    job_name: Annotated[str | None, Form()] = None,
    openai_api_key: Annotated[str | None, Form()] = None,
) -> dict:
    # The key is intentionally accepted only for request-time use. This demo
    # does not persist or log it.
    del openai_api_key
    raw = await file.read()
    if file.filename and file.filename.lower().endswith(".zip"):
        members = collect_safe_pdf_members(raw)
        if not members:
            raise HTTPException(status_code=400, detail="ZIP 中没有可处理的 PDF 文件")
        created = []
        for name, content in members.items():
            created.append(_process_single_upload(name, content, job_name))
        return {"batch_count": len(created), "jobs": created}
    return _process_single_upload(file.filename or "upload.pdf", raw, job_name)


@app.get("/api/jobs")
def list_jobs() -> dict:
    return {"jobs": store.list_jobs()}


@app.get("/api/jobs/{job_id}")
def get_job(job_id: str) -> dict:
    job = store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    return job


@app.get("/api/jobs/{job_id}/download")
def download_job(job_id: str) -> FileResponse:
    job = store.get(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    path = settings.storage_root / "jobs" / job_id / f"{job['job_name']}_order_output.xlsx"
    if not path.exists():
        raise HTTPException(status_code=404, detail="结果文件不存在")
    return FileResponse(path, filename=path.name)


@app.post("/api/reviews")
def save_review(review: ReviewInput) -> dict:
    job = store.get(review.job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    review_dir = settings.storage_root / "jobs" / review.job_id / "reviews"
    review_dir.mkdir(parents=True, exist_ok=True)
    path = review_dir / "review.jsonl"
    record = review.model_dump()
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")
    return {"saved": True, "candidate_rule_status": "pending"}


@app.get("/api/rules")
def list_rules() -> dict:
    rules = []
    for job in store.list_jobs():
        for rule in job.get("candidate_rules", []):
            rules.append({"job_id": job["job_id"], **rule})
    return {"candidate_rules": rules, "confirmed_rules": []}


@app.post("/api/rules/decision")
def decide_rule(decision: RuleDecision) -> dict:
    # Full rule persistence is intentionally conservative in the demo. The API
    # records the decision separately instead of mutating historical job data.
    job = store.get(decision.job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="任务不存在")
    decisions_dir = settings.storage_root / "rules"
    decisions_dir.mkdir(parents=True, exist_ok=True)
    path = decisions_dir / "rule-decisions.jsonl"
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(decision.model_dump(), ensure_ascii=False) + "\n")
    return {"saved": True}


def _process_single_upload(file_name: str, content: bytes, job_name: str | None) -> dict:
    text = extract_text_from_upload(file_name, content)
    if not text.strip():
        raise HTTPException(status_code=400, detail="PDF 没有提取到可用文本")
    safe_name = sanitize_output_name(job_name or file_name)
    result = process_order_text(text, sku_master=synthetic_sku_master(), job_name=safe_name)
    store.save(result)
    _write_report(result)
    return result.to_dict()


def _write_report(result) -> Path:
    path = settings.storage_root / "jobs" / result.job_id / f"{result.job_name}_order_output.xlsx"
    return write_excel_report(result, path)

