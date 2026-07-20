import chromadb
from chromadb.utils import embedding_functions
import pickle
from pathlib import Path
import polars as pl

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)


client = chromadb.PersistentClient(path="./chroma_storage")

collection = client.get_or_create_collection(
    name="knowledge_base_2",
    embedding_function=embedding_fn
)


if collection.count()== 0:

    df = pl.read_csv("sample.csv")    
    df = df.unique()
    df_docs = pl.read_excel("sample1.xlsx")
    df_docs = df_docs.unique()
    kb_1_docs = pl.read_excel("KnowledgeBase.xlsx")
    kb_1_docs = kb_1_docs.unique()
    ttns_docs = pl.read_excel("TTNS_Ticket_details.xlsx")
    ttns_docs = ttns_docs.unique()
    file_path = Path("kb_docs.pkl")
    
    with open(file_path, "rb") as f:
        kB_docs = pickle.load(f)
    
    csv_docs = []
    
    for row in df.iter_rows(named=True):
        row_text = ". ".join([f"{col}: {val}" for col,val in row.items() if val is not None and str(val).lower() != 'none'])
        csv_docs.append(row_text)
    
    excel_docs = []

    for row in df_docs.iter_rows(named=True):
        row_text = ". ".join([f"{col}: {val}" for col,val in row.items() if val is not None and str(val).lower() != 'none'])
        excel_docs.append(row_text)
    
    kb_excel_docs = []
    
    for row in kb_1_docs.iter_rows(named=True):
        row_text = ". ".join([f"{col}: {val}" for col,val in row.items() if val is not None and str(val).lower() != 'none'])
        kb_excel_docs.append(row_text)

    ttns_docs_1 = []
    
    for row in ttns_docs.iter_rows(named=True):
        row_text = ". ".join([f"{col}: {val}" for col,val in row.items() if val is not None and str(val).lower() != 'none'])
        ttns_docs_1.append(row_text)
    
    documents = []
    documents.extend(kB_docs)
    documents.extend(csv_docs)
    documents.extend(excel_docs)
    documents.extend(kb_excel_docs)
    documents.extend(ttns_docs_1)
    
    metadatas = (
        [{"source": "kb_docs"} for _ in kB_docs] +
        [{"source": "sample"} for _ in csv_docs] +
        [{"source": "sample1"} for _ in excel_docs] +
        [{"source": "KnowledgeBase"} for _ in kb_excel_docs] +
        [{"source": "TTNS_Ticket_details"} for _ in ttns_docs_1]
    )
    ids = [str(i) for i in range(len(documents))]
    collection.add(
        ids=ids,
        documents=documents,
        metadatas=metadatas
    )