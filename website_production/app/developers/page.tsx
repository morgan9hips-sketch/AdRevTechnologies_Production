'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Code, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Shield, 
  BarChart3,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for testing and small projects',
    features: [
      '1,000 API calls/month',
      'Basic analytics',
      'Community support',
      'Standard documentation',
    ],
    quota: '1K calls',
    pricePerCall: 'Free',
    buttonText: 'Get Started',
    buttonVariant: 'outline' as const,
  },
  {
    name: 'Pro',
    price: '$100',
    description: 'For growing businesses and apps',
    features: [
      '100,000 API calls/month',
      'Advanced analytics dashboard',
      'Priority support',
      'Webhook notifications',
      'Custom rate limits',
    ],
    quota: '100K calls',
    pricePerCall: '$0.001/call',
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default' as const,
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale operations',
    features: [
      'Unlimited API calls',
      'Dedicated account manager',
      '24/7 premium support',
      'Custom integrations',
      'SLA guarantee',
      'White-label options',
    ],
    quota: 'Unlimited',
    pricePerCall: '$0.005/call',
    buttonText: 'Contact Sales',
    buttonVariant: 'outline' as const,
  },
];

const features = [
  {
    icon: Code,
    title: 'Developer-First API',
    description: 'Clean, well-documented REST API with SDKs for popular languages',
  },
  {
    icon: DollarSign,
    title: 'Usage-Based Billing',
    description: 'Only pay for what you use with transparent, predictable pricing',
  },
  {
    icon: TrendingUp,
    title: 'Revenue Sharing',
    description: 'Earn 30% revenue share on API marketplace transactions',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with API key management and rate limiting',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track API usage, performance, and revenue in real-time',
  },
  {
    icon: Zap,
    title: 'High Performance',
    description: 'Sub-100ms latency with 99.9% uptime SLA',
  },
];

export default function DevelopersPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Code className="mx-auto h-16 w-16 text-blue-600" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              API Marketplace for Developers
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Build powerful ad monetization features with our enterprise-grade API. 
              Join thousands of developers earning revenue through our API marketplace.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/developers/dashboard">
                <Button size="lg">
                  Get API Access <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Why Choose Our API?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Everything you need to build and monetize at scale
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <Icon className="h-10 w-10 text-blue-600" />
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <Card 
                key={tier.name} 
                className={tier.popular ? 'border-2 border-blue-600 shadow-lg' : ''}
              >
                <CardHeader>
                  {tier.popular && (
                    <span className="mb-2 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </span>
                  )}
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.price !== 'Custom' && <span className="text-gray-600">/month</span>}
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <div>Quota: {tier.quota}</div>
                    <div>Rate: {tier.pricePerCall}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href="/developers/dashboard">
                    <Button 
                      className="w-full" 
                      variant={tier.buttonVariant}
                    >
                      {tier.buttonText}
                    </Button>
                  </Link>
                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <CheckCircle2 className="mr-2 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Sharing */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card className="bg-gradient-to-br from-blue-50 to-green-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl">Revenue Sharing Program</CardTitle>
                    <CardDescription className="mt-2 text-base">
                      Earn money by providing API access to your tenants
                    </CardDescription>
                  </div>
                  <TrendingUp className="h-12 w-12 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-white p-6">
                    <div className="text-4xl font-bold text-blue-600">70%</div>
                    <div className="mt-2 text-sm font-semibold text-gray-900">Platform Share</div>
                    <div className="mt-1 text-xs text-gray-600">
                      We handle infrastructure, support, and billing
                    </div>
                  </div>
                  <div className="rounded-lg bg-white p-6">
                    <div className="text-4xl font-bold text-green-600">30%</div>
                    <div className="mt-2 text-sm font-semibold text-gray-900">Your Share</div>
                    <div className="mt-1 text-xs text-gray-600">
                      Earn passive income from your tenant's API usage
                    </div>
                  </div>
                </div>
                <div className="mt-6 rounded-lg bg-white p-6">
                  <h3 className="font-semibold text-gray-900">How It Works</h3>
                  <ol className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>1. Your tenants use the API through your platform</li>
                    <li>2. We track all API calls and calculate revenue</li>
                    <li>3. You receive 30% of the revenue generated</li>
                    <li>4. Get paid monthly via Stripe</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Get Started in Minutes
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Three simple steps to start using our API
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                    1
                  </div>
                  <CardTitle>Create Account</CardTitle>
                  <CardDescription>
                    Sign up for a developer account in seconds
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                    2
                  </div>
                  <CardTitle>Get API Key</CardTitle>
                  <CardDescription>
                    Generate your API key from the dashboard
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                    3
                  </div>
                  <CardTitle>Start Building</CardTitle>
                  <CardDescription>
                    Make your first API call and start earning
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to Start Building?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Join our API marketplace and start earning revenue from your applications today.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/developers/dashboard">
              <Button size="lg" variant="secondary">
                Access Dashboard
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
