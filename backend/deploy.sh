#!/bin/bash
# Deployment script for All Things Doc Backend

set -e  # Exit immediately if a command exits with a non-zero status

echo "Starting deployment of All Things Doc Backend..."

# Check if we're in the backend directory
if [ ! -f "main.py" ]; then
    echo "Error: main.py not found. Please run this script from the backend directory."
    exit 1
fi

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    echo "Error: requirements.txt not found."
    exit 1
fi

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Run tests to verify the application
echo "Running tests..."
python -m pytest test_main.py -v

# Start the application
echo "Starting the application..."
uvicorn main:app --host 0.0.0.0 --port 8000 --reload