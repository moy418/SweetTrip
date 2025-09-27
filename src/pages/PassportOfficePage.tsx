import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, MapPin, Star, Trophy, Gift, Crown, Globe, ShoppingBag, Calendar, Award, Sparkles, Heart, TrendingUp, Users, Package, Clock, Target } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface Stamp {
  id: string
  country: string
  countryCode: string
  flag: string
  date: string
  product: string
  points: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
  reward?: string
}

interface PassportLevel {
  name: string
  icon: string
  points: number
  benefits: string[]
  color: string
}

export default function PassportOfficePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [showPassport, setShowPassport] = useState(false)
  const { signIn } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  
  const from = location.state?.from?.pathname || '/'


  // Mock data for passport preview
  const [stamps] = useState<Stamp[]>([
    {
      id: '1',
      country: language === 'es' ? 'Japón' : 'Japan',
      countryCode: 'JP',
      flag: '🇯🇵',
      date: '2024-01-15',
      product: language === 'es' ? 'Kit Kat Matcha' : 'Kit Kat Matcha',
      points: 50
    },
    {
      id: '2',
      country: language === 'es' ? 'México' : 'Mexico',
      countryCode: 'MX',
      flag: '🇲🇽',
      date: '2024-01-20',
      product: language === 'es' ? 'Dulces de Tamarindo' : 'Tamarind Candy',
      points: 30
    }
  ])

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: language === 'es' ? 'Primer Viaje' : 'First Journey',
      description: language === 'es' ? 'Compraste tu primer dulce exótico' : 'You bought your first exotic candy',
      icon: '🌟',
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      reward: language === 'es' ? '10% descuento' : '10% discount'
    },
    {
      id: '2',
      title: language === 'es' ? 'Explorador Global' : 'Global Explorer',
      description: language === 'es' ? 'Visita 5 países diferentes' : 'Visit 5 different countries',
      icon: '🌍',
      unlocked: false,
      progress: 2,
      maxProgress: 5,
      reward: language === 'es' ? 'Envío gratis por 1 mes' : 'Free shipping for 1 month'
    }
  ])

  const passportLevels: Record<string, PassportLevel> = {
    explorer: {
      name: t.travelerLevels.explorer,
      icon: '🧭',
      points: 750,
      benefits: [t.passportOffice.exclusiveDiscounts, t.passportOffice.freeShipping, t.passportOffice.prioritySupport],
      color: 'from-purple-500 to-pink-500'
    },
    adventurer: {
      name: t.travelerLevels.adventurer,
      icon: '🗺️',
      points: 1500,
      benefits: [t.passportOffice.exclusiveDiscounts, t.passportOffice.freeShipping, t.passportOffice.prioritySupport],
      color: 'from-blue-500 to-purple-500'
    },
    expert: {
      name: t.travelerLevels.expert,
      icon: '🏆',
      points: 3000,
      benefits: [t.passportOffice.exclusiveDiscounts, t.passportOffice.freeShipping, t.passportOffice.prioritySupport],
      color: 'from-yellow-500 to-orange-500'
    },
    ambassador: {
      name: t.travelerLevels.ambassador,
      icon: '👑',
      points: 5000,
      benefits: [t.passportOffice.exclusiveDiscounts, t.passportOffice.freeShipping, t.passportOffice.prioritySupport],
      color: 'from-purple-600 to-pink-600'
    }
  }

  const currentLevel = passportLevels.explorer

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error(t.errors.fillAllFields)
      return
    }
    
    setLoading(true)
    try {
      await signIn(email, password)
      
      // Check if user came from checkout
      const checkoutRedirect = sessionStorage.getItem('checkout_redirect')
      if (checkoutRedirect) {
        sessionStorage.removeItem('checkout_redirect')
        navigate('/checkout', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (error: any) {
      toast.error(error.message || t.errors.signInFailed)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'instagram' | 'tiktok') => {
    setSocialLoading(provider)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.protocol}//${window.location.host}/#/auth/callback`
        }
      })
      
      if (error) {
        toast.error(`${t.errors.socialSignInFailed} ${provider}`)
      }
    } catch (error: any) {
      toast.error(`${t.errors.socialSignInFailed} ${provider}`)
    } finally {
      setSocialLoading(null)
    }
  }

  const handleGuestLogin = () => {
    navigate('/')
    toast.success(language === 'es' ? 'Continuando como invitado' : 'Continuing as guest')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-4">
              <img 
                src="/sweetlogo-removebg-preview.png" 
                alt="Sweet Trip" 
                className="h-16 w-16 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-transparent" 
                style={{ backgroundColor: 'transparent' }} 
              />
              <div>
                <span className="text-3xl font-bold">Sweet Trip</span>
                <p className="text-purple-100">{t.common.worldCandies}</p>
              </div>
            </Link>
            
            {/* Passport Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowPassport(!showPassport)}
                className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-3 hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
              >
                <span className="text-xl">📋</span>
                <span className="hidden md:inline">{t.passportOffice.viewPassport}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Passport Office Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t.passportOffice.title}
              </h2>
              <p className="text-gray-600">
                {t.passportOffice.subtitle}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Passport Number (Email) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.passportOffice.passportNumber}
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={t.passportOffice.passportNumberPlaceholder}
                  />
                  <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* Access Code (Password) */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t.passportOffice.accessCode}
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-3 pl-10 pr-10 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                    placeholder={t.passportOffice.accessCodePlaceholder}
                  />
                  <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Remember me and Forgot password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    {t.passportOffice.rememberMe}
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                    {t.passportOffice.forgotPassword}
                  </a>
                </div>
              </div>

              {/* Submit button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {loading ? t.passportOffice.signingIn : t.passportOffice.signIn}
                </button>
              </div>
            </form>

            {/* Social login options */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">{t.passportOffice.continueWith}</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSocialLogin('google')}
                  disabled={socialLoading === 'google'}
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-md disabled:opacity-50"
                >
                  {socialLoading === 'google' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={socialLoading === 'facebook'}
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-md disabled:opacity-50"
                >
                  {socialLoading === 'facebook' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      Facebook
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSocialLogin('instagram')}
                  disabled={socialLoading === 'instagram'}
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-md disabled:opacity-50"
                >
                  {socialLoading === 'instagram' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781h-1.595c-.49 0-.875-.385-.875-.875s.385-.875.875-.875h1.595c.49 0 .875.385.875.875s-.385.875-.875.875zm-7.83 1.297c-1.297 0-2.448.49-3.323 1.297-.807.875-1.297 2.026-1.297 3.323s.49 2.448 1.297 3.323c.875.807 2.026 1.297 3.323 1.297s2.448-.49 3.323-1.297c.807-.875 1.297-2.026 1.297-3.323s-.49-2.448-1.297-3.323c-.875-.807-2.026-1.297-3.323-1.297z"/>
                      </svg>
                      Instagram
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleSocialLogin('tiktok')}
                  disabled={socialLoading === 'tiktok'}
                  className="flex items-center justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-md disabled:opacity-50"
                >
                  {socialLoading === 'tiktok' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-700"></div>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-2 text-black" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      TikTok
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Guest login */}
            <div className="mt-6">
              <button
                onClick={handleGuestLogin}
                className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-xl shadow-sm bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-300 hover:shadow-md"
              >
                {t.passportOffice.continueAsGuest}
              </button>
            </div>

            {/* Register link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t.passportOffice.noAccount}{' '}
                <Link
                  to="/register"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  {t.passportOffice.createPassport}
                </Link>
              </p>
            </div>
          </div>

          {/* Passport Preview */}
          <div className={`transition-all duration-500 ${showPassport ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  📋 {t.passportOffice.yourPassport}
                </h3>
                <p className="text-gray-600">
                  {t.passportOffice.discoverRewards}
                </p>
              </div>

              {/* Level Preview */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{currentLevel.icon}</span>
                    <div>
                      <div className="font-bold text-gray-900">{currentLevel.name}</div>
                      <div className="text-sm text-gray-600">{t.passportOffice.currentLevel}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">{currentLevel.points} {t.passportOffice.points}</div>
                    <div className="text-xs text-gray-500">250 {t.passportOffice.toNextLevel}</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`h-3 rounded-full bg-gradient-to-r ${currentLevel.color}`} style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Recent Stamps */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">{t.passportOffice.recentStamps}</h4>
                <div className="space-y-3">
                  {stamps.map(stamp => (
                    <div key={stamp.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="text-2xl">{stamp.flag}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{stamp.country}</div>
                        <div className="text-sm text-gray-600">{stamp.product}</div>
                      </div>
                      <div className="text-sm font-bold text-purple-600">+{stamp.points}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4">{t.passportOffice.unlockedAchievements}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.filter(a => a.unlocked).map(achievement => (
                    <div key={achievement.id} className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{achievement.icon}</div>
                      <div className="text-xs font-semibold text-gray-900">{achievement.title}</div>
                      <div className="text-xs text-gray-600">{achievement.reward}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">{t.passportOffice.levelBenefits}</h4>
                <div className="space-y-2">
                  {currentLevel.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
