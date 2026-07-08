from fastapi import APIRouter,Depends
from schemas import Ticketrequest,Ticketresponse
from sqlalchemy.orm import Session
from dependencies import get_db
from models import Ticket
from services.ticket_service import process_ticket

ticket_router = APIRouter()
@ticket_router.post("/ticket", response_model=Ticketresponse)
def ticket(
    ticket_request : Ticketrequest,
    db: Session = Depends(get_db)
):
 result = process_ticket(ticket_request.query)
 new_ticket = Ticket(
  query = ticket_request.query,
  answer = result["answer"],
  status = "Resolved"
 )
 db.add(new_ticket)
 db.commit()
 db.refresh(new_ticket)
 return Ticketresponse(
  answer = result["answer"],
  ticket_no = new_ticket.id,
  date_generated = new_ticket.created_at
  
      
 )
    


