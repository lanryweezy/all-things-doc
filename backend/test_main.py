import pytest
import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    """Test the health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "All Things Doc Processing Engine API" in data["message"]

def test_pdf_endpoints_exist():
    """Test that pdf endpoints are properly routed (will return 422 for missing files)"""
    response = client.post("/pdf/extract-text")
    # Should return 422 (validation error) not 404 (not found)
    assert response.status_code in [422, 400]

def test_ai_endpoints_exist():
    """Test that ai endpoints are properly routed"""
    response = client.post("/ai/summarize", data={"text": "Hello world"})
    # Should return 200 with a summary
    assert response.status_code == 200