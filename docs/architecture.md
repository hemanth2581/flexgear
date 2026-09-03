# FlexGear — Architecture & System Design Document

## 1. System Overview

FlexGear is an enterprise-grade camera and cinema equipment rental platform engineered for professional cinematographers, production houses, and equipment rental facilities. 

```
                                 FLEXGEAR PLATFORM
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 │                                               │
                 ▼                                               ▼
         CUSTOMER WEB APP                                 ADMIN WEB APP
         (Next.js 14 / Port 3000)                         (Next.js 14 / Port 3001)
         https://flexgear.com                             https://admin.flexgear.com
                 │                                               │
                 └───────────────────────┬───────────────────────┘
                                         │
                                         ▼
                               NODE.JS + EXPRESS API
                               (TypeScript / Port 5000)
                               https://api.flexgear.com
                                         │
        ┌───────────────────┬────────────┴────────────┬───────────────────┐
        │                   │                         │                   │
        ▼                   ▼                         ▼                   ▼
SUPABASE POSTGRES   FIREBASE AUTH SDK         STRIPE GATEWAY      OPENSTREETMAP
(18 Tables & Seed)  (Phone SMS OTP)           (Intents & Escrow)  (Leaflet Set GPS)
```

---

## 2. Component Directory Architecture

```text
flexgear/
├── customer-web/            # Next.js 14 Customer Web Application (:3000)
├── admin-web/               # Next.js 14 Admin Studio Application (:3001)
├── backend/                 # Node.js + Express + TypeScript API Server (:5000)
├── supabase/
│   ├── migrations/          # 18 PostgreSQL Schema Migrations (001 - 018)
│   └── seed.sql             # 45+ Master Cinema Equipment Catalog & Inventory
├── docs/                    # Technical & Architecture Documentation
└── package.json             # Root Orchestration Monorepo Scripts
```

---

## 3. Core Technologies & Integrations

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Customer Frontend** | Next.js 14 + React + TypeScript + Tailwind CSS | Filmmaker catalog, dynamic date selection, Leaflet GPS pinning, Stripe checkout |
| **Admin Frontend** | Next.js 14 + React + TypeScript + Recharts | Warehouse operations, serialized physical inventory, QC return inspections, Stripe deposit refund actions |
| **Backend API** | Node.js + Express + TypeScript | Single source of truth for pricing math, inventory collision prevention, Stripe webhook reconciliation |
| **Database** | Supabase PostgreSQL | Relational storage with 18 schema migrations, foreign keys, and indexes |
| **Authentication** | Firebase Phone Auth + Admin SDK | Real SMS OTP verification with cryptographic session token exchange |
| **Payments & Escrow** | Stripe PaymentIntents & Stripe Refund API | Dual-charge capture (Rental Fee + Security Deposit Escrow) and instant post-shoot refunds |
| **Maps & Logistics** | OpenStreetMap + Leaflet.js | Film set delivery pinning with exact latitude and longitude capture |
| **Testing** | Vitest | Automated unit testing for pricing formulas, availability locking, and deposit calculations |

---

## 4. API Endpoints Map

### Customer Endpoints
* `POST /api/auth/session`: Exchange Firebase ID token for FlexGear session JWT.
* `GET /api/auth/me`: Get current authenticated profile and shoot history.
* `GET /api/equipment`: List equipment catalog with filtering and search.
* `GET /api/equipment/:id`: Detailed specs, accessories, and availability calendar.
* `POST /api/availability/check`: Verify serialized physical unit availability for given dates.
* `POST /api/checkout/quote`: Calculate server-authoritative pricing (GST, multi-day discounts).
* `POST /api/checkout/create-intent`: Create Stripe PaymentIntent with security deposit hold.
* `POST /api/checkout/confirm`: Create booking order record with assigned physical inventory.
* `GET /api/rentals`: List customer shoot bookings.
* `GET /api/rentals/:id`: View booking details, line items, and invoice.

### Admin Operations Endpoints (Role-Protected: `ADMIN`)
* `GET /api/admin/dashboard`: 8 Executive KPIs and live revenue telemetry.
* `GET /api/admin/equipment` & `POST /api/admin/equipment`: Equipment fleet CRUD.
* `GET /api/admin/inventory`: Physical serial numbers and condition statuses.
* `GET /api/admin/rentals`: All customer rental orders across all statuses.
* `PATCH /api/admin/rentals/:id/status`: Transition rental status (`READY_FOR_PICKUP`, `HANDED_OVER`, `RETURN_REQUESTED`, `COMPLETED`).
* `GET /api/admin/deposits`: Active security deposits held in Stripe escrow.
* `POST /api/admin/deposits/:id/refund`: Execute Stripe Refund API release with optional damage penalty deductions.
* `GET /api/admin/customers`: Filmmaker directory with total spend telemetry.
* `GET /api/admin/audit-logs`: Immutable ledger of sensitive administrative overrides.
