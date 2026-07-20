from services.retrieval import retrieve_documents
from services.prompt import prompt
from services.llm import generate_answer
from services.sentiment_analysis import analyze_sentiment
from sqlalchemy.orm import Session
from datetime import datetime
from models import chatsession


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

    answer = generate_answer(final_prompt)
    # raw_output = generate_answer(final_prompt)
    # print("=== RAW GEMINI OUTPUT ===")
    # print(repr(raw_output))
    # print("=========================")

    # print("=== RETRIEVED DOCS ===")
    # print(retrieval_result["documents"])
    # print("=======================")
    
    intent = "CONTINUE_CHAT"
    if "Intent: END_CHAT" in answer:
        intent = "END_CHAT"
        answer = answer.replace("Intent: END_CHAT", "")
        
    elif "Intent: CONTINUE_CHAT" in answer:
        answer = answer.replace("Intent: CONTINUE_CHAT", "")

    return {
        "answer": answer,
        "sentiment": sentiment,
        "date&time": datetime,
        "intent": intent
    }


