from fastapi import APIRouter, HTTPException
from app.models.schemas import EvaluationRequest, EvaluationResponse, SessionFeedbackRequest, SessionFeedbackResponse
from app.services.scorer import evaluate_answer
from app.services.session_evaluator import generate_session_feedback

router = APIRouter(prefix="", tags=["Evaluation"])

@router.post("/evaluate-answer", response_model=EvaluationResponse)
async def evaluate_single_answer(payload: EvaluationRequest):
    try:
        result = evaluate_answer(payload.question, payload.answer)
        return EvaluationResponse(
            score=result["score"],
            feedback=result["feedback"],
            keywords=result["keywords"],
            sentiment=result["sentiment"],
            structuralScore=result["structuralScore"],
            qualitativeAnalysis=result["qualitativeAnalysis"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to evaluate answer: {str(e)}")

@router.post("/generate-session-feedback", response_model=SessionFeedbackResponse)
async def generate_post_interview_feedback(payload: SessionFeedbackRequest):
    try:
        result = generate_session_feedback(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate session feedback: {str(e)}")
