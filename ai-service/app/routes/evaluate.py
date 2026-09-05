from fastapi import APIRouter, HTTPException
from app.models.schemas import EvaluationRequest, EvaluationResponse
from app.services.scorer import evaluate_answer

router = APIRouter(prefix="", tags=["Evaluation"])

@router.post("/evaluate-answer", response_model=EvaluationResponse)
async def evaluate(payload: EvaluationRequest):
    if not payload.question.strip():
        raise HTTPException(status_code=400, detail="Question text cannot be empty.")
    if not payload.answer.strip():
        raise HTTPException(status_code=400, detail="Answer text cannot be empty.")

    try:
        res = evaluate_answer(payload.question, payload.answer)
        return EvaluationResponse(**res)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")
