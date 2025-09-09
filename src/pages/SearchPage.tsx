import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { supabase, Product } from '../lib/supabase'
import ProductGrid from '../components/ProductGrid'
import toast from 'react-hot-toast'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const searchQuery = searchParams.get('q') || ''

  useEffect(() => {
    if (searchQuery) {
      searchProducts()
    } else {
      setProducts([])
      setLoading(false)
    }
  }, [searchQuery])

  const searchProducts = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`)
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      setProducts(data || [])
      
    } catch (error) {
      console.error('Error searching products:', error)
      toast.error('Failed to search products')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Search className="h-6 w-6 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Search Results
            </h1>
          </div>
          {searchQuery && (
            <div>
              <p className="text-lg text-gray-600 mb-2">
                Results for: <span className="font-semibold">"{searchQuery}"</span>
              </p>
              <p className="text-sm text-gray-500">
                {loading ? 'Searching...' : `${products.length} products found`}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      <div className="container mx-auto px-4 py-8">
        {!searchQuery ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start your search</h2>
            <p className="text-gray-600">Enter keywords to find your favorite international candies</p>
          </div>
        ) : (
          <ProductGrid 
            products={products} 
            loading={loading}
            emptyMessage={`No products found for "${searchQuery}"`}
          />
        )}
      </div>
    </div>
  )
}