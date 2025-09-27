import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const ReturnsPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            No Returns Policy
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Important information about our no-returns policy
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* No Returns Policy */}
          <section className="mb-12">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 border-2 border-red-200">
              <div className="text-center">
                <div className="text-6xl mb-6">🚫</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  No Returns Accepted
                </h2>
                <p className="text-lg text-gray-700 mb-6">
                  Due to the nature of our products (food items), we cannot accept returns for hygiene and safety reasons.
                </p>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-600">
                    <strong>Important:</strong> All sales are final. Please review your order carefully before completing your purchase.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Why No Returns */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">🤔</span>
              Why No Returns?
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-yellow-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🦠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Food Safety</h3>
                <p className="text-gray-600">We cannot guarantee the safety of returned food items</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🌡️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Temperature Control</h3>
                <p className="text-gray-600">Proper storage conditions cannot be verified</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Packaging Integrity</h3>
                <p className="text-gray-600">Original packaging may be compromised during transit</p>
              </div>
            </div>
          </section>

          {/* Exceptions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">⚠️</span>
              Limited Exceptions
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Damaged Items</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                      <div className="text-2xl">📸</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Report Immediately</h4>
                        <p className="text-gray-600 text-sm">Within 24 hours of delivery</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                      <div className="text-2xl">📞</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Contact Support</h4>
                        <p className="text-gray-600 text-sm">Email photos and order details</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Wrong Items</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                      <div className="text-2xl">✅</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Our Mistake</h4>
                        <p className="text-gray-600 text-sm">We'll send correct items immediately</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-white rounded-lg">
                      <div className="text-2xl">🎁</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Keep Wrong Items</h4>
                        <p className="text-gray-600 text-sm">As our apology for the error</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Before You Order */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">📝</span>
              Before You Order
            </h2>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">👀</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Review Carefully</h3>
                  <p className="text-gray-600">Check product descriptions, flavors, and quantities</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🏠</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Address</h3>
                  <p className="text-gray-600">Ensure delivery address is correct and accessible</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📞</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ask Questions</h3>
                  <p className="text-gray-600">Contact us before ordering if you have doubts</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Customer Service */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">📞</span>
              Need Help?
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-3">Get help via email</p>
                  <a href="mailto:support@sweettripcandy.com" className="text-blue-600 font-semibold hover:underline">
                    support@sweettripcandy.com
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📞</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-gray-600 mb-3">Call us directly</p>
                  <a href="tel:1-800-SWEET-TRIP" className="text-green-600 font-semibold hover:underline">
                    1-800-SWEET-TRIP
                  </a>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
                  <p className="text-gray-600 mb-3">Chat with our team</p>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Start Chat
                  </button>
                </div>
              </div>
              <div className="mt-6 bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Service Hours:</h4>
                <p className="text-gray-700">
                  Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                  Saturday: 10:00 AM - 4:00 PM EST<br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="text-center pt-8 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              All sales are final. Please review your order carefully before purchasing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReturnsPage
