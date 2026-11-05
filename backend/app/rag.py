import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional

from openai import OpenAI

from .config import settings
from .conversation import PlannerDecision, StructuredTurn, recent_history_window

client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url,
    default_headers={
        "HTTP-Referer": settings.openai_http_referer,
        "X-Title": settings.openai_app_title,
    },
)

FALLBACK = "I don’t have that information available right now, but I’m happy to help with my experience, projects, skills, or role fit."
MAX_CONTEXT_SLICES = 3
MAX_PROJECT_SLICES = 2
MAX_CONTEXT_CHARS = 2200


@dataclass(frozen=True)
class KnowledgeSlice:
    id: str
    topic: str
    priority: int
    tags: tuple[str, ...]
    content: str


def _read_knowledge_file(name: str) -> str:
    path = Path(__file__).resolve().parent.parent / "knowledge" / name
    return path.read_text(encoding="utf-8").strip()


def load_resume_text():
    base_path = Path(__file__).resolve().parent.parent / "knowledge"

    if not base_path.exists():
        print("❌ Knowledge folder not found:", base_path)
        return ""

    content = ""
    for file in base_path.glob("*.md"):
        try:
            content += file.read_text(encoding="utf-8") + "\n\n"
        except Exception as exc:
            print(f"Error reading {file.name}:", exc)

    print("✅ Resume loaded. Length:", len(content))
    return content.strip()


RESUME_CONTEXT = load_resume_text()


def _extract_resume_location() -> str:
    match = re.search(r"^Location:\s*(.+)$", RESUME_CONTEXT, re.MULTILINE)
    return match.group(1).strip() if match else "Dallas, Texas, USA"


RESUME_LOCATION = _extract_resume_location()
RESUME_LOCATION_CITY = RESUME_LOCATION.split(",", 1)[0].strip()


def get_knowledge_slices() -> List[KnowledgeSlice]:
    resume = _read_knowledge_file("resume.md")
    experience = _read_knowledge_file("experience.md")
    skills = _read_knowledge_file("skills.md")
    projects = _read_knowledge_file("projects.md")
    visa = _read_knowledge_file("visa.md")
    compensation = _read_knowledge_file("compensation.md")

    return [
        KnowledgeSlice(
            id="resume.summary",
            topic="introduction",
            priority=8,
            tags=("summary", "background", "full_stack"),
            content=resume,
        ),
        KnowledgeSlice(
            id="experience.full_stack",
            topic="experience",
            priority=9,
            tags=("backend", "frontend", "full_stack", "citi", "zensar"),
            content=experience,
        ),
        KnowledgeSlice(
            id="skills.backend",
            topic="backend",
            priority=8,
            tags=("backend", "java", "spring", "microservices", "kafka"),
            content=(
                "Backend stack: Java, Spring Boot, Spring Security, JPA, Hibernate, "
                "REST APIs, microservices, Apache Kafka, RabbitMQ, PostgreSQL, MySQL, AWS, Docker, Kubernetes."
            ),
        ),
        KnowledgeSlice(
            id="skills.frontend",
            topic="frontend",
            priority=7,
            tags=("frontend", "react", "angular", "ui"),
            content=(
                "Frontend stack: React.js, React Hooks, Angular, Bootstrap, Redux, GraphQL, "
                "responsive UI work, API integrations, and frontend performance tuning."
            ),
        ),
        KnowledgeSlice(
            id="skills.ai_systems",
            topic="ai_systems",
            priority=8,
            tags=("ai", "ml", "ocr", "nlp", "tensorflow", "pytorch", "rag"),
            content=(
                "AI/ML background: TensorFlow, PyTorch, Scikit-Learn, OCR, NLP, ETL, Kafka, "
                "and building AI-driven accessibility and conversational systems."
            ),
        ),
        KnowledgeSlice(
            id="projects.beyond_sight",
            topic="ai_systems",
            priority=10,
            tags=("ai", "accessibility", "ocr", "tts", "cnn", "impact"),
            content=(
                "Beyond Sight: I built an AI accessibility system that converts charts and images into speech "
                "for visually impaired users using CNNs, OCR, and TTS. It was presented at ACM W4A 2024, "
                "achieved 92% chart-classification accuracy, and improved accessibility by 90%."
            ),
        ),
        KnowledgeSlice(
            id="projects.accessible_weather",
            topic="frontend",
            priority=8,
            tags=("frontend", "accessibility", "weather", "ux"),
            content=(
                "Accessible Weather and Shelter Finder: I built an accessible web application for blind "
                "and visually impaired users with real-time weather updates, severe weather alerts, nearby shelters, "
                "keyboard navigation, high-contrast UI, shortcut keys, and text-to-speech."
            ),
        ),
        KnowledgeSlice(
            id="projects.dynamic_pricing",
            topic="ai_systems",
            priority=6,
            tags=("ml", "prediction", "pricing", "data"),
            content=(
                "Dynamic Pricing Prediction for Cabs: I developed supervised and reinforcement-learning models "
                "to predict cab pricing and evaluate dynamic pricing behavior."
            ),
        ),
        KnowledgeSlice(
            id="projects.recruiter_guide",
            topic="ai_systems",
            priority=9,
            tags=("rag", "agents", "frontend", "backend", "conversation"),
            content=(
                "Autonomous recruiter guide: I built this portfolio conversation system to feel like a direct technical discussion. "
                "It uses a lightweight planner-driven RAG flow with targeted retrieval, in-memory conversation state, "
                "and a React/FastAPI split."
            ),
        ),
        KnowledgeSlice(
            id="visa.status",
            topic="work_authorization",
            priority=7,
            tags=("visa", "authorization", "relocation"),
            content=visa,
        ),
        KnowledgeSlice(
            id="compensation.range",
            topic="compensation",
            priority=5,
            tags=("compensation", "salary"),
            content=compensation,
        ),
        KnowledgeSlice(
            id="education.certifications",
            topic="education",
            priority=5,
            tags=("education", "certifications", "aws"),
            content=resume,
        ),
    ]


def _match_topic_targets(target: str, slices: Iterable[KnowledgeSlice]) -> List[KnowledgeSlice]:
    if target == "projects":
        return [slice_ for slice_ in slices if slice_.id.startswith("projects.")]
    if "." in target:
        namespace, alias = target.split(".", 1)
        if namespace == "projects":
            return [
                slice_
                for slice_ in slices
                if slice_.id.startswith("projects.")
                and (
                    alias == slice_.id.split(".", 1)[1]
                    or alias in slice_.tags
                    or alias in slice_.topic
                )
            ]
    return [
        slice_
        for slice_ in slices
        if slice_.topic == target
        or target in slice_.tags
        or slice_.id.startswith(f"{target}.")
    ]


def resolve_context_targets(
    context_targets: List[str],
    max_slices: int = MAX_CONTEXT_SLICES,
    max_project_slices: int = MAX_PROJECT_SLICES,
    max_context_chars: int = MAX_CONTEXT_CHARS,
) -> List[KnowledgeSlice]:
    slices = get_knowledge_slices()
    by_id = {slice_.id: slice_ for slice_ in slices}
    resolved: List[KnowledgeSlice] = []

    for target in context_targets:
        if target in by_id:
            resolved.append(by_id[target])
            continue
        resolved.extend(_match_topic_targets(target, slices))

    deduped: List[KnowledgeSlice] = []
    seen = set()
    for slice_ in sorted(resolved, key=lambda item: item.priority, reverse=True):
        if slice_.id in seen:
            continue
        seen.add(slice_.id)
        deduped.append(slice_)

    project_count = 0
    final: List[KnowledgeSlice] = []
    char_budget = 0
    for slice_ in deduped:
        if len(final) >= max_slices:
            break
        if slice_.id.startswith("projects."):
            if project_count >= max_project_slices:
                continue
        next_budget = char_budget + len(slice_.content)
        if next_budget > max_context_chars and final:
            continue
        final.append(slice_)
        char_budget = next_budget
        if slice_.id.startswith("projects."):
            project_count += 1

    return final


PLANNER_SYSTEM_PROMPT = """
You are planning a recruiter-style portfolio conversation for Roy.

Return JSON only.

Your job is to decide:
- the user's intent
- the current topic
- whether retrieval is needed
- which compact context targets are needed
- the conversation energy
- whether a follow-up is appropriate
- whether the conversation should continue naturally
- whether a recommended section would help advance the conversation

Rules:
- Greetings should feel human and should not trigger resume fallback behavior.
- Project discussions should stay selective and usually focus on one or two strong projects.
- Do not recommend the same section as the current topic if it would feel repetitive.
- Be adaptive and conversational, not mechanical.

Return exactly these keys:
- intent
- current_topic
- context_targets
- conversation_energy
- recommended_section
- should_follow_up
- should_continue
"""

RESPONSE_SYSTEM_PROMPT = """
You are Roy speaking directly in first person.

Return JSON only.

Rules:
- Speak only in first person.
- Sound concise, technical, direct, and recruiter-friendly.
- Use short spoken-style paragraphs, not lists or resume dumps.
- Select the strongest relevant details instead of summarizing everything.
- Follow-up is optional.
- Never say "According to the resume", "The candidate", or refer to Roy in third person.
- If the answer is not present in the supplied context, respond exactly with:
"I don’t have that information available right now, but I’m happy to help with my experience, projects, skills, or role fit."

Return exactly these keys:
- reply
- follow_up
- recommended_section
- current_topic
- conversation_energy
- should_continue
"""

PLANNER_TARGET_LABELS = {
    "resume": "Resume PDF",
    "resume.summary": "Resume PDF",
    "experience": "Experience",
    "experience.full_stack": "Experience",
    "projects": "Projects",
    "projects.beyond_sight": "Projects",
    "projects.accessible_weather": "Projects",
    "projects.dynamic_pricing": "Projects",
    "projects.recruiter_guide": "Projects",
    "skills": "Skills",
    "skills.backend": "Skills",
    "skills.frontend": "Skills",
    "skills.ai_systems": "Skills",
    "education": "Certifications",
    "education.certifications": "Certifications",
}


def _extract_json(raw_text: str) -> dict:
    text = raw_text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1].rsplit("```", 1)[0].strip()
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("No JSON object found")
    return json.loads(text[start : end + 1])


def _normalize_recommended_section(value) -> Optional[dict]:
    if value is None:
        return None
    if isinstance(value, dict):
        if value.get("id") and value.get("label"):
            return {"id": value["id"], "label": value["label"]}
        raw_id = value.get("id") or value.get("target") or value.get("section")
    elif isinstance(value, str):
        raw_id = value
    else:
        return None

    if not raw_id:
        return None

    normalized_id = raw_id
    if raw_id.startswith("projects."):
        normalized_id = "projects"
    elif raw_id.startswith("skills."):
        normalized_id = "skills"
    elif raw_id in {"experience.full_stack", "resume.summary", "education.certifications"}:
        normalized_id = raw_id.split(".", 1)[0]

    return {
        "id": normalized_id,
        "label": PLANNER_TARGET_LABELS.get(raw_id, PLANNER_TARGET_LABELS.get(normalized_id, normalized_id.replace("_", " ").title())),
    }


def _normalize_planner_payload(payload: dict) -> dict:
    context_targets = payload.get("context_targets") or payload.get("retrieval_targets") or payload.get("targets") or []
    if isinstance(context_targets, str):
        context_targets = [context_targets]

    should_follow_up = payload.get("should_follow_up")
    if should_follow_up is None:
        should_follow_up = payload.get("needs_follow_up")
    if should_follow_up is None:
        should_follow_up = True

    should_continue = payload.get("should_continue")
    if should_continue is None:
        should_continue = payload.get("continue_conversation")
    if should_continue is None:
        should_continue = True

    conversation_energy = payload.get("conversation_energy") or payload.get("energy") or "medium"
    if conversation_energy not in {"low", "medium", "high"}:
        conversation_energy = "medium"

    normalized = {
        "intent": payload.get("intent") or payload.get("user_intent") or payload.get("message_intent") or "general_discussion",
        "current_topic": payload.get("current_topic") or payload.get("next_topic") or payload.get("topic") or "experience",
        "context_targets": context_targets,
        "conversation_energy": conversation_energy,
        "recommended_section": _normalize_recommended_section(payload.get("recommended_section")),
        "should_follow_up": should_follow_up,
        "should_continue": should_continue,
    }
    if normalized["intent"] == "greeting":
        normalized["current_topic"] = "introduction"
        normalized["context_targets"] = []
        normalized["conversation_energy"] = "low"
        normalized["recommended_section"] = None
        normalized["should_follow_up"] = False
        normalized["should_continue"] = True
    return normalized


def _normalize_turn_payload(payload: dict, planner: PlannerDecision) -> dict:
    follow_up = payload.get("follow_up")
    if follow_up is None:
        follow_up = payload.get("next_question") or payload.get("follow_up_question")
    if isinstance(follow_up, bool):
        follow_up = None

    conversation_energy = payload.get("conversation_energy") or payload.get("energy") or planner.conversation_energy
    if conversation_energy not in {"low", "medium", "high"}:
        conversation_energy = planner.conversation_energy

    should_continue = payload.get("should_continue")
    if should_continue is None:
        should_continue = planner.should_continue

    return {
        "reply": payload.get("reply") or FALLBACK,
        "follow_up": follow_up,
        "recommended_section": _normalize_recommended_section(payload.get("recommended_section"))
        or (planner.recommended_section.model_dump() if planner.recommended_section else None),
        "current_topic": payload.get("current_topic") or payload.get("next_topic") or planner.current_topic,
        "conversation_energy": conversation_energy,
        "should_continue": should_continue,
        "planner_intent": planner.intent,
        "context_targets": planner.context_targets,
    }


def _chat_completion(system_prompt: str, user_prompt: str, temperature: float = 0.2) -> str:
    response = client.chat.completions.create(
        model=settings.chat_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
    )
    content = response.choices[0].message.content
    if not content:
        raise ValueError("Empty model response")
    return content.strip()


def _planner_fallback(user_message: str, session: dict) -> PlannerDecision:
    normalized = (user_message or "").strip().lower()
    if normalized in {"", "hi", "hello", "hey", "good morning", "good afternoon"}:
        return PlannerDecision.model_validate(
            {
                "intent": "greeting",
                "current_topic": "introduction",
                "context_targets": ["resume.summary"],
                "conversation_energy": "low",
                "recommended_section": {"id": "experience", "label": "Experience"},
                "should_follow_up": True,
                "should_continue": True,
            }
        )

    return PlannerDecision.model_validate(
        {
            "intent": "general_discussion",
            "current_topic": session.get("current_topic") or "experience",
            "context_targets": ["experience.full_stack"],
            "conversation_energy": session.get("conversation_energy", "low"),
            "recommended_section": {"id": "experience", "label": "Experience"},
            "should_follow_up": True,
            "should_continue": True,
        }
    )


def plan_conversation(user_message: str, session: dict) -> PlannerDecision:
    history = recent_history_window(session)
    planner_prompt = f"""
User message:
{user_message or "[conversation start]"}

Session state:
{json.dumps({
    "has_started": session.get("has_started"),
    "current_topic": session.get("current_topic"),
    "covered_topics": session.get("covered_topics", []),
    "recent_topics_window": session.get("recent_topics_window", []),
    "follow_up_depth": session.get("follow_up_depth", 0),
    "last_recommended_section": session.get("last_recommended_section"),
    "last_intent": session.get("last_intent"),
    "conversation_energy": session.get("conversation_energy", "low"),
    "recent_project_mentions": session.get("recent_project_mentions", []),
}, ensure_ascii=True)}

Recent history:
{json.dumps(history, ensure_ascii=True)}

Valid target examples:
- resume.summary
- experience.full_stack
- skills.backend
- skills.frontend
- skills.ai_systems
- projects
- projects.beyond_sight
- projects.recruiter_guide
- projects.accessible_weather
- projects.dynamic_pricing
- visa.status
- compensation.range
- education.certifications
"""
    try:
        raw = _chat_completion(PLANNER_SYSTEM_PROMPT, planner_prompt, temperature=0.1)
        return PlannerDecision.model_validate(_normalize_planner_payload(_extract_json(raw)))
    except Exception as exc:
        print("❌ Planner error:", exc)
        return _planner_fallback(user_message, session)


def _response_fallback(
    user_message: str, planner: PlannerDecision, context_slices: List[KnowledgeSlice]
) -> StructuredTurn:
    if planner.intent == "greeting":
        return StructuredTurn.model_validate(
            {
                "reply": (
                    "Hey - thanks for checking out my portfolio.\n\n"
                    "This is Durgasantosh. Feel free to ask me about my experience, projects, or role fit."
                ),
                "follow_up": None,
                "recommended_section": None,
                "current_topic": "introduction",
                "conversation_energy": "low",
                "should_continue": True,
                "planner_intent": planner.intent,
                "context_targets": [],
            }
        )

    if planner.current_topic == "projects" or any(target.startswith("projects") for target in planner.context_targets):
        strongest = [slice_ for slice_ in context_slices if slice_.id.startswith("projects.")][:2]
        if not strongest:
            return StructuredTurn.model_validate(
                {
                    "reply": FALLBACK,
                    "follow_up": None,
                    "recommended_section": planner.recommended_section.model_dump() if planner.recommended_section else None,
                    "current_topic": planner.current_topic,
                    "conversation_energy": planner.conversation_energy,
                    "should_continue": False,
                    "planner_intent": planner.intent,
                    "context_targets": planner.context_targets,
                }
            )
        content = " ".join(slice_.content for slice_ in strongest)
        return StructuredTurn.model_validate(
            {
                "reply": content,
                "follow_up": "Do you want me to go deeper into the AI side, the backend architecture, or the measurable impact?",
                "recommended_section": planner.recommended_section.model_dump() if planner.recommended_section else None,
                "current_topic": planner.current_topic,
                "conversation_energy": planner.conversation_energy,
                "should_continue": planner.should_continue,
                "planner_intent": planner.intent,
                "context_targets": planner.context_targets,
            }
        )

    return StructuredTurn.model_validate(
        {
            "reply": FALLBACK,
            "follow_up": None,
            "recommended_section": planner.recommended_section.model_dump() if planner.recommended_section else None,
            "current_topic": planner.current_topic,
            "conversation_energy": planner.conversation_energy,
            "should_continue": False,
            "planner_intent": planner.intent,
            "context_targets": planner.context_targets,
        }
    )


def _maybe_answer_recruiter_fact_question(user_message: str, session: dict) -> Optional[StructuredTurn]:
    normalized = (user_message or "").strip().lower()
    if not normalized:
        return None

    history = recent_history_window(session, max_items=6)
    history_text = " ".join(item.get("content", "").lower() for item in history)
    combined_text = f"{normalized} {history_text}"

    if any(
        phrase in normalized
        for phrase in {
            "pick one",
            "pick 1",
            "which suits the best",
            "which suit the best",
            "which suites the best",
            "which one",
        }
    ):
        if RESUME_LOCATION_CITY.lower() in combined_text:
            return StructuredTurn.model_validate(
                {
                    "reply": (
                        f"{RESUME_LOCATION_CITY} would probably be the best fit because I'm already based in {RESUME_LOCATION}. "
                        "That makes the transition simpler, and I'm still open to relocation if the role is stronger elsewhere."
                    ),
                    "follow_up": "If the team is centered in another office, I can still be flexible on location.",
                    "recommended_section": None,
                    "current_topic": "location",
                    "conversation_energy": "low",
                    "should_continue": True,
                    "planner_intent": "location_preference",
                    "context_targets": [],
                }
            )

    if any(phrase in normalized for phrase in {"where are you located", "where r u located", "where are u located", "where are you based", "where r u based", "where are u based"}):
        return StructuredTurn.model_validate(
            {
                "reply": f"I'm currently based in {RESUME_LOCATION}. I'm also open to relocation for the right opportunity.",
                "follow_up": "If the role is centered elsewhere, I can talk through relocation as well.",
                "recommended_section": None,
                "current_topic": "location",
                "conversation_energy": "low",
                "should_continue": True,
                "planner_intent": "location_question",
                "context_targets": [],
            }
        )

    if "relocat" in normalized or "move" in normalized:
        return StructuredTurn.model_validate(
            {
                "reply": "Yes — I'm open to relocation for the right opportunity.",
                "follow_up": "If you have a target office or region in mind, I can speak to that directly.",
                "recommended_section": None,
                "current_topic": "location",
                "conversation_energy": "low",
                "should_continue": True,
                "planner_intent": "relocation_question",
                "context_targets": [],
            }
        )

    if any(phrase in normalized for phrase in {"compensation", "salary", "expected range", "pay range"}):
        return StructuredTurn.model_validate(
            {
                "reply": "My expected base range is $85k-$125k, depending on the role and location.",
                "follow_up": "If you want, I can also talk through the kinds of responsibilities and stack I’m targeting.",
                "recommended_section": None,
                "current_topic": "compensation",
                "conversation_energy": "low",
                "should_continue": True,
                "planner_intent": "compensation_question",
                "context_targets": [],
            }
        )

    if any(phrase in normalized for phrase in {"visa", "sponsorship", "work authorization", "authorized to work"}):
        return StructuredTurn.model_validate(
            {
                "reply": "I'm legally authorized to work in the United States.",
                "follow_up": "If you want, I can also clarify relocation or role fit.",
                "recommended_section": None,
                "current_topic": "work_authorization",
                "conversation_energy": "low",
                "should_continue": True,
                "planner_intent": "work_authorization_question",
                "context_targets": [],
            }
        )

    return None


def generate_response(
    user_message: str,
    session: dict,
    planner: PlannerDecision,
    context_slices: List[KnowledgeSlice],
) -> StructuredTurn:
    if planner.intent == "greeting":
        return _response_fallback(user_message, planner, context_slices)
    recruiter_fact_turn = _maybe_answer_recruiter_fact_question(user_message, session)
    if recruiter_fact_turn is not None:
        return recruiter_fact_turn
    if planner.context_targets and not context_slices:
        return _response_fallback(user_message, planner, context_slices)

    history = recent_history_window(session)
    context_blob = "\n\n".join(
        f"[{slice_.id}] {slice_.content}" for slice_ in context_slices
    ) or "No retrieval context was needed for this turn."

    response_prompt = f"""
User message:
{user_message or "[conversation start]"}

Planner decision:
{planner.model_dump_json()}

Recent history:
{json.dumps(history, ensure_ascii=True)}

Retrieved context:
{context_blob}

Return JSON with:
- reply
- optional follow_up
- optional recommended_section
- current_topic
- conversation_energy
- should_continue

Keep the answer selective and naturally conversational.
"""

    try:
        raw = _chat_completion(RESPONSE_SYSTEM_PROMPT, response_prompt, temperature=0.35)
        turn = StructuredTurn.model_validate(
            _normalize_turn_payload(_extract_json(raw), planner)
        )
        if planner.intent == "greeting" and (
            not turn.follow_up
            or "how can i assist you today" in turn.reply.lower()
        ):
            return _response_fallback(user_message, planner, context_slices)
        return turn
    except Exception as exc:
        print("❌ Response generation error:", exc)
        return _response_fallback(user_message, planner, context_slices)


def orchestrate_turn(user_message: str, session: dict) -> StructuredTurn:
    if not settings.openai_api_key:
        print("❌ API key missing")
        raise RuntimeError("Missing API key")

    planner = plan_conversation(user_message, session)
    context_slices = resolve_context_targets(planner.context_targets)
    return generate_response(user_message, session, planner, context_slices)


def run_agent(user_message: str, memory):
    if not settings.openai_api_key:
        print("❌ API key missing")
        return FALLBACK

    if not RESUME_CONTEXT:
        print("❌ Resume context empty")
        return FALLBACK

    try:
        history_lines = "\n".join(
            f'{item.get("role", "user")}: {item.get("content", "")}'
            for item in (memory or [])[-6:]
        )
        response = client.chat.completions.create(
            model=settings.chat_model,
            messages=[
                {"role": "system", "content": RESPONSE_SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"""
Resume Information:
{RESUME_CONTEXT}

Conversation History:
{history_lines or "No prior conversation."}

Question:
{user_message}
""",
                },
            ],
            temperature=0.2,
        )
        reply = response.choices[0].message.content
        return reply.strip() if reply else FALLBACK
    except Exception as exc:
        print("❌ OpenRouter error:", exc)
        return FALLBACK


def answer_from_knowledge(query: str) -> str:
    return run_agent(query, [])
