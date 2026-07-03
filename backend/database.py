from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from config import(
    DB_USERNAME,
    DB_PASSWORD,
    DB_PORT,
    DB_HOST,
    DB_NAME
)
engine = create_engine(f"mysql+pymysql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    pool_recycle = 3600
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
Base = declarative_base()