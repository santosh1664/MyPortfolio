# Durgasantosh G — Portfolio

React + Vite portfolio showcasing skills, projects, and experience with a light/dark theme toggle.

## Stack
- Vite + React
- Tailwind CSS (with CSS variable theming)
- Framer Motion for animations
- React Icons

## Getting Started
```bash
npm install
npm run dev:api
npm run dev
```
Then open the shown localhost URL (default: http://localhost:5173/).

The frontend talks to the FastAPI chat backend on `http://127.0.0.1:8001` during local development unless `VITE_API_BASE_URL` is set explicitly.

## Production Deployment
The frontend and backend should be deployed as separate services.

### Backend on Render
This repo now includes [render.yaml](/Users/roy/MyPortfolio/render.yaml) for the FastAPI service under `backend/`.

Required backend secret:
- `OPENAI_API_KEY`

Configured in `render.yaml`:
- `OPENAI_BASE_URL=https://openrouter.ai/api/v1`
- `OPENAI_CHAT_MODEL=openai/gpt-4o-mini`
- `OPENAI_APP_TITLE=Resume Chatbot`
- `OPENAI_HTTP_REFERER=https://www.santoshroy.info`
- `CORS_ALLOW_ORIGINS=https://www.santoshroy.info,https://santoshroy.info`
- `RAG_TOP_K=4`

Local backend env template:
- [backend/.env.example](/Users/roy/MyPortfolio/backend/.env.example)

After deploy, verify:
```bash
curl https://YOUR-RENDER-SERVICE.onrender.com/health
curl -X POST https://YOUR-RENDER-SERVICE.onrender.com/api/chat \
  -H 'Content-Type: application/json' \
  -d '{"message":"Tell me about your RAG project","session_id":"smoke-test"}'
```

### Frontend Environment
Set this in the frontend deployment environment:

```bash
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Then redeploy the frontend. In production, the chat widget will call `https://YOUR-RENDER-SERVICE.onrender.com/api/chat` directly instead of the broken same-origin `/api/chat` path.

## Build
```bash
npm run build
```
Output is in `dist/`.

## Content Sources
- `src/data/portfolioData.jsx`: personal info, skills, projects, leadership.
- `src/components/`: UI sections (Hero, Skills, Projects, Experience, Contact, etc.).

## Theming
- Navbar toggle switches between `.theme-dark` and `.theme-light` (stored in `localStorage`).

## Assets
- Resume: place your PDF in `public/` and update `personalInfo.resumeLink` in `src/data/portfolioData.jsx`.
