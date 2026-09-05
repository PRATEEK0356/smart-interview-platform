from fastapi import APIRouter, HTTPException
from app.models.schemas import QuestionRequest, QuestionResponse
from app.services.question_generator import generate_questions

router = APIRouter(prefix="", tags=["Questions"])

@router.post("/generate-questions", response_model=QuestionResponse)
async def get_questions(payload: QuestionRequest):
    try:
        questions = generate_questions(
            role=payload.role,
            q_type=payload.type.lower(),
            count=payload.count,
            language=payload.language or "Java/Python",
            difficulty=payload.difficulty or "Intermediate"
        )
        return QuestionResponse(questions=questions)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate questions: {str(e)}")
