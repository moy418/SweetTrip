import React, { useEffect, useState, Suspense, lazy } from 'react'
import { Link } from 'react-router-dom'
import { supabase, Product, Category } from '../lib/supabase'
import HeroSection from '../components/HeroSection'
// import WorldCup2026Section from '../components/WorldCup2026Section'
import FeaturesSection from '../components/FeaturesSection'
import LazySection from '../components/LazySection'
import PerformanceMonitor from '../components/PerformanceMonitor'
import FeaturedProductsCarousel from '../components/FeaturedProductsCarousel'
import toast from 'react-hot-toast'

// Lazy load heavy components
const ProductGrid = lazy(() => import('../components/ProductGrid'))
const AIRecommendations = lazy(() => import('../components/AIRecommendations'))
const SimpleVideoLogo = lazy(() => import('../components/SimpleVideoLogo'))

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    // Load critical data immediately
    loadCriticalData()
    
    // Load non-critical data after initial render
    const timer = setTimeout(() => {
      if (!dataLoaded) {
        loadAdditionalData()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  const loadCriticalData = async () => {
    try {
      setLoading(true)
      
      // Only load essential data for above-the-fold content
      // Featured products will be loaded later
      
      // Load categories for navigation (small data)
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .limit(10)
      
      if (categoriesError) {
        console.error('Categories error:', categoriesError)
      } else {
        // Type assertion for the simplified category data
        const typedCategories = (categoriesData || []).map(cat => ({
          ...cat,
          description: '',
          image_url: '',
          is_active: true,
          created_at: '',
          updated_at: ''
        })) as Category[]
        setCategories(typedCategories)
      }
      
    } catch (error) {
      console.error('Error loading critical data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAdditionalData = async () => {
    try {
      // Load featured products with basic query (avoiding PostgREST cache issues)
      const { data: allProducts, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(20)
      
      if (productsError) {
        console.error('Products error:', productsError)
        toast.error('Some content may not be available')
      } else {
        // Client-side filtering for featured and non-World Cup products
        const filteredProducts = (allProducts || []).filter(product => 
          product.featured === true &&
          product.is_active === true &&
          (!product.name?.toLowerCase().includes('world cup')) &&
          (!product.name?.toLowerCase().includes('fifa')) &&
          (!product.description?.toLowerCase().includes('world cup')) &&
          (!product.description?.toLowerCase().includes('fifa'))
        ).slice(0, 8)
        
        setFeaturedProducts(filteredProducts)
      }
      
      setDataLoaded(true)
    } catch (error) {
      console.error('Error loading additional data:', error)
    }
  }

  // Loading skeleton for featured products section
  const FeaturedProductsSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Performance Monitoring (dev only) */}
      <PerformanceMonitor />
      
      {/* Hero Section - Above the fold, loaded immediately */}
      <HeroSection />

      {/* Featured Products Carousel - Added for better product discovery */}
      <FeaturedProductsCarousel />

      
      {/* World Cup 2026 Collection - Minimized to just one collection */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white rounded-2xl p-6 shadow-md max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚽</span>
                <div>
                  <h3 className="font-bold text-gray-800">World Cup 2026 Special Collection</h3>
                  <p className="text-sm text-gray-600">Limited edition treats from host nations</p>
                </div>
              </div>
              <Link
                to="/worldcup2026"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                View Collection
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section - Above the fold */}
      <FeaturesSection />

      {/* Video Showcase Section - Lazy loaded */}
      <LazySection className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              <span className="block">Experience the</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent animate-gradient-x">
                Sweet Journey
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed">
              Watch as we bring the world's most amazing candies directly to your doorstep. 
              Every package is a new adventure waiting to unfold.
            </p>
          </div>
          
          <div className="flex justify-center mb-16">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-3xl blur-3xl animate-pulse will-change-transform"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <Suspense fallback={
                  <div className="w-96 h-64 bg-gray-200 rounded-2xl animate-pulse flex items-center justify-center">
                    <div className="text-6xl text-gray-400">🎥</div>
                  </div>
                }>
                  <SimpleVideoLogo src="/sweet-trip-video-logo.mp4" />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </LazySection>

      {/* Featured Products Section - Dynamic Design */}
      <LazySection className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Dynamic background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-r from-pink-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-200/30 to-pink-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-blue-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Dynamic header with animations */}
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center space-x-4 text-6xl mb-4">
                <span className="animate-bounce delay-100">⭐</span>
                <span className="animate-bounce delay-200">🍭</span>
                <span className="animate-bounce delay-300">⭐</span>
              </div>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-gradient-x">
              FEATURED SWEET TREATS
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                Hand-picked by our global candy experts, these treats represent the <span className="font-bold text-purple-600">best flavors</span> from around the world
              </p>
              
              {/* Dynamic stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-black text-pink-600">50+</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-black text-purple-600">1000+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-black text-blue-600">24/7</div>
                  <div className="text-sm text-gray-600">Fresh Stock</div>
                </div>
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                  <div className="text-2xl font-black text-green-600">4.9★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>
          </div>
          
          <Suspense fallback={<FeaturedProductsSkeleton />}>
            {dataLoaded ? (
              <div className="relative">
                {/* Floating decorative elements */}
                <div className="absolute -top-10 left-10 text-4xl animate-float delay-100">🍫</div>
                <div className="absolute -top-5 right-20 text-3xl animate-float delay-300">🍪</div>
                <div className="absolute -bottom-10 left-20 text-5xl animate-float delay-500">🍬</div>
                <div className="absolute -bottom-5 right-10 text-4xl animate-float delay-700">🍭</div>
                
                <ProductGrid 
                  products={featuredProducts} 
                  loading={false}
                  emptyMessage="Featured products coming soon!"
                />
              </div>
            ) : (
              <FeaturedProductsSkeleton />
            )}
          </Suspense>
        </div>
      </LazySection>

      {/* AI Recommendations Section - Lazy loaded */}
      <LazySection className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <Suspense fallback={
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-96"></div>
                ))}
              </div>
            </div>
          }>
            <AIRecommendations limit={6} />
          </Suspense>
        </div>
      </LazySection>

      {/* Newsletter Section - Lazy loaded */}
      <LazySection className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-3xl shadow-xl p-12 border border-pink-100">
              <div className="text-6xl mb-6">📬</div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-6">
                Stay Sweet with Our Newsletter
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Get exclusive access to new arrivals, special discounts, and sweet stories from around the world. 
                Join our community of candy explorers!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your sweet email..."
                  className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                />
                <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform will-change-transform">
                  Join Now
                </button>
              </div>
              
              <div className="flex justify-center items-center space-x-6 mt-8 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">📧</span>
                  </div>
                  <span>Weekly sweet updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🎁</span>
                  </div>
                  <span>Exclusive offers</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LazySection>
    </div>
  )
}