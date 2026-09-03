-- 013_refunds.sql: Stripe refund audit records
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    deposit_id UUID NOT NULL REFERENCES deposits(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    stripe_refund_id VARCHAR(255) NOT NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    reason TEXT NOT NULL DEFAULT 'Deposit release after shoot inspection',
    status VARCHAR(30) NOT NULL DEFAULT 'SUCCEEDED' CHECK (status IN ('PENDING', 'SUCCEEDED', 'FAILED', 'CANCELLED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refunds_rental_id ON refunds(rental_id);
CREATE INDEX IF NOT EXISTS idx_refunds_stripe ON refunds(stripe_refund_id);
