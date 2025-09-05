'use client'

import { VideoLogo } from './video-logo'

export function VideoShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Experience Sweet Trip
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Watch our brand come to life and discover the magic behind our international candy collection.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Logo Showcase */}
          <div className="flex justify-center">
            <div className="relative">
              <VideoLogo
                src="/sweet-trip-video-logo.mp4"
                poster="/sweet-trip-logo.png"
                size="large"
                className="shadow-2xl"
              />
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-pulse delay-1000"></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">
                Bringing Sweet Dreams to Life
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our animated logo represents the journey of flavors from around the world. 
                Each frame tells a story of discovery, adventure, and the joy of tasting 
                something new and exciting.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Countries</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">1000+</div>
                <div className="text-sm text-gray-600">Products</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Authentic international flavors</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Fresh imports weekly</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">Exclusive limited editions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

