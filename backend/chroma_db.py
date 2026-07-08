import chromadb
from chromadb.utils import embedding_functions
import pickle
from pathlib import Path
import pandas as pd

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

df = pd.read_csv("sample.csv")    
df.drop_duplicates(inplace=True)

df_docs = pd.read_excel("sample1.xlsx")
df_docs.drop_duplicates(inplace=True)

kb_1_docs = pd.read_excel("KnowledgeBase.xlsx")
kb_1_docs.drop_duplicates(inplace=True)

ttns_docs = pd.read_excel("TTNS_Ticket_details.xlsx")
ttns_docs.drop_duplicates(inplace=True)


client = chromadb.PersistentClient(path="./chroma_storage")

collection = client.get_or_create_collection(
    name="knowledge_base_2",
    embedding_function=embedding_fn
)

file_path = Path("kb_docs.pkl")

with open(file_path, "rb") as f:
    kB_docs = pickle.load(f)

csv_docs = []

for index, row in df.iterrows():
    text = "\n".join([f"{col}: {row[col]}" for col in df.columns])
    csv_docs.append(text)

excel_docs = []

for index, row in df_docs.iterrows():
    text = "\n".join([f"{col}: {row[col]}" for col in df_docs.columns])
    excel_docs.append(text)

kb_excel_docs = []

for index, row in kb_1_docs.iterrows():
    text = "\n".join([f"{col}: {row[col]}" for col in kb_1_docs.columns])
    kb_excel_docs.append(text)

ttns_docs_1 = []

for index,row in ttns_docs.iterrows():
    text = "\n".join([f"{col}: {row[col]}"for col in ttns_docs.columns])
    ttns_docs_1.append(text)

documents = []
documents.extend(kB_docs)
documents.extend(csv_docs)
documents.extend(excel_docs)
documents.extend(kb_excel_docs)
documents.extend(ttns_docs_1)

metadatas = [{"source": "kb_docs"} for index in documents]


ids = [str(i) for i in range(len(documents))]


collection.add(
    ids=ids,
    documents=documents,
    metadatas=metadatas
)

