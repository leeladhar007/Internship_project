from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from dependencies import get_db
from schemas import ChatRequest, ChatResponse
from models import chatmessages
from services.ticket_service import process_chat_messages

chat_router = APIRouter()


@chat_router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):

    # Get previous messages
    history = (
        db.query(chatmessages)
        .filter(chatmessages.session_id == request.session_id)
        .all()
    )

    # Generate response
    result = process_chat_messages(
        request.message,
        history
    )

    # Save user message
    db.add(
       chatmessages(
            session_id=request.session_id,
            sender="customer",
            message=request.message,
            sentiment=result["sentiment"]
        )
    )

    # Save bot message
    db.add(
       chatmessages(
            session_id=request.session_id,
            sender="bot",
            message=result["answer"]
        )
    )

    db.commit()

    return ChatResponse(
        session_id=request.session_id,
        answer=result["answer"],
        sentiment=result["sentiment"]
    )