// backend/src/models/Address.ts
export interface AddressEntity {
  id: string;
  user_id: string;
  title: string;
  full_name: string;
  phone: string;
  street_address: string;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  lat?: number | null;
  lng?: number | null;
  is_default: boolean;
  created_at: string;
}

export const mockAddresses: AddressEntity[] = [
  {
    id: 'addr-01',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Main Studio',
    full_name: 'Arjun Menon',
    phone: '+919876543210',
    street_address: 'Stage 4B, Film City Goregaon',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400065',
    lat: 19.1663,
    lng: 72.8876,
    is_default: true,
    created_at: new Date().toISOString(),
  },
];

export class AddressModel {
  static async getByUserId(userId: string): Promise<AddressEntity[]> {
    return mockAddresses.filter((a) => a.user_id === userId);
  }

  static async create(data: Partial<AddressEntity>): Promise<AddressEntity> {
    const address: AddressEntity = {
      id: `addr-${Date.now()}`,
      user_id: data.user_id!,
      title: data.title || 'Studio',
      full_name: data.full_name || 'Production Contact',
      phone: data.phone || '',
      street_address: data.street_address || '',
      landmark: data.landmark || null,
      city: data.city || 'Mumbai',
      state: data.state || 'Maharashtra',
      pincode: data.pincode || '400001',
      lat: data.lat || null,
      lng: data.lng || null,
      is_default: !!data.is_default,
      created_at: new Date().toISOString(),
    };
    mockAddresses.push(address);
    return address;
  }
}
