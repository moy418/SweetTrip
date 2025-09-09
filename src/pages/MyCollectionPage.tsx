import React, { useState, useEffect } from 'react'
import { Star, Trophy, MapPin, ShoppingBag, Award, Target, Crown, Gift } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

interface UserCollection {
  id: number
  country_code: string
  products_purchased: number
  first_purchase_date: string
  total_spent: number
  collection_complete: boolean
  badge_earned: boolean
}

interface Country {
  country_code: string
  country_name: string
  flag_emoji: string
  continent: string
  traditional_candy: string
}

interface Achievement {
  id: number
  achievement_type: string
  achievement_name: string
  achievement_description: string
  badge_image_url: string
  points_awarded: number
  earned_at: string
  metadata: any
}

export default function MyCollectionPage() {
  const { user } = useAuth()
  const [collections, setCollections] = useState<UserCollection[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [activeTab, setActiveTab] = useState<'countries' | 'achievements'>('countries')
  const [selectedContinent, setSelectedContinent] = useState('all')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCountries: 0,
    totalSpent: 0,
    totalAchievements: 0,
    totalPoints: 0
  })

  useEffect(() => {
    if (user) {
      loadUserCollection()
    } else {
      setLoading(false)
    }
  }, [user])

  const loadUserCollection = async () => {
    if (!user) return
    
    try {
      // Load user collections
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('user_country_collections')
        .select('*')
        .eq('user_id', user.id)

      if (collectionsError) throw collectionsError
      setCollections(collectionsData || [])

      // Load all countries
      const { data: countriesData, error: countriesError } = await supabase
        .from('countries')
        .select('country_code, country_name, flag_emoji, continent, traditional_candy')

      if (countriesError) throw countriesError
      setCountries(countriesData || [])

      // Load user achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

      if (achievementsError) throw achievementsError
      setAchievements(achievementsData || [])

      // Load user profile for points
      const { data: profile } = await supabase
        .from('profiles')
        .select('prediction_points, total_achievements')
        .eq('id', user.id)
        .maybeSingle()

      // Calculate stats
      const totalCountries = collectionsData?.length || 0
      const totalSpent = collectionsData?.reduce((sum, c) => sum + c.total_spent, 0) || 0
      const totalAchievements = achievementsData?.length || 0
      const totalPoints = profile?.prediction_points || 0

      setStats({
        totalCountries,
        totalSpent,
        totalAchievements,
        totalPoints
      })
    } catch (error) {
      console.error('Error loading collection:', error)
      toast.error('Failed to load your collection')
    } finally {
      setLoading(false)
    }
  }

  const continents = ['all', 'North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania']

  const getCountryCollection = (countryCode: string) => {
    return collections.find(c => c.country_code === countryCode)
  }

  const getCountryInfo = (countryCode: string) => {
    return countries.find(c => c.country_code === countryCode)
  }

  const getFilteredCountries = () => {
    if (activeTab !== 'countries') return []
    
    return countries.filter(country => {
      if (selectedContinent === 'all') return true
      return country.continent === selectedContinent
    })
  }

  const getCollectionProgress = () => {
    return {
      collected: collections.length,
      total: 48,
      percentage: Math.round((collections.length / 48) * 100)
    }
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

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'first_purchase': return <ShoppingBag className="h-6 w-6" />
      case 'prediction_streak': return <Target className="h-6 w-6" />
      case 'country_collector': return <MapPin className="h-6 w-6" />
      case 'top_predictor': return <Crown className="h-6 w-6" />
      default: return <Award className="h-6 w-6" />
    }
  }

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'first_purchase': return 'from-green-500 to-teal-600'
      case 'prediction_streak': return 'from-yellow-500 to-orange-600'
      case 'country_collector': return 'from-purple-500 to-pink-600'
      case 'top_predictor': return 'from-blue-500 to-indigo-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-600 via-red-600 to-orange-600 flex items-center justify-center text-white">
        <div className="text-center max-w-md mx-auto px-4">
          <Star className="h-24 w-24 mx-auto mb-6 text-yellow-300" />
          <h1 className="text-4xl font-bold mb-4">My Collection</h1>
          <p className="text-xl text-white/90 mb-8">
            Track your candy collections and achievements from around the world!
          </p>
          <Link
            to="/login"
            className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 inline-block"
          >
            Login to View Collection
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-600 via-red-600 to-orange-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading your collection...</p>
        </div>
      </div>
    )
  }

  const progress = getCollectionProgress()
  const filteredCountries = getFilteredCountries()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-red-600 to-orange-600 text-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Star className="h-6 w-6 text-pink-300" />
            <span className="font-bold text-lg">My World Cup Collection</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="block">Sweet Victory</span>
            <span className="block bg-gradient-to-r from-yellow-300 via-pink-300 to-orange-300 bg-clip-text text-transparent">
              Collection
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Track your candy collections from all 48 World Cup countries and showcase your achievements!
          </p>

          {/* Progress Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-yellow-300">{stats.totalCountries}/48</div>
              <div className="text-white/80">Countries Collected</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-300">${stats.totalSpent.toFixed(2)}</div>
              <div className="text-white/80">Total Spent</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-300">{stats.totalAchievements}</div>
              <div className="text-white/80">Achievements</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-300">{stats.totalPoints}</div>
              <div className="text-white/80">Points Earned</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/20 rounded-full h-4 mb-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
            <div className="text-center text-white/80">
              {progress.percentage}% Complete ({progress.collected}/{progress.total} countries)
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex space-x-2">
              <button
                onClick={() => setActiveTab('countries')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'countries'
                    ? 'bg-gradient-to-r from-pink-500 to-red-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <MapPin className="h-5 w-5 inline mr-2" />
                Countries ({collections.length}/48)
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'achievements'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Trophy className="h-5 w-5 inline mr-2" />
                Achievements ({achievements.length})
              </button>
            </div>
          </div>

          {/* Countries Tab */}
          {activeTab === 'countries' && (
            <>
              {/* Continent Filter */}
              <div className="mb-8 text-center">
                <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-2">
                  {continents.map(continent => (
                    <button
                      key={continent}
                      onClick={() => setSelectedContinent(continent)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        selectedContinent === continent
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {continent === 'all' ? 'All Continents' : continent}
                    </button>
                  ))}
                </div>
              </div>

              {/* Countries Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCountries.map((country) => {
                  const collection = getCountryCollection(country.country_code)
                  const hasCollection = !!collection
                  
                  return (
                    <div
                      key={country.country_code}
                      className={`rounded-3xl p-6 border transition-all duration-300 ${
                        hasCollection
                          ? 'bg-gradient-to-br from-green-500/20 to-teal-600/20 border-green-500/30 hover:from-green-500/30 hover:to-teal-600/30'
                          : 'bg-white/5 border-white/20 hover:bg-white/10 opacity-60'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div className="text-5xl mb-3">{country.flag_emoji}</div>
                        <h3 className="text-xl font-bold mb-1">{country.country_name}</h3>
                        <div className="text-white/70 text-sm">{country.continent}</div>
                      </div>

                      {hasCollection ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-2 text-green-400">
                            <Trophy className="h-4 w-4" />
                            <span className="text-sm font-medium">Collected!</span>
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <div className="text-white/60">Products</div>
                              <div className="font-bold">{collection.products_purchased}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Spent</div>
                              <div className="font-bold">${collection.total_spent.toFixed(2)}</div>
                            </div>
                          </div>
                          <div className="text-xs text-white/60">
                            First purchase: {new Date(collection.first_purchase_date).toLocaleDateString()}
                          </div>
                          {collection.badge_earned && (
                            <div className="flex items-center space-x-2 text-yellow-400">
                              <Award className="h-4 w-4" />
                              <span className="text-sm">Badge Earned</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-white/60 text-sm">
                            <div className="font-medium mb-1">Traditional Candy:</div>
                            <div>{country.traditional_candy}</div>
                          </div>
                          <Link
                            to={`/category/world-cup-2026?country=${country.country_code}`}
                            className={`block text-center bg-gradient-to-r ${getContinentColor(country.continent)} text-white px-4 py-2 rounded-xl font-medium text-sm hover:scale-105 transition-transform`}
                          >
                            Start Collection
                          </Link>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {achievements.length === 0 ? (
                <div className="text-center py-12">
                  <Gift className="h-24 w-24 mx-auto mb-6 text-white/50" />
                  <h3 className="text-2xl font-bold mb-4 text-white/80">No achievements yet</h3>
                  <p className="text-white/60 mb-6">Start making predictions and purchasing candies to earn achievements!</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/worldcup2026/predictions"
                      className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:from-yellow-600 hover:to-orange-700 transition-all"
                    >
                      Make Predictions
                    </Link>
                    <Link
                      to="/worldcup2026/countries"
                      className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-700 transition-all"
                    >
                      Shop Candies
                    </Link>
                  </div>
                </div>
              ) : (
                achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`bg-gradient-to-r ${getAchievementColor(achievement.achievement_type)}/20 border border-white/20 rounded-3xl p-6 hover:bg-opacity-80 transition-all`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`bg-gradient-to-r ${getAchievementColor(achievement.achievement_type)} p-3 rounded-2xl`}>
                        {getAchievementIcon(achievement.achievement_type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{achievement.achievement_name}</h3>
                            <p className="text-white/80">{achievement.achievement_description}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-yellow-400">+{achievement.points_awarded}</div>
                            <div className="text-white/60 text-sm">points</div>
                          </div>
                        </div>
                        <div className="text-white/60 text-sm">
                          Earned on {new Date(achievement.earned_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}