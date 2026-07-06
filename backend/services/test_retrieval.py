from backend.services.retrieval import retrieve_documents
docs = retrieve_documents(
    "how to reset password"
)

print(docs)