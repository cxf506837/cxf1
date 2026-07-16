from __future__ import annotations

import hashlib

from .models import JobResult
from .parsers import parse_order_text
from .quality import build_quality_metrics
from .rule_engine import build_order_line


def process_order_text(
    text: str,
    sku_master: dict[str, dict[str, str]],
    job_name: str,
) -> JobResult:
    lines = []
    issues = []
    traces = []
    candidate_rules = []
    for raw_order in parse_order_text(text):
        line, line_issues, line_traces, line_rules = build_order_line(raw_order, sku_master)
        lines.append(line)
        issues.extend(line_issues)
        traces.extend(line_traces)
        candidate_rules.extend(line_rules)

    job_id = _stable_job_id(job_name, text)
    metrics = build_quality_metrics(lines, issues, candidate_rules)
    return JobResult(
        job_id=job_id,
        job_name=job_name,
        lines=lines,
        issues=issues,
        traces=traces,
        candidate_rules=candidate_rules,
        metrics=metrics,
    )


def _stable_job_id(job_name: str, text: str) -> str:
    digest = hashlib.sha256(f"{job_name}\n{text}".encode("utf-8")).hexdigest()[:12]
    return f"demo-{digest}"

