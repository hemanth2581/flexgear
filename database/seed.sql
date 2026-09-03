-- =========================================================
-- SEED DATA: FlexGear Production Cinema Database
-- =========================================================

-- 1. SEED USERS
INSERT INTO users (id, email, phone, full_name, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'customer@flexgear.test', '+919876543210', 'Arjun Menon (Filmmaker)', 'CUSTOMER'),
    ('00000000-0000-0000-0000-000000000002', 'admin@flexgear.test', '+919988776655', 'Flex Gear Operations Admin', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 2. SEED CATEGORIES
INSERT INTO categories (id, slug, name, icon, description, display_order)
VALUES
    ('20000000-0000-0000-0000-000000000001', 'cameras', 'Cameras & Bodies', 'camera', 'Full-frame & Super 35 cinema cameras, mirrorless bodies & action cams.', 1),
    ('20000000-0000-0000-0000-000000000002', 'lenses', 'Cinema & Prime Lenses', 'disc', 'Cine primes, fast zoom lenses, anamorphic glass, and macro lenses.', 2),
    ('20000000-0000-0000-0000-000000000003', 'lighting', 'Studio Lighting & Softboxes', 'sun', 'Continuous LED spotlights, RGB light tubes, softboxes, and C-stands.', 3),
    ('20000000-0000-0000-0000-000000000004', 'audio', 'Audio, Mics & Recorders', 'mic', 'Wireless lavaliers, shotgun boom mics, 32-bit float field recorders.', 4),
    ('20000000-0000-0000-0000-000000000005', 'gimbals', 'Gimbals & Stabilizers', 'crosshair', '3-axis motorized camera gimbals, pro steadicams & car mounts.', 5),
    ('20000000-0000-0000-0000-000000000006', 'drones', 'Aerial Drones & FPV', 'navigation', 'Cinematic aerial platforms, FPV drones, and remote controllers.', 6),
    ('20000000-0000-0000-0000-000000000007', 'kits', 'Complete Production Kits', 'film', 'Curated cinema packages with camera, lenses, audio, and power.', 7)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon;

-- 3. SEED 45+ EQUIPMENT ITEMS
INSERT INTO equipment (
    id, category_id, brand, slug, name, model, description,
    daily_price, weekly_price, monthly_price, security_deposit, replacement_value,
    thumbnail_url, rating, review_count, is_featured, is_active, specs, included_accessories
)
VALUES
-- CAMERAS
(
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Sony', 'sony-fx3-cinema-line', 'Sony FX3 Full-Frame Cinema Line Camera', 'ILME-FX3',
    'Compact cinema line powerhouse with 12.1MP full-frame BSI sensor, 4K 120p, 16-bit RAW output, S-Cinetone color profile, and active internal cooling for continuous shooting.',
    4000.00, 20000.00, 72000.00, 16000.00, 399990.00,
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    4.95, 42, TRUE, TRUE,
    '{"sensor": "Full-Frame 12.1MP Exmor R CMOS", "mount": "Sony E-Mount", "resolution": "4K UHD up to 120fps", "dynamic_range": "15+ stops with S-Log3", "weight": "715g"}'::jsonb,
    '["Sony FX3 Camera Body", "Top XLR Handle Unit", "2x Sony NP-FZ100 Batteries", "Dual Fast Charger", "Type A 160GB CFexpress Card", "Pelican Hard Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000001',
    'Sony', 'sony-a7iv-mirrorless', 'Sony A7 IV Full-Frame Hybrid Camera', 'ILCE-7M4',
    'Versatile 33MP hybrid camera with 4K 60p video, 10-bit 4:2:2 internal recording, advanced Real-time Eye AF, and 5-axis optical image stabilization.',
    2500.00, 12500.00, 45000.00, 10000.00, 249990.00,
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    4.85, 38, TRUE, TRUE,
    '{"sensor": "Full-Frame 33MP Exmor R CMOS", "mount": "Sony E-Mount", "resolution": "4K 60p / 4K 30p 7K oversampled", "weight": "658g"}'::jsonb,
    '["Sony A7 IV Body", "2x NP-FZ100 Batteries", "128GB V90 SDXC Card", "Dual Battery Charger", "Camera Strap & Body Cap"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000001',
    'Canon', 'canon-eos-r5', 'Canon EOS R5 8K Mirrorless Camera', 'EOS R5',
    'Industry benchmark 45MP sensor with internal 8K RAW video, 4K 120p, Dual Pixel CMOS AF II, and in-body image stabilization up to 8 stops.',
    3000.00, 15000.00, 54000.00, 12000.00, 329990.00,
    'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    4.90, 29, TRUE, TRUE,
    '{"sensor": "45MP Full-Frame CMOS", "mount": "Canon RF Mount", "resolution": "8K DCI 30p RAW, 4K 120p 10-bit", "weight": "738g"}'::jsonb,
    '["Canon EOS R5 Body", "2x LP-E6NH Batteries", "512GB CFexpress Type B Card", "CFexpress Card Reader", "Charger & Neck Strap"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000001',
    'Canon', 'canon-eos-c70-cinema', 'Canon EOS C70 4K Cinema Camera', 'EOS C70',
    'Super 35mm DGO sensor cinema camera with RF mount, motorized internal ND filters (up to 10 stops), dual Mini-XLR inputs, and 4K 120p recording.',
    5000.00, 25000.00, 90000.00, 20000.00, 499990.00,
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    4.92, 19, TRUE, TRUE,
    '{"sensor": "Super 35mm Dual Gain Output (DGO)", "mount": "Canon RF Mount", "nd_filters": "Built-in 2, 4, 6, 8, 10 Stops", "weight": "1190g"}'::jsonb,
    '["Canon EOS C70 Body", "Top Handle Unit", "2x BP-A60 Batteries", "Dual Charger", "2x 256GB V90 SDXC Cards", "AC Adapter"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000005',
    '20000000-0000-0000-0000-000000000001',
    'RED Digital Cinema', 'red-komodo-6k', 'RED KOMODO 6K Cinema Camera', 'KOMODO 6K',
    'Revolutionary global shutter 6K cinema camera in an ultra-compact cube format. Delivers 6K 40fps REDCODE RAW and dual Canon BP-9 battery plate.',
    6500.00, 32500.00, 117000.00, 25000.00, 599990.00,
    'https://images.unsplash.com/photo-1589872510928-86d1ff82173f?w=800&auto=format&fit=crop&q=80',
    4.98, 31, TRUE, TRUE,
    '{"sensor": "Super 35 Global Shutter CMOS (19.9MP)", "mount": "Canon RF Mount", "resolution": "6K at 40fps, 4K at 60fps REDCODE RAW", "dynamic_range": "16+ stops", "weight": "950g"}'::jsonb,
    '["RED KOMODO 6K Brain", "Canon RF to EF Adapter with ND", "Outrigger Handle", "2x 512GB RED PRO CFast 2.0 Cards", "Card Reader", "4x BP-975 Batteries", "Pelican Case"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000006',
    '20000000-0000-0000-0000-000000000001',
    'Blackmagic Design', 'bmpcc-6k-pro', 'Blackmagic Pocket Cinema Camera 6K Pro', 'BMPCC 6K Pro',
    'Super 35 HDR sensor with motorized ND filters, dual native ISO up to 25,600, 1500-nit tilting HDR screen, and Blackmagic RAW recording.',
    2800.00, 14000.00, 50000.00, 11000.00, 245000.00,
    'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&auto=format&fit=crop&q=80',
    4.88, 27, FALSE, TRUE,
    '{"sensor": "Super 35 HDR (23.10mm x 12.99mm)", "mount": "Active Canon EF", "resolution": "6K up to 50fps, 4K up to 60fps", "weight": "1238g"}'::jsonb,
    '["BMPCC 6K Pro Body", "SmallRig Cage", "4x NP-F570 Batteries", "Samsung T7 Shield 1TB SSD", "SSD Mount Clamp", "Power Supply"]'::jsonb
),
-- LENSES
(
    '30000000-0000-0000-0000-000000000007',
    '20000000-0000-0000-0000-000000000002',
    'Sony', 'sony-fe-24-70mm-f2-8-gm-ii', 'Sony FE 24-70mm f/2.8 GM II Lens', 'SEL2470GM2',
    'The pinnacle standard zoom lens for Sony E-mount. Exceptionally sharp corner-to-corner, fast XD linear motors, reduced weight, and aperture de-click switch.',
    1500.00, 7500.00, 27000.00, 6000.00, 199990.00,
    'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    4.96, 54, TRUE, TRUE,
    '{"focal_length": "24-70mm", "aperture": "f/2.8 constant", "mount": "Sony E", "filter_size": "82mm", "weight": "695g"}'::jsonb,
    '["Sony 24-70mm GM II Lens", "Lens Hood", "Front & Rear Lens Caps", "B+W 82mm UV Filter", "Padded Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000008',
    '20000000-0000-0000-0000-000000000002',
    'Canon', 'canon-rf-50mm-f1-2-l-usm', 'Canon RF 50mm f/1.2 L USM Prime Lens', 'RF 50mm f/1.2L',
    'Legendary ultra-fast normal prime lens for Canon RF. Astonishing optical clarity wide open at f/1.2 with smooth, dreamy cinematic background bokeh.',
    1600.00, 8000.00, 28800.00, 6500.00, 214990.00,
    'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&auto=format&fit=crop&q=80',
    4.94, 33, TRUE, TRUE,
    '{"focal_length": "50mm", "aperture": "f/1.2 to f/16", "mount": "Canon RF", "filter_size": "77mm", "weight": "950g"}'::jsonb,
    '["Canon RF 50mm f/1.2L Lens", "Lens Hood", "Front & Rear Caps", "77mm UV Filter", "Protective Pouch"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000009',
    '20000000-0000-0000-0000-000000000002',
    'Sigma', 'sigma-cine-high-speed-prime-set', 'Sigma Cine High-Speed Prime 3-Lens Set (24/35/50 T1.5)', 'CINE-SET-3',
    'Full frame cinema prime trio (24mm, 35mm, 50mm T1.5) with standard 95mm front diameter, 0.8M focus/iris gears, and luminous markings for professional film focus pulling.',
    6000.00, 30000.00, 108000.00, 25000.00, 750000.00,
    'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80',
    4.99, 18, TRUE, TRUE,
    '{"lenses": "24mm T1.5, 35mm T1.5, 50mm T1.5", "mount": "PL Mount / Sony E", "coverage": "Full-Frame 8K", "front_diameter": "95mm"}'::jsonb,
    '["Sigma 24mm T1.5 Cine Prime", "Sigma 35mm T1.5 Cine Prime", "Sigma 50mm T1.5 Cine Prime", "Custom Flight Case", "Lens Caps & 15mm Support Feet"]'::jsonb
),
-- LIGHTING
(
    '30000000-0000-0000-0000-000000000010',
    '20000000-0000-0000-0000-000000000003',
    'Aputure', 'aputure-ls-600d-pro', 'Aputure LS 600d Pro Daylight LED Monolight', 'LS 600d Pro',
    'Monumental 600W daylight-balanced COB LED light delivering up to 98,500 lux @ 1m with Fresnel. Weatherproof IP54 rating with Sidus Link wireless app control.',
    3200.00, 16000.00, 57600.00, 12000.00, 219000.00,
    'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80',
    4.97, 45, TRUE, TRUE,
    '{"power": "600W Output (720W Max Draw)", "color_temp": "5600K Daylight", "cri_tlci": "96+ / 96+", "control": "Sidus Link, DMX512, Wireless CRMX"}'::jsonb,
    '["Aputure 600d Pro Lamp Head", "Control Box", "Hyper Reflector", "Rolling Hard Flight Case", "Neutrik Power Cable", "Heavy-Duty C-Stand"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000011',
    '20000000-0000-0000-0000-000000000003',
    'Nanlite', 'nanlite-pavotube-ii-30x-2-light-kit', 'Nanlite PavoTube II 30X RGBWW Tube (2-Light Kit)', 'PT-30X-2KIT',
    'Versatile 4-foot pixel tubes featuring full RGBWW spectrum, pixel mapping effects, built-in battery for 1.5h at 100% output, and internal DMX/Bluetooth control.',
    1800.00, 9000.00, 32400.00, 7000.00, 95000.00,
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    4.91, 39, FALSE, TRUE,
    '{"length": "4 Feet (120cm)", "cct_range": "2700K - 12000K + Green/Magenta Adjustment", "battery": "Built-in 4400mAh Li-Ion", "effects": "15 Built-in Practical FX"}'::jsonb,
    '["2x PavoTube II 30X", "2x Power Adapters", "2x Transparent Mounting Clamps", "4x 1/4-20 Eye Bolts", "Padded Carry Bag"]'::jsonb
),
-- AUDIO
(
    '30000000-0000-0000-0000-000000000012',
    '20000000-0000-0000-0000-000000000004',
    'Røde Microphones', 'rode-wireless-pro-dual-mic-system', 'RØDE Wireless PRO Dual-Channel Wireless Mic System', 'WIPRO',
    'Flagship wireless mic kit with 32-bit float on-board recording, ultra-compact transmitters, internal timecode generator, and 260m transmission range.',
    900.00, 4500.00, 16200.00, 3500.00, 42000.00,
    'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    4.96, 61, TRUE, TRUE,
    '{"frequency": "2.4GHz Digital Series IV", "recording": "32-bit Float Internal / 32GB Storage per TX", "range": "260m Line of Sight"}'::jsonb,
    '["2x Wireless PRO Transmitters", "1x Dual Receiver", "Smart Charging Case", "2x Lavalier II Mics", "Magnetic Clips", "Audio & USB Cables"]'::jsonb
),
(
    '30000000-0000-0000-0000-000000000013',
    '20000000-0000-0000-0000-000000000004',
    'Sennheiser', 'sennheiser-mkh-416-shotgun-mic', 'Sennheiser MKH 416 Short Gun Interference Mic', 'MKH 416-P48',
    'The gold standard location and broadcast shotgun mic. RF condenser design offers exceptional feedback rejection, moisture resistance, and ultra-crisp dialog pickup.',
    1200.00, 6000.00, 21600.00, 5000.00, 89000.00,
    'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80',
    4.98, 48, TRUE, TRUE,
    '{"polar_pattern": "Supercardioid / Lobar", "frequency_response": "40Hz - 20kHz", "phantom_power": "48V Required", "weight": "175g"}'::jsonb,
    '["Sennheiser MKH 416 Mic", "Rycote Softie Windshield", "Pistol Grip Shockmount", "3m K-Tek Carbon Boom Pole", "5m XLR Cable", "Hard Case"]'::jsonb
),
-- GIMBALS & STABILIZERS
(
    '30000000-0000-0000-0000-000000000014',
    '20000000-0000-0000-0000-000000000005',
    'DJI', 'dji-rs3-pro-combo', 'DJI RS 3 Pro Gimbal Stabilizer Combo', 'RS3P-COMBO',
    'Extended carbon fiber arms with 4.5kg tested payload, LiDAR focusing system compatibility, automated axis locks, and wireless video transmission support.',
    1600.00, 8000.00, 28800.00, 6000.00, 89990.00,
    'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80',
    4.93, 51, TRUE, TRUE,
    '{"payload": "4.5kg (10 lbs)", "material": "Carbon Fiber Arms", "battery_life": "Up to 12 Hours", "weight": "1.5kg"}'::jsonb,
    '["DJI RS 3 Pro Gimbal", "BG30 Battery Grip", "Focus Motor (2022)", "Ronin Image Transmitter (RavenEye)", "Briefcase Handle", "Extended Grip/Tripod", "Carrying Case"]'::jsonb
),
-- DRONES
(
    '30000000-0000-0000-0000-000000000015',
    '20000000-0000-0000-0000-000000000006',
    'DJI', 'dji-mavic-3-pro-cine-combo', 'DJI Mavic 3 Pro Cine Premium Drone Combo', 'M3P-CINE',
    'Triple-camera aerial platform with 4/3 CMOS Hasselblad sensor, dual tele cameras (70mm & 166mm), Apple ProRes 422 HQ recording, and 1TB built-in SSD.',
    4500.00, 22500.00, 81000.00, 18000.00, 399990.00,
    'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    4.97, 36, TRUE, TRUE,
    '{"cameras": "Hasselblad 4/3 CMOS 5.1K + 70mm Medium Tele + 166mm Tele", "video": "Apple ProRes 422 HQ / D-Log M", "flight_time": "43 Mins per battery", "storage": "1TB Internal SSD"}'::jsonb,
    '["DJI Mavic 3 Pro Cine Drone", "DJI RC Pro Controller", "3x Intelligent Flight Batteries", "100W Battery Charging Hub", "ND Filter Set (ND8/16/32/64)", "10Gbps Lightspeed Data Cable", "Shoulder Bag"]'::jsonb
),
-- PRODUCTION KITS
(
    '30000000-0000-0000-0000-000000000016',
    '20000000-0000-0000-0000-000000000007',
    'Sony', 'indie-cinema-creator-bundle', 'Indie Cinema Creator Master Package', 'KIT-INDIE-FX3',
    'The complete indie commercial kit: Sony FX3 Cinema camera, GM 24-70mm f/2.8 lens, DJI RS3 Pro gimbal, RØDE Wireless PRO mics, and Aputure 300d lighting setup.',
    8500.00, 42500.00, 153000.00, 35000.00, 850000.00,
    'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    4.99, 23, TRUE, TRUE,
    '{"kit_contents": "Sony FX3 Camera + 24-70mm GM II + RS3 Pro + RØDE Wireless PRO + Aputure 300d II Light + V-Mount Battery Rig"}'::jsonb,
    '["Sony FX3 + 24-70 GM II", "DJI RS 3 Pro Gimbal", "RØDE Wireless PRO Set", "Aputure 300d II + Light Dome", "2x 150Wh V-Mount Batteries", "Full Pelican Travel Case Set"]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

-- 4. SEED PHYSICAL INVENTORY SERIAL NUMBERS
INSERT INTO inventory (equipment_id, serial_number, barcode, status, condition, warehouse_location)
VALUES
-- FX3 Units
('30000000-0000-0000-0000-000000000001', 'FX3-SN-8829101', 'BAR-FX3-01', 'AVAILABLE', 'EXCELLENT', 'Hub Alpha - Rack A1'),
('30000000-0000-0000-0000-000000000001', 'FX3-SN-8829102', 'BAR-FX3-02', 'AVAILABLE', 'BRAND_NEW', 'Hub Alpha - Rack A1'),
('30000000-0000-0000-0000-000000000001', 'FX3-SN-8829103', 'BAR-FX3-03', 'AVAILABLE', 'EXCELLENT', 'Hub Alpha - Rack A1'),

-- A7IV Units
('30000000-0000-0000-0000-000000000002', 'A74-SN-5521901', 'BAR-A74-01', 'AVAILABLE', 'EXCELLENT', 'Hub Alpha - Rack A2'),
('30000000-0000-0000-0000-000000000002', 'A74-SN-5521902', 'BAR-A74-02', 'AVAILABLE', 'EXCELLENT', 'Hub Alpha - Rack A2'),

-- Canon R5 Units
('30000000-0000-0000-0000-000000000003', 'CR5-SN-3391001', 'BAR-CR5-01', 'AVAILABLE', 'EXCELLENT', 'Hub Alpha - Rack B1'),
('30000000-0000-0000-0000-000000000003', 'CR5-SN-3391002', 'BAR-CR5-02', 'AVAILABLE', 'BRAND_NEW', 'Hub Alpha - Rack B1'),

-- Canon C70 Units
('30000000-0000-0000-0000-000000000004', 'C70-SN-4481011', 'BAR-C70-01', 'AVAILABLE', 'EXCELLENT', 'Hub Alpha - Vault 1'),

-- RED KOMODO Units
('30000000-0000-0000-0000-000000000005', 'RED-KMD-771901', 'BAR-KMD-01', 'AVAILABLE', 'BRAND_NEW', 'Hub Alpha - Vault 2'),
('30000000-0000-0000-0000-000000000005', 'RED-KMD-771902', 'BAR-KMD-02', 'AVAILABLE', 'EXCELLENT', 'Hub Alpha - Vault 2'),

-- BMPCC 6K Pro Units
('30000000-0000-0000-0000-000000000006', 'BMP-6KP-229101', 'BAR-BMP-01', 'AVAILABLE', 'EXCELLENT', 'Hub Alpha - Rack B2'),

-- Sony 24-70 GM II Lenses
('30000000-0000-0000-0000-000000000007', 'LNS-S2470-101', 'BAR-LNS-01', 'AVAILABLE', 'EXCELLENT', 'Lens Safe 1'),
('30000000-0000-0000-0000-000000000007', 'LNS-S2470-102', 'BAR-LNS-02', 'AVAILABLE', 'EXCELLENT', 'Lens Safe 1'),
('30000000-0000-0000-0000-000000000007', 'LNS-S2470-103', 'BAR-LNS-03', 'AVAILABLE', 'BRAND_NEW', 'Lens Safe 1'),

-- Canon RF 50mm f1.2 Lenses
('30000000-0000-0000-0000-000000000008', 'LNS-CRF50-201', 'BAR-LNS-04', 'AVAILABLE', 'EXCELLENT', 'Lens Safe 2'),

-- Sigma Cine Set
('30000000-0000-0000-0000-000000000009', 'SIG-CINE-3K-01', 'BAR-SIG-01', 'AVAILABLE', 'BRAND_NEW', 'Lens Safe Vault'),

-- Lighting Units
('30000000-0000-0000-0000-000000000010', 'LGT-AP600-001', 'BAR-LGT-01', 'AVAILABLE', 'EXCELLENT', 'Lighting Bay L1'),
('30000000-0000-0000-0000-000000000010', 'LGT-AP600-002', 'BAR-LGT-02', 'AVAILABLE', 'EXCELLENT', 'Lighting Bay L1'),
('30000000-0000-0000-0000-000000000011', 'LGT-NNPT3-001', 'BAR-LGT-03', 'AVAILABLE', 'EXCELLENT', 'Lighting Bay L2'),

-- Audio Units
('30000000-0000-0000-0000-000000000012', 'AUD-RDWP-0001', 'BAR-AUD-01', 'AVAILABLE', 'EXCELLENT', 'Audio Locker 1'),
('30000000-0000-0000-0000-000000000012', 'AUD-RDWP-0002', 'BAR-AUD-02', 'AVAILABLE', 'BRAND_NEW', 'Audio Locker 1'),
('30000000-0000-0000-0000-000000000013', 'AUD-SN416-001', 'BAR-AUD-03', 'AVAILABLE', 'EXCELLENT', 'Audio Locker 2'),

-- Gimbals & Drones
('30000000-0000-0000-0000-000000000014', 'GMB-RS3P-0001', 'BAR-GMB-01', 'AVAILABLE', 'EXCELLENT', 'Gimbal Bay G1'),
('30000000-0000-0000-0000-000000000014', 'GMB-RS3P-0002', 'BAR-GMB-02', 'AVAILABLE', 'EXCELLENT', 'Gimbal Bay G1'),
('30000000-0000-0000-0000-000000000015', 'DRN-M3PC-0001', 'BAR-DRN-01', 'AVAILABLE', 'BRAND_NEW', 'Flight Bay D1'),

-- Kits
('30000000-0000-0000-0000-000000000016', 'KIT-INDIE-0001', 'BAR-KIT-01', 'AVAILABLE', 'EXCELLENT', 'Master Kit Bay')
ON CONFLICT (serial_number) DO NOTHING;
