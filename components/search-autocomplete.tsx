'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X } from 'lucide-react'
import { getProducts } from '@/lib/supabase'
import { Product } from '@/lib/types'

interface SearchAutocompleteProps {
  onClose: () => void
}

export function SearchAutocomplete({ onClose }: SearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const searchProducts = async () => {
      setIsLoading(true)
      try {
        const products = await getProducts({ search: query, limit: 5 })
        setResults(products)
        setIsOpen(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(searchProducts, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleResultClick = () => {
    onClose()
  }

  return (
    <div ref={containerRef} className="absolute top-full left-0 right-0 z-50 mt-2">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for exotic candies..."
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        {isOpen && (
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2">Searching...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={product.image_urls[0] || '/api/placeholder/48/48'}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
                <div className="p-3 border-t border-gray-200">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    onClick={handleResultClick}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all results for "{query}"
                  </Link>
                </div>
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No products found for "{query}"</p>
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={handleResultClick}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
                >
                  Try searching all products
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}


