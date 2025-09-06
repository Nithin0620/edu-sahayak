from fastapi import FastAPI, Request, Query
from fastapi.middleware.cors import CORSMiddleware
from yt_search import get_top_videos
from chapter_upserter import upsert_chapter_text
from chat_ncert import run_chatbot
from chat_title import chat_title
from flashcard_generator import generate_flashcards_random
from quiz_generate import generate_quiz
import uvicorn
import os
from typing import Optional

# Set HF transformers/cache environment
os.environ["TRANSFORMERS_CACHE"] = "./hf_cache"
os.environ["HF_HOME"] = "./hf_home"

class ChatRequest:
    def __init__(self, messages, user_input, cid, profile=None):
        self.messages = messages
        self.user_input = user_input
        self.cid = cid
        self.profile = profile

class QuizRequest:
    def __init__(self, cid: str, count: int = 5, profile: Optional[dict] = None):
        self.cid = cid
        self.count = count
        self.profile = profile

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],          # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],          # Allow any headers
)

@app.get("/yt-search")
async def yt_search_endpoint(query: str = Query(...)):
    """Search YouTube for top videos"""
    return {"results": get_top_videos(query)}

@app.get("/upsert-chapter")
def upsert_chapter_endpoint(
    class_num: int = Query(..., ge=1, le=12),
    subject: str = Query(...),
    chapter: str = Query(...)
):
    """Upsert chapter text for a given class and subject"""
    return upsert_chapter_text(class_num, subject, chapter)

@app.post("/chat-ncert")
async def chat_ncert_endpoint(request: Request):
    """
    Chat NCERT POST endpoint.
    Parses JSON into ChatRequest class and calls chatbot.
    """
    payload_json = await request.json()
    payload = ChatRequest(
        messages=payload_json.get("messages"),
        user_input=payload_json.get("user_input"),
        cid=payload_json.get("cid"),
        profile=payload_json.get("profile")
    )
    response, docs = run_chatbot(
        payload.messages,
        payload.user_input,
        payload.cid,
        profile=payload.profile
    )
    return {"response": response, "docs": docs}

@app.get("/chat-title")
def chat_title_endpoint(user_input: str = Query(...), llm_response: str = Query(...)):
    """Generate a chat title based on user input and LLM response"""
    return {"title": chat_title(user_input=user_input, llm_response=llm_response)}

@app.get("/generate-flashcards")
def generate_flashcards_endpoint(cid: str = Query(...), count: int = Query(..., ge=1, le=50)):
    """Generate random flashcards for a given CID"""
    flashcards = generate_flashcards_random(cid, num_flashcards=count)
    return {"flashcards": flashcards}

@app.post("/generate-quiz")
async def generate_quiz_endpoint(request: Request):
    """
    Generate a quiz for a given CID with optional profile and count.
    HF Spaces-safe: parses JSON manually, avoids Pydantic.
    """
    payload_json = await request.json()
    payload = QuizRequest(
        cid=payload_json.get("cid"),
        count=payload_json.get("count", 5),
        profile=payload_json.get("profile")
    )
    quiz = generate_quiz(
        cid=payload.cid,
        profile=payload.profile,
        num_questions=payload.count
    )
    return {
        "cid": payload.cid,
        "requested": payload.count,
        "quiz": quiz
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
