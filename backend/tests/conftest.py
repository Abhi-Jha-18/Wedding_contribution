"""Isolated test database. TEST_DATABASE_URL must name a disposable PostgreSQL DB."""

import os
import secrets

os.environ.setdefault("JWT_SECRET", secrets.token_urlsafe(48))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.core.database import get_db
from app.main import app
from app.models import Base


@pytest.fixture(scope="session")
def test_engine():
    url = os.environ.get("TEST_DATABASE_URL")
    if url:
        from alembic import command
        from alembic.config import Config
        from sqlalchemy import text

        config = Config("alembic.ini")
        # Alembic uses the shared environment-backed settings.
        from app.core.config import settings

        old_url = settings.database_url
        settings.database_url = url
        engine = create_engine(url)
        try:
            command.upgrade(config, "0001_initial")
            with engine.begin() as connection:
                connection.execute(
                    text(
                        "INSERT INTO users (email, password_hash) VALUES ('legacy@example.com', 'preserve-me')"
                    )
                )
            with engine.begin() as connection:
                connection.execute(
                    text(
                        "INSERT INTO couples (owner_user_id, slug, partner_one_name, partner_two_name) SELECT id, 'legacy-wedding', 'Legacy One', 'Legacy Two' FROM users WHERE email='legacy@example.com'"
                    )
                )
            command.upgrade(config, "head")
            with engine.connect() as connection:
                row = connection.execute(
                    text(
                        "SELECT name, password_hash, role, is_active FROM users WHERE email='legacy@example.com'"
                    )
                ).one()
                assert tuple(row) == ("Existing user", "preserve-me", "user", True)
                legacy = connection.execute(
                    text(
                        "SELECT partner_one_name, partner_two_name, photo FROM couples WHERE slug='legacy-wedding'"
                    )
                ).one()
                assert tuple(legacy) == ("Legacy One", "Legacy Two", None)
            command.check(config)
            with engine.begin() as connection:
                connection.execute(
                    text(
                        "UPDATE couples SET photo='https://example.com/photo.jpg' WHERE slug='legacy-wedding'"
                    )
                )
            command.downgrade(config, "0002_user_name")
            command.upgrade(config, "head")
            with engine.connect() as connection:
                legacy = connection.execute(
                    text(
                        "SELECT partner_one_name, photo FROM couples WHERE slug='legacy-wedding'"
                    )
                ).one()
                assert tuple(legacy) == ("Legacy One", None)
            command.downgrade(config, "0001_initial")
            command.upgrade(config, "head")
            with engine.begin() as connection:
                connection.execute(
                    text("DELETE FROM users WHERE email='legacy@example.com'")
                )
            yield engine
        finally:
            command.downgrade(config, "base")
            settings.database_url = old_url
            engine.dispose()
    else:
        engine = create_engine(
            "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
        )
        Base.metadata.create_all(engine)
        yield engine
        engine.dispose()


@pytest.fixture
def db(test_engine):
    with test_engine.connect() as connection:
        transaction = connection.begin()
        if connection.dialect.name == "sqlite":
            connection.exec_driver_sql("BEGIN")
        with Session(
            bind=connection,
            join_transaction_mode="create_savepoint",
            expire_on_commit=False,
        ) as session:
            yield session
        transaction.rollback()


@pytest.fixture
def client(db):
    def override_db():
        yield db

    app.dependency_overrides[get_db] = override_db
    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.clear()
