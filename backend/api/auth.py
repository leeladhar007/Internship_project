from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from starlette import status

from dependencies import get_db
from models import Users
from schemas import CreateUserRequest, Token # type: ignore


auth_router = APIRouter()

SECRET_KEY = "1gygsgg38vauv2489bxj3686bjcgsufgkfko"
ALGORITHM = "HS256"

bcrypt_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

oauth2_bearer = OAuth2PasswordBearer(
    tokenUrl="auth/token"
)

db_dependency = Annotated[Session, Depends(get_db)]

@auth_router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(
    create_user_request: CreateUserRequest,
    db: db_dependency
):

    existing_user = db.query(Users).filter(
        Users.username == create_user_request.username
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Username already exists.\n Please enter your credentials to login"
        )

    new_user = Users(
        name=create_user_request.name,
        username=create_user_request.username,
        email=create_user_request.email,
        hashed_password=bcrypt_context.hash(create_user_request.password)
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User created successfully."
    }


@auth_router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm,Depends()],db: db_dependency
):

    user = authenticate_user(
        form_data.username,
        form_data.password,
        db
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )

    token = create_access_token(
        user.username, # type: ignore
        user.email, # type: ignore
        timedelta(minutes=30)
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

def authenticate_user(
    username: str,
    password: str,
    db: Session
):

    user = db.query(Users).filter(
        Users.username == username
    ).first()

    if user is None:
        return False

    if not bcrypt_context.verify(
        password,
        user.hashed_password # type: ignore
    ):
        return False

    return user

def create_access_token(
    username: str,
    email: str,
    expires_delta: timedelta
):
    expires = datetime.now(timezone.utc) + expires_delta

    encode = {
        "sub": username,
        "email": email,
        "exp": expires
    }
    

    encode.update({
        "exp": expires
    })

    return jwt.encode(
        encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )