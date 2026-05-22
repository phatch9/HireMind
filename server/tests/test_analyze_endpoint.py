"""
Integration tests for POST /analyze endpoint.

Strategy:
- Use httpx.AsyncClient against the FastAPI app (no real network).
- Mock services.openai_analyzer.analyze_resume to avoid real LLM calls.
- Mock services.pdf_parser.extract_text_from_pdf to avoid real PDF I/O.
- Cover: happy path, non-PDF file, JD too short, file too large.
"""

from __future__ import annotations

import io
from unittest.mock import AsyncMock, patch

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from main import app
from models.schemas import AtsAnalysisResult

# ─── Fixtures ─────────────────────────────────────────────────────────────────

_MOCK_RESULT = AtsAnalysisResult(
    match_score=72.5,
    missing_keywords=["Kubernetes", "gRPC", "Terraform"],
    present_keywords=["Python", "FastAPI", "PostgreSQL"],
    recommendations=[
        "Add Kubernetes to your skills section and describe orchestration experience.",
        "Mention any gRPC or Protobuf projects in your work history.",
    ],
    summary=(
        "The resume demonstrates strong backend engineering skills but lacks "
        "infrastructure-as-code experience that the role requires."
    ),
)

_VALID_PDF_MAGIC = b"%PDF-1.4\nFake resume content here for testing."
_VALID_JD = "We are looking for a Senior Backend Engineer with Python, FastAPI, PostgreSQL, Kubernetes, gRPC, and Terraform experience. Minimum 5 years required."


@pytest.fixture
def anyio_backend() -> str:
    return "asyncio"


@pytest_asyncio.fixture
async def client() -> AsyncClient:
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


# ─── Health check ─────────────────────────────────────────────────────────────

@pytest.mark.anyio
async def test_health_check(client: AsyncClient) -> None:
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


# ─── Happy path ───────────────────────────────────────────────────────────────

@pytest.mark.anyio
async def test_analyze_success(client: AsyncClient) -> None:
    """Valid PDF + JD returns structured AnalyzeResponse."""
    with (
        patch(
            "routers.analyze.extract_text_from_pdf",
            return_value="Experienced Python backend engineer with FastAPI and PostgreSQL.",
        ),
        patch(
            "routers.analyze.analyze_resume",
            new=AsyncMock(return_value=_MOCK_RESULT),
        ),
    ):
        response = await client.post(
            "/analyze",
            files={"resume": ("resume.pdf", io.BytesIO(_VALID_PDF_MAGIC), "application/pdf")},
            data={"job_description": _VALID_JD},
        )

    assert response.status_code == 200
    body = response.json()
    assert body["match_score"] == pytest.approx(72.5)
    assert "Kubernetes" in body["missing_keywords"]
    assert "Python" in body["present_keywords"]
    assert len(body["recommendations"]) >= 1
    assert isinstance(body["summary"], str)
    assert body["model_used"] == "gpt-4o-mini"
    assert body["evaluation_version"] == "1.0"


# ─── Non-PDF file ─────────────────────────────────────────────────────────────

@pytest.mark.anyio
async def test_analyze_non_pdf_rejected(client: AsyncClient) -> None:
    """Uploading a non-PDF file returns 400 with PDF_PARSE_ERROR code."""
    with patch(
        "routers.analyze.extract_text_from_pdf",
        side_effect=ValueError("The uploaded file does not appear to be a valid PDF."),
    ):
        response = await client.post(
            "/analyze",
            files={"resume": ("cv.docx", io.BytesIO(b"PK\x03\x04fake-docx"), "application/octet-stream")},
            data={"job_description": _VALID_JD},
        )

    assert response.status_code == 400
    detail = response.json()["detail"]
    assert detail["code"] == "PDF_PARSE_ERROR"


# ─── JD too short ─────────────────────────────────────────────────────────────

@pytest.mark.anyio
async def test_analyze_jd_too_short(client: AsyncClient) -> None:
    """A very short JD returns 400 with JD_TOO_SHORT code."""
    response = await client.post(
        "/analyze",
        files={"resume": ("resume.pdf", io.BytesIO(_VALID_PDF_MAGIC), "application/pdf")},
        data={"job_description": "Too short"},
    )
    assert response.status_code == 400
    detail = response.json()["detail"]
    assert detail["code"] == "JD_TOO_SHORT"


# ─── File too large ───────────────────────────────────────────────────────────

@pytest.mark.anyio
async def test_analyze_file_too_large(client: AsyncClient) -> None:
    """A file exceeding the 10 MB limit returns 400 with FILE_TOO_LARGE code."""
    big_pdf = b"%PDF-1.4\n" + b"X" * (11 * 1024 * 1024)  # 11 MB
    response = await client.post(
        "/analyze",
        files={"resume": ("huge.pdf", io.BytesIO(big_pdf), "application/pdf")},
        data={"job_description": _VALID_JD},
    )
    assert response.status_code == 400
    detail = response.json()["detail"]
    assert detail["code"] == "FILE_TOO_LARGE"


# ─── LLM upstream error ───────────────────────────────────────────────────────

@pytest.mark.anyio
async def test_analyze_llm_error_returns_502(client: AsyncClient) -> None:
    """When the OpenAI call fails, the endpoint returns 502 (not 500)."""
    from openai import OpenAIError as _OpenAIError

    with (
        patch(
            "routers.analyze.extract_text_from_pdf",
            return_value="Python developer resume text.",
        ),
        patch(
            "routers.analyze.analyze_resume",
            new=AsyncMock(side_effect=_OpenAIError("rate limited")),
        ),
    ):
        response = await client.post(
            "/analyze",
            files={"resume": ("cv.pdf", io.BytesIO(_VALID_PDF_MAGIC), "application/pdf")},
            data={"job_description": _VALID_JD},
        )

    assert response.status_code == 502
    detail = response.json()["detail"]
    assert detail["code"] == "LLM_ERROR"
