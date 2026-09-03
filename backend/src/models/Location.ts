// backend/src/models/Location.ts
import { query, isDatabaseConnected } from '../config/database';

export interface LocationEntity {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  phone: string;
  email: string;
  latitude: number;
  longitude: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export const mockLocations: LocationEntity[] = [
  {
    id: 'loc_blr_01',
    name: 'FlexGear Bengaluru Master Vault',
    city: 'Bengaluru',
    state: 'Karnataka',
    address: '42 Indiranagar 100ft Road, Stage 2',
    pincode: '560038',
    phone: '+91 80 4910 8820',
    email: 'blr.hub@flexgear.com',
    latitude: 12.9716,
    longitude: 77.6412,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_chn_01',
    name: 'FlexGear Chennai Cine Hub',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: '15 Sterling Road, Nungambakkam',
    pincode: '600034',
    phone: '+91 44 3892 1100',
    email: 'chn.hub@flexgear.com',
    latitude: 13.0604,
    longitude: 80.2496,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'loc_cbe_01',
    name: 'FlexGear Coimbatore Studio Depot',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    address: '88 Avinashi Road, Peelamedu',
    pincode: '641004',
    phone: '+91 422 2590 334',
    email: 'cbe.hub@flexgear.com',
    latitude: 11.0168,
    longitude: 76.9558,
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class LocationModel {
  static async getAll(): Promise<LocationEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<LocationEntity>('SELECT * FROM locations WHERE active = TRUE ORDER BY city ASC');
      return res.rows;
    }
    return mockLocations;
  }

  static async findById(id: string): Promise<LocationEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<LocationEntity>('SELECT * FROM locations WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return mockLocations.find((l) => l.id === id) || null;
  }

  static async create(data: Partial<LocationEntity>): Promise<LocationEntity> {
    const newLoc: LocationEntity = {
      id: data.id || `loc_${Date.now()}`,
      name: data.name || 'FlexGear Hub',
      city: data.city || 'City',
      state: data.state || 'State',
      address: data.address || 'Address',
      pincode: data.pincode || '000000',
      phone: data.phone || '+91 99999 99999',
      email: data.email || 'info@flexgear.com',
      latitude: data.latitude || 12.9716,
      longitude: data.longitude || 77.5946,
      active: data.active !== undefined ? data.active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isDatabaseConnected()) {
      const res = await query<LocationEntity>(
        `INSERT INTO locations (name, city, state, address, pincode, phone, email, latitude, longitude, active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [newLoc.name, newLoc.city, newLoc.state, newLoc.address, newLoc.pincode, newLoc.phone, newLoc.email, newLoc.latitude, newLoc.longitude, newLoc.active]
      );
      return res.rows[0];
    }
    mockLocations.push(newLoc);
    return newLoc;
  }
}
