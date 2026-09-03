-- =========================================================
-- MIGRATION 0001_init.sql
-- Base tables: users, categories, brands, equipment, equipment_inventory
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CUSTOMER' CHECK (role IN ('CUSTOMER', 'ADMIN')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    icon TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
);

-- 4. EQUIPMENT TABLE
CREATE TABLE IF NOT EXISTS public.equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    daily_price NUMERIC(10, 2) NOT NULL CHECK (daily_price > 0),
    weekly_price NUMERIC(10, 2) CHECK (weekly_price IS NULL OR weekly_price > 0),
    security_deposit NUMERIC(10, 2) NOT NULL CHECK (security_deposit >= 0),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    included_accessories JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. EQUIPMENT INVENTORY (Physical serialized stock)
CREATE TABLE IF NOT EXISTS public.equipment_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
    serial_number TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'DAMAGED'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_equipment_category ON public.equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_brand ON public.equipment(brand_id);
CREATE INDEX IF NOT EXISTS idx_equipment_daily_price ON public.equipment(daily_price);
CREATE INDEX IF NOT EXISTS idx_equipment_rating ON public.equipment(rating);
CREATE INDEX IF NOT EXISTS idx_inventory_equipment ON public.equipment_inventory(equipment_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON public.equipment_inventory(status);
