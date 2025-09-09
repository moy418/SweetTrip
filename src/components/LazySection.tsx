import React, { useState, useRef, useEffect, ReactNode } from 'react'

interface LazySectionProps {
  children: ReactNode
  className?: string
  threshold?: number
  rootMargin?: string
  fallback?: ReactNode
}

export default function LazySection({ 
  children, 
  className = '', 
  threshold = 0.1, 
  rootMargin = '100px',
  fallback 
}: LazySectionProps) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {inView ? children : (fallback || <div className="min-h-screen bg-gray-50 animate-pulse" />)}
    </div>
  )
}