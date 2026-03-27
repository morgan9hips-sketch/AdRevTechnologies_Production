import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail } from 'lucide-react'
import { Logo } from '@/components/logo'

const footerLinks = {
  company: [
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'Contact', href: 'mailto:contact@adrevtechnologies.com' },
  ],
  resources: [
    { name: 'API Documentation', href: '/docs' },
    { name: 'Developer Portal', href: '/developers' },
    { name: 'Partner Portal', href: '/partners' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Cookie Policy', href: '/cookies' },
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
        <div className="mb-8">
          <Logo size="medium" showWordmark={true} />
          <p className="mt-4 text-sm text-gray-400 max-w-md">
            White-label engagement and rewards infrastructure API. Plug rewarded video ads,
            referrals, and campaigns into any platform.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
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
              &copy; {new Date().getFullYear()} Ad Rev Technologies. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
