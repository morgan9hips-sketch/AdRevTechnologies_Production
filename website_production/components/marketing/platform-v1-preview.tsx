'use client'

import { useState } from 'react'
import {
  Activity,
  BarChart2,
  CheckSquare,
  DollarSign,
  Download,
  FileText,
  Home,
  Layout,
  Megaphone,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  TrendingUp,
} from 'lucide-react'
import { StatCard } from '@/components/platform/stat-card'
import {
  CompletionsChart,
  RevenueChart,
} from '@/components/platform/analytics-charts'
import {
  CampaignTypeChart,
  RevenueTrendChart,
} from '@/components/platform/reports-charts'
import { AdCompletionState } from '@/components/platform/ad-preview-modal'
import { campaigns, marketingAutomations } from '@/lib/mock-platform-data'

type PlatformTab =
  | 'analytics'
  | 'campaigns'
  | 'marketing'
  | 'reports'
  | 'preview'

type PreviewMode = 'host' | 'user'

const platformNavItems: Array<{
  id: PlatformTab
  label: string
  icon: typeof BarChart2
}> = [
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
  { id: 'marketing', label: 'Marketing', icon: Send },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'preview', label: 'Platform Preview', icon: Layout },
]

const pageTitles: Record<PlatformTab, string> = {
  analytics: 'Analytics Dashboard',
  campaigns: 'Campaigns',
  marketing: 'Marketing Hub',
  reports: 'Reports',
  preview: 'Platform Experience',
}

const channelCards = [
  {
    key: 'whatsapp',
    label: 'WhatsApp Status',
    icon: MessageCircle,
    colorClass: 'text-[#25D366]',
    surfaceClass: 'bg-[#25D366]/15',
    active: 2,
    lastSent: '2 hours ago',
    next: 'Continuous',
  },
  {
    key: 'email',
    label: 'Mailing Campaigns',
    icon: FileText,
    colorClass: 'text-[#3b82f6]',
    surfaceClass: 'bg-[#3b82f6]/15',
    active: 1,
    lastSent: '3 days ago',
    next: 'Apr 7, 09:00',
  },
  {
    key: 'social',
    label: 'Social Distribution',
    icon: Share2,
    colorClass: 'text-[#8b5cf6]',
    surfaceClass: 'bg-[#8b5cf6]/15',
    active: 1,
    lastSent: '1 day ago',
    next: 'Apr 5, 15:00',
  },
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

  if (status === 'paused') {
    return (
      <span className="rounded px-2 py-0.5 text-xs font-semibold bg-[#f59e0b]/15 text-[#f59e0b]">
        Paused
      </span>
    )
  }

  return (
    <span className="rounded px-2 py-0.5 text-xs font-semibold bg-[#1e2d4a] text-[#94a3b8]">
      Draft
    </span>
  )
}

function typeBadge(type: string) {
  return (
    <span className="rounded bg-[#1e2d4a] px-2 py-0.5 text-xs font-medium text-[#94a3b8]">
      {type}
    </span>
  )
}

function PlatformShell({
  activeTab,
  onSelectTab,
  children,
}: {
  activeTab: PlatformTab
  onSelectTab: (tab: PlatformTab) => void
  children: React.ReactNode
}) {
  return (
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
                <span className="text-xs text-[#94a3b8]">Technologies</span>
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
              const isActive = item.id === activeTab

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectTab(item.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? 'border-l-2 border-[#3b82f6] bg-[#3b82f6]/10 pl-[10px] text-[#3b82f6]'
                      : 'text-[#94a3b8] hover:bg-[#1e2d4a]/50 hover:text-[#dce8f5]'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          <div className="border-t border-[#1e2d4a] px-5 py-4">
            <p className="mb-1 text-xs text-[#94a3b8]">Commercial environment</p>
            <p className="flex items-center gap-1 text-xs text-[#10b981]">
              <span>●</span>
              <span>All systems operational</span>
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-[64px] flex-shrink-0 items-center justify-between border-b border-[#1e2d4a] bg-[#0a0f1e] px-4 sm:px-6">
            <h3 className="text-base font-semibold text-white">
              {pageTitles[activeTab]}
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

          <div className="flex-1 overflow-hidden p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}

function AnalyticsPanel() {
  return (
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
          <h4 className="text-sm font-semibold text-white">Campaign Performance</h4>
          <span className="text-xs font-medium text-[#3b82f6]">View All Campaigns →</span>
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
                  <th key={heading} className="px-5 py-3 text-left text-xs font-medium text-[#94a3b8]">
                    {heading}
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
                  <td className="px-5 py-3 font-medium text-white">{campaign.name}</td>
                  <td className="px-5 py-3 text-[#94a3b8]">{campaign.type}</td>
                  <td className="px-5 py-3">{statusBadge(campaign.status)}</td>
                  <td className="px-5 py-3 text-white">{campaign.impressions.toLocaleString()}</td>
                  <td className="px-5 py-3 text-white">{campaign.completions.toLocaleString()}</td>
                  <td className="px-5 py-3 text-white">
                    {campaign.revenue > 0 ? `$${campaign.revenue.toLocaleString()}` : '—'}
                  </td>
                  <td className="px-5 py-3 text-white">
                    {campaign.conversionRate > 0 ? `${campaign.conversionRate}%` : '—'}
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

function CampaignsPanel() {
  return (
    <div className="mx-auto max-w-7xl space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Campaigns</h2>
          <p className="mt-0.5 text-sm text-[#94a3b8]">
            {campaigns.filter((campaign) => campaign.status === 'active').length} active · {campaigns.length} total
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="rounded-xl border border-[#1e2d4a] bg-[#0f1629] p-5 transition-colors hover:border-[#3b82f6]/30"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-white">{campaign.name}</h3>
                  {typeBadge(campaign.type)}
                  {statusBadge(campaign.status)}
                </div>

                {campaign.status !== 'draft' && campaign.startDate && (
                  <p className="mb-3 text-xs text-[#94a3b8]">
                    {campaign.startDate} → {campaign.endDate}
                  </p>
                )}

                <div className="flex flex-wrap gap-6">
                  <MetricPair label="Impressions" value={campaign.impressions.toLocaleString() || '—'} />
                  <MetricPair label="Completions" value={campaign.completions.toLocaleString() || '—'} />
                  <MetricPair
                    label="Revenue"
                    value={campaign.revenue > 0 ? `$${campaign.revenue.toLocaleString()}` : '—'}
                  />
                  {campaign.conversionRate > 0 && (
                    <MetricPair
                      label="Conv. Rate"
                      value={`${campaign.conversionRate}%`}
                      valueClassName="text-[#10b981]"
                    />
                  )}
                </div>
              </div>

              <button
                type="button"
                aria-label="Open campaign actions"
                title="Open campaign actions"
                className="rounded-lg p-2 text-[#94a3b8] transition-colors hover:bg-[#1e2d4a]"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MarketingPanel() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Marketing Hub</h2>
          <p className="mt-0.5 text-sm text-[#94a3b8]">
            Automated outreach across messaging, email, and social distribution
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-[#3b82f6] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Create Automation
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {channelCards.map((channel) => {
          const Icon = channel.icon
          return (
            <div key={channel.key} className="rounded-xl border border-[#1e2d4a] bg-[#0f1629] p-5">
              <div className="mb-3 flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${channel.surfaceClass}`}>
                  <Icon className={`h-5 w-5 ${channel.colorClass}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{channel.label}</p>
                  <p className={`text-xs ${channel.colorClass}`}>
                    {channel.active} active automation{channel.active !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-[#94a3b8]">
                <p>Last sent: {channel.lastSent}</p>
                <p>Next: {channel.next}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-[#1e2d4a] bg-[#0f1629]">
        <div className="border-b border-[#1e2d4a] px-5 py-4">
          <h3 className="text-sm font-semibold text-white">All Automations</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a]">
                {['Name', 'Channel', 'Trigger', 'Status', 'Sent', 'Last Sent', 'Next'].map((heading) => (
                  <th key={heading} className="px-5 py-3 text-left text-xs font-medium text-[#94a3b8]">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {marketingAutomations.map((automation) => (
                <tr
                  key={automation.id}
                  className="border-b border-[#1e2d4a] transition-colors hover:bg-[#1e2d4a]/30"
                >
                  <td className="px-5 py-3 font-medium text-white">{automation.name}</td>
                  <td className="px-5 py-3 text-[#94a3b8]">{automation.channel}</td>
                  <td className="px-5 py-3 text-[#94a3b8]">{automation.trigger}</td>
                  <td className="px-5 py-3">{statusBadge(automation.status)}</td>
                  <td className="px-5 py-3 text-white">{automation.sent.toLocaleString()}</td>
                  <td className="px-5 py-3 text-[#94a3b8]">{automation.lastSent}</td>
                  <td className="px-5 py-3 text-[#94a3b8]">{automation.nextScheduled}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ReportsPanel() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Reports</h2>
          <p className="mt-0.5 text-sm text-[#94a3b8]">
            Revenue, delivery, and engagement analytics across the platform
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-[#1e2d4a] px-4 py-2 text-sm font-semibold text-[#f1f5f9] transition-colors hover:bg-[#1e2d4a]"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard title="Total Revenue" value="$18,420" accent="green" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard title="Total Ad Completions" value="42,380" accent="green" icon={<CheckSquare className="h-4 w-4" />} />
        <StatCard title="Webhook Success Rate" value="99.8%" accent="green" icon={<Activity className="h-4 w-4" />} />
        <StatCard title="Avg Session Revenue" value="$0.43" accent="blue" icon={<DollarSign className="h-4 w-4" />} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RevenueTrendChart />
        <CampaignTypeChart />
      </div>

      <div className="rounded-xl border border-[#1e2d4a] bg-[#0f1629] p-6">
        <h3 className="mb-4 text-sm font-semibold text-white">Delivery Performance</h3>
        <div className="mb-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <MetricPair label="Webhooks Delivered" value="98,420" valueClassName="text-[#10b981]" />
          <MetricPair label="Webhook Success Rate" value="99.8%" valueClassName="text-[#10b981]" />
          <MetricPair label="Avg Delivery Time" value="142ms" valueClassName="text-[#3b82f6]" />
        </div>
        <p className="text-xs text-[#94a3b8]">
          All events are immutably logged with a complete audit trail available across the reporting environment.
        </p>
      </div>
    </div>
  )
}

function PlatformPreviewPanel({
  previewMode,
  onChangePreviewMode,
}: {
  previewMode: PreviewMode
  onChangePreviewMode: (mode: PreviewMode) => void
}) {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Platform Experience</h2>
        <p className="mt-1 text-sm text-[#94a3b8]">
          Review how the commercial layer appears inside the host product and across the end-user completion flow.
        </p>
      </div>

      <div className="flex w-fit gap-1 rounded-xl border border-[#1e2d4a] bg-[#0f1629] p-1">
        <button
          type="button"
          onClick={() => onChangePreviewMode('host')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            previewMode === 'host' ? 'bg-[#3b82f6] text-white' : 'text-[#94a3b8]'
          }`}
        >
          Host App View
        </button>
        <button
          type="button"
          onClick={() => onChangePreviewMode('user')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            previewMode === 'user' ? 'bg-[#3b82f6] text-white' : 'text-[#94a3b8]'
          }`}
        >
          End User Experience
        </button>
      </div>

      {previewMode === 'host' ? <HostAppSurface /> : <UserExperienceSurface />}
    </div>
  )
}

function HostAppSurface() {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-xl border border-[#e2e8f0] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="flex items-center justify-between bg-[#16a34a] px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">BookieAI</span>
          </div>
          <div className="flex gap-3 text-xs">
            <span>Home</span>
            <span className="font-medium">Live</span>
            <span>My Bets</span>
            <span>Wallet</span>
          </div>
        </div>

        <div className="space-y-3 px-4 py-3">
          <div className="rounded-xl border border-[#e2e8f0] bg-white px-4 py-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#16a34a]">● LIVE</span>
              <span className="text-xs text-[#64748b]">67'</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0f172a]">Arsenal</span>
              <span className="px-4 text-xl font-bold text-[#0f172a]">2 – 1</span>
              <span className="text-sm font-semibold text-[#0f172a]">Chelsea</span>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold text-[#0f172a]">Bet Slip</p>
            <div className="space-y-1.5">
              {[
                { label: 'Arsenal Win', odds: '1.85' },
                { label: 'Over 2.5 Goals', odds: '1.65' },
              ].map((bet) => (
                <div
                  key={bet.label}
                  className="flex items-center justify-between rounded-lg border border-[#e2e8f0] bg-white px-3 py-2 text-xs text-[#475569]"
                >
                  <span>{bet.label}</span>
                  <span className="font-semibold text-[#0f172a]">{bet.odds}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[#16a34a]/30 bg-white p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#16a34a] bg-[#16a34a]/10">
              <Layout className="h-5 w-5 text-[#16a34a]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-xs font-semibold text-[#0f172a]">
                Watch a 30s video — earn 50 bonus points
              </p>
              <p className="text-xs text-[#64748b]">Powered by BookieAI Rewards</p>
            </div>
            <button type="button" className="rounded-lg bg-[#16a34a] px-3 py-1.5 text-xs font-semibold text-white">
              Watch Now
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#1e2d4a] bg-[#0f1629] p-5 text-center">
        <p className="mb-1 text-base font-semibold text-white">Brand continuity across the commercial journey.</p>
        <p className="text-sm text-[#94a3b8]">
          The monetisation layer stays consistent with the host environment while preserving visibility, trust, and conversion flow.
        </p>
      </div>
    </div>
  )
}

function UserExperienceSurface() {
  return (
    <div className="space-y-6 rounded-xl bg-[#f8fafc] p-6">
      <div className="grid grid-cols-1 items-start justify-items-center gap-6 md:grid-cols-2">
        <div className="w-full max-w-sm">
          <div className="mb-3 inline-block rounded-full bg-[#e2e8f0] px-3 py-1 text-center text-xs font-semibold text-[#475569]">
            Before completion
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white">
            <div className="bg-[#16a34a] px-4 py-3 text-center text-sm font-bold text-white">
              BookieAI Rewards
            </div>
            <div className="mx-4 mt-4 flex h-[150px] flex-col items-center justify-center rounded-lg border border-[#e2e8f0] bg-[#f8fafc]">
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#3b82f6] bg-[#3b82f6]/10">
                <Layout className="h-5 w-5 text-[#3b82f6]" />
              </div>
              <p className="text-xs text-[#64748b]">30 second video</p>
            </div>
            <div className="mx-4 mt-3 h-1 w-full max-w-[calc(100%-2rem)] rounded-full bg-[#e2e8f0]">
              <div className="h-1 w-0 rounded-full bg-[#3b82f6]" />
            </div>
            <div className="px-4 pb-2 pt-3 text-center">
              <p className="mb-2 text-sm font-medium text-[#0f172a]">
                Complete this video to earn 50 Bonus Points
              </p>
              <div className="mb-2 inline-block rounded-full bg-[#f59e0b]/15 px-4 py-1 text-lg font-bold text-[#f59e0b]">
                50 pts
              </div>
              <p className="text-xs text-[#64748b]">0 / 30 seconds</p>
            </div>
            <div className="pb-4 text-center">
              <button
                type="button"
                disabled
                className="cursor-not-allowed rounded-lg border border-[#e2e8f0] px-4 py-1.5 text-xs text-[#64748b] opacity-30"
              >
                Skip available in 30s
              </button>
            </div>
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-3 inline-block rounded-full bg-[#10b981]/15 px-3 py-1 text-center text-xs font-semibold text-[#10b981]">
            After completion
          </div>
          <AdCompletionState />
        </div>
      </div>

      <div className="rounded-xl border border-[#e2e8f0] bg-white p-5">
        <p className="mb-1 text-sm font-semibold text-[#0f172a]">Technical assurance</p>
        <p className="text-sm text-[#64748b]">
          Completion verification remains server-side, reward events are delivered through secure webhooks, and the user flow remains brand-consistent from start to settlement.
        </p>
      </div>
    </div>
  )
}

function MetricPair({
  label,
  value,
  valueClassName = 'text-white',
}: {
  label: string
  value: string
  valueClassName?: string
}) {
  return (
    <div>
      <p className="mb-0.5 text-xs text-[#94a3b8]">{label}</p>
      <p className={`text-sm font-semibold ${valueClassName}`}>{value}</p>
    </div>
  )
}

export function PlatformPreview() {
  const [activeTab, setActiveTab] = useState<PlatformTab>('analytics')
  const [previewMode, setPreviewMode] = useState<PreviewMode>('host')

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-[1640px]">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            Client Workspace
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Explore the commercial operating environment presented across the platform.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#a9bfd7] sm:text-lg">
            Partners can review analytics, campaign management, marketing operations, reporting, and the branded user experience inside one enterprise surface.
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-[36px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.98),rgba(8,20,37,0.96))] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#ff8a3d]/20 bg-[#ff8a3d]/8 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ffcf9c]">
              Client Interface
            </p>
            <p className="text-sm text-[#f3dfc3]">
              Illustrative presentation data is applied across the workspace for commercial review.
            </p>
          </div>

          <PlatformShell activeTab={activeTab} onSelectTab={setActiveTab}>
            {activeTab === 'analytics' && <AnalyticsPanel />}
            {activeTab === 'campaigns' && <CampaignsPanel />}
            {activeTab === 'marketing' && <MarketingPanel />}
            {activeTab === 'reports' && <ReportsPanel />}
            {activeTab === 'preview' && (
              <PlatformPreviewPanel
                previewMode={previewMode}
                onChangePreviewMode={setPreviewMode}
              />
            )}
          </PlatformShell>
        </div>
      </div>
    </section>
  )
}