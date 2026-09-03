-- 003_equipment.sql
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    brand VARCHAR(100) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    model VARCHAR(100),
    description TEXT NOT NULL,
    daily_price NUMERIC(10, 2) NOT NULL CHECK (daily_price > 0),
    weekly_price NUMERIC(10, 2) CHECK (weekly_price IS NULL OR weekly_price > 0),
    monthly_price NUMERIC(10, 2) CHECK (monthly_price IS NULL OR monthly_price > 0),
    security_deposit NUMERIC(10, 2) NOT NULL CHECK (security_deposit >= 0),
    replacement_value NUMERIC(10, 2) NOT NULL CHECK (replacement_value > 0),
    thumbnail_url TEXT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00 CHECK (rating >= 0 AND rating <= 5.00),
    review_count INT NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    specs JSONB NOT NULL DEFAULT '{}'::jsonb,
    included_accessories JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_brand ON equipment(brand);
CREATE INDEX IF NOT EXISTS idx_equipment_slug ON equipment(slug);
CREATE INDEX IF NOT EXISTS idx_equipment_daily_price ON equipment(daily_price);
CREATE INDEX IF NOT EXISTS idx_equipment_rating ON equipment(rating);
