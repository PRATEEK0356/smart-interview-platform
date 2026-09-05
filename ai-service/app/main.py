from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import questions, evaluate

app = FastAPI(
    title="Smart Interview AI Microservice",
    description="Microservice providing AI question generation and NLP answer scoring",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions.router)
app.include_router(evaluate.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "ai-microservice"}

if __name__ == "__main__":
    import uvicorn
    from app.config import settings
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.port, reload=True)
