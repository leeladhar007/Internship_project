from chroma_db import collection

def retrieve_documents(query: str, n_results: int = 10):

    results = collection.query(
        query_texts=[query],
        n_results=n_results
    )

    return results
