// frontend/src/services/wishlist.service.ts
import { apiClient } from '../lib/api';

export class WishlistService {
  static async getWishlist() {
    return await apiClient('/wishlist');
  }

  static async add(equipmentId: string) {
    return await apiClient('/wishlist', {
      method: 'POST',
      body: JSON.stringify({ equipmentId }),
    });
  }

  static async remove(equipmentId: string) {
    return await apiClient(`/wishlist/${equipmentId}`, {
      method: 'DELETE',
    });
  }
}
