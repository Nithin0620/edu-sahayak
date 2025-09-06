import random
import json
import os
import re
import time
from typing import Optional, List, Dict

from qdrant_utils import client, COLLECTION_NAME
from langchain_groq import ChatGroq

# ===============================
# LLM Config
# ===============================
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
llm = ChatGroq(groq_api_key=GROQ_API_KEY, model_name="groq/compound")


def format_profile_context(profile: Optional[dict]) -> str:
    """
    Small human-readable profile block to condition the quiz style.
    """
    if not profile:
        return ""

    eq_score = profile.get("eq_score", "N/A")
    eq_level = profile.get("eq_level", "Unknown")
    learning = profile.get("learning_style", {})

    eq_level_l = str(eq_level).lower() if isinstance(eq_level, str) else "unknown"
    if eq_level_l == "low":
        eq_support_msg = "User requires more emotional support and encouragement. Use encouraging, simple, low-friction wording."
    elif eq_level_l == "moderate":
        eq_support_msg = "User requires some emotional support. Use a balanced tone."
    elif eq_level_l == "high":
        eq_support_msg = "User requires minimal emotional support. Use direct and confident tone."
    else:
        eq_support_msg = "EQ support needs unknown."

    learning_desc = []
    for key, value in learning.items():
        learning_desc.append(f"{key.capitalize()}: {value}")

    return (
        f"User Profile:\n"
        f"- EQ Score: {eq_score} ({eq_level}) → {eq_support_msg}\n"
        f"- Learning Style:\n  " + "\n  ".join(learning_desc) + "\n\n"
    )


# ===============================
# Fetch All Docs from Qdrant
# ===============================
def fetch_all_docs(cid: str) -> List[str]:
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


def _safe_json_parse(raw: str) -> Optional[List[dict]]:
    """
    Try json.loads(raw). If that fails, attempt to extract the first [...] substring.
    Returns parsed list or None.
    """
    try:
        parsed = json.loads(raw)
        if isinstance(parsed, list):
            return parsed
        return None
    except json.JSONDecodeError:
        # try to find JSON array in the text
        m = re.search(r"(\[.*\])", raw, flags=re.DOTALL)
        if not m:
            return None
        substr = m.group(1)
        try:
            parsed = json.loads(substr)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            return None
    return None


def _normalize_question(q: dict) -> Optional[dict]:
    """
    Validate and normalize a single question dict to the canonical schema:
    { "question": str, "options": [4 strings], "answer": ["a"/"b"/"c"/"d"] }
    Returns normalized dict or None if invalid.
    """
    if not isinstance(q, dict):
        return None
    question = q.get("question") or q.get("q") or q.get("prompt")
    options = q.get("options") or q.get("choices") or q.get("opts")
    answer = q.get("answer") or q.get("correct_answer") or q.get("correct")

    if not isinstance(question, str):
        return None
    if not isinstance(options, list) or len(options) != 4:
        return None

    # Normalize answer to single letter a/b/c/d
    letter = None
    if isinstance(answer, list) and len(answer) >= 1:
        raw_ans = answer[0]
    else:
        raw_ans = answer

    if isinstance(raw_ans, str):
        raw_ans_strip = raw_ans.strip().lower()
        # if it's a letter already
        if raw_ans_strip in ("a", "b", "c", "d"):
            letter = raw_ans_strip
        else:
            # if it equals one of the option texts, map to index
            for idx, opt in enumerate(options):
                if isinstance(opt, str) and opt.strip().lower() == raw_ans_strip:
                    letter = "abcd"[idx]
                    break
            # if it's like "Option A" or "A." etc.
            m = re.search(r"\b([abcd])\b", raw_ans_strip)
            if letter is None and m:
                letter = m.group(1)
    # final safety: if letter None, invalid
    if letter is None:
        return None

    return {
        "question": question.strip(),
        "options": [str(opt).strip() for opt in options],
        "answer": [letter]
    }


def generate_quiz(cid: str, profile: Optional[dict] = None, num_questions: int = 5,
                  num_chunks: int = 8, max_chunk_chars: int = 800, retries: int = 1) -> List[dict]:
    """
    Generate a quiz for the given CID, personalized by profile (optional).
    Returns a list of validated questions (may be fewer than requested if LLM fails).
    """
    docs = fetch_all_docs(cid)
    if not docs:
        print("[Quiz] No docs found for CID:", cid)
        return []

    # pick up to num_chunks unique chunks (if not enough, use all)
    pick_count = min(len(docs), num_chunks)
    selected_chunks = random.sample(docs, pick_count)

    # truncate chunks to avoid huge prompts
    truncated = [c[:max_chunk_chars] for c in selected_chunks]
    combined_text = "\n\n".join(f"Chunk {i+1}:\n{txt}" for i, txt in enumerate(truncated))

    profile_context = format_profile_context(profile)

    attempt = 0
    valid_quiz: List[dict] = []
    while attempt <= retries and len(valid_quiz) < num_questions:
        attempt += 1
        # build prompt - use double braces where we want literal JSON in the example
        final_prompt = f"""
You are an NCERT-based quiz generator.
{profile_context}
I will give you {len(truncated)} chunks of NCERT text. From these chunks, create EXACTLY {num_questions} multiple-choice questions (MCQs) in JSON format.
Rules:
- Each question must have 4 options.
- Only ONE correct answer per question.
- Use simple, clear language appropriate for school students.
- Keep answers factual, not opinion-based.
- The correct answer should be the letter "a", "b", "c", or "d" corresponding to the options list order.
Output format (strict JSON array, no extra text). Example:
[
  {{
    "question": "question text",
    "options": ["option a", "option b", "option c", "option d"],
    "answer": ["a"]
  }},
  ...
]
Chunks:
{combined_text}
Return only the JSON array. Do not include any explanatory text.
"""
        try:
            raw = llm.invoke(final_prompt).content.strip()
        except Exception as e:
            print(f"[Quiz] Model call error (attempt {attempt}): {e}")
            time.sleep(1)  # brief backoff then retry
            continue

        parsed = _safe_json_parse(raw)
        if not parsed:
            print(f"[Quiz] Invalid JSON on attempt {attempt}, trying to salvage...")
            attempt_backoff = 1 + attempt
            time.sleep(attempt_backoff)
            continue

        # Validate & normalize each question
        normalized = []
        for item in parsed:
            nq = _normalize_question(item)
            if nq:
                normalized.append(nq)

        # if normalized length is < requested, we may retry (up to retries)
        if len(normalized) >= num_questions:
            valid_quiz = normalized[:num_questions]
            break
        else:
            # keep valid ones, but allow retry for missing count
            valid_quiz = normalized
            if attempt <= retries:
                print(f"[Quiz] Only {len(normalized)} valid questions returned, retrying (attempt {attempt}/{retries})...")
                time.sleep(1.5)
                continue
            else:
                break

    print(f"[Quiz] Returning {len(valid_quiz)} validated questions (requested {num_questions}).")
    return valid_quiz
