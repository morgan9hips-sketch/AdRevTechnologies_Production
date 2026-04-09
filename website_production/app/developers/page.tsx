import Link from 'next/link'
import { Code, Webhook, FileText, Key, Gauge, BarChart3 } from 'lucide-react'

const integrationSteps = [
  {
    number: '1',
    title: 'Register your platform',
    description:
      'Apply via /partners, receive API credentials, and access your tenant dashboard.',
  },
  {
    number: '2',
    title: 'Generate your API key',
    description:
      'Scoped keys per tenant from your dashboard. Rate-limited by tier. Rotate at any time.',
  },
  {
    number: '3',
    title: 'Make your first call',
    description:
      'POST /engagement/start and receive your first reward event back via webhook.',
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
      'Interactive API documentation at /docs. Test endpoints directly in the browser with your API key.',
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
    <div className="bg-[#080d1a] text-[#f1f5f9] min-h-screen">
      {/* Hero */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Code className="mx-auto h-14 w-14 text-[#3b82f6] mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#f1f5f9] mb-6">
            Developer Integration Portal
          </h1>
          <p className="text-lg text-[#94a3b8]">
            Integrate the Ad Rev engagement engine into your platform. RESTful
            API, webhook delivery, Swagger docs, and tier-based access.
          </p>
        </div>
      </section>

      {/* Integration Steps */}
      <section className="bg-[#0f1629] py-24 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#f1f5f9] mb-4">
              Get Integrated in Three Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {integrationSteps.map((step) => (
              <div
                key={step.number}
                className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-8"
              >
                <div className="w-10 h-10 rounded-full bg-[#3b82f6] flex items-center justify-center text-white font-bold text-lg mb-5">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-[#f1f5f9] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#94a3b8] text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Snippet */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#f1f5f9] mb-4">
              See It in Action
            </h2>
            <p className="text-[#94a3b8]">
              A real API call and the webhook response it triggers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs text-[#94a3b8] mb-2 font-medium uppercase tracking-wider">
                API Request
              </div>
              <pre className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-6 text-sm text-[#94a3b8] overflow-x-auto whitespace-pre-wrap">
                <code>{requestExample}</code>
              </pre>
            </div>
            <div>
              <div className="text-xs text-[#94a3b8] mb-2 font-medium uppercase tracking-wider">
                Webhook Response
              </div>
              <pre className="bg-[#0f1629] border border-[#1e2d4a] rounded-xl p-6 text-sm text-[#94a3b8] overflow-x-auto whitespace-pre-wrap">
                <code>{webhookExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-[#0f1629] py-24 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#f1f5f9] mb-4">
              Built for Developers
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.title}
                  className="bg-[#080d1a] border border-[#1e2d4a] rounded-xl p-6"
                >
                  <Icon className="h-7 w-7 text-[#3b82f6] mb-4" />
                  <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">
                    {card.title}
                  </h3>
                  <p className="text-[#94a3b8] text-sm">{card.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#f1f5f9] mb-4">
            Ready to Integrate?
          </h2>
          <p className="text-[#94a3b8] mb-10">
            Access the full API documentation or register your platform to
            receive credentials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/docs"
              className="inline-block bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              View Full API Documentation
            </Link>
            <Link
              href="/contact"
              className="inline-block border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Register Your Platform
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
