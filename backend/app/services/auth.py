"""Authentication persistence and credential checks."""

from fastapi import HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import DUMMY_HASH, password_hasher, verify_password
from app.models.user import User
from app.schemas.auth import RegisterRequest


def invalid_credentials() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials or inactive account",
        headers={"WWW-Authenticate": "Bearer"},
    )


def register_user(db: Session, data: RegisterRequest) -> User:
    if db.scalar(select(User.id).where(func.lower(User.email) == data.email)):
        raise HTTPException(status_code=409, detail="Email is already registered")
    user = User(
        name=data.name,
        email=str(data.email),
        password_hash=password_hasher.hash(data.password.get_secret_value()),
        role="user",
        is_active=True,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        # Handle the unique-index race without masking unrelated database failures.
        if db.scalar(select(User.id).where(func.lower(User.email) == data.email)):
            raise HTTPException(
                status_code=409, detail="Email is already registered"
            ) from exc
        raise
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    users = db.scalars(select(User).where(func.lower(User.email) == email)).all()
    # Legacy case-colliding accounts must be resolved by an administrator.
    user = users[0] if len(users) == 1 else None
    valid = verify_password(password, user.password_hash if user else DUMMY_HASH)
    if not valid or user is None or not user.is_active:
        raise invalid_credentials()
    if password_hasher.check_needs_rehash(user.password_hash):
        user.password_hash = password_hasher.hash(password)
        db.commit()
    return user
