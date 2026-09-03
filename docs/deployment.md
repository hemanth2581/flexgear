# FlexGear — Production Deployment Guide

This guide outlines step-by-step production deployment for the FlexGear monorepo.

---

## 1. Hosting Architecture

| Component | Recommended Platform | Port / Domain |
| :--- | :--- | :--- |
| `customer-web` | Vercel / Cloudflare Pages | `https://flexgear.com` |
| `admin-web` | Vercel (Protected Domain) | `https://admin.flexgear.com` |
| `backend` | Render / Railway / AWS ECS | `https://api.flexgear.com` |
| `database` | Supabase Cloud | PostgreSQL Port 5432 / Pooler 6543 |

---

## 2. Supabase Migration Execution

1. In Supabase Dashboard ➔ SQL Editor, execute all migrations in sequence:
   ```bash
   supabase/migrations/001_users.sql
   supabase/migrations/002_categories.sql
   ...
   supabase/migrations/018_audit_logs.sql
   ```
2. Run `supabase/seed.sql` to populate master categories, 16 cinema gear models, and 25 physical inventory serial numbers.

---

## 3. Environment Variables Configuration

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=production
CUSTOMER_WEB_URL=https://flexgear.com
ADMIN_WEB_URL=https://admin.flexgear.com
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
SUPABASE_URL=https://[PROJECT-ID].supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJh...
FIREBASE_PROJECT_ID=flexgear-prod
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@flexgear-prod.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=super_secure_production_key
JWT_EXPIRES_IN=7d
```

### Customer Web (`customer-web/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://api.flexgear.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=flexgear-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flexgear-prod
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Admin Web (`admin-web/.env.local`)
```env
NEXT_PUBLIC_API_URL=https://api.flexgear.com/api
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=flexgear-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=flexgear-prod
```

---

## 4. Local Development Orchestration

To run all 3 applications simultaneously:
```bash
# Install all workspace dependencies
npm run install:all

# Run Backend (:5000), Customer Web (:3000), and Admin Studio (:3001) concurrently
npm run dev
```
