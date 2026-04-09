import {
  BarChart3,
  CheckSquare,
  Mail,
  MessageCircle,
  Share2,
  TrendingUp,
  Activity,
  DollarSign,
} from 'lucide-react'
import { campaigns } from '@/lib/mock-platform-data'

const previewSurfaces = [
  'Analytics dashboard',
  'Campaign management',
  'Marketing automation',
  'Reporting and export view',
] as const

const channelSummaries = [
  {
    label: 'WhatsApp Status',
    detail: '2 active automations',
    last: 'Last sent: 2 hours ago',
    next: 'Next: Continuous',
    icon: MessageCircle,
    color: 'text-[#25D366]',
    background: 'bg-[#25D366]/10',
  },
  {
    label: 'Mailing Campaigns',
    detail: '1 active automation',
    last: 'Last sent: 3 days ago',
    next: 'Next: Apr 7, 09:00',
    icon: Mail,
    color: 'text-[#3b82f6]',
    background: 'bg-[#3b82f6]/10',
  },
  {
    label: 'Social Media',
    detail: '1 active automation',
    last: 'Last sent: 1 day ago',
    next: 'Next: Apr 5, 15:00',
    icon: Share2,
    color: 'text-[#8b5cf6]',
    background: 'bg-[#8b5cf6]/10',
  },
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
    label: 'Avg Session Revenue',
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

export function PlatformV1Preview() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            V1 platform prototype
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Show the actual client-facing prototype, not detached metric tiles.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
            This preview reflects the real v1 platform tabs already inside the
            product: analytics, campaigns, marketing, and reports. Public access
            remains intentionally detached from production, so the page now
            carries the prototype story directly instead of sending users into a
            gated route.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {previewSurfaces.map((surface) => (
              <span
                key={surface}
                className="inline-flex rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7ee7ff]"
              >
                {surface}
              </span>
            ))}
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
            <div className="mt-5 rounded-[22px] border border-[#1e2d4a] bg-[#0f1629] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">
                  Campaign Performance
                </p>
                <span className="text-xs text-[#3b82f6] uppercase tracking-[0.18em]">
                  Snapshot of active flows
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {campaigns.slice(0, 4).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="grid gap-2 rounded-[18px] border border-[#1e2d4a] px-4 py-3 md:grid-cols-[1.4fr_0.8fr_0.6fr_0.8fr] md:items-center"
                  >
                    <div>
                      <p className="font-medium text-white">{campaign.name}</p>
                      <p className="text-xs text-[#94a3b8]">{campaign.type}</p>
                    </div>
                    <p className="text-[#dce8f5]">
                      {campaign.impressions.toLocaleString()} impressions
                    </p>
                    <span
                      className={`inline-flex w-fit rounded px-2 py-0.5 text-xs font-semibold ${statusBadge(campaign.status)}`}
                    >
                      {campaign.status[0].toUpperCase() +
                        campaign.status.slice(1)}
                    </span>
                    <p className="text-right text-white">
                      {campaign.revenue > 0
                        ? `$${campaign.revenue.toLocaleString()}`
                        : '—'}
                    </p>
                  </div>
                ))}
              </div>
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
                          ? `${campaign.conversionRate}% conv. rate`
                          : '— conv. rate'}
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
                  {channelSummaries.map((channel) => {
                    const Icon = channel.icon
                    return (
                      <div
                        key={channel.label}
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
                              {channel.label}
                            </p>
                            <p className={`text-xs ${channel.color}`}>
                              {channel.detail}
                            </p>
                          </div>
                        </div>
                        <p className="mt-3 text-xs text-[#94a3b8]">
                          {channel.last}
                        </p>
                        <p className="text-xs text-[#94a3b8]">{channel.next}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-[30px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.96),rgba(8,20,37,0.92))] p-6">
                <PreviewHeader title="Reports" />
                <div className="mt-5 grid gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    {reportSummary.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[18px] border border-[#1e2d4a] bg-[#0f1629] p-4"
                      >
                        <p className="text-xs text-[#94a3b8]">{item.label}</p>
                        <p
                          className={`mt-3 text-2xl font-semibold ${item.accent}`}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
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
                          Avg Delivery Time
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
              Prototype note
            </p>
            <p className="mt-2 max-w-4xl text-sm leading-7 text-[#a9bfd7]">
              This section shows the real v1 prototype surfaces already inside
              the product. It is positioned here as a visual proof of product
              direction and reporting depth, not as a public software workspace.
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
          Prototype mode · Live data not yet connected
        </p>
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#ff8a3d]/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#ffb36e]">
        Snapshot
        <BarChart3 className="h-3.5 w-3.5" />
      </div>
    </div>
  )
}
