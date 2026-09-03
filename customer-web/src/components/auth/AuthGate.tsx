'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../layout/Navbar';
import { Footer } from '../layout/Footer';

export const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, logout } = useAuth();
  const pathname = usePathname();

  // If visiting the dedicated /login, /signup, or /verify-otp page, render without default shell
  if (pathname === '/login' || pathname === '/signup' || pathname === '/verify-otp') {
    return <>{children}</>;
  }

  // 1. Initial Session Restoration State (Non-blocking subtle loader)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-0 flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
            <span>Connecting to Cinema Fleet Vault...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 2. Standard Storefront: Open for browsing cinema catalog & gear
  return (
    <>
      {user && (
        <div className="bg-gradient-to-r from-accent/20 via-surface-1 to-surface-1 border-b border-surface-3/80 px-4 py-1.5 text-xs font-mono text-zinc-300">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                Welcome, <strong className="text-white font-semibold">{user.full_name}</strong>
              </span>
              <span className="hidden md:inline text-zinc-500">·</span>
              <span className="hidden md:inline text-accent text-[11px] bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                {user.role === 'ADMIN' ? '👑 Executive Producer / Admin' : '🎬 Verified Filmmaker'}
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="text-zinc-400 hover:text-rose-400 transition-colors text-xs font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      <Navbar />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </>
  );
};
