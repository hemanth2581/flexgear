// backend/src/models/Refund.ts
import { query, isDatabaseConnected } from '../config/database';

export interface RefundEntity {
  id: string;
  rental_id: string;
  payment_id?: string | null;
  stripe_refund_id?: string | null;
  amount: number;
  reason: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED';
  created_at: string;
}

export const mockRefunds: RefundEntity[] = [
  {
    id: 'ref_001',
    rental_id: '10000000-0000-0000-0000-000000000001',
    payment_id: 'pay_001',
    stripe_refund_id: 're_mock_3N9281a8b',
    amount: 14500,
    reason: 'Security deposit released after QC inspection (₹1,500 minor scratch fee deducted)',
    status: 'SUCCEEDED',
    created_at: new Date().toISOString(),
  },
];

export class RefundModel {
  static async getAll(): Promise<RefundEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<RefundEntity>('SELECT * FROM refunds ORDER BY created_at DESC');
      return res.rows;
    }
    return mockRefunds;
  }

  static async findByRentalId(rentalId: string): Promise<RefundEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<RefundEntity>('SELECT * FROM refunds WHERE rental_id = $1', [rentalId]);
      return res.rows;
    }
    return mockRefunds.filter((r) => r.rental_id === rentalId);
  }

  static async create(data: Partial<RefundEntity>): Promise<RefundEntity> {
    const newRefund: RefundEntity = {
      id: data.id || `ref_${Date.now()}`,
      rental_id: data.rental_id || '',
      payment_id: data.payment_id || null,
      stripe_refund_id: data.stripe_refund_id || `re_live_${Date.now()}`,
      amount: data.amount || 0,
      reason: data.reason || 'Deposit Escrow Release',
      status: data.status || 'SUCCEEDED',
      created_at: new Date().toISOString(),
    };
    if (isDatabaseConnected()) {
      const res = await query<RefundEntity>(
        `INSERT INTO refunds (rental_id, payment_id, stripe_refund_id, amount, reason, status)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [newRefund.rental_id, newRefund.payment_id, newRefund.stripe_refund_id, newRefund.amount, newRefund.reason, newRefund.status]
      );
      return res.rows[0];
    }
    mockRefunds.unshift(newRefund);
    return newRefund;
  }
}
