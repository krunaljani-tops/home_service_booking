import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "HomeServe" in data["app_name"]


def test_openapi_docs_endpoint():
    response = client.get("/docs")
    assert response.status_code == 200
    openapi = client.get("/openapi.json")
    assert openapi.status_code == 200
    spec = openapi.json()
    assert spec["info"]["title"] == "HomeServe Technologies"
    assert "/api/v1/auth/login" in spec["paths"]
    assert "/api/v1/bookings" in spec["paths"]


def test_unauthorized_access_to_protected_endpoint():
    response = client.get("/api/v1/auth/me")
    assert response.status_code == 401


def test_invalid_login_validation():
    # missing password
    response = client.post("/api/v1/auth/login", json={"email": "nonexistent@homeserve.com"})
    assert response.status_code == 422

