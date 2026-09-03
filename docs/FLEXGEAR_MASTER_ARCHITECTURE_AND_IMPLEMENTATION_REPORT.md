# FlexGear — Master Engineering & Architecture Report
*A Complete Technical Blueprint of the Cinema & Production Equipment Rental Platform*

---

## 1. Executive Summary & Platform Overview

**FlexGear** is a production-grade, full-stack rental platform purpose-built for cinema equipment, high-end photography cameras, prime lenses, sound packages, and film grip gear. The platform addresses the entire lifecycle of equipment rentals—from online discovery and date-based concurrency booking to on-set delivery, serialized inventory rack management, and automated Stripe deposit escrow releases.

The platform is engineered as a coordinated multi-service monorepo:
1. **Customer Web Storefront (`customer-web/`)**: Next.js 14 App Router, TailwindCSS, Framer Motion, Leaflet GPS interactive delivery pinning, and Stripe 3D Secure checkout.
2. **Admin Operations Studio (`admin-web/`)**: Next.js 14 App Router, Recharts telemetry charts, serialized physical asset inventory tracking, and 1-click rental order fulfillment.
3. **Backend REST API Engine (`backend/`)**: Node.js, Express, TypeScript, database abstraction layer (Supabase PostgreSQL + In-Memory Fallback), Firebase Auth val  idation, and scheduled background workers.
4. **Database & Migrations (`supabase/`)**: Complete PostgreSQL schema with 18 normalized tables, Foreign Keys, UUID primary keys, and comprehensive realistic Indian cinema seed data.

---

## 2. Technology Stack & Integrations

### 2.1 Core Frameworks & Runtime
* **Backend Runtime**: Node.js (v20+) with TypeScript (`5.9.3`), Express (`v4.19`), and `ts-node-dev`.
* **Frontend Framework**: Next.js 14 (`14.2.35`) with React 18 (`18.3.1`) and React Server / Client Components.
* **Styling & Design System**: TailwindCSS (`3.4.17`), PostCSS, Lucide-React cinema iconography, and dark gold amber glassmorphic palette.
* **Animation & Visual Feedback**: Framer Motion (`13.1.1`) for page transitions, checkout state progression, and checkmark animations.

### 2.2 Third-Party Service Integrations
* **Stripe Payment & Deposit Escrow**:
  * Dual-mode Stripe engine (`StripeRefundService` and mock fallback).
  * Generates Stripe `PaymentIntent` tokens with separate rental charge and refundable security deposit collateral hold.
  * Automated 1-click card reversal and partial damage deduction processing.
* **Firebase Authentication (SMS OTP & Admin Gate)**:
  * Client-side phone verification with invisible reCAPTCHA integration.
  * Server-side Firebase Admin SDK token verification with automatic user profile creation.
  * Instant development authentication bypass for rapid evaluation.
* **Leaflet Interactive GPS Set Pinning**:
  * Integrated in `DeliveryMap.tsx`.
  * Provides live map dragging, reverse geocoding, and latitude/longitude coordinates attachment to rental manifests for logistics vans.
* **Recharts Telemetry Visualizations**:
  * Real-time dark gold gradient Area Charts tracking monthly revenue velocity and rental order volumes.

---

## 3. Monorepo Project Structure & File Inventory

```
flexgear-rental/
├── backend/                              # Express + TypeScript REST API
│   ├── src/
│   │   ├── config/                       # Environment, Database, Firebase config
│   │   │   ├── database.ts               # PostgreSQL connection pool with connection detection
│   │   │   ├── environment.ts            # Environment variables loader
│   │   │   └── firebase.ts               # Firebase Admin initialization
│   │   ├── controllers/                  # Route request handlers
│   │   │   ├── admin.controller.ts       # Executive telemetry, inventory, rental actions
│   │   │   ├── auth.controller.ts        # Authentication & token verification
│   │   │   ├── checkout.controller.ts    # Booking transaction orchestrator
│   │   │   ├── deposit.controller.ts     # Escrow management & Stripe refunds
│   │   │   ├── equipment.controller.ts   # Catalog discovery & filtering
│   │   │   ├── inspection.controller.ts  # Multi-point return QC inspection
│   │   │   └── rental.controller.ts      # Customer orders & return requests
│   │   ├── models/                       # Database entities with Dual-Mode storage
│   │   │   ├── Blog.ts                   # Cinema articles & technical guides
│   │   │   ├── Brand.ts                  # Equipment manufacturers (Sony, ARRI, RED)
│   │   │   ├── Category.ts               # Equipment categories (Cameras, Lenses, Lights)
│   │   │   ├── DamageReport.ts           # Hardware repair & replacement records
│   │   │   ├── Deposit.ts                # Escrow collateral holds & deductions
│   │   │   ├── Equipment.ts              # Catalog definitions & pricing tiers
│   │   │   ├── Inventory.ts              # Physical serialized units & vault locations
│   │   │   ├── Location.ts               # Hub facilities (Bengaluru, Chennai, Coimbatore)
│   │   │   ├── Notification.ts           # Customer & admin alert ledger
│   │   │   ├── Payment.ts                # Stripe payment transaction logs
│   │   │   ├── Refund.ts                 # Stripe card reversal history
│   │   │   ├── Rental.ts                 # Master rental orders & line items
│   │   │   ├── Review.ts                 # Filmmaker equipment ratings
│   │   │   └── User.ts                   # User profiles & RBAC roles
│   │   ├── middleware/                   # Express security & validation gates
│   │   │   ├── admin.middleware.ts       # Strict administrator access guard
│   │   │   ├── auth.middleware.ts        # Multi-token JWT & Firebase verifier
│   │   │   └── validation.middleware.ts  # Zod schema input validator
│   │   ├── routes/                       # Express router definitions (21 endpoints)
│   │   │   ├── admin.routes.ts           # /api/admin/*
│   │   │   ├── auth.routes.ts            # /api/auth/*
│   │   │   ├── blog.routes.ts            # /api/blog/*
│   │   │   ├── brand.routes.ts           # /api/brands/*
│   │   │   ├── checkout.routes.ts        # /api/checkout/*
│   │   │   ├── damage.routes.ts          # /api/damage/*
│   │   │   ├── deposit.routes.ts         # /api/deposits/*
│   │   │   ├── equipment.routes.ts       # /api/equipment/*
│   │   │   ├── inspection.routes.ts      # /api/inspections/*
│   │   │   ├── location.routes.ts        # /api/locations/*
│   │   │   ├── refund.routes.ts          # /api/refunds/*
│   │   │   ├── rental.routes.ts          # /api/rentals/*
│   │   │   └── user.routes.ts            # /api/users/*
│   │   ├── services/                     # Core business logic engines
│   │   │   ├── availability.service.ts   # Concurrency & date overlap engine
│   │   │   ├── checkout.service.ts       # Order builder & Stripe payment intents
│   │   │   ├── deposit.service.ts        # Escrow deduction & refund calculations
│   │   │   ├── equipment.service.ts      # Multi-criteria catalog search
│   │   │   ├── inspection.service.ts     # 7-point return QC evaluation
│   │   │   ├── pricing.service.ts        # 18% GST, duration discount, deposit totals
│   │   │   └── rental.service.ts         # Status lifecycle transitions
│   │   ├── jobs/                         # Background automation engine
│   │   │   └── scheduledJobs.ts          # Automated overdue scans & deposit audits
│   │   ├── app.ts                        # Express application & CORS configuration
│   │   └── server.ts                     # HTTP listener on port 5000
│   └── tests/                            # Automated Vitest test suite (14 tests)
│       └── unit/
│           ├── availability.test.ts      # Date overlap algorithm tests
│           ├── booking_lifecycle.test.ts # End-to-end checkout & return integration
│           ├── concurrency.test.ts       # Simultaneous reservation safety
│           ├── deposit.test.ts           # Escrow release & deduction tests
│           ├── pricing.test.ts           # GST & duration discount calculations
│           └── security.test.ts          # RBAC role access tests
│
├── customer-web/                         # Next.js 14 Customer Storefront (Port 3000)
│   ├── src/
│   │   ├── app/                          # App Router pages (23 routes)
│   │   │   ├── page.tsx                  # Cinema landing page with hero banner
│   │   │   ├── about/page.tsx            # About FlexGear & company story
│   │   │   ├── blog/page.tsx             # Technical filmmaking guides
│   │   │   ├── blog/[slug]/page.tsx      # Guide reading page
│   │   │   ├── cart/page.tsx             # Production gear cart & dates selector
│   │   │   ├── checkout/page.tsx         # 3-step interactive checkout with Stripe
│   │   │   ├── checkout/success/page.tsx # Booking confirmation & invoice print
│   │   │   ├── contact/page.tsx          # 24/7 set concierge & WhatsApp desk
│   │   │   ├── equipment/page.tsx        # Fleet catalog with multi-filter drawer
│   │   │   ├── equipment/[id]/page.tsx   # Equipment detail & specs sheet
│   │   │   ├── locations/page.tsx        # Rental hubs (Bengaluru, Chennai, CBE)
│   │   │   ├── login/page.tsx            # Filmmaker login & Instant Demo access
│   │   │   ├── packages/page.tsx         # Curated turnkey cinema production kits
│   │   │   ├── profile/page.tsx          # Filmmaker profile & KYC documents
│   │   │   ├── rentals/page.tsx          # My Shoots dashboard & return requests
│   │   │   ├── search/page.tsx           # Instant equipment search results
│   │   │   └── wishlist/page.tsx         # Saved gear vault
│   │   ├── components/                   # UI components
│   │   │   ├── checkout/DeliveryMap.tsx  # Leaflet GPS map with marker dragging
│   │   │   ├── payment/StripePaymentForm.tsx # 3D Secure card payment form
│   │   │   └── layout/Navbar.tsx         # Header with cart counter & auth status
│   │   ├── context/                      # Global React state
│   │   │   ├── AuthContext.tsx           # Authentication session & token storage
│   │   │   └── CartContext.tsx           # Shoot dates & equipment cart state
│   │   └── lib/api.ts                    # SWR in-memory cached HTTP client
│
├── admin-web/                            # Next.js 14 Admin Studio (Port 3001)
│   ├── src/
│   │   ├── app/                          # Admin App Router pages (21 routes)
│   │   │   ├── admin/dashboard/page.tsx  # Executive telemetry & live order queue
│   │   │   ├── admin/rentals/page.tsx    # Order dispatch & fulfillment tracker
│   │   │   ├── admin/inventory/page.tsx  # Physical serial units & vault rack manager
│   │   │   ├── admin/deposits/page.tsx   # Stripe escrow ledger & 1-click refund
│   │   │   ├── admin/customers/page.tsx  # Filmmakers & studio director directory
│   │   │   ├── admin/equipment/page.tsx  # Catalog management & pricing editor
│   │   │   ├── admin/inspections/page.tsx# 7-point return QC inspection studio
│   │   │   ├── admin/analytics/page.tsx  # Fleet utilization & revenue reports
│   │   │   ├── admin/audit-logs/page.tsx # Immutable system security ledger
│   │   │   ├── admin/blog/page.tsx       # Blog CMS & cinema guide publishing
│   │   │   ├── admin/settings/page.tsx   # GST rates, discounts & escrow config
│   │   │   └── login/page.tsx            # One-Click Admin & Phone OTP login
│   │   ├── context/                      # Admin state
│   │   │   └── AdminAuthContext.tsx      # Admin authentication context
│   │   └── lib/api.ts                    # Admin API client targeting backend
│
├── supabase/                             # Database Migrations & Seed Data
│   ├── migrations/
│   │   └── 20260901_initial_schema.sql  # 18 PostgreSQL tables, indexes & triggers
│   └── seed.sql                          # Complete cinema fleet seed dataset
├── docs/                                 # Engineering documentation
│   ├── api.md                            # Complete REST API reference
│   └── inventory.md                      # Physical asset lifecycle & QC specifications
└── docker-compose.yml                    # Multi-container orchestration config
```

---

## 4. Database Architecture & Connectivity

### 4.1 Dual-Mode Database Connectivity Engine
FlexGear implements a resilient **Dual-Mode Database Architecture** in `backend/src/config/database.ts`:
1. **Live PostgreSQL Mode**: When `DATABASE_URL` is configured (pointing to Supabase or AWS RDS PostgreSQL), all models execute raw parameterized SQL queries with transaction safety (`pg.Pool`).
2. **In-Memory Mock Store Mode**: When offline or in automated test environments, all models seamlessly operate on pre-seeded memory objects with immediate bidirectional synchronization across all controllers.

### 4.2 Database Schema Overview (18 Tables)
* `users`: Filmmakers, studios, and staff with RBAC roles (`CUSTOMER`, `ADMIN`, `SUPER_ADMIN`, `STAFF`, `WAREHOUSE_MANAGER`, `FINANCE`).
* `categories`: Cameras, Lenses, Lighting, Audio, Gimbals & Drones, Grip, Production Kits.
* `brands`: Manufacturers (Sony, ARRI, RED, Canon, Cooke, Aputure, Sennheiser, DJI).
* `equipment`: Master catalog definitions, daily rates, weekly rates, security deposits, and specifications.
* `inventory`: Physical serialized items with barcodes, rack coordinates, and states (`AVAILABLE`, `RENTED`, `MAINTENANCE`, `DAMAGED`, `RETIRED`).
* `rentals`: Master rental orders with start date, end date, delivery mode, GPS coordinates, subtotal, tax, and status.
* `rental_items`: Line items linking rental orders to equipment catalog models.
* `deposits`: Security deposit escrow records, held amounts, damage deductions, and Stripe refund IDs.
* `payments`: Stripe transaction intents, card brands, amounts, and receipt URLs.
* `refunds`: Card refund transaction ledger.
* `inspections`: 7-point hardware inspection reports with UV sensor checks, optical glass, and accessory verification.
* `damage_reports`: Damage documentation, repair cost estimates, and client liability allocations.
* `blogs`: Technical cinema articles, camera guides, and production tips.
* `reviews`: Verified customer equipment ratings and feedback.
* `locations`: Hub facilities in Bengaluru, Chennai, and Coimbatore.
* `notifications`: Customer dispatch notices and return reminders.
* `audit_logs`: Immutable audit trails recording administrative status changes.
* `settings`: Platform configuration (18% GST tax rate, weekly discounts, auto-refund triggers).

---

## 5. Core Business Workflows & Algorithms

### 5.1 Date Overlap & Concurrency Reservation
When a customer attempts to book gear from `StartDate` to `EndDate`, the engine in `backend/src/services/availability.service.ts` computes availability using the standard date overlap condition:

$$\text{Existing Start Date} \le \text{Requested End Date} \quad \text{AND} \quad \text{Existing End Date} \ge \text{Requested Start Date}$$

1. Queries all non-cancelled orders overlapping the shoot window.
2. Sums total booked quantity.
3. Compares with total physical units in `AVAILABLE` state in the warehouse.
4. If $\text{Available Units} \ge \text{Requested Qty}$, reservation proceeds; otherwise, rejects with `400 PRODUCT_UNAVAILABLE`.

### 5.2 Financial Pricing & Tax Engine
Implemented in `backend/src/services/pricing.service.ts`:
* **Duration Calculation**: $\text{Days} = \max(1, \text{End} - \text{Start})$.
* **Gross Subtotal**: $\sum (\text{Daily Rate} \times \text{Qty} \times \text{Days})$.
* **Duration Discounts**: 15% discount for shoots $\ge 7$ days; 10% discount for orders $> ₹20,000$.
* **Logistics Delivery Fee**: Flat ₹500 for on-set GPS van delivery (₹0 for vault pickup).
* **GST Taxation**: 9% CGST + 9% SGST (Total 18% GST) applied to the taxable subtotal.
* **Security Deposit Escrow**: Separately calculated based on gear replacement collateral tiers and held in escrow.

### 5.3 End-to-End Rental Order Lifecycle
```
1. CUSTOMER ADDS TO CART & CHECKS OUT
   └── POST /api/checkout -> Creates Rental ('PENDING_PAYMENT') & Stripe Intent
   
2. PAYMENT AUTHORIZATION
   └── Stripe 3D Secure completes -> Status becomes 'CONFIRMED'
   
3. WAREHOUSE STAGING & DISPATCH
   └── Admin clicks "Mark Ready" -> Status becomes 'READY_FOR_PICKUP'
   └── Gear handed over to DP -> Status becomes 'ACTIVE' (On Set Filming)
   
4. WRAP & RETURN
   └── Customer requests wrap -> Status becomes 'RETURN_REQUESTED' / 'RETURNED'
   
5. QC INSPECTION & ESCROW SETTLEMENT
   └── Technician verifies condition -> Admin clicks "Complete & Settle"
   └── Status becomes 'COMPLETED' -> 100% Stripe deposit released to customer
```

---

## 6. How to Run, Test, and Deploy

### 6.1 Running Locally with Dev Servers
To run all three tiers locally in development mode:
```powershell
# Root directory
npm.cmd run dev
```
Or start each service individually:
```powershell
# Terminal 1: Backend API (Port 5000)
cd backend && npm.cmd run dev

# Terminal 2: Customer Storefront (Port 3000)
cd customer-web && npm.cmd run start

# Terminal 3: Admin Studio (Port 3001)
cd admin-web && npm.cmd run start
```

### 6.2 Running Automated Test Suite
```powershell
cd backend
npm.cmd test
```
*Executes all 14 Vitest unit and integration test suites covering pricing, availability, concurrency, RBAC security, and deposit refunds.*

### 6.3 Docker Containerization
```powershell
# Root directory
docker-compose up --build
```
*Orchestrates PostgreSQL database, Express backend API, Customer Next.js app, and Admin Next.js app simultaneously.*

---

## 7. Direct Access Links

| Application | Direct URL | Description |
| :--- | :--- | :--- |
| **🎬 Customer Storefront** | [http://localhost:3000](http://localhost:3000) | Equipment browsing, date selection, Leaflet GPS checkout, customer shoots dashboard |
| **🎛️ Admin Operations Studio** | [http://localhost:3001](http://localhost:3001) | Executive telemetry, live orders queue, serialized inventory, Stripe deposit escrow |
| **⚙️ Backend REST API** | [http://localhost:5000/api/health](http://localhost:5000/api/health) | API health check & REST routes |
