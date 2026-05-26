"""
PDF text extraction service using PyMuPDF (fitz).
Raises ValueError with user-friendly messages for unsupported inputs.
"""

from __future__ import annotations

import io
import fitz


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract all readable text from a PDF byte buffer.

    Args:
        pdf_bytes: Raw bytes of the uploaded PDF file.

    Returns:
        Concatenated plain text from all pages, with page breaks normalised.

    Raises:
        ValueError: If the bytes cannot be parsed as a valid PDF.
        RuntimeError: If PyMuPDF encounters an internal error.
    """
    if not pdf_bytes:
        raise ValueError("PDF buffer is empty.")

    # Validate PDF magic bytes (%PDF-)
    if not pdf_bytes[:5] == b"%PDF-":
        raise ValueError(
            "The uploaded file does not appear to be a valid PDF "
            "(missing %PDF- header)."
        )

    try:
        doc: fitz.Document = fitz.open(stream=io.BytesIO(pdf_bytes), filetype="pdf")
    except Exception as exc:
        raise ValueError(f"Could not open PDF: {exc}") from exc

    if doc.page_count == 0:
        raise ValueError("The PDF contains zero pages.")

    pages: list[str] = []
    for page_index in range(doc.page_count):
        try:
            page = doc.load_page(page_index)
            pages.append(page.get_text("text"))
        except Exception as exc:
            # Log and skip unreadable pages rather than failing the whole job
            pages.append(f"[Page {page_index + 1} could not be read: {exc}]")

    doc.close()

    full_text = "\n".join(pages).strip()
    if not full_text:
        raise ValueError(
            "No readable text could be extracted from this PDF. "
            "The file may be scanned/image-based. Please upload a text-based PDF."
        )

    return full_text


def truncate_text(text: str, max_chars: int) -> str:
    """Truncate text to max_chars, appending a notice when truncated."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + f"\n\n[... truncated at {max_chars} characters ...]"
