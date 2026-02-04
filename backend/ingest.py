import glob
from pathlib import Path
from dotenv import load_dotenv
from app.vector_store import get_collection

load_dotenv()

# ✅ Always resolve paths relative to this file
BASE_DIR = Path(__file__).resolve().parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge"

CHUNK_SIZE = 600
CHUNK_OVERLAP = 100


def _chunk_text(text: str):
    chunks = []
    start = 0
    while start < len(text):
        end = start + CHUNK_SIZE
        chunks.append(text[start:end])
        start = end - CHUNK_OVERLAP
    return [chunk.strip() for chunk in chunks if chunk.strip()]


def main():
    collection = get_collection()

    # Clear existing data (safe for dev/portfolio)
    try:
        collection.delete(where={})
    except Exception:
        pass

    files = glob.glob(str(KNOWLEDGE_DIR / "*.md"))

    if not files:
        print(f"No markdown files found in {KNOWLEDGE_DIR}")
        return

    doc_ids = []
    docs = []
    metas = []

    for path in files:
        source = Path(path).stem
        with open(path, "r", encoding="utf-8") as handle:
            text = handle.read()

        for idx, chunk in enumerate(_chunk_text(text)):
            doc_ids.append(f"{source}-{idx}")
            docs.append(chunk)
            metas.append({"source": source})

    if docs:
        collection.add(
            documents=docs,
            ids=doc_ids,
            metadatas=metas,
        )
        print(f"Indexed {len(docs)} chunks from {len(files)} files.")
    else:
        print("No documents found to index.")


if __name__ == "__main__":
    main()
