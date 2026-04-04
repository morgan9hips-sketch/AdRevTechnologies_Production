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
    <aside
      className="hidden md:flex flex-col flex-shrink-0 border-r"
      style={{
        width: '240px',
        backgroundColor: '#0a0f1e',
        borderColor: '#1e2d4a',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b" style={{ borderColor: '#1e2d4a' }}>
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold leading-none"
            style={{ color: '#3b82f6', fontSize: '20px' }}
          >
            ■
          </span>
          <div>
            <span className="font-bold text-white text-sm leading-none">Ad Rev</span>{' '}
            <span className="text-xs" style={{ color: '#94a3b8' }}>
              Technologies
            </span>
          </div>
        </div>
        <p className="text-xs mt-2" style={{ color: '#94a3b8' }}>
          Demo Tenant · BookieAI
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {/* Home link */}
        <div className="mb-3 pb-3 border-b" style={{ borderColor: '#1e2d4a' }}>
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
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'border-l-2 border-[#3b82f6] bg-[#3b82f6]/10 text-[#3b82f6]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#1e2d4a]/50'
              }`}
              style={isActive ? { paddingLeft: '10px' } : {}}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </Link>
          )
        })}

        {/* Divider */}
        <div className="my-3 border-t" style={{ borderColor: '#1e2d4a' }} />

        {/* Disabled items */}
        {disabledItems.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.label}
              title="Coming soon"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-40"
              style={{ color: '#94a3b8' }}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
            </div>
          )
        })}
      </nav>

      {/* Bottom status */}
      <div className="px-5 py-4 border-t" style={{ borderColor: '#1e2d4a' }}>
        <p className="text-xs mb-1" style={{ color: '#94a3b8' }}>
          Engine v1 · Prototype
        </p>
        <p className="text-xs flex items-center gap-1" style={{ color: '#10b981' }}>
          <span>●</span>
          <span>All systems operational</span>
        </p>
      </div>
    </aside>
  )
}
