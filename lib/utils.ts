import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { differenceInCalendarDays, parseISO, isBefore, startOfDay, addDays, format } from "date-fns";

export { RENTAL_STATUS_COLORS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateRentalDays(startDateStr: string, endDateStr: string): number {
  if (!startDateStr || !endDateStr) return 0;
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);
  
  const diff = differenceInCalendarDays(end, start);
  return Math.max(0, diff);
}

export function getDatesArray(startDateStr: string, endDateStr: string): string[] {
  const start = parseISO(startDateStr);
  const end = parseISO(endDateStr);
  const days = differenceInCalendarDays(end, start);
  
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const current = addDays(start, i);
    dates.push(format(current, 'yyyy-MM-dd'));
  }
  return dates;
}

export function isValidRentalDateRange(startDateStr: string, endDateStr: string, maxDays = 30): { valid: boolean; error?: string } {
  if (!startDateStr || !endDateStr) {
    return { valid: false, error: 'Start date and End date are required' };
  }

  const today = startOfDay(new Date());
  const start = startOfDay(parseISO(startDateStr));
  const end = startOfDay(parseISO(endDateStr));

  if (isBefore(start, today)) {
    return { valid: false, error: 'Start date cannot be in the past' };
  }

  if (!isBefore(start, end)) {
    return { valid: false, error: 'End date must be strictly after Start date' };
  }

  const days = differenceInCalendarDays(end, start);
  if (days > maxDays) {
    return { valid: false, error: `Maximum rental duration is ${maxDays} days` };
  }

  return { valid: true };
}

export function generateRandomAlphanumeric(length = 5): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
