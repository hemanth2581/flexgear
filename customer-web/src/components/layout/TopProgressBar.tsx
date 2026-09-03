'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export const TopProgressBar: React.FC = () => {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 250);
    return () => clearTimeout(timeout);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-surface-3 overflow-hidden pointer-events-none">
      <div className="h-full bg-gradient-to-r from-accent via-info to-accent animate-[shimmer_1.5s_infinite_linear] w-full" />
    </div>
  );
};
