"""Pydantic schemas for guestbook wishes and messages."""

from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, ConfigDict, StringConstraints


class GuestMessageCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    guest_name: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
    message: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=2000)]


class GuestMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    couple_id: int
    guest_name: str
    message: str
    is_approved: bool = True
    created_at: datetime
