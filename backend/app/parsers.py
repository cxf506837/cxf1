from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass(frozen=True)
class RawOrder:
    page: int
    order_id: str
    delivery_lines: list[str]
    sku: str
    quantity_text: str
    color: str
    personalization: str


PAGE_RE = re.compile(r"^=== Page (?P<page>\d+) ===$", re.MULTILINE)


def parse_order_text(text: str) -> list[RawOrder]:
    orders: list[RawOrder] = []
    page_chunks = _split_pages(text)
    for page, chunk in page_chunks:
        order_id = _read_line_value(chunk, "Order")
        sku = _read_line_value(chunk, "SKU")
        quantity_text = _read_line_value(chunk, "Quantity")
        color = _read_line_value(chunk, "Color")
        delivery_lines = _read_block(chunk, "Ship to:", "Item:")
        personalization_lines = _read_block(chunk, "Personalization:", None)
        if not order_id or not sku:
            continue
        orders.append(
            RawOrder(
                page=page,
                order_id=order_id,
                delivery_lines=delivery_lines,
                sku=sku,
                quantity_text=quantity_text,
                color=color,
                personalization="\n".join(personalization_lines).strip(),
            )
        )
    return orders


def extract_text_from_upload(file_name: str, content: bytes) -> str:
    suffix = file_name.lower().rsplit(".", 1)[-1] if "." in file_name else ""
    if suffix == "pdf":
        text = _try_pdfplumber(content)
        if text:
            return text
    return content.decode("utf-8", errors="ignore")


def _try_pdfplumber(content: bytes) -> str:
    try:
        import io
        import pdfplumber  # type: ignore
    except Exception:
        return ""
    try:
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            return "\n".join(page.extract_text() or "" for page in pdf.pages).strip()
    except Exception:
        return ""


def _split_pages(text: str) -> list[tuple[int, str]]:
    matches = list(PAGE_RE.finditer(text))
    if not matches:
        return [(1, text)]
    chunks: list[tuple[int, str]] = []
    for index, match in enumerate(matches):
        start = match.end()
        end = matches[index + 1].start() if index + 1 < len(matches) else len(text)
        chunks.append((int(match.group("page")), text[start:end].strip()))
    return chunks


def _read_line_value(text: str, label: str) -> str:
    match = re.search(rf"^{re.escape(label)}:\s*(.+)$", text, re.MULTILINE)
    return match.group(1).strip() if match else ""


def _read_block(text: str, start_marker: str, end_marker: str | None) -> list[str]:
    start = text.find(start_marker)
    if start < 0:
        return []
    start += len(start_marker)
    end = text.find(end_marker, start) if end_marker else len(text)
    if end < 0:
        end = len(text)
    return [line.strip() for line in text[start:end].splitlines() if line.strip()]

