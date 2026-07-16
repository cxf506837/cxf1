from __future__ import annotations

import json
import sqlite3
from pathlib import Path

from .models import JobResult


class JobStore:
    def __init__(self, root: str | Path = "storage/jobs") -> None:
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)
        self.database = self.root.parent / "jobs.sqlite3"
        self._init_database()

    def save(self, result: JobResult) -> Path:
        job_dir = self.root / result.job_id
        job_dir.mkdir(parents=True, exist_ok=True)
        path = job_dir / "job.json"
        path.write_text(json.dumps(result.to_dict(), ensure_ascii=False, indent=2), encoding="utf-8")
        self._save_summary(result)
        return path

    def list_jobs(self) -> list[dict]:
        jobs = []
        for path in sorted(self.root.glob("*/job.json"), reverse=True):
            jobs.append(json.loads(path.read_text(encoding="utf-8")))
        return jobs

    def get(self, job_id: str) -> dict | None:
        path = self.root / job_id / "job.json"
        if not path.exists():
            return None
        return json.loads(path.read_text(encoding="utf-8"))

    def _init_database(self) -> None:
        with sqlite3.connect(self.database) as connection:
            connection.execute(
                """
                create table if not exists jobs (
                    job_id text primary key,
                    job_name text not null,
                    line_count integer not null,
                    manual_review_count integer not null,
                    auto_pass_rate real not null
                )
                """
            )

    def _save_summary(self, result: JobResult) -> None:
        with sqlite3.connect(self.database) as connection:
            connection.execute(
                """
                insert or replace into jobs
                (job_id, job_name, line_count, manual_review_count, auto_pass_rate)
                values (?, ?, ?, ?, ?)
                """,
                (
                    result.job_id,
                    result.job_name,
                    int(result.metrics.get("line_count", 0)),
                    int(result.metrics.get("manual_review_count", 0)),
                    float(result.metrics.get("auto_pass_rate", 0)),
                ),
            )
