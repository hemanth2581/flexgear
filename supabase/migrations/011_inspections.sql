-- 011_inspections.sql: Return condition inspection logs
CREATE TABLE IF NOT EXISTS inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES users(id) ON DELETE SET NULL,
    camera_body_condition VARCHAR(50) DEFAULT 'EXCELLENT',
    sensor_condition VARCHAR(50) DEFAULT 'CLEAN',
    lens_elements VARCHAR(50) DEFAULT 'SCRATCH_FREE',
    batteries_returned INT DEFAULT 0,
    chargers_returned INT DEFAULT 0,
    cables_returned INT DEFAULT 0,
    cases_returned INT DEFAULT 0,
    accessories_status VARCHAR(50) DEFAULT 'ALL_PRESENT',
    has_damage BOOLEAN NOT NULL DEFAULT FALSE,
    damage_description TEXT,
    damage_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (damage_fee >= 0),
    condition_notes TEXT,
    photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_completed BOOLEAN NOT NULL DEFAULT TRUE,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inspections_rental_id ON inspections(rental_id);
