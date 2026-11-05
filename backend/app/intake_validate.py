from __future__ import annotations

import re
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

_EMAIL_RE = re.compile(
    r"^(?=.{3,254}$)(?P<local>[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+)@(?P<domain>[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+)$"
)
_COMPENSATION_RE = re.compile(
    r"^\$?\d[\d,]*(?:\.\d+)?(?:\s*[kKmM])?(?:\s*[-–]\s*\$?\d[\d,]*(?:\.\d+)?(?:\s*[kKmM])?)?$"
)
_COMPENSATION_RANGE_RE = re.compile(r"\s*[-–]\s*")
_COMPANY_BLOCKLIST = {
    "company",
    "dummy",
    "example",
    "my company",
    "n/a",
    "na",
    "none",
    "null",
    "placeholder",
    "sample",
    "test",
    "tbd",
    "unknown",
    "unspecified",
    "your company",
}


class IntakeValidationResult(BaseModel):
    model_config = ConfigDict(extra="forbid")

    field_name: str
    field_type: Literal["email", "string", "compensation"]
    raw_value: Any = None
    normalized_value: Any = None
    accepted: bool
    reason: str | None = None
    details: dict[str, Any] = Field(default_factory=dict)
    validator_version: str = "v1"

    @property
    def event_type(self) -> Literal["field_validated", "field_rejected"]:
        return "field_validated" if self.accepted else "field_rejected"


def _normalize_text(raw_value: Any) -> str:
    if not isinstance(raw_value, str):
        raise TypeError("expected string input")
    return " ".join(raw_value.strip().split())


def _validate_email(raw_value: Any, field_name: str) -> IntakeValidationResult:
    if raw_value is None:
        return _rejected(field_name, "email", raw_value, "empty_value")

    try:
        normalized = _normalize_text(raw_value).lower()
    except TypeError:
        return _rejected(field_name, "email", raw_value, "invalid_email")

    if not normalized:
        return _rejected(field_name, "email", raw_value, "empty_value")

    if _EMAIL_RE.fullmatch(normalized) is None:
        return _rejected(field_name, "email", raw_value, "invalid_email")

    local_part, domain_part = normalized.rsplit("@", 1)
    if local_part.startswith(".") or local_part.endswith(".") or ".." in local_part:
        return _rejected(field_name, "email", raw_value, "invalid_email")

    domain_labels = domain_part.split(".")
    if any(not label or label.startswith("-") or label.endswith("-") for label in domain_labels):
        return _rejected(field_name, "email", raw_value, "invalid_email")

    return IntakeValidationResult(
        field_name=field_name,
        field_type="email",
        raw_value=raw_value,
        normalized_value=normalized,
        accepted=True,
    )


def _validate_compensation(raw_value: Any, field_name: str) -> IntakeValidationResult:
    if raw_value is None:
        return _rejected(field_name, "compensation", raw_value, "empty_value")

    try:
        normalized = _normalize_text(raw_value)
    except TypeError:
        return _rejected(field_name, "compensation", raw_value, "invalid_compensation")

    if not normalized:
        return _rejected(field_name, "compensation", raw_value, "empty_value")

    if _COMPENSATION_RE.fullmatch(normalized) is None:
        return _rejected(field_name, "compensation", raw_value, "invalid_compensation")

    parts = _COMPENSATION_RANGE_RE.split(normalized, maxsplit=1)
    if any(not _is_valid_compensation_amount(part) for part in parts):
        return _rejected(field_name, "compensation", raw_value, "invalid_compensation")

    return IntakeValidationResult(
        field_name=field_name,
        field_type="compensation",
        raw_value=raw_value,
        normalized_value=normalized,
        accepted=True,
    )


def _validate_string(raw_value: Any, field_name: str) -> IntakeValidationResult:
    if raw_value is None:
        return _rejected(field_name, "string", raw_value, "empty_value")

    try:
        normalized = _normalize_text(raw_value)
    except TypeError:
        return _rejected(field_name, "string", raw_value, "invalid_string")

    if not normalized:
        return _rejected(field_name, "string", raw_value, "empty_value")

    return IntakeValidationResult(
        field_name=field_name,
        field_type="string",
        raw_value=raw_value,
        normalized_value=normalized,
        accepted=True,
    )


def _validate_company(raw_value: Any, field_name: str) -> IntakeValidationResult:
    if raw_value is None:
        return _rejected(field_name, "string", raw_value, "empty_value")

    try:
        normalized = _normalize_text(raw_value)
    except TypeError:
        return _rejected(field_name, "string", raw_value, "invalid_company")

    if not normalized:
        return _rejected(field_name, "string", raw_value, "empty_value")

    lowered = normalized.casefold()
    if lowered in _COMPANY_BLOCKLIST:
        return _rejected(field_name, "string", raw_value, "suspicious_company")

    if not any(char.isalpha() for char in normalized):
        return _rejected(field_name, "string", raw_value, "suspicious_company")

    return IntakeValidationResult(
        field_name=field_name,
        field_type="string",
        raw_value=raw_value,
        normalized_value=normalized,
        accepted=True,
    )


def _is_valid_compensation_amount(raw_part: str) -> bool:
    part = raw_part.strip()
    if not part:
        return False

    if part[0] == "$":
        part = part[1:].strip()

    if not part:
        return False

    if part[-1] in {"k", "K", "m", "M"}:
        part = part[:-1].strip()

    if not part:
        return False

    if part.count(".") > 1:
        return False

    if "." in part:
        integer_part, fractional_part = part.split(".", 1)
        if not fractional_part.isdigit():
            return False
    else:
        integer_part = part

    if not integer_part:
        return False

    if "," in integer_part:
        groups = integer_part.split(",")
        if any(group == "" for group in groups):
            return False
        if not (1 <= len(groups[0]) <= 3):
            return False
        if any(len(group) != 3 for group in groups[1:]):
            return False
        if not all(group.isdigit() for group in groups):
            return False
        return True

    return integer_part.isdigit()


ValidationFieldType = Literal["email", "string", "compensation"]


def _rejected(field_name: str, field_type: ValidationFieldType, raw_value: Any, reason: str) -> IntakeValidationResult:
    return IntakeValidationResult(
        field_name=field_name,
        field_type=field_type,
        raw_value=raw_value,
        normalized_value=None,
        accepted=False,
        reason=reason,
    )


def validate_intake_field(field_name: str, raw_value: Any) -> IntakeValidationResult:
    normalized_field_name = field_name.strip().lower()

    if normalized_field_name == "email":
        return _validate_email(raw_value, normalized_field_name)
    if normalized_field_name == "company":
        return _validate_company(raw_value, normalized_field_name)
    if normalized_field_name == "compensation":
        return _validate_compensation(raw_value, normalized_field_name)
    return _validate_string(raw_value, normalized_field_name)
