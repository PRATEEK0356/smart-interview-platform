# Smart Interview Preparation Platform

A full-stack, AI-assisted interview preparation platform designed to help technical candidates practice role-specific technical and behavioral interview questions. The platform features dynamic question generation, real-time hybrid NLP + LLM answer scoring, and an interactive performance progress dashboard.

---

## 🏗 System Architecture

```
                                  +-----------------------+
                                  |   React SPA (Vite)    |
                                  |  Tailwind + Redux RTK |
                                  +-----------+-----------+
                                              |
                                     HTTP / Axios REST API
                                              v
                                  +-----------------------+
                                  |  Node.js / Express    |
                                  |  JWT Auth & Persistence|
                                  +-----+-----------+-----+
                                        |           |
                        Server-to-Server|           | Mongoose ORM
                                  HTTP  v           v
             +--------------------------+----+  +------------------+
             | Python FastAPI Microservice   |  |   MongoDB Atlas  |
             | (Scorer, NLP, Generator)      |  |  (or In-Memory)  |
             +--------------+----------------+  +------------------+
                            |
                     OpenAI GPT API
```

### Architecture Design Choice: On-the-Fly Aggregation vs ProgressSnapshots
> **Justification**: For this scale of candidate practice sessions, user progress metrics (average score, score trend over time, category strengths, focus areas) are **derived dynamically on the fly** from `InterviewSession` records during the `GET /api/dashboard/summary` query. 
> 
> *Why?* Storing rigid `ProgressSnapshot` documents introduces database sync complexity and data duplication whenever a session is edited or backdated. On-the-fly aggregation via MongoDB indexes ensures 100% data consistency without maintenance overhead.

---

## 🚀 Key Features

1. **JWT Authentication & Security**:
   - Secure password hashing using `bcryptjs`.
   - Signed JSON Web Tokens (`7d` expiry) passed via standard `Authorization: Bearer <token>` headers.
   - Axios request interceptor auto-attaches tokens; response interceptor auto-redirects on `401 Unauthorized`.

2. **Role-Specific AI Question Generation**:
   - Generates technical or behavioral interview questions tailored to roles like *Full Stack Engineer*, *Backend Engineer*, *Frontend Engineer*, *Data Scientist*, *DevOps*, and *Product Manager*.
   - Uses OpenAI `gpt-4o-mini` when `OPENAI_API_KEY` is provided, with an intelligent domain fallback question bank if API keys are omitted.

3. **Hybrid NLP + LLM Answer Evaluation**:
   - Answers are evaluated using a deterministic scoring formula:
     $$\text{Overall Score} = (0.35 \times \text{Structural Depth}) + (0.35 \times \text{Keyword Coverage}) + (0.30 \times \text{LLM Qualitative Score})$$
   - Extracts domain keywords, measures response structural complexity, detects tone/sentiment, and delivers actionable qualitative feedback.

4. **Candidate Progress Dashboard**:
   - Recharts score history trend line over time.
   - Automatically identifies **Top Strengths** (categories scoring $\ge 75\%$) and **Focus Areas** for improvement.
   - Comprehensive post-interview session reports with question-by-question candidate answer logs and AI recommendations.

---

## ⚙️ Environment Variables

### Backend Server (`server/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Express REST API port | `5000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | `development` |
| `MONGO_URI` | MongoDB connection URI (falls back to `mongodb-memory-server` if empty) | `mongodb://localhost:27017/smart_interview_db` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `super_secret_jwt_key_123!` |
| `AI_SERVICE_URL` | Base URL of FastAPI microservice | `http://localhost:8000` |

### AI Microservice (`ai-service/.env`)
| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | FastAPI microservice port | `8000` |
| `OPENAI_API_KEY` | OpenAI API key (optional; fallback rules apply if empty) | `""` |
| `OPENAI_MODEL` | OpenAI model identifier | `gpt-4o-mini` |

---

## 💻 Local Development Setup

### Option 1: Quickstart via Docker Compose
Ensure Docker Desktop is running, then execute:
```bash
docker-compose up --build
```
- **Client Web App**: [http://localhost:3000](http://localhost:3000)
- **Node Backend API**: [http://localhost:5000](http://localhost:5000)
- **FastAPI Microservice**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option 2: Manual Terminal Execution

#### 1. Start AI Microservice (Python FastAPI)
```bash
cd ai-service
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app/main.py
```

#### 2. Start Backend Server (Node/Express)
```bash
cd server
npm install
npm run dev
```

#### 3. Start Frontend SPA (React / Vite)
```bash
cd client
npm install
npm run dev
```

---

## 🌐 Production Deployment Guide

- **Frontend (Client)**:
  - Deploy to **Vercel** or **Netlify**.
  - Build command: `npm run build`, Output directory: `dist`.
  - Set rewrite rules for single-page applications (`/*` -> `/index.html`).

- **Node REST API & Python AI Microservice**:
  - Deploy to **Render**, **Railway**, or **AWS ECS/App Runner**.
  - Server environment needs `MONGO_URI` pointing to **MongoDB Atlas**.
  - AI Service needs `OPENAI_API_KEY` set in platform environment settings.

---

## 📌 Known Limitations & Future Roadmap

1. **Voice Speech-to-Text Integration**:
   - The AI microservice includes a clean `speech_to_text.py` interface seam (`transcribe(audio_bytes)`). Currently, candidate answers are entered via text area; full audio recording via Web MediaRecorder API & OpenAI Whisper STT is scheduled as a follow-up enhancement.
2. **Interactive Code Execution**:
   - Algorithm-heavy technical questions currently score explanation and code structure. A sandboxed WebAssembly / Docker execution container (e.g. Judge0) can be added for live unit testing.
