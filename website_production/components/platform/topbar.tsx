'use client'

import { usePathname } from 'next/navigation'

const pageTitles: Record<string, string> = {
  '/platform/analytics': 'Analytics Dashboard',
  '/platform/campaigns': 'Campaigns',
  '/platform/marketing': 'Marketing Hub',
  '/platform/reports': 'Reports',
  '/platform/preview': 'Platform Blend Preview',
}

export function Topbar() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? 'Platform'

  return (
    <header
      className="flex items-center justify-between px-6 flex-shrink-0"
      style={{
        height: '64px',
        backgroundColor: '#0a0f1e',
        borderBottom: '1px solid #1e2d4a',
      }}
    >
      {/* Page title */}
      <h1 className="text-base font-semibold text-white">{title}</h1>

      {/* Prototype banner */}
      <div
        className="hidden sm:flex items-center px-4 py-1 rounded-lg text-xs font-semibold border"
        style={{
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          color: '#f59e0b',
        }}
      >
        Prototype Mode · Live data not yet connected
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">BookieAI</p>
          <span
            className="text-xs px-2 py-0.5 rounded font-medium"
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.2)',
              color: '#f59e0b',
            }}
          >
            Enterprise
          </span>
        </div>
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ backgroundColor: '#16a34a' }}
        >
          BA
        </div>
      </div>
    </header>
  )
}
