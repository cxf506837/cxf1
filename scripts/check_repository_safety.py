from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN_EXTENSIONS = {".pdf", ".xlsx", ".xls"}
FORBIDDEN_DIRS = {
    ".git",
    ".next",
    ".venv",
    "__pycache__",
    "node_modules",
    "outputs",
    "storage",
    "uploads",
}
FORBIDDEN_TEXT = [
    "sk-" + "proj-",
    "OPENAI_API_" + "KEY=sk-",
    "真实" + "地址",
    "客户" + "地址",
]


def main() -> int:
    findings: list[str] = []
    for path in ROOT.rglob("*"):
        if any(part in FORBIDDEN_DIRS for part in path.relative_to(ROOT).parts):
            continue
        if path.is_dir():
            continue
        if path.suffix.lower() in FORBIDDEN_EXTENSIONS:
            findings.append(f"forbidden file extension: {path.relative_to(ROOT)}")
            continue
        try:
            text = path.read_text(encoding="utf-8")
        except UnicodeDecodeError:
            continue
        for marker in FORBIDDEN_TEXT:
            if marker in text:
                findings.append(f"forbidden marker {marker!r}: {path.relative_to(ROOT)}")
    if findings:
        print("\n".join(findings))
        return 1
    print("repository safety scan passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
