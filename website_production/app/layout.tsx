import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BetaBanner } from '@/components/layout/beta-banner'
import { Providers } from '@/lib/providers'

export const metadata: Metadata = {
  title: 'Ad Rev Technologies - Powering Smarter Ad Revenue Ecosystems',
  description:
    'Professional fintech/adtech parent company providing white-label solutions, API access, and ad monetization platforms including Cash for Ads.',
  keywords: [
    'ad monetization',
    'fintech',
    'adtech',
    'api',
    'white-label',
    'revenue sharing',
  ],
  authors: [{ name: 'Ad Rev Technologies' }],
  openGraph: {
    title: 'Ad Rev Technologies - Powering Smarter Ad Revenue Ecosystems',
    description:
      'Professional fintech/adtech parent company providing innovative ad monetization solutions',
    url: 'https://adrevtechnologies.com',
    siteName: 'Ad Rev Technologies',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          <BetaBanner />
          <Header />
          <main className="min-h-screen pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
