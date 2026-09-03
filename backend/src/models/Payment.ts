// backend/src/models/Payment.ts
import { query, isDatabaseConnected } from '../config/database';
import { PaymentStatus } from '../types/rental.types';

export interface PaymentEntity {
  id: string;
  rental_id: string;
  user_id: string;
  stripe_payment_intent_id?: string | null;
  stripe_charge_id?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string;
  receipt_url?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
}

export const mockPayments: PaymentEntity[] = [];

export class PaymentModel {
  static async create(data: Partial<PaymentEntity>): Promise<PaymentEntity> {
    if (isDatabaseConnected()) {
      const res = await query<PaymentEntity>(
        `INSERT INTO payments (rental_id, user_id, stripe_payment_intent_id, amount, currency, status, payment_method, metadata)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          data.rental_id,
          data.user_id,
          data.stripe_payment_intent_id || null,
          data.amount || 0,
          data.currency || 'inr',
          data.status || 'PENDING',
          data.payment_method || 'card',
          JSON.stringify(data.metadata || {}),
        ]
      );
      return res.rows[0];
    }

    const payment: PaymentEntity = {
      id: `pay-${Date.now()}`,
      rental_id: data.rental_id!,
      user_id: data.user_id!,
      stripe_payment_intent_id: data.stripe_payment_intent_id || null,
      amount: data.amount || 0,
      currency: data.currency || 'inr',
      status: data.status || 'PENDING',
      payment_method: data.payment_method || 'card',
      receipt_url: data.receipt_url || null,
      metadata: data.metadata || {},
      created_at: new Date().toISOString(),
    };
    mockPayments.push(payment);
    return payment;
  }

  static async findByPaymentIntentId(piId: string): Promise<PaymentEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<PaymentEntity>('SELECT * FROM payments WHERE stripe_payment_intent_id = $1', [piId]);
      return res.rows[0] || null;
    }
    return mockPayments.find((p) => p.stripe_payment_intent_id === piId) || null;
  }

  static async updateStatus(id: string, status: PaymentStatus): Promise<void> {
    if (isDatabaseConnected()) {
      await query(
        'UPDATE payments SET status = $1, updated_at = NOW() WHERE id = $2 OR stripe_payment_intent_id = $2',
        [status, id]
      );
      return;
    }
    const p = mockPayments.find((pay) => pay.id === id || pay.stripe_payment_intent_id === id);
    if (p) p.status = status;
  }

  static async getAll(): Promise<PaymentEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<PaymentEntity>('SELECT * FROM payments ORDER BY created_at DESC');
      return res.rows;
    }
    return mockPayments;
  }
}
