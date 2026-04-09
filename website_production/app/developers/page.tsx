import type { Metadata } from 'next'
import Link from 'next/link'
import { Code, Webhook, FileText, Key, Gauge, BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Integration Guidance | Ad Rev Technologies',
  robots: {
    index: false,
    follow: false,
  },
}

const integrationSteps = [
  {
    number: '1',
    title: 'Align the integration scope',
    description:
      'Use the commercial and technical review process to confirm your use case, launch path, and access requirements.',
  },
  {
    number: '2',
    title: 'Receive controlled credentials',
    description:
      'Credentials, webhook configuration, and environment guidance are issued through the managed activation workflow.',
  },
  {
    number: '3',
    title: 'Validate the launch path',
    description:
      'Run the first event and webhook checks with implementation support before moving into live rollout.',
  },
]

const featureCards = [
  {
    icon: Code,
    title: 'Developer-First API',
    description:
      'Clean RESTful endpoints, consistent JSON responses, versioned at /v1. Designed for rapid integration.',
  },
  {
    icon: Webhook,
    title: 'Webhook Delivery',
    description:
      'Reward events delivered to your endpoint via HMAC-signed POST requests with retry logic on failure.',
  },
  {
    icon: FileText,
    title: 'Swagger Docs',
    description:
      'Implementation guidance and API references are aligned to production onboarding rather than exposed as an unsupported self-serve console.',
  },
  {
    icon: Key,
    title: 'Scoped API Keys',
    description:
      'Per-tenant, per-environment API keys. Each key is scoped to your tenant and rotatable without downtime.',
  },
  {
    icon: Gauge,
    title: 'Rate Limiting by Tier',
    description:
      'Request limits enforced per tier. Starter, Business, and Enterprise have escalating rate allowances.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description:
      'Track engagement events, reward completions, campaign performance, and revenue in real time.',
  },
]

const requestExample = `POST https://api.adrevtechnologies.com/v1/engagement/start
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "tenant_id": "tenant_abc123",
  "external_user_id": "user_98234",
  "campaign_id": "camp_summer_sale",
  "engagement_type": "video_ad"
}`

const webhookExample = `// Webhook fired on completion:
POST https://your-platform.com/webhooks/adrev
Content-Type: application/json
X-AdRev-Signature: sha256=...

{
  "event": "reward_earned",
  "tenant_id": "tenant_abc123",
  "external_user_id": "user_98234",
  "reward_type": "loyalty_points",
  "amount": 50,
  "reason": "video_ad_completed",
  "campaign_id": "camp_summer_sale",
  "timestamp": "2026-03-26T10:00:00Z"
}`

export default function DevelopersPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#02060f_0%,#081321_38%,#07111f_100%)] text-white min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#00d4ff]/20 bg-[#00d4ff]/10 text-[#7ee7ff]">
            <Code className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
            Integration Guidance for Technical Teams
          </h1>
          <p className="text-lg text-[#c4d5e9]">
            Review the production integration model, webhook delivery pattern,
            and access controls used during managed activation.
          </p>
        </div>
      </section>

      {/* Integration Steps */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Three-Step Activation Path
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrationSteps.map((step) => (
              <div
                key={step.number}
                className="rounded-[28px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-8"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#00d4ff]/12 text-lg font-bold text-[#7ee7ff]">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-[#c7d8ea] text-sm leading-7">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Snippet */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-white mb-4">
              See It in Action
            </h2>
            <p className="text-[#a9bfd7]">
              Representative request and webhook shapes used during
              implementation review.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-[#8ea7c2] mb-2 font-medium uppercase tracking-wider">
                API Request
              </div>
              <pre className="rounded-[24px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-6 text-sm text-[#c7d8ea] overflow-x-auto whitespace-pre-wrap">
                <code>{requestExample}</code>
              </pre>
            </div>
            <div>
              <div className="text-xs text-[#8ea7c2] mb-2 font-medium uppercase tracking-wider">
                Webhook Response
              </div>
              <pre className="rounded-[24px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-6 text-sm text-[#c7d8ea] overflow-x-auto whitespace-pre-wrap">
                <code>{webhookExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-semibold text-white mb-4">
              Implementation Controls
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="rounded-[28px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-6"
                >
                  <Icon className="h-7 w-7 text-[#7ee7ff] mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[#c7d8ea] text-sm leading-7">
                    {card.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold text-white mb-4">
            Ready to Review the Integration?
          </h2>
          <p className="text-[#a9bfd7] mb-10">
            Use the documentation and contact path to align commercial scope,
            credentials, and rollout planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-block rounded-full bg-[#00d4ff] px-8 py-3 font-semibold text-[#04121c] transition hover:bg-[#7cecff]"
            >
              Review integration docs
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-full border border-[#00d4ff]/25 px-8 py-3 font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
            >
              Discuss integration
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
