from fastapi import FastAPI
from api.health import health_router
from api.ticket import ticket_router 

app = FastAPI(
    title = "AI knowledge base",
    version = "1.0.0"
)

app.include_router(health_router)
app.include_router(ticket_router)