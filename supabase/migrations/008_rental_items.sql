-- 008_rental_items.sql: Itemized line items in a booking
CREATE TABLE IF NOT EXISTS rental_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rental_id UUID NOT NULL REFERENCES rentals(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    inventory_id UUID REFERENCES inventory(id) ON DELETE SET NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    daily_price NUMERIC(10, 2) NOT NULL CHECK (daily_price >= 0),
    weekly_price NUMERIC(10, 2) CHECK (weekly_price >= 0),
    security_deposit NUMERIC(10, 2) NOT NULL CHECK (security_deposit >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rental_items_rental_id ON rental_items(rental_id);
CREATE INDEX IF NOT EXISTS idx_rental_items_equipment_id ON rental_items(equipment_id);
CREATE INDEX IF NOT EXISTS idx_rental_items_inventory_id ON rental_items(inventory_id);
