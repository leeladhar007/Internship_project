from fastapi import FastAPI
from api.health import health_router
from api.chat import chat_router
from api.load_kb import load_kb_router
from api.auth import auth_router
from api.feedback import feedback_router
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI knowledge base",
    version="1.0.0",
    openapi_version="3.0.3",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = False,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(health_router)
app.include_router(chat_router)
app.include_router(load_kb_router)
app.include_router(auth_router)
app.include_router(feedback_router)