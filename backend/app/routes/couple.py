"""Wedding profile HTTP endpoints; queries and ownership rules live in services."""

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.couple import Couple
from app.models.user import User
from app.routes.auth import get_current_user
from app.schemas.couple import CoupleCreate, CoupleResponse, CoupleUpdate, Slug
from app.services.couple import (
    create_couple,
    get_my_couple,
    get_public_couple,
    update_my_couple,
)

router = APIRouter(prefix="/api/couples", tags=["wedding profiles"])
DB = Annotated[Session, Depends(get_db)]
CurrentUser = Annotated[User, Depends(get_current_user)]
PRIVATE_ERRORS = {401: {"description": "Missing/invalid token or inactive user"}}


@router.post(
    "",
    response_model=CoupleResponse,
    status_code=201,
    responses={
        **PRIVATE_ERRORS,
        409: {"description": "Owner already has a profile or slug is taken"},
    },
)
def create(data: CoupleCreate, db: DB, user: CurrentUser) -> Couple:
    """Create the current user's only wedding profile. Photo is an HTTP(S) URL, not an upload."""
    return create_couple(db, user.id, data)


# Static paths must be registered before /{slug}.
@router.get(
    "/me",
    response_model=CoupleResponse,
    responses={
        **PRIVATE_ERRORS,
        404: {"description": "Current user has no wedding profile"},
    },
)
def read_mine(db: DB, user: CurrentUser) -> Couple:
    """Return only the verified current user's profile."""
    return get_my_couple(db, user.id)


@router.put(
    "/me",
    response_model=CoupleResponse,
    responses={
        **PRIVATE_ERRORS,
        404: {"description": "Current user has no wedding profile"},
        409: {"description": "Slug is taken"},
    },
)
def update_mine(data: CoupleUpdate, db: DB, user: CurrentUser) -> Couple:
    """Replace required fields on your profile. Omitted story/photo are preserved;
    explicit null clears them. Dates use YYYY-MM-DD; valid past dates are allowed.
    """
    return update_my_couple(db, user.id, data)


@router.get(
    "/{slug}",
    response_model=CoupleResponse,
    responses={
        404: {"description": "Unknown wedding slug"},
    },
)
def read_public(slug: Slug, db: DB) -> Couple:
    """Public wedding information only. No login required; no account/owner identifiers returned."""
    return get_public_couple(db, slug)
