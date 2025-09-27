import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const ShippingInfoPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shipping Information - Sweet Trip
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fast, reliable shipping to bring the world's candies to your doorstep
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Processing Time */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">⏱️</span>
              {t.legal.shipping.processingTime}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Order Received</h3>
                <p className="text-gray-600 mb-4">We process your order immediately</p>
                <div className="bg-green-100 rounded-lg p-3">
                  <p className="text-green-800 font-semibold">Same Day Processing</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🏭</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Packaging</h3>
                <p className="text-gray-600 mb-4">Carefully selected and packed</p>
                <div className="bg-blue-100 rounded-lg p-3">
                  <p className="text-blue-800 font-semibold">1-2 Business Days</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Shipping</h3>
                <p className="text-gray-600 mb-4">On its way to your doorstep</p>
                <div className="bg-purple-100 rounded-lg p-3">
                  <p className="text-purple-800 font-semibold">3-21 Days</p>
                </div>
              </div>
            </div>
          </section>

          {/* Shipping Rates */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">💰</span>
              {t.legal.shipping.shippingRates}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Domestic Shipping */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🇺🇸</span>
                  {t.legal.shipping.domesticShipping}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900">Standard Shipping</h4>
                      <p className="text-gray-600 text-sm">3-7 business days</p>
                    </div>
                    <span className="text-xl font-bold text-blue-600">$7.99</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900">Express Shipping</h4>
                      <p className="text-gray-600 text-sm">1-3 business days</p>
                    </div>
                    <span className="text-xl font-bold text-blue-600">$14.99</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900">FREE Shipping</h4>
                      <p className="text-gray-600 text-sm">On orders $60+</p>
                    </div>
                    <span className="text-xl font-bold text-green-600">FREE</span>
                  </div>
                </div>
              </div>

              {/* International Shipping */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="text-2xl mr-3">🌍</span>
                  {t.legal.shipping.internationalShipping}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900">Standard International</h4>
                      <p className="text-gray-600 text-sm">7-21 business days</p>
                    </div>
                    <span className="text-xl font-bold text-purple-600">$19.99</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
                    <div>
                      <h4 className="font-semibold text-gray-900">Express International</h4>
                      <p className="text-gray-600 text-sm">5-10 business days</p>
                    </div>
                    <span className="text-xl font-bold text-purple-600">$39.99</span>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> International orders may be subject to customs duties and taxes in your country.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Timeframes */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">📅</span>
              {t.legal.shipping.deliveryTime}
            </h2>
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Domestic Delivery</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Express: 1-3 business days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Standard: 3-7 business days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">Free Shipping: 5-10 business days</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">International Delivery</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-700">Express: 5-10 business days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">Standard: 7-21 business days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">Remote areas: 14-30 business days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">📍</span>
              {t.legal.shipping.tracking}
            </h2>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email Notification</h3>
                  <p className="text-gray-600">Get tracking info via email</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">SMS Updates</h3>
                  <p className="text-gray-600">Real-time delivery updates</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🌐</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Online Tracking</h3>
                  <p className="text-gray-600">Track your package 24/7</p>
                </div>
              </div>
              <div className="mt-6 bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">How to Track Your Order:</h4>
                <ol className="list-decimal list-inside text-gray-700 space-y-2">
                  <li>Check your email for tracking number</li>
                  <li>Visit our tracking page or use carrier's website</li>
                  <li>Enter your tracking number</li>
                  <li>Get real-time updates on your package location</li>
                </ol>
              </div>
            </div>
          </section>

          {/* Shipping Restrictions */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">⚠️</span>
              {t.legal.shipping.shippingRestrictions}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">🚫</span>
                  Restricted Items
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Items requiring refrigeration</li>
                  <li>Alcohol-containing products</li>
                  <li>Items with restricted ingredients</li>
                  <li>Products banned in destination country</li>
                </ul>
              </div>
              <div className="bg-yellow-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-3">📋</span>
                  Special Requirements
                </h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Age verification for certain products</li>
                  <li>Customs documentation</li>
                  <li>Import permits for some countries</li>
                  <li>Additional handling fees may apply</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Special Handling */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">🎁</span>
              {t.legal.shipping.specialHandling}
            </h2>
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎁</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Gift Wrapping</h3>
                  <p className="text-gray-600 mb-3">Beautiful presentation for your gifts</p>
                  <div className="bg-pink-100 rounded-lg p-3">
                    <p className="text-pink-800 font-semibold">+$4.99</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">💌</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Gift Message</h3>
                  <p className="text-gray-600 mb-3">Personal note included</p>
                  <div className="bg-purple-100 rounded-lg p-3">
                    <p className="text-purple-800 font-semibold">FREE</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🚚</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Signature Required</h3>
                  <p className="text-gray-600 mb-3">Secure delivery confirmation</p>
                  <div className="bg-indigo-100 rounded-lg p-3">
                    <p className="text-indigo-800 font-semibold">+$2.99</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Support */}
          <section className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="text-3xl mr-4">🆘</span>
              {t.legal.shipping.contactSupport}
            </h2>
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-4">📧</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 mb-3">Get help via email</p>
                  <a href="mailto:shipping@sweettripcandy.com" className="text-blue-600 font-semibold hover:underline">
                    shipping@sweettripcandy.com
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
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start Chat
                  </button>
                </div>
              </div>
              <div className="mt-6 bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Support Hours:</h4>
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
              Shipping information is subject to change. Please check back regularly for updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingInfoPage
