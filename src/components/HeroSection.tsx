import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LazyImage from './LazyImage'

export default function HeroSection() {
  const { t } = useLanguage()
  
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600 text-white overflow-hidden flex items-center pt-24">
      {/* Animated Background Elements - Optimized */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Reduced number of animated elements for better performance */}
        <div className="absolute top-20 left-20 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-bounce delay-100 will-change-transform"></div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-yellow-300 rounded-full opacity-25 animate-bounce delay-300 will-change-transform"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-purple-300 rounded-full opacity-20 animate-bounce delay-500 will-change-transform"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-blue-300 rounded-full opacity-30 animate-bounce delay-700 will-change-transform"></div>
        
        {/* Optimized gradient orbs - fewer and with better GPU acceleration */}
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse will-change-transform"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse delay-1000 will-change-transform"></div>
      </div>

      {/* Main Content - Optimized Layout */}
      <div className="container mx-auto px-4 relative z-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 animate-fade-in-down will-change-transform">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">🌍 50+ Countries • 🍭 1000+ Products</span>
            </div>

            {/* Main Headline - More Compact */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              <span className="block text-white animate-fade-in-down will-change-transform">{t('discoverCandy')}</span>
              <span className="block bg-gradient-to-r from-pink-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent animate-gradient-x">
                Candy
              </span>
              <span className="block text-white animate-fade-in-down delay-200 will-change-transform">from</span>
              <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient-x delay-300">
                {t('fromAroundWorld')}
              </span>
            </h1>

            {/* Subtitle - More Compact */}
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl animate-fade-in-up delay-400 will-change-transform">
              Embark on a <span className="font-bold text-yellow-300">{t('sweetAdventure')}</span> and discover exotic flavors, 
              unique treats, and authentic candies from every corner of the globe.
            </p>

            {/* CTA Buttons - More Compact */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-600 will-change-transform">
              <Link
                to="/featured"
                className="group relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-pink-500/25 hover:scale-105 transform will-change-transform"
              >
                <span>🍭 {t('shopFeatured')}</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
              </Link>
              <Link
                to="/categories"
                className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 hover:border-white/50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-white/25 hover:scale-105 transform will-change-transform"
              >
                <Globe className="h-5 w-5" />
                <span>🌍 {t('exploreCategories')}</span>
              </Link>
            </div>

            {/* Trust Indicators - More Compact */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-fade-in-up delay-800 will-change-transform">
              <div className="flex items-center space-x-2 text-white/80">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-xs font-medium">Free Shipping $60+</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">🛡️</span>
                </div>
                <span className="text-xs font-medium">100% Authentic</span>
              </div>
              <div className="flex items-center space-x-2 text-white/80">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">⭐</span>
                </div>
                <span className="text-xs font-medium">4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Right Side - Visual Elements - Optimized */}
          <div className="relative hidden lg:block h-full">
            {/* Optimized floating candy icons - Reduced number for better performance */}
            <div className="absolute top-5 left-5 text-5xl animate-bounce delay-100 will-change-transform">🍬</div>
            <div className="absolute top-16 right-8 text-4xl animate-bounce delay-300 will-change-transform">🍭</div>
            <div className="absolute top-32 left-2 text-3xl animate-bounce delay-500 will-change-transform">🍫</div>
            <div className="absolute bottom-32 right-2 text-4xl animate-bounce delay-700 will-change-transform">🍪</div>
            <div className="absolute bottom-16 left-16 text-3xl animate-bounce delay-900 will-change-transform">🍩</div>
            <div className="absolute top-1/2 left-8 text-3xl animate-bounce delay-1100 will-change-transform">🍰</div>
            
            {/* Central visual - Optimized with better performance */}
            <div className="relative mx-auto w-96 h-96 mt-8">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse will-change-transform"></div>
              <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                <div className="text-9xl animate-spin-slow will-change-transform">🌍</div>
              </div>
            </div>

            {/* Additional decorative elements - Reduced for performance */}
            <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-yellow-300/20 rounded-full animate-pulse delay-500 will-change-transform"></div>
            <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-pink-300/20 rounded-full animate-pulse delay-700 will-change-transform"></div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce will-change-transform">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}