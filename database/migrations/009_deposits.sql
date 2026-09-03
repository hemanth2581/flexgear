-- 009_deposits.sql
CREATE TABLE IF NOT EXISTS deposits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    held_amount NUMERIC(10, 2) NOT NULL CHECK (held_amount >= 0),
    deducted_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (deducted_amount >= 0),
    refunded_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (refunded_amount >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'HELD' CHECK (
        status IN (
            'HELD',
            'INSPECTION_PENDING',
            'FULL_REFUND',
            'PARTIAL_REFUND',
            'DEDUCTION',
            'REFUNDED'
        )
    ),
    stripe_refund_id VARCHAR(255),
    deduction_reason TEXT,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_deposits_rental ON deposits(rental_id);
CREATE INDEX IF NOT EXISTS idx_deposits_user ON deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
