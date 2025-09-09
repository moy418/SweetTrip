import React from 'react'
import { Truck, Shield, Gift } from 'lucide-react'

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-white to-pink-50 relative overflow-hidden">
      {/* Background decorative elements - Optimized */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-40 h-40 bg-pink-100 rounded-full opacity-30 animate-pulse will-change-transform"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-purple-100 rounded-full opacity-30 animate-pulse delay-1000 will-change-transform"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Why Choose Sweet Trip?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We bring you the best of international candy culture with unmatched quality and service.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 will-change-transform">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Truck className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast & Free Shipping</h3>
            <p className="text-gray-600 leading-relaxed">
              Free shipping on orders over $60. Get your international candy favorites delivered quickly and safely to your door.
            </p>
          </div>
          
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 will-change-transform">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">100% Authentic</h3>
            <p className="text-gray-600 leading-relaxed">
              All our products are sourced directly from manufacturers and verified distributors. No imitations, just authentic flavors.
            </p>
          </div>
          
          <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 will-change-transform">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Curated Selection</h3>
            <p className="text-gray-600 leading-relaxed">
              Our team personally tastes and selects every product. We only offer candies that meet our high standards for quality and taste.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}