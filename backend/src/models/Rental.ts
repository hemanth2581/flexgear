// backend/src/models/Rental.ts
import { query, isDatabaseConnected } from '../config/database';
import { RentalStatus } from '../types/rental.types';

export interface RentalEntity {
  id: string;
  rental_number: string;
  user_id: string;
  status: RentalStatus;
  start_date: string;
  end_date: string;
  total_days: number;
  delivery_mode: 'PICKUP' | 'DELIVERY';
  delivery_address: Record<string, any>;
  delivery_lat?: number | null;
  delivery_lng?: number | null;
  subtotal: number;
  discount: number;
  delivery_fee: number;
  tax: number;
  security_deposit: number;
  total_amount: number;
  notes?: string | null;
  created_at: string;
  items?: any[];
  user?: any;
}

export const mockRentals: RentalEntity[] = [];

export class RentalModel {
  static async findById(id: string): Promise<RentalEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<RentalEntity>('SELECT * FROM rentals WHERE id = $1', [id]);
      if (res.rows[0]) {
        const itemsRes = await query('SELECT ri.*, e.name, e.thumbnail_url FROM rental_items ri JOIN equipment e ON ri.equipment_id = e.id WHERE ri.rental_id = $1', [id]);
        res.rows[0].items = itemsRes.rows;
      }
      return res.rows[0] || null;
    }
    return mockRentals.find((r) => r.id === id || r.rental_number === id) || null;
  }

  static async getByUserId(userId: string): Promise<RentalEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<RentalEntity>('SELECT * FROM rentals WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      for (const r of res.rows) {
        const itemsRes = await query('SELECT ri.*, e.name, e.thumbnail_url FROM rental_items ri JOIN equipment e ON ri.equipment_id = e.id WHERE ri.rental_id = $1', [r.id]);
        r.items = itemsRes.rows;
      }
      return res.rows;
    }
    return mockRentals.filter((r) => r.user_id === userId);
  }

  static async getAll(limit = 50, offset = 0): Promise<RentalEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<RentalEntity>(
        `SELECT r.*, u.full_name as user_name, u.email as user_email
         FROM rentals r
         LEFT JOIN users u ON r.user_id = u.id
         ORDER BY r.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      );
      return res.rows;
    }
    return mockRentals.slice(offset, offset + limit);
  }

  static async create(data: Partial<RentalEntity>): Promise<RentalEntity> {
    if (isDatabaseConnected()) {
      const res = await query<RentalEntity>(
        `INSERT INTO rentals (
           rental_number, user_id, status, start_date, end_date, total_days,
           delivery_mode, delivery_address, delivery_lat, delivery_lng,
           subtotal, discount, delivery_fee, tax, security_deposit, total_amount, notes
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
         RETURNING *`,
        [
          data.rental_number || `FG-RNT-${Date.now()}`,
          data.user_id,
          data.status || 'PENDING_PAYMENT',
          data.start_date,
          data.end_date,
          data.total_days || 1,
          data.delivery_mode || 'PICKUP',
          JSON.stringify(data.delivery_address || {}),
          data.delivery_lat || null,
          data.delivery_lng || null,
          data.subtotal || 0,
          data.discount || 0,
          data.delivery_fee || 0,
          data.tax || 0,
          data.security_deposit || 0,
          data.total_amount || 0,
          data.notes || null,
        ]
      );
      const rental = res.rows[0];
      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          await query(
            `INSERT INTO rental_items (rental_id, equipment_id, quantity, daily_price, subtotal)
             VALUES ($1, $2, $3, $4, $5)`,
            [rental.id, item.equipment_id, item.quantity, item.daily_price, item.subtotal]
          );
        }
        rental.items = data.items;
      }
      return rental;
    }

    const newRental: RentalEntity = {
      id: `rent-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      rental_number: data.rental_number || `FG-RNT-${Date.now()}`,
      user_id: data.user_id!,
      status: data.status || 'PENDING_PAYMENT',
      start_date: data.start_date!,
      end_date: data.end_date!,
      total_days: data.total_days || 1,
      delivery_mode: data.delivery_mode || 'PICKUP',
      delivery_address: data.delivery_address || {},
      delivery_lat: data.delivery_lat,
      delivery_lng: data.delivery_lng,
      subtotal: data.subtotal || 0,
      discount: data.discount || 0,
      delivery_fee: data.delivery_fee || 0,
      tax: data.tax || 0,
      security_deposit: data.security_deposit || 0,
      total_amount: data.total_amount || 0,
      notes: data.notes,
      items: data.items || [],
      created_at: new Date().toISOString(),
    };
    mockRentals.unshift(newRental);
    return newRental;
  }

  static async updateStatus(id: string, status: RentalStatus): Promise<RentalEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<RentalEntity>('UPDATE rentals SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, id]);
      return res.rows[0] || null;
    }
    const r = mockRentals.find((rent) => rent.id === id || rent.rental_number === id);
    if (r) {
      r.status = status;
    }
    return r || null;
  }
}
