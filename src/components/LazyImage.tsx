import React, { useState, useRef, useEffect } from 'react'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  fallback?: React.ReactNode
  placeholder?: string
  onLoad?: () => void
  onError?: () => void
}

export default function LazyImage({ 
  src, 
  alt, 
  className = '', 
  fallback, 
  placeholder, 
  onLoad, 
  onError 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  if (hasError && fallback) {
    return <div className={className}>{fallback}</div>
  }

  return (
    <div ref={imgRef} className={`relative ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}>
          {placeholder && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              {placeholder}
            </div>
          )}
        </div>
      )}
      
      {/* Actual Image */}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`transition-opacity duration-300 ${className} ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}
    </div>
  )
}