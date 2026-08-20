# Property Management System (Frontend)

A frontend-only React application for landlords and property managers to
track properties, units, tenants, rent payments, and maintenance requests
from one dashboard, instead of notebooks, spreadsheets, and phone messages.

## 1. Project summary

Property management system is an MVP React/Vite application. All data is realistic mock data
held in React state — there is no backend, database, or real authentication
yet. The codebase is structured so a Flask REST API + PostgreSQL backend can
be dropped in later without restructuring the frontend (see "Future
full-stack direction" below).

## 2. Folder structure

```
src/
├── components/
│   ├── forms/            PropertyForm, TenantForm, PaymentForm, MaintenanceForm
│   ├── AppLayout.jsx      Sidebar + topbar shell for authenticated pages
│   ├── Navbar.jsx         Public navbar (landing page)
│   ├── Sidebar.jsx        Authenticated app navigation
│   ├── Footer.jsx
│   ├── Button.jsx
│   ├── FormField.jsx
│   ├── Modal.jsx
│   ├── StatCard.jsx
│   ├── StatusBadge.jsx
│   ├── SearchBar.jsx
│   ├── EmptyState.jsx
│   ├── PropertyCard.jsx
│   ├── TenantTable.jsx
│   ├── PaymentTable.jsx
│   └── MaintenanceCard.jsx
├── context/
│   ├── AuthContext.jsx    Mock login/logout state
│   └── AppDataContext.jsx Shared mock "database" + add/update actions
├── pages/
│   ├── Home.jsx, Login.jsx, Register.jsx
│   ├── Dashboard.jsx, Properties.jsx, PropertyDetails.jsx
│   ├── Tenants.jsx, Payments.jsx, Maintenance.jsx
│   ├── Profile.jsx, NotFound.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── data/
│   └── mockData.js        Sample properties, units, tenants, payments, maintenance
├── App.jsx
├── main.jsx
└── index.css               Design tokens + shared component styles
```

## 3. Routes implemented

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
(mock session flag in `sessionStorage`).

## 4. Reusable components

`Navbar`, `Sidebar`, `AppLayout`, `Footer`, `StatCard`, `Button`, `FormField`,
`Modal`, `PropertyCard`, `TenantTable`, `PaymentTable`, `MaintenanceCard`,
`StatusBadge`, `SearchBar`, `EmptyState`, plus shared form components
(`PropertyForm`, `TenantForm`, `PaymentForm`, `MaintenanceForm`) used inside
modals on the Dashboard, Properties, Tenants, Payments, and Maintenance pages.

## 5. Install dependencies

```
npm install
```

## 6. Run the application

```
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To create a production build:

```
npm run build
npm run preview
```

Login with any valid-looking email and a password of 6+ characters — this
is mock authentication, so no real account is created or checked.

## 7. Features implemented

- Landing page with problem statement, benefits, features, and CTA
- Mock login and registration with client-side validation
- Protected routing with redirect-to-login for unauthenticated access
- Dashboard with 7 summary stat cards, recent payments, maintenance overview,
  and quick actions
- Properties: search, status filter, add property (modal form), detail page
  with units table
- Tenants: search, filter by property and payment status, add tenant (modal
  form, creates a matching unit)
- Payments: collection summary, filter by status, record payment (modal
  form) that updates tenant/unit status
- Maintenance: filter by priority and status, add request (modal form),
  change status inline
- Responsive sidebar (desktop) / slide-in menu (mobile), responsive tables,
  cards, and forms
- Empty states for properties, tenants, payments, maintenance, and invalid
  property IDs; 404 page for unknown routes
- Accessible forms: labelled fields, error messages, focus states; status
  is shown with an icon/label, not color alone

## 8. Reserved for Phase 2 / Phase 3

- Real authentication and account creation (Flask + sessions/JWT)
- PostgreSQL persistence for properties, tenants, payments, maintenance
- Tenant and administrator accounts with role-based authorization
- M-Pesa / real payment gateway integration
- SMS and email notifications
- Google Maps property locations
- Complex analytics and reporting
- File uploads (lease documents, maintenance photos)

## Future full-stack direction

```
React  →  Flask REST API  →  PostgreSQL
```

`AppDataContext.jsx` centralizes all read/write operations (`addProperty`,
`addTenant`, `recordPayment`, `addMaintenanceRequest`,
`updateMaintenanceStatus`) so each can later be swapped for a `fetch` call
to a Flask endpoint without changing the pages or components that use them.
