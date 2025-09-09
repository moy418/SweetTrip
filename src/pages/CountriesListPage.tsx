import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Grid, List, ChevronRight, MapPin, Flag } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

interface Country {
  id: string
  country_code: string
  country_name: string
  flag_emoji: string
  continent: string
  capital_city: string
  traditional_candy: string
  candy_description: string
  cultural_background: string
  product_count?: number
}

export default function CountriesListPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedContinent, setSelectedContinent] = useState<string>('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      setLoading(true)
      
      // Fetch countries from Supabase
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select(`
          id,
          country_code,
          country_name,
          flag_emoji,
          continent,
          capital_city,
          traditional_candy,
          candy_description,
          cultural_background,
          is_active,
          display_order
        `)
        .eq('is_active', true)
        .order('display_order')
      
      if (countriesError) throw countriesError
      
      // Get product counts for each country
      const countriesWithCounts = await Promise.all(
        (countriesData || []).map(async (country) => {
          const { count: productCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('origin_country', country.country_code)
            .eq('is_active', true)
          
          return {
            ...country,
            id: country.id.toString(),
            product_count: productCount || 0
          }
        })
      )
      
      setCountries(countriesWithCounts)
    } catch (error) {
      console.error('Error loading countries:', error)
      toast.error('Failed to load countries')
    } finally {
      setLoading(false)
    }
  }

  const filteredCountries = countries.filter(country => {
    const matchesSearch = country.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (country.traditional_candy && country.traditional_candy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (country.capital_city && country.capital_city.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesContinent = !selectedContinent || country.continent === selectedContinent
    return matchesSearch && matchesContinent
  })

  const continents = [...new Set(countries.map(country => country.continent).filter(Boolean))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading countries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <Flag className="h-12 w-12" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Sweet Countries
              </h1>
            </div>
            <p className="text-xl text-purple-100 mb-8">
              Discover traditional candies and sweets from countries around the globe, 
              each with their own unique flavors and cultural stories.
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
                  placeholder="Search countries or candies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={selectedContinent}
                onChange={(e) => setSelectedContinent(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                {filteredCountries.length} countries found
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCountries.map((country) => (
                <Link
                  key={country.id}
                  to={`/country/${country.country_code.toLowerCase()}`}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-300 transform hover:scale-105"
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-4xl">{country.flag_emoji}</span>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {country.country_name}
                        </h3>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3" />
                          <span>{country.continent}</span>
                        </div>
                      </div>
                    </div>
                    
                    {country.capital_city && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Capital:</strong> {country.capital_city}
                      </p>
                    )}
                    
                    {country.traditional_candy && (
                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Traditional Candy:</strong> {country.traditional_candy}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-sm text-purple-600 font-medium">
                        {country.product_count || 0} products
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCountries.map((country) => (
                <Link
                  key={country.id}
                  to={`/country/${country.country_code.toLowerCase()}`}
                  className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-purple-300 p-6 flex items-center space-x-6"
                >
                  <div className="flex-shrink-0">
                    <span className="text-5xl">{country.flag_emoji}</span>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                        {country.country_name}
                      </h3>
                      <span className="text-sm text-gray-500">• {country.continent}</span>
                    </div>
                    
                    {country.capital_city && (
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Capital:</strong> {country.capital_city}
                      </p>
                    )}
                    
                    {country.traditional_candy && (
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Traditional Candy:</strong> {country.traditional_candy}
                      </p>
                    )}
                    
                    <span className="text-sm text-purple-600 font-medium">
                      {country.product_count || 0} products available
                    </span>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredCountries.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 opacity-50">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No countries found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search terms or continent filter.</p>
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedContinent('')
                }}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
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
