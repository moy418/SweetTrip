import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { HeroSection } from '@/components/hero-section'
import { TrustStrip } from '@/components/trust-strip'
import { VideoShowcase } from '@/components/video-showcase'
import { FeaturedProducts } from '@/components/featured-products'
import { CategoryGrid } from '@/components/category-grid'
import { Testimonials } from '@/components/testimonials'
import { Newsletter } from '@/components/newsletter'

export const metadata: Metadata = {
  title: 'Sweet Trip - Discover Candy from Around the World',
  description: 'Explore exotic flavors and unique treats from every corner of the globe. From Japanese Kit Kats to Korean snacks, embark on a sweet journey with Sweet Trip.',
  openGraph: {
    title: 'Sweet Trip - Discover Candy from Around the World',
    description: 'Explore exotic flavors and unique treats from every corner of the globe. From Japanese Kit Kats to Korean snacks, embark on a sweet journey with Sweet Trip.',
    images: [
      {
        url: '/sweet-trip-logo.png',
        width: 1200,
        height: 630,
        alt: 'Sweet Trip - International Candy Store',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Trust Strip */}
      <TrustStrip />
      
      {/* Video Showcase */}
      <VideoShowcase />
      
      {/* Featured Products */}
      <FeaturedProducts />
      
      {/* Category Grid */}
      <CategoryGrid />
      
      {/* Testimonials */}
      <Testimonials />
      
      {/* Newsletter */}
      <Newsletter />
    </div>
  )
}
