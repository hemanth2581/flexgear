// backend/src/models/Category.ts
import { query, isDatabaseConnected } from '../config/database';

export interface CategoryEntity {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  display_order: number;
  is_active: boolean;
}

export const mockCategories: CategoryEntity[] = [
  { id: '20000000-0000-0000-0000-000000000001', slug: 'cameras', name: 'Cameras & Bodies', icon: 'camera', description: 'Full-frame & Super 35 cinema cameras', display_order: 1, is_active: true },
  { id: '20000000-0000-0000-0000-000000000002', slug: 'lenses', name: 'Cinema & Prime Lenses', icon: 'disc', description: 'Cine primes, fast zoom & anamorphic lenses', display_order: 2, is_active: true },
  { id: '20000000-0000-0000-0000-000000000003', slug: 'lighting', 'name': 'Studio Lighting & Softboxes', icon: 'sun', description: 'Continuous LED spotlights & RGB tubes', display_order: 3, is_active: true },
  { id: '20000000-0000-0000-0000-000000000004', slug: 'audio', name: 'Audio, Mics & Recorders', icon: 'mic', description: 'Wireless lavs, shotgun mics & field recorders', display_order: 4, is_active: true },
  { id: '20000000-0000-0000-0000-000000000005', slug: 'gimbals', name: 'Gimbals & Stabilizers', icon: 'crosshair', description: '3-axis motorized stabilizers & steadicams', display_order: 5, is_active: true },
  { id: '20000000-0000-0000-0000-000000000006', slug: 'drones', name: 'Aerial Drones & FPV', icon: 'navigation', description: 'Pro aerial platforms and FPV cinema rigs', display_order: 6, is_active: true },
  { id: '20000000-0000-0000-0000-000000000007', slug: 'kits', name: 'Complete Production Kits', icon: 'film', description: 'Turnkey cinema equipment bundles', display_order: 7, is_active: true },
];

export class CategoryModel {
  static async getAll(): Promise<CategoryEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<CategoryEntity>('SELECT * FROM categories WHERE is_active = TRUE ORDER BY display_order ASC');
      return res.rows;
    }
    return mockCategories;
  }

  static async findBySlug(slug: string): Promise<CategoryEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<CategoryEntity>('SELECT * FROM categories WHERE slug = $1', [slug]);
      return res.rows[0] || null;
    }
    return mockCategories.find((c) => c.slug === slug) || null;
  }

  static async findById(id: string): Promise<CategoryEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<CategoryEntity>('SELECT * FROM categories WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return mockCategories.find((c) => c.id === id) || null;
  }
}
