"""Wedding profile persistence, ownership and uniqueness rules."""

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.couple import Couple
from app.schemas.couple import CoupleCreate, CoupleUpdate


def get_my_couple(db: Session, owner_id: int) -> Couple:
    couple = db.scalar(select(Couple).where(Couple.owner_user_id == owner_id))
    if couple is None:
        raise HTTPException(status_code=404, detail="Wedding profile not found")
    return couple


def get_public_couple(db: Session, slug: str) -> Couple:
    couple = db.scalar(select(Couple).where(Couple.slug == slug))
    if couple is None:
        raise HTTPException(status_code=404, detail="Wedding profile not found")
    return couple


def check_conflicts(
    db: Session, owner_id: int, slug: str, current_id: int | None = None
) -> None:
    if (
        current_id is None
        and db.scalar(select(Couple.id).where(Couple.owner_user_id == owner_id))
        is not None
    ):
        raise HTTPException(
            status_code=409, detail="You already have a wedding profile"
        )
    query = select(Couple.id).where(Couple.slug == slug)
    if current_id is not None:
        query = query.where(Couple.id != current_id)
    if db.scalar(query) is not None:
        raise HTTPException(status_code=409, detail="Slug is already in use")


def save_couple(
    db: Session, couple: Couple, owner_id: int, slug: str, creating: bool
) -> Couple:
    current_id = None if creating else couple.id
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        # Recheck after rollback to translate concurrent unique-index violations.
        # Unrelated database failures must not be disguised as slug conflicts.
        check_conflicts(db, owner_id, slug, current_id)
        raise
    db.refresh(couple)
    return couple


def create_couple(db: Session, owner_id: int, data: CoupleCreate) -> Couple:
    check_conflicts(db, owner_id, data.slug)
    couple = Couple(owner_user_id=owner_id, **data.model_dump())
    db.add(couple)
    return save_couple(db, couple, owner_id, data.slug, creating=True)


def update_my_couple(db: Session, owner_id: int, data: CoupleUpdate) -> Couple:
    couple = get_my_couple(db, owner_id)
    check_conflicts(db, owner_id, data.slug, couple.id)
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(couple, key, value)
    return save_couple(db, couple, owner_id, data.slug, creating=False)
