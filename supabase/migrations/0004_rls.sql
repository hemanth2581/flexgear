-- =========================================================
-- MIGRATION 0004_rls.sql
-- Row Level Security (RLS) policies for all tables
-- =========================================================

-- Enable RLS on ALL tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;

-- 1. PUBLIC READ POLICIES (Catalog & Gear)
CREATE POLICY "Allow public read active categories" ON public.categories
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Allow public read brands" ON public.brands
    FOR SELECT USING (TRUE);

CREATE POLICY "Allow public read active equipment" ON public.equipment
    FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Allow public read reviews" ON public.reviews
    FOR SELECT USING (TRUE);

CREATE POLICY "Allow public read inventory status" ON public.equipment_inventory
    FOR SELECT USING (TRUE);

-- 2. USER AUTHENTICATED ACCESS POLICIES
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Rental Orders
CREATE POLICY "Users can view own rental orders" ON public.rental_orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create rental orders" ON public.rental_orders
    FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Rental Items
CREATE POLICY "Users can view own rental items" ON public.rental_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rental_orders
            WHERE rental_orders.id = rental_items.rental_order_id
            AND (rental_orders.user_id = auth.uid() OR auth.uid() IS NULL)
        )
    );

-- Addresses
CREATE POLICY "Users can manage own addresses" ON public.addresses
    FOR ALL USING (auth.uid() = user_id);

-- Wishlist
CREATE POLICY "Users can manage own wishlist" ON public.wishlist_items
    FOR ALL USING (auth.uid() = user_id);

-- Reviews (Only users with returned rental order can review)
CREATE POLICY "Users can insert review if eligible" ON public.reviews
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.rental_orders ro
            JOIN public.rental_items ri ON ri.rental_order_id = ro.id
            WHERE ro.user_id = auth.uid()
            AND ro.status = 'RETURNED'
            AND ri.equipment_id = reviews.equipment_id
        )
    );
