import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function KpiCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  iconColor = 'text-amber-400',
  iconBg = 'bg-amber-500/10 border-amber-500/20',
}: KpiCardProps) {
  return (
    <Card className="border-zinc-800/80 bg-zinc-900/60 shadow-lg backdrop-blur-md">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {title}
            </span>
            <div className="text-2xl font-black text-white tracking-tight">
              {value}
            </div>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${iconBg} ${iconColor}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {change && (
          <div className="mt-3 flex items-center space-x-1 text-xs">
            <span className={`font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {change}
            </span>
            <span className="text-zinc-500">vs previous period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
