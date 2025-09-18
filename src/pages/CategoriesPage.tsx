import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Grid, List, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import CategoryVideoReel from '../components/CategoryVideoReel'
import { CATEGORY_VIDEOS } from '../data/categoryVideos'

interface Category {
  id: string
  name: string
  description: string
  slug: string
  image_url: string
  display_order: number
  product_count?: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          products(count)
        `)
        .eq('is_active', true)
        .order('display_order')

      if (error) throw error

      // Process the data to get product counts
      const processedCategories = data?.map(category => ({
        ...category,
        product_count: category.products?.length || 0
      })) || []

      setCategories(processedCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading categories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Sweet Categories
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore our diverse collection of candies from around the world, 
              organized by type and flavor profile.
            </p>
          </div>
        </div>
      </section>

      {/* Video Reel Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Discover Our Categories
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Watch our curated video reels showcasing the best candies from each category around the world
            </p>
          </div>
          
          <CategoryVideoReel videos={CATEGORY_VIDEOS} />
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredCategories.length} categories found
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-300 transform hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-blue-100 to-purple-100">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <div className="text-6xl opacity-50">🍬</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600 font-medium">
                        {category.product_count || 0} products
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 p-6 flex items-center space-x-6"
                >
                  <div className="flex-shrink-0">
                    {category.image_url ? (
                      <img
                        src={category.image_url}
                        alt={category.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-3xl">🍬</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {category.description}
                      </p>
                    )}
                    <span className="text-sm text-blue-600 font-medium">
                      {category.product_count || 0} products
                    </span>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No categories found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or browse all categories.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
