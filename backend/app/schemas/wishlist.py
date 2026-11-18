"""Pydantic schemas for wishlist and wishlist items."""

from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator

TrimmedString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class WishlistResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    couple_id: int
    title: str
    description: str | None = None
    created_at: datetime
    updated_at: datetime


class WishlistItemCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)]
    description: Annotated[str, StringConstraints(strip_whitespace=True, max_length=5000)] | None = None
    target_amount_paise: int | None = Field(default=None, gt=0)
    target_amount: float | None = Field(default=None, gt=0, description="Amount in INR Rupees (e.g. 50000)")
    category: Annotated[str, StringConstraints(strip_whitespace=True, max_length=60)] | None = "Other"
    quantity: int = Field(default=1, gt=0)
    display_order: int = Field(default=0, ge=0)

    @field_validator("target_amount_paise", mode="after")
    @classmethod
    def validate_amount(cls, v: int | None, info) -> int | None:
        return v

    def resolve_amount_paise(self) -> int | None:
        if self.target_amount_paise is not None:
            return self.target_amount_paise
        if self.target_amount is not None:
            return int(round(self.target_amount * 100))
        return None


class WishlistItemUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=160)] | None = None
    description: Annotated[str, StringConstraints(strip_whitespace=True, max_length=5000)] | None = None
    target_amount_paise: int | None = Field(default=None, gt=0)
    target_amount: float | None = Field(default=None, gt=0)
    category: Annotated[str, StringConstraints(strip_whitespace=True, max_length=60)] | None = None
    quantity: int | None = Field(default=None, gt=0)
    display_order: int | None = Field(default=None, ge=0)
    is_active: bool | None = None

    def resolve_amount_paise(self) -> int | None:
        if self.target_amount_paise is not None:
            return self.target_amount_paise
        if self.target_amount is not None:
            return int(round(self.target_amount * 100))
        return None


class WishlistItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    wishlist_id: int
    title: str
    description: str | None = None
    target_amount_paise: int | None = None
    target_amount: float | None = None
    current_amount_paise: int = 0
    current_amount: float = 0.0
    category: str | None = "Other"
    quantity: int = 1
    display_order: int = 0
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
