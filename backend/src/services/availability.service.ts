// backend/src/services/availability.service.ts
import { InventoryModel } from '../models/Inventory';
import { RentalModel } from '../models/Rental';

export class AvailabilityService {
  static async checkAvailability(
    equipmentId: string,
    startDateStr: string,
    endDateStr: string,
    requestedQuantity = 1
  ): Promise<{ available: boolean; totalUnits: number; bookedUnits: number; availableUnits: number }> {
    const totalUnits = await InventoryModel.getAvailableCount(equipmentId);
    
    // Check all active or confirmed rentals overlapping the requested window
    const rentals = await RentalModel.getAll(200);
    const startReq = new Date(startDateStr).getTime();
    const endReq = new Date(endDateStr).getTime();

    let bookedUnits = 0;
    for (const r of rentals) {
      if ([
        'PENDING_PAYMENT',
        'CONFIRMED',
        'READY_FOR_PICKUP',
        'PICKED_UP',
        'ACTIVE',
        'RETURN_DUE',
        'RETURN_PENDING',
        'UNDER_INSPECTION',
        'OVERDUE',
      ].includes(r.status)) {
        const rStart = new Date(r.start_date).getTime();
        const rEnd = new Date(r.end_date).getTime();

        // Check if overlaps: max(startReq, rStart) <= min(endReq, rEnd)
        if (Math.max(startReq, rStart) <= Math.min(endReq, rEnd)) {
          const item = r.items?.find((it: any) => it.equipment_id === equipmentId);
          if (item) {
            bookedUnits += item.quantity || 1;
          }
        }
      }
    }

    const availableUnits = Math.max(0, totalUnits - bookedUnits);
    const available = availableUnits >= requestedQuantity;

    return {
      available,
      totalUnits,
      bookedUnits,
      availableUnits,
    };
  }
}
