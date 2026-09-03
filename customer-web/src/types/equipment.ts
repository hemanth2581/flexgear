// frontend/src/types/equipment.ts
export interface Category {
  id: string;
  slug: string;
  name: string;
  icon?: string | null;
  description?: string | null;
  display_order?: number;
}

export interface Equipment {
  id: string;
  category_id?: string;
  category_name?: string;
  brand: string;
  slug?: string;
  name: string;
  model?: string | null;
  description: string;
  daily_price: number;
  daily_rate?: number;
  weekly_price?: number | null;
  monthly_price?: number | null;
  security_deposit: number;
  replacement_value?: number;
  thumbnail_url: string;
  image_url?: string;
  rating?: number;
  review_count?: number;
  is_featured?: boolean;
  is_active?: boolean;
  specs?: Record<string, any>;
  included_accessories?: string[];
  category?: Category;
  available_units?: number;
  total_units?: number;
}
