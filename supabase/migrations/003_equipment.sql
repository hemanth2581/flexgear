-- 003_equipment.sql: Equipment catalog table
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100),
    description TEXT NOT NULL,
    daily_price NUMERIC(10, 2) NOT NULL CHECK (daily_price >= 0),
    weekly_price NUMERIC(10, 2) CHECK (weekly_price >= 0),
    monthly_price NUMERIC(10, 2) CHECK (monthly_price >= 0),
    security_deposit NUMERIC(10, 2) NOT NULL CHECK (security_deposit >= 0),
    replacement_value NUMERIC(10, 2) NOT NULL DEFAULT 50000 CHECK (replacement_value > 0),
    thumbnail_url TEXT NOT NULL,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    included_accessories JSONB NOT NULL DEFAULT '[]'::jsonb,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_category_id ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_slug ON equipment(slug);
CREATE INDEX IF NOT EXISTS idx_equipment_brand ON equipment(brand);
CREATE INDEX IF NOT EXISTS idx_equipment_featured ON equipment(is_featured);
CREATE INDEX IF NOT EXISTS idx_equipment_price ON equipment(daily_price);
