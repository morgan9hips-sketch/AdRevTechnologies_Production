import Link from 'next/link'
import { Twitter, Linkedin, Mail } from 'lucide-react'
import { Logo } from '@/components/logo'
import { contactEmail, footerLinkGroups } from '@/lib/site-content'

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/adrevtech', icon: Twitter },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/adrevtech',
    icon: Linkedin,
  },
  { name: 'Email', href: `mailto:${contactEmail}`, icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#030914] text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <Logo size="medium" showWordmark={true} />
          <a
            href="https://paystack.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Secured by Paystack"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://website.assets.paystack.com/assets/img/logos/paystack-logo-embed.png"
              alt="Paystack"
              className="h-8 opacity-70 hover:opacity-100 transition-opacity"
            />
          </a>
        </div>
        <div className="grid gap-8 md:grid-cols-[1.15fr_0.85fr_0.85fr_0.85fr]">
          <div>
            <p className="max-w-md text-sm leading-7 text-[#9bb4cd]">
              Ad Rev Technologies is the infrastructure layer for engagement,
              monetisation, and attribution across platforms and agency-managed
              client accounts.
            </p>
            <p className="mt-5 text-sm font-medium text-[#d8e5f2]">
              Most platforms do not need more users. They need better
              infrastructure.
            </p>
          </div>

          <FooterColumn title="Company" links={footerLinkGroups.company} />
          <FooterColumn title="Resources" links={footerLinkGroups.resources} />
          <FooterColumn title="Legal" links={footerLinkGroups.legal} />
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex space-x-6">
              {socialLinks.map((item) => {
                const Icon = item.icon
                const isMail = item.href.startsWith('mailto:')

                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target={isMail ? undefined : '_blank'}
                    rel={isMail ? undefined : 'noopener noreferrer'}
                    className="text-[#7f97b3] transition-colors hover:text-white"
                  >
                    <span className="sr-only">{item.name}</span>
                    <Icon className="h-6 w-6" />
                  </a>
                )
              })}
            </div>
            <div className="text-right">
              <p className="text-sm text-[#9bb4cd]">
                &copy; {new Date().getFullYear()} Ad Rev Technologies. All
                rights reserved.
              </p>
              <p className="mt-1 text-xs text-[#6a8199]">
                Brand-blended infrastructure for monetisation, rewards, and
                campaign orchestration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({
  title,
  links,
}: {
  title: string
  links: ReadonlyArray<{ label: string; href: string }>
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#7ee7ff]">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((item) => {
          const isMail = item.href.startsWith('mailto:')

          return (
            <li key={item.label}>
              {isMail ? (
                <a
                  href={item.href}
                  className="text-[#9bb4cd] transition-colors hover:text-white"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  href={item.href}
                  className="text-[#9bb4cd] transition-colors hover:text-white"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
