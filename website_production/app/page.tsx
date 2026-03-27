import Link from 'next/link'
import { Shield, Zap, Code, Play, Mail, MessageSquare, GitMerge, Video, ShoppingBag, Gamepad2, Wallet, Trophy, Signal, Gift } from 'lucide-react'
import { RevenueCalculator } from '@/components/sections/revenue-calculator'
import { EngagementMock } from '@/components/sections/engagement-mock'

const pricingTiers = [
  {
    name: 'Starter',
    price: '$149',
    period: '/mo',
    badge: null,
    description: 'Core engagement infrastructure. API and SDK. Deploy in days.',
    features: [
      'Video Ad Engine (API + SDK)',
      'Store Redirects — post-ad discount redirect',
      'Referral Engine',
      'Analytics Dashboard',
      'API Access & Webhooks',
      'Webhook Retry Logic',
      'Audit Trail & Transaction Log',
      'Frequency Capping (per user per day)',
      'Platform Blending — your brand on every interaction',
      '"Powered by Ad Rev" attribution',
      '10% ad revenue share',
    ],
    cta: 'Get a Demo',
    ctaHref: '/onboarding',
    highlighted: false,
  },
  {
    name: 'Business',
    price: '$349',
    period: '/mo',
    badge: 'Most Popular',
    description: 'Full campaign toolkit for platforms ready to scale engagement.',
    features: [
      'Everything in Starter',
      'Custom Campaigns (Summer Sale, Black Friday etc.)',
      'Mailing Campaigns — re-engagement & offer broadcasts',
      'WhatsApp Status Ads — promotional video via Status networks',
      'Campaign Management Dashboard',
      'Campaign Scheduling — start and end dates',
      'Advanced Analytics & Reporting',
      '"Powered by Ad Rev" attribution',
      '8% ad revenue share',
    ],
    cta: 'Get a Demo',
    ctaHref: '/onboarding',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Contact Sales',
    period: '',
    badge: null,
    description: 'Complete infrastructure. Zero attribution. Full control.',
    features: [
      'Everything in Business',
      'WhatsApp Direct Message Campaigns',
      'Full White-label — zero Ad Rev attribution removed entirely',
      'Custom SDK Theming — match your design system exactly',
      'Deep Custom Integration — your stack, your schema',
      'Priority Webhook SLA',
      'Dedicated Account Manager',
      'Dedicated Support + SLA',
      'Custom Revenue Share',
    ],
    cta: 'Contact Sales',
    ctaHref: 'mailto:contact@adrevtechnologies.com',
    highlighted: false,
  },
]

const mechanics = [
  {
    icon: Video,
    title: 'Video Ad Engine',
    description:
      'Serve rewarded video ads inside your platform. Completion is tracked server-side. Reward event fires automatically on verified completion.',
  },
  {
    icon: ShoppingBag,
    title: 'Store Redirects',
    description:
      'Drive users from campaigns directly to your product or store page. Every click is tracked and tied to a campaign event.',
  },
  {
    icon: GitMerge,
    title: 'Referral Engine',
    description:
      'Unique referral links per user. When a referred user converts, reward events fire to both parties via webhook instantly.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Distribution',
    description:
      'Distribute promotional video content through publisher WhatsApp Status networks. Enterprise tier. Amplifies campaign reach beyond your app.',
  },
  {
    icon: Mail,
    title: 'Mailing Campaigns',
    description:
      'Trigger reward notifications, re-engagement emails, and offer broadcasts through your own sender domain. Enterprise tier.',
  },
]

const trustSignals = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'HMAC webhook verification, JWT-scoped API keys, rate limiting per tier, and a complete immutable event ledger for every transaction.',
  },
  {
    icon: Zap,
    title: 'Zero User Lock-in',
    description:
      'You own your users, your loyalty data, and your platform. Our engine plugs in and out without touching your database or auth.',
  },
  {
    icon: Code,
    title: 'API-First Design',
    description:
      'RESTful endpoints, Swagger docs live at /docs, webhook delivery with retry logic, and SDK support. Integrate in days.',
  },
]

const industries = [
  { icon: ShoppingBag, label: 'Retail & eCommerce' },
  { icon: Gamepad2, label: 'Gaming Platforms' },
  { icon: Wallet, label: 'Fintech & Wallets' },
  { icon: Trophy, label: 'Sports Betting' },
  { icon: Signal, label: 'Telecoms' },
  { icon: Gift, label: 'Loyalty Programs' },
]

export default function HomePage() {
  return (
    <div className="bg-[#080d1a] text-[#f1f5f9]">
      {/* Section 1 — Hero */}
      <section id="hero" className="bg-[#080d1a] py-28 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="text-[#f1f5f9]">Engagement and Rewards Infrastructure.</span>
            <br />
            <span className="text-[#f1f5f9]">API and SDK. </span>
            <span className="text-[#3b82f6]">Your Brand. Our Engine.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#10b981] font-medium max-w-3xl mx-auto mb-4">
            More Engagement. More Retention. Zero Access to Your Users or Data.
          </p>
          <p className="text-lg text-[#94a3b8] max-w-3xl mx-auto mb-10">
            White-label API and SDK for rewarded video, referrals and campaigns.
            Live on your platform in days. You keep your users, your auth, your database.
            We run the engine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Get a Demo
            </Link>
            <Link
              href="/docs"
              className="inline-block border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Section 2 — How It Works */}
      <section id="how-it-works" className="bg-[#0f1629] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">How It Works</h2>
            <p className="text-[#94a3b8] text-lg">Three steps from integration to incremental revenue</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '1',
                title: 'Bring Your Users & Inventory',
                body: 'Connect your existing platform, ad inventory, and loyalty system via our API. Your users, your data, your brand.',
              },
              {
                number: '2',
                title: 'We Handle the Engine',
                body: 'Completion tracking, reward event firing, campaign rules, fraud detection, and analytics — all managed by our infrastructure.',
              },
              {
                number: '3',
                title: 'Revenue Fires Back to You',
                body: 'Reward events return to your loyalty system via webhook. You define what the points mean. We handle the mechanics.',
              },
            ].map((step) => (
              <div key={step.number} className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-8">
                <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-bold text-lg mb-5">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-[#f1f5f9] mb-3">{step.title}</h3>
                <p className="text-[#94a3b8]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — UI Mockup */}
      <section className="bg-[#080d1a] py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">What Your Users See</h2>
          <p className="text-[#94a3b8] text-lg mb-12">Your brand. Your UI. Our engine running underneath.</p>
          <EngagementMock />
        </div>
      </section>

      {/* Section 4 — V1 Mechanics */}
      <section className="bg-[#0f1629] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">V1 Engagement Mechanics</h2>
            <p className="text-[#94a3b8] text-lg">Five modules. One API integration.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanics.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-6"
                >
                  <Icon className="h-7 w-7 text-[#3b82f6] mb-4" />
                  <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">{item.title}</h3>
                  <p className="text-[#94a3b8] text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 5 — Revenue Calculator */}
      <section className="bg-[#080d1a] py-24 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">
            Calculate Your Incremental Revenue
          </h2>
          <p className="text-[#94a3b8] text-lg mb-12">
            Enter your platform numbers and see your estimated annual revenue.
          </p>
          <RevenueCalculator />
        </div>
      </section>

      {/* Section 6 — ARR Framing */}
      <section className="bg-[#0f1629] py-24 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">
            You Already Have the Users
          </h2>
          <p className="text-[#94a3b8] text-lg mb-14">
            The highest ROI engagement channel is the one you already own.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stat: '$0 extra acquisition cost',
                desc: 'Monetise users you already paid to acquire',
              },
              {
                stat: 'Days not months',
                desc: 'Integrate via API and go live in under a week',
              },
              {
                stat: 'Your brand, always',
                desc: 'Platform blending on every tier — users never see Ad Rev',
              },
            ].map((block) => (
              <div key={block.stat} className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-8">
                <div className="text-2xl font-bold text-[#10b981] mb-2">{block.stat}</div>
                <div className="text-[#94a3b8]">{block.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Pricing */}
      <section id="pricing" className="bg-[#080d1a] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-[#94a3b8] text-lg">
              All tiers include full platform blending. Your brand on every interaction.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className={`bg-[#0f1629] rounded-2xl p-8 flex flex-col border ${
                  tier.highlighted ? 'border-[#3b82f6]' : 'border-[#1e2d4a]'
                }`}
              >
                {tier.badge && (
                  <span className="self-start mb-3 inline-block bg-[#3b82f6] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-1">{tier.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#f1f5f9]">{tier.price}</span>
                  {tier.period && (
                    <span className="text-[#94a3b8] text-sm">{tier.period}</span>
                  )}
                </div>
                <p className="text-[#94a3b8] text-sm mb-6">{tier.description}</p>
                <ul className="space-y-2 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                      <span className="text-[#10b981] mt-0.5 flex-shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.ctaHref}
                  className={`block text-center font-semibold py-3 rounded-lg transition-colors ${
                    tier.highlighted
                      ? 'bg-[#3b82f6] hover:bg-[#2563eb] text-white'
                      : 'border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 8 — Trust Signals */}
      <section className="bg-[#0f1629] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">Built for Production</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustSignals.map((signal) => {
              const Icon = signal.icon
              return (
                <div key={signal.title} className="text-center">
                  <div className="flex justify-center mb-5">
                    <div className="w-14 h-14 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-[#3b82f6]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-[#f1f5f9] mb-3">{signal.title}</h3>
                  <p className="text-[#94a3b8] text-sm">{signal.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 9 — Industries */}
      <section className="bg-[#080d1a] py-24 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">
            Built for Your Industry
          </h2>
          <p className="text-[#94a3b8] text-lg mb-12">
            Any platform with existing users and an engagement gap.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {industries.map((industry) => {
              const Icon = industry.icon
              return (
                <div
                  key={industry.label}
                  className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-6 flex flex-col items-center gap-3"
                >
                  <Icon className="h-8 w-8 text-[#3b82f6]" />
                  <span className="text-[#f1f5f9] font-medium text-sm">{industry.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 10 — CTA Footer */}
      <section className="bg-[#3b82f6] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to add engagement to your platform?
          </h2>
          <p className="text-white/80 text-lg mb-10">
            Book a demo and we&apos;ll show you exactly what the integration looks like for your stack.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/onboarding"
              className="inline-block bg-white text-[#3b82f6] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Book a Demo
            </Link>
            <a
              href="mailto:contact@adrevtechnologies.com"
              className="inline-block text-white hover:text-white/80 font-semibold px-8 py-3 transition-colors underline"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
