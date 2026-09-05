import json
import logging
from openai import OpenAI
from app.config import settings
from app.models.schemas import SessionFeedbackRequest, SessionFeedbackResponse

logger = logging.getLogger("ai_service")

def generate_session_feedback(req: SessionFeedbackRequest) -> SessionFeedbackResponse:
    """
    Generates structured AI post-interview feedback report analyzing performance,
    strengths, focus areas, and a 3-step action plan to build strong command.
    """
    api_key = settings.openai_api_key.strip()
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            qa_summary = ""
            for i, q in enumerate(req.questions):
                qa_summary += f"\nQ{i+1}: {q.questionText}\nCandidate Answer: {q.answerText}\nScore: {q.score}/100\nFeedback: {q.feedback}\n"

            prompt = (
                f"You are a Principal Engineering Lead conducting a performance debrief for a '{req.role}' candidate.\n"
                f"Programming Language: {req.language}, Difficulty: {req.difficulty}, Overall Score: {req.overallScore}/100.\n"
                f"Session Q&A Data:\n{qa_summary}\n\n"
                f"Provide a structured AI mentor feedback report in JSON object format containing:\n"
                f"- 'executiveSummary': 2-3 sentence overall assessment of performance and readiness.\n"
                f"- 'strengths': list of 2-3 specific technical strengths where candidate demonstrated strong command.\n"
                f"- 'areasToFocus': list of 2-3 technical concepts or trade-offs requiring more focus.\n"
                f"- 'actionPlan': 3 concrete actionable steps for the candidate to build strong command before their real interview.\n"
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

            return SessionFeedbackResponse(
                executiveSummary=data.get("executiveSummary", "Solid foundation demonstrated across core technical domains."),
                strengths=data.get("strengths", [f"Strong understanding of core {req.language} syntax and patterns."]),
                areasToFocus=data.get("areasToFocus", [f"Elaborate more on architectural trade-offs and memory implications in {req.language}."]),
                actionPlan=data.get("actionPlan", [f"Review {req.language} internal mechanics and concurrency primitives.", "Practice verbalizing system trade-offs aloud."])
            )
        except Exception as e:
            logger.warning(f"OpenAI session feedback generation failed: {e}. Falling back to structured heuristic evaluator.")

    # Fallback Evaluator
    score = req.overallScore
    lang = req.language or "Technical"
    
    if score >= 80:
        summary = f"Exceptional demonstration of {lang} technical depth and architectural reasoning. You verbalized trade-offs clearly and hit expected domain terms."
        strengths = [
            f"Strong command of {lang} core primitives and language features.",
            "Well-structured answer delivery with clear technical vocabulary.",
            "Demonstrated practical understanding of system execution trade-offs."
        ]
        focus = [
            f"Edge-case error handling and boundary conditions in complex {lang} scenarios.",
            "Quantifying performance gains and memory benchmarks in real-world deployments."
        ]
        action = [
            f"Review advanced {lang} concurrency patterns and garbage collection internals.",
            "Practice articulating system failure modes under high load.",
            "Maintain mock practice momentum with Senior-level interview sets."
        ]
    elif score >= 65:
        summary = f"Good baseline technical understanding of {lang}. Your answers cover fundamental concepts well, but require deeper explanation of internal mechanics and trade-offs."
        strengths = [
            f"Clear grasp of foundational {lang} syntax and common data structures.",
            "Direct and concise answer framing."
        ]
        focus = [
            f"Deepening explanation of {lang} runtime execution and memory allocation.",
            "Incorporating explicit technical terms (e.g. concurrency, immutability, transaction isolation)."
        ]
        action = [
            f"Study internal implementation of {lang} standard libraries and collections.",
            "Structure answers using the 'Concept -> Implementation -> Trade-off' framework.",
            "Re-run a mock session on your focus areas to build instant recall."
        ]
    else:
        summary = f"Foundational response provided for {lang}. To build strong command, focus on structuring longer answers and explaining 'why' specific patterns are chosen."
        strengths = [
            "Attempted all interview questions with relevant domain context.",
            "Basic understanding of core problem requirements."
        ]
        focus = [
            f"Building deeper technical vocabulary in {lang} fundamentals.",
            "Elaborating on code execution flow, state management, and memory limits."
        ]
        action = [
            f"Review {lang} core documentation and common interview question patterns.",
            "Use the microphone feature to practice speaking technical answers aloud.",
            "Schedule a Basic-level mock test to reinforce core concepts."
        ]

    return SessionFeedbackResponse(
        executiveSummary=summary,
        strengths=strengths,
        areasToFocus=focus,
        actionPlan=action
    )
