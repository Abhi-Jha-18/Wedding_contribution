"""Guestbook wishes and messages HTTP endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas.guest_message import GuestMessageCreate, GuestMessageResponse
from app.services.guest_message import (
    create_guest_message,
    list_owner_messages,
    list_public_messages,
)

router = APIRouter(tags=["guestbook"])
DB = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
PRIVATE_ERRORS = {401: {"description": "Missing/invalid token or inactive user"}}


@router.post(
    "/api/couples/{slug}/messages",
    response_model=GuestMessageResponse,
    status_code=status.HTTP_201_CREATED,
    responses={404: {"description": "Wedding profile not found"}},
)
def leave_wish(
    slug: str, data: GuestMessageCreate, db: DB
) -> GuestMessageResponse:
    """Public guest endpoint to leave a wedding wish on the couple's guestbook."""
    return create_guest_message(db, slug, data)


@router.get(
    "/api/couples/{slug}/messages",
    response_model=list[GuestMessageResponse],
    responses={404: {"description": "Wedding profile not found"}},
)
def get_public_wishes(slug: str, db: DB) -> list[GuestMessageResponse]:
    """Public guest view of wedding wishes for this couple."""
    return list_public_messages(db, slug)


@router.get(
    "/api/messages/me",
    response_model=list[GuestMessageResponse],
    responses=PRIVATE_ERRORS,
)
def get_my_wishes(db: DB, user: CurrentUser) -> list[GuestMessageResponse]:
    """Retrieve all guestbook messages for the authenticated couple."""
    return list_owner_messages(db, user.id)
