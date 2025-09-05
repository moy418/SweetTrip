/* Archivo archivado: components/hero-section.tsx (Next.js)
   Copia de seguridad creada antes de eliminar la versión Next.js del proyecto.
*/

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
    <section className="relative bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 text-white py-20 overflow-hidden">
      {/* ...original component content archived... */}
      <div className="floating-candies absolute inset-0 pointer-events-none" ref={candiesRef} aria-hidden="true" />
    </section>
  )
}
