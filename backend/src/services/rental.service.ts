// backend/src/services/rental.service.ts
import { RentalModel, RentalEntity } from '../models/Rental';
import { RentalStatus } from '../types/rental.types';
import { DepositModel } from '../models/Deposit';
import { NotificationModel } from '../models/Notification';

export class RentalService {
  static async getRentalsByUser(userId: string): Promise<RentalEntity[]> {
    return await RentalModel.getByUserId(userId);
  }

  static async getRentalById(id: string): Promise<RentalEntity | null> {
    const rental = await RentalModel.findById(id);
    if (!rental) return null;

    const deposit = await DepositModel.findByRentalId(rental.id);
    return {
      ...rental,
      deposit,
    } as any;
  }

  static async updateStatus(rentalId: string, status: RentalStatus, notes?: string): Promise<RentalEntity | null> {
    const updated = await RentalModel.updateStatus(rentalId, status);
    if (updated) {
      // Notify customer
      await NotificationModel.create({
        user_id: updated.user_id,
        title: `Rental Status Updated: ${status}`,
        message: `Your booking #${updated.rental_number} has moved to ${status}.`,
        type: 'RENTAL_UPDATE',
        link_url: `/rentals/${updated.id}`,
      });
    }
    return updated;
  }
}
