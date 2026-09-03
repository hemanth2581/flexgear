-- 007_rentals.sql: Master rental booking orders table
CREATE TABLE IF NOT EXISTS rentals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id VARCHAR(50) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_PAYMENT' CHECK (
        status IN (
            'PENDING_PAYMENT',
            'CONFIRMED',
            'READY_FOR_PICKUP',
            'HANDED_OVER',
            'ACTIVE',
            'RETURN_DUE',
            'RETURN_REQUESTED',
            'RETURNED',
            'INSPECTION_PENDING',
            'COMPLETED',
            'CANCELLED'
        )
    ),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL CHECK (total_days > 0),
    pickup_or_delivery VARCHAR(20) NOT NULL DEFAULT 'PICKUP' CHECK (pickup_or_delivery IN ('PICKUP', 'DELIVERY')),
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
    latitude NUMERIC(10, 6),
    longitude NUMERIC(10, 6),
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    cgst NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (cgst >= 0),
    sgst NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (sgst >= 0),
    gst NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (gst >= 0),
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (security_deposit >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_rental_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_rentals_customer_id ON rentals(customer_id);
CREATE INDEX IF NOT EXISTS idx_rentals_booking_id ON rentals(booking_id);
CREATE INDEX IF NOT EXISTS idx_rentals_status ON rentals(status);
CREATE INDEX IF NOT EXISTS idx_rentals_dates ON rentals(start_date, end_date);
