// backend/src/utils/booking.ts
export const generateRentalNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `FG-RNT-${year}${month}${day}-${randomStr}`;
};

export const generateInvoiceNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const randomStr = Math.floor(1000 + Math.random() * 9000);
  return `FG-INV-${year}${month}-${randomStr}`;
};
