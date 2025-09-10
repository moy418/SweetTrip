import React from 'react'
import { Truck, Package, Clock, MapPin, DollarSign, Globe, Shield, AlertCircle } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function ShippingPage() {
  const { t } = useLanguage()
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('shippingTitle')}</h1>
            <p className="text-lg text-gray-600">{t('shippingSubtitle')}</p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            
            {/* Shipping Options */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Package className="h-6 w-6 text-blue-600 mr-3" />
                Shipping Options
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Free Shipping */}
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-800">Free Shipping</h3>
                      <p className="text-green-600">Orders over $60</p>
                    </div>
                  </div>
                  <ul className="text-green-700 space-y-2">
                    <li>• 3-7 business days delivery</li>
                    <li>• Standard ground shipping</li>
                    <li>• Tracking included</li>
                    <li>• Insurance included</li>
                  </ul>
                </div>

                {/* Standard Shipping */}
                <div className="border border-blue-200 rounded-lg p-6 bg-blue-50">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                      <Truck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-blue-800">Standard Shipping</h3>
                      <p className="text-blue-600">$5.99</p>
                    </div>
                  </div>
                  <ul className="text-blue-700 space-y-2">
                    <li>• 3-7 business days delivery</li>
                    <li>• Standard ground shipping</li>
                    <li>• Tracking included</li>
                    <li>• Insurance included</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Delivery Times */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 text-blue-600 mr-3" />
                Delivery Times
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">1-2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Time</h3>
                  <p className="text-gray-600">Business days to prepare your order</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">3-7</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Transit Time</h3>
                  <p className="text-gray-600">Business days for delivery</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-600">4-9</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Time</h3>
                  <p className="text-gray-600">Business days from order to delivery</p>
                </div>
              </div>
            </div>

            {/* Shipping Destinations */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="h-6 w-6 text-blue-600 mr-3" />
                Shipping Destinations
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">United States</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• All 50 states</li>
                    <li>• Washington D.C.</li>
                    <li>• Puerto Rico</li>
                    <li>• US Virgin Islands</li>
                    <li>• Standard shipping rates apply</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">International</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Canada: $15.99</li>
                    <li>• Mexico: $12.99</li>
                    <li>• Europe: $19.99</li>
                    <li>• Asia: $22.99</li>
                    <li>• Other countries: Contact us</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Special Handling */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                Special Handling
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Temperature Control</h3>
                  <p className="text-gray-700">
                    Our international candies are carefully packaged to maintain freshness during transit. 
                    We use insulated packaging for temperature-sensitive items.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800">Fragile Items</h3>
                  <p className="text-gray-700">
                    Delicate candies and chocolates are wrapped in protective materials and clearly marked 
                    as fragile to ensure safe delivery.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Customs & Duties</h3>
                  <p className="text-gray-700">
                    International orders may be subject to customs duties and taxes. These are the 
                    responsibility of the recipient and are not included in our shipping costs.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-gray-800">Restricted Items</h3>
                  <p className="text-gray-700">
                    Some countries have restrictions on certain food items. We'll notify you if your 
                    order contains restricted products for your destination.
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking & Support */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                Tracking & Support
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Tracking</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Email confirmation with tracking number</li>
                    <li>• Real-time tracking updates</li>
                    <li>• Delivery notifications</li>
                    <li>• Estimated delivery date</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Support</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 24/7 order status inquiries</li>
                    <li>• Shipping issue resolution</li>
                    <li>• Delivery address changes</li>
                    <li>• Lost package assistance</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AlertCircle className="h-6 w-6 text-yellow-600 mr-3" />
                Important Notes
              </h2>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>Delivery Address:</strong> Please ensure your shipping address is complete and accurate. 
                    We are not responsible for packages delivered to incorrect addresses.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>Delivery Attempts:</strong> If no one is available to receive the package, 
                    the carrier will leave a notice with instructions for pickup or rescheduling.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>Weather Delays:</strong> Severe weather conditions may cause delivery delays. 
                    We'll keep you informed of any significant delays.
                  </p>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    <strong>Holiday Shipping:</strong> During peak seasons and holidays, delivery times may be extended. 
                    Please place orders early to ensure timely delivery.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help with Shipping?</h2>
              <p className="text-gray-700 mb-4">
                Our customer service team is here to help with any shipping questions or concerns.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="mailto:shipping@sweettrip.com"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Email Shipping Support
                </a>
                <a 
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
