'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, BarChart3, Award } from 'lucide-react';

const monthlyRevenueData = [
  { month: 'Mar', revenue: 142000, rentals: 38 },
  { month: 'Apr', revenue: 198000, rentals: 52 },
  { month: 'May', revenue: 265000, rentals: 71 },
  { month: 'Jun', revenue: 310000, rentals: 84 },
  { month: 'Jul', revenue: 380000, rentals: 96 },
  { month: 'Aug', revenue: 492000, rentals: 124 },
];

const topRentedGear = [
  { name: 'Sony FX3 Full-Frame Cinema Camera', rentals: 42, revenue: 168000, category: 'Cameras' },
  { name: 'Sony FE 24-70mm f/2.8 GM II Lens', rentals: 38, revenue: 68400, category: 'Lenses' },
  { name: 'DJI RS 3 Pro Gimbal Stabilizer Combo', rentals: 31, revenue: 37200, category: 'Gimbals' },
  { name: 'Aputure LS 600d Pro Daylight LED Light', rentals: 27, revenue: 40500, category: 'Lighting' },
  { name: 'Complete Wedding Film Production Kit', rentals: 24, revenue: 144000, category: 'Kits' },
];

export function AdminCharts() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Bar Chart */}
        <Card className="border-zinc-800/80 bg-zinc-900/60 shadow-lg backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-400" />
                <span>Monthly Rental Revenue (₹)</span>
              </CardTitle>
              <p className="text-xs text-zinc-400">Total gross earnings over the last 6 months</p>
            </div>
            <span className="text-xs font-bold text-emerald-400">+29.4% MoM</span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                  <YAxis
                    stroke="#71717a"
                    fontSize={12}
                    tickFormatter={(val) => `₹${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                      borderRadius: '8px',
                      color: '#fafafa',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [formatCurrency(value), 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rentals Volume Line Chart */}
        <Card className="border-zinc-800/80 bg-zinc-900/60 shadow-lg backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-amber-400" />
                <span>Completed Shoot Orders</span>
              </CardTitle>
              <p className="text-xs text-zinc-400">Total volume of fulfilled equipment bookings</p>
            </div>
            <span className="text-xs font-bold text-amber-400">124 This Month</span>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
                  <YAxis stroke="#71717a" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#18181b',
                      borderColor: '#3f3f46',
                      borderRadius: '8px',
                      color: '#fafafa',
                      fontSize: '12px',
                    }}
                    formatter={(value: any) => [`${value} Orders`, 'Rentals']}
                  />
                  <Line
                    type="monotone"
                    dataKey="rentals"
                    stroke="#38bdf8"
                    strokeWidth={3}
                    dot={{ fill: '#38bdf8', r: 5 }}
                    activeDot={{ r: 8, stroke: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 5 Most Rented Gear */}
      <Card className="border-zinc-800/80 bg-zinc-900/60 shadow-lg backdrop-blur-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-white flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400" />
            <span>Top 5 High-Demand Equipment</span>
          </CardTitle>
          <p className="text-xs text-zinc-400">Most rented units and their cumulative gross rental volume</p>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-800/80">
            {topRentedGear.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-800 text-xs font-bold text-amber-400">
                    {idx + 1}
                  </span>
                  <div>
                    <h5 className="text-sm font-semibold text-white">{item.name}</h5>
                    <span className="text-xs text-zinc-400">{item.category} • {item.rentals} Total Bookings</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-amber-400">{formatCurrency(item.revenue)}</div>
                  <div className="text-[10px] text-zinc-500">Gross Earned</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
