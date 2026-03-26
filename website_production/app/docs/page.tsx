'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Lock, Zap, Shield, Book, Terminal } from 'lucide-react';
import Link from 'next/link';

const endpoints = [
  {
    method: 'POST',
    path: '/auth/signup',
    description: 'Create a new user account',
    auth: false,
  },
  {
    method: 'POST',
    path: '/auth/login',
    description: 'Authenticate and receive JWT token',
    auth: false,
  },
  {
    method: 'GET',
    path: '/ads',
    description: 'List all available ads',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/ads/:id/watch',
    description: 'Start watching an ad (returns uniqueWatchKey)',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/ads/:id/confirm',
    description: 'Confirm ad watch with uniqueWatchKey',
    auth: true,
  },
  {
    method: 'GET',
    path: '/api/users/:id/wallet',
    description: 'Get wallet balance and transaction history',
    auth: true,
  },
];

const features = [
  {
    icon: Lock,
    title: 'JWT Authentication',
    description: 'Secure authentication using JSON Web Tokens with refresh token support',
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    description: 'Lightning-fast API responses with sub-second latency',
  },
  {
    icon: Shield,
    title: 'Anti-fraud Protection',
    description: 'Built-in fraud detection with device fingerprinting and velocity checks',
  },
  {
    icon: Code,
    title: 'RESTful Design',
    description: 'Clean, predictable REST API following industry best practices',
  },
];

const codeExamples = {
  javascript: `// Initialize API client
const API_URL = 'https://api.adrevtechnologies.com';
const API_KEY = 'your-api-key-here';

// Authenticate
const response = await fetch(\`\${API_URL}/auth/login\`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
  }),
});

const { token } = await response.json();

// Make authenticated request
const ads = await fetch(\`\${API_URL}/ads\`, {
  headers: {
    'Authorization': \`Bearer \${token}\`,
  },
});

const adsData = await ads.json();`,
  python: `import requests

API_URL = 'https://api.adrevtechnologies.com'
API_KEY = 'your-api-key-here'

# Authenticate
response = requests.post(
    f'{API_URL}/auth/login',
    json={
        'email': 'user@example.com',
        'password': 'password123'
    }
)

token = response.json()['token']

# Make authenticated request
ads = requests.get(
    f'{API_URL}/ads',
    headers={'Authorization': f'Bearer {token}'}
)

ads_data = ads.json()`,
  curl: `# Authenticate
curl -X POST https://api.adrevtechnologies.com/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"user@example.com","password":"password123"}'

# Make authenticated request
curl https://api.adrevtechnologies.com/ads \\
  -H "Authorization: Bearer YOUR_TOKEN_HERE"`,
};

export default function DocsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Book className="mx-auto h-16 w-16 text-blue-600" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              API Documentation
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Complete documentation for integrating with the Cash for Ads API. Build powerful ad
              monetization features with our enterprise-grade platform.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/partners">
                <Button size="lg">Get API Access</Button>
              </Link>
              <a
                href="http://localhost:4000/api-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Interactive API Explorer <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Enterprise-Grade API
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Built for scale, security, and developer experience
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-2">
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

      {/* API Endpoints */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Core Endpoints</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Key API endpoints for user management and ad monetization
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span
                          className={`inline-flex rounded-md px-3 py-1 text-xs font-semibold ${
                            endpoint.method === 'GET'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-sm font-mono text-gray-900">{endpoint.path}</code>
                      </div>
                      {endpoint.auth && (
                        <Lock className="h-4 w-4 text-gray-400" aria-label="Requires authentication" />
                      )}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{endpoint.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Terminal className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Quick Start Examples
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get started in minutes with these code examples
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl space-y-8">
            {Object.entries(codeExamples).map(([lang, code]) => (
              <Card key={lang}>
                <CardHeader>
                  <CardTitle className="capitalize">{lang}</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="overflow-x-auto rounded-md bg-gray-900 p-4 text-sm text-gray-100">
                    <code>{code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Authentication Guide */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Authentication</CardTitle>
                <CardDescription>
                  All API requests require authentication using JWT tokens
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">1. Obtain Access Token</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Send a POST request to <code>/auth/login</code> with your credentials to receive
                    a JWT token.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">2. Include in Requests</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Add the token to the Authorization header:
                    <code className="ml-2">Authorization: Bearer YOUR_TOKEN</code>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">3. Token Refresh</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    Tokens expire after 24 hours. Use the refresh token endpoint to obtain a new
                    access token without re-authenticating.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Rate Limiting */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Rate Limiting</CardTitle>
                <CardDescription>
                  API rate limits vary by partner tier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <h3 className="font-semibold">Free Tier</h3>
                      <p className="text-sm text-gray-600">1,000 requests/month</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">1K</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <h3 className="font-semibold">Pro Tier</h3>
                      <p className="text-sm text-gray-600">100,000 requests/month</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">100K</span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                    <div>
                      <h3 className="font-semibold">Enterprise Tier</h3>
                      <p className="text-sm text-gray-600">Unlimited requests</p>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">∞</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to start building?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
            Get API access today and start integrating Cash for Ads into your application.
          </p>
          <div className="mt-10">
            <Link href="/partners">
              <Button size="lg" variant="secondary">
                Get API Access
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
