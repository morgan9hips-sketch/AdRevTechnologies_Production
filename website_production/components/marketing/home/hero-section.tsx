import Link from 'next/link'
import { ArrowRight, Orbit } from 'lucide-react'
import { RevenueCalculator } from '@/components/sections/revenue-calculator'
import { heroContent } from '@/lib/site-content'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-6 pb-12 pt-10 sm:pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(29,78,216,0.22),transparent_30%),linear-gradient(180deg,rgba(3,8,18,0.96),rgba(4,9,20,0.98))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7ee7ff] to-transparent opacity-80" />

      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            <Orbit className="h-3.5 w-3.5" />
            Infrastructure for monetisation and engagement
          </div>
          <h1 className="mt-6 max-w-none text-5xl font-bold uppercase leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl lg:whitespace-nowrap lg:text-[clamp(2.2rem,3.2vw,3rem)]">
            {heroContent.headline}
          </h1>
          <p className="mt-10 max-w-[1080px] text-xl leading-9 text-[#c2d2e7] sm:text-2xl">
            {heroContent.subheadline}
          </p>
          <p className="mt-6 max-w-[980px] text-base leading-8 text-[#8ea7c2] sm:text-lg">
            {heroContent.supportingText}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#05131d] transition hover:bg-[#7ee7ff]"
            >
              View Pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-6 py-3 text-sm font-semibold text-[#8feaff] transition hover:bg-[#00d4ff]/10"
            >
              Contact Us
            </Link>
          </div>

          <div className="mt-12 w-full max-w-5xl">
            <RevenueCalculator />
          </div>
        </div>
      </div>
    </section>
  )
}
