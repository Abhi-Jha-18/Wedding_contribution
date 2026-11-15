"""Explicit public authentication contracts; hashes never enter a response schema."""

from typing import Annotated, Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    SecretStr,
    StringConstraints,
    field_validator,
)

Name = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)
]


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    email: EmailStr = Field(max_length=320)
    password: SecretStr = Field(min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.lower()


class RegisterRequest(LoginRequest):
    name: Name
    password: SecretStr = Field(min_length=12, max_length=128)

    @field_validator("password")
    @classmethod
    def reject_blank_password(cls, value: SecretStr) -> SecretStr:
        if not value.get_secret_value().strip():
            raise ValueError("Password must not be blank")
        return value


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: str
    role: Literal["user", "admin"]


class TokenResponse(BaseModel):
    access_token: str
    token_type: Literal["bearer"] = "bearer"
    user: UserResponse
