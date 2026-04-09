import Link from 'next/link'
import { FoundingPartnerCheckout } from '@/components/marketing/founding-partner-checkout'

export function PricingPreviewSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Pricing preview
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              One pricing model. Scale-based, not feature-gated.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
              The live founding-partner checkout remains intact for the first
              band. Larger MAU bands route into request access so you can
              protect the current self-serve payment flow while still showing
              commercial clarity.
            </p>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-5 py-3 text-sm font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
          >
            Open full pricing page
          </Link>
        </div>

        <FoundingPartnerCheckout compact />
      </div>
    </section>
  )
}
