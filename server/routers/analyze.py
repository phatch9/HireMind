"""
POST /analyze — accepts a PDF resume + job description text,
returns a structured ATS evaluation.
"""

from __future__ import annotations

import logging

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status, Request
from openai import OpenAIError
from slowapi import Limiter
from slowapi.util import get_remote_address

from models.schemas import AnalyzeResponse, ErrorDetail
from services.openai_analyzer import analyze_resume
from services.pdf_parser import extract_text_from_pdf, truncate_text

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/analyze", tags=["analyze"])

# Limits — also configurable via Settings if needed
_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB
_ALLOWED_CONTENT_TYPES = {"application/pdf", "application/octet-stream"}
_MAX_RESUME_CHARS = 15_000
_MAX_JD_CHARS = 8_000

limiter = Limiter(key_func=get_remote_address)


@router.post(
    "",
    response_model=AnalyzeResponse,
    responses={
        400: {"model": ErrorDetail, "description": "Invalid input"},
        422: {"model": ErrorDetail, "description": "Validation error"},
        502: {"model": ErrorDetail, "description": "Upstream LLM error"},
    },
    summary="Analyse a resume PDF against a job description",
)
@limiter.limit("5/minute")
async def analyze_endpoint(
    request: Request,
    resume: UploadFile = File(..., description="PDF resume file (max 10 MB)"),
    job_description: str = Form(..., description="Full job description text"),
    model: str = Form(default="gpt-4o-mini", description="OpenAI model ID"),
) -> AnalyzeResponse:
    """
    Upload a PDF resume and provide a job description to receive:
    - An ATS match score (0–100)
    - Missing keywords from the JD
    - Keywords already present in the resume
    - Prioritised tailoring recommendations
    - An executive summary
    """

    # ── 1. Validate file size ─────────────────────────────────────────────────
    pdf_bytes = await resume.read()
    if len(pdf_bytes) > _MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorDetail(
                error="FILE_TOO_LARGE",
                code="FILE_TOO_LARGE",
                detail=f"File exceeds the {_MAX_FILE_SIZE_BYTES // (1024*1024)} MB limit.",
            ).model_dump(),
        )

    # ── 2. Validate job description ───────────────────────────────────────────
    jd_stripped = job_description.strip()
    if len(jd_stripped) < 50:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorDetail(
                error="JD_TOO_SHORT",
                code="JD_TOO_SHORT",
                detail="Job description must be at least 50 characters.",
            ).model_dump(),
        )

    # ── 3. Extract PDF text ───────────────────────────────────────────────────
    try:
        resume_text = extract_text_from_pdf(pdf_bytes)
    except ValueError as exc:
        logger.warning("PDF extraction failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorDetail(
                error="PDF_PARSE_ERROR",
                code="PDF_PARSE_ERROR",
                detail=str(exc),
            ).model_dump(),
        ) from exc

    # ── 4. Truncate inputs to avoid token limit issues ────────────────────────
    resume_text_truncated = truncate_text(resume_text, _MAX_RESUME_CHARS)
    jd_truncated = truncate_text(jd_stripped, _MAX_JD_CHARS)

    logger.info(
        "Analyze request | resume=%d chars | jd=%d chars | model=%s",
        len(resume_text_truncated),
        len(jd_truncated),
        model,
    )

    # ── 5. Call OpenAI ────────────────────────────────────────────────────────
    try:
        result = await analyze_resume(
            resume_text=resume_text_truncated,
            job_description=jd_truncated,
            model=model,
        )
    except OpenAIError as exc:
        logger.error("OpenAI error: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=ErrorDetail(
                error="LLM_ERROR",
                code="LLM_ERROR",
                detail="The AI analysis service is temporarily unavailable. Please try again.",
            ).model_dump(),
        ) from exc
    except ValueError as exc:
        logger.error("Structured output parsing failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=ErrorDetail(
                error="LLM_PARSE_ERROR",
                code="LLM_PARSE_ERROR",
                detail=str(exc),
            ).model_dump(),
        ) from exc

    # ── 6. Return structured response ─────────────────────────────────────────
    return AnalyzeResponse(
        match_score=result.match_score,
        missing_keywords=result.missing_keywords,
        present_keywords=result.present_keywords,
        recommendations=result.recommendations,
        summary=result.summary,
        resume_char_count=len(resume_text),
        model_used=model,
        evaluation_version="1.0",
    )
