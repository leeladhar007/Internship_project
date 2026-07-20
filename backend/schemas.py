from pydantic import BaseModel
from typing import Optional

class Ticketrequest(BaseModel):
    query : str
    
class ChatRequest(BaseModel):
    session_id : Optional[int]= None
    message : str
class ChatResponse(BaseModel):
    session_id : int
    answer: str
    sentiment: str
    intent: str

class EndchatRequest(BaseModel):
    session_id : int

class EndchatResponse(BaseModel):
    message : str

class CreateUserRequest(BaseModel):
    name : str
    username : str
    email : str
    password : str

class Token(BaseModel):
    access_token : str
    token_type : str

class FeedbackRequest(BaseModel):
    session_id: int
    rating: int  # 1-5 stars
    helpful: str  # yes/no
    comment: Optional[str] = None

class FeedbackResponse(BaseModel):
    message: str
    feedback_id: int