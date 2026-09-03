'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Camera,
  Boxes,
  Film,
  Users,
  CreditCard,
  ShieldAlert,
  ClipboardCheck,
  Undo2,
  FileText,
  BarChart3,
  Bell,
  ScrollText,
  Shield,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Rentals & Orders', href: '/admin/rentals', icon: Film, badge: 'Live' },
  { name: 'Equipment Catalog', href: '/admin/equipment', icon: Camera },
  { name: 'Physical Inventory', href: '/admin/inventory', icon: Boxes },
  { name: 'Return Inspections & QC', href: '/admin/inspections', icon: ClipboardCheck },
  { name: 'Filmmakers / Clients', href: '/admin/customers', icon: Users },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-1 border-r border-surface-3 flex flex-col h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-surface-3 bg-surface-0">
        <div className="w-8 h-8 rounded-lg bg-surface-2 border border-surface-3 flex items-center justify-center text-accent">
          <Shield className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold font-display tracking-tight text-white flex items-center gap-1">
            FLEX<span className="text-accent">GEAR</span>
          </span>
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase -mt-0.5 font-semibold">
            Studio Operations
          </span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase mb-2">
          OPERATIONS CONSOLE
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== '/admin/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-accent/10 border border-accent/30 text-accent font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-surface-2'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-zinc-500'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-accent/20 text-accent font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Status & Portal Link */}
      <div className="p-3 border-t border-surface-3 bg-surface-0 space-y-2">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-1 border border-surface-3 hover:border-surface-4 text-zinc-300 hover:text-white text-xs font-mono transition-all"
        >
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Customer Portal
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
        </a>
        <div className="text-[10px] text-zinc-600 font-mono text-center">
          FlexGear Studio • Cinema OS v2.0
        </div>
      </div>
    </aside>
  );
};
