import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        {/* Sweet Trip Logo */}
        <div className="mb-8">
          <img 
            src="/sweetland-logo.jpeg" 
            alt="Sweet Trip" 
            className="h-20 w-auto mx-auto rounded-lg"
          />
        </div>
        
        {/* 404 Error */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Looks like this sweet treat has gone missing! The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>
        
        {/* Suggestions */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Looking for something sweet?
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/featured"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Featured Products
            </Link>
            <Link
              to="/category/japanese-snacks"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Japanese Snacks
            </Link>
            <Link
              to="/category/korean-treats"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Korean Treats
            </Link>
            <Link
              to="/new-arrivals"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}