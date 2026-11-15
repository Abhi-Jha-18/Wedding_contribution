from datetime import datetime, timedelta, timezone

import jwt
import pytest
from sqlalchemy import select

from app.core.config import settings
from app.core.security import password_hasher
from app.models import User

ACCOUNT = {
    "name": "  Asha Jha  ",
    "email": "Asha@Example.com",
    "password": "a-long-test-password",
}


def register(client):
    return client.post("/api/auth/register", json=ACCOUNT)


def login(client, **changes):
    return client.post(
        "/api/auth/login",
        json={"email": ACCOUNT["email"], "password": ACCOUNT["password"], **changes},
    )


def test_registration(client, db):
    response = register(client)
    assert response.status_code == 201
    assert response.json() == {
        "id": response.json()["id"],
        "name": "Asha Jha",
        "email": "asha@example.com",
        "role": "user",
    }
    user = db.scalar(select(User).where(User.email == "asha@example.com"))
    assert user.password_hash.startswith("$argon2id$")
    assert user.password_hash != ACCOUNT["password"]
    assert password_hasher.verify(user.password_hash, ACCOUNT["password"])


def test_duplicate_email(client):
    assert register(client).status_code == 201
    assert (
        client.post(
            "/api/auth/register", json={**ACCOUNT, "email": "asha@example.COM"}
        ).status_code
        == 409
    )


def test_legacy_mixed_case_email(client, db):
    db.add(
        User(
            name="Legacy",
            email="Asha@Example.com",
            password_hash=password_hasher.hash(ACCOUNT["password"]),
        )
    )
    db.commit()
    assert register(client).status_code == 409
    assert login(client).status_code == 200


@pytest.mark.parametrize(
    "change",
    [
        {"name": " "},
        {"name": "x" * 121},
        {"email": "bad"},
        {"password": "short"},
        {"password": " " * 12},
        {"password": "x" * 129},
        {"role": "admin"},
        {"is_active": False},
        {"name": None},
    ],
)
def test_invalid_registration(client, change):
    assert (
        client.post("/api/auth/register", json={**ACCOUNT, **change}).status_code == 422
    )


@pytest.mark.parametrize("field", ["name", "email", "password"])
def test_missing_registration_field(client, field):
    data = ACCOUNT.copy()
    del data[field]
    assert client.post("/api/auth/register", json=data).status_code == 422


def test_login_and_me(client):
    user = register(client).json()
    response = login(client)
    assert response.status_code == 200
    assert response.headers["cache-control"] == "no-store"
    data = response.json()
    assert data["token_type"] == "bearer"
    assert data["user"] == user
    claims = jwt.decode(
        data["access_token"],
        settings.jwt_secret.get_secret_value(),
        algorithms=["HS256"],
        audience=settings.jwt_audience,
        issuer=settings.jwt_issuer,
    )
    assert claims["sub"] == str(user["id"])
    assert claims["exp"] > claims["iat"]
    me = client.get(
        "/api/auth/me", headers={"Authorization": f"Bearer {data['access_token']}"}
    )
    assert me.status_code == 200
    assert me.json() == user
    assert "password_hash" not in response.text + me.text


def test_uniform_invalid_login(client, db):
    register(client)
    wrong = login(client, password="incorrect")
    unknown = login(client, email="unknown@example.com")
    user = db.scalar(select(User).where(User.email == "asha@example.com"))
    user.is_active = False
    db.commit()
    inactive = login(client)
    for response in (wrong, unknown, inactive):
        assert response.status_code == 401
        assert response.headers["www-authenticate"] == "Bearer"
        assert response.json() == wrong.json()


@pytest.mark.parametrize(
    "authorization", [None, "Basic abc", "Bearer garbage", "Bearer"]
)
def test_missing_or_bad_auth(client, authorization):
    headers = {"Authorization": authorization} if authorization else {}
    assert client.get("/api/auth/me", headers=headers).status_code == 401


@pytest.mark.parametrize(
    "change",
    [
        {"exp": 1},
        {"iss": "wrong"},
        {"aud": "wrong"},
        {"sub": "invalid"},
        {"sub": "99999999999999999999999"},
        {"sub": "999999"},
        {"type": "refresh"},
        {"iat": 9999999999},
    ],
)
def test_invalid_claims(client, change):
    user = register(client).json()
    now = datetime.now(timezone.utc)
    claims = {
        "sub": str(user["id"]),
        "iat": now,
        "exp": now + timedelta(minutes=5),
        "iss": settings.jwt_issuer,
        "aud": settings.jwt_audience,
        "type": "access",
        **change,
    }
    token = jwt.encode(
        claims, settings.jwt_secret.get_secret_value(), algorithm="HS256"
    )
    assert (
        client.get(
            "/api/auth/me", headers={"Authorization": f"Bearer {token}"}
        ).status_code
        == 401
    )


def test_wrong_signature_and_missing_claim(client):
    user = register(client).json()
    token = login(client).json()["access_token"]
    claims = jwt.decode(token, options={"verify_signature": False})
    for invalid in [
        jwt.encode(claims, "x" * 48, algorithm="HS256"),
        jwt.encode(
            {"sub": str(user["id"])},
            settings.jwt_secret.get_secret_value(),
            algorithm="HS256",
        ),
    ]:
        assert (
            client.get(
                "/api/auth/me", headers={"Authorization": f"Bearer {invalid}"}
            ).status_code
            == 401
        )


@pytest.mark.parametrize("delete", [False, True])
def test_existing_token_rejects_disabled_or_deleted_user(client, db, delete):
    register(client)
    token = login(client).json()["access_token"]
    user = db.scalar(select(User).where(User.email == "asha@example.com"))
    if delete:
        db.delete(user)
    else:
        user.is_active = False
    db.commit()
    assert (
        client.get(
            "/api/auth/me", headers={"Authorization": f"Bearer {token}"}
        ).status_code
        == 401
    )


def test_openapi_auth_contract(client):
    schema = client.get("/openapi.json").json()
    assert schema["paths"]["/api/auth/me"]["get"]["security"] == [{"HTTPBearer": []}]
    assert "password_hash" not in str(schema["components"]["schemas"]["UserResponse"])
