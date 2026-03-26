'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: [
      'Up to 100 users',
      'Basic analytics',
      'Community support',
      'Standard features',
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    price: '$99',
    period: '/month',
    description: 'For growing businesses',
    features: [
      'Up to 1,000 users',
      'Advanced analytics',
      'Email support',
      'Custom branding',
      'API access',
    ],
    popular: true,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$299',
    period: '/month',
    description: 'For scaling operations',
    features: [
      'Up to 10,000 users',
      'Premium analytics',
      'Priority support',
      'Custom branding',
      'API access',
      'Webhooks',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$999',
    period: '/month',
    description: 'For large organizations',
    features: [
      'Unlimited users',
      'Enterprise analytics',
      '24/7 support',
      'Custom branding',
      'Unlimited API access',
      'Webhooks',
      'Dedicated account manager',
    ],
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState('starter');
  const [formData, setFormData] = useState({
    organizationName: '',
    subdomain: '',
    adminEmail: '',
    adminName: '',
    adminPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // TODO: Implement actual tenant registration API call
      // This would typically:
      // 1. Create tenant in backend
      // 2. Create admin user
      // 3. Set up Stripe subscription if not free plan
      // 4. Send welcome email
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.organizationName,
          subdomain: formData.subdomain,
          subscriptionTier: selectedPlan,
          // Add other tenant details
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create tenant');
      }

      // Redirect to success page or dashboard
      router.push('/onboarding/success');
    } catch (err: any) {
      setError(err.message || 'Failed to complete registration');
    } finally {
      setLoading(false);
    }
  };

  const validateSubdomain = (value: string) => {
    // Only lowercase letters, numbers, and hyphens
    return /^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Start Your Ad Revenue Platform</h1>
            <p className="text-xl text-gray-400">
              Get started in minutes with our white-label solution
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 1 ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                1
              </div>
              <div className={`h-1 w-24 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`} />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 2 ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                2
              </div>
              <div className={`h-1 w-24 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`} />
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= 3 ? 'bg-blue-600' : 'bg-gray-700'
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* Step 1: Choose Plan */}
          {step === 1 && (
            <div>
              <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {plans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-blue-500 border-2 bg-gray-800'
                        : 'border-gray-700 hover:border-gray-600 bg-gray-900'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Popular
                        </span>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-white">{plan.name}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {plan.description}
                      </CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-white">{plan.price}</span>
                        <span className="text-gray-400">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-300">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  onClick={() => setStep(2)}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Organization Details */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Organization Details</h2>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Organization Name *
                      </label>
                      <Input
                        value={formData.organizationName}
                        onChange={(e) =>
                          setFormData({ ...formData, organizationName: e.target.value })
                        }
                        placeholder="Acme Corp"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Subdomain *</label>
                      <div className="flex items-center">
                        <Input
                          value={formData.subdomain}
                          onChange={(e) =>
                            setFormData({ ...formData, subdomain: e.target.value.toLowerCase() })
                          }
                          placeholder="acme"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                        <span className="ml-2 text-gray-400">.cashforads.com</span>
                      </div>
                      {formData.subdomain && !validateSubdomain(formData.subdomain) && (
                        <p className="text-red-500 text-sm mt-1">
                          Only lowercase letters, numbers, and hyphens allowed
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={
                    !formData.organizationName ||
                    !formData.subdomain ||
                    !validateSubdomain(formData.subdomain)
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Admin Account */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Create Admin Account</h2>
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <Input
                        value={formData.adminName}
                        onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                        placeholder="John Doe"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <Input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                        placeholder="john@acme.com"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Password *</label>
                      <Input
                        type="password"
                        value={formData.adminPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, adminPassword: e.target.value })
                        }
                        placeholder="Min 8 characters"
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                </CardContent>
              </Card>
              <div className="flex justify-between mt-8">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    loading ||
                    !formData.adminName ||
                    !formData.adminEmail ||
                    !formData.adminPassword ||
                    formData.adminPassword.length < 8
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
