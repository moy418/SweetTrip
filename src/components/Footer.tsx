import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'

export default function Footer() {
  const { t } = useLanguage()
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/sweet-trip-logo.png" 
                alt="Sweet Trip Logo" 
                className="h-16 w-16 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-transparent"
                style={{ backgroundColor: 'transparent' }}
              />
              <span className="text-2xl font-bold">Sweet Trip</span>
            </div>
            <p className="text-gray-400 text-sm">
              Discover Candy from Around the World. We bring you the most exotic and delicious treats from every corner of the globe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-gray-400 hover:text-white transition-colors">
                  {t('featuredProducts')}
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-gray-400 hover:text-white transition-colors">
                  {t('newArrivals')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('categories')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/category/japanese-snacks" className="text-gray-400 hover:text-white transition-colors">
                  {t('japaneseSnacks')}
                </Link>
              </li>
              <li>
                <Link to="/category/korean-treats" className="text-gray-400 hover:text-white transition-colors">
                  {t('koreanTreats')}
                </Link>
              </li>
              <li>
                <Link to="/category/american-favorites" className="text-gray-400 hover:text-white transition-colors">
                  {t('americanFavorites')}
                </Link>
              </li>
              <li>
                <Link to="/category/european-delights" className="text-gray-400 hover:text-white transition-colors">
                  {t('europeanDelights')}
                </Link>
              </li>
              <li>
                <Link to="/category/chocolate-collection" className="text-gray-400 hover:text-white transition-colors">
                  {t('chocolateCollection')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('contactUs')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">hello@sweettripcandy.com</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <span className="text-gray-400">
                  402 S El Paso St<br />
                  El Paso, TX 79901<br />
                  United States
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © 2025 Sweet Trip. {t('allRightsReserved')}.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                {t('termsOfService')}
              </Link>
              <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">
                {t('shippingInfo')}
              </Link>
              <Link to="/returns" className="text-gray-400 hover:text-white transition-colors">
                {t('returns')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}