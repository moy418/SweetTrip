import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Target, Trophy, Calendar, MapPin, Clock, Star, TrendingUp, Award } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
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

interface Prediction {
  id: number
  match_id: number
  predicted_home_score: number
  predicted_away_score: number
  points_earned: number
  is_correct: boolean | null
}

export default function PredictionsPage() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [homeScore, setHomeScore] = useState('')
  const [awayScore, setAwayScore] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userStats, setUserStats] = useState({ totalPoints: 0, correctPredictions: 0, totalPredictions: 0 })

  useEffect(() => {
    loadPredictionsData()
    
    // Auto-select match if specified in URL
    const matchId = searchParams.get('match')
    if (matchId) {
      const match = matches.find(m => m.id === parseInt(matchId))
      if (match) setSelectedMatch(match)
    }
  }, [searchParams])

  const loadPredictionsData = async () => {
    try {
      // Load matches
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .order('match_date')

      if (matchesError) throw matchesError
      setMatches(matchesData || [])

      if (user) {
        // Load user predictions
        const { data: predictionsData, error: predictionsError } = await supabase
          .from('predictions')
          .select('*')
          .eq('user_id', user.id)

        if (predictionsError) throw predictionsError
        setPredictions(predictionsData || [])

        // Calculate user stats
        const totalPredictions = predictionsData?.length || 0
        const correctPredictions = predictionsData?.filter(p => p.is_correct === true).length || 0
        const totalPoints = predictionsData?.reduce((sum, p) => sum + (p.points_earned || 0), 0) || 0

        setUserStats({
          totalPoints,
          correctPredictions,
          totalPredictions
        })
      }
    } catch (error) {
      console.error('Error loading predictions data:', error)
      toast.error('Failed to load predictions data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPrediction = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error('Please login to make predictions')
      return
    }

    if (!selectedMatch || homeScore === '' || awayScore === '') {
      toast.error('Please fill in all prediction fields')
      return
    }

    setSubmitting(true)
    try {
      const existingPrediction = predictions.find(p => p.match_id === selectedMatch.id)
      
      if (existingPrediction) {
        // Update existing prediction
        const { error } = await supabase
          .from('predictions')
          .update({
            predicted_home_score: parseInt(homeScore),
            predicted_away_score: parseInt(awayScore),
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPrediction.id)

        if (error) throw error
        toast.success('Prediction updated successfully!')
      } else {
        // Create new prediction
        const { error } = await supabase
          .from('predictions')
          .insert({
            user_id: user.id,
            match_id: selectedMatch.id,
            predicted_home_score: parseInt(homeScore),
            predicted_away_score: parseInt(awayScore)
          })

        if (error) throw error
        toast.success('Prediction submitted successfully!')
      }

      // Reload data
      await loadPredictionsData()
      
      // Reset form
      setHomeScore('')
      setAwayScore('')
      setSelectedMatch(null)
    } catch (error) {
      console.error('Error submitting prediction:', error)
      toast.error('Failed to submit prediction')
    } finally {
      setSubmitting(false)
    }
  }

  const getCountryName = (code: string) => {
    const countryNames: { [key: string]: string } = {
      'USA': 'United States', 'MEX': 'Mexico', 'CAN': 'Canada', 'ARG': 'Argentina',
      'BRA': 'Brazil', 'FRA': 'France', 'GER': 'Germany', 'ESP': 'Spain',
      'ENG': 'England', 'JPN': 'Japan', 'KOR': 'South Korea', 'CRO': 'Croatia',
      'POR': 'Portugal', 'NED': 'Netherlands', 'ITA': 'Italy', 'MAR': 'Morocco',
      'POL': 'Poland', 'UKR': 'Ukraine', 'NGA': 'Nigeria', 'AUS': 'Australia', 'NZL': 'New Zealand'
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
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const getPredictionForMatch = (matchId: number) => {
    return predictions.find(p => p.match_id === matchId)
  }

  const isMatchPredictable = (match: Match) => {
    const matchDate = new Date(match.match_date)
    const now = new Date()
    return matchDate > now && match.status === 'scheduled'
  }

  const getPointsForResult = (prediction: Prediction) => {
    if (prediction.is_correct === null) return 'Pending'
    if (prediction.is_correct) return `+${prediction.points_earned} points`
    return '0 points'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading predictions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-600 to-red-600 text-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
            <Target className="h-6 w-6 text-yellow-300" />
            <span className="font-bold text-lg">Match Predictions</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            <span className="block">Predict &</span>
            <span className="block bg-gradient-to-r from-yellow-200 via-white to-orange-200 bg-clip-text text-transparent">
              Earn Sweet Rewards
            </span>
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
            Make predictions for World Cup matches and earn candy rewards for correct guesses!
          </p>

          {/* User Stats */}
          {user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-200">{userStats.totalPoints}</div>
                <div className="text-white/80">Total Points</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-green-300">
                  {userStats.totalPredictions > 0 ? Math.round((userStats.correctPredictions / userStats.totalPredictions) * 100) : 0}%
                </div>
                <div className="text-white/80">Accuracy</div>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-300">{userStats.totalPredictions}</div>
                <div className="text-white/80">Predictions Made</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Prediction Form */}
      {selectedMatch && (
        <section className="pb-8 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Make Your Prediction</h3>
                <div className="text-white/70">{selectedMatch.stage} • {formatMatchDate(selectedMatch.match_date)}</div>
                <div className="text-sm text-white/60 mt-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  {selectedMatch.venue}
                </div>
              </div>

              <form onSubmit={handleSubmitPrediction}>
                <div className="flex items-center justify-between mb-6">
                  {/* Home Team */}
                  <div className="text-center flex-1">
                    <div className="text-5xl mb-2">{getCountryFlag(selectedMatch.home_team_code)}</div>
                    <div className="font-bold mb-4">{getCountryName(selectedMatch.home_team_code)}</div>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      placeholder="0"
                      className="w-16 h-16 text-center text-2xl font-bold bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:bg-white/30 focus:border-white/50 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="text-center mx-8">
                    <div className="text-3xl font-bold text-white/60 mb-2">VS</div>
                  </div>

                  {/* Away Team */}
                  <div className="text-center flex-1">
                    <div className="text-5xl mb-2">{getCountryFlag(selectedMatch.away_team_code)}</div>
                    <div className="font-bold mb-4">{getCountryName(selectedMatch.away_team_code)}</div>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      placeholder="0"
                      className="w-16 h-16 text-center text-2xl font-bold bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:bg-white/30 focus:border-white/50 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="text-center space-y-4">
                  <button
                    type="submit"
                    disabled={submitting || !user}
                    className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Prediction'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMatch(null)}
                    className="block mx-auto text-white/70 hover:text-white underline"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}

      {/* Matches List */}
      <section className="pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">World Cup Matches</h2>
            <p className="text-white/80 text-lg">Select a match to make your prediction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const prediction = getPredictionForMatch(match.id)
              const canPredict = isMatchPredictable(match)
              
              return (
                <div
                  key={match.id}
                  className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 transition-all duration-300 ${
                    canPredict ? 'hover:bg-white/15 hover:scale-105' : 'opacity-75'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 text-sm mb-2">
                      <Calendar className="h-3 w-3" />
                      <span>{match.stage}</span>
                    </div>
                    <div className="text-sm text-white/70">{formatMatchDate(match.match_date)}</div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-center flex-1">
                      <div className="text-3xl mb-1">{getCountryFlag(match.home_team_code)}</div>
                      <div className="font-bold text-sm">{getCountryName(match.home_team_code)}</div>
                      {match.home_score !== null && (
                        <div className="text-2xl font-bold text-green-400 mt-1">{match.home_score}</div>
                      )}
                    </div>
                    
                    <div className="text-center mx-4">
                      <div className="text-xl font-bold text-white/60">VS</div>
                      {prediction && (
                        <div className="text-xs text-white/60 mt-1">
                          {prediction.predicted_home_score}-{prediction.predicted_away_score}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center flex-1">
                      <div className="text-3xl mb-1">{getCountryFlag(match.away_team_code)}</div>
                      <div className="font-bold text-sm">{getCountryName(match.away_team_code)}</div>
                      {match.away_score !== null && (
                        <div className="text-2xl font-bold text-green-400 mt-1">{match.away_score}</div>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-white/60 mb-3">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {match.venue}
                    </div>
                    
                    {prediction && (
                      <div className="mb-3 p-2 bg-white/10 rounded-lg">
                        <div className="text-xs text-white/70 mb-1">Your Prediction</div>
                        <div className="font-bold">
                          {prediction.predicted_home_score} - {prediction.predicted_away_score}
                        </div>
                        <div className={`text-xs ${
                          prediction.is_correct === true ? 'text-green-400' :
                          prediction.is_correct === false ? 'text-red-400' : 'text-yellow-400'
                        }`}>
                          {getPointsForResult(prediction)}
                        </div>
                      </div>
                    )}
                    
                    {canPredict && user && (
                      <button
                        onClick={() => {
                          setSelectedMatch(match)
                          const existingPrediction = prediction
                          if (existingPrediction) {
                            setHomeScore(existingPrediction.predicted_home_score.toString())
                            setAwayScore(existingPrediction.predicted_away_score.toString())
                          } else {
                            setHomeScore('')
                            setAwayScore('')
                          }
                        }}
                        className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2 mx-auto"
                      >
                        <Target className="h-4 w-4" />
                        <span>{prediction ? 'Update' : 'Predict'}</span>
                      </button>
                    )}
                    
                    {!canPredict && (
                      <div className="text-xs text-white/50">
                        {match.status === 'completed' ? 'Match Completed' : 'Prediction Closed'}
                      </div>
                    )}
                    
                    {!user && canPredict && (
                      <div className="text-xs text-white/70">
                        Login to make predictions
                      </div>
                    )}
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