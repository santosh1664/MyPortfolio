import asyncio
from typing import Any, Dict, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .config import settings
from .intake_models import CanonicalSessionState, ChatTurnResponse
from .conversation import (
    StructuredTurn,
    default_session_state,
    merge_turn_into_session,
    normalize_recommended_section,
)
from .rag import answer_from_knowledge, orchestrate_turn

_DEFAULT_ALLOWED_ORIGINS = [
    "https://santoshroy.info",
    "https://www.santoshroy.info",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app = FastAPI(
    title="Santosh Resume Chat API",
    version="1.0.0",
)

# ---------- CORS ----------
allow_origins = list(
    dict.fromkeys(_DEFAULT_ALLOWED_ORIGINS + list(settings.cors_allow_origins))
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Models ----------
class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default"


# ---------- Memory ----------
_memory: Dict[str, Dict[str, Any]] = {}
_MAX_MEMORY = 6
_CHAT_TIMEOUT_SECONDS = 10.0  # increased slightly for production stability


def _get_memory(session_id: str):
    if session_id not in _memory:
        _memory[session_id] = {
            **default_session_state(),
            "canonical_state": CanonicalSessionState.new(session_id=session_id),
        }
    elif "canonical_state" not in _memory[session_id]:
        _memory[session_id]["canonical_state"] = CanonicalSessionState.new(session_id=session_id)
    return _memory[session_id]


def _append_memory(session_id: str, role: str, content: str):
    session = _get_memory(session_id)
    history = list(session.get("history", []))
    history.append({"role": role, "content": content})
    session["history"] = history[-_MAX_MEMORY:]
    _memory[session_id] = session


def _get_canonical_state(session_id: str) -> CanonicalSessionState:
    session = _get_memory(session_id)
    canonical_state = session["canonical_state"]
    if not isinstance(canonical_state, CanonicalSessionState):
        canonical_state = CanonicalSessionState.model_validate(canonical_state)
        session["canonical_state"] = canonical_state
        _memory[session_id] = session
    return canonical_state


# ---------- Routes ----------
@app.post("/api/chat", response_model=ChatTurnResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or "default"
    session = _get_memory(session_id)
    message = request.message.strip()

    try:
        turn = await asyncio.wait_for(
            asyncio.to_thread(orchestrate_turn, message, session),
            timeout=_CHAT_TIMEOUT_SECONDS,
        )
    except asyncio.TimeoutError:
        reply = answer_from_knowledge(message)
        turn = None
    except Exception as exc:
        print(f"Chat handler fallback due to error: {exc}")
        reply = answer_from_knowledge(message)
        turn = None

    if message:
        _append_memory(session_id, "user", message)

    if turn is None:
        _append_memory(session_id, "assistant", reply)
        fallback_turn = StructuredTurn.model_validate(
            {
                "reply": reply,
                "follow_up": None,
                "recommended_section": None,
                "current_topic": session.get("current_topic") or "experience",
                "conversation_energy": session.get("conversation_energy", "low"),
                "should_continue": False,
                "planner_intent": "fallback",
                "context_targets": [],
            }
        )
        session_after_fallback = merge_turn_into_session(
            _get_memory(session_id),
            user_message=message,
            turn=fallback_turn,
            context_targets=[],
            recommended_section=None,
        )
        canonical_state = _get_canonical_state(session_id)
        session_after_fallback["canonical_state"] = canonical_state
        _memory[session_id] = session_after_fallback
        return ChatTurnResponse(
            session_id=session_id,
            state_version=canonical_state.state_version,
            assistant_message=reply,
            reply=reply,
            ui_state=canonical_state.ui_state,
            requires_user_response=False,
            next_best_action="answer_question",
            handoff_status=canonical_state.handoff_status,
            handoff_id=canonical_state.handoff_id,
            errors=canonical_state.errors,
            recruiter_interest_score=canonical_state.recruiter_interest_score,
            recruiter_state=canonical_state.recruiter_state,
            opportunity_state=canonical_state.opportunity_state,
            conversation_state=canonical_state.conversation_state,
            question_attempts=canonical_state.question_attempts,
            event_log=canonical_state.event_log,
        )

    recommendation = normalize_recommended_section(
        turn.recommended_section,
        current_topic=turn.current_topic,
        previous_section=session.get("last_recommended_section"),
    )

    _append_memory(session_id, "assistant", turn.reply)
    updated_session = merge_turn_into_session(
        _get_memory(session_id),
        user_message=message,
        turn=turn,
        context_targets=turn.context_targets,
        recommended_section=recommendation,
    )
    canonical_state = _get_canonical_state(session_id)
    updated_session["canonical_state"] = canonical_state
    _memory[session_id] = updated_session

    return ChatTurnResponse(
        session_id=session_id,
        state_version=canonical_state.state_version,
        assistant_message=turn.reply,
        reply=turn.reply,
        ui_state=canonical_state.ui_state,
        requires_user_response=bool(turn.follow_up),
        next_best_action="answer_question" if turn.follow_up else "provide_answer",
        handoff_status=canonical_state.handoff_status,
        handoff_id=canonical_state.handoff_id,
        errors=canonical_state.errors,
        recruiter_interest_score=canonical_state.recruiter_interest_score,
        recruiter_state=canonical_state.recruiter_state,
        opportunity_state=canonical_state.opportunity_state,
        conversation_state=canonical_state.conversation_state,
        question_attempts=canonical_state.question_attempts,
        event_log=canonical_state.event_log,
    )


@app.get("/health")
async def health():
    return {"status": "ok"}
