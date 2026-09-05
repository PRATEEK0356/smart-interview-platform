from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionRequest(BaseModel):
    role: str = Field(..., example="Software Engineer")
    type: str = Field(..., example="technical")
    count: int = Field(default=3, ge=1, le=10)
    language: Optional[str] = Field(default="Java/Python", example="Java")
    difficulty: Optional[str] = Field(default="Intermediate", example="Advanced")

class QuestionItem(BaseModel):
    questionText: str
    category: str
    expectedKeywords: List[str]

class QuestionResponse(BaseModel):
    questions: List[QuestionItem]

class EvaluationRequest(BaseModel):
    question: str
    answer: str

class EvaluationResponse(BaseModel):
    score: int = Field(..., ge=0, le=100)
    feedback: str
    keywords: List[str]
    sentiment: str
    structuralScore: int
    qualitativeAnalysis: str

class SessionFeedbackItem(BaseModel):
    questionText: str
    answerText: str
    score: Optional[int] = 0
    feedback: Optional[str] = ""

class SessionFeedbackRequest(BaseModel):
    role: str
    language: Optional[str] = "Java"
    difficulty: Optional[str] = "Intermediate"
    type: Optional[str] = "technical"
    overallScore: int
    questions: List[SessionFeedbackItem]

class SessionFeedbackResponse(BaseModel):
    executiveSummary: str
    strengths: List[str]
    areasToFocus: List[str]
    actionPlan: List[str]
