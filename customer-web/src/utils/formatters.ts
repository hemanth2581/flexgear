// frontend/src/utils/formatters.ts
import { RentalStatus, DepositStatus } from '../types/rental';

export const getRentalStatusBadge = (status: RentalStatus) => {
  switch (status) {
    case 'CONFIRMED':
      return { label: 'Confirmed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    case 'ACTIVE':
    case 'PICKED_UP':
      return { label: 'Active Shoot', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    case 'READY_FOR_PICKUP':
      return { label: 'Ready for Pickup', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
    case 'RETURN_PENDING':
    case 'UNDER_INSPECTION':
      return { label: 'Under Inspection', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    case 'COMPLETED':
      return { label: 'Completed', color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30' };
    case 'OVERDUE':
      return { label: 'Overdue', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/30' };
    case 'PENDING_PAYMENT':
    default:
      return { label: 'Pending Payment', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' };
  }
};

export const getDepositStatusBadge = (status: DepositStatus) => {
  switch (status) {
    case 'FULL_REFUND':
    case 'REFUNDED':
      return { label: '100% Refunded', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    case 'PARTIAL_REFUND':
      return { label: 'Partial Refund (Deduction)', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    case 'DEDUCTION':
      return { label: 'Full Damage Deduction', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
    case 'INSPECTION_PENDING':
      return { label: 'Inspection In Progress', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    case 'HELD':
    default:
      return { label: 'Escrow Held Securely', color: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/30' };
  }
};
