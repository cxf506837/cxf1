from __future__ import annotations

from .models import Issue, OrderLine, RuleCandidate


def build_quality_metrics(
    lines: list[OrderLine],
    issues: list[Issue],
    candidate_rules: list[RuleCandidate],
) -> dict[str, float | int]:
    total = len(lines)
    manual_review_count = sum(1 for issue in issues if issue.severity == "manual_review")
    field_issue_count = sum(1 for issue in issues if issue.severity == "quality")
    auto_pass_count = max(total - manual_review_count - field_issue_count, 0)
    return {
        "line_count": total,
        "auto_pass_count": auto_pass_count,
        "auto_pass_rate": round(auto_pass_count / total, 4) if total else 0,
        "manual_review_count": manual_review_count,
        "field_issue_count": field_issue_count,
        "rule_hit_count": len(candidate_rules),
    }

