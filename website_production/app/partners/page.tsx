'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      '1,000 API requests/month',
      'Basic documentation',
      'Community support',
      'Standard rate limits',
      'Email notifications',
    ],
  },
  {
    name: 'Pro',
    price: '$99',
    description: 'For growing businesses',
    features: [
      '100,000 API requests/month',
      'Advanced documentation',
      'Priority email support',
      'Higher rate limits',
      'Webhook notifications',
      'Custom API keys',
      'Analytics dashboard',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large-scale operations',
    features: [
      'Unlimited API requests',
      'White-label solutions',
      'Dedicated account manager',
      'SLA guarantees',
      'Custom integrations',
      'Revenue sharing',
      '24/7 phone support',
      'Custom contract terms',
    ],
  },
];

export default function PartnersPage() {
  const router = useRouter();
  const [selectedTier, setSelectedTier] = useState('pro');
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    website: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/partners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          apiTier: selectedTier,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Redirect to success page or dashboard
      router.push('/partners/success');
    } catch (err) {
      setError('Failed to submit registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Become a Partner
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Join our network of successful partners and start monetizing with the most advanced ad
              revenue platform. Choose a plan that fits your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <Card
                key={tier.name}
                className={`relative ${
                  tier.popular ? 'border-2 border-blue-600 shadow-lg' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    {tier.price !== 'Custom' && <span className="text-gray-500">/month</span>}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="mr-2 h-5 w-5 flex-shrink-0 text-green-600" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
                    variant={tier.popular ? 'default' : 'outline'}
                    onClick={() => setSelectedTier(tier.name.toLowerCase())}
                  >
                    {selectedTier === tier.name.toLowerCase() ? 'Selected' : 'Select Plan'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Partner Registration</CardTitle>
              <CardDescription>
                Fill out the form below to apply for partner access. We&apos;ll review your
                application and get back to you within 24-48 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="companyName"
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Tell us about your use case <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  />
                </div>

                <div className="rounded-md bg-blue-50 p-4">
                  <p className="text-sm text-blue-800">
                    Selected Plan: <strong className="capitalize">{selectedTier}</strong>
                  </p>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
