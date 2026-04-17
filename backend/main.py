from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import os

# Set up basic logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    # Import our API router
    from api import router
    logger.info("API router imported successfully")
except ImportError as e:
    logger.error(f"Error importing API router: {e}")
    # If there's an import error, create basic app for health checks
    from fastapi import APIRouter
    router = APIRouter()

app = FastAPI(
    title="All Things Doc - Processing Engine",
    description="Efficient document processing backend using open-source models",
    version="1.0.0"
)

# Add CORS middleware to allow requests from the frontend
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include our API router
try:
    app.include_router(router)
    logger.info("API router included successfully")
except Exception as e:
    logger.error(f"Error including API router: {e}")

@app.get("/")
async def root():
    return {"message": "All Things Doc Processing Engine API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)