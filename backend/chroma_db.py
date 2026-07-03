import chromadb
from chromadb.utils import embedding_functions
import pickle
from pathlib import Path

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(


    model_name=("all-MiniLM-L6-v2")
    )

client = chromadb.PersistentClient(path = "./chroma_storage")
collection = client.get_or_create_collection(
    name="knowledge_base_2",
    embedding_function=embedding_fn
    
    )

file_path = Path("backend\\kb_docs.pkl")

with open(file_path, "rb") as f:
    kB_docs= pickle.load(f)

collection.add(
     ids = [docs["ids"] for docs in kB_docs],
     documents = [docs["document"] for docs in kB_docs], 
     metadatas = [{"source": "kb_docs"}] *len(kB_docs)
)

result = collection.query(
    query_texts=["how to reset password?","issue in billing","how to change email address?"],
    where = {"source": "kb_docs"}
    
)
print(result)