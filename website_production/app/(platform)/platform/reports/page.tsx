'use client'

import { useState } from 'react'
import { Download, TrendingUp, CheckSquare, Activity, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/platform/stat-card'
import dynamic from 'next/dynamic'

const RevenueTrendChart = dynamic(
  () => import('@/components/platform/reports-charts').then((m) => m.RevenueTrendChart),
  { ssr: false }
)
const CampaignTypeChart = dynamic(
  () => import('@/components/platform/reports-charts').then((m) => m.CampaignTypeChart),
  { ssr: false }
)

const ranges = ['Last 7 days', 'Last 30 days', 'Last 90 days', 'Custom']

export default function ReportsPage() {
  const [activeRange, setActiveRange] = useState('Last 30 days')

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Reports</h2>
          <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
            Revenue, delivery, and engagement analytics
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border transition-colors hover:bg-[#1e2d4a]"
          style={{ borderColor: '#1e2d4a', color: '#f1f5f9' }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Date range pills */}
      <div className="flex gap-2 flex-wrap">
        {ranges.map((r) => (
          <button
            key={r}
            onClick={() => setActiveRange(r)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
            style={
              activeRange === r
                ? { backgroundColor: '#3b82f6', color: '#fff' }
                : {
                    backgroundColor: '#0f1629',
                    border: '1px solid #1e2d4a',
                    color: '#94a3b8',
                  }
            }
          >
            {r}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$18,420"
          accent="green"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Total Ad Completions"
          value="42,380"
          accent="green"
          icon={<CheckSquare className="h-4 w-4" />}
        />
        <StatCard
          title="Webhook Success Rate"
          value="99.8%"
          accent="green"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          title="Avg Session Revenue"
          value="$0.43"
          accent="blue"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueTrendChart />
        <CampaignTypeChart />
      </div>

      {/* Delivery Performance */}
      <div
        className="rounded-xl border p-6"
        style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
      >
        <h3 className="text-sm font-semibold text-white mb-4">Delivery Performance</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-4">
          <div>
            <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>
              Webhooks Delivered
            </p>
            <p className="text-2xl font-bold" style={{ color: '#10b981' }}>
              98,420
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>
              Webhook Success Rate
            </p>
            <p className="text-2xl font-bold" style={{ color: '#10b981' }}>
              99.8%
            </p>
          </div>
          <div>
            <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>
              Avg Delivery Time
            </p>
            <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
              142ms
            </p>
          </div>
        </div>
        <p className="text-xs" style={{ color: '#94a3b8' }}>
          All events are immutably logged. Full audit trail available.
        </p>
      </div>
    </div>
  )
}
