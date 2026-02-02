# PowerShell deployment script for All Things Doc Backend

Write-Host "Starting deployment of All Things Doc Backend..." -ForegroundColor Green

# Check if we're in the backend directory
if (-not (Test-Path "main.py")) {
    Write-Host "Error: main.py not found. Please run this script from the backend directory." -ForegroundColor Red
    exit 1
}

# Check if requirements.txt exists
if (-not (Test-Path "requirements.txt")) {
    Write-Host "Error: requirements.txt not found." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements.txt

# Run tests to verify the application
Write-Host "Running tests..." -ForegroundColor Yellow
python -m pytest test_main.py -v

# Start the application
Write-Host "Starting the application..." -ForegroundColor Yellow
uvicorn main:app --host 0.0.0.0 --port 8000 --reload