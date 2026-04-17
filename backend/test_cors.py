import os
import pytest
from fastapi.testclient import TestClient
from importlib import reload
import main

def test_cors_default_origins():
    """Test CORS with default allowed origins"""
    # Force reload main to pick up default env if it was changed in other tests
    if "ALLOWED_ORIGINS" in os.environ:
        del os.environ["ALLOWED_ORIGINS"]
    reload(main)
    client = TestClient(main.app)

    # Allowed origin
    response = client.get("/health", headers={"Origin": "http://localhost:5173"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"

    # Disallowed origin
    response = client.get("/health", headers={"Origin": "http://malicious.com"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") is None

def test_cors_custom_origins():
    """Test CORS with custom allowed origins from environment variable"""
    os.environ["ALLOWED_ORIGINS"] = "https://myapp.com, https://another.com"
    reload(main)
    client = TestClient(main.app)

    # Allowed custom origin
    response = client.get("/health", headers={"Origin": "https://myapp.com"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://myapp.com"

    # Another allowed custom origin
    response = client.get("/health", headers={"Origin": "https://another.com"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://another.com"

    # Disallowed origin
    response = client.get("/health", headers={"Origin": "http://localhost:5173"})
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") is None

    # Cleanup
    del os.environ["ALLOWED_ORIGINS"]
    reload(main)
