'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface VerifyResult {
  success: boolean
  reference: string
  email: string
  name: string
  amount: number
  currency: string
  is_test?: boolean
  founding_member_number: number
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [verifyData, setVerifyData] = useState<VerifyResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!reference) {
      setErrorMessage('No payment reference found.')
      setStatus('error')
      return
    }

    fetch(`/api/paystack/verify?reference=${encodeURIComponent(reference)}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error((data as { error?: string }).error || 'Payment verification failed.')
        }
        return res.json() as Promise<VerifyResult>
      })
      .then((data) => {
        setVerifyData(data)
        setStatus('success')
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Payment verification failed.'
        setErrorMessage(msg)
        setStatus('error')
      })
  }, [reference])

  if (status === 'loading') {
    return (
      <div className="bg-[#080d1a] text-[#f1f5f9] min-h-screen flex items-center justify-center">
        <p className="text-[#94a3b8]">Verifying your payment…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-[#080d1a] text-[#f1f5f9] min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg text-center space-y-6">
          <h1 className="text-3xl font-extrabold text-[#f1f5f9]">Something went wrong</h1>
          <p className="text-[#94a3b8]">{errorMessage}</p>
          <p className="text-sm text-[#94a3b8]">
            If you completed payment, please contact{' '}
            <a href="mailto:admin@adrevtechnologies.com" className="text-[#00d4ff] hover:underline">
              admin@adrevtechnologies.com
            </a>{' '}
            with your payment reference.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    )
  }

  const amountFormatted = verifyData?.currency === 'ZAR'
    ? `R${((verifyData?.amount ?? 0) / 100).toFixed(2)}`
    : `$${((verifyData?.amount ?? 0) / 100).toFixed(2)} ${verifyData?.currency}`

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
                #{verifyData?.founding_member_number ?? '—'}
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="divide-y divide-[#1e2d4a]">
            {verifyData?.name && (
              <div className="flex justify-between py-3">
                <span className="text-sm text-[#94a3b8]">Name</span>
                <span className="text-sm font-semibold text-[#f1f5f9]">{verifyData.name}</span>
              </div>
            )}
            <div className="flex justify-between py-3">
              <span className="text-sm text-[#94a3b8]">Amount Paid</span>
              <span className="text-sm font-semibold text-[#f1f5f9]">{amountFormatted}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-sm text-[#94a3b8]">Access Window</span>
              <span className="text-sm font-semibold text-[#00d4ff]">30–45 days</span>
            </div>
          </div>

          {/* Account manager message */}
          <div className="bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-xl p-5">
            <p className="text-sm text-[#f1f5f9] leading-relaxed">
              Your account manager will be in touch within 30–45 days with onboarding updates and platform access details.
            </p>
          </div>

          {/* Confirmation email note */}
          <p className="text-sm text-[#94a3b8] text-center">
            A confirmation email has been sent to you. For direct support, contact{' '}
            <a
              href="mailto:admin@adrevtechnologies.com"
              className="text-[#00d4ff] hover:underline"
            >
              admin@adrevtechnologies.com
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

