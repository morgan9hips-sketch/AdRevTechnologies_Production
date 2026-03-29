'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Zap, Code, Play, Mail, MessageSquare, GitMerge, Video, ShoppingBag, Gamepad2, Wallet, Trophy, Signal, Gift } from 'lucide-react'
import { RevenueCalculator } from '@/components/sections/revenue-calculator'
import { EngagementMock } from '@/components/sections/engagement-mock'

const pricingTiers = [
  {
    name: 'Starter',
    price: '$149',
    originalPrice: '$249',
    period: '/mo',
    badge: null,
    discountBadge: true,
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
    cta: 'Join the Waitlist',
    ctaHref: '/#waitlist',
    highlighted: false,
    enterpriseBands: null,
  },
  {
    name: 'Business',
    price: '$349',
    originalPrice: '$599',
    period: '/mo',
    badge: 'Most Popular',
    discountBadge: true,
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
    cta: 'Join the Waitlist',
    ctaHref: '/#waitlist',
    highlighted: true,
    enterpriseBands: null,
  },
  {
    name: 'Enterprise',
    price: 'From $899',
    originalPrice: 'From $1,499',
    period: '/mo',
    badge: null,
    discountBadge: true,
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
    enterpriseBands: [
      { label: 'Up to 250k MAU', price: '$899/mo' },
      { label: '251k – 1M MAU', price: '$1,499/mo' },
      { label: '1M – 5M MAU', price: '$2,499/mo' },
      { label: '5M+ MAU', price: 'Custom' },
    ],
  },
]

const mechanics = [
  {
    icon: Video,
    title: 'Video Ad Engine',
    accentColor: '#3b82f6',
    description:
      'Serve rewarded video ads inside your platform. Completion is tracked server-side. Reward event fires automatically on verified completion.',
  },
  {
    icon: ShoppingBag,
    title: 'Store Redirects',
    accentColor: '#f59e0b',
    description:
      'Drive users from campaigns directly to your product or store page. Every click is tracked and tied to a campaign event.',
  },
  {
    icon: GitMerge,
    title: 'Referral Engine',
    accentColor: '#8b5cf6',
    description:
      'Unique referral links per user. When a referred user converts, reward events fire to both parties via webhook instantly.',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp Distribution',
    accentColor: '#f43f5e',
    description:
      'Distribute promotional video content through publisher WhatsApp Status networks. Enterprise tier. Amplifies campaign reach beyond your app.',
  },
  {
    icon: Mail,
    title: 'Mailing Campaigns',
    accentColor: '#10b981',
    description:
      'Trigger reward notifications, re-engagement emails, and offer broadcasts through your own sender domain. Enterprise tier.',
  },
]

const trustSignals = [
  {
    icon: Shield,
    title: 'Enterprise Security',
    accentColor: '#f59e0b',
    description:
      'HMAC webhook verification, JWT-scoped API keys, rate limiting per tier, and a complete immutable event ledger for every transaction.',
  },
  {
    icon: Zap,
    title: 'Zero User Lock-in',
    accentColor: '#8b5cf6',
    description:
      'You own your users, your loyalty data, and your platform. Our engine plugs in and out without touching your database or auth.',
  },
  {
    icon: Code,
    title: 'API-First Design',
    accentColor: '#3b82f6',
    description:
      'RESTful endpoints, Swagger docs live at /docs, webhook delivery with retry logic, and SDK support. Integrate in days.',
  },
]

const industries = [
  { icon: ShoppingBag, label: 'Retail & eCommerce', accentColor: '#f59e0b' },
  { icon: Gamepad2, label: 'Gaming Platforms', accentColor: '#8b5cf6' },
  { icon: Wallet, label: 'Fintech & Wallets', accentColor: '#10b981' },
  { icon: Trophy, label: 'Sports Betting', accentColor: '#f43f5e' },
  { icon: Signal, label: 'Telecoms', accentColor: '#3b82f6' },
  { icon: Gift, label: 'Loyalty Programs', accentColor: '#f59e0b' },
]

export default function HomePage() {
  const [waitlistName, setWaitlistName] = useState('')
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false)
  const [waitlistLoading, setWaitlistLoading] = useState(false)
  const [waitlistError, setWaitlistError] = useState('')

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setWaitlistLoading(true)
    setWaitlistError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: waitlistName, email: waitlistEmail }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || 'Failed')
      }
      setWaitlistSubmitted(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      setWaitlistError(message === 'Failed' ? 'Something went wrong. Please try again.' : message)
    } finally {
      setWaitlistLoading(false)
    }
  }

  return (
    <div className="bg-[#080d1a] text-[#f1f5f9]">
      {/* Section 1 — Hero */}
      <section id="hero" className="bg-[#080d1a] py-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              <span className="text-[#f1f5f9]">Engagement and Rewards Infrastructure.</span>
              <br />
              <span className="text-[#f1f5f9]">API and SDK. </span>
              <span className="text-[#3b82f6]">Your Brand. Our Engine.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#10b981] font-medium max-w-3xl mx-auto mb-6">
              More Engagement. More Retention. Zero Access to Your Users or Data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#waitlist"
                className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Join the Waitlist
              </a>
              <Link
                href="/docs"
                className="inline-block border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Read the Docs
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <EngagementMock />
            <RevenueCalculator />
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

      {/* Section 4 — V1 Mechanics */}
      <section className="bg-[#0f1629] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">How the Engine Works</h2>
            <p className="text-[#94a3b8] text-lg">Five modules. One API integration.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mechanics.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-6"
                  style={{ borderLeft: `2px solid ${item.accentColor}` }}
                >
                  <Icon className="h-7 w-7 mb-4" style={{ color: item.accentColor }} />
                  <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">{item.title}</h3>
                  <p className="text-[#94a3b8] text-sm">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 6 — ARR Framing */}
      <section className="bg-[#0f1629] py-24 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">
            You Already Have the Users
          </h2>
          <p className="text-[#94a3b8] text-lg mb-14">
            No new acquisition cost. No new infrastructure. Just incremental revenue from users you already have.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                stat: '$0 extra acquisition cost',
                desc: 'Monetise users you already paid to acquire',
                accent: '#f59e0b',
              },
              {
                stat: 'Days not months',
                desc: 'Integrate via API and go live in under a week',
                accent: '#8b5cf6',
              },
              {
                stat: 'Your brand, always',
                desc: 'Platform blending on every tier — users never see Ad Rev',
                accent: '#f43f5e',
              },
            ].map((block) => (
              <div
                key={block.stat}
                className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-8"
                style={{ borderTop: `2px solid ${block.accent}` }}
              >
                <div className="text-2xl font-bold mb-2" style={{ color: block.accent }}>
                  {block.stat}
                </div>
                <div className="text-[#94a3b8]">{block.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 — Waitlist */}
      <section id="waitlist" className="bg-[#080d1a] py-24 px-6">
        <div className="mx-auto max-w-xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#f1f5f9] mb-4">
              Join the Waitlist
            </h2>
            <p className="text-[#94a3b8] text-lg">
              The platform is available upon purchase. Early access is limited — complete the form below to secure your spot and we will be in touch within 24–48 hours.
            </p>
          </div>
          {waitlistSubmitted ? (
            <div className="bg-[#10b981]/10 border border-[#10b981]/30 rounded-xl p-8 text-center">
              <p className="text-[#10b981] font-semibold text-lg">You are on the list.</p>
              <p className="text-[#94a3b8] text-sm mt-2">We will reach out within 24–48 hours to get you set up.</p>
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="space-y-4">
              <div>
                <label htmlFor="waitlist-name" className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="waitlist-name"
                  type="text"
                  required
                  value={waitlistName}
                  onChange={(e) => setWaitlistName(e.target.value)}
                  placeholder="Jane Smith"
                  className="block w-full rounded-lg bg-[#0f1629] border border-[#1e2d4a] text-[#f1f5f9] px-4 py-2.5 text-sm placeholder:text-[#94a3b8]/40 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>
              <div>
                <label htmlFor="waitlist-email" className="block text-sm font-medium text-[#94a3b8] mb-1.5">
                  Work Email <span className="text-red-400">*</span>
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="jane@yourcompany.com"
                  className="block w-full rounded-lg bg-[#0f1629] border border-[#1e2d4a] text-[#f1f5f9] px-4 py-2.5 text-sm placeholder:text-[#94a3b8]/40 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>
              {waitlistError && (
                <div className="rounded-lg bg-red-900/20 border border-red-700/40 p-3">
                  <p className="text-sm text-red-400">{waitlistError}</p>
                </div>
              )}
              <button
                type="submit"
                disabled={waitlistLoading}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {waitlistLoading ? 'Submitting...' : 'Complete Form — Join the Waitlist'}
              </button>
              <p className="text-center text-xs text-[#94a3b8]/60">
                No commitment. Platform access confirmed on purchase.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Section 8 — Pricing */}
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
                <div className="mb-1">
                  {tier.originalPrice && (
                    <span className="text-sm text-[#94a3b8] line-through mr-2">{tier.originalPrice}{tier.period}</span>
                  )}
                  <span className="text-3xl font-bold text-[#f1f5f9]">{tier.price}</span>
                  {tier.period && (
                    <span className="text-[#94a3b8] text-sm">{tier.period}</span>
                  )}
                </div>
                {tier.discountBadge && (
                  <div className="mb-4">
                    <span className="inline-block bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-xs font-semibold px-2.5 py-1 rounded-md">
                      Limited Time Offer — Early Access Pricing
                    </span>
                    <p className="text-[10px] text-[#94a3b8]/70 mt-1">
                      Lock in this rate for life. Price increases when early access closes.
                    </p>
                  </div>
                )}
                <p className="text-[#94a3b8] text-sm mb-6">{tier.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[#94a3b8]">
                      <span className="text-[#10b981] mt-0.5 flex-shrink-0">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {tier.enterpriseBands && (
                  <div className="mb-6 bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Volume Pricing</p>
                    <ul className="space-y-2">
                      {tier.enterpriseBands.map((band) => (
                        <li key={band.label} className="flex justify-between items-center text-xs">
                          <span className="text-[#94a3b8]">{band.label}</span>
                          <span className="text-[#f1f5f9] font-semibold">{band.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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

      {/* Section 9 — Trust Signals */}
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
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${signal.accentColor}1a`,
                        border: `1px solid ${signal.accentColor}33`,
                      }}
                    >
                      <Icon className="h-7 w-7" style={{ color: signal.accentColor }} />
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

      {/* Section 10 — Industries */}
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
                  style={{ borderTop: `2px solid ${industry.accentColor}` }}
                >
                  <Icon className="h-8 w-8" style={{ color: industry.accentColor }} />
                  <span className="text-[#f1f5f9] font-medium text-sm">{industry.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 11 — CTA Footer */}
      <section className="bg-[#3b82f6] py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to add engagement to your platform?
          </h2>
          <p className="text-white/80 text-lg mb-10">
            See exactly how Ad Rev integrates with your platform — live, in your stack, in days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#waitlist"
              className="inline-block bg-white text-[#3b82f6] hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Join the Waitlist
            </a>
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
