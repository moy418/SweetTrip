'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react'
import { Product, supabase } from '../lib/supabase'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

export default function FeaturedProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCartStore()

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      
      // Fetch featured products from Supabase
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(12)
      
      if (error) throw error
      
      setProducts(data || [])
      console.log(`Loaded ${data?.length || 0} featured products from Supabase`)
      
    } catch (error) {
      console.error('Error loading featured products from Supabase:', error)
      toast.error('Unable to load featured products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      await addItem(product, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Unable to add item to cart')
    }
  }

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.querySelector('.product-card')?.clientWidth || 280
      const scrollLeft = index * (cardWidth + 16) // 16px gap
      scrollRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' })
      setCurrentIndex(index)
    }
  }

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1)
    scrollToIndex(newIndex)
  }

  const scrollRight = () => {
    const newIndex = Math.min(products.length - 1, currentIndex + 1)
    scrollToIndex(newIndex)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  if (loading) {
    return (
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="flex space-x-4 overflow-hidden">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-shrink-0 w-72 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-xl" />
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
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <section className="py-8 bg-white border-b">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              🌟 Featured Sweet Treats
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Hand-picked favorites from around the world
            </p>
          </div>
          
          {/* Navigation Controls */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={scrollLeft}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              disabled={currentIndex >= products.length - 4}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Carousel */}
        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((product, index) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="product-card flex-shrink-0 w-72 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group snap-start"
              >
                <div className="relative aspect-square overflow-hidden rounded-t-xl">
                  <img
                    src={(product.image_urls && product.image_urls.length > 0) ? product.image_urls[0] : '/candy-fallback.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Quick Action Buttons */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white/90 rounded-full hover:bg-white shadow-md transition-all">
                      <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
                    </button>
                  </div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Star className="h-3 w-3" />
                      <span>Featured</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  {/* Product Info */}
                  <div className="mb-3">
                    <p className="text-xs text-orange-600 font-semibold mb-1 uppercase tracking-wide">
                      {product.origin_country || 'International'}
                    </p>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  
                  {/* Price and Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.price > 5 && (
                        <span className="text-xs text-green-600 font-medium">
                          Free shipping eligible
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 transform"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
            
            {/* View All Card */}
            <div className="flex-shrink-0 w-72">
              <Link
                to="/featured"
                className="h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-300 group flex flex-col items-center justify-center p-8 min-h-[400px]"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🍭</div>
                <h3 className="text-xl font-bold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                  View All Featured
                </h3>
                <p className="text-gray-500 text-center mb-4">
                  Discover more amazing treats from around the world
                </p>
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  <span>Explore More</span>
                  <ArrowRight className="h-5 w-5 ml-2" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}