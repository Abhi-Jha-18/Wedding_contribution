# Wedding Wishlist API — Wishlist, Contributions & Guestbook (Milestone 3)

FastAPI + SQLAlchemy + PostgreSQL. Authentication, wedding profiles, wishlist management, guest contributions (demo-only), and guestbook wishes are fully implemented and integrated with the React frontend.

## Setup

Requires Python 3.11+ and PostgreSQL 14+.

From the repository root (PowerShell):

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
python -c "import secrets; print(secrets.token_urlsafe(48))"
```

On Linux/macOS, use `python3 -m venv .venv`, `source .venv/bin/activate`, and `cp .env.example .env` instead.

Edit `.env`:

- `DATABASE_URL`: PostgreSQL SQLAlchemy URL, e.g. `postgresql+psycopg://USER:PASSWORD@localhost:5432/wedding_contribution`. URL-encode special characters in credentials.
- `JWT_SECRET`: paste the generated random value (at least 32 characters). There is deliberately no default; configuration fails if absent or too short. Settings are shared with Alembic, so configure this before running migration commands too.
- `JWT_ALGORITHM`: `HS256` only (never inferred from an incoming token).
- `JWT_ACCESS_TOKEN_MINUTES`: default 15; allowed range 1–60.
- `JWT_ISSUER`, `JWT_AUDIENCE`: must match the API's token configuration.
- `DEBUG`: use `false` for deployment.

Never commit `.env` or secrets. Use a secrets manager/environment variables in deployment.

Create the database with pgAdmin or:

```powershell
psql -U postgres -h localhost -c "CREATE DATABASE wedding_contribution;"
alembic upgrade head
uvicorn app.main:app --reload
```

For a remote development preview, use `uvicorn app.main:app --host 0.0.0.0 --port 8000`. Use HTTPS and a production deployment configuration outside local development.

Open `/docs` for Swagger UI, `/openapi.json` for the schema, or `/redoc` for ReDoc. Existing `/` and `/health` endpoints remain available. `/health` is a liveness check, not a database readiness check.

## Authentication API

All request bodies are JSON; login is not an OAuth2 form endpoint.

### `POST /api/auth/register` → 201

```json
{"name":"Asha Jha","email":"asha@example.com","password":"a-long-unique-password"}
```

Name is trimmed and must contain 1–120 characters. Email syntax is validated (maximum 320 characters) and normalized to lowercase. Passwords require 12–128 characters and cannot be all whitespace; they are not silently trimmed. Extra fields such as `role` or `is_active` are rejected. New users are active with role `user`; clients cannot grant administrative privileges.

Returns only `id`, `name`, `email`, `role`. Passwords are stored as salted Argon2id hashes, never plaintext. Duplicate email returns 409; validation errors return 422. The existing unique email index handles concurrent registration conflicts. Legacy mixed-case email accounts are detected case-insensitively without rewriting existing data. If legacy accounts differ only by email case, an administrator must resolve that ambiguity before login; authentication deliberately fails closed for these accounts.

### `POST /api/auth/login` → 200

```json
{"email":"asha@example.com","password":"a-long-unique-password"}
```

Returns:

```json
{
  "access_token":"<signed JWT>",
  "token_type":"bearer",
  "user":{"id":1,"name":"Asha Jha","email":"asha@example.com","role":"user"}
}
```

Responses use `Cache-Control: no-store`. Unknown emails, wrong passwords and inactive users all receive the same 401 response and `WWW-Authenticate: Bearer` header. Unknown accounts still perform an Argon2 verification to reduce timing differences. Successful login upgrades Argon2 hashing parameters when needed.

### `GET /api/auth/me` → 200

Send `Authorization: Bearer <access_token>`. In Swagger, first call login, copy the access token, then click **Authorize** and paste the token without the `Bearer` prefix.

Returns `id`, `name`, `email`, `role`. Missing, malformed, expired, incorrectly signed or incorrectly scoped tokens return 401. The API requires the subject, issue time, expiration, issuer, audience and access-token type. Each request reloads the user, so disabled/deleted accounts are rejected and role changes take effect immediately.

### Logout strategy and limitations

Access tokens are **stateless**; no logout endpoint pretends to revoke them. Clients should discard tokens on logout and stop sending them. **A copied/stolen token remains usable until expiration**, even after the original browser deletes it. There is no refresh token or per-token denylist in this phase. Disabling an account blocks all its tokens while disabled; rotating the JWT secret invalidates every token. Neither is per-device logout. Re-enabling an account can make its unexpired tokens usable again.

For immediate per-session revocation, a later phase must introduce server-side sessions or a token denylist/refresh-token design. Avoid persistent browser token storage where possible; never log tokens/passwords, and enforce HTTPS. Before public production exposure, add login/registration rate limits at a trusted gateway (or a shared application limiter), monitoring and abuse controls. Email ownership verification, password reset and MFA are not provided here.

## Wedding profile API (Phase 2)

| Method | Endpoint | Authentication | Success |
| --- | --- | --- | --- |
| POST | `/api/couples` | Bearer JWT | 201, created profile |
| GET | `/api/couples/me` | Bearer JWT | 200, your profile |
| PUT | `/api/couples/me` | Bearer JWT | 200, updated profile |
| GET | `/api/couples/{slug}` | None | 200, public profile |

Register/login first, then send `Authorization: Bearer <access_token>` for private endpoints. Ownership always comes from the verified JWT; request bodies cannot specify `owner_user_id`, `id` or other unknown fields. One profile per user is enforced by the existing database constraint. There is no private lookup/update by someone else's ID or slug. Private routes use `/me`; it is registered before the public slug route.

### Create and update request example

```json
{
  "partner_one_name": "Asha Jha",
  "partner_two_name": "Rohan Kumar",
  "wedding_date": "2027-02-14",
  "venue": "Muzaffarnagar, Uttar Pradesh",
  "story": "Join us to celebrate!",
  "slug": "asha-and-rohan",
  "photo": "https://images.example.com/wedding.jpg"
}
```

Example using curl after obtaining a token:

```bash
curl -X POST http://127.0.0.1:8000/api/couples \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"partner_one_name":"Asha Jha","partner_two_name":"Rohan Kumar","wedding_date":"2027-02-14","venue":"Muzaffarnagar","slug":"asha-and-rohan"}'
curl http://127.0.0.1:8000/api/couples/me -H "Authorization: Bearer <access_token>"
curl http://127.0.0.1:8000/api/couples/asha-and-rohan
```

POST and PUT require both names, wedding date, venue and slug. Names are trimmed (1–120 characters), venue is trimmed (1–255), and optional story is trimmed (maximum 10,000). Dates must be real calendar dates in `YYYY-MM-DD` format; numeric timestamps and date-time strings are rejected. Valid past dates are intentionally accepted for archived/existing weddings.

Slugs are trimmed and lowercased (1–100 characters). Only ASCII letters, digits and single internal hyphens are allowed. Spaces, underscores, leading/trailing/repeated hyphens are rejected; `me` is reserved. Public lookup applies the same normalization. Uniqueness is enforced in both the service precheck and database unique index, with concurrent conflicts rolled back and returned as 409. Legacy slug data is not rewritten by the migration.

**PUT semantics:** required fields must be supplied. Optional `story` and `photo` are preserved when omitted, and cleared when explicitly set to `null`. This is not a general PATCH endpoint. Updating a slug releases the old URL; no redirect is created.

### Response example (all four endpoints)

```json
{
  "partner_one_name": "Asha Jha",
  "partner_two_name": "Rohan Kumar",
  "wedding_date": "2027-02-14",
  "venue": "Muzaffarnagar, Uttar Pradesh",
  "story": "Join us to celebrate!",
  "slug": "asha-and-rohan",
  "photo": "https://images.example.com/wedding.jpg"
}
```

Only these seven wedding fields are returned, even for owners. No user IDs, profile IDs, email, hashes or account fields are exposed. Legacy profiles may have null date/venue because existing nullable columns are preserved; new writes require those fields. Profile content is publicly readable by slug; do not put secrets in a story or photo URL. Consumers must render names/story as text, not trusted HTML.

### Frontend field mapping and photo decision

| Existing frontend field | API / database field |
| --- | --- |
| `partner1` | `partner_one_name` |
| `partner2` | `partner_two_name` |
| `weddingDate` | `wedding_date` |
| `location` | `venue` |
| `description` | `story` |
| `slug` | `slug` |
| `photo` | `photo` (nullable image URL) |

This API uses the requested snake_case contract. Future frontend integration must perform this mapping; no frontend files have been changed.

The current frontend `ImageUpload` uses `URL.createObjectURL`, producing temporary `blob:` previews, not durable uploaded assets. This phase intentionally supports **image URLs only**, stored in a nullable `VARCHAR(2048)` column. Accepted URLs use HTTP(S), are at most 2048 characters, and cannot embed username/password credentials. `blob:`, `data:`, script URLs and binary/base64 uploads are rejected. Prefer HTTPS in production. The backend does not fetch URLs, validate remote image contents or store image bytes; URL availability is the image host's responsibility. A future upload feature needs object storage, size/content validation and access controls before frontend file uploads can be integrated.

### Error responses

- 401: private endpoint missing/invalid/expired JWT, or inactive/deleted account.
- 404: no profile for the current user, or unknown public slug.
- 409: a user already has a profile, or a slug is taken.
- 422: invalid/missing fields, malformed/reserved slug or untrusted ownership fields.

Example: `{"detail":"Slug is already in use"}`. Private profile absence returns `{"detail":"Wedding profile not found"}`. Swagger includes authentication requirements, request/response examples and validation schemas.

## Migration and data preservation

`0001_initial` is unchanged. `0002_user_name` adds a nullable `VARCHAR(120)`, backfills existing accounts with the placeholder **Existing user**, then enforces NOT NULL with no permanent default. Existing IDs, emails, hashes, roles, active flags, relationships and constraints are preserved. New registrations must supply a real name. Existing users will need an administrative update or a future profile-edit feature to replace the placeholder.

`0003_couple_photo` adds only nullable `couples.photo` (`VARCHAR(2048)`); existing profiles retain all data and get null photos. Downgrading to `0002_user_name` removes photo URLs only. No changes are made to owner/slug uniqueness, foreign keys or existing business tables.

Back up production data before applying migrations. Downgrading to `0001_initial` removes names but preserves the other account fields; this is intentionally lossy for names. The API requires the latest migration.

## Tests

From `backend/` with the environment active:

```powershell
python -m pytest -q
```

By default, API tests use isolated in-memory SQLite and dependency overrides; no running PostgreSQL or configured JWT secret is needed (tests generate an ephemeral secret). The suite covers registration, validation, duplicate/case-normalized email, Argon2 persistence, login, uniform authentication errors, inactive/deleted accounts, protected access, bad signatures, invalid/expired claims, public response filtering, OpenAPI and the original status endpoints.

For real PostgreSQL integration and migration verification, create an **empty disposable database**, then:

```powershell
$env:TEST_DATABASE_URL="postgresql+psycopg://USER:PASSWORD@localhost:5432/wedding_auth_test"
python -m pytest -q
Remove-Item Env:TEST_DATABASE_URL
```

Linux/macOS equivalent: `TEST_DATABASE_URL='postgresql+psycopg://USER:PASSWORD@localhost:5432/wedding_auth_test' python -m pytest -q`.

**Never point TEST_DATABASE_URL at development/production data.** Integration setup migrates from revision 0001, seeds a legacy account, verifies the name backfill and original account fields, checks metadata drift with Alembic, exercises downgrade/upgrade, and runs the same API tests on PostgreSQL. Teardown downgrades to base, deleting the test schema tables. Individual API tests roll back their transactions. Wedding tests cover authenticated create/read/update, anonymous denial, ownership isolation, normalized duplicate slugs, one-profile-per-user, optional-field preservation/clearing, public-field privacy, validation and database unique-index conflict recovery. Migration checks seed a legacy couple, verify preservation and nullable photos, and exercise revision 0003 downgrade/upgrade. A persistence test writes committed data in one backend Python process, then starts a fresh process and verifies both public retrieval and authenticated owner retrieval (PostgreSQL in integration mode; a temporary file-backed SQLite database otherwise). This avoids mistaking shared ORM memory for durability.

To inspect migration SQL without connecting:

```powershell
alembic upgrade head --sql
```

## Relevant structure

- `app/core/config.py`: environment-backed database/JWT settings.
- `app/core/database.py`: existing engine, session factory and request dependency.
- `app/core/security.py`: Argon2id hashing and strict JWT encode/decode helpers.
- `app/models/user.py`: existing account model plus required name.
- `app/schemas/auth.py`: request validation and explicit safe response schemas.
- `app/services/auth.py`: registration, unique-email handling and credential checks.
- `app/routes/auth.py`: API routes and reusable `get_current_user` dependency.
- `alembic/versions/0002_user_name.py`: data-preserving schema extension.
- `tests/`: authentication/status tests and optional PostgreSQL migration checks.

Phase 2 additions:
- `app/models/couple.py`: existing wedding model plus nullable photo URL.
- `app/schemas/couple.py`: create/update contracts, slug/date/URL validation, public response allowlist.
- `app/services/couple.py`: ownership-scoped persistence and uniqueness handling.
- `app/routes/couple.py`: private and public wedding endpoints using existing JWT/session dependencies.
- `alembic/versions/0003_couple_photo.py`: additive, data-preserving migration.
- `tests/test_couple.py`: profile behavior, privacy, ownership, validation, uniqueness recovery and process-restart persistence.

Phase 3 additions (Milestone 3):
- `app/models/wishlist.py`: Wishlist item model with title, target amount in paise, description, image, priority, category.
- `app/models/contribution.py`: Demo contribution ledger model with item foreign key, contributor name, paise amount, note message, and `payment_mode = 'DEMO'` check constraint.
- `app/schemas/wishlist.py`: Schemas for item creation, update, and owner/public response representations.
- `app/schemas/contribution.py`: Schemas for guest contributions (demo-only) and contribution summary lists.
- `app/schemas/guest_message.py`: Schemas for public wedding wishes and owner guestbook inbox.
- `app/services/wishlist.py`: CRUD business logic for wishlists, ownership checks, target calculations.
- `app/services/contribution.py`: Contribution handling, status checking (full funding), and aggregate totals.
- `app/services/guest_message.py`: Guestbook message creation and retrieval.
- `app/routes/wishlist.py`: `GET/POST /api/wishlists/me/items`, `PUT/DELETE /api/wishlists/me/items/{id}`, `GET /api/couples/{slug}/wishlist`.
- `app/routes/contribution.py`: `POST /api/wishlist-items/{id}/contribute`, `GET /api/contributions/me`.
- `app/routes/guest_message.py`: `POST/GET /api/couples/{slug}/messages`, `GET /api/messages/me`.
- `alembic/versions/0004_wishlist_category_and_message.py`: Migration adding `category` to `wishlist_items` and `message` to `contributions`.
- `tests/test_wishlist.py`, `tests/test_contribution.py`, `tests/test_guest_message.py`: Unit and integration test suites covering all Milestone 3 endpoints.

## Milestone 3 API Summary

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/api/wishlists/me/items` | Bearer JWT | List couple's wishlist items |
| POST | `/api/wishlists/me/items` | Bearer JWT | Create new wishlist item |
| PUT | `/api/wishlists/me/items/{id}` | Bearer JWT | Update wishlist item |
| DELETE | `/api/wishlists/me/items/{id}` | Bearer JWT | Delete wishlist item |
| GET | `/api/couples/{slug}/wishlist` | None | Public view of couple's wishlist |
| POST | `/api/wishlist-items/{id}/contribute` | None | Guest contribution (Demo only) |
| GET | `/api/contributions/me` | Bearer JWT | Couple's received contribution ledger |
| POST | `/api/couples/{slug}/messages` | None | Guest posts wedding wish |
| GET | `/api/couples/{slug}/messages` | None | Public wedding wishes |
| GET | `/api/messages/me` | Bearer JWT | Owner's received guest messages |
