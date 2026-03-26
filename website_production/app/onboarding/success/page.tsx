'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ExternalLink } from 'lucide-react';

export default function OnboardingSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-600 mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Your Ad Platform!</h1>
          <p className="text-xl text-gray-400">
            Your account has been successfully created and is ready to use.
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Next Steps</CardTitle>
            <CardDescription className="text-gray-400">
              Here's what you can do to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-4">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Customize Your Branding</h3>
                  <p className="text-gray-400 text-sm">
                    Upload your logo, set brand colors, and make the platform your own.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-4">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Invite Your Team</h3>
                  <p className="text-gray-400 text-sm">
                    Add team members and assign roles to collaborate effectively.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-4">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Configure Ad Networks</h3>
                  <p className="text-gray-400 text-sm">
                    Connect your ad networks and start monetizing user engagement.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold mr-4">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Review Analytics</h3>
                  <p className="text-gray-400 text-sm">
                    Monitor your platform's performance and user engagement metrics.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
            asChild
          >
            <Link href="/dashboard">
              Go to Dashboard
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="text-sm text-gray-400">
            Need help?{' '}
            <Link href="/docs" className="text-blue-400 hover:text-blue-300">
              Check out our documentation
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
