from __future__ import annotations

from pydantic import BaseModel, Field


class ReviewInput(BaseModel):
    job_id: str = Field(min_length=1)
    order_id: str = Field(min_length=1)
    sku: str = Field(min_length=1)
    field: str = Field(min_length=1)
    current_value: str = ""
    corrected_value: str = Field(min_length=1)
    note: str = ""


class RuleDecision(BaseModel):
    job_id: str
    rule_index: int
    status: str = Field(pattern="^(confirmed|rejected)$")

