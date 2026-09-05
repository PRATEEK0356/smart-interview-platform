import json
import logging
from typing import List
from openai import OpenAI
from app.config import settings
from app.models.schemas import QuestionItem

logger = logging.getLogger("ai_service")

# Curated fallback questions by role and type
ROLE_QUESTION_BANK = {
    "technical": {
        "Full Stack Engineer": [
            {
                "questionText": "How do you optimize rendering performance in a large-scale React application with frequent state updates?",
                "category": "Frontend Performance",
                "expectedKeywords": ["useMemo", "useCallback", "virtualization", "component splitting", "state collocation"]
            },
            {
                "questionText": "Explain how you would design an index strategy in MongoDB for a query with equality, sort, and range conditions (ESR rule).",
                "category": "Database Optimization",
                "expectedKeywords": ["ESR rule", "compound index", "query execution plan", "explain()", "index scan"]
            },
            {
                "questionText": "What are the primary differences between HTTP/1.1, HTTP/2, and WebSockets when building real-time client-server communication?",
                "category": "Networking & Protocols",
                "expectedKeywords": ["multiplexing", "full-duplex", "connection overhead", "header compression", "sse"]
            },
            {
                "questionText": "How do you handle JWT authentication securely in web applications regarding XSS and CSRF prevention?",
                "category": "Web Security",
                "expectedKeywords": ["httpOnly cookie", "sameSite", "CSRF token", "XSS sanitization", "short-lived token"]
            },
            {
                "questionText": "Describe your strategy for state management in a complex React SPA using Redux Toolkit.",
                "category": "State Management",
                "expectedKeywords": ["createSlice", "createAsyncThunk", "normalized state", "selectors", "middleware"]
            }
        ],
        "Backend Engineer": [
            {
                "questionText": "How do you prevent race conditions when two concurrent requests try to decrement a user's account balance?",
                "category": "Concurrency & Locking",
                "expectedKeywords": ["optimistic locking", "pessimistic locking", "atomic operations", "database transaction", "isolation level"]
            },
            {
                "questionText": "Compare horizontal scaling vs vertical scaling for a RESTful Node.js service experiencing high traffic spikes.",
                "category": "System Architecture",
                "expectedKeywords": ["load balancer", "stateless architecture", "redis session store", "auto-scaling", "clustering"]
            },
            {
                "questionText": "How do rate limiting algorithms like Token Bucket and Leaky Bucket work, and where would you implement them?",
                "category": "API Gateway & Security",
                "expectedKeywords": ["token bucket", "leaky bucket", "redis rate limiter", "429 Too Many Requests", "sliding window"]
            }
        ],
        "Frontend Engineer": [
            {
                "questionText": "Explain the Event Loop in JavaScript, specifically microtasks vs macrotasks.",
                "category": "JavaScript Core",
                "expectedKeywords": ["call stack", "event queue", "Promise", "setTimeout", "microtask queue"]
            },
            {
                "questionText": "How does CSS Grid differ from Flexbox, and when would you choose one over the other?",
                "category": "CSS Layout",
                "expectedKeywords": ["two-dimensional", "one-dimensional", "grid-template-columns", "flex-direction", "layout flow"]
            }
        ]
    },
    "behavioral": {
        "General": [
            {
                "questionText": "Tell me about a time you had a technical disagreement with a teammate regarding system architecture. How did you resolve it?",
                "category": "Conflict Resolution & Collaboration",
                "expectedKeywords": ["tradeoff analysis", "benchmarking", "active listening", "consensus", "documentation"]
            },
            {
                "questionText": "Describe a scenario where a critical bug slipped into production. How did you investigate, communicate, and remediate it?",
                "category": "Incident Response & Accountability",
                "expectedKeywords": ["root cause analysis", "blameless post-mortem", "rollback", "logging", "monitoring"]
            },
            {
                "questionText": "How do you prioritize competing deadlines when product requirements shift mid-sprint?",
                "category": "Agile & Time Management",
                "expectedKeywords": ["impact vs effort", "stakeholder communication", "MVP focus", "ticket scope", "re-prioritization"]
            },
            {
                "questionText": "Give an example of how you mentored a junior colleague or onboarded a new team member.",
                "category": "Leadership & Mentorship",
                "expectedKeywords": ["pair programming", "code reviews", "documentation", "feedback", "growth mindset"]
            }
        ]
    }
}

def generate_questions(role: str, q_type: str, count: int) -> List[QuestionItem]:
    """
    Generates role-specific interview questions using OpenAI if API key is set,
    or falls back to curated domain questions.
    """
    api_key = settings.openai_api_key.strip()
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            prompt = (
                f"You are an expert technical interviewer hiring for a '{role}' position.\n"
                f"Generate {count} high-quality {q_type} interview questions suitable for assessing a candidate.\n"
                f"Respond ONLY with a JSON array of objects, where each object has:\n"
                f"- 'questionText': concise, specific question\n"
                f"- 'category': technical area or soft skill domain\n"
                f"- 'expectedKeywords': list of 4-6 key concepts/terms expected in a top response.\n\n"
                f"Example format:\n"
                f"[{{\"questionText\": \"...\", \"category\": \"...\", \"expectedKeywords\": [\"...\"]}}]"
            )
            response = client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": "You output strictly JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                response_format={"type": "json_object"} if "gpt-4" in settings.openai_model or "gpt-3.5" in settings.openai_model else None
            )
            raw_content = response.choices[0].message.content.strip()
            data = json.loads(raw_content)
            
            items = data.get("questions", data) if isinstance(data, dict) else data
            results = []
            for item in items[:count]:
                results.append(QuestionItem(
                    questionText=item.get("questionText", ""),
                    category=item.get("category", "General"),
                    expectedKeywords=item.get("expectedKeywords", [])
                ))
            if results:
                return results
        except Exception as e:
            logger.warning(f"OpenAI question generation failed: {e}. Falling back to template bank.")

    # Fallback logic using domain question bank
    category_pool = ROLE_QUESTION_BANK.get(q_type, {}).get(role, [])
    if not category_pool and q_type == "technical":
        category_pool = ROLE_QUESTION_BANK["technical"]["Full Stack Engineer"]
    if not category_pool or q_type == "behavioral":
        category_pool = ROLE_QUESTION_BANK["behavioral"]["General"]

    results = []
    pool_len = len(category_pool)
    for i in range(count):
        item = category_pool[i % pool_len]
        results.append(QuestionItem(
            questionText=item["questionText"],
            category=item["category"],
            expectedKeywords=item["expectedKeywords"]
        ))
    return results
