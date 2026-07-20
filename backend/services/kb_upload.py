from pathlib import Path
import pandas as pd
import pdfplumber

def read_file(file_path: Path):
    extension = file_path.suffix.lower()

    if extension == ".txt":
        return read_text(file_path)
    elif extension == ".csv":
        return read_csv(file_path)
    elif extension == ".xlsx":
        return read_excel(file_path)
    elif extension == ".pdf":
        return read_pdf(file_path)
    else:
        raise ValueError("Unsupported file type")

def read_text(file_path: Path, chunk_size: int = 500):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    words = content.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    return chunks

def read_csv(file_path: Path):
    df = pd.read_csv(file_path)
    df.drop_duplicates(inplace=True)

    docs = []
    for index,row in df.iterrows():
        row_text = "|".join([f"{col}:{val}" for col,val in row.items()])
        docs.append(row_text)

    return docs

def read_excel(file_path: Path):
    df = pd.read_excel(file_path)
    df.drop_duplicates(inplace=True)

    docs = []
    for index,row in df.iterrows():
        row_text = "|".join([f"{col}:{val}" for col,val in row.items()])
        docs.append(row_text)

    return docs

def read_pdf(file_path: Path, chunk_size: int = 300):
    full_text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            
            if page_text:
                full_text += page_text + "\n"

    words = full_text.split()
    chunks = []
    for i in range(0, len(words), chunk_size):
        chunk = " ".join(words[i:i + chunk_size])
        chunks.append(chunk)

    seen = set()
    unique_chunks = []
    for chunk in chunks:
        if chunk not in seen:
            seen.add(chunk)
            unique_chunks.append(chunk)

    return unique_chunks