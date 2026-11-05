from backend.app.intake_models import CanonicalSessionState, ChatTurnResponse


def test_canonical_session_state_defaults():
    state = CanonicalSessionState.new(session_id="session-123")

    assert state.session_id == "session-123"
    assert state.session_type == "recruiter"
    assert state.state_version == 1
    assert state.ui_state == "screening"
    assert state.handoff_status == "not_ready"
    assert state.handoff_id is None
    assert state.errors == []
    assert state.question_attempts == {}
    assert state.event_log == []


def test_chat_turn_response_exposes_structured_fields_and_reply_compatibility():
    response = ChatTurnResponse(
        session_id="session-123",
        state_version=2,
        assistant_message="Happy to help.",
        ui_state="screening",
        requires_user_response=True,
        next_best_action="answer_question",
        handoff_status="not_ready",
        handoff_id=None,
        errors=[],
        recruiter_interest_score=0.0,
        recruiter_state={},
        opportunity_state={},
        conversation_state={"working_memory": {}, "summary_memory": {}},
        question_attempts={},
        event_log=[],
    )

    assert response.session_id == "session-123"
    assert response.assistant_message == "Happy to help."
    assert response.reply == "Happy to help."
    assert response.next_best_action == "answer_question"
    assert response.conversation_state.model_dump() == {
        "working_memory": {},
        "summary_memory": {"summary": "", "recruiter_interest_signals": []},
    }


def test_chat_turn_response_rejects_legacy_route_fields():
    from pydantic import ValidationError

    try:
        ChatTurnResponse(
            session_id="session-123",
            state_version=2,
            assistant_message="Happy to help.",
            ui_state="screening",
            requires_user_response=True,
            next_best_action="answer_question",
            handoff_status="not_ready",
            handoff_id=None,
            errors=[],
            recruiter_interest_score=0.0,
            recruiter_state={},
            opportunity_state={},
            conversation_state={"working_memory": {}, "summary_memory": {}},
            question_attempts={},
            event_log=[],
            next_question=None,
        )
    except ValidationError as exc:
        assert "next_question" in str(exc)
    else:
        raise AssertionError("ChatTurnResponse accepted legacy next_question field")
