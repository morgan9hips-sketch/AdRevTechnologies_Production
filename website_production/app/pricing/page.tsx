import Link from 'next/link'
import { Building2, Check, ShieldCheck, Sparkles } from 'lucide-react'
import { FoundingPartnerCheckout } from '@/components/marketing/founding-partner-checkout'
import {
  audienceCards,
  foundingPartnerOffer,
  pricingPrinciples,
} from '@/lib/site-content'

const integrationAssurances = [
  'Single API integration',
  'No changes to your core architecture',
  'No access to your users, database, or authentication layer',
  'Fully event-driven and production-ready',
] as const

export default function PricingPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#02060f_0%,#081321_38%,#07111f_100%)] text-white">
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Pricing
            </p>
            <h1 className="mt-6 max-w-[1080px] text-5xl font-bold uppercase leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl lg:text-[clamp(2.2rem,3.2vw,3rem)]">
              Infrastructure pricing for platforms and agencies with real users.
            </h1>
            <p className="mt-10 max-w-[980px] text-base leading-8 text-[#8ea7c2] sm:text-lg">
              Pricing is aligned to scale rather than feature gating. The
              initial MAU bands support direct purchase, while larger
              deployments move into a managed commercial process.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#founding-partner-checkout"
                className="inline-flex items-center justify-center rounded-full bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#05131d] transition hover:bg-[#7cecff]"
              >
                Start purchase
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                View partner routes
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-6 py-3 text-sm font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
              >
                Read docs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="founding-partner-checkout" className="px-6 py-6">
        <div className="mx-auto max-w-6xl">
          <FoundingPartnerCheckout requestAccessHref="/contact" />
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              How pricing works
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Simple. Transparent. Aligned with growth.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
              {foundingPartnerOffer.name} is designed to feel like
              infrastructure, not a bundle of feature tiers. Every buyer sees
              the same operating layer. Commercials move with platform scale.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {pricingPrinciples.map((principle) => (
              <div
                key={principle}
                className="rounded-[28px] border border-[#ff8a3d]/20 bg-white/[0.03] p-6 text-center text-sm leading-7 text-[#dce7f4]"
              >
                <Check className="mx-auto mb-4 h-5 w-5 text-[#00d4ff]" />
                {principle}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
          {audienceCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-8"
            >
              <div className="inline-flex rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
                {card.title}
              </div>
              <ul className="mt-6 space-y-3">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm leading-7 text-[#dbe6f2]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.96),rgba(8,20,37,0.9))] p-8 sm:p-10">
          <div className="flex items-center gap-3 text-[#7ee7ff]">
            <ShieldCheck className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">
              Integration confidence
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Go live in days, not months.
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {integrationAssurances.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[#ff8a3d]/15 bg-white/[0.03] p-5 text-sm leading-7 text-[#dce8f5]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-[#ff8a3d]/20 bg-[#ff8a3d]/8 p-8 sm:p-10">
          <div className="flex items-center gap-3 text-[#ffb36e]">
            <Sparkles className="h-5 w-5" />
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">
              Commercial access
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Launch Partner Access is limited to 10.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoCard
              title="Locked pricing for life"
              body="Keep the contracted launch-partner rate active for as long as the subscription remains live."
            />
            <InfoCard
              title="Direct product access"
              body="Influence the roadmap while the infrastructure is being shaped around live operators and agencies."
            />
            <InfoCard
              title="Priority onboarding"
              body="Support direct purchase for the initial client bands and move larger deployments into a managed onboarding path."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[24px] border border-[#ff8a3d]/20 bg-white/[0.04] p-6 text-center">
      <div className="mb-4 inline-flex items-center justify-center rounded-full border border-[#ff8a3d]/20 bg-white/5 p-2 text-[#ffb36e]">
        <Building2 className="h-4 w-4" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-[#f3dfc3]">{body}</p>
    </div>
  )
}
