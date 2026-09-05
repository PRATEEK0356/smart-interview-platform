from pydantic import BaseModel, Field
from typing import List, Optional

class QuestionRequest(BaseModel):
    role: str = Field(..., example="Software Engineer")
    type: str = Field(..., example="technical")  # technical or behavioral
    count: int = Field(default=3, ge=1, le=10)

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
    sentiment: str  # Positive, Neutral, Constructive
    structuralScore: int
    qualitativeAnalysis: str
