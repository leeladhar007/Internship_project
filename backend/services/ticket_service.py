from services.retrieval import retrieve_documents
from services.prompt import prompt
from services.llm import generate_answer

def process_ticket(user_query):
  
  retrieval_result = retrieve_documents(user_query)
  documents = retrieval_result["documents"]
  final_prompt = prompt(
    query=user_query,
    retrieved_documents=documents

  )

  answer = generate_answer(final_prompt)

  return{
    
    "answer":answer,
    "documents":documents,
    "sources":retrieval_result["metadatas"]
  }

