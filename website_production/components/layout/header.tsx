'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { Logo } from '@/components/logo'
import { siteNavigation } from '@/lib/site-content'

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

  const isActive = (href: string) => {
    if (href.includes('#')) {
      return pathname === '/'
    }

    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#030914]/78 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <Logo size="medium" showWordmark={true} />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-[#9bb4cd]"
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
        <div className="hidden lg:flex lg:gap-x-7">
          {siteNavigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-sm font-semibold leading-6 transition-colors ${
                isActive(item.href)
                  ? 'text-[#7ee7ff]'
                  : 'text-[#9bb4cd] hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-x-4">
              <div className="flex items-center text-sm text-[#9bb4cd]">
                <User className="h-4 w-4 mr-1" />
                <span>{userInfo?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-[#9bb4cd] hover:text-white transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/contact"
              className="rounded-full bg-[#00d4ff] px-5 py-2.5 text-sm font-semibold text-[#04121c] transition hover:bg-[#7cecff]"
            >
              Contact us
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-white/10 bg-[#07111f]/95 backdrop-blur-xl">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {siteNavigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-base font-medium text-[#9bb4cd] transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-[#9bb4cd]">
                    <User className="h-4 w-4 mr-1 inline" />
                    {userInfo?.name || 'User'}
                  </div>
                  <button
                    className="w-full flex items-center justify-start px-3 py-2 text-sm text-[#9bb4cd] transition-colors hover:text-white"
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
                <Link
                  href="/contact"
                  className="block rounded-xl bg-[#00d4ff] px-3 py-2 text-center font-semibold text-[#04121c] transition hover:bg-[#7cecff]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact us
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
