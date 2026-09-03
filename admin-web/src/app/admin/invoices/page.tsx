'use client';

import React, { useEffect, useState } from 'react';
import { FileText, Download, Search, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import { adminApiClient } from '../../../lib/api';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Loading } from '../../../components/ui/Loading';

export default function AdminInvoicesPage() {
  const { token } = useAdminAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const res = await adminApiClient('/invoices', { token: token || undefined });
      setInvoices(res.invoices || res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cinema-border pb-6">
        <div>
          <h1 className="text-2xl font-black text-white">GST Compliance &amp; Tax Invoices</h1>
          <p className="text-xs text-zinc-400 mt-1">Official B2B/B2C tax invoices featuring 18% GST (9% CGST + 9% SGST) breakdown.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchInvoices} className="gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Invoices
        </Button>
      </div>

      {isLoading ? (
        <Loading message="Fetching GST tax invoices..." />
      ) : (
        <div className="rounded-xl border border-cinema-border bg-cinema-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 text-zinc-400 font-mono uppercase text-[10px] border-b border-cinema-border">
                <tr>
                  <th className="px-4 py-3">Invoice Number</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Taxable Base</th>
                  <th className="px-4 py-3">CGST (9%)</th>
                  <th className="px-4 py-3">SGST (9%)</th>
                  <th className="px-4 py-3">Total Invoice</th>
                  <th className="px-4 py-3 text-right">PDF</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cinema-border text-zinc-300">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-white flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-primary" /> {inv.invoice_number}
                    </td>
                    <td className="px-4 py-3 font-semibold text-zinc-200">{inv.customer_name || 'Production House'}</td>
                    <td className="px-4 py-3 font-mono">₹{Number(inv.taxable_amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">₹{Number(inv.cgst || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">₹{Number(inv.sgst || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 font-mono font-bold text-white">₹{Number(inv.total_amount || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" className="text-[10px] py-1 px-2.5 gap-1">
                        <Download className="w-3 h-3" /> PDF
                      </Button>
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
