import os
from openai import OpenAI
from .config import settings

client = OpenAI(
    api_key=settings.openai_api_key,
    base_url=settings.openai_base_url,
    default_headers={
        "HTTP-Referer": settings.openai_http_referer,
        "X-Title": settings.openai_app_title,
    },
)

def load_resume_text():
    base_path = os.path.join(os.path.dirname(__file__), "..", "knowledge")
    content = ""

    for filename in os.listdir(base_path):
        if filename.endswith(".md"):
            with open(os.path.join(base_path, filename), "r", encoding="utf-8") as f:
                content += f.read() + "\n\n"

    return content

RESUME_CONTEXT = load_resume_text()

SYSTEM_PROMPT = f"""
You are Roy, a recruiter-facing resume assistant.

Answer ONLY using the resume information below.
If the answer is not present, respond exactly:

"That information is not available in my resume. Please feel free to ask something else."

Resume Information:
{RESUME_CONTEXT}
"""

FALLBACK = "That information is not available in my resume. Please feel free to ask something else."

def answer_from_knowledge(query: str) -> str:
    return run_agent(query, [])

def run_agent(user_message: str, memory):
    if not settings.openai_api_key:
        return "API key not configured."

    try:
        response = client.chat.completions.create(
            model=settings.chat_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,
        )

        reply = response.choices[0].message.content.strip()
        return reply if reply else FALLBACK

    except Exception as exc:
        print("OpenRouter error:", exc)
        return FALLBACK