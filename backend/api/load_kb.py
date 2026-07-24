from fastapi import APIRouter, UploadFile
from fastapi import File
from pathlib import Path
from typing import List
from services.kb_upload import read_file
from services.chroma import add_documents

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".csv", ".xlsx" , ".txt", ".pdf", ".jpg", ".jpeg", ".png"}
#max upload size 10mb
max_file_size = 10*1024*1024
load_kb_router = APIRouter()
@load_kb_router.post("/load_kb")
async def file_upload(uploaded_files: List[UploadFile] = File(...)):
    result = []
    for uploaded_file in uploaded_files:

        filename = uploaded_file.filename
        print(filename)

        
        extension = Path(filename).suffix.lower() # type: ignore

        if extension in ALLOWED_EXTENSIONS:

            content = await uploaded_file.read()

            if len(content)>max_file_size:
                result.append({
                    "file_name": filename,
                    "status": "file too large (max 10MB)"
                })
                continue


            file_path = UPLOAD_DIR / filename # type: ignore
            with open(file_path,"wb") as f:
                f.write(content)
            documents = read_file(file_path)
        

            add_result = add_documents(
            documents=documents,
            source=filename
            )

            result.append({
                "file_name": filename,
                "status": "uploaded successfully",
                "chunks_added": add_result["documents_added"]
            })
        
        else :
            result.append({
                "file_name" : filename,
                "status" : "file type not supported"
            })
    return result

