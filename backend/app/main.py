"""FastAPI application entry point."""

from fastapi import FastAPI

from app.core.config import settings
from app.routes.status import router as status_router

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Backend foundation for the Wedding Wishlist Platform.",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.include_router(status_router)
