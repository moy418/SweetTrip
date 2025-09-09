import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Trophy, MapPin, Target, Star, Users, Calendar, TrendingUp, Globe2, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AIRecommendations from '../components/AIRecommendations'
import toast from 'react-hot-toast'

interface Match {
  id: number
  match_number: number
  home_team_code: string
  away_team_code: string
  match_date: string
  venue: string
  stage: string
  home_score: number | null
  away_score: number | null
  status: string
}

interface UserStats {
  prediction_points: number
  total_achievements: number
  countries_collected: number
}

export default function WorldCup2026Page() {
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorldCupData()
  }, [])

  const loadWorldCupData = async () => {
    try {
      // Load upcoming matches
      const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('status', 'scheduled')
        .order('match_date')
        .limit(6)

      if (matchError) throw matchError
      setUpcomingMatches(matches || [])

      // Load user stats if authenticated
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('prediction_points, total_achievements')
          .eq('id', user.id)
          .maybeSingle()

        const { data: collections } = await supabase
          .from('user_country_collections')
          .select('country_code')
          .eq('user_id', user.id)

        if (profile) {
          setUserStats({
            prediction_points: profile.prediction_points || 0,
            total_achievements: profile.total_achievements || 0,
            countries_collected: collections?.length || 0
          })
        }
      }
    } catch (error) {
      console.error('Error loading World Cup data:', error)
      toast.error('Failed to load World Cup data')
    } finally {
      setLoading(false)
    }
  }

  const formatCountryName = (code: string) => {
    const countryNames: { [key: string]: string } = {
      'USA': 'United States',
      'MEX': 'Mexico',
      'CAN': 'Canada',
      'ARG': 'Argentina',
      'BRA': 'Brazil',
      'FRA': 'France',
      'GER': 'Germany',
      'ESP': 'Spain',
      'ENG': 'England',
      'JPN': 'Japan',
      'KOR': 'South Korea',
      'CRO': 'Croatia',
      'POR': 'Portugal',
      'NED': 'Netherlands',
      'ITA': 'Italy',
      'MAR': 'Morocco',
      'POL': 'Poland',
      'UKR': 'Ukraine',
      'NGA': 'Nigeria',
      'AUS': 'Australia',
      'NZL': 'New Zealand'
    }
    return countryNames[code] || code
  }

  const getCountryFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      'USA': '🇺🇸', 'MEX': '🇲🇽', 'CAN': '🇨🇦', 'ARG': '🇦🇷', 'BRA': '🇧🇷',
      'FRA': '🇫🇷', 'GER': '🇩🇪', 'ESP': '🇪🇸', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'JPN': '🇯🇵',
      'KOR': '🇰🇷', 'CRO': '🇭🇷', 'POR': '🇵🇹', 'NED': '🇳🇱', 'ITA': '🇮🇹',
      'MAR': '🇲🇦', 'POL': '🇵🇱', 'UKR': '🇺🇦', 'NGA': '🇳🇬', 'AUS': '🇦🇺', 'NZL': '🇳🇿'
    }
    return flags[code] || '🏳️'
  }

  const formatMatchDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading World Cup 2026...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <Trophy className="h-6 w-6 text-yellow-400" />
              <span className="font-bold text-lg">World Cup 2026</span>
              <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-bold text-sm">Coming Soon</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <span className="block">Football World Cup</span>
              <span className="block bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 bg-clip-text text-transparent animate-gradient-x">
                Sweet Victory
              </span>
              <span className="block">2026 Preview</span>
            </h1>
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-yellow-400/30">
              <div className="flex items-center justify-center space-x-3">
                <div className="text-4xl animate-bounce">⚽</div>
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-yellow-300 mb-2">Coming Soon!</h2>
                  <p className="text-white/90">Get ready for the ultimate football candy experience in 2026!</p>
                </div>
                <div className="text-4xl animate-bounce">🍬</div>
              </div>
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
              Preview the world's greatest football tournament with candies from all 48 participating countries. 
              When the tournament arrives, make predictions, collect achievements, and taste victory!
            </p>
            
            {/* Coming Soon Preview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-400">48</div>
                <div className="text-white/80">Countries</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-green-400">104</div>
                <div className="text-white/80">Matches</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-400">2026</div>
                <div className="text-white/80">Tournament Year</div>
              </div>
            </div>

            {/* CTA Buttons - Coming Soon State */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/worldcup2026/countries"
                className="group bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-green-500/25 hover:scale-105 transform opacity-70 cursor-not-allowed"
                onClick={(e) => e.preventDefault()}
              >
                <Globe2 className="h-5 w-5" />
                <span>Preview 48 Countries</span>
              </Link>
              <Link
                to="/products?category=football-themed"
                className="group bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 transform"
              >
                <div className="text-xl">⚽</div>
                <span>Shop Football Candies</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Features Preview */}
      <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Tournament Features - Coming Soon!</h2>
            <p className="text-white/80 text-lg">Get ready for these exciting features when the tournament begins!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 opacity-75">
              <div className="text-center mb-4">
                <div className="text-sm text-white/60 mb-2">Coming in 2026</div>
                <div className="text-lg text-white/80 font-bold">Match Predictions</div>
              </div>
              
              <div className="flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-3xl mb-1">⚽</div>
                  <div className="font-bold text-sm">Football</div>
                </div>
                <div className="text-2xl font-bold text-white/60 mx-4">VS</div>
                <div className="text-center">
                  <div className="text-3xl mb-1">🍬</div>
                  <div className="font-bold text-sm">Candies</div>
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-xs text-white/60 mb-2">
                  <Target className="h-3 w-3 inline mr-1" />
                  Interactive Predictions
                </div>
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium text-sm opacity-50 cursor-not-allowed">
                  <Target className="h-4 w-4" />
                  <span>Coming Soon</span>
                </button>
              </div>
            </div>
            
            {/* More coming soon preview cards could be added here */}
          </div>
        </div>
      </section>

      {/* World Cup Features - Coming Soon */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">World Cup 2026 Features</h2>
            <p className="text-white/80 text-lg">Discover what's coming when the tournament begins!</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:from-blue-500/30 hover:to-purple-600/30 transition-all duration-300 hover:scale-105 opacity-75">
              <Globe2 className="h-12 w-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">48 Countries</h3>
              <p className="text-white/70">Explore candies from every participating nation</p>
              <div className="mt-3 text-sm text-yellow-400 font-bold">Coming 2026</div>
            </div>

            <div className="group bg-gradient-to-br from-yellow-500/20 to-orange-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:from-yellow-500/30 hover:to-orange-600/30 transition-all duration-300 hover:scale-105 opacity-75">
              <Target className="h-12 w-12 text-yellow-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Match Predictions</h3>
              <p className="text-white/70">Predict outcomes and earn sweet rewards</p>
              <div className="mt-3 text-sm text-yellow-400 font-bold">Coming 2026</div>
            </div>

            <div className="group bg-gradient-to-br from-green-500/20 to-teal-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:from-green-500/30 hover:to-teal-600/30 transition-all duration-300 hover:scale-105 opacity-75">
              <TrendingUp className="h-12 w-12 text-green-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
              <p className="text-white/70">See who's leading the prediction race</p>
              <div className="mt-3 text-sm text-yellow-400 font-bold">Coming 2026</div>
            </div>

            <div className="group bg-gradient-to-br from-pink-500/20 to-red-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:from-pink-500/30 hover:to-red-600/30 transition-all duration-300 hover:scale-105">
              <Star className="h-12 w-12 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">Football Candies</h3>
              <p className="text-white/70">Shop themed candies available now!</p>
              <div className="mt-3">
                <Link
                  to="/products?category=football-themed"
                  className="text-sm text-pink-400 font-bold hover:text-pink-300"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* World Cup Candy Recommendations */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-blue-600/10 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <div className="text-2xl animate-bounce">⚽</div>
              <span className="font-bold text-lg">Football-Themed</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 bg-clip-text text-transparent">
                World Cup Sweet Picks
              </span>
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover football-themed candy selections from participating countries, 
              available now while we prepare for the ultimate tournament experience in 2026!
            </p>
          </div>
          
          <AIRecommendations 
            title=""
            limit={6}
            className=""
            showTitle={false}
          />
          
          <div className="text-center mt-12">
            <Link
              to="/products?category=football-themed"
              className="group inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-500 via-green-500 to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:from-yellow-600 hover:via-green-600 hover:to-blue-600 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 transform"
            >
              <div className="text-2xl group-hover:animate-bounce">⚽</div>
              <span>Shop Football Candies Now</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}