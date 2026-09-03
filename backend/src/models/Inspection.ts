// backend/src/models/Inspection.ts
import { query, isDatabaseConnected } from '../config/database';

export interface InspectionEntity {
  id: string;
  rental_id: string;
  inspector_id?: string | null;
  has_damage: boolean;
  damage_description?: string | null;
  damage_fee: number;
  condition_notes?: string | null;
  photo_urls: string[];
  is_completed: boolean;
  completed_at?: string | null;
  created_at: string;
}

export const mockInspections: InspectionEntity[] = [];

export class InspectionModel {
  static async findByRentalId(rentalId: string): Promise<InspectionEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<InspectionEntity>('SELECT * FROM inspections WHERE rental_id = $1', [rentalId]);
      return res.rows[0] || null;
    }
    return mockInspections.find((i) => i.rental_id === rentalId) || null;
  }

  static async create(data: Partial<InspectionEntity>): Promise<InspectionEntity> {
    if (isDatabaseConnected()) {
      const res = await query<InspectionEntity>(
        `INSERT INTO inspections (
           rental_id, inspector_id, has_damage, damage_description, damage_fee,
           condition_notes, photo_urls, is_completed, completed_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
         RETURNING *`,
        [
          data.rental_id,
          data.inspector_id || null,
          !!data.has_damage,
          data.damage_description || null,
          data.damage_fee || 0,
          data.condition_notes || 'Inspected by FlexGear Technician',
          JSON.stringify(data.photo_urls || []),
          true,
        ]
      );
      return res.rows[0];
    }

    const inspection: InspectionEntity = {
      id: `insp-${Date.now()}`,
      rental_id: data.rental_id!,
      inspector_id: data.inspector_id || null,
      has_damage: !!data.has_damage,
      damage_description: data.damage_description || null,
      damage_fee: data.damage_fee || 0,
      condition_notes: data.condition_notes || 'Inspected by FlexGear Technician',
      photo_urls: data.photo_urls || [],
      is_completed: true,
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };
    mockInspections.unshift(inspection);
    return inspection;
  }

  static async getAll(): Promise<InspectionEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<InspectionEntity>('SELECT * FROM inspections ORDER BY created_at DESC');
      return res.rows;
    }
    return mockInspections;
  }
}
