import Link from 'next/link'
import { Code2, FileText, ShieldCheck, TerminalSquare } from 'lucide-react'
import { docsHighlights } from '@/lib/site-content'

const previewIcons = [FileText, Code2, ShieldCheck, TerminalSquare]

export function DocsPreviewSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
            Documentation and integration
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for technical confidence from the first review.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#a9bfd7]">
            Clear documentation, API references, and integration examples help
            teams evaluate fit quickly and move toward launch with confidence.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-full bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#05131d] transition hover:bg-[#7cecff]"
            >
              Read documentation
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-6 py-3 text-sm font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
            >
              Speak with our team
            </Link>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {docsHighlights.map((highlight, index) => {
            const Icon = previewIcons[index]
            return (
              <div
                key={highlight}
                className="rounded-[28px] border border-[#ff8a3d]/20 bg-white/[0.03] p-6 text-center"
              >
                <div className="mx-auto inline-flex items-center justify-center rounded-2xl bg-[#1d4ed8]/20 p-3 text-[#8ec5ff]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-sm leading-7 text-[#dbe6f2]">
                  {highlight}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
