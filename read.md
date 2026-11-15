# Wedding Contribution

A wedding wishlist and contribution platform with a React/Vite frontend and a FastAPI backend.

## Repository layout

- `frontend/` — React 19 application, built and served with Vite.
- `backend/` — FastAPI application, SQLAlchemy models, and Alembic database migrations.

The frontend includes public landing and wedding pages, registration/login pages, and dashboard screens for wedding profiles, wishlists, contributions, QR codes, and settings. The backend currently provides status, authentication, and wedding-profile APIs. Wishlist, guestbook, contribution, and payment APIs are not implemented yet; frontend screens should not be assumed to persist data through the backend.

## Requirements

- Node.js and npm
- Python 3.11+
- PostgreSQL 14+ for the backend

## Run locally

Start each application in a separate PowerShell terminal from the repository root.

### Backend

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `backend/.env` with a PostgreSQL `DATABASE_URL` and a strong `JWT_SECRET` (at least 32 characters). Create the configured database, then run:

```powershell
alembic upgrade head
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`; interactive API documentation is at `http://127.0.0.1:8000/docs`, and the liveness endpoint is `http://127.0.0.1:8000/health`.

### Frontend

```powershell
cd frontend
npm ci
npm run dev
```

Vite prints the local frontend URL when the server starts (normally `http://localhost:5173`).

## Checks

From `frontend/`:

```powershell
npm run lint
npm run build
```

From `backend/` with its virtual environment activated:

```powershell
python -m pytest -q
```

## More information

See [backend/README.md](backend/README.md) for backend configuration, API contracts, migration details, and test coverage. The frontend README currently contains the default Vite template notes.

Do not commit `backend/.env` or put production credentials in source control.
