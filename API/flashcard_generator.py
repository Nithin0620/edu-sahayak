import random
import json
import os
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from qdrant_utils import client, COLLECTION_NAME
from langchain_groq import ChatGroq
from tqdm import tqdm

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="groq/compound")

FLASHCARD_SINGLE_PROMPT = """
You are an NCERT-based teaching assistant.
Given the following NCERT chunk, create exactly ONE flashcard in JSON format.
Otherwise, output strictly:
{{
  "Question": "...",
  "Answer": ["point 1", "point 2", ...]
}}
where each point is only upto 8 words which is coherent enough to work as study material.
Chunk:
{text}
"""

def fetch_all_docs(cid):
    docs = []
    offset = None
    while True:
        points, next_offset = client.scroll(
            collection_name=COLLECTION_NAME,
            scroll_filter={"must": [{"key": "cid", "match": {"value": cid}}]},
            limit=100,
            offset=offset
        )
        if not points:
            break
        docs.extend([p.payload["text"] for p in points])
        if next_offset is None:
            break
        offset = next_offset
    return docs

def _is_promising_chunk(text):
    """Quick filter to skip useless chunks before LLM call."""
    words = text.split()
    if len(words) < 50:  # too short
        return False
    if not any(char.isdigit() for char in text):  # no numbers/dates
        return False
    return True

def _generate_single_flashcard(chunk, index):
    """Worker function to generate one flashcard from a single chunk."""
    try:
        prompt = FLASHCARD_SINGLE_PROMPT.format(text=chunk)
        raw = llm.invoke(prompt).content.strip()
        card = json.loads(raw)
    except json.JSONDecodeError:
        return None
    except Exception as e:
        # Handle rate limit gracefully
        if "rate_limit_exceeded" in str(e):
            time.sleep(3)  # backoff
        return None

    if card.get("Question") and card.get("Answer") and isinstance(card["Answer"], list):
        return card
    return None

def generate_flashcards_random(cid, num_flashcards=10, max_workers=3):
    docs = fetch_all_docs(cid)
    if not docs:
        print("[Main] No documents found for CID:", cid)
        return []

    flashcards = []
    tried_chunks = set()
    null_count = 0
    total_calls = 0

    print(f"[Main] Starting flashcard generation for CID={cid} | Requested={num_flashcards}")

    with tqdm(total=num_flashcards, desc="Generating Flashcards", unit="card") as pbar:
        while len(flashcards) < num_flashcards and len(tried_chunks) < len(docs):
            needed = num_flashcards - len(flashcards)

            available_idxs = [i for i in range(len(docs)) if i not in tried_chunks and _is_promising_chunk(docs[i])]
            if not available_idxs:
                print("[Main] No more promising chunks left.")
                break

            selected_idxs = random.sample(available_idxs, min(len(available_idxs), needed))

            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                futures = {executor.submit(_generate_single_flashcard, docs[idx], idx): idx for idx in selected_idxs}

                for future in as_completed(futures):
                    idx = futures[future]
                    tried_chunks.add(idx)
                    total_calls += 1

                    try:
                        card = future.result()
                        if card:
                            flashcards.append(card)
                            pbar.update(1)
                        else:
                            null_count += 1
                    except Exception as e:
                        null_count += 1
                        print(f"[Main] ❌ Error processing chunk #{idx}: {e}")

                    pbar.set_postfix({
                        "Valid": len(flashcards),
                        "Null": null_count,
                        "Calls": total_calls
                    })

    print(f"[Main] Finished generating {len(flashcards)} flashcards.")
    print(f"[Main] Total API calls: {total_calls} | Null results: {null_count}")
    return flashcards
