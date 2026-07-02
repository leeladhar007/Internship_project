from pydantic import BaseModel
from datetime import datetime

class Ticketrequest(BaseModel):
    query : str
    

class Ticketresponse(BaseModel):
    answer : str
    ticket_no : int
    date_generated :datetime

        