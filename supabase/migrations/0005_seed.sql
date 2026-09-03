-- =========================================================
-- MIGRATION 0005_seed.sql
-- 45+ Realistic Production Equipment, Categories, Brands, Inventory & Demo Users
-- =========================================================

-- 1. SEED USERS
INSERT INTO public.users (id, email, phone, full_name, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'customer@flexgear.test', '9876543210', 'Arjun Menon (Filmmaker)', 'CUSTOMER'),
    ('00000000-0000-0000-0000-000000000002', 'admin@flexgear.test', '9988776655', 'Flex Gear Admin Team', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- 2. SEED BRANDS
INSERT INTO public.brands (id, slug, name)
VALUES
    ('10000000-0000-0000-0000-000000000001', 'sony', 'Sony'),
    ('10000000-0000-0000-0000-000000000002', 'canon', 'Canon'),
    ('10000000-0000-0000-0000-000000000003', 'red', 'RED Digital Cinema'),
    ('10000000-0000-0000-0000-000000000004', 'nikon', 'Nikon'),
    ('10000000-0000-0000-0000-000000000005', 'fujifilm', 'Fujifilm'),
    ('10000000-0000-0000-0000-000000000006', 'blackmagic', 'Blackmagic Design'),
    ('10000000-0000-0000-0000-000000000007', 'gopro', 'GoPro'),
    ('10000000-0000-0000-0000-000000000008', 'insta360', 'Insta360'),
    ('10000000-0000-0000-0000-000000000009', 'sigma', 'Sigma'),
    ('10000000-0000-0000-0000-000000000010', 'tamron', 'Tamron'),
    ('10000000-0000-0000-0000-000000000011', 'aputure', 'Aputure'),
    ('10000000-0000-0000-0000-000000000012', 'nanlite', 'Nanlite'),
    ('10000000-0000-0000-0000-000000000013', 'godox', 'Godox'),
    ('10000000-0000-0000-0000-000000000014', 'amaran', 'Amaran'),
    ('10000000-0000-0000-0000-000000000015', 'rode', 'Røde Microphones'),
    ('10000000-0000-0000-0000-000000000016', 'dji', 'DJI'),
    ('10000000-0000-0000-0000-000000000017', 'sennheiser', 'Sennheiser'),
    ('10000000-0000-0000-0000-000000000018', 'zoom', 'Zoom'),
    ('10000000-0000-0000-0000-000000000019', 'tascam', 'Tascam'),
    ('10000000-0000-0000-0000-000000000020', 'zhiyun', 'Zhiyun'),
    ('10000000-0000-0000-0000-000000000021', 'manfrotto', 'Manfrotto')
ON CONFLICT (slug) DO NOTHING;

-- 3. SEED CATEGORIES
INSERT INTO public.categories (id, slug, name, icon)
VALUES
    ('20000000-0000-0000-0000-000000000001', 'cameras', 'Cameras & Bodies', 'camera'),
    ('20000000-0000-0000-0000-000000000002', 'lenses', 'Cinema & Prime Lenses', 'disc'),
    ('20000000-0000-0000-0000-000000000003', 'lighting', 'Studio Lighting & Softboxes', 'sun'),
    ('20000000-0000-0000-0000-000000000004', 'audio', 'Audio, Mics & Recorders', 'mic'),
    ('20000000-0000-0000-0000-000000000005', 'gimbals', 'Gimbals & Stabilizers', 'crosshair'),
    ('20000000-0000-0000-0000-000000000006', 'drones', 'Aerial Drones & FPV', 'navigation'),
    ('20000000-0000-0000-0000-000000000007', 'kits', 'Complete Production Kits', 'film')
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED 45+ EQUIPMENT ITEMS
INSERT INTO public.equipment (id, category_id, brand_id, slug, name, description, image_url, daily_price, weekly_price, security_deposit, rating, review_count, is_featured, is_active, specs, included_accessories)
VALUES
-- CAMERAS (10 items)
(
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'sony-fx3-cinema-line',
    'Sony FX3 Full-Frame Cinema Line Camera',
    'Compact cinema line powerhouse with 12.1MP full-frame BSI sensor, 4K 120p, 16-bit RAW output, S-Cinetone color profile, and active internal cooling for continuous shooting.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    4000.00, 20000.00, 16000.00, 4.95, 42, TRUE, TRUE,
    '{"sensor": "Full-Frame 12.1MP Exmor R CMOS", "mount": "Sony E-Mount", "resolution": "4K UHD up to 120fps", "dynamic_range": "15+ stops with S-Log3", "weight": "715g"}'::jsonb,
    '["Sony FX3 Camera Body", "Top XLR Handle Unit", "2x Sony NP-FZ100 Batteries", "Dual Fast Charger", "Type A 160GB CFexpress Card", "Pelican Hard Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'sony-a7iv-mirrorless',
    'Sony A7 IV Full-Frame Hybrid Camera',
    'Versatile 33MP hybrid camera with 4K 60p video, 10-bit 4:2:2 internal recording, advanced Real-time Eye AF, and 5-axis optical image stabilization.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    2500.00, 12500.00, 10000.00, 4.85, 38, TRUE, TRUE,
    '{"sensor": "Full-Frame 33MP Exmor R CMOS", "mount": "Sony E-Mount", "resolution": "4K 60p (Super 35) / 4K 30p 7K oversampled", "weight": "658g"}'::jsonb,
    '["Sony A7 IV Body", "2x NP-FZ100 Batteries", "128GB V90 SDXC Card", "Dual Battery Charger", "Camera Strap & Body Cap"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'canon-eos-r5',
    'Canon EOS R5 8K Mirrorless Camera',
    'Industry benchmark 45MP sensor with internal 8K RAW video, 4K 120p, Dual Pixel CMOS AF II, and in-body image stabilization up to 8 stops.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    3000.00, 15000.00, 12000.00, 4.90, 29, TRUE, TRUE,
    '{"sensor": "45MP Full-Frame CMOS", "mount": "Canon RF Mount", "resolution": "8K DCI 30p RAW, 4K 120p 10-bit", "weight": "738g"}'::jsonb,
    '["Canon EOS R5 Body", "2x LP-E6NH Batteries", "512GB CFexpress Type B Card", "CFexpress Card Reader", "Charger & Neck Strap"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000002',
    'canon-eos-c70-cinema',
    'Canon EOS C70 4K Cinema Camera',
    'Super 35mm DGO sensor cinema camera with RF mount, motorized internal ND filters (up to 10 stops), dual Mini-XLR inputs, and 4K 120p recording.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    5000.00, 25000.00, 20000.00, 4.92, 19, TRUE, TRUE,
    '{"sensor": "Super 35mm Dual Gain Output (DGO)", "mount": "Canon RF Mount", "nd_filters": "Built-in 2, 4, 6, 8, 10 Stops", "weight": "1190g"}'::jsonb,
    '["Canon C70 Body", "Handle Unit & Mic Holder", "2x BP-A30 Batteries", "Single Battery Charger", "Compact Power Adapter", "Pelican Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'red-komodo-6k-cinema',
    'RED Digital Cinema KOMODO 6K Camera',
    'Super 35mm global shutter sensor camera capturing 6K REDCODE RAW at 40fps, RF mount, integrated touchscreen, and ultra-compact cinema form factor.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    8000.00, 40000.00, 32000.00, 4.98, 22, TRUE, TRUE,
    '{"sensor": "19.9MP Super 35 Global Shutter CMOS", "mount": "Canon RF Mount", "resolution": "6K 40fps, 4K 60fps REDCODE RAW", "weight": "950g"}'::jsonb,
    '["RED KOMODO 6K Body", "Canon RF to EF Adapter with ND", "2x 512GB CFast 2.0 Cards", "4x BP-975 Batteries", "Dual Charger", "Top Handle & Outrigger"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000006',
    'blackmagic-pocket-cinema-6k-pro',
    'Blackmagic Pocket Cinema Camera 6K Pro',
    'Advanced digital film camera with Super 35 HDR sensor, built-in motorized ND filters, adjustable HDR tilt screen, dual mini XLRs, and Blackmagic RAW.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    4500.00, 22500.00, 18000.00, 4.78, 16, FALSE, TRUE,
    '{"sensor": "Super 35 HDR (6144 x 3456)", "mount": "Active Canon EF Mount", "nd_filters": "Built-in 2, 4, 6 Stops", "dynamic_range": "13 Stops"}'::jsonb,
    '["BMPCC 6K Pro Body", "3x NP-F570 Batteries", "Samsung T7 1TB SSD & Mount", "Power Supply Cable", "Cage & Top Handle"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000004',
    'nikon-z6-iii-mirrorless',
    'Nikon Z6 III Full-Frame Camera',
    'Partially-stacked 24.5MP full-frame sensor featuring 6K 60p N-RAW internal recording, ultra-bright 5.76M-dot EVF, and pro autofocus speed.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    2800.00, 14000.00, 11200.00, 4.80, 12, FALSE, TRUE,
    '{"sensor": "24.5MP Partially Stacked CMOS", "mount": "Nikon Z Mount", "resolution": "6K 60p N-RAW, 4K 120p", "weight": "760g"}'::jsonb,
    '["Nikon Z6 III Body", "2x EN-EL15c Batteries", "160GB CFexpress Card", "Battery Charger"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000008',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000005',
    'fujifilm-xt5-mirrorless',
    'Fujifilm X-T5 Mirrorless Digital Camera',
    'High-resolution 40.2MP X-Trans CMOS 5 HR sensor, 6.2K 30p internal video, classic analog dials, and 7.0-stop internal body image stabilization.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    2200.00, 11000.00, 8800.00, 4.75, 14, FALSE, TRUE,
    '{"sensor": "40.2MP APS-C X-Trans 5 HR", "mount": "Fujifilm X Mount", "resolution": "6.2K 30p, 4K 60p 10-bit", "weight": "557g"}'::jsonb,
    '["Fujifilm X-T5 Body", "2x NP-W235 Batteries", "Dual Charger", "128GB SD Card", "Vintage Leather Strap"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000009',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000007',
    'gopro-hero-12-black',
    'GoPro HERO 12 Black Action Camera Kit',
    'Rugged 5.3K 60p action camera with HyperSmooth 6.0 stabilization, HDR video, dual LCD screens, and waterproof casing for extreme BTS and POV shots.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    800.00, 4000.00, 3200.00, 4.70, 31, FALSE, TRUE,
    '{"resolution": "5.3K 60fps, 4K 120fps", "stabilization": "HyperSmooth 6.0 + 360 Horizon Lock", "waterproof": "10m without housing"}'::jsonb,
    '["GoPro HERO 12 Camera", "3x Enduro Batteries", "Dual Charger", "Suction Cup Mount", "Chest Rig Mount", "128GB MicroSD"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000008',
    'insta360-x4-8k-camera',
    'Insta360 X4 8K 360-Degree Camera',
    'Next-gen 8K 360-degree capture camera with FlowState stabilization, invisible selfie stick effect, and AI-powered reframing tools.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    900.00, 4500.00, 3600.00, 4.65, 20, FALSE, TRUE,
    '{"resolution": "8K 30fps 360 video, 5.7K 60fps", "aperture": "F1.9", "battery": "2290mAh (135 min runtime)"}'::jsonb,
    '["Insta360 X4 Unit", "Invisible 114cm Selfie Stick", "2x Batteries", "Fast Hub Charger", "Lens Cap & Protective Case"]'::jsonb
),

-- LENSES (15 items)
(
    '30000000-0000-0000-0000-000000000011',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'sony-fe-24-70mm-f28-gm-ii',
    'Sony FE 24-70mm f/2.8 GM II Lens',
    'World-renowned standard zoom lens offering supreme sharpness, lightweight optical design, four XD linear autofocus motors, and constant f/2.8 aperture.',
    'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    1800.00, 9000.00, 7200.00, 4.95, 52, TRUE, TRUE,
    '{"focal_length": "24-70mm", "aperture": "f/2.8 to f/22", "filter_size": "82mm", "weight": "695g", "mount": "Sony E"}'::jsonb,
    '["Front & Rear Caps", "Lens Hood", "82mm UV Filter", "Padded Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000012',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'sony-fe-70-200mm-f28-gm-oss-ii',
    'Sony FE 70-200mm f/2.8 GM OSS II Telephoto',
    'Ultra-telephoto zoom lens with unmatched resolving power, built-in Optical SteadyShot, aperture ring with click switch, and 29% weight reduction.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    2000.00, 10000.00, 8000.00, 4.92, 34, TRUE, TRUE,
    '{"focal_length": "70-200mm", "aperture": "f/2.8", "stabilization": "Optical SteadyShot", "filter_size": "77mm", "weight": "1045g"}'::jsonb,
    '["Tripod Collar", "Front/Rear Caps", "Hood with Filter Window", "Heavy Duty Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000013',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'canon-rf-50mm-f12-l-usm',
    'Canon RF 50mm f/1.2L USM Prime Lens',
    'Ultra-fast standard prime lens delivering creamy bokeh, staggering low-light fidelity, and edge-to-edge sharpness.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    1500.00, 7500.00, 6000.00, 4.90, 28, FALSE, TRUE,
    '{"focal_length": "50mm", "aperture": "f/1.2 to f/16", "mount": "Canon RF", "weight": "950g"}'::jsonb,
    '["Lens Hood", "Front & Rear Caps", "Protective Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000014',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000009',
    'sigma-35mm-f14-dg-dn-art-sony-e',
    'Sigma 35mm f/1.4 DG DN Art Prime Lens (Sony E)',
    'Classic narrative cinematography focal length with optical perfection, de-clickable aperture ring, and AFL focus hold button.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    900.00, 4500.00, 3600.00, 4.88, 30, FALSE, TRUE,
    '{"focal_length": "35mm", "aperture": "f/1.4", "mount": "Sony E-Mount", "filter_size": "67mm"}'::jsonb,
    '["Petal Hood", "Front & Rear Caps", "Lens Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000015',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000010',
    'tamron-28-75mm-f28-di-iii-g2-sony-e',
    'Tamron 28-75mm f/2.8 Di III VXD G2 Lens',
    'Compact, lightweight workhorse zoom with high-speed VXD linear autofocus and close focusing capability.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    800.00, 4000.00, 3200.00, 4.80, 25, FALSE, TRUE,
    '{"focal_length": "28-75mm", "aperture": "f/2.8", "mount": "Sony E-Mount", "weight": "540g"}'::jsonb,
    '["Front & Rear Caps", "Lens Hood"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000016',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'sony-fe-16-35mm-f28-gm-ii',
    'Sony FE 16-35mm f/2.8 GM II Wide Zoom',
    'Flagship wide-angle zoom with breathtaking corner-to-corner clarity and near-zero chromatic aberration.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    1700.00, 8500.00, 6800.00, 4.90, 19, FALSE, TRUE,
    '{"focal_length": "16-35mm", "aperture": "f/2.8", "mount": "Sony E", "filter_size": "82mm"}'::jsonb,
    '["Lens Hood", "Front & Rear Caps", "Soft Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000017',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'canon-rf-100-500mm-f45-71-l-is-usm',
    'Canon RF 100-500mm f/4.5-7.1L IS USM',
    'Super-telephoto zoom lens with 5-stop optical IS, dual nano USM motors, and weather-sealed L-series build.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    2200.00, 11000.00, 8800.00, 4.85, 15, FALSE, TRUE,
    '{"focal_length": "100-500mm", "aperture": "f/4.5 to f/7.1", "mount": "Canon RF", "weight": "1365g"}'::jsonb,
    '["Tripod Collar", "Lens Hood", "Lens Pouch", "Front & Rear Caps"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000018',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'sony-fe-90mm-f28-macro-g-oss',
    'Sony FE 90mm f/2.8 Macro G OSS Lens',
    'True 1:1 macro reproduction ratio with built-in image stabilization and focus range limiter for product cinematography.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    700.00, 3500.00, 2800.00, 4.88, 26, FALSE, TRUE,
    '{"focal_length": "90mm", "magnification": "1.0x", "aperture": "f/2.8", "mount": "Sony E"}'::jsonb,
    '["Hood", "Front & Rear Caps", "Storage Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000019',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000009',
    'sigma-18-35mm-f18-dc-hsm-art-canon-ef',
    'Sigma 18-35mm f/1.8 DC HSM Art Lens (EF Mount)',
    'The legendary high-speed zoom lens with constant f/1.8 aperture for Super 35 and APS-C cinema sensors.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    850.00, 4250.00, 3400.00, 4.90, 40, FALSE, TRUE,
    '{"focal_length": "18-35mm", "aperture": "f/1.8", "mount": "Canon EF Mount", "format": "APS-C / Super 35"}'::jsonb,
    '["Hood", "Front & Rear Caps", "Padded Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000020',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'sony-fe-200-600mm-f56-63-g-oss',
    'Sony FE 200-600mm f/5.6-6.3 G OSS Super Telephoto',
    'Extreme reach telephoto zoom with internal zoom mechanism and direct manual focus for wildlife and sports productions.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    2500.00, 12500.00, 10000.00, 4.92, 18, FALSE, TRUE,
    '{"focal_length": "200-600mm", "aperture": "f/5.6-6.3", "mount": "Sony E-Mount", "weight": "2115g"}'::jsonb,
    '["Tripod Collar", "Lens Strap", "Hood", "Front & Rear Caps", "Soft Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000021',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'canon-rf-24-70mm-f28-l-is-usm',
    'Canon RF 24-70mm f/2.8L IS USM Lens',
    'Standard zoom for Canon EOS R system with 5-stop image stabilization and Nano USM motor.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    1700.00, 8500.00, 6800.00, 4.88, 21, FALSE, TRUE,
    '{"focal_length": "24-70mm", "aperture": "f/2.8", "mount": "Canon RF", "weight": "900g"}'::jsonb,
    '["Front & Rear Caps", "Lens Hood", "Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000022',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000001',
    'sony-fe-50mm-f12-gm-prime',
    'Sony FE 50mm f/1.2 GM Prime Lens',
    'G Master prime lens with ultra-fast f/1.2 aperture, 11-blade circular diaphragm, and four XD linear motors.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    1600.00, 8000.00, 6400.00, 4.96, 32, FALSE, TRUE,
    '{"focal_length": "50mm", "aperture": "f/1.2", "mount": "Sony E-Mount", "weight": "778g"}'::jsonb,
    '["Round Lens Hood", "Front & Rear Caps", "Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000023',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000009',
    'sigma-24-70mm-f28-dg-dn-art-ii-sony-e',
    'Sigma 24-70mm f/2.8 DG DN II Art Lens',
    'Updated flagship zoom with HLA motor, aperture ring with click de-selection, and compact build.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    1100.00, 5500.00, 4400.00, 4.82, 27, FALSE, TRUE,
    '{"focal_length": "24-70mm", "aperture": "f/2.8", "mount": "Sony E-Mount"}'::jsonb,
    '["Hood", "Caps", "Carrying Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000024',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'canon-rf-85mm-f12-l-usm',
    'Canon RF 85mm f/1.2L USM Portrait Prime',
    'Definitive portrait and cinematic close-up lens with Blue Spectrum Refractive optics.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    1800.00, 9000.00, 7200.00, 4.94, 23, FALSE, TRUE,
    '{"focal_length": "85mm", "aperture": "f/1.2", "mount": "Canon RF Mount", "weight": "1195g"}'::jsonb,
    '["Lens Hood", "Front & Rear Caps", "Lens Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000025',
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000010',
    'tamron-70-180mm-f28-di-iii-vxd-sony-e',
    'Tamron 70-180mm f/2.8 Di III VXD Telephoto',
    'Ultra-compact telephoto zoom lens weighing just 810g with f/2.8 constant aperture.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    1000.00, 5000.00, 4000.00, 4.79, 17, FALSE, TRUE,
    '{"focal_length": "70-180mm", "aperture": "f/2.8", "mount": "Sony E-Mount", "filter_size": "67mm"}'::jsonb,
    '["Hood", "Front & Rear Caps"]'::jsonb
),

-- LIGHTING (10 items)
(
    '30000000-0000-0000-0000-000000000026',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000011',
    'aputure-ls-600d-pro-daylight-led',
    'Aputure LS 600d Pro Daylight LED Fixture',
    'Massive 600W COB LED output with 29,300+ lux at 3m, IP54 weather resistance, Bowens mount, and Sidus Link app wireless control.',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    1500.00, 7500.00, 6000.00, 4.96, 35, TRUE, TRUE,
    '{"power_output": "600W (720W Max Draw)", "color_temp": "5600K Daylight", "cri_tlci": "96+ / 96+", "mount": "Bowens Mount"}'::jsonb,
    '["LS 600d Pro Lamp Head", "Control Box", "Hyper Reflector", "5-pin Weatherproof Cable", "Neutrik AC Cable", "Rolling Hard Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000027',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000011',
    'aputure-ls-300x-bi-color-led',
    'Aputure LS 300X Bi-Color LED Monolight',
    'Versatile 350W bi-color LED fixture with optical blending element, 2700K to 6500K CCT range, and presets.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    1000.00, 5000.00, 4000.00, 4.88, 28, FALSE, TRUE,
    '{"power_output": "350W", "color_temp": "2700K - 6500K", "cri": "96+", "beam_angle": "55 degree reflector"}'::jsonb,
    '["300X Lamp Head", "Control Box", "Standard Reflector", "Quick Release Clamp", "Carrying Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000028',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000012',
    'nanlite-forza-500-daylight-led',
    'Nanlite Forza 500 500W Daylight LED Monolight',
    'High-output monolight delivering 66,300 lux at 1m with reflector, lightweight carbon fiber body, and DMX support.',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    1200.00, 6000.00, 4800.00, 4.80, 20, FALSE, TRUE,
    '{"power_output": "500W", "color_temp": "5600K", "weight": "2.6kg"}'::jsonb,
    '["Forza 500 Head", "Control Unit", "Reflector", "Padded Carry Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000029',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000013',
    'godox-sl150-ii-daylight-led',
    'Godox SL150 II 150W Daylight LED Light',
    'Silent mode continuous LED light suitable for interview lighting, YouTube sets, and product shoots.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    500.00, 2500.00, 2000.00, 4.75, 45, FALSE, TRUE,
    '{"power_output": "150W", "color_temp": "5600K", "mount": "Bowens"}'::jsonb,
    '["SL150II Light", "Reflector", "Power Cord", "Protective Lamp Cover"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000030',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000014',
    'amaran-f22x-flexible-mat-light',
    'Amaran F22x 2x2 Flexible Bi-Color LED Mat',
    'Ultra-thin flexible bi-color LED mat (200W) with foldable softbox, grid, and baby pin mount.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    600.00, 3000.00, 2400.00, 4.85, 14, FALSE, TRUE,
    '{"power_output": "200W", "color_temp": "2500K - 7500K", "dimensions": "2x2 ft flexible mat"}'::jsonb,
    '["F22x LED Mat", "Control Box", "Softbox", "45 Degree Grid", "X-Frame Mount", "Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000031',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000013',
    'godox-lr150-18-inch-ring-light',
    'Godox LR150 18-inch Bi-Color Ring Light',
    '18-inch studio ring light with phone holder, cold shoe mounts, and continuous dimmer.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    400.00, 2000.00, 1600.00, 4.70, 22, FALSE, TRUE,
    '{"diameter": "18 inch", "color_temp": "3000K - 6000K", "power": "45W"}'::jsonb,
    '["Ring Light", "Light Stand", "Phone Clamp", "Power Adapter"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000032',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000013',
    'godox-tl60-rgb-tube-light-kit',
    'Godox TL60 RGB Tube Light 2-Light Kit',
    'Full-color RGB tube lights with built-in batteries, 36,000 colors, 39 special FX, and wireless app control.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    600.00, 3000.00, 2400.00, 4.88, 31, FALSE, TRUE,
    '{"length": "75cm (2.5ft)", "color_mode": "RGB / HSI / CCT", "battery": "Built-in Lithium (2h runtime)"}'::jsonb,
    '["2x TL60 Tube Lights", "2x Power Adapters", "2x Grid Attachments", "Mounting Clamps", "Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000033',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000011',
    'aputure-nova-p300c-rgbww-panel',
    'Aputure Nova P300c RGBWW 300W LED Panel Light',
    'High-end studio panel light producing rich saturated colors, 2000K-10000K CCT, and built-in gel library.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    2000.00, 10000.00, 8000.00, 4.92, 11, FALSE, TRUE,
    '{"power_output": "300W", "color_mode": "RGBWW", "cct": "2000K - 10000K", "weight": "10.3kg"}'::jsonb,
    '["Nova P300c Panel", "Control Box", "Softbox with Grid", "Rolling Hard Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000034',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000012',
    'nanlite-pavotube-ii-30x-rgb-tube',
    'Nanlite PavoTube II 30X RGBWW Pixel Tube (4ft)',
    'Pixel-controllable RGBWW LED tube light featuring internal battery, pixel animations, and green-magenta shift.',
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    700.00, 3500.00, 2800.00, 4.85, 18, FALSE, TRUE,
    '{"length": "117cm (4ft)", "pixel_effects": "Yes", "cct": "2700K - 12000K"}'::jsonb,
    '["PavoTube II 30X", "Power Cable", "2x 1/4-20 Mounting Clips", "Padded Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000035',
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000014',
    'amaran-200d-s-daylight-monolight',
    'Amaran 200d S Daylight Point-Source LED',
    '200W Bowens mount daylight fixture with upgraded dual-blue LED chipset for ultra-accurate skin tone rendering.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    550.00, 2750.00, 2200.00, 4.78, 25, FALSE, TRUE,
    '{"power": "200W", "color_temp": "5600K Daylight", "ssi_d56": "87"}'::jsonb,
    '["Amaran 200d S", "Hyper Reflector", "Power Adapter", "Cable"]'::jsonb
),

-- AUDIO (10 items)
(
    '30000000-0000-0000-0000-000000000036',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000015',
    'rode-ntg5-shotgun-mic-kit',
    'Røde NTG5 Broadcast Shotgun Microphone Kit',
    'Ultra-lightweight (76g) broadcast-grade shotgun microphone with acoustic circular port design and RF-bias moisture resistance.',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    900.00, 4500.00, 3600.00, 4.95, 38, TRUE, TRUE,
    '{"polar_pattern": "Supercardioid", "weight": "76g", "frequency_range": "20Hz - 20kHz", "output": "3-pin XLR"}'::jsonb,
    '["NTG5 Shotgun Mic", "PG2-R Pistol Grip Shockmount", "WS10 Deluxe Windshield", "Foam Windscreen", "XLR Cable", "Zip Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000037',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000015',
    'rode-wireless-go-ii-dual-mic-kit',
    'Røde Wireless GO II Dual-Channel Wireless Mic System',
    'Compact dual-transmitter wireless microphone kit with onboard 24-hour backup audio recording and 200m line-of-sight range.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    1200.00, 6000.00, 4800.00, 4.90, 56, TRUE, TRUE,
    '{"range": "200m Line of Sight", "channels": "Dual Channel", "internal_recording": "Over 40 hours compressed / 7h uncompressed"}'::jsonb,
    '["2x Transmitters", "1x Dual Receiver", "3x Furry Windshields", "SC5 3.5mm TRS Cable", "3x USB-C Cables", "Carry Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000038',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000016',
    'dji-mic-2-transmitter-receiver-kit',
    'DJI Mic 2 Dual-Channel Wireless Microphone System',
    'Pocket-sized audio system with 32-bit float internal recording, intelligent noise cancelling, and magnetic attachment.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    1000.00, 5000.00, 4000.00, 4.92, 42, FALSE, TRUE,
    '{"recording": "32-bit Float Internal", "battery_life": "18 Hours with Charging Case", "range": "250m"}'::jsonb,
    '["2x DJI Mic Transmitters", "1x Receiver", "Charging Case", "2x Windscreens", "Lightning & USB-C Adapters", "Carrying Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000039',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000017',
    'sennheiser-mke-600-shotgun-mic',
    'Sennheiser MKE 600 Shotgun Microphone',
    'Ideal camera-mountable shotgun mic with high directivity and phantom or AA battery power versatility.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    800.00, 4000.00, 3200.00, 4.88, 25, FALSE, TRUE,
    '{"polar_pattern": "Supercardioid / Lobar", "power": "Phantom or 1x AA Battery", "frequency": "40Hz - 20kHz"}'::jsonb,
    '["MKE 600 Mic", "MZS 600 Shock Mount", "MZW 600 Foam Windshield", "KA 600 Coiled Cable", "Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000040',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000018',
    'zoom-h6-all-black-6-track-recorder',
    'Zoom H6 All Black 6-Track Handy Audio Recorder',
    'Portable audio recorder with interchangeable X/Y mic capsule, four XLR/TRS combo inputs, and high-gain preamps.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    600.00, 3000.00, 2400.00, 4.82, 33, FALSE, TRUE,
    '{"tracks": "6 Simultaneous Recording Tracks", "inputs": "4x XLR/TRS Combo", "sample_rate": "24-bit / 96kHz"}'::jsonb,
    '["Zoom H6 Recorder", "XYH-6 X/Y Mic Capsule", "4x AA Batteries", "32GB SD Card", "Hard Foam Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000041',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000019',
    'tascam-dr-40x-four-track-recorder',
    'Tascam DR-40X 4-Track Audio Recorder with USB Interface',
    'Versatile 4-track audio recorder with dual unidirectional condenser mics in A-B or X-Y position.',
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    500.00, 2500.00, 2000.00, 4.70, 19, FALSE, TRUE,
    '{"tracks": "4-Track", "inputs": "Dual Locking XLR/TRS", "interface": "2-In/2-Out USB Audio"}'::jsonb,
    '["Tascam DR-40X", "3x AA Batteries", "32GB MicroSD & Adapter", "USB Cable"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000042',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000015',
    'rode-videomic-pro-plus',
    'Røde VideoMic Pro+ Premium On-Camera Shotgun Mic',
    'Compact on-camera shotgun mic with auto-power function, safety audio channel, and rechargeable lithium battery.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    450.00, 2250.00, 1800.00, 4.80, 27, FALSE, TRUE,
    '{"polar_pattern": "Supercardioid", "power": "LB-1 Lithium Battery / 2x AA", "mount": "Rycote Lyre Shockmount"}'::jsonb,
    '["VideoMic Pro+", "LB-1 Rechargeable Battery", "3.5mm TRS Cable", "Micro USB Cable"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000043',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000017',
    'sennheiser-avx-mke2-wireless-lav-set',
    'Sennheiser AVX-MKE2 Pro Digital Wireless Lavalier Set',
    'Zero-configuration 1.9GHz wireless system with ultra-compact XLR receiver and broadcast MKE2 lavalier.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    1100.00, 5500.00, 4400.00, 4.90, 14, FALSE, TRUE,
    '{"frequency": "1.9GHz License-Free", "lavalier": "MKE 2 Gold Omni", "connection": "Direct XLR Plugin"}'::jsonb,
    '["EKP AVX Receiver", "SK AVX Bodypack", "MKE2 Lavalier Mic", "2x Li-Ion Battery Packs", "Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000044',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000018',
    'zoom-f6-32-bit-float-field-recorder',
    'Zoom F6 6-Input / 14-Track 32-Bit Float Field Recorder',
    'Dual A/D converters with 32-bit float recording for clip-proof dynamic audio on professional film sets.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    1400.00, 7000.00, 5600.00, 4.94, 16, FALSE, TRUE,
    '{"recording": "32-Bit Float / 24-Bit Linear", "preamps": "6x Discrete XLR Inputs (-127dBu EIN)", "timecode": "Accurate 0.2ppm"}'::jsonb,
    '["Zoom F6 Recorder", "Camera Mount Adapter", "4x AA Batteries", "Power Supply", "Strap"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000045',
    '20000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000015',
    'carbon-fiber-boom-pole-cables',
    'Pro Carbon Fiber 3m Boom Pole & XLR Cable Kit',
    'Telescoping 5-section carbon fiber boom pole extending up to 3 meters with internal coiled cable routing.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    300.00, 1500.00, 1200.00, 4.70, 20, FALSE, TRUE,
    '{"material": "Carbon Fiber", "max_length": "3.0m (10ft)", "min_length": "0.8m", "weight": "580g"}'::jsonb,
    '["3m Carbon Boom Pole", "5m Heavy Duty XLR Cable", "Adapter Studs", "Carrying Bag"]'::jsonb
),

-- GIMBALS & STABILIZERS (5 items)
(
    '30000000-0000-0000-0000-000000000046',
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000016',
    'dji-rs-3-pro-gimbal-combo',
    'DJI RS 3 Pro Gimbal Stabilizer Combo',
    'Carbon fiber 3-axis stabilizer with 4.5kg payload, automated axis locks, LiDAR focusing support, and OLED touchscreen.',
    'https://images.unsplash.com/photo-1589872584140-5471cf47f230?w=800&auto=format&fit=crop&q=80',
    1200.00, 6000.00, 4800.00, 4.95, 44, TRUE, TRUE,
    '{"payload_capacity": "4.5kg (10 lbs)", "battery_life": "12 Hours", "weight": "1.5kg", "material": "Carbon Fiber"}'::jsonb,
    '["RS 3 Pro Gimbal", "BG30 Battery Grip", "Focus Motor (2022)", "RavenEye Transmitter", "Briefcase Handle", "Hard Shell Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000047',
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000016',
    'dji-rs-4-gimbal-stabilizer',
    'DJI RS 4 Commercial Gimbal Stabilizer',
    'Next-generation lightweight commercial stabilizer with 2nd-gen native vertical shooting and Teflon-coated arms.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    1300.00, 6500.00, 5200.00, 4.90, 18, FALSE, TRUE,
    '{"payload_capacity": "3.0kg", "battery_runtime": "12 Hours (29.5h with high cap grip)", "features": "2nd Gen Auto Axis Locks"}'::jsonb,
    '["RS 4 Gimbal", "BG21 Battery Grip", "Quick-Release Plate", "Lens-Fastening Support", "Carry Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000048',
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000020',
    'zhiyun-crane-4-3-axis-stabilizer',
    'Zhiyun Crane 4 3-Axis Handheld Gimbal',
    'High-payload gimbal with built-in balance indicator balance lights, sling grip, and 10W fill light.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    1000.00, 5000.00, 4000.00, 4.82, 16, FALSE, TRUE,
    '{"payload": "Up to 5.0kg", "fill_light": "10W Built-in LED", "display": "1.22-inch Color Touchscreen"}'::jsonb,
    '["Crane 4 Gimbal", "Sling Grip Handle", "Wrist Rest", "Quick Release Plates", "Storage Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000049',
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000020',
    'zhiyun-weebill-3s-handheld-gimbal',
    'Zhiyun Weebill 3S Compact Gimbal Stabilizer',
    'Ergonomic sling mode gimbal for mirrorless setups with Bluetooth shutter control and built-in 1000 lux fill light.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    800.00, 4000.00, 3200.00, 4.75, 20, FALSE, TRUE,
    '{"payload": "Supports Sony A7 / Canon R5 setups", "weight": "1.05kg", "battery": "11.5 Hours"}'::jsonb,
    '["Weebill 3S Gimbal", "Tripod Base", "Lens Support", "Camera Control Cables", "Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000050',
    '20000000-0000-0000-0000-000000000005',
    '10000000-0000-0000-0000-000000000021',
    'manfrotto-mvg300xm-modular-gimbal',
    'Manfrotto MVG300XM Modular 3-Axis Gimbal',
    'Modular cinema gimbal with detachable remote control handle and 3.4kg payload capacity.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    700.00, 3500.00, 2800.00, 4.70, 11, FALSE, TRUE,
    '{"payload": "3.4kg", "features": "Modular Removable Handle", "lcd": "Touch Screen Control"}'::jsonb,
    '["MVG300XM Gimbal", "Detachable Handle", "Charger", "Cables", "Padded Case"]'::jsonb
),

-- DRONES (5 items)
(
    '30000000-0000-0000-0000-000000000051',
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000016',
    'dji-mavic-3-pro-fly-more-combo',
    'DJI Mavic 3 Pro Cine Fly More Combo (Triple Camera)',
    'Tri-camera flagship drone featuring 4/3 CMOS Hasselblad camera, dual telephoto cameras, 43-min flight time, and Apple ProRes recording.',
    'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    3500.00, 17500.00, 14000.00, 4.96, 30, TRUE, TRUE,
    '{"camera": "4/3 CMOS Hasselblad 5.1K + 70mm Medium Tele + 166mm Tele", "flight_time": "43 Minutes per battery", "transmission": "DJI O3+ 15km Range"}'::jsonb,
    '["Mavic 3 Pro Aircraft", "DJI RC Pro Remote", "3x Intelligent Flight Batteries", "Battery Charging Hub", "ND Filter Set (ND8/16/32/64)", "Shoulder Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000052',
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000016',
    'dji-mini-4-pro-fly-more-plus',
    'DJI Mini 4 Pro Fly More Combo Plus',
    'Sub-249g ultra-portable drone with omnidirectional obstacle sensing, 4K 60p HDR vertical shooting, and 45-min extended flight batteries.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    1800.00, 9000.00, 7200.00, 4.90, 48, FALSE, TRUE,
    '{"weight": "< 249g", "resolution": "4K 60fps HDR, 4K 100fps Slow-mo", "obstacle_sensing": "Omnidirectional Active Obstacle Avoidance"}'::jsonb,
    '["Mini 4 Pro Drone", "DJI RC 2 Screen Remote", "3x Flight Batteries Plus", "Two-Way Charging Hub", "Shoulder Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000053',
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000016',
    'dji-air-3-fly-more-combo',
    'DJI Air 3 Dual-Camera Drone Combo',
    'Mid-tier powerhouse with 1/1.3-inch CMOS wide & 3x medium telephoto cameras, 46-min flight time, and 4K 100p video.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    2500.00, 12500.00, 10000.00, 4.86, 22, FALSE, TRUE,
    '{"cameras": "Dual 48MP 1/1.3-inch CMOS (24mm + 70mm)", "flight_time": "46 Minutes", "color_profiles": "10-bit D-Log M / HLG"}'::jsonb,
    '["Air 3 Drone", "DJI RC-N2 Remote", "3x Batteries", "Charging Hub", "ND Filters", "Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000054',
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000016',
    'dji-avata-2-fpv-drone-fly-more-combo',
    'DJI Avata 2 FPV CineWhoop Drone (Goggles 3)',
    'Immersive FPV cinewhoop with 1/1.3-inch sensor, 4K 60p HDR, integrated propeller guards, and intuitive motion controller.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    2200.00, 11000.00, 8800.00, 4.92, 25, FALSE, TRUE,
    '{"camera": "1/1.3-inch CMOS 4K 60fps HDR", "fov": "155 degree Ultra-Wide", "flight_time": "23 Minutes", "safety": "Built-in Prop Guards"}'::jsonb,
    '["DJI Avata 2 Drone", "DJI Goggles 3", "DJI RC Motion 3", "3x Batteries", "Charging Hub", "Sling Bag"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000055',
    '20000000-0000-0000-0000-000000000006',
    '10000000-0000-0000-0000-000000000016',
    'dji-fpv-explorer-combo',
    'DJI FPV Explorer Combo Drone',
    'High-speed aerobatic FPV drone reaching 140 km/h with 4K 60p super-wide camera and emergency brake & hover.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    2000.00, 10000.00, 8000.00, 4.80, 19, FALSE, TRUE,
    '{"max_speed": "140 km/h (87 mph)", "camera": "4K 60fps 120Mbps", "mode": "M-Mode full manual"}'::jsonb,
    '["DJI FPV Drone", "DJI Goggles V2", "Remote Controller 2", "2x Batteries", "Propellers Set"]'::jsonb
),

-- PRODUCTION KITS (5 complete kits)
(
    '30000000-0000-0000-0000-000000000056',
    '20000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000001',
    'complete-wedding-film-production-kit',
    'Complete Wedding Film Production Kit',
    'Comprehensive multi-camera setup featuring Sony FX3, A7 IV, 24-70 GM II, 70-200 GM II, DJI RS 3 Pro Gimbal, and Wireless GO II audio.',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    6000.00, 30000.00, 24000.00, 4.98, 48, TRUE, TRUE,
    '{"cameras": "Sony FX3 + Sony A7 IV", "lenses": "24-70mm GM II + 70-200mm GM II", "stabilizer": "DJI RS 3 Pro", "audio": "Rode Wireless GO II Dual Kit"}'::jsonb,
    '["Sony FX3 Cinema Camera", "Sony A7 IV Hybrid Body", "Sony 24-70mm f/2.8 GM II", "Sony 70-200mm f/2.8 GM II", "DJI RS 3 Pro Gimbal Combo", "Rode Wireless GO II Dual Mic", "6x NP-FZ100 Batteries", "2x High Speed V90 SD Cards", "2x Hard Cases"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000057',
    '20000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000001',
    'youtube-studio-starter-kit',
    'YouTube Creator & Studio Starter Kit',
    'Turnkey creator bundle containing Sony A7 IV, Sigma 24-70 f/2.8, Godox SL150 II Softbox Light, and DJI Mic wireless system.',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    2500.00, 12500.00, 10000.00, 4.90, 35, TRUE, TRUE,
    '{"camera": "Sony A7 IV 4K", "lens": "Sigma 24-70mm f/2.8 Art", "lighting": "Godox SL150 II with Lantern Softbox", "audio": "DJI Mic Dual System"}'::jsonb,
    '["Sony A7 IV Body", "Sigma 24-70mm f/2.8 Art", "Godox SL150 II Light & Stand", "Lantern Softbox", "DJI Mic Wireless Set", "Heavy Duty Studio Tripod"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000058',
    '20000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000003',
    'cinematic-feature-film-master-kit',
    'Cinematic Feature Film 6K Master Kit',
    'High-end cinema package comprising RED KOMODO 6K, Sigma Cine Primes (24/35/50/85), Aputure 600d Pro light, Zoom F6 32-bit recorder, and RS 3 Pro.',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    8000.00, 40000.00, 32000.00, 5.00, 19, TRUE, TRUE,
    '{"camera": "RED KOMODO 6K Cinema Camera", "lighting": "Aputure LS 600d Pro", "audio": "Zoom F6 32-Bit Float", "support": "DJI RS 3 Pro + Carbon Tripod"}'::jsonb,
    '["RED KOMODO 6K Cinema Camera", "4x High Speed CFast 512GB Cards", "Aputure 600d Pro Kit", "Rode NTG5 Boom Kit", "Zoom F6 Audio Recorder", "DJI RS 3 Pro", "Pelican Flight Cases"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000059',
    '20000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000002',
    'corporate-interview-documentary-kit',
    'Corporate & Documentary 2-Camera Interview Kit',
    'Dual Canon cinema camera interview package with Canon C70, Canon R5, 2x Aputure Bi-color lights, and Sennheiser AVX lavs.',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    3000.00, 15000.00, 12000.00, 4.88, 22, FALSE, TRUE,
    '{"a_cam": "Canon EOS C70", "b_cam": "Canon EOS R5", "lighting": "2x Aputure 300X with Softboxes", "audio": "2x Sennheiser AVX Lavs"}'::jsonb,
    '["Canon C70 Body", "Canon R5 Body", "Canon RF 24-70 f/2.8", "Canon RF 50 f/1.2", "2x Aputure 300X Lights & C-Stands", "2x Sennheiser AVX MKE2", "2x Carbon Tripods"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000060',
    '20000000-0000-0000-0000-000000000007',
    '10000000-0000-0000-0000-000000000001',
    'run-and-gun-travel-vlogging-kit',
    'Run & Gun Travel Vlogging & Documentary Kit',
    'Ultra-portable travel setup with Sony A7 IV, Tamron 28-75mm, DJI Mic 2, and Rode VideoMic Pro+.',
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    1500.00, 7500.00, 6000.00, 4.85, 30, FALSE, TRUE,
    '{"camera": "Sony A7 IV", "lens": "Tamron 28-75mm f/2.8 G2", "audio": "DJI Mic 2 Set + Rode VideoMic Pro+", "weight": "Ultra Lightweight"}'::jsonb,
    '["Sony A7 IV Camera", "Tamron 28-75mm f/2.8 G2", "DJI Mic 2 Wireless Set", "Rode VideoMic Pro+", "3x NP-FZ100 Batteries", "Compact Travel Tripod", "Backpack"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 5. SEED SERIALIZED INVENTORY UNITS (1-5 units per equipment item)
INSERT INTO public.equipment_inventory (equipment_id, serial_number, status)
SELECT 
    id AS equipment_id,
    'SN-' || UPPER(SUBSTRING(slug FROM 1 FOR 6)) || '-' || LPAD(i::text, 4, '0') AS serial_number,
    'AVAILABLE' AS status
FROM public.equipment,
generate_series(1, 4) AS i
ON CONFLICT (serial_number) DO NOTHING;
