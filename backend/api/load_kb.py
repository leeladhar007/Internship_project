from fastapi import APIRouter, UploadFile
from fastapi import File
from pathlib import Path
from typing import List
UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(exist_ok=True)
ALLOWED_EXTENSIONS = {".csv", ".xlsx" , ".txt", ".pdf", ".jpg", ".jpeg", ".png"}
#max upload size 10mb
max_file_size = 10*1024*1024
load_kb_router = APIRouter()
@load_kb_router.post("/load_kb")
async def file_upload(uploaded_files: List[UploadFile]=File(...)):
    result = []
    for uploaded_file in uploaded_files:

        filename = uploaded_file.filename
        print(filename)
        extension = Path(filename).suffix.lower()

        if extension in ALLOWED_EXTENSIONS:

            content = await uploaded_file.read()

            if len(content)>max_file_size:
                result.append({
                    "file_name": filename,
                    "status": "file too large (max 10MB)"
                })
                continue


            file_path = UPLOAD_DIR / filename
            with open(file_path,"wb") as f:
                f.write(content)
            result.append({
                "file_name" : filename,
                "status" : "uploaded successfully"
            })                

        else :
            result.append({
                "file_name" : filename,
                "status" : "file type not supported"
            })
    return result            

# from fastapi import APIRouter, UploadFile, File
# from pathlib import Path
# from typing import List
# import uuid

# UPLOAD_DIR = Path("uploads")
# UPLOAD_DIR.mkdir(exist_ok=True)

# ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".txt", ".pdf", ".jpg", ".jpeg", ".png"}

# # Max upload size = 10 MB
# max_file_size = 10 * 1024 * 1024

# load_kb_router = APIRouter()

# @load_kb_router.post("/load_kb")
# async def file_upload(uploaded_files: List[UploadFile] = File(...)):

#     result = []

#     for uploaded_file in uploaded_files:

#         filename = uploaded_file.filename
#         extension = Path(filename).suffix.lower()

#         if extension not in ALLOWED_EXTENSIONS:
#             result.append({
#                 "file_name": filename,
#                 "status": "File type not supported"
#             })
#             continue

#         content = await uploaded_file.read()

#         if len(content) > max_file_size:
#             result.append({
#                 "file_name": filename,
#                 "status": "File too large (max 10 MB)"
#             })
#             continue

#         # Generate a unique filename
#         unique_filename = f"{uuid.uuid4()}{extension}"

#         file_path = UPLOAD_DIR / unique_filename

#         with open(file_path, "wb") as f:
#             f.write(content)

#         result.append({
#             "original_file_name": filename,
#             "stored_file_name": unique_filename,
#             "status": "Uploaded successfully"
#         })

#     return result
