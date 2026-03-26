'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  DollarSign, 
  TrendingUp, 
  Download,
  Calendar,
  CreditCard,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';

interface BillingRecord {
  month: string;
  totalCalls: number;
  totalRevenueCents: number;
  platformShare: number;
  tenantShare: number;
  billingStatus: string;
}

interface Invoice {
  id: string;
  month: string;
  amount: number;
  status: string;
  paidAt: string | null;
  invoiceUrl: string | null;
}

const pricingTiers = [
  {
    name: 'Free',
    price: 0,
    quota: 1000,
    pricePerCall: 0,
    features: [
      '1,000 API calls/month',
      'Basic analytics',
      'Community support',
      'Standard documentation',
    ],
    current: false,
  },
  {
    name: 'Pro',
    price: 100,
    quota: 100000,
    pricePerCall: 0.001,
    features: [
      '100,000 API calls/month',
      'Advanced analytics dashboard',
      'Priority support',
      'Webhook notifications',
      'Custom rate limits',
    ],
    current: true,
  },
  {
    name: 'Enterprise',
    price: null,
    quota: -1,
    pricePerCall: 0.005,
    features: [
      'Unlimited API calls',
      'Dedicated account manager',
      '24/7 premium support',
      'Custom integrations',
      'SLA guarantee',
      'White-label options',
    ],
    current: false,
  },
];

export default function DeveloperBillingPage() {
  const [billingHistory, setBillingHistory] = useState<BillingRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch from API
    // Mock data for now
    const mockBilling: BillingRecord[] = [
      {
        month: '2025-11',
        totalCalls: 45230,
        totalRevenueCents: 4523,
        platformShare: 3166,
        tenantShare: 1357,
        billingStatus: 'pending',
      },
      {
        month: '2025-10',
        totalCalls: 89500,
        totalRevenueCents: 8950,
        platformShare: 6265,
        tenantShare: 2685,
        billingStatus: 'paid',
      },
      {
        month: '2025-09',
        totalCalls: 72000,
        totalRevenueCents: 7200,
        platformShare: 5040,
        tenantShare: 2160,
        billingStatus: 'paid',
      },
    ];

    const mockInvoices: Invoice[] = [
      {
        id: 'inv_001',
        month: '2025-10',
        amount: 8950,
        status: 'paid',
        paidAt: '2025-11-01',
        invoiceUrl: '#',
      },
      {
        id: 'inv_002',
        month: '2025-09',
        amount: 7200,
        status: 'paid',
        paidAt: '2025-10-01',
        invoiceUrl: '#',
      },
    ];

    setBillingHistory(mockBilling);
    setInvoices(mockInvoices);
    setLoading(false);
  }, []);

  const totalRevenue = billingHistory.reduce((sum, record) => sum + record.tenantShare, 0);
  const currentMonth = billingHistory[0];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Billing & Usage
          </h1>
          <p className="mt-2 text-gray-600">
            Track your API usage, costs, and revenue share
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Month</CardTitle>
              <Calendar className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {currentMonth?.totalCalls.toLocaleString()}
              </div>
              <p className="text-xs text-gray-600">API calls</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(currentMonth?.totalRevenueCents / 100).toFixed(2)}
              </div>
              <p className="text-xs text-gray-600">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Share</CardTitle>
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ${(currentMonth?.tenantShare / 100).toFixed(2)}
              </div>
              <p className="text-xs text-gray-600">30% revenue</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <ArrowUpRight className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(totalRevenue / 100).toFixed(2)}
              </div>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>
        </div>

        {/* Current Plan */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Your active subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-lg border-2 p-6 ${
                    tier.current
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  {tier.current && (
                    <div className="mb-2 flex items-center text-sm font-semibold text-blue-600">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Current Plan
                    </div>
                  )}
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <div className="mt-2">
                    {tier.price !== null ? (
                      <>
                        <span className="text-3xl font-bold">${tier.price}</span>
                        <span className="text-gray-600">/month</span>
                      </>
                    ) : (
                      <span className="text-3xl font-bold">Custom</span>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    {tier.quota === -1 ? 'Unlimited' : `${tier.quota.toLocaleString()} calls/month`}
                  </div>
                  {!tier.current && (
                    <Button className="mt-4 w-full" variant={tier.name === 'Free' ? 'outline' : 'default'}>
                      {tier.name === 'Enterprise' ? 'Contact Sales' : `Upgrade to ${tier.name}`}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Revenue Sharing Breakdown</CardTitle>
            <CardDescription>How API marketplace revenue is distributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-blue-900">Platform Share</div>
                    <div className="mt-1 text-3xl font-bold text-blue-600">70%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ${((currentMonth?.platformShare || 0) / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-blue-900">This month</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-blue-900">
                  Infrastructure, support, billing, and maintenance
                </p>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-green-900">Your Share</div>
                    <div className="mt-1 text-3xl font-bold text-green-600">30%</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ${((currentMonth?.tenantShare || 0) / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-green-900">This month</div>
                  </div>
                </div>
                <p className="mt-3 text-sm text-green-900">
                  Passive income from your tenant's API usage
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>Monthly API usage and revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left text-sm font-medium text-gray-600">Month</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600">API Calls</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600">Total Cost</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600">Your Share</th>
                    <th className="pb-3 text-right text-sm font-medium text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((record) => (
                    <tr key={record.month} className="border-b">
                      <td className="py-3 text-sm">
                        {new Date(record.month).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long' 
                        })}
                      </td>
                      <td className="py-3 text-right text-sm">
                        {record.totalCalls.toLocaleString()}
                      </td>
                      <td className="py-3 text-right text-sm">
                        ${(record.totalRevenueCents / 100).toFixed(2)}
                      </td>
                      <td className="py-3 text-right text-sm font-semibold text-green-600">
                        ${(record.tenantShare / 100).toFixed(2)}
                      </td>
                      <td className="py-3 text-right">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            record.billingStatus === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : record.billingStatus === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {record.billingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Invoices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Download your billing invoices</CardDescription>
              </div>
              <CreditCard className="h-5 w-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {new Date(invoice.month).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      ${(invoice.amount / 100).toFixed(2)} • Paid on{' '}
                      {invoice.paidAt && new Date(invoice.paidAt).toLocaleDateString()}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <p className="mt-2 text-sm text-gray-600">
              Have questions about billing or pricing? Our support team is here to help.
            </p>
            <div className="mt-4 flex gap-4">
              <Link href="/docs">
                <Button variant="outline">View Documentation</Button>
              </Link>
              <Button>Contact Support</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
