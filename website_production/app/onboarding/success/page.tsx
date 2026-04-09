import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Activation Request Recorded | Ad Rev Technologies',
  robots: {
    index: false,
    follow: false,
  },
}

export default function OnboardingSuccessPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#02060f_0%,#081321_38%,#07111f_100%)] text-white min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl rounded-[32px] border border-[#ff8a3d]/20 bg-[linear-gradient(160deg,rgba(7,16,29,0.96),rgba(8,21,40,0.92))] p-8 sm:p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#10b981]/15 text-[#10b981]">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.24em] text-[#7ee7ff]">
          Activation Route
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your activation request has been recorded.
        </h1>
        <p className="mt-4 text-base leading-7 text-[#c7d8ea]">
          A member of the Ad Rev Technologies team will review your request and
          coordinate the next commercial and technical steps directly.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#00d4ff] px-6 py-3 text-sm font-semibold text-[#06131d] transition hover:bg-[#7cecff]"
          >
            Contact us
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/5"
          >
            Review pricing
          </Link>
        </div>
      </div>
    </div>
  )
}
