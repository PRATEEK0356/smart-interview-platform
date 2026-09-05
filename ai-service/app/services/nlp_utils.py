import re
from typing import List, Dict
try:
    from textblob import TextBlob
    HAS_TEXTBLOB = True
except ImportError:
    HAS_TEXTBLOB = False

# High-value technical & behavioral keywords to extract
COMMON_TECH_KEYWORDS = [
    "react", "redux", "usememo", "usecallback", "state", "virtualization", "component",
    "mongodb", "index", "esr", "query", "aggregation", "transaction", "locking",
    "http", "websockets", "multiplexing", "rest", "graphql", "api",
    "jwt", "xss", "csrf", "httponly", "security", "encryption",
    "concurrency", "race condition", "optimistic", "pessimistic", "cluster",
    "load balancer", "scaling", "stateless", "redis", "caching",
    "event loop", "microtask", "promise", "async", "await",
    "tradeoff", "benchmarking", "post-mortem", "rollback", "metrics", "monitoring",
    "star", "situation", "task", "action", "result", "stakeholders"
]

def extract_keywords(answer: str) -> List[str]:
    """
    Extracts relevant domain keywords found in the user's answer text.
    """
    text_lower = answer.lower()
    matched = []
    for kw in COMMON_TECH_KEYWORDS:
        if kw in text_lower:
            matched.append(kw)
    
    # Also extract capitalized acronyms or technical terms (e.g., SQL, JWT, CSS, AWS)
    acronyms = set(re.findall(r'\b[A-Z]{2,6}\b', answer))
    for ac in acronyms:
        if ac.lower() not in matched and len(ac) > 1:
            matched.append(ac.lower())

    return list(dict.fromkeys(matched))[:8]

def analyze_sentiment(answer: str) -> Dict[str, float]:
    """
    Analyzes sentiment / tone of the answer. Returns polarity and subjectivity.
    """
    if HAS_TEXTBLOB:
        try:
            blob = TextBlob(answer)
            polarity = blob.sentiment.polarity
            subjectivity = blob.sentiment.subjectivity
            
            if polarity > 0.15:
                label = "Confident & Positive"
            elif polarity < -0.15:
                label = "Needs Confidence / Constructive"
            else:
                label = "Objective & Technical"
                
            return {
                "polarity": round(polarity, 2),
                "subjectivity": round(subjectivity, 2),
                "label": label
            }
        except Exception:
            pass

    # Basic fallback sentiment estimate based on positive tone words
    positive_words = {"achieved", "resolved", "improved", "optimized", "successfully", "delivered", "led", "engineered"}
    lower_words = set(re.findall(r'\w+', answer.lower()))
    matches = len(lower_words.intersection(positive_words))
    
    label = "Confident & Positive" if matches >= 2 else "Objective & Technical"
    return {"polarity": 0.2 if matches >= 2 else 0.0, "subjectivity": 0.4, "label": label}

def evaluate_structure(answer: str) -> int:
    """
    Evaluates response structure & length (0 to 100).
    A good answer should provide sufficient depth (typically 40+ words)
    and clear sentence structuring.
    """
    words = re.findall(r'\w+', answer)
    word_count = len(words)
    sentences = re.split(r'[.!?]+', answer)
    sentence_count = len([s for s in sentences if s.strip()])

    if word_count < 10:
        return 20  # Too brief
    elif word_count < 25:
        return 50  # Marginal detail
    elif word_count < 50:
        return 75  # Moderate depth
    elif word_count < 150:
        score = 90
        if sentence_count >= 3:
            score += 10
        return min(100, score)
    else:
        return 95  # Very detailed
