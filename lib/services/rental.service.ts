import { RentalStatus, DepositStatus } from '@/types/rental';
import { generateRandomAlphanumeric } from '@/lib/utils';
import { format } from 'date-fns';

export class RentalService {
  /**
   * Generates a unique Rental ID following format: FG-RNT-YYYYMMDD-XXXXX
   * Example: FG-RNT-20260831-9A3KF
   */
  static generateRentalId(): string {
    const dateStr = format(new Date(), 'yyyyMMdd');
    const randomSuffix = generateRandomAlphanumeric(5);
    return `FG-RNT-${dateStr}-${randomSuffix}`;
  }

  /**
   * Validates if a status transition is permitted in the rental lifecycle
   */
  static isValidStatusTransition(currentStatus: RentalStatus, targetStatus: RentalStatus): boolean {
    const validTransitions: Record<RentalStatus, RentalStatus[]> = {
      PENDING: ['PAYMENT_PENDING', 'CANCELLED'],
      PAYMENT_PENDING: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['READY_FOR_PICKUP', 'CANCELLED'],
      READY_FOR_PICKUP: ['ACTIVE', 'CANCELLED'],
      ACTIVE: ['RETURN_PENDING', 'RETURNED', 'OVERDUE'],
      RETURN_PENDING: ['RETURNED'],
      RETURNED: [],
      CANCELLED: [],
      OVERDUE: ['RETURN_PENDING', 'RETURNED'],
    };

    const allowed = validTransitions[currentStatus] || [];
    return allowed.includes(targetStatus);
  }

  /**
   * Determines next standard status in the pickup/delivery lifecycle
   */
  static getNextLifecycleStatus(currentStatus: RentalStatus): RentalStatus | null {
    switch (currentStatus) {
      case 'CONFIRMED':
        return 'READY_FOR_PICKUP';
      case 'READY_FOR_PICKUP':
        return 'ACTIVE';
      case 'ACTIVE':
        return 'RETURN_PENDING';
      case 'RETURN_PENDING':
        return 'RETURNED';
      default:
        return null;
    }
  }
}
