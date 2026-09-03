// backend/src/models/Brand.ts
import { query, isDatabaseConnected } from '../config/database';

export interface BrandEntity {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const mockBrands: BrandEntity[] = [
  { id: 'b001', name: 'Sony', slug: 'sony', logo_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b002', name: 'Canon', slug: 'canon', logo_url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b003', name: 'Nikon', slug: 'nikon', logo_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b004', name: 'RED Digital Cinema', slug: 'red', logo_url: 'https://images.unsplash.com/photo-1589872510928-86d1ff82173f?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b005', name: 'Blackmagic Design', slug: 'blackmagic', logo_url: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b006', name: 'ARRI', slug: 'arri', logo_url: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b007', name: 'Aputure', slug: 'aputure', logo_url: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b008', name: 'Godox', slug: 'godox', logo_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b009', name: 'DJI', slug: 'dji', logo_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b010', name: 'RØDE', slug: 'rode', logo_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b011', name: 'Sennheiser', slug: 'sennheiser', logo_url: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b012', name: 'Sigma', slug: 'sigma', logo_url: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b013', name: 'Tamron', slug: 'tamron', logo_url: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b014', name: 'Zhiyun', slug: 'zhiyun', logo_url: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b015', name: 'Manfrotto', slug: 'manfrotto', logo_url: 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 'b016', name: 'SmallRig', slug: 'smallrig', logo_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200', active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

export class BrandModel {
  static async getAll(): Promise<BrandEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<BrandEntity>('SELECT * FROM brands WHERE active = TRUE ORDER BY name ASC');
      return res.rows;
    }
    return mockBrands;
  }

  static async findBySlug(slug: string): Promise<BrandEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<BrandEntity>('SELECT * FROM brands WHERE slug = $1', [slug]);
      return res.rows[0] || null;
    }
    return mockBrands.find((b) => b.slug === slug) || null;
  }

  static async findById(id: string): Promise<BrandEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<BrandEntity>('SELECT * FROM brands WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return mockBrands.find((b) => b.id === id) || null;
  }

  static async create(data: Partial<BrandEntity>): Promise<BrandEntity> {
    const newBrand: BrandEntity = {
      id: data.id || `b_${Date.now()}`,
      name: data.name || 'New Brand',
      slug: data.slug || (data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : 'brand'),
      logo_url: data.logo_url || null,
      active: data.active !== undefined ? data.active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isDatabaseConnected()) {
      const res = await query<BrandEntity>(
        'INSERT INTO brands (name, slug, logo_url, active) VALUES ($1, $2, $3, $4) RETURNING *',
        [newBrand.name, newBrand.slug, newBrand.logo_url, newBrand.active]
      );
      return res.rows[0];
    }
    mockBrands.push(newBrand);
    return newBrand;
  }
}
