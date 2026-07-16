from __future__ import annotations

import json
from pathlib import Path

from .models import JobResult


def write_excel_report(result: JobResult, output_path: str | Path) -> Path:
    path = Path(output_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    try:
        from openpyxl import Workbook  # type: ignore
    except Exception:
        path.write_text(json.dumps(result.to_dict(), ensure_ascii=False, indent=2), encoding="utf-8")
        return path

    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Sheet1"
    headers = [
        "Order",
        "sku",
        "数量",
        "产品名称",
        "产品变量1",
        "产品变量2",
        "产品变量3",
        "刻字内容",
        "正面字体",
        "袋子颜色",
        "客户留言原文",
        "Delivery Name",
        "Delivery Address1",
        "Delivery City",
        "Delivery State",
        "Delivery Zipcode",
        "Delivery Country",
    ]
    sheet.append(headers)
    for line in result.lines:
        sheet.append(
            [
                line.order_id,
                line.sku,
                line.quantity,
                line.product_name,
                line.product_variant_1,
                line.product_variant_2,
                line.product_variant_3,
                line.engraving,
                line.front_font,
                line.bag_color,
                line.customer_message,
                line.delivery_name,
                line.delivery_address1,
                line.delivery_city,
                line.delivery_state,
                line.delivery_zipcode,
                line.delivery_country,
            ]
        )

    _write_records(workbook, "Trace", [trace.to_dict() for trace in result.traces])
    _write_records(workbook, "Issues", [issue.to_dict() for issue in result.issues])
    _write_records(workbook, "Candidate Rules", [rule.to_dict() for rule in result.candidate_rules])
    _write_records(workbook, "Summary", [result.metrics])
    workbook.save(path)
    return path


def _write_records(workbook, title: str, rows: list[dict]) -> None:
    sheet = workbook.create_sheet(title=title)
    if not rows:
        sheet.append(["暂无数据"])
        return
    headers = list(rows[0].keys())
    sheet.append(headers)
    for row in rows:
        sheet.append([row.get(header, "") for header in headers])

