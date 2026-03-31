'use client'

import { useEffect, useRef, useState } from 'react'

export interface PrelaunchModalTier {
  name: string
  price: string
  accessWindow: string
  spotsRemaining: number
  spotsTotal: number
  billingPeriod: 'monthly' | 'annual'
  annualTotal?: string
  annualPerMonth?: string
  annualSaving?: string
}

export interface PrelaunchModalProps {
  isOpen: boolean
  onClose: () => void
  tier: PrelaunchModalTier | null
}

export function PrelaunchModal({ isOpen, onClose, tier }: PrelaunchModalProps) {
  const [agreed, setAgreed] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // Reset checkbox when modal opens for a new tier
  useEffect(() => {
    if (isOpen) {
      setAgreed(false)
      setCheckoutLoading(false)
      // Focus the close button on open for accessibility
      setTimeout(() => closeButtonRef.current?.focus(), 50)
    }
  }, [isOpen, tier])

  // Trap focus within modal and handle Escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return

      const modal = overlayRef.current
      if (!modal) return
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  const handleCheckout = () => {
    if (!agreed) return
    setCheckoutLoading(true)
    // Placeholder — Lemon Squeezy URL to be added once account is approved
    setTimeout(() => {
      window.location.href = '#'
    }, 800)
  }

  if (!isOpen || !tier) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="prelaunch-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative bg-[#0f1629] border border-[#1e2d4a] rounded-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[#1e2d4a] shrink-0">
          <div>
            <h2
              id="prelaunch-modal-title"
              className="text-xl font-bold text-[#f1f5f9]"
            >
              Founding Member — Early Access
            </h2>
            <p className="text-sm text-[#94a3b8] mt-1">
              {tier.name} Plan ·{' '}
              {tier.billingPeriod === 'annual'
                ? `${tier.annualPerMonth}/mo · Billed as ${tier.annualTotal}/yr`
                : `${tier.price}/mo`}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="ml-4 shrink-0 text-[#94a3b8] hover:text-[#f1f5f9] transition-colors rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable Body — Terms of Service */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Section 1 */}
          <section>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">
              1. What You Are Purchasing
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              You are securing a Founding Member spot on the Ad Rev Technologies
              platform{' '}
              {tier.billingPeriod === 'annual' ? (
                <>
                  at a locked-in annual rate of{' '}
                  <span className="text-[#f1f5f9] font-semibold">{tier.annualTotal}/yr</span>{' '}
                  (equivalent to{' '}
                  <span className="text-[#f1f5f9] font-semibold">{tier.annualPerMonth}/mo</span>).
                  You save{' '}
                  <span className="text-[#f1f5f9] font-semibold">{tier.annualSaving}</span>{' '}
                  compared to monthly billing.
                </>
              ) : (
                <>
                  at a locked-in monthly rate of{' '}
                  <span className="text-[#f1f5f9] font-semibold">{tier.price}/mo</span>.
                </>
              )}{' '}
              This is an early access subscription. Full platform access will be
              provisioned within{' '}
              <span className="text-[#f1f5f9] font-semibold">{tier.accessWindow}</span>{' '}
              of your purchase date.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">
              2. Founding Member Price Lock
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Your prelaunch rate is locked for life. As long as your subscription
              remains active, your monthly rate will never increase — regardless
              of future pricing changes.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">
              3. Access Timeline
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Platform access will be provisioned within{' '}
              <span className="text-[#f1f5f9] font-semibold">{tier.accessWindow}</span>{' '}
              of your purchase. You will receive onboarding instructions via email
              as soon as your environment is ready. The platform is functional at
              launch but may not yet include all planned features — additional
              features will be rolled out progressively during your access window.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">
              4. Spot Limit
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              Founding Member access on the {tier.name} plan is limited to{' '}
              <span className="text-[#f1f5f9] font-semibold">{tier.spotsTotal} tenants</span>.
              There are currently{' '}
              <span className="text-[#f1f5f9] font-semibold">
                {tier.spotsRemaining} spots remaining
              </span>
              . Once all spots are filled, this pricing tier will no longer be
              available at the prelaunch rate.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">
              5. Refund Policy
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              If platform access is not provisioned within the stated access window
              from your purchase date, you are entitled to a full refund. If access
              is successfully provisioned, a 14-day refund window begins from the
              date access is granted — not the date of purchase. No refund is
              available after the 14-day post-access window.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">
              6. Billing
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              {tier.billingPeriod === 'annual' ? (
                <>
                  Your card will be charged{' '}
                  <span className="text-[#f1f5f9] font-semibold">{tier.annualTotal}</span>{' '}
                  immediately upon completing checkout. This covers 12 months of
                  access. Your subscription renews annually.
                </>
              ) : (
                <>
                  Your card will be charged{' '}
                  <span className="text-[#f1f5f9] font-semibold">{tier.price}</span>{' '}
                  immediately upon completing checkout. Your subscription renews
                  monthly.
                </>
              )}{' '}
              You may cancel at any time — cancellation stops future charges but
              does not trigger a refund outside of the refund policy above.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h3 className="text-sm font-semibold text-[#f1f5f9] mb-2">
              7. What Is Not Yet Fully Available
            </h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">
              The platform is in active development. Some advanced features
              including social API integrations (Meta, TikTok, Instagram
              auto-posting via your own API credentials) are planned within the
              access window but may not be available on day one of provisioning.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#1e2d4a] shrink-0 space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#1e2d4a] bg-[#080d1a] text-[#3b82f6] accent-[#3b82f6] cursor-pointer focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-0"
            />
            <span className="text-sm text-[#94a3b8] group-hover:text-[#f1f5f9] transition-colors select-none">
              I have read and agree to the Founding Member Early Access Terms
            </span>
          </label>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={!agreed || checkoutLoading}
            className="w-full py-3 rounded-lg font-semibold text-sm transition-colors bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2 focus:ring-offset-[#0f1629]"
          >
            {checkoutLoading ? 'Redirecting…' : 'Proceed to Checkout'}
          </button>

          <p className="text-center text-[10px] text-[#94a3b8]/60">
            Powered by Lemon Squeezy · Secure checkout · USD pricing · Local currency shown at checkout
          </p>
        </div>
      </div>
    </div>
  )
}
