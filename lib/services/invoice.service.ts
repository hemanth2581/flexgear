import { RentalOrder } from '@/types/rental';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export class InvoiceService {
  /**
   * Generates a clean, print-ready, professional HTML invoice document
   */
  static generateInvoiceHtml(order: RentalOrder): string {
    const invoiceNumber = `INV-${order.rental_id.replace('FG-RNT-', '')}`;
    const formattedDate = format(parseISO(order.created_at || new Date().toISOString()), 'dd MMMM yyyy');
    const startFormatted = format(parseISO(order.start_date), 'dd MMM yyyy');
    const endFormatted = format(parseISO(order.end_date), 'dd MMM yyyy');

    const itemsHtml = (order.rental_items || [])
      .map((item, index) => {
        const gearName = item.equipment?.name || 'Production Equipment';
        const brand = item.equipment?.brand?.name || '';
        return `
          <tr style="border-bottom: 1px solid #27272a;">
            <td style="padding: 12px 8px; color: #a1a1aa; font-size: 13px;">${index + 1}</td>
            <td style="padding: 12px 8px;">
              <div style="font-weight: 600; color: #ffffff; font-size: 14px;">${gearName}</div>
              <div style="font-size: 12px; color: #f59e0b;">${brand}</div>
            </td>
            <td style="padding: 12px 8px; text-align: center; color: #e4e4e7; font-size: 14px;">${item.quantity}</td>
            <td style="padding: 12px 8px; text-align: center; color: #e4e4e7; font-size: 14px;">${order.total_days} Days</td>
            <td style="padding: 12px 8px; text-align: right; color: #e4e4e7; font-size: 14px;">${formatCurrency(item.daily_price)}</td>
            <td style="padding: 12px 8px; text-align: right; font-weight: 600; color: #ffffff; font-size: 14px;">${formatCurrency(item.subtotal)}</td>
          </tr>
        `;
      })
      .join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice - ${order.rental_id}</title>
  <style>
    @media print {
      body { background: #ffffff !important; color: #000000 !important; }
      .no-print { display: none !important; }
      .invoice-box { border: none !important; box-shadow: none !important; }
      th { background-color: #f4f4f5 !important; color: #000000 !important; }
      td { color: #000000 !important; border-bottom: 1px solid #e4e4e7 !important; }
      .brand-highlight { color: #d97706 !important; }
      .badge-captured { background: #dcfce7 !important; color: #166534 !important; border: 1px solid #86efac !important; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #09090b;
      color: #fafafa;
      margin: 0;
      padding: 30px 15px;
    }
    .invoice-box {
      max-width: 850px;
      margin: auto;
      padding: 36px;
      border: 1px solid #27272a;
      border-radius: 12px;
      background-color: #121215;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }
    .btn-print {
      background: #f59e0b;
      color: #000000;
      border: none;
      padding: 10px 22px;
      font-weight: 600;
      font-size: 14px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div style="text-align: center; margin-bottom: 24px;" class="no-print">
    <button class="btn-print" onclick="window.print()">
      🖨️ Print or Save as PDF
    </button>
  </div>

  <div class="invoice-box">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #27272a; padding-bottom: 24px; margin-bottom: 24px;">
      <div>
        <div style="font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
          FLEX <span style="color: #f59e0b;" class="brand-highlight">GEAR</span>
        </div>
        <div style="color: #71717a; font-size: 13px; margin-top: 4px;">Camera & Shooting Equipment Rental Platform</div>
        <div style="color: #a1a1aa; font-size: 12px; margin-top: 2px;">GSTIN: 29AAAFG0000A1Z5</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 20px; font-weight: 700; color: #f59e0b;">TAX INVOICE</div>
        <div style="color: #e4e4e7; font-size: 13px; font-weight: 600; margin-top: 4px;">${invoiceNumber}</div>
        <div style="color: #a1a1aa; font-size: 13px; margin-top: 2px;">Rental ID: <strong style="color: #ffffff;">${order.rental_id}</strong></div>
        <div style="color: #71717a; font-size: 12px; margin-top: 2px;">Date: ${formattedDate}</div>
      </div>
    </div>

    <!-- Customer & Delivery Meta -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px;">
      <div style="background: #18181b; padding: 18px; border-radius: 8px; border: 1px solid #27272a;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #f59e0b; font-weight: 700; margin-bottom: 8px;">BILLED TO (CUSTOMER)</div>
        <div style="font-weight: 600; font-size: 15px; color: #ffffff;">${order.address?.fullName || 'Valued Customer'}</div>
        <div style="color: #a1a1aa; font-size: 13px; margin-top: 4px;">Phone: +91 ${order.address?.phone || 'N/A'}</div>
        <div style="color: #a1a1aa; font-size: 13px;">Email: ${order.address?.email || 'N/A'}</div>
        <div style="color: #a1a1aa; font-size: 13px; margin-top: 4px;">${order.address?.line1 || ''}, ${order.address?.city || ''}, ${order.address?.state || ''} - ${order.address?.pincode || ''}</div>
      </div>
      <div style="background: #18181b; padding: 18px; border-radius: 8px; border: 1px solid #27272a;">
        <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #f59e0b; font-weight: 700; margin-bottom: 8px;">RENTAL DETAILS</div>
        <div style="color: #e4e4e7; font-size: 13px; margin-bottom: 4px;">Duration: <strong>${startFormatted}</strong> to <strong>${endFormatted}</strong></div>
        <div style="color: #e4e4e7; font-size: 13px; margin-bottom: 4px;">Total Rental Days: <strong>${order.total_days} Days</strong></div>
        <div style="color: #e4e4e7; font-size: 13px; margin-bottom: 4px;">Fulfillment: <strong>${order.delivery_mode === 'DELIVERY' ? 'Doorstep Delivery' : 'Studio Pickup'}</strong></div>
        <div style="margin-top: 6px;">
          Payment Status: <span style="background: rgba(16, 185, 129, 0.2); color: #34d399; font-size: 12px; font-weight: 600; padding: 3px 8px; border-radius: 4px; border: 1px solid rgba(16, 185, 129, 0.4);" class="badge-captured">${order.payment_status}</span>
        </div>
      </div>
    </div>

    <!-- Table -->
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <thead>
        <tr style="background: #18181b; border-bottom: 2px solid #3f3f46;">
          <th style="padding: 12px 8px; text-align: left; color: #a1a1aa; font-size: 12px; text-transform: uppercase;">#</th>
          <th style="padding: 12px 8px; text-align: left; color: #a1a1aa; font-size: 12px; text-transform: uppercase;">Equipment Description</th>
          <th style="padding: 12px 8px; text-align: center; color: #a1a1aa; font-size: 12px; text-transform: uppercase;">Qty</th>
          <th style="padding: 12px 8px; text-align: center; color: #a1a1aa; font-size: 12px; text-transform: uppercase;">Duration</th>
          <th style="padding: 12px 8px; text-align: right; color: #a1a1aa; font-size: 12px; text-transform: uppercase;">Daily Rate</th>
          <th style="padding: 12px 8px; text-align: right; color: #a1a1aa; font-size: 12px; text-transform: uppercase;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Totals Breakdown -->
    <div style="display: flex; justify-content: flex-end; margin-bottom: 28px;">
      <div style="width: 320px; background: #18181b; padding: 18px; border-radius: 8px; border: 1px solid #27272a;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #a1a1aa; margin-bottom: 8px;">
          <span>Subtotal:</span>
          <span style="color: #ffffff;">${formatCurrency(order.subtotal)}</span>
        </div>
        ${
          order.discount > 0
            ? `<div style="display: flex; justify-content: space-between; font-size: 13px; color: #34d399; margin-bottom: 8px;">
                <span>Volume Discount (10%):</span>
                <span>-${formatCurrency(order.discount)}</span>
              </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #a1a1aa; margin-bottom: 8px;">
          <span>Fulfillment Fee:</span>
          <span style="color: #ffffff;">${formatCurrency(order.delivery_fee)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #a1a1aa; margin-bottom: 8px;">
          <span>GST (18%):</span>
          <span style="color: #ffffff;">${formatCurrency(order.tax)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #f59e0b; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px dashed #3f3f46;">
          <span>Security Deposit (Refundable):</span>
          <span>${formatCurrency(order.security_deposit)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #ffffff;">
          <span>Grand Total Paid:</span>
          <span style="color: #f59e0b;">${formatCurrency(order.total)}</span>
        </div>
      </div>
    </div>

    <!-- Terms & Footer -->
    <div style="border-top: 1px solid #27272a; padding-top: 18px; font-size: 11px; color: #71717a; line-height: 1.6;">
      <p style="margin: 0 0 4px 0;"><strong style="color: #a1a1aa;">Rental Terms:</strong> Equipment must be returned in the original condition with all accessories, cables, and cases. Late returns are charged at 1.5x standard daily rates.</p>
      <p style="margin: 0;"><strong style="color: #a1a1aa;">Security Deposit:</strong> Refund will be initiated to the original payment source within 24 hours of successful gear inspection post-return.</p>
    </div>
  </div>
</body>
</html>`;
  }
}
