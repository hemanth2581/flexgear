-- 014_invoices.sql
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. FG-INV-YYYYMM-XXXX
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gstin VARCHAR(30) DEFAULT '29AABCF1234F1Z8',
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    cgst NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sgst NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    igst NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_tax NUMERIC(10, 2) NOT NULL CHECK (total_tax >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    invoice_pdf_url TEXT,
    is_paid BOOLEAN NOT NULL DEFAULT TRUE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_rental ON invoices(rental_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
