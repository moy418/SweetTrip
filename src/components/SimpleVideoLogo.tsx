import React, { useRef, useEffect, useState } from 'react'

interface SimpleVideoLogoProps {
  src: string
  poster?: string
  className?: string
  size?: 'small' | 'medium' | 'large' | 'hero'
  showBorder?: boolean
  showGlow?: boolean
}

export default function SimpleVideoLogo({ 
  src, 
  poster, 
  className = '',
  size = 'large',
  showBorder = true,
  showGlow = true
}: SimpleVideoLogoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-32 h-32',
    large: 'w-48 h-48',
    hero: 'w-64 h-64'
  }

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      // Try to play the video
      video.play().then(() => {
        setIsPlaying(true)
      }).catch((error) => {
        console.log('Video autoplay failed:', error)
      })
    }
  }, [])

  return (
    <div className={`${sizeClasses[size]} ${className} relative group`}>
      {/* Glow effect */}
      {showGlow && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
      )}
      
      {/* Border gradient */}
      {showBorder && (
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400 via-purple-500 to-blue-500 rounded-2xl p-1">
          <div className="w-full h-full bg-white rounded-xl"></div>
        </div>
      )}
      
      {/* Video container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-all duration-500 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } group-hover:scale-105`}
          poster={poster}
          muted
          loop
          playsInline
          controls={false}
          preload="metadata"
          onLoadedData={() => {
            setIsLoaded(true)
            console.log('Video data loaded')
          }}
          onError={(e) => {
            console.error('Video error:', e)
          }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Loading overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        {/* Play indicator */}
        {isPlaying && (
          <div className="absolute top-2 right-2 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        )}
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-2 w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
        <div className="absolute top-4 right-4 w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-3 left-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-500"></div>
        <div className="absolute bottom-2 right-2 w-1 h-1 bg-yellow-400 rounded-full animate-bounce delay-700"></div>
      </div>
    </div>
  )
}
