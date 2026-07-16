#this file is made for embedding new files into db
from chroma_db import collection
import uuid

def add_documents(documents, source):
    
    if isinstance(documents, str):
        documents = [documents]

    ids = [str(uuid.uuid4()) for _ in documents]

    metadatas = [
        {
            "source": source
        }
        for _ in documents
    ]
    collection.add(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )

    return {
        "documents_added": len(documents),
        "source": source
    }