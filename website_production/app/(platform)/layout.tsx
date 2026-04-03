'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Sidebar } from '@/components/platform/sidebar'
import { Topbar } from '@/components/platform/topbar'

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    // Fixed overlay that covers the entire viewport, hiding the root marketing layout
    <div
      className="fixed inset-0 z-50 flex overflow-hidden"
      style={{ backgroundColor: '#080d1a' }}
    >
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {mobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative z-10 flex-shrink-0" style={{ width: '240px' }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar with hamburger */}
        <div
          className="flex md:hidden items-center px-4 flex-shrink-0 border-b"
          style={{
            height: '64px',
            backgroundColor: '#0a0f1e',
            borderColor: '#1e2d4a',
          }}
        >
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-2 rounded-lg mr-3"
            style={{ color: '#94a3b8' }}
          >
            {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-semibold text-white text-sm">Ad Rev Platform</span>
        </div>

        {/* Desktop topbar */}
        <div className="hidden md:block">
          <Topbar />
        </div>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
