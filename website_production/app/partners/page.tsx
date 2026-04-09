import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Mail,
  Handshake,
  Layers3,
  Webhook,
} from 'lucide-react'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa6'
import { partnerPrograms } from '@/lib/site-content'
import { PlatformPreview } from '@/components/marketing/platform-v1-preview'

const partnerReasons = [
  'Deploy a revenue layer across multiple client accounts without rebuilding each time.',
  'Move from campaign services to monetisation infrastructure retainers.',
  'Create measurable commercial upside for client engagement programs.',
  'Shorten implementation timelines from months to days.',
]

const rolloutSteps = [
  'Commercial fit review and pricing-band alignment',
  'Integration mapping for platform events, campaigns, and rewards',
  'Protected launch path with onboarding and performance tracking',
]

const capabilityCoverage = [
  'Agency rollout programmes across multiple client portfolios',
  'Regional commerce operators coordinating loyalty and ad inventory',
  'Gaming and entertainment platforms scaling rewarded engagement',
  'Membership, wallet, and retention ecosystems requiring attribution',
] as const

const credibilityAnchors = [
  { label: 'WhatsApp', icon: FaWhatsapp },
  { label: 'Facebook', icon: FaFacebookF },
  { label: 'Instagram', icon: FaInstagram },
  { label: 'Email', icon: Mail },
  { label: 'API / Webhooks', icon: Webhook },
] as const

const partnerAdvantages = [
  'Early-access commercial terms remain fixed while active.',
  'Client dashboards already demonstrate a strong reporting and presentation standard.',
  'Commercial onboarding supports both direct purchase and managed enterprise engagement.',
] as const

const dashboardHighlights = [
  'Executive visibility with revenue, completions, and delivery health in one view.',
  'Campaign, marketing, and reporting tabs presented in a clear client-ready layout.',
] as const

export default function PartnersPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#02060f_0%,#081321_38%,#07111f_100%)] text-white">
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Partners
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Deploy once. Scale the infrastructure across platforms and
              clients.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#c4d5e9]">
              Ad Rev Technologies gives platform operators and digital agencies
              a single engagement and monetisation layer instead of a fragmented
              stack of stitched tools.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#06131d] transition hover:bg-[#7cecff]"
              >
                Contact us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-6 py-3 text-sm font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
              >
                Review docs
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                View pricing
              </Link>
            </div>
          </div>

          <div className="rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-8 shadow-[0_22px_90px_rgba(0,212,255,0.12)]">
            <div className="grid gap-4 sm:grid-cols-2">
              <PartnerStat
                label="Fastest growth path"
                value="Agencies deploying across multiple clients"
                icon={<BriefcaseBusiness className="h-5 w-5" />}
              />
              <PartnerStat
                label="Platform outcome"
                value="Revenue and retention from existing users"
                icon={<Building2 className="h-5 w-5" />}
              />
              <PartnerStat
                label="Commercial shape"
                value="Infrastructure pricing aligned to MAU"
                icon={<Layers3 className="h-5 w-5" />}
              />
              <PartnerStat
                label="Working motion"
                value="Commercial activation planning is active"
                icon={<Handshake className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
          {partnerPrograms.map((program) => (
            <div
              key={program.title}
              className="rounded-[30px] border border-[#ff8a3d]/20 bg-white/[0.035] p-7"
            >
              <h2 className="text-xl font-semibold text-white">
                {program.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#afc4dd]">
                {program.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-8 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Coverage profile
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Commercial use cases the network is built to support.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
              Instead of implying a finalised public roster, this section shows
              the operator profiles and deployment models the partner motion is
              designed to serve first.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {capabilityCoverage.map((slot, index) => (
              <div
                key={`${slot}-${index}`}
                className="flex min-h-[132px] items-center justify-center rounded-[24px] border border-[#ff8a3d]/20 bg-white/[0.03] p-6 text-center"
              >
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#ff8a3d]/25 bg-[#ff8a3d]/10 text-[#ffb36e]">
                    <BadgeCheck className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#8ea7c2]">
                    Coverage area
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#dce8f5]">
                    {slot}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PlatformPreview />

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Why agencies move fastest
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              One deal can become five implementations.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
              Agencies are the fastest route to early revenue because the same
              operating layer can be deployed across multiple client accounts
              with the same commercial story.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {partnerReasons.map((reason) => (
              <div
                key={reason}
                className="rounded-[28px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.95),rgba(8,20,37,0.9))] p-6 text-sm leading-7 text-[#dce8f5]"
              >
                {reason}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(8,17,31,0.96),rgba(7,19,34,0.9))] p-8 sm:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Partner rollout
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Commercial alignment first. Integration confidence next.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {rolloutSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-[24px] border border-[#ff8a3d]/15 bg-white/[0.03] p-6"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffb36e]">
                  0{index + 1}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#d9e4f2]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Credibility anchors
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Compatibility signals matter before logos arrive.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
              The current product direction already reflects the operating
              channels agencies need to assess: messaging, social distribution,
              and API-led delivery.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {credibilityAnchors.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-[#ff8a3d]/20 bg-white/[0.03] p-6 text-center"
                >
                  <div className="flex justify-center text-[#7ee7ff]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#dce8f5]">
                    {item.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Client success stories
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Case studies and rollout outcomes.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
              Case studies will be published once live client programmes
              complete reporting sign-off. Until then, the focus remains on
              demonstrating operating standards, rollout discipline, and
              commercial fit.
            </p>
            <ul className="mt-6 space-y-3">
              {partnerAdvantages.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-7 text-[#dce8f5]"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#ff8a3d]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(8,17,31,0.96),rgba(7,19,34,0.9))] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Dashboard presentation
            </p>
            <div className="mt-6 space-y-4">
              {dashboardHighlights.map((quote) => (
                <blockquote
                  key={quote}
                  className="rounded-[24px] border border-[#ff8a3d]/20 bg-white/[0.03] p-6 text-sm leading-7 text-[#dce8f5]"
                >
                  <p>{quote}</p>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#8ea7c2]">
                    Enterprise dashboard standard
                  </p>
                </blockquote>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function PartnerStat({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-[24px] border border-[#ff8a3d]/20 bg-white/[0.03] p-5 text-center">
      <div className="flex justify-center text-[#7ee7ff]">{icon}</div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#8ea7c2]">
        {label}
      </p>
      <p className="mt-2 text-lg font-medium text-white">{value}</p>
    </div>
  )
}
