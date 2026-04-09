'use client'

import {
  Activity,
  BarChart3,
  CheckSquare,
  DollarSign,
  Home,
  Mail,
  MessageCircle,
  Share2,
  TrendingUp,
} from 'lucide-react'
import { campaigns, marketingAutomations } from '@/lib/mock-platform-data'
import {
  CompletionsChart,
  RevenueChart,
} from '@/components/platform/analytics-charts'
import {
  CampaignTypeChart,
  RevenueTrendChart,
} from '@/components/platform/reports-charts'

const dashboardTabs = [
  { label: 'Home', icon: Home },
  { label: 'Analytics', icon: TrendingUp },
  { label: 'Campaigns', icon: CheckSquare },
  { label: 'Marketing', icon: MessageCircle },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Client View', icon: DollarSign },
] as const

const reportSummary = [
  {
    label: 'Total Revenue',
    value: '$18,420',
    accent: 'text-white',
    icon: TrendingUp,
  },
  {
    label: 'Ad Completions',
    value: '42,380',
    accent: 'text-white',
    icon: CheckSquare,
  },
  {
    label: 'Webhook Success Rate',
    value: '99.8%',
    accent: 'text-[#10b981]',
    icon: Activity,
  },
  {
    label: 'Average Session Revenue',
    value: '$0.43',
    accent: 'text-[#60a5fa]',
    icon: DollarSign,
  },
] as const

function statusBadge(status: string) {
  if (status === 'active') {
    return 'bg-[#10b981]/15 text-[#10b981]'
  }
  if (status === 'scheduled') {
    return 'bg-[#3b82f6]/15 text-[#3b82f6]'
  }
  return 'bg-[#1e2d4a] text-[#94a3b8]'
}

function channelPresentation(channel: string) {
  if (channel === 'whatsapp') {
    return {
      icon: MessageCircle,
      color: 'text-[#25D366]',
      background: 'bg-[#25D366]/10',
    }
  }

  if (channel === 'email') {
    return {
      icon: Mail,
      color: 'text-[#3b82f6]',
      background: 'bg-[#3b82f6]/10',
    }
  }

  return {
    icon: Share2,
    color: 'text-[#8b5cf6]',
    background: 'bg-[#8b5cf6]/10',
  }
}

export function PlatformV1Preview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            Client dashboard preview
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Show partners how the client dashboard will look in production.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
            This view presents the full client dashboard structure in the same
            order a customer would experience it: analytics, campaigns,
            marketing, reports, and executive visibility. It is designed to show
            the commercial presentation standard rather than a stripped back
            placeholder.
          </p>
          <div className="mt-8 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {dashboardTabs.map((tab, index) => {
                const Icon = tab.icon

                return (
                  <div
                    key={tab.label}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                      index === 1
                        ? 'border-[#00d4ff]/30 bg-[#00d4ff]/12 text-[#7ee7ff]'
                        : 'border-white/10 bg-white/[0.03] text-[#c8d8ea]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-2">
          <div className="rounded-[30px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.96),rgba(8,20,37,0.92))] p-6">
            <PreviewHeader title="Analytics Dashboard" />
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {reportSummary.map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.label}
                    className="rounded-[20px] border border-[#1e2d4a] bg-[#0f1629] p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-[#94a3b8]">{item.label}</p>
                      <Icon className="h-4 w-4 text-[#00d4ff]" />
                    </div>
                    <p className={`mt-4 text-3xl font-semibold ${item.accent}`}>
                      {item.value}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              <RevenueChart />
              <CompletionsChart />
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[30px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.96),rgba(8,20,37,0.92))] p-6">
              <PreviewHeader title="Campaigns" />
              <div className="mt-5 space-y-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="rounded-[18px] border border-[#1e2d4a] bg-[#0f1629] px-4 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{campaign.name}</p>
                      <span className="rounded bg-[#1e2d4a] px-2 py-0.5 text-xs text-[#94a3b8]">
                        {campaign.type}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${statusBadge(campaign.status)}`}
                      >
                        {campaign.status[0].toUpperCase() +
                          campaign.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-3 text-sm text-[#dce8f5] sm:grid-cols-4">
                      <p>{campaign.impressions.toLocaleString()} impressions</p>
                      <p>{campaign.completions.toLocaleString()} completions</p>
                      <p>
                        {campaign.revenue > 0
                          ? `$${campaign.revenue.toLocaleString()} revenue`
                          : '— revenue'}
                      </p>
                      <p>
                        {campaign.conversionRate > 0
                          ? `${campaign.conversionRate}% conversion rate`
                          : '— conversion rate'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[30px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.96),rgba(8,20,37,0.92))] p-6">
                <PreviewHeader title="Marketing Hub" />
                <div className="mt-5 grid gap-3">
                  {marketingAutomations.map((automation) => {
                    const channel = channelPresentation(automation.channel)
                    const Icon = channel.icon

                    return (
                      <div
                        key={automation.id}
                        className="rounded-[18px] border border-[#1e2d4a] bg-[#0f1629] p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg ${channel.background}`}
                          >
                            <Icon className={`h-4 w-4 ${channel.color}`} />
                          </div>
                          <div>
                            <p className="font-medium text-white">
                              {automation.name}
                            </p>
                            <p className={`text-xs ${channel.color}`}>
                              {automation.channel.toUpperCase()} ·{' '}
                              {automation.status}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-[#94a3b8]">
                          Trigger: {automation.trigger}
                        </p>
                        <p className="text-xs text-[#94a3b8]">
                          Last sent: {automation.lastSent} · Next:{' '}
                          {automation.nextScheduled}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[30px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.96),rgba(8,20,37,0.92))] p-6">
                <PreviewHeader title="Reports" />
                <div className="mt-5 grid gap-5">
                  <RevenueTrendChart />
                  <CampaignTypeChart />
                  <div className="rounded-[18px] border border-[#1e2d4a] bg-[#0f1629] p-4">
                    <p className="text-sm font-semibold text-white">
                      Delivery Performance
                    </p>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <p className="text-xs text-[#94a3b8]">
                          Webhooks Delivered
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#10b981]">
                          98,420
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#94a3b8]">
                          Webhook Success Rate
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#10b981]">
                          99.8%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#94a3b8]">
                          Average Delivery Time
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-[#60a5fa]">
                          142ms
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[28px] border border-[#ff8a3d]/20 bg-[#0b1322]/80 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
              Dashboard note
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-[#a9bfd7]">
              This section is designed to show partners the expected standard of
              the client experience: executive reporting, campaign control,
              marketing orchestration, and delivery visibility presented in one
              commercial dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

function PreviewHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-1 text-xs text-[#94a3b8]">
          Illustrative client view for commercial presentation
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#ff8a3d]/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb36e]">
        Dashboard preview
        <BarChart3 className="h-3.5 w-3.5" />
      </div>
    </div>
  )
}
