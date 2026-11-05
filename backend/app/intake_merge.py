from __future__ import annotations

from datetime import datetime, timezone
from typing import Literal

from .intake_models import CanonicalFieldState, CanonicalSessionState, FieldSource
from .intake_validate import IntakeValidationResult

StateBucketName = Literal["recruiter_state", "opportunity_state"]
MergeableFieldStatus = Literal["inferred", "confirmed", "corrected"]
_STATUS_BONUS: dict[str, float] = {
    "missing": 0.0,
    "inferred": 0.0,
    "confirmed": 0.15,
    "corrected": 0.25,
    "invalid": -1.0,
}
_PROTECTED_BONUS = 0.5
_RECRUITER_CONFIRMATION_BONUS = 0.1


def _now_iso(timestamp: str | None = None) -> str:
    if timestamp is not None:
        return timestamp
    return datetime.now(timezone.utc).isoformat()


def _source_bonus(source_type: str | None) -> float:
    if source_type == "recruiter_confirmation":
        return _RECRUITER_CONFIRMATION_BONUS
    return 0.0


def _field_strength_score(
    *,
    confidence: float,
    field_status: str,
    overwrite_protected: bool,
    source_type: str | None,
) -> float:
    return (
        confidence
        + _STATUS_BONUS.get(field_status, 0.0)
        + _source_bonus(source_type)
        + (_PROTECTED_BONUS if overwrite_protected else 0.0)
    )


def _get_bucket(state: CanonicalSessionState, bucket_name: StateBucketName) -> dict[str, CanonicalFieldState]:
    if bucket_name == "recruiter_state":
        return state.recruiter_state
    if bucket_name == "opportunity_state":
        return state.opportunity_state
    raise ValueError(f"unsupported state bucket: {bucket_name}")


def _build_field_state(
    *,
    value: str,
    confidence: float,
    field_status: MergeableFieldStatus,
    overwrite_protected: bool,
    source_type: str,
    message_index: int | None,
    extractor_version: str | None,
    timestamp: str,
) -> CanonicalFieldState:
    return CanonicalFieldState(
        value=value,
        confidence=confidence,
        field_status=field_status,
        source=FieldSource(
            type=source_type,
            message_index=message_index,
            extractor_version=extractor_version,
        ),
        needs_confirmation=field_status == "inferred",
        overwrite_protected=overwrite_protected,
        last_updated=timestamp,
    )


def merge_field_update(
    state: CanonicalSessionState,
    bucket_name: StateBucketName,
    field_name: str,
    value: str,
    *,
    expected_state_version: int | None = None,
    confidence: float = 0.0,
    field_status: MergeableFieldStatus = "inferred",
    overwrite_protected: bool = False,
    source_type: str = "message_extraction",
    message_index: int | None = None,
    extractor_version: str | None = None,
    timestamp: str | None = None,
) -> CanonicalSessionState:
    if field_status not in {"inferred", "confirmed", "corrected"}:
        raise ValueError(f"unsupported field_status: {field_status}")

    if expected_state_version is not None and state.state_version != expected_state_version:
        return state

    current_bucket = _get_bucket(state, bucket_name)
    previous = current_bucket.get(field_name)
    incoming_strength = _field_strength_score(
        confidence=confidence,
        field_status=field_status,
        overwrite_protected=overwrite_protected,
        source_type=source_type,
    )
    previous_strength = (
        _field_strength_score(
            confidence=previous.confidence,
            field_status=previous.field_status,
            overwrite_protected=previous.overwrite_protected,
            source_type=previous.source.type if previous.source else None,
        )
        if previous
        else float("-inf")
    )
    explicit_contradiction = (
        previous is not None
        and value != previous.value
        and previous.overwrite_protected
        and source_type == "recruiter_confirmation"
        and field_status == "corrected"
    )

    if previous and value != previous.value:
        if previous.overwrite_protected and not explicit_contradiction:
            return state
        if incoming_strength <= previous_strength:
            return state

    if previous and value == previous.value:
        if incoming_strength <= previous_strength:
            return state
        metadata_changed = (
            previous.field_status != field_status
            or previous.confidence != confidence
            or previous.overwrite_protected != overwrite_protected
            or previous.source is None
            or previous.source.type != source_type
            or previous.source.message_index != message_index
            or previous.source.extractor_version != extractor_version
        )
        if not metadata_changed:
            return state

    next_state = state.model_copy(deep=True)
    next_bucket = _get_bucket(next_state, bucket_name)
    event_timestamp = _now_iso(timestamp)

    next_bucket[field_name] = _build_field_state(
        value=value,
        confidence=confidence,
        field_status=field_status,
        overwrite_protected=overwrite_protected or bool(previous and previous.overwrite_protected),
        source_type=source_type,
        message_index=message_index,
        extractor_version=extractor_version,
        timestamp=event_timestamp,
    )
    next_state.state_version += 1
    next_state.event_log = list(next_state.event_log)
    next_state.event_log.append(
        {
            "event_type": "field_updated",
            "field": field_name,
            "bucket": bucket_name,
            "old_value": previous.value if previous else None,
            "new_value": value,
            "old_status": previous.field_status if previous else "missing",
            "new_status": field_status,
            "timestamp": event_timestamp,
        }
    )
    return next_state


def merge_validated_field_update(
    state: CanonicalSessionState,
    bucket_name: StateBucketName,
    validation_result: IntakeValidationResult,
    *,
    expected_state_version: int | None = None,
    confidence: float = 0.0,
    field_status: MergeableFieldStatus = "inferred",
    overwrite_protected: bool = False,
    source_type: str = "message_extraction",
    message_index: int | None = None,
    extractor_version: str | None = None,
    timestamp: str | None = None,
) -> CanonicalSessionState:
    if not validation_result.accepted:
        return state

    normalized_value = validation_result.normalized_value
    if not isinstance(normalized_value, str):
        raise ValueError("accepted validation result must contain a normalized string value")

    return merge_field_update(
        state,
        bucket_name,
        validation_result.field_name,
        normalized_value,
        expected_state_version=expected_state_version,
        confidence=confidence,
        field_status=field_status,
        overwrite_protected=overwrite_protected,
        source_type=source_type,
        message_index=message_index,
        extractor_version=extractor_version,
        timestamp=timestamp,
    )
