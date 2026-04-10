'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Check, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import {
  PrelaunchModal,
  type PrelaunchModalTier,
} from '@/components/prelaunch-modal'
import {
  contactEmail,
  foundingPartnerOffer,
  mauPricingBands,
  pricingCommercialTerms,
} from '@/lib/site-content'

interface FoundingPartnerCheckoutProps {
  requestAccessHref?: string
  compact?: boolean
}

export function FoundingPartnerCheckout({
  compact = false,
}: FoundingPartnerCheckoutProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTier, setSelectedTier] = useState<PrelaunchModalTier | null>(
    null,
  )

  function openCheckoutForBand(band: (typeof mauPricingBands)[number]) {
    if (band.actionType !== 'checkout') {
      return
    }

    const annualAmount =
      band.annualPriceMinor ?? foundingPartnerOffer.annualPriceMinor
    const annualTotal = formatAnnualPrice(annualAmount)

    setSelectedTier({
      id: band.id,
      name: foundingPartnerOffer.label,
      price: formatMonthlyEquivalent(annualAmount),
      accessWindow: foundingPartnerOffer.accessWindow,
      spotsRemaining: foundingPartnerOffer.spotsRemaining,
      spotsTotal: foundingPartnerOffer.spotsTotal,
      billingPeriod: 'annual',
      annualTotal,
      annualPerMonth: formatMonthlyEquivalent(annualAmount),
      annualSaving: formatAnnualSavings(annualAmount),
      amount: annualAmount,
    })
    setIsOpen(true)
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-[28px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(5,10,24,0.96),rgba(5,18,35,0.92))] p-8 shadow-[0_24px_120px_rgba(0,212,255,0.18)] sm:p-10">
        <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#7ee7ff] to-transparent opacity-80" />
        <div className="absolute -right-16 top-6 h-40 w-40 rounded-full bg-[#00d4ff]/12 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-[#1d4ed8]/18 blur-3xl" />

        <div className="relative space-y-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/30 bg-[#00d4ff]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-[#7ee7ff]">
                <Sparkles className="h-3.5 w-3.5" />
                {foundingPartnerOffer.label}
              </div>
              <div>
                <p className="text-sm font-medium text-[#8aa7c7]">
                  {foundingPartnerOffer.name}
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  From {foundingPartnerOffer.annualPrice} / year
                </h3>
                <p className="mt-3 max-w-xl text-base leading-7 text-[#b9cae0] sm:text-lg">
                  This page presents the current early-access commercial window,
                  including the introductory $5,988 rate for the first three
                  client activations while the broader MAU pricing structure
                  remains visible for scaling reference.
                </p>
              </div>
            </div>

            <div className="min-w-[260px] rounded-3xl border border-[#ffb36e]/45 bg-[linear-gradient(145deg,rgba(255,214,163,0.98),rgba(255,184,92,0.94)_58%,rgba(240,124,31,0.9))] p-5 text-left text-[#4a2400] shadow-[0_18px_48px_rgba(240,124,31,0.24)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8a3a00]">
                {pricingCommercialTerms.availabilityLabel}
              </p>
              <div className="mt-3 flex items-end gap-2">
                <span className="text-4xl font-semibold text-[#4a2400]">
                  {foundingPartnerOffer.discountedMonthlyPrice}
                </span>
                <span className="pb-1 text-sm text-[#8a4b13]">
                  /mo equivalent
                </span>
              </div>
              <p className="mt-2 text-sm text-[#6e3609]">
                Standard value {foundingPartnerOffer.standardMonthlyPrice}
              </p>
              <p className="mt-2 text-sm text-[#8a4b13]">
                Billed annually at {foundingPartnerOffer.annualPrice}
              </p>
              <p className="mt-3 text-sm font-semibold text-[#4a2400]">
                {pricingCommercialTerms.availabilityHeadline}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6e3609]">
                {pricingCommercialTerms.revenueShareValue} of revenue generated
                through the engine is retained by Ad Rev.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[24px] border border-[#ff8a3d]/20 bg-[#08101f]/88 p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7ee7ff]">
                    MAU-based pricing
                  </p>
                  <p className="mt-1 text-sm text-[#8aa7c7]">
                    One infrastructure layer. Commercials aligned to platform
                    scale.
                  </p>
                </div>
                <ShieldCheck className="h-5 w-5 text-[#7ee7ff]" />
              </div>

              <div className="space-y-3">
                {mauPricingBands.map((band) => (
                  <div
                    key={band.label}
                    className="relative grid gap-3 rounded-2xl border border-[#ff8a3d]/15 bg-white/[0.03] px-4 pb-4 pt-5 md:grid-cols-[1fr_auto_auto] md:items-center"
                  >
                    {'ribbonLabel' in band && band.ribbonLabel ? (
                      <div className="absolute right-4 top-3 rounded-full border border-[#f8d58b]/55 bg-[linear-gradient(135deg,#f5cf7a,#d4871d)] px-3.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#3b2202] shadow-[0_10px_24px_rgba(244,170,44,0.32)] whitespace-nowrap">
                        {band.ribbonLabel}
                      </div>
                    ) : null}
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {band.label}
                      </p>
                      <p className="mt-1 text-sm text-[#8aa7c7]">
                        {band.description}
                      </p>
                    </div>
                    <div className="md:text-right">
                      {'originalPrice' in band && band.originalPrice ? (
                        <p className="text-xs font-medium text-[#c89661] line-through decoration-[#c89661]/80 decoration-2">
                          {band.originalPrice}
                        </p>
                      ) : null}
                      <p className="text-sm font-semibold text-[#dfe9f5]">
                        {band.price}
                      </p>
                    </div>
                    {band.actionType === 'checkout' ? (
                      <button
                        type="button"
                        onClick={() => openCheckoutForBand(band)}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00d4ff] px-4 py-2 text-sm font-semibold text-[#05131d] shadow-[0_12px_28px_rgba(0,212,255,0.24)] transition hover:bg-[#7ee7ff]"
                      >
                        {band.actionLabel}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#ff8a3d]/35 px-4 py-2 text-sm font-semibold text-[#ffb36e] transition hover:bg-[#ff8a3d]/10"
                      >
                        <Mail className="h-4 w-4" />
                        {band.actionLabel}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#ff8a3d]/20 bg-[#07111f]/88 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#7ee7ff]">
                Included from day one
              </p>
              <ul className="mt-5 space-y-3">
                {foundingPartnerOffer.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm text-[#d2deee]"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#00d4ff]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 rounded-2xl border border-[#ffb36e]/45 bg-[linear-gradient(145deg,rgba(255,214,163,0.98),rgba(255,184,92,0.94)_58%,rgba(240,124,31,0.88))] p-4 text-sm text-[#6e3609] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                {foundingPartnerOffer.spotsLabel}
              </div>
              {!compact && (
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={() => openCheckoutForBand(mauPricingBands[0])}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#f7b24a,#f07c1f)] px-5 py-3 text-sm font-semibold text-[#2d1500] shadow-[0_16px_36px_rgba(240,124,31,0.28)] transition hover:brightness-105"
                  >
                    Secure Early Access
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="text-center text-xs text-[#8aa7c7]">
                    Secure checkout via Paystack for the introductory
                    early-access rate. The confirmation flow verifies payment,
                    updates Supabase, and triggers follow-up notifications.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <PrelaunchModal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
          setSelectedTier(null)
        }}
        tier={selectedTier}
      />
    </>
  )
}

function formatAnnualPrice(amountMinor: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amountMinor / 100)
}

function formatMonthlyEquivalent(amountMinor: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amountMinor / 1200)
}

function formatAnnualSavings(amountMinor: number) {
  return formatAnnualPrice(1078800 - amountMinor)
}
