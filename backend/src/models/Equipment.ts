// backend/src/models/Equipment.ts
import { query, isDatabaseConnected } from '../config/database';

export interface EquipmentEntity {
  id: string;
  category_id: string;
  brand: string;
  slug: string;
  name: string;
  model?: string | null;
  description: string;
  daily_price: number;
  weekly_price?: number | null;
  monthly_price?: number | null;
  security_deposit: number;
  replacement_value: number;
  thumbnail_url: string;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_active: boolean;
  specs: Record<string, any>;
  included_accessories: string[];
  created_at: string;
}

export const mockEquipment: EquipmentEntity[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand: 'Sony',
    slug: 'sony-fx3-cinema-line',
    name: 'Sony FX3 Full-Frame Cinema Line Camera',
    model: 'ILME-FX3',
    description: 'Compact cinema line powerhouse with 12.1MP full-frame BSI sensor, 4K 120p, 16-bit RAW output, S-Cinetone color profile, and active internal cooling.',
    daily_price: 4000,
    weekly_price: 20000,
    monthly_price: 72000,
    security_deposit: 16000,
    replacement_value: 399990,
    thumbnail_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    rating: 4.95,
    review_count: 42,
    is_featured: true,
    is_active: true,
    specs: { sensor: 'Full-Frame 12.1MP Exmor R CMOS', mount: 'Sony E-Mount', resolution: '4K UHD up to 120fps', dynamic_range: '15+ stops with S-Log3', weight: '715g' },
    included_accessories: ['Sony FX3 Camera Body', 'Top XLR Handle Unit', '2x Sony NP-FZ100 Batteries', 'Dual Fast Charger', 'Type A 160GB CFexpress Card', 'Pelican Hard Case'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand: 'Sony',
    slug: 'sony-a7iv-mirrorless',
    name: 'Sony A7 IV Full-Frame Hybrid Camera',
    model: 'ILCE-7M4',
    description: 'Versatile 33MP hybrid camera with 4K 60p video, 10-bit 4:2:2 internal recording, advanced Real-time Eye AF, and 5-axis optical image stabilization.',
    daily_price: 2500,
    weekly_price: 12500,
    monthly_price: 45000,
    security_deposit: 10000,
    replacement_value: 249990,
    thumbnail_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    rating: 4.85,
    review_count: 38,
    is_featured: true,
    is_active: true,
    specs: { sensor: 'Full-Frame 33MP Exmor R CMOS', mount: 'Sony E-Mount', resolution: '4K 60p / 4K 30p 7K oversampled', weight: '658g' },
    included_accessories: ['Sony A7 IV Body', '2x NP-FZ100 Batteries', '128GB V90 SDXC Card', 'Dual Battery Charger', 'Camera Strap & Body Cap'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand: 'Canon',
    slug: 'canon-eos-r5',
    name: 'Canon EOS R5 8K Mirrorless Camera',
    model: 'EOS R5',
    description: 'Industry benchmark 45MP sensor with internal 8K RAW video, 4K 120p, Dual Pixel CMOS AF II, and in-body image stabilization up to 8 stops.',
    daily_price: 3000,
    weekly_price: 15000,
    monthly_price: 54000,
    security_deposit: 12000,
    replacement_value: 329990,
    thumbnail_url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80',
    rating: 4.90,
    review_count: 29,
    is_featured: true,
    is_active: true,
    specs: { sensor: '45MP Full-Frame CMOS', mount: 'Canon RF Mount', resolution: '8K DCI 30p RAW, 4K 120p 10-bit', weight: '738g' },
    included_accessories: ['Canon EOS R5 Body', '2x LP-E6NH Batteries', '512GB CFexpress Type B Card', 'CFexpress Card Reader', 'Charger & Neck Strap'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand: 'Canon',
    slug: 'canon-eos-c70-cinema',
    name: 'Canon EOS C70 4K Cinema Camera',
    model: 'EOS C70',
    description: 'Super 35mm DGO sensor cinema camera with RF mount, motorized internal ND filters (up to 10 stops), dual Mini-XLR inputs, and 4K 120p recording.',
    daily_price: 5000,
    weekly_price: 25000,
    monthly_price: 90000,
    security_deposit: 20000,
    replacement_value: 499990,
    thumbnail_url: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=800&auto=format&fit=crop&q=80',
    rating: 4.92,
    review_count: 19,
    is_featured: true,
    is_active: true,
    specs: { sensor: 'Super 35mm Dual Gain Output (DGO)', mount: 'Canon RF Mount', nd_filters: 'Built-in 2, 4, 6, 8, 10 Stops', weight: '1190g' },
    included_accessories: ['Canon EOS C70 Body', 'Top Handle Unit', '2x BP-A60 Batteries', 'Dual Charger', '2x 256GB V90 SDXC Cards', 'AC Adapter'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000005',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand: 'RED Digital Cinema',
    slug: 'red-komodo-6k',
    name: 'RED KOMODO 6K Cinema Camera',
    model: 'KOMODO 6K',
    description: 'Revolutionary global shutter 6K cinema camera in an ultra-compact cube format. Delivers 6K 40fps REDCODE RAW and dual Canon BP-9 battery plate.',
    daily_price: 6500,
    weekly_price: 32500,
    monthly_price: 117000,
    security_deposit: 25000,
    replacement_value: 599990,
    thumbnail_url: 'https://images.unsplash.com/photo-1589872510928-86d1ff82173f?w=800&auto=format&fit=crop&q=80',
    rating: 4.98,
    review_count: 31,
    is_featured: true,
    is_active: true,
    specs: { sensor: 'Super 35 Global Shutter CMOS (19.9MP)', mount: 'Canon RF Mount', resolution: '6K at 40fps, 4K at 60fps REDCODE RAW', dynamic_range: '16+ stops', weight: '950g' },
    included_accessories: ['RED KOMODO 6K Brain', 'Canon RF to EF Adapter with ND', 'Outrigger Handle', '2x 512GB RED PRO CFast 2.0 Cards', 'Card Reader', '4x BP-975 Batteries', 'Pelican Case'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000006',
    category_id: '20000000-0000-0000-0000-000000000001',
    brand: 'Blackmagic Design',
    slug: 'bmpcc-6k-pro',
    name: 'Blackmagic Pocket Cinema Camera 6K Pro',
    model: 'BMPCC 6K Pro',
    description: 'Super 35 HDR sensor with motorized ND filters, dual native ISO up to 25,600, 1500-nit tilting HDR screen, and Blackmagic RAW recording.',
    daily_price: 2800,
    weekly_price: 14000,
    monthly_price: 50000,
    security_deposit: 11000,
    replacement_value: 245000,
    thumbnail_url: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&auto=format&fit=crop&q=80',
    rating: 4.88,
    review_count: 27,
    is_featured: false,
    is_active: true,
    specs: { sensor: 'Super 35 HDR (23.10mm x 12.99mm)', mount: 'Active Canon EF', resolution: '6K up to 50fps, 4K up to 60fps', weight: '1238g' },
    included_accessories: ['BMPCC 6K Pro Body', 'SmallRig Cage', '4x NP-F570 Batteries', 'Samsung T7 Shield 1TB SSD', 'SSD Mount Clamp', 'Power Supply'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000007',
    category_id: '20000000-0000-0000-0000-000000000002',
    brand: 'Sony',
    slug: 'sony-fe-24-70mm-f2-8-gm-ii',
    name: 'Sony FE 24-70mm f/2.8 GM II Lens',
    model: 'SEL2470GM2',
    description: 'The pinnacle standard zoom lens for Sony E-mount. Exceptionally sharp corner-to-corner, fast XD linear motors, reduced weight, and aperture de-click switch.',
    daily_price: 1500,
    weekly_price: 7500,
    monthly_price: 27000,
    security_deposit: 6000,
    replacement_value: 199990,
    thumbnail_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    rating: 4.96,
    review_count: 54,
    is_featured: true,
    is_active: true,
    specs: { focal_length: '24-70mm', aperture: 'f/2.8 constant', mount: 'Sony E', filter_size: '82mm', weight: '695g' },
    included_accessories: ['Sony 24-70mm GM II Lens', 'Lens Hood', 'Front & Rear Lens Caps', 'B+W 82mm UV Filter', 'Padded Pouch'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000008',
    category_id: '20000000-0000-0000-0000-000000000002',
    brand: 'Canon',
    slug: 'canon-rf-50mm-f1-2-l-usm',
    name: 'Canon RF 50mm f/1.2 L USM Prime Lens',
    model: 'RF 50mm f/1.2L',
    description: 'Legendary ultra-fast normal prime lens for Canon RF. Astonishing optical clarity wide open at f/1.2 with smooth, dreamy cinematic bokeh.',
    daily_price: 1600,
    weekly_price: 8000,
    monthly_price: 28800,
    security_deposit: 6500,
    replacement_value: 214990,
    thumbnail_url: 'https://images.unsplash.com/photo-1520390138845-fd2d229dd553?w=800&auto=format&fit=crop&q=80',
    rating: 4.94,
    review_count: 33,
    is_featured: true,
    is_active: true,
    specs: { focal_length: '50mm', aperture: 'f/1.2 to f/16', mount: 'Canon RF', filter_size: '77mm', weight: '950g' },
    included_accessories: ['Canon RF 50mm f/1.2L Lens', 'Lens Hood', 'Front & Rear Caps', '77mm UV Filter', 'Protective Pouch'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000009',
    category_id: '20000000-0000-0000-0000-000000000002',
    brand: 'Sigma',
    slug: 'sigma-cine-high-speed-prime-set',
    name: 'Sigma Cine High-Speed Prime 3-Lens Set (24/35/50 T1.5)',
    model: 'CINE-SET-3',
    description: 'Full frame cinema prime trio (24mm, 35mm, 50mm T1.5) with standard 95mm front diameter, 0.8M focus/iris gears, and luminous markings.',
    daily_price: 6000,
    weekly_price: 30000,
    monthly_price: 108000,
    security_deposit: 25000,
    replacement_value: 750000,
    thumbnail_url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80',
    rating: 4.99,
    review_count: 18,
    is_featured: true,
    is_active: true,
    specs: { lenses: '24mm T1.5, 35mm T1.5, 50mm T1.5', mount: 'PL Mount / Sony E', coverage: 'Full-Frame 8K', front_diameter: '95mm' },
    included_accessories: ['Sigma 24mm T1.5 Cine Prime', 'Sigma 35mm T1.5 Cine Prime', 'Sigma 50mm T1.5 Cine Prime', 'Custom Flight Case', 'Lens Caps'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000010',
    category_id: '20000000-0000-0000-0000-000000000003',
    brand: 'Aputure',
    slug: 'aputure-ls-600d-pro',
    name: 'Aputure LS 600d Pro Daylight LED Monolight',
    model: 'LS 600d Pro',
    description: 'Monumental 600W daylight-balanced COB LED light delivering up to 98,500 lux @ 1m with Fresnel. Weatherproof IP54 with Sidus Link wireless app control.',
    daily_price: 3200,
    weekly_price: 16000,
    monthly_price: 57600,
    security_deposit: 12000,
    replacement_value: 219000,
    thumbnail_url: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80',
    rating: 4.97,
    review_count: 45,
    is_featured: true,
    is_active: true,
    specs: { power: '600W Output', color_temp: '5600K Daylight', cri_tlci: '96+ / 96+', control: 'Sidus Link, DMX512, Wireless CRMX' },
    included_accessories: ['Aputure 600d Pro Lamp Head', 'Control Box', 'Hyper Reflector', 'Rolling Hard Flight Case', 'Neutrik Power Cable', 'Heavy-Duty C-Stand'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000011',
    category_id: '20000000-0000-0000-0000-000000000003',
    brand: 'Nanlite',
    slug: 'nanlite-pavotube-ii-30x-2-light-kit',
    name: 'Nanlite PavoTube II 30X RGBWW Tube (2-Light Kit)',
    model: 'PT-30X-2KIT',
    description: 'Versatile 4-foot pixel tubes featuring full RGBWW spectrum, pixel mapping effects, built-in battery for 1.5h at 100% output, and internal DMX.',
    daily_price: 1800,
    weekly_price: 9000,
    monthly_price: 32400,
    security_deposit: 7000,
    replacement_value: 95000,
    thumbnail_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
    rating: 4.91,
    review_count: 39,
    is_featured: false,
    is_active: true,
    specs: { length: '4 Feet (120cm)', cct_range: '2700K - 12000K + Green/Magenta', battery: 'Built-in 4400mAh Li-Ion', effects: '15 Built-in FX' },
    included_accessories: ['2x PavoTube II 30X', '2x Power Adapters', '2x Transparent Mounting Clamps', '4x 1/4-20 Eye Bolts', 'Padded Carry Bag'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000012',
    category_id: '20000000-0000-0000-0000-000000000004',
    brand: 'Røde Microphones',
    slug: 'rode-wireless-pro-dual-mic-system',
    name: 'RØDE Wireless PRO Dual-Channel Wireless Mic System',
    model: 'WIPRO',
    description: 'Flagship wireless mic kit with 32-bit float on-board recording, ultra-compact transmitters, internal timecode generator, and 260m transmission range.',
    daily_price: 900,
    weekly_price: 4500,
    monthly_price: 16200,
    security_deposit: 3500,
    replacement_value: 42000,
    thumbnail_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    rating: 4.96,
    review_count: 61,
    is_featured: true,
    is_active: true,
    specs: { frequency: '2.4GHz Digital Series IV', recording: '32-bit Float Internal / 32GB Storage per TX', range: '260m Line of Sight' },
    included_accessories: ['2x Wireless PRO Transmitters', '1x Dual Receiver', 'Smart Charging Case', '2x Lavalier II Mics', 'Magnetic Clips', 'Audio Cables'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000013',
    category_id: '20000000-0000-0000-0000-000000000004',
    brand: 'Sennheiser',
    slug: 'sennheiser-mkh-416-shotgun-mic',
    name: 'Sennheiser MKH 416 Short Gun Interference Mic',
    model: 'MKH 416-P48',
    description: 'The gold standard location and broadcast shotgun mic. RF condenser design offers exceptional feedback rejection and ultra-crisp dialog pickup.',
    daily_price: 1200,
    weekly_price: 6000,
    monthly_price: 21600,
    security_deposit: 5000,
    replacement_value: 89000,
    thumbnail_url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=800&auto=format&fit=crop&q=80',
    rating: 4.98,
    review_count: 48,
    is_featured: true,
    is_active: true,
    specs: { polar_pattern: 'Supercardioid / Lobar', frequency_response: '40Hz - 20kHz', phantom_power: '48V Required', weight: '175g' },
    included_accessories: ['Sennheiser MKH 416 Mic', 'Rycote Softie Windshield', 'Pistol Grip Shockmount', '3m Carbon Boom Pole', '5m XLR Cable', 'Hard Case'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000014',
    category_id: '20000000-0000-0000-0000-000000000005',
    brand: 'DJI',
    slug: 'dji-rs3-pro-combo',
    name: 'DJI RS 3 Pro Gimbal Stabilizer Combo',
    model: 'RS3P-COMBO',
    description: 'Extended carbon fiber arms with 4.5kg tested payload, LiDAR focusing system compatibility, automated axis locks, and wireless video support.',
    daily_price: 1600,
    weekly_price: 8000,
    monthly_price: 28800,
    security_deposit: 6000,
    replacement_value: 89990,
    thumbnail_url: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80',
    rating: 4.93,
    review_count: 51,
    is_featured: true,
    is_active: true,
    specs: { payload: '4.5kg (10 lbs)', material: 'Carbon Fiber Arms', battery_life: 'Up to 12 Hours', weight: '1.5kg' },
    included_accessories: ['DJI RS 3 Pro Gimbal', 'BG30 Battery Grip', 'Focus Motor', 'Ronin Image Transmitter', 'Briefcase Handle', 'Extended Grip/Tripod', 'Carrying Case'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000015',
    category_id: '20000000-0000-0000-0000-000000000006',
    brand: 'DJI',
    slug: 'dji-mavic-3-pro-cine-combo',
    name: 'DJI Mavic 3 Pro Cine Premium Drone Combo',
    model: 'M3P-CINE',
    description: 'Triple-camera aerial platform with 4/3 CMOS Hasselblad sensor, dual tele cameras (70mm & 166mm), Apple ProRes 422 HQ recording, and 1TB SSD.',
    daily_price: 4500,
    weekly_price: 22500,
    monthly_price: 81000,
    security_deposit: 18000,
    replacement_value: 399990,
    thumbnail_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
    rating: 4.97,
    review_count: 36,
    is_featured: true,
    is_active: true,
    specs: { cameras: 'Hasselblad 4/3 CMOS 5.1K + 70mm & 166mm Tele', video: 'Apple ProRes 422 HQ / D-Log M', flight_time: '43 Mins per battery', storage: '1TB Internal SSD' },
    included_accessories: ['DJI Mavic 3 Pro Cine Drone', 'DJI RC Pro Controller', '3x Intelligent Flight Batteries', '100W Charging Hub', 'ND Filter Set', 'Shoulder Bag'],
    created_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000016',
    category_id: '20000000-0000-0000-0000-000000000007',
    brand: 'Sony',
    slug: 'indie-cinema-creator-bundle',
    name: 'Indie Cinema Creator Master Package',
    model: 'KIT-INDIE-FX3',
    description: 'The complete indie commercial kit: Sony FX3 Cinema camera, GM 24-70mm f/2.8 lens, DJI RS3 Pro gimbal, RØDE Wireless PRO mics, and Aputure 300d lighting setup.',
    daily_price: 8500,
    weekly_price: 42500,
    monthly_price: 153000,
    security_deposit: 35000,
    replacement_value: 850000,
    thumbnail_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    rating: 4.99,
    review_count: 23,
    is_featured: true,
    is_active: true,
    specs: { kit_contents: 'Sony FX3 Camera + 24-70mm GM II + RS3 Pro + RØDE Wireless PRO + Aputure 300d II Light + V-Mount Battery Rig' },
    included_accessories: ['Sony FX3 + 24-70 GM II', 'DJI RS 3 Pro Gimbal', 'RØDE Wireless PRO Set', 'Aputure 300d II + Light Dome', '2x 150Wh V-Mount Batteries', 'Full Pelican Travel Case Set'],
    created_at: new Date().toISOString(),
  },
];

export class EquipmentModel {
  static async getAll(filters?: {
    categoryId?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    isFeatured?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ items: EquipmentEntity[]; total: number }> {
    if (isDatabaseConnected()) {
      let sql = 'SELECT * FROM equipment WHERE is_active = TRUE';
      const params: any[] = [];
      let paramIdx = 1;

      if (filters?.categoryId) {
        sql += ` AND category_id = $${paramIdx++}`;
        params.push(filters.categoryId);
      }
      if (filters?.brand) {
        sql += ` AND brand ILIKE $${paramIdx++}`;
        params.push(`%${filters.brand}%`);
      }
      if (filters?.minPrice !== undefined) {
        sql += ` AND daily_price >= $${paramIdx++}`;
        params.push(filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        sql += ` AND daily_price <= $${paramIdx++}`;
        params.push(filters.maxPrice);
      }
      if (filters?.search) {
        sql += ` AND (name ILIKE $${paramIdx} OR description ILIKE $${paramIdx} OR brand ILIKE $${paramIdx})`;
        params.push(`%${filters.search}%`);
        paramIdx++;
      }
      if (filters?.isFeatured !== undefined) {
        sql += ` AND is_featured = $${paramIdx++}`;
        params.push(filters.isFeatured);
      }

      sql += ' ORDER BY is_featured DESC, rating DESC';
      const limit = filters?.limit || 50;
      const offset = filters?.offset || 0;
      sql += ` LIMIT ${limit} OFFSET ${offset}`;

      const res = await query<EquipmentEntity>(sql, params);
      return { items: res.rows, total: res.rowCount || 0 };
    }

    let items = [...mockEquipment];
    if (filters?.categoryId) {
      items = items.filter((e) => e.category_id === filters.categoryId);
    }
    if (filters?.brand) {
      items = items.filter((e) => e.brand.toLowerCase() === filters.brand?.toLowerCase());
    }
    if (filters?.minPrice !== undefined) {
      items = items.filter((e) => e.daily_price >= (filters.minPrice || 0));
    }
    if (filters?.maxPrice !== undefined) {
      items = items.filter((e) => e.daily_price <= (filters.maxPrice || Infinity));
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase();
      items = items.filter((e) => e.name.toLowerCase().includes(q) || e.brand.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    if (filters?.isFeatured !== undefined) {
      items = items.filter((e) => e.is_featured === filters.isFeatured);
    }

    const total = items.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    return { items: items.slice(offset, offset + limit), total };
  }

  static async findById(id: string): Promise<EquipmentEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<EquipmentEntity>('SELECT * FROM equipment WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return mockEquipment.find((e) => e.id === id) || null;
  }

  static async findBySlug(slug: string): Promise<EquipmentEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<EquipmentEntity>('SELECT * FROM equipment WHERE slug = $1', [slug]);
      return res.rows[0] || null;
    }
    return mockEquipment.find((e) => e.slug === slug) || null;
  }

  static async create(data: Partial<EquipmentEntity>): Promise<EquipmentEntity> {
    if (isDatabaseConnected()) {
      const res = await query<EquipmentEntity>(
        `INSERT INTO equipment (
           category_id, brand, slug, name, model, description,
           daily_price, weekly_price, monthly_price, security_deposit, replacement_value,
           thumbnail_url, is_featured, specs, included_accessories
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING *`,
        [
          data.category_id,
          data.brand || 'Cinema Brand',
          data.slug || `gear-${Date.now()}`,
          data.name || 'New Gear',
          data.model || null,
          data.description || '',
          data.daily_price || 1000,
          data.weekly_price || null,
          data.monthly_price || null,
          data.security_deposit || 3000,
          data.replacement_value || 50000,
          data.thumbnail_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
          data.is_featured || false,
          JSON.stringify(data.specs || {}),
          JSON.stringify(data.included_accessories || []),
        ]
      );
      return res.rows[0];
    }

    const newEquip: EquipmentEntity = {
      id: `equip-${Date.now()}`,
      category_id: data.category_id!,
      brand: data.brand || 'Cinema Brand',
      slug: data.slug || `gear-${Date.now()}`,
      name: data.name || 'New Gear',
      model: data.model || '',
      description: data.description || '',
      daily_price: data.daily_price || 1000,
      weekly_price: data.weekly_price || 5000,
      monthly_price: data.monthly_price || 18000,
      security_deposit: data.security_deposit || 3000,
      replacement_value: data.replacement_value || 50000,
      thumbnail_url: data.thumbnail_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      rating: 5.0,
      review_count: 0,
      is_featured: !!data.is_featured,
      is_active: true,
      specs: data.specs || {},
      included_accessories: data.included_accessories || [],
      created_at: new Date().toISOString(),
    };
    mockEquipment.unshift(newEquip);
    return newEquip;
  }
}
