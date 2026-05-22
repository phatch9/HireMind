"""
OpenAI analysis service using Structured Outputs (beta.chat.completions.parse).
Returns a validated AtsAnalysisResult Pydantic object — no raw JSON parsing needed.
"""

from __future__ import annotations

from openai import AsyncOpenAI, OpenAIError

from models.schemas import AtsAnalysisResult

# System prompt template
_SYSTEM_PROMPT = """You are an expert ATS (Applicant Tracking System) resume analyst.
Your job is to compare a candidate's resume against a job description and produce a
precise, actionable analysis.

Rules:
- match_score: percentage 0-100 reflecting how well the resume matches ATS requirements.
  Consider keyword density, required skills, years of experience, education, and formatting.
- missing_keywords: EXACT phrases or skills from the JD that are absent in the resume.
  Prioritise technical skills, tools, certifications, and required qualifications.
- present_keywords: EXACT phrases or skills from the JD already present in the resume.
- recommendations: Specific, actionable suggestions to improve the ATS score.
  Each must be a complete sentence explaining WHAT to add/change and WHY.
  Order from highest to lowest impact.
- summary: 2-3 sentences that an HR professional could read in under 10 seconds.
"""


async def analyze_resume(
    *,
    resume_text: str,
    job_description: str,
    model: str,
) -> AtsAnalysisResult:
    """
    Send resume + JD to OpenAI using Structured Outputs and return parsed result.

    Args:
        resume_text: Plain text extracted from the candidate's PDF resume.
        job_description: Raw job description text provided by the user.
        model: OpenAI model ID (e.g. 'gpt-4o-mini').

    Returns:
        Validated AtsAnalysisResult Pydantic model.

    Raises:
        OpenAIError: On API-level failures (rate limit, auth, etc).
        ValueError: If the structured output response is empty or malformed.
    """
    client = AsyncOpenAI()  # Reads OPENAI_API_KEY from environment

    user_message = (
        f"=== RESUME ===\n{resume_text}\n\n"
        f"=== JOB DESCRIPTION ===\n{job_description}"
    )

    try:
        completion = await client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            response_format=AtsAnalysisResult,
            temperature=0.1,   # Low temperature for consistent, factual output
            max_tokens=2048,
        )
    except OpenAIError as exc:
        raise OpenAIError(f"OpenAI API error during analysis: {exc}") from exc

    parsed = completion.choices[0].message.parsed
    if parsed is None:
        raise ValueError(
            "OpenAI returned an empty structured output. "
            "This may indicate a content policy refusal."
        )

    return parsed
