import pytest

from backend.app.intake_validate import IntakeValidationResult, validate_intake_field


def test_validate_intake_field_rejects_invalid_email():
    result = validate_intake_field("email", "not-an-email")

    assert isinstance(result, IntakeValidationResult)
    assert result.field_name == "email"
    assert result.accepted is False
    assert result.normalized_value is None
    assert result.reason == "invalid_email"


def test_validate_intake_field_accepts_and_normalizes_valid_email():
    result = validate_intake_field("email", "  Recruiter@Example.COM ")

    assert result.accepted is True
    assert result.normalized_value == "recruiter@example.com"
    assert result.reason is None


@pytest.mark.parametrize(
    ("raw_value", "reason"),
    [
        ("a..b@example.com", "invalid_email"),
        (".a@example.com", "invalid_email"),
        ("a@-example-.com", "invalid_email"),
    ],
)
def test_validate_intake_field_rejects_clearly_invalid_emails(raw_value, reason):
    result = validate_intake_field("email", raw_value)

    assert result.accepted is False
    assert result.normalized_value is None
    assert result.reason == reason


@pytest.mark.parametrize("raw_value", [None, "", "   "])
def test_validate_intake_field_rejects_empty_values(raw_value):
    result = validate_intake_field("company", raw_value)

    assert result.accepted is False
    assert result.normalized_value is None
    assert result.reason == "empty_value"


def test_validate_intake_field_accepts_company_strings():
    result = validate_intake_field("company", "  Stripe  ")

    assert result.accepted is True
    assert result.normalized_value == "Stripe"
    assert result.reason is None


def test_validate_intake_field_rejects_suspicious_company_values():
    result = validate_intake_field("company", "N/A")

    assert result.accepted is False
    assert result.normalized_value is None
    assert result.reason == "suspicious_company"


def test_validate_intake_field_rejects_malformed_compensation():
    result = validate_intake_field("compensation", "paid well")

    assert result.accepted is False
    assert result.normalized_value is None
    assert result.reason == "invalid_compensation"


@pytest.mark.parametrize("raw_value", ["12,34", "1,,000"])
def test_validate_intake_field_rejects_malformed_numeric_compensation(raw_value):
    result = validate_intake_field("compensation", raw_value)

    assert result.accepted is False
    assert result.normalized_value is None
    assert result.reason == "invalid_compensation"


@pytest.mark.parametrize(
    "raw_value",
    [
        "100 k",
        "$120,000 - 150 k",
    ],
)
def test_validate_intake_field_accepts_compensation_grammar(raw_value):
    result = validate_intake_field("  COMPENSATION ", raw_value)

    assert result.accepted is True
    assert result.normalized_value == raw_value
    assert result.reason is None


def test_validate_intake_field_rejects_non_string_compensation_values():
    result = validate_intake_field("compensation", 100000)

    assert result.accepted is False
    assert result.normalized_value is None
    assert result.reason == "invalid_compensation"
