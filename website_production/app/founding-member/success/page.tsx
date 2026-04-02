'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function getAccessWindow(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'starter':    return '30–45 days'
    case 'business':   return '45–60 days'
    case 'enterprise': return '60–90 days'
    default:           return '30–90 days'
  }
}

function getAccountManagerMessage(tier: string): string {
  switch (tier.toLowerCase()) {
    case 'starter':
      return 'Your account manager will be in touch within 30–45 days with onboarding updates and platform access details.'
    case 'business':
      return 'Your dedicated account manager will be in touch within 45–60 days with onboarding updates and platform access details.'
    case 'enterprise':
      return 'Your dedicated account manager will be in touch within 60–90 days. You will receive regular updates and a custom onboarding plan.'
    default:
      return 'Your dedicated account manager will be in contact shortly and will provide you with regular updates on your onboarding progress.'
  }
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const tier = searchParams.get('tier') || 'starter'
  const period = searchParams.get('period') || 'monthly'

  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1)
  const periodLabel = period === 'annual' ? 'Annual' : 'Monthly'
  const accessWindow = getAccessWindow(tier)
  const accountManagerMessage = getAccountManagerMessage(tier)

  return (
    <div className="bg-[#080d1a] text-[#f1f5f9] min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-[#00d4ff] uppercase tracking-widest mb-4">
            Payment Successful
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#f1f5f9] mb-3">
            You&apos;re in.
          </h1>
          <p className="text-xl font-semibold text-[#00d4ff]">
            Welcome to Ad Rev Technologies.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0f1629] border border-[#1e2d4a] rounded-2xl p-8 space-y-6">
          {/* Founding Member badge */}
          <div className="flex justify-center">
            <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl px-8 py-5 text-center">
              <p className="text-[10px] font-bold text-[#f59e0b] uppercase tracking-widest mb-1">
                Founding Member
              </p>
              <p className="text-4xl font-extrabold text-[#f59e0b]">
                Early Access
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="divide-y divide-[#1e2d4a]">
            <div className="flex justify-between py-3">
              <span className="text-sm text-[#94a3b8]">Tier</span>
              <span className="text-sm font-semibold text-[#f1f5f9]">{tierLabel}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-[#94a3b8]">Billing</span>
              <span className="text-sm font-semibold text-[#f1f5f9]">{periodLabel}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-[#94a3b8]">Access Window</span>
              <span className="text-sm font-semibold text-[#00d4ff]">{accessWindow}</span>
            </div>
          </div>

          {/* Account manager message */}
          <div className="bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-xl p-5">
            <p className="text-sm text-[#f1f5f9] leading-relaxed">
              {accountManagerMessage}
            </p>
          </div>

          {/* Confirmation email note */}
          <p className="text-sm text-[#94a3b8] text-center">
            A confirmation email has been sent to you. For direct support, contact{' '}
            <a
              href="mailto:morgan@adrevtechnologies.com"
              className="text-[#00d4ff] hover:underline"
            >
              morgan@adrevtechnologies.com
            </a>
          </p>

          {/* CTA */}
          <Link
            href="/"
            className="block w-full text-center bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function FoundingMemberSuccessPage() {
  return (
    <Suspense fallback={
      <div className="bg-[#080d1a] text-[#f1f5f9] min-h-screen flex items-center justify-center">
        <p className="text-[#94a3b8]">Loading…</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
