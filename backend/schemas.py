from pydantic import BaseModel
from typing import Optional

class Ticketrequest(BaseModel):
    query : str
    
class ChatRequest(BaseModel):
    session_id : int
    message : str
class ChatResponse(BaseModel):
    session_id : int
    answer: str
    sentiment:str

class EndchatRequest(BaseModel):
    session_id : int

class EndchatResponse(BaseModel):
    message : str