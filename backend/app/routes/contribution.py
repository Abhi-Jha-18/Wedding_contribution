"""Guest contribution HTTP endpoints."""

from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas.contribution import (
    ContributionCreate,
    ContributionResponse,
    OwnerContributionResponse,
)
from app.services.contribution import (
    list_contributions_for_owner,
    record_contribution,
)

router = APIRouter(tags=["contributions"])
DB = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
PRIVATE_ERRORS = {401: {"description": "Missing/invalid token or inactive user"}}


@router.post(
    "/api/wishlist-items/{item_id}/contribute",
    response_model=ContributionResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        404: {"description": "Wishlist item not found or inactive"},
        422: {"description": "Invalid amount or payment mode"},
    },
)
def contribute_to_item(
    item_id: int, data: ContributionCreate, db: DB
) -> ContributionResponse:
    """Public guest endpoint to record a demonstration wedding gift toward an item."""
    return record_contribution(db, item_id, data)


@router.get(
    "/api/contributions/me",
    response_model=list[OwnerContributionResponse],
    responses=PRIVATE_ERRORS,
)
def get_my_contributions(db: DB, user: CurrentUser) -> list[OwnerContributionResponse]:
    """Retrieve all received guest contributions for the authenticated couple."""
    return list_contributions_for_owner(db, user.id)
