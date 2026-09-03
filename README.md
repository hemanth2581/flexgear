# FLEXGEAR — Complete Production-Ready Camera & Cinema Equipment Rental Platform

FlexGear is an end-to-end, enterprise camera, cinema equipment, and filmmaking gear rental platform engineered for professional cinematographers, production companies, and rental houses.

---

## 🏛️ System Architecture

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

## 📁 Repository Structure

```text
flexgear/
├── customer-web/            # Customer Portal (Next.js 14 + Tailwind + Leaflet + Stripe)
├── admin-web/               # Dedicated Operations Studio (Next.js 14 + Recharts)
├── backend/                 # Core API Engine (Node.js + Express + TypeScript)
├── supabase/
│   ├── migrations/          # 18 PostgreSQL Schema Migrations (001 - 018)
│   └── seed.sql             # 45+ Master Cinema Equipment Catalog & Inventory
├── docs/                    # Complete Architecture & Deployment Documentation
│   ├── architecture.md      # System Design & Endpoints
│   ├── database.md          # 18-Table PostgreSQL Schema Map & ERD
│   ├── authentication.md    # Firebase Phone OTP & RBAC
│   ├── payments.md          # Stripe PaymentIntents & Deposit Escrow
│   └── deployment.md        # Vercel, Supabase & Cloud Deployment
└── package.json             # Root Monorepo Orchestration Scripts
```

---

## 🚀 Quickstart & Development

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` / `.env` in all three projects:
* `backend/.env`
* `customer-web/.env.local`
* `admin-web/.env.local`

### 3. Run Database Migrations
Execute `supabase/migrations/001_users.sql` through `018_audit_logs.sql` followed by `supabase/seed.sql` inside your Supabase PostgreSQL project.

### 4. Start All Applications Concurrently
```bash
npm run dev
```

* **Customer Web App**: `http://localhost:3000`
* **Admin Web Studio**: `http://localhost:3001`
* **Express Backend API**: `http://localhost:5000` (Health Check: `http://localhost:5000/api/health`)

---

## 🧪 Automated Testing
```bash
npm test
```
All unit tests validate server pricing logic, inventory collision prevention, and deposit calculations.
