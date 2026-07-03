from sqlalchemy import VARCHAR, Column, Integer,Text , TIMESTAMP 
from database import Base

class Ticket(Base):
    tablename = "tickets",
    id = Column(Integer, primary_key=True, autoincrement=True)
    query = Column(Text, nullable=False)
    answer = Column(Text)
    status = Column(VARCHAR(20),default="Processing Ticket")
    created_at = Column(TIMESTAMP,default="CURRENT_TIMESTAMP")

    