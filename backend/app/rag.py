import os
from openai import OpenAI
from .config import settings

client = OpenAI(api_key=settings.openai_api_key)

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

def answer_from_knowledge(query: str) -> str:
    return run_agent(query, [])

def run_agent(user_message: str, memory):
    if not settings.openai_api_key:
        return "OpenAI API key is not configured."

    try:
        response = client.chat.completions.create(
            model=settings.chat_model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.2,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:
        print(f"OpenAI request failed: {exc}")
        return "That information is not available in my resume. Please feel free to ask something else."