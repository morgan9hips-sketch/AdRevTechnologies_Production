'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'

const navigation = [
  { name: 'About', href: '/#about' },
  { name: 'Services', href: '/#services' },
  { name: 'Adify', href: '/adify' },
  { name: 'Docs', href: '/docs' },
  { name: 'Partners', href: '/partners' },
  { name: 'Dashboard', href: '/dashboard' },
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
    // Check authentication state
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
          // Token expired
          localStorage.removeItem('auth_token')
          localStorage.removeItem('refresh_token')
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
      }
    }
  }, [pathname]) // Re-check on route changes

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    setIsAuthenticated(false)
    setUserInfo(null)
    // Redirect to home page
    window.location.href = '/'
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <Logo size="medium" showWordmark={true} />
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
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
                  ? 'text-blue-600'
                  : 'text-gray-900 hover:text-blue-600'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-x-4">
              <div className="flex items-center text-sm text-gray-700">
                <User className="h-4 w-4 mr-1" />
                <span>{userInfo?.name || 'User'}</span>
              </div>
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/partners">
                <Button>Become a Partner</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-700">
                    <User className="h-4 w-4 mr-1 inline" />
                    {userInfo?.name || 'User'}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link
                    href="/partners"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">Become a Partner</Button>
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
