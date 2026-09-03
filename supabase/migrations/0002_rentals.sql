-- =========================================================
-- MIGRATION 0002_rentals.sql
-- Tables: rental_orders, rental_items, rental_dates, payments, security_deposits
-- =========================================================

-- 1. RENTAL ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.rental_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_id TEXT UNIQUE NOT NULL, -- Format: FG-RNT-YYYYMMDD-XXXXX
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN (
        'PENDING',
        'PAYMENT_PENDING',
        'CONFIRMED',
        'READY_FOR_PICKUP',
        'ACTIVE',
        'RETURN_PENDING',
        'RETURNED',
        'CANCELLED',
        'OVERDUE'
    )),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL CHECK (total_days > 0),
    delivery_mode TEXT NOT NULL DEFAULT 'PICKUP' CHECK (delivery_mode IN ('PICKUP', 'DELIVERY')),
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    tax NUMERIC(10, 2) NOT NULL CHECK (tax >= 0),
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (security_deposit >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    payment_status TEXT NOT NULL DEFAULT 'CREATED' CHECK (payment_status IN ('CREATED', 'CAPTURED', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. RENTAL ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.rental_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_order_id UUID NOT NULL REFERENCES public.rental_orders(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    daily_price NUMERIC(10, 2) NOT NULL CHECK (daily_price > 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- 3. RENTAL DATES TABLE (Overbooking & availability backstop)
CREATE TABLE IF NOT EXISTS public.rental_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_order_id UUID NOT NULL REFERENCES public.rental_orders(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    units_booked INT NOT NULL DEFAULT 1 CHECK (units_booked > 0),
    UNIQUE(equipment_id, date, rental_order_id)
);

-- 4. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_order_id UUID NOT NULL REFERENCES public.rental_orders(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'mock',
    provider_payment_id TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    status TEXT NOT NULL DEFAULT 'CREATED' CHECK (status IN ('CREATED', 'CAPTURED', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. SECURITY DEPOSITS TABLE
CREATE TABLE IF NOT EXISTS public.security_deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_order_id UUID NOT NULL REFERENCES public.rental_orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    status TEXT NOT NULL DEFAULT 'COLLECTED' CHECK (status IN ('COLLECTED', 'REFUND_PENDING', 'REFUNDED')),
    refunded_amount NUMERIC(10, 2) DEFAULT 0.00
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_rental_orders_user ON public.rental_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_rental_orders_status ON public.rental_orders(status);
CREATE INDEX IF NOT EXISTS idx_rental_dates_equip_date ON public.rental_dates(equipment_id, date);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(rental_order_id);
