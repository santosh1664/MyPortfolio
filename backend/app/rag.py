import os
from pathlib import Path
from openai import OpenAI
from .config import settings

# -----------------------------
# OpenAI / OpenRouter Client
# -----------------------------
client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url,
    default_headers={
        "HTTP-Referer": settings.openai_http_referer,
        "X-Title": settings.openai_app_title,
    },
)

# -----------------------------
# Load Resume Knowledge Files
# -----------------------------
def load_resume_text():
    base_path = Path(__file__).resolve().parent.parent / "knowledge"

    if not base_path.exists():
        print("❌ Knowledge folder not found:", base_path)
        return ""

    content = ""

    for file in base_path.glob("*.md"):
        try:
            content += file.read_text(encoding="utf-8") + "\n\n"
        except Exception as e:
            print(f"Error reading {file.name}:", e)

    print("✅ Resume loaded. Length:", len(content))
    return content.strip()


RESUME_CONTEXT = load_resume_text()

# -----------------------------
# Prompts
# -----------------------------
SYSTEM_PROMPT = """
You are Roy, a recruiter-facing resume assistant.

Answer ONLY from the resume information provided.
If the answer is not present, respond exactly:

"That information is not available in my resume. Please feel free to ask something else."
"""

FALLBACK = "That information is not available in my resume. Please feel free to ask something else."

# -----------------------------
# Public Functions
# -----------------------------
def answer_from_knowledge(query: str) -> str:
    return run_agent(query, [])


def run_agent(user_message: str, memory):
    if not settings.openai_api_key:
        print("❌ API key missing")
        return FALLBACK

    if not RESUME_CONTEXT:
        print("❌ Resume context empty")
        return FALLBACK

    try:
        response = client.chat.completions.create(
            model=settings.chat_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"""
Resume Information:
{RESUME_CONTEXT}

Question:
{user_message}
""",
                },
            ],
            temperature=0.2,
        )

        reply = response.choices[0].message.content
        if not reply:
            return FALLBACK

        reply = reply.strip()
        return reply if reply else FALLBACK

    except Exception as exc:
        print("❌ OpenRouter error:", exc)
        return FALLBACK