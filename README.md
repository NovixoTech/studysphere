# Logynis 🎓

AI-powered tutoring app with 5 study modes. Built with React, Node.js/Express, and the NovixoTech open source ecosystem.

🌐 **Live:** [studysphere-liard.vercel.app](https://studysphere-liard.vercel.app)

## Study Modes

| Mode | Description |
|------|-------------|
| 📖 Study | Explain any concept clearly |
| 🎯 Exam Prep | Practice questions and model answers |
| ✏️ Homework | Step-by-step homework help |
| 🔁 Revision | Summaries and revision notes |
| ⚡ Motivation | Study tips and encouragement |

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router
- novixo-engine (offline support)

**Backend**
- Node.js + Express
- novixo-ai (multi-provider AI with auto-fallback)
- novixo-agent-logger (AI audit trail)

**AI Providers**
- Groq (llama-3.3-70b-versatile) — primary
- Gemini (gemini-2.0-flash) — fallback

## Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your GROQ_API_KEY and GEMINI_API_KEY to .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173

## Deploy

- **Frontend** → Vercel (connect repo, set root to `frontend`)
- **Backend** → Railway (connect repo, uses `railway.json`)

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Get free at groq.com |
| `GEMINI_API_KEY` | Get free at aistudio.google.com |
| `FRONTEND_URL` | Your Vercel URL (for CORS) |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Your Railway backend URL |

## Built with NovixoTech

- [novixo-ai](https://npmjs.com/package/novixo-ai) — unified AI client for 15 providers
- [novixo-engine](https://npmjs.com/package/novixo-engine) — offline-first network SDK
- [novixo-agent-logger](https://npmjs.com/package/novixo-agent-logger) — AI agent audit trail

---

Made by [NovixoTech](https://github.com/NovixoTech)
