"""
Pydantic models — single source of truth for request/response shapes.
All fields are strictly typed; no `Any` usage.
"""

from __future__ import annotations

from typing import Annotated, Optional
from pydantic import BaseModel, Field, field_validator


# ─── OpenAI Structured Output schema ─────────────

class AtsAnalysisResult(BaseModel):
    """
    Strict schema passed to OpenAI `beta.chat.completions.parse`.
    Every field maps 1-to-1 to the `ats_evaluations` DB table.
    """

    match_score: Annotated[float, Field(ge=0, le=100, description="ATS compatibility score 0–100")]
    missing_keywords: list[str] = Field(
        default_factory=list,
        description="Keywords or phrases from the JD absent in the resume",
    )
    present_keywords: list[str] = Field(
        default_factory=list,
        description="Keywords or phrases from the JD already in the resume",
    )
    recommendations: list[str] = Field(
        default_factory=list,
        description="Ordered, specific suggestions to improve the resume for this JD",
        min_length=1,
    )
    summary: str = Field(
        description="2-3 sentence executive summary of the fit assessment",
    )

    @field_validator("match_score")
    @classmethod
    def round_score(cls, v: float) -> float:
        return round(v, 2)


# ─── API response model ─────────────────────────

class AnalyzeResponse(BaseModel):
    """HTTP response returned by POST /analyze."""

    match_score: float
    missing_keywords: list[str]
    present_keywords: list[str]
    recommendations: list[str]
    summary: str
    resume_char_count: int
    model_used: str
    evaluation_version: str


# ─── Error response ─────────────────────────────

class ErrorDetail(BaseModel):
    """Structured error envelope — never exposes raw stack traces."""

    error: str
    code: str
    detail: Optional[str] = None
