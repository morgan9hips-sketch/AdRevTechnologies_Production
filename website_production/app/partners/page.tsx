'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'

const tiers = [
  {
    id: 'starter',
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
    highlighted: false,
  },
  {
    id: 'business',
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
    highlighted: true,
  },
  {
    id: 'enterprise',
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
    highlighted: false,
  },
]

export default function PartnersPage() {
  const router = useRouter()
  const [selectedTier, setSelectedTier] = useState('business')
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    website: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          apiTier: selectedTier,
        }),
      })

      if (!response.ok) {
        throw new Error('Registration failed')
      }

      router.push('/partners/success')
    } catch {
      setError('Failed to submit registration. Please try again.')
    } finally {
      setLoading(false)
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`bg-[#0f1629] rounded-2xl p-8 flex flex-col border cursor-pointer transition-all ${
                  selectedTier === tier.id
                    ? 'border-[#3b82f6] ring-1 ring-[#3b82f6]'
                    : tier.highlighted
                    ? 'border-[#3b82f6]'
                    : 'border-[#1e2d4a] hover:border-[#3b82f6]/50'
                }`}
                onClick={() => setSelectedTier(tier.id)}
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
                <button
                  type="button"
                  onClick={() => setSelectedTier(tier.id)}
                  className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                    selectedTier === tier.id
                      ? 'bg-[#3b82f6] text-white'
                      : 'border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10'
                  }`}
                >
                  {selectedTier === tier.id ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-2xl">
          <div className="bg-[#0f1629] border border-[#1e2d4a] rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-[#f1f5f9] mb-2">Partner Registration</h2>
            <p className="text-[#94a3b8] text-sm mb-8">
              Fill out the form below to apply for partner access. We&apos;ll review your
              application and get back to you within 24–48 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-[#94a3b8] mb-1.5"
                >
                  Company Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="companyName"
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="bg-[#080d1a] border-[#1e2d4a] text-[#f1f5f9] placeholder:text-[#94a3b8]/50 focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#94a3b8] mb-1.5"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-[#080d1a] border-[#1e2d4a] text-[#f1f5f9] placeholder:text-[#94a3b8]/50 focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-[#94a3b8] mb-1.5"
                >
                  Website
                </label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="bg-[#080d1a] border-[#1e2d4a] text-[#f1f5f9] placeholder:text-[#94a3b8]/50 focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-[#94a3b8] mb-1.5"
                >
                  Tell us about your use case <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="block w-full rounded-md bg-[#080d1a] border border-[#1e2d4a] text-[#f1f5f9] px-3 py-2 text-sm placeholder:text-[#94a3b8]/50 focus:border-[#3b82f6] focus:outline-none focus:ring-1 focus:ring-[#3b82f6]"
                />
              </div>

              <div className="rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/30 p-4">
                <p className="text-sm text-[#94a3b8]">
                  Selected Plan:{' '}
                  <strong className="capitalize text-[#f1f5f9]">{selectedTier}</strong>
                </p>
              </div>

              {error && (
                <div className="rounded-lg bg-red-900/20 border border-red-700/40 p-4">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
