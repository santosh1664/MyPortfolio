from typing import Dict, List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .rag import run_agent

app = FastAPI(
    title="Santosh Resume Chat API",
    version="1.0.0"
)

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://santoshroy.info",
        "https://www.santoshroy.info",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Models ----------------
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"

class ChatResponse(BaseModel):
    reply: str

# ---------------- Memory ----------------
_memory: Dict[str, List[Dict[str, str]]] = {}
_MAX_MEMORY = 6

def _get_memory(session_id: str):
    return _memory.get(session_id, [])

def _append_memory(session_id: str, role: str, content: str):
    history = _memory.get(session_id, [])
    history.append({"role": role, "content": content})
    _memory[session_id] = history[-_MAX_MEMORY:]

# ---------------- Routes ----------------
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or "default"
    memory = _get_memory(session_id)

    reply = run_agent(request.message, memory)

    _append_memory(session_id, "user", request.message)
    _append_memory(session_id, "assistant", reply)

    return ChatResponse(reply=reply)

@app.get("/health")
async def health():
    return {"status": "ok"}
