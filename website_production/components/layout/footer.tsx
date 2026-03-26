import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Logo } from '@/components/logo'

const footerLinks = {
  company: [
    { name: 'About', href: '/#about' },
    { name: 'Services', href: '/#services' },
    { name: 'Contact', href: '/#contact' },
  ],
  resources: [
    { name: 'API Documentation', href: '/docs' },
    { name: 'Partner Portal', href: '/partners' },
    { name: 'Dashboard', href: '/dashboard' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Beta Disclaimer', href: '/beta-terms' },
  ],
}

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/morgan9hips-sketch',
    icon: Github,
  },
  { name: 'Twitter', href: 'https://twitter.com/adrevtech', icon: Twitter },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/adrevtech',
    icon: Linkedin,
  },
  { name: 'Email', href: 'mailto:contact@adrevtechnologies.com', icon: Mail },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        {/* Logo Section */}
        <div className="mb-8">
          <Logo size="medium" showWordmark={true} />
          <p className="mt-4 text-sm text-gray-400 max-w-md">
            Enterprise-grade ad monetization platform with complete API access,
            white-label solutions, and revenue sharing.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          {/* Beta Disclaimer */}
          <div className="mb-6 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0 inline-flex items-center px-2 py-1 rounded text-xs font-semibold bg-blue-500 text-white">
                BETA
              </span>
              <p className="text-sm text-gray-300">
                This platform is currently in beta. Features may change as we
                improve based on your feedback.{' '}
                <Link
                  href="/beta-terms"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Learn more about beta terms
                </Link>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <div className="flex space-x-6">
              {socialLinks.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} Ad Rev Technologies. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
