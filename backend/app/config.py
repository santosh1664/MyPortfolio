import os
from dataclasses import dataclass
from pathlib import Path
from typing import Tuple

from dotenv import load_dotenv

# Load .env file locally (Render ignores this and uses its own env vars)
env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(env_path)


def _parse_origins(raw_value: str) -> Tuple[str, ...]:
    if not raw_value:
        return ()
    return tuple(
        origin.strip().rstrip("/")
        for origin in raw_value.split(",")
        if origin.strip()
    )


@dataclass(frozen=True)
class Settings:
    # ---- OpenRouter / LLM ----
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_base_url: str = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    openai_http_referer: str = os.getenv("OPENAI_HTTP_REFERER", "")
    openai_app_title: str = os.getenv("OPENAI_APP_TITLE", "Resume Chatbot")
    chat_model: str = os.getenv("OPENAI_CHAT_MODEL", "openai/gpt-4o-mini")

    # ---- RAG / Optional (safe if unused) ----
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    chroma_path: str = os.getenv("CHROMA_PATH", "backend/data/chroma")
    top_k: int = int(os.getenv("RAG_TOP_K", "4"))

    # ---- CORS ----
    cors_allow_origins: Tuple[str, ...] = _parse_origins(
        os.getenv("CORS_ALLOW_ORIGINS", "")
    )


settings = Settings()