import pytest
from app import create_app

@pytest.fixture
def client():
    app = create_app("development")
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json["status"] == "healthy"

def test_login_demo_government_user(client):
    response = client.post("/api/v1/auth/login", json={
        "email": "officer@jalshakti.gov.in",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "token" in response.json
    assert response.json["user"]["role"] == "GOVERNMENT"
    assert response.json["portalUrl"] == "/government/dashboard"

def test_get_problems(client):
    response = client.get("/api/v1/problems")
    assert response.status_code == 200
    assert "data" in response.json
