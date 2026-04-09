'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Key,
  TrendingUp,
  Activity,
  Clock,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  AlertCircle,
} from 'lucide-react'
import Link from 'next/link'

interface ApiKey {
  id: string
  name: string
  keyPrefix: string
  scopes: string[]
  rateLimit: number
  usageCount: number
  lastUsedAt: string | null
  createdAt: string
}

interface DeveloperAccount {
  id: string
  companyName: string
  contactEmail: string
  billingTier: string
  apiQuota: number
  currentUsage: number
  quotaResetAt: string
  overageAllowed: boolean
}

interface UsageStats {
  totalCalls: number
  callsByEndpoint: Record<string, number>
  callsByStatus: Record<string, number>
  averageResponseTime: number
}

export default function DeveloperDashboard() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [developerAccount, setDeveloperAccount] =
    useState<DeveloperAccount | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [showKey, setShowKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch from API
    // Mock data for now
    setDeveloperAccount({
      id: '1',
      companyName: 'Acme Corp',
      contactEmail: 'dev@acme.com',
      billingTier: 'pro',
      apiQuota: 100000,
      currentUsage: 45230,
      quotaResetAt: new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      overageAllowed: false,
    })

    setApiKeys([
      {
        id: '1',
        name: 'Production API Key',
        keyPrefix: 'sk_live_abc',
        scopes: ['read:ads', 'write:ads', 'read:users'],
        rateLimit: 1000,
        usageCount: 45230,
        lastUsedAt: new Date().toISOString(),
        createdAt: new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        id: '2',
        name: 'Development API Key',
        keyPrefix: 'sk_test_xyz',
        scopes: ['read:ads'],
        rateLimit: 100,
        usageCount: 1205,
        lastUsedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ])

    setUsageStats({
      totalCalls: 45230,
      callsByEndpoint: {
        '/api/ads': 25000,
        '/api/users': 15000,
        '/api/wallet': 5230,
      },
      callsByStatus: {
        '2xx': 44000,
        '4xx': 1000,
        '5xx': 230,
      },
      averageResponseTime: 125,
    })

    setLoading(false)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // TODO: Add toast notification
  }

  const quotaPercentage = developerAccount
    ? (developerAccount.currentUsage / developerAccount.apiQuota) * 100
    : 0

  const tierColors = {
    free: 'text-gray-600',
    pro: 'text-blue-600',
    enterprise: 'text-purple-600',
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Developer Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your API keys, monitor usage, and track performance
          </p>
        </div>

        {/* Account Overview */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Usage
              </CardTitle>
              <Activity className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {developerAccount?.currentUsage.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">
                of {developerAccount?.apiQuota.toLocaleString()} calls
              </p>
              <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
                <div
                  className={`h-2 rounded-full ${
                    quotaPercentage > 90
                      ? 'bg-red-600'
                      : quotaPercentage > 75
                        ? 'bg-yellow-600'
                        : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(quotaPercentage, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Billing Tier
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold capitalize ${tierColors[developerAccount?.billingTier as keyof typeof tierColors] || 'text-gray-900'}`}
              >
                {developerAccount?.billingTier}
              </div>
              <p className="text-xs text-gray-600">
                {developerAccount?.billingTier === 'free' && '1K calls/month'}
                {developerAccount?.billingTier === 'pro' && '100K calls/month'}
                {developerAccount?.billingTier === 'enterprise' && 'Unlimited'}
              </p>
              <Link href="/developers/billing">
                <Button variant="link" className="mt-2 h-auto p-0 text-xs">
                  Upgrade Plan →
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Quota Resets
              </CardTitle>
              <Clock className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {developerAccount?.quotaResetAt &&
                  Math.ceil(
                    (new Date(developerAccount.quotaResetAt).getTime() -
                      Date.now()) /
                      (1000 * 60 * 60 * 24),
                  )}{' '}
                days
              </div>
              <p className="text-xs text-gray-600">
                {developerAccount?.quotaResetAt &&
                  new Date(developerAccount.quotaResetAt).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quota Warning */}
        {quotaPercentage > 90 && (
          <Card className="mb-8 border-yellow-600 bg-yellow-50">
            <CardContent className="flex items-center p-4">
              <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-900">
                  Approaching Quota Limit
                </p>
                <p className="text-sm text-yellow-800">
                  You've used {quotaPercentage.toFixed(1)}% of your monthly
                  quota. Consider upgrading to avoid service interruption.
                </p>
              </div>
              <Link href="/developers/billing" className="ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-yellow-600 text-yellow-600"
                >
                  Upgrade Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Usage Statistics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Usage Statistics (Last 30 Days)</CardTitle>
            <CardDescription>
              API call analytics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Calls by Endpoint
                </h3>
                <div className="space-y-2">
                  {usageStats &&
                    Object.entries(usageStats.callsByEndpoint).map(
                      ([endpoint, count]) => (
                        <div
                          key={endpoint}
                          className="flex items-center justify-between"
                        >
                          <code className="text-sm text-gray-600">
                            {endpoint}
                          </code>
                          <span className="font-semibold">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ),
                    )}
                </div>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-gray-900">
                  Response Status
                </h3>
                <div className="space-y-2">
                  {usageStats &&
                    Object.entries(usageStats.callsByStatus).map(
                      ([status, count]) => (
                        <div
                          key={status}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-600">
                            {status}
                          </span>
                          <span className="font-semibold">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      ),
                    )}
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Avg Response Time
                    </span>
                    <span className="font-semibold">
                      {usageStats?.averageResponseTime}ms
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys and access permissions
                </CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create New Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <Key className="mr-2 h-5 w-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-900">
                          {key.name}
                        </h3>
                      </div>
                      <div className="mt-2 flex items-center space-x-2">
                        <code className="rounded bg-gray-100 px-2 py-1 text-sm text-gray-900">
                          {showKey === key.id
                            ? 'sk_live_abc123def456...'
                            : `${key.keyPrefix}...`}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setShowKey(showKey === key.id ? null : key.id)
                          }
                        >
                          {showKey === key.id ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard('sk_live_abc123def456...')
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {key.scopes.map((scope) => (
                          <span
                            key={scope}
                            className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700"
                          >
                            {scope}
                          </span>
                        ))}
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-gray-600 sm:grid-cols-3">
                        <div>
                          <span className="font-medium">Usage:</span>{' '}
                          {key.usageCount.toLocaleString()} calls
                        </div>
                        <div>
                          <span className="font-medium">Rate Limit:</span>{' '}
                          {key.rateLimit}/hour
                        </div>
                        <div>
                          <span className="font-medium">Last Used:</span>{' '}
                          {key.lastUsedAt
                            ? new Date(key.lastUsedAt).toLocaleDateString()
                            : 'Never'}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link href="/docs">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">API Documentation</CardTitle>
                <CardDescription>
                  View complete API reference and guides
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/developers/billing">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Billing & Usage</CardTitle>
                <CardDescription>
                  Track costs and manage your subscription
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/contact">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">Integration Review</CardTitle>
                <CardDescription>
                  Coordinate guided testing access and implementation support
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
