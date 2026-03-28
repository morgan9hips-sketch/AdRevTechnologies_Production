import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/lib/providers'

export const metadata: Metadata = {
  title: 'Ad Rev Technologies — Engagement & Rewards Infrastructure',
  description:
    'White-label engagement and rewards infrastructure API. Plug rewarded video ads, referrals, and promotional campaigns into any platform without building the engine yourself.',
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
    title: 'Ad Rev Technologies — Engagement & Rewards Infrastructure',
    description:
      'White-label B2B engagement and rewards infrastructure. Plug rewarded video ads, referrals, and campaigns into any platform.',
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
      <body className="font-sans antialiased">
        <Providers>
          <Header />
          <main className="min-h-screen pt-24">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}