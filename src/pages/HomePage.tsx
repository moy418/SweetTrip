import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Globe, Truck, Shield, Gift } from 'lucide-react'
import { supabase, Product, Category } from '../lib/supabase'
import ProductGrid from '../components/ProductGrid'
import SimpleVideoLogo from '../components/SimpleVideoLogo'
import toast from 'react-hot-toast'

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const candiesRefInitialized = useRef(false)

  useEffect(() => {
    // Populate floating candies for the Vite app version (localhost:5173)
    if (typeof window === 'undefined') return
    if (candiesRefInitialized.current) return
    const container = document.getElementById('vite-floating-candies')
    if (!container) return
    candiesRefInitialized.current = true

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const TOTAL = isMobile ? 6 : 24
    const candySrcs = ['/sweetland-logo.jpeg', '/sweetlogo.jpeg', '/sweet-trip-logo.png']

    // store refs and base positions
    const candyEls: HTMLImageElement[] = []

    for (let i = 0; i < TOTAL; i++) {
      const img = document.createElement('img')
      img.src = candySrcs[i % candySrcs.length]
      img.className = 'floating-candy'
      const size = Math.round(20 + Math.random() * 60)
      const baseLeft = Math.round(Math.random() * 90)
      const baseTop = Math.round(5 + Math.random() * 80)
      img.style.width = `${size}px`
      img.style.left = `${baseLeft}%`
      img.style.top = `${baseTop}%`
      img.dataset.baseLeft = String(baseLeft)
      img.dataset.baseTop = String(baseTop)
      img.style.animationDuration = `${6 + Math.random() * 10}s`
      img.style.animationDelay = `${Math.random() * 6}s`
      img.style.opacity = `${isMobile ? 0.45 + Math.random() * 0.35 : 0.6 + Math.random() * 0.4}`
      img.alt = 'sweet'
      img.setAttribute('aria-hidden', 'true')
      container.appendChild(img)
      candyEls.push(img)
    }

    // Sensor handling: device orientation (gyroscope) + pointer fallback
    let rafId = 0

    const clamp = (v: number, a = -1, b = 1) => Math.max(a, Math.min(b, v))

    // apply tilt offsets by updating left/top from base positions
    const applyTilt = (tiltX: number, tiltY: number) => {
      // tiltX, tiltY expected in range -1..1
      for (const img of candyEls) {
        const baseLeft = Number(img.dataset.baseLeft || 50)
        const baseTop = Number(img.dataset.baseTop || 30)
        // move fractionally (percent) relative to base
        const offsetLeft = tiltX * 6 // percent
        const offsetTop = tiltY * 6 // percent
        img.style.left = `${baseLeft + offsetLeft}%`
        img.style.top = `${baseTop + offsetTop}%`
      }
    }

    // DeviceOrientation handler
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // event.gamma === left-to-right tilt in degrees [-90,90]
      // event.beta === front-to-back tilt in degrees [-180,180]
      const gamma = e.gamma ?? 0
      const beta = e.beta ?? 0
      // normalize: use +/- 45deg as full tilt
      const tiltX = clamp(gamma / 45)
      const tiltY = clamp(beta / 45)

      // schedule via rAF
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => applyTilt(tiltX, tiltY))
    }

    // Pointer fallback for desktop: translate pointer position to tilt
    const handlePointer = (ev: PointerEvent) => {
      const w = window.innerWidth
      const h = window.innerHeight
      const x = (ev.clientX / w) * 2 - 1 // -1 .. 1
      const y = (ev.clientY / h) * 2 - 1 // -1 .. 1
      // invert Y so dragging up moves candies up
      const tiltX = clamp(x)
      const tiltY = clamp(y)
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => applyTilt(tiltX, tiltY))
    }

    // iOS 13+ permission flow for DeviceMotion/Orientation
    const enableDeviceOrientation = async () => {
      // @ts-ignore
      if (typeof DeviceMotionEvent !== 'undefined' && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        try {
          // @ts-ignore
          const perm = await (DeviceMotionEvent as any).requestPermission()
          if (perm === 'granted') window.addEventListener('deviceorientation', handleOrientation)
          else window.addEventListener('pointermove', handlePointer)
        } catch (err) {
          window.addEventListener('pointermove', handlePointer)
        }
      } else if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation)
      } else {
        window.addEventListener('pointermove', handlePointer)
      }
    }

    enableDeviceOrientation()

    return () => {
      if (container) container.innerHTML = ''
      window.removeEventListener('deviceorientation', handleOrientation)
      window.removeEventListener('pointermove', handlePointer)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

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

        {/* Video Logo - Enhanced and Larger */}
        <div className="absolute top-10 right-10 z-10">
          <SimpleVideoLogo
            src="/sweet-trip-video-logo.mp4"
            poster="/sweet-trip-logo.png"
            size="hero"
            className="animate-float scale-150"
            showBorder={true}
            showGlow={true}
          />
        </div>

  {/* Floating candies layer for Vite (dev) */}
  <div className="floating-candies absolute inset-0 pointer-events-none z-10 md:z-20" id="vite-floating-candies" aria-hidden="true"></div>

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
              {/* Floating candy icons - More distributed */}
              <div className="absolute top-5 left-5 text-5xl animate-bounce delay-100">🍬</div>
              <div className="absolute top-16 right-8 text-4xl animate-bounce delay-300">🍭</div>
              <div className="absolute top-32 left-2 text-3xl animate-bounce delay-500">🍫</div>
              <div className="absolute bottom-32 right-2 text-4xl animate-bounce delay-700">🍪</div>
              <div className="absolute bottom-16 left-16 text-3xl animate-bounce delay-900">🍩</div>
              <div className="absolute top-1/2 left-8 text-3xl animate-bounce delay-1100">🍰</div>
              <div className="absolute bottom-1/3 right-12 text-3xl animate-bounce delay-1300">🍯</div>
              
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
              Explore by Region
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Each region offers its own unique candy culture and flavors. Discover what makes each destination special 
              and embark on a sweet journey around the world.
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