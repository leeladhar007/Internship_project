from fastapi import APIRouter, Depends
from starlette import status
from api.auth import oauth2_bearer
from typing import Annotated

logout_router = APIRouter()
@logout_router.post("/logout", status_code= status.HTTP_200_OK)
async def logout(token: Annotated[str, Depends(oauth2_bearer)]):
    return {
        "message": "Logged out successfully."
    }
                 
