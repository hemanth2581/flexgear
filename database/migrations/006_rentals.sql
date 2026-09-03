-- 006_rentals.sql
CREATE TABLE IF NOT EXISTS rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. FG-RNT-YYYYMMDD-XXXXX
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (
        status IN (
            'PENDING_PAYMENT',
            'CONFIRMED',
            'READY_FOR_PICKUP',
            'PICKED_UP',
            'ACTIVE',
            'RETURN_DUE',
            'RETURN_PENDING',
            'UNDER_INSPECTION',
            'OVERDUE',
            'COMPLETED',
            'CANCELLED'
        )
    ),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL CHECK (total_days > 0),
    delivery_mode VARCHAR(20) NOT NULL DEFAULT 'PICKUP' CHECK (delivery_mode IN ('PICKUP', 'DELIVERY')),
    delivery_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    delivery_lat NUMERIC(10, 6),
    delivery_lng NUMERIC(10, 6),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    tax NUMERIC(10, 2) NOT NULL CHECK (tax >= 0),
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (security_deposit >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rentals_user ON rentals(user_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rentals_dates ON rentals(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_rentals_number ON rentals(rental_number);
