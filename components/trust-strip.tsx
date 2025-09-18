'use client'

import { Truck, Shield, Gift } from 'lucide-react'

export function TrustStrip() {
  const trustItems = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $60',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      badge: '⚡ Limited Time',
      urgency: true
    },
    {
      icon: Shield,
      title: 'Authentic Products',
      description: '100% genuine international treats',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      badge: '🔒 Verified',
      urgency: false
    },
    {
      icon: Gift,
      title: 'Unique Flavors',
      description: 'Discover rare candy varieties',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      badge: '✨ Exclusive',
      urgency: false
    }
  ]

  return (
    <section className="py-8 bg-gradient-to-r from-gray-50 to-blue-50 border-b border-gray-200 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header with social proof */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span>⭐</span>
            <span>Trusted by <span className="font-bold">2,847+</span> sweet explorers worldwide</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Why Choose Sweet Trip?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100">
              {/* Badge */}
              <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${
                item.urgency 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gray-700 text-white'
              }`}>
                {item.badge}
              </div>
              
              <div className="flex items-start space-x-4">
                <div className={`w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`h-7 w-7 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  
                  {/* Additional psychological trigger */}
                  {item.urgency && (
                    <div className="mt-3 text-xs text-red-600 font-medium">
                      ⏰ Offer expires soon!
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>
        
        {/* Additional trust indicators */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <span className="text-green-500">🔒</span>
            <span>SSL Encrypted</span>
          </div>
          <div className="hidden sm:block text-gray-300">•</div>
          <div className="flex items-center space-x-2">
            <span className="text-blue-500">💳</span>
            <span>Secure Payments</span>
          </div>
          <div className="hidden sm:block text-gray-300">•</div>
          <div className="flex items-center space-x-2">
            <span className="text-purple-500">🛡️</span>
            <span>Buyer Protection</span>
          </div>
          <div className="hidden sm:block text-gray-300">•</div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">⭐</span>
            <span>4.9/5 Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
}


