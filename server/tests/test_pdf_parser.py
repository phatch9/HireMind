"""
Unit tests for services/pdf_parser.py

Coverage targets:
    - Happy path: valid PDF bytes → non-empty text
    - Empty bytes → ValueError
    - Non-PDF bytes (missing %PDF- header) → ValueError
    - PDF with zero pages → ValueError (mocked)
    - Image-only PDF (no extractable text) → ValueError
    - truncate_text: under limit, exactly at limit, over limit
"""

from __future__ import annotations

import io
import struct
from unittest.mock import MagicMock, patch

import pytest

from services.pdf_parser import extract_text_from_pdf, truncate_text

# ─── Helpers ──────────────────────────────────────────────────────────────────

def _make_minimal_pdf_bytes() -> bytes:
    """
    Build a minimal valid PDF byte sequence that fitz can open.
    We construct a tiny 1-page PDF with a simple text stream.
    """
    return (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Contents 4 0 R /Resources << /Font << /F1 << /Type /Font "
        b"/Subtype /Type1 /BaseFont /Helvetica >> >> >> >>\nendobj\n"
        b"4 0 obj\n<< /Length 44 >>\nstream\n"
        b"BT /F1 12 Tf 100 700 Td (Hello World) Tj ET\n"
        b"endstream\nendobj\n"
        b"xref\n0 5\n"
        b"0000000000 65535 f \n"
        b"0000000009 00000 n \n"
        b"0000000058 00000 n \n"
        b"0000000115 00000 n \n"
        b"0000000266 00000 n \n"
        b"trailer\n<< /Size 5 /Root 1 0 R >>\n"
        b"startxref\n360\n%%EOF\n"
    )

# ─── extract_text_from_pdf ─────────────────────────────────────────────────────

class TestExtractTextFromPdf:

    def test_valid_pdf_returns_text(self) -> None:
        """A well-formed PDF with text content returns a non-empty string."""
        pdf_bytes = _make_minimal_pdf_bytes()
        text = extract_text_from_pdf(pdf_bytes)
        assert isinstance(text, str)
        assert len(text) > 0

    def test_empty_bytes_raises(self) -> None:
        with pytest.raises(ValueError, match="empty"):
            extract_text_from_pdf(b"")

    def test_non_pdf_bytes_raises(self) -> None:
        """Bytes that start with anything other than %PDF- must be rejected."""
        fake_bytes = b"Not a PDF file at all\x00\x01\x02"
        with pytest.raises(ValueError, match="valid PDF"):
            extract_text_from_pdf(fake_bytes)

    def test_jpeg_bytes_raises(self) -> None:
        """A JPEG file (starts with FF D8 FF) must be rejected cleanly."""
        jpeg_magic = b"\xff\xd8\xff\xe0" + b"\x00" * 100
        with pytest.raises(ValueError, match="valid PDF"):
            extract_text_from_pdf(jpeg_magic)

    def test_zero_page_pdf_raises(self) -> None:
        """PDFs that fitz reports as having 0 pages are rejected."""
        mock_doc = MagicMock()
        mock_doc.page_count = 0

        with patch("services.pdf_parser.fitz") as mock_fitz:
            mock_fitz.open.return_value = mock_doc
            # Still need the magic-byte check to pass
            pdf_bytes = b"%PDF-1.4\n" + b"\x00" * 20
            with pytest.raises(ValueError, match="zero pages"):
                extract_text_from_pdf(pdf_bytes)

    def test_image_only_pdf_raises(self) -> None:
        """A PDF whose pages yield only whitespace/empty text raises ValueError."""
        mock_page = MagicMock()
        mock_page.get_text.return_value = "   \n  \t  "

        mock_doc = MagicMock()
        mock_doc.page_count = 1
        mock_doc.load_page.return_value = mock_page

        with patch("services.pdf_parser.fitz") as mock_fitz:
            mock_fitz.open.return_value = mock_doc
            pdf_bytes = b"%PDF-1.4\n" + b"\x00" * 20
            with pytest.raises(ValueError, match="No readable text"):
                extract_text_from_pdf(pdf_bytes)

# ─── truncate_text ─────────────────────────────────────────────────────────────

class TestTruncateText:

    def test_short_text_unchanged(self) -> None:
        text = "Hello world"
        assert truncate_text(text, 100) == text

    def test_exactly_at_limit_unchanged(self) -> None:
        text = "A" * 100
        assert truncate_text(text, 100) == text

    def test_over_limit_is_truncated(self) -> None:
        text = "A" * 200
        result = truncate_text(text, 100)
        assert len(result) > 100          # includes the notice suffix
        assert result.startswith("A" * 100)
        assert "truncated" in result

    def test_truncation_notice_contains_char_count(self) -> None:
        text = "X" * 500
        result = truncate_text(text, 200)
        assert "200" in result
