import pytest
from unittest.mock import patch

# Skip all tests in this module if fastapi is not installed
pytest.importorskip("fastapi")

from fastapi.testclient import TestClient
from main import app

def test_health_check():
    """Test the health check endpoint"""
    client = TestClient(app)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_root_endpoint():
    """Test the root endpoint"""
    client = TestClient(app)
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "All Things Doc Processing Engine API" in data["message"]

def test_pdf_endpoints_exist():
    """Test that pdf endpoints are properly routed (will return 422 for missing files)"""
    client = TestClient(app)
    response = client.post("/pdf/extract-text")
    # Should return 422 (validation error) not 404 (not found)
    assert response.status_code in [422, 400]

def test_ai_endpoints_exist():
    """Test that ai endpoints are properly routed"""
    client = TestClient(app)
    response = client.post("/ai/summarize", data={"text": "Hello world"})
    # Should return 200 with a summary
    assert response.status_code == 200

@pytest.mark.parametrize("input_str, expected_list", [
    ("1,2", [1, 2]),
    (" 1 , 3 ", [1, 3]),
    ("a, 2, b, 4", [2, 4]),
    ("", []),
    ("garbage", []),
])
@patch("api.split_pdf")
def test_split_pdf_endpoint_parsing(mock_split_pdf, input_str, expected_list):
    """Test that split points are correctly parsed from form data and passed to processing logic"""
    client = TestClient(app)

    # Mock split_pdf to return a list of dummy bytes
    mock_split_pdf.return_value = [b"part1", b"part2"]

    # Create a dummy PDF file content
    file_content = b"%PDF-1.4 dummy content"
    files = {"file": ("test.pdf", file_content, "application/pdf")}
    data = {"split_points": input_str}

    response = client.post("/pdf/split", files=files, data=data)

    assert response.status_code == 200
    # Verify split_pdf was called with the correctly parsed list
    mock_split_pdf.assert_called_with(file_content, expected_list)
