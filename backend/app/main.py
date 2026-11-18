"""FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routes.auth import router as auth_router
from app.routes.contribution import router as contribution_router
from app.routes.couple import router as couple_router
from app.routes.guest_message import router as guest_message_router
from app.routes.status import router as status_router
from app.routes.wishlist import router as wishlist_router

app = FastAPI(
    title=settings.app_name,
    version="0.3.0",
    description="Wedding Wishlist Platform API: Auth, Profiles, Wishlists, Demo Contributions & Guestbook.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(status_router)
app.include_router(auth_router)
app.include_router(couple_router)
app.include_router(wishlist_router)
app.include_router(contribution_router)
app.include_router(guest_message_router)
