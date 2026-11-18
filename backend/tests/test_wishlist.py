"""Wishlist and items API behavior and ownership boundaries."""

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


def test_list_empty_wishlist_items(client, couple_auth):
    response = client.get("/api/wishlists/me/items", headers=couple_auth)
    assert response.status_code == 200
    assert response.json() == []


def test_create_and_list_wishlist_items(client, couple_auth):
    item_payload = {
        "title": "Dream Honeymoon in Bali",
        "description": "2 weeks private villa",
        "target_amount": 150000,
        "category": "Honeymoon",
    }
    create_res = client.post("/api/wishlists/me/items", headers=couple_auth, json=item_payload)
    assert create_res.status_code == 201
    item = create_res.json()
    assert item["title"] == "Dream Honeymoon in Bali"
    assert item["target_amount"] == 150000.0
    assert item["target_amount_paise"] == 15000000
    assert item["current_amount"] == 0.0
    assert item["category"] == "Honeymoon"

    # List items
    list_res = client.get("/api/wishlists/me/items", headers=couple_auth)
    assert list_res.status_code == 200
    assert len(list_res.json()) == 1
    assert list_res.json()[0]["id"] == item["id"]


def test_update_wishlist_item(client, couple_auth):
    create_res = client.post(
        "/api/wishlists/me/items",
        headers=couple_auth,
        json={"title": "Sofa Set", "target_amount": 50000, "category": "Furniture"},
    )
    item_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/wishlists/me/items/{item_id}",
        headers=couple_auth,
        json={"title": "Luxury Italian Sofa", "target_amount": 75000},
    )
    assert update_res.status_code == 200
    updated = update_res.json()
    assert updated["title"] == "Luxury Italian Sofa"
    assert updated["target_amount"] == 75000.0
    assert updated["category"] == "Furniture"


def test_delete_wishlist_item(client, couple_auth):
    create_res = client.post(
        "/api/wishlists/me/items",
        headers=couple_auth,
        json={"title": "Coffee Maker", "target_amount": 5000},
    )
    item_id = create_res.json()["id"]

    del_res = client.delete(f"/api/wishlists/me/items/{item_id}", headers=couple_auth)
    assert del_res.status_code == 204

    # Verify deleted
    list_res = client.get("/api/wishlists/me/items", headers=couple_auth)
    assert len(list_res.json()) == 0


def test_public_wishlist_view(client, couple_auth):
    client.post(
        "/api/wishlists/me/items",
        headers=couple_auth,
        json={"title": "Dinner Set", "target_amount": 8000, "category": "Kitchen"},
    )
    # Inactive item should not appear in public view
    inactive_res = client.post(
        "/api/wishlists/me/items",
        headers=couple_auth,
        json={"title": "Hidden Item", "target_amount": 1000},
    )
    client.put(
        f"/api/wishlists/me/items/{inactive_res.json()['id']}",
        headers=couple_auth,
        json={"is_active": False},
    )

    public_res = client.get("/api/couples/asha-and-rohan/wishlist")
    assert public_res.status_code == 200
    items = public_res.json()
    assert len(items) == 1
    assert items[0]["title"] == "Dinner Set"


def test_cannot_modify_other_couples_item(client, couple_auth):
    create_res = client.post(
        "/api/wishlists/me/items",
        headers=couple_auth,
        json={"title": "Private Item", "target_amount": 10000},
    )
    item_id = create_res.json()["id"]

    # Other user
    other_auth = authenticate(client, "other@example.com")
    client.post(
        "/api/couples",
        headers=other_auth,
        json={**COUPLE, "slug": "other-couple"},
    )

    # Trying to update someone else's item returns 404
    put_res = client.put(
        f"/api/wishlists/me/items/{item_id}",
        headers=other_auth,
        json={"title": "Hacked Title"},
    )
    assert put_res.status_code == 404
