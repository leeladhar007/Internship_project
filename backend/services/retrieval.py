from chroma_db import collection

def retrieve_documents(user_query: str, n_results: int = 10):

    results = collection.query(
        query_texts=[user_query],
        n_results=n_results
    )

    return {
        "documents": results["documents"][0],
        "metadatas": results["metadatas"][0],
        "distances": results["distances"][0]
    }