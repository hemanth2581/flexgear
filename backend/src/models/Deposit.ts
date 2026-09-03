// backend/src/models/Deposit.ts
import { query, isDatabaseConnected } from '../config/database';
import { DepositStatus } from '../types/rental.types';

export interface DepositEntity {
  id: string;
  rental_id: string;
  user_id: string;
  held_amount: number;
  deducted_amount: number;
  refunded_amount: number;
  status: DepositStatus;
  stripe_refund_id?: string | null;
  deduction_reason?: string | null;
  refunded_at?: string | null;
  created_at: string;
}

export const mockDeposits: DepositEntity[] = [];

export class DepositModel {
  static async findById(id: string): Promise<DepositEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<DepositEntity>('SELECT * FROM deposits WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    return mockDeposits.find((d) => d.id === id || d.rental_id === id) || null;
  }

  static async findByRentalId(rentalId: string): Promise<DepositEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<DepositEntity>('SELECT * FROM deposits WHERE rental_id = $1', [rentalId]);
      return res.rows[0] || null;
    }
    return mockDeposits.find((d) => d.rental_id === rentalId || d.id === rentalId) || null;
  }

  static async getAll(): Promise<DepositEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<DepositEntity>('SELECT * FROM deposits ORDER BY created_at DESC');
      return res.rows;
    }
    return mockDeposits;
  }

  static async create(data: Partial<DepositEntity>): Promise<DepositEntity> {
    if (isDatabaseConnected()) {
      const res = await query<DepositEntity>(
        `INSERT INTO deposits (rental_id, user_id, held_amount, status)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [data.rental_id, data.user_id, data.held_amount || 0, data.status || 'HELD']
      );
      return res.rows[0];
    }

    const deposit: DepositEntity = {
      id: `dep-${Date.now()}`,
      rental_id: data.rental_id!,
      user_id: data.user_id!,
      held_amount: data.held_amount || 0,
      deducted_amount: 0,
      refunded_amount: 0,
      status: 'HELD',
      created_at: new Date().toISOString(),
    };
    mockDeposits.unshift(deposit);
    return deposit;
  }

  static async processRefund(
    rentalId: string,
    deductedAmount: number,
    deductionReason?: string,
    stripeRefundId?: string
  ): Promise<DepositEntity | null> {
    const refundedAmount = Math.max(0, (await this.findByRentalId(rentalId))?.held_amount || 0 - deductedAmount);
    const status: DepositStatus = deductedAmount > 0 ? (refundedAmount > 0 ? 'PARTIAL_REFUND' : 'DEDUCTION') : 'FULL_REFUND';

    if (isDatabaseConnected()) {
      const res = await query<DepositEntity>(
        `UPDATE deposits
         SET deducted_amount = $1,
             refunded_amount = GREATEST(0, held_amount - $1),
             status = $2,
             deduction_reason = $3,
             stripe_refund_id = $4,
             refunded_at = NOW(),
             updated_at = NOW()
         WHERE rental_id = $5
         RETURNING *`,
        [deductedAmount, status, deductionReason || null, stripeRefundId || null, rentalId]
      );
      return res.rows[0] || null;
    }

    const deposit = mockDeposits.find((d) => d.rental_id === rentalId);
    if (!deposit) return null;

    deposit.deducted_amount = deductedAmount;
    deposit.refunded_amount = Math.max(0, deposit.held_amount - deductedAmount);
    deposit.status = status;
    deposit.deduction_reason = deductionReason || null;
    deposit.stripe_refund_id = stripeRefundId || 'mock_re_12345';
    deposit.refunded_at = new Date().toISOString();

    return deposit;
  }
}
