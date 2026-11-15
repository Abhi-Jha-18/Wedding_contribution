"""Response schemas for the initial status endpoints."""

from pydantic import BaseModel


class StatusResponse(BaseModel):
    status: str
    service: str
