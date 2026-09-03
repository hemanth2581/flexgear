'use client';

import React, { useEffect, useState } from 'react';
import { Camera, Plus, Search, Edit2, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { Loading } from '../../../components/ui/Loading';

export default function AdminEquipmentPage() {
  const { token } = useAdminAuth();
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Equipment Form State
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category_slug: 'cameras',
    daily_price: 15000,
    security_deposit: 35000,
    description: '',
    thumbnail_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [eq, cats] = await Promise.all([
        adminApiClient('/equipment'),
        adminApiClient('/categories'),
      ]);
      setEquipmentList(eq.equipment || eq || []);
      setCategories(cats || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApiClient('/admin/equipment', {
        method: 'POST',
        token: token || undefined,
        body: JSON.stringify(form),
      });
      setIsAddModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create gear');
    }
  };

  const filtered = equipmentList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCat === 'all' ||
      item.category_id?.toLowerCase() === selectedCat ||
      item.category_name?.toLowerCase().includes(selectedCat);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Cinema Fleet Catalog
            </h1>
            <Badge variant="accent">{equipmentList.length} Models</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Manage cinema camera bodies, anamorphic lenses, lighting packages, and wireless sound units.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 text-xs">
          <Plus className="w-4 h-4" /> Add New Gear
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search camera model, lens series, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="w-3.5 h-3.5" />}
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
          {['all', 'cameras', 'lenses', 'lighting', 'audio'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3 py-1.5 rounded-lg border uppercase tracking-wider text-[10px] font-bold transition-all ${
                selectedCat === cat
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-surface-1 border-surface-3 text-zinc-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Fleet Table */}
      {isLoading ? (
        <Loading message="Synchronizing cinema fleet catalog..." />
      ) : (
        <div className="rounded-2xl border border-surface-3 bg-surface-1 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-surface-3">
                <tr>
                  <th className="px-5 py-3.5">Cinema Equipment</th>
                  <th className="px-5 py-3.5">Brand</th>
                  <th className="px-5 py-3.5">Daily Rate</th>
                  <th className="px-5 py-3.5">Escrow Hold</th>
                  <th className="px-5 py-3.5">Rating</th>
                  <th className="px-5 py-3.5">Fleet Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3/60 text-zinc-300 font-sans">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail_url || item.image_url}
                          alt={item.name}
                          className="w-10 h-10 rounded-xl object-cover bg-surface-2 border border-surface-3 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-white block">{item.name}</span>
                          <span className="text-[10px] font-mono text-zinc-500">{item.slug || item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-white font-display">{item.brand}</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">
                      ₹{Number(item.daily_price || item.daily_rate || 15000).toLocaleString('en-IN')}
                      <span className="text-[10px] text-zinc-500 font-normal">/day</span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-accent font-semibold">
                      ₹{Number(item.security_deposit || 25000).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-semibold text-amber-400">
                      ★ {item.rating || 4.9} <span className="text-zinc-500 text-[10px]">({item.review_count || 12})</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="success">Active in Fleet</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="p-1.5 hover:text-white text-zinc-400 rounded-lg hover:bg-surface-2 transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register Cinema Gear to Fleet"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs font-mono">
          <Input
            label="Gear Title / Model Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Sony FX6 Cinema Line Camera"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Brand"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              placeholder="Sony, Canon, ARRI, RED..."
              required
            />
            <div className="space-y-1.5">
              <label className="block text-xs font-mono text-zinc-400">Category</label>
              <select
                className="w-full bg-surface-1 border border-surface-3 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                value={form.category_slug}
                onChange={(e) => setForm({ ...form, category_slug: e.target.value })}
              >
                <option value="cameras">Cameras</option>
                <option value="lenses">Lenses</option>
                <option value="lighting">Lighting</option>
                <option value="audio">Audio</option>
                <option value="gimbals">Gimbals</option>
                <option value="drones">Drones</option>
                <option value="kits">Kits</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Daily Rate (₹ INR)"
              type="number"
              value={form.daily_price}
              onChange={(e) => setForm({ ...form, daily_price: Number(e.target.value) })}
              required
            />
            <Input
              label="Security Deposit Hold (₹ INR)"
              type="number"
              value={form.security_deposit}
              onChange={(e) => setForm({ ...form, security_deposit: Number(e.target.value) })}
              required
            />
          </div>
          <Input
            label="Photo URL"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
            required
          />
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-zinc-400">Technical Specifications &amp; Features</label>
            <textarea
              rows={3}
              className="w-full bg-surface-1 border border-surface-3 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-accent font-sans"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Full sensor specifications, dynamic range, recording codecs, mounting..."
              required
            />
          </div>
          <Button type="submit" className="w-full mt-4">
            Register Gear to Fleet
          </Button>
        </form>
      </Modal>
    </div>
  );
}
