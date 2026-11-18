"""Guestbook wishes behavior and validation."""

import pytest

COUPLE = {
    "partner_one_name": "Asha Jha",
    "partner_two_name": "Rohan Kumar",
    "wedding_date": "2027-02-14",
    "venue": "Muzaffarnagar",
    "slug": "asha-and-rohan",
}


def authenticate(client, email="asha@example.com"):
    account = {"name": "Asha", "email": email, "password": "a-long-test-password"}
    client.post("/api/auth/register", json=account)
    token = client.post(
        "/api/auth/login", json={"email": email, "password": account["password"]}
    ).json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def couple_auth(client):
    auth = authenticate(client)
    res = client.post("/api/couples", headers=auth, json=COUPLE)
    assert res.status_code == 201
    return auth


def test_leave_guest_wish_and_retrieve(client, couple_auth):
    wish_payload = {
        "guest_name": "Ananya Sharma",
        "message": "Wishing you both endless love and happiness! 💖",
    }
    response = client.post("/api/couples/asha-and-rohan/messages", json=wish_payload)
    assert response.status_code == 201
    wish = response.json()
    assert wish["guest_name"] == "Ananya Sharma"
    assert wish["message"] == "Wishing you both endless love and happiness! 💖"
    assert wish["is_approved"] is True

    # Public list
    public_res = client.get("/api/couples/asha-and-rohan/messages")
    assert public_res.status_code == 200
    messages = public_res.json()
    assert len(messages) == 1
    assert messages[0]["guest_name"] == "Ananya Sharma"

    # Owner list
    owner_res = client.get("/api/messages/me", headers=couple_auth)
    assert owner_res.status_code == 200
    assert len(owner_res.json()) == 1


def test_wish_nonexistent_couple_404(client):
    res = client.post(
        "/api/couples/unknown-slug/messages",
        json={"guest_name": "Ghost", "message": "Hello"},
    )
    assert res.status_code == 404


def test_empty_message_rejected(client, couple_auth):
    res = client.post(
        "/api/couples/asha-and-rohan/messages",
        json={"guest_name": "Tester", "message": "   "},
    )
    assert res.status_code == 422
