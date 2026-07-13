from services.retrieval import retrieve_documents
from services.prompt import prompt
from services.llm import generate_answer
from services.sentiment_analysis import analyze_sentiment

def process_ticket(user_query):

  sentiment_result = analyze_sentiment(user_query)
  # sentiment_result is a dict like {"label": "POSITIVE", "score": 0.97}
  sentiment_label = sentiment_result.get("label")

  retrieval_result = retrieve_documents(user_query)
  documents = retrieval_result["documents"]

  final_prompt = prompt(
    query=user_query,
    retrieved_documents=documents,
    sentiment_pipeline=sentiment_label
  )

  answer = generate_answer(final_prompt)

  return{
    "answer": answer,
    "documents": documents,
    "sources": retrieval_result["metadatas"],
    "sentiment": sentiment_label
  }

