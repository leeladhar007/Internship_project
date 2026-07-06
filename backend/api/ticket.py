from fastapi import APIRouter,Depends
from schemas import Ticketrequest,Ticketresponse
from sqlalchemy.orm import Session
from dependencies import get_db
from models import Ticket

ticket_router = APIRouter()
@ticket_router.post("/ticket", response_model=Ticketresponse)

def ticket(ticket_request: Ticketrequest,
           db: Session = Depends(get_db)):

    new_ticket = Ticket(
        query = ticket_request.query

    ) 
    db.add(new_ticket)
    db.commit()   
    db.refresh(new_ticket)
    return Ticketresponse(
        answer = "Ticket generated successfully",
        ticket_no = new_ticket.id,
        date_generated = new_ticket.created_at
    
)

