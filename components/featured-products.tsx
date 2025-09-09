'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { getFeaturedProducts } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { ProductCard } from './product-card'

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const featuredProducts = await getFeaturedProducts()
        setProducts(featuredProducts)
      } catch (error) {
        console.error('Error loading featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // Check scroll capabilities
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  useEffect(() => {
    checkScroll()
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener('scroll', checkScroll)
      return () => container.removeEventListener('scroll', checkScroll)
    }
  }, [products])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320 // Width of one product card plus gap
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount)
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Hand-picked selection of the most popular and unique candies from around the world.
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <button className="p-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-gray-200 text-gray-400 cursor-not-allowed">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <div className="flex space-x-6 animate-pulse">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="flex-none w-72">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
                  <div className="space-y-3">
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
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              Hand-picked selection of the most popular and unique candies from around the world.
            </p>
          </div>
          
          {/* Navigation arrows for desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full transition-all ${
                canScrollLeft 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-2 rounded-full transition-all ${
                canScrollRight 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {products.length > 0 ? (
          <>
            {/* Horizontal Scrollable Reel */}
            <div className="relative">
              <div 
                ref={scrollContainerRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {products.map((product) => (
                  <div key={product.id} className="flex-none w-72">
                    <ProductCard product={product} />
                  </div>
                ))}
                
                {/* View All Products Card */}
                <div className="flex-none w-72">
                  <Link 
                    href="/products"
                    className="block h-full bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-lg p-6 hover:from-blue-100 hover:to-purple-100 transition-all group"
                  >
                    <div className="h-full flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <ArrowRight className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        View All Products
                      </h3>
                      <p className="text-gray-600">
                        Discover our complete collection of international candies and treats
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
              
              {/* Scroll indicators for mobile */}
              <div className="flex md:hidden justify-center mt-4 space-x-2">
                <button 
                  onClick={() => scroll('left')}
                  disabled={!canScrollLeft}
                  className={`px-4 py-2 rounded-full text-sm ${
                    canScrollLeft 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ← Previous
                </button>
                <button 
                  onClick={() => scroll('right')}
                  disabled={!canScrollRight}
                  className={`px-4 py-2 rounded-full text-sm ${
                    canScrollRight 
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No featured products available</h3>
            <p className="text-gray-500 mb-6">Check back later for new arrivals!</p>
            <Link href="/products" className="btn-primary">
              Browse All Products
            </Link>
          </div>
        )}
      </div>
      
      {/* CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}


