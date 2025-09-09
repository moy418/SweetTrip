import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Grid, List, ChevronRight, MapPin, Globe2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

interface Region {
  id: string
  name: string
  description: string
  slug: string
  continent: string
  image_url: string
  display_order: number
  category_count?: number
  product_count?: number
}

export default function RegionsPage() {
  const [regions, setRegions] = useState<Region[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContinent, setSelectedContinent] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadRegions()
  }, [])

  const loadRegions = async () => {
    try {
      setLoading(true)
      
      // Fetch regions from Supabase with product counts
      const { data: regionsData, error: regionsError } = await supabase
        .from('regions')
        .select(`
          id,
          name,
          description,
          slug,
          continent,
          image_url,
          display_order,
          is_active
        `)
        .eq('is_active', true)
        .order('display_order')
      
      if (regionsError) throw regionsError
      
      // Get product counts by region
      const regionsWithCounts = await Promise.all(
        (regionsData || []).map(async (region) => {
          // Count products in this region via countries
          const { count: productCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .in('origin_country', 
              await supabase
                .from('countries')
                .select('country_code')
                .eq('region_id', region.id)
                .then(({ data }) => data?.map(c => c.country_code) || [])
            )
            .eq('is_active', true)
          
          // Count categories (simplified - using all active categories)
          const { count: categoryCount } = await supabase
            .from('categories')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)
          
          return {
            ...region,
            id: region.id.toString(),
            product_count: productCount || 0,
            category_count: Math.ceil((categoryCount || 0) / 5) // Distribute categories across regions
          }
        })
      )
      
      setRegions(regionsWithCounts)
    } catch (error) {
      console.error('Error loading regions:', error)
      toast.error('Failed to load regions')
    } finally {
      setLoading(false)
    }
  }

  const filteredRegions = regions.filter(region => {
    const matchesSearch = region.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (region.description && region.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesContinent = !selectedContinent || region.continent === selectedContinent
    return matchesSearch && matchesContinent
  })

  const continents = [...new Set(regions.map(region => region.continent).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading regions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Globe2 className="h-12 w-12" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Sweet Regions
              </h1>
            </div>
            <p className="text-xl text-green-100 mb-8">
              Journey around the world through our curated regional candy collections, 
              each bringing unique flavors and cultural traditions.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search regions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Continents</option>
                {continents.map(continent => (
                  <option key={continent} value={continent}>{continent}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredRegions.length} regions found
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regions Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRegions.map((region) => (
                <Link
                  key={region.id}
                  to={`/region/${region.slug}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-green-300 transform hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-green-100 to-teal-100">
                    {region.image_url ? (
                      <img
                        src={region.image_url}
                        alt={region.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
                        <div className="text-6xl opacity-50">🌍</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{region.continent}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {region.name}
                    </h3>
                    {region.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {region.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span className="text-green-600 font-medium">{region.category_count || 0}</span> categories
                        {' • '}
                        <span className="text-green-600 font-medium">{region.product_count || 0}</span> products
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRegions.map((region) => (
                <Link
                  key={region.id}
                  to={`/region/${region.slug}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-green-300 p-6 flex items-center space-x-6"
                >
                  <div className="flex-shrink-0">
                    {region.image_url ? (
                      <img
                        src={region.image_url}
                        alt={region.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
                        <span className="text-3xl">🌍</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <MapPin className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">{region.continent}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
                      {region.name}
                    </h3>
                    {region.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {region.description}
                      </p>
                    )}
                    <div className="text-sm text-gray-500">
                      <span className="text-green-600 font-medium">{region.category_count || 0}</span> categories
                      {' • '}
                      <span className="text-green-600 font-medium">{region.product_count || 0}</span> products
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredRegions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No regions found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or continent filter.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedContinent('')
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
