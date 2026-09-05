import json
import logging
from typing import Dict, Any
from openai import OpenAI
from app.config import settings
from app.services.nlp_utils import extract_keywords, analyze_sentiment, evaluate_structure

logger = logging.getLogger("ai_scorer")

"""
SCORING BLEND EXPLANATION:
--------------------------
To avoid relying solely on opaque LLM scores (which can suffer from variance or hallucination),
this service implements a hybrid scoring formula blending deterministic NLP signals with LLM qualitative insights:

Overall Score = (0.35 * NLP Structural Depth) + (0.35 * Keyword Coverage Score) + (0.30 * LLM Qualitative Score)

1. NLP Structural Depth (0-100): Measures word count, sentence cohesion, and answer completeness.
2. Keyword Coverage (0-100): Evaluates presence of core domain concepts and technical acronyms.
3. LLM Qualitative Score (0-100): OpenAI GPT evaluates accuracy, problem-solving approach, and clarity.

If OPENAI_API_KEY is not configured or fails, the score naturally falls back to an NLP-weighted score:
Fallback Score = (0.50 * NLP Structural Depth) + (0.50 * Keyword Coverage Score)
"""

def evaluate_answer(question: str, answer: str) -> Dict[str, Any]:
    # 1. Compute NLP Signals
    keywords = extract_keywords(answer)
    sentiment_data = analyze_sentiment(answer)
    structural_score = evaluate_structure(answer)

    # Keyword coverage heuristic score (up to 100)
    keyword_score = min(100, len(keywords) * 20 + (10 if len(keywords) > 0 else 0))

    llm_score = None
    llm_feedback = None
    llm_qualitative = None

    api_key = settings.openai_api_key.strip()
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            prompt = (
                f"You are a principal engineer interviewing a candidate.\n"
                f"Question: {question}\n"
                f"Candidate's Answer: {answer}\n\n"
                f"Evaluate the candidate's answer and respond ONLY with a JSON object:\n"
                f"{{\n"
                f"  \"qualitativeScore\": integer between 0 and 100,\n"
                f"  \"feedback\": \"2-3 actionable sentences highlighting strengths and missing key points.\",\n"
                f"  \"qualitativeAnalysis\": \"Short evaluation of technical accuracy and clarity.\"\n"
                f"}}\n"
            )
            response = client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": "You output strictly valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                response_format={"type": "json_object"} if "gpt-4" in settings.openai_model or "gpt-3.5" in settings.openai_model else None
            )
            raw_content = response.choices[0].message.content.strip()
            data = json.loads(raw_content)
            llm_score = int(data.get("qualitativeScore", 75))
            llm_feedback = data.get("feedback", "")
            llm_qualitative = data.get("qualitativeAnalysis", "")
        except Exception as e:
            logger.warning(f"OpenAI evaluation failed: {e}. Utilizing pure NLP blend.")

    # Calculate final blended score
    if llm_score is not None:
        # Hybrid blend: 35% structure + 35% keywords + 30% LLM qualitative score
        final_score = int((0.35 * structural_score) + (0.35 * keyword_score) + (0.30 * llm_score))
        feedback = llm_feedback
        qualitative = llm_qualitative
    else:
        # Fallback NLP blend: 50% structure + 50% keywords
        final_score = int((0.50 * structural_score) + (0.50 * keyword_score))
        if structural_score >= 80 and keyword_score >= 60:
            feedback = "Strong, detailed answer addressing key concepts well."
            qualitative = "Demonstrates good domain knowledge and structured reasoning."
        elif structural_score >= 50:
            feedback = "Good foundation, but consider elaborating on specific implementation details and trade-offs."
            qualitative = "Basic structure is sound, but lacks key technical terminology."
        else:
            feedback = "Answer is quite brief. Provide a more detailed explanation using the STAR method or technical examples."
            qualitative = "Response lacks necessary depth and structural clarity."

    # Clamp score to [0, 100]
    final_score = max(0, min(100, final_score))

    return {
        "score": final_score,
        "feedback": feedback,
        "keywords": keywords if keywords else ["depth", "structure"],
        "sentiment": sentiment_data["label"],
        "structuralScore": structural_score,
        "qualitativeAnalysis": qualitative
    }
