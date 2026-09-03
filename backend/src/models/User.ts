// backend/src/models/User.ts
import { query, isDatabaseConnected } from '../config/database';

export type UserRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN' | 'STAFF' | 'WAREHOUSE_MANAGER' | 'FINANCE';

export interface UserEntity {
  id: string;
  firebase_uid?: string | null;
  email: string;
  phone?: string | null;
  full_name: string;
  role: UserRole;
  avatar_url?: string | null;
  is_active: boolean;
  created_at: string;
}

// In-Memory Seed Users for local development
const mockUsers: UserEntity[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'customer@flexgear.test',
    phone: '+919876543210',
    full_name: 'Arjun Menon (Filmmaker)',
    role: 'CUSTOMER',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'admin@flexgear.film',
    phone: '+919865986598',
    full_name: 'Hemanth G (Executive Producer & Admin)',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'hemanth.ops@flexgear.film',
    phone: '+916305269032',
    full_name: 'Hemanth G (Operations Admin)',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'studio.admin@flexgear.film',
    phone: '+919988776655',
    full_name: 'FlexGear Studio Operations',
    role: 'ADMIN',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export class UserModel {
  static async findById(id: string): Promise<UserEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<UserEntity>('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return mockUsers.find((u) => u.id === id) || null;
  }

  static async findByEmail(email: string): Promise<UserEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<UserEntity>('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
      return res.rows[0] || null;
    }
    return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  static async findByPhone(phone: string): Promise<UserEntity | null> {
    const cleanReq = phone.replace(/\D/g, '');
    if (isDatabaseConnected()) {
      const res = await query<UserEntity>(
        'SELECT * FROM users WHERE phone = $1 OR phone ILIKE $2',
        [phone, `%${cleanReq.slice(-10)}%`]
      );
      return res.rows[0] || null;
    }

    return (
      mockUsers.find((u) => {
        const uClean = u.phone ? u.phone.replace(/\D/g, '') : '';
        return (
          u.phone === phone ||
          uClean === cleanReq ||
          (cleanReq.length >= 10 && uClean.endsWith(cleanReq.slice(-10)))
        );
      }) || null
    );
  }

  static async findByFirebaseUid(uid: string): Promise<UserEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<UserEntity>('SELECT * FROM users WHERE firebase_uid = $1', [uid]);
      return res.rows[0] || null;
    }
    return mockUsers.find((u) => u.firebase_uid === uid) || null;
  }

  static async create(data: {
    email: string;
    full_name: string;
    phone?: string;
    firebaseUid?: string;
    role?: UserRole;
  }): Promise<UserEntity> {
    const cleanPhone = data.phone?.replace(/\D/g, '') || '';
    const isAdminNumber =
      cleanPhone.endsWith('9865986598') ||
      cleanPhone.endsWith('6305269032') ||
      cleanPhone.endsWith('9988776655');

    const role: UserRole = data.role || (isAdminNumber ? 'ADMIN' : 'CUSTOMER');

    if (isDatabaseConnected()) {
      const res = await query<UserEntity>(
        `INSERT INTO users (email, full_name, phone, firebase_uid, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [data.email.toLowerCase(), data.full_name, data.phone || null, data.firebaseUid || null, role]
      );
      return res.rows[0];
    }

    const newUser: UserEntity = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      email: data.email.toLowerCase(),
      full_name: data.full_name,
      phone: data.phone || null,
      firebase_uid: data.firebaseUid || null,
      role,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  }

  static async update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
    if (isDatabaseConnected()) {
      const fields = Object.keys(data).filter((k) => k !== 'id' && (data as any)[k] !== undefined);
      if (fields.length === 0) return this.findById(id);
      const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
      const values = fields.map((f) => (data as any)[f]);
      const res = await query<UserEntity>(
        `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
        [...values, id]
      );
      return res.rows[0] || null;
    }

    const u = mockUsers.find((user) => user.id === id);
    if (u) {
      Object.assign(u, data);
    }
    return u || null;
  }

  static async getAll(limit = 50, offset = 0): Promise<UserEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<UserEntity>(
        'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return res.rows;
    }
    return mockUsers.slice(offset, offset + limit);
  }
}
