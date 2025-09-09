import React, { useState, useEffect } from 'react'
import { TrendingUp, Trophy, Medal, Star, Users, Target, Crown } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface LeaderboardEntry {
  id: string
  first_name: string
  last_name: string
  prediction_points: number
  total_achievements: number
  correct_predictions: number
  total_predictions: number
  countries_collected: number
}

interface TopCountryCollector {
  country_code: string
  country_name: string
  collectors_count: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [topCountries, setTopCountries] = useState<TopCountryCollector[]>([])
  const [activeTab, setActiveTab] = useState<'points' | 'achievements' | 'accuracy'>('points')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboardData()
  }, [])

  const loadLeaderboardData = async () => {
    try {
      // Load user profiles with stats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, prediction_points, total_achievements')
        .order('prediction_points', { ascending: false })
        .limit(50)

      if (profilesError) throw profilesError

      // Get prediction stats for each user
      const leaderboardData: LeaderboardEntry[] = []
      
      for (const profile of profiles || []) {
        const { data: predictions } = await supabase
          .from('predictions')
          .select('is_correct')
          .eq('user_id', profile.id)

        const { data: collections } = await supabase
          .from('user_country_collections')
          .select('country_code')
          .eq('user_id', profile.id)

        const totalPredictions = predictions?.length || 0
        const correctPredictions = predictions?.filter(p => p.is_correct === true).length || 0
        const countriesCollected = collections?.length || 0

        leaderboardData.push({
          ...profile,
          correct_predictions: correctPredictions,
          total_predictions: totalPredictions,
          countries_collected: countriesCollected
        })
      }

      setLeaderboard(leaderboardData)

      // Load top countries by collectors
      const { data: countryStats, error: countryError } = await supabase
        .from('user_country_collections')
        .select(`
          country_code,
          countries!inner(country_name)
        `)

      if (countryError) throw countryError

      // Count collectors per country
      const countryCollectors: { [key: string]: { name: string; count: number } } = {}
      
      countryStats?.forEach(stat => {
        const code = stat.country_code
        const name = (stat as any).countries?.country_name || code
        
        if (!countryCollectors[code]) {
          countryCollectors[code] = { name, count: 0 }
        }
        countryCollectors[code].count++
      })

      const topCountriesData = Object.entries(countryCollectors)
        .map(([code, data]) => ({
          country_code: code,
          country_name: data.name,
          collectors_count: data.count
        }))
        .sort((a, b) => b.collectors_count - a.collectors_count)
        .slice(0, 10)

      setTopCountries(topCountriesData)
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      toast.error('Failed to load leaderboard data')
    } finally {
      setLoading(false)
    }
  }

  const getSortedLeaderboard = () => {
    switch (activeTab) {
      case 'achievements':
        return [...leaderboard].sort((a, b) => b.total_achievements - a.total_achievements)
      case 'accuracy':
        return [...leaderboard]
          .filter(entry => entry.total_predictions > 0)
          .sort((a, b) => {
            const aAccuracy = (a.correct_predictions / a.total_predictions) * 100
            const bAccuracy = (b.correct_predictions / b.total_predictions) * 100
            return bAccuracy - aAccuracy
          })
      default:
        return [...leaderboard].sort((a, b) => b.prediction_points - a.prediction_points)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400" />
      case 2: return <Medal className="h-6 w-6 text-gray-300" />
      case 3: return <Medal className="h-6 w-6 text-amber-600" />
      default: return <span className="w-6 text-center font-bold text-white/60">#{rank}</span>
    }
  }

  const getCountryFlag = (code: string) => {
    const flags: { [key: string]: string } = {
      'USA': '🇺🇸', 'MEX': '🇲🇽', 'CAN': '🇨🇦', 'ARG': '🇦🇷', 'BRA': '🇧🇷',
      'FRA': '🇫🇷', 'GER': '🇩🇪', 'ESP': '🇪🇸', 'ENG': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'JPN': '🇯🇵',
      'KOR': '🇰🇷', 'CRO': '🇭🇷', 'POR': '🇵🇹', 'NED': '🇳🇱', 'ITA': '🇮🇹'
    }
    return flags[code] || '🏳️'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  const sortedLeaderboard = getSortedLeaderboard()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-700 text-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <TrendingUp className="h-6 w-6 text-green-300" />
            <span className="font-bold text-lg">World Cup Leaderboard</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="block">Champions</span>
            <span className="block bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 bg-clip-text text-transparent">
              Leaderboard
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            See who's leading the race for sweet victory in predictions, achievements, and country collections!
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2 flex space-x-2">
              <button
                onClick={() => setActiveTab('points')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'points'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Trophy className="h-5 w-5 inline mr-2" />
                Prediction Points
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'achievements'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Star className="h-5 w-5 inline mr-2" />
                Achievements
              </button>
              <button
                onClick={() => setActiveTab('accuracy')}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  activeTab === 'accuracy'
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Target className="h-5 w-5 inline mr-2" />
                Accuracy
              </button>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
            <div className="space-y-4">
              {sortedLeaderboard.slice(0, 20).map((entry, index) => {
                const rank = index + 1
                const accuracy = entry.total_predictions > 0 
                  ? Math.round((entry.correct_predictions / entry.total_predictions) * 100) 
                  : 0
                
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center space-x-4 p-4 rounded-2xl transition-all hover:bg-white/5 ${
                      rank <= 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20' : 'bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(rank)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="font-bold text-lg">
                        {entry.first_name || 'Anonymous'} {entry.last_name || ''}
                      </div>
                      <div className="text-white/60 text-sm">
                        {entry.countries_collected}/48 countries collected
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {activeTab === 'points' && (
                        <>
                          <div className="text-2xl font-bold text-yellow-400">{entry.prediction_points}</div>
                          <div className="text-white/60 text-sm">points</div>
                        </>
                      )}
                      {activeTab === 'achievements' && (
                        <>
                          <div className="text-2xl font-bold text-purple-400">{entry.total_achievements}</div>
                          <div className="text-white/60 text-sm">achievements</div>
                        </>
                      )}
                      {activeTab === 'accuracy' && (
                        <>
                          <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
                          <div className="text-white/60 text-sm">{entry.correct_predictions}/{entry.total_predictions} correct</div>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Top Countries */}
      <section className="pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Most Popular Countries</h2>
            <p className="text-white/80">Countries with the most candy collectors</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {topCountries.map((country, index) => (
              <div
                key={country.country_code}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20 hover:bg-white/15 transition-all"
              >
                <div className="text-4xl mb-2">{getCountryFlag(country.country_code)}</div>
                <div className="font-bold text-sm mb-1">{country.country_name}</div>
                <div className="text-2xl font-bold text-blue-400 mb-1">{country.collectors_count}</div>
                <div className="text-white/60 text-xs">collectors</div>
                {index < 3 && (
                  <div className="mt-2">
                    {index === 0 && <div className="text-yellow-400 text-sm">★ #1</div>}
                    {index === 1 && <div className="text-gray-300 text-sm">★ #2</div>}
                    {index === 2 && <div className="text-amber-600 text-sm">★ #3</div>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}