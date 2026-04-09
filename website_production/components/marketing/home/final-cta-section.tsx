import Link from 'next/link'

export function FinalCtaSection() {
  return (
    <section className="px-6 pb-24 pt-12">
      <div className="mx-auto max-w-7xl rounded-[36px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(0,212,255,0.12),rgba(10,16,32,0.94),rgba(29,78,216,0.18))] px-8 py-12 text-center shadow-[0_24px_120px_rgba(0,212,255,0.12)] sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
          Final CTA
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Launch the infrastructure before your competitors stitch the stack
          together.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#c3d4e9]">
          Protect the self-serve founding-partner checkout for your first
          client, route higher-scale opportunities into request access, and
          present the brand like infrastructure instead of a placeholder landing
          page.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#06131e] transition hover:bg-[#7cecff]"
          >
            View pricing
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-[#00d4ff]/25 px-6 py-3 text-sm font-semibold text-[#7ee7ff] transition hover:bg-[#00d4ff]/10"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  )
}
