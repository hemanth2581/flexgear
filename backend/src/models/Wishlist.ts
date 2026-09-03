// backend/src/models/Wishlist.ts
import { mockEquipment, EquipmentEntity } from './Equipment';

export interface WishlistEntity {
  id: string;
  user_id: string;
  equipment_id: string;
  created_at: string;
  equipment?: EquipmentEntity;
}

export const mockWishlist: WishlistEntity[] = [
  {
    id: 'wish-01',
    user_id: '00000000-0000-0000-0000-000000000001',
    equipment_id: '30000000-0000-0000-0000-000000000005', // RED Komodo
    created_at: new Date().toISOString(),
  },
];

export class WishlistModel {
  static async getByUserId(userId: string): Promise<WishlistEntity[]> {
    const list = mockWishlist.filter((w) => w.user_id === userId);
    return list.map((item) => ({
      ...item,
      equipment: mockEquipment.find((e) => e.id === item.equipment_id),
    }));
  }

  static async add(userId: string, equipmentId: string): Promise<WishlistEntity> {
    const existing = mockWishlist.find((w) => w.user_id === userId && w.equipment_id === equipmentId);
    if (existing) return existing;

    const item: WishlistEntity = {
      id: `wish-${Date.now()}`,
      user_id: userId,
      equipment_id: equipmentId,
      created_at: new Date().toISOString(),
    };
    mockWishlist.unshift(item);
    return item;
  }

  static async remove(userId: string, equipmentId: string): Promise<void> {
    const idx = mockWishlist.findIndex((w) => w.user_id === userId && w.equipment_id === equipmentId);
    if (idx !== -1) mockWishlist.splice(idx, 1);
  }
}
