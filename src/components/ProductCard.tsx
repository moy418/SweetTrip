import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { Product } from '../lib/supabase'
import { useCartStore } from '../store/cartStore'
import { useAuth } from '../contexts/AuthContext'
import LazyImage from './LazyImage'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { user } = useAuth()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (product.stock_quantity <= 0) {
      toast.error('Product is out of stock')
      return
    }
    
    setIsAddingToCart(true)
    try {
      addItem(product, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!user) {
      toast.error('Please sign in to add to wishlist')
      return
    }
    
    setIsAddingToWishlist(true)
    try {
      // TODO: Implement wishlist functionality
      toast.success(`${product.name} added to wishlist!`)
    } catch (error) {
      toast.error('Failed to add to wishlist')
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'USA': '🇺🇸', 'MEX': '🇲🇽', 'CAN': '🇨🇦', 'ARG': '🇦🇷', 'BRA': '🇧🇷',
      'FRA': '🇫🇷', 'GER': '🇩🇪', 'ESP': '🇪🇸', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'JPN': '🇯🇵',
      'KOR': '🇰🇷', 'CRO': '🇭🇷', 'POR': '🇵🇹', 'NED': '🇳🇱', 'ITA': '🇮🇹'
    }
    return flags[country] || '🌍'
  }

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 will-change-transform"
    >
      <div className="relative">
        {/* Product Image with Lazy Loading */}
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          <LazyImage
            src={product.image_urls?.[0] || '/candy-fallback.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 will-change-transform"
            placeholder="🍭"
            fallback={
              <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">
                    {product.origin_country ? getCountryFlag(product.origin_country) : '🌍'}
                  </div>
                  <div className="text-6xl opacity-20">🍭</div>
                </div>
              </div>
            }
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.featured && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
          {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Low Stock
            </span>
          )}
          {product.stock_quantity === 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors will-change-transform"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        {/* Brand and Origin */}
        <div className="flex items-center justify-between mb-2">
          {product.brand && (
            <span className="text-xs text-blue-600 font-medium uppercase tracking-wide">
              {product.brand}
            </span>
          )}
          {product.origin_country && (
            <span className="text-xs text-gray-500 flex items-center space-x-1">
              <span>{getCountryFlag(product.origin_country)}</span>
              <span>From {product.origin_country}</span>
            </span>
          )}
        </div>
        
        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        {/* Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">(24 reviews)</span>
        </div>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.weight_grams && (
              <span className="text-sm text-gray-500 ml-2">
                ({product.weight_grams}g)
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || product.stock_quantity === 0}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 will-change-transform"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </span>
          </button>
        </div>
      </div>
    </Link>
  )
}