// backend/src/services/invoice.service.ts
import { InvoiceModel } from '../models/Invoice';
import { RentalModel } from '../models/Rental';
import { generateInvoiceNumber } from '../utils/booking';

export class InvoiceService {
  static async getInvoiceByRental(rentalId: string) {
    let invoice = await InvoiceModel.findByRentalId(rentalId);
    if (!invoice) {
      const rental = await RentalModel.findById(rentalId);
      if (rental) {
        invoice = await InvoiceModel.create({
          invoice_number: generateInvoiceNumber(),
          rental_id: rental.id,
          user_id: rental.user_id,
          gstin: '29AABCF1234F1Z8',
          subtotal: rental.subtotal - rental.discount + rental.delivery_fee,
          cgst: Math.round((rental.tax / 2) * 100) / 100,
          sgst: Math.round((rental.tax / 2) * 100) / 100,
          igst: 0,
          total_tax: rental.tax,
          total_amount: rental.total_amount,
        });
      }
    }
    return invoice;
  }
}
