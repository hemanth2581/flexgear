import React from 'react';
import Link from 'next/link';
import { Camera, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-cinema-bg min-h-[75vh] flex items-center justify-center py-16 px-4 text-cinema-text">
      <div className="max-w-md w-full bg-cinema-card rounded-3xl p-8 sm:p-10 text-center border border-cinema-border shadow-cinema space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-cinema-text headingbold">404</h1>
          <h2 className="text-lg font-bold text-cinema-text">Page Not Found</h2>
          <p className="text-xs text-cinema-muted leading-relaxed">
            The page or equipment you are looking for might have been moved, renamed, or is currently unavailable in the rental fleet.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full rounded-2xl font-black bg-accent hover:bg-accent-hover text-cinema-bg px-6 text-xs shadow-cinema">
              <Home className="w-4 h-4 mr-1.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link href="/equipment" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-2xl font-bold border-cinema-border text-cinema-text hover:bg-cinema-elevated px-6 text-xs">
              <Camera className="w-4 h-4 mr-1.5" />
              <span>Explore Gear</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
