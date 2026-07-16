from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass(frozen=True)
class Issue:
    order_id: str
    sku: str
    field: str
    code: str
    message: str
    severity: str = "quality"
    page: int = 1

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class TraceRecord:
    order_id: str
    sku: str
    field: str
    value: str
    source: str
    evidence: str
    page: int = 1

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class RuleCandidate:
    rule_type: str
    scope: str
    field: str
    suggested_value: str
    evidence: str
    status: str = "pending"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(frozen=True)
class OrderLine:
    order_id: str
    sku: str
    quantity: int
    product_name: str
    product_variant_1: str = ""
    product_variant_2: str = ""
    product_variant_3: str = ""
    engraving: str = ""
    design: str = ""
    front_font: str = ""
    bag_color: str = ""
    customer_message: str = ""
    delivery_name: str = ""
    delivery_address1: str = ""
    delivery_address2: str = ""
    delivery_city: str = ""
    delivery_state: str = ""
    delivery_zipcode: str = ""
    delivery_country: str = ""
    source_page: int = 1

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass
class JobResult:
    job_id: str
    job_name: str
    lines: list[OrderLine] = field(default_factory=list)
    issues: list[Issue] = field(default_factory=list)
    traces: list[TraceRecord] = field(default_factory=list)
    candidate_rules: list[RuleCandidate] = field(default_factory=list)
    metrics: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "job_id": self.job_id,
            "job_name": self.job_name,
            "lines": [line.to_dict() for line in self.lines],
            "issues": [issue.to_dict() for issue in self.issues],
            "traces": [trace.to_dict() for trace in self.traces],
            "candidate_rules": [rule.to_dict() for rule in self.candidate_rules],
            "metrics": self.metrics,
        }

