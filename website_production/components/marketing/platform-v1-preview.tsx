'use client'

import {
  Activity,
  BarChart2,
  CheckSquare,
  DollarSign,
  FileText,
  Home,
  Layout,
  Megaphone,
  Send,
  TrendingUp,
} from 'lucide-react'
import { StatCard } from '@/components/platform/stat-card'
import {
  CompletionsChart,
  RevenueChart,
} from '@/components/platform/analytics-charts'
import { campaigns } from '@/lib/mock-platform-data'

const platformNavItems = [
  { label: 'Analytics', icon: BarChart2, active: true },
  { label: 'Campaigns', icon: Megaphone, active: false },
  { label: 'Marketing', icon: Send, active: false },
  { label: 'Reports', icon: FileText, active: false },
  { label: 'Platform Preview', icon: Layout, active: false },
] as const

function statusBadge(status: string) {
  if (status === 'active') {
    return (
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-[#10b981]/15 text-[#10b981]">
        Active
      </span>
    )
  }

  if (status === 'scheduled') {
    return (
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-[#3b82f6]/15 text-[#3b82f6]">
        Scheduled
      </span>
    )
  }

  return (
    <span className="rounded px-2 py-0.5 text-xs font-semibold bg-[#1e2d4a] text-[#94a3b8]">
      Draft
    </span>
  )
}

export function PlatformPreview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-[1640px]">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            Platform tab preview
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Review the v1 platform tab as one continuous interface.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#a9bfd7] sm:text-lg">
            This embedded view shows the original client workspace presentation
            using example commercial data for review only.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[36px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.98),rgba(8,20,37,0.96))] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#ff8a3d]/20 bg-[#ff8a3d]/8 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ffcf9c]">
              Platform tab view
            </p>
            <p className="text-sm text-[#f3dfc3]">
              The full client-facing workspace is shown here with sample data
              only.
            </p>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-[#1e2d4a] bg-[#080d1a] shadow-[0_28px_100px_rgba(0,0,0,0.35)]">
            <div className="flex min-h-[920px] flex-col xl:min-h-[980px] xl:flex-row">
              <aside className="hidden bg-[#0a0f1e] xl:flex xl:w-[240px] xl:flex-shrink-0 xl:flex-col xl:border-r xl:border-[#1e2d4a]">
                <div className="border-b border-[#1e2d4a] px-5 pb-5 pt-6">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-[20px] font-bold leading-none text-[#3b82f6]">
                      ■
                    </span>
                    <div>
                      <span className="text-sm font-bold leading-none text-white">
                        Ad Rev
                      </span>{' '}
                      <span className="text-xs text-[#94a3b8]">
                        Technologies
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-[#94a3b8]">
                    Client Workspace · Atlas Commerce
                  </p>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                  <div className="mb-3 border-b border-[#1e2d4a] pb-3">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[#94a3b8]">
                      <Home className="h-5 w-5 flex-shrink-0" />
                      Home
                    </div>
                  </div>

                  {platformNavItems.map((item) => {
                    const Icon = item.icon

                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                          item.active
                            ? 'border-l-2 border-[#3b82f6] bg-[#3b82f6]/10 pl-[10px] text-[#3b82f6]'
                            : 'text-[#94a3b8]'
                        }`}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {item.label}
                      </div>
                    )
                  })}
                </nav>

                <div className="border-t border-[#1e2d4a] px-5 py-4">
                  <p className="mb-1 text-xs text-[#94a3b8]">
                    Commercial environment
                  </p>
                  <p className="flex items-center gap-1 text-xs text-[#10b981]">
                    <span>●</span>
                    <span>All systems operational</span>
                  </p>
                </div>
              </aside>

              <div className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-[64px] flex-shrink-0 items-center justify-between border-b border-[#1e2d4a] bg-[#0a0f1e] px-4 sm:px-6">
                  <h3 className="text-base font-semibold text-white">
                    Analytics Dashboard
                  </h3>

                  <div className="hidden items-center rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-1 text-xs font-semibold text-[#f59e0b] sm:flex">
                    Presentation Environment · Commercial data view
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                      <p className="text-sm font-medium text-white">BookieAI</p>
                      <span className="rounded bg-[#f59e0b]/20 px-2 py-0.5 text-xs font-medium text-[#f59e0b]">
                        Enterprise
                      </span>
                    </div>
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-sm font-bold text-white">
                      BA
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-hidden p-4 sm:p-6">
                  <div className="mx-auto max-w-7xl space-y-6">
                    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                      <StatCard
                        title="Total Revenue (April)"
                        value="$18,420"
                        change="34% vs last month"
                        changePositive
                        accent="green"
                        icon={<TrendingUp className="h-4 w-4" />}
                      />
                      <StatCard
                        title="Ad Completions"
                        value="42,380"
                        change="28% vs last month"
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
                        change="12% vs last month"
                        changePositive
                        accent="green"
                        icon={<DollarSign className="h-4 w-4" />}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      <RevenueChart />
                      <CompletionsChart />
                    </div>

                    <div className="overflow-hidden rounded-xl border border-[#1e2d4a] bg-[#0f1629]">
                      <div className="flex items-center justify-between border-b border-[#1e2d4a] px-5 py-4">
                        <h4 className="text-sm font-semibold text-white">
                          Campaign Performance
                        </h4>
                        <span className="text-xs font-medium text-[#3b82f6]">
                          View All Campaigns →
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-[#1e2d4a]">
                              {[
                                'Campaign Name',
                                'Type',
                                'Status',
                                'Impressions',
                                'Completions',
                                'Revenue',
                                'Conv. Rate',
                              ].map((heading) => (
                                <th
                                  key={heading}
                                  className="px-5 py-3 text-left text-xs font-medium"
                                >
                                  <span className="text-[#94a3b8]">
                                    {heading}
                                  </span>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {campaigns.map((campaign) => (
                              <tr
                                key={campaign.id}
                                className="border-b border-[#1e2d4a] transition-colors hover:bg-[#1e2d4a]/30"
                              >
                                <td className="px-5 py-3 font-medium text-white">
                                  {campaign.name}
                                </td>
                                <td className="px-5 py-3 text-[#94a3b8]">
                                  {campaign.type}
                                </td>
                                <td className="px-5 py-3">
                                  {statusBadge(campaign.status)}
                                </td>
                                <td className="px-5 py-3 text-white">
                                  {campaign.impressions.toLocaleString()}
                                </td>
                                <td className="px-5 py-3 text-white">
                                  {campaign.completions.toLocaleString()}
                                </td>
                                <td className="px-5 py-3 text-white">
                                  {campaign.revenue > 0
                                    ? `$${campaign.revenue.toLocaleString()}`
                                    : '—'}
                                </td>
                                <td className="px-5 py-3 text-white">
                                  {campaign.conversionRate > 0
                                    ? `${campaign.conversionRate}%`
                                    : '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
