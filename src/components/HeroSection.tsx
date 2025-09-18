import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import LazyImage from './LazyImage'
import CountdownTimer from './CountdownTimer'

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
            
            {/* Compelling CTA Text with Psychological Triggers */}
            <div className="text-center lg:text-left animate-fade-in-up delay-500 will-change-transform">
              {/* Urgency & Scarcity */}
              <div className="inline-flex items-center space-x-2 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-full px-4 py-2 mb-4 animate-pulse">
                <span className="text-red-300 text-sm font-bold">⚡ LIMITED TIME</span>
                <span className="text-yellow-300 text-sm">Free shipping on orders $60+</span>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Ready to <span className="text-yellow-300">explore</span>?
              </h3>
              <p className="text-lg text-white/80 mb-4">
                Choose your adventure and start discovering amazing treats!
              </p>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-white/70 mb-6">
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-300">⭐⭐⭐⭐⭐</span>
                  <span className="font-semibold">4.9/5</span>
                </div>
                <div className="text-white/50">•</div>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">👥</span>
                  <span><span className="font-bold text-yellow-300">2,847</span> sweet explorers</span>
                </div>
                <div className="text-white/50">•</div>
                <div className="flex items-center space-x-1">
                  <span className="text-2xl">🌍</span>
                  <span><span className="font-bold text-yellow-300">50+</span> countries</span>
                </div>
              </div>
              
              {/* Loss Aversion */}
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-4 mb-6">
                <p className="text-orange-200 text-sm font-medium">
                  <span className="text-yellow-300 font-bold">⚠️ Don't miss out!</span> Join thousands discovering rare treats that disappear fast from our shelves.
                </p>
              </div>
            </div>

            {/* CTA Buttons - Enhanced with Psychological Triggers */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in-up delay-600 will-change-transform">
              <Link
                to="/featured"
                className="group relative bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white px-10 py-6 rounded-3xl font-black text-xl hover:from-pink-600 hover:via-purple-700 hover:to-indigo-700 transition-all duration-500 flex items-center justify-center space-x-4 shadow-2xl hover:shadow-pink-500/40 hover:scale-110 transform will-change-transform border-2 border-white/20 hover:border-white/40 animate-pulse-subtle"
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-3xl border-2 border-pink-300/50 animate-ping"></div>
                
                {/* Scarcity indicator */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                  🔥 HOT
                </div>
                
                {/* Content */}
                <span className="relative z-10 text-2xl animate-bounce">🍭</span>
                <div className="relative z-10 flex flex-col items-start">
                  <span>{t('shopFeatured')}</span>
                  <span className="text-sm font-normal opacity-90">Limited Edition</span>
                </div>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
              
              <Link
                to="/categories"
                className="group relative bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white px-10 py-6 rounded-3xl font-black text-xl hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 transition-all duration-500 flex items-center justify-center space-x-4 shadow-2xl hover:shadow-emerald-500/40 hover:scale-110 transform will-change-transform border-2 border-white/20 hover:border-white/40 animate-pulse-subtle"
              >
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-3xl border-2 border-emerald-300/50 animate-ping"></div>
                
                {/* Authority indicator */}
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  ✨ NEW
                </div>
                
                {/* Content */}
                <Globe className="h-6 w-6 group-hover:rotate-12 transition-transform duration-300 relative z-10" />
                <div className="relative z-10 flex flex-col items-start">
                  <span>{t('exploreCategories')}</span>
                  <span className="text-sm font-normal opacity-90">50+ Countries</span>
                </div>
                <span className="relative z-10 text-2xl animate-bounce">🌍</span>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </Link>
            </div>
            
            {/* Additional Psychological Triggers Below Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-6 animate-fade-in-up delay-700 will-change-transform">
              {/* Trust & Security */}
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <span className="text-green-400">🔒</span>
                <span>Secure checkout</span>
              </div>
              <div className="hidden sm:block text-white/30">•</div>
              
              {/* Money-back guarantee */}
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <span className="text-blue-400">💰</span>
                <span>100% money-back</span>
              </div>
              <div className="hidden sm:block text-white/30">•</div>
              
              {/* Fast shipping */}
              <div className="flex items-center space-x-2 text-white/70 text-sm">
                <span className="text-orange-400">🚚</span>
                <span>Fast worldwide shipping</span>
              </div>
            </div>
            
            {/* Countdown Timer */}
            <CountdownTimer />

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