'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Heart, Star, Flag } from 'lucide-react'
import { useCartStore } from '@/store/cart-store'
import { useAuth } from '@/contexts/auth-context'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  price: number
  image_urls: string[]
  stock_quantity: number
  featured: boolean
  brand?: string
  origin_country?: string
  description?: string
  weight_grams?: number
  slug: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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

  const getCountryFlag = (country: string) => {
    const flags: Record<string, string> = {
      'Japan': '🇯🇵',
      'Korea': '🇰🇷',
      'Germany': '🇩🇪',
      'USA': '🇺🇸',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'UK': '🇬🇧',
      'Canada': '🇨🇦'
    }
    return flags[country] || '🌍'
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

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group card card-hover"
    >
      <div className="relative">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={product.image_urls?.[0] || '/api/placeholder/300/300'}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            aria-label="Add to wishlist"
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
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <span>{getCountryFlag(product.origin_country)}</span>
              <span>{product.origin_country}</span>
            </div>
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
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2 min-h-[44px]"
            aria-label="Add to cart"
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

