export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies</h2>
          <p className="text-gray-700">
            Cookies are small text files that are placed on your computer or mobile device when you
            visit a website. They are widely used to make websites work more efficiently and provide
            information to the owners of the site.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Cookies</h2>
          <p className="text-gray-700 mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
            <li><strong>Authentication:</strong> To remember your login state</li>
            <li><strong>Preferences:</strong> To remember your settings and preferences</li>
            <li><strong>Analytics:</strong> To understand how visitors use our website</li>
            <li><strong>Security:</strong> To protect against fraudulent activity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Session Cookies</h3>
              <p className="text-gray-700">
                Temporary cookies that expire when you close your browser. These are essential for
                navigating our website.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Persistent Cookies</h3>
              <p className="text-gray-700">
                Cookies that remain on your device for a set period or until you delete them. These
                help us remember your preferences.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">First-Party Cookies</h3>
              <p className="text-gray-700">
                Cookies set by our website directly.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Third-Party Cookies</h3>
              <p className="text-gray-700">
                Cookies set by third-party services we use, such as analytics providers.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Managing Cookies</h2>
          <p className="text-gray-700 mb-4">
            You can control and manage cookies in various ways:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Browser Settings:</strong> Most browsers allow you to refuse or accept cookies</li>
            <li><strong>Delete Cookies:</strong> You can delete all cookies that are already on your device</li>
            <li><strong>Block Cookies:</strong> You can set your browser to block all cookies</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Please note that blocking all cookies may impact your experience on our website and limit
            the functionality available to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Specific Cookies We Use</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Cookie Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">session_id</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Maintains user session</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">cookieConsent</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Remembers cookie preferences</td>
                  <td className="px-6 py-4 text-sm text-gray-700">1 year</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm text-gray-900">auth_token</td>
                  <td className="px-6 py-4 text-sm text-gray-700">Authentication token</td>
                  <td className="px-6 py-4 text-sm text-gray-700">7 days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Updates to This Policy</h2>
          <p className="text-gray-700">
            We may update this Cookie Policy from time to time. We will notify you of any changes by
            posting the new Cookie Policy on this page and updating the &quot;Last Updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about our use of cookies, please contact us at:{' '}
            <a href="mailto:privacy@adrevtechnologies.com" className="text-blue-600 hover:text-blue-500">
              privacy@adrevtechnologies.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
