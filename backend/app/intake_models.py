from __future__ import annotations

from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field, model_validator


class FieldSource(BaseModel):
    type: str
    message_index: Optional[int] = None
    extractor_version: Optional[str] = None


class CanonicalFieldState(BaseModel):
    value: Optional[str] = None
    confidence: float = 0.0
    field_status: Literal["missing", "inferred", "confirmed", "corrected", "invalid"] = "missing"
    source: Optional[FieldSource] = None
    needs_confirmation: bool = False
    overwrite_protected: bool = False
    last_updated: Optional[str] = None


class ConversationState(BaseModel):
    working_memory: dict[str, Any] = Field(default_factory=dict)
    summary_memory: dict[str, Any] = Field(
        default_factory=lambda: {
            "summary": "",
            "recruiter_interest_signals": [],
        }
    )

    @model_validator(mode="after")
    def _fill_summary_defaults(self) -> "ConversationState":
        self.summary_memory.setdefault("summary", "")
        self.summary_memory.setdefault("recruiter_interest_signals", [])
        return self


class CanonicalSessionState(BaseModel):
    session_id: str
    session_type: Literal["recruiter"] = "recruiter"
    state_version: int = 1
    ui_state: Literal[
        "screening",
        "evaluating_fit",
        "collecting_details",
        "awaiting_confirmation",
        "handoff_complete",
        "handoff_failed",
    ] = "screening"
    requires_user_response: bool = True
    next_best_action: str = "answer_question"
    handoff_status: Literal[
        "not_ready",
        "ready_for_confirmation",
        "awaiting_confirmation",
        "sending",
        "sent",
        "failed",
    ] = "not_ready"
    handoff_id: Optional[str] = None
    errors: list[dict[str, Any]] = Field(default_factory=list)
    recruiter_interest_score: float = 0.0
    recruiter_state: dict[str, CanonicalFieldState] = Field(default_factory=dict)
    opportunity_state: dict[str, CanonicalFieldState] = Field(default_factory=dict)
    conversation_state: ConversationState = Field(default_factory=ConversationState)
    question_attempts: dict[str, int] = Field(default_factory=dict)
    event_log: list[dict[str, Any]] = Field(default_factory=list)

    @classmethod
    def new(cls, session_id: str) -> "CanonicalSessionState":
        return cls(session_id=session_id)


class ChatTurnResponse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    session_id: str
    state_version: int
    assistant_message: str
    ui_state: Literal[
        "screening",
        "evaluating_fit",
        "collecting_details",
        "awaiting_confirmation",
        "handoff_complete",
        "handoff_failed",
    ]
    requires_user_response: bool
    next_best_action: str
    handoff_status: Literal[
        "not_ready",
        "ready_for_confirmation",
        "awaiting_confirmation",
        "sending",
        "sent",
        "failed",
    ]
    handoff_id: Optional[str] = None
    errors: list[dict[str, Any]] = Field(default_factory=list)
    recruiter_interest_score: float = 0.0
    recruiter_state: dict[str, CanonicalFieldState] = Field(default_factory=dict)
    opportunity_state: dict[str, CanonicalFieldState] = Field(default_factory=dict)
    conversation_state: ConversationState = Field(default_factory=ConversationState)
    question_attempts: dict[str, int] = Field(default_factory=dict)
    event_log: list[dict[str, Any]] = Field(default_factory=list)
    reply: Optional[str] = None

    @model_validator(mode="after")
    def _mirror_reply(self) -> "ChatTurnResponse":
        if self.reply is None:
            self.reply = self.assistant_message
        return self
