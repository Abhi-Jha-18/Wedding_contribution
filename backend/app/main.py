"""FastAPI application entry point."""

from fastapi import FastAPI

from app.core.config import settings
from app.routes.auth import router as auth_router
from app.routes.couple import router as couple_router
from app.routes.status import router as status_router

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="Wedding Wishlist API with Argon2id passwords and short-lived JWT bearer authentication.",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.include_router(status_router)
app.include_router(auth_router)
app.include_router(couple_router)
