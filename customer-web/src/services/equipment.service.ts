// frontend/src/services/equipment.service.ts
import { apiClient } from '../lib/api';
import { Equipment, Category } from '../types/equipment';

export class EquipmentService {
  static async getAll(params?: {
    category?: string;
    brand?: string;
    search?: string;
    featured?: boolean;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<Equipment[]> {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.brand) query.append('brand', params.brand);
    if (params?.search) query.append('search', params.search);
    if (params?.featured) query.append('featured', 'true');
    if (params?.minPrice) query.append('minPrice', String(params.minPrice));
    if (params?.maxPrice) query.append('maxPrice', String(params.maxPrice));
    if (params?.limit) query.append('limit', String(params.limit));

    const endpoint = `/equipment?${query.toString()}`;
    return await apiClient<Equipment[]>(endpoint);
  }

  static async getAllEquipment(): Promise<Equipment[]> {
    return this.getAll();
  }

  static async getCategories(): Promise<Category[]> {
    return await apiClient<Category[]>('/categories');
  }

  static async getById(slugOrId: string): Promise<Equipment> {
    return await apiClient<Equipment>(`/equipment/${slugOrId}`);
  }
}
