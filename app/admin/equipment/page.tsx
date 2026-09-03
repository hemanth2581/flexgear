import React from 'react';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, Plus, Edit2, Wrench, ShieldCheck, CheckCircle2 } from 'lucide-react';


export const revalidate = 0;

export default async function AdminEquipmentPage() {
  let equipmentList: any[] = [];

  try {
    const { data, error } = await supabaseAdmin
      .from('equipment')
      .select(`
        *,
        category:categories(*),
        brand:brands(*),
        equipment_inventory (
          id,
          serial_number,
          status
        )
      `)
      .order('created_at', { ascending: false });

    if (data) equipmentList = data;
  } catch (e) {
    console.warn('DB equipment fetch error:', e);
  }


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Camera className="h-5 w-5 text-amber-400" />
            <span>Equipment & Inventory Management</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Audit serial numbers, daily pricing, security deposits, and calibration statuses.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" className="font-bold text-xs">
            <Plus className="h-4 w-4 mr-1" />
            <span>Add New Equipment Model</span>
          </Button>
        </div>
      </div>

      {/* Equipment Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gear Item</TableHead>
            <TableHead>Category & Brand</TableHead>
            <TableHead>Daily Rate</TableHead>
            <TableHead>Weekly Package</TableHead>
            <TableHead>Security Deposit</TableHead>
            <TableHead>Units & Serials</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipmentList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12 text-zinc-500 text-xs">
                No equipment units in inventory. Run seed migration to populate with 45+ cinema models.
              </TableCell>
            </TableRow>
          ) : (
            equipmentList.map((gear) => {
              const inventoryUnits = gear.equipment_inventory || [];
              const availableCount = inventoryUnits.filter((u: any) => u.status === 'AVAILABLE').length;

              return (
                <TableRow key={gear.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative h-10 w-12 shrink-0 overflow-hidden rounded-lg bg-zinc-950 border border-zinc-800">
                        <Image
                          src={gear.image_url || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200'}
                          alt={gear.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-white text-xs">{gear.name}</div>
                        <div className="text-[10px] text-zinc-400">Rating: {gear.rating} ★ ({gear.review_count})</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-semibold text-zinc-200">{gear.category?.name}</div>
                    <div className="text-[10px] text-amber-400">{gear.brand?.name}</div>
                  </TableCell>

                  <TableCell className="font-bold text-white text-xs">
                    {formatCurrency(gear.daily_price)}
                  </TableCell>

                  <TableCell className="text-xs text-zinc-300">
                    {gear.weekly_price ? formatCurrency(gear.weekly_price) : 'N/A'}
                  </TableCell>

                  <TableCell className="text-xs text-zinc-300 font-semibold">
                    {formatCurrency(gear.security_deposit)}
                  </TableCell>

                  <TableCell>
                    <div className="text-xs text-zinc-200">
                      <strong className="text-emerald-400">{availableCount}</strong> / {inventoryUnits.length} Available
                    </div>
                    <div className="text-[10px] text-zinc-500 font-mono">
                      {inventoryUnits.slice(0, 2).map((u: any) => u.serial_number).join(', ')}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge variant={gear.is_active ? 'success' : 'secondary'} className="text-[10px] py-0">
                      {gear.is_active ? 'Active in Store' : 'Archived'}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" className="h-7 text-xs border-zinc-700 hover:bg-zinc-800">
                      <Edit2 className="h-3 w-3 mr-1 text-amber-400" />
                      <span>Edit</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
