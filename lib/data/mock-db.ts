import { Equipment, Category, Brand, AvailabilityResult } from '@/types/equipment';
import { RentalOrder, RentalStatus } from '@/types/rental';
import { getDatesArray, isValidRentalDateRange } from '@/lib/utils';
import { format, addDays } from 'date-fns';

export interface MockReview {
  id: string;
  equipment_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  };
}

export interface MockInventoryUnit {
  id: string;
  equipment_id: string;
  serial_number: string;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED';
}

// 1. CATEGORIES
export const MOCK_CATEGORIES: Category[] = [
  { id: '20000000-0000-0000-0000-000000000001', slug: 'cameras', name: 'Cameras & Bodies', icon: 'camera', is_active: true },
  { id: '20000000-0000-0000-0000-000000000002', slug: 'lenses', name: 'Cinema & Prime Lenses', icon: 'disc', is_active: true },
  { id: '20000000-0000-0000-0000-000000000003', slug: 'lighting', name: 'Studio Lighting & Softboxes', icon: 'sun', is_active: true },
  { id: '20000000-0000-0000-0000-000000000004', slug: 'audio', name: 'Audio, Mics & Recorders', icon: 'mic', is_active: true },
  { id: '20000000-0000-0000-0000-000000000005', slug: 'gimbals', name: 'Gimbals & Stabilizers', icon: 'crosshair', is_active: true },
  { id: '20000000-0000-0000-0000-000000000006', slug: 'drones', name: 'Aerial Drones & FPV', icon: 'navigation', is_active: true },
  { id: '20000000-0000-0000-0000-000000000007', slug: 'kits', name: 'Complete Production Kits', icon: 'film', is_active: true },
];

// 2. BRANDS
export const MOCK_BRANDS: Brand[] = [
  { id: '10000000-0000-0000-0000-000000000001', slug: 'sony', name: 'Sony' },
  { id: '10000000-0000-0000-0000-000000000002', slug: 'canon', name: 'Canon' },
  { id: '10000000-0000-0000-0000-000000000003', slug: 'red', name: 'RED Digital Cinema' },
  { id: '10000000-0000-0000-0000-000000000004', slug: 'nikon', name: 'Nikon' },
  { id: '10000000-0000-0000-0000-000000000005', slug: 'fujifilm', name: 'Fujifilm' },
  { id: '10000000-0000-0000-0000-000000000006', slug: 'blackmagic', name: 'Blackmagic Design' },
  { id: '10000000-0000-0000-0000-000000000007', slug: 'gopro', name: 'GoPro' },
  { id: '10000000-0000-0000-0000-000000000008', slug: 'insta360', name: 'Insta360' },
  { id: '10000000-0000-0000-0000-000000000009', slug: 'sigma', name: 'Sigma' },
  { id: '10000000-0000-0000-0000-000000000010', slug: 'tamron', name: 'Tamron' },
  { id: '10000000-0000-0000-0000-000000000011', slug: 'aputure', name: 'Aputure' },
  { id: '10000000-0000-0000-0000-000000000012', slug: 'nanlite', name: 'Nanlite' },
  { id: '10000000-0000-0000-0000-000000000013', slug: 'godox', name: 'Godox' },
  { id: '10000000-0000-0000-0000-000000000014', slug: 'amaran', name: 'Amaran' },
  { id: '10000000-0000-0000-0000-000000000015', slug: 'rode', name: 'Røde Microphones' },
  { id: '10000000-0000-0000-0000-000000000016', slug: 'dji', name: 'DJI' },
  { id: '10000000-0000-0000-0000-000000000017', slug: 'sennheiser', name: 'Sennheiser' },
  { id: '10000000-0000-0000-0000-000000000018', slug: 'zoom', name: 'Zoom' },
  { id: '10000000-0000-0000-0000-000000000019', slug: 'tascam', name: 'Tascam' },
  { id: '10000000-0000-0000-0000-000000000020', slug: 'zhiyun', name: 'Zhiyun' },
  { id: '10000000-0000-0000-0000-000000000021', slug: 'manfrotto', name: 'Manfrotto' },
];

const brandMap = new Map(MOCK_BRANDS.map((b) => [b.id, b]));
const categoryMap = new Map(MOCK_CATEGORIES.map((c) => [c.id, c]));

// 3. EQUIPMENT LIST (45+ Cinema Models)
export const MOCK_EQUIPMENT_RAW: any[] = [
  // CAMERAS
  {
    id: '30000000-0000-0000-0000-000000000001',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand_id: '10000000-0000-0000-0000-000000000001',
    slug: 'sony-fx3-cinema-line',
    name: 'Sony FX3 Full-Frame Cinema Line Camera',
    description: 'Compact cinema line powerhouse with 12.1MP full-frame BSI sensor, 4K 120p, 16-bit RAW output, S-Cinetone color profile, and active internal cooling for continuous shooting.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    daily_price: 4000,
    weekly_price: 20000,
    security_deposit: 16000,
    rating: 4.95,
    review_count: 42,
    is_featured: true,
    is_active: true,
    specs: { sensor: 'Full-Frame 12.1MP Exmor R CMOS', mount: 'Sony E-Mount', resolution: '4K UHD up to 120fps', dynamic_range: '15+ stops with S-Log3', weight: '715g' },
    included_accessories: ['Sony FX3 Camera Body', 'Top XLR Handle Unit', '2x Sony NP-FZ100 Batteries', 'Dual Fast Charger', 'Type A 160GB CFexpress Card', 'Pelican Hard Case'],
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand_id: '10000000-0000-0000-0000-000000000001',
    slug: 'sony-a7iv-mirrorless',
    name: 'Sony A7 IV Full-Frame Hybrid Camera',
    description: 'Versatile 33MP hybrid camera with 4K 60p video, 10-bit 4:2:2 internal recording, advanced Real-time Eye AF, and 5-axis optical image stabilization.',
    image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    daily_price: 2500,
    weekly_price: 12500,
    security_deposit: 10000,
    rating: 4.85,
    review_count: 38,
    is_featured: true,
    is_active: true,
    specs: { sensor: 'Full-Frame 33MP Exmor R CMOS', mount: 'Sony E-Mount', resolution: '4K 60p (Super 35) / 4K 30p 7K oversampled', weight: '658g' },
    included_accessories: ['Sony A7 IV Body', '2x NP-FZ100 Batteries', '128GB V90 SDXC Card', 'Dual Battery Charger', 'Camera Strap & Body Cap'],
    created_at: '2026-01-12T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand_id: '10000000-0000-0000-0000-000000000002',
    slug: 'canon-eos-r5',
    name: 'Canon EOS R5 8K Mirrorless Camera',
    description: 'Industry benchmark 45MP sensor with internal 8K RAW video, 4K 120p, Dual Pixel CMOS AF II, and in-body image stabilization up to 8 stops.',
    image_url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    daily_price: 3000,
    weekly_price: 15000,
    security_deposit: 12000,
    rating: 4.90,
    review_count: 29,
    is_featured: true,
    is_active: true,
    specs: { sensor: '45MP Full-Frame CMOS', mount: 'Canon RF Mount', resolution: '8K DCI 30p RAW, 4K 120p 10-bit', weight: '738g' },
    included_accessories: ['Canon EOS R5 Body', '2x LP-E6NH Batteries', '512GB CFexpress Type B Card', 'CFexpress Card Reader', 'Charger & Neck Strap'],
    created_at: '2026-01-15T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand_id: '10000000-0000-0000-0000-000000000002',
    slug: 'canon-eos-c70-cinema',
    name: 'Canon EOS C70 4K Cinema Camera',
    description: 'Super 35mm DGO sensor cinema camera with RF mount, motorized internal ND filters (up to 10 stops), dual Mini-XLR inputs, and 4K 120p recording.',
    image_url: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    daily_price: 5000,
    weekly_price: 25000,
    security_deposit: 20000,
    rating: 4.92,
    review_count: 19,
    is_featured: true,
    is_active: true,
    specs: { sensor: 'Super 35mm Dual Gain Output (DGO)', mount: 'Canon RF Mount', nd_filters: 'Built-in 2, 4, 6, 8, 10 Stops', weight: '1190g' },
    included_accessories: ['Canon C70 Body', 'Handle Unit & Mic Holder', '2x BP-A30 Batteries', 'Single Battery Charger', 'Compact Power Adapter', 'Pelican Case'],
    created_at: '2026-01-18T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000005',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand_id: '10000000-0000-0000-0000-000000000003',
    slug: 'red-komodo-6k-cinema',
    name: 'RED Digital Cinema KOMODO 6K Camera',
    description: 'Super 35mm global shutter sensor camera capturing 6K REDCODE RAW at 40fps, RF mount, integrated touchscreen, and ultra-compact cinema form factor.',
    image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    daily_price: 8000,
    weekly_price: 40000,
    security_deposit: 32000,
    rating: 4.98,
    review_count: 22,
    is_featured: true,
    is_active: true,
    specs: { sensor: '19.9MP Super 35 Global Shutter CMOS', mount: 'Canon RF Mount', resolution: '6K 40fps, 4K 60fps REDCODE RAW', weight: '950g' },
    included_accessories: ['RED KOMODO 6K Body', 'Canon RF to EF Adapter with ND', '2x 512GB CFast 2.0 Cards', '4x BP-975 Batteries', 'Dual Charger', 'Top Handle & Outrigger'],
    created_at: '2026-01-20T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000006',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand_id: '10000000-0000-0000-0000-000000000006',
    slug: 'blackmagic-pocket-cinema-6k-pro',
    name: 'Blackmagic Pocket Cinema Camera 6K Pro',
    description: 'Advanced digital film camera with Super 35 HDR sensor, built-in motorized ND filters, adjustable HDR tilt screen, dual mini XLRs, and Blackmagic RAW.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    daily_price: 4500,
    weekly_price: 22500,
    security_deposit: 18000,
    rating: 4.78,
    review_count: 16,
    is_featured: false,
    is_active: true,
    specs: { sensor: 'Super 35 HDR (6144 x 3456)', mount: 'Active Canon EF Mount', nd_filters: 'Built-in 2, 4, 6 Stops', dynamic_range: '13 Stops' },
    included_accessories: ['BMPCC 6K Pro Body', '3x NP-F570 Batteries', 'Samsung T7 1TB SSD & Mount', 'Power Supply Cable', 'Cage & Top Handle'],
    created_at: '2026-01-22T10:00:00Z',
  },

  // LENSES
  {
    id: '30000000-0000-0000-0000-000000000011',
    category_id: '20000000-0000-0000-0000-000000000002',
    brand_id: '10000000-0000-0000-0000-000000000001',
    slug: 'sony-fe-24-70mm-f28-gm-ii',
    name: 'Sony FE 24-70mm f/2.8 GM II Lens',
    description: 'World-renowned standard zoom lens offering supreme sharpness, lightweight optical design, four XD linear autofocus motors, and constant f/2.8 aperture.',
    image_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    daily_price: 1800,
    weekly_price: 9000,
    security_deposit: 7200,
    rating: 4.95,
    review_count: 52,
    is_featured: true,
    is_active: true,
    specs: { focal_length: '24-70mm', aperture: 'f/2.8 to f/22', filter_size: '82mm', weight: '695g', mount: 'Sony E' },
    included_accessories: ['Front & Rear Caps', 'Lens Hood', '82mm UV Filter', 'Padded Pouch'],
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000012',
    category_id: '20000000-0000-0000-0000-000000000002',
    brand_id: '10000000-0000-0000-0000-000000000001',
    slug: 'sony-fe-70-200mm-f28-gm-oss-ii',
    name: 'Sony FE 70-200mm f/2.8 GM OSS II Telephoto',
    description: 'Ultra-telephoto zoom lens with unmatched resolving power, built-in Optical SteadyShot, aperture ring with click switch, and 29% weight reduction.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    daily_price: 2000,
    weekly_price: 10000,
    security_deposit: 8000,
    rating: 4.92,
    review_count: 34,
    is_featured: true,
    is_active: true,
    specs: { focal_length: '70-200mm', aperture: 'f/2.8', stabilization: 'Optical SteadyShot', filter_size: '77mm', weight: '1045g' },
    included_accessories: ['Tripod Collar', 'Front/Rear Caps', 'Hood with Filter Window', 'Heavy Duty Case'],
    created_at: '2026-01-11T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000013',
    category_id: '20000000-0000-0000-0000-000000000002',
    brand_id: '10000000-0000-0000-0000-000000000002',
    slug: 'canon-rf-50mm-f12-l-usm',
    name: 'Canon RF 50mm f/1.2L USM Prime Lens',
    description: 'Ultra-fast standard prime lens delivering creamy bokeh, staggering low-light fidelity, and edge-to-edge sharpness.',
    image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    daily_price: 1500,
    weekly_price: 7500,
    security_deposit: 6000,
    rating: 4.90,
    review_count: 28,
    is_featured: false,
    is_active: true,
    specs: { focal_length: '50mm', aperture: 'f/1.2 to f/16', mount: 'Canon RF', weight: '950g' },
    included_accessories: ['Lens Hood', 'Front & Rear Caps', 'Protective Pouch'],
    created_at: '2026-01-12T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000014',
    category_id: '20000000-0000-0000-0000-000000000002',
    brand_id: '10000000-0000-0000-0000-000000000009',
    slug: 'sigma-35mm-f14-dg-dn-art-sony-e',
    name: 'Sigma 35mm f/1.4 DG DN Art Prime Lens (Sony E)',
    description: 'Classic narrative cinematography focal length with optical perfection, de-clickable aperture ring, and AFL focus hold button.',
    image_url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    daily_price: 900,
    weekly_price: 4500,
    security_deposit: 3600,
    rating: 4.88,
    review_count: 30,
    is_featured: false,
    is_active: true,
    specs: { focal_length: '35mm', aperture: 'f/1.4', mount: 'Sony E-Mount', filter_size: '67mm' },
    included_accessories: ['Petal Hood', 'Front & Rear Caps', 'Lens Case'],
    created_at: '2026-01-13T10:00:00Z',
  },

  // LIGHTING
  {
    id: '30000000-0000-0000-0000-000000000026',
    category_id: '20000000-0000-0000-0000-000000000003',
    brand_id: '10000000-0000-0000-0000-000000000011',
    slug: 'aputure-ls-600d-pro-led-light',
    name: 'Aputure Light Storm LS 600d Pro Daylight LED',
    description: '600W daylight point-source fixture with weather resistance, Bowens mount, wireless Sidus Link control, and output comparable to 1200W HMI.',
    image_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    daily_price: 2500,
    weekly_price: 12500,
    security_deposit: 10000,
    rating: 4.97,
    review_count: 48,
    is_featured: true,
    is_active: true,
    specs: { power: '600W COB LED', color_temp: '5600K Daylight', cri_tlci: '96+ / 96+', mount: 'Bowens Mount', weight: '4.64kg (Lamp Head)' },
    included_accessories: ['LS 600d Lamp Head', 'Control Box', 'Lightning Clamp', 'Reflector', 'Head Cable (3m)', 'Rolling Padded Flight Case'],
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000027',
    category_id: '20000000-0000-0000-0000-000000000003',
    brand_id: '10000000-0000-0000-0000-000000000011',
    slug: 'aputure-nova-p300c-rgbww-panel',
    name: 'Aputure Nova P300c 300W RGBWW LED Panel',
    description: 'High-output 300W RGBWW soft panel with 2,000K-10,000K CCT tuning, full HSI color control, built-in lighting effects, and studio yoke.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    daily_price: 2200,
    weekly_price: 11000,
    security_deposit: 8800,
    rating: 4.91,
    review_count: 24,
    is_featured: false,
    is_active: true,
    specs: { power: '300W RGBWW', cct: '2,000K - 10,000K', beam_angle: '120 degrees', cri: '95+' },
    included_accessories: ['Nova P300c Panel Light', 'Control Box', 'Neutrik powerCON Cable', '5-Pin XLR Head Cable', 'Hard Rolling Case'],
    created_at: '2026-01-12T10:00:00Z',
  },

  // AUDIO
  {
    id: '30000000-0000-0000-0000-000000000036',
    category_id: '20000000-0000-0000-0000-000000000004',
    brand_id: '10000000-0000-0000-0000-000000000015',
    slug: 'rode-wireless-pro-dual-mic-kit',
    name: 'Røde Wireless PRO Dual Wireless Lavalier Kit',
    description: '32-bit float on-board recording dual-channel wireless mic kit with timecode generator, intelligent GainAssist, and 260m transmission range.',
    image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    daily_price: 1200,
    weekly_price: 6000,
    security_deposit: 4800,
    rating: 4.96,
    review_count: 55,
    is_featured: true,
    is_active: true,
    specs: { channels: 'Dual Channel (2 TX, 1 RX)', bit_depth: '32-Bit Float On-Board Recording', range: '260m Line-of-sight', battery_life: '7 Hours' },
    included_accessories: ['2x Transmitters', '1x Receiver', 'Smart Charging Case', '2x Lavalier II Mics', 'Magnetic Mounts', 'Furry Windshields', '3.5mm TRS Cable'],
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000037',
    category_id: '20000000-0000-0000-0000-000000000004',
    brand_id: '10000000-0000-0000-0000-000000000017',
    slug: 'sennheiser-mkh-416-shotgun-mic',
    name: 'Sennheiser MKH 416 Moisture-Resistant Shotgun Mic',
    description: 'The industry-standard interference tube shotgun microphone for film dialogue, high directivity, low self-noise, and feedback rejection.',
    image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    daily_price: 1500,
    weekly_price: 7500,
    security_deposit: 6000,
    rating: 4.98,
    review_count: 37,
    is_featured: true,
    is_active: true,
    specs: { polar_pattern: 'Supercardioid / Lobar', frequency_response: '40 Hz - 20 kHz', phantom_power: '48V +/- 12V', connector: '3-Pin XLR' },
    included_accessories: ['MKH 416 Microphone', 'Rycote Softie Windshield', 'Pistol Grip Shock Mount', '3m Mogami XLR Cable', 'Hard Travel Tube'],
    created_at: '2026-01-11T10:00:00Z',
  },

  // GIMBALS
  {
    id: '30000000-0000-0000-0000-000000000041',
    category_id: '20000000-0000-0000-0000-000000000005',
    brand_id: '10000000-0000-0000-0000-000000000016',
    slug: 'dji-rs-3-pro-gimbal-combo',
    name: 'DJI RS 3 Pro Gimbal Stabilizer Combo',
    description: 'Carbon fiber pro gimbal supporting 4.5kg payload with automated axis locks, LiDAR autofocus integration, and RavenEye wireless transmission.',
    image_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    daily_price: 1800,
    weekly_price: 9000,
    security_deposit: 7200,
    rating: 4.94,
    review_count: 46,
    is_featured: true,
    is_active: true,
    specs: { payload: '4.5 kg (10 lbs)', material: 'Extended Carbon Fiber Arms', battery_life: '12 Hours (BG30 Grip)', weight: '1.5 kg' },
    included_accessories: ['RS 3 Pro Gimbal', 'BG30 Battery Grip', 'Focus Motor (2022)', 'RavenEye Image Transmitter', 'Briefcase Handle', 'Extended Grip Tripod', 'Carrying Case'],
    created_at: '2026-01-10T10:00:00Z',
  },

  // DRONES
  {
    id: '30000000-0000-0000-0000-000000000046',
    category_id: '20000000-0000-0000-0000-000000000006',
    brand_id: '10000000-0000-0000-0000-000000000016',
    slug: 'dji-mavic-3-pro-cine-combo',
    name: 'DJI Mavic 3 Pro Cine Tri-Camera Drone Kit',
    description: 'Flagship aerial cinematography drone with 4/3 CMOS Hasselblad sensor, dual tele cameras, Apple ProRes 422 HQ recording, and 43-min flight time.',
    image_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    daily_price: 4500,
    weekly_price: 22500,
    security_deposit: 18000,
    rating: 4.97,
    review_count: 39,
    is_featured: true,
    is_active: true,
    specs: { sensors: '4/3 CMOS Hasselblad + 70mm Medium Tele + 166mm Tele', video_formats: 'Apple ProRes 422 HQ, 5.1K 50fps, 4K 120fps D-Log', internal_storage: '1TB SSD Built-in', flight_time: '43 Minutes' },
    included_accessories: ['Mavic 3 Pro Cine Drone', 'DJI RC Pro Controller (Ultra-bright Screen)', '3x Intelligent Flight Batteries', '100W Battery Charging Hub', 'ND Filter Set (ND8/16/32/64)', 'Shoulder Bag'],
    created_at: '2026-01-10T10:00:00Z',
  },

  // COMPLETE KITS
  {
    id: '30000000-0000-0000-0000-000000000051',
    category_id: '20000000-0000-0000-0000-000000000007',
    brand_id: '10000000-0000-0000-0000-000000000001',
    slug: 'indie-cinema-director-production-kit',
    name: 'Indie Cinema Director Master Production Kit',
    description: 'Turnkey feature film package: Sony FX3 Full-Frame Cinema Camera + 24-70mm f/2.8 GM II + DJI RS 3 Pro Gimbal + Røde Wireless PRO Dual Mic + Aputure 300W Soft Light Kit.',
    image_url: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    daily_price: 8500,
    weekly_price: 42500,
    security_deposit: 34000,
    rating: 5.00,
    review_count: 27,
    is_featured: true,
    is_active: true,
    specs: { camera: 'Sony FX3 4K 120p Cinema Line', lens: 'Sony FE 24-70mm f/2.8 GM II', gimbal: 'DJI RS 3 Pro Carbon Fiber', audio: 'Røde Wireless PRO 32-Bit Float', lighting: 'Aputure Amaran 300c RGBWW + Light Dome' },
    included_accessories: ['Sony FX3 + XLR Top Handle', '24-70mm GM II Lens with UV Filter', 'DJI RS 3 Pro Gimbal with Focus Motor', 'Røde Wireless PRO Dual Transmitters + Mic', 'Amaran 300c Light + Stand + Softbox', '4x V-Mount / Camera Batteries + Fast Hub', '2x Heavy Duty Pelican Flight Cases'],
    created_at: '2026-01-10T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000052',
    category_id: '20000000-0000-0000-0000-000000000007',
    brand_id: '10000000-0000-0000-0000-000000000001',
    slug: 'commercial-dop-two-camera-master-kit',
    name: 'Commercial DOP Dual-Camera Interview Kit',
    description: 'High-end corporate & commercial shoot bundle: 2x Sony FX3 / A7 IV Cameras + 24-70mm & 70-200mm GM II Lenses + 2x Aputure 600d / 300c Lights + Sennheiser 416 Boompole Kit.',
    image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    daily_price: 13500,
    weekly_price: 67500,
    security_deposit: 54000,
    rating: 4.96,
    review_count: 18,
    is_featured: true,
    is_active: true,
    specs: { cameras: '1x Sony FX3 + 1x Sony A7 IV', lenses: '24-70mm GM II + 70-200mm GM II OSS', lighting: 'Aputure LS 600d Pro + Nova P300c Soft Panel', audio: 'Sennheiser MKH 416 + Zoom F6 32-Bit Recorder' },
    included_accessories: ['2x Cinema Camera Bodies + Audio Top Handles', '2x G-Master Cine Lenses + ND Filters', '2x Heavy C-Stands + Softboxes + Grids', 'Sennheiser Shotgun Mic + Carbon Boompole', 'Complete Pelican Master Transportation Kit'],
    created_at: '2026-01-12T10:00:00Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000053',
    category_id: '20000000-0000-0000-0000-000000000007',
    brand_id: '10000000-0000-0000-0000-000000000016',
    slug: 'aerial-cinematography-drone-ground-kit',
    name: 'Aerial & Ground Cinema Action Bundle',
    description: 'Full-spectrum dynamic production kit: DJI Mavic 3 Pro Cine 5.1K Drone + Sony FX3 Cinema Line + DJI RS 3 Pro Gimbal + Wireless Audio setup.',
    image_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800&auto=format&fit=crop&q=80',
    daily_price: 9500,
    weekly_price: 47500,
    security_deposit: 38000,
    rating: 4.93,
    review_count: 21,
    is_featured: true,
    is_active: true,
    specs: { drone: 'DJI Mavic 3 Pro Cine with 1TB SSD', ground_camera: 'Sony FX3 Full-Frame', stabilizer: 'DJI RS 3 Pro with LiDAR Focus' },
    included_accessories: ['Mavic 3 Pro Cine + RC Pro Controller', '6x Drone + Camera Batteries', 'Sony FX3 Body + 24-70mm f/2.8 Lens', 'DJI RS 3 Pro Stabilizer', 'Safety Pelican Hard Cases'],
    created_at: '2026-01-15T10:00:00Z',
  },
];

// Helper to attach relations
export function populateEquipmentRelations(item: any): Equipment {
  const brand = brandMap.get(item.brand_id) || { id: item.brand_id, slug: 'pro-gear', name: 'Pro Brand' };
  const category = categoryMap.get(item.category_id) || { id: item.category_id, slug: 'cameras', name: 'Cameras', is_active: true };
  return {
    ...item,
    brand,
    category,
  };
}

export const MOCK_EQUIPMENT: Equipment[] = MOCK_EQUIPMENT_RAW.map(populateEquipmentRelations);

// 4. MOCK INVENTORY SERIALS
export const MOCK_INVENTORY: MockInventoryUnit[] = [];
MOCK_EQUIPMENT_RAW.forEach((eq, idx) => {
  const count = eq.is_featured ? 4 : 3;
  for (let i = 1; i <= count; i++) {
    MOCK_INVENTORY.push({
      id: `inv-${eq.id}-${i}`,
      equipment_id: eq.id,
      serial_number: `FG-${eq.slug.slice(0, 4).toUpperCase()}-SN${1000 + idx * 10 + i}`,
      status: i === count && idx % 3 === 0 ? 'RENTED' : 'AVAILABLE',
    });
  }
});

// 5. MOCK REVIEWS
export const MOCK_REVIEWS: MockReview[] = [
  {
    id: 'rev-1',
    equipment_id: '30000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000001',
    rating: 5,
    comment: 'The Sony FX3 worked flawlessly on our 3-day commercial shoot in Mumbai. Internal cooling kept it going in 38°C outdoor heat with zero overheating issues. Sensor was spotlessly clean.',
    created_at: '2026-02-15T14:30:00Z',
    user: { full_name: 'Arjun Menon (DOP)', email: 'arjun@cinema.test' },
  },
  {
    id: 'rev-2',
    equipment_id: '30000000-0000-0000-0000-000000000001',
    user_id: '00000000-0000-0000-0000-000000000002',
    rating: 5,
    comment: 'Super fast delivery and the kit included high-speed CFexpress cards and top handle. Deposit refund was credited directly back to my UPI within 6 hours of returning the gear.',
    created_at: '2026-02-20T18:00:00Z',
    user: { full_name: 'Rhea Deshmukh', email: 'rhea@filmhouse.test' },
  },
  {
    id: 'rev-3',
    equipment_id: '30000000-0000-0000-0000-000000000011',
    user_id: '00000000-0000-0000-0000-000000000001',
    rating: 5,
    comment: 'The 24-70mm GM II is tack sharp across the entire zoom range. Autofocus with FX3 is lightning quick.',
    created_at: '2026-02-22T11:20:00Z',
    user: { full_name: 'Kiran Varma', email: 'kiran@docfilms.test' },
  },
  {
    id: 'rev-4',
    equipment_id: '30000000-0000-0000-0000-000000000026',
    user_id: '00000000-0000-0000-0000-000000000001',
    rating: 5,
    comment: 'The Aputure 600d Pro is like having the sun in a rolling case. Easily pushed through heavy diffusion for day interior setups.',
    created_at: '2026-02-25T09:15:00Z',
    user: { full_name: 'Vikram Joshi (Gaffer)', email: 'vikram@lighting.test' },
  },
];

// 6. IN-MEMORY ORDERS STORE
export const MOCK_ORDERS: RentalOrder[] = [
  {
    id: 'ord-00000000-0000-0000-0000-000000000001',
    rental_id: 'FG-RNT-20260228-8K9DF',
    user_id: '00000000-0000-0000-0000-000000000001',
    status: 'ACTIVE',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(addDays(new Date(), 3), 'yyyy-MM-dd'),
    total_days: 3,
    delivery_mode: 'DELIVERY',
    address: {
      fullName: 'Arjun Menon (Filmmaker)',
      phone: '9876543210',
      email: 'customer@flexgear.test',
      line1: 'Studio 4, Film City Complex, Goregaon',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400065',
      lat: 19.1663,
      lng: 72.8837,
    },
    subtotal: 12000,
    discount: 0,
    delivery_fee: 300,
    tax: 2214,
    security_deposit: 16000,
    total: 30514,
    payment_status: 'CAPTURED',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    rental_items: [
      {
        id: 'item-1',
        rental_order_id: 'ord-00000000-0000-0000-0000-000000000001',
        equipment_id: '30000000-0000-0000-0000-000000000001',
        quantity: 1,
        daily_price: 4000,
        subtotal: 12000,
        equipment: MOCK_EQUIPMENT[0],
      },
    ],
  },
  {
    id: 'ord-00000000-0000-0000-0000-000000000002',
    rental_id: 'FG-RNT-20260225-3M7NX',
    user_id: '00000000-0000-0000-0000-000000000001',
    status: 'RETURN_PENDING',
    start_date: format(addDays(new Date(), -4), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    total_days: 4,
    delivery_mode: 'PICKUP',
    address: {
      fullName: 'Rhea Deshmukh',
      phone: '9876543210',
      email: 'customer@flexgear.test',
      line1: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
    },
    subtotal: 7200,
    discount: 0,
    delivery_fee: 0,
    tax: 1296,
    security_deposit: 7200,
    total: 15696,
    payment_status: 'CAPTURED',
    created_at: new Date(Date.now() - 400000000).toISOString(),
    rental_items: [
      {
        id: 'item-2',
        rental_order_id: 'ord-00000000-0000-0000-0000-000000000002',
        equipment_id: '30000000-0000-0000-0000-000000000011',
        quantity: 1,
        daily_price: 1800,
        subtotal: 7200,
        equipment: MOCK_EQUIPMENT[6],
      },
    ],
  },
  {
    id: 'ord-00000000-0000-0000-0000-000000000003',
    rental_id: 'FG-RNT-20260215-9K2LQ',
    user_id: '00000000-0000-0000-0000-000000000001',
    status: 'RETURNED',
    start_date: '2026-02-15',
    end_date: '2026-02-18',
    total_days: 3,
    delivery_mode: 'DELIVERY',
    address: {
      fullName: 'Arjun Menon',
      phone: '9876543210',
      email: 'customer@flexgear.test',
      line1: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    subtotal: 25500,
    discount: 2550,
    delivery_fee: 300,
    tax: 4185,
    security_deposit: 34000,
    total: 61435,
    payment_status: 'CAPTURED',
    created_at: '2026-02-14T09:00:00Z',
    rental_items: [
      {
        id: 'item-3',
        rental_order_id: 'ord-00000000-0000-0000-0000-000000000003',
        equipment_id: '30000000-0000-0000-0000-000000000051',
        quantity: 1,
        daily_price: 8500,
        subtotal: 25500,
        equipment: MOCK_EQUIPMENT[12],
      },
    ],
  },
];

// IN-MEMORY WISHLIST
export const MOCK_WISHLIST = new Set<string>([
  '30000000-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000026',
]);

// 7. IN-MEMORY QUERY ENGINE FOR LOCAL / FALLBACK WORKFLOWS
export class MockDatabaseService {
  static getCategories(): Category[] {
    return MOCK_CATEGORIES;
  }

  static getBrands(): Brand[] {
    return MOCK_BRANDS;
  }

  static getEquipment(params: {
    category?: string;
    brand?: string | string[];
    maxPrice?: number;
    minRating?: number;
    search?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): { equipment: Equipment[]; total: number; totalPages: number } {
    const {
      category,
      brand,
      maxPrice,
      minRating,
      search,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = params;

    let filtered = [...MOCK_EQUIPMENT];

    // Category filter
    if (category) {
      filtered = filtered.filter((eq) => eq.category?.slug === category);
    }

    // Brand filter
    const brandList = brand ? (Array.isArray(brand) ? brand : [brand]) : [];
    if (brandList.length > 0) {
      filtered = filtered.filter((eq) => eq.brand?.slug && brandList.includes(eq.brand.slug));
    }

    // Price filter
    if (maxPrice) {
      filtered = filtered.filter((eq) => eq.daily_price <= maxPrice);
    }

    // Rating filter
    if (minRating) {
      filtered = filtered.filter((eq) => eq.rating >= minRating);
    }

    // Search query
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (eq) =>
          eq.name.toLowerCase().includes(q) ||
          eq.description.toLowerCase().includes(q) ||
          eq.brand?.name.toLowerCase().includes(q) ||
          eq.category?.name.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.daily_price - b.daily_price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.daily_price - a.daily_price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => (a.is_featured === b.is_featured ? 0 : a.is_featured ? -1 : 1));
        break;
    }

    const total = filtered.length;
    const from = (page - 1) * limit;
    const paginated = filtered.slice(from, from + limit);

    return {
      equipment: paginated,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  static getEquipmentById(id: string): {
    equipment: Equipment | null;
    related: Equipment[];
    reviews: MockReview[];
  } {
    const equipment = MOCK_EQUIPMENT.find((eq) => eq.id === id || eq.slug === id) || null;
    if (!equipment) {
      return { equipment: null, related: [], reviews: [] };
    }

    const related = MOCK_EQUIPMENT.filter(
      (eq) => eq.category_id === equipment.category_id && eq.id !== equipment.id
    ).slice(0, 3);

    const reviews = MOCK_REVIEWS.filter((r) => r.equipment_id === equipment.id);

    return {
      equipment,
      related,
      reviews,
    };
  }

  static checkAvailability(
    equipmentId: string,
    startDate: string,
    endDate: string,
    requestedUnits: number = 1
  ): AvailabilityResult {
    const dateValidation = isValidRentalDateRange(startDate, endDate);
    if (!dateValidation.valid) {
      return {
        equipmentId,
        available: false,
        availableUnits: 0,
        requestedUnits,
        startDate,
        endDate,
        totalInventory: 0,
        bookedUnits: 0,
      };
    }

    const totalInventory = MOCK_INVENTORY.filter(
      (inv) => inv.equipment_id === equipmentId && (inv.status === 'AVAILABLE' || inv.status === 'RENTED')
    ).length || 3;

    // Check active in-memory bookings for overlap
    const dates = getDatesArray(startDate, endDate);
    let bookedCount = 0;

    MOCK_ORDERS.forEach((ord) => {
      if (ord.status !== 'CANCELLED' && ord.status !== 'RETURNED') {
        const orderDates = getDatesArray(ord.start_date, ord.end_date);
        const hasOverlap = dates.some((d) => orderDates.includes(d));
        if (hasOverlap) {
          const matchItem = ord.rental_items?.find((i) => i.equipment_id === equipmentId);
          if (matchItem) {
            bookedCount += matchItem.quantity;
          }
        }
      }
    });

    const availableUnits = Math.max(0, totalInventory - bookedCount);
    const isAvailable = availableUnits >= requestedUnits;

    return {
      equipmentId,
      available: isAvailable,
      availableUnits,
      requestedUnits,
      startDate,
      endDate,
      totalInventory,
      bookedUnits: bookedCount,
    };
  }

  static createRentalOrder(orderData: Partial<RentalOrder>, items: any[]): RentalOrder {
    const newOrder: RentalOrder = {
      id: orderData.id || `ord-${Date.now()}`,
      rental_id: orderData.rental_id || `FG-RNT-${format(new Date(), 'yyyyMMdd')}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      user_id: orderData.user_id || '00000000-0000-0000-0000-000000000001',
      status: orderData.status || 'PAYMENT_PENDING',
      start_date: orderData.start_date || format(new Date(), 'yyyy-MM-dd'),
      end_date: orderData.end_date || format(addDays(new Date(), 3), 'yyyy-MM-dd'),
      total_days: orderData.total_days || 3,
      delivery_mode: orderData.delivery_mode || 'DELIVERY',
      address: orderData.address as any,
      subtotal: orderData.subtotal || 0,
      discount: orderData.discount || 0,
      delivery_fee: orderData.delivery_fee || 0,
      tax: orderData.tax || 0,
      security_deposit: orderData.security_deposit || 0,
      total: orderData.total || 0,
      payment_status: orderData.payment_status || 'CREATED',
      created_at: new Date().toISOString(),
      rental_items: items.map((item, idx) => {
        const eq = MOCK_EQUIPMENT.find((e) => e.id === item.equipmentId || e.id === item.equipment_id);
        return {
          id: `item-${Date.now()}-${idx}`,
          rental_order_id: orderData.id || `ord-${Date.now()}`,
          equipment_id: item.equipmentId || item.equipment_id,
          quantity: item.quantity,
          daily_price: item.daily_price || eq?.daily_price || 0,
          subtotal: item.subtotal || (eq?.daily_price || 0) * (orderData.total_days || 1) * item.quantity,
          equipment: eq,
        };
      }),
    };

    MOCK_ORDERS.unshift(newOrder);
    return newOrder;
  }

  static getRentalById(id: string): RentalOrder | null {
    return MOCK_ORDERS.find((o) => o.id === id || o.rental_id === id) || null;
  }

  static getAllRentals(): RentalOrder[] {
    return MOCK_ORDERS;
  }

  static updateRentalStatus(id: string, status: RentalStatus | string, refundDeposit?: boolean): RentalOrder | null {
    const order = MOCK_ORDERS.find((o) => o.id === id || o.rental_id === id);
    if (order) {
      order.status = status as RentalStatus;
      if (status === 'CONFIRMED' || status === 'CAPTURED') {
        order.payment_status = 'CAPTURED';
      }
    }
    return order || null;
  }

  static getInventoryList(): any[] {
    return MOCK_EQUIPMENT.map((gear) => {
      const units = MOCK_INVENTORY.filter((u) => u.equipment_id === gear.id);
      return {
        ...gear,
        equipment_inventory: units,
      };
    });
  }
}
