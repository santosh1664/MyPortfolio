from typing import Dict, List, Literal, Optional

from pydantic import BaseModel, Field

CONVERSATION_ENERGIES = ("low", "medium", "high")
MESSAGE_BUCKETS = ("empty", "short", "medium", "long")
MAX_RECENT_TOPICS = 4
MAX_RECENT_PATTERNS = 4


class RecommendedSection(BaseModel):
    id: str
    label: str


class PlannerDecision(BaseModel):
    intent: str
    current_topic: str
    context_targets: List[str] = Field(default_factory=list)
    conversation_energy: Literal["low", "medium", "high"]
    recommended_section: Optional[RecommendedSection] = None
    should_follow_up: bool
    should_continue: bool


class StructuredTurn(BaseModel):
    reply: str
    follow_up: Optional[str] = None
    recommended_section: Optional[RecommendedSection] = None
    current_topic: str
    conversation_energy: Literal["low", "medium", "high"]
    should_continue: bool
    planner_intent: Optional[str] = None
    context_targets: List[str] = Field(default_factory=list)


def default_session_state() -> Dict[str, object]:
    return {
        "history": [],
        "has_started": False,
        "current_topic": None,
        "covered_topics": [],
        "recent_topics_window": [],
        "follow_up_depth": 0,
        "last_recommended_section": None,
        "last_intent": None,
        "conversation_energy": "low",
        "last_context_targets": [],
        "last_user_message_length_bucket": "empty",
        "recent_project_mentions": [],
        "recent_follow_up_patterns": [],
    }


def recent_history_window(session: Dict[str, object], max_items: int = 4) -> List[Dict[str, str]]:
    return list(session.get("history", []))[-max_items:]


def bucket_user_message_length(message: str) -> str:
    trimmed = (message or "").strip()
    if not trimmed:
        return "empty"
    if len(trimmed) <= 20:
        return "short"
    if len(trimmed) <= 120:
        return "medium"
    return "long"


def normalize_recommended_section(
    recommendation: Optional[Dict[str, str] | RecommendedSection],
    current_topic: Optional[str],
    previous_section: Optional[str],
) -> Optional[Dict[str, str]]:
    if recommendation is None:
        return None

    if isinstance(recommendation, RecommendedSection):
        recommendation_dict = recommendation.model_dump()
    else:
        recommendation_dict = recommendation

    section_id = recommendation_dict.get("id")
    if not section_id:
        return None

    if section_id == previous_section:
        return None

    if current_topic and (
        section_id == current_topic
        or current_topic.startswith(section_id)
        or section_id.startswith(current_topic)
    ):
        return None

    return recommendation_dict


def merge_turn_into_session(
    session: Dict[str, object],
    user_message: str,
    turn: StructuredTurn,
    context_targets: List[str],
    recommended_section: Optional[Dict[str, str]] = None,
) -> Dict[str, object]:
    updated = {
        **default_session_state(),
        **session,
        "history": list(session.get("history", [])),
        "covered_topics": list(session.get("covered_topics", [])),
        "recent_topics_window": list(session.get("recent_topics_window", [])),
        "last_context_targets": list(context_targets or []),
        "recent_project_mentions": list(session.get("recent_project_mentions", [])),
        "recent_follow_up_patterns": list(session.get("recent_follow_up_patterns", [])),
    }

    previous_topic = session.get("current_topic")
    if previous_topic and previous_topic not in updated["covered_topics"]:
        updated["covered_topics"].append(previous_topic)

    current_topic = turn.current_topic
    updated["current_topic"] = current_topic
    updated["has_started"] = True
    updated["last_intent"] = turn.planner_intent
    updated["conversation_energy"] = turn.conversation_energy
    updated["last_user_message_length_bucket"] = bucket_user_message_length(user_message)

    recent_topics = [topic for topic in updated["recent_topics_window"] if topic != current_topic]
    recent_topics.append(current_topic)
    updated["recent_topics_window"] = recent_topics[-MAX_RECENT_TOPICS:]

    if current_topic == previous_topic:
        updated["follow_up_depth"] = min(int(session.get("follow_up_depth", 0)) + 1, 2)
    else:
        updated["follow_up_depth"] = 0

    if recommended_section:
        updated["last_recommended_section"] = recommended_section["id"]

    if turn.follow_up:
        patterns = [pattern for pattern in updated["recent_follow_up_patterns"] if pattern != turn.follow_up]
        patterns.append(turn.follow_up)
        updated["recent_follow_up_patterns"] = patterns[-MAX_RECENT_PATTERNS:]

    project_mentions = [
        target for target in context_targets if target.startswith("projects.")
    ]
    if project_mentions:
        deduped = [target for target in updated["recent_project_mentions"] if target not in project_mentions]
        deduped.extend(project_mentions)
        updated["recent_project_mentions"] = deduped[-MAX_RECENT_TOPICS:]

    return updated
