// backend/src/models/Review.ts
export interface ReviewEntity {
  id: string;
  user_id: string;
  equipment_id: string;
  rating: number;
  title?: string | null;
  comment: string;
  created_at: string;
  user_name?: string;
}

export const mockReviews: ReviewEntity[] = [
  {
    id: 'rev-01',
    user_id: '00000000-0000-0000-0000-000000000001',
    equipment_id: '30000000-0000-0000-0000-000000000001',
    rating: 5,
    title: 'Flawless camera package!',
    comment: 'Sensor was pristine, batteries lasted all day, and pickup was seamless.',
    user_name: 'Arjun Menon',
    created_at: new Date().toISOString(),
  },
];

export class ReviewModel {
  static async getByEquipmentId(equipmentId: string): Promise<ReviewEntity[]> {
    return mockReviews.filter((r) => r.equipment_id === equipmentId);
  }

  static async create(data: Partial<ReviewEntity>): Promise<ReviewEntity> {
    const rev: ReviewEntity = {
      id: `rev-${Date.now()}`,
      user_id: data.user_id!,
      equipment_id: data.equipment_id!,
      rating: data.rating || 5,
      title: data.title || null,
      comment: data.comment || '',
      user_name: data.user_name || 'Verified Filmmaker',
      created_at: new Date().toISOString(),
    };
    mockReviews.unshift(rev);
    return rev;
  }
}
