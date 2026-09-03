import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/server';
import { KpiCard } from '@/components/admin/KpiCard';
import { AdminCharts } from '@/components/admin/AdminCharts';
import { formatCurrency } from '@/lib/utils';
import { Camera, CheckCircle2, Film, DollarSign, Clock, ShieldAlert } from 'lucide-react';

export const revalidate = 0;

export default async function AdminDashboardPage() {
  let totalEquipmentCount = 0;
  let totalInventoryUnits = 0;
  let activeRentalsCount = 0;
  let pendingReturnsCount = 0;
  let totalGrossRevenue = 0;
  let depositsHeld = 0;

  try {
    const [eqRes, invRes, ordersRes] = await Promise.all([
      supabaseAdmin.from('equipment').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('equipment_inventory').select('*', { count: 'exact', head: true }),
      supabaseAdmin.from('rental_orders').select('status, total, security_deposit'),
    ]);

    if (eqRes.count) totalEquipmentCount = eqRes.count;
    if (invRes.count) totalInventoryUnits = invRes.count;

    if (ordersRes.data) {
      const orders = ordersRes.data;
      activeRentalsCount = orders.filter((o: any) => o.status === 'ACTIVE' || o.status === 'CONFIRMED').length;
      pendingReturnsCount = orders.filter((o: any) => o.status === 'RETURN_PENDING').length;
      totalGrossRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0);
      depositsHeld = orders
        .filter((o: any) => o.status !== 'RETURNED' && o.status !== 'CANCELLED')
        .reduce((sum: number, o: any) => sum + (Number(o.security_deposit) || 0), 0);
    }
  } catch (e) {
    console.warn('DB query error on admin dashboard:', e);
  }



  return (
    <div className="space-y-8">
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Total Gear Models"
          value={totalEquipmentCount}
          change="+6 new"
          icon={Camera}
        />
        <KpiCard
          title="Inventory Units"
          value={totalInventoryUnits}
          change="Available"
          icon={CheckCircle2}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10 border-emerald-500/20"
        />
        <KpiCard
          title="Active On Set"
          value={activeRentalsCount}
          change="Shooting now"
          icon={Film}
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10 border-blue-500/20"
        />
        <KpiCard
          title="Total Revenue"
          value={formatCurrency(totalGrossRevenue)}
          change="+18.4%"
          icon={DollarSign}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />
        <KpiCard
          title="Pending Returns"
          value={pendingReturnsCount}
          change="Action required"
          icon={Clock}
          iconColor="text-yellow-400"
          iconBg="bg-yellow-500/10 border-yellow-500/20"
        />
        <KpiCard
          title="Deposits in Escrow"
          value={formatCurrency(depositsHeld)}
          change="Held safely"
          icon={ShieldAlert}
          iconColor="text-teal-400"
          iconBg="bg-teal-500/10 border-teal-500/20"
        />
      </div>

      {/* Analytics Charts & Most Rented List */}
      <AdminCharts />
    </div>
  );
}
