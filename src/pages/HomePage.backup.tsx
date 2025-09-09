import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Globe, Truck, Shield, Gift } from 'lucide-react'
import { supabase, Product, Category } from '../lib/supabase'
import ProductGrid from '../components/ProductGrid'
import AIRecommendations from '../components/AIRecommendations'
import SimpleVideoLogo from '../components/SimpleVideoLogo'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load featured products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('is_active', true)
        .limit(8)
      
      if (productsError) throw productsError
      setFeaturedProducts(products || [])
      
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('name')
      
      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])
      
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load page data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Completely Redesigned */}
  <section className="relative min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-600 text-white overflow-hidden flex items-center pt-24">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating candy shapes */}
          <div className="absolute top-20 left-20 w-20 h-20 bg-pink-300 rounded-full opacity-30 animate-bounce delay-100"></div>
          <div className="absolute top-40 right-32 w-16 h-16 bg-yellow-300 rounded-full opacity-25 animate-bounce delay-300"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-purple-300 rounded-full opacity-20 animate-bounce delay-500"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-blue-300 rounded-full opacity-30 animate-bounce delay-700"></div>
          
          {/* Geometric shapes */}
          <div className="absolute top-1/3 left-10 w-8 h-8 bg-white/20 rotate-45 animate-pulse delay-200"></div>
          <div className="absolute top-1/4 right-16 w-6 h-6 bg-white/15 rotate-12 animate-pulse delay-400"></div>
          <div className="absolute bottom-1/3 right-10 w-10 h-10 bg-white/10 rotate-45 animate-pulse delay-600"></div>
          
          {/* Gradient orbs */}
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-purple-400/15 to-blue-400/15 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>

  {/* Floating video removed from hero — moved to the Video Showcase section below */}

        {/* Main Content - Optimized Layout */}
        <div className="container mx-auto px-4 relative z-20 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-[80vh]">
            {/* Left Side - Text Content */}
            <div className="text-center lg:text-left space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 animate-fade-in-down">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">🌍 50+ Countries • 🍭 1000+ Products</span>
              </div>

              {/* Main Headline - More Compact */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-white animate-fade-in-down">Discover</span>
                <span className="block bg-gradient-to-r from-pink-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent animate-gradient-x">
                  Candy
                </span>
                <span className="block text-white animate-fade-in-down delay-200">from</span>
                <span className="block bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient-x delay-300">
                  Around the World
                </span>
              </h1>

              {/* Subtitle - More Compact */}
              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-xl animate-fade-in-up delay-400">
                Embark on a <span className="font-bold text-yellow-300">sweet adventure</span> and discover exotic flavors, 
                unique treats, and authentic candies from every corner of the globe.
              </p>

              {/* CTA Buttons - More Compact */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-600">
                <Link
                  to="/featured"
                  className="group relative bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-pink-500/25 hover:scale-105 transform"
                >
                  <span>🍭 Shop Featured</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition-opacity"></div>
                </Link>
                <Link
                  to="/categories"
                  className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 hover:border-white/50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-white/25 hover:scale-105 transform"
                >
                  <Globe className="h-5 w-5" />
                  <span>🌍 Explore Categories</span>
                </Link>
              </div>

              {/* Trust Indicators - More Compact */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 animate-fade-in-up delay-800">
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

            {/* Right Side - Visual Elements - More Dense */}
        <div className="relative hidden lg:block h-full">
          {/* Floating candy icons - More distributed + extra emojis */}
          <div className="absolute top-5 left-5 text-5xl animate-bounce delay-100">🍬</div>
          <div className="absolute top-16 right-8 text-4xl animate-bounce delay-300">🍭</div>
          <div className="absolute top-32 left-2 text-3xl animate-bounce delay-500">🍫</div>
          <div className="absolute bottom-32 right-2 text-4xl animate-bounce delay-700">🍪</div>
          <div className="absolute bottom-16 left-16 text-3xl animate-bounce delay-900">🍩</div>
          <div className="absolute top-1/2 left-8 text-3xl animate-bounce delay-1100">🍰</div>
          <div className="absolute bottom-1/3 right-12 text-3xl animate-bounce delay-1300">🍯</div>
          {/* Extra decorative floating emojis */}
          <div className="absolute top-8 right-40 text-4xl animate-bounce delay-200">🍡</div>
          <div className="absolute top-40 left-40 text-4xl animate-bounce delay-600">🍧</div>
          <div className="absolute bottom-20 right-40 text-4xl animate-bounce delay-900">🥮</div>
          <div className="absolute left-1/3 bottom-10 text-3xl animate-bounce delay-400">🍪</div>
          <div className="absolute right-1/3 top-24 text-3xl animate-bounce delay-800">�</div>
              
              {/* Central visual - Larger and more prominent */}
              <div className="relative mx-auto w-96 h-96 mt-8">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse"></div>
                <div className="relative w-full h-full bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <div className="text-9xl animate-spin-slow">🌍</div>
                </div>
              </div>

              {/* Additional decorative elements */}
              <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-yellow-300/20 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-pink-300/20 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* World Cup 2026 Featured Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce delay-100"></div>
          <div className="absolute top-40 right-32 w-16 h-16 bg-green-400/20 rounded-full animate-bounce delay-300"></div>
          <div className="absolute bottom-32 left-32 w-24 h-24 bg-blue-400/20 rounded-full animate-bounce delay-500"></div>
          <div className="absolute bottom-20 right-20 w-12 h-12 bg-red-400/20 rounded-full animate-bounce delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8">
              <div className="text-4xl animate-spin-slow">🏆</div>
              <div>
                <div className="font-black text-2xl">FIFA WORLD CUP 2026</div>
                <div className="text-white/80 text-sm">Sweet Victory Experience</div>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="block">The Ultimate</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 bg-clip-text text-transparent animate-gradient-x">
                World Cup
              </span>
              <span className="block">Candy Experience</span>
            </h2>
            
            <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
              Celebrate the world's greatest tournament with authentic candies from all 48 participating countries. 
              Make predictions, collect achievements, and taste victory like never before!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                to="/worldcup2026"
                className="group bg-gradient-to-r from-yellow-500 to-orange-600 text-gray-900 px-10 py-5 rounded-2xl font-black text-xl hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 transform"
              >
                <div className="text-2xl group-hover:animate-bounce">🌍</div>
                <span>Start Your Journey</span>
                <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/worldcup2026/countries"
                className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-white/25 hover:scale-105 transform"
              >
                <Globe className="h-6 w-6" />
                <span>48 Countries</span>
              </Link>
            </div>
          </div>

          {/* World Cup Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link
              to="/worldcup2026/countries"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">48 Countries</h3>
                <p className="text-white/80 leading-relaxed">Discover authentic candies and cultural stories from every participating nation</p>
              </div>
            </Link>

            <Link
              to="/worldcup2026/predictions"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-3xl">🎯</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Match Predictions</h3>
                <p className="text-white/80 leading-relaxed">Predict match outcomes and earn sweet candy rewards for correct guesses</p>
              </div>
            </Link>

            <Link
              to="/worldcup2026/leaderboard"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <div className="text-3xl">🏆</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">Leaderboard</h3>
                <p className="text-white/80 leading-relaxed">Compete with fellow candy lovers and climb the prediction rankings</p>
              </div>
            </Link>

            <Link
              to="/worldcup2026/my-collection"
              className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3">My Collection</h3>
                <p className="text-white/80 leading-relaxed">Track your candy collection progress and unlock achievement badges</p>
              </div>
            </Link>
          </div>

          {/* Live Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-4xl font-black text-yellow-400 mb-2">48</div>
              <div className="text-white/80 font-medium">Countries</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-4xl font-black text-green-400 mb-2">104</div>
              <div className="text-white/80 font-medium">Matches</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-4xl font-black text-blue-400 mb-2">300+</div>
              <div className="text-white/80 font-medium">Candies</div>
            </div>
            <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <div className="text-4xl font-black text-pink-400 mb-2">∞</div>
              <div className="text-white/80 font-medium">Sweet Memories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white to-pink-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-pink-100 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-purple-100 rounded-full opacity-30 animate-pulse delay-1000"></div>
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
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Truck className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">Free Shipping</h3>
              <p className="text-gray-600 leading-relaxed">Free shipping on orders over $60 worldwide. Fast and secure delivery to your doorstep.</p>
            </div>
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Authentic Products</h3>
              <p className="text-gray-600 leading-relaxed">100% authentic international candies and snacks. We source directly from manufacturers.</p>
            </div>
            <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Gift className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">Unique Flavors</h3>
              <p className="text-gray-600 leading-relaxed">Discover flavors you can't find anywhere else. Exclusive and limited edition treats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Experience Sweet Trip
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Watch our brand come to life and discover the magic behind our international candy collection. 
              Every frame tells a story of flavor, adventure, and sweet discoveries from around the world.
            </p>
          </div>
          
          <div className="flex justify-center mb-12">
            <SimpleVideoLogo
              src="/sweet-trip-video-logo.mp4"
              poster="/sweet-trip-logo.png"
              size="hero"
              className="shadow-2xl"
              showBorder={true}
              showGlow={true}
            />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">50+</div>
              <div className="text-gray-700 font-medium">Countries</div>
            </div>
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">1000+</div>
              <div className="text-gray-700 font-medium">Products</div>
            </div>
            <div className="text-center p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Sweet Dreams</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Browse Categories
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Explore our carefully curated categories featuring unique candy collections from around the world. 
              Each category offers special treats and flavors to satisfy your sweet cravings.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
              >
                <div className="aspect-video bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 relative overflow-hidden">
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe className="h-16 w-16 text-white opacity-80" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:from-black/60 transition-all duration-300" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-pink-200 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                  <div className="mt-4 flex items-center text-pink-600 font-medium group-hover:text-purple-600 transition-colors">
                    <span>Explore Collection</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-picked selection of the most popular and unique candies from around the world.
            </p>
          </div>
          
          <ProductGrid 
            products={featuredProducts} 
            loading={loading}
            emptyMessage="No featured products available"
          />
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <AIRecommendations 
            title="Personalized Just for You"
            limit={6}
            className=""
            showTitle={true}
          />
          
          <div className="text-center mt-12">
            <Link
              to="/products?recommended=true"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <div className="text-2xl animate-pulse">✨</div>
              <span>Discover More AI Picks</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah M.",
                comment: "Amazing selection of Japanese Kit Kats! My kids love trying the different flavors.",
                rating: 5
              },
              {
                name: "Mike K.",
                comment: "Fast shipping and authentic products. Sweet Trip is my go-to for international candy.",
                rating: 5
              },
              {
                name: "Emma L.",
                comment: "The Korean snacks are incredible! So glad I found this store.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Stay Sweet with Sweet Trip
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Get the latest updates on new arrivals, exclusive offers, and candy discoveries from around the world. 
            Join our sweet community and never miss a flavor adventure!
          </p>
          <div className="max-w-lg mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 text-lg"
            />
            <button className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}