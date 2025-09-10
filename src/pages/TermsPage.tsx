import React from 'react'
import { FileText, Scale, AlertTriangle, CreditCard, Truck, Shield } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function TermsPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('termsTitle')}</h1>
            <p className="text-lg text-gray-600">{t('lastUpdated')}: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Scale className="h-6 w-6 text-green-600 mr-3" />
                  Agreement to Terms
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to Sweet Trip! These Terms and Conditions ("Terms") govern your use of our website and services. 
                  By accessing or using our website, you agree to be bound by these Terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you do not agree to these Terms, please do not use our services.
                </p>
              </section>

              {/* Definitions */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Definitions</h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li><strong>"Company"</strong> refers to Sweet Trip</li>
                  <li><strong>"Service"</strong> refers to our website and e-commerce platform</li>
                  <li><strong>"User"</strong> refers to anyone who accesses our website</li>
                  <li><strong>"Customer"</strong> refers to users who make purchases</li>
                  <li><strong>"Products"</strong> refers to candies and treats sold on our platform</li>
                </ul>
              </section>

              {/* Use of Service */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Use of Service</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Eligibility</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You must be at least 18 years old to use our service. By using our service, you represent and warrant 
                  that you are of legal age to form a binding contract.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Permitted Use</h3>
                <p className="text-gray-700 leading-relaxed mb-4">You may use our service to:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Browse and purchase products</li>
                  <li>Create and manage your account</li>
                  <li>Access customer support</li>
                  <li>Participate in our World Cup 2026 features</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Prohibited Use</h3>
                <p className="text-gray-700 leading-relaxed mb-4">You may not:</p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Use the service for any unlawful purpose</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with the proper functioning of the service</li>
                  <li>Use automated systems to access the service</li>
                  <li>Resell or redistribute our products without permission</li>
                </ul>
              </section>

              {/* Products and Orders */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-6 w-6 text-green-600 mr-3" />
                  Products and Orders
                </h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Information</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant 
                  that product descriptions or other content is accurate, complete, or error-free.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Pricing and Payment</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>All prices are in USD and subject to change without notice</li>
                  <li>Payment is processed securely through Stripe</li>
                  <li>Orders are processed upon payment confirmation</li>
                  <li>We reserve the right to refuse or cancel orders</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">Order Processing</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Orders are typically processed within 1-2 business days. You will receive email confirmations 
                  for order placement, processing, and shipping.
                </p>
              </section>

              {/* Shipping and Delivery */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Truck className="h-6 w-6 text-green-600 mr-3" />
                  Shipping and Delivery
                </h2>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Free shipping on orders over $60</li>
                  <li>Standard shipping: $5.99 (3-7 business days)</li>
                  <li>We ship to the United States and select international locations</li>
                  <li>Delivery times are estimates and not guaranteed</li>
                  <li>Risk of loss transfers to you upon delivery</li>
                </ul>
              </section>

              {/* Returns and Refunds */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Returns and Refunds</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We want you to be completely satisfied with your purchase. Please see our 
                  <a href="/returns" className="text-blue-600 hover:text-blue-700 underline"> Returns Policy</a> for detailed information.
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>30-day return window for unopened products</li>
                  <li>Refunds processed within 5-10 business days</li>
                  <li>Customer responsible for return shipping costs</li>
                  <li>Damaged or defective items replaced at no cost</li>
                </ul>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The service and its original content, features, and functionality are owned by Sweet Trip and are 
                  protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may not reproduce, distribute, or create derivative works without our written permission.
                </p>
              </section>

              {/* Disclaimers */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                  Disclaimers
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. 
                  WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>Warranties of merchantability and fitness for a particular purpose</li>
                  <li>Warranties regarding the accuracy or reliability of the service</li>
                  <li>Warranties that the service will be uninterrupted or error-free</li>
                </ul>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  IN NO EVENT SHALL SWEET TRIP BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, 
                  DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our total liability shall not exceed the amount paid by you for the products or services.
                </p>
              </section>

              {/* Indemnification */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
                <p className="text-gray-700 leading-relaxed">
                  You agree to defend, indemnify, and hold harmless Sweet Trip from and against any claims, 
                  damages, obligations, losses, liabilities, costs, or debt arising from your use of the service 
                  or violation of these Terms.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of the United States, 
                  without regard to conflict of law principles. Any disputes shall be resolved in the courts of 
                  competent jurisdiction.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify users of any material 
                  changes by posting the new Terms on this page and updating the "Last updated" date. 
                  Your continued use of the service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="h-6 w-6 text-green-600 mr-3" />
                  Contact Information
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you have any questions about these Terms and Conditions, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700">Email: legal@sweettrip.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700">Phone: +1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-700">Address: 123 Sweet Street, Candy City, CC 12345</span>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
