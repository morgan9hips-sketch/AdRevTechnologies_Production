'use client'

import { useState } from 'react'
import { PrelaunchModal } from '@/components/prelaunch-modal'

const tiers = [
  {
    id: 'starter',
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
    highlighted: false,
    enterpriseBands: null,
    annualEnterpriseBands: null,
    accessWindow: '30–45 days',
    spotsTotal: 20,
    spotsRemaining: 16,
    foundingMember: true,
    annualTotal: '$1,341',
    annualPerMonth: '$111.75',
    annualSaving: '$447',
  },
  {
    id: 'business',
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
    highlighted: true,
    enterpriseBands: null,
    annualEnterpriseBands: null,
    accessWindow: '45–60 days',
    spotsTotal: 10,
    spotsRemaining: 8,
    foundingMember: true,
    annualTotal: '$3,141',
    annualPerMonth: '$261.75',
    annualSaving: '$1,047',
  },
  {
    id: 'enterprise',
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
    highlighted: false,
    enterpriseBands: [
      { label: 'Up to 250k MAU', price: '$899/mo' },
      { label: '251k – 1M MAU', price: '$1,499/mo' },
      { label: '1M – 5M MAU', price: '$2,499/mo' },
      { label: '5M+ MAU', price: 'Custom' },
    ],
    annualEnterpriseBands: [
      { label: 'Up to 250k MAU', monthly: '$899/mo', annual: '$8,091/yr', saving: 'Save $2,697' },
      { label: '251k – 1M MAU', monthly: '$1,499/mo', annual: '$13,491/yr', saving: 'Save $4,497' },
      { label: '1M – 5M MAU', monthly: '$2,499/mo', annual: '$22,491/yr', saving: 'Save $7,497' },
      { label: '5M+ MAU', monthly: 'Custom', annual: 'Custom', saving: '' },
    ],
    accessWindow: '60–90 days',
    spotsTotal: 5,
    spotsRemaining: 3,
    foundingMember: true,
    annualTotal: 'From $8,091',
    annualPerMonth: 'From $674.25',
    annualSaving: 'From $2,697',
  },
]

export default function PartnersPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [modalOpen, setModalOpen] = useState(false)
  type SelectedTier = typeof tiers[0] & { billingPeriod: 'monthly' | 'annual' }
  const [selectedTier, setSelectedTier] = useState<SelectedTier | null>(null)

  const openModal = (tier: typeof tiers[0]) => {
    setSelectedTier({ ...tier, billingPeriod })
    setModalOpen(true)
  }

  return (
    <div className="bg-[#080d1a] text-[#f1f5f9] min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#f1f5f9] mb-6">
            Integrate the Engagement Engine
          </h1>
          <p className="text-lg text-[#94a3b8]">
            Choose the tier that fits your platform. All tiers include full platform blending —
            your brand on every user interaction.
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-center gap-1 mb-10 bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-1 w-fit mx-auto">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${
                billingPeriod === 'annual'
                  ? 'bg-[#3b82f6] text-white'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              Annually
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                billingPeriod === 'annual' ? 'bg-white/20 text-white' : 'bg-[#10b981]/20 text-[#10b981]'
              }`}>
                3 months free
              </span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-[#0f1629] rounded-2xl p-8 flex flex-col border transition-all ${
                  tier.highlighted
                    ? 'border-[#3b82f6]'
                    : 'border-[#1e2d4a] hover:border-[#3b82f6]/50'
                }`}
              >
                {tier.badge && (
                  <span className="self-start mb-3 inline-block bg-[#3b82f6] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    {tier.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-[#f1f5f9] mb-1">{tier.name}</h3>
                {tier.foundingMember && (
                  <div className="mb-2">
                    <span className="inline-block bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-[#f59e0b] text-xs font-semibold px-2.5 py-1 rounded-md">
                      Founding Member · Early Access
                    </span>
                    <p className="text-xs text-[#f59e0b] font-semibold mt-1.5">
                      🔥 {tier.spotsRemaining} of {tier.spotsTotal} Founding Member spots remaining
                    </p>
                  </div>
                )}
                <div className="mb-1">
                  {tier.originalPrice && (
                    <span className="text-sm text-[#94a3b8] line-through mr-2">{tier.originalPrice}{tier.period}</span>
                  )}
                  <span className="text-3xl font-bold text-[#f1f5f9]">
                    {billingPeriod === 'annual' ? tier.annualPerMonth : tier.price}
                  </span>
                  <span className="text-[#94a3b8] text-sm">/mo</span>
                  {billingPeriod === 'annual' && tier.annualTotal && (
                    <p className="text-xs text-[#94a3b8] mt-1">
                      Billed as {tier.annualTotal}/yr
                    </p>
                  )}
                </div>
                {billingPeriod === 'annual' && tier.annualSaving && (
                  <div className="mb-2">
                    <span className="inline-block bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-xs font-semibold px-2.5 py-1 rounded-md">
                      Save {tier.annualSaving}/yr — 3 months free
                    </span>
                  </div>
                )}
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
                {tier.enterpriseBands && billingPeriod === 'monthly' && (
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
                {tier.annualEnterpriseBands && billingPeriod === 'annual' && (
                  <div className="mb-6 bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Annual Volume Pricing</p>
                    <ul className="space-y-2">
                      {tier.annualEnterpriseBands.map((band) => (
                        <li key={band.label} className="flex flex-col text-xs gap-0.5">
                          <div className="flex justify-between items-center">
                            <span className="text-[#94a3b8]">{band.label}</span>
                            <span className="text-[#f1f5f9] font-semibold">{band.annual}</span>
                          </div>
                          {band.saving && (
                            <span className="text-[#10b981] text-right">{band.saving}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => openModal(tier)}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                    tier.highlighted
                      ? 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
                      : 'border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10'
                  }`}
                >
                  Prelaunch Purchase
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PrelaunchModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        tier={selectedTier}
      />
    </div>
  )
}

