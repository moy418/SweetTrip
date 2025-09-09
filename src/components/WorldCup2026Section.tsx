import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Trophy, Star, TrendingUp } from 'lucide-react'

export default function WorldCup2026Section() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-700 to-pink-600 text-white relative overflow-hidden">
      {/* Optimized animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce delay-100 will-change-transform"></div>
        <div className="absolute top-40 right-32 w-16 h-16 bg-green-400/20 rounded-full animate-bounce delay-300 will-change-transform"></div>
        <div className="absolute bottom-32 left-32 w-24 h-24 bg-blue-400/20 rounded-full animate-bounce delay-500 will-change-transform"></div>
        <div className="absolute bottom-20 right-20 w-12 h-12 bg-red-400/20 rounded-full animate-bounce delay-700 will-change-transform"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-3 bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 mb-8">
            <div className="text-4xl animate-spin-slow will-change-transform">🏆</div>
            <div>
              <div className="font-black text-2xl">WORLD CUP 2026</div>
              <div className="text-white/80 text-sm">Sweet Victory Experience</div>
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            <span className="block">The Ultimate</span>
            <span className="block bg-gradient-to-r from-yellow-300 via-green-300 to-blue-300 bg-clip-text text-transparent animate-gradient-x">
              World Cup
            </span>
            <span className="block">Candy Experience</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed">
            Celebrate the world's greatest tournament with authentic candies from all 48 participating countries. 
            Make predictions, collect achievements, and taste victory like never before!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              to="/worldcup2026"
              className="group bg-gradient-to-r from-yellow-500 to-orange-600 text-gray-900 px-10 py-5 rounded-2xl font-black text-xl hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 flex items-center justify-center space-x-3 shadow-2xl hover:shadow-yellow-500/25 hover:scale-105 transform will-change-transform"
            >
              <div className="text-2xl group-hover:animate-bounce">🌍</div>
              <span>Start Your Journey</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/worldcup2026/countries"
              className="group bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-white/30 hover:border-white/50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-xl hover:shadow-white/25 hover:scale-105 transform will-change-transform"
            >
              <Globe className="h-6 w-6" />
              <span>48 Countries</span>
            </Link>
          </div>
        </div>

        {/* World Cup Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Link
            to="/worldcup2026/countries"
            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform will-change-transform"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform will-change-transform">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">48 Countries</h3>
              <p className="text-white/80 leading-relaxed">Discover authentic candies and cultural stories from every participating nation</p>
            </div>
          </Link>

          <Link
            to="/worldcup2026/predictions"
            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform will-change-transform"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform will-change-transform">
                <div className="text-3xl">🎯</div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Match Predictions</h3>
              <p className="text-white/80 leading-relaxed">Predict match outcomes and earn sweet candy rewards for correct guesses</p>
            </div>
          </Link>

          <Link
            to="/worldcup2026/leaderboard"
            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform will-change-transform"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform will-change-transform">
                <div className="text-3xl">🏆</div>
              </div>
              <h3 className="text-2xl font-bold mb-3">Leaderboard</h3>
              <p className="text-white/80 leading-relaxed">Compete with fellow candy lovers and climb the prediction rankings</p>
            </div>
          </Link>

          <Link
            to="/worldcup2026/my-collection"
            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105 transform will-change-transform"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform will-change-transform">
                <Star className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">My Collection</h3>
              <p className="text-white/80 leading-relaxed">Track your candy collection progress and unlock achievement badges</p>
            </div>
          </Link>
        </div>

        {/* Live Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-4xl font-black text-yellow-400 mb-2">48</div>
            <div className="text-white/80 font-medium">Countries</div>
          </div>
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-4xl font-black text-green-400 mb-2">104</div>
            <div className="text-white/80 font-medium">Matches</div>
          </div>
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-4xl font-black text-blue-400 mb-2">300+</div>
            <div className="text-white/80 font-medium">Candies</div>
          </div>
          <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
            <div className="text-4xl font-black text-pink-400 mb-2">∞</div>
            <div className="text-white/80 font-medium">Sweet Memories</div>
          </div>
        </div>
      </div>
    </section>
  )
}