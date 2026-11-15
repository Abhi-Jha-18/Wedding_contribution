"""Argon2id passwords and strictly validated, short-lived access tokens."""

from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
import jwt

from app.core.config import settings

password_hasher = PasswordHasher()
# Perform a real password verification even when an account does not exist.
DUMMY_HASH = password_hasher.hash("dummy-password-not-an-account")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return password_hasher.verify(password_hash, password)
    except (VerificationError, InvalidHashError):
        return False


def create_access_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    return jwt.encode(
        {
            "sub": str(user_id),
            "iat": now,
            "exp": now + timedelta(minutes=settings.jwt_access_token_minutes),
            "iss": settings.jwt_issuer,
            "aud": settings.jwt_audience,
            "type": "access",
        },
        settings.jwt_secret.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )


def decode_access_token(token: str) -> int:
    payload = jwt.decode(
        token,
        settings.jwt_secret.get_secret_value(),
        algorithms=[settings.jwt_algorithm],
        issuer=settings.jwt_issuer,
        audience=settings.jwt_audience,
        options={"require": ["sub", "iat", "exp", "iss", "aud", "type"]},
    )
    subject = payload["sub"]
    if (
        payload["type"] != "access"
        or not isinstance(subject, str)
        or not subject.isascii()
        or not subject.isdigit()
        or not 0 < int(subject) <= 2147483647
    ):
        raise jwt.InvalidTokenError("Invalid access token subject or type")
    return int(subject)
