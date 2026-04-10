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
    <header className="flex h-[64px] flex-shrink-0 items-center justify-between border-b border-[#1e2d4a] bg-[#0a0f1e] px-6">
      {/* Page title */}
      <h1 className="text-base font-semibold text-white">{title}</h1>

      {/* Environment banner */}
      <div className="hidden items-center rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/10 px-4 py-1 text-xs font-semibold text-[#f59e0b] sm:flex">
        Presentation Environment · Commercial data view
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-white">BookieAI</p>
          <span className="rounded bg-[#f59e0b]/20 px-2 py-0.5 text-xs font-medium text-[#f59e0b]">
            Enterprise
          </span>
        </div>
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-sm font-bold text-white">
          BA
        </div>
      </div>
    </header>
  )
}
