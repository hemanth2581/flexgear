// backend/src/models/Invoice.ts
export interface InvoiceEntity {
  id: string;
  invoice_number: string;
  rental_id: string;
  user_id: string;
  gstin: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  total_tax: number;
  total_amount: number;
  is_paid: boolean;
  issued_at: string;
}

export const mockInvoices: InvoiceEntity[] = [
  {
    id: 'inv-001',
    invoice_number: 'FG-INV-202609-8812',
    rental_id: 'rent-001',
    user_id: '00000000-0000-0000-0000-000000000001',
    gstin: '29AABCF1234F1Z8',
    subtotal: 16500,
    cgst: 1485,
    sgst: 1485,
    igst: 0,
    total_tax: 2970,
    total_amount: 35470,
    is_paid: true,
    issued_at: new Date().toISOString(),
  },
];

export class InvoiceModel {
  static async findByRentalId(rentalId: string): Promise<InvoiceEntity | null> {
    return mockInvoices.find((inv) => inv.rental_id === rentalId) || null;
  }

  static async getByUserId(userId: string): Promise<InvoiceEntity[]> {
    return mockInvoices.filter((inv) => inv.user_id === userId);
  }

  static async create(data: Partial<InvoiceEntity>): Promise<InvoiceEntity> {
    const inv: InvoiceEntity = {
      id: `inv-${Date.now()}`,
      invoice_number: data.invoice_number || `FG-INV-${Date.now()}`,
      rental_id: data.rental_id!,
      user_id: data.user_id!,
      gstin: data.gstin || '29AABCF1234F1Z8',
      subtotal: data.subtotal || 0,
      cgst: data.cgst || 0,
      sgst: data.sgst || 0,
      igst: data.igst || 0,
      total_tax: data.total_tax || 0,
      total_amount: data.total_amount || 0,
      is_paid: true,
      issued_at: new Date().toISOString(),
    };
    mockInvoices.unshift(inv);
    return inv;
  }
}
