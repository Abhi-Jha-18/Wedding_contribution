"""Business logic and database queries for guestbook wishes and messages."""

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.couple import Couple
from app.models.guest_message import GuestMessage
from app.schemas.guest_message import GuestMessageCreate, GuestMessageResponse
from app.services.couple import get_public_couple
from app.services.wishlist import get_owner_couple


def create_guest_message(
    db: Session, slug: str, data: GuestMessageCreate
) -> GuestMessageResponse:
    couple = get_public_couple(db, slug.strip().lower())

    message = GuestMessage(
        couple_id=couple.id,
        guest_name=data.guest_name,
        message=data.message,
        is_approved=True,
    )
    db.add(message)
    db.commit()
    db.refresh(message)

    return GuestMessageResponse.model_validate(message)


def list_public_messages(db: Session, slug: str) -> list[GuestMessageResponse]:
    couple = get_public_couple(db, slug.strip().lower())

    query = (
        select(GuestMessage)
        .where(GuestMessage.couple_id == couple.id, GuestMessage.is_approved.is_(True))
        .order_by(GuestMessage.created_at.desc())
    )
    messages = db.scalars(query).all()
    return [GuestMessageResponse.model_validate(m) for m in messages]


def list_owner_messages(db: Session, user_id: int) -> list[GuestMessageResponse]:
    couple = get_owner_couple(db, user_id)
    query = (
        select(GuestMessage)
        .where(GuestMessage.couple_id == couple.id)
        .order_by(GuestMessage.created_at.desc())
    )
    messages = db.scalars(query).all()
    return [GuestMessageResponse.model_validate(m) for m in messages]
