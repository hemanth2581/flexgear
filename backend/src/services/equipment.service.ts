// backend/src/services/equipment.service.ts
import { EquipmentModel, EquipmentEntity } from '../models/Equipment';
import { InventoryModel } from '../models/Inventory';
import { CategoryModel } from '../models/Category';

export class EquipmentService {
  static async getCatalog(filters?: any) {
    return await EquipmentModel.getAll(filters);
  }

  static async getDetails(slugOrId: string) {
    let equip = await EquipmentModel.findById(slugOrId);
    if (!equip) {
      equip = await EquipmentModel.findBySlug(slugOrId);
    }
    if (!equip) return null;

    const inventory = await InventoryModel.getByEquipmentId(equip.id);
    const category = await CategoryModel.findById(equip.category_id);

    return {
      ...equip,
      category,
      available_units: inventory.filter((i) => i.status === 'AVAILABLE').length,
      total_units: inventory.length,
      inventory,
    };
  }
}
