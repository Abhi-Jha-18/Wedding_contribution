"""Environment-backed application settings."""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    """Settings loaded from backend/.env and process environment variables."""

    app_name: str = "Wedding Wishlist API"
    debug: bool = False
    # No credentials are embedded in this fallback; use DATABASE_URL in .env.
    database_url: str = "postgresql+psycopg://localhost:5432/wedding_contribution"

    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
