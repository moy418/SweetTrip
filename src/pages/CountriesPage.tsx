import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Globe2, Star, ShoppingBag, Book, MapPin, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

interface Country {
  id: number
  country_code: string
  country_name: string
  flag_emoji: string
  continent: string
  fifa_ranking?: number
  traditional_candy: string
  candy_description: string
  cultural_background: string
  flag_colors?: string[]
  capital_city: string
}

interface Product {
  id: number
  name: string
  price: number
  slug: string
  image_urls: string[]
  origin_country: string
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedContinent, setSelectedContinent] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCountriesData()
  }, [])

  const loadCountriesData = async () => {
    try {
      setLoading(true)
      
      // Fetch countries from Supabase
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
      
      if (countriesError) throw countriesError
      
      // Fetch products from Supabase
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, price, slug, image_urls, origin_country')
        .eq('is_active', true)
      
      if (productsError) throw productsError
      
      setCountries(countriesData || [])
      setProducts(productsData || [])
    } catch (error) {
      console.error('Error loading countries:', error)
      toast.error('Failed to load countries data')
    } finally {
      setLoading(false)
    }
  }

  const continents = ['all', 'North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania']

  const filteredCountries = countries.filter(country => {
    const matchesContinent = selectedContinent === 'all' || country.continent === selectedContinent
    const matchesSearch = country.country_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         country.traditional_candy.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesContinent && matchesSearch
  })

  const getProductsForCountry = (countryCode: string) => {
    // Match products based on origin_country
    return products.filter(product => product.origin_country === countryCode)
  }

  const getContinentColor = (continent: string) => {
    const colors = {
      'North America': 'from-blue-500 to-teal-600',
      'South America': 'from-green-500 to-yellow-600',
      'Europe': 'from-purple-500 to-pink-600',
      'Africa': 'from-orange-500 to-red-600',
      'Asia': 'from-red-500 to-pink-600',
      'Oceania': 'from-cyan-500 to-blue-600'
    }
    return colors[continent as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading countries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 text-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Globe2 className="h-6 w-6 text-blue-300" />
            <span className="font-bold text-lg">48 Countries Explorer</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="block">Discover Sweet</span>
            <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              Traditions
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Explore authentic candies and cultural stories from all 48 FIFA World Cup 2026 participating countries
          </p>

          {/* Search and Filter */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search countries or candies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={selectedContinent}
                  onChange={(e) => setSelectedContinent(e.target.value)}
                  className="w-full px-6 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white focus:outline-none focus:bg-white/30 focus:border-white/50 transition-all"
                >
                  {continents.map(continent => (
                    <option key={continent} value={continent} className="bg-gray-800 text-white">
                      {continent === 'all' ? 'All Continents' : continent}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-center text-white/80">
              Showing {filteredCountries.length} of {countries.length} countries
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCountries.map((country) => {
              const countryProducts = getProductsForCountry(country.country_code)
              
              return (
                <div
                  key={country.id}
                  className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform"
                >
                  {/* Country Header */}
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-3">{country.flag_emoji}</div>
                    <h3 className="text-2xl font-bold mb-2">{country.country_name}</h3>
                    <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-4 py-2 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{country.continent}</span>
                    </div>
                    <div className="mt-2 text-white/60 text-sm">
                      FIFA Ranking: #{country.fifa_ranking}
                    </div>
                  </div>

                  {/* Traditional Candy */}
                  <div className="mb-6">
                    <h4 className="font-bold text-lg mb-2 text-yellow-300">{country.traditional_candy}</h4>
                    <p className="text-white/80 text-sm leading-relaxed mb-3">{country.candy_description}</p>
                    <p className="text-white/70 text-xs italic">{country.cultural_background}</p>
                  </div>

                  {/* Products Available */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <ShoppingBag className="h-4 w-4 text-green-400" />
                      <span className="text-sm font-medium">
                        {countryProducts.length} {countryProducts.length === 1 ? 'Product' : 'Products'} Available
                      </span>
                    </div>
                    {countryProducts.length > 0 && (
                      <div className="grid grid-cols-2 gap-2">
                        {countryProducts.slice(0, 2).map((product) => (
                          <Link
                            key={product.id}
                            to={`/product/${product.slug}`}
                            className="bg-white/20 rounded-lg p-2 hover:bg-white/30 transition-all text-xs"
                          >
                            <div className="font-medium truncate">{product.name}</div>
                            <div className="text-green-300">${product.price}</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Link
                      to={`/category/world-cup-2026?country=${country.country_code}`}
                      className={`flex-1 bg-gradient-to-r ${getContinentColor(country.continent)} text-white px-4 py-2 rounded-xl font-medium text-sm text-center hover:scale-105 transition-transform`}
                    >
                      Shop Candies
                    </Link>
                    <Link
                      to={`/stories/country/${country.country_code}`}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium text-sm flex items-center justify-center transition-all"
                    >
                      <Book className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}