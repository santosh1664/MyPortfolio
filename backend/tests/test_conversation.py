import pytest

from backend.app.conversation import (
    PlannerDecision,
    StructuredTurn,
    default_session_state,
    merge_turn_into_session,
    normalize_recommended_section,
)
from backend.app.rag import FALLBACK, generate_response, get_knowledge_slices, resolve_context_targets


def test_planner_decision_validates_required_fields():
    decision = PlannerDecision.model_validate(
        {
            "intent": "greeting",
            "current_topic": "introduction",
            "context_targets": [],
            "conversation_energy": "low",
            "should_follow_up": True,
            "should_continue": True,
        }
    )

    assert decision.intent == "greeting"
    assert decision.current_topic == "introduction"
    assert decision.context_targets == []


def test_planner_decision_rejects_invalid_energy():
    with pytest.raises(Exception):
        PlannerDecision.model_validate(
            {
                "intent": "greeting",
                "current_topic": "introduction",
                "context_targets": [],
                "conversation_energy": "extreme",
                "should_follow_up": True,
                "should_continue": True,
            }
        )


def test_resolve_context_targets_limits_project_slice_count_and_prioritizes_high_signal():
    slices = resolve_context_targets(
        ["projects", "skills.ai_systems"],
        max_slices=3,
        max_project_slices=2,
    )
    slice_ids = [slice_.id for slice_ in slices]

    assert "skills.ai_systems" in slice_ids
    assert len([slice_id for slice_id in slice_ids if slice_id.startswith("projects.")]) <= 2
    assert "projects.beyond_sight" in slice_ids


def test_project_target_resolution_stays_compact():
    slices = resolve_context_targets(["projects"], max_slices=2, max_project_slices=1)

    assert len(slices) == 1
    assert slices[0].id.startswith("projects.")


def test_project_alias_target_resolution_maps_rag_to_known_project():
    slices = resolve_context_targets(["projects.rag"], max_slices=2, max_project_slices=2)
    slice_ids = [slice_.id for slice_ in slices]

    assert "projects.recruiter_guide" in slice_ids


def test_generate_response_falls_back_when_required_context_cannot_be_resolved(monkeypatch):
    planner = PlannerDecision.model_validate(
        {
            "intent": "inquire_about_project",
            "current_topic": "projects",
            "context_targets": ["projects.unknown_alias"],
            "conversation_energy": "medium",
            "recommended_section": None,
            "should_follow_up": True,
            "should_continue": True,
        }
    )

    def fail_if_called(*args, **kwargs):
        raise AssertionError("model should not be called when retrieval produced no context")

    monkeypatch.setattr("backend.app.rag._chat_completion", fail_if_called)

    turn = generate_response(
        "Tell me about your RAG project",
        default_session_state(),
        planner,
        [],
    )

    assert turn.reply == FALLBACK
    assert turn.follow_up is None


def test_generate_response_keeps_greeting_on_existing_project_session(monkeypatch):
    planner = PlannerDecision.model_validate(
        {
            "intent": "greeting",
            "current_topic": "projects",
            "context_targets": [],
            "conversation_energy": "medium",
            "recommended_section": {"id": "projects", "label": "Projects"},
            "should_follow_up": False,
            "should_continue": True,
        }
    )
    session = default_session_state()
    session.update(
        {
            "has_started": True,
            "current_topic": "projects",
            "conversation_energy": "medium",
        }
    )

    def fail_if_called(*args, **kwargs):
        raise AssertionError("model should not be called for greeting turns")

    monkeypatch.setattr("backend.app.rag._chat_completion", fail_if_called)

    turn = generate_response("hi", session, planner, [])

    assert "thanks for checking out my portfolio" in turn.reply.lower()
    assert "durgasantosh" in turn.reply.lower()
    assert turn.current_topic == "introduction"
    assert turn.recommended_section is None


def test_generate_response_answers_current_location_without_model_call(monkeypatch):
    planner = PlannerDecision.model_validate(
        {
            "intent": "general_discussion",
            "current_topic": "experience",
            "context_targets": [],
            "conversation_energy": "medium",
            "recommended_section": None,
            "should_follow_up": True,
            "should_continue": True,
        }
    )

    def fail_if_called(*args, **kwargs):
        raise AssertionError("model should not be called for direct location questions")

    monkeypatch.setattr("backend.app.rag._chat_completion", fail_if_called)

    turn = generate_response("where are you located at", default_session_state(), planner, [])

    assert "dallas, texas" in turn.reply.lower()
    assert "$85k" not in turn.reply
    assert "legally authorized" not in turn.reply.lower()


def test_generate_response_picks_current_city_without_repeating_other_facts(monkeypatch):
    planner = PlannerDecision.model_validate(
        {
            "intent": "general_discussion",
            "current_topic": "experience",
            "context_targets": [],
            "conversation_energy": "medium",
            "recommended_section": None,
            "should_follow_up": True,
            "should_continue": True,
        }
    )
    session = default_session_state()
    session["history"] = [
        {
            "role": "user",
            "content": "new york, new jersey, dallas, california which suites the best",
        },
        {
            "role": "assistant",
            "content": "I'm open to relocating to New York, New Jersey, Dallas, or California for the right opportunity.",
        },
    ]

    def fail_if_called(*args, **kwargs):
        raise AssertionError("model should not be called for location narrowing questions")

    monkeypatch.setattr("backend.app.rag._chat_completion", fail_if_called)

    turn = generate_response("pick one", session, planner, [])

    assert "dallas" in turn.reply.lower()
    assert "$85k" not in turn.reply
    assert "legally authorized" not in turn.reply.lower()


def test_generate_response_handles_misspelled_which_suites_best_without_model_call(monkeypatch):
    planner = PlannerDecision.model_validate(
        {
            "intent": "general_discussion",
            "current_topic": "experience",
            "context_targets": [],
            "conversation_energy": "medium",
            "recommended_section": None,
            "should_follow_up": True,
            "should_continue": True,
        }
    )

    def fail_if_called(*args, **kwargs):
        raise AssertionError("model should not be called for direct location preference selection")

    monkeypatch.setattr("backend.app.rag._chat_completion", fail_if_called)

    turn = generate_response(
        "new york, new jersey, dallas, california which suites the best",
        default_session_state(),
        planner,
        [],
    )

    assert "dallas" in turn.reply.lower()


def test_merge_turn_into_session_tracks_recent_state_and_prevents_repeat_recommendation():
    session = default_session_state()
    session["current_topic"] = "projects"
    session["last_recommended_section"] = "projects"

    turn = StructuredTurn.model_validate(
        {
            "reply": "I’d probably start with Beyond Sight because it had the strongest AI component.",
            "follow_up": "Do you want me to unpack the AI pipeline or the backend orchestration side?",
            "recommended_section": {"id": "projects", "label": "Projects"},
            "current_topic": "ai_systems",
            "conversation_energy": "medium",
            "should_continue": True,
        }
    )

    updated = merge_turn_into_session(session, user_message="projects", turn=turn, context_targets=["projects.beyond_sight"])

    assert updated["current_topic"] == "ai_systems"
    assert updated["conversation_energy"] == "medium"
    assert updated["last_context_targets"] == ["projects.beyond_sight"]
    assert updated["last_recommended_section"] == "projects"
    assert "projects" in updated["covered_topics"]


def test_normalize_recommended_section_drops_same_topic_recommendation():
    recommendation = normalize_recommended_section(
        {"id": "projects", "label": "Projects"},
        current_topic="projects",
        previous_section="experience",
    )

    assert recommendation is None


def test_knowledge_registry_contains_compact_high_signal_slices():
    slices = get_knowledge_slices()
    ids = {slice_.id for slice_ in slices}

    assert "projects.beyond_sight" in ids
    assert "experience.full_stack" in ids
    assert "skills.backend" in ids
