'use client';

import React from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { LogOut, Bell, Search, Command } from 'lucide-react';

export const AdminHeader: React.FC = () => {
  const { admin, logout } = useAdminAuth();

  return (
    <header className="h-16 border-b border-surface-3 bg-surface-0/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-30">
      {/* System Status Indicators */}
      <div className="flex items-center gap-3">
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          <span>Fleet Vault Online</span>
        </div>
        <span className="hidden md:inline-flex text-[11px] font-mono text-zinc-500">
          Stripe Escrow Live • Real-time Sync
        </span>
      </div>

      {/* Right User & Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Search trigger */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-1 border border-surface-3 text-xs font-mono text-zinc-500">
          <Search className="w-3.5 h-3.5" />
          <span>Search serials, orders, clients...</span>
          <kbd className="text-[10px] bg-surface-2 px-1.5 py-0.5 rounded border border-surface-3 text-zinc-400">
            ⌘K
          </kbd>
        </div>

        {/* Live Alert Bell */}
        <button
          aria-label="Alerts"
          className="p-2 rounded-xl bg-surface-1 border border-surface-3 text-zinc-400 hover:text-white hover:border-surface-4 transition-colors relative"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
        </button>

        {/* Technician Badge */}
        <div className="flex items-center gap-2.5 bg-surface-1 border border-surface-3 py-1 px-3 rounded-full">
          <div className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-[10px] font-mono font-bold">
            {admin?.name?.charAt(0) || 'A'}
          </div>
          <div className="text-left">
            <span className="text-xs font-semibold text-white block leading-tight">
              {admin?.name || 'Technician Admin'}
            </span>
            <span className="text-[9px] text-accent font-mono font-semibold block leading-tight">
              QC CERTIFIED
            </span>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-surface-2 transition-colors flex items-center gap-1.5 text-xs font-mono"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};
