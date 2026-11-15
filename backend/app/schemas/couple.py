"""Wedding contracts use snake_case, with no account or owner fields."""

import re
from datetime import date
from typing import Annotated

from pydantic import (
    AfterValidator,
    BaseModel,
    BeforeValidator,
    ConfigDict,
    Field,
    HttpUrl,
    StringConstraints,
    TypeAdapter,
)


def normalize_slug(value: object) -> object:
    return value.strip().lower() if isinstance(value, str) else value


def validate_slug(value: str) -> str:
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", value):
        raise ValueError(
            "Slug must contain lowercase ASCII letters, digits and single hyphens"
        )
    if value == "me":
        raise ValueError("The slug 'me' is reserved")
    return value


Slug = Annotated[
    str,
    BeforeValidator(normalize_slug),
    StringConstraints(min_length=1, max_length=100),
    AfterValidator(validate_slug),
]
Name = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)
]
Venue = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)
]
Story = Annotated[str, StringConstraints(strip_whitespace=True, max_length=10000)]


def validate_photo(value: str) -> str:
    url = TypeAdapter(HttpUrl).validate_python(value)
    if url.username is not None or url.password is not None:
        raise ValueError("Photo URL must not contain credentials")
    result = str(url)
    if len(result) > 2048:
        raise ValueError("Photo URL must be at most 2048 characters")
    return result


Photo = Annotated[
    str, StringConstraints(max_length=2048), AfterValidator(validate_photo)
]


def validate_date(value: object) -> object:
    # Reject timestamps/numeric coercion: this API accepts a calendar date only.
    if isinstance(value, str) and re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
        return date.fromisoformat(value)
    if type(value) is date:
        return value
    raise ValueError("Wedding date must use YYYY-MM-DD")


WeddingDate = Annotated[date, BeforeValidator(validate_date)]


class CoupleWrite(BaseModel):
    model_config = ConfigDict(
        extra="forbid",
        json_schema_extra={
            "examples": [
                {
                    "partner_one_name": "Asha Jha",
                    "partner_two_name": "Rohan Kumar",
                    "wedding_date": "2027-02-14",
                    "venue": "Muzaffarnagar, Uttar Pradesh",
                    "story": "Join us to celebrate!",
                    "slug": "asha-and-rohan",
                    "photo": "https://images.example.com/wedding.jpg",
                }
            ]
        },
    )
    partner_one_name: Name
    partner_two_name: Name
    wedding_date: WeddingDate = Field(
        description="Calendar date in YYYY-MM-DD format; valid past dates are allowed"
    )
    venue: Venue
    slug: Slug = Field(
        description="Trimmed and lowercased, 1–100 ASCII letters/digits separated by single hyphens; me is reserved"
    )
    story: Story | None = None
    photo: Photo | None = Field(
        default=None,
        description="HTTP(S) image URL, not an upload. No blob/data URLs or URL credentials. Omit on update to preserve; null clears.",
    )


class CoupleCreate(CoupleWrite):
    """Create a profile owned by the verified current user."""


class CoupleUpdate(CoupleWrite):
    """Required fields are replaced; omitted story/photo are preserved."""


class CoupleResponse(BaseModel):
    """Explicit allowlist shared by owner and public responses."""

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra=CoupleWrite.model_config["json_schema_extra"],
    )
    partner_one_name: str
    partner_two_name: str
    # Nullable for legacy profiles created before the API's required-field validation.
    wedding_date: date | None
    venue: str | None
    story: str | None
    slug: str
    photo: str | None
