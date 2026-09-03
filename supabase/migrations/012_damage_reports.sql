-- 012_damage_reports.sql: Granular damage reports
CREATE TABLE IF NOT EXISTS damage_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    damage_type VARCHAR(50) NOT NULL DEFAULT 'PHYSICAL_SCRATCH',
    description TEXT NOT NULL,
    repair_cost_estimate NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (repair_cost_estimate >= 0),
    deducted_from_deposit NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (deducted_from_deposit >= 0),
    photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_damage_reports_rental ON damage_reports(rental_id);
