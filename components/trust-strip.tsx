'use client'

import { Truck, Shield, Gift } from 'lucide-react'

export function TrustStrip() {
  const trustItems = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'On orders over $60',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Shield,
      title: 'Authentic Products',
      description: '100% genuine international treats',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Gift,
      title: 'Unique Flavors',
      description: 'Discover rare candy varieties',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {trustItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${item.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-gray-600 text-xs">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

