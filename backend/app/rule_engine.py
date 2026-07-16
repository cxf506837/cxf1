from __future__ import annotations

import re

from .models import Issue, OrderLine, RuleCandidate, TraceRecord
from .parsers import RawOrder


BAG_COLORS = {
    "black": "Black",
    "blue": "Blue",
    "brown": "Brown",
    "coffee": "Coffee",
    "gray": "Grey",
    "grey": "Grey",
    "green": "Green",
    "pink": "Pink",
    "red": "Red",
    "white": "White",
}

FONT_RE = re.compile(r"\bfont\s*#?\s*(\d+)\b", re.IGNORECASE)
NUMBER_PREFIX_RE = re.compile(r"^\s*\d+[\).]\s*")


def build_order_line(
    raw: RawOrder,
    sku_master: dict[str, dict[str, str]],
) -> tuple[OrderLine, list[Issue], list[TraceRecord], list[RuleCandidate]]:
    master = sku_master.get(raw.sku, {})
    issues: list[Issue] = []
    traces: list[TraceRecord] = []
    candidates: list[RuleCandidate] = []
    message = raw.personalization.strip()
    clean_message_lines = [_clean_message_line(line) for line in message.splitlines() if line.strip()]
    joined_message = " ".join(clean_message_lines)
    font = _extract_font(joined_message) or master.get("default_font", "")
    bag_color = _extract_bag_color(joined_message) or master.get("default_bag_color", "")
    engraving = _extract_engraving(clean_message_lines)
    address = _parse_delivery(raw.delivery_lines)
    quantity = _extract_quantity(raw.quantity_text)

    if "?" in address["name"]:
        issues.append(
            Issue(
                order_id=raw.order_id,
                sku=raw.sku,
                field="delivery_name",
                code="question_mark_requires_review",
                message="Delivery name contains a question mark and must be checked by a human.",
                severity="manual_review",
                page=raw.page,
            )
        )

    if bag_color and bag_color not in BAG_COLORS.values():
        issues.append(
            Issue(
                order_id=raw.order_id,
                sku=raw.sku,
                field="bag_color",
                code="bag_color_not_in_allowed_list",
                message="Bag color is not in the known color list.",
                severity="quality",
                page=raw.page,
            )
        )

    line = OrderLine(
        order_id=raw.order_id,
        sku=raw.sku,
        quantity=quantity,
        product_name=master.get("product_name", ""),
        product_variant_1=master.get("variant_1", raw.color),
        product_variant_2=master.get("variant_2", ""),
        product_variant_3=master.get("variant_3", ""),
        engraving=engraving,
        front_font=font,
        bag_color=bag_color,
        customer_message=message,
        delivery_name=address["name"],
        delivery_address1=address["address1"],
        delivery_address2=address["address2"],
        delivery_city=address["city"],
        delivery_state=address["state"],
        delivery_zipcode=address["zipcode"],
        delivery_country=address["country"],
        source_page=raw.page,
    )

    traces.extend(
        [
            TraceRecord(raw.order_id, raw.sku, "sku", raw.sku, "PDF", f"SKU: {raw.sku}", raw.page),
            TraceRecord(raw.order_id, raw.sku, "product_name", line.product_name, "SKU_MASTER", raw.sku, raw.page),
            TraceRecord(raw.order_id, raw.sku, "engraving", line.engraving, "PDF_MESSAGE", message, raw.page),
            TraceRecord(raw.order_id, raw.sku, "front_font", line.front_font, "PDF_MESSAGE_OR_DEFAULT", message, raw.page),
            TraceRecord(raw.order_id, raw.sku, "bag_color", line.bag_color, "PDF_MESSAGE_OR_DEFAULT", message, raw.page),
        ]
    )

    if message and (font or bag_color):
        candidates.append(
            RuleCandidate(
                rule_type="message_parse_rule",
                scope=f"sku:{raw.sku}",
                field="customer_message",
                suggested_value=f"font={font};bag_color={bag_color}",
                evidence=message,
            )
        )

    return line, issues, traces, candidates


def _extract_quantity(quantity_text: str) -> int:
    match = re.search(r"\d+", quantity_text)
    return int(match.group(0)) if match else 1


def _clean_message_line(line: str) -> str:
    line = NUMBER_PREFIX_RE.sub("", line.strip())
    line = re.sub(r"\bNZD\s*\d+(?:\.\d+)?\b", "", line, flags=re.IGNORECASE)
    line = re.sub(r"\b\d+\s*x\s*\d+(?:\.\d+)?\s*NZD\b", "", line, flags=re.IGNORECASE)
    return re.sub(r"\s+", " ", line).strip()


def _extract_font(message: str) -> str:
    match = FONT_RE.search(message)
    return f"Font {match.group(1)}" if match else ""


def _extract_bag_color(message: str) -> str:
    for raw, normalized in BAG_COLORS.items():
        if re.search(rf"\b{re.escape(raw)}\s+bag\b", message, re.IGNORECASE):
            return normalized
    return ""


def _extract_engraving(lines: list[str]) -> str:
    cleaned: list[str] = []
    for line in lines:
        if FONT_RE.search(line):
            without_font = FONT_RE.sub("", line).strip(" ,")
            if without_font:
                cleaned.append(without_font)
            continue
        if _extract_bag_color(line):
            without_bag = re.sub(
                r"(?:\b\d+[\).]\s*)?\b\w+\s+bag\b",
                "",
                line,
                flags=re.IGNORECASE,
            ).strip(" ,")
            if without_bag:
                cleaned.append(without_bag)
            continue
        cleaned.append(line)
    return " ".join(part for part in cleaned if part).strip()


def _parse_delivery(lines: list[str]) -> dict[str, str]:
    name = lines[0] if lines else ""
    country = lines[-1] if len(lines) >= 2 else ""
    address1 = lines[1] if len(lines) >= 2 else ""
    city = state = zipcode = ""
    if len(lines) >= 3:
        city_line = lines[-2]
        match = re.match(r"(.+?),\s*([A-Z]{2})\s*(\d{4,10})", city_line)
        if match:
            city, state, zipcode = match.groups()
    return {
        "name": name,
        "address1": address1,
        "address2": "",
        "city": city,
        "state": state,
        "zipcode": zipcode,
        "country": country,
    }
