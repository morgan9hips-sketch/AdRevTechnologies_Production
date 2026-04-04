'use client'

import { useState } from 'react'
import { Menu, X, BarChart2, Megaphone, Send, FileText, Layout, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/platform/sidebar'
import { Topbar } from '@/components/platform/topbar'

const mobileNavItems = [
  { label: 'Home', href: 'https://www.adrevtechnologies.com', icon: Home, external: true },
  { label: 'Analytics', href: '/platform/analytics', icon: BarChart2 },
  { label: 'Campaigns', href: '/platform/campaigns', icon: Megaphone },
  { label: 'Marketing', href: '/platform/marketing', icon: Send },
  { label: 'Reports', href: '/platform/reports', icon: FileText },
  { label: 'Platform Preview', href: '/platform/preview', icon: Layout },
]

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = usePathname()

  return (
    // Fixed overlay that covers the entire viewport, hiding the root marketing layout
    <div
      className="fixed inset-0 z-50 flex overflow-hidden"
      style={{ backgroundColor: '#080d1a' }}
    >
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar with hamburger */}
        <div
          className="flex md:hidden items-center justify-between px-4 flex-shrink-0 border-b"
          style={{
            height: '64px',
            backgroundColor: '#0a0f1e',
            borderColor: '#1e2d4a',
          }}
        >
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-lg"
            style={{ color: '#94a3b8' }}
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          {/* Ad Rev logo */}
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="font-bold" style={{ color: '#3b82f6', fontSize: '18px' }}>■</span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-white text-sm">Ad Rev</span>
              <span className="text-xs" style={{ color: '#94a3b8' }}>Technologies</span>
            </div>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div
            className="md:hidden flex-shrink-0 border-b"
            style={{ backgroundColor: '#0a0f1e', borderColor: '#1e2d4a' }}
          >
            {mobileNavItems.map((item) => {
              const Icon = item.icon
              const isActive =
                !item.external &&
                (pathname === item.href || pathname.startsWith(item.href + '/'))
              return item.external ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium border-t"
                  style={{ color: '#94a3b8', borderColor: '#1e2d4a' }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium border-t"
                  style={{
                    color: isActive ? '#3b82f6' : '#94a3b8',
                    borderColor: '#1e2d4a',
                    backgroundColor: isActive ? 'rgba(59, 130, 246, 0.08)' : undefined,
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Desktop topbar */}
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
