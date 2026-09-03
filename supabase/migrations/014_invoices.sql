-- 014_invoices.sql: Official 18% GST tax invoices
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE UNIQUE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    gstin VARCHAR(30) DEFAULT '29AABCF1234F1Z8',
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    billing_address JSONB NOT NULL DEFAULT '{}'::jsonb,
    taxable_amount NUMERIC(10, 2) NOT NULL CHECK (taxable_amount >= 0),
    cgst NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (cgst >= 0),
    sgst NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (sgst >= 0),
    total_tax NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total_tax >= 0),
    security_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (security_deposit >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_rental_id ON invoices(rental_id);
CREATE INDEX IF NOT EXISTS idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
