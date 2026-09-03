# FlexGear Rental — Cinema & Shooting Equipment Platform

Production-ready, full-stack cinema equipment rental platform built with Next.js 14 App Router, Tailwind CSS, TypeScript, and Supabase PostgreSQL.

## 🏛️ Architecture & Infrastructure (₹0/Month)

* **Frontend & Serverless Engine**: Next.js 14 App Router on Vercel
* **Database & Auth**: Supabase PostgreSQL with 60 equipment items & 144 serialized inventory units
* **Live Availability & Escrow**: Atomic transaction booking locking in `rental_dates` and `security_deposits`
* **Automated CI/CD**: Direct deployment from GitHub `main` branch to Vercel

## 🚀 Live Production Deployment

1. **Repository**: `https://github.com/hemanth2581/flexgear`
2. **Framework**: Next.js 14
3. **Environment Keys**:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `SUPABASE_SERVICE_ROLE_KEY`
   * `OTP_MODE=development`

