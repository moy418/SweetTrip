import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, User, Search, Menu, X, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCartStore } from '../store/cartStore'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Header() {
  const { user, profile, signOut } = useAuth()
  const { toggleCart, getTotalItems } = useCartStore()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  return (
  <header className="site-gradient sticky top-0 z-50 shadow-lg">
      {/* Top Banner */}
    <div className="top-banner py-2 bg-blue-500/90">
        <div className="container mx-auto px-4 text-center text-sm text-white font-medium">
          Free shipping on orders over $60!
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4">
            <img 
              src="/sweet-trip-logo.png" 
              alt="Sweet Trip Logo" 
              className="h-16 w-16 sm:h-20 sm:w-20 md:h-32 md:w-32 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-pink-300 via-violet-300 to-indigo-400 bg-clip-text text-transparent">
                Sweet Trip
              </h1>
              <p className="text-sm text-gray-600 font-medium">Discover Candy from Around the World</p>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for exotic candies..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <li className="relative group">
                <button className="block py-2 md:py-4 text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Categories
                </button>
                <div className="md:absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/category/japanese-snacks" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-t-lg">
                    Japanese Snacks
                  </Link>
                  <Link to="/category/korean-treats" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Korean Treats
                  </Link>
                  <Link to="/category/american-favorites" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    American Favorites
                  </Link>
                  <Link to="/category/european-delights" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    European Delights
                  </Link>
                  <Link to="/category/exotic-international" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Exotic International
                  </Link>
                  <Link to="/category/chocolate-collection" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-b-lg">
                    Chocolate Collection
                  </Link>
                </div>
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