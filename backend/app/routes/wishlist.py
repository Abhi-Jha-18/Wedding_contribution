"""Wishlist and wishlist item HTTP endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas.wishlist import (
    WishlistItemCreate,
    WishlistItemResponse,
    WishlistItemUpdate,
)
from app.services.wishlist import (
    create_item,
    delete_item,
    list_owner_items,
    list_public_items,
    update_item,
)

router = APIRouter(tags=["wishlists"])
DB = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
PRIVATE_ERRORS = {401: {"description": "Missing/invalid token or inactive user"}}


@router.get(
    "/api/wishlists/me/items",
    response_model=list[WishlistItemResponse],
    responses=PRIVATE_ERRORS,
)
def get_my_items(db: DB, user: CurrentUser) -> list[WishlistItemResponse]:
    """Retrieve all wishlist items for the authenticated couple, with funded totals."""
    return list_owner_items(db, user.id)


@router.post(
    "/api/wishlists/me/items",
    response_model=WishlistItemResponse,
    status_code=status.HTTP_201_CREATED,
    responses=PRIVATE_ERRORS,
)
def add_my_item(
    data: WishlistItemCreate, db: DB, user: CurrentUser
) -> WishlistItemResponse:
    """Add a new item to the authenticated couple's wishlist."""
    return create_item(db, user.id, data)


@router.put(
    "/api/wishlists/me/items/{item_id}",
    response_model=WishlistItemResponse,
    responses={**PRIVATE_ERRORS, 404: {"description": "Wishlist item not found"}},
)
def edit_my_item(
    item_id: int, data: WishlistItemUpdate, db: DB, user: CurrentUser
) -> WishlistItemResponse:
    """Update a wishlist item owned by the authenticated couple."""
    return update_item(db, user.id, item_id, data)


@router.delete(
    "/api/wishlists/me/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={**PRIVATE_ERRORS, 404: {"description": "Wishlist item not found"}},
)
def remove_my_item(item_id: int, db: DB, user: CurrentUser) -> None:
    """Delete a wishlist item owned by the authenticated couple."""
    delete_item(db, user.id, item_id)


@router.get(
    "/api/couples/{slug}/wishlist",
    response_model=list[WishlistItemResponse],
    responses={404: {"description": "Wedding profile not found"}},
)
def get_public_wishlist(slug: str, db: DB) -> list[WishlistItemResponse]:
    """Public guest view of active wishlist goals and current contribution progress."""
    return list_public_items(db, slug)
