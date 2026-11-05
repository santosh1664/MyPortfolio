import pytest

from backend.app.intake_merge import merge_validated_field_update
from backend.app.intake_models import CanonicalFieldState, CanonicalSessionState
from backend.app.intake_validate import IntakeValidationResult


def test_merge_validated_field_update_increments_state_version_by_one_and_appends_event():
    state = CanonicalSessionState.new(session_id="session-123")
    state.state_version = 4
    state.question_attempts["email"] = 2
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="  Stripe  ",
        normalized_value="Stripe",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        "recruiter_state",
        validation_result,
        confidence=0.97,
        field_status="inferred",
        overwrite_protected=False,
        source_type="message_extraction",
        message_index=12,
        extractor_version="v1.2",
        timestamp="2026-05-12T20:11:05Z",
    )

    assert next_state.state_version == state.state_version + 1
    assert next_state.recruiter_state["company"].value == "Stripe"
    assert next_state.recruiter_state["company"].source is not None
    assert next_state.recruiter_state["company"].source.type == "message_extraction"
    assert next_state.recruiter_state["company"].source.message_index == 12
    assert next_state.recruiter_state["company"].source.extractor_version == "v1.2"
    assert next_state.recruiter_state["company"].needs_confirmation is True
    assert len(next_state.event_log) == len(state.event_log) + 1
    assert next_state.event_log[-1]["event_type"] == "field_updated"
    assert next_state.event_log[-1]["field"] == "company"
    assert next_state.event_log[-1]["bucket"] == "recruiter_state"
    assert next_state.question_attempts == state.question_attempts


@pytest.mark.parametrize("bucket_name", ["recruiter_state", "opportunity_state"])
def test_merge_validated_field_update_blocks_weaker_updates_in_both_buckets(bucket_name):
    state = CanonicalSessionState.new(session_id="session-123")
    state.question_attempts["email"] = 1
    state.state_version = 8
    target_bucket = getattr(state, bucket_name)
    target_bucket["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.97,
        field_status="confirmed",
        overwrite_protected=True,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="Meta",
        normalized_value="Meta",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        bucket_name,
        validation_result,
        confidence=0.45,
        field_status="inferred",
        overwrite_protected=False,
        source_type="message_extraction",
        timestamp="2026-05-12T20:12:05Z",
    )

    assert next_state is state
    assert getattr(next_state, bucket_name)["company"].value == "Stripe"
    assert next_state.question_attempts == {"email": 1}
    assert next_state.state_version == 8
    assert next_state.event_log == []


def test_merge_validated_field_update_does_not_replace_confirmed_value_with_weaker_confirmed_update():
    state = CanonicalSessionState.new(session_id="session-123")
    state.recruiter_state["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.91,
        field_status="confirmed",
        overwrite_protected=False,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="Meta",
        normalized_value="Meta",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        "recruiter_state",
        validation_result,
        confidence=0.72,
        field_status="confirmed",
        overwrite_protected=False,
        source_type="message_extraction",
        timestamp="2026-05-12T20:12:05Z",
    )

    assert next_state is state
    assert next_state.recruiter_state["company"].value == "Stripe"
    assert next_state.recruiter_state["company"].field_status == "confirmed"
    assert next_state.recruiter_state["company"].confidence == 0.91
    assert next_state.event_log == []


@pytest.mark.parametrize("bucket_name", ["recruiter_state", "opportunity_state"])
def test_merge_validated_field_update_blocks_same_value_weaker_metadata_updates(bucket_name):
    state = CanonicalSessionState.new(session_id="session-123")
    state.state_version = 11
    target_bucket = getattr(state, bucket_name)
    target_bucket["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.97,
        field_status="confirmed",
        overwrite_protected=True,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="Stripe",
        normalized_value="Stripe",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        bucket_name,
        validation_result,
        confidence=0.42,
        field_status="inferred",
        overwrite_protected=False,
        source_type="message_extraction",
        timestamp="2026-05-12T20:12:05Z",
    )

    assert next_state is state
    assert getattr(next_state, bucket_name)["company"].value == "Stripe"
    assert getattr(next_state, bucket_name)["company"].field_status == "confirmed"
    assert getattr(next_state, bucket_name)["company"].confidence == 0.97
    assert getattr(next_state, bucket_name)["company"].overwrite_protected is True
    assert next_state.state_version == 11
    assert next_state.event_log == []


def test_merge_validated_field_update_transitions_corrected_values_and_logs_mutation():
    state = CanonicalSessionState.new(session_id="session-123")
    state.question_attempts["email"] = 2
    state.recruiter_state["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.82,
        field_status="inferred",
        overwrite_protected=False,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="Meta",
        normalized_value="Meta",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        "recruiter_state",
        validation_result,
        confidence=0.99,
        field_status="corrected",
        overwrite_protected=True,
        source_type="recruiter_confirmation",
        timestamp="2026-05-12T20:13:05Z",
    )

    assert next_state is not state
    assert next_state.state_version == state.state_version + 1
    assert next_state.recruiter_state["company"].value == "Meta"
    assert next_state.recruiter_state["company"].field_status == "corrected"
    assert next_state.recruiter_state["company"].source is not None
    assert next_state.recruiter_state["company"].source.type == "recruiter_confirmation"
    assert next_state.recruiter_state["company"].source.message_index is None
    assert next_state.recruiter_state["company"].source.extractor_version is None
    assert next_state.recruiter_state["company"].needs_confirmation is False
    assert next_state.recruiter_state["company"].overwrite_protected is True
    assert next_state.question_attempts == state.question_attempts
    assert len(next_state.event_log) == len(state.event_log) + 1
    event = next_state.event_log[-1]
    assert event["old_value"] == "Stripe"
    assert event["new_value"] == "Meta"
    assert event["event_type"] == "field_updated"


def test_merge_validated_field_update_requires_explicit_contradiction_for_overwrite_protected_values():
    state = CanonicalSessionState.new(session_id="session-123")
    state.recruiter_state["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.99,
        field_status="confirmed",
        overwrite_protected=True,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="Meta",
        normalized_value="Meta",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        "recruiter_state",
        validation_result,
        confidence=0.95,
        field_status="corrected",
        overwrite_protected=True,
        source_type="message_extraction",
        timestamp="2026-05-12T20:12:05Z",
    )

    assert next_state is state
    assert next_state.recruiter_state["company"].value == "Stripe"
    assert next_state.recruiter_state["company"].field_status == "confirmed"
    assert next_state.event_log == []


def test_merge_validated_field_update_accepts_explicit_contradiction_for_overwrite_protected_values():
    state = CanonicalSessionState.new(session_id="session-123")
    state.recruiter_state["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.99,
        field_status="confirmed",
        overwrite_protected=True,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="Meta",
        normalized_value="Meta",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        "recruiter_state",
        validation_result,
        confidence=0.99,
        field_status="corrected",
        overwrite_protected=True,
        source_type="recruiter_confirmation",
        timestamp="2026-05-12T20:12:05Z",
    )

    assert next_state.state_version == state.state_version + 1
    assert next_state.recruiter_state["company"].value == "Meta"
    assert next_state.recruiter_state["company"].field_status == "corrected"
    assert next_state.event_log[-1]["event_type"] == "field_updated"


def test_merge_validated_field_update_blocks_very_weak_explicit_contradiction_against_strong_protected_value():
    state = CanonicalSessionState.new(session_id="session-123")
    state.recruiter_state["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.99,
        field_status="confirmed",
        overwrite_protected=True,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="Meta",
        normalized_value="Meta",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        "recruiter_state",
        validation_result,
        confidence=0.01,
        field_status="corrected",
        overwrite_protected=True,
        source_type="recruiter_confirmation",
        timestamp="2026-05-12T20:12:05Z",
    )

    assert next_state is state
    assert next_state.recruiter_state["company"].value == "Stripe"
    assert next_state.recruiter_state["company"].field_status == "confirmed"
    assert next_state.event_log == []


def test_merge_validated_field_update_rejects_unaccepted_validation_without_partial_merge():
    state = CanonicalSessionState.new(session_id="session-123")
    state.question_attempts["email"] = 3
    state.recruiter_state["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.88,
        field_status="inferred",
        overwrite_protected=False,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="",
        normalized_value=None,
        accepted=False,
        reason="empty_value",
    )

    next_state = merge_validated_field_update(
        state,
        "recruiter_state",
        validation_result,
        confidence=0.99,
        field_status="corrected",
        overwrite_protected=True,
        source_type="recruiter_confirmation",
        timestamp="2026-05-12T20:12:05Z",
    )

    assert next_state is state
    assert next_state.recruiter_state["company"].value == "Stripe"
    assert next_state.recruiter_state["company"].field_status == "inferred"
    assert next_state.question_attempts == {"email": 3}
    assert next_state.event_log == []


def test_merge_validated_field_update_rejects_stale_writes_against_newer_snapshots():
    state = CanonicalSessionState.new(session_id="session-123")
    state.state_version = 10
    state.recruiter_state["company"] = CanonicalFieldState(
        value="Stripe",
        confidence=0.88,
        field_status="inferred",
        overwrite_protected=False,
        needs_confirmation=False,
        last_updated="2026-05-12T20:11:05Z",
    )
    validation_result = IntakeValidationResult(
        field_name="company",
        field_type="string",
        raw_value="Meta",
        normalized_value="Meta",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        "recruiter_state",
        validation_result,
        expected_state_version=9,
        confidence=0.99,
        field_status="corrected",
        overwrite_protected=True,
        source_type="recruiter_confirmation",
        timestamp="2026-05-12T20:12:05Z",
    )

    assert next_state is state
    assert next_state.state_version == 10
    assert next_state.recruiter_state["company"].value == "Stripe"
    assert next_state.event_log == []


def test_merge_validated_field_update_accepts_opportunity_state_updates():
    state = CanonicalSessionState.new(session_id="session-123")
    validation_result = IntakeValidationResult(
        field_name="role_title",
        field_type="string",
        raw_value="  Senior Engineer  ",
        normalized_value="Senior Engineer",
        accepted=True,
    )

    next_state = merge_validated_field_update(
        state,
        "opportunity_state",
        validation_result,
        confidence=0.88,
        field_status="inferred",
        overwrite_protected=False,
        source_type="message_extraction",
        timestamp="2026-05-12T20:14:05Z",
    )

    assert next_state.state_version == state.state_version + 1
    assert next_state.opportunity_state["role_title"].value == "Senior Engineer"
    assert next_state.event_log[-1]["bucket"] == "opportunity_state"
    assert next_state.event_log[-1]["field"] == "role_title"
