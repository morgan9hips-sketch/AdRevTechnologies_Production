import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, ClipboardList, Layers3, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Activation Planning | Ad Rev Technologies',
  robots: {
    index: false,
    follow: false,
  },
}

const activationSteps = [
  {
    title: 'Commercial alignment',
    description:
      'Confirm the operating scope, commercial band, and rollout ownership before launch planning begins.',
    icon: Layers3,
  },
  {
    title: 'Activation planning',
    description:
      'Review branding, integration checkpoints, reporting expectations, and stakeholder approvals in one guided workflow.',
    icon: ClipboardList,
  },
  {
    title: 'Client launch coordination',
    description:
      'Move into scheduled activation with implementation guidance, platform access sequencing, and launch readiness checks.',
    icon: CheckCircle2,
  },
] as const

const assurances = [
  'Guided activation rather than an unsupported self-serve setup path',
  'Commercial, technical, and rollout planning handled together',
  'Clear next steps for launch bands, agency deployments, and larger platform rollouts',
  'Production posture maintained throughout access planning and activation',
] as const

export default function OnboardingPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#02060f_0%,#081321_38%,#07111f_100%)] text-white">
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Activation Planning
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Guided activation for production teams, agency operators, and
              commercial launch teams.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#c4d5e9]">
              Ad Rev onboarding is coordinated as a managed activation process.
              Commercial scope, technical readiness, and rollout sequencing are
              aligned before platform access is issued.
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
                Open docs
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
                How activation works
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
              Production posture
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              No unsupported self-serve setup is exposed on the public site.
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
                If you are moving forward on a launch band, agency rollout, or
                managed enterprise engagement, use the contact route so the next
                steps can be aligned commercially and technically.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
