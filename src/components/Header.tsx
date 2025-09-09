import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X, Heart, Trophy, Globe2, Target, Star, TrendingUp, ChevronDown, Calendar, Flag } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCartStore } from '../store/cartStore'
import { supabase } from '../lib/supabase'
import NotificationCenter from './NotificationCenter'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
}

interface Region {
  id: string
  name: string
  slug: string
}

interface Country {
  id: string
  country_name: string
  country_code: string
  flag_emoji: string
}

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const { toggleCart, getTotalItems } = useCartStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isRegionsOpen, setIsRegionsOpen] = useState(false)
  const [isCountriesOpen, setIsCountriesOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [regions, setRegions] = useState<Region[]>([])
  const [countries, setCountries] = useState<Country[]>([])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking inside any dropdown
      const target = event.target as HTMLElement
      if (target.closest('.dropdown-container')) {
        return
      }
      setIsCategoriesOpen(false)
      setIsRegionsOpen(false)
      setIsCountriesOpen(false)
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Auto-close dropdown after delay when mouse leaves both trigger and dropdown
  const createHoverHandlers = (setOpenState: (open: boolean) => void) => {
    let timeoutId: NodeJS.Timeout | null = null
    
    const handleMouseEnter = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      setOpenState(true)
    }
    
    const handleMouseLeave = () => {
      timeoutId = setTimeout(() => {
        setOpenState(false)
      }, 150) // 150ms delay to allow cursor movement
    }
    
    return { handleMouseEnter, handleMouseLeave }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const [theme, setTheme] = React.useState<'light'|'dark'>(() => (typeof window !== 'undefined' && localStorage.getItem('site-theme')) as 'light'|'dark' || 'light')
  const [lang, setLang] = React.useState<'en'|'es'>(() => (typeof window !== 'undefined' && (localStorage.getItem('site-lang') as 'en'|'es')) || 'en')

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('site-theme', theme)
  }, [theme])

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const scrolledPastThreshold = scrollY > 60
      const scrollDirection = scrollY > lastScrollY
      
      setIsScrolled(scrolledPastThreshold)
      setIsScrollingDown(scrollDirection && scrollY > 100)
      setLastScrollY(scrollY)
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true })
    }
    return () => { if (typeof window !== 'undefined') window.removeEventListener('scroll', onScroll) }
  }, [lastScrollY])

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('site-lang', lang)
  }, [lang])

  useEffect(() => {
    loadNavigationData()
  }, [])

  const loadNavigationData = async () => {
    try {
      // Load categories with basic query (avoiding PostgREST cache issues)
      const { data: allCategories, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, slug')
        .limit(50)
      
      if (categoriesError) {
        console.error('Categories error:', categoriesError)
      }

      // Filter client-side for specific product categories
      const productCategorySlugs = ['chocolate-bars', 'cookies', 'sodas', 'chips', 'spicy', 'gummies', 'hard-candies', 'mints']
      const categoriesData = allCategories?.filter(cat => productCategorySlugs.includes(cat.slug)) || []

      // Load regions with basic query
      const { data: allRegions, error: regionsError } = await supabase
        .from('regions')
        .select('id, name, slug')
        .limit(20)
      
      if (regionsError) {
        console.error('Regions error:', regionsError)
      }

      // Load countries with basic query  
      const { data: allCountries, error: countriesError } = await supabase
        .from('countries')
        .select('id, country_name, country_code, flag_emoji')
        .limit(100)
        
      if (countriesError) {
        console.error('Countries error:', countriesError)
      }

      // Filter client-side for specific countries
      const targetCountries = ['Mexico', 'Japan', 'China', 'South Korea', 'United States', 'Canada', 'Argentina', 'France', 'Spain', 'Italy', 'England']
      const countriesData = allCountries?.filter(country => targetCountries.includes(country.country_name)) || []

      setCategories(categoriesData)
      setRegions(allRegions || [])
      setCountries(countriesData)
      
      console.log('Navigation data loaded:', { categories: categoriesData.length, regions: allRegions?.length || 0, countries: countriesData.length })
    } catch (error) {
      console.error('Error loading navigation data:', error)
    }
  }

  const bannerText = lang === 'es' ? 'Envío gratis en pedidos sobre $60!' : 'Free shipping on orders over $60!'

  return (
  <header className={`fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg transition-transform duration-300 ${
    isScrollingDown ? '-translate-y-full' : 'translate-y-0'
  }`}> 
      {/* Top Banner - Hidden when scrolled */}
      <div className={`top-banner py-2 bg-gray-900 text-white transition-all duration-300 ${
        isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
      }`}>
        <div className="container mx-auto px-4 text-center text-sm text-white">
          {bannerText}
        </div>
      </div>

      {/* Main Header */}
  <div className={`container mx-auto px-4 ${isScrolled ? 'py-2' : 'py-6'} transition-all` }>
          <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/sweetlogo-removebg-preview.png" 
              alt="Sweet Trip Logo" 
              className={`transition-all duration-300 bg-transparent object-contain ${
                isScrolled 
                  ? 'h-14 w-14 sm:h-16 sm:w-16' 
                  : 'h-16 w-16 sm:h-20 sm:w-20 md:h-40 md:w-40 lg:h-48 lg:w-48 hover:scale-105'
              }`}
              style={{ backgroundColor: 'transparent' }}
            />
            <div className={`transition-all duration-300 ${
              isScrolled ? 'transform scale-75 origin-left' : ''
            }`}>
              <h1 className={`font-bold text-white transition-all duration-300 ${
                isScrolled 
                  ? 'text-lg sm:text-xl' 
                  : 'text-2xl sm:text-3xl md:text-3xl'
              }`}>
                Sweet Trip
              </h1>
              <p className={`text-white/80 font-medium transition-all duration-300 ${
                isScrolled 
                  ? 'text-xs opacity-70' 
                  : 'text-sm opacity-100'
              }`}>Discover Candy from Around the World</p>
            </div>
          </Link>

          {/* Search Bar */}
              <form onSubmit={handleSearch} className={`hidden md:flex flex-1 mx-8 transition-all duration-300 ${
                isScrolled ? 'max-w-md' : 'max-w-lg'
              }`}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'es' ? 'Buscar dulces exóticos...' : 'Search for exotic candies...'}
                className={`w-full pr-10 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800 text-white transition-all duration-300 ${
                  isScrolled ? 'px-3 py-2 text-sm' : 'px-4 py-2'
                }`}
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Wishlist */}
            {user && (
              <Link
                to="/wishlist"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Heart className="h-6 w-6" />
              </Link>
            )}

            {/* Notifications */}
            <NotificationCenter />

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌞' : '🌙'}
            </button>

            {/* Language selector */}
            <div className="relative">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'en'|'es')}
                className="bg-transparent border border-gray-200 text-sm rounded-md px-2 py-1"
                aria-label="Language"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-2 text-gray-600 hover:text-blue-600 transition-colors">
                <User className="h-6 w-6" />
                {user && profile && (
                  <span className="hidden md:block text-sm">
                    {profile.first_name || user.email}
                  </span>
                )}
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      My Account
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      My Orders
                    </Link>
                    {profile?.is_admin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-blue-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for exotic candies..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>

      {/* Simplified International Focus Banner - Hidden when scrolled */}
      <div className={`bg-gradient-to-r from-orange-500 to-red-500 text-white transition-all duration-300 ${
        isScrolled ? 'h-0 py-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'
      }`}>
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center space-x-3 text-sm">
            <span className="text-lg">🌍</span>
            <span className="font-semibold">50+ Countries • 1000+ Authentic Treats • Free Shipping $60+</span>
            <Link
              to="/regions"
              className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full font-medium text-xs transition-all hover:scale-105"
            >
              Explore Now
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className={`${isMenuOpen ? 'block' : 'hidden'} md:block`}>
            <ul className="flex flex-col md:flex-row md:space-x-8 py-4 md:py-0">
              <li>
                <Link
                  to="/"
                  className="block py-2 md:py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              
              {/* World Cup 2026 - Minimized to match new brand focus */}
              <li className="relative group">
                <Link
                  to="/worldcup2026"
                  className="flex items-center space-x-2 py-2 md:py-4 text-blue-600 hover:text-blue-800 font-medium transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Calendar className="h-4 w-4" />
                  <span>World Cup 2026</span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium text-xs">Special</span>
                </Link>
              </li>
              
              {/* Categories Dropdown */}
              <li className="relative dropdown-container">
                {(() => {
                  const { handleMouseEnter, handleMouseLeave } = createHoverHandlers(setIsCategoriesOpen)
                  return (
                    <div 
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button 
                        className="flex items-center space-x-1 py-2 md:py-4 px-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsCategoriesOpen(!isCategoriesOpen)
                        }}
                      >
                        <span>Categories</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isCategoriesOpen && (
                        <div className="absolute left-0 top-full w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 mt-1 transform transition-all duration-200 ease-out">
                          <div className="px-5 py-3 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                              <span className="text-xl">🍭</span>
                              <span>Shop by Category</span>
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Discover treats by type</p>
                          </div>
                          <div className="max-h-64 overflow-y-auto">
                            {categories.length > 0 ? (
                              categories.map((category) => (
                                <Link
                                  key={category.id}
                                  to={`/category/${category.slug}`}
                                  className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 hover:text-orange-700 transition-all duration-200 group"
                                  onClick={() => setIsCategoriesOpen(false)}
                                >
                                  <div className="w-2 h-2 bg-orange-400 rounded-full group-hover:bg-orange-600 transition-colors"></div>
                                  <span className="font-medium">{category.name}</span>
                                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-orange-600">→</span>
                                </Link>
                              ))
                            ) : (
                              <div className="px-5 py-4 text-gray-500 text-center">
                                <div className="animate-spin w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <span className="text-sm">Loading categories...</span>
                              </div>
                            )}
                          </div>
                          <div className="border-t border-gray-50 mt-2 px-5 py-3">
                            <Link
                              to="/categories"
                              className="flex items-center justify-between text-orange-600 font-semibold hover:text-orange-700 transition-colors group"
                              onClick={() => setIsCategoriesOpen(false)}
                            >
                              <span>View All Categories</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </li>

              {/* Regions Dropdown */}
              <li className="relative dropdown-container">
                {(() => {
                  const { handleMouseEnter, handleMouseLeave } = createHoverHandlers(setIsRegionsOpen)
                  return (
                    <div 
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button 
                        className="flex items-center space-x-1 py-2 md:py-4 px-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsRegionsOpen(!isRegionsOpen)
                        }}
                      >
                        <Globe2 className="h-4 w-4" />
                        <span>Regions</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isRegionsOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isRegionsOpen && (
                        <div className="absolute left-0 top-full w-96 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 mt-1 transform transition-all duration-200 ease-out">
                          <div className="px-5 py-3 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                              <span className="text-xl">🌍</span>
                              <span>Explore by Region</span>
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Discover regional specialties</p>
                          </div>
                          <div className="max-h-72 overflow-y-auto">
                            {regions.length > 0 ? (
                              regions.map((region) => (
                                <Link
                                  key={region.id}
                                  to={`/region/${region.slug}`}
                                  className="flex items-center space-x-3 px-5 py-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 transition-all duration-200 group border-l-4 border-transparent hover:border-blue-400"
                                  onClick={() => setIsRegionsOpen(false)}
                                >
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
                                      {region.name.charAt(0)}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <span className="font-semibold block">{region.name}</span>
                                    <span className="text-xs text-gray-500">Traditional treats & flavors</span>
                                  </div>
                                  <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 font-bold">→</span>
                                </Link>
                              ))
                            ) : (
                              <div className="px-5 py-6 text-gray-500 text-center">
                                <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                                <span className="text-sm">Loading regions...</span>
                              </div>
                            )}
                          </div>
                          <div className="border-t border-gray-50 mt-2 px-5 py-3">
                            <Link
                              to="/regions"
                              className="flex items-center justify-between text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                              onClick={() => setIsRegionsOpen(false)}
                            >
                              <span>View All Regions</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </li>

              {/* Countries Dropdown */}
              <li className="relative dropdown-container">
                {(() => {
                  const { handleMouseEnter, handleMouseLeave } = createHoverHandlers(setIsCountriesOpen)
                  return (
                    <div 
                      className="relative"
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button 
                        className="flex items-center space-x-1 py-2 md:py-4 px-2 text-gray-700 hover:text-blue-600 font-medium transition-colors rounded-md hover:bg-gray-50"
                        onClick={(e) => {
                          e.stopPropagation()
                          setIsCountriesOpen(!isCountriesOpen)
                        }}
                      >
                        <Flag className="h-4 w-4" />
                        <span>Countries</span>
                        <ChevronDown className={`h-4 w-4 transition-transform ${isCountriesOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isCountriesOpen && (
                        <div className="absolute left-0 top-full w-96 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50 mt-1 transform transition-all duration-200 ease-out">
                          <div className="px-5 py-3 border-b border-gray-50">
                            <h3 className="font-bold text-gray-900 text-lg flex items-center space-x-2">
                              <span className="text-xl">🏳️</span>
                              <span>Popular Countries</span>
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">Authentic treats from around the world</p>
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {countries.length > 0 ? (
                              <div className="grid grid-cols-2 gap-1 p-2">
                                {countries.map((country) => (
                                  <Link
                                    key={country.id}
                                    to={`/country/${country.country_code.toLowerCase()}`}
                                    className="flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 hover:text-green-700 transition-all duration-200 rounded-lg group border border-transparent hover:border-green-200"
                                    onClick={() => setIsCountriesOpen(false)}
                                  >
                                    <span className="text-2xl group-hover:scale-125 transition-transform">{country.flag_emoji}</span>
                                    <div className="flex-1 min-w-0">
                                      <span className="font-medium text-sm block truncate">{country.country_name}</span>
                                      <span className="text-xs text-gray-500 block">{country.country_code}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <div className="px-5 py-6 text-gray-500 text-center">
                                <div className="animate-spin w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                                <span className="text-sm">Loading countries...</span>
                              </div>
                            )}
                          </div>
                          <div className="border-t border-gray-50 mt-2 px-5 py-3">
                            <Link
                              to="/countries"
                              className="flex items-center justify-between text-green-600 font-semibold hover:text-green-700 transition-colors group"
                              onClick={() => setIsCountriesOpen(false)}
                            >
                              <span>View All Countries</span>
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
              </li>
              <li>
                <Link
                  to="/featured"
                  className="block py-2 md:py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Featured
                </Link>
              </li>
              <li>
                <Link
                  to="/new-arrivals"
                  className="block py-2 md:py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block py-2 md:py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block py-2 md:py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}