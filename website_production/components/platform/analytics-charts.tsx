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
import { revenueData } from '@/lib/mock-platform-data'

export function RevenueChart() {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
    >
      <h3 className="text-sm font-semibold text-white mb-4">Revenue — Last 30 Days</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
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
            formatter={(value, name) => {
              if (name === 'revenue') return [`$${value ?? 0}`, 'Revenue']
              if (name === 'completions') return [value ?? 0, 'Completions']
              return [value ?? 0, String(name)]
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function CompletionsChart() {
  return (
    <div
      className="rounded-xl p-5 border"
      style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
    >
      <h3 className="text-sm font-semibold text-white mb-4">Daily Ad Completions</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
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
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f1629',
              border: '1px solid #1e2d4a',
              borderRadius: '8px',
              color: '#f1f5f9',
            }}
          />
          <Bar dataKey="completions" fill="#10b981" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
