'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useCartStore } from '@/store/cart-store'
import { CartDrawer } from './cart-drawer'
import { SearchAutocomplete } from './search-autocomplete'

export function Header() {
  const { user, signOut } = useAuth()
  const { items } = useCartStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light'|'dark'>(() => (typeof window !== 'undefined' && (localStorage.getItem('site-theme') as 'light'|'dark')) || 'light')
  const [lang, setLang] = useState<'en'|'es'>(() => (typeof window !== 'undefined' && (localStorage.getItem('site-lang') as 'en'|'es')) || 'en')

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('site-theme', theme)
  }, [theme])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem('site-lang', lang)
  }, [lang])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const searchPlaceholder = lang === 'es' ? 'Buscar dulces exóticos...' : 'Search for exotic candies...'

  return (
    <>
      {/* Top Banner */}
        {/* Top Banner - match footer style */}
        <div className="top-banner py-2 bg-gray-900 text-white">
          <div className="container mx-auto px-4 text-center text-sm text-white">
            <span className="font-medium">{lang === 'es' ? 'Envío gratis en pedidos sobre $60!' : 'Free shipping on orders over $60!'}</span>
          </div>
        </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <Image
                  src="/sweet-trip-logo.png"
                  alt="Sweet Trip Logo"
                  width={120}
                  height={120}
                  className="rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Sweet Trip
                </h1>
                    <p className="text-sm text-white/90 font-medium">{lang === 'es' ? 'Descubre dulces de todo el mundo' : 'Discover Candy from Around the World'}</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Categories
              </Link>
              <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Products
              </Link>
              <Link href="/featured" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Featured
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  onFocus={() => setIsSearchOpen(true)}
                />
                {isSearchOpen && (
                  <SearchAutocomplete onClose={() => setIsSearchOpen(false)} />
                )}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="h-6 w-6" />
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-6 w-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="p-2 text-white/90 hover:text-white transition-colors"
                aria-label="Toggle theme"
                title={theme === 'light' ? (lang === 'es' ? 'Modo oscuro' : 'Dark mode') : (lang === 'es' ? 'Modo claro' : 'Light mode')}
              >
                {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Language selector */}
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'en'|'es')}
                  className="bg-transparent border border-white/30 text-sm rounded-md px-2 py-1 text-white"
                  aria-label="Language"
                >
                  <option value="en">EN</option>
                  <option value="es">ES</option>
                </select>
              </div>

              {/* User Menu */}
              {user ? (
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors" aria-label="User menu">
                    <User className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Account
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        My Orders
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign In
                </Link>
              )}

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-2 pt-4">
                <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Home
                </Link>
                <Link href="/categories" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Categories
                </Link>
                <Link href="/products" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Products
                </Link>
                <Link href="/featured" className="text-gray-700 hover:text-blue-600 font-medium py-2">
                  Featured
                </Link>
              </nav>
            </div>
          )}
        </div>

        {/* Category Chips */}
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center space-x-4 overflow-x-auto scrollbar-hide snap-x">
              <div className="flex space-x-3 whitespace-nowrap snap-start">
                <Link
                  href="/category/japanese"
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                >
                  <span>🇯🇵</span>
                  <span>Japanese</span>
                </Link>
                <Link
                  href="/category/korean"
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                >
                  <span>🇰🇷</span>
                  <span>Korean</span>
                </Link>
                <Link
                  href="/category/european"
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                >
                  <span>🇪🇺</span>
                  <span>European</span>
                </Link>
                <Link
                  href="/category/american"
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                >
                  <span>🇺🇸</span>
                  <span>American</span>
                </Link>
                <Link
                  href="/category/chocolate"
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                >
                  <span>🍫</span>
                  <span>Chocolate</span>
                </Link>
                <Link
                  href="/category/gummies"
                  className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border border-gray-200"
                >
                  <span>🍬</span>
                  <span>Gummies</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  )
}


