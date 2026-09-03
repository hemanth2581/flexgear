export interface Category {
  id: string;
  parent_id?: string | null;
  slug: string;
  name: string;
  icon?: string | null;
  is_active: boolean;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
}

export interface EquipmentSpecs {
  sensor?: string;
  mount?: string;
  resolution?: string;
  fps?: string;
  iso?: string;
  weight?: string;
  battery_life?: string;
  dimensions?: string;
  power_output?: string;
  color_temp?: string;
  polar_pattern?: string;
  frequency_response?: string;
  payload_capacity?: string;
  max_flight_time?: string;
  range?: string;
  [key: string]: string | undefined;
}

export interface Equipment {
  id: string;
  category_id: string;
  brand_id: string;
  slug: string;
  name: string;
  description: string;
  image_url: string;
  daily_price: number;
  weekly_price?: number | null;
  security_deposit: number;
  rating: number;
  review_count: number;
  is_featured: boolean;
  is_active: boolean;
  specs: EquipmentSpecs;
  included_accessories: string[];
  created_at: string;
  category?: Category;
  brand?: Brand;
}

export type InventoryStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED';

export interface EquipmentInventory {
  id: string;
  equipment_id: string;
  serial_number: string;
  status: InventoryStatus;
}

export interface EquipmentFilterParams {
  category?: string;
  brand?: string[];
  maxPrice?: number;
  minRating?: number;
  search?: string;
  availableOnly?: boolean;
  startDate?: string;
  endDate?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface AvailabilityResult {
  equipmentId: string;
  available: boolean;
  availableUnits: number;
  requestedUnits: number;
  startDate: string;
  endDate: string;
  totalInventory: number;
  bookedUnits: number;
}
