import json
import re
import time
from typing import Dict, List, Optional
from openai import OpenAI
from .config import settings
from .vector_store import get_collection

_client_kwargs = {"api_key": settings.openai_api_key, "max_retries": 0}
if settings.openai_base_url:
    _client_kwargs["base_url"] = settings.openai_base_url
if settings.openai_http_referer or settings.openai_app_title:
    _client_kwargs["default_headers"] = {
        "HTTP-Referer": settings.openai_http_referer,
        "X-Title": settings.openai_app_title,
    }

client = OpenAI(**_client_kwargs)

SYSTEM_PROMPT = (
    "You are Roy, a recruiter-facing resume assistant. "
    "Use the provided tools to retrieve facts from the knowledge base. "
    "Always call at least one retrieval tool for non-greeting questions. "
    "Answer only using retrieved context. Do not guess or add new information. "
    "If the answer is not in the knowledge base, reply exactly: "
    "\"That information is not available in my resume. Please feel free to ask something else.\""
)

FALLBACK_MESSAGE = (
    "That information is not available in my resume. Please feel free to ask something else."
)
GENERIC_PROFILE_MESSAGE = (
    "I am a Software Engineer with 3+ years of full-stack experience in Java, Spring Boot, React, and AWS."
)
LLM_TIMEOUT_SECONDS = 4.0
MAX_MODEL_BUDGET_SECONDS = 3.5
_STOP_TOKENS = {
    "the",
    "and",
    "for",
    "with",
    "that",
    "this",
    "your",
    "you",
    "are",
    "what",
    "where",
    "when",
    "how",
    "why",
    "about",
    "from",
    "have",
    "has",
    "will",
    "would",
    "could",
    "should",
}


def _query_collection(query: str, source: Optional[str], top_k: int) -> List[Dict[str, str]]:
    collection = get_collection()
    where = {"source": source} if source else None
    results = collection.query(
        query_texts=[query],
        n_results=top_k,
        where=where,
    )
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    payload = []
    for doc, meta in zip(documents, metadatas):
        payload.append({"text": doc, "source": meta.get("source", "unknown")})
    return payload


def retrieve_resume(query: str) -> List[Dict[str, str]]:
    return _query_collection(query, "resume", settings.top_k)


def retrieve_projects(query: str) -> List[Dict[str, str]]:
    return _query_collection(query, "projects", settings.top_k)


def retrieve_experience(query: str) -> List[Dict[str, str]]:
    return _query_collection(query, "experience", settings.top_k)


def retrieve_skills(query: str) -> List[Dict[str, str]]:
    return _query_collection(query, "skills", settings.top_k)


def retrieve_visa_info(query: str) -> List[Dict[str, str]]:
    return _query_collection(query, "visa", settings.top_k)


def retrieve_compensation(query: str) -> List[Dict[str, str]]:
    return _query_collection(query, "compensation", settings.top_k)


def build_tools() -> List[Dict[str, object]]:
    return [
        {
            "type": "function",
            "function": {
                "name": "retrieve_resume",
                "description": "Retrieve general resume details such as summary, education, or contact.",
                "parameters": {
                    "type": "object",
                    "properties": {"query": {"type": "string"}},
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "retrieve_projects",
                "description": "Retrieve project details and outcomes.",
                "parameters": {
                    "type": "object",
                    "properties": {"query": {"type": "string"}},
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "retrieve_experience",
                "description": "Retrieve professional experience details and responsibilities.",
                "parameters": {
                    "type": "object",
                    "properties": {"query": {"type": "string"}},
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "retrieve_skills",
                "description": "Retrieve skills, tools, and technologies.",
                "parameters": {
                    "type": "object",
                    "properties": {"query": {"type": "string"}},
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "retrieve_visa_info",
                "description": "Retrieve visa, relocation, and eligibility details.",
                "parameters": {
                    "type": "object",
                    "properties": {"query": {"type": "string"}},
                    "required": ["query"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "retrieve_compensation",
                "description": "Retrieve compensation and salary expectations.",
                "parameters": {
                    "type": "object",
                    "properties": {"query": {"type": "string"}},
                    "required": ["query"],
                },
            },
        },
    ]


def _call_tool(name: str, args: Dict[str, str]) -> List[Dict[str, str]]:
    query = args.get("query", "")
    if name == "retrieve_resume":
        return retrieve_resume(query)
    if name == "retrieve_projects":
        return retrieve_projects(query)
    if name == "retrieve_experience":
        return retrieve_experience(query)
    if name == "retrieve_skills":
        return retrieve_skills(query)
    if name == "retrieve_visa_info":
        return retrieve_visa_info(query)
    if name == "retrieve_compensation":
        return retrieve_compensation(query)
    return []


def _format_context(chunks: List[Dict[str, str]]) -> str:
    if not chunks:
        return ""
    lines = []
    for item in chunks:
        lines.append(f"[{item['source']}] {item['text']}")
    return "\n".join(lines)


def _route_sources(query: str) -> List[str]:
    q = query.lower()
    sources = []
    if any(token in q for token in ["project", "beyond sight", "weather", "shelter"]):
        sources.append("projects")
    if any(token in q for token in ["experience", "work", "role", "citi", "zensar"]):
        sources.append("experience")
    if any(token in q for token in ["skill", "technology", "tech", "stack", "frontend", "backend", "cloud"]):
        sources.append("skills")
    if any(token in q for token in ["visa", "opt", "stem", "sponsorship", "relocation"]):
        sources.append("visa")
    if any(
        token in q
        for token in [
            "salary",
            "compensation",
            "pay",
            "package",
            "ctc",
            "salary range",
            "compensation range",
            "comp range",
        ]
    ):
        sources.append("compensation")
    if any(token in q for token in ["summary", "about", "yourself", "background", "education", "certification", "contact"]):
        sources.append("resume")
    return sources or ["resume", "experience"]


def _retrieve_context(query: str) -> str:
    chunks: List[Dict[str, str]] = []
    for source in _route_sources(query):
        chunks.extend(_query_collection(query, source, settings.top_k))
    return _format_context(chunks)


def _retrieve_chunks(query: str) -> List[Dict[str, str]]:
    chunks: List[Dict[str, str]] = []
    for source in _route_sources(query):
        chunks.extend(_query_collection(query, source, settings.top_k))
    return chunks


def _extract_candidates(text: str) -> List[str]:
    candidates: List[str] = []
    for raw_line in text.splitlines():
        line = raw_line.strip().lstrip("- ").strip()
        if not line or line.startswith("#"):
            continue
        for part in re.split(r"(?<=[.!?])\s+", line):
            sentence = part.strip()
            if (
                sentence
                and len(sentence) >= 25
                and len(sentence.split()) >= 5
                and re.search(r"[a-zA-Z]", sentence)
            ):
                candidates.append(sentence)
    return candidates


def _query_tokens(query: str) -> List[str]:
    tokens = re.findall(r"[a-z0-9]+", query.lower())
    return [token for token in tokens if len(token) > 2 and token not in _STOP_TOKENS]


def _answer_from_knowledge(query: str) -> str:
    chunks = _retrieve_chunks(query)
    if not chunks:
        return FALLBACK_MESSAGE

    tokens = set(_query_tokens(query))
    scored: List[tuple[int, str]] = []
    for item in chunks:
        for candidate in _extract_candidates(item["text"]):
            lowered = candidate.lower()
            score = sum(1 for token in tokens if token in lowered)
            if score > 0:
                scored.append((score, candidate))

    answers: List[str] = []
    for _, sentence in sorted(scored, key=lambda x: x[0], reverse=True):
        if sentence not in answers:
            answers.append(sentence)
        if len(answers) == 2:
            break

    if answers:
        return " ".join(answers)

    # No direct token overlap: still return the most semantically similar chunk.
    first_chunk = chunks[0].get("text", "").strip()
    if not first_chunk:
        return FALLBACK_MESSAGE
    first_sentences = _extract_candidates(first_chunk)
    if first_sentences:
        return " ".join(first_sentences[:2])

    resume_chunks = _query_collection("resume summary background", "resume", 1)
    if resume_chunks:
        resume_text = resume_chunks[0].get("text", "")
        resume_sentences = _extract_candidates(resume_text)
        if resume_sentences:
            return resume_sentences[0]
    return GENERIC_PROFILE_MESSAGE


def _remaining_budget_seconds(deadline: float) -> float:
    return deadline - time.monotonic()


def answer_from_knowledge(query: str) -> str:
    return _answer_from_knowledge(query)


def run_agent(user_message: str, memory: List[Dict[str, str]]) -> str:
    if not settings.openai_api_key:
        return _answer_from_knowledge(user_message)

    deadline = time.monotonic() + MAX_MODEL_BUDGET_SECONDS

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.extend(memory)
    messages.append({"role": "user", "content": user_message})

    tools = build_tools()

    for _ in range(2):
        remaining = _remaining_budget_seconds(deadline)
        if remaining <= 0:
            return _answer_from_knowledge(user_message)
        try:
            response = client.chat.completions.create(
                model=settings.chat_model,
                messages=messages,
                tools=tools,
                tool_choice="auto",
                temperature=0.2,
                timeout=max(0.5, min(LLM_TIMEOUT_SECONDS, remaining)),
            )
        except Exception as exc:
            print(f"LLM request failed: {exc}")
            return _answer_from_knowledge(user_message)
        message = response.choices[0].message
        if message.tool_calls:
            tool_calls_payload = [tool_call.model_dump() for tool_call in message.tool_calls]
            messages.append(
                {
                    "role": "assistant",
                    "content": message.content or "",
                    "tool_calls": tool_calls_payload,
                }
            )
            for tool_call in message.tool_calls:
                name = tool_call.function.name
                args = json.loads(tool_call.function.arguments or "{}")
                results = _call_tool(name, args)
                context = _format_context(results)
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tool_call.id,
                        "name": name,
                        "content": context or "",
                    }
                )
            continue

        content = (message.content or "").strip()
        if content:
            if content == FALLBACK_MESSAGE:
                return _answer_from_knowledge(user_message)
            return content

        # If the model didn't call tools, retrieve context directly and retry once.
        context = _retrieve_context(user_message)
        if not context:
            return FALLBACK_MESSAGE
        remaining = _remaining_budget_seconds(deadline)
        if remaining <= 0:
            return _answer_from_knowledge(user_message)
        try:
            followup = client.chat.completions.create(
                model=settings.chat_model,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "system", "content": f"Context:\\n{context}"},
                    {"role": "user", "content": user_message},
                ],
                temperature=0.2,
                timeout=max(0.5, min(LLM_TIMEOUT_SECONDS, remaining)),
            )
        except Exception as exc:
            print(f"LLM fallback request failed: {exc}")
            return _answer_from_knowledge(user_message)
        follow_content = (followup.choices[0].message.content or "").strip()
        if follow_content == FALLBACK_MESSAGE:
            return _answer_from_knowledge(user_message)
        return follow_content or _answer_from_knowledge(user_message)

    return _answer_from_knowledge(user_message)
