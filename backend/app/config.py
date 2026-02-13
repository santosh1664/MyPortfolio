import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

_env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(_env_path)


def _parse_origins(raw_value: str) -> tuple[str, ...]:
    origins = []
    for value in raw_value.split(","):
        origin = value.strip().rstrip("/")
        if origin:
            origins.append(origin)
    return tuple(origins)


@dataclass(frozen=True)
class Settings:
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_base_url: str = os.getenv("OPENAI_BASE_URL", "")
    openai_http_referer: str = os.getenv("OPENAI_HTTP_REFERER", "")
    openai_app_title: str = os.getenv("OPENAI_APP_TITLE", "Resume Chatbot")
    embedding_model: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    chat_model: str = os.getenv("OPENAI_CHAT_MODEL", "gpt-4o-mini")
    chroma_path: str = os.getenv("CHROMA_PATH", "backend/data/chroma")
    top_k: int = int(os.getenv("RAG_TOP_K", "4"))
    cors_allow_origins: tuple[str, ...] = _parse_origins(os.getenv("CORS_ALLOW_ORIGINS", ""))


settings = Settings()
