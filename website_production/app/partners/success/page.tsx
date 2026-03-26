import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="mt-4 text-2xl">Application Submitted!</CardTitle>
            <CardDescription>
              Thank you for applying to become a partner with Ad Rev Technologies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-blue-50 p-6">
              <h3 className="font-semibold text-blue-900">What happens next?</h3>
              <ul className="mt-4 space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">1.</span>
                  <span>
                    Our team will review your application within 24-48 hours
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">2.</span>
                  <span>
                    You&apos;ll receive an email confirmation once your account is approved
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">3.</span>
                  <span>
                    Once approved, you can log in to access your API keys and dashboard
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">4.</span>
                  <span>
                    Start integrating with our API and building your application
                  </span>
                </li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Have questions? Contact us at{' '}
                <a
                  href="mailto:partners@adrevtechnologies.com"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  partners@adrevtechnologies.com
                </a>
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
              <Link href="/docs">
                <Button>View Documentation</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
