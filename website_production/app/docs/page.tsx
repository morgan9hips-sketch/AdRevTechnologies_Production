import Link from 'next/link'
import { BookOpen, Code2, Lock, TerminalSquare, Webhook } from 'lucide-react'
import { docsHighlights } from '@/lib/site-content'

const docsExplorerUrl =
  process.env.NEXT_PUBLIC_API_DOCS_URL ||
  'https://api.adrevtechnologies.com/docs'

const endpoints = [
  {
    method: 'POST',
    path: '/v1/auth/login',
    description: 'Authenticate and receive a JWT token.',
  },
  {
    method: 'POST',
    path: '/v1/engagement/start',
    description: 'Create an engagement session for a user and campaign.',
  },
  {
    method: 'POST',
    path: '/v1/rewards/confirm',
    description: 'Confirm the qualifying event and trigger the reward path.',
  },
  {
    method: 'POST',
    path: '/v1/webhooks/receive',
    description: 'Receive signed callbacks for rewards and attribution events.',
  },
]

const codeExample = `curl -X POST https://api.adrevtechnologies.com/v1/engagement/start \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "external_user_id": "usr_98234",
    "campaign_id": "cmp_founding_partner",
    "engagement_type": "rewarded_video"
  }'`

export default function DocsPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#02060f_0%,#081321_38%,#07111f_100%)] text-white">
      <section className="px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/8 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
              <BookOpen className="h-3.5 w-3.5" />
              Docs
            </div>
            <h1 className="mt-6 max-w-[1080px] text-5xl font-bold uppercase leading-[0.92] tracking-[-0.04em] text-white sm:text-6xl lg:text-[clamp(2.2rem,3.2vw,3rem)]">
              API documentation built for secure platform integration.
            </h1>
            <p className="mt-10 max-w-[980px] text-base leading-8 text-[#8ea7c2] sm:text-lg">
              Everything technical teams need to review endpoints, event flows,
              webhook delivery, and platform fit without exposing core systems.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={docsExplorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#05131d] transition hover:bg-[#7cecff]"
              >
                Open interactive explorer
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-6 py-3 text-sm font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
              >
                View pricing
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
              >
                Speak with our team
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-8">
        <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-2 xl:grid-cols-4">
          {docsHighlights.map((item, index) => {
            const icons = [Code2, Webhook, Lock, TerminalSquare]
            const Icon = icons[index]
            return (
              <div
                key={item}
                className="rounded-[28px] border border-[#ff8a3d]/20 bg-white/[0.03] p-6 text-center"
              >
                <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-[#1d4ed8]/18 p-3 text-[#91c5ff]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm leading-7 text-[#dce7f4]">{item}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(6,12,22,0.96),rgba(8,20,37,0.92))] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
              Integration path
            </p>
            <ol className="mt-6 space-y-5 text-sm leading-7 text-[#dbe6f3]">
              <li>
                1. Review the API surface and match endpoints to your event
                model.
              </li>
              <li>
                2. Provision credentials, webhook endpoints, and environment
                settings.
              </li>
              <li>
                3. Send engagement events and receive signed reward callbacks.
              </li>
              <li>
                4. Track attribution, analytics, and audit trails from one
                reporting layer.
              </li>
            </ol>
          </div>

          <div className="rounded-[32px] border border-[#ff8a3d]/20 bg-[#07121f] p-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
                Quickstart
              </p>
              <span className="rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/8 px-3 py-1 text-xs font-semibold text-[#7ee7ff]">
                cURL
              </span>
            </div>
            <pre className="mt-6 overflow-x-auto rounded-[24px] border border-[#ff8a3d]/15 bg-[#020711] p-6 text-sm leading-7 text-[#d6e4f3]">
              <code>{codeExample}</code>
            </pre>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 pt-6">
        <div className="mx-auto max-w-6xl rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-8 sm:p-10">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#7ee7ff]">
              Core endpoints
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Production endpoints for platform, reward, and attribution flows.
            </h2>
          </div>
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.path}
                className="grid gap-3 rounded-[24px] border border-[#ff8a3d]/15 bg-white/[0.03] px-5 py-5 md:grid-cols-[auto_1fr] md:items-center"
              >
                <div className="inline-flex w-fit rounded-full border border-[#00d4ff]/20 bg-[#00d4ff]/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#7ee7ff]">
                  {endpoint.method}
                </div>
                <div>
                  <p className="font-mono text-sm text-white">
                    {endpoint.path}
                  </p>
                  <p className="mt-1 text-sm text-[#aec4dc]">
                    {endpoint.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
