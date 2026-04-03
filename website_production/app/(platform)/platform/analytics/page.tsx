import Link from 'next/link'
import { TrendingUp, CheckSquare, Activity, DollarSign } from 'lucide-react'
import { StatCard } from '@/components/platform/stat-card'
import { campaigns } from '@/lib/mock-platform-data'
import dynamic from 'next/dynamic'

const RevenueChart = dynamic(
  () => import('@/components/platform/analytics-charts').then((m) => m.RevenueChart),
  { ssr: false }
)
const CompletionsChart = dynamic(
  () => import('@/components/platform/analytics-charts').then((m) => m.CompletionsChart),
  { ssr: false }
)

function statusBadge(status: string) {
  if (status === 'active')
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#10b981]/15 text-[#10b981]">
        Active
      </span>
    )
  if (status === 'scheduled')
    return (
      <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#3b82f6]/15 text-[#3b82f6]">
        Scheduled
      </span>
    )
  return (
    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#1e2d4a] text-[#94a3b8]">
      Draft
    </span>
  )
}

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue (April)"
          value="$18,420"
          change="+34% vs last month"
          changePositive
          accent="green"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatCard
          title="Ad Completions"
          value="42,380"
          change="+28% vs last month"
          changePositive
          accent="green"
          icon={<CheckSquare className="h-4 w-4" />}
        />
        <StatCard
          title="Active Campaigns"
          value="2"
          accent="blue"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          title="Avg eCPM"
          value="$4.34"
          change="+12% vs last month"
          changePositive
          accent="green"
          icon={<DollarSign className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueChart />
        <CompletionsChart />
      </div>

      {/* Campaign Table */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: '#0f1629', borderColor: '#1e2d4a' }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: '#1e2d4a' }}
        >
          <h3 className="text-sm font-semibold text-white">Campaign Performance</h3>
          <Link
            href="/platform/campaigns"
            className="text-xs font-medium transition-colors hover:text-white"
            style={{ color: '#3b82f6' }}
          >
            View All Campaigns →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid #1e2d4a' }}>
                {['Campaign Name', 'Type', 'Status', 'Impressions', 'Completions', 'Revenue', 'Conv. Rate'].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-xs font-medium"
                      style={{ color: '#94a3b8' }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c.id}
                  className="transition-colors hover:bg-[#1e2d4a]/30"
                  style={{ borderBottom: '1px solid #1e2d4a' }}
                >
                  <td className="px-5 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-5 py-3" style={{ color: '#94a3b8' }}>
                    {c.type}
                  </td>
                  <td className="px-5 py-3">{statusBadge(c.status)}</td>
                  <td className="px-5 py-3 text-white">
                    {c.impressions.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-white">
                    {c.completions.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-white">
                    {c.revenue > 0 ? `$${c.revenue.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-white">
                    {c.conversionRate > 0 ? `${c.conversionRate}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
