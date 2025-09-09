import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, ShoppingBag, Sparkles, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import LazySection from './LazySection'
import LazyImage from './LazyImage'
import toast from 'react-hot-toast'

interface RecommendedProduct {
  id: number
  name: string
  description: string
  price: number
  origin_country: string | null
  image_urls: string[]
  slug: string
  recommendation_reason: string
  recommendation_score: number
}

interface AIRecommendationsProps {
  limit?: number
  className?: string
  title?: string
  showTitle?: boolean
}

export default function AIRecommendations({ 
  limit = 6, 
  className = '', 
  title = 'Recommended for You',
  showTitle = true 
}: AIRecommendationsProps) {
  const { user } = useAuth()
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [algorithm, setAlgorithm] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRecommendations()
  }, [user, limit])

  const loadRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.functions.invoke('ai-recommendations', {
        body: {
          userId: user?.id || null,
          limit
        }
      })

      if (error) {
        console.error('Recommendations error:', error)
        setError('Failed to load recommendations')
        // Fallback to featured products
        await loadFallbackProducts()
        return
      }

      if (data?.data) {
        setRecommendations(data.data.recommendations || [])
        setAlgorithm(data.data.algorithm || '')
      } else {
        await loadFallbackProducts()
      }
    } catch (error) {
      console.error('Error loading recommendations:', error)
      setError('Failed to load recommendations')
      await loadFallbackProducts()
    } finally {
      setLoading(false)
    }
  }

  const loadFallbackProducts = async () => {
    try {
      // Fallback to featured products if AI recommendations fail
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .eq('is_active', true)
        .limit(limit)
        
      if (products) {
        const fallbackRecommendations = products.map(product => ({
          ...product,
          recommendation_reason: 'Featured Product',
          recommendation_score: 0.8
        }))
        setRecommendations(fallbackRecommendations)
        setAlgorithm('fallback')
      }
    } catch (fallbackError) {
      console.error('Fallback load error:', fallbackError)
      setRecommendations([])
    }
  }

  const getCountryFlag = (countryCode: string | null) => {
    if (!countryCode) return '🌍'
    const flags: { [key: string]: string } = {
      'USA': '🇺🇸', 'MEX': '🇲🇽', 'CAN': '🇨🇦', 'ARG': '🇦🇷', 'BRA': '🇧🇷',
      'FRA': '🇫🇷', 'GER': '🇩🇪', 'ESP': '🇪🇸', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'JPN': '🇯🇵',
      'KOR': '🇰🇷', 'CRO': '🇭🇷', 'POR': '🇵🇹', 'NED': '🇳🇱', 'ITA': '🇮🇹'
    }
    return flags[countryCode] || '🌍'
  }

  const getRecommendationIcon = (reason: string) => {
    if (reason.includes('World Cup')) return '🏆'
    if (reason.includes('Popular')) return '⭐'
    if (reason.includes('Discover')) return '🌍'
    if (reason.includes('Featured')) return '🌟'
    return '✨'
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: limit }).map((_, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
      ))}
    </div>
  )

  const EmptyState = () => (
    <div className="text-center py-8">
      <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600">
        {error || 'No recommendations available at the moment.'}
      </p>
      {error && (
        <button
          onClick={loadRecommendations}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  )

  return (
    <LazySection className={className}>
      {showTitle && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
            {user && algorithm === 'user_based' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <TrendingUp className="h-3 w-3 mr-1" />
                AI Powered
              </span>
            )}
          </div>
          {algorithm && (
            <span className="text-sm text-gray-500">
              {algorithm === 'user_based' ? 'Personalized' : algorithm === 'fallback' ? 'Featured' : 'Trending'}
            </span>
          )}
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : recommendations.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden will-change-transform"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
                  <LazyImage
                    src={product.image_urls?.[0] || ''}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 will-change-transform"
                    fallback={
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">
                            {getCountryFlag(product.origin_country)}
                          </div>
                          <div className="text-6xl opacity-20">🍭</div>
                        </div>
                      </div>
                    }
                  />

                  {/* Recommendation Badge */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-purple-700 flex items-center space-x-1">
                      <span>{getRecommendationIcon(product.recommendation_reason)}</span>
                      <span>AI Pick</span>
                    </div>
                  </div>

                  {/* Country Flag */}
                  {product.origin_country && (
                    <div className="absolute top-3 left-3">
                      <div className="text-2xl bg-white/90 backdrop-blur-sm rounded-full w-10 h-10 flex items-center justify-center">
                        {getCountryFlag(product.origin_country)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <div className="flex items-center space-x-2 text-xs text-purple-600 font-medium mb-2">
                      <span>{getRecommendationIcon(product.recommendation_reason)}</span>
                      <span>{product.recommendation_reason}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-green-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-3 w-3 ${i < Math.floor(product.recommendation_score * 5) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-purple-100 group-hover:bg-purple-200 transition-colors rounded-full p-2">
                      <ShoppingBag className="h-4 w-4 text-purple-600" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {recommendations.length >= limit && (
            <div className="text-center mt-8">
              <Link
                to="/products?recommended=true"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl will-change-transform"
              >
                <Sparkles className="h-5 w-5" />
                <span>View More Recommendations</span>
              </Link>
            </div>
          )}
        </>
      )}
    </LazySection>
  )
}