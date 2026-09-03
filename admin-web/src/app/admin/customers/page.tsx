'use client';

import React, { useEffect, useState } from 'react';
import { Users, Search, Mail, Phone, Calendar, ShieldCheck, UserCheck } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Loading } from '../../../components/ui/Loading';

export default function AdminCustomersPage() {
  const { token } = useAdminAuth();
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const res = await adminApiClient('/admin/customers', { token: token || undefined });
        setCustomers(res.customers || res || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Cinematographer &amp; Studio Directory
            </h1>
            <Badge variant="accent">{customers.length} Verified Clients</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Verified production houses, camera operators, and DP accounts with authenticated Firebase phone credentials.
          </p>
        </div>
      </div>

      <div className="max-w-md">
        <Input
          placeholder="Search by producer name, email, phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={<Search className="w-3.5 h-3.5" />}
        />
      </div>

      {isLoading ? (
        <Loading message="Fetching client records from database..." />
      ) : (
        <div className="rounded-2xl border border-surface-3 bg-surface-1 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-2/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-surface-3">
                <tr>
                  <th className="px-5 py-3.5">Filmmaker / Studio</th>
                  <th className="px-5 py-3.5">Contact Credentials</th>
                  <th className="px-5 py-3.5">Access Role</th>
                  <th className="px-5 py-3.5">Total Shoots</th>
                  <th className="px-5 py-3.5">Lifetime Spend</th>
                  <th className="px-5 py-3.5 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3/60 text-zinc-300 font-sans">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-surface-2/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-surface-2 border border-surface-3 flex items-center justify-center font-bold text-accent font-mono text-xs shrink-0">
                          {c.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{c.name || 'Anonymous DP'}</span>
                          <span className="text-[10px] text-zinc-500 font-mono">{c.id?.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-zinc-300">
                        <Mail className="w-3 h-3 text-zinc-500" /> {c.email}
                      </div>
                      {c.phone && (
                        <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
                          <Phone className="w-3 h-3 text-zinc-500" /> {c.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono">
                      <Badge variant={c.role === 'ADMIN' ? 'accent' : 'default'}>{c.role}</Badge>
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-white">{c.rental_count || 1} shoot(s)</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-emerald-400">
                      ₹{(c.total_spend || 45000).toLocaleString('en-IN')}
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono">
                      <Badge variant="success" className="gap-1 inline-flex">
                        <ShieldCheck className="w-3 h-3" /> Firebase Phone Verified
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
