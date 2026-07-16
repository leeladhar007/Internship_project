from sqlalchemy import VARCHAR, Column, Integer, Text, TIMESTAMP ,ForeignKey
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

class chatsession(Base):
    __tablename__ = "chat_sessions"
    session_id = Column(Integer,primary_key=True, autoincrement=True)
    user_id = Column(VARCHAR(20))
    status = Column(VARCHAR(20), default="ACTIVE")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_onupdate=func.now())

class chatmessages(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True , autoincrement=True)
    session_id = Column(Integer,ForeignKey("chat_sessions.session_id"),nullable=False)
    sender =Column(VARCHAR(20), nullable=False)
    message =Column(Text, nullable=False)
    created_at =Column(TIMESTAMP,server_default=func.now())


