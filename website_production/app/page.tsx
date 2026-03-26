'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Code,
  DollarSign,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Powering Smarter Ad Revenue Ecosystems
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Enterprise-grade ad monetization platform with complete API
              access, white-label solutions, and revenue sharing. Join the
              future of advertising technology.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/partners">
                <Button size="lg">
                  Join as Partner <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button variant="outline" size="lg">
                  View API Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">
              About Us
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Building the Future of Ad Revenue
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Ad Rev Technologies is a fintech/adtech innovation company
              specializing in complete ad monetization platforms. We provide
              enterprise-grade solutions for businesses looking to implement
              sophisticated reward systems, API integrations, and white-label
              applications.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Shield className="h-5 w-5 flex-none text-blue-600" />
                  Enterprise Security
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Bank-level security with HMAC webhook verification, JWT
                    authentication, and complete audit trails for every
                    transaction.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Zap className="h-5 w-5 flex-none text-blue-600" />
                  Real-time Processing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Lightning-fast API responses with real-time ad serving,
                    instant reward distribution, and automated payout
                    processing.
                  </p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <Globe className="h-5 w-5 flex-none text-blue-600" />
                  Global Scale
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">
                    Built to scale globally with support for multiple
                    currencies, payment methods, and international ad networks.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Our Platforms */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Platforms
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover our suite of powerful ad monetization platforms
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-1">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl">Cash for Ads</CardTitle>
                <CardDescription>
                  Production-ready reward platform where users watch ads and
                  earn PayPal payouts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>
                      Complete ad monetization with multi-network support
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>
                      Anti-fraud system with device fingerprinting and velocity
                      checks
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>
                      PayPal batch payouts with automated reconciliation
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Complete ledger accounting and admin controls</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/dashboard">
                    <Button>
                      Access Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* B2B Services */}
      <section id="services" className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              B2B Services
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Enterprise solutions for businesses ready to scale
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
            <Card>
              <CardHeader>
                <Code className="h-10 w-10 text-blue-600" />
                <CardTitle className="mt-4">API Access</CardTitle>
                <CardDescription>
                  Complete REST API with comprehensive documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• RESTful endpoints</li>
                  <li>• JWT authentication</li>
                  <li>• Rate limiting by tier</li>
                  <li>• Webhook notifications</li>
                  <li>• SDKs available</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <DollarSign className="h-10 w-10 text-green-600" />
                <CardTitle className="mt-4">White-label Solutions</CardTitle>
                <CardDescription>
                  Launch your own branded reward platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Custom branding</li>
                  <li>• Your domain name</li>
                  <li>• Revenue sharing model</li>
                  <li>• Full API control</li>
                  <li>• Dedicated support</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-purple-600" />
                <CardTitle className="mt-4">Partner Program</CardTitle>
                <CardDescription>
                  Join our network of successful partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Tiered pricing plans</li>
                  <li>• Priority support</li>
                  <li>• Analytics dashboard</li>
                  <li>• Usage tracking</li>
                  <li>• Billing automation</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Join our partner network and start monetizing with the most
              advanced ad revenue platform. Contact us today to discuss your
              needs.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/partners">
                <Button size="lg" variant="secondary">
                  Become a Partner
                </Button>
              </Link>
              <a
                href="mailto:contact@adrevtechnologies.com"
                className="text-sm font-semibold leading-6 text-white hover:text-blue-100"
              >
                Contact Sales <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
