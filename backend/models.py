from sqlalchemy import VARCHAR, Column, Integer, Text, TIMESTAMP
from sqlalchemy.sql import func
from database import Base

class Ticket(Base):
    __tablename__ = "tickets"
    id = Column(Integer, primary_key=True, autoincrement=True)
    query = Column(Text, nullable=False)
    answer = Column(Text)
    status = Column(VARCHAR(20), default="Processing Ticket")
    sentiment = Column(VARCHAR(20))
    created_at = Column(TIMESTAMP, server_default=func.now())

# class chat_session(Base):
#     __tablename__ = "chat_session"
#     session_id = Column(Integer,primary_key=True, autoincrement=True)
#     user_id = Column(VARCHAR(20))
#     status = Column(VARCHAR(20), default="OPEN")
#     created_at = Column()
#     updated_at = Column()
# created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
# updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

# class chat_messages(Base):
#     __tablename__ = "chat_messages"
#     id =
#     session_id =
#     sender =
#     message =
#     created_at =
    


