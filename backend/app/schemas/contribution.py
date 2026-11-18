"""Pydantic schemas for guest contributions."""

from datetime import datetime
from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field, StringConstraints

TrimmedString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]


class ContributionCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    contributor_name: Annotated[str, StringConstraints(strip_whitespace=True, max_length=120)] | None = None
    amount_paise: int | None = Field(default=None, gt=0)
    amount: float | None = Field(default=None, gt=0, description="Amount in INR Rupees (e.g. 5000)")
    message: Annotated[str, StringConstraints(strip_whitespace=True, max_length=2000)] | None = None
    payment_mode: Literal["DEMO"] = "DEMO"

    def resolve_amount_paise(self) -> int:
        if self.amount_paise is not None:
            return self.amount_paise
        if self.amount is not None:
            return int(round(self.amount * 100))
        raise ValueError("Either amount or amount_paise must be provided and greater than zero.")


class ContributionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    wishlist_item_id: int
    contributor_name: str | None = None
    amount_paise: int
    amount: float
    payment_mode: str = "DEMO"
    message: str | None = None
    created_at: datetime


class OwnerContributionResponse(ContributionResponse):
    item_title: str
