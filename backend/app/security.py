from __future__ import annotations

import io
import re
import zipfile
from pathlib import PurePosixPath, PureWindowsPath


OPENAI_KEY_RE = re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_\-]{16,}\b")
CUSTOMER_DATA_RE = re.compile(
    r"\b(ship\s+to|customer address|" + "真实" + r"地址|" + "客户" + r"地址)\b",
    re.IGNORECASE,
)


def is_safe_zip_member(name: str) -> bool:
    normalized = name.replace("\\", "/")
    posix = PurePosixPath(normalized)
    windows = PureWindowsPath(name)
    if not normalized.lower().endswith(".pdf"):
        return False
    if normalized.startswith("/") or windows.is_absolute():
        return False
    if any(part in {"", ".", ".."} for part in posix.parts):
        return False
    if any(part.startswith(".") for part in posix.parts):
        return False
    if posix.parts and posix.parts[0].lower() == "__macosx":
        return False
    return True


def collect_safe_pdf_members(zip_bytes: bytes) -> dict[str, bytes]:
    safe: dict[str, bytes] = {}
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as archive:
        for info in archive.infolist():
            if info.is_dir() or not is_safe_zip_member(info.filename):
                continue
            safe[info.filename] = archive.read(info)
    return safe


def sanitize_output_name(name: str) -> str:
    base = name.rsplit("/", 1)[-1].rsplit("\\", 1)[-1]
    if "." in base:
        base = ".".join(base.split(".")[:-1])
    if re.search(r"[\u4e00-\u9fff]", base) or ".." in name:
        return "file"
    safe = re.sub(r"[^A-Za-z0-9_.-]+", "_", base).strip("._-")
    return safe or "file"


def find_forbidden_repository_content(files: dict[str, str]) -> list[str]:
    findings: list[str] = []
    for path, content in files.items():
        if OPENAI_KEY_RE.search(content):
            findings.append(f"{path}:possible_openai_key")
        if CUSTOMER_DATA_RE.search(content):
            findings.append(f"{path}:customer_data_marker")
    return findings
