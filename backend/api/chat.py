from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from dependencies import get_db
from schemas import ChatRequest, ChatResponse # type: ignore
from models import chatmessages, chatsession
from services.chat_service import process_chat_messages


chat_router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)


@chat_router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest, db: Session = Depends(get_db)):
  
    if request.session_id is None or request.session_id <= 0:
        new_session = chatsession(status="ACTIVE")
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        session_id = new_session.session_id
    else:
        existing_session = db.query(chatsession).filter(
            chatsession.session_id == request.session_id,
            chatsession.status == "ACTIVE"
        ).first()
        
        if existing_session is None:
            new_session = chatsession(status="ACTIVE")
            db.add(new_session)
            db.commit()
            db.refresh(new_session)
            session_id = new_session.session_id
        else:
            session_id = request.session_id

    history = (
        db.query(chatmessages)
        .filter(chatmessages.session_id == session_id)
        .order_by(chatmessages.created_at.asc())  
        .all()
    )

    result = process_chat_messages(
        session_id=session_id,# type: ignore
        user_message=request.message,
        history=history,
        db=db
    )

    db.add(
        chatmessages(
            session_id=session_id,
            sender="customer",
            message=request.message,
            sentiment=result["sentiment"]
        )
    )

    db.add(
        chatmessages(
            session_id=session_id,
            sender="bot",
            message=result["answer"]
        )
    )

    if result["intent"] == "END_CHAT":
        session = db.query(chatsession).filter(chatsession.session_id == session_id).first()
        if session:
            all_messages = db.query(chatmessages).filter(chatmessages.session_id == session_id).all()
            conversation_text = ""
            for msg in all_messages:
                conversation_text += f"{msg.sender}: {msg.message}\n"
            
            session.status = "RESOLVED"# type: ignore
            session.ended_at = datetime.now()# type: ignore
            session.conversation = conversation_text # type: ignore

    db.commit()

    return ChatResponse(
        session_id=session_id,
        answer=result["answer"],
        sentiment=result["sentiment"],
        intent=result["intent"]
    )