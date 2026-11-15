"""JSON authentication routes with HTTP Bearer support in Swagger UI."""

from typing import Annotated

from fastapi import APIRouter, Depends, Response
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import jwt
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import create_access_token, decode_access_token
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse
from app.services.auth import authenticate_user, invalid_credentials, register_user

router = APIRouter(prefix="/api/auth", tags=["authentication"])
bearer = HTTPBearer(auto_error=False)
DB = Annotated[Session, Depends(get_db)]


def get_current_user(
    db: DB, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]
) -> User:
    if credentials is None:
        raise invalid_credentials()
    try:
        user_id = decode_access_token(credentials.credentials)
    except (jwt.InvalidTokenError, ValueError, TypeError):
        raise invalid_credentials() from None
    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise invalid_credentials()
    return user


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201,
    responses={409: {"description": "Email already registered"}},
)
def register(data: RegisterRequest, db: DB) -> User:
    """Create an active user. Passwords require 12–128 characters; names 1–120."""
    return register_user(db, data)


@router.post(
    "/login",
    response_model=TokenResponse,
    responses={401: {"description": "Invalid credentials or inactive account"}},
)
def login(data: LoginRequest, db: DB, response: Response) -> TokenResponse:
    """Exchange JSON email/password for a short-lived bearer token. Logout is client-side
    disposal only: issued tokens remain valid until expiry (no revocation list).
    """
    user = authenticate_user(db, str(data.email), data.password.get_secret_value())
    response.headers["Cache-Control"] = "no-store"
    response.headers["Pragma"] = "no-cache"
    return TokenResponse(
        access_token=create_access_token(user.id),
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    responses={
        401: {"description": "Missing, invalid, expired token or inactive user"}
    },
)
def me(user: Annotated[User, Depends(get_current_user)]) -> User:
    """Return the current active account, checking database state on every request."""
    return user
