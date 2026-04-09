import { Mail, MessageSquareText, PhoneCall, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { RequestAccessForm } from '@/components/marketing/request-access-form'
import { contactEmail } from '@/lib/site-content'

const contactReasons = [
  'Request access for 500K+ MAU bands or custom pricing.',
  'Discuss agency deployments across multiple clients.',
  'Ask product, onboarding, or implementation questions.',
  'Route commercial conversations without touching the protected purchase flow.',
] as const

export default function ContactPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#02060f_0%,#081321_38%,#07111f_100%)] text-white">
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Contact us for access planning, rollout coordination, and
              commercial alignment.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[#c4d5e9]">
              The live founding-partner purchase CTA remains on its own
              protected checkout path. Use this page for all other
              conversations, including higher MAU bands, agency partnerships,
              onboarding planning, and commercial alignment.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <ContactCard
                icon={<Mail className="h-5 w-5" />}
                title="Email"
                body={contactEmail}
                href={`mailto:${contactEmail}`}
              />
              <ContactCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Commercial path"
                body="Protected checkout stays separate from contact flow"
              />
              <ContactCard
                icon={<MessageSquareText className="h-5 w-5" />}
                title="Best for"
                body="Agencies, high-MAU platforms, and custom partnerships"
              />
              <ContactCard
                icon={<PhoneCall className="h-5 w-5" />}
                title="Response window"
                body="24 to 48 hours for qualified enquiries"
              />
            </div>

            <div className="mt-8 rounded-[28px] border border-[#ff8a3d]/20 bg-white/[0.03] p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
                Use this page when you want to:
              </p>
              <ul className="mt-4 space-y-3">
                {contactReasons.map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-3 text-sm leading-7 text-[#d9e5f2]"
                  >
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#00d4ff]" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-5 py-2.5 text-sm font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
                >
                  Review pricing
                </Link>
                <Link
                  href="/partners"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Explore partner routes
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/5"
                >
                  Open docs
                </Link>
              </div>
            </div>
          </div>

          <RequestAccessForm
            id="contact-form"
            title="Tell us what you need to launch"
            description="Use this form to route the right onboarding, commercial, or partnership conversation without placing the lead flow on your primary product pages."
            submitLabel="Contact us"
          />
        </div>
      </section>
    </div>
  )
}

function ContactCard({
  icon,
  title,
  body,
  href,
}: {
  icon: React.ReactNode
  title: string
  body: string
  href?: string
}) {
  const content = (
    <div className="rounded-[24px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-5 text-center">
      <div className="flex justify-center text-[#7ee7ff]">{icon}</div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#8ea7c2]">
        {title}
      </p>
      <p className="mt-2 text-sm leading-7 text-white">{body}</p>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className="block transition-transform hover:-translate-y-0.5"
      >
        {content}
      </a>
    )
  }

  return content
}
