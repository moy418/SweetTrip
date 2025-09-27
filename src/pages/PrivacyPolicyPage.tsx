import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy - Sweet Trip
          </h1>
          <p className="text-gray-600 text-lg">
            Last updated: September 23, 2024
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Introduction */}
          <section className="mb-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              {t.legal.privacyPolicy.introduction}
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">📋</span>
              {t.legal.privacyPolicy.informationWeCollect}
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Personal Information:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Shipping and billing addresses</li>
                <li>Payment information (processed securely through Stripe)</li>
                <li>Account preferences and order history</li>
              </ul>
              
              <h3 className="font-semibold text-gray-900 mb-3 mt-4">Usage Information:</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Website usage patterns and preferences</li>
                <li>Device information and browser type</li>
                <li>IP address and location data</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">🎯</span>
              {t.legal.privacyPolicy.howWeUseInfo}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Service Delivery:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support</li>
                  <li>Send order confirmations and updates</li>
                  <li>Manage your account</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Improvement:</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Personalize your experience</li>
                  <li>Recommend products you'll love</li>
                  <li>Improve our website and services</li>
                  <li>Analyze usage patterns</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">🤝</span>
              {t.legal.privacyPolicy.informationSharing}
            </h2>
            <div className="bg-yellow-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only in these limited circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> Trusted partners who help us operate our business (shipping, payment processing)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>Your Consent:</strong> When you explicitly agree to share your information</li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">🔒</span>
              {t.legal.privacyPolicy.dataSecurity}
            </h2>
            <div className="bg-red-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We implement industry-standard security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through Stripe</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal information</li>
                <li>Secure data storage and backup systems</li>
              </ul>
            </div>
          </section>

          {/* Cookies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">🍪</span>
              {t.legal.privacyPolicy.cookies}
            </h2>
            <div className="bg-indigo-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your browsing experience:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚙️</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Essential</h4>
                  <p className="text-sm text-gray-600">Required for basic site functionality</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Analytics</h4>
                  <p className="text-sm text-gray-600">Help us understand site usage</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <h4 className="font-semibold text-gray-900 mb-1">Personalization</h4>
                  <p className="text-sm text-gray-600">Remember your preferences</p>
                </div>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">⚖️</span>
              {t.legal.privacyPolicy.yourRights}
            </h2>
            <div className="bg-teal-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Data portability</li>
                  <li>Restrict processing</li>
                  <li>Object to processing</li>
                  <li>Lodge complaints with authorities</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact & Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">📞</span>
              {t.legal.privacyPolicy.contactUs}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy or want to exercise your rights, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Email:</h4>
                  <p className="text-gray-700">privacy@sweettripcandy.com</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Phone:</h4>
                  <p className="text-gray-700">1-800-SWEET-TRIP</p>
                </div>
              </div>
            </div>
          </section>

          {/* Changes */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-2xl mr-3">🔄</span>
              {t.legal.privacyPolicy.changes}
            </h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically for any changes.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              This Privacy Policy is effective as of September 23, 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
