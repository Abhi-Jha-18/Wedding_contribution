from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_returns_api_status() -> None:
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_health_returns_healthy() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_swagger_and_openapi_are_available() -> None:
    docs_response = client.get("/docs")
    schema_response = client.get("/openapi.json")
    assert docs_response.status_code == 200
    assert "Swagger UI" in docs_response.text
    assert schema_response.status_code == 200
    assert "/health" in schema_response.json()["paths"]
