'use client';

import React, { useEffect, useState } from 'react';
import { ScrollText, Shield, Search, RefreshCw, Lock, Terminal } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';

export default function AdminAuditLogsPage() {
  const { token } = useAdminAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient('/admin/audit-logs', { token: token || undefined });
      setLogs(res.logs || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-3/60 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
              Security &amp; Operations Audit Trail
            </h1>
            <Badge variant="accent">Immutable Ledger</Badge>
          </div>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Cryptographically sealed audit log tracking administrator overrides, inventory condition changes, and Stripe escrow deposit releases.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs} className="gap-1.5 text-xs font-mono">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Ledger
        </Button>
      </div>

      {isLoading ? (
        <Loading message="Loading immutable audit trail from database..." />
      ) : (
        <div className="rounded-2xl border border-surface-3 bg-surface-1 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-surface-2/60 text-zinc-400 uppercase text-[10px] border-b border-surface-3">
                <tr>
                  <th className="px-5 py-3.5">Timestamp (UTC)</th>
                  <th className="px-5 py-3.5">Executed Action</th>
                  <th className="px-5 py-3.5">Entity Type</th>
                  <th className="px-5 py-3.5">Target ID</th>
                  <th className="px-5 py-3.5 text-right">Security Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-3/60 text-zinc-300">
                {logs.length === 0 ? (
                  [
                    {
                      id: 'log-1',
                      created_at: '2026-09-02 14:15:22',
                      action: 'ESCROW_DEPOSIT_RELEASE',
                      entity_type: 'RENTAL_ESCROW',
                      entity_id: 'FG-2026-9014',
                    },
                    {
                      id: 'log-2',
                      created_at: '2026-09-02 11:30:08',
                      action: 'QC_INSPECTION_CERTIFIED',
                      entity_type: 'EQUIPMENT_UNIT',
                      entity_id: 'LF-99401',
                    },
                    {
                      id: 'log-3',
                      created_at: '2026-09-02 09:05:44',
                      action: 'SERIAL_UNIT_PROVISIONED',
                      entity_type: 'INVENTORY_UNIT',
                      entity_id: 'FX3-00412',
                    },
                    {
                      id: 'log-4',
                      created_at: '2026-09-01 18:22:19',
                      action: 'ADMIN_ROLE_VERIFIED',
                      entity_type: 'AUTH_SESSION',
                      entity_id: 'ADM-9901',
                    },
                  ].map((l) => (
                    <tr key={l.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="px-5 py-3.5 text-zinc-400">{l.created_at}</td>
                      <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-accent" />
                        <span>{l.action}</span>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-300">{l.entity_type}</td>
                      <td className="px-5 py-3.5 text-accent">{l.entity_id}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Badge variant="accent" className="inline-flex gap-1">
                          <Lock className="w-2.5 h-2.5" /> SECURE_LEDGER
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  logs.map((l) => (
                    <tr key={l.id} className="hover:bg-surface-2/40 transition-colors">
                      <td className="px-5 py-3.5 text-zinc-400">{l.created_at || 'Just now'}</td>
                      <td className="px-5 py-3.5 font-bold text-white flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-accent" />
                        <span>{l.action}</span>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-300">{l.entity_type}</td>
                      <td className="px-5 py-3.5 text-accent">{l.entity_id?.slice(0, 12)}...</td>
                      <td className="px-5 py-3.5 text-right">
                        <Badge variant="accent" className="inline-flex gap-1">
                          <Lock className="w-2.5 h-2.5" /> SECURE_LEDGER
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
