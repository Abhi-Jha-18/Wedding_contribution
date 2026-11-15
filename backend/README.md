# Wedding Wishlist API — foundation (Phase 1)

This backend lives in the new **`backend/`** directory at the repository root. The existing Vite frontend remains in `frontend/`; no frontend files were changed.

## What's included

- FastAPI application with `GET /`, liveness `GET /health`, Swagger UI at `/docs`, and OpenAPI at `/openapi.json`.
- Environment-based settings and a reusable SQLAlchemy 2.0 PostgreSQL engine/session dependency.
- SQLAlchemy models and an initial Alembic migration for users, couples, wishlists, wishlist items, demo contributions, and guestbook messages.
- Basic endpoint tests.

There are no authentication or business endpoints yet. `/health` is deliberately a liveness check and does not query PostgreSQL; the migration command is the database readiness check. Contribution records are constrained to `DEMO` and do not charge or contact any payment provider.

## Prerequisites

- Python 3.11 or newer
- PostgreSQL 14+ (or a compatible recent PostgreSQL release)

## Windows PowerShell setup

Run these commands from the repository root:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` and set `DATABASE_URL` to your local PostgreSQL user/password. The example has a placeholder password and is not intended for production. Never commit `.env`.

### Create the database

Using `psql` (substitute your local PostgreSQL role if needed):

```powershell
psql -U postgres -h localhost -c "CREATE DATABASE wedding_contribution;"
```

Alternatively, create a database named `wedding_contribution` in pgAdmin. Set the `.env` URL to the corresponding connection, for example:

```text
DATABASE_URL=postgresql+psycopg://postgres:YOUR_LOCAL_PASSWORD@localhost:5432/wedding_contribution
```

URL-encode special characters in the password. Use environment variables / a secrets manager in deployed environments rather than committing credentials.

### Apply the initial migration and start the API

From `backend/` with the virtual environment active:

```powershell
alembic upgrade head
uvicorn app.main:app --reload
```

Open `http://127.0.0.1:8000/`, `http://127.0.0.1:8000/health`, and `http://127.0.0.1:8000/docs`. Swagger's schema is at `http://127.0.0.1:8000/openapi.json`.

To stop the server, press `Ctrl+C`. To exit the virtual environment, run `deactivate`.

## Run tests

From `backend/`:

```powershell
python -m pytest
```

The status endpoint tests do not require a running PostgreSQL instance. For full database verification, configure PostgreSQL and run `alembic upgrade head`; Alembic will fail fast if the connection or schema migration is invalid. To check generated SQL without connecting to the database:

```powershell
alembic upgrade head --sql
```

## Structure and data model notes

- `app/core/config.py`: reads `backend/.env` and process environment variables.
- `app/core/database.py`: SQLAlchemy engine, session factory, and close-safe `get_db` dependency; routes do not contain database queries.
- `app/models/`: declarative models and relationships. A user `role` (`user` / `admin`) covers future admin accounts; no separate admin table is needed.
- `app/routes/` and `app/schemas/`: status endpoints and their response schema only.
- `app/services/` and `app/utils/`: reserved for business logic/helpers as those features are approved.
- `alembic/`: migration configuration and the reviewed initial schema revision.
- `tests/`: API status/documentation tests.

Amounts are stored as integer paise (`amount_paise`, and `target_amount_paise`), never floating-point currency. Emails and public couple slugs are unique; the user-to-couple and couple-to-wishlist relationships are one-to-one. Foreign keys, delete behavior, indexes, positive-amount checks, timestamps, and a database check requiring `payment_mode = 'DEMO'` are included.
