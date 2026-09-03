-- 005_inventory.sql: Serialized physical asset inventory units
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    serial_number VARCHAR(100) NOT NULL UNIQUE,
    barcode VARCHAR(100) UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'RESERVED', 'RENTED', 'MAINTENANCE', 'DAMAGED', 'RETIRED')),
    condition VARCHAR(30) NOT NULL DEFAULT 'EXCELLENT' CHECK (condition IN ('EXCELLENT', 'GOOD', 'FAIR', 'MAINTENANCE_REQUIRED', 'DAMAGED')),
    warehouse_location VARCHAR(100) NOT NULL DEFAULT 'Main Cinema Vault - Mumbai',
    shelf_location VARCHAR(50) DEFAULT 'Shelf-A1',
    last_inspected_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_equipment_id ON inventory(equipment_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_serial ON inventory(serial_number);
