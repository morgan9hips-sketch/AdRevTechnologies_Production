import type { Metadata } from 'next'
import { Suspense } from 'react'
import { FoundingMemberSuccessClient } from './success-client'

export const metadata: Metadata = {
  title: 'Payment Confirmation | Ad Rev Technologies',
  robots: {
    index: false,
    follow: false,
  },
}

export default function FoundingMemberSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#080d1a] text-[#f1f5f9] min-h-screen flex items-center justify-center">
          <p className="text-[#94a3b8]">Loading…</p>
        </div>
      }
    >
      <FoundingMemberSuccessClient />
    </Suspense>
  )
}
