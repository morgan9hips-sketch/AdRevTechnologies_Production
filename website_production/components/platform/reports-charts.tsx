'use client'

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { revenueData, campaignPerformanceByType } from '@/lib/mock-platform-data'

export function RevenueTrendChart() {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
    >
      <h3 className="text-sm font-semibold text-white mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f1629',
              border: '1px solid #1e2d4a',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            formatter={(v) => [`$${v ?? 0}`, 'Revenue']}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#colorGreen)"
            dot={(props) => {
              const { cx, cy, index } = props
              const isDown =
                index > 0 &&
                revenueData[index].revenue < revenueData[index - 1].revenue
              return (
                <circle
                  key={`dot-trend-${index}`}
                  cx={cx}
                  cy={cy}
                  r={3}
                  fill={isDown ? '#ef4444' : '#10b981'}
                  stroke="none"
                />
              )
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CampaignTypeChart() {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
    >
      <h3 className="text-sm font-semibold text-white mb-4">Revenue by Campaign Type</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={campaignPerformanceByType}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e2d4a" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <YAxis
            type="category"
            dataKey="type"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={90}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f1629',
              border: '1px solid #1e2d4a',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
            formatter={(v) => [`$${(v ?? 0).toLocaleString()}`, 'Revenue']}
          />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
