// backend/src/models/Inventory.ts
import { query, isDatabaseConnected } from '../config/database';

export interface InventoryEntity {
  id: string;
  equipment_id: string;
  serial_number: string;
  barcode?: string | null;
  status: 'AVAILABLE' | 'BOOKED' | 'RENTED' | 'MAINTENANCE' | 'DAMAGED' | 'RETIRED';
  condition: 'BRAND_NEW' | 'EXCELLENT' | 'GOOD' | 'FAIR' | 'NEEDS_REPAIR';
  warehouse_location: string;
  notes?: string | null;
}

export const mockInventory: InventoryEntity[] = [
  // FX3 Units
  { id: 'inv-fx3-01', equipment_id: '30000000-0000-0000-0000-000000000001', serial_number: 'FX3-SN-8829101', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Hub Alpha - Rack A1' },
  { id: 'inv-fx3-02', equipment_id: '30000000-0000-0000-0000-000000000001', serial_number: 'FX3-SN-8829102', status: 'AVAILABLE', condition: 'BRAND_NEW', warehouse_location: 'Hub Alpha - Rack A1' },
  { id: 'inv-fx3-03', equipment_id: '30000000-0000-0000-0000-000000000001', serial_number: 'FX3-SN-8829103', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Hub Alpha - Rack A1' },
  
  // A7IV Units
  { id: 'inv-a74-01', equipment_id: '30000000-0000-0000-0000-000000000002', serial_number: 'A74-SN-5521901', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Hub Alpha - Rack A2' },
  { id: 'inv-a74-02', equipment_id: '30000000-0000-0000-0000-000000000002', serial_number: 'A74-SN-5521902', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Hub Alpha - Rack A2' },
  
  // Canon R5 Units
  { id: 'inv-cr5-01', equipment_id: '30000000-0000-0000-0000-000000000003', serial_number: 'CR5-SN-3391001', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Hub Alpha - Rack B1' },
  { id: 'inv-cr5-02', equipment_id: '30000000-0000-0000-0000-000000000003', serial_number: 'CR5-SN-3391002', status: 'AVAILABLE', condition: 'BRAND_NEW', warehouse_location: 'Hub Alpha - Rack B1' },
  
  // Canon C70 Units
  { id: 'inv-c70-01', equipment_id: '30000000-0000-0000-0000-000000000004', serial_number: 'C70-SN-4481011', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Hub Alpha - Vault 1' },
  
  // RED KOMODO Units
  { id: 'inv-kmd-01', equipment_id: '30000000-0000-0000-0000-000000000005', serial_number: 'RED-KMD-771901', status: 'AVAILABLE', condition: 'BRAND_NEW', warehouse_location: 'Hub Alpha - Vault 2' },
  { id: 'inv-kmd-02', equipment_id: '30000000-0000-0000-0000-000000000005', serial_number: 'RED-KMD-771902', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Hub Alpha - Vault 2' },
  
  // BMPCC 6K Pro Units
  { id: 'inv-bmp-01', equipment_id: '30000000-0000-0000-0000-000000000006', serial_number: 'BMP-6KP-229101', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Hub Alpha - Rack B2' },
  
  // Sony 24-70 GM II Lenses
  { id: 'inv-lns-01', equipment_id: '30000000-0000-0000-0000-000000000007', serial_number: 'LNS-S2470-101', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Lens Safe 1' },
  { id: 'inv-lns-02', equipment_id: '30000000-0000-0000-0000-000000000007', serial_number: 'LNS-S2470-102', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Lens Safe 1' },
  { id: 'inv-lns-03', equipment_id: '30000000-0000-0000-0000-000000000007', serial_number: 'LNS-S2470-103', status: 'AVAILABLE', condition: 'BRAND_NEW', warehouse_location: 'Lens Safe 1' },

  // Canon RF 50mm f1.2 Lenses
  { id: 'inv-lns-04', equipment_id: '30000000-0000-0000-0000-000000000008', serial_number: 'LNS-CRF50-201', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Lens Safe 2' },
  { id: 'inv-lns-05', equipment_id: '30000000-0000-0000-0000-000000000008', serial_number: 'LNS-CRF50-202', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Lens Safe 2' },

  // Sigma Cine Prime Set
  { id: 'inv-sig-01', equipment_id: '30000000-0000-0000-0000-000000000009', serial_number: 'SIG-CINE-3K-01', status: 'AVAILABLE', condition: 'BRAND_NEW', warehouse_location: 'Lens Safe Vault' },

  // Lighting Units
  { id: 'inv-lgt-01', equipment_id: '30000000-0000-0000-0000-000000000010', serial_number: 'LGT-AP600-001', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Lighting Bay L1' },
  { id: 'inv-lgt-02', equipment_id: '30000000-0000-0000-0000-000000000010', serial_number: 'LGT-AP600-002', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Lighting Bay L1' },
  { id: 'inv-lgt-03', equipment_id: '30000000-0000-0000-0000-000000000011', serial_number: 'LGT-NNPT3-001', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Lighting Bay L2' },

  // Audio Units
  { id: 'inv-aud-01', equipment_id: '30000000-0000-0000-0000-000000000012', serial_number: 'AUD-RDWP-0001', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Audio Locker 1' },
  { id: 'inv-aud-02', equipment_id: '30000000-0000-0000-0000-000000000012', serial_number: 'AUD-RDWP-0002', status: 'AVAILABLE', condition: 'BRAND_NEW', warehouse_location: 'Audio Locker 1' },
  { id: 'inv-aud-03', equipment_id: '30000000-0000-0000-0000-000000000013', serial_number: 'AUD-SN416-001', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Audio Locker 2' },

  // Gimbals & Drones
  { id: 'inv-gmb-01', equipment_id: '30000000-0000-0000-0000-000000000014', serial_number: 'GMB-RS3P-0001', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Gimbal Bay G1' },
  { id: 'inv-gmb-02', equipment_id: '30000000-0000-0000-0000-000000000014', serial_number: 'GMB-RS3P-0002', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Gimbal Bay G1' },
  { id: 'inv-drn-01', equipment_id: '30000000-0000-0000-0000-000000000015', serial_number: 'DRN-M3PC-0001', status: 'AVAILABLE', condition: 'BRAND_NEW', warehouse_location: 'Flight Bay D1' },

  // Production Kits
  { id: 'inv-kit-01', equipment_id: '30000000-0000-0000-0000-000000000016', serial_number: 'KIT-INDIE-0001', status: 'AVAILABLE', condition: 'EXCELLENT', warehouse_location: 'Master Kit Bay' },
];

export class InventoryModel {
  static async getByEquipmentId(equipmentId: string): Promise<InventoryEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<InventoryEntity>('SELECT * FROM inventory WHERE equipment_id = $1', [equipmentId]);
      return res.rows;
    }
    return mockInventory.filter((i) => i.equipment_id === equipmentId);
  }

  static async getAvailableCount(equipmentId: string): Promise<number> {
    if (isDatabaseConnected()) {
      const res = await query<{ count: string }>('SELECT COUNT(*) as count FROM inventory WHERE equipment_id = $1 AND status = \'AVAILABLE\'', [equipmentId]);
      return parseInt(res.rows[0]?.count || '0', 10);
    }
    return mockInventory.filter((i) => i.equipment_id === equipmentId && i.status === 'AVAILABLE').length;
  }

  static async getAll(): Promise<InventoryEntity[]> {
    if (isDatabaseConnected()) {
      const res = await query<InventoryEntity>(
        `SELECT i.*, json_build_object('id', e.id, 'name', e.name, 'brand', e.brand) as equipment
         FROM inventory i
         LEFT JOIN equipment e ON i.equipment_id = e.id
         ORDER BY i.serial_number ASC`
      );
      return res.rows;
    }
    return mockInventory;
  }

  static async create(data: Partial<InventoryEntity>): Promise<InventoryEntity> {
    if (isDatabaseConnected()) {
      const res = await query<InventoryEntity>(
        `INSERT INTO inventory (equipment_id, serial_number, barcode, status, condition, warehouse_location, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          data.equipment_id,
          data.serial_number,
          data.barcode || null,
          data.status || 'AVAILABLE',
          data.condition || 'EXCELLENT',
          data.warehouse_location || 'Vault Hub A',
          data.notes || null,
        ]
      );
      return res.rows[0];
    }
    const newUnit: InventoryEntity = {
      id: `inv-custom-${Date.now()}`,
      equipment_id: data.equipment_id || '30000000-0000-0000-0000-000000000001',
      serial_number: data.serial_number || `SN-CUSTOM-${Date.now()}`,
      barcode: data.barcode || null,
      status: (data.status as any) || 'AVAILABLE',
      condition: (data.condition as any) || 'EXCELLENT',
      warehouse_location: data.warehouse_location || 'Vault Hub A',
      notes: data.notes || null,
    };
    mockInventory.unshift(newUnit);
    return newUnit;
  }

  static async updateStatus(id: string, status: InventoryEntity['status']): Promise<InventoryEntity | null> {
    if (isDatabaseConnected()) {
      const res = await query<InventoryEntity>('UPDATE inventory SET status = $1 WHERE id = $2 RETURNING *', [status, id]);
      return res.rows[0] || null;
    }
    const item = mockInventory.find((i) => i.id === id || i.serial_number === id);
    if (item) {
      item.status = status;
    }
    return item || null;
  }
}
