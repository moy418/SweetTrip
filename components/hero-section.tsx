'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Globe } from 'lucide-react'
import { VideoLogo } from './video-logo'
import React, { useEffect, useRef } from 'react'

export function HeroSection() {
  const candiesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = candiesRef.current
    if (!container) return

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const TOTAL = isMobile ? 12 : 36 // más dulces en desktop, algo menos en móvil
    const candySrcs = [
      '/sweetland-logo.jpeg',
      '/sweetlogo.jpeg',
      '/sweet-trip-logo.png',
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
    <section className="relative bg-gradient-to-br from-pink-400 via-violet-500 to-indigo-700 text-white py-24 overflow-hidden">
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
      width={420}
      height={420}
          className="drop-shadow-2xl"
          priority
        />
      </div>

      {/* Video Logo - Floating Animation */}
      <div className="absolute top-1/4 right-10 opacity-20 z-0">
        <VideoLogo
          src="/sweet-trip-video-logo.mp4"
          poster="/sweet-trip-logo.png"
          size="large"
          className="animate-float"
        />
      </div>

      {/* Floating candies layer */}
  <div className="floating-candies absolute inset-0 pointer-events-none" ref={candiesRef} aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto md:mx-0 text-left">
          {/* Pill badge */}
          <div className="mb-6">
            <div className="inline-flex items-center gap-3 bg-white/10 text-white px-3 py-1 rounded-full text-sm">
              <Globe className="h-4 w-4" />
              <span className="font-medium">50+ Countries · 1,000+ Products</span>
            </div>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
          >
              <span className="block">Discover <span className="text-yellow-300">Candy</span></span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="block text-white/95 mt-1"
              >
                from Around the World
              </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl mb-8 text-white/85 max-w-3xl"
          >
            Explore exotic flavors and unique treats from every corner of the globe. 
            From Japanese Kit Kats to Korean snacks, embark on a sweet journey with Sweet Trip.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-start"
          >
            <Link
              href="/featured"
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-2xl hover:scale-105 transform transition-transform"
            >
              <span>Shop Featured</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 border border-white/20 text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-white/10 transition-all duration-300"
            >
              <Globe className="h-5 w-5" />
              <span>Explore Categories</span>
            </Link>
          </motion.div>
          {/* Trust badges */}
          <div className="mt-6 flex items-center gap-6 text-sm text-white/90">
            <div className="inline-flex items-center gap-2">
              <span className="w-3 h-3 bg-green-400 rounded-full" />
              <span>Free Shipping $50+</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-400 rounded-full" />
              <span>100% Authentic</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-300 rounded-full" />
              <span>4.8/5 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
