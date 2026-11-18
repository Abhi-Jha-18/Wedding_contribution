"""Business logic and database queries for guest contributions."""

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.contribution import Contribution
from app.models.couple import Couple
from app.models.guest_message import GuestMessage
from app.models.wishlist import Wishlist, WishlistItem
from app.schemas.contribution import (
    ContributionCreate,
    ContributionResponse,
    OwnerContributionResponse,
)
from app.services.wishlist import get_owner_couple


def record_contribution(
    db: Session, item_id: int, data: ContributionCreate
) -> ContributionResponse:
    item = db.scalars(
        select(WishlistItem).where(WishlistItem.id == item_id)
    ).first()
    if not item or not item.is_active:
        raise HTTPException(status_code=404, detail="Wishlist item not found or inactive")

    amount_paise = data.resolve_amount_paise()
    if amount_paise <= 0:
        raise HTTPException(status_code=422, detail="Contribution amount must be greater than zero")

    if data.payment_mode != "DEMO":
        raise HTTPException(
            status_code=422, detail="Only DEMO payment mode is supported in this milestone"
        )

    contribution = Contribution(
        wishlist_item_id=item.id,
        contributor_name=data.contributor_name,
        amount_paise=amount_paise,
        payment_mode="DEMO",
        message=data.message,
    )
    db.add(contribution)

    # If the guest left a message, also store it in guest_messages so it appears on the couple's guestbook
    if data.message:
        wishlist = db.scalars(select(Wishlist).where(Wishlist.id == item.wishlist_id)).first()
        if wishlist:
            guest_msg = GuestMessage(
                couple_id=wishlist.couple_id,
                guest_name=data.contributor_name or "Generous Guest",
                message=data.message,
                is_approved=True,
            )
            db.add(guest_msg)

    db.commit()
    db.refresh(contribution)

    return ContributionResponse(
        id=contribution.id,
        wishlist_item_id=contribution.wishlist_item_id,
        contributor_name=contribution.contributor_name,
        amount_paise=contribution.amount_paise,
        amount=round(contribution.amount_paise / 100, 2),
        payment_mode=contribution.payment_mode,
        message=contribution.message,
        created_at=contribution.created_at,
    )


def list_contributions_for_owner(
    db: Session, user_id: int
) -> list[OwnerContributionResponse]:
    couple = get_owner_couple(db, user_id)
    wishlist = db.scalars(select(Wishlist).where(Wishlist.couple_id == couple.id)).first()
    if not wishlist:
        return []

    query = (
        select(Contribution, WishlistItem.title)
        .join(WishlistItem, Contribution.wishlist_item_id == WishlistItem.id)
        .where(WishlistItem.wishlist_id == wishlist.id)
        .order_by(Contribution.created_at.desc())
    )

    results = db.execute(query).all()
    return [
        OwnerContributionResponse(
            id=contrib.id,
            wishlist_item_id=contrib.wishlist_item_id,
            contributor_name=contrib.contributor_name,
            amount_paise=contrib.amount_paise,
            amount=round(contrib.amount_paise / 100, 2),
            payment_mode=contrib.payment_mode,
            message=contrib.message,
            created_at=contrib.created_at,
            item_title=title,
        )
        for contrib, title in results
    ]
