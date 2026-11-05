import asyncio

import pytest
from fastapi.testclient import TestClient

from backend.app.conversation import StructuredTurn
from backend.app.intake_models import CanonicalFieldState, CanonicalSessionState
from backend.app.main import app


client = TestClient(app)


@pytest.fixture(autouse=True)
def clear_main_memory():
    from backend.app import main as main_module

    main_module._memory.clear()
    yield
    main_module._memory.clear()


def test_chat_returns_reply_and_structured_fields(monkeypatch):
    from backend.app import main as main_module

    def fake_orchestrate_turn(message, session):
        return StructuredTurn.model_validate(
            {
                "reply": "I’ve spent most of my recent work on backend-heavy full-stack systems.",
                "follow_up": "Do you want me to focus on the service design or the messaging layer?",
                "recommended_section": {"id": "experience", "label": "Experience"},
                "current_topic": "backend",
                "conversation_energy": "medium",
                "should_continue": True,
                "planner_intent": "experience_discussion",
                "context_targets": ["experience.full_stack"],
            }
        )

    monkeypatch.setattr(main_module, "orchestrate_turn", fake_orchestrate_turn)

    response = client.post(
        "/api/chat",
        json={"message": "Tell me about your backend experience", "session_id": "test-session"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["reply"].startswith("I’ve spent")
    assert payload["assistant_message"] == payload["reply"]
    assert "next_question" not in payload
    assert "recommended_section" not in payload
    assert payload["conversation_state"] == {
        "working_memory": {},
        "summary_memory": {"summary": "", "recruiter_interest_signals": []},
    }


def test_chat_surfaces_canonical_state_from_session_memory(monkeypatch):
    from backend.app import main as main_module

    canonical_state = CanonicalSessionState.new(session_id="seeded-session").model_copy(
        update={
            "state_version": 7,
            "recruiter_state": {
                "email": CanonicalFieldState(value="recruiter@example.com", field_status="confirmed")
            },
            "question_attempts": {"email": 2},
            "event_log": [{"type": "seeded"}],
        }
    )
    main_module._memory["seeded-session"] = {
        **main_module.default_session_state(),
        "canonical_state": canonical_state,
    }

    def fake_orchestrate_turn(message, session):
        return StructuredTurn.model_validate(
            {
                "reply": "Thanks.",
                "follow_up": None,
                "recommended_section": None,
                "current_topic": "introduction",
                "conversation_energy": "low",
                "should_continue": False,
                "planner_intent": "greeting",
                "context_targets": [],
            }
        )

    monkeypatch.setattr(main_module, "orchestrate_turn", fake_orchestrate_turn)

    response = client.post(
        "/api/chat",
        json={"message": "hi", "session_id": "seeded-session"},
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload["state_version"] == 7
    assert payload["recruiter_state"]["email"]["value"] == "recruiter@example.com"
    assert payload["question_attempts"]["email"] == 2
    assert payload["event_log"] == [{"type": "seeded"}]
    assert payload["conversation_state"] == {
        "working_memory": {},
        "summary_memory": {"summary": "", "recruiter_interest_signals": []},
    }


def test_chat_can_bootstrap_greeting_without_resume_fallback(monkeypatch):
    from backend.app import main as main_module

    def fake_orchestrate_turn(message, session):
        assert message == "hi"
        return StructuredTurn.model_validate(
            {
                "reply": (
                    "Hey - thanks for checking out my portfolio.\n\n"
                    "This is Durgasantosh. Feel free to ask me about my experience, projects, or role fit."
                ),
                "follow_up": None,
                "recommended_section": {"id": "experience", "label": "Experience"},
                "current_topic": "introduction",
                "conversation_energy": "low",
                "should_continue": True,
                "planner_intent": "greeting",
                "context_targets": [],
            }
        )

    monkeypatch.setattr(main_module, "orchestrate_turn", fake_orchestrate_turn)

    response = client.post(
        "/api/chat",
        json={"message": "hi", "session_id": "opening-session"},
    )

    payload = response.json()
    assert response.status_code == 200
    assert "thanks for checking out my portfolio" in payload["reply"].lower()
    assert "durgasantosh" in payload["reply"].lower()
    assert payload["assistant_message"] == payload["reply"]
    assert "next_question" not in payload


def test_chat_keeps_project_response_selective(monkeypatch):
    from backend.app import main as main_module

    def fake_orchestrate_turn(message, session):
        return StructuredTurn.model_validate(
            {
                "reply": (
                    "Two of the strongest projects to look at are Beyond Sight and the recruiter guide itself. "
                    "Beyond Sight is the better example if you want to evaluate the AI pipeline and measurable impact."
                ),
                "follow_up": "Do you want me to unpack the AI pipeline or the backend orchestration side?",
                "recommended_section": {"id": "experience", "label": "Experience"},
                "current_topic": "projects",
                "conversation_energy": "medium",
                "should_continue": True,
                "planner_intent": "project_discussion",
                "context_targets": ["projects.beyond_sight", "projects.recruiter_guide"],
            }
        )

    monkeypatch.setattr(main_module, "orchestrate_turn", fake_orchestrate_turn)

    response = client.post(
        "/api/chat",
        json={"message": "projects", "session_id": "projects-session"},
    )

    payload = response.json()
    assert response.status_code == 200
    assert "Two of the strongest projects" in payload["reply"]
    assert "1." not in payload["reply"]


def test_chat_drops_redundant_recommendation(monkeypatch):
    from backend.app import main as main_module

    def fake_orchestrate_turn(message, session):
        return StructuredTurn.model_validate(
            {
                "reply": "The orchestration layer was probably the most interesting part.",
                "follow_up": None,
                "recommended_section": {"id": "projects", "label": "Projects"},
                "current_topic": "projects",
                "conversation_energy": "medium",
                "should_continue": False,
                "planner_intent": "project_discussion",
                "context_targets": ["projects.beyond_sight"],
            }
        )

    monkeypatch.setattr(main_module, "orchestrate_turn", fake_orchestrate_turn)

    client.post("/api/chat", json={"message": "projects", "session_id": "repeat-session"})
    response = client.post(
        "/api/chat",
        json={"message": "tell me more", "session_id": "repeat-session"},
    )

    payload = response.json()
    assert response.status_code == 200
    assert "recommended_section" not in payload


def test_chat_falls_back_gracefully_when_orchestration_fails(monkeypatch):
    from backend.app import main as main_module

    def fake_orchestrate_turn(message, session):
        raise RuntimeError("boom")

    def fake_answer_from_knowledge(message):
        return "I don’t have that information available right now, but I’m happy to help with my experience, projects, skills, or role fit."

    monkeypatch.setattr(main_module, "orchestrate_turn", fake_orchestrate_turn)
    monkeypatch.setattr(main_module, "answer_from_knowledge", fake_answer_from_knowledge)

    response = client.post(
        "/api/chat",
        json={"message": "Tell me about your background", "session_id": "fallback-session"},
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload["reply"]
    assert "next_question" not in payload
    assert "conversation_state" in payload


def test_chat_falls_back_gracefully_on_timeout(monkeypatch):
    from backend.app import main as main_module

    async def fake_wait_for(aw, timeout=None):
        aw.close()
        raise asyncio.TimeoutError()

    def fake_answer_from_knowledge(message):
        return "Fallback answer."

    monkeypatch.setattr(main_module.asyncio, "wait_for", fake_wait_for)
    monkeypatch.setattr(main_module, "answer_from_knowledge", fake_answer_from_knowledge)

    response = client.post(
        "/api/chat",
        json={"message": "Tell me about your background", "session_id": "timeout-session"},
    )

    payload = response.json()
    assert response.status_code == 200
    assert payload["reply"] == "Fallback answer."
    assert payload["assistant_message"] == "Fallback answer."
    assert "next_question" not in payload
