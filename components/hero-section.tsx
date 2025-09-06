'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Globe } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

export function HeroSection() {
  const candiesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = candiesRef.current
    if (!container) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
  const TOTAL = isMobile ? 20 : 60 // más dulces en desktop, algo menos en móvil
    const candySrcs = [
      '/sweetland-logo.jpeg',
      '/sweetlogo.jpeg',
      '/sweetlogo.jpeg',
      '/sweetland-logo.jpeg'
    ]

    // Clear existing (HMR)
    container.innerHTML = ''

    for (let i = 0; i < TOTAL; i++) {
      const img = document.createElement('img')
      img.src = candySrcs[i % candySrcs.length]
      img.className = 'floating-candy'
      const size = Math.round(24 + Math.random() * 56) // 24-80px
      img.style.width = `${size}px`
      img.style.left = `${Math.random() * 90}%`
      img.style.top = `${5 + Math.random() * 80}%`
      img.style.animationDuration = `${7 + Math.random() * 12}s`
      img.style.animationDelay = `${Math.random() * 6}s`
      img.style.opacity = `${0.55 + Math.random() * 0.45}`
      img.alt = 'sweet'
      img.setAttribute('aria-hidden', 'true')
      container.appendChild(img)
    }

    return () => {
      container.innerHTML = ''
    }
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 text-white py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle candy shapes */}
        <div className="absolute top-20 left-10 opacity-20">
          <div className="w-32 h-32 bg-white rounded-full animate-pulse" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <div className="w-24 h-24 bg-yellow-300 rounded-full animate-pulse" />
        </div>
        <div className="absolute top-1/2 left-1/4 opacity-10">
          <div className="w-16 h-16 bg-pink-300 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Logo Background */}
      <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 opacity-30 z-0">
        <Image
          src="/sweet-trip-logo.png"
          alt="Sweet Trip Logo"
          width={520}
          height={520}
          className="drop-shadow-2xl bg-transparent"
          style={{ backgroundColor: 'transparent' }}
          priority
        />
      </div>

  {/* Removed floating video - moved to its own section (VideoShowcase) below the hero */}

      {/* Floating candies layer */}
  <div className="floating-candies absolute inset-0 pointer-events-none" ref={candiesRef} aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          >
            Discover Candy from
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300"
            >
              Around the World
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto"
          >
            Explore exotic flavors and unique treats from every corner of the globe. 
            From Japanese Kit Kats to Korean snacks, embark on a sweet journey with Sweet Trip.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/featured"
              className="group bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <span>Shop Featured</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/categories"
              className="group border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              <Globe className="h-5 w-5" />
              <span>Explore Categories</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
