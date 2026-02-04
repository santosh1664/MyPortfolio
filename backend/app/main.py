from typing import Dict, List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

from .rag import run_agent

# --------------------------------------------------
# App initialization
# --------------------------------------------------
app = FastAPI()

# --------------------------------------------------
# CORS (MUST be right after app = FastAPI())
# --------------------------------------------------
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

# --------------------------------------------------
# Paths (for optional frontend serving)
# --------------------------------------------------
_ROOT_DIR = Path(__file__).resolve().parents[2]
_DIST_DIR = _ROOT_DIR / "dist"

# --------------------------------------------------
# Models
# --------------------------------------------------
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    reply: str

# --------------------------------------------------
# In-memory chat history
# --------------------------------------------------
_memory: Dict[str, List[Dict[str, str]]] = {}
_MAX_MEMORY = 6


def _get_memory(session_id: str) -> List[Dict[str, str]]:
    return _memory.get(session_id, [])


def _append_memory(session_id: str, role: str, content: str) -> None:
    history = _memory.get(session_id, [])
    history.append({"role": role, "content": content})
    _memory[session_id] = history[-_MAX_MEMORY:]


# --------------------------------------------------
# API routes
# --------------------------------------------------
@app.post("/chat", response_model=ChatResponse)
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    session_id = request.session_id or "default"

    memory = _get_memory(session_id)
    reply = run_agent(request.message, memory)

    _append_memory(session_id, "user", request.message)
    _append_memory(session_id, "assistant", reply)

    return ChatResponse(reply=reply)


# --------------------------------------------------
# Optional frontend serving (only if dist exists)
# --------------------------------------------------
if _DIST_DIR.exists():

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = _DIST_DIR / full_path

        if file_path.is_file():
            return FileResponse(file_path)

        index_file = _DIST_DIR / "index.html"
        if index_file.is_file():
            return FileResponse(index_file)

        raise HTTPException(status_code=404, detail="Frontend not built.")
