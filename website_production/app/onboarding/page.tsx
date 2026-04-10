import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ClipboardList, Layers3, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Launch Readiness | Ad Rev Technologies',
  robots: {
    index: false,
    follow: false,
  },
}

const activationSteps = [
  {
    title: 'Environment review',
    description:
      'Confirm platform requirements, branding context, and reporting expectations before access is issued.',
    icon: Layers3,
  },
  {
    title: 'Integration preparation',
    description:
      'Align API credentials, webhook delivery, and event mapping in one coordinated setup path.',
    icon: ClipboardList,
  },
  {
    title: 'Launch readiness',
    description:
      'Move into live deployment with verification checks, reporting visibility, and stakeholder clarity.',
    icon: CheckCircle2,
  },
] as const

const assurances = [
  'Structured implementation support from the first review',
  'Technical, reporting, and environment planning aligned together',
  'Clear next steps for platform, partner, and enterprise deployments',
  'Secure production posture maintained throughout access and launch',
] as const

export default function OnboardingPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#02060f_0%,#081321_38%,#07111f_100%)] text-white">
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Launch Readiness
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              A structured path from review to live deployment.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#c4d5e9]">
              Ad Rev launch planning gives technical and business stakeholders
              one clear path from evaluation to launch, without turning the
              public site into an unsupported setup console.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#06131d] transition hover:bg-[#7cecff]"
              >
                Contact us
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-6 py-3 text-sm font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
              >
                Review pricing
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Read documentation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-8 sm:p-10">
            <div className="flex items-center gap-3 text-[#7ee7ff]">
              <ShieldCheck className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.24em]">
                How launch readiness works
              </p>
            </div>
            <div className="mt-8 space-y-4">
              {activationSteps.map((step) => {
                const Icon = step.icon

                return (
                  <div
                    key={step.title}
                    className="rounded-[24px] border border-[#ff8a3d]/15 bg-white/[0.03] p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00d4ff]/10 text-[#7ee7ff]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {step.title}
                        </p>
                        <p className="mt-2 text-sm leading-7 text-[#c7d8ea]">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[32px] border border-[#ff8a3d]/20 bg-[#07121f] p-8 sm:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Implementation posture
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              The public site stays concise while deployment support stays
              structured.
            </h2>
            <ul className="mt-8 space-y-4">
              {assurances.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm leading-7 text-[#dce8f5]"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 rounded-[24px] border border-[#ff8a3d]/15 bg-white/[0.03] p-6">
              <p className="text-sm leading-7 text-[#c7d8ea]">
                If your team is preparing for a platform deployment, partner
                expansion, or enterprise integration, use the contact route so
                scope, timelines, and technical requirements can be aligned
                early.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
