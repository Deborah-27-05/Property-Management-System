# Nyumba Property Management System

A full-stack application for landlords and property managers to track
properties, units, tenants, rent payments, and maintenance requests from
one dashboard — instead of notebooks, spreadsheets, and phone messages.

```
React (Vite)  →  Flask REST API  →  PostgreSQL
```

## 1. Project summary

Nyumba is a two-part project:

- **`client/property-management/`** — a React + Vite frontend
- **`server/`** — a Flask REST API backed by PostgreSQL

All core resources (Properties, Units, Tenants, Payments, Maintenance
Requests) are fully persisted in PostgreSQL and served through a RESTful
Flask API, with the React frontend reading and writing real data through
that API. No mock data remains in the app.

Authentication is scaffolded at the database level (a `User` model and a
nullable `Property.user_id` foreign key) but login, registration, and
route protection are reserved for Phase 3 and not yet implemented.

## 2. Folder structure

```
Property-Management-System/
├── client/
│   └── property-management/
│       └── src/
│           ├── components/          Shared UI (Button, FormField, Modal, tables, cards, etc.)
│           ├── context/
│           │   ├── AuthContext.jsx        Mock login/logout state (Phase 3 will replace this)
│           │   └── AppDataContext.jsx     Fetches/writes real data via services/api.js
│           ├── pages/
│           │   ├── forms/                 PropertyForm, TenantForm, PaymentForm, MaintenanceForm
│           │   ├── Home.jsx, Login.jsx, Register.jsx
│           │   ├── Dashboard.jsx, Properties.jsx, PropertyDetails.jsx
│           │   ├── Tenants.jsx, Payments.jsx, Maintenance.jsx
│           │   ├── Profile.jsx, NotFound.jsx
│           ├── routes/
│           │   └── ProtectedRoute.jsx
│           ├── services/
│           │   └── api.js                 Fetch client for the Flask API
│           ├── data/
│           │   └── mockData.js            Legacy mock data (tenants/payments/maintenance no longer used)
│           ├── App.jsx
│           ├── main.jsx
│           └── index.css
└── server/
    ├── app.py                 Flask app factory, blueprint registration
    ├── config.py              Loads DATABASE_URL / SECRET_KEY from .env
    ├── extensions.py          SQLAlchemy + Migrate instances
    ├── models.py              Property, Unit, Tenant, Payment, MaintenanceRequest, User
    ├── seed.py                Realistic sample data for development
    ├── requirements.txt
    ├── migrations/            Flask-Migrate / Alembic migration history
    └── routes/
        ├── properties.py
        ├── units.py
        ├── tenants.py
        ├── payments.py
        └── maintenance.py
```

## 3. Backend setup (Flask + PostgreSQL)

### 3.1 Prerequisites

- Python 3.8+
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
```

Generate a secret key with:

```bash
python3 -c "import secrets; print(secrets.token_hex(16))"
```

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
tenants, 2 payments, and 1 maintenance request.

### 3.6 Run the API

```bash
python3 app.py
```

The API runs at `http://127.0.0.1:5000`. Confirm it's up:

```bash
curl http://127.0.0.1:5000/api/health
```

## 4. API reference

All endpoints are prefixed with `/api`. List endpoints support
`?page=<n>&per_page=<n>` and return `{ data, page, total_pages,
total_records }`.

| Resource | Endpoints |
|---|---|
| Properties | `GET /api/properties`, `GET /api/properties/<id>`, `POST /api/properties`, `PATCH /api/properties/<id>`, `DELETE /api/properties/<id>` |
| Units | `GET /api/units`, `GET /api/units/<id>`, `POST /api/units`, `PATCH /api/units/<id>`, `DELETE /api/units/<id>` |
| Tenants | `GET /api/tenants`, `GET /api/tenants/<id>`, `POST /api/tenants`, `PATCH /api/tenants/<id>`, `DELETE /api/tenants/<id>` |
| Payments | `GET /api/payments`, `GET /api/payments/<id>`, `POST /api/payments`, `PATCH /api/payments/<id>`, `DELETE /api/payments/<id>` |
| Maintenance | `GET /api/maintenance`, `GET /api/maintenance/<id>`, `POST /api/maintenance`, `PATCH /api/maintenance/<id>`, `DELETE /api/maintenance/<id>` |

Validation returns `400` (missing required fields) or `422` (invalid
foreign key / invalid value, e.g. negative rent, bad email format,
invalid priority). Not-found records return `404`.

## 5. Frontend setup (React + Vite)

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

Login with any valid-looking email and a password of 6+ characters — this
is still mock authentication (see "Reserved for Phase 3" below).

## 6. Routes implemented (frontend)

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

Protected routes redirect to `/login` if the user is not authenticated
(mock session flag in `sessionStorage` — real auth is Phase 3).

## 7. Features implemented

- Full CRUD for Properties, Units, Tenants, Payments, and Maintenance
  Requests, persisted in PostgreSQL and served via a Flask REST API
- Pagination, validation, and relational integrity (foreign keys enforced,
  invalid references rejected) on every resource
- Seed script with realistic sample data
- React frontend fully wired to the live API — no mock data remains for
  any of the five resources
- Landing page with problem statement, benefits, features, and CTA
- Mock login and registration with client-side validation (real auth
  reserved for Phase 3)
- Protected routing with redirect-to-login for unauthenticated access
- Dashboard with summary stat cards, recent payments, maintenance
  overview, and quick actions — all computed from real data
- Properties: search, status filter, add property (modal form), detail
  page with real units table
- Tenants: search, filter by property and payment status, add tenant
  (modal form, creates a matching unit via the API)
- Payments: collection summary, filter by status, record payment (modal
  form) against a real tenant
- Maintenance: filter by priority and status, add request (modal form),
  change status inline (persisted via `PATCH`)
- Responsive sidebar (desktop) / slide-in menu (mobile), responsive
  tables, cards, and forms
- Empty and loading states for every page, including a clear error state
  if the API is unreachable
- Accessible forms: labelled fields, error messages, focus states; status
  is shown with an icon/label, not color alone

## 8. Reserved for Phase 3

- Real authentication (registration, login, logout, password hashing)
- Session/JWT-based protected API routes
- Ownership-based authorization (users can only modify their own
  properties) — the database groundwork for this already exists:
  a `User` model and a nullable `Property.user_id` foreign key were added
  in Phase 2 so this can be introduced without a disruptive migration
- Role-based access (landlord vs. tenant vs. admin accounts)
- M-Pesa / real payment gateway integration
- SMS and email notifications
- Google Maps property locations
- Complex analytics and reporting
- File uploads (lease documents, maintenance photos)

## 9. Environment variables

`server/.env` (not committed — see `.gitignore`):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Flask secret key |

## 10. Tech stack

**Frontend:** React, Vite, React Router
**Backend:** Flask, Flask-SQLAlchemy, Flask-Migrate, Flask-CORS
**Database:** PostgreSQL