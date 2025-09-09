'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoLogoProps {
  src: string
  poster?: string
  className?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  playsInline?: boolean
  size?: 'small' | 'medium' | 'large' | 'hero'
  position?: 'center' | 'left' | 'right'
}

export function VideoLogo({ 
  src, 
  poster, 
  className = '', 
  autoplay = true,
  loop = true,
  muted = true,
  playsInline = true,
  size = 'medium',
  position = 'center'
}: VideoLogoProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    hero: 'w-96 h-96'
  }

  const positionClasses = {
    center: 'mx-auto',
    left: 'ml-0 mr-auto',
    right: 'ml-auto mr-0'
  }

  useEffect(() => {
    const video = videoRef.current
    if (video && autoplay) {
      // Ensure video plays when it comes into view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(console.error)
            } else {
              video.pause()
            }
          })
        },
        { threshold: 0.1 }
      )
      
      observer.observe(video)
      
      return () => observer.disconnect()
    }
  }, [autoplay])

  const handleLoadedData = () => {
    setIsLoaded(true)
  }

  const handleError = () => {
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`${sizeClasses[size]} ${positionClasses[position]} ${className} bg-gray-200 rounded-lg flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Video unavailable</span>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} ${positionClasses[position]} ${className} relative`}>
      <video
        ref={videoRef}
        className={`w-full h-full object-cover rounded-lg shadow-lg transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        poster={poster}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        onLoadedData={handleLoadedData}
        onError={handleError}
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        Your browser does not support the video tag.
      </video>
      
      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center animate-pulse">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  )
}


