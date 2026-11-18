"""Guest contributions behavior and demo payment rules."""

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
def item_id(client):
    auth = authenticate(client)
    client.post("/api/couples", headers=auth, json=COUPLE)
    res = client.post(
        "/api/wishlists/me/items",
        headers=auth,
        json={"title": "Honeymoon Flight", "target_amount": 100000},
    )
    return res.json()["id"]


def test_guest_contribute_success(client, item_id):
    payload = {
        "contributor_name": "Rahul Verma",
        "amount": 5000,
        "message": "Have a wonderful honeymoon! ✈️",
        "payment_mode": "DEMO",
    }
    response = client.post(f"/api/wishlist-items/{item_id}/contribute", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["amount"] == 5000.0
    assert data["amount_paise"] == 500000
    assert data["contributor_name"] == "Rahul Verma"
    assert data["payment_mode"] == "DEMO"
    assert data["message"] == "Have a wonderful honeymoon! ✈️"

    # Verify wishlist item progress updated
    public_res = client.get("/api/couples/asha-and-rohan/wishlist")
    item = public_res.json()[0]
    assert item["current_amount"] == 5000.0
    assert item["current_amount_paise"] == 500000


def test_reject_non_demo_payment_mode(client, item_id):
    payload = {
        "contributor_name": "Hacker",
        "amount": 1000,
        "payment_mode": "REAL",
    }
    response = client.post(f"/api/wishlist-items/{item_id}/contribute", json=payload)
    assert response.status_code == 422


def test_reject_negative_or_zero_amount(client, item_id):
    payload = {
        "amount": -500,
        "payment_mode": "DEMO",
    }
    response = client.post(f"/api/wishlist-items/{item_id}/contribute", json=payload)
    assert response.status_code == 422


def test_owner_can_view_contributions_ledger(client):
    auth = authenticate(client, "owner@example.com")
    client.post("/api/couples", headers=auth, json={**COUPLE, "slug": "owner-couple"})
    create_res = client.post(
        "/api/wishlists/me/items",
        headers=auth,
        json={"title": "Dining Table", "target_amount": 25000},
    )
    iid = create_res.json()["id"]

    # Guest 1
    client.post(
        f"/api/wishlist-items/{iid}/contribute",
        json={"contributor_name": "Pooja", "amount": 2500, "message": "Congrats!"},
    )
    # Guest 2
    client.post(
        f"/api/wishlist-items/{iid}/contribute",
        json={"contributor_name": "Amit", "amount": 5000},
    )

    # Owner views ledger
    ledger_res = client.get("/api/contributions/me", headers=auth)
    assert ledger_res.status_code == 200
    ledger = ledger_res.json()
    assert len(ledger) == 2
    assert ledger[0]["item_title"] == "Dining Table"
