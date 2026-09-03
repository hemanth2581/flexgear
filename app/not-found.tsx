import React from 'react';
import Link from 'next/link';
import { Camera, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="bg-[#f3f3f3] min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 text-center border border-gray-200 shadow-sm space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-lenstiger/10 text-lenstiger flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black text-gray-900 headingbold">404</h1>
          <h2 className="text-lg font-bold text-gray-800">Page Not Found</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            The page or equipment you are looking for might have been moved, renamed, or is currently unavailable.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full rounded-2xl font-bold bg-gold hover:bg-gold-hover text-gray-950 px-6 text-xs">
              <Home className="w-4 h-4 mr-1.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link href="/equipment" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full rounded-2xl font-bold border-gray-300 text-gray-700 hover:bg-gray-100 px-6 text-xs">
              <Camera className="w-4 h-4 mr-1.5" />
              <span>Explore Gear</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
