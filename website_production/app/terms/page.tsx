export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700">
            By accessing and using Ad Rev Technologies services, you accept and agree to be bound by the
            terms and provision of this agreement. If you do not agree to these Terms of Service, please
            do not use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-700">
            Ad Rev Technologies provides ad monetization platform services, API access, white-label
            solutions, and revenue sharing programs. We reserve the right to modify, suspend or
            discontinue the service at any time without notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Partner Responsibilities</h2>
          <p className="text-gray-700">
            As a partner, you agree to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
            <li>Provide accurate and complete information during registration</li>
            <li>Maintain the security of your account credentials</li>
            <li>Comply with all applicable laws and regulations</li>
            <li>Use our services in accordance with our policies and guidelines</li>
            <li>Not engage in fraudulent or malicious activities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
          <p className="text-gray-700">
            All content, trademarks, and data on this platform, including but not limited to software,
            databases, text, graphics, icons, and hyperlinks are the property of or licensed to Ad Rev
            Technologies and are protected by applicable intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Payment Terms</h2>
          <p className="text-gray-700">
            Payment terms, revenue sharing percentages, and payout schedules are outlined in your
            individual partnership agreement. We reserve the right to modify payment terms with
            reasonable notice.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Limitation of Liability</h2>
          <p className="text-gray-700">
            Ad Rev Technologies shall not be liable for any indirect, incidental, special, consequential
            or punitive damages, including without limitation, loss of profits, data, use, goodwill, or
            other intangible losses.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
          <p className="text-gray-700">
            We may terminate or suspend your access to our services immediately, without prior notice or
            liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
          <p className="text-gray-700">
            For questions about these Terms of Service, please contact us at:{' '}
            <a href="mailto:legal@adrevtechnologies.com" className="text-blue-600 hover:text-blue-500">
              legal@adrevtechnologies.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
