import React, { useEffect, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { Filter, Grid, List, SortAsc } from 'lucide-react'
import { supabase, Product } from '../lib/supabase'
import ProductGrid from '../components/ProductGrid'
import toast from 'react-hot-toast'

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterOpen, setFilterOpen] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const location = useLocation()
  const [searchParams] = useSearchParams()
  
  const isFeatured = location.pathname.includes('featured')
  const isNewArrivals = location.pathname.includes('new-arrivals')

  useEffect(() => {
    loadProducts()
  }, [location.pathname, sortBy, sortOrder, searchParams])

  const loadProducts = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
      
      // Apply filters based on route
      if (isFeatured) {
        query = query.eq('featured', true)
      }
      
      if (isNewArrivals) {
        // For new arrivals, show products from last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        query = query.gte('created_at', thirtyDaysAgo.toISOString())
      }
      
      // Apply search filter
      const searchQuery = searchParams.get('search')
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%`)
      }
      
      // Apply sorting
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      
      const { data, error } = await query
      
      if (error) throw error
      
      let filteredProducts = data || []
      
      // Apply client-side filters
      if (priceRange.min > 0 || priceRange.max < 100) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= priceRange.min && product.price <= priceRange.max
        )
      }
      
      if (selectedBrands.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          product.brand && selectedBrands.includes(product.brand)
        )
      }
      
      if (selectedCountries.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
          product.origin_country && selectedCountries.includes(product.origin_country)
        )
      }
      
      setProducts(filteredProducts)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const getPageTitle = () => {
    if (isFeatured) return 'Featured Products'
    if (isNewArrivals) return 'New Arrivals'
    const searchQuery = searchParams.get('search')
    if (searchQuery) return `Search Results for "${searchQuery}"`
    return 'All Products'
  }

  const handleSortChange = (newSortBy: string) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(newSortBy)
      setSortOrder('asc')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
              <p className="text-gray-600 mt-2">
                {loading ? 'Loading...' : `${products.length} products found`}
              </p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="lg:hidden p-1 text-gray-500 hover:text-gray-700"
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>
              
              <div className={`space-y-6 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Sort */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-')
                      setSortBy(field)
                      setSortOrder(order as 'asc' | 'desc')
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="price-asc">Price Low to High</option>
                    <option value="price-desc">Price High to Low</option>
                    <option value="created_at-desc">Newest First</option>
                    <option value="created_at-asc">Oldest First</option>
                  </select>
                </div>
                
                {/* Price Range */}
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">$</span>
                      <input
                        type="number"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Min"
                      />
                      <span className="text-gray-400">-</span>
                      <input
                        type="number"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        placeholder="Max"
                      />
                      <span className="text-sm text-gray-600">$</span>
                    </div>
                  </div>
                </div>
                
                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setPriceRange({ min: 0, max: 100 })
                    setSelectedBrands([])
                    setSelectedCountries([])
                    setSortBy('name')
                    setSortOrder('asc')
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <ProductGrid 
              products={products} 
              loading={loading}
              emptyMessage={`No ${getPageTitle().toLowerCase()} found`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}