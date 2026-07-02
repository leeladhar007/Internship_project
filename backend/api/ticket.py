from fastapi import APIRouter
from schemas import Ticketrequest,Ticketresponse

ticket_router = APIRouter()
@ticket_router.post("/ticket", response_model=Ticketresponse)

def ticket(ticket_request: Ticketrequest):
    print(ticket_request.query)

    return Ticketresponse(
    answer = "ticket received",
    ticket_no = 124,
    date_generated = "2026-07-02"
)


