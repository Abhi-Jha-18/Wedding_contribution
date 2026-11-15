"""Environment-backed application settings."""

from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Settings loaded from backend/.env and process environment variables."""

    app_name: str = "Wedding Wishlist API"
    debug: bool = False
    # No credentials are embedded in this fallback; use DATABASE_URL in .env.
    database_url: str = "postgresql+psycopg://localhost:5432/wedding_contribution"

    jwt_secret: SecretStr = Field(min_length=32)
    jwt_algorithm: str = Field(default="HS256", pattern="^HS256$")
    jwt_access_token_minutes: int = Field(default=15, ge=1, le=60)
    jwt_issuer: str = "wedding-wishlist-api"
    jwt_audience: str = "wedding-wishlist-client"

    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
