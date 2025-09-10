import React from 'react'
import { Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function PrivacyPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('privacyPolicyTitle')}</h1>
            <p className="text-lg text-gray-600">{t('lastUpdated')}: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Eye className="h-6 w-6 text-blue-600 mr-3" />
                  {t('introduction')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('privacyIntro')}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our service, you agree to the collection and use of information in accordance with this policy.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Database className="h-6 w-6 text-blue-600 mr-3" />
                  {t('informationWeCollect')}
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('personalInformation')}</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Payment information (processed securely through Stripe)</li>
                  <li>Account credentials and preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">{t('usageInformation')}</h3>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                  <li>Website usage patterns and preferences</li>
                  <li>Product browsing and purchase history</li>
                  <li>Device information and IP address</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Process and fulfill your orders</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Improve our website and services</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Comply with legal obligations</li>
                  <li>Prevent fraud and enhance security</li>
                </ul>
              </section>

              {/* Information Sharing */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>With shipping partners to deliver your orders</li>
                  <li>With payment processors (Stripe) to process payments</li>
                  <li>With service providers who assist in our operations</li>
                  <li>When required by law or to protect our rights</li>
                  <li>With your explicit consent</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Lock className="h-6 w-6 text-blue-600 mr-3" />
                  Data Security
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, 
                  alteration, disclosure, or destruction. This includes:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure payment processing through Stripe</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information</li>
                  <li>Secure data storage and backup procedures</li>
                </ul>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your browsing experience, analyze website traffic, 
                  and personalize content. You can control cookie settings through your browser preferences.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Types of cookies we use:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 mt-2">
                  <li><strong>Essential cookies:</strong> Required for website functionality</li>
                  <li><strong>Analytics cookies:</strong> Help us understand website usage</li>
                  <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
                </ul>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Delete your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Mail className="h-6 w-6 text-blue-600 mr-3" />
                  Contact Us
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Email: privacy@sweettrip.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-blue-600" />
                      <span className="text-gray-700">Phone: +1 (555) 123-4567</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Updates */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review 
                  this Privacy Policy periodically for any changes.
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
