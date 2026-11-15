"""Wedding API behavior, ownership boundaries and durable persistence."""

import os
import subprocess
import sys

import pytest
from app.models import Base, Couple
from sqlalchemy import create_engine, select

PROFILE = {
    "partner_one_name": "  Asha Jha ",
    "partner_two_name": "Rohan Kumar",
    "wedding_date": "2027-02-14",
    "venue": "Muzaffarnagar",
    "story": "Our story",
    "slug": "  ASHA-and-Rohan  ",
    "photo": "https://images.example.com/wedding.jpg",
}
REQUIRED = {
    key: value for key, value in PROFILE.items() if key not in {"story", "photo"}
}
PUBLIC_FIELDS = {
    "partner_one_name",
    "partner_two_name",
    "wedding_date",
    "venue",
    "story",
    "slug",
    "photo",
}


def authenticate(client, email="asha@example.com"):
    account = {"name": "Asha", "email": email, "password": "a-long-test-password"}
    assert client.post("/api/auth/register", json=account).status_code == 201
    token = client.post(
        "/api/auth/login", json={"email": email, "password": account["password"]}
    ).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth(client):
    return authenticate(client)


def test_create_and_get_own_profile(client, db, auth):
    response = client.post("/api/couples", headers=auth, json=PROFILE)
    assert response.status_code == 201
    data = response.json()
    assert set(data) == PUBLIC_FIELDS
    assert data == {**PROFILE, "partner_one_name": "Asha Jha", "slug": "asha-and-rohan"}
    assert client.get("/api/couples/me", headers=auth).json() == data
    stored = db.scalar(select(Couple).where(Couple.slug == "asha-and-rohan"))
    assert stored.owner.email == "asha@example.com"
    assert stored.photo == PROFILE["photo"]


@pytest.mark.parametrize(
    "method,path,body",
    [
        ("post", "/api/couples", PROFILE),
        ("get", "/api/couples/me", None),
        ("put", "/api/couples/me", PROFILE),
    ],
)
@pytest.mark.parametrize("headers", [{}, {"Authorization": "Bearer invalid"}])
def test_private_endpoints_require_auth(client, method, path, body, headers):
    response = client.request(method, path, json=body, headers=headers)
    assert response.status_code == 401


def test_missing_profile(client, auth):
    assert client.get("/api/couples/me", headers=auth).status_code == 404
    assert client.put("/api/couples/me", headers=auth, json=PROFILE).status_code == 404


def test_update_preserves_omitted_and_clears_optional(client, auth):
    assert client.post("/api/couples", headers=auth, json=PROFILE).status_code == 201
    response = client.put(
        "/api/couples/me",
        headers=auth,
        json={**REQUIRED, "partner_two_name": "Rohan Jha", "slug": "new-slug"},
    )
    assert response.status_code == 200
    assert response.json()["story"] == PROFILE["story"]
    assert response.json()["photo"] == PROFILE["photo"]
    assert response.json()["partner_two_name"] == "Rohan Jha"
    assert client.get("/api/couples/asha-and-rohan").status_code == 404
    assert client.get("/api/couples/new-slug").json() == response.json()
    response = client.put(
        "/api/couples/me", headers=auth, json={**REQUIRED, "story": None, "photo": None}
    )
    assert response.status_code == 200
    assert response.json()["story"] is None
    assert response.json()["photo"] is None


def test_duplicate_owner_and_slug(client, auth):
    assert client.post("/api/couples", headers=auth, json=PROFILE).status_code == 201
    assert (
        client.post(
            "/api/couples", headers=auth, json={**PROFILE, "slug": "different"}
        ).status_code
        == 409
    )
    other = authenticate(client, "other@example.com")
    assert (
        client.post(
            "/api/couples", headers=other, json={**PROFILE, "slug": "ASHA-AND-ROHAN"}
        ).status_code
        == 409
    )
    assert (
        client.post(
            "/api/couples", headers=other, json={**PROFILE, "slug": "other"}
        ).status_code
        == 201
    )
    assert client.put("/api/couples/me", headers=other, json=PROFILE).status_code == 409
    assert client.get("/api/couples/me", headers=other).json()["slug"] == "other"
    # Updating with your own unchanged slug must be allowed.
    assert client.put("/api/couples/me", headers=auth, json=PROFILE).status_code == 200


def test_ownership_cannot_be_spoofed(client, auth):
    original = client.post("/api/couples", headers=auth, json=PROFILE).json()
    other = authenticate(client, "other@example.com")
    assert client.get("/api/couples/me", headers=other).status_code == 404
    assert client.put("/api/couples/me", headers=other, json=PROFILE).status_code == 404
    for method in ("post", "put"):
        path = "/api/couples" if method == "post" else "/api/couples/me"
        response = client.request(
            method, path, headers=other, json={**PROFILE, "owner_user_id": 1}
        )
        assert response.status_code == 422
    assert (
        client.put(
            "/api/couples/asha-and-rohan", headers=other, json=PROFILE
        ).status_code
        == 405
    )
    # A query parameter cannot select another user's private profile.
    assert (
        client.get("/api/couples/me?owner_user_id=1", headers=other).status_code == 404
    )
    assert client.get("/api/couples/me", headers=auth).json() == original
    assert (
        client.post(
            "/api/couples", headers=other, json={**PROFILE, "slug": "other"}
        ).status_code
        == 201
    )
    assert client.get("/api/couples/me", headers=other).json()["slug"] == "other"


def test_public_profile_and_unknown_slug(client, auth):
    original = client.post("/api/couples", headers=auth, json=PROFILE).json()
    response = client.get("/api/couples/ASHA-AND-ROHAN")
    assert response.status_code == 200
    assert response.json() == original
    assert set(response.json()) == PUBLIC_FIELDS
    assert client.get("/api/couples/not-found").status_code == 404


@pytest.mark.parametrize(
    "change",
    [
        {"partner_one_name": " "},
        {"partner_two_name": None},
        {"partner_one_name": "x" * 121},
        {"venue": " "},
        {"venue": "x" * 256},
        {"slug": "me"},
        {"slug": " ME "},
        {"slug": "bad slug"},
        {"slug": "-bad"},
        {"slug": "bad--slug"},
        {"slug": "bad_thing"},
        {"slug": "é"},
        {"slug": "a" * 101},
        {"slug": ""},
        {"wedding_date": "2027-02-30"},
        {"wedding_date": "14-02-2027"},
        {"wedding_date": 1800000000},
        {"wedding_date": "2027-02-14T00:00:00"},
        {"wedding_date": None},
        {"story": "x" * 10001},
        {"photo": "blob:http://localhost/local-preview"},
        {"photo": "data:image/png;base64,abcd"},
        {"photo": "javascript:alert(1)"},
        {"photo": "https://user:pass@example.com/image.jpg"},
        {"photo": "https://example.com/" + "x" * 2048},
        {"id": 123},
    ],
)
@pytest.mark.parametrize("method", ["post", "put"])
def test_validation(client, auth, change, method):
    if method == "put":
        assert (
            client.post("/api/couples", headers=auth, json=PROFILE).status_code == 201
        )
    path = "/api/couples" if method == "post" else "/api/couples/me"
    assert (
        client.request(
            method, path, headers=auth, json={**PROFILE, **change}
        ).status_code
        == 422
    )


@pytest.mark.parametrize("field", list(REQUIRED))
def test_required_fields(client, auth, field):
    data = REQUIRED.copy()
    del data[field]
    assert client.post("/api/couples", headers=auth, json=data).status_code == 422
    assert client.put("/api/couples/me", headers=auth, json=data).status_code == 422


def test_optional_fields_and_past_dates(client, auth):
    response = client.post(
        "/api/couples", headers=auth, json={**REQUIRED, "wedding_date": "2020-02-29"}
    )
    assert response.status_code == 201
    assert response.json()["photo"] is None
    assert response.json()["story"] is None


def test_openapi_profile_security(client):
    schema = client.get("/openapi.json").json()
    paths = schema["paths"]
    for path, method in [
        ("/api/couples", "post"),
        ("/api/couples/me", "get"),
        ("/api/couples/me", "put"),
    ]:
        assert paths[path][method]["security"] == [{"HTTPBearer": []}]
    assert not paths["/api/couples/{slug}"]["get"].get("security")
    assert (
        set(schema["components"]["schemas"]["CoupleResponse"]["properties"])
        == PUBLIC_FIELDS
    )


def test_persistence_across_backend_process_restarts(test_engine, tmp_path):
    """Use committed data and fresh Python processes, not shared ORM state."""
    if test_engine.dialect.name == "postgresql":
        engine = test_engine
    else:
        engine = create_engine(f"sqlite:///{tmp_path / 'persistence.db'}")
        Base.metadata.create_all(engine)
    url = engine.url.render_as_string(hide_password=False)
    env = {**os.environ, "DATABASE_URL": url}
    common = """
from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)
"""
    create_script = (
        common
        + f"""
account = {{"name": "Persistent", "email": "persistent@example.com", "password": "a-long-test-password"}}
assert client.post("/api/auth/register", json=account).status_code == 201
r = client.post("/api/auth/login", json={{"email": account["email"], "password": account["password"]}})
headers = {{"Authorization": "Bearer " + r.json()["access_token"]}}
r = client.post("/api/couples", headers=headers, json={PROFILE!r})
assert r.status_code == 201, r.text
"""
    )
    read_script = (
        common
        + """
r = client.get("/api/couples/asha-and-rohan")
assert r.status_code == 200, r.text
assert r.json()["photo"] == "https://images.example.com/wedding.jpg"
assert r.json()["wedding_date"] == "2027-02-14"
r = client.post("/api/auth/login", json={"email": "persistent@example.com", "password": "a-long-test-password"})
headers = {"Authorization": "Bearer " + r.json()["access_token"]}
assert client.get("/api/couples/me", headers=headers).json()["slug"] == "asha-and-rohan"
"""
    )
    try:
        for script in (create_script, read_script):
            result = subprocess.run(
                [sys.executable, "-c", script],
                env=env,
                check=False,
                capture_output=True,
                text=True,
                timeout=60,
            )
            assert result.returncode == 0, result.stdout + result.stderr
    finally:
        from app.models import User
        from sqlalchemy import delete

        with engine.begin() as connection:
            ids = select(User.id).where(User.email == "persistent@example.com")
            connection.execute(delete(Couple).where(Couple.owner_user_id.in_(ids)))
            connection.execute(
                delete(User).where(User.email == "persistent@example.com")
            )
        if engine is not test_engine:
            engine.dispose()


@pytest.mark.parametrize("conflict", ["owner", "slug", "update"])
def test_database_unique_conflict_after_precheck(client, auth, monkeypatch, conflict):
    """Bypass the initial optimistic check to exercise actual unique-index recovery."""
    from app.services import couple as service

    assert client.post("/api/couples", headers=auth, json=PROFILE).status_code == 201
    other = authenticate(client, "other@example.com")
    if conflict == "update":
        assert (
            client.post(
                "/api/couples", headers=other, json={**PROFILE, "slug": "other"}
            ).status_code
            == 201
        )
    original = service.check_conflicts
    calls = 0

    def skip_first(*args, **kwargs):
        nonlocal calls
        calls += 1
        if calls > 1:
            return original(*args, **kwargs)

    monkeypatch.setattr(service, "check_conflicts", skip_first)
    if conflict == "owner":
        response = client.post(
            "/api/couples", headers=auth, json={**PROFILE, "slug": "new"}
        )
    elif conflict == "slug":
        response = client.post("/api/couples", headers=other, json=PROFILE)
    else:
        response = client.put("/api/couples/me", headers=other, json=PROFILE)
    assert response.status_code == 409
    assert calls == 2
    assert (
        client.get("/api/couples/me", headers=auth).json()["slug"] == "asha-and-rohan"
    )
    if conflict == "update":
        assert client.get("/api/couples/me", headers=other).json()["slug"] == "other"
