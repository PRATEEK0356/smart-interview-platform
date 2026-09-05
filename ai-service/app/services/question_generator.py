import json
import logging
from typing import List
from openai import OpenAI
from app.config import settings
from app.models.schemas import QuestionItem

logger = logging.getLogger("ai_service")

# Curated fallback questions by Language, Difficulty, Role & Type
LANGUAGE_QUESTION_BANK = {
    "Java": {
        "Basic": [
            {
                "questionText": "Explain the difference between JDK, JRE, and JVM in Java. How does Java achieve platform independence?",
                "category": "Java Foundations",
                "expectedKeywords": ["bytecode", "jvm", "jre", "jdk", "platform independence"]
            },
            {
                "questionText": "What is the difference between String, StringBuilder, and StringBuffer in Java regarding mutability and thread safety?",
                "category": "Java Memory & Strings",
                "expectedKeywords": ["immutable", "stringbuilder", "stringbuffer", "thread safety", "string pool"]
            }
        ],
        "Intermediate": [
            {
                "questionText": "How does HashMap work internally in Java 8+? Explain buckets, hash collisions, and treeifying bins.",
                "category": "Java Collections",
                "expectedKeywords": ["hashCode()", "equals()", "red-black tree", "hash collision", "bucket"]
            },
            {
                "questionText": "Compare fail-fast vs fail-safe iterators in Java with examples from Java Collections Framework.",
                "category": "Java Concurrency",
                "expectedKeywords": ["ConcurrentModificationException", "CopyOnWriteArrayList", "ConcurrentHashMap", "modCount"]
            }
        ],
        "Advanced": [
            {
                "questionText": "Explain Garbage Collection algorithms in Java (G1GC vs ZGC). How do you diagnose and tune G1GC pauses?",
                "category": "JVM Tuning & Memory",
                "expectedKeywords": ["G1GC", "ZGC", "heap memory", "stop-the-world", "young generation", "tenured"]
            },
            {
                "questionText": "How do Virtual Threads (Project Loom) in Java 21 differ from platform OS threads under high concurrency?",
                "category": "Java Concurrency & Threading",
                "expectedKeywords": ["virtual threads", "carrier threads", "continuation", "non-blocking", "project loom"]
            }
        ]
    },
    "Python": {
        "Basic": [
            {
                "questionText": "Explain the difference between list, tuple, set, and dictionary data structures in Python regarding mutability and ordering.",
                "category": "Python Basics",
                "expectedKeywords": ["mutable", "immutable", "hashable", "tuple", "dictionary"]
            },
            {
                "questionText": "What are Python list comprehensions and generators? When would you use a generator over a list?",
                "category": "Python Iterators",
                "expectedKeywords": ["yield", "generator", "memory efficiency", "lazy evaluation"]
            }
        ],
        "Intermediate": [
            {
                "questionText": "How do decorators work in Python? Write the concept of a decorator that measures execution time.",
                "category": "Python Metaprogramming",
                "expectedKeywords": ["functools.wraps", "closure", "inner function", "*args", "**kwargs"]
            },
            {
                "questionText": "Explain how GIL (Global Interpreter Lock) affects multithreading in CPython vs multiprocessing.",
                "category": "Python Concurrency",
                "expectedKeywords": ["GIL", "CPython", "multiprocessing", "asyncio", "cpu-bound"]
            }
        ],
        "Advanced": [
            {
                "questionText": "How does Python handle memory management and garbage collection (reference counting + cyclic GC)?",
                "category": "Python Memory Internals",
                "expectedKeywords": ["reference count", "cyclic gc", "gc module", "weakref", "tracemalloc"]
            },
            {
                "questionText": "Compare asyncio event loops with OS threads for high-concurrency network I/O in Python 3.12.",
                "category": "Python Async Architecture",
                "expectedKeywords": ["asyncio", "event loop", "awaitable", "non-blocking socket", "task scheduling"]
            }
        ]
    },
    "C++": {
        "Basic": [
            {
                "questionText": "Explain pointers vs references in C++. What are stack allocation and heap allocation using new/delete?",
                "category": "C++ Basics",
                "expectedKeywords": ["pointer", "reference", "stack", "heap", "delete"]
            }
        ],
        "Advanced": [
            {
                "questionText": "Explain RAII and Smart Pointers (std::unique_ptr, std::shared_ptr, std::weak_ptr) in C++17/20.",
                "category": "C++ Memory Management",
                "expectedKeywords": ["RAII", "unique_ptr", "shared_ptr", "reference counting", "move semantics"]
            }
        ]
    },
    "SQL": {
        "Basic": [
            {
                "questionText": "Explain the difference between WHERE and HAVING clauses in SQL, and when to use GROUP BY.",
                "category": "SQL Queries",
                "expectedKeywords": ["WHERE", "HAVING", "GROUP BY", "aggregation"]
            }
        ],
        "Advanced": [
            {
                "questionText": "Explain SQL Window Functions (ROW_NUMBER, RANK, DENSE_RANK) and indexing strategies for complex JOINs.",
                "category": "SQL Optimization",
                "expectedKeywords": ["OVER(PARTITION BY)", "ROW_NUMBER", "B-tree index", "execution plan"]
            }
        ]
    }
}

def generate_questions(role: str, q_type: str, count: int, language: str = "Java", difficulty: str = "Intermediate") -> List[QuestionItem]:
    """
    Generates language-specific and difficulty-level interview questions.
    """
    api_key = settings.openai_api_key.strip()
    if api_key:
        try:
            client = OpenAI(api_key=api_key)
            prompt = (
                f"You are a principal technical interviewer evaluating a candidate for a '{role}' role.\n"
                f"Generate {count} {q_type} interview questions focused on programming language: '{language}' at difficulty level: '{difficulty}'.\n"
                f"Ensure the questions directly assess {language} concepts suitable for {difficulty} level candidates.\n"
                f"Respond ONLY with a JSON array of objects, where each object has:\n"
                f"- 'questionText': concise, specific question\n"
                f"- 'category': technical concept or domain area\n"
                f"- 'expectedKeywords': list of 4-6 key concepts/terms expected in a top response.\n"
            )
            response = client.chat.completions.create(
                model=settings.openai_model,
                messages=[
                    {"role": "system", "content": "You output strictly valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.4,
                response_format={"type": "json_object"} if "gpt-4" in settings.openai_model or "gpt-3.5" in settings.openai_model else None
            )
            raw_content = response.choices[0].message.content.strip()
            data = json.loads(raw_content)
            
            items = data.get("questions", data) if isinstance(data, dict) else data
            results = []
            for item in items[:count]:
                results.append(QuestionItem(
                    questionText=item.get("questionText", ""),
                    category=item.get("category", f"{language} {difficulty}"),
                    expectedKeywords=item.get("expectedKeywords", [])
                ))
            if results:
                return results
        except Exception as e:
            logger.warning(f"OpenAI question generation failed: {e}. Falling back to language domain bank.")

    # Fallback to language-specific pool
    lang_pool = LANGUAGE_QUESTION_BANK.get(language, {}).get(difficulty, [])
    if not lang_pool:
        lang_pool = LANGUAGE_QUESTION_BANK.get("Java", {}).get("Intermediate", [])

    results = []
    pool_len = len(lang_pool)
    for i in range(count):
        item = lang_pool[i % pool_len]
        results.append(QuestionItem(
            questionText=item["questionText"],
            category=item["category"],
            expectedKeywords=item["expectedKeywords"]
        ))
    return results
