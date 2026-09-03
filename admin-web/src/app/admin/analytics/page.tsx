'use client';

import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Award } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminAnalyticsPage() {
  const rentalGrowthData = [
    { month: 'Jan', shoots: 12, revenue: 180000 },
    { month: 'Feb', shoots: 18, revenue: 260000 },
    { month: 'Mar', shoots: 24, revenue: 340000 },
    { month: 'Apr', shoots: 29, revenue: 410000 },
    { month: 'May', shoots: 35, revenue: 490000 },
    { month: 'Jun', shoots: 42, revenue: 580000 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-cinema-border pb-6">
        <h1 className="text-2xl font-black text-white">Commercial Analytics &amp; Fleet ROI</h1>
        <p className="text-xs text-zinc-400 mt-1">Growth trends, seasonal booking spikes, and camera body payback periods.</p>
      </div>

      <div className="p-6 rounded-2xl bg-cinema-card border border-cinema-border space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400" /> Filming Shoots Volume Growth
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rentalGrowthData}>
              <defs>
                <linearGradient id="colorShoots" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E50914" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#E50914" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#242430" />
              <XAxis dataKey="month" stroke="#8E8E9F" fontSize={12} />
              <YAxis stroke="#8E8E9F" fontSize={12} />
              <Tooltip
                contentStyle={{ backgroundColor: '#121217', borderColor: '#242430', borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="shoots" stroke="#E50914" fillOpacity={1} fill="url(#colorShoots)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
