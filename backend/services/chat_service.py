import json

from services.retrieval import retrieve_documents
from services.prompt import prompt
from services.llm import generate_answer
from services.sentiment_analysis import analyze_sentiment
from sqlalchemy.orm import Session
from datetime import datetime
from models import chatsession


def extract_llm_json(raw_output: str) -> dict:
    """
    The LLM is prompted to return a JSON object like:
    {"session_id": ..., "answer": ..., "related_documents": [...],
     "next_action": ..., "sentiment": ..., "intent": ...}
    but sometimes wraps it in ```json ... ``` fences, and can occasionally
    fail to return valid JSON at all. Handle both.
    """
    cleaned = raw_output.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.split("```")[1]
        if cleaned.startswith("json"):
            cleaned = cleaned[4:]
        cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)
    except (json.JSONDecodeError, TypeError):
        return {}


def process_chat_messages(
    session_id: int,
    user_message: str,
    history,
    db: Session
):

    conversation = ""

    for chat in history:
        conversation += f"{chat.sender}: {chat.message}\n"

    sentiment = analyze_sentiment(user_message)["label"]

    if conversation:
        search_query = conversation + "\nCustomer: " + user_message
    else:
        search_query = user_message

    retrieval_result = retrieve_documents(search_query)

    final_prompt = prompt(
        query=user_message,
        retrieved_documents=retrieval_result["documents"],
        sentiment_pipeline=sentiment,
        conversation_history=conversation
    )

    raw_output = generate_answer(final_prompt)
    parsed = extract_llm_json(raw_output)

    if parsed:
        # LLM returned valid JSON - use its fields, falling back to our
        # own sentiment analysis (parsed.get("sentiment") is the LLM's own
        # guess, which is usually less reliable than the dedicated model).
        answer = parsed.get("answer", raw_output)
        intent = parsed.get("intent", "CONTINUE_CHAT")
    else:
        # LLM didn't return parseable JSON this time - show the raw text
        # rather than crashing, and default to CONTINUE_CHAT rather than
        # guessing the conversation should end.
        answer = raw_output
        intent = "CONTINUE_CHAT"

    return {
        "answer": answer,
        "sentiment": sentiment,
        "intent": intent
    }