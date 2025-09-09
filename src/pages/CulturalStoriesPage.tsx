import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Book, Clock, User, ArrowLeft, Globe2, Star, MapPin } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface CulturalStory {
  id: number
  title: string
  content: string
  story_type: string
  related_country_code: string | null
  related_product_id: number | null
  author: string
  publish_date: string
  is_featured: boolean
  image_url: string | null
  tags: string[]
  reading_time: number
}

interface Country {
  country_code: string
  country_name: string
  flag_emoji: string
  cultural_background: string
  traditional_candy: string
  candy_description: string
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  origin_country: string
  cultural_significance: string
  slug: string
}

export default function CulturalStoriesPage() {
  const { type, id } = useParams<{ type: string; id: string }>()
  const [stories, setStories] = useState<CulturalStory[]>([])
  const [featuredStories, setFeaturedStories] = useState<CulturalStory[]>([])
  const [country, setCountry] = useState<Country | null>(null)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStoriesData()
  }, [type, id])

  const loadStoriesData = async () => {
    try {
      setLoading(true)

      if (type === 'country' && id) {
        // Load country-specific stories and info
        const { data: countryData, error: countryError } = await supabase
          .from('countries')
          .select('*')
          .eq('country_code', id.toUpperCase())
          .maybeSingle()

        if (countryError) throw countryError
        setCountry(countryData)

        // Load stories for this country
        const { data: storiesData, error: storiesError } = await supabase
          .from('cultural_stories')
          .select('*')
          .eq('related_country_code', id.toUpperCase())
          .order('publish_date', { ascending: false })

        if (storiesError) throw storiesError
        setStories(storiesData || [])

        // Load products from this country
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('origin_country', id.toUpperCase())
          .eq('is_active', true)
          .limit(6)

        if (productsError) throw productsError
        setRelatedProducts(productsData || [])
      } else if (type === 'product' && id) {
        // Load product-specific stories and info
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .maybeSingle()

        if (productError) throw productError
        setProduct(productData)

        // Load stories for this product
        const { data: storiesData, error: storiesError } = await supabase
          .from('cultural_stories')
          .select('*')
          .eq('related_product_id', parseInt(id))
          .order('publish_date', { ascending: false })

        if (storiesError) throw storiesError
        setStories(storiesData || [])
      } else {
        // Load all featured stories
        const { data: featuredData, error: featuredError } = await supabase
          .from('cultural_stories')
          .select('*')
          .eq('is_featured', true)
          .order('publish_date', { ascending: false })
          .limit(6)

        if (featuredError) throw featuredError
        setFeaturedStories(featuredData || [])

        // Load all stories
        const { data: allStoriesData, error: allStoriesError } = await supabase
          .from('cultural_stories')
          .select('*')
          .order('publish_date', { ascending: false })

        if (allStoriesError) throw allStoriesError
        setStories(allStoriesData || [])
      }
    } catch (error) {
      console.error('Error loading stories:', error)
      toast.error('Failed to load cultural stories')
    } finally {
      setLoading(false)
    }
  }

  const getCountryFlag = (code: string | null) => {
    if (!code) return '🏳️'
    const flags: { [key: string]: string } = {
      'USA': '🇺🇸', 'MEX': '🇲🇽', 'CAN': '🇨🇦', 'ARG': '🇦🇷', 'BRA': '🇧🇷',
      'FRA': '🇫🇷', 'GER': '🇩🇪', 'ESP': '🇪🇸', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'JPN': '🇯🇵'
    }
    return flags[code] || '🏳️'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStoryTypeColor = (type: string) => {
    const colors = {
      'country_culture': 'from-blue-500 to-purple-600',
      'product_heritage': 'from-green-500 to-teal-600',
      'cultural_tradition': 'from-orange-500 to-red-600',
      'cultural_fusion': 'from-pink-500 to-purple-600'
    }
    return colors[type as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  const getStoryTypeLabel = (type: string) => {
    const labels = {
      'country_culture': 'Country Culture',
      'product_heritage': 'Product Heritage',
      'cultural_tradition': 'Cultural Tradition',
      'cultural_fusion': 'Cultural Fusion'
    }
    return labels[type as keyof typeof labels] || type
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading cultural stories...</p>
        </div>
      </div>
    )
  }

  // Country Stories Page
  if (type === 'country' && country) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white">
        {/* Header */}
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <Link 
              to="/worldcup2026/countries"
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Countries</span>
            </Link>
            
            <div className="text-center max-w-4xl mx-auto">
              <div className="text-8xl mb-6">{country.flag_emoji}</div>
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                <span className="block">{country.country_name}</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  Cultural Stories
                </span>
              </h1>
              
              {/* Traditional Candy Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
                <h3 className="text-2xl font-bold mb-4 text-yellow-300">{country.traditional_candy}</h3>
                <p className="text-lg text-white/90 mb-4">{country.candy_description}</p>
                <p className="text-white/80 italic">{country.cultural_background}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stories */}
        <section className="pb-16 px-4">
          <div className="container mx-auto">
            {stories.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {stories.map((story) => (
                  <article key={story.id} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`bg-gradient-to-r ${getStoryTypeColor(story.story_type)} px-3 py-1 rounded-full text-sm font-medium`}>
                        {getStoryTypeLabel(story.story_type)}
                      </div>
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{story.reading_time} min read</span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">{story.title}</h2>
                    <p className="text-white/90 leading-relaxed mb-6">{story.content}</p>
                    
                    <div className="flex items-center justify-between text-white/60 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{story.author}</span>
                      </div>
                      <span>{formatDate(story.publish_date)}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-24 w-24 mx-auto mb-6 text-white/50" />
                <h3 className="text-2xl font-bold mb-4 text-white/80">No stories yet</h3>
                <p className="text-white/60">Cultural stories for {country.country_name} are coming soon!</p>
              </div>
            )}

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div>
                <h3 className="text-3xl font-bold mb-8 text-center">Candies from {country.country_name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.slug}`}
                      className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
                    >
                      <h4 className="text-xl font-bold mb-2 group-hover:text-yellow-300 transition-colors">{product.name}</h4>
                      <p className="text-white/80 text-sm mb-3">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-green-400">${product.price}</span>
                        <span className="text-white/60 text-sm">View Details</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  // Product Stories Page
  if (type === 'product' && product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white">
        <section className="pt-32 pb-16 px-4">
          <div className="container mx-auto">
            <Link 
              to={`/product/${product.slug}`}
              className="inline-flex items-center space-x-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Product</span>
            </Link>
            
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-black mb-6">
                <span className="block">{product.name}</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                  Cultural Heritage
                </span>
              </h1>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
                <p className="text-lg text-white/90 mb-4">{product.description}</p>
                {product.cultural_significance && (
                  <p className="text-white/80 italic">{product.cultural_significance}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 px-4">
          <div className="container mx-auto">
            {stories.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {stories.map((story) => (
                  <article key={story.id} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`bg-gradient-to-r ${getStoryTypeColor(story.story_type)} px-3 py-1 rounded-full text-sm font-medium`}>
                        {getStoryTypeLabel(story.story_type)}
                      </div>
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{story.reading_time} min read</span>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">{story.title}</h2>
                    <p className="text-white/90 leading-relaxed mb-6">{story.content}</p>
                    
                    <div className="flex items-center justify-between text-white/60 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{story.author}</span>
                      </div>
                      <span>{formatDate(story.publish_date)}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-24 w-24 mx-auto mb-6 text-white/50" />
                <h3 className="text-2xl font-bold mb-4 text-white/80">No stories yet</h3>
                <p className="text-white/60">Cultural stories for this product are coming soon!</p>
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  // General Stories Index Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600 text-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Book className="h-6 w-6 text-purple-300" />
            <span className="font-bold text-lg">Cultural Stories</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="block">Sweet Stories</span>
            <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
              From Around the World
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Discover the rich cultural heritage behind every candy, from ancient traditions to modern innovations
          </p>
        </div>
      </section>

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="pb-16 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {featuredStories.map((story) => (
                <article key={story.id} className="group bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:bg-white/15 transition-all hover:scale-105">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-2xl">{getCountryFlag(story.related_country_code)}</div>
                    <div className={`bg-gradient-to-r ${getStoryTypeColor(story.story_type)} px-3 py-1 rounded-full text-sm font-medium`}>
                      {getStoryTypeLabel(story.story_type)}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-300 transition-colors">{story.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed mb-4 line-clamp-3">
                    {story.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-white/60 text-sm mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>{story.reading_time} min read</span>
                    </div>
                    <span>{formatDate(story.publish_date)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">{story.author}</span>
                    {story.related_country_code && (
                      <Link
                        to={`/stories/country/${story.related_country_code.toLowerCase()}`}
                        className="text-blue-300 hover:text-blue-200 text-sm transition-colors"
                      >
                        Read More
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Stories */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">All Cultural Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <article key={story.id} className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{getCountryFlag(story.related_country_code)}</div>
                  <div className={`bg-gradient-to-r ${getStoryTypeColor(story.story_type)} px-3 py-1 rounded-full text-sm font-medium`}>
                    {getStoryTypeLabel(story.story_type)}
                  </div>
                  <div className="flex items-center space-x-2 text-white/60 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{story.reading_time} min read</span>
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold mb-4">{story.title}</h2>
                <p className="text-white/90 leading-relaxed mb-6">{story.content}</p>
                
                <div className="flex items-center justify-between text-white/60 text-sm">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>{story.author}</span>
                  </div>
                  <span>{formatDate(story.publish_date)}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}