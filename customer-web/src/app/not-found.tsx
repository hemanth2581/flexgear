import React from 'react';
import Link from 'next/link';
import { Film, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-surface-1 border border-surface-3 flex items-center justify-center text-accent mb-6 shadow-2xl">
        <Film className="w-8 h-8" />
      </div>
      <div className="text-xs font-mono uppercase tracking-widest text-accent font-semibold mb-2">
        Error 404 · Reel Not Found
      </div>
      <h1 className="text-4xl font-bold font-display text-white tracking-tight">
        Equipment Page Out of Frame
      </h1>
      <p className="text-xs text-zinc-400 mt-2 max-w-sm mx-auto leading-relaxed">
        The cinema rig or shoot page you are looking for has been moved or does not exist in the active vault.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <button className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-surface-0 font-bold text-xs rounded-xl transition-all shadow-md shadow-accent/10">
            Return to Home
          </button>
        </Link>
        <Link href="/equipment">
          <button className="px-5 py-2.5 bg-surface-1 hover:bg-surface-2 border border-surface-3 text-zinc-300 hover:text-white font-medium text-xs rounded-xl transition-all">
            Browse All Fleet
          </button>
        </Link>
      </div>
    </div>
  );
}
