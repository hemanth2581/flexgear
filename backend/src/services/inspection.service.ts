// backend/src/services/inspection.service.ts
import { InspectionModel } from '../models/Inspection';
import { RentalModel } from '../models/Rental';
import { NotificationModel } from '../models/Notification';

export class InspectionService {
  static async submitInspection(data: {
    rentalId: string;
    inspectorId?: string;
    hasDamage: boolean;
    damageDescription?: string;
    damageFee: number;
    conditionNotes?: string;
    photoUrls?: string[];
  }) {
    const inspection = await InspectionModel.create({
      rental_id: data.rentalId,
      inspector_id: data.inspectorId,
      has_damage: data.hasDamage,
      damage_description: data.damageDescription,
      damage_fee: data.damageFee,
      condition_notes: data.conditionNotes,
      photo_urls: data.photoUrls,
    });

    // Update rental status
    const rental = await RentalModel.findById(data.rentalId);
    if (rental) {
      const newStatus = data.hasDamage ? 'UNDER_INSPECTION' : 'RETURN_PENDING';
      await RentalModel.updateStatus(data.rentalId, newStatus);

      if (data.hasDamage) {
        await NotificationModel.create({
          user_id: rental.user_id,
          title: 'Equipment Return Inspection Report',
          message: `Inspection recorded damage on booking #${rental.rental_number}: ${data.damageDescription || 'Minor wear/damage'}. Fee assessment: ₹${data.damageFee}.`,
          type: 'DAMAGE_ALERT',
          link_url: `/rentals/${rental.id}`,
        });
      }
    }

    return inspection;
  }

  static async getInspectionByRental(rentalId: string) {
    return await InspectionModel.findByRentalId(rentalId);
  }
}
