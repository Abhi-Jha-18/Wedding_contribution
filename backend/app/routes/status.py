"""Basic liveness/status endpoints; these do not access the database."""

from fastapi import APIRouter

from app.core.config import settings
from app.schemas.status import StatusResponse

router = APIRouter(tags=["status"])


@router.get("/", response_model=StatusResponse)
def api_status() -> StatusResponse:
    """Return a small API status response."""

    return StatusResponse(status="ok", service=settings.app_name)


@router.get("/health", response_model=StatusResponse)
def health_check() -> StatusResponse:
    """Liveness check. Database readiness is verified separately via migrations."""

    return StatusResponse(status="healthy", service=settings.app_name)
