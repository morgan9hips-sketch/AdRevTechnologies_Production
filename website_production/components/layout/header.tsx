'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { Logo } from '@/components/logo'

const navigation = [
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Docs', href: '/docs' },
  { name: 'Developers', href: '/developers' },
  { name: 'Partners', href: '/partners' },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userInfo, setUserInfo] = useState<{
    name?: string
    email?: string
  } | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.exp && payload.exp * 1000 > Date.now()) {
          setIsAuthenticated(true)
          setUserInfo({
            name: payload.name || payload.email?.split('@')[0],
            email: payload.email,
          })
        } else {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
        }
      } catch {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
      }
    }
  }, [pathname])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
    setUserInfo(null)
    window.location.href = '/'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080d1a]/90 backdrop-blur-md border-b border-[#1e2d4a]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <Logo size="medium" showWordmark={true} />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#94a3b8]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold leading-6 transition-colors ${
                pathname === item.href
                  ? 'text-[#3b82f6]'
                  : 'text-[#94a3b8] hover:text-[#f1f5f9]'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-x-4">
              <div className="flex items-center text-sm text-[#94a3b8]">
                <User className="h-4 w-4 mr-1" />
                <span>{userInfo?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#94a3b8] hover:text-[#f1f5f9] transition-colors px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/onboarding"
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                See It Live
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0f1629] border-b border-[#1e2d4a]">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-[#94a3b8] hover:bg-[#1e2d4a] hover:text-[#f1f5f9] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-[#94a3b8]">
                    <User className="h-4 w-4 mr-1 inline" />
                    {userInfo?.name || 'User'}
                  </div>
                  <button
                    className="w-full flex items-center justify-start px-3 py-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block px-3 py-2 text-base font-medium text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/onboarding"
                    className="block bg-[#3b82f6] hover:bg-[#2563eb] text-white text-center font-semibold px-3 py-2 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    See It Live
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
