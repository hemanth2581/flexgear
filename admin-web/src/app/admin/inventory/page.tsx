'use client';

import React, { useEffect, useState } from 'react';
import { Boxes, Plus, Search, Tag, CheckCircle2, AlertCircle, Wrench, ShieldX, MapPin, QrCode } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Loading } from '../../../components/ui/Loading';

export default function AdminInventoryPage() {
  const { token } = useAdminAuth();
  const [units, setUnits] = useState<any[]>([]);
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any | null>(null);

  // New Serial Unit Form
  const [form, setForm] = useState({
    equipment_id: '',
    serial_number: '',
    barcode: '',
    condition: 'NEW_SEALED',
    warehouse_location: 'Vault Hub A - Rack 04',
    notes: 'Sensor calibrated, firmware updated',
  });

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const [res, eq] = await Promise.all([
        adminApiClient('/admin/inventory', { token: token || undefined }),
        adminApiClient('/equipment'),
      ]);
      setUnits(res.units || res || []);
      setEquipmentList(eq.equipment || eq || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApiClient('/admin/inventory', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(form),
      });
      setIsAddModalOpen(false);
      fetchUnits();
    } catch (err: any) {
      alert(err.message || 'Failed to provision serial unit');
    }
  };

  const handleStatusUpdate = async (unitId: string, newStatus: string) => {
    try {
      await adminApiClient(`/admin/inventory/${unitId}/status`, {
        method: 'PATCH',
        token: token || undefined,
        body: JSON.stringify({ status: newStatus }),
      });
      setEditingUnit(null);
      fetchUnits();
    } catch (err: any) {
      alert(err.message || 'Failed to update unit status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return <Badge variant="success">Available in Vault</Badge>;
      case 'RENTED':
        return <Badge variant="accent">On Set (Filming)</Badge>;
      case 'MAINTENANCE':
        return <Badge variant="warning">Under Calibration</Badge>;
      case 'DAMAGED':
        return <Badge variant="danger">Damaged / Repair</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const filtered = units.filter((u) => {
    const matchesSearch =
      u.serial_number?.toLowerCase().includes(search.toLowerCase()) ||
      u.warehouse_location?.toLowerCase().includes(search.toLowerCase()) ||
      u.equipment?.name?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || u.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Physical Serialized Fleet
            </h1>
            <Badge variant="accent">{units.length} Serial Units</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Track individual unit serial numbers, barcodes, warehouse vault rack coordinates, and maintenance logs.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 text-xs">
          <Plus className="w-4 h-4" /> Provision Serial Unit
        </Button>
      </div>

      {/* Filter and Status Toggle */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search serial number (e.g. LF-99401), barcode, rack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-3.5 h-3.5" />}
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
          {['ALL', 'AVAILABLE', 'RENTED', 'MAINTENANCE', 'DAMAGED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider text-[10px] font-bold transition-all ${
                selectedStatus === st
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-surface-1 border-surface-3 text-zinc-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Serialized Units Table */}
      {isLoading ? (
        <Loading message="Fetching physical serial inventory from database..." />
      ) : (
        <div className="rounded-2xl border border-surface-3 bg-surface-1 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-surface-3">
                <tr>
                  <th className="px-5 py-3.5">Serial Number</th>
                  <th className="px-5 py-3.5">Assigned Gear Model</th>
                  <th className="px-5 py-3.5">Physical Condition</th>
                  <th className="px-5 py-3.5">Warehouse Location</th>
                  <th className="px-5 py-3.5">Operational Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3/60 text-zinc-300 font-sans">
                {filtered.map((unit) => (
                  <tr key={unit.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-white flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-accent" />
                      <span>{unit.serial_number}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{unit.equipment?.name || 'RED V-Raptor 8K VV'}</div>
                      <div className="text-[10px] font-mono text-zinc-500">{unit.barcode || 'BC-99401-2026'}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold text-emerald-400">
                      {unit.condition || 'PRISTINE / CALIBRATED'}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-zinc-400 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span>{unit.warehouse_location || 'Vault 1 • Bay A-04'}</span>
                    </td>
                    <td className="px-5 py-3.5">{getStatusBadge(unit.status)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingUnit(unit)}
                        className="text-[10px] py-1 px-2.5"
                      >
                        Change Status
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Serial Unit Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Provision Physical Serial Unit"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleCreateUnit} className="space-y-4 text-xs font-mono">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-400">Select Cinema Gear Model</label>
            <select
              className="w-full bg-surface-1 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
              value={form.equipment_id}
              onChange={(e) => setForm({ ...form, equipment_id: e.target.value })}
              required
            >
              <option value="">-- Choose Equipment --</option>
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} ({eq.brand})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Serial Number (e.g. SN-VRAPTOR-99401)"
            value={form.serial_number}
            onChange={(e) => setForm({ ...form, serial_number: e.target.value })}
            placeholder="SN-ARRI-LF-0041"
            required
          />

          <Input
            label="Barcode Identifier (Optional)"
            value={form.barcode}
            onChange={(e) => setForm({ ...form, barcode: e.target.value })}
            placeholder="BC-88902-IN"
          />

          <Input
            label="Warehouse Hub / Rack Slot"
            value={form.warehouse_location}
            onChange={(e) => setForm({ ...form, warehouse_location: e.target.value })}
            placeholder="Vault 1 • Bay A-04"
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-400">Initial Inspection Notes</label>
            <textarea
              rows={2}
              className="w-full bg-surface-1 border border-surface-3 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent font-sans"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full mt-4">
            Provision Serial Unit
          </Button>
        </form>
      </Modal>

      {/* Edit Status Modal */}
      {editingUnit && (
        <Modal
          isOpen={!!editingUnit}
          onClose={() => setEditingUnit(null)}
          title={`Update Status for ${editingUnit.serial_number}`}
          maxWidth="max-w-sm"
        >
          <div className="space-y-3 text-xs font-mono">
            <p className="text-zinc-400 text-[11px]">Select the current operational state of this unit:</p>
            <div className="grid grid-cols-1 gap-2">
              <Button
                variant={editingUnit.status === 'AVAILABLE' ? 'primary' : 'outline'}
                onClick={() => handleStatusUpdate(editingUnit.id, 'AVAILABLE')}
                className="w-full justify-start gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Available in Vault
              </Button>
              <Button
                variant={editingUnit.status === 'RENTED' ? 'primary' : 'outline'}
                onClick={() => handleStatusUpdate(editingUnit.id, 'RENTED')}
                className="w-full justify-start gap-2"
              >
                <Tag className="w-3.5 h-3.5 text-accent" /> On Set (Filming)
              </Button>
              <Button
                variant={editingUnit.status === 'MAINTENANCE' ? 'primary' : 'outline'}
                onClick={() => handleStatusUpdate(editingUnit.id, 'MAINTENANCE')}
                className="w-full justify-start gap-2"
              >
                <Wrench className="w-3.5 h-3.5 text-amber-400" /> Maintenance / Calibration
              </Button>
              <Button
                variant={editingUnit.status === 'DAMAGED' ? 'primary' : 'outline'}
                onClick={() => handleStatusUpdate(editingUnit.id, 'DAMAGED')}
                className="w-full justify-start gap-2"
              >
                <ShieldX className="w-3.5 h-3.5 text-danger" /> Damaged / Quarantine
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
