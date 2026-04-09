'use client'

import { useState } from 'react'
import {
  Activity,
  BarChart3,
  CheckCircle2,
  CheckSquare,
  DollarSign,
  FolderKanban,
  Home,
  LayoutDashboard,
  Mail,
  Palette,
  Rocket,
  TrendingUp,
  Workflow,
} from 'lucide-react'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa6'
import { EngagementMock } from '@/components/sections/engagement-mock'
import {
  CompletionsChart,
  RevenueChart,
} from '@/components/platform/analytics-charts'
import {
  CampaignTypeChart,
  RevenueTrendChart,
} from '@/components/platform/reports-charts'
import { campaigns, marketingAutomations } from '@/lib/mock-platform-data'

const previewTabs = [
  { id: 'dashboard', label: 'Client Dashboard', icon: LayoutDashboard },
  { id: 'onboarding', label: 'Client Onboarding', icon: Workflow },
  { id: 'branding', label: 'Brand Blending', icon: Palette },
] as const

const dashboardNav = [
  { label: 'Home', icon: Home },
  { label: 'Analytics', icon: TrendingUp },
  { label: 'Campaigns', icon: CheckSquare },
  { label: 'Marketing', icon: Workflow },
  { label: 'Reports', icon: BarChart3 },
] as const

const channelShowcase = [
  {
    label: 'WhatsApp',
    icon: FaWhatsapp,
    color: 'text-[#25D366]',
    ring: 'border-[#25D366]/30 bg-[#25D366]/12',
  },
  {
    label: 'Facebook',
    icon: FaFacebookF,
    color: 'text-[#1877F2]',
    ring: 'border-[#1877F2]/30 bg-[#1877F2]/12',
  },
  {
    label: 'Instagram',
    icon: FaInstagram,
    color: 'text-[#E1306C]',
    ring: 'border-[#E1306C]/30 bg-[#E1306C]/12',
  },
  {
    label: 'Mailing',
    icon: Mail,
    color: 'text-[#60A5FA]',
    ring: 'border-[#60A5FA]/30 bg-[#60A5FA]/12',
  },
] as const

const summaryCards = [
  {
    label: 'Total Revenue',
    value: '$18,420',
    icon: TrendingUp,
    valueClass: 'text-white',
  },
  {
    label: 'Ad Completions',
    value: '42,380',
    icon: CheckSquare,
    valueClass: 'text-white',
  },
  {
    label: 'Webhook Success Rate',
    value: '99.8%',
    icon: Activity,
    valueClass: 'text-[#10b981]',
  },
  {
    label: 'Average Session Revenue',
    value: '$0.43',
    icon: DollarSign,
    valueClass: 'text-[#60a5fa]',
  },
] as const

const campaignCommercials = {
  '1': {
    partnerName: 'Meridian Gaming Media',
    inventorySupplier: 'Premium Rewarded Video Exchange',
    ecpm: '$24.00',
  },
  '2': {
    partnerName: 'Apex Loyalty Network',
    inventorySupplier: 'Performance Referral Marketplace',
    ecpm: '$18.75',
  },
  '3': {
    partnerName: 'Summit Retail Media',
    inventorySupplier: 'Seasonal Commerce Reserve',
    ecpm: '$29.50',
  },
  '4': {
    partnerName: 'Harbor Growth Partners',
    inventorySupplier: 'House Welcome Journey Inventory',
    ecpm: '$15.20',
  },
} as const

const onboardingSteps = [
  {
    title: 'Commercial selection',
    description:
      'The client selects the commercial band, confirms rollout ownership, and aligns the deployment scope.',
    icon: DollarSign,
  },
  {
    title: 'Workspace and brand configuration',
    description:
      'Subdomain, operator identity, colours, logos, and channel permissions are configured for launch readiness.',
    icon: FolderKanban,
  },
  {
    title: 'Activation and sign-off',
    description:
      'Campaigns, messaging, webhooks, and reporting are verified before the first live client launch.',
    icon: Rocket,
  },
] as const

const onboardingChecklist = [
  'Plan selection approved',
  'Workspace naming locked',
  'Primary admin access created',
  'Brand palette and logo applied',
  'Channels connected and scheduled',
  'Reporting reviewed before go-live',
] as const

const brandBlendPoints = [
  'The client brand remains visible throughout the user journey, including reward prompts and post-completion states.',
  'Messaging channels appear as part of the operator environment instead of looking like external add-ons.',
  'The commercial engine is embedded cleanly enough that partners can understand the value with a glance.',
] as const

function campaignStatusClass(status: string) {
  if (status === 'active') {
    return 'bg-[#10b981]/15 text-[#10b981]'
  }

  if (status === 'scheduled') {
    return 'bg-[#3b82f6]/15 text-[#3b82f6]'
  }

  return 'bg-[#1e2d4a] text-[#94a3b8]'
}

function channelCardClass(channel: string) {
  if (channel === 'whatsapp') {
    return {
      icon: FaWhatsapp,
      iconClass: 'text-[#25D366]',
      surfaceClass: 'bg-[#25D366]/10',
      label: 'WhatsApp',
    }
  }

  if (channel === 'email') {
    return {
      icon: Mail,
      iconClass: 'text-[#60A5FA]',
      surfaceClass: 'bg-[#60A5FA]/10',
      label: 'Mailing',
    }
  }

  return {
    icon: FaInstagram,
    iconClass: 'text-[#E1306C]',
    surfaceClass: 'bg-[#E1306C]/10',
    label: 'Instagram / Facebook',
  }
}

export function PlatformPreview() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'onboarding' | 'branding'
  >('dashboard')

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-[1640px]">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            Client interface preview
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Review the full interface, not cropped fragments.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#a9bfd7] sm:text-lg">
            This interface view lets partners assess the operating dashboard,
            activation workspace, and brand-blended user layer in one place.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {channelShowcase.map((channel) => {
            const Icon = channel.icon

            return (
              <div
                key={channel.label}
                className={`inline-flex items-center gap-3 rounded-full border px-5 py-3 ${channel.ring}`}
              >
                <Icon className={`h-5 w-5 ${channel.color}`} />
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                  {channel.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          {previewTabs.map((tab) => {
            const Icon = tab.icon

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                  activeTab === tab.id
                    ? 'border-[#00d4ff]/30 bg-[#00d4ff]/12 text-[#7ee7ff]'
                    : 'border-white/10 bg-white/[0.03] text-[#c8d8ea] hover:bg-white/[0.06]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="mt-10 rounded-[36px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.98),rgba(8,20,37,0.96))] p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-[#ff8a3d]/20 bg-[#ff8a3d]/8 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#ffcf9c]">
              Full interface view
            </p>
            <p className="text-sm text-[#f3dfc3]">
              Each tab shows the full client-facing surface using example data
              for presentation only.
            </p>
          </div>
          {activeTab === 'dashboard' && <DashboardExperience />}
          {activeTab === 'onboarding' && <OnboardingWorkspace />}
          {activeTab === 'branding' && <BrandBlendExperience />}
        </div>

        <div className="mt-10 rounded-[36px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(8,17,31,0.96),rgba(7,19,34,0.9))] p-6 sm:p-8">
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
                Embedded brand experience
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                The branded user journey remains visible throughout partner
                review.
              </h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#a9bfd7]">
                Reward prompts, social and messaging touchpoints, and completion
                flows are presented as part of the client environment rather
                than as detached utilities.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {channelShowcase.map((channel) => {
                  const Icon = channel.icon

                  return (
                    <div
                      key={`persistent-${channel.label}`}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${channel.ring}`}
                    >
                      <Icon className={`h-4 w-4 ${channel.color}`} />
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        {channel.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#1e2d4a] bg-[#0f1629] p-4 sm:p-6">
              <EngagementMock />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardExperience() {
  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)]">
      <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
          Client workspace
        </p>
        <p className="mt-3 text-2xl font-semibold text-white">Atlas Commerce</p>
        <p className="mt-2 text-sm leading-7 text-[#8ea7c2]">
          Full operator dashboard with campaigns, reporting, messaging, and
          executive performance visibility.
        </p>

        <div className="mt-6 space-y-2">
          {dashboardNav.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                  index === 1
                    ? 'border border-[#00d4ff]/20 bg-[#00d4ff]/10 text-white'
                    : 'border border-transparent bg-white/[0.02] text-[#9eb3c9]'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-6 rounded-[24px] border border-[#1e2d4a] bg-[#0f1629] p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-[#8ea7c2]">
            Live channels
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {channelShowcase.map((channel) => {
              const Icon = channel.icon

              return (
                <div
                  key={channel.label}
                  className="flex flex-col items-center justify-center rounded-2xl border border-[#1e2d4a] bg-[#07101d] px-3 py-4 text-center"
                >
                  <Icon className={`h-5 w-5 ${channel.color}`} />
                  <span className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#dce8f5]">
                    {channel.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-6">
        <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
                Executive performance view
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-white">
                Revenue, campaigns, messaging, and reporting in one canvas.
              </h3>
            </div>
            <div className="rounded-full border border-[#10b981]/20 bg-[#10b981]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#10b981]">
              Commercial presentation ready
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-[#1e2d4a] bg-[#0f1629] p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#94a3b8]">{item.label}</p>
                    <Icon className="h-4 w-4 text-[#00d4ff]" />
                  </div>
                  <p
                    className={`mt-4 text-3xl font-semibold ${item.valueClass}`}
                  >
                    {item.value}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <RevenueChart />
            <CompletionsChart />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6">
            <SectionHeader
              title="Campaign control"
              subtitle="Active, scheduled, and draft flows with partner, inventory, and eCPM detail."
            />
            <div className="mt-5 space-y-3">
              {campaigns.map((campaign) => {
                const commercials =
                  campaignCommercials[
                    campaign.id as keyof typeof campaignCommercials
                  ]

                return (
                  <div
                    key={campaign.id}
                    className="rounded-[20px] border border-[#1e2d4a] bg-[#0f1629] px-5 py-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{campaign.name}</p>
                      <span className="rounded bg-[#1e2d4a] px-2 py-0.5 text-xs text-[#94a3b8]">
                        {campaign.type}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-semibold ${campaignStatusClass(campaign.status)}`}
                      >
                        {campaign.status[0].toUpperCase() +
                          campaign.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-3 text-sm text-[#dce8f5] md:grid-cols-4">
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

                    <div className="mt-4 grid gap-3 rounded-[18px] border border-[#1e2d4a] bg-[#09121f] p-4 text-xs text-[#a9bfd7] md:grid-cols-3">
                      <div>
                        <p className="uppercase tracking-[0.16em] text-[#7ee7ff]">
                          Paying Partner
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {commercials.partnerName}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.16em] text-[#7ee7ff]">
                          Inventory Supplier
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {commercials.inventorySupplier}
                        </p>
                      </div>
                      <div>
                        <p className="uppercase tracking-[0.16em] text-[#7ee7ff]">
                          eCPM
                        </p>
                        <p className="mt-2 text-sm font-medium text-white">
                          {commercials.ecpm}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6">
              <SectionHeader
                title="Messaging and social orchestration"
                subtitle="Channels are visible before the detail copy is read."
              />
              <div className="mt-5 grid gap-3">
                {marketingAutomations.slice(0, 3).map((automation) => {
                  const channel = channelCardClass(automation.channel)
                  const Icon = channel.icon

                  return (
                    <div
                      key={automation.id}
                      className="rounded-[20px] border border-[#1e2d4a] bg-[#0f1629] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-xl ${channel.surfaceClass}`}
                        >
                          <Icon className={`h-5 w-5 ${channel.iconClass}`} />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {automation.name}
                          </p>
                          <p className="text-xs text-[#94a3b8]">
                            {channel.label} · {automation.status}
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

            <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6">
              <SectionHeader
                title="Reporting"
                subtitle="Trend and category performance surfaced side by side."
              />
              <div className="mt-5 grid gap-5">
                <RevenueTrendChart />
                <CampaignTypeChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OnboardingWorkspace() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6 sm:p-7">
        <SectionHeader
          title="Client onboarding workspace"
          subtitle="A full onboarding workspace with visible progress and launch ownership."
        />

        <div className="mt-6 flex items-center gap-3 overflow-x-auto pb-1">
          {[1, 2, 3].map((step, index) => (
            <div key={step} className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/10 text-sm font-semibold text-[#7ee7ff]">
                0{step}
              </div>
              {index < 2 && <div className="h-px w-16 bg-[#1e2d4a] sm:w-24" />}
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {onboardingSteps.map((step) => {
            const Icon = step.icon

            return (
              <div
                key={step.title}
                className="rounded-[20px] border border-[#1e2d4a] bg-[#0f1629] p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00d4ff]/10 text-[#7ee7ff]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-white">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[#a9bfd7]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6 sm:p-7">
        <div className="rounded-[24px] border border-[#1e2d4a] bg-[#0f1629] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
                Workspace setup
              </p>
              <h3 className="mt-2 text-3xl font-semibold text-white">
                Atlas Commerce
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#a9bfd7]">
                Growth operator rollout with brand assets applied, reporting
                ready, and launch controls staged for approval.
              </p>
            </div>
            <div className="rounded-full border border-[#10b981]/20 bg-[#10b981]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#10b981]">
              Ready for launch review
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[20px] border border-[#1e2d4a] bg-[#07101d] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8ea7c2]">
                Selected commercial band
              </p>
              <p className="mt-3 text-xl font-semibold text-white">
                Growth Operator · 500K to 1.5M MAU
              </p>
              <p className="mt-2 text-sm leading-7 text-[#a9bfd7]">
                Managed rollout with dashboard setup, brand configuration,
                messaging enablement, and reporting activation.
              </p>
            </div>

            <div className="rounded-[20px] border border-[#1e2d4a] bg-[#07101d] p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-[#8ea7c2]">
                Launch checklist
              </p>
              <div className="mt-3 space-y-3">
                {onboardingChecklist.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 text-sm text-[#dce8f5]"
                  >
                    <CheckCircle2 className="mt-1 h-4 w-4 text-[#10b981]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Brand assets applied"
              value="12"
              detail="Logo, colours, dashboard accents, and campaign surfaces"
            />
            <MetricCard
              label="Channels activated"
              value="4"
              detail="WhatsApp, Facebook, Instagram, and mailing enabled"
            />
            <MetricCard
              label="Go-live target"
              value="7 days"
              detail="From commercial sign-off to first live campaign"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function BrandBlendExperience() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6 sm:p-7">
        <SectionHeader
          title="Brand-blended user experience"
          subtitle="The embedded reward flow is displayed as a full visual environment, not an abstract explanation."
        />

        <div className="mt-6 flex flex-wrap gap-3">
          {channelShowcase.map((channel) => {
            const Icon = channel.icon

            return (
              <div
                key={channel.label}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${channel.ring}`}
              >
                <Icon className={`h-4 w-4 ${channel.color}`} />
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                  {channel.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-6 rounded-[24px] border border-[#1e2d4a] bg-[#0f1629] p-4 sm:p-6">
          <EngagementMock />
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6 sm:p-7">
          <SectionHeader
            title="Embedded commercial value"
            subtitle="The value should be obvious visually before the supporting copy is read."
          />
          <div className="mt-5 space-y-4">
            {brandBlendPoints.map((point) => (
              <div
                key={point}
                className="rounded-[20px] border border-[#1e2d4a] bg-[#0f1629] p-5 text-sm leading-7 text-[#dce8f5]"
              >
                {point}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#1e2d4a] bg-[#09121f] p-6 sm:p-7">
          <SectionHeader
            title="Channel presence"
            subtitle="Messaging and social delivery remain visible as part of the product surface."
          />
          <div className="mt-5 grid grid-cols-2 gap-4">
            {channelShowcase.map((channel) => {
              const Icon = channel.icon

              return (
                <div
                  key={channel.label}
                  className="rounded-[20px] border border-[#1e2d4a] bg-[#0f1629] p-5 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-[#07101d]">
                    <Icon className={`h-5 w-5 ${channel.color}`} />
                  </div>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                    {channel.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-[#94a3b8]">{subtitle}</p>
    </div>
  )
}

function MetricCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string
  detail: string
}) {
  return (
    <div className="rounded-[20px] border border-[#1e2d4a] bg-[#07101d] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[#8ea7c2]">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-7 text-[#a9bfd7]">{detail}</p>
    </div>
  )
}
