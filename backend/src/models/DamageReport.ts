// backend/src/models/DamageReport.ts
import { query, isDatabaseConnected } from '../config/database';

export interface DamageReportEntity {
  id: string;
  rental_id: string;
  inventory_id: string;
  reported_by: string;
  description: string;
  estimated_cost: number;
  final_cost?: number | null;
  customer_charge?: number | null;
  evidence_images: string[];
  status: 'PENDING' | 'ASSESSED' | 'CHARGED' | 'WAIVED' | 'RESOLVED';
  created_at: string;
  updated_at: string;
}

export const mockDamageReports: DamageReportEntity[] = [
  {
    id: 'dmg_001',
    rental_id: '10000000-0000-0000-0000-000000000001',
    inventory_id: 'FX3-SN-8829101',
    reported_by: '00000000-0000-0000-0000-000000000002',
    description: 'Minor hairline scratch on top XLR handle mount. Functional integrity tested 100% OK.',
    estimated_cost: 1500,
    final_cost: 1500,
    customer_charge: 1500,
    evidence_images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400'],
    status: 'RESOLVED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export class DamageReportModel {
  static async getAll(): Promise<DamageReportEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<DamageReportEntity>('SELECT * FROM damage_reports ORDER BY created_at DESC');
      return res.rows;
    }
    return mockDamageReports;
  }

  static async findByRentalId(rentalId: string): Promise<DamageReportEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<DamageReportEntity>('SELECT * FROM damage_reports WHERE rental_id = $1', [rentalId]);
      return res.rows;
    }
    return mockDamageReports.filter((d) => d.rental_id === rentalId);
  }

  static async create(data: Partial<DamageReportEntity>): Promise<DamageReportEntity> {
    const newReport: DamageReportEntity = {
      id: data.id || `dmg_${Date.now()}`,
      rental_id: data.rental_id || '',
      inventory_id: data.inventory_id || '',
      reported_by: data.reported_by || 'admin',
      description: data.description || 'Hardware damage report',
      estimated_cost: data.estimated_cost || 0,
      final_cost: data.final_cost !== undefined ? data.final_cost : null,
      customer_charge: data.customer_charge !== undefined ? data.customer_charge : null,
      evidence_images: data.evidence_images || [],
      status: data.status || 'PENDING',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (isDatabaseConnected()) {
      const res = await query<DamageReportEntity>(
        `INSERT INTO damage_reports (rental_id, inventory_id, reported_by, description, estimated_cost, final_cost, customer_charge, evidence_images, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
        [
          newReport.rental_id,
          newReport.inventory_id,
          newReport.reported_by,
          newReport.description,
          newReport.estimated_cost,
          newReport.final_cost,
          newReport.customer_charge,
          JSON.stringify(newReport.evidence_images),
          newReport.status,
        ]
      );
      return res.rows[0];
    }
    mockDamageReports.unshift(newReport);
    return newReport;
  }
}
