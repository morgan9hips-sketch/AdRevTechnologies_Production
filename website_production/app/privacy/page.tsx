export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600 mb-6">Last Updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-700 mb-4">
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Name, email address, and contact information</li>
            <li>Account credentials and authentication information</li>
            <li>Payment and billing information</li>
            <li>Communication preferences</li>
            <li>Any other information you choose to provide</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send you technical notices, updates, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities</li>
            <li>Detect, prevent, and address technical issues and fraud</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
          <p className="text-gray-700">
            We do not sell, trade, or rent your personal information to third parties. We may share
            your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect and defend our rights and property</li>
            <li>With service providers who assist in our operations</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
          <p className="text-gray-700">
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction. These
            measures include encryption, access controls, and secure data storage.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
          <p className="text-gray-700">
            We retain your personal information for as long as necessary to provide our services,
            comply with legal obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
          <p className="text-gray-700 mb-4">
            You have the right to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Access and receive a copy of your personal data</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict processing of your data</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
          <p className="text-gray-700">
            We use cookies and similar tracking technologies to collect information about your
            browsing activities. You can control cookies through your browser settings. For more
            details, see our{' '}
            <a href="/cookies" className="text-blue-600 hover:text-blue-500">
              Cookie Policy
            </a>
            .
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at:{' '}
            <a href="mailto:privacy@adrevtechnologies.com" className="text-blue-600 hover:text-blue-500">
              privacy@adrevtechnologies.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
