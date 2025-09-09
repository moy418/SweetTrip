'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, User, Search, Menu, X, Heart, Trophy, Globe2, Target, Star, TrendingUp, ChevronDown, Calendar, Flag } from 'lucide-react'

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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isRegionsOpen, setIsRegionsOpen] = useState(false)
  const [isCountriesOpen, setIsCountriesOpen] = useState(false)

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollThreshold = 50
      
      setIsScrolled(currentScrollY > scrollThreshold)
      setIsScrollingDown(currentScrollY > lastScrollY && currentScrollY > scrollThreshold)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
      }, 150)
    }
    
    return { handleMouseEnter, handleMouseLeave }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search page
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
      setSearchQuery('')
    }
  }

  // Sample data for dropdowns - in production, fetch from API
  const categories = [
    { id: '1', name: 'Chocolate Bars', slug: 'chocolate-bars' },
    { id: '2', name: 'Cookies & Biscuits', slug: 'cookies-biscuits' },
    { id: '3', name: 'Sodas & Drinks', slug: 'sodas-drinks' },
    { id: '4', name: 'Chips & Snacks', slug: 'chips-snacks' },
    { id: '5', name: 'Spicy Treats', slug: 'spicy-treats' },
    { id: '6', name: 'Gummies & Jellies', slug: 'gummies-jellies' },
  ]

  const regions = [
    { id: '1', name: 'South American Delights', slug: 'south-american-delights' },
    { id: '2', name: 'European Classics', slug: 'european-classics' },
    { id: '3', name: 'North American Favorites', slug: 'north-american-favorites' },
    { id: '4', name: 'Asian Wonders', slug: 'asian-wonders' },
    { id: '5', name: 'African Treasures', slug: 'african-treasures' },
  ]

  const countries = [
    { id: '1', country_name: 'Mexico', country_code: 'MX', flag_emoji: '🇲🇽' },
    { id: '2', country_name: 'Japan', country_code: 'JP', flag_emoji: '🇯🇵' },
    { id: '3', country_name: 'China', country_code: 'CN', flag_emoji: '🇨🇳' },
    { id: '4', country_name: 'South Korea', country_code: 'KR', flag_emoji: '🇰🇷' },
    { id: '5', country_name: 'United States', country_code: 'US', flag_emoji: '🇺🇸' },
    { id: '6', country_name: 'Canada', country_code: 'CA', flag_emoji: '🇨🇦' },
    { id: '7', country_name: 'Argentina', country_code: 'AR', flag_emoji: '🇦🇷' },
    { id: '8', country_name: 'France', country_code: 'FR', flag_emoji: '🇫🇷' },
    { id: '9', country_name: 'Spain', country_code: 'ES', flag_emoji: '🇪🇸' },
    { id: '10', country_name: 'Italy', country_code: 'IT', flag_emoji: '🇮🇹' },
    { id: '11', country_name: 'England', country_code: 'GB', flag_emoji: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white shadow-lg transition-transform duration-300 ${
      isScrollingDown && isScrolled ? '-translate-y-full' : 'translate-y-0'
    }`}>
      
      {/* World Cup 2026 Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white py-2 px-4 text-center relative overflow-hidden">
        <div className="flex items-center justify-center space-x-2 relative z-10">
          <Trophy className="w-5 h-5 text-yellow-300 animate-bounce" />
          <span className="text-sm font-medium">
            🏆 World Cup 2026 Collection - Coming Soon! 
          </span>
          <button className="bg-yellow-500 text-black px-3 py-1 rounded text-xs font-bold hover:bg-yellow-400 transition-colors ml-2">
            PREVIEW NOW
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className={`container mx-auto px-4 ${isScrolled ? 'py-2' : 'py-6'} transition-all`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image 
              src="/sweet-trip-logo.png" 
              alt="Sweet Trip Logo" 
              width={200}
              height={200}
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
                placeholder="Search for your favorite treats..."
                className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* User Menu */}
            <Link href="/login" className="hidden sm:flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <User className="w-5 h-5" />
              <span className="text-sm">Login</span>
            </Link>

            {/* Shopping Cart */}
            <button className="relative flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline text-sm">Cart</span>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className={`hidden md:flex items-center justify-center mt-4 space-x-8 ${
          isScrolled ? 'mt-2' : 'mt-4'
        } transition-all`}>
          
          {/* Home */}
          <Link href="/" className="text-white hover:text-blue-300 transition-colors font-medium">
            Home
          </Link>

          {/* World Cup 2026 */}
          <Link href="/world-cup-2026" className="text-white hover:text-blue-300 transition-colors font-medium flex items-center space-x-1">
            <Trophy className="w-4 h-4" />
            <span>World Cup 2026</span>
            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">Coming Soon</span>
          </Link>

          {/* Categories Dropdown */}
          <div 
            className="relative dropdown-container"
            {...createHoverHandlers(setIsCategoriesOpen)}
          >
            <button 
              className="text-white hover:text-blue-300 transition-colors font-medium flex items-center space-x-1"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <span>Categories</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Regions Dropdown */}
          <div 
            className="relative dropdown-container"
            {...createHoverHandlers(setIsRegionsOpen)}
          >
            <button 
              className="text-white hover:text-blue-300 transition-colors font-medium flex items-center space-x-1"
              onClick={() => setIsRegionsOpen(!isRegionsOpen)}
            >
              <span>Regions</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isRegionsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isRegionsOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50">
                {regions.map((region) => (
                  <Link
                    key={region.id}
                    href={`/regions/${region.slug}`}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                  >
                    {region.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Countries Dropdown */}
          <div 
            className="relative dropdown-container"
            {...createHoverHandlers(setIsCountriesOpen)}
          >
            <button 
              className="text-white hover:text-blue-300 transition-colors font-medium flex items-center space-x-1"
              onClick={() => setIsCountriesOpen(!isCountriesOpen)}
            >
              <span>Countries</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCountriesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCountriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 z-50 max-h-96 overflow-y-auto">
                {countries.map((country) => (
                  <Link
                    key={country.id}
                    href={`/countries/${country.country_code.toLowerCase()}`}
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <span className="text-lg">{country.flag_emoji}</span>
                    <span>{country.country_name}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Featured */}
          <Link href="/featured" className="text-white hover:text-blue-300 transition-colors font-medium flex items-center space-x-1">
            <Star className="w-4 h-4" />
            <span>Featured</span>
          </Link>

          {/* New Arrivals */}
          <Link href="/new-arrivals" className="text-white hover:text-blue-300 transition-colors font-medium flex items-center space-x-1">
            <TrendingUp className="w-4 h-4" />
            <span>New Arrivals</span>
          </Link>

          {/* About */}
          <Link href="/about" className="text-white hover:text-blue-300 transition-colors font-medium">
            About
          </Link>

          {/* Contact */}
          <Link href="/contact" className="text-white hover:text-blue-300 transition-colors font-medium">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-gray-800 rounded-lg p-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search treats..."
                  className="w-full px-4 py-2 pr-12 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              <Link href="/" className="block py-2 text-white hover:text-blue-300 transition-colors">Home</Link>
              <Link href="/world-cup-2026" className="block py-2 text-white hover:text-blue-300 transition-colors">World Cup 2026</Link>
              <Link href="/categories" className="block py-2 text-white hover:text-blue-300 transition-colors">Categories</Link>
              <Link href="/regions" className="block py-2 text-white hover:text-blue-300 transition-colors">Regions</Link>
              <Link href="/countries" className="block py-2 text-white hover:text-blue-300 transition-colors">Countries</Link>
              <Link href="/featured" className="block py-2 text-white hover:text-blue-300 transition-colors">Featured</Link>
              <Link href="/new-arrivals" className="block py-2 text-white hover:text-blue-300 transition-colors">New Arrivals</Link>
              <Link href="/about" className="block py-2 text-white hover:text-blue-300 transition-colors">About</Link>
              <Link href="/contact" className="block py-2 text-white hover:text-blue-300 transition-colors">Contact</Link>
              
              <div className="pt-4 border-t border-gray-700">
                <Link href="/login" className="block py-2 text-white hover:text-blue-300 transition-colors">Login</Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
