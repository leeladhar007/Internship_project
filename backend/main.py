from fastapi import FastAPI
from api.health import health_router
from api.ticket import ticket_router 
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title = "AI knowledge base",
    version = "1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = False,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(health_router)
app.include_router(ticket_router)