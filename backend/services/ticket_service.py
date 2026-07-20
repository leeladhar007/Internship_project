from services.retrieval import retrieve_documents
from services.prompt import prompt
from services.llm import generate_answer
from services.sentiment_analysis import analyze_sentiment


def process_chat_messages(user_message, history):

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

    return {
        "answer": answer,
        "sentiment": sentiment
    }