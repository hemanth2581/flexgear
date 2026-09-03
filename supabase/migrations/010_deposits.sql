-- 010_deposits.sql: Security deposit hold & refund records
CREATE TABLE IF NOT EXISTS deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE UNIQUE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    held_amount NUMERIC(10, 2) NOT NULL CHECK (held_amount >= 0),
    refunded_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (refunded_amount >= 0),
    deducted_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (deducted_amount >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'HELD' CHECK (status IN ('HELD', 'INSPECTION_PENDING', 'FULL_REFUND', 'PARTIAL_REFUND', 'DEDUCTION', 'REFUNDED')),
    stripe_refund_id VARCHAR(255),
    deduction_reason TEXT,
    refunded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_deposit_sum CHECK (refunded_amount + deducted_amount <= held_amount)
);

CREATE INDEX IF NOT EXISTS idx_deposits_rental_id ON deposits(rental_id);
CREATE INDEX IF NOT EXISTS idx_deposits_customer_id ON deposits(customer_id);
CREATE INDEX IF NOT EXISTS idx_deposits_status ON deposits(status);
