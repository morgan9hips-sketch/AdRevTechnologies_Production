import type { Metadata } from 'next'
import { Manrope, Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/lib/providers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const displayFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
})

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Ad Rev Technologies — Infrastructure for Monetisation and Engagement',
  description:
    'Ad Rev Technologies unifies ads, referrals, campaigns, messaging, and analytics through one infrastructure layer for platforms and agencies.',
  keywords: [
    'engagement infrastructure',
    'rewards API',
    'white-label loyalty',
    'rewarded video ads',
    'referral engine',
    'B2B adtech',
    'engagement platform API',
  ],
  authors: [{ name: 'Ad Rev Technologies' }],
  openGraph: {
    title:
      'Ad Rev Technologies — Infrastructure for Monetisation and Engagement',
    description:
      'Ad Rev Technologies unifies ads, referrals, campaigns, messaging, and analytics through one infrastructure layer for platforms and agencies.',
    url: 'https://adrevtechnologies.com',
    siteName: 'Ad Rev Technologies',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-sans antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen pt-24">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
