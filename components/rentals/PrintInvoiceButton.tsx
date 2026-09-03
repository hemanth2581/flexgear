'use client';

import React from 'react';
import { Printer } from 'lucide-react';

interface PrintInvoiceButtonProps {
  invoiceHtml?: string;
  orderId?: string;
  rentalId?: string;
}

export function PrintInvoiceButton({ invoiceHtml, orderId, rentalId }: PrintInvoiceButtonProps) {
  const handlePrint = () => {
    try {
      const win = window.open('', '_blank');
      if (!win) {
        alert('Please allow popups in your browser to print the GST Invoice.');
        return;
      }

      if (invoiceHtml) {
        win.document.write(invoiceHtml);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 250);
      } else {
        const id = rentalId || orderId || 'FG-RNT-20260831-01';
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Tax Invoice - ${id}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; color: #111; }
              .header { border-bottom: 2px solid #E50914; padding-bottom: 20px; display: flex; justify-content: space-between; }
              .logo { font-size: 24px; font-weight: bold; color: #E50914; }
              .title { font-size: 20px; font-weight: bold; }
              .info { margin: 20px 0; font-size: 13px; line-height: 1.6; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; }
              th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 13px; }
              th { background: #fdf2f2; }
              .totals { float: right; width: 300px; margin-top: 20px; font-size: 14px; }
              .total-row { display: flex; justify-content: space-between; padding: 4px 0; }
              .grand { font-weight: bold; font-size: 16px; border-top: 2px solid #E50914; padding-top: 8px; color: #E50914; }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <div class="logo">FLEXGEAR CINEMA RENTALS</div>
                <div style="font-size: 12px; color: #666;">GSTIN: 33AAACF4928P1Z8 • contact@flexgear.rentals</div>
              </div>
              <div style="text-align: right;">
                <div class="title">TAX INVOICE</div>
                <div style="font-size: 12px; color: #666;">Invoice No: ${id}</div>
                <div style="font-size: 12px; color: #666;">Date: ${new Date().toLocaleDateString()}</div>
              </div>
            </div>
            <div class="info">
              <strong>Billed To:</strong> Verified Production Client<br>
              <strong>Rental Hub:</strong> South India Region • 24/7 Dispatch Desk
            </div>
            <table>
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th>Rental Rate</th>
                  <th>Duration</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Professional Cinema Equipment Rental Package</td>
                  <td>Daily Calculated Rate</td>
                  <td>Active Shoot Period</td>
                  <td>Paid in Full (Captured)</td>
                </tr>
              </tbody>
            </table>
            <div style="margin-top: 40px; font-size: 11px; color: #777; clear: both;">
              This is a computer-generated tax invoice issued by FlexGear Rentals.
            </div>
          </body>
          </html>
        `);
        win.document.close();
        win.focus();
        setTimeout(() => win.print(), 250);
      }
    } catch (e) {
      console.error('Failed to open print window:', e);
    }
  };

  return (
    <button
      onClick={handlePrint}
      className="inline-flex items-center justify-center h-10 px-5 rounded-2xl font-bold text-xs bg-primary hover:bg-primary-hover text-white transition-all shadow-sm active:scale-95 cursor-pointer"
    >
      <Printer className="h-4 w-4 mr-2" />
      <span>Print GST Invoice</span>
    </button>
  );
}
