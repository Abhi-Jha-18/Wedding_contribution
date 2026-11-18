"""Business logic and database queries for wishlists and wishlist items."""

from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.contribution import Contribution
from app.models.couple import Couple
from app.models.wishlist import Wishlist, WishlistItem
from app.schemas.wishlist import WishlistItemCreate, WishlistItemResponse, WishlistItemUpdate
from app.services.couple import get_public_couple


def get_owner_couple(db: Session, user_id: int) -> Couple:
    couple = db.scalars(select(Couple).where(Couple.owner_user_id == user_id)).first()
    if not couple:
        raise HTTPException(status_code=404, detail="Wedding profile not found")
    return couple


def get_or_create_wishlist(db: Session, couple_id: int) -> Wishlist:
    wishlist = db.scalars(select(Wishlist).where(Wishlist.couple_id == couple_id)).first()
    if not wishlist:
        wishlist = Wishlist(couple_id=couple_id, title="Our Wishlist")
        db.add(wishlist)
        db.flush()
    return wishlist


def item_to_response(item: WishlistItem, current_amount_paise: int) -> WishlistItemResponse:
    target_paise = item.target_amount_paise
    return WishlistItemResponse(
        id=item.id,
        wishlist_id=item.wishlist_id,
        title=item.title,
        description=item.description,
        target_amount_paise=target_paise,
        target_amount=round(target_paise / 100, 2) if target_paise is not None else None,
        current_amount_paise=current_amount_paise,
        current_amount=round(current_amount_paise / 100, 2),
        category=item.category or "Other",
        quantity=item.quantity,
        display_order=item.display_order,
        is_active=item.is_active,
        created_at=item.created_at,
        updated_at=item.updated_at,
    )


def list_owner_items(db: Session, user_id: int) -> list[WishlistItemResponse]:
    couple = get_owner_couple(db, user_id)
    wishlist = get_or_create_wishlist(db, couple.id)

    # Query items with aggregated contributions
    subq = (
        select(
            Contribution.wishlist_item_id,
            func.coalesce(func.sum(Contribution.amount_paise), 0).label("funded"),
        )
        .group_by(Contribution.wishlist_item_id)
        .subquery()
    )

    query = (
        select(WishlistItem, func.coalesce(subq.c.funded, 0))
        .outerjoin(subq, WishlistItem.id == subq.c.wishlist_item_id)
        .where(WishlistItem.wishlist_id == wishlist.id)
        .order_by(WishlistItem.display_order.asc(), WishlistItem.id.asc())
    )

    results = db.execute(query).all()
    return [item_to_response(item, int(funded)) for item, funded in results]


def list_public_items(db: Session, slug: str) -> list[WishlistItemResponse]:
    couple = get_public_couple(db, slug.strip().lower())

    wishlist = get_or_create_wishlist(db, couple.id)

    subq = (
        select(
            Contribution.wishlist_item_id,
            func.coalesce(func.sum(Contribution.amount_paise), 0).label("funded"),
        )
        .group_by(Contribution.wishlist_item_id)
        .subquery()
    )

    query = (
        select(WishlistItem, func.coalesce(subq.c.funded, 0))
        .outerjoin(subq, WishlistItem.id == subq.c.wishlist_item_id)
        .where(WishlistItem.wishlist_id == wishlist.id, WishlistItem.is_active.is_(True))
        .order_by(WishlistItem.display_order.asc(), WishlistItem.id.asc())
    )

    results = db.execute(query).all()
    return [item_to_response(item, int(funded)) for item, funded in results]


def create_item(db: Session, user_id: int, data: WishlistItemCreate) -> WishlistItemResponse:
    couple = get_owner_couple(db, user_id)
    wishlist = get_or_create_wishlist(db, couple.id)

    amount_paise = data.resolve_amount_paise()

    item = WishlistItem(
        wishlist_id=wishlist.id,
        title=data.title,
        description=data.description,
        target_amount_paise=amount_paise,
        category=data.category or "Other",
        quantity=data.quantity,
        display_order=data.display_order,
        is_active=True,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item_to_response(item, 0)


def update_item(db: Session, user_id: int, item_id: int, data: WishlistItemUpdate) -> WishlistItemResponse:
    couple = get_owner_couple(db, user_id)
    wishlist = get_or_create_wishlist(db, couple.id)

    item = db.scalars(
        select(WishlistItem).where(WishlistItem.id == item_id, WishlistItem.wishlist_id == wishlist.id)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    if data.title is not None:
        item.title = data.title
    if data.description is not None:
        item.description = data.description
    if data.target_amount_paise is not None or data.target_amount is not None:
        item.target_amount_paise = data.resolve_amount_paise()
    if data.category is not None:
        item.category = data.category
    if data.quantity is not None:
        item.quantity = data.quantity
    if data.display_order is not None:
        item.display_order = data.display_order
    if data.is_active is not None:
        item.is_active = data.is_active

    db.commit()
    db.refresh(item)

    # Get funded total
    funded = db.scalar(
        select(func.coalesce(func.sum(Contribution.amount_paise), 0)).where(
            Contribution.wishlist_item_id == item.id
        )
    )
    return item_to_response(item, int(funded or 0))


def delete_item(db: Session, user_id: int, item_id: int) -> None:
    couple = get_owner_couple(db, user_id)
    wishlist = get_or_create_wishlist(db, couple.id)

    item = db.scalars(
        select(WishlistItem).where(WishlistItem.id == item_id, WishlistItem.wishlist_id == wishlist.id)
    ).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    db.delete(item)
    db.commit()
