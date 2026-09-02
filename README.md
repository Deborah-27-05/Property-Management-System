# Nyumba Property Management System

A full-stack application for landlords and property managers to track
properties, units, tenants, rent payments, and maintenance requests from
one dashboard — instead of notebooks, spreadsheets, and phone messages.

```
React (Vite)  →  Flask REST API (JWT auth)  →  PostgreSQL
```

## 1. Project summary

Nyumba is a two-part project:

- **`client/property-management/`** — a React + Vite frontend
- **`server/`** — a Flask REST API backed by PostgreSQL

All core resources (Properties, Units, Tenants, Payments, Maintenance
Requests) are fully persisted in PostgreSQL and served through a RESTful
Flask API, with the React frontend reading and writing real data through
that API.

The application uses real JWT-based authentication. Every landlord/property
manager registers their own account; properties (and everything under
them — units, tenants, payments, maintenance requests) belong to the
account that created them. A user can only see and modify their own data;
the backend enforces this on every request, not just the frontend.

## 2. Folder structure

```
Property-Management-System/
├── client/
│   └── property-management/
│       └── src/
│           ├── components/          Shared UI (Button, FormField, Modal, tables, cards, Sidebar, etc.)
│           ├── context/
│           │   ├── AuthContext.jsx        Real auth state: register/login/logout, current user, JWT
│           │   └── AppDataContext.jsx     Fetches/writes real data via services/api.js
│           ├── pages/
│           │   ├── forms/                 PropertyForm, TenantForm, PaymentForm, MaintenanceForm (add + edit)
│           │   ├── Home.jsx, Login.jsx, Register.jsx
│           │   ├── Dashboard.jsx, Properties.jsx, PropertyDetails.jsx
│           │   ├── Tenants.jsx, Payments.jsx, Maintenance.jsx
│           │   ├── Profile.jsx, NotFound.jsx
│           ├── routes/
│           │   └── ProtectedRoute.jsx     Redirects to /login when not authenticated
│           ├── services/
│           │   └── api.js                 Fetch client for the Flask API; attaches JWT to every request
│           ├── App.jsx
│           ├── main.jsx
│           └── index.css
└── server/
    ├── app.py                 Flask app factory, blueprint registration
    ├── config.py              Loads DATABASE_URL / SECRET_KEY / JWT_SECRET_KEY from .env
    ├── extensions.py          SQLAlchemy, Migrate, JWTManager instances + JWT error handlers
    ├── models.py              User (with password hashing), Property, Unit, Tenant, Payment, MaintenanceRequest
    ├── seed.py                Realistic sample data for development
    ├── requirements.txt
    ├── migrations/            Flask-Migrate / Alembic migration history
    └── routes/
        ├── auth.py            POST /api/auth/register, /login, GET /api/auth/me
        ├── properties.py
        ├── units.py
        ├── tenants.py
        ├── payments.py
        └── maintenance.py
```

## 3. Backend setup (Flask + PostgreSQL)

### 3.1 Prerequisites

- Python 3.8–3.11 (3.14 is not yet compatible with this project's pinned
  Werkzeug version — see Deployment notes below)
- PostgreSQL installed and running

### 3.2 Install dependencies

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3.3 Configure the database

Create a PostgreSQL database and user:

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE nyumba_db;
CREATE USER nyumba_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE nyumba_db TO nyumba_user;
\q
```

Create a `.env` file in `server/` (never committed — see `.gitignore`):

```
DATABASE_URL=postgresql://nyumba_user:your_password_here@localhost:5432/nyumba_db
SECRET_KEY=your_generated_secret_key
JWT_SECRET_KEY=your_generated_jwt_secret_key
```

Generate secret keys with:

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

(Run it twice for two different values — don't reuse the same key for
`SECRET_KEY` and `JWT_SECRET_KEY`.)

### 3.4 Run migrations

```bash
export FLASK_APP=app.py
flask db upgrade
```

### 3.5 Seed sample data (optional, recommended for development)

```bash
python3 seed.py
```

This resets the database and inserts 2 sample properties, 3 units, 2
tenants, 2 payments, and 1 maintenance request. **Note:** seeded
properties have no owning user (`user_id` is `NULL`), so they won't
appear for any logged-in account. Register a real account and create
properties through the app to see data tied to a user.

### 3.6 Run the API

```bash
python3 app.py
```

The API runs at `http://127.0.0.1:5000`. Confirm it's up:

```bash
curl http://127.0.0.1:5000/api/health
```

## 4. Authentication

Nyumba uses JWT (JSON Web Token) authentication via Flask-JWT-Extended.
Passwords are hashed with Werkzeug's `generate_password_hash` /
`check_password_hash` (PBKDF2) — plain-text passwords are never stored
and password hashes are never returned by the API.

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/register` | POST | Create an account. Body: `{ email, password }`. Returns `{ user, access_token }`. |
| `/api/auth/login` | POST | Log in. Body: `{ email, password }`. Returns `{ user, access_token }`. |
| `/api/auth/me` | GET | Returns the current user for a valid token. Requires `Authorization: Bearer <token>`. |

The frontend stores the returned `access_token` in `localStorage` and
attaches it as an `Authorization: Bearer <token>` header on every
subsequent API request (`src/services/api.js`). `AuthContext.jsx` calls
`/api/auth/me` on app load to restore the session if a token is present,
and `ProtectedRoute.jsx` redirects unauthenticated users to `/login`.

**Error responses** are returned with clear messages, e.g.:
- Missing/invalid token → `401 { "error": "Please log in to continue." }`
- Expired token → `401 { "error": "Your session has expired. Please log in again." }`
- Wrong email/password → `401 { "error": "Invalid email or password" }`
- Accessing another user's resource → `403 { "error": "You do not have permission to access this resource." }`

## 5. Ownership & authorization

Every property belongs to the user who created it (`Property.user_id`).
Units, tenants, payments, and maintenance requests are scoped
transitively through the property they belong to (e.g. a unit's owner is
its property's owner; a tenant's owner is their unit's property's owner).

All CRUD routes for every resource:
1. Require a valid JWT (`@jwt_required()`).
2. Filter list endpoints (`GET`) to only the authenticated user's own
   records.
3. Check ownership before allowing `GET` (single), `PATCH`, or `DELETE`
   on a specific record, returning `403` if the record belongs to
   someone else.
4. Set `user_id` from the authenticated JWT identity on creation — never
   from a client-supplied field, so a request can't create or claim a
   resource on another user's behalf.

## 6. API reference

All endpoints are prefixed with `/api` and (aside from `/api/auth/register`,
`/api/auth/login`, and `/api/health`) require a valid JWT. List endpoints
support `?page=<n>&per_page=<n>` and return `{ data, page, total_pages,
total_records }`.

| Resource | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Properties | `GET /api/properties`, `GET /api/properties/<id>`, `POST /api/properties`, `PATCH /api/properties/<id>`, `DELETE /api/properties/<id>` |
| Units | `GET /api/units`, `GET /api/units/<id>`, `POST /api/units`, `PATCH /api/units/<id>`, `DELETE /api/units/<id>` |
| Tenants | `GET /api/tenants`, `GET /api/tenants/<id>`, `POST /api/tenants`, `PATCH /api/tenants/<id>`, `DELETE /api/tenants/<id>` |
| Payments | `GET /api/payments`, `GET /api/payments/<id>`, `POST /api/payments`, `PATCH /api/payments/<id>`, `DELETE /api/payments/<id>` |
| Maintenance | `GET /api/maintenance`, `GET /api/maintenance/<id>`, `POST /api/maintenance`, `PATCH /api/maintenance/<id>`, `DELETE /api/maintenance/<id>` |

Validation returns `400` (missing required fields) or `422` (invalid
foreign key / invalid value, e.g. negative rent, bad email format,
invalid priority). Not-found records return `404`. Records belonging to
another user return `403`.

## 7. Database relationships

```
User 1 ── many Properties
Property 1 ── many Units
Unit 1 ── many Tenants
Tenant 1 ── many Payments
Unit / Tenant ── many Maintenance Requests
```

## 8. Frontend setup (React + Vite)

```bash
cd client/property-management
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`). The
frontend expects the Flask API to be running at `http://127.0.0.1:5000`
(override with a `VITE_API_URL` env variable if needed).

To create a production build:

```bash
npm run build
npm run preview
```

Register a real account (email + password, 6+ characters) to create your
own properties — this is real authentication against the Flask API.

## 9. Routes implemented (frontend)

| Route | Access | Page |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Login |
| `/register` | Public | Register |
| `/dashboard` | Protected | Dashboard |
| `/properties` | Protected | Properties list |
| `/properties/:id` | Protected | Property details |
| `/tenants` | Protected | Tenants |
| `/payments` | Protected | Payments |
| `/maintenance` | Protected | Maintenance |
| `/profile` | Protected | Profile |
| `*` | Public | 404 Not Found |

Protected routes redirect to `/login` if there is no valid session.
Navigation (sidebar) and its Sign out button are only rendered inside
protected layouts, so they're not visible when logged out.

## 10. Testing

**Registration:** valid registration succeeds and returns a token;
duplicate email is rejected (`400`); missing fields are rejected (`400`);
invalid email format and short passwords are rejected (`422`); the stored
`password_hash` is a real PBKDF2 hash, never the plain-text password.

**Login:** correct credentials return a token (`200`); incorrect password
and non-existent email both return the same generic `401` message (no
information leak about which part was wrong); missing credentials return
`400`.

**Authorization:** requests without a token return `401`; a second test
account cannot view, update, or delete a property (or its units, tenants,
payments, maintenance requests) belonging to the first account — every
case returns `403`.

**CRUD:** create, read, update, and delete all verified working end to
end for every resource, through both `curl` against the API directly and
through the React UI.

## 11. Environment variables

`server/.env` (not committed — see `.gitignore`):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Flask secret key |
| `JWT_SECRET_KEY` | Secret used to sign JWTs |

`client/property-management` (optional, for pointing at a non-local API):

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Base URL of the Flask API (defaults to `http://127.0.0.1:5000`) |

## 12. Deployment notes

- The backend targets Python 3.11 in production (see `server/runtime.txt`
  and the `PYTHON_VERSION` environment variable on the host) since the
  pinned Werkzeug version is incompatible with Python 3.14's `ast` module.
- `server/Procfile` runs `gunicorn app:app --bind 0.0.0.0:$PORT` for
  platforms that assign a dynamic port (e.g. Render).
- CORS is currently open (`origins: "*"`) for development; restrict this
  to the deployed frontend's real domain in `server/app.py` before
  considering the deployment final.
- Set `VITE_API_URL` on the frontend host to the deployed backend's URL
  at build time.

## 13. Tech stack

**Frontend:** React, Vite, React Router
**Backend:** Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS, Flask-JWT-Extended, Werkzeug (password hashing)
**Database:** PostgreSQL