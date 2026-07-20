from fastapi import APIRouter, Depends
from schemas import FeedbackRequest, FeedbackResponse# type: ignore
from dependencies import get_db
from models import Feedback
from models import chatsession
from sqlalchemy.orm import Session
feedback_router = APIRouter()

@feedback_router.post("/feedback", response_model=FeedbackResponse)
def submit_feedback(request: FeedbackRequest, db: Session = Depends(get_db)):
    if request.rating < 1 or request.rating > 5:
        return FeedbackResponse(message="Rating must be between 1 and 5", feedback_id=0)
    
    if request.helpful.lower() not in ["yes", "no"]:
        return FeedbackResponse(message="Helpful must be 'yes' or 'no'", feedback_id=0)
    
    session = db.query(chatsession).filter(chatsession.session_id == request.session_id).first()
    if not session:
        return FeedbackResponse(message="Session not found", feedback_id=0)
    
    feedback = Feedback(
        session_id=request.session_id,
        rating=request.rating,
        helpful=request.helpful.lower(),
        comment=request.comment
    )
    
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    
    return FeedbackResponse(message="Feedback submitted successfully", feedback_id=feedback.id)