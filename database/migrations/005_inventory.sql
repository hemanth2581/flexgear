-- 005_inventory.sql
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'AVAILABLE' CHECK (
        status IN ('AVAILABLE', 'BOOKED', 'RENTED', 'MAINTENANCE', 'DAMAGED', 'RETIRED')
    ),
    condition VARCHAR(30) NOT NULL DEFAULT 'EXCELLENT' CHECK (
        condition IN ('BRAND_NEW', 'EXCELLENT', 'GOOD', 'FAIR', 'NEEDS_REPAIR')
    ),
    warehouse_location VARCHAR(100) DEFAULT 'Main Hub - Bay 1',
    last_calibrated_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_equipment ON inventory(equipment_id);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_serial ON inventory(serial_number);
