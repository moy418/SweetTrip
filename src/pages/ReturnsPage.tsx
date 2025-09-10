import React from 'react'
import { RotateCcw, Clock, Package, CheckCircle, XCircle, AlertTriangle, Mail, Phone } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function ReturnsPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
              <RotateCcw className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('returnsTitle')}</h1>
            <p className="text-lg text-gray-600">{t('returnsSubtitle')}</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            
            {/* Return Policy Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                Our Return Policy
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">30-Day Return Window</h3>
                  <p className="text-gray-700">
                    You have 30 days from the delivery date to return or exchange your items. 
                    Items must be in original, unopened condition.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800">Easy Process</h3>
                  <p className="text-gray-700">
                    Start your return online, print a prepaid label, and drop off at any authorized location. 
                    No questions asked for eligible items.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Full Refund</h3>
                  <p className="text-gray-700">
                    Receive a full refund to your original payment method within 5-10 business days 
                    after we receive your return.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800">Free Returns</h3>
                  <p className="text-gray-700">
                    We provide prepaid return labels for all domestic returns. 
                    International returns may incur shipping costs.
                  </p>
                </div>
              </div>
            </div>

            {/* Return Process */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Package className="h-6 w-6 text-blue-600 mr-3" />
                How to Return an Item
              </h2>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Start Return</h3>
                  <p className="text-gray-600 text-sm">Log into your account and select the items you want to return</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Print Label</h3>
                  <p className="text-gray-600 text-sm">Print the prepaid return shipping label we provide</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Package Items</h3>
                  <p className="text-gray-600 text-sm">Pack items securely in original packaging with the return label</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-orange-600">4</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Ship & Track</h3>
                  <p className="text-gray-600 text-sm">Drop off at any authorized location and track your return</p>
                </div>
              </div>
            </div>

            {/* Return Conditions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Conditions</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    Eligible for Return
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Items in original, unopened packaging</li>
                    <li>• Products within 30 days of delivery</li>
                    <li>• Items with original receipt or order confirmation</li>
                    <li>• Products not damaged by customer</li>
                    <li>• Items that haven't been consumed or opened</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                    <XCircle className="h-5 w-5 text-red-600 mr-2" />
                    Not Eligible for Return
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Opened or consumed food items</li>
                    <li>• Items damaged by customer misuse</li>
                    <li>• Products returned after 30 days</li>
                    <li>• Items without original packaging</li>
                    <li>• Custom or personalized items</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Refund Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 text-blue-600 mr-3" />
                Refund Information
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Time</h3>
                  <p className="text-gray-600">5-10 business days after we receive your return</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Refund Method</h3>
                  <p className="text-gray-600">Refunded to your original payment method</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Shipping Costs</h3>
                  <p className="text-gray-600">Original shipping costs are non-refundable</p>
                </div>
              </div>
            </div>

            {/* Exchanges */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Exchanges</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">How Exchanges Work</h3>
                  <p className="text-gray-700 mb-4">
                    If you'd like to exchange an item for a different size, flavor, or product, 
                    you can do so through our return process. Simply return the original item 
                    and place a new order for the item you want.
                  </p>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-800 mb-2">Exchange Process</h4>
                  <ol className="list-decimal list-inside space-y-2 text-blue-700">
                    <li>Return the original item using our standard return process</li>
                    <li>Place a new order for the item you want</li>
                    <li>We'll process your refund for the returned item</li>
                    <li>Your new item will ship immediately</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Damaged or Defective Items */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                Damaged or Defective Items
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  If you receive a damaged or defective item, please contact us immediately. 
                  We'll arrange for a replacement or full refund at no cost to you.
                </p>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">What to do:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Take photos of the damaged item and packaging</li>
                    <li>Contact us within 48 hours of delivery</li>
                    <li>We'll provide a prepaid return label</li>
                    <li>We'll send a replacement immediately</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* International Returns */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">International Returns</h2>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  International returns may incur additional shipping costs. Please contact us 
                  before returning international orders to discuss the best return method.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">International Return Process:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Contact us for return authorization</li>
                      <li>We'll provide return instructions</li>
                      <li>Customer responsible for return shipping</li>
                      <li>Refund processed after receipt</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Important Notes:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Customs duties are non-refundable</li>
                      <li>Return shipping costs are customer's responsibility</li>
                      <li>Processing time may be longer</li>
                      <li>Some items may not be returnable internationally</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Returns?</h2>
              <p className="text-gray-700 mb-6">
                Our customer service team is here to help with any return questions or concerns.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Email Support</p>
                      <p className="text-gray-600">returns@sweettrip.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Phone Support</p>
                      <p className="text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday: 9 AM - 6 PM EST</p>
                    <p className="text-gray-600">Saturday: 10 AM - 4 PM EST</p>
                  </div>
                  
                  <div>
                    <p className="font-semibold text-gray-800 mb-2">Response Time</p>
                    <p className="text-gray-600">Within 24 hours for email inquiries</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
