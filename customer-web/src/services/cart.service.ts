// frontend/src/services/cart.service.ts
import { Equipment } from '../types/equipment';

export interface CartItem {
  equipment: Equipment;
  quantity: number;
}

export class CartService {
  private static STORAGE_KEY = 'flexgear_cart';

  static getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  static saveCart(items: CartItem[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }
}
