'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart2,
  Megaphone,
  Send,
  FileText,
  Layout,
  Settings,
  Key,
  Zap,
  Home,
} from 'lucide-react'

const navItems = [
  { label: 'Analytics', href: '/platform/analytics', icon: BarChart2 },
  { label: 'Campaigns', href: '/platform/campaigns', icon: Megaphone },
  { label: 'Marketing', href: '/platform/marketing', icon: Send },
  { label: 'Reports', href: '/platform/reports', icon: FileText },
  { label: 'Platform Preview', href: '/platform/preview', icon: Layout },
]

const disabledItems = [
  { label: 'Settings', icon: Settings },
  { label: 'API Keys', icon: Key },
  { label: 'Webhooks', icon: Zap },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-[240px] flex-shrink-0 border-r border-[#1e2d4a] bg-[#0a0f1e] md:flex md:flex-col">
      {/* Logo */}
      <div className="border-b border-[#1e2d4a] px-5 pb-5 pt-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[20px] font-bold leading-none text-[#3b82f6]">
            ■
          </span>
          <div>
            <span className="font-bold text-white text-sm leading-none">
              Ad Rev
            </span>{' '}
            <span className="text-xs text-[#94a3b8]">Technologies</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-[#94a3b8]">
          Client Workspace · Atlas Commerce
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Home link */}
        <div className="mb-3 border-b border-[#1e2d4a] pb-3">
          <a
            href="https://www.adrevtechnologies.com"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e2d4a]/50 transition-colors"
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            Home
          </a>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-2 border-[#3b82f6] bg-[#3b82f6]/10 pl-[10px] text-[#3b82f6]'
                  : 'text-[#94a3b8] hover:bg-[#1e2d4a]/50 hover:text-[#f1f5f9]'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="my-3 border-t border-[#1e2d4a]" />

        {/* Disabled items */}
        {disabledItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              title="Coming soon"
              className="cursor-not-allowed rounded-lg px-3 py-2 text-sm font-medium text-[#94a3b8] opacity-40"
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* Bottom status */}
      <div className="border-t border-[#1e2d4a] px-5 py-4">
        <p className="mb-1 text-xs text-[#94a3b8]">Commercial environment</p>
        <p className="flex items-center gap-1 text-xs text-[#10b981]">
          <span>●</span>
          <span>All systems operational</span>
        </p>
      </div>
    </aside>
  )
}
